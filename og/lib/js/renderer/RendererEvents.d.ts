import { Events, EventsHandler, EventCallback } from "../Events";
import { KeyboardHandler } from "../input/KeyboardHandler";
import { MouseHandler, MouseHandlerEvent, MouseEventExt } from "../input/MouseHandler";
import { Renderer } from "./Renderer";
import { TouchEventExt, TouchHandler } from "../input/TouchHandler";
import { Vec2 } from "../math/Vec2";
import { Vec3 } from "../math/Vec3";
export type RendererEventsHandler = RendererEvents & EventsHandler<RendererEventsType>;
export declare function createRendererEvents(renderer: Renderer): RendererEvents;
export type RendererEventsType = [
    "draw",
    "postdraw",
    "resize",
    "resizeend",
    "mouseenter",
    "mouseleave",
    "mousemove",
    "mousestop",
    "lclick",
    "rclick",
    "mclick",
    "ldblclick",
    "rdblclick",
    "mdblclick",
    "lup",
    "rup",
    "mup",
    "ldown",
    "rdown",
    "mdown",
    "lhold",
    "rhold",
    "mhold",
    "mousewheel",
    "touchstart",
    "touchend",
    "touchcancel",
    "touchmove",
    "doubletouch",
    "touchleave",
    "touchenter"
];
export interface IBaseInputState {
    /** Current screen mouse X position. */
    clientX: number;
    /** Current screen mouse Y position. */
    clientY: number;
    /** Current screen mouse position. */
    pos: Vec2;
    /** Current touch X - coordinate. */
    x: number;
    /** Current touch Y - coordinate. */
    y: number;
    /** Current touch X - coordinate from 0 to 1 */
    nx: number;
    /** Current touch Y - coordinate from 0 to 1 */
    ny: number;
    /** Previous touch X coordinate. */
    prev_x: number;
    /** Previous touch Y coordinate. */
    prev_y: number;
    /** Screen touch position world direction. */
    direction: Vec3;
    /** Current touched(picking) object. */
    pickingObject: any | null;
    /** Renderer instance. */
    renderer: Renderer;
    /** Touching is moving now. */
    moving: boolean;
}
export interface IMouseState extends IBaseInputState {
    /** Left mouse button has stopped pushing down right now.*/
    leftButtonUp: boolean;
    /** Right mouse button has stopped pushing down right now.*/
    rightButtonUp: boolean;
    /** Middle mouse button has stopped pushing down right now.*/
    middleButtonUp: boolean;
    /** Left mouse button has pushed now.*/
    leftButtonDown: boolean;
    /** Right mouse button has pushed now.*/
    rightButtonDown: boolean;
    /** Middle mouse button has pushed now.*/
    middleButtonDown: boolean;
    /** Left mouse button is pushing.*/
    leftButtonHold: boolean;
    /** Right mouse button is pushing.*/
    rightButtonHold: boolean;
    /** Middle mouse button is pushing.*/
    middleButtonHold: boolean;
    /** Left mouse button has clicked twice now.*/
    leftButtonDoubleClick: boolean;
    /** Right mouse button has clicked twice now.*/
    rightButtonDoubleClick: boolean;
    /** Middle mouse button has clicked twice now.*/
    middleButtonDoubleClick: boolean;
    /** Left mouse button has clicked now. */
    leftButtonClick: boolean;
    /** Right mouse button has clicked now. */
    rightButtonClick: boolean;
    /** Middle mouse button has clicked now. */
    middleButtonClick: boolean;
    /** Mouse has just stopped now. */
    justStopped: boolean;
    /** Mose double click delay response time.*/
    doubleClickDelay: number;
    /** Mose click delay response time.*/
    clickDelay: number;
    /** Mouse wheel. */
    wheelDelta: number;
    /** JavaScript mouse system event message. */
    sys: MouseEvent | null;
}
export interface ITouchState extends IBaseInputState {
    /** Touch has ended right now.*/
    touchEnd: boolean;
    /** Touch has started right now.*/
    touchStart: boolean;
    /** Touch canceled.*/
    touchCancel: boolean;
    /** Touched twice.*/
    doubleTouch: boolean;
    /** Double touching responce delay.*/
    doubleTouchDelay: number;
    /** Double touching responce radius in screen pixels.*/
    doubleTouchRadius: number;
    /** JavaScript mouse system event message. */
    sys: TouchEventExt | null;
}
/**
 * Renderer events handler.
 * @class
 * @param {Renderer} renderer - Renderer object, events that works for.
 */
