import { Clock } from "../Clock";
import { cons } from "../cons";
import { createEvents } from "../Events";
import { getUrlParam, isEmpty } from "../utils/shared";
import { ImageCanvas } from "../ImageCanvas";
import { Vec2 } from "../math/Vec2";
import { ProgramController } from "./ProgramController";
import { Stack } from "../Stack";
const vendorPrefixes = ["", "WEBKIT_", "MOZ_"];
const CONTEXT_TYPE = ["webgl2", "webgl"];
// Maximal mipmap levels
const MAX_LEVELS = 2;
/**
 * A WebGL handler for accessing low-level WebGL capabilities.
 * @class
 * @param {string | HTMLCanvasElement} canvasTarget - Canvas element target.
 * or undefined creates hidden canvas and handler becomes hidden.
 * @param {Object} [params] - Handler options:
 * @param {number} [params.anisotropy] - Anisotropy filter degree. 8 is default.
 * @param {number} [params.width] - Hidden handler width. 256 is default.
 * @param {number} [params.height] - Hidden handler height. 256 is default.
 * @param {Array.<string>} [params.extensions] - Additional WebGL extension list. Available by default: EXT_texture_filter_anisotropic.
 */
class Handler {
    constructor(canvasTarget, params = {}) {
        this.framebufferStack = new Stack();
        this._requestAnimationFrameId = 0;
        this.events = createEvents(["visibilitychange", "resize"]);
        this.defaultClock = new Clock();
        this._clocks = [];
        this.deltaTime = 0;
        this.canvas = null;
        this.gl = null;
        this.programs = {};
        this.activeProgram = null;
        this._canvasSize = [0, 0];
        this._params = {
            anisotropy: params.anisotropy || 4,
            width: params.width || 256,
            height: params.height || 256,
            pixelRatio: getUrlParam('og_dpi') || params.pixelRatio || 1.0,
            extensions: params.extensions || [],
            context: params.context || {}
        };
        this._oneByHeight = 1.0 / (this._params.height * this._params.pixelRatio);
        this.extensions = {};
        this._canvasTarget = canvasTarget;
        this._lastAnimationFrameTime = 0;
        this._initialized = false;
        this._frameCallback = function () {
        };
        this.transparentTexture = null;
        this.defaultTexture = null;
        this.framebufferStack = new Stack();
        this.createTexture_n = this.createTexture_n_webgl2.bind(this);
        this.createTexture_l = this.createTexture_l_webgl2.bind(this);
        this.createTexture_mm = this.createTexture_mm_webgl2.bind(this);
        this.createTexture_a = this.createTexture_a_webgl2.bind(this);
        this.createTexture = {
            "NEAREST": this.createTexture_n,
            "LINEAR": this.createTexture_l,
            "MIPMAP": this.createTexture_mm,
            "ANISOTROPIC": this.createTexture_a
        };
        this.createTextureDefault = this.createTexture_n;
        this.ONCANVASRESIZE = null;
        this._createCanvas();
        if (params.autoActivate || isEmpty(params.autoActivate)) {
            this.initialize();
        }
    }
    isInitialized() {
        return this._initialized;
    }
    _createCanvas() {
        if (this._canvasTarget) {
            if (this._canvasTarget instanceof HTMLElement) {
                this.canvas = this._canvasTarget;
            }
            else {
                this.canvas = (document.getElementById(this._canvasTarget) || document.querySelector(this._canvasTarget));
            }
        }
        else {
            this.canvas = document.createElement("canvas");
            this.canvas.width = this._params.width;
            this.canvas.height = this._params.height;
        }
    }
    /**
     * The return value is null if the extension is not supported, or an extension object otherwise.
     * @param {WebGLRenderingContext | WebGL2RenderingContext | null} gl - WebGl context pointer.
     * @param {string} name - Extension name.
     * @returns {any} -
     */
    static getExtension(gl, name) {
        if (!gl)
            return;
        let i, ext;
        for (i in vendorPrefixes) {
            ext = gl.getExtension(vendorPrefixes[i] + name);
            if (ext) {
                return ext;
            }
        }
    }
    /**
     * Returns a drawing context on the canvas, or null if the context identifier is not supported.
     * @param {HTMLCanvasElement} canvas - HTML canvas object.
     * @param {any} [contextAttributes] - See canvas.getContext contextAttributes.
     * @returns {WebGLContextExt | null} -
     */
    static getContext(canvas, contextAttributes) {
        let ctx = null;
        try {
            let urlParams = new URLSearchParams(location.search);
            let ver = urlParams.get('og_ver');
            if (ver) {
                ctx = canvas.getContext(ver, contextAttributes);
                if (ctx) {
                    ctx.type = ver;
                }
            }
            else {
                for (let i = 0; i < CONTEXT_TYPE.length; i++) {
                    ctx = canvas.getContext(CONTEXT_TYPE[i], contextAttributes);
                    if (ctx) {
                        ctx.type = CONTEXT_TYPE[i];
                        break;
                    }
                }
            }
        }
        catch (ex) {
            cons.logErr("exception during the GL context initialization");
        }
        if (!ctx) {
            cons.logErr("could not initialise WebGL");
        }
        return ctx;
    }
    /**
     * Sets animation frame function.
     * @public
     * @param {Function} callback - Frame callback.
     */
    setFrameCallback(callback) {
        callback && (this._frameCallback = callback);
    }
    /**
     * Creates empty texture.
     * @public
     * @param {number} [width=1] - Specifies the width of the texture image.
     * @param {number} [height=1] - Specifies the width of the texture image.
     * @param {string} [filter="NEAREST"] - Specifies GL_TEXTURE_MIN(MAX)_FILTER texture value.
     * @param {string} [internalFormat="RGBA"] - Specifies the color components in the texture.
     * @param {string} [format="RGBA"] - Specifies the format of the texel data.
     * @param {string} [type="UNSIGNED_BYTE"] - Specifies the data type of the texel data.
     * @param {number} [level=0] - Specifies the level-of-detail number. Level 0 is the base image level. Level n is the nth mipmap reduction image.
     * @returns {WebGLTexture | null} - WebGL texture object.
     */
    createEmptyTexture2DExt(width = 1, height = 1, filter = "NEAREST", internalFormat = "RGBA", format = "RGBA", type = "UNSIGNED_BYTE", level = 0) {
        let gl = this.gl;
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, level, gl[internalFormat.toUpperCase()], width, height, 0, gl[format.toUpperCase()], gl[type.toUpperCase()], null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[filter.toUpperCase()]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[filter.toUpperCase()]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    /**
     * Creates Empty NEAREST filtered texture.
     * @public
     * @param {number} width - Empty texture width.
     * @param {number} height - Empty texture height.
     * @param {number} [internalFormat]
     * @returns {WebGLTexture | null} - WebGL texture object.
     */
    createEmptyTexture_n(width, height, internalFormat) {
        let gl = this.gl;
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat || gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    /**
     * Creates empty LINEAR filtered texture.
     * @public
     * @param {number} width - Empty texture width.
     * @param {number} height - Empty texture height.
     * @param {number} [internalFormat]
     * @returns {WebGLTexture | null} - WebGL texture object.
     */
    createEmptyTexture_l(width, height, internalFormat) {
        let gl = this.gl;
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat || gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    /**
     * Creates NEAREST filter texture.
     * @public
     * @param {HTMLCanvasElement | Image} image - Image or Canvas object.
     * @param {number} [internalFormat]
     * @param {WebGLTexture | null} [texture=null]
     * @returns {WebGLTexture | null} - WebGL texture object.
     */
    createTexture_n_webgl1(image, internalFormat, texture = null) {
        let gl = this.gl;
        texture = texture || gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat || gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    /**
     * Creates LINEAR filter texture.
     * @public
     * @param {ImageSource} image - Image or Canvas object.
     * @param {number} [internalFormat]
     * @param {WebGLTexture | null} [texture]
     * @returns {WebGLTexture | null} - WebGL texture object.
     */
    createTexture_l_webgl1(image, internalFormat, texture = null) {
        let gl = this.gl;
        texture = texture || gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat || gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    /**
     * Creates MIPMAP filter texture.
     * @public
     * @param {ImageSource} image - Image or Canvas object.
     * @param {number} [internalFormat]
     * @param {WebGLTexture | null} [texture]
     * @returns {WebGLTexture | null} - WebGL texture object.
     */
    createTexture_mm_webgl1(image, internalFormat, texture = null) {
        let gl = this.gl;
        texture = texture || gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat || gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    /**
     * Creates ANISOTROPY filter texture.
     * @public
     * @param {ImageSource} image - Image or Canvas object.
     * @param {number} [internalFormat]
     * @param {WebGLTexture | null} [texture]
     * @returns {WebGLTexture | null} - WebGL texture object.
     */
    createTexture_a_webgl1(image, internalFormat, texture = null) {
        let gl = this.gl;
        texture = texture || gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat || gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameterf(gl.TEXTURE_2D, this.extensions.EXT_texture_filter_anisotropic.TEXTURE_MAX_ANISOTROPY_EXT, this._params.anisotropy);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    /**
     * Creates NEAREST filter texture.
     * @public
     * @param {ImageSource} image - Image or Canvas object.
     * @param {number} [internalFormat]
     * @param {WebGLTexture | null} [texture]
     * @returns {WebGLTexture | null} - WebGL texture object.
     */
    createTexture_n_webgl2(image, internalFormat, texture = null) {
        let gl = this.gl;
        texture = texture || gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        //gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texStorage2D(gl.TEXTURE_2D, 1, internalFormat || gl.RGBA8, image.width, image.height);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, image.width, image.height, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    /**
     * Creates LINEAR filter texture.
     * @public
     * @param {ImageSource} image - Image or Canvas object.
     * @param {number} [internalFormat]
     * @param {WebGLTexture | null} [texture]
     * @returns {WebGLTexture | null} - WebGL texture object.
     */
    createTexture_l_webgl2(image, internalFormat, texture = null) {
        let gl = this.gl;
        texture = texture || gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        //gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texStorage2D(gl.TEXTURE_2D, 1, internalFormat || gl.RGBA8, image.width, image.height);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, image.width, image.height, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    /**
     * Creates MIPMAP filter texture.
     * @public
     * @param {ImageSource} image - Image or Canvas object.
     * @param {number} [internalFormat]
     * @param {WebGLTexture | null} [texture]
     * @returns {WebGLTexture | null} - WebGL texture object.
     */
    createTexture_mm_webgl2(image, internalFormat, texture = null) {
        let gl = this.gl;
        texture = texture || gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texStorage2D(gl.TEXTURE_2D, MAX_LEVELS, internalFormat || gl.RGBA8, image.width, image.height);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, image.width, image.height, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    /**
     * Creates ANISOTROPY filter texture.
     * @public
     * @param {ImageSource} image - Image or Canvas object.
     * @param {number} [internalFormat]
     * @param {WebGLTexture | null} [texture]
     * @returns {WebGLTexture | null} - WebGL texture object.
     */
    createTexture_a_webgl2(image, internalFormat, texture = null) {
        let gl = this.gl;
        texture = texture || gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        //gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texStorage2D(gl.TEXTURE_2D, MAX_LEVELS, internalFormat || gl.RGBA8, image.width, image.height);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, image.width, image.height, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameterf(gl.TEXTURE_2D, this.extensions.EXT_texture_filter_anisotropic.TEXTURE_MAX_ANISOTROPY_EXT, this._params.anisotropy);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    /**
     * Creates cube texture.
     * @public
     * @param {Texture3DParams} params - Face image urls:
     * @param {string} params.px - Positive X or right image url.
     * @param {string} params.nx - Negative X or left image url.
     * @param {string} params.py - Positive Y or up image url.
     * @param {string} params.ny - Negative Y or bottom image url.
     * @param {string} params.pz - Positive Z or face image url.
     * @param {string} params.nz - Negative Z or back image url.
     * @returns {WebGLTexture | null} - WebGL texture object.
     */
    loadCubeMapTexture(params) {
        let gl = this.gl;
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        let faces = [
            [params.px, gl.TEXTURE_CUBE_MAP_POSITIVE_X],
            [params.nx, gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
            [params.py, gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
            [params.ny, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
            [params.pz, gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
            [params.nz, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]
        ];
        let imageCanvas = new ImageCanvas();
        imageCanvas.fillEmpty();
        let emptyImage = imageCanvas.getImage();
        for (let i = 0; i < faces.length; i++) {
            let face = faces[i][1];
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
            //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
            gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, emptyImage);
        }
        for (let i = 0; i < faces.length; i++) {
            let face = faces[i][1];
            let image = new Image();
            image.crossOrigin = "";
            image.onload = (function (texture, face, image) {
                return function () {
                    if (gl && texture) {
                        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                        gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                    }
                };
            })(texture, face, image);
            image.src = faces[i][0];
        }
        return texture;
    }
    /**
     * Adds shader program to the handler.
     * @public
     * @param {Program} program - Shader program.
     * @param {boolean} [notActivate] - If it's true program will not compile.
     * @return {Program} -
     */
    addProgram(program, notActivate = false) {
        if (!this.programs[program.name]) {
            let sc = new ProgramController(this, program);
            this.programs[program.name] = sc;
            this._initProgramController(sc);
            if (notActivate) {
                sc._activated = false;
            }
        }
        else {
            console.warn(`Shader program: "${program.name}" already exists.`);
        }
        return program;
    }
    /**
     * Removes shader program from handler.
     * @public
     * @param {string} name - Shader program name.
     */
    removeProgram(name) {
        this.programs[name] && this.programs[name].remove();
    }
    /**
     * Adds shader programs to the handler.
     * @public
     * @param {Array.<Program>} programsArr - Shader program array.
     */
    addPrograms(programsArr) {
        for (let i = 0; i < programsArr.length; i++) {
            this.addProgram(programsArr[i]);
        }
    }
    /**
     * Used in addProgram
     * @protected
     * @param {ProgramController} sc - Program controller
     */
    _initProgramController(sc) {
        if (this._initialized) {
            sc.initialize();
            if (!this.activeProgram) {
                this.activeProgram = sc;
                sc.activate();
            }
            else {
                sc.deactivate();
                this.activeProgram._program.enableAttribArrays();
                this.activeProgram._program.use();
            }
        }
    }
    /**
     * Used in init function.
     * @private
     */
    _initPrograms() {
        for (let p in this.programs) {
            this._initProgramController(this.programs[p]);
        }
    }
    /**
     * Initialize additional WebGL extensions.
     * @public
     * @param {string} extensionStr - Extension name.
     * @param {boolean} showLog - Show logging.
     * @return {any} -
     */
    initializeExtension(extensionStr, showLog = false) {
        if (!(this.extensions && this.extensions[extensionStr])) {
            let ext = Handler.getExtension(this.gl, extensionStr);
            if (ext) {
                this.extensions[extensionStr] = ext;
            }
            else if (showLog) {
                console.warn("og.webgl.Handler: extension '" + extensionStr + "' doesn't initialize.");
            }
        }
        return this.extensions && this.extensions[extensionStr];
    }
    /**
     * Main function that initialize handler.
     * @public
     */
    initialize() {
        if (this._initialized)
            return;
        if (!this.canvas)
            return;
        this.gl = Handler.getContext(this.canvas, this._params.context);
        if (!this.gl)
            return;
        this._initialized = true;
        /** Sets default extensions */
        this._params.extensions.push("EXT_texture_filter_anisotropic");
        if (this.gl.type === "webgl") {
            this._params.extensions.push("OES_standard_derivatives");
            this._params.extensions.push("OES_element_index_uint");
            this._params.extensions.push("WEBGL_depth_texture");
            this._params.extensions.push("ANGLE_instanced_arrays");
            //this._params.extensions.push("WEBGL_draw_buffers");
            //this._params.extensions.push("EXT_frag_depth");
        }
        else {
            this._params.extensions.push("EXT_color_buffer_float");
            this._params.extensions.push("OES_texture_float_linear");
            //this._params.extensions.push("WEBGL_draw_buffers");
        }
        let i = this._params.extensions.length;
        while (i--) {
            this.initializeExtension(this._params.extensions[i], true);
        }
        if (this.gl.type === "webgl") {
            this.createTexture_n = this.createTexture_n_webgl1.bind(this);
            this.createTexture_l = this.createTexture_l_webgl1.bind(this);
            this.createTexture_mm = this.createTexture_mm_webgl1.bind(this);
            this.createTexture_a = this.createTexture_a_webgl1.bind(this);
        }
        else {
            this.createTexture_n = this.createTexture_n_webgl2.bind(this);
            this.createTexture_l = this.createTexture_l_webgl2.bind(this);
            this.createTexture_mm = this.createTexture_mm_webgl2.bind(this);
            this.createTexture_a = this.createTexture_a_webgl2.bind(this);
        }
        this.createTexture["NEAREST"] = this.createTexture_n;
        this.createTexture["LINEAR"] = this.createTexture_l;
        this.createTexture["MIPMAP"] = this.createTexture_mm;
        this.createTexture["ANISOTROPIC"] = this.createTexture_a;
        if (!this.extensions.EXT_texture_filter_anisotropic) {
            this.createTextureDefault = this.createTexture_mm;
        }
        else {
            this.createTextureDefault = this.createTexture_a;
        }
        /** Initializing shaders and rendering parameters*/
        this._initPrograms();
        this._setDefaults();
        this.intersectionObserver = new IntersectionObserver((entries) => {
            this._toggleVisibilityChange(entries[0].isIntersecting);
        }, { threshold: 0 });
        this.intersectionObserver.observe(this.canvas);
        this.resizeObserver = new ResizeObserver(entries => {
            this._toggleVisibilityChange(entries[0].contentRect.width !== 0 && entries[0].contentRect.height !== 0);
        });
        this.resizeObserver.observe(this.canvas);
        document.addEventListener("visibilitychange", () => {
            this._toggleVisibilityChange(document.visibilityState === 'visible');
        });
    }
    _toggleVisibilityChange(visibility) {
        if (visibility) {
            this.start();
            this.ONCANVASRESIZE && this.ONCANVASRESIZE();
            this.events.dispatch(this.events.visibilitychange, true);
        }
        else {
            this.events.dispatch(this.events.visibilitychange, false);
            this.stop();
        }
    }
    /**
     * Sets default gl render parameters. Used in init function.
     * @protected
     */
    _setDefaults() {
        let gl = this.gl;
        if (!gl)
            return;
        if (!this.canvas)
            return;
        gl.depthFunc(gl.LESS);
        gl.enable(gl.DEPTH_TEST);
        this.setSize(this.canvas.clientWidth || this._params.width, this.canvas.clientHeight || this._params.height);
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);
        gl.enable(gl.CULL_FACE);
        gl.disable(gl.BLEND);
        this.createDefaultTexture({ color: "rgba(0,0,0,0.0)" }, (t) => {
            this.transparentTexture = t;
        });
        this.createDefaultTexture({ color: "rgba(255, 255, 255, 1.0)" }, (t) => {
            this.defaultTexture = t;
        });
    }
    getCanvasSize() {
        return this._canvasSize;
    }
    /**
     * Creates STREAM_DRAW ARRAY buffer.
     * @public
     * @param {number} itemSize - Array item size.
     * @param {number} numItems - Items quantity.
     * @param {number} [usage=STATIC_DRAW] - Parameter of the bufferData call can be one of STATIC_DRAW, DYNAMIC_DRAW, or STREAM_DRAW.
     * @param {number} [bytes=4] -
     * @return {WebGLBufferExt} -
     */
    createStreamArrayBuffer(itemSize, numItems, usage, bytes = 4) {
        let gl = this.gl;
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, numItems * itemSize * bytes, usage || gl.STREAM_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        buffer.itemSize = itemSize;
        buffer.numItems = numItems;
        return buffer;
    }
    /**
     * Sets stream buffer.
     * @public
     * @param {WebGLBufferExt} buffer -
     * @param {TypedArray} array -
     * @param {number} [offset=0] -
     * @return {WebGLBufferExt} -
     */
    setStreamArrayBuffer(buffer, array, offset = 0) {
        let gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, offset, array);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return buffer;
    }
    /**
     * Creates ARRAY buffer.
     * @public
     * @param {TypedArray} array - Input array.
     * @param {number} itemSize - Array item size.
     * @param {number} numItems - Items quantity.
     * @param {number} [usage=STATIC_DRAW] - Parameter of the bufferData call can be one of STATIC_DRAW, DYNAMIC_DRAW, or STREAM_DRAW.
     * @return {WebGLBufferExt} -
     */
    createArrayBuffer(array, itemSize, numItems, usage) {
        let gl = this.gl;
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, array, usage || gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        buffer.itemSize = itemSize;
        buffer.numItems = numItems;
        return buffer;
    }
    /**
     * Creates ARRAY buffer specific length.
     * @public
     * @param {number} size -
     * @param {number} [usage=STATIC_DRAW] - Parameter of the bufferData call can be one of STATIC_DRAW, DYNAMIC_DRAW, or STREAM_DRAW.
     * @return {WebGLBufferExt} -
     */
    createArrayBufferLength(size, usage) {
        let gl = this.gl;
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, size, usage || gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        buffer.itemSize = 1;
        buffer.numItems = size;
        return buffer;
    }
    /**
     * Creates ELEMENT ARRAY buffer.
     * @public
     * @param {TypedArray} array - Input array.
     * @param {number} itemSize - Array item size.
     * @param {number} numItems - Items quantity.
     * @param {number} [usage=STATIC_DRAW] - Parameter of the bufferData call can be one of STATIC_DRAW, DYNAMIC_DRAW, or STREAM_DRAW.
     * @return {Object} -
     */
    createElementArrayBuffer(array, itemSize, numItems, usage) {
        let gl = this.gl;
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, usage || gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        buffer.itemSize = itemSize;
        buffer.numItems = numItems || array.length;
        return buffer;
    }
    /**
     * Sets handler canvas size.
     * @public
     * @param {number} w - Canvas width.
     * @param {number} h - Canvas height.
     */
    setSize(w, h) {
        this._params.width = w;
        this._params.height = h;
        if (this.canvas) {
            this.canvas.width = w * this._params.pixelRatio;
            this.canvas.height = h * this._params.pixelRatio;
            this._canvasSize[0] = this.canvas.width;
            this._canvasSize[1] = this.canvas.height;
            this._oneByHeight = 1.0 / this.canvas.height;
            this.gl && this.gl.viewport(0, 0, w, h);
            this.ONCANVASRESIZE && this.ONCANVASRESIZE(this.canvas);
            this.events.dispatch(this.events.resize, this);
        }
    }
    get pixelRatio() {
        return this._params.pixelRatio;
    }
    set pixelRatio(pr) {
        this._params.pixelRatio = pr;
        this.setSize(this._params.width, this._params.height);
    }
    /**
     * Returns context screen width.
     * @public
     * @returns {number} -
     */
    getWidth() {
        return this.canvas ? this.canvas.width : 0;
    }
    /**
     * Returns context screen height.
     * @public
     * @returns {number} -
     */
    getHeight() {
        return this.canvas ? this.canvas.height : 0;
    }
    /**
     * Returns canvas aspect ratio.
     * @public
     * @returns {number} -
     */
    getClientAspect() {
        return this.canvas ? this.canvas.clientWidth / this.canvas.clientHeight : 0;
    }
    /**
     * Returns canvas center coordinates.
     * @public
     * @returns {number} -
     */
    getCenter() {
        let c = this.canvas;
        return c ? new Vec2(Math.round(c.width * 0.5), Math.round(c.height * 0.5)) : new Vec2();
    }
    /**
     * Draw single frame.
     * @public
     */
    drawFrame() {
        /** Calculating frame time */
        let now = window.performance.now();
        this.deltaTime = now - this._lastAnimationFrameTime;
        this._lastAnimationFrameTime = now;
        this.defaultClock.tick(this.deltaTime);
        for (let i = 0; i < this._clocks.length; i++) {
            this._clocks[i].tick(this.deltaTime);
        }
        /** Canvas resize checking */
        let canvas = this.canvas;
        if (Math.floor(canvas.clientWidth * this._params.pixelRatio) !== canvas.width || Math.floor(canvas.clientHeight * this._params.pixelRatio) !== canvas.height) {
            if (canvas.clientWidth === 0 || canvas.clientHeight === 0) {
                this.stop();
            }
            else if (!document.hidden) {
                this.start();
                this.setSize(canvas.clientWidth, canvas.clientHeight);
            }
        }
        /** Draw frame */
        this._frameCallback();
    }
    /**
     * Clearing gl frame.
     * @public
     */
    clearFrame() {
        let gl = this.gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    /**
     * Starts animation loop.
     * @public
     */
    start() {
        if (!this._requestAnimationFrameId && this._initialized) {
            this._animationFrameCallback();
        }
    }
    stop() {
        if (this._requestAnimationFrameId) {
            window.cancelAnimationFrame(this._requestAnimationFrameId);
            this._requestAnimationFrameId = 0;
        }
    }
    isStopped() {
        return !this._requestAnimationFrameId;
    }
    /**
     * Check is gl context type equals webgl2
     * @public
     */
    isWebGl2() {
        return this.gl ? this.gl.type === "webgl2" : false;
    }
    /**
     * Make animation.
     * @protected
     */
    _animationFrameCallback() {
        this._requestAnimationFrameId = window.requestAnimationFrame(() => {
            this.drawFrame();
            this._requestAnimationFrameId && this._animationFrameCallback();
        });
    }
    /**
     * Creates default texture object
     * @public
     * @param {IDefaultTextureParams | null} params - Texture parameters:
     * @param {(texture: WebGLTextureExt) => void} [success] - Creation callback
     */
    createDefaultTexture(params, success) {
        let imgCnv;
        let texture;
        if (params && params.color) {
            imgCnv = new ImageCanvas(2, 2);
            imgCnv.fillColor(params.color);
            texture = this.createTexture_n(imgCnv.getCanvas());
            texture.default = true;
            success(texture);
        }
        else if (params && params.url) {
            let img = new Image();
            let that = this;
            img.onload = function () {
                texture = that.createTextureDefault(img);
                texture.default = true;
                success(texture);
            };
            img.src = params.url;
        }
        else {
            imgCnv = new ImageCanvas(2, 2);
            imgCnv.fillColor("#C5C5C5");
            texture = this.createTexture_n(imgCnv.getCanvas());
            texture.default = true;
            success(texture);
        }
    }
    deleteTexture(texture) {
        if (texture && !texture.default) {
            this.gl.deleteTexture(texture);
        }
    }
    /**
     * @public
     */
    destroy() {
        this.resizeObserver?.disconnect();
        this.intersectionObserver?.disconnect();
        this.stop();
        //
        // Dispose shaders
        //
        for (let p in this.programs) {
            this.removeProgram(p);
        }
        //
        // Clear WebGL context
        //
        let gl = this.gl;
        if (gl) {
            gl.deleteTexture(this.transparentTexture);
            this.transparentTexture = null;
            gl.deleteTexture(this.defaultTexture);
            this.defaultTexture = null;
            this.framebufferStack = new Stack();
            //
            // Clear attrib pointers
            //
            let numAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
            let tmp = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, tmp);
            for (let ii = 0; ii < numAttribs; ++ii) {
                gl.disableVertexAttribArray(ii);
                gl.vertexAttribPointer(ii, 4, gl.FLOAT, false, 0, 0);
                gl.vertexAttrib1f(ii, 0);
            }
            gl.deleteBuffer(tmp);
            //
            // Clear all possible textures
            //
            let numTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
            for (let ii = 0; ii < numTextureUnits; ++ii) {
                gl.activeTexture(gl.TEXTURE0 + ii);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
                gl.bindTexture(gl.TEXTURE_2D, null);
            }
            //
            // Hard reset
            //
            gl.activeTexture(gl.TEXTURE0);
            gl.useProgram(null);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.disable(gl.BLEND);
            gl.disable(gl.CULL_FACE);
            gl.disable(gl.DEPTH_TEST);
            gl.disable(gl.DITHER);
            gl.disable(gl.SCISSOR_TEST);
            gl.blendColor(0, 0, 0, 0);
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ONE, gl.ZERO);
            gl.clearColor(0, 0, 0, 0);
            gl.clearDepth(1);
            gl.clearStencil(-1);
        }
        //
        // Destroy canvas
        //
        if (this.canvas) {
            if (this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
            this.canvas.width = 1;
            this.canvas.height = 1;
            this.canvas = null;
        }
        this.gl = null;
        this._initialized = false;
    }
    addClock(clock) {
        if (!clock.__handler) {
            clock.__handler = this;
            this._clocks.push(clock);
        }
    }
    addClocks(clockArr) {
        for (let i = 0; i < clockArr.length; i++) {
            this.addClock(clockArr[i]);
        }
    }
    removeClock(clock) {
        if (clock.__handler) {
            let c = this._clocks;
            let i = c.length;
            while (i--) {
                if (c[i].isEqual(clock)) {
                    clock.__handler = null;
                    c.splice(i, 1);
                    break;
                }
            }
        }
    }
}
export { Handler };
