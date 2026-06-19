# Day 09 — Python vs JavaScript: Runnables

---

## runnable_sequence.py → runnable_sequence.js

**JavaScript:**
```js
import { RunnableSequence } from "@langchain/core/runnables";
const chain = RunnableSequence.from([
  prompt1, model, parser,
  (text) => ({ report: text }),   // mapping step needed in JS
  prompt2, model, parser,
]);
const result = await chain.invoke({ topic: "AI" });
```

---

## runnable_parallel.py → runnable_parallel.js

**JavaScript:**
```js
import { RunnableParallel } from "@langchain/core/runnables";
const parallelChain = new RunnableParallel({
  tweet: tweetPrompt.pipe(model).pipe(parser),
  linkedin: linkedinPrompt.pipe(model).pipe(parser),
});
const result = await parallelChain.invoke({ topic: "AI" });
console.log(result.tweet);
console.log(result.linkedin);
```

---

## runnable_passthrough.py → runnable_passthrough.js

**JavaScript:**
```js
import { RunnableParallel, RunnablePassthrough } from "@langchain/core/runnables";

const jokeChain = jokePrompt.pipe(model).pipe(parser);
const jokeResult = await jokeChain.invoke({ topic: "cricket" });
const explanation = await explainChain.invoke({ joke: jokeResult });
// RunnablePassthrough carries original value through unchanged
```
**What RunnablePassthrough does:** Imagine data flowing through a pipe. Passthrough = a "Y junction" that copies the data and passes the original unchanged alongside new data.

---

## runnable_lambda.py → runnable_lambda.js

**JavaScript:**
```js
import { RunnableLambda } from "@langchain/core/runnables";

function wordCount(text) {
  return `Word count: ${text.trim().split(/\s+/).length}\n\nOriginal:\n${text}`;
}
const wordCountRunnable = new RunnableLambda({ func: wordCount });
const chain = prompt.pipe(model).pipe(parser).pipe(wordCountRunnable);
const result = await chain.invoke({ topic: "AI" });
```
**Key mapping:** `RunnableLambda(my_function)` → `new RunnableLambda({ func: myFunction })`

---

## runnable_branch.py → runnable_branch.js

**JavaScript:**
```js
import { RunnableBranch, RunnableLambda } from "@langchain/core/runnables";

const conditionalChain = new RunnableBranch(
  [
    (text) => text.trim().split(/\s+/).length > 300,   // condition
    new RunnableLambda({                                // if true → summarize
      func: async (text) => {
        const summary = await summaryChain.invoke({ text });
        return `[SUMMARIZED]\n\n${summary}`;
      },
    }),
  ],
  new RunnableLambda({ func: (text) => `[SHORT]\n\n${text}` })  // default
);
```
**Key mapping:** `(lambda x: condition, runnable)` → `[(condition), new RunnableLambda({func})]`
