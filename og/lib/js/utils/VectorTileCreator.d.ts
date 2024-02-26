import { Framebuffer } from '../webgl/Framebuffer';
import { Handler } from "../webgl/Handler";
import { Material } from "../layer/Material";
import { Planet } from "../scene/Planet";
export declare class VectorTileCreator {
    protected _width: number;
    protected _height: number;
    protected _planet: Planet;
    protected _framebuffer: Framebuffer | null;
    protected _queue: Material[];
    protected _handler: Handler | null;
    constructor(planet: Planet, width?: number, height?: number);
    init(): void;
    frame(): void;
    add(material: Material): void;
    remove(material: Material): void;
    get queueSize(): number;
}
