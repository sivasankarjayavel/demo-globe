import { BaseGeoImage, IBaseGeoImageParams } from './BaseGeoImage';
import { Material } from "../layer/Material";
import { WebGLTextureExt } from "../webgl/Handler";
interface IGeoTexture2dParams extends IBaseGeoImageParams {
    texture?: WebGLTextureExt;
    frameWidth?: number;
    frameHeight?: number;
}
declare class GeoTexture2d extends BaseGeoImage {
    constructor(name: string | null, options?: IGeoTexture2dParams);
    get instanceName(): string;
    loadMaterial(material: Material): void;
    bindTexture(texture: WebGLTextureExt): void;
    setSize(width: number, height: number): void;
    abortMaterialLoading(material: Material): void;
}
export { GeoTexture2d };
