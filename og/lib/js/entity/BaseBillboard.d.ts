import { Entity } from "./Entity";
import { NumberArray2, Vec2 } from "../math/Vec2";
import { NumberArray3, Vec3 } from "../math/Vec3";
import { NumberArray4, Vec4 } from "../math/Vec4";
import { BaseBillboardHandler } from "./BaseBillboardHandler";
export interface IBaseBillboardParams {
    position?: NumberArray3 | Vec3;
    rotation?: number;
    color?: string | NumberArray4 | Vec4;
    alignedAxis?: NumberArray3 | Vec3;
    offset?: NumberArray2 | NumberArray3 | Vec2 | Vec3;
    visibility?: boolean;
}
/**
 * Base prototype for billboard and label classes.
 * @class
 * @param {Object} [options] - Options:
 * @param {Vec3|Array.<number>} [options.position] - Billboard position.
 * @param {number} [options.rotation] - Screen angle rotation.
 * @param {Vec4|string|Array.<number>} [options.color] - Billboard color.
 * @param {Vec3|Array.<number>} [options.alignedAxis] - Billboard aligned vector.
 * @param {Vec3|Array.<number>} [options.offset] - Billboard center screen offset.
 * @param {boolean} [options.visibility] - Visibility.
 */
declare class BaseBillboard {
    static __counter__: number;
    __id: number;
    /**
     * Billboard center cartesian position.
     * @protected
     * @type {Vec3}
     */
    protected _position: Vec3;
    _positionHigh: Vec3;
    _positionLow: Vec3;
    /**
     * Screen space rotation angle.
     * @public
     * @type {number}
     */
    _rotation: number;
    /**
     * RGBA color.
     * @public
     * @type {Vec4}
     */
    _color: Vec4;
    /**
     * Cartesian aligned axis vector.
     * @protected
     * @type {Vec3}
     */
    protected _alignedAxis: Vec3;
    /**
     * Billboard center screen space offset. Where x,y - screen space offset and z - depth offset.
     * @public
     * @type {Vec3}
     */
    _offset: Vec3;
    /**
     * Billboard visibility.
     * @protected
     * @type {boolean}
     */
    protected _visibility: boolean;
    /**
     * Entity instance that holds this billboard.
     * @public
     * @type {Entity}
     */
    _entity: Entity | null;
    /**
     * Handler that stores and renders this billboard object.
     * @public
     * @type {BillboardHandler | null}
     */
    _handler: BaseBillboardHandler | null;
    /**
     * Billboard handler array index.
     * @public
     * @type {number}
     */
    _handlerIndex: number;
    /**
     * An indication that the object is ready to draw
     * @public
     * @type {number}
     */
    _isReady: boolean;
    _lockId: number;
    constructor(options?: IBaseBillboardParams);
    /**
     * Sets billboard position.
     * @public
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {number} z - Z coordinate.
     */
    setPosition(x: number, y: number, z: number): void;
    /**
     * Sets billboard position.
     * @public
     * @param {Vec3} position - Cartesian coordinates.
     */
    setPosition3v(position: Vec3): void;
    /**
     * Returns billboard position.
     * @public
     * @returns {Vec3}
     */
    getPosition(): Vec3;
    /**
     * Sets screen space offset.
     * @public
     * @param {number} x - X offset.
     * @param {number} y - Y offset.
     * @param {number} [z] - Z offset.
     */
    setOffset(x: number, y: number, z?: number): void;
    /**
     * Sets screen space offset.
     * @public
     * @param {Vec2} offset - Offset size.
     */
    setOffset3v(offset: Vec3): void;
    /**
     * Returns billboard screen space offset size.
     * @public
     * @returns {Vec3}
     */
    getOffset(): Vec3;
    /**
     * Sets billboard screen space rotation in radians.
     * @public
     * @param {number} rotation - Screen space rotation in radians.
     */
    setRotation(rotation: number): void;
    /**
     * Gets screen space rotation.
     * @public
     * @returns {number}
     */
    getRotation(): number;
    /**
     * Sets billboard opacity.
     * @public
     * @param {number} a - Billboard opacity.
     */
    setOpacity(a: number): void;
    /**
     * Sets RGBA color. Each channel from 0.0 to 1.0.
     * @public
     * @param {number} r - Red.
     * @param {number} g - Green.
     * @param {number} b - Blue.
     * @param {number} a - Alpha.
     */
    setColor(r: number, g: number, b: number, a?: number): void;
    /**
     * Sets RGBA color. Each channel from 0.0 to 1.0.
     * @public
     * @param {Vec4} color - RGBA vector.
     */
    setColor4v(color: Vec4): void;
    /**
     * Sets billboard color.
     * @public
     * @param {string} color - HTML style color.
     */
    setColorHTML(color: string): void;
    /**
     * Returns RGBA color.
     * @public
     * @returns {Vec4}
     */
    getColor(): Vec4;
    /**
     * Sets billboard visibility.
     * @public
     * @param {boolean} visibility - Visibility flag.
     */
    setVisibility(visibility: boolean): void;
    /**
     * Returns billboard visibility.
     * @public
     * @returns {boolean}
     */
    getVisibility(): boolean;
    /**
     * Sets billboard cartesian aligned vector.
     * @public
     * @param {number} x - Aligned vector X coordinate.
     * @param {number} y - Aligned vector Y coordinate.
     * @param {number} z - Aligned vector Z coordinate.
     */
    setAlignedAxis(x: number, y: number, z: number): void;
    /**
     * Sets billboard aligned vector.
     * @public
     * @param {Vec3} alignedAxis - Align direction.
     */
    setAlignedAxis3v(alignedAxis: Vec3): void;
    /**
     * Returns aligned vector.
     * @public
     * @returns {Vec3}
     */
    getAlignedAxis(): Vec3;
    /**
     * Removes billboard from handler.
     * @public
     */
    remove(): void;
    /**
     * Sets billboard picking color.
     * @public
     * @param {Vec3} color - Picking color.
     */
    setPickingColor3v(color: Vec3): void;
    serializeWorkerData(workerId: number): Float32Array | null;
}
export { BaseBillboard };
