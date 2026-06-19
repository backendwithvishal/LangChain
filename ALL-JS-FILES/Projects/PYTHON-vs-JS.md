# Projects — Python vs JavaScript

---

## Project 1: Stock Market Data Enrichment

**JavaScript (stock_market_enrichment.js):**
```js
import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Data defined inline (no pandas/CSV needed for demo)
const companies = [
  { ticker: "AAPL", name: "Apple Inc.", market_cap_b: 2900 },
  // ...
];

async function classifyIntoSector(company) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: `Classify ${company.name} into a sector. Return only the sector name.` }],
    max_tokens: 20,
    temperature: 0,
  });
  return response.choices[0].message.content.trim();
}

for (const company of companies) {
  const sector = await classifyIntoSector(company);
  const recommendation = await generateRecommendation(company, sector);
  console.log(`${company.ticker}: ${sector}`);
}
```

**Key differences:**
- Python uses `pandas` DataFrame for data. JS uses a plain array of objects.
- Python iterates with `df.iterrows()`. JS uses `for...of` loop.
- Both use `openai` SDK directly (not LangChain).

---

## Project 2: Paris Trip Planner

**JavaScript (paris_trip_planner.js):**
```js
import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const conversationHistory = [
  { role: "system", content: "You are an expert Paris travel guide..." }
];

async function chat(userMessage) {
  conversationHistory.push({ role: "user", content: userMessage });
  
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: conversationHistory,
    max_tokens: 200,
    temperature: 0.8,
  });
  
  const assistantMessage = response.choices[0].message.content;
  conversationHistory.push({ role: "assistant", content: assistantMessage });
  return assistantMessage;
}

console.log(await chat("What are the must-see attractions in Paris?"));
```

**The Python and JS code are nearly identical** — same API structure, same conversation logic. Main difference is `async/await` in JS.

---

## Python vs JS: OpenAI SDK Comparison

| Python | JavaScript |
|--------|-----------|
| `from openai import OpenAI` | `import OpenAI from "openai"` |
| `client = OpenAI()` | `const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })` |
| `client.chat.completions.create(...)` | `await client.chat.completions.create(...)` |
| `response.choices[0].message.content` | `response.choices[0].message.content` (identical!) |
| `conversation_history.append({...})` | `conversationHistory.push({...})` |
| `for _, row in df.iterrows()` | `for (const item of items)` |
