import { Vec3 } from "./Vec3";
import { Mat4 } from "./Mat4";
import { Mat3 } from "./Mat3";
/**
 * A set of 4-dimensional coordinates used to represent rotation in 3-dimensional space.
 * @constructor
 * @param {Number} [x=0.0] The X component.
 * @param {Number} [y=0.0] The Y component.
 * @param {Number} [z=0.0] The Z component.
 * @param {Number} [w=0.0] The W component.
 */
export declare class Quat {
    /**
     * The X component.
     * @public
     * @type {Number}
     * @default 0.0
     */
    x: number;
    /**
     * The Y component.
     * @public
     * @type {Number}
     * @default 0.0
     */
    y: number;
    /**
     * The Z component.
     * @public
     * @type {Number}
     * @default 0.0
     */
    z: number;
    /**
     * The W component.
     * @public
     * @type {Number}
     * @default 0.0
     */
    w: number;
    constructor(x?: number, y?: number, z?: number, w?: number);
    /**
     * Identity Quat.
     * @const
     * @type {Quat}
     */
    static get IDENTITY(): Quat;
    /**
     * Returns a Quat represents rotation around X axis.
     * @static
     * @param {number} a - The angle in radians to rotate around the axis.
     * @returns {Quat} -
     */
    static xRotation(a: number): Quat;
    /**
     * Returns a Quat represents rotation around Y axis.
     * @static
     * @param {number} a - The angle in radians to rotate around the axis.
     * @returns {Quat} -
     */
    static yRotation(a: number): Quat;
    /**
     * Returns a Quat represents rotation around Z axis.
     * @static
     * @param {number} a - The angle in radians to rotate around the axis.
     * @returns {Quat} -
     */
    static zRotation(a: number): Quat;
    /**
     * Computes a Quat representing a rotation around an axis.
     * @static
     * @param {Vec3} axis - The axis of rotation.
     * @param {number} [angle=0.0] The angle in radians to rotate around the axis.
     * @returns {Quat} -
     */
    static axisAngleToQuat(axis: Vec3, angle?: number): Quat;
    /**
     * Computes a rotation from the given heading and up vector.
     * @static
     * @param {Vec3} forward - Heading target coordinates.
     * @param {Vec3} up - Up vector.
     * @returns {Quat} -
     */
    static getLookRotation(forward: Vec3, up: Vec3): Quat;
    /**
     * Computes a Quat from source point heading to the destination point.
     * @static
     * @param {Vec3} sourcePoint - Source coordinate.
     * @param {Vec3} destPoint - Destination coordinate.
     * @returns {Quat} -
     */
    static getLookAtSourceDest(sourcePoint: Vec3, destPoint: Vec3): Quat;
    /**
     * Compute rotation between two vectors.
     * @static
     * @param {Vec3} u - First vector.
     * @param {Vec3} v - Second vector.
     * @returns {Quat} -
     */
    static getRotationBetweenVectors(u: Vec3, v: Vec3): Quat;
    /**
     * Compute rotation between two vectors.
     * @static
     * @param {Vec3} u - First vector.
     * @param {Vec3} v - Second vector.
     * @param {Quat} res
     * @returns {Quat} -
     */
    static getRotationBetweenVectorsRes(u: Vec3, v: Vec3, res: Quat): Quat;
    /**
     * Compute rotation between two vectors with around vector up
     * for exactly opposite vectors. If vectors exactly in the same
     * direction as returns identity Quat.
     * @static
     * @param {Vec3} source - First vector.
     * @param {Vec3} dest - Second vector.
     * @param {Vec3} up - Up vector.
     * @returns {Quat} -
     */
    static getRotationBetweenVectorsUp(source: Vec3, dest: Vec3, up: Vec3): Quat;
    /**
     * Returns true if the components are zero.
     * @public
     * @returns {boolean} -
     */
    isZero(): boolean;
    /**
     * Clear Quat. Sets zeroes.
     * @public
     * @returns {Quat} -
     */
    clear(): Quat;
    /**
     * Sets Quat values.
     * @public
     * @param {Number} [x=0.0] The X component.
     * @param {Number} [y=0.0] The Y component.
     * @param {Number} [z=0.0] The Z component.
     * @param {Number} [w=0.0] The W component.
     * @returns {Quat} -
     */
    set(x: number, y: number, z: number, w: number): Quat;
    /**
     * Copy Quat values.
     * @public
     * @param {Quat} q - Copy Quat.
     * @returns {Quat} -
     */
    copy(q: Quat): Quat;
    /**
     * Set current Quat instance to identity Quat.
     * @public
     * @returns {Quat} -
     */
    setIdentity(): Quat;
    /**
     * Duplicates a Quat instance.
     * @public
     * @returns {Quat} -
     */
    clone(): Quat;
    /**
     * Computes the componentwise sum of two Quats.
     * @public
     * @param {Quat} q - Quat to add.
     * @returns {Quat} -
     */
    add(q: Quat): Quat;
    /**
     * Computes the componentwise difference of two Quats.
     * @public
     * @param {Quat} q - Quat to subtract.
     * @returns {Quat} -
     */
    sub(q: Quat): Quat;
    /**
     * Multiplies the provided Quat componentwise by the provided scalar.
     * @public
     * @param {Number} scale - The scalar to multiply with.
     * @returns {Quat} -
     */
    scaleTo(scale: number): Quat;
    /**
     * Multiplies the provided Quat componentwise.
     * @public
     * @param {Number} scale - The scalar to multiply with.
     * @returns {Quat} -
     */
    scale(scale: number): Quat;
    /**
     * Converts Quat values to array.
     * @public
     * @returns {Array.<number>} - (exactly 4 entries)
     */
    toVec(): [number, number, number, number];
    /**
     * Sets current quaternion by spherical coordinates.
     * @public
     * @param {number} lat - Latitude.
     * @param {number} lon - Longitude.
     * @param {number} angle - Angle in radians.
     * @returns {Quat} -
     */
    setFromSphericalCoords(lat: number, lon: number, angle: number): Quat;
    /**
     * Sets rotation with the given heading and up vectors.
     * @static
     * @param {Vec3} forward - Heading target coordinates.
     * @param {Vec3} up - Up vector.
     * @returns {Quat} -
     */
    setLookRotation(forward: Vec3, up: Vec3): Quat;
    /**
     * Gets spherical coordinates.
     * @public
     * @returns {Object} Returns object with latitude, longitude and alpha.
     */
    toSphericalCoords(): any;
    /**
     * Sets current Quat representing a rotation around an axis.
     * @public
     * @param {Vec3} axis - The axis of rotation.
     * @param {number} angle The angle in radians to rotate around the axis.
     * @returns {Quat} -
     */
    setFromAxisAngle(axis: Vec3, angle: number): Quat;
    /**
     * Returns axis and angle of the current Quat.
     * @public
     * @returns {Object} -
     */
    getAxisAngle(): any;
    /**
     * Sets current Quat by Euler's angles.
     * @public
     * @param {number} pitch - Pitch angle in degrees.
     * @param {number} yaw - Yaw angle in degrees.
     * @param {number} roll - Roll angle in degrees.
     * @returns {Quat} -
     */
    setFromEulerAngles(pitch: number, yaw: number, roll: number): Quat;
    /**
     * Returns Euler's angles of the current Quat.
     * @public
     * @returns {Object} -
     */
    getEulerAngles(): any;
    /**
     * Computes a Quat from the provided 4x4 matrix instance.
     * @public
     * @param {Mat4} mx - The rotation matrix.
     * @returns {Quat} -
     */
    setFromMatrix4(mx: Mat4): Quat;
    /**
     * Converts current Quat to the rotation 4x4 matrix.
     * @public
     * @params {Mat4} [out] - Output matrix
     * @returns {Mat4} -
     */
    getMat4(out?: Mat4): Mat4;
    /**
     * Converts current Quat to the rotation 3x3 matrix.
     * @public
     * @returns {Mat3} -
     * @todo NOT TESTED
     */
    getMat3(): Mat3;
    /**
     * Returns quaternion and vector production.
     * @public
     * @param {Vec3} v - 3d Vector.
     * @returns {Vec3} -
     */
    mulVec3(v: Vec3): Vec3;
    /**
     * Computes the product of two Quats.
     * @public
     * @param {Quat} q - Quat to multiply.
     * @returns {Quat} -
     */
    mul(q: Quat): Quat;
    /**
     * Computes the product of two Quats.
     * @public
     * @param {Quat} q - Quat to multiply.
     * @returns {Quat} -
     */
    mulA(q: Quat): Quat;
    /**
     * Gets the conjugate of the Quat.
     * @public
     * @returns {Quat} -
     */
    conjugate(): Quat;
    /**
     * Computes the inverse of the Quat.
     * @public
     * @returns {Quat} -
     */
    inverse(): Quat;
    /**
     * Computes a magnitude of the Quat.
     * @public
     * @returns {number} -
     */
    magnitude(): number;
    /**
     * Computes a squared magnitude of the Quat.
     * @public
     * @returns {number} -
     */
    magnitude2(): number;
    /**
     * Computes the dot (scalar) product of two Quats.
     * @public
     * @param {Quat} q - Second quaternion.
     * @returns {number} -
     */
    dot(q: Quat): number;
    /**
     * Current Quat normalization.
     * @public
     * @returns {Quat} -
     */
    normalize(): Quat;
    /**
     * Compares two Quats.
     * @public
     * @param {Quat} q - Second quaternion.
     * @returns {Boolean} -
     */
    isEqual(q: Quat): boolean;
    /**
     * Performs a spherical linear interpolation between two Quats.
     * @public
     * @param {Quat} b - The end rotation Quat.
     * @param {number} t - interpolation amount between the two Quats.
     * @returns {Quat} -
     */
    slerp(b: Quat, t: number): Quat;
    /**
     * Returns a roll angle in radians.
     * @public
     * @param {Boolean} [reprojectAxis] -
     * @returns {Number} -
     */
    getRoll(reprojectAxis?: boolean): number;
    /**
     * Returns a pitch angle in radians.
     * @public
     * @param {Boolean} [reprojectAxis] -
     * @returns {number} -
     */
    getPitch(reprojectAxis?: boolean): number;
    /**
     * Returns a yaw angle in radians.
     * @public
     * @param {Boolean} [reprojectAxis] -
     * @returns {number} -
     */
    getYaw(reprojectAxis?: boolean): number;
}
/**
 * Creates Quat instance.
 * @function
 * @param {Number} [x=0.0] The X component.
 * @param {Number} [y=0.0] The Y component.
 * @param {Number} [z=0.0] The Z component.
 * @param {Number} [w=0.0] The W component.
 * @returns {Quat} -
 */
export declare function quat(x?: number, y?: number, z?: number, w?: number): Quat;
