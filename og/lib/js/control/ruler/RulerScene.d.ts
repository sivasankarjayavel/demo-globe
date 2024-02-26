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
export interface IRulerSceneParams {
    name?: string;
    ignoreTerrain?: boolean;
    planet?: Planet;
}
export declare const distanceFormat: (v: number) => string;
type RulerSceneEventsList = [
    "add",
    "remove",
    "mousemove",
    "mouseenter",
    "mouseleave",
    "lclick",
    "rclick",
    "mclick",
    "ldblclick",
    "rdblclick",
    "mdblclick",
    "lup",
    "rup",
    "mup",
    "ldown",
    "rdown",
    "mdown",
    "lhold",
    "rhold",
    "mhold",
    "mousewheel",
    "touchmove",
    "touchstart",
    "touchend",
    "doubletouch",
    "touchleave",
    "touchenter"
];
declare class RulerScene extends RenderNode {
    events: EventsHandler<RulerSceneEventsList>;
    protected _ignoreTerrain: boolean;
    protected _planet: Planet | null;
    protected _startLonLat: LonLat | null;
    protected _preventClick: boolean;
    protected _stopDrawing: boolean;
    protected _pickedCorner: Entity | null;
    protected _startPos: Vec2 | null;
    protected _startClick: Vec2;
    protected _heading: number;
    protected _trackLayer: Vector;
    protected _labelLayer: Vector;
    protected _cornersLayer: Vector;
    protected _cornerEntity: Entity[];
    protected _propsLabel: Entity;
    protected _trackEntity: Entity;
    protected _anchorLonLat: LonLat | null;
    protected _timeout: any;
    constructor(options?: IRulerSceneParams);
    set ignoreTerrain(v: boolean);
    bindPlanet(planet: Planet): void;
    protected _createCorners(): void;
    init(): void;
    onremove(): void;
    _activate(): void;
    protected _deactivate(): void;
    protected _onCornerLdown: (e: IMouseState) => void;
    protected _onLUp: () => void;
    protected _onCornerLup: () => void;
    protected _onCornerEnter: (e: IMouseState) => void;
    protected _onCornerLeave: (e: IMouseState) => void;
    protected _onLdblclick: () => void;
    setVisibility(visibility: boolean): void;
    protected _onLclick: (e: IMouseState) => void;
    protected _drawLine(startLonLat: LonLat, endLonLat: LonLat, startPos?: Vec3): void;
    protected _onMouseMove: (e: IMouseState) => void;
    clear(): void;
    isCornersPositionChanged(): boolean;
    frame(): void;
    get ellipsoid(): Ellipsoid | null;
}
export { RulerScene };
