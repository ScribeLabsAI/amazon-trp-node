import { describe, expect, test } from '@jest/globals';
import { Document } from '@scribelabsai/amazon-trp';

describe('Test Documents', () => {
  for (let i = 1; i <= 8; i++) {
    test(`doc${i}`, async () => {
      return expect(Document.fromFile(`tests/doc${i}.json`)).resolves.toBeTruthy();
    });
  }
});
