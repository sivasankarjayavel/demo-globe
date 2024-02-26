import { GlobusTerrain, IGlobusTerrainParams } from "./GlobusTerrain";
import { Segment } from "../segment/Segment";
import { Extent } from "../Extent";
import { TypedArray } from "../utils/shared";
interface IBilTerrainParams extends IGlobusTerrainParams {
    layers?: string;
    imageSize?: number;
}
declare class BilTerrain extends GlobusTerrain {
    protected _format: string;
    protected _layers: string;
    protected _imageSize: number;
    constructor(options?: IBilTerrainParams);
    isBlur(segment: Segment): boolean;
    protected _createUrl(segment: Segment): string;
    protected _createHeights(data: number[], tileIndex: string, tileX: number, tileY: number, tileZoom: number, extent: Extent, preventChildren: boolean): TypedArray | number[];
}
export { BilTerrain };
