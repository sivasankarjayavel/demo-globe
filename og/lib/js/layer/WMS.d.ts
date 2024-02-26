import { Extent } from "../Extent";
import { Segment } from "../segment/Segment";
import { XYZ, IXYZParams } from "./XYZ";
interface IWMSParams extends IXYZParams {
    extra?: any;
    layers: string;
    imageWidth?: number;
    imageHeight?: number;
    version?: string;
}
/**
 * Used to display WMS services as tile layers on the globe.
 * @class
 * @extends {XYZ}
 * @param {string} name - Layer name.
 * @param {Object} options - Options:
 * @param {number} [options.opacity=1.0] - Layer opacity.
 * @param {number} [options.minZoom=0] - Minimal visibility zoom level.
 * @param {number} [options.maxZoom=0] - Maximal visibility zoom level.
 * @param {string} [options.attribution] - Layer attribution that displayed in the attribution area on the screen.
 * @param {boolean} [options.isBaseLayer=false] - Base layer flag.
 * @param {boolean} [options.visibility=true] - Layer visibility.
 * @param {string} options.url - WMS url source.
 * @param {number} [options.width=256] - Tile width.
 * @param {number} [options.height=256] - Tile height.
 * @param {string} options.layers - WMS layers string.
 * @param {string} [options.version="1.1.1"] - WMS version.
 * @param {Object} extra  - Extra parameters (by WMS reference or by WMS service vendors) to pass to WMS service.
 * @example:
 * new og.layer.WMS("USA States", {
 *     isBaseLayer: false,
 *     url: "http://openglobus.org/geoserver/",
 *     layers: "topp:states",
 *     opacity: 0.5,
 *     zIndex: 50,
 *     attribution: 'USA states - geoserver WMS example',
 *     version: "1.1.1",
 *     visibility: false }, {
 *     transparent: true,
 *     sld: "style.sld"}
 * );
 */
declare class WMS extends XYZ {
    protected _extra: string;
    /**
     * WMS layers string.
     * @public
     * @type {string}
     */
    layers: string;
    /**
     * WMS tile width.
     * @public
     * @type {number}
     */
    imageWidth: number;
    /**
     * WMS tile height.
     * @public
     * @type {number}
     */
    imageHeight: number;
    protected _getBbox: (extent: Extent) => string;
    protected _version: string;
    constructor(name: string | null, options: IWMSParams);
    static createRequestUrl(url: string, layers: string, format: string | undefined, version: string | undefined, request: string | undefined, srs: string, bbox: string, width?: number, height?: number, extra?: string): string;
    static get_bbox_v1_1_1(extent: Extent): string;
    static get_bbox_v1_3_0(extent: Extent): string;
    _checkSegment(segment: Segment): boolean;
    get instanceName(): string;
    protected _createUrl(segment: Segment): string;
    setVersion(version?: string): void;
    _correctFullExtent(): void;
}
export { WMS };
