import { Form, Field } from './Form/index.js';
import { Geometry } from './Geometry/index.js';
import { Line } from './Line.js';
import { Table } from './Table/index.js';
import type { BlockStruct, BlockMap } from './BlockStruct';

export class Page {
  blocks: BlockStruct[];
  text: string;
  lines: Line[];
  form: Form;
  tables: Table[];
  geometry?: Geometry;
  id: string;
  content: (Line | Table | Form | Field)[];

  constructor(blocks: BlockStruct[], blockMap: BlockMap) {
    this.blocks = blocks;
    this.text = '';
    this.lines = [];
    this.form = new Form();
    this.tables = [];
    this.content = [];
    this.id = '';
    this.parse(blockMap);
  }

  toString() {
    return `Page\n==========\n${this.content.map((i) => `${i}`).join('\n')}`;
  }

  parse(blockMap: BlockMap) {
    const t: string[] = [];
    this.blocks.forEach((b) => {
      switch (b.BlockType) {
        case 'PAGE':
          this.geometry = new Geometry(b.Geometry);
          this.id = b.Id;
          break;
        case 'LINE':
          const l = new Line(b, blockMap);
          this.lines.push(l);
          this.content.push(l);
          t.push(l.text);
          break;
        case 'TABLE':
          const tbl = new Table(b, blockMap);
          this.tables.push(tbl);
          this.content.push(tbl);
          break;
        case 'KEY_VALUE_SET':
          if (b.EntityTypes.includes('KEY')) {
            const f = new Field(b, blockMap);
            if (f.key) {
              this.form.addField(f);
              this.content.push(f);
            } else {
              console.error(
                `WARNING: Detected K/V where key does not have content. Excluding key from output.\n${f}\n${b}`
              );
            }
          }
          break;
      }
    });
    this.text = t.join('');
  }

  getLinesInReadingOrder() {
    const columns: { left: number; right: number }[] = [];
    const lines: [number, string][] = [];
    this.lines.forEach((l) => {
      let column_found = false;
      for (const [ind, col] of columns.entries()) {
        const bbox_left = l.geometry.boundingBox.left;
        const bbox_right = l.geometry.boundingBox.left + l.geometry.boundingBox.width;
        const bbox_centre = l.geometry.boundingBox.left + l.geometry.boundingBox.width / 2;
        const column_centre = col.left + col.right / 2;
        if (
          (bbox_centre > col.left && bbox_centre < col.right) ||
          (column_centre > bbox_left && column_centre < bbox_right)
        ) {
          lines.push([ind, l.text]);
          column_found = true;
          break;
        }
        if (!column_found) {
          columns.push({
            left: l.geometry.boundingBox.left,
            right: l.geometry.boundingBox.left + l.geometry.boundingBox.width,
          });
          lines.push([columns.length - 1, l.text]);
        }
      }
    });
    return lines.sort((a, b) => a[0] - b[0]);
  }

  getTextInReadingOrder() {
    return this.getLinesInReadingOrder()
      .map((l) => l[1])
      .join('\n');
  }
}
