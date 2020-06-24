import type { GeometryStruct } from './Geometry';

interface BlockBase {
  Confidence: number;
  Geometry: GeometryStruct;
  Id: string;
  Text?: string;
}

export interface WordBlock extends BlockBase {
  BlockType: 'WORD';
}

export interface SelectionElementBlock extends BlockBase {
  BlockType: 'SELECTION_ELEMENT';
  Relationships: {
    Type: 'CHILD';
    Ids: string[];
  }[];
  SelectionStatus: 'SELECTED' | 'NOT_SELECTED';
}

export interface KeyValueSetBlock extends BlockBase {
  BlockType: 'KEY_VALUE_SET';
  EntityTypes: ('KEY' | 'VALUE')[];
  Relationships: {
    Type: 'VALUE' | 'CHILD';
    Ids: string[];
  }[];
}

export interface LineBlock extends BlockBase {
  BlockType: 'LINE';
  Relationships: {
    Type: 'CHILD';
    Ids: string[];
  }[];
}

export interface CellBlock extends BlockBase {
  BlockType: 'CELL';
  RowIndex: number;
  ColumnIndex: number;
  RowSpan: number;
  ColumnSpan: number;
  Relationships?: {
    Type: 'CHILD';
    Ids: string[];
  }[];
}

export interface TableBlock extends BlockBase {
  BlockType: 'TABLE';
  Relationships: {
    Type: 'CHILD';
    Ids: string[];
  }[];
}

export interface PageBlock extends BlockBase {
  BlockType: 'PAGE';
  Relationships: {
    Type: 'CHILD';
    Ids: string[];
  }[];
}

export type BlockStruct =
  | WordBlock
  | SelectionElementBlock
  | KeyValueSetBlock
  | LineBlock
  | CellBlock
  | TableBlock
  | PageBlock;

export interface BlockMap {
  [key: string]: BlockStruct;
}
