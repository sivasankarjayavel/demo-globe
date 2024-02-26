import * as mercator from "../mercator";
import * as utils from "../utils/shared";
import { Billboard } from "./Billboard";
import { Extent } from "../Extent";
import { Geometry } from "./Geometry";
import { GeoObject } from "./GeoObject";
import { LonLat } from "../LonLat";
import { Label } from "./Label";
import { Vec3 } from "../math/Vec3";
import { PointCloud } from "./PointCloud";
import { Polyline } from "./Polyline";
import { Ray } from "./Ray";
import { Strip } from "./Strip";
/**
 * Entity instances aggregate multiple forms of visualization into a single high-level object.
 * They can be created manually and added to entity collection.
 *
 * @class
 * @param {Object} [options] - Entity options:
 * @param {string} [options.name] - A human-readable name to display to users. It does not have to be unique.
 * @param {Vec3|Array.<number>} [options.cartesian] - Spatial entities like billboard, label etc. cartesian position.
 * @param {LonLat} [options.lonlat] - Geodetic coordinates for an entities like billboard, label etc.
 * @param {boolean} [options.aground] - True for entities that have to be placed on the relief.
 * @param {boolean} [options.visibility] - Entity visibility.
 * @param {*} [options.billboard] - Billboard options(see {@link Billboard}).
 * @param {*} [options.label] - Label options(see {@link Label}).
 * @param {*} [options.polyline] - Polyline options(see {@link Polyline}).
 * @param {*} [options.ray] - Ray options(see {@link Ray}).
 * @param {*} [options.pointCloud] - Point cloud options(see {@link PointCloud}).
 * @param {*} [options.geometry] - Geometry options (see {@link Geometry}), available for vector layer only.
 * @param {*} [options.properties] - Entity custom properties.
 */
