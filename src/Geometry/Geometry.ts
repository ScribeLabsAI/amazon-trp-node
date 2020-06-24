import { BoundingBox } from './BoundingBox';
import { Polygon } from './Polygon';
import type { BoundingBoxStruct } from './BoundingBox';
import type { PolygonStruct } from './Polygon';

export interface GeometryStruct {
  BoundingBox: BoundingBoxStruct;
  Polygon: PolygonStruct[];
}

export class Geometry {
  boundingBox: BoundingBox;
  polygon: Polygon[];

  constructor(geometry: GeometryStruct) {
    const { Width, Height, Left, Top } = geometry.BoundingBox;
    this.boundingBox = new BoundingBox(Width, Height, Left, Top);
    this.polygon = geometry.Polygon.map(({ X, Y }) => new Polygon(X, Y));
  }

  toString() {
    return `BoundingBox: ${this.boundingBox}`;
  }
}
