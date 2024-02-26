/**
 * @module og/utils/shared
 */
import { Extent } from "../Extent";
import { LonLat } from "../LonLat";
import { Vec2 } from "../math/Vec2";
import { NumberArray2 } from "../math/Vec2";
import { NumberArray3, Vec3 } from "../math/Vec3";
import { NumberArray4, Vec4 } from "../math/Vec4";
export declare function getDefault(param?: any, def?: any): boolean;
export declare function isEmpty(v: any): boolean;
/**
 * Returns true if the object pointer is undefined.
 * @function
 * @param {Object} obj - Object pointer.
 * @returns {boolean} Returns true if object is undefined.
 */
export declare function isUndef(obj?: any): boolean;
export declare function isUndefExt(obj: any, defVal: any): any;
export declare function stamp(obj: any): number;
export declare function isString(s: any): boolean;
/**
 * Convert html color string to the RGBA number vector.
 * @param {string} htmlColor - HTML string("#C6C6C6" or "#EF5" or "rgb(8,8,8)" or "rgba(8,8,8)") color.
 * @param {number} [opacity] - Opacity for the output vector.
 * @returns {Vec4} -
 */
export declare function htmlColorToRgba(htmlColor: string, opacity?: number): Vec4;
export declare function htmlColorToFloat32Array(htmlColor: string, opacity?: number): Float32Array;
/**
 * Convert html color string to the RGB number vector.
 * @param {string} htmlColor - HTML string("#C6C6C6" or "#EF5" or "rgb(8,8,8)" or "rgba(8,8,8)") color.
 * @returns {Vec3} -
 */
export declare function htmlColorToRgb(htmlColor: string): Vec3;
/**
 * Replace template substrings between '{' and '}' tokens.
 * @param {string} template - String with templates in "{" and "}"
 * @param {Object} params - Template named object with subsrtings.
 * @returns {string} -
 *
 * @example <caption>Example from og.terrain that replaces tile indexes in url:</caption>
 * var substrings = {
 *       "x": 12,
 *       "y": 15,
 *       "z": 8
 * }
 * og.utils.stringTemplate("http://earth3.openglobus.org/{z}/{y}/{x}.ddm", substrings);
 * //returns http://earth3.openglobus.org/8/15/12.ddm
 */
export declare function stringTemplate(template: string, params?: any): string;
export declare function getHTML(template: string, params?: any): string;
export declare function parseHTML(htmlStr: string): HTMLElement[];
export declare function print2d(id: string, text: string, x: number, y: number): void;
export declare function defaultString(str?: string, def?: string): string;
export declare function createVector3(v?: Vec3 | Vec2 | NumberArray3 | NumberArray2 | null, def?: Vec3): Vec3;
export declare function createVector4(v?: Vec4 | NumberArray4 | null, def?: Vec4): Vec4;
export declare function createColorRGBA(c?: string | NumberArray4 | Vec4 | null, def?: Vec4): Vec4;
export declare function createColorRGB(c?: string | NumberArray3 | Vec3 | null, def?: Vec3): Vec3;
export declare function createExtent(e?: Extent | [[number, number], [number, number]] | null, def?: Extent): Extent;
export declare function createLonLat(l?: LonLat | NumberArray2 | NumberArray3, def?: LonLat): LonLat;
export declare function binarySearchFast(arr: number[] | TypedArray, x: number): number;
/**
 * Finds an item in a sorted array.
 * @param {any[]} ar The sorted array to search.
 * @param {any} el The item to find in the array.
 * @param {Function} compare_fn comparator The function to use to compare the item to
 *        elements in the array.
 * @returns {number} a negative number  if 'a' is less than 'b'; 0 if 'a' is equal to 'b'; 'a' positive number of 'a' is greater than 'b'.
 *
 * @example
 * // Create a comparator function to search through an array of numbers.
 * function comparator(a, b) {
 *     return a - b;
 * };
 * var numbers = [0, 2, 4, 6, 8];
 * var index = og.utils.binarySearch(numbers, 6, comparator); // 3
 */
