import { BlockStruct, Document } from '@scribelabsai/amazon-trp';
import { program } from 'commander';
import { readFile } from 'node:fs/promises';

program
  .command('blocks')
  .description('Extracts tables from a Textract output.')
  .argument('<file>', 'Input file')
  .action(async (file: string) => {
    const parsed = JSON.parse(await readFile(file, 'utf8'));
    const blocks = (parsed.Blocks ?? parsed) as BlockStruct[];
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
