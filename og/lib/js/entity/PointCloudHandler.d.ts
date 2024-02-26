import { EntityCollection } from "./EntityCollection";
import { PointCloud } from "./PointCloud";
import { Renderer } from "../renderer/Renderer";
import { RenderNode } from "../scene/RenderNode";
declare class PointCloudHandler {
    static __counter__: number;
    protected __id: number;
    /**
     * Picking rendering option.
     * @public
     * @type {boolean}
     */
    pickingEnabled: boolean;
    /**
     * Parent collection
     * @public
     * @type {EntityCollection}
     */
    _entityCollection: EntityCollection;
    /**
     * Renderer
     * @protected
     * @type {Renderer|null}
     */
    protected _renderer: Renderer | null;
    /**
     * Point cloud array
     * @protected
     * @type {Array.<PointCloud>}
     */
    protected _pointClouds: PointCloud[];
    constructor(entityCollection: EntityCollection);
    protected _initProgram(): void;
    setRenderNode(renderNode: RenderNode): void;
    add(pointCloud: PointCloud): void;
    remove(pointCloud: PointCloud): void;
    protected _reindexPointCloudArray(startIndex: number): void;
    draw(): void;
    drawPicking(): void;
    clear(): void;
}
export { PointCloudHandler };
