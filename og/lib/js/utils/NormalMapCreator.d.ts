import { Framebuffer } from "../webgl/Framebuffer";
import { Lock, Key } from "../Lock";
import { Planet } from "../scene/Planet";
import { QueueArray } from "../QueueArray";
import { Segment } from "../segment/Segment";
import { WebGLBufferExt, WebGLTextureExt, Handler } from "../webgl/Handler";
interface INormalMapCreatorParams {
    minTableSize?: number;
    maxTableSize?: number;
    width?: number;
    height?: number;
}
export declare class NormalMapCreator {
    protected _minTabelSize: number;
    protected _maxTableSize: number;
    protected _planet: Planet;
    protected _handler: Handler | null;
    protected _verticesBufferArray: WebGLBufferExt[];
    protected _indexBufferArray: WebGLBufferExt[];
    protected _positionBuffer: WebGLBufferExt | null;
    protected _framebuffer: Framebuffer | null;
    protected _normalMapVerticesTexture: WebGLTextureExt | null;
    protected _width: number;
    protected _height: number;
    protected _queue: QueueArray<Segment>;
    protected _lock: Lock;
    constructor(planet: Planet, options?: INormalMapCreatorParams);
    get width(): number;
    get height(): number;
    init(): void;
    protected _drawNormalMapBlur(segment: Segment): boolean;
    protected _drawNormalMapNoBlur(segment: Segment): boolean;
    protected _drawNormalMap(segment: Segment): boolean;
    drawSingle(segment: Segment): void;
    frame(): void;
    get queueSize(): number;
    queue(segment: Segment): void;
    unshift(segment: Segment): void;
    remove(segment: Segment): void;
    clear(): void;
    /**
     * Set activity off
     * @public
     */
    lock(key: Key): void;
    /**
     * Set activity on
     * @public
     */
    free(key: Key): void;
}
export {};
