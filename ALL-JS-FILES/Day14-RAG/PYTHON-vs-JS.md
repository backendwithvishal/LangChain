# Day 14 — Python vs JavaScript: RAG Pipeline

The Python version is in a Jupyter notebook. Here is the full Python code vs JS comparison.

---

## Full RAG Pipeline: Python vs JavaScript

**JavaScript (rag_pipeline.js):**
```js
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";

// INDEXING
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 300, chunkOverlap: 50 });
const chunks = await splitter.createDocuments([knowledgeBase]);

const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });
const vectorStore = await Chroma.fromDocuments(chunks, embeddings, { collectionName: "rag-kb" });

// RETRIEVAL + GENERATION
const retriever = vectorStore.asRetriever({ k: 3 });

const ragPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant. Answer ONLY from the context:\n{context}"],
  ["human", "{question}"],
]);

function formatDocs(docs) {
  return docs.map((doc) => doc.pageContent).join("\n\n");
}

const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });
const parser = new StringOutputParser();

const ragChain = RunnableSequence.from([
  { context: retriever.pipe(formatDocs), question: new RunnablePassthrough() },
  ragPrompt,
  model,
  parser,
]);

const answer = await ragChain.invoke("What is LangChain?");
console.log(answer);
```

---

## Python vs JS Mapping Table

| Python | JavaScript |
|--------|-----------|
| `Chroma.from_documents(documents=chunks, embedding=emb)` | `Chroma.fromDocuments(chunks, emb, { collectionName })` |
| `vectorstore.as_retriever(search_kwargs={"k":3})` | `vectorStore.asRetriever({ k: 3 })` |
| `retriever \| format_docs` | `retriever.pipe(formatDocs)` |
| `RunnablePassthrough()` | `new RunnablePassthrough()` |
| `{"context": ..., "question": RunnablePassthrough()}` | `{ context: retriever.pipe(formatDocs), question: new RunnablePassthrough() }` |
| `StrOutputParser` | `StringOutputParser` |
| `chain.invoke("question")` | `await chain.invoke("question")` |
| `doc.page_content` | `doc.pageContent` |
