import { Vec3 } from "../math/Vec3";
/**
 * Represents basic light source.
 * @class
 * @param {string} [name] - Light source name.
 * @param {ILightSourceParams} [params] - Light parameters:
 * @param {Vec3} [params.position] - Light source position if it is a point light, otherwise it is a light direction vector.
 * @param {Vec3} [params.ambient]  - Ambient RGB color.
 * @param {Vec3} [params.diffuse]  - Diffuse RGB color.
 * @param {Vec3} [params.specular]  - Specular RGB color.
 * @param {number} [params.shininess]  - Specular shininess.
 */
class LightSource {
    constructor(name, params) {
        /**
         * Light name.
         * @protected
         * @type {string}
         */
        this._name = name || "light_" + LightSource.__counter__++;
        /**
         * Render node where light is shines.
         * @protected
         * @type {RenderNode}
         */
        this._renderNode = null;
        /**
         * Light position.
         * @public
         * @type {Vec3}
         */
        this._position = params.position || new Vec3();
        /**
         * True if the light is directional.
         * @public
         * @type {boolean}
         */
        this.directional = params.directional != undefined ? params.directional : true;
        /**
         * Ambient color.
         * @protected
         * @type {Vec3}
         */
        this._ambient = params.ambient || new Vec3();
        /**
         * Diffuse color.
         * @protected
         * @type {Vec3}
         */
        this._diffuse = params.diffuse || new Vec3(0.8, 0.8, 0.8);
        /**
         * Specular color.
         * @protected
         * @type {Vec3}
         */
        this._specular = params.specular || new Vec3(0.18, 0.18, 0.18);
        /**
         * Shininess.
         * @protected
         * @type {number}
         */
        this._shininess = params.shininess != undefined ? params.shininess : 3.3;
        /**
         * Light activity.
         * @protected
         * @type {boolean}
         */
        this._active = true;
        this._tempAmbient = this._ambient.clone();
        this._tempDiffuse = this._diffuse.clone();
        this._tempSpecular = this._specular.clone();
        this._tempShininess = this._shininess;
    }
    /**
     * Creates clone of the current light object.
     * @todo: TODO
     * @public
     * @returns {LightSource}
     */
    clone() {
        // TODO
    }
    /**
     * Set light activity. If activity is false the light doesn't shine.
     * @public
     * @param {boolean} active - Light activity.
     */
    setActive(active) {
        if (active && !this._active) {
            const rn = this._renderNode;
            if (rn) {
                let index = rn._lightsNames.indexOf(this._name);
                this._shininess = rn._lightsParamsf[index] = this._tempShininess;
                if (index != -1) {
                    index *= 9;
                    this._ambient.x = rn._lightsParamsv[index] = this._tempAmbient.x;
                    this._ambient.y = rn._lightsParamsv[index + 1] = this._tempAmbient.y;
                    this._ambient.z = rn._lightsParamsv[index + 2] = this._tempAmbient.z;
                    this._diffuse.x = rn._lightsParamsv[index + 3] = this._tempDiffuse.x;
                    this._diffuse.y = rn._lightsParamsv[index + 4] = this._tempDiffuse.y;
                    this._diffuse.z = rn._lightsParamsv[index + 5] = this._tempDiffuse.z;
                    this._specular.x = rn._lightsParamsv[index + 6] = this._tempSpecular.x;
                    this._specular.y = rn._lightsParamsv[index + 7] = this._tempSpecular.y;
                    this._specular.z = rn._lightsParamsv[index + 8] = this._tempSpecular.z;
                }
            }
            this._active = true;
        }
        else if (!active && this._active) {
            this._tempAmbient = this._ambient.clone();
            this._tempDiffuse = this._diffuse.clone();
            this._tempSpecular = this._specular.clone();
            this._tempShininess = this._shininess;
            this.setBlack();
            this._active = false;
        }
    }
    /**
     * Gets light activity.
     * @public
     * @returns {boolean}
     */
    isActive() {
        return this._active;
    }
    /**
     * Set light source position, or if it is a directional type sets light direction vector.
     * @public
     * @param {Vec3} position - Light position or direction vector.
     */
    setPosition3v(position) {
        this._position.x = position.x;
        this._position.y = position.y;
        this._position.z = position.z;
    }
    /**
     * Set light source position, or if it is a directional type sets light direction vector.
     * @public
     */
    setPosition(x, y, z) {
        this._position.x = x;
        this._position.y = y;
        this._position.z = z;
    }
    /**
     * Returns light source position, or if it is a directional type sets light direction vector.
     * @public
     * @returns {Vec3} - Light source position/direction.
     */
    getPosition() {
        return this._position.clone();
    }
    /**
     * Set ambient color.
     * @public
     * @param {Vec3} rgb - Ambient color.
     */
    setAmbient3v(rgb) {
        this.setAmbient(rgb.x, rgb.y, rgb.z);
    }
    /**
     * Set diffuse color.
     * @public
     * @param {Vec3} rgb - Diffuse color.
     */
    setDiffuse3v(rgb) {
        this.setDiffuse(rgb.x, rgb.y, rgb.z);
    }
    /**
     * Set specular color.
     * @public
     * @param {Vec3} rgb - Specular color.
     */
    setSpecular3v(rgb) {
        this.setSpecular(rgb.x, rgb.y, rgb.z);
    }
    /**
     * Set ambient color.
     * @public
     */
    setAmbient(r, g, b) {
        this._ambient.set(r, g, b);
        const rn = this._renderNode;
        if (rn) {
            let index = 9 * rn._lightsNames.indexOf(this._name);
            if (index != -1) {
                rn._lightsParamsv[index] = r;
                rn._lightsParamsv[index + 1] = g;
                rn._lightsParamsv[index + 2] = b;
            }
        }
    }
    /**
     * Set diffuse color.
     * @public
     */
    setDiffuse(r, g, b) {
        this._diffuse.set(r, g, b);
        const rn = this._renderNode;
        if (rn) {
            let index = 9 * rn._lightsNames.indexOf(this._name);
            if (index != -1) {
                rn._lightsParamsv[index + 3] = r;
                rn._lightsParamsv[index + 4] = g;
                rn._lightsParamsv[index + 5] = b;
            }
        }
    }
    /**
     * Set specular color.
     * @public
     */
    setSpecular(r, g, b) {
        this._specular.set(r, g, b);
        const rn = this._renderNode;
        if (rn) {
            let index = 9 * rn._lightsNames.indexOf(this._name);
            if (index != -1) {
                rn._lightsParamsv[index + 6] = r;
                rn._lightsParamsv[index + 7] = g;
                rn._lightsParamsv[index + 8] = b;
            }
        }
    }
    /**
     * Set material shininess.
     * @public
     */
    setShininess(shininess) {
        this._shininess = shininess;
        const rn = this._renderNode;
        if (rn) {
            let index = rn._lightsNames.indexOf(this._name);
            if (index != -1) {
                rn._lightsParamsf[index] = shininess;
            }
        }
    }
    /**
     * Sets light to black.
     * @public
     */
    setBlack() {
        this._ambient.clear();
        this._diffuse.clear();
        this._specular.clear();
        this._shininess = 0;
        const rn = this._renderNode;
        if (rn) {
            let index = 9 * rn._lightsNames.indexOf(this._name);
            if (index !== -1) {
                rn._lightsParamsv[index] = rn._lightsParamsv[index + 1] = rn._lightsParamsv[index + 2] =
                    rn._lightsParamsv[index + 3] = rn._lightsParamsv[index + 4] = rn._lightsParamsv[index + 5] =
                        rn._lightsParamsv[index + 6] = rn._lightsParamsv[index + 7] = rn._lightsParamsv[index + 8] = 0;
            }
        }
    }
    /**
     * Adds current light to the render node scene.
     * @public
     * @param {RenderNode} renderNode - Render node scene.
     */
    addTo(renderNode) {
        this._renderNode = renderNode;
        renderNode._lights.push(this);
        renderNode._lightsNames.push(this._name);
        renderNode._lightsParamsf.push(this._shininess);
        renderNode._lightsParamsv.push.apply(renderNode._lightsParamsv, this._ambient.toArray());
        renderNode._lightsParamsv.push.apply(renderNode._lightsParamsv, this._diffuse.toArray());
        renderNode._lightsParamsv.push.apply(renderNode._lightsParamsv, this._specular.toArray());
        renderNode.transformLights();
    }
    /**
     * Removes from render node scene.
     * @public
     */
    remove() {
        const rn = this._renderNode;
        if (rn) {
            // let li = rn.getLightById(this._name);
            // if (li != -1) {
            //     rn._lights.splice(li, 1);
            //     rn._lightsNames.splice(li, 1);
            //     rn._lightsParamsf.splice(li, 1);
            //     rn._lightsParamsv.splice(li, 9);
            // }
        }
        this._renderNode = null;
    }
}
LightSource.__counter__ = 0;
export { LightSource };