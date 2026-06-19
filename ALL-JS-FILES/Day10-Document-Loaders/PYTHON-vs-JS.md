# Day 10 — Python vs JavaScript: Document Loaders

---

## csv_loader.py → csv_loader.js

**JavaScript:**
```js
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
const loader = new CSVLoader(filePath);
const docs = await loader.load();
console.log("Total documents (rows):", docs.length);
console.log("First Document:", docs[0].pageContent);
```
**Key mapping:** `file_path=` → pass path directly | `docs[0].page_content` → `docs[0].pageContent` (camelCase in JS)

---

## directory_loader.py → directory_loader.js

**JavaScript:**
```js
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";

const loader = new DirectoryLoader(booksDir, {
  ".pdf": (filePath) => new PDFLoader(filePath),
  ".txt": (filePath) => new TextLoader(filePath),
});
const docs = await loader.load();
docs.forEach((doc) => console.log(doc.metadata));
```
**Key difference:** Python uses `glob=` pattern and `loader_cls=`. JS maps file extensions to loader instances in an object.

---

## pdf_loader.py → pdf_loader.js

**JavaScript:**
```js
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
const loader = new PDFLoader(filePath);
const docs = await loader.load();
console.log("Total pages:", docs.length);
docs.forEach((doc, i) => {
  console.log(`Page ${i+1}:`, doc.pageContent.substring(0, 300));
  console.log("Metadata:", doc.metadata);
});
```
**Key mapping:** `PyPDFLoader` (Python) → `PDFLoader` (JS) | `page_content` → `pageContent`

---

## text_loader.py → text_loader.js

**JavaScript:**
```js
import { TextLoader } from "langchain/document_loaders/fs/text";
const loader = new TextLoader(filePath);
const docs = await loader.load();
console.log(docs[0].pageContent.substring(0, 200));
// chain to summarize (same logic)
const summary = await chain.invoke({ text: docs[0].pageContent });
```
**Note:** The original Python version loads `cricket.txt` — this file is included in `Day10-Document-Loaders/cricket.txt`

---

## webbase_loader.py → webbase_loader.js

**JavaScript:**
```js
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
const loader = new CheerioWebBaseLoader(url);
const docs = await loader.load();
const result = await chain.invoke({ content: docs[0].pageContent.substring(0,3000), question: "What is the product?" });
```
**Key difference:** `WebBaseLoader` (Python) → `CheerioWebBaseLoader` (JS) | Also truncate content since pages can be very long.

---

## Data files included in this folder:
- `cricket.txt` — cricket poem used by text_loader.py/js
- `sample_data.csv` — CSV file used by csv_loader.js
- `sample_text.txt` — text file used by text_loader.js
