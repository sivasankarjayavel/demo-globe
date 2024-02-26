import { EventsHandler } from '../../Events';
import { Vec3 } from "../../math/Vec3";
import { Planet } from "../../scene/Planet";
import { LonLat } from "../../LonLat";
export interface ElevationProfileParams {
    planet?: Planet;
}
export interface IProfileData {
    dist: number;
    minY: number;
    maxY: number;
    trackCoords: TrackItem[];
    groundCoords: GroundItem[];
}
export type ElevationProfileDrawData = [TrackItem[], GroundItem[]];
type ElevationProfileEventsList = ["startcollecting", "profilecollected", "clear"];
/**
 * Point types
 */
export declare const SAFE = 0;
export declare const WARNING = 1;
export declare const COLLISION = 2;
type WarningLevel = typeof SAFE | typeof WARNING | typeof COLLISION;
/**
 * 0 - distance, 1 - elevation, 2 - related ground point index
 */
export type TrackItem = [number, number, number];
/**
 * 0 - distance, 1 - elevation, 2 - warning level, 3 - ..., 4 - related track point index
 */
export type GroundItem = [number, number, WarningLevel, number, number];
export declare class ElevationProfile {
    events: EventsHandler<ElevationProfileEventsList>;
    planet: Planet | null;
    protected _warningHeightLevel: number;
    protected _pointsReady: boolean;
    protected _isWarning: boolean;
    protected _planeDistance: number;
    protected _minX: number;
    protected _maxX: number;
    protected _minY: number;
    protected _maxY: number;
    protected _drawData: ElevationProfileDrawData;
    protected _promiseArr: Promise<void | number>[];
    protected _promiseCounter: number;
    protected _pMaxY: number;
    protected _pMinY: number;
    protected _pDist: number;
    protected _pTrackCoords: TrackItem[];
    protected _pGroundCoords: GroundItem[];
    protected _pIndex: number;
    constructor(options?: ElevationProfileParams);
    bindPlanet(planet: Planet): void;
    setWarningHeightLevel(warningHeight?: number): void;
    setRange(minX: number, maxX: number, minY?: number, maxY?: number): void;
    protected _getHeightAsync(ll: LonLat, pIndex: number, promiseCounter: number): Promise<number>;
    protected _collectCoordsBetweenTwoTrackPoints(index: number, internalPoints: number, scaleFactor: number, p0: Vec3, trackDir: Vec3, promiseCounter: number): void;
    protected _collectAllPoints(pointsLonLat: LonLat[], promiseCounter: number): void;
    protected _getGroundElevation(lonLat: LonLat, index: number, promiseCounter: number): void;
    protected _calcPointsAsync(pointsLonLat: LonLat[], promiseCounter: number): Promise<IProfileData>;
    get minX(): number;
    get planeDistance(): number;
    get maxX(): number;
    get minY(): number;
    get maxY(): number;
    get pointsReady(): boolean;
    get isWarningOrCollision(): boolean;
    get drawData(): ElevationProfileDrawData;
    collectProfile(pointsLonLat: LonLat[]): Promise<ElevationProfileDrawData>;
    protected _updatePointType(pIndex: number): void;
    /**
     * @deprecated
     */
    protected _setPointsType(): void;
    clear(): void;
}
export {};
