import * as math from "../math";
import { BillboardHandler } from "./BillboardHandler";
import { createEvents } from "../Events";
import { GeoObjectHandler } from "./GeoObjectHandler";
import { LabelHandler } from "./LabelHandler";
import { PointCloudHandler } from "./PointCloudHandler";
import { PolylineHandler } from "./PolylineHandler";
import { RayHandler } from "./RayHandler";
import { StripHandler } from "./StripHandler";
/**
 * An observable collection of og.Entity instances where each entity has a unique id.
 * Entity collection provide handlers for each type of entity like billboard, label or 3ds object.
 * @constructor
 * @param {Object} [options] - Entity options:
 * @param {Array.<Entity>} [options.entities] - Entities array.
 * @param {boolean} [options.visibility=true] - Entity visibility.
 * @param {Array.<number>} [options.scaleByDistance] - Entity scale by distance parameters. (exactly 3 entries)
 * First index - near distance to the entity, after entity becomes full scale.
 * Second index - far distance to the entity, when entity becomes zero scale.
 * Third index - far distance to the entity, when entity becomes invisible.
 * @param {number} [options.opacity] - Entity global opacity.
 * @param {boolean} [options.pickingEnabled=true] - Entity picking enable.
 * @param {Number} [options.polygonOffsetUnits=0.0] - The multiplier by which an implementation-specific value is multiplied with to create a constant depth offset. The default value is 0.
 * //@fires EntityCollection#entitymove
 * @fires EntityCollection#draw
 * @fires EntityCollection#drawend
 * @fires EntityCollection#add
 * @fires EntityCollection#remove
 * @fires EntityCollection#entityadd
 * @fires EntityCollection#entityremove
 * @fires EntityCollection#visibilitychange
 * @fires EntityCollection#mousemove
 * @fires EntityCollection#mouseenter
 * @fires EntityCollection#mouseleave
 * @fires EntityCollection#lclick
 * @fires EntityCollection#rclick
 * @fires EntityCollection#mclick
 * @fires EntityCollection#ldblclick
 * @fires EntityCollection#rdblclick
 * @fires EntityCollection#mdblclick
 * @fires EntityCollection#lup
 * @fires EntityCollection#rup
 * @fires EntityCollection#mup
 * @fires EntityCollection#ldown
 * @fires EntityCollection#rdown
 * @fires EntityCollection#mdown
 * @fires EntityCollection#lhold
 * @fires EntityCollection#rhold
 * @fires EntityCollection#mhold
 * @fires EntityCollection#mousewheel
 * @fires EntityCollection#touchmove
 * @fires EntityCollection#touchstart
 * @fires EntityCollection#touchend
 * @fires EntityCollection#doubletouch
 * @fires EntityCollection#touchleave
 * @fires EntityCollection#touchenter
 */
