import * as mercator from "../mercator";
import { createEvents } from "../Events";
import { createExtent, stringTemplate } from "../utils/shared";
import { EPSG3857 } from "../proj/EPSG3857";
import { EmptyTerrain } from "./EmptyTerrain";
import { Extent } from "../Extent";
import { Layer } from "../layer/Layer";
import { Loader } from "../utils/Loader";
import { LonLat } from "../LonLat";
import { NOTRENDERING } from "../quadTree/quadTree";
// import { QueueArray } from '../QueueArray';
import { Ray } from "../math/Ray";
import { Vec3 } from "../math/Vec3";
/**
 * Class that loads segment elevation data, converts it to the array and passes it to the planet segment.
 * @class
 * @extends {GlobusTerrain}
 * @param {string} [name=""] - Terrain provider name.
 * @param {IGlobusTerrainParams} [options] - Provider options:
 * @param {number} [options.minZoom=3] - Minimal visible zoom index when terrain handler works.
 * @param {number} [options.minZoom=14] - Maximal visible zoom index when terrain handler works.
 * @param {number} [options.minNativeZoom=14] - Maximal available terrain zoom level.
 * @param {string} [options.url="//openglobus.org/heights/srtm3/{z}/{y}/{x}.ddm"] - Terrain source path url template. Default is openglobus ddm elevation file.
 * @param {Array.<number>} [options.gridSizeByZoom] - Array of segment triangulation grid sizes where array index agreed to the segment zoom index.
 * @param {number} [options.plainGridSize=32] - Elevation grid size. Default is 32x32. Must be power of two.
 * @param {string} [options.responseType="arraybuffer"] - Response type.
 * @param {number} [options.MAX_LOADING_TILES] - Maximum at one time loading tiles.
 * @param {Array.<number>} [gridSizeByZoom] - Array of values, where each value corresponds to the size of a tile(or segment) on the globe. Each value must be power of two.
 * @param {number} [heightFactor=1] - Elevation height multiplier.
 *
 * @fires GlobusTerrainEvents#load
 * @fires GlobusTerrainEvents#loadend
 */
