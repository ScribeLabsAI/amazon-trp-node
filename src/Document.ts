import { readFile } from 'fs/promises';
import { Page } from './Page';
import type { BlockMap, BlockStruct } from './BlockStruct';

export class Document {
  pages: Page[];
  blocks: BlockStruct[];
  blockMap: BlockMap;

  constructor(blocks: BlockStruct[]) {
    this.pages = [];
    this.blocks = blocks;
    this.blockMap = {};
    this.parse();
  }

  toString() {
    return `\nDocument\n==========\n${this.pages.map((p) => `${p}`).join('\n\n')}`;
  }

  parse() {
    let blocks: BlockStruct[] = [];
    this.blocks.forEach((b) => {
      if (b.Id) {
        this.blockMap[b.Id] = b;
      }
      if (b.BlockType === 'PAGE') {
        if (blocks.length > 0) {
          this.pages.push(new Page(blocks, this.blockMap));
        }
        blocks = [];
      }
      blocks.push(b);
    });
    if (blocks.length > 0) {
      this.pages.push(new Page(blocks, this.blockMap));
    }
  }

  getBlockById(blockId: string) {
    return this.blockMap[blockId];
  }

  static async fromFile(file: string): Promise<Document> {
    const content = await readFile(file, { encoding: 'utf8' });
    const blocks = JSON.parse(content) as BlockStruct[];
    return new Document(blocks);
  }
}
