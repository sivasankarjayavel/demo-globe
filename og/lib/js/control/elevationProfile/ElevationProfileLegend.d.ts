import { IViewParams, View } from '../../ui/View';
export interface IElevationProfileLegendParams extends IViewParams {
}
export declare class ElevationProfileLegend extends View<null> {
    $groundValue: HTMLElement | null;
    $trackValue: HTMLElement | null;
    $warningValue: HTMLElement | null;
    $collisionValue: HTMLElement | null;
    $trackUnits: HTMLElement | null;
    $groundUnits: HTMLElement | null;
    $warningUnits: HTMLElement | null;
    $collisionUnits: HTMLElement | null;
    constructor(params?: IElevationProfileLegendParams);
    render(params: any): this;
    clear(): void;
    setTrackLength(trackLength: number): void;
    setGroundLength(groundLength: number): void;
    setWarningLength(warningLength: number): void;
    setCollisionLength(collisionLength: number): void;
}
