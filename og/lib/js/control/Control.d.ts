import { Planet, Renderer } from "../index";
export interface IControlParams {
    name?: string;
    autoActivate?: boolean;
}
/**
 * Base control class. All other controls extend from this class.
 * @class Control
 * @param {Boolean} [options.autoActivate=true] - If true - calls initialize function after the renderer assigning.
 */
export declare class Control {
    static __counter__: number;
    protected __id: number;
    protected _name: string;
    /**
     * Control activity.
     * @protected
     * @type {boolean}
     */
    protected _active: boolean;
    /**
     * Control initialized.
     * @protected
     * @type {boolean}
     */
    protected _initialized: boolean;
    planet: Planet | null;
    /**
     * Assigned renderer.
     * @public
     * @type {Renderer}
     */
    renderer: Renderer | null;
    /**
     * Auto activation flag.
     * @public
     * @type {boolean}
     */
    autoActivate: boolean;
    protected _deferredActive: boolean;
    constructor(options?: IControlParams);
    /**
     * Returns control name.
     * @public
     * @return {string} -
     */
    get name(): string;
    /**
     * Control initialization function have to be overridden.
     * @public
     */
    oninit(): void;
    /**
     * Control renderer assigning function have to be overridden.
     * @public
     */
    onadd(): void;
    /**
     * Control remove function have to be overridden.
     * @public
     */
    onremove(): void;
    /**
     * Control activation function have to be overridden.
     * @public
     */
    onactivate(): void;
    /**
     * Control deactivation function have to be overriden.
     * @public
     */
    ondeactivate(): void;
    /**
     * Assign renderer to the control.
     * @public
     * @type {Renderer}
     */
    addTo(renderer: Renderer): void;
    /**
     * Removes control.
     * @public
     */
    remove(): void;
    /**
     * Activate control.
     * @public
     */
    activate(): void;
    /**
     * Deactivate control.
     * @public
     */
    deactivate(): void;
    /**
     * Is control active.
     * @public
     */
    isActive(): boolean;
    isEqual(control: Control): boolean;
}
