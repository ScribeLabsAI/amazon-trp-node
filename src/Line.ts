import { Geometry } from './Geometry';
import { Word } from './Word';
import type { BlockMap, LineBlock } from './BlockStruct';

export class Line {
  block: LineBlock;
  confidence: number;
  geometry: Geometry;
  id: string;
  text: string;
  words: Word[];

  constructor(block: LineBlock, blockMap: BlockMap) {
    this.block = block;
    this.confidence = block.Confidence;
    this.geometry = new Geometry(block.Geometry);
    this.id = block.Id;
    this.text = block.Text ?? '';
    this.words = [];
    block.Relationships.filter((rs) => rs.Type === 'CHILD').forEach((rs) => {
      rs.Ids.forEach((id) => {
        const b = blockMap[id];
        if (b?.BlockType === 'WORD') {
          this.words.push(new Word(b));
        }
      });
    });
  }

  toString() {
    return `Line\n==========\n${this.text}\nWords\n----------\n${this.words
      .map((w) => `[${w}]`)
      .join('')}`;
  }
}
