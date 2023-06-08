import { readFile } from 'node:fs/promises';
import { BlockStructSchema, type BlockMap, type BlockStruct } from './BlockStruct.js';
import { Page } from './Page.js';

export class ParseError extends Error {
  override name: 'ParseError';

  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

export class Document {
  pages: Page[];
  blocks: BlockStruct[];
  blockMap: BlockMap;

  constructor(blocks: BlockStruct[]) {
    const ret = BlockStructSchema.array().safeParse(blocks);
    if (!ret.success) throw new ParseError(ret.error.message);
    this.pages = [];
    this.blocks = blocks;
    this.blockMap = {};
    this.parse();
  }

  toString() {
    // eslint-disable-next-line sonarjs/no-nested-template-literals
    return `\nDocument\n==========\n${this.pages.map((p) => `${p}`).join('\n\n')}`;
  }

  parse() {
    let blocks: BlockStruct[] = [];
    for (const b of this.blocks) {
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
    }
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
