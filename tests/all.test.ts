import { describe, expect, test } from '@jest/globals';
import { Document, ParseError, UnknownError } from '@scribelabsai/amazon-trp';

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
