import { Geometry } from './Geometry';
import type { WordBlock } from './BlockStruct';

export class Word {
  confidence: number;
  geometry: Geometry;
  id: string;
  text: string;
  block: WordBlock;

  constructor(block: WordBlock) {
    this.block = block;
    this.confidence = block.Confidence;
    this.geometry = new Geometry(block.Geometry);
    this.id = block.Id;
    this.text = block.Text ?? '';
  }

  toString() {
    return this.text;
  }
}
