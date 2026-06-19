# Day 08 — Python vs JavaScript: Chains

---

## simple_chain.py → simple_chain.js

**JavaScript:**
```js
import { ChatPromptTemplate } from "@langchain/core/prompts";
const prompt = ChatPromptTemplate.fromMessages([["human", "Generate 5 interesting facts about {topic}"]]);
const chain = prompt.pipe(model).pipe(parser);   // JS uses .pipe()
const result = await chain.invoke({ topic: "cricket" });
const graph = chain.getGraph();
console.log(graph.toString());
```
**Key mapping:** `|` → `.pipe()` | `chain.get_graph().print_ascii()` → `chain.getGraph().toString()`

---

## sequential_chain.py → sequential_chain.js

**JavaScript:**
```js
const chain = reportPrompt
  .pipe(model)
  .pipe(parser)
  .pipe((text) => ({ report: text }))   // ← this mapping step is needed in JS
  .pipe(summaryPrompt)
  .pipe(model)
  .pipe(parser);
const result = await chain.invoke({ topic: "Unemployment in India" });
```
**Key difference:** In Python, `StrOutputParser` output feeds directly into the next `PromptTemplate`. In JS you need an explicit `(text) => ({ key: text })` mapping step between prompts.

---

## parallel_chain.py → parallel_chain.js

**JavaScript:**
```js
import { RunnableParallel } from "@langchain/core/runnables";
const parallelChain = new RunnableParallel({
  notes: notesChain,
  quiz: quizChain,
});
const fullChain = parallelChain
  .pipe((result) => ({ topic: "quantum computing", notes: result.notes, quiz: result.quiz }))
  .pipe(mergeChain);
const result = await fullChain.invoke({ topic: "quantum computing" });
```

---

## conditional_chain.py → conditional_chain.js

**JavaScript:**
```js
import { z } from "zod";
const SentimentSchema = z.object({
  sentiment: z.enum(["positive", "negative"]),
});
const classifierModel = model.withStructuredOutput(SentimentSchema);
const classifyChain = classifyPrompt.pipe(classifierModel);

// Manual branching with if/else (cleaner than RunnableBranch in JS)
const classification = await classifyChain.invoke({ feedback });
const response = classification.sentiment === "positive"
  ? await positiveChain.invoke({ feedback })
  : await negativeChain.invoke({ feedback });
```
**Key difference:** Python uses `RunnableBranch` with lambdas. JS uses simple `if/else` which is cleaner and easier to read.
