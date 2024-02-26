/**
 * @class Material
 * @param {Segment} segment
 * @param {Layer} layer
 */
class Material {
    constructor(segment, layer) {
        this.segment = segment;
        this.layer = layer;
        this.isReady = false;
        this.isLoading = false;
        this.texture = null;
        this.pickingMask = null;
        this.textureExists = false;
        this.appliedNodeId = 0;
        this.appliedNode = null;
        this.texOffset = [0.0, 0.0, 1.0, 1.0];
        this.loadingAttempts = 0;
        this._updateTexture = null;
        this._updatePickingMask = null;
        this.pickingReady = false;
    }
    abortLoading() {
        this.layer.abortMaterialLoading(this);
    }
    _createTexture(img) {
        return this.layer._planet && this.layer.createTexture(img, this.layer._internalFormat, this.isReady ? this.texture : null);
    }
    applyImage(img) {
        if (this.segment.initialized) {
            this._updateTexture = null;
            //this.image = img;
            this.texture = this._createTexture(img);
            this.isReady = true;
            this.pickingReady = true;
            this.textureExists = true;
            this.isLoading = false;
            this.appliedNodeId = this.segment.node.nodeId;
            this.texOffset = [0.0, 0.0, 1.0, 1.0];
        }
    }
    applyTexture(texture, pickingMask) {
        if (this.segment.initialized) {
            this.texture = texture;
            this._updateTexture = null;
            this.pickingMask = pickingMask || null;
            this._updatePickingMask = null;
            this.isReady = true;
            this.pickingReady = true;
            this.textureExists = true;
            this.isLoading = false;
            this.appliedNodeId = this.segment.node.nodeId;
            this.texOffset = [0.0, 0.0, 1.0, 1.0];
        }
    }
    textureNotExists() {
        if (this.segment.initialized) {
            this.pickingReady = true;
            this.isLoading = false;
            this.isReady = true;
            this.textureExists = false;
        }
    }
    clear() {
        this.loadingAttempts = 0;
        this.layer.clearMaterial(this);
    }
}
export { Material };
