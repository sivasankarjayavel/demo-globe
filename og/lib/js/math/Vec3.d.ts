import { Quat } from "./Quat";
import { Vec4, NumberArray4 } from "./Vec4";
import { NumberArray2 } from "./Vec2";
export type NumberArray3 = [number, number, number];
/**
 * Class represents a 3d vector.
 * @class
 * @param {number} [x] - First value.
 * @param {number} [y] - Second value.
 * @param {number} [z] - Third value.
 */
export declare class Vec3 {
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
    constructor(x?: number, y?: number, z?: number);
    /** @const */
    static get UP(): Vec3;
    /** @const */
    static get DOWN(): Vec3;
    /** @const */
    static get RIGHT(): Vec3;
    /** @const */
    static get LEFT(): Vec3;
    /** @const */
    static get FORWARD(): Vec3;
    /** @const */
    static get BACKWARD(): Vec3;
    /** @const */
    static get ZERO(): Vec3;
    /** @const */
    static get UNIT_X(): Vec3;
    /** @const */
    static get UNIT_Y(): Vec3;
    /** @const */
    static get UNIT_Z(): Vec3;
    /** @const */
    static get NORTH(): Vec3;
    /**
     * Separate 63 bit Vec3 to two Vec3 32-bit float values.
     * @function
     * @param {Vec3} v - Double type value.
     * @param {Vec3} high - Out vector high values.
     * @param {Vec3} low - Out vector low values.
     */
    static doubleToTwoFloats(v: Vec3, high: Vec3, low: Vec3): void;
    /**
     * Separate 63 bit Vec3 to two Vec3 32-bit float values.
     * @function
     * @param {Vec3} v - Double type value.
     * @param {Float32Array} high - Out vector high values.
     * @param {Float32Array} low - Out vector low values.
     * @returns {Array.<number>} Encoded array. (exactly 2 entries)
     */
    static doubleToTwoFloat32Array(v: Vec3, high: Float32Array | NumberArray3, low: Float32Array | NumberArray3): void;
    /**
     * Creates 3d vector from array.
     * @function
     * @param {NumberArray2 | NumberArray3 | NumberArray4} arr - Input array (exactly 3 entries)
     * @returns {Vec3} -
     */
    static fromVec(arr: NumberArray2 | NumberArray3 | NumberArray4): Vec3;
    /**
     * Gets angle between two vectors.
     * @static
     * @param {Vec3} a - First vector.
     * @param {Vec3} b - Second vector.
     * @returns {number} -
     */
    static angle(a: Vec3, b: Vec3): number;
    /**
     * Returns two vectors linear interpolation.
     * @static
     * @param {Vec3} v1 - Start vector.
     * @param {Vec3} v2 - End vector.
     * @param {number} l - Interpolate value.
     * @returns {Vec3} -
     */
    static lerp(v1: Vec3, v2: Vec3, l: number): Vec3;
    /**
     * Returns summary vector.
     * @static
     * @param {Vec3} a - First vector.
     * @param {Vec3} b - Second vector.
     * @returns {Vec3} - Summary vector.
     */
    static add(a: Vec3, b: Vec3): Vec3;
    /**
     * Returns two vectors subtraction.
     * @static
     * @param {Vec3} a - First vector.
     * @param {Vec3} b - Second vector.
     * @returns {Vec3} - Vectors subtraction.
     */
    static sub(a: Vec3, b: Vec3): Vec3;
    /**
     * Returns scaled vector.
     * @static
     * @param {Vec3} a - Input vector.
     * @param {number} scale - Scale value.
     * @returns {Vec3} -
     */
    static scale(a: Vec3, scale: number): Vec3;
    /**
     * Returns two vectors production.
     * @static
     * @param {Vec3} a - First vector.
     * @param {Vec3} b - Second vector.
     * @returns {Vec3} -
     */
    static mul(a: Vec3, b: Vec3): Vec3;
    /**
     * Returns true if two vectors are non-collinear.
     * @public
     * @param {Vec3} a - First vector.
     * @param {Vec3} b - Second vector.
     * @returns {Vec3} -
     */
    static noncollinear(a: Vec3, b: Vec3): boolean;
    /**
     * Get projection of the vector to plane where n - normal to the plane.
     * @static
     * @param {Vec3} b - Vector to project.
     * @param {Vec3} n - Plane normal.
     * @param {Vec3} [def] - Default value for non existed result.
     * @returns {Vec3} -
     */
    static proj_b_to_plane(b: Vec3, n: Vec3, def?: Vec3): Vec3;
    /**
     * Get projection of the first vector to the second.
     * @static
     * @param {Vec3} b - First vector.
     * @param {Vec3} a - Second vector.
     * @returns {Vec3} -
     */
    static proj_b_to_a(b: Vec3, a: Vec3): Vec3;
    /**
     * Makes vectors normalized and orthogonal to each other.
     * Normalizes normal. Normalizes tangent and makes sure it is orthogonal to normal (that is, angle between them is 90 degrees).
     * @static
     * @param {Vec3} normal - Normal vector.
     * @param {Vec3} tangent - Tangent vector.
     * @returns {Vec3} -
     */
    static orthoNormalize(normal: Vec3, tangent: Vec3): Vec3;
    /**
     * Returns vector components division product one to another.
     * @static
     * @param {Vec3} a - First vector.
     * @param {Vec3} b - Second vector.
     * @returns {Vec3} -
     */
    static div(a: Vec3, b: Vec3): Vec3;
    static length2(a: Vec3): number;
    static dot(a: Vec3, b: Vec3): number;
    /**
     * Converts to 4d vector, Fourth value is 1.0.
     * @public
     * @returns {Vec4} -
     */
    toVec4(): Vec4;
    /**
     * Returns clone vector.
     * @public
     * @returns {Vec3} -
     */
    clone(): Vec3;
    /**
     * Converts vector to text string.
     * @public
     * @returns {string} -
     */
    toString(): string;
    /**
     * Returns true if vector's values are zero.
     * @public
     * @returns {boolean} -
     */
    isZero(): boolean;
    /**
     * Get projection of the first vector to the second.
     * @static
     * @param {Vec3} a - Project vector.
     * @returns {Vec3} -
     */
    projToVec(a: Vec3): Vec3;
    /**
     * Compares with vector. Returns true if it equals another.
     * @public
     * @param {Vec3} p - Vector to compare.
     * @returns {boolean} -
     */
    equal(p: Vec3): boolean;
    /**
     * Copy input vector's values.
     * @param {Vec3} p - Vector to copy.
     * @returns {Vec3} -
     */
    copy(p: Vec3): Vec3;
    /**
     * Gets vector's length.
     * @public
     * @returns {number} -
     */
    length(): number;
    /**
     * Returns squared vector's length.
     * @public
     * @returns {number} -
     */
    length2(): number;
    /**
     * Converts vector's values to a quaternion object.
     * @public
     * @returns {Quat} -
     */
    getQuat(): Quat;
    /**
     * Adds vector to the current.
     * @public
     * @param {Vec3} p - Point to add.
     * @returns {Vec3} -
     */
    addA(p: Vec3): Vec3;
    /**
     * Gets two vectors summarization.
     * @public
     * @param {Vec3} p - Vector to add.
     * @returns {Vec3} Returns a sum vector.
     */
    add(p: Vec3): Vec3;
    /**
     * Subtract vector from the current.
     * @public
     * @param {Vec3} p - Subtract vector.
     * @returns {Vec3} -
     */
    subA(p: Vec3): Vec3;
    /**
     * Gets vector subtraction.
     * @public
     * @param {Vec3} p - Subtract vector.
     * @return {Vec3} Returns new instance of a subtraction
     */
    sub(p: Vec3): Vec3;
    /**
     * Scale current vector.
     * @public
     * @param {number} scale - Scale value.
     * @returns {Vec3} -
     */
    scale(scale: number): Vec3;
    /**
     * Scale current vector to another instance.
     * @public
     * @param {number} scale - Scale value.
     * @returns {Vec3} -
     */
    scaleTo(scale: number): Vec3;
    /**
     * Multiply current vector object to another and store result in the current instance.
     * @public
     * @param {Vec3} vec - Multiply vector.
     * @returns {Vec3} -
     */
    mulA(vec: Vec3): Vec3;
    /**
     * Multiply current vector object to another and returns new vector instance.
     * @public
     * @param {Vec3} vec - Multiply vector.
     * @returns {Vec3} -
     */
    mul(vec: Vec3): Vec3;
    /**
     * Divide current vector's components to another. Results stores in the current vector object.
     * @public
     * @param {Vec3} vec - Div vector.
     * @returns {Vec3} -
     */
    divA(vec: Vec3): Vec3;
    /**
     * Divide current vector's components to another and returns new vector instance.
     * @public
     * @param {Vec3} vec - Div vector.
     * @returns {Vec3} -
     */
    div(vec: Vec3): Vec3;
    /**
     * Gets vectors dot production.
     * @public
     * @param {Vec3} a - Another vector.
     * @returns {number} -
     */
    dot(a: Vec3): number;
    /**
     * Gets vectors dot production.
     * @public
     * @param {Array.<number>} arr - Array vector. (exactly 3 entries)
     * @returns {number} -
     */
    dotArr(arr: NumberArray3 | NumberArray4): number;
    /**
     * Gets vectors cross production.
     * @public
     * @param {Vec3} point3 - Another vector.
     * @returns {Vec3} -
     */
    cross(point3: Vec3): Vec3;
    /**
     * Sets vector to zero.
     * @public
     * @returns {Vec3} -
     */
    clear(): Vec3;
    /**
     * Returns normalized vector.
     * @public
     * @returns {Vec3} -
     */
    getNormal(): Vec3;
    /**
     * Returns normalized vector.
     * @deprecated
     * @public
     * @returns {Vec3} -
     */
    normal(): Vec3;
    /**
     * Returns normalized negate vector.
     * @public
     * @returns {Vec3} -
     */
    normalNegate(): Vec3;
    /**
     * Returns normalized negate scale vector.
     * @public
     * @returns {Vec3} -
     */
    normalNegateScale(scale: number): Vec3;
    /**
     * Returns normalized scale vector.
     * @public
     * @returns {Vec3} -
     */
    normalScale(scale: number): Vec3;
    /**
     * Normalize current vector.
     * @public
     * @returns {Vec3} -
     */
    normalize(): Vec3;
    /**
     * Converts vector to a number array.
     * @public
     * @returns {Array.<number>} - (exactly 3 entries)
     * @deprecated
     */
    toVec(): NumberArray3;
    /**
     * Converts vector to a number array.
     * @public
     * @returns {Array.<number>} - (exactly 3 entries)
     */
    toArray(): NumberArray3;
    /**
     * Gets distance to point.
     * @public
     * @param {Vec3} p - Distant point.
     * @returns {number} -
     */
    distance(p: Vec3): number;
    /**
     * Gets square distance to point.
     * @public
     * @param {Vec3} p - Distant point.
     * @returns {number} -
     */
    distance2(p: Vec3): number;
    /**
     * Sets vector's values.
     * @public
     * @param {number} x - Value X.
     * @param {number} y - Value Y.
     * @param {number} z - Value Z.
     * @returns {Vec3} -
     */
    set(x: number, y: number, z: number): Vec3;
    /**
     * Negate current vector.
     * @public
     * @returns {Vec3} -
     */
    negate(): Vec3;
    /**
     * Negate current vector to another instance.
     * @public
     * @returns {Vec3} -
     */
    negateTo(): Vec3;
    /**
     * Gets projected point coordinates of the current vector on the ray.
     * @public
     * @param {Vec3} pos - Ray position.
     * @param {Vec3} direction - Ray direction.
     * @returns {Vec3} -
     */
    projToRay(pos: Vec3, direction: Vec3): Vec3;
    /**
     * Gets angle between two vectors.
     * @public
     * @param {Vec3} a - Another vector.
     * @returns {number} -
     */
    angle(a: Vec3): number;
    /**
     * Returns two vectors linear interpolation.
     * @public
     * @param {Vec3} v2 - End vector.
     * @param {number} l - Interpolate value.
     * @returns {Vec3} -
     */
    lerp(v2: Vec3, l: number): Vec3;
    /**
     * Returns vector interpolation by v(t) = v1 * t + v2 * (1 - t)
     * @public
     * @param {Vec3} v2 - End vector.
     * @param {number} t - Interpolate value.
     * @returns {Vec3} -
     */
    smerp(v2: Vec3, t: number): Vec3;
    static get LERP_DELTA(): number;
    /**
     * Spherically interpolates between two vectors.
     * Interpolates between current and v2 vector by amount t. The difference between this and linear interpolation (aka, "lerp") is that
     * the vectors are treated as directions rather than points in space. The direction of the returned vector is interpolated
     * by the angle and its magnitude is interpolated between the magnitudes of from and to.
     * @public
     * @param {Vec3} v2 -
     * @param {number} t - The parameter t is clamped to the range [0, 1].
     * @returns {Vec3} -
     */
    slerp(v2: Vec3, t: number): Vec3;
    /**
     * Gets the shortest arc quaternion to rotate this vector to the destination vector.
     * @param {Vec3} dest -
     * @param {Vec3} fallbackAxis -
     * @returns {Quat} -
     * @todo: TEST IT!
     */
    getRotationTo(dest: Vec3, fallbackAxis: Vec3): Quat;
}
/**
 * Vector 3d object creator.
 * @function
 * @param {number} [x] - value X.
 * @param {number} [y] - value Y.
 * @param {number} [z] - value Z.
 * @returns {Vec3} -
 */
export declare function vec3(x?: number, y?: number, z?: number): Vec3;
