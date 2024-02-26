import { Control, IControlParams } from "./Control";
import { Dialog } from '../ui/Dialog';
import { Layer } from "../layer/Layer";
import { Slider } from "../ui/Slider";
import { ToggleButton } from "../ui/ToggleButton";
import { View } from '../ui/View';
interface ILightingParams extends IControlParams {
}
/**
 * Helps to set up lighting.
 */
export declare class Lighting extends Control {
    protected _selectedLayer: Layer | null;
    protected _toggleBtn: ToggleButton;
    protected _dialog: Dialog<null>;
    protected _panel: View<null>;
    protected _atmosphereMaxOpacity: Slider;
    protected _atmosphereMinOpacity: Slider;
    protected _gamma: Slider;
    protected _exposure: Slider;
    protected _night: Slider;
    protected _opacity: Slider;
    protected _diffuse_r: Slider;
    protected _diffuse_g: Slider;
    protected _diffuse_b: Slider;
    protected _ambient_r: Slider;
    protected _ambient_g: Slider;
    protected _ambient_b: Slider;
    protected _specular_r: Slider;
    protected _specular_g: Slider;
    protected _specular_b: Slider;
    protected _shininess: Slider;
    $gamma: HTMLElement | null;
    $exposure: HTMLElement | null;
    $night: HTMLElement | null;
    $opacity: HTMLElement | null;
    $diffuse: HTMLElement | null;
    $ambient: HTMLElement | null;
    $specular: HTMLElement | null;
    $atmosphereOpacity: HTMLElement | null;
    constructor(options?: ILightingParams);
    bindLayer(layer: Layer): void;
    oninit(): void;
    protected _update(): void;
    protected _fetchLayers(): void;
    protected _onLayerAdd(e: Layer): void;
    protected _onLayerRemove(e: Layer): void;
}
export {};
