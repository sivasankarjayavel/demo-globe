import * as mercator from "../mercator";
import * as quadTree from "../quadTree/quadTree";
import { Extent } from "../Extent";
import { Node } from "../quadTree/Node";
import { QuadTreeStrategy } from "./QuadTreeStrategy";
import { Segment } from "../segment/Segment";
import { SegmentLonLat } from "../segment/SegmentLonLat";
export class EarthQuadTreeStrategy extends QuadTreeStrategy {
    constructor(planet) {
        super(planet, "Earth");
    }
    init() {
        this._quadTreeList = [
            new Node(Segment, this.planet, quadTree.NW, null, 0, 0, Extent.createFromArray([-20037508.34, -20037508.34, 20037508.34, 20037508.34])),
            new Node(SegmentLonLat, this.planet, quadTree.NW, null, 0, 0, Extent.createFromArray([-180, mercator.MAX_LAT, 180, 90])),
            new Node(SegmentLonLat, this.planet, quadTree.NW, null, 0, 0, Extent.createFromArray([-180, -90, 180, mercator.MIN_LAT]))
        ];
    }
}
