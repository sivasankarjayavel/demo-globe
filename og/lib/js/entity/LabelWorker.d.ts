import { BaseWorker } from "../utils/BaseWorker";
import { Label } from "../entity/Label";
import { LabelHandler } from "../entity/LabelHandler";
export declare const LOCK_UPDATE = -2;
export declare const LOCK_FREE = -1;
interface LabelInfo {
    label: Label;
    handler: LabelHandler;
}
declare class LabelWorker extends BaseWorker<LabelInfo> {
    constructor(numWorkers?: number);
    protected _onMessage(e: MessageEvent): void;
    make(data: LabelInfo): void;
}
export { LabelWorker };
