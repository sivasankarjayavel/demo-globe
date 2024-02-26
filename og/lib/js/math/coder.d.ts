/**
 * @module og/math/coder
 */
import { NumberArray4, Vec4 } from "./Vec4";
import { NumberArray3 } from "./Vec3";
import { NumberArray2, Vec2 } from "./Vec2";
/**
 * Encode 32 bit float value to the RGBA vector.
 * @function
 * @param {number} v - 32 bit float value.
 * @returns {Vec4} - RGBA vector value.
 */
export declare function encodeFloatToRGBA(v: number): Vec4;
/**
 * Decode RGBA vector to 32 bit float value.
 * @function
 * @param {Vec4} rgba - RGBA encoded 32 bit float value.
 * @returns {number} - Float value.
 */
export declare function decodeFloatFromRGBA(rgba: Vec4): number;
/**
 * Decode RGBA vector to 32 bit float value.
 * @function
 * @param {NumberArray4 | NumberArray3} arr - RGBA encoded 32 bit float value.
 * @param {boolean} [use32=false] Use 32 bit result
 * @returns {number} - Float value.
 */
export declare function decodeFloatFromRGBAArr(arr: NumberArray4 | NumberArray3 | Uint8Array, use32?: boolean): number;
/**
 * Separate 64 bit value to two 32-bit float values.
 * @function
 * @param {number} value - Double type value.
 * @returns {Float32Array} Encoded array. (exactly 2 entries)
 */
export declare function doubleToTwoFloats(value: number): Float32Array;
/**
 * Separate 64 bit value to two 32-bit float values.
 * @function
 * @param {number} value - Double type value.
 * @param {NumberArray2 | Float32Array} - Reference out array.
 * @returns {NumberArray2 | Float32Array} Encoded array. (exactly 2 entries)
 */
export declare function doubleToTwoFloats2(value: number, highLowArr: NumberArray2 | Float32Array): NumberArray2 | Float32Array;
/**
 * Separate 64 bit value to two 32-bit float values.
 * @function
 * @param {number} value - Double type value.
 * @param {Vec2} highLowVec - Reference out vector object.
 * @returns {Vec2} Encoded array. (exactly 2 entries)
 */
export declare function doubleToTwoFloatsV2(value: number, highLowVec: Vec2): Vec2;
