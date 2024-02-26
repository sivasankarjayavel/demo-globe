import { Control, IControlParams } from './Control';
import { LonLat } from '../LonLat';
import { IMouseState } from "../renderer/RendererEvents";
interface IEarthCoordinatesParams extends IControlParams {
    heightMode?: string;
    centerMode?: boolean;
    altitudeUnit?: string;
    type?: number;
}
/**
 * Control displays mouse or screen center Earth coordinates.
 * @param {Boolean} [options.center] - Earth coordinates by screen center otherwise mouse pointer. False is default.
 * @param {Boolean} [options.type] - Coordinates shown: 0 - is decimal degrees, 1 - degrees, 2 - mercator geodetic coordinates.
 */
export declare class EarthCoordinates extends Control {
    protected _type: number;
    protected _TYPE_FUNC: ((ll?: LonLat | null) => void)[];
    protected _showFn: ((ll?: LonLat | null) => void) | null;
    protected _lonLat: LonLat | null;
    protected _latSideEl: HTMLElement | null;
    protected _lonSideEl: HTMLElement | null;
    protected _latValEl: HTMLElement | null;
    protected _lonValEl: HTMLElement | null;
    protected _heightEl: HTMLElement | null;
    protected _altUnitVal: string;
    protected _heightModeVal: string;
    protected _altUnit: number;
    protected _heightMode: number;
    protected _centerMode: boolean;
    protected _el: HTMLElement | null;
    constructor(options?: IEarthCoordinatesParams);
    protected _SHOW_DECIMAL(ll?: LonLat | null): void;
    protected _SHOW_DEGREE(ll?: LonLat | null): void;
    protected _createCenterEl(): HTMLElement;
    protected _updateUnits(): void;
    protected _refreshCoordinates(): void;
    oninit(): void;
    protected _grabCoordinates(e: IMouseState): void;
    protected _showHeight(): Promise<void>;
}
export {};
