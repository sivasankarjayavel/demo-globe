import { Ellipsoid } from "./ellipsoid/Ellipsoid";
import { LonLat } from "./LonLat";
/**
 * Represents geographical coordinates extent.
 * @class
 * @param {LonLat} [sw] - South West extent corner coordinates.
 * @param {LonLat} [ne] - North East extent corner coordinates.
 */
export declare class Extent {
    southWest: LonLat;
    northEast: LonLat;
    constructor(sw?: LonLat, ne?: LonLat);
    /**
     * Creates extent instance from values in array.
     * @static
     * @param {Array.<number>} arr - South west and north-east longitude and latitudes packed in array. (exactly 4 entries)
     * @return {Extent} Extent object.
     */
    static createFromArray(arr: [number, number, number, number]): Extent;
    /**
     * Creates bound extent instance by coordinate array.
     * @static
     * @param {Array.<LonLat>} arr - Coordinate array.
     * @return {Extent} Extent object.
     */
    static createByCoordinates(arr: LonLat[]): Extent;
    /**
     * Creates bound extent instance by coordinates array.
     * @static
     * @param {Array.<Array<number>>} arr - Coordinate array. (exactly 2 entries)
     * @return {Extent} Extent object.
     */
    static createByCoordinatesArr(arr: [number, number][]): Extent;
    /**
     * Creates extent by merсator grid tile coordinates.
     * @static
     * @param {number} x -
     * @param {number} y -
     * @param {number} z -
     * @param {number} width -
     * @param {number} height -
     * @returns {Extent} -
     */
    static fromTile(x: number, y: number, z: number, width?: number, height?: number): Extent;
    /**
     * Sets current bounding extent object by coordinate array.
     * @public
     * @param {Array.<LonLat>} arr - Coordinate array.
     * @return {Extent} Current extent.
     */
    setByCoordinates(arr: LonLat[]): Extent;
    /**
     * Determines if point inside extent.
     * @public
     * @param {LonLat} lonlat - Coordinate point.
     * @return {boolean} Returns true if point inside extent.
     */
    isInside(lonlat: LonLat): boolean;
    /**
     * Returns true if two extent overlap each other.
     * @public
     * @param {Extent} e - Another extent.
     * @return {boolean} -
     */
    overlaps(e: Extent): boolean;
    /**
     * Gets extent width.
     * @public
     * @return {number} Extent width.
     */
    getWidth(): number;
    /**
     * Gets extent height.
     * @public
     * @return {number} Extent height.
     */
    getHeight(): number;
    /**
     * Creates clone instance of the current extent.
     * @public
     * @return {Extent} Extent clone.
     */
    clone(): Extent;
    /**
     * Gets the center coordinate of the extent.
     * @public
     * @return {number} Center coordinate.
     */
    getCenter(): LonLat;
    /**
     * @public
     */
    getNorthWest(): LonLat;
    /**
     * @public
     */
    getNorthEast(): LonLat;
    /**
     * @public
     */
    getSouthWest(): LonLat;
    /**
     * @public
     */
    getSouthEast(): LonLat;
    /**
     * @public
     */
    getNorth(): number;
    getEast(): number;
    /**
     * @public
     */
    getWest(): number;
    /**
     * @public
     */
    getSouth(): number;
    /**
     * Returns extents are equals.
     * @param {Extent} extent - Extent.
     * @returns {boolean} -
     */
    equals(extent: Extent): boolean;
    /**
     * Converts extent coordinates to mercator projection coordinates.
     * @public
     * @return {Extent} New instance of the current extent.
     */
    forwardMercator(): Extent;
    /**
     * Converts extent coordinates from mercator projection to degrees.
     * @public
     * @return {Extent} New instance of the current extent.
     */
    inverseMercator(): Extent;
    /**
     * Gets cartesian bounding bounds of the current ellipsoid.
     * @public
     * @param {Ellipsoid} ellipsoid - Ellipsoid.
     * @return {Array.<number>} Cartesian 3d coordinate array. (exactly 6 entries)
     */
    getCartesianBounds(ellipsoid: Ellipsoid): [number, number, number, number, number, number];
    toString(): string;
}
