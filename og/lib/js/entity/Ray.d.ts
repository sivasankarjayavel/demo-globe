import { NumberArray3, Vec3 } from "../math/Vec3";
import { NumberArray4, Vec4 } from "../math/Vec4";
import { Entity } from "./Entity";
import { RayHandler } from "./RayHandler";
export interface IRayParams {
    thickness?: number;
    startPosition?: Vec3 | NumberArray3;
    endPosition?: Vec3 | NumberArray3;
    startColor?: string | NumberArray4;
    endColor?: string | NumberArray4;
    visibility?: boolean;
}
/**
 * Ray class.
 * @class
 * @param {Object} [options] - Options:
 * @param {Vec3|Array.<number>} [options.startPosition] - Ray start point position.
 * @param {Vec3|Array.<number>} [options.endPosition] - Ray end point position.
 * @param {Vec3|Array.<number>} [options.startColor] - Ray start point color.
 * @param {Vec3|Array.<number>} [options.endColor] - Ray end point color.
 * @param {boolean} [options.visibility] - Visibility.
 */
declare class Ray {
    static __counter__: number;
    /**
     * Object uniq identifier.
     * @protected
     * @type {number}
     */
    protected __id: number;
    _thickness: number;
    protected _startPosition: Vec3;
    _startPositionHigh: Vec3;
    _startPositionLow: Vec3;
    protected _endPosition: Vec3;
    _endPositionHigh: Vec3;
    _endPositionLow: Vec3;
    _startColor: Vec4;
    _endColor: Vec4;
    /**
     * Ray visibility.
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
     * @type {BillboardHandler}
     */
    _handler: RayHandler | null;
    /**
     * Billboard handler array index.
     * @public
     * @type {number}
     */
    _handlerIndex: number;
    constructor(options?: IRayParams);
    /**
     * Sets ray start position.
     * @public
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {number} z - Z coordinate.
     */
    setStartPosition(x: number, y: number, z: number): void;
    getLength(): number;
    /**
     * Sets ray start position.
     * @public
     * @param {Vec3} position - Cartesian coordinates.
     */
    setStartPosition3v(position: Vec3): void;
    /**
     * Sets ray end position.
     * @public
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {number} z - Z coordinate.
     */
    setEndPosition(x: number, y: number, z: number): void;
    /**
     * Sets ray end position.
     * @public
     * @param {Vec3} position - Cartesian coordinates.
     */
    setEndPosition3v(position: Vec3): void;
    setThickness(thickness: number): void;
    setColors4v(startColor?: Vec4, endColor?: Vec4): void;
    setColorsHTML(startColor?: string, endColor?: string): void;
    /**
     * Returns ray start position.
     * @public
     * @returns {Vec3}
     */
    getStartPosition(): Vec3;
    /**
     * Returns ray end position.
     * @public
     * @returns {Vec3}
     */
    getEndPosition(): Vec3;
    /**
     * Sets visibility.
     * @public
     * @param {boolean} visibility - Visibility flag.
     */
    setVisibility(visibility: boolean): void;
    /**
     * Returns visibility.
     * @public
     * @returns {boolean}
     */
    getVisibility(): boolean;
    /**
     * Remove from handler.
     * @public
     */
    remove(): void;
    /**
     * Set picking color.
     * @public
     * @param {Vec3} color - Picking color.
     */
    setPickingColor3v(color: Vec3): void;
}
export { Ray };
