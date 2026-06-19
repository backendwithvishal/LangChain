/**
 * Day 06 - Structured Output using HuggingFace (LLaMA / TinyLlama)
 * Python equivalent: with_structured_output_llama.py
 *
 * Python uses HuggingFaceEndpoint + ChatHuggingFace with Pydantic schema.
 * In JS we use @langchain/community HuggingFaceInference + Zod schema as the
 * direct equivalent of Pydantic BaseModel + model.with_structured_output().
 */

import "dotenv/config";
import { ChatHuggingFace, HuggingFaceInference } from "@langchain/community/llms/hf";
import { z } from "zod";

// --- Zod schema (equivalent to the Pydantic Review model in Python) ---
const ReviewSchema = z.object({
  key_themes: z
    .array(z.string())
    .describe("Write down all the key themes discussed in the review in a list"),
  summary: z.string().describe("A brief summary of the review"),
  sentiment: z
    .enum(["pos", "neg"])
    .describe(
      "Return sentiment of the review either negative or positive"
    ),
  pros: z
    .array(z.string())
    .optional()
    .describe("Write down all the pros inside a list"),
  cons: z
    .array(z.string())
    .optional()
    .describe("Write down all the cons inside a list"),
  name: z
    .string()
    .optional()
    .describe("Write the name of the reviewer"),
});

// --- Model setup (equivalent to HuggingFaceEndpoint + ChatHuggingFace in Python) ---
const llm = new HuggingFaceInference({
  model: "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
  task: "text-generation",
  apiKey: process.env.HUGGINGFACEHUB_API_TOKEN,
});

const model = new ChatHuggingFace({ llm });

// Bind Zod schema — returns a validated, typed object
const structuredModel = model.withStructuredOutput(ReviewSchema);

const review = `I recently upgraded to the Samsung Galaxy S24 Ultra, and I must say, it's an absolute powerhouse! The Snapdragon 8 Gen 3 processor makes everything lightning fast—whether I'm gaming, multitasking, or editing photos. The 5000mAh battery easily lasts a full day even with heavy use, and the 45W fast charging is a lifesaver.

The S-Pen integration is a great touch for note-taking and quick sketches, though I don't use it often. What really blew me away is the 200MP camera—the night mode is stunning, capturing crisp, vibrant images even in low light. Zooming up to 100x actually works well for distant objects, but anything beyond 30x loses quality.

However, the weight and size make it a bit uncomfortable for one-handed use. Also, Samsung's One UI still comes with bloatware—why do I need five different Samsung apps for things Google already provides? The $1,300 price tag is also a hard pill to swallow.

Pros:
Insanely powerful processor (great for gaming and productivity)
Stunning 200MP camera with incredible zoom capabilities
Long battery life with fast charging
S-Pen support is unique and useful
                                 
Review by Nitish Singh`;

const result = await structuredModel.invoke(review);

console.log("Structured Output (HuggingFace / TinyLlama):");
console.log(result);
