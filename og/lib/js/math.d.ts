import { Vec3 } from "./math/Vec3";
/** @const */
export declare const TWO_PI: number;
/** @const */
export declare const PI_TWO: number;
export declare const X = 0;
export declare const Y = 1;
export declare const Z = 2;
export declare const W = 3;
export declare const MAX_FLOAT: number;
/** @const */
export declare const LOG2: number;
/** @const */
export declare const MAX32 = 2147483647;
/** @const */
export declare const MAX = 549755748352;
/** @const */
export declare const MIN: number;
/** @const */
export declare const RADIANS: number;
/** @const */
export declare const DEGREES: number;
/** @const */
export declare const DEGREES_DOUBLE: number;
/** @const */
export declare const RADIANS_HALF: number;
/** @const */
export declare const ARCSECONDS_TO_RADIANS = 0.00000484813681109536;
/** @const */
export declare const RADIANS_TO_HOURS = 3.819718634205488;
/** @const */
export declare const HOURS_TO_RADIANS = 0.26179938779914946;
/** @const */
export declare const HOURS_TO_DEGREES = 15;
/** @const */
export declare const DEGREES_TO_HOURS: number;
/** @const */
export declare const SQRT_HALF: number;
export declare const EPS1 = 0.1;
export declare const EPS2 = 0.01;
export declare const EPS3 = 0.001;
export declare const EPS4 = 0.0001;
export declare const EPS5 = 0.00001;
export declare const EPS6 = 0.000001;
export declare const EPS7 = 1e-7;
export declare const EPS8 = 1e-8;
export declare const EPS9 = 1e-9;
export declare const EPS10 = 1e-10;
export declare const EPS11 = 1e-11;
export declare const EPS12 = 1e-12;
export declare const EPS13 = 1e-13;
export declare const EPS14 = 1e-14;
export declare const EPS15 = 1e-15;
export declare const EPS16 = 1e-16;
export declare const EPS17 = 1e-17;
export declare const EPS18 = 1e-18;
export declare const EPS19 = 1e-19;
export declare const EPS20 = 1e-20;
/**
 * The log function returns the power to which the base value has to be raised to produce n.
 * @function
 * @param {number} n - Produce value.
 * @param {number} base - Base value.
 * @returns {number} -
 * @example
 * log(64, 2)
 * //returns 6
 */
export declare function log(n: number, base: number): number;
/**
 * Clamp the number.
 * @function
 * @param {number} number - Input number.
 * @param {number} min - Minimal edge.
 * @param {number} max - Maximal edge.
 * @returns {number} -
 * @example
 * clamp(12, 1, 5)
 * //returns 5
 */
export declare function clamp(number: number, min: number, max: number): number;
/**
 * Converts degrees value to radians.
 * @function
 * @param {number} degrees - Degree value.
 * @returns {number} -
 */
export declare function DEG2RAD(degrees: number): number;
/**
 * Converts radians value to degrees.
 * @function
 * @param {number} angle - Degree value.
 * @returns {number} -
 */
export declare function RAD2DEG(angle: number): number;
/**
 * Check the number is a power of two.
 * @function
 * @param {number} x - Input value.
 * @returns {boolean} -
 */
export declare function isPowerOfTwo(x: number): boolean;
/**
 * Returns next value that is power of two.
 * @function
 * @param {number} x - Input value.
 * @param {number} [maxValue=4096] - Maximal value.
 * @returns {number} -
 */
export declare function nextHighestPowerOfTwo(x: number, maxValue?: number): number;
/**
 * Returns random integer number within the bounds.
 * @function
 * @param {number} min - Minimal bound.
 * @param {number} max - Maximal bound.
 * @returns {number} -
 */
export declare function randomi(min?: number, max?: number): number;
/**
 * Returns random number within the bounds.
 * @function
 * @param {number} [min=0] - Minimal bound.
 * @param {number} [max=1] - Maximal bound.
 * @returns {number} -
 */
export declare function random(min?: number, max?: number): number;
/**
 * Converts degrees value to decimal.
 * @function
 * @param {number} d - Degrees.
 * @param {number} m - Minutes.
 * @param {number} s - Seconds.
 * @param {boolean} [p] - Positive flag. False - default.
 * @returns {number} -
 **/
