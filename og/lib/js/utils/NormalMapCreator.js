import * as quadTree from "../quadTree/quadTree";
import { Framebuffer } from "../webgl/Framebuffer";
import { Lock } from "../Lock";
import { Program } from "../webgl/Program";
import { QueueArray } from "../QueueArray";
export class NormalMapCreator {
    constructor(planet, options = {}) {
        this._minTabelSize = options.minTableSize || 1;
        this._maxTableSize = options.maxTableSize || 8;
        this._planet = planet;
        this._handler = null;
        this._verticesBufferArray = [];
        this._indexBufferArray = [];
        this._positionBuffer = null;
        this._framebuffer = null;
        this._normalMapVerticesTexture = null;
        this._width = options.width || 128;
        this._height = options.height || 128;
        this._queue = new QueueArray(1024);
        this._lock = new Lock();
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    init() {
        this._maxTableSize = this._planet.maxGridSize || 8;
        this._handler = this._planet.renderer.handler;
        let isWebkit = false; //('WebkitAppearance' in document.documentElement.style) && !/^((?!chrome).)*safari/i.test(navigator.userAgent);
        /*==================================================================================
         * http://www.sunsetlakesoftware.com/2013/10/21/optimizing-gaussian-blurs-mobile-gpu
         *=================================================================================*/
        const normalMapBlur = new Program("normalMapBlur", {
            attributes: {
                a_position: "vec2"
            },
            uniforms: {
                s_texture: "sampler2d"
            },
            vertexShader: `attribute vec2 a_position;
                       attribute vec2 a_texCoord;

                      varying vec2 blurCoordinates[5];

                      void main() {
                          vec2 vt = a_position * 0.5 + 0.5; 
                          ${isWebkit ? "vt.y = 1.0 - vt.y; " : " "}
                          gl_Position = vec4(a_position, 0.0, 1.0);
                          blurCoordinates[0] = vt;
                          blurCoordinates[1] = vt + ${(1.0 / this._width) * 1.407333};
                          blurCoordinates[2] = vt - ${(1.0 / this._height) * 1.407333};
                          blurCoordinates[3] = vt + ${(1.0 / this._width) * 3.294215};
                          blurCoordinates[4] = vt - ${(1.0 / this._height) * 3.294215};
                }`,
            fragmentShader: `precision lowp float;
                        uniform sampler2D s_texture;                        
                        varying vec2 blurCoordinates[5];                        

                        void main() {
                            lowp vec4 sum = vec4(0.0);
                            //if(blurCoordinates[0].x <= 0.01 || blurCoordinates[0].x >= 0.99 ||
                            //    blurCoordinates[0].y <= 0.01 || blurCoordinates[0].y >= 0.99){
                            //    sum = texture2D(s_texture, blurCoordinates[0]);
                            //} else {
                                sum += texture2D(s_texture, blurCoordinates[0]) * 0.204164;
                                sum += texture2D(s_texture, blurCoordinates[1]) * 0.304005;
                                sum += texture2D(s_texture, blurCoordinates[2]) * 0.304005;
                                sum += texture2D(s_texture, blurCoordinates[3]) * 0.093913;
                                sum += texture2D(s_texture, blurCoordinates[4]) * 0.093913;
                            //}
                            gl_FragColor = sum;
                        }`
        });
        const normalMap = new Program("normalMap", {
            attributes: {
                a_position: "vec2",
                a_normal: "vec3"
            },
            uniforms: {},
            vertexShader: `attribute vec2 a_position;
                      attribute vec3 a_normal;
                      
                      varying vec3 v_color;
                      
                      void main() {
                          gl_Position = vec4(a_position, 0, 1);
                          v_color = normalize(a_normal) * 0.5 + 0.5;
                      }`,
            fragmentShader: `precision highp float;
                        
                        varying vec3 v_color;
                        
                        void main () {
                            gl_FragColor = vec4(v_color, 1.0);
                        }`
        });
        this._handler.addProgram(normalMapBlur);
        this._handler.addProgram(normalMap);
        //create hidden handler buffer
        this._framebuffer = new Framebuffer(this._handler, {
            width: this._width,
            height: this._height,
            useDepth: false
        });
        this._framebuffer.init();
        this._normalMapVerticesTexture = this._handler.createEmptyTexture_l(this._width, this._height);
        //create vertices hasharray for different grid size segments from 2^4(16) to 2^7(128)
        for (let p = this._minTabelSize; p <= this._maxTableSize; p++) {
            const gs = Math.pow(2, p);
            const gs2 = gs / 2;
            let vertices = new Float32Array((gs + 1) * (gs + 1) * 2);
            for (let i = 0; i <= gs; i++) {
                for (let j = 0; j <= gs; j++) {
                    let ind = (i * (gs + 1) + j) * 2;
                    vertices[ind] = -1 + j / gs2;
                    vertices[ind + 1] = -1 + i / gs2;
                }
            }
            this._verticesBufferArray[gs] = this._handler.createArrayBuffer(vertices, 2, vertices.length / 2);
            this._indexBufferArray[gs] =
                this._planet._indexesCache[Math.log2(gs)][Math.log2(gs)][Math.log2(gs)][Math.log2(gs)][Math.log2(gs)].buffer;
        }
        //create 2d screen square buffer
        const positions = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]);
        this._positionBuffer = this._handler.createArrayBuffer(positions, 2, positions.length / 2);
    }
    _drawNormalMapBlur(segment) {
        let normals = segment.normalMapNormals;
        if (segment.node &&
            segment.node.getState() !== quadTree.NOTRENDERING &&
            normals &&
            normals.length) {
            const size = normals.length / 3;
            const gridSize = Math.sqrt(size) - 1;
            let indBuf = this._verticesBufferArray[gridSize];
            if (indBuf) {
                if (segment.planet.terrain.equalizeNormals) {
                    segment._normalMapEdgeEqualize(quadTree.N);
                    segment._normalMapEdgeEqualize(quadTree.S);
                    segment._normalMapEdgeEqualize(quadTree.W);
                    segment._normalMapEdgeEqualize(quadTree.E);
                }
                let outTexture = segment.normalMapTexturePtr;
                const h = this._handler;
                const gl = h.gl;
                let _normalsBuffer = h.createArrayBuffer(normals, 3, size, gl.DYNAMIC_DRAW);
                const f = this._framebuffer;
                let p = h.programs.normalMap;
                let sha = p._program.attributes;
                f.bindOutputTexture(this._normalMapVerticesTexture);
                p.activate();
                gl.bindBuffer(gl.ARRAY_BUFFER, indBuf);
                gl.vertexAttribPointer(sha.a_position, indBuf.itemSize, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, _normalsBuffer);
                gl.vertexAttribPointer(sha.a_normal, _normalsBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBufferArray[gridSize]);
                gl.drawElements(gl.TRIANGLE_STRIP, this._indexBufferArray[gridSize].numItems, gl.UNSIGNED_INT, 0);
                gl.deleteBuffer(_normalsBuffer);
                //
                // blur pass
                //
                f.bindOutputTexture(outTexture);
                p = h.programs.normalMapBlur;
                p.activate();
                gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
                gl.vertexAttribPointer(p._program.attributes.a_position, this._positionBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this._normalMapVerticesTexture);
                gl.uniform1i(p._program.uniforms.s_texture, 0);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, this._positionBuffer.numItems);
                return true;
            }
            else {
                return true;
            }
        }
        return false;
    }
    _drawNormalMapNoBlur(segment) {
        let normals = segment.normalMapNormals;
        if (segment.node &&
            segment.node.getState() !== quadTree.NOTRENDERING &&
            normals &&
            normals.length) {
            const size = normals.length / 3;
            const gridSize = Math.sqrt(size) - 1;
            let indBuf = this._verticesBufferArray[gridSize];
            if (indBuf) {
                if (segment.planet.terrain.equalizeNormals) {
                    segment._normalMapEdgeEqualize(quadTree.N);
                    segment._normalMapEdgeEqualize(quadTree.S);
                    segment._normalMapEdgeEqualize(quadTree.W);
                    segment._normalMapEdgeEqualize(quadTree.E);
                }
                let outTexture = segment.normalMapTexturePtr;
                const h = this._handler;
                const gl = h.gl;
                let _normalsBuffer = h.createArrayBuffer(normals, 3, size, gl.DYNAMIC_DRAW);
                const f = this._framebuffer;
                const p = h.programs.normalMap;
                const sha = p._program.attributes;
                f.bindOutputTexture(outTexture);
                p.activate();
                gl.bindBuffer(gl.ARRAY_BUFFER, indBuf);
                gl.vertexAttribPointer(sha.a_position, indBuf.itemSize, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, _normalsBuffer);
                gl.vertexAttribPointer(sha.a_normal, _normalsBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBufferArray[gridSize]);
                gl.drawElements(gl.TRIANGLE_STRIP, this._indexBufferArray[gridSize].numItems, gl.UNSIGNED_INT, 0);
                gl.deleteBuffer(_normalsBuffer);
                return true;
            }
            else {
                return true;
            }
        }
        return false;
    }
    _drawNormalMap(segment) {
        if (segment.planet.terrain.isBlur(segment)) {
            return this._drawNormalMapBlur(segment);
        }
        else {
            return this._drawNormalMapNoBlur(segment);
        }
    }
    drawSingle(segment) {
        const h = this._handler;
        const gl = h.gl;
        this._framebuffer.activate();
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
        if (segment.terrainReady && this._drawNormalMap(segment)) {
            segment.normalMapReady = true;
            segment.normalMapTexture = segment.normalMapTexturePtr;
            segment.normalMapTextureBias[0] = 0;
            segment.normalMapTextureBias[1] = 0;
            segment.normalMapTextureBias[2] = 1;
        }
        segment._inTheQueue = false;
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        this._framebuffer.deactivate();
    }
    frame() {
        if (this._queue.length) {
            const h = this._handler;
            const gl = h.gl;
            this._framebuffer.activate();
            gl.disable(gl.CULL_FACE);
            gl.disable(gl.DEPTH_TEST);
            gl.disable(gl.BLEND);
            let deltaTime = 0, startTime = window.performance.now();
            while (this._lock.isFree() && this._queue.length && deltaTime < 0.25) {
                const segment = this._queue.shift();
                if (segment.terrainReady && this._drawNormalMap(segment)) {
                    segment.normalMapReady = true;
                    segment.normalMapTexture = segment.normalMapTexturePtr;
                    segment.normalMapTextureBias[0] = 0;
                    segment.normalMapTextureBias[1] = 0;
                    segment.normalMapTextureBias[2] = 1;
                }
                segment._inTheQueue = false;
                deltaTime = window.performance.now() - startTime;
            }
            gl.enable(gl.BLEND);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            this._framebuffer.deactivate();
        }
    }
    get queueSize() {
        return this._queue.length;
    }
    queue(segment) {
        segment._inTheQueue = true;
        this._queue.push(segment);
    }
    unshift(segment) {
        segment._inTheQueue = true;
        this._queue.unshift(segment);
    }
    remove(segment) {
        //...
    }
    clear() {
        while (this._queue.length) {
            let s = this._queue.pop();
            s._inTheQueue = false;
        }
    }
    /**
     * Set activity off
     * @public
     */
    lock(key) {
        this._lock.lock(key);
    }
    /**
     * Set activity on
     * @public
     */
    free(key) {
        this._lock.free(key);
    }
}
