# amazon-trp-node

Amazon Textract Response Parser library for TS.

---

This is a TS port of the Python [TRP](https://github.com/aws-samples/amazon-textract-code-samples/blob/master/python/trp.py) script from AWS.

## Installation

```bash
npm install @scribelabsai/amazon-trp
```

## Usage

1. Load the blocks into a document (e.g. using `GetDocumentAnalysisCommand` from `@aws-sdk/client-textract`)

```typescript
import { TextractClient, GetDocumentAnalysisCommand } from '@aws-sdk/client-textract';
import { Document } from '@scribelabsai/amazon-trp';

import type { BlockStruct } from '@scribelabsai/amazon-trp';

const client = new TextractClient();
const resp = await client.send(new GetDocumentAnalysisCommand({ JobId: 'MY_JOBID }));
const doc = new Document(resp.blocks as BlockStruct[]);
```

2. Do something with the document (e.g. getting tables)

```typescript
doc.pages.forEach((p) => {
  p.tables.forEach((t) => {
    // Do something with the table
  });
});
```

## License

MIT, see [LICENSE](./LICENSE) file.
