import { BaseBillboard, IBaseBillboardParams } from "./BaseBillboard";
import { BillboardHandler } from "./BillboardHandler";
import { HTMLImageElementExt } from "../utils/ImagesCacheManager";
export interface IBillboardParams extends IBaseBillboardParams {
    src?: string;
    image?: HTMLImageElement;
    size?: [number, number];
    width?: number;
    height?: number;
}
/**
 * Represents basic quad billboard image.
 * @class
 * @extends {BaseBillboard}
 * @param {Object} [options] - Options:
 * @param {Vec3|Array.<number>} [options.position] - Billboard spatial position.
 * @param {number} [options.rotation] - Screen angle rotation.
 * @param {Vec4|string|Array.<number>} [options.color] - Billboard color.
 * @param {Vec3|Array.<number>} [options.alignedAxis] - Billboard aligned vector.
 * @param {Vec3|Array.<number>} [options.offset] - Billboard center screen offset.
 * @param {boolean} [options.visibility] - Visibility.
 * @param {string} [options.src] - Billboard image url source.
 * @param {Image} [options.image] - Billboard image object.
 * @param {number} [options.width] - Screen width.
 * @param {number} [options.height] - Screen height.
 * @param {number} [options.scale] - Billboard scale.
 */
declare class Billboard extends BaseBillboard {
    _handler: BillboardHandler | null;
    /**
     * Image src.
     * @protected
     * @type {string}
     */
    protected _src: string | null;
    /**
     * Image object.
     * @protected
     * @type {Object}
     */
    protected _image: HTMLImageElement & {
        __nodeIndex?: number;
    } | null;
    protected _scale: number;
    /**
     * Billboard screen width.
     * @public
     * @type {number}
     */
    _width: number;
    /**
     * Billboard screen height.
     * @public
     * @type {number}
     */
    _height: number;
    constructor(options?: IBillboardParams);
    /**
     * Sets billboard image url source.
     * @public
     * @param {string} src - Image url.
     */
    setSrc(src: string | null): void;
    getSrc(): string | null;
    /**
     * Sets image object.
     * @public
     * @param {Object} image - JavaScript image object.
     */
    setImage(image: HTMLImageElement): void;
    getImage(): HTMLImageElementExt | null;
    /**
     * Sets billboard screen size in pixels.
     * @public
     * @param {number} width - Billboard width.
     * @param {number} height - Billboard height.
     */
    setSize(width: number, height: number): void;
    /**
     * Returns billboard screen size.
     * @public
     * @returns {Object}
     */
    getSize(): {
        width: number;
        height: number;
    };
    /**
     * Sets billboard screen width.
     * @public
     * @param {number} width - Width.
     */
    setWidth(width: number): void;
    /**
     * Gets billboard screen width.
     * @public
     * @returns {number}
     */
    getWidth(): number;
    /**
     * Sets billboard screen heigh.
     * @public
     * @param {number} height - Height.
     */
    setHeight(height: number): void;
    /**
     * Gets billboard screen height.
     * @public
     * @returns {number}
     */
    getHeight(): number;
}
export { Billboard };
