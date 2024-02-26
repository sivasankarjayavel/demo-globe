import * as math from "../math";
import { Control } from "./Control";
import { input } from "../input/input";
import { Vec3 } from "../math/Vec3";
/**
 * Planet camera keyboard navigation. Use W,S,A,D and left shift key for fly around a planet.
 */
export class KeyboardNavigation extends Control {
    constructor(options = {}) {
        options = options || {};
        super({ name: "KeyboardNavigation", ...options });
        this.step = options.step || 250;
    }
    onactivate() {
        let r = this.renderer;
        r.events.on("keypress", input.KEY_PGUP, this.onCameraMoveForward, this);
        r.events.on("keypress", input.KEY_PGDN, this.onCameraMoveBackward, this);
        r.events.on("keypress", input.KEY_PLUS, this.onCameraMoveForward, this);
        r.events.on("keypress", input.KEY_EQUALS, this.onCameraMoveForward, this);
        r.events.on("keypress", input.KEY_MINUS, this.onCameraMoveBackward, this);
        r.events.on("keypress", input.KEY_W, this.onCameraMoveForward, this);
        r.events.on("keypress", input.KEY_S, this.onCameraMoveBackward, this);
        r.events.on("keypress", input.KEY_A, this.onCameraStrifeLeft, this);
        r.events.on("keypress", input.KEY_D, this.onCameraStrifeRight, this);
        r.events.on("keypress", input.KEY_UP, this.onCameraLookUp, this);
        r.events.on("keypress", input.KEY_DOWN, this.onCameraLookDown, this);
        r.events.on("keypress", input.KEY_LEFT, this.onCameraLookLeft, this);
        r.events.on("keypress", input.KEY_RIGHT, this.onCameraLookRight, this);
        r.events.on("keypress", input.KEY_Q, this.onCameraRollLeft, this);
        r.events.on("keypress", input.KEY_E, this.onCameraRollRight, this);
        r.events.on("keypress", input.KEY_N, this.onCameraRollNorth, this);
    }
    ondeactivate() {
        let r = this.renderer;
        r.events.off("keypress", input.KEY_PGUP, this.onCameraMoveForward);
        r.events.off("keypress", input.KEY_PGDN, this.onCameraMoveBackward);
        r.events.off("keypress", input.KEY_PLUS, this.onCameraMoveForward);
        r.events.off("keypress", input.KEY_EQUALS, this.onCameraMoveForward);
        r.events.off("keypress", input.KEY_MINUS, this.onCameraMoveBackward);
        r.events.off("keypress", input.KEY_W, this.onCameraMoveForward);
        r.events.off("keypress", input.KEY_S, this.onCameraMoveBackward);
        r.events.off("keypress", input.KEY_A, this.onCameraStrifeLeft);
        r.events.off("keypress", input.KEY_D, this.onCameraStrifeRight);
        r.events.off("keypress", input.KEY_UP, this.onCameraLookUp);
        r.events.off("keypress", input.KEY_DOWN, this.onCameraLookDown);
        r.events.off("keypress", input.KEY_LEFT, this.onCameraLookLeft);
        r.events.off("keypress", input.KEY_RIGHT, this.onCameraLookRight);
        r.events.off("keypress", input.KEY_Q, this.onCameraRollLeft);
        r.events.off("keypress", input.KEY_E, this.onCameraRollRight);
        r.events.off("keypress", input.KEY_N, this.onCameraRollNorth);
    }
    oninit() {
        this.activate();
    }
    onCameraMoveForward() {
        let cam = this.planet.camera;
        cam.slide(0, 0, -cam._lonLat.height / this.step);
    }
    onCameraMoveBackward() {
        let cam = this.planet.camera;
        cam.slide(0, 0, cam._lonLat.height / this.step);
    }
    onCameraStrifeLeft() {
        let cam = this.planet.camera;
        cam.slide(-cam._lonLat.height / this.step, 0, 0);
    }
    onCameraStrifeRight() {
        let cam = this.planet.camera;
        cam.slide(cam._lonLat.height / this.step, 0, 0);
    }
    onCameraLookUp() {
        let cam = this.planet.camera;
        if (this.renderer.events.isKeyPressed(input.KEY_SHIFT)) {
            cam.pitch(15 / this.renderer.handler.deltaTime);
        }
        else {
            cam.rotateVertical((cam._lonLat.height / 3000000) * math.RADIANS, Vec3.ZERO);
        }
    }
    onCameraLookDown() {
        let cam = this.planet.camera;
        if (this.renderer.events.isKeyPressed(input.KEY_SHIFT)) {
            cam.pitch(-15 / this.renderer.handler.deltaTime);
        }
        else {
            cam.rotateVertical((-cam._lonLat.height / 3000000) * math.RADIANS, Vec3.ZERO);
        }
    }
    onCameraLookLeft() {
        let cam = this.planet.camera;
        if (this.renderer.events.isKeyPressed(input.KEY_SHIFT)) {
            cam.roll(15 / this.renderer.handler.deltaTime);
        }
        else {
            cam.rotateHorizontal((cam._lonLat.height / 3000000) * math.RADIANS);
        }
    }
    onCameraLookRight() {
        let cam = this.planet.camera;
        if (this.renderer.events.isKeyPressed(input.KEY_SHIFT)) {
            cam.roll(-15 / this.renderer.handler.deltaTime);
        }
        else {
            cam.rotateHorizontal((-cam._lonLat.height / 3000000) * math.RADIANS);
        }
    }
    onCameraTurnLeft() {
        let cam = this.planet.camera;
        if (this.renderer.events.isKeyPressed(input.KEY_SHIFT)) {
            cam.yaw(15 / this.renderer.handler.deltaTime);
        }
        else {
            cam.rotateHorizontal((cam._lonLat.height / 3000000) * math.RADIANS);
        }
    }
    onCameraTurnRight() {
        let cam = this.planet.camera;
        if (this.renderer.events.isKeyPressed(input.KEY_SHIFT)) {
            cam.yaw(-15 / this.renderer.handler.deltaTime);
        }
        else {
            cam.rotateHorizontal((-cam._lonLat.height / 3000000) * math.RADIANS, false, Vec3.ZERO);
        }
    }
    // from CompassButton._onClick()
    onCameraRollNorth() {
        let c = this.planet.getCartesianFromPixelTerrain(this.renderer.handler.getCenter());
        if (c) {
            this.planet.flyCartesian(c.normal().scaleTo(c.length() + c.distance(this.planet.camera.eye)), null, null, 0, null, null, () => {
                this.planet.camera.look;
            });
        }
        else {
            this.planet.flyCartesian(this.planet.camera.eye);
        }
    }
    onCameraRollLeft() {
        this.planet.camera.roll(-15 / this.renderer.handler.deltaTime);
    }
    onCameraRollRight() {
        this.planet.camera.roll(15 / this.renderer.handler.deltaTime);
    }
}
