export interface PolygonStruct {
  X: number;
  Y: number;
}

export class Polygon {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `x: ${this.x}, y: ${this.y}`;
  }
}
