import { Document } from '../src';

function processDocument(doc: Document) {
  doc.pages.forEach((page) => {
    console.log('PAGE\n====================');
    page.lines.forEach((l) => {
      console.log(`Line: ${l.text}--${l.confidence}`);
      l.words.forEach((w) => {
        console.log(`Word: ${w.text}--${w.confidence}`);
      });
    });
    page.tables.forEach((t) => {
      console.log('TABLE\n====================');
      t.rows.forEach((row, r) => {
        row.cells.forEach((cell, c) => {
          console.log(`Table[${r}][${c}] = ${cell.text}-${cell.confidence}-${cell.isHeader}`);
        });
      });
    });
    console.log('Form (key/values)\n====================');
    page.form.fields.forEach((field) => {
      console.log(`Field: Key: ${field.key?.text}, Value: ${field.value?.text}`);
    });
    let key = 'Phone Number:';
    console.log(`\nGet field by key (${key}):\n====================`);
    const f = page.form.getFieldByKey(key);
    if (f) {
      console.log(`Field: Key: ${f.key?.text}, Value: ${f.value?.text}`);
    }
    key = 'address';
    console.log(`\nSearch field by key (${key}):\n====================`);
    const fields = page.form.searchFieldsByKey(key);
    fields.forEach((field) => {
      console.log(`Field: Key: ${field.key}, Value: ${field.value}`);
    });
  });
}

for (const filePath of ['test-response.json', 'test-response-2.json']) {
  const doc = await Document.fromFile(`tests/${filePath}`);
  processDocument(doc);
}

const doc = await Document.fromFile('tests/test-response-table.json');
for (const p of doc.pages) {
  for (const table of p.tables) {
    console.table(table.toArray());
  }
}
