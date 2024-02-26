import { Vec2 } from "../../math/Vec2";
import { Vec3 } from "../../math/Vec3";
import { PolygonDrawingScene, IPolygonDrawingSceneParams } from "./PolygonDrawingScene";
declare class LineStringDrawingScene extends PolygonDrawingScene {
    constructor(props: IPolygonDrawingSceneParams);
    get geometryType(): string;
    protected _addNew(cart: Vec3): void;
    protected _appendCart(cart: Vec3): void;
    protected _clearGhostPointer(): void;
    protected _moveCorner(indexCurrent: number, indexPrev: number, indexCenter: number): void;
    protected _moveCornerPoint(e: Vec2): void;
    _updateGhostOutlinePointer(groundPos: Vec3): void;
    protected _initGhostLayerPointer(): void;
}
export { LineStringDrawingScene };
