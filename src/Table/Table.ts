import { Cell } from './Cell';
import { Geometry } from '../Geometry';
import { Row } from './Row';
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
    block.Relationships.forEach((rs) => {
      if (rs.Type === 'CHILD') {
        rs.Ids.forEach((id) => {
          const cell = new Cell(blockMap[id] as CellBlock, blockMap);
          if (cell.rowIndex > ri) {
            this.rows.push(row);
            row = new Row();
            ri = cell.rowIndex;
          }
          row.cells.push(cell);
        });
        if (row.cells.length > 0) {
          this.rows.push(row);
        }
      }
    });
  }

  toString() {
    return `Table\n==========\n${this.rows.map((r) => `Row\n==========\n${r}`).join('\n')}`;
  }

  toArray() {
    return this.rows.map((r) => r.cells.map((c) => c.text));
  }
}