export declare function binarySearch(ar: any[], el: any, compare_fn: Function): number;
/**
 * Binary insertion that uses binarySearch algorithm.
 * @param {any[]} ar - The sorted array to insert.
 * @param {any} el - The item to insert.
 * @param {Function} compare_fn - comparator The function to use to compare the item to
 *        elements in the array.
 * @returns {number} Array index position in which item inserted in.
 */
export declare function binaryInsert(ar: any[], el: any, compare_fn: Function): number;
/**
 * Returns two segment lines intersection coordinate.
 * @static
 * @param {Vec2} start1 - First line first coordinate.
 * @param {Vec2} end1 - First line second coordinate.
 * @param {Vec2} start2 - Second line first coordinate.
 * @param {Vec2} end2 - Second line second coordinate.
 * @param {boolean} [isSegment] - Lines are segments.
 * @return {Vec2} - Intersection coordinate.
 */
export declare function getLinesIntersection2v(start1: Vec2, end1: Vec2, start2: Vec2, end2: Vec2, isSegment: boolean): Vec2 | undefined;
/**
 * Returns two segment lines intersection coordinate.
 * @static
 * @param {Vec2} start1 - First line first coordinate.
 * @param {Vec2} end1 - First line second coordinate.
 * @param {Vec2} start2 - Second line first coordinate.
 * @param {Vec2} end2 - Second line second coordinate.
 * @param {boolean} [isSegment=false] - Lines are segments.
 * @return {Vec2} - Intersection coordinate.
 */
export declare function getLinesIntersectionLonLat(start1: LonLat, end1: LonLat, start2: LonLat, end2: LonLat, isSegment?: boolean): LonLat | undefined;
/**
 * Converts XML to JSON
 * @static
 * @param {Object} xml - Xml object
 * @return {Object} - Json converted object.
 */
export declare function xmlToJson(xml: any): any;
export declare const castType: {
    string: (v: any) => any;
    date: (v: any) => any;
    datetime: (v: any) => any;
    time: (v: any) => any;
    integer: (v: any) => any;
    float: (v: any) => any;
    boolean: (str: any) => any;
};
export declare function base64toBlob(base64Data: string, contentType?: string): Blob;
export declare function base64StringToBlog(string: string): Blob;
/**
 * Callback throttling
 * @param {any} func
 * @param {Number} limit
 * @param {boolean} [skip]
 */
export declare function throttle(func: Function, limit: number, skip?: boolean): () => void;
/**
 *
 * y2-----Q12--------------Q22---
 * |       |     |          |
 * |       |     |          |
 * y-------|-----P----------|----
 * |       |     |          |
 * |       |     |          |
 * |       |     |          |
 * |       |     |          |
 * |       |     |          |
 * y1-----Q11----|---------Q21---
 *         |     |          |
 *         |     |          |
 *         x1    x          x2
 *
 *
 * @param {Number} x -
 * @param {Number} y -
 * @param {Number} fQ11 -
 * @param {Number} fQ21 -
 * @param {Number} fQ12 -
 * @param {Number} fQ22 -
 * @param {Number} [x1=0.0] -
 * @param {Number} [x2=1.0] -
 * @param {Number} [y1=0.0] -
 * @param {Number} [y2=1.0] -
 */
export declare function blerp(x: number, y: number, fQ11: number, fQ21: number, fQ12: number, fQ22: number, x1?: number, x2?: number, y1?: number, y2?: number): number;
export declare function blerp2(x: number, y: number, fQ11: number, fQ21: number, fQ12: number, fQ22: number): number;
export declare function extractElevationTiles(rgbaData: number[] | TypedArray, outCurrenElevations: number[] | TypedArray, outChildrenElevations: number[][][] | TypedArray[][]): void;
export type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
/**
 * Concatenates two the same type arrays
 * @param {TypedArray} a
 * @param {TypedArray | number[]} b
 */
export declare function concatTypedArrays(a: TypedArray, b: TypedArray | number[]): TypedArray;
/**
 * Concatenates two the same  arrays
 * @param {TypedArray | number[]} [a=[]] - First array
 * @param {TypedArray | number[]} [b=[]] - Second array
 * @return {TypedArray | number[]} -
 */
