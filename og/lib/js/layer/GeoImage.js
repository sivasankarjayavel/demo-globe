import { nextHighestPowerOfTwo } from "../math";
import { BaseGeoImage } from "./BaseGeoImage";
import { isImageLoaded } from "../utils/shared";
/**
 * Used to load and display a single image over specific corner coordinates on the globe.
 * @class
 * @extends {BaseGeoImage}
 */
class GeoImage extends BaseGeoImage {
    constructor(name, options = {}) {
        super(name, options);
        this._image = options.image || null;
        this._src = options.src || null;
        this._onLoad_ = null;
    }
    get instanceName() {
        return "GeoImage";
    }
    abortLoading() {
        if (this._image instanceof HTMLImageElement) {
            this._image.src = "";
        }
    }
    /**
     * Sets image source url path.
     * @public
     * @param {string} srs - Image url path.
     */
    setSrc(src) {
        this._planet && this._planet._geoImageCreator.remove(this);
        this._src = src;
        this._sourceReady = false;
        this._sourceCreated = false;
        this._image = new Image();
        this._image.crossOrigin = "Anonymous";
        this._onLoad_ = this._onLoad.bind(this);
        this._image.addEventListener("load", this._onLoad_);
        this._image.src = src;
    }
    /**
     * Sets image object.
     * @public
     * @param {Image} image - Image object.
     */
    setImage(image) {
        this._planet && this._planet._geoImageCreator.remove(this);
        this._sourceCreated = false;
        this._sourceReady = false;
        this._image = image;
        this._image.crossOrigin = "Anonymous";
        this._src = image.src;
        if (isImageLoaded(this._image)) {
            this._applyImage(this._image);
        }
        else {
            this._onLoad_ = this._onLoad.bind(this);
            this._image.addEventListener("load", this._onLoad_);
        }
    }
    /**
     * Creates source gl texture.
     * @virtual
     * @protected
     */
    _createSourceTexture() {
        if (!this._sourceCreated && this._image) {
            this._sourceTexture = this._planet.renderer.handler.createTexture_l(this._image);
            this._sourceCreated = true;
        }
    }
    _onLoad(ev) {
        this._applyImage(this._image);
        if (this._image instanceof HTMLImageElement) {
            this._image.removeEventListener("load", this._onLoad_);
        }
        this._onLoad_ = null;
    }
    _applyImage(img) {
        if (img) {
            this._frameWidth = nextHighestPowerOfTwo(img.width * 2, 4096);
            this._frameHeight = nextHighestPowerOfTwo(img.height * 3, 4096);
            this._sourceReady = true;
            if (this._planet) {
                this._planet._geoImageCreator.add(this);
            }
        }
    }
    /**
     * Loads planet segment material. In this case - GeoImage source image.
     * @public
     * @param {Material} material - GeoImage planet material.
     */
    loadMaterial(material) {
        material.isLoading = true;
        this._creationProceeding = true;
        if (!this._sourceReady && this._src) {
            if (this._image) {
                if (this._image instanceof HTMLImageElement) {
                    if (isImageLoaded(this._image)) {
                        this._applyImage(this._image);
                    }
                    else {
                        this._onLoad_ = this._onLoad.bind(this);
                        this._image.addEventListener("load", this._onLoad_);
                    }
                }
            }
            else {
                this._image = new Image();
                this._image.crossOrigin = "Anonymous";
                this._onLoad_ = this._onLoad.bind(this);
                this._image.addEventListener("load", this._onLoad_);
                this._image.src = this._src;
            }
        }
        else if (this._planet) {
            this._planet._geoImageCreator.add(this);
        }
    }
    /**
     * @public
     * @param {Material} material - GeoImage material.
     */
    abortMaterialLoading(material) {
        if (this._image && this._image instanceof HTMLImageElement) {
            this._image.src = "";
        }
        this._creationProceeding = false;
        material.isLoading = false;
        material.isReady = false;
    }
}
export { GeoImage };
