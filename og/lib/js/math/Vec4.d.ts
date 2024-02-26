import { Vec3 } from "./Vec3";
export type NumberArray4 = [number, number, number, number];
/**
 * Class represents a 4d vector.
 * @class
 * @param {number} [x] - First value.
 * @param {number} [y] - Second value.
 * @param {number} [z] - Third value.
 * @param {number} [w] - Fourth value.
 */
export declare class Vec4 {
    /**
     * @public
     * @type {number}
     */
    x: number;
    /**
     * @public
     * @type {number}
     */
    y: number;
    /**
     * @public
     * @type {number}
     */
    z: number;
    /**
     * @public
     * @type {number}
     */
    w: number;
    constructor(x?: number, y?: number, z?: number, w?: number);
    /**
     * Identity vector [0,0,0,1].
     * @const
     * @type {Vec4}
     */
    static get identity(): Vec4;
    /**
     * Creates 4d vector from array.
     * @function
     * @param {Array.<number>} arr - Array of four values
     * @returns {Vec4}
     */
    static fromVec(arr: NumberArray4): Vec4;
    /**
     * Converts to Vec3, without fourth value.
     * @public
     * @returns {Vec3}
     */
    toVec3(): Vec3;
    /**
     * Returns clone vector.
     * @public
     * @returns {Vec4}
     */
    clone(): Vec4;
    /**
     * Compares with vector. Returns true if it equals another.
     * @public
     * @param {Vec4} v - Vector to compare.
     * @returns {boolean}
     */
    equal(v: Vec4): boolean;
    /**
     * Copy input vector's values.
     * @param {Vec4} v - Vector to copy.
     * @returns {Vec4}
     */
    copy(v: Vec4): Vec4;
    /**
     * Converts vector to a number array.
     * @public
     * @returns {Array.<number>} - (exactly 4 entries)
     */
    toArray(): NumberArray4;
    /**
     * Converts vector to a number array.
     * @public
     * @returns {Array.<number>} - (exactly 4 entries)
     */
    toArray3(): [number, number, number];
    /**
     * Sets vector's values.
     * @public
     * @param {number} x - Value X.
     * @param {number} y - Value Y.
     * @param {number} z - Value Z.
     * @param {number} w - Value W.
     * @returns {Vec4}
     */
    set(x: number, y: number, z: number, w: number): Vec4;
    /**
     * Adds vector to the current.
     * @public
     * @param {Vec4} v - Vector to add.
     * @returns {Vec4}
     */
    addA(v: Vec4): Vec4;
    /**
     * Subtract vector from the current.
     * @public
     * @param {Vec4} v - Subtract vector.
     * @returns {Vec4}
     */
    subA(v: Vec4): Vec4;
    /**
     * Scale current vector.
     * @public
     * @param {number} scale - Scale value.
     * @returns {Vec4}
     */
    scale(scale: number): Vec4;
    /**
     * Makes vector affinity. Thereby fourth component becomes to 1.0.
     * @public
     * @returns {Vec4}
     */
    affinity(): Vec4;
    /**
     * Scale current vector to another instance.
     * @public
     * @param {number} scale - Scale value.
     * @returns {Vec3}
     */
    scaleTo(scale: number): Vec4;
    /**
     * Vector's edge function that returns vector where each component is 0.0 if it's smaller than edge and otherwise 1.0.
     * @public
     * @returns {Vec4}
     */
    getStep(edge: number): Vec4;
    /**
     * The vector frac function returns the vector of fractional parts of each value, i.e. x minus floor(x).
     * @public
     * @param {Vec4} v - Input vector
     * @returns {Vec4}
     */
    getFrac(v: Vec4): Vec4;
    /**
     * Gets vectors dot production.
     * @public
     * @param {Vec4} v - Another vector.
     * @returns {number} - Dot product.
     */
    dot(v: Vec4): number;
    /**
     * Returns true if vector's values are zero.
     * @public
     * @returns {boolean} -
     */
    isZero(): boolean;
}
/**
 * Vector 4d object creator.
 * @function
 * @param {number} [x] - First value.
 * @param {number} [y] - Second value.
 * @param {number} [z] - Third value.
 * @param {number} [w] - Fourth value.
 * @returns {Vec4}
 */
export declare function vec4(x?: number, y?: number, z?: number, w?: number): Vec4;