export declare function concatArrays(a?: TypedArray | number[], b?: TypedArray | number[]): TypedArray | number[];
/**
 * Convert simple array to typed
 * @param arr {number[]}
 * @param ctor {Float32Array}
 * @returns {TypedArray}
 */
export declare function makeArrayTyped(arr: TypedArray | number[], ctor?: Function): any;
/**
 * Convert typed array to array
 * @param arr {TypedArray | number[]}
 * @returns {number[]}
 */
export declare function makeArray(arr: TypedArray | number[]): number[];
/**
 *
 * @param {TypedArray | Array} arr
 * @param {Number} starting
 * @param {Number} deleteCount
 * @param {{ result: number[] }} [out]
 */
export declare function spliceArray(arr: TypedArray | number[], starting: number, deleteCount: number, out?: {
    result: number[];
} | {
    result: TypedArray;
}): TypedArray | number[];
/**
 *
 * @param {TypedArray} arr
 * @param {Number} starting
 * @param {Number} deleteCount
 * @param {{ result: TypedArray }} [out]
 */
export declare function spliceTypedArray<T extends TypedArray>(arr: T, starting: number, deleteCount: number, out?: {
    result: T;
}): T;
/**
 * Returns 64-bit triangle coordinate array from inside of the source triangle array.
 * @static
 * @param {TypedArray | number[]} sourceArr - Source array
 * @param {number} gridSize - Source array square matrix size
 * @param {number} i0 - First row index source array matrix
 * @param {number} j0 - First column index
 * @param {number} size - Square matrix result size.
 * @return {Float64Array} Triangle coordinates array from the source array.
 * @TODO: optimization
 */
export declare function getMatrixSubArray64(sourceArr: TypedArray | number[], gridSize: number, i0: number, j0: number, size: number): Float64Array;
/**
 * Returns 32-bit triangle coordinate array from inside of the source triangle array.
 * @static
 * @param {TypedArray | number[]} sourceArr - Source array
 * @param {number} gridSize - Source array square matrix size
 * @param {number} i0 - First row index source array matrix
 * @param {number} j0 - First column index
 * @param {number} size - Square matrix result size.
 * @return {Float32Array} Triangle coordinates array from the source array.
 */
export declare function getMatrixSubArray32(sourceArr: TypedArray | number[], gridSize: number, i0: number, j0: number, size: number): Float32Array;
/**
 * Returns two float32 triangle coordinate arrays from inside of the source triangle array.
 * @static
 * @param {Array.<number>} sourceArr - Source array
 * @param {number} gridSize - Source array square matrix size
 * @param {number} i0 - First row index source array matrix
 * @param {number} j0 - First column index
 * @param {number} size - Square matrix result size.
 * @param {object} outBounds - Output bounds.
 * @return{Array.<number>} Triangle coordinates array from the source array.
 * @TODO: optimization
 */
export declare function getMatrixSubArrayBoundsExt(sourceArr: TypedArray | number[], sourceArrHigh: TypedArray | number[], sourceArrLow: TypedArray | number[], noDataVertices: TypedArray | number[] | undefined, gridSize: number, i0: number, j0: number, size: number, outArr: TypedArray | number[], outArrHigh: TypedArray | number[], outArrLow: TypedArray | number[], outBounds: any, outNoDataVertices: TypedArray | number[]): void;
export declare function cloneArray(items: any[]): any[];
/**
 * Promise for load images
 * @function
 * @param {string} url - link to image.
 * @returns {Promise<Image>} Returns promise.
 */
export declare function loadImage(url: string): Promise<HTMLImageElement>;
/**
 * Gets image is loaded
 * @param {HTMLImageElement} image
 * @returns {boolean} Returns true is the image is loaded
 */
export declare function isImageLoaded(image: HTMLImageElement): boolean;
export declare function distanceFormat(v: number): string;
export declare function distanceFormatExt(v: number): [string, string];
export declare function getUrlParam(paramName: string): number | undefined;
