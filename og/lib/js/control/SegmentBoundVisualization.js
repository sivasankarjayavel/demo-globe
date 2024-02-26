import { Entity } from "../entity/Entity";
import { EntityCollection } from "../entity/EntityCollection";
import { Control } from "./Control";
/**
 * Frame per second(FPS) display control.
 */
export class SegmentBoundVisualization extends Control {
    constructor(options) {
        super(options);
        this._boundingSphereCollection = new EntityCollection();
    }
    oninit() {
        this.planet.addEntityCollection(this._boundingSphereCollection);
        this.renderer.events.on("draw", this._predraw, this);
        this.planet.events.on("draw", this._draw, this);
    }
    _predraw() {
        this._boundingSphereCollection.clear();
    }
    _draw() {
        const planet = this.planet;
        for (let i = 0; i < planet._renderedNodes.length; i++) {
            let si = planet._renderedNodes[i].segment;
            if (!si._sphereEntity) {
                si._sphereEntity = new Entity({
                    billboard: {
                    //todo: replace with sphere geoObject
                    }
                });
            }
            //@todo: geoObject
            //si._sphereEntity.shape.setScale(si.bsphere.radius / 2);
            //si._sphereEntity.shape.setPosition3v(si.bsphere.center);
            this._boundingSphereCollection.add(si._sphereEntity);
        }
    }
}
