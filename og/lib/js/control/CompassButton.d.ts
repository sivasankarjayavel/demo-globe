import { Control, IControlParams } from "./Control";
interface ICompasButtonParams extends IControlParams {
}
/**
 * Planet compass button
 */
export declare class CompassButton extends Control {
    protected _heading: number;
    protected _svg: HTMLElement | null;
    constructor(options?: ICompasButtonParams);
    oninit(): void;
    protected _onClick(): void;
    protected _draw(): void;
    setHeading(heading: number): void;
}
export {};
