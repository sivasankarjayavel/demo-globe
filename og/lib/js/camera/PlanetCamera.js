import * as mercator from "../mercator";
import * as math from "../math";
import { Camera } from "./Camera";
import { Key } from "../Lock";
import { LonLat } from "../LonLat";
import { Mat4 } from "../math/Mat4";
import { Quat } from "../math/Quat";
import { Ray } from "../math/Ray";
import { Vec3 } from "../math/Vec3";
/**
 * Planet camera.
 * @class
 * @extends {Camera}
 * @param {Planet} planet - Planet render node.
 * @param {IPlanetCameraParams} [options] - Planet camera options:
 * @param {string} [options.name] - Camera name.
 * @param {number} [options.viewAngle] - Camera angle of view.
 * @param {number} [options.near] - Camera near plane distance. Default is 1.0
 * @param {number} [options.far] - Camera far plane distance. Default is og.math.MAX
 * @param {number} [options.minAltitude] - Minimal altitude for the camera. Default is 5
 * @param {number} [options.maxAltitude] - Maximal altitude for the camera. Default is 20000000
 * @param {Vec3} [options.eye] - Camera eye position. Default (0,0,0)
 * @param {Vec3} [options.look] - Camera look position. Default (0,0,0)
 * @param {Vec3} [options.up] - Camera eye position. Default (0,1,0)
 */
