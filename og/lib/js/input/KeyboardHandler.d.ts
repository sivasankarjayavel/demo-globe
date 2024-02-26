import { EventCallback, EventCallbackStamp } from "../Events";
interface ICallbackHandler {
    callback: EventCallbackStamp;
    sender: any;
    priority: number;
}
declare class KeyboardHandler {
    protected _currentlyPressedKeys: Record<number, boolean>;
    protected _pressedKeysCallbacks: Record<number, ICallbackHandler[]>;
    protected _unpressedKeysCallbacks: Record<number, ICallbackHandler[]>;
    protected _charkeysCallbacks: Record<number, ICallbackHandler[]>;
    protected _anykeyCallback: any;
    protected _event: KeyboardEvent | null;
    protected _active: boolean;
    protected _stampCache: Record<string, number>;
    constructor();
    getcurrentlyPressedKeys(): Record<number, boolean>;
    getPressedKeysCallbacks(): Record<number, ICallbackHandler[]>;
    getUnpressedKeysCallbacks(): Record<number, ICallbackHandler[]>;
    getCharkeysCallbacks(): Record<number, ICallbackHandler[]>;
    removeEvent(event: string, keyCode: number, callback: EventCallback): void;
    protected _removeCallback(handlers: ICallbackHandler[], callback: EventCallbackStamp): void;
    protected _getStamp(name: string, keyCode: number, ogid: number): string;
    protected _stamp(name: string, keyCode: number, obj: any): boolean;
    setActivity(activity: boolean): void;
    releaseKeys(): void;
    addEvent(event: string, keyCode: number, callback: EventCallback, sender?: any, priority?: number): void;
    isKeyPressed(keyCode: number): boolean;
    handleKeyDown(): void;
    handleKeyUp(): void;
    handleEvents(): void;
}
export { KeyboardHandler };
