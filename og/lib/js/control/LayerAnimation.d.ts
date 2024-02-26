import { EventsHandler } from '../Events';
import { Layer } from '../layer/Layer';
import { Control, IControlParams } from "./Control";
type LayerAnimationEventsList = ["change", "idle", "play", "pause", "stop"];
interface ILayerAnimationParams extends IControlParams {
    layers?: Layer;
    playInterval?: number;
    frameSize?: number;
    repeat?: boolean;
    skipTimeout?: number;
}
export declare class LayerAnimation extends Control {
    events: EventsHandler<LayerAnimationEventsList>;
    protected _layersArr: Layer[];
    protected _currentIndex: number;
    protected _playInterval: number;
    protected _playIntervalHandler: any;
    protected _playIndex: number;
    protected _frameSize: number;
    repeat: boolean;
    skipTimeout: number;
    protected _timeoutStart: number;
    protected _currVisibleIndex: number;
    constructor(options?: ILayerAnimationParams);
    protected _onViewchange: () => void;
    protected _getFramesNum(): number;
    protected _setFrame(frameIndex: number): void;
    protected _getFrameIndex(layerIndex: number): number;
    protected _appendFrameToPlanet(frameIndex: number): void;
    protected _removeFrameFromPlanet(frameIndex: number): void;
    oninit(): void;
    onactivate(): void;
    ondeactivate(): void;
    protected _onVisibilityChange: (isVisible: boolean) => void;
    clear(): void;
    protected _initLayers(): void;
    setLayers(layers: Layer[]): void;
    appendLayer(layer: Layer): void;
    /**
     * warning: Use XYZ.isIdle in requestAnimationFrame(after setVisibility)
     * @returns Returns true if current layer is idle
     */
    get isIdle(): boolean;
    get playInterval(): number;
    set playInterval(val: number);
    get isPlaying(): boolean;
    get layers(): Layer[];
    protected _checkEnd(): void;
    play(): void;
    stop(): void;
    pause(): void;
    protected _clearInterval(): void;
    /**
     * Waiting for the current index layer loadend and make it non-transparent,
     * and make prev layer transparent, also check previous frame index to clean up.
     */
    private _onLayerLoadend;
    /**
     * Function sets layer index visible.
     * @param {number} index
     * @param {boolean} [stopPropagation=false]
     */
    setCurrentIndex(index: number, stopPropagation?: boolean): void;
    /**
     * Function sets layer index visible. If the layer is idle (all visible tiles loaded), sets opacity to one,
     * otherwise to ZERO it means that when all visible tiles will be loaded the opacity becomes ONE. So, previous
     * layer remains not transparent (opacity = 1) till current layer is loading.
     */
    protected _setCurrentIndexAsync(index: number, forceVisibility?: boolean, stopPropagation?: boolean): void;
}
export {};
