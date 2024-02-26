import { BaseNode } from "./BaseNode";
/**
 * Render node is a logical part of a render mechanism. Represents scene rendering.
 * For example one scene node for rendering the Earth, another one for rendering the Moon, another node for rendering stars etc.
 * Each render node has own model view space defined with matrices(scale, rotation, translation, transformation).
 * There are collections of light sources, entities and so on in the node.
 * Access to the node is renderer.renderNodes["Earth"]
 * @class
 * @extends {BaseNode}
 * @param {string} name - Node name.
 */
class RenderNode extends BaseNode {
    constructor(name) {
        super(name);
        this.childNodes = [];
        this.renderer = null;
        this.drawMode = 0;
        this.show = true;
        this._isActive = true;
        this.lightEnabled = false;
        this._lights = [];
        this._lightsNames = [];
        this._lightsPositions = [];
        this._lightsParamsv = [];
        this._lightsParamsf = [];
        this.entityCollections = [];
        this._pickingId = -1;
    }
    /**
     * Adds node to the current hierarchy.
     * @public
     * @type {RenderNode}
     */
    addNode(node) {
        super.addNode(node);
        this.renderer && node.assign(this.renderer);
    }
    /**
     * Assign render node with renderer.
     * @public
     * @param {Renderer} renderer - Render node's renderer.
     */
    assign(renderer) {
        this.renderer = renderer;
        this._pickingId = renderer.addPickingCallback(this, this._entityCollectionPickingCallback);
        this.initialize();
    }
    initialize() {
        if (this.renderer && this.renderer.isInitialized()) {
            for (let i = 0; i < this.entityCollections.length; i++) {
                this.entityCollections[i].bindRenderNode(this);
            }
            this.init();
        }
    }
    init() {
        //virtual
    }
    onremove() {
        //virtual
    }
    remove() {
        let r = this.renderer, n = this.name;
        if (r) {
            // TODO: replace to renderer
            if (r.renderNodes[n] && r.renderNodes[n].isEqual(this)) {
                // @ts-ignore
                r.renderNodes[n] = null;
                delete r.renderNodes[n];
            }
            for (let i = 0; i < r._renderNodesArr.length; i++) {
                if (r._renderNodesArr[i].isEqual(this)) {
                    r._renderNodesArr.splice(i, 1);
                    break;
                }
            }
            r.removePickingCallback(this._pickingId);
            this._pickingId = -1;
            this.onremove && this.onremove();
        }
    }
    /**
     * Adds entity collection.
     * @public
     * @param {EntityCollection} entityCollection - Entity collection.
     * @param {boolean} [isHidden] - If it's true that this collection has specific rendering.
     * @returns {RenderNode} -
     */
    addEntityCollection(entityCollection, isHidden) {
        entityCollection.addTo(this, isHidden);
        return this;
    }
    /**
     * Removes entity collection.
     * @public
     * @param {EntityCollection} entityCollection - Entity collection for remove.
     */
    removeEntityCollection(entityCollection) {
        entityCollection.remove();
    }
    /**
     * Adds point light source.
     * @public
     * @param {LightSource} light - Light source.
     * @returns {RenderNode}
     */
    addLight(light) {
        light.addTo(this);
        return this;
    }
    /**
     * Gets light object by its name.
     * @public
     * @param {string} name - Point light name.
     * @returns {LightSource}
     */
    getLightByName(name) {
        let li = this._lightsNames.indexOf(name);
        return this._lights[li];
    }
    /**
     * Removes light source.
     * @public
     * @param {LightSource} light - Light source object.
     */
    removeLight(light) {
        light.remove();
    }
    /**
     * Calls render frame node's callback. Used in renderer.
     * @public
     */
    preDrawNode() {
        this._isActive && this._preDrawNodes();
    }
    /**
     * Calls render frame node's callback. Used in renderer.
     * @public
     */
    drawNode() {
        this._isActive && this._drawNodes();
    }
    /**
     * Gets render node activity.
     * @public
     * @returns {Boolean} -
     */
    isActive() {
        return this._isActive;
    }
    /**
     * Rendering activation.
     * @public
     * @param {boolean} isActive - Activation flag.
     */
    setActive(isActive) {
        this._isActive = isActive;
        if (this.renderer) {
            if (this._isActive && this._pickingId === -1) {
                // This picking callback MUST be the first picking callback
                // in the rendering queue in the renderer. It affects on blending.
                this._pickingId = this.renderer.addPickingCallback(this, this._entityCollectionPickingCallback);
            }
            else if (!this._isActive && this._pickingId !== -1) {
                this.renderer.removePickingCallback(this._pickingId);
                this._pickingId = -1;
            }
        }
        for (let i = 0; i < this.childNodes.length; i++) {
            this.childNodes[i].setActive(isActive);
        }
    }
    /**
     * Sets draw mode
     * @public
     * @param {Number} mode - Draw mode, such as gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.LINES etc.
     */
    setDrawMode(mode) {
        this.drawMode = mode;
        for (let i = 0; i < this.childNodes.length; i++) {
            this.childNodes[i].setDrawMode(mode);
        }
    }
    /**
     * IMPORTANT: This function have to be called manually in each render node frame callback, before drawing scene geometry.
     * @public
     */
    transformLights() {
        for (let i = 0; i < this._lights.length; i++) {
            let ii = i * 3;
            let tp;
            tp = this._lights[i]._position;
            this._lightsPositions[ii] = tp.x;
            this._lightsPositions[ii + 1] = tp.y;
            this._lightsPositions[ii + 2] = tp.z;
        }
        // for (let i = 0; i < this._lights.length; i++) {
        //     var ii = i * 4;
        //     var tp;
        //     if (this._lights[i].directional) {
        //         tp = r.activeCamera._normalMatrix.mulVec(this._lights[i]._position);
        //         this._lightsTransformedPositions[ii + 3] = 0;
        //     } else {
        //         tp = r.activeCamera._viewMatrix.mulVec3(this._lights[i]._position);
        //         this._lightsTransformedPositions[ii + 3] = 1;
        //     }
        //     this._lightsTransformedPositions[ii] = tp.x;
        //     this._lightsTransformedPositions[ii + 1] = tp.y;
        //     this._lightsTransformedPositions[ii + 2] = tp.z;
        // }
    }
    updateBillboardsTexCoords() {
        for (let i = 0; i < this.entityCollections.length; i++) {
            this.entityCollections[i].billboardHandler.refreshTexCoordsArr();
        }
    }
    // public updateGeoObjectsTexCoords() {
    //     for (let i = 0; i < this.entityCollections.length; i++) {
    //         this.entityCollections[i].geoObjectHandler.refreshTexCoordsArr();
    //     }
    // }
    frame() {
        // virtual
    }
    preFrame() {
        // virtual
    }
    _preDrawNodes() {
        for (let i = 0; i < this.childNodes.length; i++) {
            if (this.childNodes[i]._isActive) {
                this.childNodes[i]._preDrawNodes();
            }
        }
        if (this.show) {
            //this.lightEnabled && this.transformLights();
            this.preFrame();
            this.drawEntityCollections(this.entityCollections);
        }
    }
    _drawNodes() {
        for (let i = 0; i < this.childNodes.length; i++) {
            if (this.childNodes[i]._isActive) {
                this.childNodes[i]._drawNodes();
            }
        }
        if (this.show) {
            this.frame();
        }
    }
    drawEntityCollections(ec) {
        this.renderer.enqueueEntityCollectionsToDraw(ec);
    }
    /**
     * Draw entity collections picking frame.
     * @public
     * @param {Array<EntityCollection>} ec - Entity collection array.
     */
    drawPickingEntityCollections(ec) {
        if (ec.length) {
            // billboard pass
            let i = ec.length;
            while (i--) {
                ec[i]._fadingOpacity && ec[i].billboardHandler.drawPicking();
            }
            // geoObject pass
            i = ec.length;
            while (i--) {
                ec[i]._fadingOpacity && ec[i].geoObjectHandler.drawPicking();
            }
            // label pass
            i = ec.length;
            while (i--) {
                ec[i]._fadingOpacity && ec[i].labelHandler.drawPicking();
            }
            // ray pass
            i = ec.length;
            while (i--) {
                ec[i]._fadingOpacity && ec[i].rayHandler.drawPicking();
            }
            // polyline pass
            i = ec.length;
            while (i--) {
                ec[i]._visibility && ec[i].polylineHandler.drawPicking();
            }
            //Strip pass
            i = ec.length;
            while (i--) {
                ec[i]._visibility && ec[i].stripHandler.drawPicking();
            }
            // //pointClouds pass
            // i = ec.length;
            // while (i--) {
            //    ec[i]._visibility && ec[i].pointCloudHandler.drawPicking();
            // }
        }
    }
    _entityCollectionPickingCallback() {
        this.drawPickingEntityCollections(this.entityCollections);
    }
}
export { RenderNode };
