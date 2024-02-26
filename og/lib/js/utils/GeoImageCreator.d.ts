import { BaseGeoImage } from "../layer/BaseGeoImage";
import { Framebuffer } from '../webgl/Framebuffer';
import { LonLat } from '../LonLat';
import { Planet } from "../scene/Planet";
import { WebGLBufferExt, WebGLTextureExt } from "../webgl/Handler";
export declare class GeoImageCreator {
    MAX_FRAMES: number;
    protected _gridSize: number;
    protected _planet: Planet;
    _framebuffer: Framebuffer | null;
    protected _framebufferMercProj: Framebuffer | null;
    _texCoordsBuffer: WebGLBufferExt | null;
    _indexBuffer: WebGLBufferExt | null;
    protected _currentFrame: number;
    protected _queue: BaseGeoImage[];
    protected _animate: BaseGeoImage[];
    protected _quadTexCoordsBuffer: WebGLBufferExt | null;
    protected _quadVertexBuffer: WebGLTextureExt | null;
    constructor(planet: Planet, maxFrames?: number);
    init(): void;
    /**
     * Creates geoImage corners coordinates grid buffer.
     * @public
     * @param{Array.<LonLat>} c - GeoImage corners coordinates.
     * @param{boolean} [toMerc=false] - Transform to web mercator.
     * @return{WebGLBuffer} Grid coordinates buffer.
     */
    createGridBuffer(c: LonLat[], toMerc?: boolean): [WebGLBufferExt, WebGLBufferExt];
    frame(): void;
    add(geoImage: BaseGeoImage): void;
    remove(geoImage: BaseGeoImage): void;
    protected _initBuffers(): void;
    protected _initShaders(): void;
}
