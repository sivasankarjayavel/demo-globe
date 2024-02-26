import { ToggleButton } from "./ToggleButton";
import { EventsHandler } from '../Events';
interface IButtonGroupParams {
    buttons?: ToggleButton[];
}
type ButtonGroupEventsList = ["change"];
declare class ButtonGroup {
    events: EventsHandler<ButtonGroupEventsList>;
    protected _buttons: ToggleButton[];
    constructor(options?: IButtonGroupParams);
    protected _bindButton(button: ToggleButton): void;
    add(button: ToggleButton): void;
    protected _onChange: (isActive: boolean, btn: ToggleButton) => void;
    remove(button: ToggleButton): void;
}
export { ButtonGroup };
