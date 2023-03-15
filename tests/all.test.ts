import { Document } from '@scribelabsai/amazon-trp';

function processDocument(doc: Document) {
  for (const page of doc.pages) {
    console.log('PAGE\n====================');
    for (const l of page.lines) {
      console.log(`Line: ${l.text}--${l.confidence}`);
      for (const w of l.words) {
        console.log(`Word: ${w.text}--${w.confidence}`);
      }
    }
    for (const t of page.tables) {
      console.log('TABLE\n====================');
      for (const [r, row] of t.rows.entries()) {
        for (const [c, cell] of row.cells.entries()) {
          console.log(`Table[${r}][${c}] = ${cell.text}-${cell.confidence}-${cell.isHeader}`);
        }
      }
    }
    console.log('Form (key/values)\n====================');
    for (const field of page.form.fields) {
      console.log(`Field: Key: ${field.key?.text}, Value: ${field.value?.text}`);
    }
    let key = 'Phone Number:';
    console.log(`\nGet field by key (${key}):\n====================`);
    const f = page.form.getFieldByKey(key);
    if (f) {
      console.log(`Field: Key: ${f.key?.text}, Value: ${f.value?.text}`);
    }
    key = 'address';
    console.log(`\nSearch field by key (${key}):\n====================`);
    const fields = page.form.searchFieldsByKey(key);
    for (const field of fields) {
      console.log(`Field: Key: ${field.key}, Value: ${field.value}`);
    }
  }
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