class GlobusTerrain extends EmptyTerrain {
    constructor(name = "", options = {}) {
        super({
            geoidSrc: "https://openglobus.org/geoid/egm84-30.pgm",
            maxNativeZoom: options.maxNativeZoom || 14,
            ...options
        });
        this._s = options.subdomains || ["a", "b", "c"];
        this.events = createEvents(GLOBUSTERRAIN_EVENTS, this);
        this._requestCount = 0;
        this._requestsPeerSubdomain = 4;
        this.isEmpty = false;
        this.equalizeNormals = true;
        this.name = name || "openglobus";
        this.url = options.url || "https://{s}.srtm3.openglobus.org/{z}/{y}/{x}.ddm";
        this.gridSizeByZoom = options.gridSizeByZoom || [
            64, 32, 32, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 32, 32, 16, 8, 4, 2, 2, 2, 2, 2, 2
        ];
        this._heightFactor = options.heightFactor != undefined ? options.heightFactor : 1.0;
        this.noDataValues = options.noDataValues || [];
        for (let i = 0; i < this.noDataValues.length; i++) {
            this.noDataValues[i] *= this._heightFactor;
        }
        this.plainGridSize = options.plainGridSize || 32;
        this._extent = createExtent(options.extent, new Extent(new LonLat(-180.0, -90.0), new LonLat(180.0, 90.0)));
        this._dataType = "arrayBuffer";
        this._maxNodeZoom = this.gridSizeByZoom.length - 1;
        this._elevationCache = {};
        this._fetchCache = {};
        this._loader = new Loader();
        this._urlRewriteCallback = options.urlRewrite || null;
    }
    get loader() {
        return this._loader;
    }
    clearCache() {
        for (let c in this._elevationCache) {
            this._elevationCache[c].heights = null;
            this._elevationCache[c].extent = null;
            delete this._elevationCache[c];
        }
        //@ts-ignore
        this._elevationCache = null;
        this._elevationCache = {};
        for (let c in this._fetchCache) {
            //@ts-ignore
            this._fetchCache[c] = null;
            delete this._fetchCache[c];
        }
        //@ts-ignore
        this._fetchCache = null;
        this._fetchCache = {};
    }
    isBlur(segment) {
        return segment.tileZoom >= 6;
    }
    getHeightAsync(lonLat, callback, zoom, firstAttempt) {
        if (!lonLat || lonLat.lat > mercator.MAX_LAT || lonLat.lat < mercator.MIN_LAT) {
            callback(0);
            return true;
        }
        firstAttempt = firstAttempt != undefined ? firstAttempt : true;
        let z = zoom || this.maxZoom, z2 = Math.pow(2, z), size = mercator.POLE2 / z2, merc = mercator.forward(lonLat), x = Math.floor((mercator.POLE + merc.lon) / size), y = Math.floor((mercator.POLE - merc.lat) / size);
        let tileIndex = Layer.getTileIndex(x, y, z);
        let cache = this._elevationCache[tileIndex];
        if (cache) {
            if (cache.heights) {
                callback(this._getGroundHeightMerc(merc, cache));
            }
            else {
                callback(0);
            }
            return true;
        }
        else {
            if (!this._fetchCache[tileIndex]) {
                let url = this._buildURL(x, y, z);
                this._fetchCache[tileIndex] = this._loader.fetch({
                    src: url,
                    type: this._dataType
                });
            }
            this._fetchCache[tileIndex].then((response) => {
                let extent = mercator.getTileExtent(x, y, z);
                if (response.status === "ready") {
                    let cache = {
                        heights: this._createHeights(response.data, tileIndex, x, y, z, extent),
                        extent: extent
                    };
                    this._elevationCache[tileIndex] = cache;
                    callback(this._getGroundHeightMerc(merc, cache));
                }
                else if (response.status === "error") {
                    if (firstAttempt && z > this.maxNativeZoom) {
                        firstAttempt = false;
                        this.getHeightAsync(lonLat, callback, this.maxNativeZoom, false);
                        return;
                    }
                    this._elevationCache[tileIndex] = {
                        heights: null,
                        extent: extent
                    };
                    callback(0);
                }
                else {
                    // @ts-ignore
                    this._fetchCache[tileIndex] = null;
                    delete this._fetchCache[tileIndex];
                }
            });
        }
        return false;
    }
    getTileCache(lonLat, z) {
        if (!lonLat || lonLat.lat > mercator.MAX_LAT || lonLat.lat < mercator.MIN_LAT) {
            return;
        }
        let z2 = Math.pow(2, z), size = mercator.POLE2 / z2, merc = mercator.forward(lonLat), x = Math.floor((mercator.POLE + merc.lon) / size), y = Math.floor((mercator.POLE - merc.lat) / size);
        let tileIndex = Layer.getTileIndex(x, y, z);
        return this._elevationCache[tileIndex];
    }
    _getGroundHeightMerc(merc, tileData) {
        if (!(tileData.extent && tileData.heights)) {
            return 0;
        }
        let w = tileData.extent.getWidth(), gs = Math.sqrt(tileData.heights.length);
        let size = w / (gs - 1);
        /*
        v2-----------v3
        |            |
        |            |
        |            |
        v0-----------v1
        */
        let i = gs - Math.ceil((merc.lat - tileData.extent.southWest.lat) / size) - 1, j = Math.floor((merc.lon - tileData.extent.southWest.lon) / size);
        let v0Ind = (i + 1) * gs + j, v1Ind = v0Ind + 1, v2Ind = i * gs + j, v3Ind = v2Ind + 1;
        let h0 = tileData.heights[v0Ind], h1 = tileData.heights[v1Ind], h2 = tileData.heights[v2Ind], h3 = tileData.heights[v3Ind];
        let v0 = new Vec3(tileData.extent.southWest.lon + size * j, h0, tileData.extent.northEast.lat - size * i - size), v1 = new Vec3(v0.x + size, h1, v0.z), v2 = new Vec3(v0.x, h2, v0.z + size), v3 = new Vec3(v0.x + size, h3, v0.z + size);
        let xyz = new Vec3(merc.lon, 100000.0, merc.lat), ray = new Ray(xyz, new Vec3(0, -1, 0));
        let res = new Vec3();
        let d = ray.hitTriangle(v0, v1, v2, res);
        if (d === Ray.INSIDE) {
            return res.y;
        }
        d = ray.hitTriangle(v1, v3, v2, res);
        if (d === Ray.INSIDE) {
            return res.y;
        }
        return 0;
    }
    /**
     * Stop loading.
     * @public
     */
    abortLoading() {
        this._loader.abortAll();
    }
    /**
     * Sets terrain data url template.
     * @public
     * @param {string} url - Url template.
     * @example <caption>Default openglobus url template:</caption>:
     * "http://earth3.openglobus.org/{z}/{y}/{x}.ddm"
     */
    setUrl(url) {
        this.url = url;
    }
    /**
     * Sets provider name.
     * @public
     * @param {string} name - Name.
     */
    setName(name) {
        this.name = name;
    }
    isReadyToLoad(segment) {
        return segment._projection.equal(EPSG3857) && this._extent.overlaps(segment.getExtentLonLat());
    }
    /**
     * Starts to load segment elevation data.
     * @public
     * @param {Segment} segment - Segment that wants a terrain data.
     * @param {boolean} [forceLoading] -
     */
    loadTerrain(segment, forceLoading = false) {
        if (this._planet.terrainLock.isFree()) {
            segment.terrainReady = false;
            segment.terrainIsLoading = true;
            if (this.isReadyToLoad(segment)) {
                let cache = this._elevationCache[segment.tileIndex];
                if (cache) {
                    this._applyElevationsData(segment, cache.heights);
                }
                else {
                    this._loader.load({
                        sender: this,
                        src: this._getHTTPRequestString(segment),
                        segment: segment,
                        type: this._dataType,
                        filter: () => (segment.plainReady && segment.node.getState() !== NOTRENDERING) || forceLoading
                    }, (response) => {
                        if (response.status === "ready") {
                            let heights = this._createHeights(response.data, segment.tileIndex, segment.tileX, segment.tileY, segment.tileZoom, segment.getExtent(), segment.tileZoom === this.maxZoom);
                            this._elevationCache[segment.tileIndex] = {
                                heights: heights,
                                extent: segment.getExtent()
                            };
                            this._applyElevationsData(segment, heights);
                        }
                        else if (response.status === "abort") {
                            segment.terrainIsLoading = false;
                        }
                        else if (response.status === "error") {
                            this._applyElevationsData(segment, null);
                        }
                        else {
                            segment.terrainIsLoading = false;
                        }
                    });
                }
            }
            else {
                segment.elevationsNotExists();
            }
        }
        else {
            segment.terrainIsLoading = false;
        }
    }
    _getSubdomain() {
        this._requestCount++;
        return this._s[Math.floor(this._requestCount % (this._requestsPeerSubdomain * this._s.length) / this._requestsPeerSubdomain)];
    }
    _buildURL(x, y, z) {
        return stringTemplate(this.url, {
            s: this._getSubdomain(),
            x: x.toString(),
            y: y.toString(),
            z: z.toString()
        });
    }
    /**
     * Creates default query url string.
     * @protected
     * @param {Segment} segment -
     * @returns {string} -
     */
    _createUrl(segment) {
        return this._buildURL(segment.tileX, segment.tileY, segment.tileZoom);
    }
    /**
     * Returns actual url query string.
     * @protected
     * @param {Segment} segment - Segment that loads image data.
     * @returns {string} - Url string.
     */
    _getHTTPRequestString(segment) {
        return this._urlRewriteCallback ? this._urlRewriteCallback(segment, this.url) : this._createUrl(segment);
    }
    /**
     * Sets url rewrite callback, used for custom url rewriting for every tile loading.
     * @public
     * @param {UrlRewriteFunc} ur - The callback that returns tile custom created url.
     */
    setUrlRewriteCallback(ur) {
        this._urlRewriteCallback = ur;
    }
    /**
     * Converts loaded data to segment elevation data type(column major elevation data array in meters)
     * @public
     * @returns {Array.<number>} -
     */
    _createHeights(data, tileIndex, x, y, z, extent, isMaxZoom) {
        if (this._heightFactor !== 1) {
            let res = new Float32Array(data);
            for (let i = 0, len = res.length; i < len; i++) {
                res[i] = res[i] * this._heightFactor;
            }
            return res;
        }
        return new Float32Array(data);
    }
    /**
     * @protected
     */
    _applyElevationsData(segment, elevations) {
        if (segment) {
            let e = this.events.load;
            if (e.handlers.length) {
                this.events.dispatch(e, {
                    elevations: elevations,
                    segment: segment
                });
            }
            segment.applyTerrain(elevations);
        }
    }
}
const GLOBUSTERRAIN_EVENTS = [
    /**
     * Triggered when current elevation tile has loaded but before rendering.
     * @event og.terrain.GlobusTerrain#load
     */
    "load",
    /**
     * Triggered when all elevation tiles have loaded or loading has stopped.
     * @event og.terrain.GlobusTerrain#loadend
     */
    "loadend"
];
export { GlobusTerrain };
