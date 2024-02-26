import { Entity } from "./Entity";
import { PointCloudHandler } from "./PointCloudHandler";
import { RenderNode } from "../scene/RenderNode";
import { Vec3 } from "../math/Vec3";
import { Vec4 } from "../math/Vec4";
import { WebGLBufferExt } from "../webgl/Handler";
import { EntityCollection } from "./EntityCollection";
export interface IPointCloudParams {
    visibility?: boolean;
    pointSize?: number;
    pickingScale?: number;
    points?: Poi[];
}
type Poi = [number, number, number, number, number, number, number, any | undefined];
interface IPoint {
    _entity: Entity | null;
    _pickingColor: Vec3;
    _entityCollection: EntityCollection | null;
    index: number;
    position: Vec3;
    color: Vec4;
    pointCloud: PointCloud;
    properties: any;
}
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
declare class PointCloud {
    static __counter__: number;
    protected __id: number;
    /**
     * Cloud visibility.
     * @public
     * @type {boolean}
     */
    visibility: boolean;
    /**
     * Point screen size in pixels.
     * @public
     * @type {number}
     */
    pointSize: number;
    /**
     * Point picking border size in pixels.
     * @public
     * @type {number}
     */
    pickingScale: number;
    /**
     * Parent collection render node.
     * @protected
     * @type {RenderNode | null}
     */
    protected _renderNode: RenderNode | null;
    /**
     * Entity instance that holds this point cloud.
     * @public
     * @type {Entity | null}
     */
    _entity: Entity | null;
    /**
     * Points properties.
     * @protected
     * @type {IPoint[]}
     */
    protected _points: IPoint[];
    /**
     * Coordinates array.
     * @protected
     * @type {number[]}
     */
    protected _coordinatesData: number[];
    /**
     * Color array.
     * @protected
     * @type {number[]}
     */
    protected _colorData: number[];
    /**
     * Picking color array.
     * @protected
     * @type {number[]}
     */
    protected _pickingColorData: number[];
    protected _coordinatesBuffer: WebGLBufferExt | null;
    protected _colorBuffer: WebGLBufferExt | null;
    protected _pickingColorBuffer: WebGLBufferExt | null;
    /**
     * Handler that stores and renders this object.
     * @public
     * @type {PointCloudHandler}
     */
    _handler: PointCloudHandler | null;
    _handlerIndex: number;
    protected _buffersUpdateCallbacks: Function[];
    protected _changedBuffers: boolean[];
    constructor(options?: IPointCloudParams);
    /**
     * Clears point cloud data
     * @public
     */
    clear(): void;
    /**
     * Sets cloud visibility.
     * @public
     * @param {boolean} visibility - Visibility flag.
     */
    setVisibility(visibility: boolean): void;
    /**
     * @return {boolean} Point cloud visibility.
     */
    getVisibility(): boolean;
    /**
     * Assign rendering scene node.
     * @public
     * @param {RenderNode}  renderNode - Assigned render node.
     */
    setRenderNode(renderNode: RenderNode): void;
    /**
     * Removes from entity.
     * @public
     */
    remove(): void;
    /**
     * Adds points to render.
     * @public
     * @param { Poi[]} points - Point cloud array.
     * @example
     * var points = [[0, 0, 0, 255, 255, 255, 255, { 'name': 'White point' }], [100, 100, 0, 255, 0, 0, 255, { 'name': 'Red point' }]];
     */
    setPoints(points: Poi[]): void;
    setPointPosition(index: number, x: number, y: number, z: number): void;
    setPointColor(index: number, r: number, g: number, b: number, a: number): void;
    addPoints(points: Poi[]): void;
    addPoint(index: number, point: Poi): void;
    /**
     * Returns specific point by index.
     * @public
     * @param {number} index - Point index.
     * @return {Poi} Specific point
     */
    getPoint(index: number): IPoint;
    removePoint(index: number): void;
    insertPoint(index: number, point: Poi): void;
    draw(): void;
    drawPicking(): void;
    /**
     * Update gl buffers.
     * @protected
     */
    protected _update(): void;
    /**
     * Delete buffers
     * @public
     */
    _deleteBuffers(): void;
    protected _createCoordinatesBuffer(): void;
    protected _createColorBuffer(): void;
    protected _createPickingColorBuffer(): void;
    protected _setPickingColors(): void;
}
export { PointCloud };
