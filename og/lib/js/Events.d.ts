export type EventCallback = (((...args: any[]) => boolean) | ((...args: any[]) => void));
export type EventCallbackStamp = EventCallback & {
    _openglobus_id?: number;
    _openglobus_priority?: number;
};
type EventCallbacks = Array<EventCallback>;
type EventCallbackHandler = {
    active: boolean;
    handlers: EventCallbacks;
};
export type EventsMap<T extends string[]> = {
    [K in T[number]]?: EventCallbackHandler;
};
export type EventsHandler<T extends string[]> = Events<T> & EventsMap<T>;
export declare function createEvents<T extends string[]>(methodNames: T, sender?: any): EventsHandler<T>;
/**
 * Base events class to handle custom events.
 * @class
 * @param {Array.<string>} [eventNames] - Event names that could be dispatched.
 * @param {*} [sender]
 */
export declare class Events<T extends string[]> {
    static __counter__: number;
    protected __id: number;
    /**
     * Registered event names.
     * @protected
     * @type {T}
     */
    protected _eventNames: T;
    protected _sender: any;
    /**
     * Stop propagation flag
     * @protected
     * @type {boolean}
     */
    protected _stopPropagation: boolean;
    protected _stampCache: any;
    constructor(eventNames: T, sender?: any);
    bindSender(sender?: any): void;
    /**
     * Function that creates event object properties that would be dispatched.
     * @public
     * @param {Array.<string>} eventNames - Specified event names list.
     */
    registerNames(eventNames: T): this;
    protected _getStamp(name: string, id: number, ogid: number): string;
    /**
     * Returns true if event callback has stamped.
     * @protected
     * @param {Object} name - Event identifier.
     * @param {Object} obj - Event callback.
     * @return {boolean} -
     */
    protected _stamp(name: string, obj: any): boolean;
    /**
     * Attach listener.
     * @public
     * @param {string} name - Event name to listen.
     * @param {EventCallback} callback - Event callback function.
     * @param {any} [sender] - Event callback function owner.
     * @param {number} [priority] - Priority of event callback.
     */
    on(name: string, callback: EventCallback, sender?: any, priority?: number): void;
    /**
     * Stop listening event name with specified callback function.
     * @public
     * @param {string} name - Event name.
     * @param {EventCallback | null} callback - Attached  event callback.
     */
    off(name: string, callback?: EventCallback | null): void;
    /**
     * Dispatch event.
     * @public
     * @param {EventCallbackHandler} event - Event instance property that created by event name.
     * @param {Object} [args] - Callback parameters.
     */
    dispatch(event: EventCallbackHandler | undefined, ...args: any[]): boolean;
    /**
     * Brakes events propagation.
     * @public
     */
    stopPropagation(): void;
    /**
     * Removes all events.
     * @public
     */
    clear(): void;
}
export {};