declare class RendererEvents extends Events<RendererEventsType> implements RendererEventsHandler {
    /**
     * Assigned renderer.
     * @public
     * @type {Renderer}
     */
    renderer: Renderer;
    /**
     * Low level touch events handler.
     * @protected
     * @type {TouchHandler}
     */
    protected _touchHandler: TouchHandler;
    /**
     * Low level mouse events handler.
     * @protected
     * @type {MouseHandler}
     */
    protected _mouseHandler: MouseHandler;
    /**
     * Low level keyboard events handler.
     * @protected
     * @type {KeyboardHandler}
     */
    protected _keyboardHandler: KeyboardHandler;
    protected _active: boolean;
    clickRadius: number;
    /**
     * Current mouse state.
     * @public
     * @type {IMouseState}
     */
    mouseState: IMouseState;
    /**
     * Current touch state.
     * @public
     * @type {ITouchState}
     */
    touchState: ITouchState;
    protected _dblTchCoords: Vec2;
    protected _oneTouchStart: boolean;
    protected _dblTchBegins: number;
    protected _mousestopThread: any | null;
    protected _ldblClkBegins: number;
    protected _rdblClkBegins: number;
    protected _mdblClkBegins: number;
    protected _lClkBegins: number;
    protected _rClkBegins: number;
    protected _mClkBegins: number;
    protected _lclickX: number;
    protected _lclickY: number;
    protected _rclickX: number;
    protected _rclickY: number;
    protected _mclickX: number;
    protected _mclickY: number;
    protected _isMouseInside: boolean;
    protected _entityPickingEventsActive: boolean;
    constructor(renderer: Renderer);
    pointerEvent(): boolean;
    get active(): boolean;
    set active(isActive: boolean);
    /**
     * Used in render node frame.
     * @public
     */
    handleEvents(): void;
    on(name: string, p0: EventCallback | number, p1?: number | EventCallback, p2?: any, keyPriority?: number): void;
    off(name: string, p1?: EventCallback | number | null, p2?: EventCallback): void;
    /**
     * Check key is pressed.
     * @public
     * @param {number} keyCode - Key code
     * @return {boolean}
     */
    isKeyPressed(keyCode: number): boolean;
    releaseKeys(): void;
    /**
     * Renderer events initialization.
     * @public
     */
    initialize(): void;
    /**
     * @protected
     */
    protected onMouseWheel(event: MouseEventExt): void;
    updateButtonsStates(buttons: number): void;
    protected onMouseMove(sys: MouseEvent, event?: MouseHandlerEvent): void;
    protected onMouseLeave(sys: MouseEvent): void;
    protected onMouseEnter(sys: MouseEvent): void;
    protected onMouseDown(sys: MouseEvent, event?: MouseHandlerEvent): void;
    protected onMouseUp(sys: MouseEvent, event?: MouseHandlerEvent): void;
    protected onTouchStart(event: TouchEventExt): void;
    /**
     * @protected
     */
    protected onTouchEnd(event: TouchEventExt): void;
    protected onTouchCancel(event: TouchEventExt): void;
    protected onTouchMove(event: TouchEventExt): void;
    protected entityPickingEvents(): void;
    protected handleMouseEvents(): void;
    /**
     * @protected
     */
    protected handleTouchEvents(): void;
}
export { RendererEvents };
