import { Control, IControlParams } from "./Control";
import { Dialog } from "../ui/Dialog";
import { ToggleButton } from "../ui/ToggleButton";
import { CanvasTiles } from "../layer/CanvasTiles";
export interface IDebugInfoWatch {
    label: string;
    valEl?: HTMLElement;
    frame?: () => string | number;
}
interface IDebugInfoParams extends IControlParams {
    watch?: IDebugInfoWatch[];
}
export declare class DebugInfo extends Control {
    el: HTMLElement | null;
    protected _watch: IDebugInfoWatch[];
    protected _toggleBtn: ToggleButton;
    protected _dialog: Dialog<null>;
    protected _canvasTiles: CanvasTiles;
    constructor(options?: IDebugInfoParams);
    addWatches(watches: IDebugInfoWatch[]): void;
    addWatch(watch: IDebugInfoWatch): void;
    oninit(): void;
    protected _frame(): void;
}
export {};
