import { describe, expect, test } from '@jest/globals';
import { Document, ParseError, UnknownError, BlockStruct, Table } from '@scribelabsai/amazon-trp';
import { readdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = join('tests');
const rootExpected = join('tests', 'tables');

describe('Test Documents', () => {
  for (let i = 1; i <= 10; i++) {
    test(`doc${i}`, async () => {
      return expect(Document.fromFile(`tests/doc${i}.json`)).resolves.toBeTruthy();
    });
  }
});

describe('Throws on invalid documents', () => {
  test('Throws on invalid JSON', async () => {
    return expect(Document.fromFile('tests/error.json')).rejects.toThrow(ParseError);
  });

  test('Throws on invalid document', async () => {
    return expect(Document.fromFile('tests/doesnotexist.json')).rejects.toThrow(UnknownError);
  });
});

describe('Rows from table created correctly', () => {
  const expectedTables = readdirSync(rootExpected);
  for (const doc of expectedTables) {
    test(`${doc.replace('.json', '')}`, async () => {
      const expectedTable = JSON.parse(await readFile(join(rootExpected, doc), 'utf8')) as Table;
      const blocks = JSON.parse(await readFile(join(root, doc), 'utf8')).Blocks as BlockStruct[];
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
  }
});
