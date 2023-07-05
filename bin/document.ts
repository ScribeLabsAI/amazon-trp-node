import { program } from 'commander';
import { readFile } from 'node:fs/promises';
import { BlockStruct, Document } from '@scribelabsai/amazon-trp';

program
  .command('blocks')
  .description('Extracts financials from a Textract output.')
  .argument('<file>', 'Input file')
  .action(async (file: string) => {
    const blocks = JSON.parse(await readFile(file, 'utf8')).Blocks as BlockStruct[];
    try {
      const doc = new Document(blocks);
      for (const [, p] of doc.pages.entries()) {
        for (const t of p.tables) {
          console.dir(t, { depth: 5 });
        }
      }
    } catch (err) {
      console.error(err);
    }
  });
program.parse(process.argv);
