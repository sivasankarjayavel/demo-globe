import { Sphere } from "../bv/Sphere";
import { Vec3 } from './Vec3';
/**
 * @todo: write tests
 * @class Line3
 * Represents a line segment in 3d space.
 * @param {Vec3} [p0] - First point of the line
 * @param {Vec3} [p1] - Second point of the line
 */
export declare class Line3 {
    /**
     * First point of the line
     * @public
     * @type: Vec3
     */
    p0: Vec3;
    /**
     * Second point of the line
     * @public
     * @type: Vec3
     */
    p1: Vec3;
    constructor(p0?: Vec3, p1?: Vec3);
    getMagnitude(): number;
    getSphereIntersection(sphere: Sphere): [Vec3] | [Vec3, Vec3] | [];
    intersects(line: Line3, res: Vec3, res2?: Vec3): boolean;
    getNearestDistancePoint(point: Vec3, res: Vec3): boolean;
}
