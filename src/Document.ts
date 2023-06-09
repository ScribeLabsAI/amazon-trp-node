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

export class UnknownError extends Error {
  override name: 'UnknownError';

  constructor(message: string, cause: Error) {
    super(message, { cause });
    this.name = 'UnknownError';
    this.stack = cause.stack ?? '';
  }
}

export class Document {
  pages: Page[];
  blocks: BlockStruct[];
  blockMap: BlockMap;

  constructor(blocks: BlockStruct[]) {
    try {
      const ret = BlockStructSchema.array().safeParse(blocks);
      if (!ret.success) throw new ParseError(ret.error.message);
      this.pages = [];
      this.blocks = blocks;
      this.blockMap = {};
      this.parse();
    } catch (err) {
      if (err instanceof ParseError) throw err;
      else {
        const error = err as Error;
        throw new UnknownError('Unknown error in Document constructor', error);
      }
    }
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
    try {
      const content = await readFile(file, { encoding: 'utf8' });
      const blocks = JSON.parse(content) as BlockStruct[];
      return new Document(blocks);
    } catch (err) {
      if (err instanceof ParseError) throw err;
      else {
        const error = err as Error;
        throw new UnknownError('Unknown error in Document.fromFile', error);
      }
    }
  }
}
