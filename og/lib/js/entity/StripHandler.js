import { Program } from "../webgl/Program";
class StripHandler {
    constructor(entityCollection) {
        this.__id = StripHandler.__counter__++;
        this.pickingEnabled = true;
        this._entityCollection = entityCollection;
        this._renderer = null;
        this._strips = [];
    }
    _initProgram() {
        if (this._renderer && this._renderer.handler) {
            !this._renderer.handler.programs.strip &&
                this._renderer.handler.addProgram(new Program("strip", {
                    uniforms: {
                        projectionMatrix: { type: "mat4" },
                        viewMatrix: { type: "mat4" },
                        eyePositionHigh: "vec3",
                        eyePositionLow: "vec3",
                        uColor: { type: "vec4" },
                        uOpacity: { type: "float" }
                    },
                    attributes: {
                        aVertexPositionHigh: { type: "vec3" },
                        aVertexPositionLow: { type: "vec3" }
                    },
                    vertexShader: `attribute vec3 aVertexPositionHigh;
                        attribute vec3 aVertexPositionLow;
                        uniform mat4 projectionMatrix;
                        uniform mat4 viewMatrix;
                        uniform vec3 eyePositionHigh;
                        uniform vec3 eyePositionLow;
                        void main(void) {

                            vec3 highDiff = aVertexPositionHigh - eyePositionHigh;
                            vec3 lowDiff = aVertexPositionLow - eyePositionLow;

                            mat4 viewMatrixRTE = viewMatrix;
                            viewMatrixRTE[3] = vec4(0.0, 0.0, 0.0, 1.0);

                            gl_Position = projectionMatrix * viewMatrixRTE * vec4(highDiff + lowDiff, 1.0);
                        }`,
                    fragmentShader: `precision highp float;
                        uniform vec4 uColor;
                        uniform float uOpacity;
                        void main(void) {
                            gl_FragColor = vec4(uColor.rgb, uColor.a * uOpacity);
                        }`
                }));
        }
    }
    setRenderNode(renderNode) {
        this._renderer = renderNode.renderer;
        this._initProgram();
        for (let i = 0; i < this._strips.length; i++) {
            this._strips[i].setRenderNode(renderNode);
        }
    }
    add(strip) {
        if (strip._handlerIndex === -1) {
            strip._handler = this;
            strip._handlerIndex = this._strips.length;
            this._strips.push(strip);
            this._entityCollection &&
                this._entityCollection.renderNode &&
                strip.setRenderNode(this._entityCollection.renderNode);
        }
    }
    remove(strip) {
        let index = strip._handlerIndex;
        if (index !== -1) {
            strip._deleteBuffers();
            strip._handlerIndex = -1;
            strip._handler = null;
            this._strips.splice(index, 1);
            this.reindexStripArray(index);
        }
    }
    reindexStripArray(startIndex) {
        let pc = this._strips;
        for (let i = startIndex; i < pc.length; i++) {
            pc[i]._handlerIndex = i;
        }
    }
    draw() {
        let i = this._strips.length;
        while (i--) {
            this._strips[i].draw();
        }
    }
    drawPicking() {
        if (this.pickingEnabled) {
            let i = this._strips.length;
            while (i--) {
                this._strips[i].drawPicking();
            }
        }
    }
    clear() {
        let i = this._strips.length;
        while (i--) {
            this._strips[i]._deleteBuffers();
            this._strips[i]._handler = null;
            this._strips[i]._handlerIndex = -1;
        }
        this._strips.length = 0;
        this._strips = [];
    }
}
StripHandler.__counter__ = 0;
export { StripHandler };
