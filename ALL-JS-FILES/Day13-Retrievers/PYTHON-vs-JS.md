# Day 13 — Python vs JavaScript: Retrievers

The Python version is in Jupyter notebooks. Here is the equivalent Python code vs JS.

---

## Python (from langchain_retrievers.ipynb) → langchain_retrievers.js

**JavaScript:**
```js
const vectorStore = await Chroma.fromDocuments(documents, embeddings);
const retriever = vectorStore.asRetriever({ k: 3 });
const retrieved = await retriever.invoke("Tell me about Paris landmarks");
retrieved.forEach((doc) => console.log(doc.pageContent));
```
**Key mapping:** `as_retriever()` → `asRetriever()` | `search_kwargs={"k":3}` → `{ k: 3 }`

---

## MMR Retriever

**JavaScript:**
```js
const mmrRetriever = vectorStore.asRetriever({
  searchType: "mmr",
  searchKwargs: {
    k: 3,
    fetchK: 6,
    lambda: 0.5,
  },
});
```
**Key difference:** `fetch_k` → `fetchK` | `lambda_mult` → `lambda` (camelCase in JS)

---

## Wikipedia Retriever

**JavaScript:**
```js
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
const wikiTool = new WikipediaQueryRun({ topKResults: 2, maxDocContentLength: 500 });
const result = await wikiTool.invoke("LangChain AI framework");
```

---

## Using Retriever in a Chain (RAG)

**JavaScript:**
```js
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";

function formatDocs(docs) {
  return docs.map((doc) => doc.pageContent).join("\n\n");
}

const ragChain = RunnableSequence.from([
  { context: retriever.pipe(formatDocs), question: new RunnablePassthrough() },
  ragPrompt,
  model,
  parser,
]);
const answer = await ragChain.invoke("What is the capital of France?");
```

---

## Summary

| Python | JavaScript |
|--------|-----------|
| `vectorstore.as_retriever(search_kwargs={"k":3})` | `vectorStore.asRetriever({ k: 3 })` |
| `search_type="mmr"` | `searchType: "mmr"` |
| `retriever.invoke(query)` | `await retriever.invoke(query)` |
| `doc.page_content` | `doc.pageContent` |
| `WikipediaRetriever` | `WikipediaQueryRun` (as a tool) |
