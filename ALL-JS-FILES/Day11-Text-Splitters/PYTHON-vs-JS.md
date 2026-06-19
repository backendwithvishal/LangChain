# Day 11 — Python vs JavaScript: Text Splitters

---

## length_based.py → length_based.js

**JavaScript (splits inline text):**
```js
import { CharacterTextSplitter } from "@langchain/textsplitters";
const splitter = new CharacterTextSplitter({ chunkSize: 200, chunkOverlap: 0, separator: "" });
const chunks = await splitter.createDocuments([text]);
console.log(chunks[1].pageContent);
```
**Key mapping:** `CharacterTextSplitter` same name | `split_documents(docs)` → `createDocuments([text])` | `page_content` → `pageContent`

---

## text_structure_based.py → text_structure_based.js

**JavaScript:**
```js
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });
const chunks = await splitter.createDocuments([text]);
console.log(chunks.length);
chunks.forEach((chunk) => console.log(chunk.pageContent));
```
**Key difference:** `split_text(text)` → `createDocuments([text])` | JS returns Document objects, not plain strings

---

## markdown_splitting.py → markdown_splitting.js

**JavaScript:**
```js
import { MarkdownTextSplitter } from "@langchain/textsplitters";
const splitter = new MarkdownTextSplitter({ chunkSize: 200, chunkOverlap: 20 });
const chunks = await splitter.createDocuments([markdownText]);
```
**Key difference:** Python uses `RecursiveCharacterTextSplitter.from_language(Language.MARKDOWN)`. JS has a dedicated `MarkdownTextSplitter` class — cleaner.

---

## python_code_splitting.py → code_splitting.js

**JavaScript (splits JS code):**
```js
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// fromLanguage("js") instead of Language.PYTHON
const splitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
  chunkSize: 300,
  chunkOverlap: 30,
});
const chunks = await splitter.createDocuments([jsCode]);
```
**Key difference:** `Language.PYTHON` → `"js"` string | `from_language()` → `fromLanguage()`

---

## semantic_meaning_based.py → semantic_meaning_based.js

**JavaScript:**
```js
import { SemanticChunker } from "@langchain/experimental/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";

const splitter = new SemanticChunker(
  new OpenAIEmbeddings({ model: "text-embedding-3-small" }),
  { breakpointThresholdType: "standard_deviation" }
);
const chunks = await splitter.createDocuments([text]);
console.log(chunks.length);
```
**Key difference:** `breakpoint_threshold_type` (snake_case Python) → `breakpointThresholdType` (camelCase JS)

---

## Summary: Python text_splitter → JS equivalent

| Python | JavaScript |
|--------|-----------|
| `from langchain.text_splitter import X` | `import { X } from "@langchain/textsplitters"` |
| `CharacterTextSplitter` | `CharacterTextSplitter` (same name) |
| `RecursiveCharacterTextSplitter` | `RecursiveCharacterTextSplitter` (same name) |
| `.from_language(Language.MARKDOWN)` | `new MarkdownTextSplitter()` |
| `.from_language(Language.PYTHON)` | `RecursiveCharacterTextSplitter.fromLanguage("js")` |
| `SemanticChunker` | `SemanticChunker` (from `@langchain/experimental`) |
| `splitter.split_text(text)` | `await splitter.createDocuments([text])` |
| `doc.page_content` | `doc.pageContent` |
