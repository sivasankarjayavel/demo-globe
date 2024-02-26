import { Extent } from "./Extent";
import { LonLat } from './LonLat';
/**
 * Mercator size.
 * @const
 * @type {number}
 */
export declare const POLE = 20037508.34;
export declare const POLE2: number;
export declare const PI_BY_POLE: number;
export declare const POLE_BY_PI: number;
export declare const POLE_BY_180: number;
export declare const INV_POLE_BY_180: number;
/**
 * Double mercator size.
 * @const
 * @type {number}
 */
export declare const POLE_DOUBLE: number;
/**
 * One by mercator double size.
 * @const
 * @type {number}
 */
export declare const ONE_BY_POLE_DOUBLE: number;
export declare function forward(lonLat: LonLat): LonLat;
/**
 * Converts degrees longitude to mercator coordinate.
 * @function
 * @param {number} lon - Degrees geodetic longitude.
 * @returns {number} -
 */
export declare function forward_lon(lon: number): number;
/**
 * Converts degrees latitude to mercator coordinate.
 * @function
 * @param {number} lat - Degrees geodetic latitude.
 * @returns {number} -
 */
export declare function forward_lat(lat: number): number;
/**
 * Converts mercator longitude to degrees coordinate.
 * @function
 * @param {number} lon - Mercator longitude.
 * @returns {number} -
 */
export declare function inverse_lon(lon: number): number;
/**
 * Converts mercator latitude to degrees coordinate.
 * @function
 * @param {number} lon - Mercator latitude.
 * @returns {number} -
 */
export declare function inverse_lat(lat: number): number;
/**
 * Returns mercator map tile grid horizontal coordinate index by geodetic
 * longitude and zoom level. Where top left corner of the grid is 0 coordinate index.
 * @function
 * @param {number} lon - Geodetic degrees longitude.
 * @param {number} zoom - Zoom level.
 * @returns {number}
 */
export declare function getTileX(lon: number, zoom: number): number;
/**
 * Returns mercator map tile grid vertical coordinate index by geodetic
 * latitude and zoom level. Where top left corner of the grid is 0 coordinate index.
 * @function
 * @param {number} lat - Geodetic degrees latitude.
 * @param {number} zoom - Zoom level.
 * @returns {number}
 */
export declare function getTileY(lat: number, zoom: number): number;
/**
 * Converts geodetic coordinate array to mercator coordinate array.
 * @function
 * @param {Array.<LonLat>} lonLatArr - LonLat array to convert.
 * @returns {Array.<LonLat>}
 */
export declare function forwardArray(lonlatArr: LonLat[]): LonLat[];
export declare function getTileExtent(x: number, y: number, z: number): Extent;
/**
 * Max mercator latitude.
 * @const
 * @type {number}
 */
export declare const MAX_LAT: number;
/**
 * Min mercator latitude.
 * @const
 * @type {number}
 */
export declare const MIN_LAT: number;
