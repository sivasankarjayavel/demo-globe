import { EventsHandler } from '../Events';
import { Planet } from "../scene/Planet";
import { Segment } from "../segment/Segment";
type LoaderEventsList = ["loadend", "layerloadend"];
export interface IResponse {
    status: string;
    data?: any;
    msg?: string;
}
type IResponseCallback = (response: IResponse) => void;
interface Obj<T> {
    __id: number;
    isIdle: boolean;
    isEqual: (obj: T) => boolean;
    events: EventsHandler<any>;
    _planet: Planet | null;
}
type QueryParams<T> = {
    sender?: T;
    src: string;
    type: string;
    filter?: (val: QueryParams<T>) => boolean;
    options?: any;
    segment?: Segment;
};
type QueueData<T> = {
    params: QueryParams<T>;
    callback: IResponseCallback;
};
type RequestCounter<T> = {
    sender: T;
    counter: number;
    __requestCounterFrame__: number;
};
export declare class Loader<T extends Obj<T>> {
    MAX_REQUESTS: number;
    events: EventsHandler<LoaderEventsList>;
    protected _loading: number;
    protected _queue: QueueData<T>[];
    protected _senderRequestCounter: RequestCounter<T>[];
    protected _promises: {
        [key: string]: (r: Response) => Promise<any>;
    };
    constructor(maxRequests?: number);
    load(params: QueryParams<T>, callback: IResponseCallback): void;
    fetch(params: QueryParams<T>): Promise<{
        status: string;
        data: any;
    } | {
        status: string;
        msg: string;
    }>;
    getRequestCounter(sender: T): number;
    isIdle(sender: T): boolean;
    protected _checkLoadend(request: RequestCounter<T>, sender: T): void;
    protected _handleResponse(q: QueueData<T>, response: IResponse): void;
    protected _exec(): Promise<void> | undefined;
    abort(sender: T): void;
    abortAll(): void;
    get loading(): number;
    get queue(): QueueData<T>[];
}
export {};
