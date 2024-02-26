import { TypedArray } from "../utils/shared";
import { EntityCollection } from "./EntityCollection";
import { GeoObject } from "./GeoObject";
import { Planet } from "../scene/Planet";
import { Vec3 } from "../math/Vec3";
import { Vec4 } from "../math/Vec4";
import { WebGLBufferExt, WebGLTextureExt } from "../webgl/Handler";
declare class InstanceData {
    isFree: boolean;
    _geoObjectHandler: GeoObjectHandler;
    geoObjects: GeoObject[];
    numInstances: number;
    _texture: WebGLTextureExt | null;
    _textureSrc: string | null;
    _pitchRollArr: number[] | TypedArray;
    _sizeArr: number[] | TypedArray;
    _vertexArr: number[] | TypedArray;
    _positionHighArr: number[] | TypedArray;
    _positionLowArr: number[] | TypedArray;
    _directionArr: number[] | TypedArray;
    _rgbaArr: number[] | TypedArray;
    _normalsArr: number[] | TypedArray;
    _indicesArr: number[] | TypedArray;
    _pickingColorArr: number[] | TypedArray;
    _visibleArr: number[] | TypedArray;
    _texCoordArr: number[] | TypedArray;
    _pitchRollBuffer: WebGLBufferExt | null;
    _sizeBuffer: WebGLBufferExt | null;
    _vertexBuffer: WebGLBufferExt | null;
    _positionHighBuffer: WebGLBufferExt | null;
    _positionLowBuffer: WebGLBufferExt | null;
    _directionBuffer: WebGLBufferExt | null;
    _rgbaBuffer: WebGLBufferExt | null;
    _normalsBuffer: WebGLBufferExt | null;
    _indicesBuffer: WebGLBufferExt | null;
    _pickingColorBuffer: WebGLBufferExt | null;
    _visibleBuffer: WebGLBufferExt | null;
    _texCoordBuffer: WebGLBufferExt | null;
    _buffersUpdateCallbacks: Function[];
    _changedBuffers: boolean[];
    constructor(geoObjectHandler: GeoObjectHandler);
    createTexture(image: HTMLCanvasElement | ImageBitmap | ImageData | HTMLImageElement): void;
    clear(): void;
    _deleteBuffers(): void;
    createVertexBuffer(): void;
    createPitchRollBuffer(): void;
    createVisibleBuffer(): void;
    createSizeBuffer(): void;
    createTexCoordBuffer(): void;
    createPositionBuffer(): void;
    createRgbaBuffer(): void;
    createDirectionBuffer(): void;
    createNormalsBuffer(): void;
    createIndicesBuffer(): void;
    createPickingColorBuffer(): void;
    refresh(): void;
    update(): void;
}
declare class GeoObjectHandler {
    static __counter__: number;
    protected __id: number;
    /**
     * Picking rendering option.
     * @public
     * @type {boolean}
     */
    pickingEnabled: boolean;
    protected _entityCollection: EntityCollection;
    _planet: Planet | null;
    protected _geoObjects: GeoObject[];
    protected _instanceDataMap: Map<string, InstanceData>;
    protected _instanceDataMapValues: InstanceData[];
    protected _dataTagUpdateQueue: InstanceData[];
    constructor(entityCollection: EntityCollection);
    initProgram(): void;
    setRenderNode(renderNode: Planet): void;
    protected _addGeoObjectToArray(geoObject: GeoObject): void;
    _displayPASS(): void;
    drawPicking(): void;
    protected _pickingPASS(): void;
    _loadDataTagTexture(tagData: InstanceData): Promise<void>;
    setDirectionArr(tagData: InstanceData, tagDataIndex: number, direction: Vec3): void;
    setVisibility(tagData: InstanceData, tagDataIndex: number, visibility: boolean): void;
    setPositionArr(tagData: InstanceData, tagDataIndex: number, positionHigh: Vec3, positionLow: Vec3): void;
    setRgbaArr(tagData: InstanceData, tagDataIndex: number, rgba: Vec4): void;
    setPickingColorArr(tagData: InstanceData, tagDataIndex: number, color: Vec3): void;
    setPitchRollArr(tagData: InstanceData, tagDataIndex: number, pitch: number, roll: number): void;
    setScaleArr(tagData: InstanceData, tagDataIndex: number, scale: number): void;
    protected _updateTag(dataTag: InstanceData): void;
    update(): void;
    _removeAll(): void;
    clear(): void;
    draw(): void;
    add(geoObject: GeoObject): void;
    remove(geoObject: GeoObject): void;
    _clearDataTagQueue(): void;
    _removeGeoObject(geoObject: GeoObject): void;
}
export { GeoObjectHandler, InstanceData };
