import { Entity } from '../../entity/Entity';
import { EventsHandler } from '../../Events';
import { LonLat } from "../../LonLat";
import { Planet } from "../../scene/Planet";
import { RenderNode } from '../../scene/RenderNode';
import { Vector } from '../../layer/Vector';
import { Vec2 } from '../../math/Vec2';
import { Vec3 } from '../../math/Vec3';
import { IMouseState } from "../../renderer/RendererEvents";
import { Ellipsoid } from "../../ellipsoid/Ellipsoid";
export interface IElevationProfileSceneParams {
    name?: string;
    planet?: Planet;
}
declare class ElevationProfileScene extends RenderNode {
    events: EventsHandler<ElevationProfileSceneEventsList>;
    protected _planet: Planet | null;
    protected _trackLayer: Vector;
    protected _groundPointersLayer: Vector;
    protected _columnPointersLayer: Vector;
    protected _headPointersLayer: Vector;
    protected _heightsLayer: Vector;
    protected _trackEntity: Entity;
    protected _pickedGroundEntity: Entity | null;
    protected _pickedHeadEntity: Entity | null;
    protected _pointerLayer: Vector;
    protected _pointerHeadEntity: Entity;
    protected _pointerLabelEntity: Entity;
    protected _pointerRayEntity: Entity;
    protected _startClickPos: Vec2;
    protected _startEntityPos: Vec2;
    protected _clampToGround: boolean;
    constructor(options?: IElevationProfileSceneParams);
    flyExtent(): void;
    get planet(): Planet | null;
    protected _createGroundPointer(groundCart: Vec3, altitude?: number): {
        headEntity: Entity;
        groundEntity: Entity;
        columnEntity: Entity;
        heightLabelEntity: Entity;
    };
    setPointerCartesian3v(p: Vec3, height: number): void;
    bindPlanet(planet: Planet): void;
    init(): void;
    onremove(): void;
    _activate(): void;
    getPointLonLat(index: number): LonLat | undefined;
    getPointsLonLat(): LonLat[];
    getHeightMSL(lonLat: LonLat): number;
    getHeightELLAsync(lonLat: LonLat): Promise<number>;
    addPointLonLatArrayAsync(lonLatArr: LonLat[], stopPropagation?: boolean): Promise<Entity>[];
    addPointLonLatAsync(lonLat: LonLat, stopPropagation?: boolean): Promise<Entity>;
    addGroundPointLonLatAsync(lonLat: LonLat, altitude?: number, stopPropagation?: boolean): Promise<Entity>;
    addGroundPoint3vAsync(groundPos: Vec3, altitude?: number, stopPropagation?: boolean): Promise<Entity>;
    protected _addPoint(groundPos: Vec3, lonLat: LonLat, altitude: number, stopPropagation?: boolean): Promise<Entity>;
    protected _onLClick: (e: IMouseState) => void;
    protected _onMouseMove: (e: IMouseState) => void;
    setHeadPointCartesian3v(entityIndex: number, headPos: Vec3): void;
    setGroundPointCartesian3v(entityIndex: number, groundPos: Vec3): void;
    protected _onLUp: (e: IMouseState) => void;
    protected _onGroundPointerEnter: (e: IMouseState) => void;
    protected _onGroundPointerLeave: (e: IMouseState) => void;
    protected _onGroundPointerLDown: (e: IMouseState) => void;
    protected _onGroundPointerLUp: (e: IMouseState) => void;
    protected _onHeadPointerEnter: (e: IMouseState) => void;
    protected _onHeadPointerLeave: (e: IMouseState) => void;
    protected _onHeadPointerLDown: (e: IMouseState) => void;
    protected _onHeadPointerLUp: (e: IMouseState) => void;
    protected _deactivate(): void;
    setPointerVisibility(visibility: boolean): void;
    setVisibility(visibility: boolean): void;
    clear(): void;
    frame(): void;
    get ellipsoid(): Ellipsoid | null;
}
type ElevationProfileSceneEventsList = [
    "change",
    "addpoint"
];
export { ElevationProfileScene };
