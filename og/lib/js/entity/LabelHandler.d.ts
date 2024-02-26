import { Label } from "./Label";
import { BaseBillboardHandler } from "./BaseBillboardHandler";
import { EntityCollection } from "./EntityCollection";
import { WebGLBufferExt } from "../webgl/Handler";
import { Vec3 } from "../math/Vec3";
import { Vec4 } from "../math/Vec4";
type LabelWorkerCallbackData = {
    vertexArr: Float32Array;
    texCoordArr: Float32Array;
    gliphParamArr: Float32Array;
    positionHighArr: Float32Array;
    positionLowArr: Float32Array;
    sizeArr: Float32Array;
    offsetArr: Float32Array;
    rgbaArr: Float32Array;
    rotationArr: Float32Array;
    fontIndexArr: Float32Array;
    outlineArr: Float32Array;
    outlineColorArr: Float32Array;
    pickingColorArr: Float32Array;
};
declare class LabelHandler extends BaseBillboardHandler {
    protected _billboards: Label[];
    protected _gliphParamBuffer: WebGLBufferExt | null;
    protected _fontIndexBuffer: WebGLBufferExt | null;
    protected _outlineBuffer: WebGLBufferExt | null;
    protected _outlineColorBuffer: WebGLBufferExt | null;
    protected _gliphParamArr: Float32Array;
    protected _fontIndexArr: Float32Array;
    protected _outlineArr: Float32Array;
    protected _outlineColorArr: Float32Array;
    _maxLetters: number;
    constructor(entityCollection: EntityCollection, maxLetters?: number);
    initProgram(): void;
    get labels(): Label[];
    add(label: Label): void;
    updateFonts(): void;
    protected _addLabelToArrays(label: Label): void;
    assignFontAtlas(label: Label): void;
    workerCallback(data: LabelWorkerCallbackData, label: Label): void;
    clear(): void;
    protected _deleteBuffers(): void;
    _displayPASS(): void;
    protected _pickingPASS(): void;
    protected _removeBillboard(label: Label): void;
    setText(index: number, text: string, fontIndex: number, align: number, isRTL?: boolean): void;
    setPositionArr(index: number, positionHigh: Vec3, positionLow: Vec3): void;
    setPickingColorArr(index: number, color: Vec3): void;
    setSizeArr(index: number, size: number): void;
    setOffsetArr(index: number, offset: Vec3): void;
    setRgbaArr(index: number, rgba: Vec4): void;
    setOutlineColorArr(index: number, rgba: Vec4): void;
    setOutlineArr(index: number, outline: number): void;
    setRotationArr(index: number, rotation: number): void;
    setVisibility(index: number, visibility: boolean): void;
    setVertexArr(index: number, vertexArr: number[] | Float32Array): void;
    setFontIndexArr(index: number, fontIndex: number): void;
    createSizeBuffer(): void;
    createFontIndexBuffer(): void;
    createTexCoordBuffer(): void;
    createOutlineBuffer(): void;
    createOutlineColorBuffer(): void;
    setMaxLetters(c: number): void;
}
export { LabelHandler };
