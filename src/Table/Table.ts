import { Cell } from './Cell.js';
import { Geometry } from '../Geometry/index.js';
import { Row } from './Row.js';
import type { TableBlock, BlockMap, CellBlock } from '../BlockStruct';

export class Table {
  block: TableBlock;
  confidence: number;
  geometry: Geometry;
  id: string;
  rows: Row[];

  constructor(block: TableBlock, blockMap: BlockMap) {
    this.block = block;
    this.confidence = block.Confidence;
    this.geometry = new Geometry(block.Geometry);
    this.id = block.Id;
    this.rows = [];

    let ri = 1;
    let row = new Row();
    for (const rs of block.Relationships) {
      if (rs.Type === 'CHILD') {
        for (const id of rs.Ids) {
          const cell = new Cell(blockMap[id] as CellBlock, blockMap);
          if (cell.rowIndex > ri) {
            this.rows.push(row);
            row = new Row();
            ri = cell.rowIndex;
          }
          row.cells.push(cell);
        }
        if (row.cells.length > 0) {
          this.rows.push(row);
        }
      }
    }
  }

  toString() {
    // eslint-disable-next-line sonarjs/no-nested-template-literals
    return `Table\n==========\n${this.rows.map((r) => `Row\n==========\n${r}`).join('\n')}`;
  }

  toArray() {
    return this.rows.map((r) => r.cells.map((c) => c.text));
  }
}
