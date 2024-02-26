import { ImageCanvas } from "../ImageCanvas";
import { Rectangle } from "../Rectangle";
import { ImagesCacheManager, HTMLImageElementExt, ImagesCacheManagerCallback } from "./ImagesCacheManager";
import { Handler, WebGLTextureExt } from "../webgl/Handler";
/**
 * Texture atlas stores images in one texture. Each image has its own
 * atlas texture coordinates.
 * @class
 * @param {number} [width=1024] - Texture atlas width, if it hasn't 1024 default.
 * @param {number} [height=1024] - Texture atlas height, if it hasn't 1024 default.
 */
declare class TextureAtlas {
    /**
     * Atlas nodes where input images store. It can be accessed by image.__nodeIndex.
     * @public
     * @type {Map<number, TextureAtlasNode>}
     */
    nodes: Map<number, TextureAtlasNode>;
    /**
     * Created gl texture.
     * @public
     */
    texture: WebGLTextureExt | null;
    /**
     * Atlas canvas.
     * @public
     * @type {ImageCanvas}
     */
    canvas: ImageCanvas;
    borderSize: number;
    protected _handler: Handler | null;
    protected _images: HTMLImageElementExt[];
    protected _btree: TextureAtlasNode | null;
    protected _imagesCacheManager: ImagesCacheManager;
    constructor(width?: number, height?: number);
    /**
     * Returns atlas javascript image object.
     * @public
     * @returns {HTMLImageElement} -
     */
    getImage(): HTMLImageElement;
    /**
     * Returns canvas object.
     * @public
     * @returns {HTMLCanvasElement} -
     */
    getCanvas(): HTMLCanvasElement;
    /**
     * Clear atlas with black.
     * @public
     */
    clearCanvas(): void;
    /**
     * Sets openglobus gl handler that creates gl texture.
     * @public
     * @param {Handler} handler - WebGL handler.
     */
    assignHandler(handler: Handler): void;
    /**
     * Returns image diagonal size.
     * @param {HTMLImageElementExt} image - Image object.
     * @returns {number} -
     */
    getDiagonal(image: HTMLImageElementExt): number;
    /**
     * Adds image to the atlas and returns created node with texture coordinates of the stored image.
     * @public
     * @param {HTMLImageElementExt} image - Input javascript image object.
     * @param {boolean} [fastInsert] - If it's true atlas doesn't restore all images again
     * and store image in the current atlas scheme.
     * @returns {TextureAtlasNode | undefined} -
     */
    addImage(image: HTMLImageElementExt, fastInsert?: boolean): TextureAtlasNode | undefined;
    protected _completeNode(nodes: Map<number, TextureAtlasNode>, node?: TextureAtlasNode | null): void;
    /**
     * Main atlas making function.
     * @protected
     * @param {boolean} [fastInsert] - If it's true atlas doesn't restore all images again
     * and store image in the current atlas scheme.
     */
    protected _makeAtlas(fastInsert?: boolean): void;
    get(key: number): TextureAtlasNode | undefined;
    set(key: number, value: TextureAtlasNode): void;
    /**
     * Creates atlas gl texture.
     * @public
     */
    createTexture(img?: HTMLImageElement | null, internalFormat?: number): void;
    /**
     * Asynchronous function that loads and creates image to the image cache, and call success callback when it's done.
     * @public
     * @param {string} src - Image object src string.
     * @param {ImagesCacheManagerCallback} success - The callback that handles the image loads done.
     */
    loadImage(src: string, success: ImagesCacheManagerCallback): void;
    getImageTexCoordinates(img: HTMLImageElementExt): number[] | undefined;
}
/**
 * Atlas binary tree node.
 * @class
 * @param {Rectangle} rect - Node image rectangle.
 * @param {number[]} texCoords - Node image rectangle.
 */
declare class TextureAtlasNode {
    childNodes: TextureAtlasNode[] | null;
    image: HTMLImageElementExt | null;
    rect: Rectangle;
    texCoords: number[];
    atlas: TextureAtlas | null;
    constructor(rect?: Rectangle, texCoords?: number[]);
    insert(img: HTMLImageElementExt): TextureAtlasNode | undefined;
}
export { TextureAtlas, TextureAtlasNode };