class EntityCollection {
    constructor(options = {}) {
        this.__id = EntityCollection.__counter__++;
        this._renderNodeIndex = -1;
        this.renderNode = null;
        this._visibility = options.visibility == undefined ? true : options.visibility;
        this.polygonOffsetUnits =
            options.polygonOffsetUnits != undefined ? options.polygonOffsetUnits : 0.0;
        this.billboardHandler = new BillboardHandler(this);
        this.labelHandler = new LabelHandler(this, options.labelMaxLetters);
        this.polylineHandler = new PolylineHandler(this);
        this.rayHandler = new RayHandler(this);
        this.pointCloudHandler = new PointCloudHandler(this);
        this.stripHandler = new StripHandler(this);
        this.geoObjectHandler = new GeoObjectHandler(this);
        if (options.pickingEnabled != undefined) {
            this.setPickingEnabled(options.pickingEnabled);
        }
        this._entities = [];
        this.scaleByDistance = options.scaleByDistance || [math.MAX32, math.MAX32, math.MAX32];
        this.pickingScale = options.pickingScale || 1.0;
        this._opacity = options.opacity == undefined ? 1.0 : options.opacity;
        this._fadingOpacity = this._opacity;
        this.events = this.rendererEvents = createEvents(ENTITYCOLLECTION_EVENTS, this);
        // initialize current entities
        if (options.entities) {
            this.addEntities(options.entities);
        }
    }
    get id() {
        return this.__id;
    }
    isEqual(ec) {
        return this.__id === ec.__id;
    }
    /**
     * Sets collection visibility.
     * @public
     * @param {boolean} visibility - Visibility flag.
     */
    setVisibility(visibility) {
        this._visibility = visibility;
        this._fadingOpacity = this._opacity * (visibility ? 1 : 0);
        this.events.dispatch(this.events.visibilitychange, this);
    }
    /**
     * Returns collection visibility.
     * @public
     * @returns {boolean} -
     */
    getVisibility() {
        return this._visibility;
    }
    /**
     * Sets collection opacity.
     * @public
     * @param {number} opacity - Opacity.
     */
    setOpacity(opacity) {
        this._opacity = opacity;
    }
    /**
     * Sets collection picking ability.
     * @public
     * @param {boolean} enable - Picking enable flag.
     */
    setPickingEnabled(enable) {
        this.billboardHandler.pickingEnabled = enable;
        this.labelHandler.pickingEnabled = enable;
        this.polylineHandler.pickingEnabled = enable;
        this.rayHandler.pickingEnabled = enable;
        this.pointCloudHandler.pickingEnabled = enable;
        this.stripHandler.pickingEnabled = enable;
        this.geoObjectHandler.pickingEnabled = enable;
    }
    /**
     * Gets collection opacity.
     * @public
     * @returns {number} -
     */
    getOpacity() {
        return this._opacity;
    }
    /**
     * Sets scale by distance parameters.
     * @public
     * @param {number} near - Full scale entity distance.
     * @param {number} far - Zero scale entity distance.
     * @param {number} [farInvisible] - Entity visibility distance.
     */
    setScaleByDistance(near, far, farInvisible) {
        this.scaleByDistance[0] = near;
        this.scaleByDistance[1] = far;
        this.scaleByDistance[2] = farInvisible || math.MAX32;
    }
    appendChildEntity(entity) {
        this._addRecursively(entity);
    }
    _addRecursively(entity) {
        // billboard
        entity.billboard && this.billboardHandler.add(entity.billboard);
        // label
        entity.label && this.labelHandler.add(entity.label);
        // polyline
        entity.polyline && this.polylineHandler.add(entity.polyline);
        // ray
        entity.ray && this.rayHandler.add(entity.ray);
        // pointCloud
        entity.pointCloud && this.pointCloudHandler.add(entity.pointCloud);
        // strip
        entity.strip && this.stripHandler.add(entity.strip);
        //geoObject
        entity.geoObject && this.geoObjectHandler.add(entity.geoObject);
        this.events.dispatch(this.events.entityadd, entity);
        for (let i = 0; i < entity.childrenNodes.length; i++) {
            entity.childrenNodes[i]._entityCollection = this;
            entity.childrenNodes[i]._entityCollectionIndex = entity._entityCollectionIndex;
            entity.childrenNodes[i]._pickingColor = entity._pickingColor;
            this._addRecursively(entity.childrenNodes[i]);
        }
    }
    /**
     * Adds entity to the collection and returns collection.
     * @public
     * @param {Entity} entity - Entity.
     * @returns {EntityCollection} -
     */
    add(entity) {
        if (!entity._entityCollection) {
            entity._entityCollection = this;
            entity._entityCollectionIndex = this._entities.length;
            this._entities.push(entity);
            let rn = this.renderNode;
            if (rn) {
                rn.renderer && rn.renderer.assignPickingColor(entity);
                if (rn.ellipsoid && entity._cartesian.isZero()) {
                    entity.setCartesian3v(rn.ellipsoid.lonLatToCartesian(entity._lonLat));
                }
            }
            this._addRecursively(entity);
            entity.setPickingColor();
        }
        return this;
    }
    /**
     * Adds entities array to the collection and returns collection.
     * @public
     * @param {Array.<Entity>} entities - Entities array.
     * @returns {EntityCollection} -
     */
    addEntities(entities) {
        for (let i = 0, len = entities.length; i < len; i++) {
            this.add(entities[i]);
        }
        return this;
    }
    /**
     * Returns true if the entity belongs this collection, otherwise returns false.
     * @public
     * @param {Entity} entity - Entity.
     * @returns {boolean} -
     */
    belongs(entity) {
        return entity._entityCollection && this._renderNodeIndex === entity._entityCollection._renderNodeIndex;
    }
    _removeRecursively(entity) {
        entity._entityCollection = null;
        entity._entityCollectionIndex = -1;
        // billboard
        entity.billboard && this.billboardHandler.remove(entity.billboard);
        // label
        entity.label && this.labelHandler.remove(entity.label);
        // polyline
        entity.polyline && this.polylineHandler.remove(entity.polyline);
        // ray
        entity.ray && this.rayHandler.remove(entity.ray);
        // pointCloud
        entity.pointCloud && this.pointCloudHandler.remove(entity.pointCloud);
        // strip
        entity.strip && this.stripHandler.remove(entity.strip);
        // geoObject
        entity.geoObject && this.geoObjectHandler.remove(entity.geoObject);
        for (let i = 0; i < entity.childrenNodes.length; i++) {
            this._removeRecursively(entity.childrenNodes[i]);
        }
    }
    /**
     * Removes entity from this collection.
     * @public
     * @param {Entity} entity - Entity to remove.
     */
    removeEntity(entity) {
        this._entities.splice(entity._entityCollectionIndex, 1);
        this.reindexEntitiesArray(entity._entityCollectionIndex);
        // clear picking color
        if (this.renderNode && this.renderNode.renderer) {
            this.renderNode.renderer.clearPickingColor(entity);
            entity._pickingColor.clear();
        }
        if (this.belongs(entity)) {
            this._removeRecursively(entity);
        }
        this.events.dispatch(this.events.entityremove, entity);
    }
    _removeEntitySilent(entity) {
        this._entities.splice(entity._entityCollectionIndex, 1);
        this.reindexEntitiesArray(entity._entityCollectionIndex);
        // clear picking color
        if (this.renderNode && this.renderNode.renderer) {
            this.renderNode.renderer.clearPickingColor(entity);
            entity._pickingColor.clear();
        }
        if (this.belongs(entity)) {
            this._removeRecursively(entity);
        }
    }
    /**
     * Creates or refresh collected entities picking color.
     * @public
     */
    createPickingColors() {
        if (!(this.renderNode && this.renderNode.renderer))
            return;
        let e = this._entities;
        for (let i = 0; i < e.length; i++) {
            if (!e[i].parent) {
                this.renderNode.renderer.assignPickingColor(e[i]);
                e[i].setPickingColor();
            }
        }
    }
    /**
     * Refresh collected entities indexes from startIndex entities collection array position.
     * @public
     * @param {number} startIndex - Entities collection array index.
     */
    reindexEntitiesArray(startIndex) {
        let e = this._entities;
        for (let i = startIndex; i < e.length; i++) {
            e[i]._entityCollectionIndex = i;
        }
    }
    /**
     * Adds this collection to render node.
     * @public
     * @param {RenderNode} renderNode - Render node.
     * @param {boolean} [isHidden] - Uses in vector layers that render in planet render specific function.
     * @returns {EntityCollection} -
     */
    addTo(renderNode, isHidden = false) {
        if (!this.renderNode) {
            this.renderNode = renderNode;
            if (!isHidden) {
                this._renderNodeIndex = renderNode.entityCollections.length;
                renderNode.entityCollections.push(this);
            }
            renderNode.ellipsoid && this._updateGeodeticCoordinates(renderNode.ellipsoid);
            this.bindRenderNode(renderNode);
            this.events.dispatch(this.events.add, this);
        }
        return this;
    }
    /**
     * This function is called in the RenderNode assign function.
     * @public
     * @param {RenderNode} renderNode
     */
    bindRenderNode(renderNode) {
        if (renderNode.renderer && renderNode.renderer.isInitialized()) {
            this.billboardHandler.setRenderer(renderNode.renderer);
            this.labelHandler.setRenderer(renderNode.renderer);
            this.rayHandler.setRenderer(renderNode.renderer);
            this.geoObjectHandler.setRenderNode(renderNode);
            this.polylineHandler.setRenderNode(renderNode);
            this.pointCloudHandler.setRenderNode(renderNode);
            this.stripHandler.setRenderNode(renderNode);
            this.updateBillboardsTextureAtlas();
            this.updateLabelsFontAtlas();
            this.createPickingColors();
        }
    }
    /**
     * Updates coordinates all lonLat entities in collection after collection attached to the planet node.
     * @protected
     * @param {Ellipsoid} ellipsoid - Globe ellipsoid.
     */
    _updateGeodeticCoordinates(ellipsoid) {
        let e = this._entities;
        let i = e.length;
        while (i--) {
            let ei = e[i];
            ei._lonLat && ei.setCartesian3v(ellipsoid.lonLatToCartesian(ei._lonLat));
        }
    }
    /**
     * Updates billboard texture atlas.
     * @public
     */
    updateBillboardsTextureAtlas() {
        let b = this.billboardHandler.billboards;
        for (let i = 0; i < b.length; i++) {
            b[i].setSrc(b[i].getSrc());
        }
    }
    /**
     * Updates labels font atlas.
     * @public
     */
    updateLabelsFontAtlas() {
        if (this.renderNode) {
            // let l = ([] as Label[]).concat(this.labelHandler.labels);
            // this.labelHandler._billboards = [];
            // for (let i = 0; i < l.length; i++) {
            //     this.labelHandler.assignFontAtlas(l[i]);
            // }
            this.labelHandler.updateFonts();
        }
    }
    /**
     * Removes collection from render node.
     * @public
     */
    remove() {
        if (this.renderNode) {
            if (this._renderNodeIndex !== -1) {
                this.renderNode.entityCollections.splice(this._renderNodeIndex, 1);
                // reindex in the renderNode
                for (let i = this._renderNodeIndex; i < this.renderNode.entityCollections.length; i++) {
                    this.renderNode.entityCollections[i]._renderNodeIndex = i;
                }
            }
            this.renderNode = null;
            this._renderNodeIndex = -1;
            this.events.dispatch(this.events.remove, this);
        }
    }
    /**
     * Gets entity array.
     * @public
     * @returns {Array.<Entity>} -
     */
    getEntities() {
        return [].concat(this._entities);
    }
    /**
     * Safety entities loop.
     * @public
     * @param {function} callback - Entity callback.
     */
    each(callback) {
        let i = this._entities.length;
        while (i--) {
            let ei = this._entities[i];
            ei && callback(ei);
        }
    }
    /**
     * Removes all entities from collection and clear handlers.
     * @public
     */
    clear() {
        // TODO: Optimize by replace delete
        // code to the clearEntity function.
        this.billboardHandler.clear();
        this.labelHandler.clear();
        this.polylineHandler.clear();
        this.rayHandler.clear();
        this.pointCloudHandler.clear();
        this.stripHandler.clear();
        this.geoObjectHandler.clear();
        let i = this._entities.length;
        while (i--) {
            let ei = this._entities[i];
            if (this.renderNode && this.renderNode.renderer) {
                this.renderNode.renderer.clearPickingColor(ei);
                ei._pickingColor.clear();
            }
            this._clearEntity(ei);
        }
        this._entities.length = 0;
        this._entities = [];
    }
    /**
     * Clears entity recursively.
     * @private
     * @param {Entity} entity - Entity to clear.
     */
    _clearEntity(entity) {
        entity._entityCollection = null;
        entity._entityCollectionIndex = -1;
        for (let i = 0; i < entity.childrenNodes.length; i++) {
            this._clearEntity(entity.childrenNodes[i]);
        }
    }
}
EntityCollection.__counter__ = 0;
const ENTITYCOLLECTION_EVENTS = [
    // /**
    //  * Triggered when entity has moved.
    //  * @event EntityCollection#entitymove
    //  */
    // "entitymove",
    /**
     * Triggered when collection entities begin draw.
     * @event EntityCollection#draw
     */
    "draw",
    /**
     * Triggered after collection has drawn.
     * @event EntityCollection#drawend
     */
    "drawend",
    /**
     * Triggered when added to the render node.
     * @event EntityCollection#add
     */
    "add",
    /**
     * Triggered when removed from the render node.
     * @event EntityCollection#remove
     */
    "remove",
    /**
     * Triggered when new entity added to the collection.
     * @event EntityCollection#entityadd
     */
    "entityadd",
    /**
     * Triggered when entity removes from the collection.
     * @event EntityCollection#entityremove
     */
    "entityremove",
    /**
     * Triggered when visibility changes.
     * @event EntityCollection#visibilitychange
     */
    "visibilitychange",
    /**
     * Triggered when mouse moves over the entity.
     * @event EntityCollection#mousemove
     */
    "mousemove",
    /**
     * Triggered when mouse has entered over the entity.
     * @event EntityCollection#mouseenter
     */
    "mouseenter",
    /**
     * Triggered when mouse leaves the entity.
     * @event EntityCollection#mouseleave
     */
    "mouseleave",
    /**
     * Mouse left button clicked.
     * @event EntityCollection#lclick
     */
    "lclick",
    /**
     * Mouse right button clicked.
     * @event EntityCollection#rclick
     */
    "rclick",
    /**
     * Mouse right button clicked.
     * @event EntityCollection#mclick
     */
    "mclick",
    /**
     * Mouse left button double click.
     * @event EntityCollection#ldblclick
     */
    "ldblclick",
    /**
     * Mouse right button double click.
     * @event EntityCollection#rdblclick
     */
    "rdblclick",
    /**
     * Mouse middle button double click.
     * @event EntityCollection#mdblclick
     */
    "mdblclick",
    /**
     * Mouse left button up(stop pressing).
     * @event EntityCollection#lup
     */
    "lup",
    /**
     * Mouse right button up(stop pressing).
     * @event EntityCollection#rup
     */
    "rup",
    /**
     * Mouse middle button up(stop pressing).
     * @event EntityCollection#mup
     */
    "mup",
    /**
     * Mouse left button is just pressed down(start pressing).
     * @event EntityCollection#ldown
     */
    "ldown",
    /**
     * Mouse right button is just pressed down(start pressing).
     * @event EntityCollection#rdown
     */
    "rdown",
    /**
     * Mouse middle button is just pressed down(start pressing).
     * @event EntityCollection#mdown
     */
    "mdown",
    /**
     * Mouse left button is pressing.
     * @event EntityCollection#lhold
     */
    "lhold",
    /**
     * Mouse right button is pressing.
     * @event EntityCollection#rhold
     */
    "rhold",
    /**
     * Mouse middle button is pressing.
     * @event EntityCollection#mhold
     */
    "mhold",
    /**
     * Mouse wheel is rotated.
     * @event EntityCollection#mousewheel
     */
    "mousewheel",
    /**
     * Triggered when touch moves over the entity.
     * @event EntityCollection#touchmove
     */
    "touchmove",
    /**
     * Triggered when entity begins to touch.
     * @event EntityCollection#touchstart
     */
    "touchstart",
    /**
     * Triggered when entity ends touching.
     * @event EntityCollection#touchend
     */
    "touchend",
    /**
     * Triggered entity double touch.
     * @event EntityCollection#doubletouch
     */
    "doubletouch",
    /**
     * Triggered when touching leaves entity.
     * @event EntityCollection#touchleave
     */
    "touchleave",
    /**
     * Triggered when touch enters over the entity.
     * @event EntityCollection#touchenter
     */
    "touchenter"
];
export { EntityCollection };
