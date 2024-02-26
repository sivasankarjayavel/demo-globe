import { Button, IButtonParams, ButtonEventsList } from './Button';
import { EventsHandler } from "../Events";
import { ViewEventsList } from "./View";
interface IToggleButtonParams extends IButtonParams {
    isActive?: boolean;
    preventClick?: boolean;
}
type ToggleButtonEventsList = ["change"];
declare class ToggleButton extends Button {
    events: EventsHandler<ToggleButtonEventsList> & EventsHandler<ButtonEventsList> & EventsHandler<ViewEventsList>;
    protected _isActive: boolean;
    preventClick: boolean;
    constructor(options: IToggleButtonParams);
    setActive(isActive: boolean, stopPropagation?: boolean): void;
    protected _toggle(): void;
    get isActive(): boolean;
    render(params: any): this;
    protected _onMouseClick: (e: MouseEvent) => void;
}
export { ToggleButton };
