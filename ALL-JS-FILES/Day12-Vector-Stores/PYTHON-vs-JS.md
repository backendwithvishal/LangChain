# Day 12 — Python vs JavaScript: Vector Stores

The Python version is in Jupyter notebooks (`.ipynb`). Here is the equivalent Python code and JS comparison.

---

## Python (from langchain_chroma.ipynb) → langchain_chroma.js

**JavaScript:**
```js
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

const documents = [
  new Document({ pageContent: "LangChain is a framework...", metadata: { topic: "langchain" } }),
  new Document({ pageContent: "Chroma is a vector database...", metadata: { topic: "vector-db" } }),
];

// Create vector store from documents
const vectorStore = await Chroma.fromDocuments(documents, embeddings, { collectionName: "my-store" });

// Similarity search
const results = await vectorStore.similaritySearch("How do vector databases work?", 3);
results.forEach((doc) => console.log(doc.pageContent));

// Search with scores
const withScores = await vectorStore.similaritySearchWithScore("vector databases", 3);
withScores.forEach(([doc, score]) => console.log(`Score: ${score.toFixed(4)} | ${doc.pageContent}`));

// Metadata filter
const filtered = await vectorStore.similaritySearch("database", 3, { topic: "vector-db" });
```

---

## Key Python vs JavaScript Mapping

| Python | JavaScript |
|--------|-----------|
| `Chroma.from_documents(documents=docs, embedding=emb)` | `Chroma.fromDocuments(docs, emb, { collectionName })` |
| `vectorstore.similarity_search(query, k=3)` | `vectorStore.similaritySearch(query, 3)` |
| `vectorstore.similarity_search_with_score(query)` | `vectorStore.similaritySearchWithScore(query, k)` |
| `filter={"topic": "vector-db"}` | `{ topic: "vector-db" }` (3rd arg) |
| `Document(page_content="...", metadata={})` | `new Document({ pageContent: "...", metadata: {} })` |
| `doc.page_content` | `doc.pageContent` |

---

## Adding Documents Later

**JavaScript:**
```js
await vectorStore.addDocuments(newDocs);
```

## Persistent Storage (save to disk)

**JavaScript:**
```js
const vectorStore = await Chroma.fromDocuments(docs, embeddings, {
  collectionName: "my-store",
  url: "http://localhost:8000",   // connect to running Chroma server
});
```