export declare function degToDec(d: number, m: number, s: number, p: number): number;
/**
 * The modulo operation that also works for negative dividends.
 * @function
 * @param {number} m - The dividend.
 * @param {number} n - The divisor.
 * @returns {number} The remainder.
 */
export declare function mod(m: number, n: number): number;
/**
 * Returns an angle in the range 0 <= angle <= 2Pi which is equivalent to the provided angle.
 * @function
 * @param {number} a - Angle in radians
 * @returns {number} -
 */
export declare function zeroTwoPI(a: number): number;
/**
 * Returns 0.0 if x is smaller than edge and otherwise 1.0.
 * @function
 * @param {number} edge -
 * @param {number} x - Value to edge.
 * @returns {number} -
 */
export declare function step(edge: number, x: number): number;
/**
 * The frac function returns the fractional part of x, i.e. x minus floor(x).
 * @function
 * @param {number} x - Input value.
 * @returns {number} -
 */
export declare function frac(x: number): number;
/**
 * Returns Math.log(x) / Math.log(2)
 * @function
 * @param {number} x - Input value.
 * @returns {number} -
 */
export declare function log2(x: number): number;
/**
 * Returns two power of n.
 * @function
 * @param {number} n - Power value.
 * @returns {number} -
 */
export declare function exp2(n: number): number;
/**
 * Returns two power of integer n.
 * @function
 * @param {number} n - Integer power value.
 * @returns {number} -
 */
export declare function pow2i(n: number): number;
/**
 * Returns a slice of linear interpolation t * (h1 - h0)
 * @param {number} t - A value that linearly interpolates between the h0 parameter and the h1 parameter.
 * @param {number} h1 - End value.
 * @param {number} h0 - Start value.
 * @returns {number} -
 */
export declare function slice(t: number, h1: number, h0: number): number;
/**
 * Performs a linear interpolation.
 * @function
 * @param {number} t - A value that linearly interpolates between the h0 parameter and the h1 parameter.
 * @param {number} h1 - End value.
 * @param {number} h0 - Start value.
 * @returns {number} -
 */
export declare function lerp(t: number, h1: number, h0: number): number;
export declare function cube(f: number): number;
export declare function square(f: number): number;
export declare function bezier1v(t: number, p0: number, p1: number, p2: number, p3: number): number;
/**
 * Performs a 3D bezier interpolation.
 * @function
 * @param {number} t - Interpolation value.
 * @param {Vec3} p0 - First control point.
 * @param {Vec3} p1 - Second control point.
 * @param {Vec3} p2 - Third control point.
 * @param {Vec3} p3 - Fourth control point.
 * @returns {Vec3} -
 */
export declare function bezier3v(t: number, p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3): Vec3;
/**
 * Clamp angle value within 360.
 * @function
 * @param {number} x - Input angle.
 * @returns {number} -
 */
export declare function rev(x: number): number;
/**
 * Clamp longitude within: -180 to +180 degrees.
 * @function
 * @param {number} lon - Longitude.
 * @returns {number} -
 */
export declare function norm_lon(lon: number): number;
/**
 * Returns an angle in the range -Pi <= angle <= Pi which is equivalent to the provided angle.
 * @function
 * @param {number} a - Angle in radians.
 * @returns {number} -
 */
export declare function negativePItoPI(a: number): number;
/**
 * Solve using iteration method and a fixed number of steps.
 * @function
 * @param {Function} f - Equation. Used in Euler's equation(see og.orbit) solving.
 * @param {number} x0 - First approximation.
 * @param {number} maxIter - Maximum iterations.
 * @returns {number} -
 */
export declare function solve_iteration_fixed(f: (x: number) => number, x0: number, maxIter: number): number;
/**
 * Solve using iteration; terminate when error is below err or the maximum
 * number of iterations is reached. Used in Euler's equation(see og.orbit) solving.
 * @function
 * @param {(x: number) => number} f - Equation.
 * @param {number} x0 - First approximation.
 * @param {number} err - Maximal accepted error value.
 * @param {number} maxIter - Maximum iterations.
 * @returns {number} -
 */
export declare function solve_iteration(f: (x: number) => number, x0: number, err: number, maxIter?: number): number;
/**
 * Returns angle between two azimuths
 * @param {number} a - First azimuth angle
 * @param {number} b - Second azimuth angle
 * @returns {number}
 */
export declare function getAngleBetweenAzimuths(a: number, b: number): number;
