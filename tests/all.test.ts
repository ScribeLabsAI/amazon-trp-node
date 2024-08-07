import { readdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BlockStruct, Document, ParseError, Table, UnknownError } from '../src/index.js';

const root = join('tests');
const rootExpected = join('tests', 'tables');

describe('Test Documents', () => {
  const tests = new Array(11).fill(0).map((_, i) => `doc${i + 1}.json`);
  it.each(tests)('%s', async (filename) => {
    return expect(Document.fromFile(resolve('tests', filename))).resolves.toBeTruthy();
  });
});

describe('Throws on invalid documents', () => {
  it('throws on invalid JSON', async () => {
    return expect(Document.fromFile('tests/error.json')).rejects.toThrow(ParseError);
  });

  it('throws on invalid document', async () => {
    return expect(Document.fromFile('tests/doesnotexist.json')).rejects.toThrow(UnknownError);
  });
});

describe('Rows from table created correctly', () => {
  const expectedTables = readdirSync(rootExpected);
  it.each(expectedTables)('%s', async (doc) => {
    const expectedTable = JSON.parse(await readFile(join(rootExpected, doc), 'utf8')) as Table;
    const blocks = JSON.parse(await readFile(join(root, doc), 'utf8')) as BlockStruct[];
    const docCreated = new Document(blocks);
    for (const [, p] of docCreated.pages.entries()) {
      for (const t of p.tables) {
        const rows = t.rows;
        for (const [i, row] of rows.entries()) {
          expect(row.toString()).toEqual(expectedTable.rows[i]);
        }
      }
    }
  });
});

describe('MERGED_CELL expansion', () => {
  it('ignores MERGED_CELL blocks by default', async () => {
    const expected = await readFile(join(root, 'merged', 'withoutExpansion.txt'), 'utf8');
    const blocks = JSON.parse(await readFile(join(root, 'merged', 'blocks.json'), 'utf8'));

    const doc = new Document(blocks);

    expect(doc.pages?.[0]?.tables?.[0]?.toString()).toEqual(expected);
  });

  it('merges content of cells with `expandMergedTableCells` option', async () => {
    const expected = await readFile(join(root, 'merged', 'withExpansion.txt'), 'utf8');
    const blocks = JSON.parse(await readFile(join(root, 'merged', 'blocks.json'), 'utf8'));

    const doc = new Document(blocks, { expandMergedTableCells: true });

    expect(doc.pages?.[0]?.tables?.[0]?.toString()).toEqual(expected);
  });
});