class PlanetCamera extends Camera {
    constructor(planet, options = {}) {
        super(planet.renderer, {
            ...options,
            frustums: options.frustums || [[1, 100 + 0.075], [100, 1000 + 0.075], [1000, 1e6 + 10000], [1e6, 1e9]],
        });
        this.planet = planet;
        this.minAltitude = options.minAltitude || 1;
        this.maxAltitude = options.maxAltitude || 20000000;
        this._lonLat = this.planet.ellipsoid.cartesianToLonLat(this.eye);
        this._lonLatMerc = this._lonLat.forwardMercator();
        this._terrainAltitude = this._lonLat.height;
        this._terrainPoint = new Vec3();
        this._insideSegment = null;
        this.slope = 0;
        this._keyLock = new Key();
        this._framesArr = [];
        this._framesCounter = 0;
        this._numFrames = 50;
        this._completeCallback = null;
        this._frameCallback = null;
        this._flying = false;
        this._checkTerrainCollision = true;
        this.eyeNorm = this.eye.getNormal();
    }
    setTerrainCollisionActivity(isActive) {
        this._checkTerrainCollision = isActive;
    }
    /**
     * Updates camera view space.
     * @public
     * @virtual
     */
    update() {
        this.events.stopPropagation();
        let maxAlt = this.maxAltitude + this.planet.ellipsoid.getEquatorialSize();
        if (this.eye.length() > maxAlt) {
            this.eye.copy(this.eye.getNormal().scale(maxAlt));
        }
        super.update();
        this.updateGeodeticPosition();
        this.eyeNorm = this.eye.getNormal();
        this.slope = this._b.dot(this.eyeNorm);
        this.events.dispatch(this.events.viewchange, this);
    }
    updateGeodeticPosition() {
        this.planet.ellipsoid.cartesianToLonLatRes(this.eye, this._lonLat);
        if (Math.abs(this._lonLat.lat) <= mercator.MAX_LAT) {
            LonLat.forwardMercatorRes(this._lonLat, this._lonLatMerc);
        }
    }
    /**
     * Sets altitude over the terrain.
     * @public
     * @param {number} alt - Altitude over the terrain.
     */
    setAltitude(alt) {
        let t = this._terrainPoint;
        let n = this.planet.ellipsoid.getSurfaceNormal3v(this.eye);
        this.eye.x = n.x * alt + t.x;
        this.eye.y = n.y * alt + t.y;
        this.eye.z = n.z * alt + t.z;
        this._terrainAltitude = alt;
    }
    /**
     * Gets altitude over the terrain.
     * @public
     */
    getAltitude() {
        return this._terrainAltitude;
    }
    /**
     * Places camera to view to the geographical point.
     * @public
     * @param {LonLat} lonlat - New camera and camera view position.
     * @param {LonLat} [lookLonLat] - Look up coordinates.
     * @param {Vec3} [up] - Camera UP vector. Default (0,1,0)
     */
    setLonLat(lonlat, lookLonLat, up) {
        this.stopFlying();
        this._lonLat.set(lonlat.lon, lonlat.lat, lonlat.height || this._lonLat.height);
        let el = this.planet.ellipsoid;
        let newEye = el.lonLatToCartesian(this._lonLat);
        let newLook = lookLonLat ? el.lonLatToCartesian(lookLonLat) : Vec3.ZERO;
        this.set(newEye, newLook, up || Vec3.NORTH);
        this.update();
    }
    /**
     * Returns camera geographical position.
     * @public
     * @returns {LonLat}
     */
    getLonLat() {
        return this._lonLat;
    }
    /**
     * Returns camera height.
     * @public
     * @returns {number}
     */
    getHeight() {
        return this._lonLat.height;
    }
    /**
     * Gets position by viewable extent.
     * @public
     * @param {Extent} extent - Viewable extent.
     * @param {Number} height - Camera height
     * @returns {Vec3}
     */
    getExtentPosition(extent, height) {
        height = height || 0;
        let north = extent.getNorth();
        let south = extent.getSouth();
        let east = extent.getEast();
        let west = extent.getWest();
        if (west > east) {
            east += 360;
        }
        let e = this.planet.ellipsoid;
        let cart = new LonLat(east, north);
        let northEast = e.lonLatToCartesian(cart);
        cart.lat = south;
        let southEast = e.lonLatToCartesian(cart);
        cart.lon = west;
        let southWest = e.lonLatToCartesian(cart);
        cart.lat = north;
        let northWest = e.lonLatToCartesian(cart);
        let center = Vec3.sub(northEast, southWest).scale(0.5).addA(southWest);
        let mag = center.length();
        if (mag < 0.000001) {
            cart.lon = (east + west) * 0.5;
            cart.lat = (north + south) * 0.5;
            center = e.lonLatToCartesian(cart);
        }
        northWest.subA(center);
        southEast.subA(center);
        northEast.subA(center);
        southWest.subA(center);
        let direction = center.getNormal(); // ellipsoid.getSurfaceNormal(center).negate().normalize();
        let right = direction.cross(Vec3.NORTH).normalize();
        let up = right.cross(direction).normalize();
        let _h = Math.max(Math.abs(up.dot(northWest)), Math.abs(up.dot(southEast)), Math.abs(up.dot(northEast)), Math.abs(up.dot(southWest)));
        let _w = Math.max(Math.abs(right.dot(northWest)), Math.abs(right.dot(southEast)), Math.abs(right.dot(northEast)), Math.abs(right.dot(southWest)));
        let tanPhi = Math.tan(this._viewAngle * math.RADIANS * 0.5);
        let tanTheta = this._aspect * tanPhi;
        let d = Math.max(_w / tanTheta, _h / tanPhi);
        center.normalize();
        center.scale(mag + d + height);
        return center;
    }
    /**
     * View current extent.
     * @public
     * @param {Extent} extent - Current extent.
     * @param {number} [height]
     */
    viewExtent(extent, height) {
        this.stopFlying();
        this.set(this.getExtentPosition(extent, height), Vec3.ZERO, Vec3.NORTH);
        this.update();
    }
    /**
     * Flies to the current extent.
     * @public
     * @param {Extent} extent - Current extent.
     * @param {number} [height] - Destination height.
     * @param {Vec3} [up] - Camera UP in the end of flying. Default - (0,1,0)
     * @param {Number} [ampl] - Altitude amplitude factor.
     * @param {Function} [completeCallback] - Callback that calls after flying when flying is finished.
     * @param {Function} [startCallback] - Callback that calls before the flying begins.
     * @param {Function} [frameCallback] - Each frame callback
     */
    flyExtent(extent, height, up, ampl, completeCallback, startCallback, frameCallback) {
        this.flyCartesian(this.getExtentPosition(extent, height), Vec3.ZERO, up, ampl == null ? 1 : ampl, completeCallback, startCallback, frameCallback);
    }
    viewDistance(cartesian, distance = 10000.0) {
        let p0 = this.eye.add(this.getForward().scaleTo(distance));
        let _rot = Quat.getRotationBetweenVectors(p0.getNormal(), cartesian.getNormal());
        if (_rot.isZero()) {
            let newPos = cartesian.add(this.getBackward().scaleTo(distance));
            this.set(newPos, cartesian);
        }
        else {
            let newPos = cartesian.add(_rot.mulVec3(this.getBackward()).scale(distance)), newUp = _rot.mulVec3(this.getUp());
            this.set(newPos, cartesian, newUp);
        }
        this.update();
    }
    flyDistance(cartesian, distance = 10000.0, ampl = 0.0, completeCallback, startCallback, frameCallback) {
        let p0 = this.eye.add(this.getForward().scaleTo(distance));
        let _rot = Quat.getRotationBetweenVectors(p0.getNormal(), cartesian.getNormal());
        if (_rot.isZero()) {
            let newPos = cartesian.add(this.getBackward().scaleTo(distance));
            this.set(newPos, cartesian);
        }
        else {
            let newPos = cartesian.add(_rot.mulVec3(this.getBackward()).scale(distance)), newUp = _rot.mulVec3(this.getUp());
            this.flyCartesian(newPos, cartesian, newUp, ampl, completeCallback, startCallback, frameCallback);
        }
    }
    /**
     * Flies to the cartesian coordinates.
     * @public
     * @param {Vec3} cartesian - Finish cartesian coordinates.
     * @param {Vec3} [look] - Camera LOOK in the end of flying. Default - (0,0,0)
     * @param {Vec3} [up] - Camera UP vector in the end of flying. Default - (0,1,0)
     * @param {Number} [ampl=1.0] - Altitude amplitude factor.
     * @param {Function} [completeCallback] - Callback that calls after flying when flying is finished.
     * @param {Function} [startCallback] - Callback that calls before the flying begins.
     * @param {Function} [frameCallback] - Each frame callback
     */
    flyCartesian(cartesian, look = Vec3.ZERO, up = Vec3.NORTH, ampl = 1.0, completeCallback = () => {
    }, startCallback = () => {
    }, frameCallback = () => {
    }) {
        this.stopFlying();
        look = look || Vec3.ZERO;
        up = up || Vec3.NORTH;
        this._completeCallback = completeCallback;
        this._frameCallback = frameCallback;
        if (startCallback) {
            startCallback.call(this);
        }
        if (look instanceof LonLat) {
            look = this.planet.ellipsoid.lonLatToCartesian(look);
        }
        let ground_a = this.planet.ellipsoid.lonLatToCartesian(new LonLat(this._lonLat.lon, this._lonLat.lat));
        let v_a = this._u, n_a = this._b;
        let lonlat_b = this.planet.ellipsoid.cartesianToLonLat(cartesian);
        let up_b = up;
        let ground_b = this.planet.ellipsoid.lonLatToCartesian(new LonLat(lonlat_b.lon, lonlat_b.lat, 0));
        let n_b = Vec3.sub(cartesian, look);
        let u_b = up_b.cross(n_b);
        n_b.normalize();
        u_b.normalize();
        let v_b = n_b.cross(u_b);
        let an = ground_a.getNormal();
        let bn = ground_b.getNormal();
        let anbn = 1.0 - an.dot(bn);
        let hM_a = ampl * math.SQRT_HALF * Math.sqrt(anbn > 0.0 ? anbn : 0.0);
        let maxHeight = 6639613;
        let currMaxHeight = Math.max(this._lonLat.height, lonlat_b.height);
        if (currMaxHeight > maxHeight) {
            maxHeight = currMaxHeight;
        }
        let max_h = currMaxHeight + 2.5 * hM_a * (maxHeight - currMaxHeight);
        let zero = Vec3.ZERO;
        // camera path and orientations calculation
        for (let i = 0; i <= this._numFrames; i++) {
            let d = 1 - i / this._numFrames;
            d = d * d * (3 - 2 * d);
            d *= d;
            let g_i = ground_a.smerp(ground_b, d).normalize();
            let ground_i = this.planet.getRayIntersectionEllipsoid(new Ray(zero, g_i));
            let t = 1 - d;
            let height_i = this._lonLat.height * d * d * d +
                max_h * 3 * d * d * t +
                max_h * 3 * d * t * t +
                lonlat_b.height * t * t * t;
            let eye_i = ground_i.addA(g_i.scale(height_i));
            let up_i = v_a.smerp(v_b, d);
            let look_i = Vec3.add(eye_i, n_a.smerp(n_b, d).negateTo());
            let n = new Vec3(eye_i.x - look_i.x, eye_i.y - look_i.y, eye_i.z - look_i.z);
            let u = up_i.cross(n);
            n.normalize();
            u.normalize();
            let v = n.cross(u);
            this._framesArr[i] = {
                eye: eye_i,
                n: n,
                u: u,
                v: v
            };
        }
        this._framesCounter = this._numFrames;
        this._flying = true;
    }
    /**
     * Flies to the geo coordinates.
     * @public
     * @param {LonLat} lonlat - Finish coordinates.
     * @param {Vec3 | LonLat} [look] - Camera LOOK in the end of flying. Default - (0,0,0)
     * @param {Vec3} [up] - Camera UP vector in the end of flying. Default - (0,1,0)
     * @param {number} [ampl] - Altitude amplitude factor.
     * @param {Function} [completeCallback] - Callback that calls after flying when flying is finished.
     * @param {Function} [startCallback] - Callback that calls befor the flying begins.
     * @param {Function} [frameCallback] - each frame callback
     */
    flyLonLat(lonlat, look, up, ampl, completeCallback, startCallback, frameCallbak) {
        let _lonLat = new LonLat(lonlat.lon, lonlat.lat, lonlat.height || this._lonLat.height);
        this.flyCartesian(this.planet.ellipsoid.lonLatToCartesian(_lonLat), look, up, ampl, completeCallback, startCallback, frameCallbak);
    }
    /**
     * Breaks the flight.
     * @public
     */
    stopFlying() {
        this.planet.layerLock.free(this._keyLock);
        this.planet.terrainLock.free(this._keyLock);
        this.planet.normalMapCreator.free(this._keyLock);
        this._flying = false;
        this._framesArr.length = 0;
        this._framesArr = [];
        this._framesCounter = -1;
        this._frameCallback = null;
    }
    /**
     * Returns camera is flying.
     * @public
     * @returns {boolean}
     */
    isFlying() {
        return this._flying;
    }
    /**
     * Rotates around planet to the left.
     * @public
     * @param {number} angle - Rotation angle.
     * @param {boolean} [spin] - If its true rotates around globe spin.
     */
    rotateLeft(angle, spin) {
        this.rotateHorizontal(angle * math.RADIANS, spin !== true, Vec3.ZERO);
        this.update();
    }
    /**
     * Rotates around planet to the right.
     * @public
     * @param {number} angle - Rotation angle.
     * @param {boolean} [spin] - If its true rotates around globe spin.
     */
    rotateRight(angle, spin) {
        this.rotateHorizontal(-angle * math.RADIANS, spin !== true, Vec3.ZERO);
        this.update();
    }
    /**
     * Rotates around planet to the North Pole.
     * @public
     * @param {number} angle - Rotation angle.
     */
    rotateUp(angle) {
        this.rotateVertical(angle * math.RADIANS, Vec3.ZERO);
        this.update();
    }
    /**
     * Rotates around planet to the South Pole.
     * @public
     * @param {number} angle - Rotation angle.
     */
    rotateDown(angle) {
        this.rotateVertical(-angle * math.RADIANS, Vec3.ZERO);
        this.update();
    }
    rotateVertical(angle, center, minSlope = 0) {
        let rot = new Mat4().setRotation(this._r, angle);
        let tr = new Mat4().setIdentity().translate(center);
        let ntr = new Mat4().setIdentity().translate(center.negateTo());
        let trm = tr.mul(rot).mul(ntr);
        let eye = trm.mulVec3(this.eye);
        let u = rot.mulVec3(this._u).normalize();
        let r = rot.mulVec3(this._r).normalize();
        let b = rot.mulVec3(this._b).normalize();
        let eyeNorm = eye.getNormal();
        let slope = b.dot(eyeNorm);
        if (minSlope) {
            let dSlope = slope - this.slope;
            if (slope < minSlope && dSlope < 0)
                return;
            if ((slope > 0.1 && u.dot(eyeNorm) > 0) ||
                this.slope <= 0.1 ||
                this._u.dot(this.eye.getNormal()) <= 0.0) {
                this.eye = eye;
                this._u = u;
                this._r = r;
                this._b = b;
            }
        }
        else {
            this.eye = eye;
            this._u = u;
            this._r = r;
            this._b = b;
        }
    }
    /**
     * Prepare camera to the frame. Used in render node frame function.
     * @public
     */
    checkFly() {
        if (this._flying) {
            let c = this._numFrames - this._framesCounter;
            this.planet.layerLock.lock(this._keyLock);
            this.planet.terrainLock.lock(this._keyLock);
            this.planet.normalMapCreator.lock(this._keyLock);
            this.eye = this._framesArr[c].eye;
            this._r = this._framesArr[c].u;
            this._u = this._framesArr[c].v;
            this._b = this._framesArr[c].n;
            if (this._frameCallback) {
                this._frameCallback();
            }
            this.update();
            this._framesCounter--;
            if (this._framesCounter < 0) {
                this.stopFlying();
                if (this._completeCallback) {
                    this._completeCallback();
                    this._completeCallback = null;
                }
            }
        }
    }
    checkTerrainCollision() {
        this._terrainAltitude = this._lonLat.height;
        if (this._insideSegment && this._insideSegment.planet) {
            this._terrainAltitude = this._insideSegment.getTerrainPoint(this.eye, this._insideSegment.getInsideLonLat(this), this._terrainPoint);
            if (this._terrainAltitude < this.minAltitude && this._checkTerrainCollision) {
                this.setAltitude(this.minAltitude);
            }
            return this._terrainPoint;
        }
    }
    getSurfaceVisibleDistance(d) {
        let R = this.planet.ellipsoid.equatorialSize;
        return R * Math.acos(R / (R + this._lonLat.height + d));
    }
    getHeading() {
        let u = this.eye.getNormal();
        let f = Vec3.proj_b_to_plane(this.slope >= 0.97 ? this.getUp() : this.getForward(), u).normalize(), n = Vec3.proj_b_to_plane(Vec3.NORTH, u).normalize();
        let res = Math.sign(u.dot(f.cross(n))) * Math.acos(f.dot(n)) * math.DEGREES;
        if (res < 0.0) {
            return 360.0 + res;
        }
        return res;
    }
    isVisible(poi) {
        let e = this.eye.length();
        return this.eye.distance(poi) < Math.sqrt(e * e - this.planet.ellipsoid.equatorialSizeSqr);
    }
}
export { PlanetCamera };
