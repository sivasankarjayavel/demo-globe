import { BaseGeoImage, IBaseGeoImageParams } from "./BaseGeoImage";
import { Material } from "./Material";
interface IGeoImageParams extends IBaseGeoImageParams {
    image?: HTMLImageElement | HTMLCanvasElement | ImageBitmap;
    src?: string;
}
/**
 * Used to load and display a single image over specific corner coordinates on the globe.
 * @class
 * @extends {BaseGeoImage}
 */
declare class GeoImage extends BaseGeoImage {
    /**
     * Image object.
     * @protected
     * @type {HTMLImageElement | HTMLCanvasElement | ImageBitmap}
     */
    protected _image: HTMLImageElement | HTMLCanvasElement | ImageBitmap | null;
    /**
     * Image source url path.
     * @protected
     * @type {string}
     */
    protected _src: string | null;
    protected _onLoad_: ((this: HTMLImageElement, ev: Event) => void) | null;
    constructor(name: string | null, options?: IGeoImageParams);
    get instanceName(): string;
    abortLoading(): void;
    /**
     * Sets image source url path.
     * @public
     * @param {string} srs - Image url path.
     */
    setSrc(src: string): void;
    /**
     * Sets image object.
     * @public
     * @param {Image} image - Image object.
     */
    setImage(image: HTMLImageElement): void;
    /**
     * Creates source gl texture.
     * @virtual
     * @protected
     */
    protected _createSourceTexture(): void;
    protected _onLoad(ev: Event): void;
    protected _applyImage(img: HTMLImageElement | HTMLCanvasElement | ImageBitmap | null): void;
    /**
     * Loads planet segment material. In this case - GeoImage source image.
     * @public
     * @param {Material} material - GeoImage planet material.
     */
    loadMaterial(material: Material): void;
    /**
     * @public
     * @param {Material} material - GeoImage material.
     */
    abortMaterialLoading(material: Material): void;
}
export { GeoImage };
