import { Mat4 } from "./Mat4";
import { Vec3 } from "./Vec3";
export type NumberArray9 = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];
/**
 * Class represents a 3x3 matrix.
 * @class
 */
export declare class Mat3 {
    /**
     * A 3x3 matrix, indexing as a column-major order array.
     * @public
     * @type {Array.<number>}
     */
    _m: NumberArray9;
    constructor();
    /**
     * Sets column-major order array matrix.
     * @public
     * @param {Array.<number>} m - Matrix array.
     * @returns {Mat3}
     */
    set(m: NumberArray9): Mat3;
    /**
     * Duplicates a Mat3 instance.
     * @public
     * @returns {Mat3}
     */
    clone(): Mat3;
    /**
     * Copy matrix.
     * @public
     * @param {Mat3} a - Matrix to copy.
     * @returns {Mat3}
     */
    copy(a: Mat3): Mat3;
    /**
     * Creates transposed matrix from the current.
     * @public
     * @returns {Mat3}
     */
    transposeTo(): Mat3;
    /**
     * Sets matrix to identity.
     * @public
     * @returns {Mat3}
     */
    setIdentity(): Mat3;
    /**
     * Multiply to 3d vector.
     * @public
     * @params {Vec3} p - 3d vector.
     * @returns {Vec3}
     */
    mulVec(p: Vec3): Vec3;
    /**
     * Converts to 4x4 matrix.
     * @public
     * @returns {Mat4}
     */
    toMatrix4(): Mat4;
}
/**
 * Mat3 factory.
 * @static
 * @return {Mat3}
 */
export declare function mat3(): Mat3;
