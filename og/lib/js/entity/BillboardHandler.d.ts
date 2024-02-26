import { BaseBillboardHandler } from "./BaseBillboardHandler";
import { Billboard } from "./Billboard";
import { EntityCollection } from "./EntityCollection";
/**
 * @class BillboardHandler
 */
declare class BillboardHandler extends BaseBillboardHandler {
    protected _billboards: Billboard[];
    constructor(props: EntityCollection);
    add(billboard: Billboard): void;
    protected _addBillboardToArrays(billboard: Billboard): void;
    get billboards(): Billboard[];
    refreshTexCoordsArr(): void;
}
export { BillboardHandler };
