# Day 17 — Python vs JavaScript: Tool Calling

---

## Python (from tool_calling_in_langchain.ipynb) vs JavaScript

**JavaScript — Define Tools:**
```js
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const getConversionFactor = new DynamicStructuredTool({
  name: "get_conversion_factor",
  description: "Gets the conversion rate between two currencies.",
  schema: z.object({
    base_currency: z.string().describe("Source currency code"),
    target_currency: z.string().describe("Target currency code"),
  }),
  func: async ({ base_currency, target_currency }) => {
    const rates = { USD: 1.0, EUR: 0.92, GBP: 0.79, JPY: 149.5 };
    const factor = rates[target_currency] / rates[base_currency];
    return JSON.stringify({ factor: factor.toFixed(4) });
  },
});
const tools = [getConversionFactor, convertCurrency];
```
**Key difference:** Python uses `@tool` decorator on a function. JS uses `new DynamicStructuredTool({})`.

---

**JavaScript — Bind tools and run:**
```js
const modelWithTools = model.bindTools(tools);   // bindTools (camelCase)
const messages = [new HumanMessage("What is 250 USD in EUR?")];

while (true) {
  const response = await modelWithTools.invoke(messages);
  messages.push(response);
  
  if (!response.tool_calls || response.tool_calls.length === 0) {
    console.log(response.content);
    break;
  }
  
  for (const toolCall of response.tool_calls) {
    const tool = toolMap[toolCall.name];
    const toolResult = await tool.invoke(toolCall.args);
    
    messages.push(new ToolMessage({
      content: toolResult,
      tool_call_id: toolCall.id
    }));
  }
}
```

---

## Key Mapping Table

| Python | JavaScript |
|--------|-----------|
| `@tool` decorator | `new DynamicStructuredTool({ name, description, schema, func })` |
| `model.bind_tools(tools)` | `model.bindTools(tools)` |
| `response.tool_calls[0]["name"]` | `response.tool_calls[0].name` |
| `response.tool_calls[0]["args"]` | `response.tool_calls[0].args` |
| `ToolMessage(content=..., tool_call_id=...)` | `new ToolMessage({ content, tool_call_id })` |
| `tool.invoke(args)` | `await tool.invoke(args)` |
