# Day 06 — Python vs JavaScript: Structured Output

---

## pydantic_demo.py → pydantic_demo.js (Zod)

**JavaScript (Zod — direct equivalent of Pydantic):**
```js
import { z } from "zod";
const PersonSchema = z.object({
  name: z.string().min(1),
  age: z.coerce.number(),           // coerces "32" → 32 (same as Pydantic)
  email: z.string().email(),
  score: z.number().min(0).max(100).default(0),
});
const student = PersonSchema.parse({ age: "32", email: "abc@gmail.com", name: "nitish" });
const json = JSON.stringify(student);
```
**Key mapping:** `BaseModel` → `z.object()` | `Field(gt=0)` → `z.number().positive()` | `model_dump_json()` → `JSON.stringify()`

---

## typeddict_demo.py → typeddict_demo.js

**JavaScript (JSDoc — same: documentation only, no runtime validation):**
```js
/** @typedef {Object} Person
 * @property {string} name
 * @property {number} age
 */
/** @type {Person} */
const newPerson = { name: "nitish", age: "35" };  // also no error!
console.log(newPerson);
```
**Both Python TypedDict and JS JSDoc only document types, they don't enforce them. Use Pydantic/Zod for enforcement.**

---

## with_structured_output_json.py → with_structured_output_json.js

**JavaScript:**
```js
import { ChatOpenAI } from "@langchain/openai";
const reviewSchema = { /* same JSON schema object */ };
const structuredModel = model.withStructuredOutput(reviewSchema);  // note: withStructuredOutput not with_structured_output
const result = await structuredModel.invoke("review text here...");
```
**Key difference:** `.with_structured_output()` (Python) → `.withStructuredOutput()` (JS camelCase)

---

## with_structured_output_pydantic.py → with_structured_output_zod.js

**JavaScript (Zod — exact equivalent):**
```js
import { z } from "zod";
const ReviewSchema = z.object({
  key_themes: z.array(z.string()).describe("Key themes in the review"),
  summary: z.string().describe("Brief summary"),
  sentiment: z.enum(["pos", "neg"]).describe("Sentiment"),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
  name: z.string().optional(),
});
const structuredModel = model.withStructuredOutput(ReviewSchema);
const result = await structuredModel.invoke("review...");
console.log(result.name);   // result is a plain validated JS object
```

---

## with_structured_output_typeddict.py → with_structured_output_typeddict.js

**JavaScript (plain JSON Schema object):**
```js
const schema = {
  title: "Review",
  type: "object",
  properties: {
    key_themes: { type: "array", items: { type: "string" }, description: "Write down all the key themes" },
    sentiment: { type: "string", description: "Return sentiment" },
    name: { type: "string", description: "Write the name of the reviewer" },
  },
};
const structuredModel = model.withStructuredOutput(schema);
const result = await structuredModel.invoke("review...");
console.log(result["name"]);   // access like a dict — same as Python TypedDict
```

---

## with_structured_output_llama.py → (no direct JS equivalent file)

**JavaScript equivalent (Zod + HuggingFace):**
```js
import { ChatHuggingFace, HuggingFaceInference } from "@langchain/community/chat_models/huggingface";
const llm = new HuggingFaceInference({ model: "TinyLlama/TinyLlama-1.1B-Chat-v1.0" });
const model = new ChatHuggingFace({ llm });
// Note: not all HF models support structured output natively
// Use withStructuredOutput with a Zod schema:
const structuredModel = model.withStructuredOutput(ReviewZodSchema);
```

---

## json_schema.json (data file)
This file defines a JSON schema for validating student data. It is the same in both Python and JavaScript — plain JSON is universal.
```json
{
  "title": "student",
  "type": "object",
  "properties": { "name": "string", "age": "integer" },
  "required": ["name"]
}
```
