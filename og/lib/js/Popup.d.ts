import { EventsHandler } from "./Events";
import { LonLat } from "./LonLat";
import { Planet } from "./scene/Planet";
import { NumberArray2, Vec2 } from "./math/Vec2";
import { NumberArray3, Vec3 } from "./math/Vec3";
import { View, IViewParams, ViewEventsList } from './ui/View';
interface IPopupParams extends IViewParams {
    planet: Planet;
    title?: string;
    className?: string;
    visibility?: boolean;
    content?: string;
    offset?: NumberArray2;
    lonLat?: LonLat | NumberArray2 | NumberArray3;
}
type PopupEventsList = ["open", "close"];
declare class Popup extends View<null> {
    events: EventsHandler<PopupEventsList> & EventsHandler<ViewEventsList>;
    $content: HTMLElement | null;
    $tip: HTMLElement | null;
    $title: HTMLElement | null;
    protected _content: string | HTMLElement | null;
    protected _planet: Planet;
    protected _offset: NumberArray2;
    protected _lonLat: LonLat;
    protected _cartPos: Vec3;
    protected _visibility: boolean;
    constructor(options: IPopupParams);
    _updatePosition(): void;
    setScreen(p: Vec2): void;
    get clientWidth(): number;
    get clientHeight(): number;
    setOffset(x?: number, y?: number): this;
    render(params?: any): this;
    setVisibility(visibility: boolean): this;
    getContainer(): HTMLElement | null;
    getToolbarContainer(): HTMLElement;
    show(): this;
    hide(): this;
    setCartesian3v(cart: Vec3, height?: number): this;
    setTitle(html: string): void;
    setLonLat(lonLat: LonLat): void;
    setContent(content?: string | HTMLElement | null): void;
    clear(): void;
}
export { Popup };