class Entity {
    constructor(options = {}) {
        options.properties = options.properties || {};
        this.__id = Entity.__counter__++;
        this.properties = options.properties || {};
        this.properties.name = this.properties.name != undefined ? this.properties.name : "";
        this.childrenNodes = [];
        this.parent = null;
        this._cartesian = utils.createVector3(options.cartesian);
        this._lonLat = utils.createLonLat(options.lonlat);
        this._lonLatMerc = new LonLat();
        this._altitude = options.altitude || 0.0;
        this._visibility = options.visibility != undefined ? options.visibility : true;
        this._entityCollection = null;
        this._entityCollectionIndex = -1;
        this._layer = null;
        this._layerIndex = -1;
        this._pickingColor = new Vec3(0, 0, 0);
        this._featureConstructorArray = {
            billboard: [Billboard, this.setBillboard],
            label: [Label, this.setLabel],
            polyline: [Polyline, this.setPolyline],
            pointCloud: [PointCloud, this.setPointCloud],
            geometry: [Geometry, this.setGeometry],
            geoObject: [GeoObject, this.setGeoObject],
            strip: [Strip, this.setStrip],
            ray: [Ray, this.setRay]
        };
        this.billboard = this._createOptionFeature("billboard", options.billboard);
        this.label = this._createOptionFeature("label", options.label);
        this.polyline = this._createOptionFeature("polyline", options.polyline);
        this.ray = this._createOptionFeature("ray", options.ray);
        this.pointCloud = this._createOptionFeature("pointCloud", options.pointCloud);
        this.geometry = this._createOptionFeature("geometry", options.geometry);
        this.geoObject = this._createOptionFeature("geoObject", options.geoObject);
        this.strip = this._createOptionFeature("strip", options.strip);
    }
    get id() {
        return this.__id;
    }
    isEqual(entity) {
        return this.__id === entity.__id;
    }
    get layerIndex() {
        return this._layerIndex;
    }
    get instanceName() {
        return "Entity";
    }
    _createOptionFeature(featureName, options) {
        if (options) {
            let c = this._featureConstructorArray[featureName];
            return c[1].call(this, new c[0](options));
        }
        return null;
    }
    getCollectionIndex() {
        return this._entityCollectionIndex;
    }
    /**
     * Adds current entity into the specified entity collection.
     * @public
     * @param {EntityCollection | Vector} collection - Specified entity collection or vector layer.
     * @param {Boolean} [rightNow=false] - Entity insertion option for vector layer.
     * @returns {Entity} - This object.
     */
    addTo(collection, rightNow = false) {
        collection.add(this, rightNow);
        return this;
    }
    /**
     * Removes current entity from collection and layer.
     * @public
     */
    remove() {
        this._layer && this._layer.removeEntity(this);
        this._entityCollection && this._entityCollection.removeEntity(this);
    }
    /**
     * Sets the entity visibility.
     * @public
     * @param {boolean} visibility - Entity visibility.
     */
    setVisibility(visibility) {
        this._visibility = visibility;
        // billboards
        this.billboard && this.billboard.setVisibility(visibility);
        // geoObject
        this.geoObject && this.geoObject.setVisibility(visibility);
        // labels
        this.label && this.label.setVisibility(visibility);
        // polyline
        this.polyline && this.polyline.setVisibility(visibility);
        // ray
        this.ray && this.ray.setVisibility(visibility);
        // geometry
        this.geometry && this.geometry.setVisibility(visibility);
        for (let i = 0; i < this.childrenNodes.length; i++) {
            this.childrenNodes[i].setVisibility(visibility);
        }
    }
    /**
     * Returns entity visibility.
     * @public
     * @returns {boolean} -
     */
    getVisibility() {
        return this._visibility;
    }
    /**
     * Sets entity cartesian position.
     * @public
     * @param {Vec3} cartesian - Cartesian position in 3d space.
     */
    setCartesian3v(cartesian) {
        this.setCartesian(cartesian.x, cartesian.y, cartesian.z);
    }
    /**
     * Sets entity cartesian position.
     * @public
     * @param {number} x - 3d space X - position.
     * @param {number} y - 3d space Y - position.
     * @param {number} z - 3d space Z - position.
     */
    setCartesian(x, y, z) {
        let p = this._cartesian;
        p.x = x || 0.0;
        p.y = y || 0.0;
        p.z = z || 0.0;
        // billboards
        this.billboard && this.billboard.setPosition3v(p);
        // geoObject
        this.geoObject && this.geoObject.setPosition3v(p);
        // labels
        this.label && this.label.setPosition3v(p);
        for (let i = 0; i < this.childrenNodes.length; i++) {
            this.childrenNodes[i].setCartesian(x, y, z);
        }
        let ec = this._entityCollection;
        if (ec && ec.renderNode && ec.renderNode.ellipsoid) {
            this._lonLat = ec.renderNode.ellipsoid.cartesianToLonLat(p);
            if (Math.abs(this._lonLat.lat) < mercator.MAX_LAT) {
                this._lonLatMerc = this._lonLat.forwardMercator();
            }
            else {
                this._lonLatMerc.lon = this._lonLatMerc.lat = this._lonLatMerc.height = 0;
            }
        }
        //ec && ec.events.dispatch(ec.events.entitymove, this);
    }
    /**
     * Sets entity cartesian position without event dispatching.
     * @public
     * @param {Vec3} cartesian - Cartesian position in 3d space.
     * @param {boolean} skipLonLat - skip geodetic calculation.
     */
    _setCartesian3vSilent(cartesian, skipLonLat = false) {
        let p = this._cartesian;
        p.x = cartesian.x || 0.0;
        p.y = cartesian.y || 0.0;
        p.z = cartesian.z || 0.0;
        // billboards
        this.billboard && this.billboard.setPosition3v(p);
        // geoObject
        this.geoObject && this.geoObject.setPosition3v(p);
        // labels
        this.label && this.label.setPosition3v(p);
        for (let i = 0; i < this.childrenNodes.length; i++) {
            this.childrenNodes[i].setCartesian(p.x, p.y, p.z);
        }
        let ec = this._entityCollection;
        if (!skipLonLat && ec && ec.renderNode && ec.renderNode.ellipsoid) {
            this._lonLat = ec.renderNode.ellipsoid.cartesianToLonLat(p);
            if (Math.abs(this._lonLat.lat) < mercator.MAX_LAT) {
                this._lonLatMerc = this._lonLat.forwardMercator();
            }
            else {
                //this._lonLatMerc = null;
            }
        }
    }
    /**
     * Gets entity geodetic coordinates.
     * @public
     * @returns {LonLat} -
     */
    getLonLat() {
        return this._lonLat.clone();
    }
    /**
     * Sets geodetic coordinates of the entity point object.
     * @public
     * @param {LonLat} lonlat - WGS84 coordinates.
     */
    setLonLat(lonlat) {
        let l = this._lonLat;
        l.lon = lonlat.lon;
        l.lat = lonlat.lat;
        l.height = lonlat.height;
        let ec = this._entityCollection;
        if (ec && ec.renderNode && ec.renderNode.ellipsoid) {
            if (Math.abs(l.lat) < mercator.MAX_LAT) {
                this._lonLatMerc = l.forwardMercator();
            }
            else {
                //this._lonLatMerc = null;
            }
            ec.renderNode.ellipsoid.lonLatToCartesianRes(l, this._cartesian);
            this.setCartesian3v(this._cartesian);
        }
    }
    /**
     * Sets geodetic coordinates of the entity point object.
     * @public
     * @param {number} lon - Longitude.
     * @param {number} lat - Latitude
     * @param {number} [height] - Height
     */
    setLonLat2(lon, lat, height) {
        let l = this._lonLat;
        l.lon = lon;
        l.lat = lat;
        l.height = height != undefined ? height : l.height;
        let ec = this._entityCollection;
        if (ec && ec.renderNode && ec.renderNode.ellipsoid) {
            if (Math.abs(l.lat) < mercator.MAX_LAT) {
                this._lonLatMerc = l.forwardMercator();
            }
            else {
                this._lonLatMerc.lon = this._lonLatMerc.lat = this._lonLatMerc.height = 0;
            }
            ec.renderNode.ellipsoid.lonLatToCartesianRes(l, this._cartesian);
            this.setCartesian3v(this._cartesian);
        }
    }
    /**
     * Sets entity altitude over the planet.
     * @public
     * @param {number} altitude - Altitude.
     */
    setAltitude(altitude) {
        this._altitude = altitude;
    }
    /**
     * Sets entity altitude over the planet.
     * @public
     * @return {number} Altitude.
     */
    getAltitude() {
        return this._altitude;
    }
    /**
     * Returns cartesian position.
     * @public
     * @returns {Vec3} -
     */
    getCartesian() {
        return this._cartesian.clone();
    }
    /**
     * Sets entity billboard.
     * @public
     * @param {Billboard} billboard - Billboard object.
     * @returns {Billboard} -
     */
    setBillboard(billboard) {
        if (this.billboard) {
            this.billboard.remove();
        }
        this.billboard = billboard;
        this.billboard._entity = this;
        this.billboard.setPosition3v(this._cartesian);
        this.billboard.setVisibility(this._visibility);
        this._entityCollection && this._entityCollection.billboardHandler.add(billboard);
        return billboard;
    }
    /**
     * Sets entity label.
     * @public
     * @param {Label} label - Text label.
     * @returns {Label} -
     */
    setLabel(label) {
        if (this.label) {
            this.label.remove();
        }
        this.label = label;
        this.label._entity = this;
        this.label.setPosition3v(this._cartesian);
        this.label.setVisibility(this._visibility);
        this._entityCollection && this._entityCollection.labelHandler.add(label);
        return label;
    }
    /**
     * Sets entity ray.
     * @public
     * @param {Ray} ray - Ray object.
     * @returns {Ray} -
     */
    setRay(ray) {
        if (this.ray) {
            this.ray.remove();
        }
        this.ray = ray;
        this.ray._entity = this;
        this.ray.setVisibility(this._visibility);
        this._entityCollection && this._entityCollection.rayHandler.add(ray);
        return ray;
    }
    /**
     * Sets entity polyline.
     * @public
     * @param {Polyline} polyline - Polyline object.
     * @returns {Polyline} -
     */
    setPolyline(polyline) {
        if (this.polyline) {
            this.polyline.remove();
        }
        this.polyline = polyline;
        this.polyline._entity = this;
        this.polyline.setVisibility(this._visibility);
        this._entityCollection && this._entityCollection.polylineHandler.add(polyline);
        return polyline;
    }
    /**
     * Sets entity pointCloud.
     * @public
     * @param {PointCloud} pointCloud - PointCloud object.
     * @returns {PointCloud} -
     */
    setPointCloud(pointCloud) {
        if (this.pointCloud) {
            this.pointCloud.remove();
        }
        this.pointCloud = pointCloud;
        this.pointCloud._entity = this;
        this.pointCloud.setVisibility(this._visibility);
        this._entityCollection && this._entityCollection.pointCloudHandler.add(pointCloud);
        return pointCloud;
    }
    /**
     * Sets entity geometry.
     * @public
     * @param {Geometry} geometry - Geometry object.
     * @returns {Geometry} -
     */
    setGeometry(geometry) {
        if (this.geometry) {
            this.geometry.remove();
        }
        this.geometry = geometry;
        this.geometry._entity = this;
        this.geometry.setVisibility(this._visibility);
        this._layer && this._layer.add(this);
        return geometry;
    }
    /**
     * Sets entity geoObject.
     * @public
     * @param {GeoObject} geoObject - GeoObject.
     * @returns {GeoObject} -
     */
    setGeoObject(geoObject) {
        if (this.geoObject) {
            this.geoObject.remove();
        }
        this.geoObject = geoObject;
        this.geoObject._entity = this;
        this.geoObject.setPosition3v(this._cartesian);
        this.geoObject.setVisibility(this._visibility);
        this._entityCollection && this._entityCollection.geoObjectHandler.add(geoObject);
        return geoObject;
    }
    /**
     * Sets entity strip.
     * @public
     * @param {Strip} strip - Strip object.
     * @returns {Strip} -
     */
    setStrip(strip) {
        if (this.strip) {
            this.strip.remove();
        }
        this.strip = strip;
        this.strip._entity = this;
        this.strip.setVisibility(this._visibility);
        this._entityCollection && this._entityCollection.stripHandler.add(strip);
        return strip;
    }
    get layer() {
        return this._layer;
    }
    get rendererEvents() {
        if (this._layer) {
            return this._layer.events;
        }
        else if (this._entityCollection) {
            return this._entityCollection.events;
        }
        return null;
    }
    /**
     * Append child entity.
     * @public
     * @param {Entity} entity - Child entity.
     */
    appendChild(entity) {
        entity._entityCollection = this._entityCollection;
        entity._pickingColor = this._pickingColor;
        entity.parent = this;
        this.childrenNodes.push(entity);
        this._entityCollection && this._entityCollection.appendChildEntity(entity);
    }
    /**
     * Appends entity items(billboard, label etc.) picking color.
     * @public
     */
    setPickingColor() {
        let c = this._pickingColor;
        this.billboard && this.billboard.setPickingColor3v(c);
        this.label && this.label.setPickingColor3v(c);
        this.polyline && this.polyline.setPickingColor3v(c);
        this.ray && this.ray.setPickingColor3v(c);
        this.strip && this.strip.setPickingColor3v(c);
        this.geoObject && this.geoObject.setPickingColor3v(c);
        for (let i = 0; i < this.childrenNodes.length; i++) {
            this.childrenNodes[i].setPickingColor();
        }
    }
    /**
     * Return geodetic extent.
     * @public
     * @returns {Extent} -
     */
    getExtent() {
        let res;
        let c = this._lonLat;
        if (this.billboard || this.label) {
            res = new Extent(new LonLat(c.lon, c.lat), new LonLat(c.lon, c.lat));
        }
        else {
            res = new Extent(new LonLat(180.0, 90.0), new LonLat(-180.0, -90.0));
        }
        let sw = res.southWest, ne = res.northEast;
        if (this.polyline) {
            let e = this.polyline.getExtent();
            if (e.southWest.lon < sw.lon)
                sw.lon = e.southWest.lon;
            if (e.southWest.lat < sw.lat)
                sw.lat = e.southWest.lat;
            if (e.northEast.lon > ne.lon)
                ne.lon = e.northEast.lon;
            if (e.northEast.lat > ne.lat)
                ne.lat = e.northEast.lat;
        }
        if (this.geometry) {
            let e = this.geometry.getExtent();
            if (e.southWest.lon < sw.lon)
                sw.lon = e.southWest.lon;
            if (e.southWest.lat < sw.lat)
                sw.lat = e.southWest.lat;
            if (e.northEast.lon > ne.lon)
                ne.lon = e.northEast.lon;
            if (e.northEast.lat > ne.lat)
                ne.lat = e.northEast.lat;
        }
        for (let i = 0; i < this.childrenNodes.length; i++) {
            let e = this.childrenNodes[i].getExtent();
            if (e.southWest.lon < sw.lon)
                sw.lon = e.southWest.lon;
            if (e.southWest.lat < sw.lat)
                sw.lat = e.southWest.lat;
            if (e.northEast.lon > ne.lon)
                ne.lon = e.northEast.lon;
            if (e.northEast.lat > ne.lat)
                ne.lat = e.northEast.lat;
        }
        return res;
    }
}
Entity.__counter__ = 0;
export { Entity };