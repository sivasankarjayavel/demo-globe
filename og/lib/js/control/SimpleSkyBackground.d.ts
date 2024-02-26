import { Control, IControlParams } from "./Control";
interface ISimpleSkyBackgroundParams extends IControlParams {
}
export declare class SimpleSkyBackground extends Control {
    protected _colorOne: Float32Array;
    protected _colorTwo: Float32Array;
    constructor(options?: ISimpleSkyBackgroundParams);
    set colorOne(htmlColor: string);
    set colorTwo(htmlColor: string);
    oninit(): void;
    onactivate(): void;
    ondeactivate(): void;
    protected _drawBackground(): void;
}
export {};
