import { Deferred } from '../../Deferred';
import { createEvents } from '../../Events';
import { Vec3 } from "../../math/Vec3";
const DEFAULT_WARNING_HEIGHT_LEVEL = 5;
const ELEVATIONPROFILE_EVENTS = ["startcollecting", "profilecollected", "clear"];
/**
 * Point types
 */
export const SAFE = 0;
export const WARNING = 1;
export const COLLISION = 2;
/**
 * drawData index names
 */
const TRACK = 0;
const GROUND = 1;
const SEGMMENT_LENGTH = 1.0; // Distance between query points on the ground
const GROUND_OFFSET = 1.0; // Ground level offset
const BOTTOM_PADDING = 0.1; // Range minY padding in percentage from the bottom
const TOP_PADDING = 0.2; // Range maxY padding in percentage from the top
const HEIGHT_EPS = 0.1; // Warning height level error
export class ElevationProfile {
    constructor(options = {}) {
        this.events = createEvents(ELEVATIONPROFILE_EVENTS);
        this.planet = options.planet || null;
        this._warningHeightLevel = DEFAULT_WARNING_HEIGHT_LEVEL;
        this._pointsReady = false;
        this._isWarning = false;
        this._minX = 0;
        this._planeDistance = this._maxX = 1000;
        this._minY = 0;
        this._maxY = 200;
        this._drawData = [[], []];
        this._promiseArr = [];
        this._promiseCounter = 0;
        this._pMaxY = 0;
        this._pMinY = 0;
        this._pDist = 0;
        this._pTrackCoords = [];
        this._pGroundCoords = [];
        this._pIndex = 0;
    }
    bindPlanet(planet) {
        this.planet = planet;
    }
    setWarningHeightLevel(warningHeight = 0) {
        this._warningHeightLevel = warningHeight;
    }
    setRange(minX, maxX, minY, maxY) {
        this._minX = minX;
        this._maxX = maxX;
        if (minY) {
            this._minY = minY;
        }
        if (maxY) {
            this._maxY = maxY;
        }
    }
    _getHeightAsync(ll, pIndex, promiseCounter) {
        let def = new Deferred();
        if (this.planet) {
            let msl = this.planet.terrain.geoid.getHeightLonLat(ll);
            this.planet.terrain.getHeightAsync(ll, (elv) => {
                if (this.planet && promiseCounter === this._promiseCounter) {
                    elv += msl;
                    this._pGroundCoords[pIndex][1] = elv;
                    this._pGroundCoords[pIndex][2] = SAFE;
                    this._pGroundCoords[pIndex][3] = ll.height;
                    if (elv > this._pMaxY)
                        this._pMaxY = elv;
                    if (elv < this._pMinY)
                        this._pMinY = elv;
                    this._updatePointType(pIndex);
                    def.resolve(elv);
                }
                else {
                    def.reject();
                }
            });
        }
        else {
            def.reject();
        }
        return def.promise;
    }
    _collectCoordsBetweenTwoTrackPoints(index, internalPoints, scaleFactor, p0, trackDir, promiseCounter) {
        if (!this.planet)
            return;
        for (let j = 1; j <= internalPoints; j++) {
            this._pDist += SEGMMENT_LENGTH;
            this._pIndex++;
            // Point on the track segment
            let dirSegLen = j * scaleFactor;
            let pjd = p0.add(trackDir.scaleTo(dirSegLen));
            let llx = this.planet.ellipsoid.cartesianToLonLat(pjd);
            this._pGroundCoords[this._pIndex] = [this._pDist, 0, SAFE, 0, index];
            ((lonlat, index) => {
                this._promiseArr.push(this._getHeightAsync(lonlat, index, promiseCounter));
            })(llx, this._pIndex);
        }
    }
    _collectAllPoints(pointsLonLat, promiseCounter) {
        if (!this.planet)
            return;
        if (promiseCounter !== this._promiseCounter)
            return;
        let p0 = new Vec3(), p1 = new Vec3();
        for (let i = 1, len = pointsLonLat.length; i < len; i++) {
            let lonlat0 = pointsLonLat[i - 1], lonlat1 = pointsLonLat[i];
            this.planet.ellipsoid.lonLatToCartesianRes(lonlat0, p0);
            this.planet.ellipsoid.lonLatToCartesianRes(lonlat1, p1);
            let trackDir = p1.sub(p0);
            let dirLength = trackDir.length();
            let n0 = this.planet.ellipsoid.getSurfaceNormal3v(p0);
            let proj = Vec3.proj_b_to_plane(trackDir, n0);
            let projLen = proj.length();
            let internalPoints = Math.floor(projLen / SEGMMENT_LENGTH);
            let scaleFactor = SEGMMENT_LENGTH * dirLength / projLen;
            this._getGroundElevation(lonlat0, i - 1, promiseCounter);
            proj.normalize();
            trackDir.normalize();
            // Getting internal point elevations and looking for the collisions
            this._collectCoordsBetweenTwoTrackPoints(i - 1, internalPoints, scaleFactor, p0, trackDir, promiseCounter);
            this._pDist += projLen - internalPoints * SEGMMENT_LENGTH;
            this._pIndex++;
            let elv = lonlat1.height;
            if (elv > this._pMaxY)
                this._pMaxY = elv;
            if (elv < this._pMinY)
                this._pMinY = elv;
            this._pTrackCoords[i] = [this._pDist, elv, this._pIndex];
        }
    }
    _getGroundElevation(lonLat, index, promiseCounter) {
        this._pGroundCoords[this._pIndex] = [this._pDist, 0, SAFE, 0, index];
        this._promiseArr.push(this._getHeightAsync(lonLat, this._pIndex, promiseCounter));
    }
    _calcPointsAsync(pointsLonLat, promiseCounter) {
        return new Promise((resolve, reject) => {
            this._pTrackCoords = [[0, pointsLonLat[0].height, 0]];
            this._pMaxY = pointsLonLat[0].height;
            this._pMinY = this._pMaxY;
            this._pDist = 0;
            this._pGroundCoords = [];
            this._pIndex = 0;
            this._promiseArr = [];
            this._collectAllPoints(pointsLonLat, promiseCounter);
            this._getGroundElevation(pointsLonLat[pointsLonLat.length - 1], pointsLonLat.length - 1, promiseCounter);
            Promise.all(this._promiseArr).then(() => {
                resolve({
                    dist: this._pDist,
                    minY: this._pMinY,
                    maxY: this._pMaxY,
                    trackCoords: this._pTrackCoords,
                    groundCoords: this._pGroundCoords
                });
            });
        });
    }
    get minX() {
        return this._minX;
    }
    get planeDistance() {
        return this._planeDistance;
    }
    get maxX() {
        return this._maxX;
    }
    get minY() {
        return this._minY;
    }
    get maxY() {
        return this._maxY;
    }
    get pointsReady() {
        return this._pointsReady;
    }
    get isWarningOrCollision() {
        return this._isWarning;
    }
    get drawData() {
        return this._drawData;
    }
    collectProfile(pointsLonLat) {
        let def = new Deferred();
        if (!this.planet)
            def.reject();
        this._pointsReady = false;
        this._isWarning = false;
        if (!pointsLonLat || !pointsLonLat.length)
            def.reject();
        this.events.dispatch(this.events.startcollecting, this);
        this._promiseCounter++;
        ((counter) => {
            this._calcPointsAsync(pointsLonLat, counter).then((p) => {
                if (counter === this._promiseCounter) {
                    this._planeDistance = p.dist;
                    this.setRange(0, p.dist, p.minY - BOTTOM_PADDING * Math.abs(p.minY), p.maxY + Math.abs(p.maxY) * TOP_PADDING);
                    this._pointsReady = true;
                    this._drawData = [p.trackCoords, p.groundCoords];
                    this.events.dispatch(this.events.profilecollected, this._drawData, this);
                    def.resolve(this._drawData);
                }
            });
        })(this._promiseCounter);
        return def.promise;
    }
    _updatePointType(pIndex) {
        if ((this._pGroundCoords[pIndex][3] >= this._pGroundCoords[pIndex][1]) &&
            (this._pGroundCoords[pIndex][3] < this._pGroundCoords[pIndex][1] + this._warningHeightLevel - HEIGHT_EPS)) {
            this._pGroundCoords[pIndex][2] = WARNING;
        }
        if (this._pGroundCoords[pIndex][3] <= this._pGroundCoords[pIndex][1] + GROUND_OFFSET) {
            this._pGroundCoords[pIndex][2] = COLLISION;
        }
        if (this._pGroundCoords[pIndex][2] === WARNING || this._pGroundCoords[pIndex][2] === COLLISION) {
            this._isWarning = true;
        }
    }
    /**
     * @deprecated
     */
    _setPointsType() {
        this._isWarning = false;
        this._pTrackCoords = this._drawData[TRACK];
        this._pGroundCoords = this._drawData[GROUND];
        for (let i = 0; i < this._pGroundCoords.length; i++) {
            this._updatePointType(i);
        }
        this._drawData[GROUND] = this._pGroundCoords;
        this.events.dispatch(this.events.profilecollected, this._drawData, this);
    }
    clear() {
        this._promiseCounter = 0;
        this._pointsReady = false;
        this._isWarning = false;
        this._drawData = [[], []];
        this._pMaxY = 0;
        this._pMinY = 0;
        this._pDist = 0;
        this._pTrackCoords = [];
        this._pGroundCoords = [];
        this._pIndex = 0;
        this.events.dispatch(this.events.clear, this._drawData, this);
    }
}
