import { Geometry } from '../Geometry/index.js';
import { Cell } from './Cell.js';
import { Row } from './Row.js';

import type { BlockMap, CellBlock, MergedCellBlock, TableBlock } from '../BlockStruct.js';

export class Table {
  block: TableBlock;
  confidence: number;
  geometry: Geometry;
  id: string;
  rows: Row[];
  constructor(
    block: TableBlock,
    blockMap: BlockMap,
    options?: { expandMergedTableCells?: boolean }
  ) {
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
          if (blockMap.get(id)?.BlockType !== 'CELL') {
            continue;
          }
          const cell = new Cell(blockMap.get(id) as CellBlock, blockMap);
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

    if (options?.expandMergedTableCells) {
      this.expandMergedCells(block, blockMap);
    }
  }

  expandMergedCells(block: TableBlock, blockMap: BlockMap) {
    const cellIDToContent = new Map();

    const mergedCells = block.Relationships.filter(({ Type }) => Type === 'MERGED_CELL').flatMap(
      ({ Ids }) =>
        Ids.map((id) => blockMap.get(id)).filter(
          (block): block is MergedCellBlock => block?.BlockType === 'MERGED_CELL'
        )
    );

    for (const mergedCell of mergedCells) {
      const cells = mergedCell.Relationships?.filter((rs) => rs.Type === 'CHILD')
        .flatMap((rs) => rs.Ids.map((id) => blockMap.get(id)))
        .filter((block): block is CellBlock => block?.BlockType === 'CELL');
      if (!cells) {
        continue;
      }
      const mergedContent: string[] = [];
      for (const cell of cells) {
        mergedContent.push(new Cell(cell, blockMap).text);
      }
      for (const cell of cells) {
        cellIDToContent.set(cell.Id, mergedContent.join(' '));
      }
    }

    for (const row of this.rows) {
      for (const cell of row.cells) {
        const overrideContent = cellIDToContent.get(cell.id);
        if (overrideContent) {
          cell.text = overrideContent;
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
