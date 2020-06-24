export interface BoundingBoxStruct {
  Width: number;
  Height: number;
  Left: number;
  Top: number;
}

export class BoundingBox {
  width: number;
  height: number;
  left: number;
  top: number;

  constructor(width: number, height: number, left: number, top: number) {
    this.width = width;
    this.height = height;
    this.left = left;
    this.top = top;
  }

  toString() {
    return `width: ${this.width}, height: ${this.height}, left: ${this.left}, top: ${this.top}`;
  }
}
