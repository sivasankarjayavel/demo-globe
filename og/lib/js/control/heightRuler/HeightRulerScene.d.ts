import { Entity } from '../../entity/Entity';
import { LonLat } from "../../LonLat";
import { RulerScene, IRulerSceneParams } from "../ruler/RulerScene";
import { Vector } from "../../layer/Vector";
import { Vec3 } from "../../math/Vec3";
interface IHeightRulerSceneParams extends IRulerSceneParams {
}
declare class HeightRulerScene extends RulerScene {
    protected _geoRulerLayer: Vector;
    protected _heightLabels: Entity[];
    protected _rayH: Entity;
    protected _rayV: Entity;
    constructor(options?: IHeightRulerSceneParams);
    setVisibility(visibility: boolean): void;
    get deltaLabel(): Entity;
    get startLabel(): Entity;
    get endLabel(): Entity;
    get corners(): Entity[];
    get startCorner(): Entity;
    get endCorner(): Entity;
    get startCornerLonLat(): LonLat;
    get startCornerHeight(): number;
    get endCornerLonLat(): LonLat;
    get endCornerHeight(): number;
    get maxHeightCornerLonLat(): LonLat;
    get minHeightCornerLonLat(): LonLat;
    get deltaHeight(): number;
    _drawLine(startLonLat: LonLat, endLonLat: LonLat, startPos?: Vec3): void;
    protected _updateHeightRaysAndLabels(): Promise<void>;
    clear(): void;
    _createCorners(): void;
    init(): void;
    frame(): void;
}
export { HeightRulerScene };
