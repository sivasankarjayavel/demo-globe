import { QueueArray } from '../QueueArray';
export type HTMLImageElementExt = HTMLImageElement & {
    __nodeIndex?: number;
    atlasWidth?: number;
    atlasHeight?: number;
};
export type ImagesCacheManagerCallback = (image: HTMLImageElementExt) => void;
interface IImagesCacheRequest {
    "src": string;
    "success": ImagesCacheManagerCallback;
}
declare class ImagesCacheManager {
    imagesCache: Record<string, HTMLImageElementExt>;
    protected _counter: number;
    protected _pendingsQueue: QueueArray<IImagesCacheRequest>;
    protected _imageIndexCounter: number;
    constructor();
    load(src: string, success: ImagesCacheManagerCallback): void;
    protected _exec(req: IImagesCacheRequest): void;
    protected _dequeueRequest(): void;
}
export { ImagesCacheManager };
