import { Vec3 } from "../math/Vec3";
import { Vec4 } from "../math/Vec4";
const COORDINATES_BUFFER = 0;
const COLOR_BUFFER = 1;
const PICKING_COLOR_BUFFER = 2;
/**
 * PointCloud object.
 * @class
 * @param {*} [options] - Point cloud options:
 * @param {Array.<Array.<number>>} [options.points] - Points cartesian coordinates array,
 * where first three is cartesian coordinates, next fourth is an RGBA color, and last is a point properties.
 * @param {number} [options.pointSize] - Point screen size in pixels.
 * @param {number} [options.pickingScale] - Point border picking size in screen pixels.
 * @param {boolean} [options.visibility] - Point cloud visibility.
 * @example <caption>Creates point cloud with two ten pixel size points</caption>
 * new og.Entity({
 *     pointCloud: {
 *         pointSize: 10,
 *         points: [
 *             [0, 0, 0, 255, 255, 255, 255, { 'name': 'White point' }],
 *             [100, 100, 0, 255, 0, 0, 255, { 'name': 'Red point' }]
 *         ]
 *     }
 * });
 */
class PointCloud {
    constructor(options = {}) {
        this.__id = PointCloud.__counter__++;
        /**
         * Cloud visibility.
         * @public
         * @type {boolean}
         */
        this.visibility = options.visibility != undefined ? options.visibility : true;
        /**
         * Point screen size in pixels.
         * @public
         * @type {number}
         */
        this.pointSize = options.pointSize || 3;
        /**
         * Point picking border size in pixels.
         * @public
         * @type {number}
         */
        this.pickingScale = options.pickingScale || 0;
        /**
         * Parent collection render node.
         * @private
         * @type {RenderNode}
         */
        this._renderNode = null;
        /**
         * Entity instance that holds this point cloud.
         * @private
         * @type {Entity}
         */
        this._entity = null;
        /**
         * Points properties.
         * @private
         * @type {IPoint[]}
         */
        this._points = [];
        /**
         * Coordinates array.
         * @private
         * @type {Array.<number>}
         */
        this._coordinatesData = [];
        /**
         * Color array.
         * @private
         * @type {Array.<number>}
         */
        this._colorData = [];
        /**
         * Picking color array.
         * @private
         * @type {Array.<number>}
         */
        this._pickingColorData = [];
        this._coordinatesBuffer = null;
        this._colorBuffer = null;
        this._pickingColorBuffer = null;
        /**
         * Handler that stores and renders this object.
         * @private
         * @type {PointCloudHandler}
         */
        this._handler = null;
        this._handlerIndex = -1;
        this._buffersUpdateCallbacks = [];
        this._buffersUpdateCallbacks[COORDINATES_BUFFER] = this._createCoordinatesBuffer;
        this._buffersUpdateCallbacks[COLOR_BUFFER] = this._createColorBuffer;
        this._buffersUpdateCallbacks[PICKING_COLOR_BUFFER] = this._createPickingColorBuffer;
        this._changedBuffers = new Array(this._buffersUpdateCallbacks.length);
        if (options.points) {
            this.setPoints(options.points);
        }
    }
    /**
     * Clears point cloud data
     * @public
     */
    clear() {
        this._points.length = 0;
        this._points = [];
        this._coordinatesData.length = 0;
        this._coordinatesData = [];
        this._colorData.length = 0;
        this._colorData = [];
        this._pickingColorData.length = 0;
        this._pickingColorData = [];
        this._deleteBuffers();
    }
    /**
     * Sets cloud visibility.
     * @public
     * @param {boolean} visibility - Visibility flag.
     */
    setVisibility(visibility) {
        this.visibility = visibility;
    }
    /**
     * @return {boolean} Point cloud visibility.
     */
    getVisibility() {
        return this.visibility;
    }
    /**
     * Assign rendering scene node.
     * @public
     * @param {RenderNode}  renderNode - Assigned render node.
     */
    setRenderNode(renderNode) {
        this._renderNode = renderNode;
        this._setPickingColors();
    }
    /**
     * Removes from entity.
     * @public
     */
    remove() {
        this._entity = null;
        this._handler && this._handler.remove(this);
    }
    /**
     * Adds points to render.
     * @public
     * @param { Poi[]} points - Point cloud array.
     * @example
     * var points = [[0, 0, 0, 255, 255, 255, 255, { 'name': 'White point' }], [100, 100, 0, 255, 0, 0, 255, { 'name': 'Red point' }]];
     */
    setPoints(points) {
        this.clear();
        for (let i = 0; i < points.length; i++) {
            let pi = points[i];
            let pos = new Vec3(pi[0], pi[1], pi[2]), col = new Vec4(pi[3], pi[4], pi[5], pi[6] == undefined ? 255.0 : pi[6]);
            this._coordinatesData.push(pos.x, pos.y, pos.z);
            this._colorData.push(col.x / 255.0, col.y / 255.0, col.z / 255.0, col.w / 255.0);
            let p = {
                _entity: this._entity,
                _pickingColor: new Vec3(),
                _entityCollection: this._entity ? this._entity._entityCollection : null,
                index: i,
                position: pos,
                color: col,
                pointCloud: this,
                properties: pi[7] || {}
            };
            this._points.push(p);
            if (this._renderNode && this._renderNode.renderer) {
                this._renderNode.renderer.assignPickingColor(p);
                this._pickingColorData.push(p._pickingColor.x / 255.0, p._pickingColor.y / 255.0, p._pickingColor.z / 255.0, 1.0);
            }
        }
        this._changedBuffers[COORDINATES_BUFFER] = true;
        this._changedBuffers[COLOR_BUFFER] = true;
        this._changedBuffers[PICKING_COLOR_BUFFER] = true;
    }
    setPointPosition(index, x, y, z) {
        // TODO: ...
        this._changedBuffers[COORDINATES_BUFFER] = true;
    }
    setPointColor(index, r, g, b, a) {
        // TODO: ...
        this._changedBuffers[COLOR_BUFFER] = true;
    }
    addPoints(points) {
        // TODO: ...
        this._changedBuffers[COORDINATES_BUFFER] = true;
        this._changedBuffers[COLOR_BUFFER] = true;
        this._changedBuffers[PICKING_COLOR_BUFFER] = true;
    }
    addPoint(index, point) {
        // TODO: ...
        this._changedBuffers[COORDINATES_BUFFER] = true;
        this._changedBuffers[COLOR_BUFFER] = true;
        this._changedBuffers[PICKING_COLOR_BUFFER] = true;
    }
    /**
     * Returns specific point by index.
     * @public
     * @param {number} index - Point index.
     * @return {Poi} Specific point
     */
    getPoint(index) {
        return this._points[index];
    }
    removePoint(index) {
        // TODO: ...
        this._changedBuffers[COORDINATES_BUFFER] = true;
        this._changedBuffers[COLOR_BUFFER] = true;
        this._changedBuffers[PICKING_COLOR_BUFFER] = true;
    }
    insertPoint(index, point) {
        // TODO: ...
        this._changedBuffers[COORDINATES_BUFFER] = true;
        this._changedBuffers[COLOR_BUFFER] = true;
        this._changedBuffers[PICKING_COLOR_BUFFER] = true;
    }
    draw() {
        if (this.visibility && this._coordinatesData.length) {
            this._update();
            let rn = this._renderNode;
            let r = rn.renderer;
            let sh = r.handler.programs.pointCloud;
            let p = sh._program;
            let gl = r.handler.gl, sha = p.attributes, shu = p.uniforms;
            // gl.polygonOffset(
            //     this._handler._entityCollection.polygonOffsetFactor,
            //     this._handler._entityCollection.polygonOffsetUnits
            // );
            sh.activate();
            gl.uniformMatrix4fv(shu.projectionViewMatrix, false, r.activeCamera.getProjectionViewMatrix());
            gl.uniform1f(shu.opacity, this._handler._entityCollection._fadingOpacity);
            gl.uniform1f(shu.pointSize, this.pointSize);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._coordinatesBuffer);
            gl.vertexAttribPointer(sha.coordinates, this._coordinatesBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
            gl.vertexAttribPointer(sha.colors, this._colorBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.POINTS, 0, this._coordinatesBuffer.numItems);
        }
    }
    drawPicking() {
        if (this.visibility && this._coordinatesData.length) {
            let rn = this._renderNode;
            let r = rn.renderer;
            let sh = r.handler.programs.pointCloud;
            let p = sh._program;
            let gl = r.handler.gl, sha = p.attributes, shu = p.uniforms;
            sh.activate();
            // gl.polygonOffset(
            //     this._handler._entityCollection.polygonOffsetFactor,
            //     this._handler._entityCollection.polygonOffsetUnits
            // );
            gl.uniformMatrix4fv(shu.projectionViewMatrix, false, r.activeCamera.getProjectionViewMatrix());
            gl.uniform1f(shu.opacity, this._handler._entityCollection._fadingOpacity);
            gl.uniform1f(shu.pointSize, this.pointSize + this.pickingScale);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._coordinatesBuffer);
            gl.vertexAttribPointer(sha.coordinates, this._coordinatesBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._pickingColorBuffer);
            gl.vertexAttribPointer(sha.colors, this._pickingColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.POINTS, 0, this._coordinatesBuffer.numItems);
        }
    }
    /**
     * Update gl buffers.
     * @protected
     */
    _update() {
        if (this._renderNode) {
            let i = this._changedBuffers.length;
            while (i--) {
                if (this._changedBuffers[i]) {
                    this._buffersUpdateCallbacks[i].call(this);
                    this._changedBuffers[i] = false;
                }
            }
        }
    }
    /**
     * Delete buffers
     * @public
     */
    _deleteBuffers() {
        if (this._renderNode) {
            let r = this._renderNode.renderer, gl = r.handler.gl;
            gl.deleteBuffer(this._coordinatesBuffer);
            gl.deleteBuffer(this._colorBuffer);
            gl.deleteBuffer(this._pickingColorBuffer);
        }
        this._coordinatesBuffer = null;
        this._colorBuffer = null;
        this._pickingColorBuffer = null;
    }
    _createCoordinatesBuffer() {
        let h = this._renderNode.renderer.handler;
        h.gl.deleteBuffer(this._coordinatesBuffer);
        this._coordinatesBuffer = h.createArrayBuffer(new Float32Array(this._coordinatesData), 3, this._coordinatesData.length / 3);
    }
    _createColorBuffer() {
        let h = this._renderNode.renderer.handler;
        h.gl.deleteBuffer(this._colorBuffer);
        this._colorBuffer = h.createArrayBuffer(new Float32Array(this._colorData), 4, this._colorData.length / 4);
    }
    _createPickingColorBuffer() {
        let h = this._renderNode.renderer.handler;
        h.gl.deleteBuffer(this._pickingColorBuffer);
        this._pickingColorBuffer = h.createArrayBuffer(new Float32Array(this._pickingColorData), 4, this._pickingColorData.length / 4);
    }
    _setPickingColors() {
        if (this._renderNode && this._renderNode.renderer) {
            for (let i = 0; i < this._points.length; i++) {
                let p = this._points[i];
                p._entity = this._entity;
                p._entityCollection = this._entity._entityCollection;
                this._renderNode.renderer.assignPickingColor(p);
                this._pickingColorData.push(p._pickingColor.x / 255.0, p._pickingColor.y / 255.0, p._pickingColor.z / 255.0, 1.0);
            }
            this._changedBuffers[PICKING_COLOR_BUFFER] = true;
        }
    }
}
PointCloud.__counter__ = 0;
export { PointCloud };
