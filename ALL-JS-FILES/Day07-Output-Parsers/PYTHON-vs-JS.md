# Day 07 — Python vs JavaScript: Output Parsers

---

## stroutputparser.py → stroutputparser.js

**JavaScript (manual, same pattern):**
```js
const reportMessages = await reportPrompt.invoke({ topic: "black hole" });
const reportResponse = await model.invoke(reportMessages);
const reportText = reportResponse.content;    // manually extract .content
const summaryMessages = await summaryPrompt.invoke({ report: reportText });
const summaryResponse = await model.invoke(summaryMessages);
console.log(summaryResponse.content);
```

---

## stroutputparser1.py → stroutputparser1.js

**JavaScript (with StringOutputParser, clean chain):**
```js
import { StringOutputParser } from "@langchain/core/output_parsers";
const parser = new StringOutputParser();
const fullChain = reportPrompt
  .pipe(model)
  .pipe(parser)
  .pipe((text) => ({ report: text }))   // JS needs explicit mapping
  .pipe(summaryPrompt)
  .pipe(model)
  .pipe(parser);
const result = await fullChain.invoke({ topic: "black hole" });
```
**Key difference:** Python `|` operator vs JS `.pipe()` method. Python PromptTemplate accepts strings directly; JS needs `(text) => ({ key: text })` mapping step.

---

## jsonoutputparser.py → jsonoutputparser.js

**JavaScript:**
```js
import { JsonOutputParser } from "@langchain/core/output_parsers";
const parser = new JsonOutputParser();
// partial_variables → await prompt.partial({})
const partialPrompt = await prompt.partial({ format_instructions: formatInstructions });
const chain = partialPrompt.pipe(model).pipe(parser);
const result = await chain.invoke({ query: "Tell me about Tom Hanks" });
```
**Key difference:** `partial_variables={}` in Python → `await prompt.partial({})` in JS

---

## pydanticoutputparser.py → pydanticoutputparser.js

**JavaScript (withStructuredOutput + Zod):**
```js
import { z } from "zod";
const PersonSchema = z.object({
  name: z.string().describe("Name of the person"),
  age: z.number().int().describe("Age of the person"),
  city: z.string().describe("Name of the city"),
});
const structuredModel = model.withStructuredOutput(PersonSchema);
const chain = prompt.pipe(structuredModel);
const result = await chain.invoke({ place: "sri lankan" });
// result is a plain validated JS object, not a class instance
```
**Key difference:** Python uses `PydanticOutputParser` class. JS uses `model.withStructuredOutput(zodSchema)` — simpler and more direct.

---

## structuredoutputparser.py → structuredoutputparser.js

**JavaScript (StructuredOutputParser.fromZodSchema):**
```js
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    answer: z.string().describe("Answer to the user's question"),
    source: z.string().describe("Source of the answer"),
    confidence: z.string().describe("high, medium, or low"),
    follow_up_questions: z.array(z.string()),
  })
);
const formatInstructions = parser.getFormatInstructions();
const chain = partialPrompt.pipe(model).pipe(parser);
```
**Key difference:** `ResponseSchema` list → Zod object schema | `from_response_schemas()` → `fromZodSchema()`
