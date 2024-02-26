import { Control, IControlParams } from './Control';
import { Layer } from "../layer/Layer";
import { ToggleButton } from "../ui/ToggleButton";
import { IMouseState } from "../renderer/RendererEvents";
interface IGeoImageDragControlParams extends IControlParams {
}
export declare class GeoImageDragControl extends Control {
    protected _cornerIndex: number;
    protected _catchCorner: boolean;
    protected _toggleBtn: ToggleButton;
    constructor(options?: IGeoImageDragControlParams);
    oninit(): void;
    onactivate(): void;
    ondeactivate(): void;
    _bindLayer(layer: Layer): void;
    protected _unbindLayer(layer: Layer): void;
    protected _onLUp(ms: IMouseState): void;
    protected _onLDown(ms: IMouseState): void;
    protected _onMouseLeave(): void;
    protected _onMouseMove(ms: IMouseState): void;
}
export {};
