import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { randomUUID } from "crypto";
import { embed } from "./embeddings";
import { ensureCollection, upsertPoint, queryPoints } from "./qdrant";
import { appendMemory, listMemories } from "./memoryStore";

const server = new McpServer({ name: "memory-mcp", version: "1.0.0" });

server.tool("remember", "Store a durable semantic memory", { content: z.string(), type: z.string().default("note") }, async ({ content, type }) => {
  const id = randomUUID();
  const memory = { id, type, content, created_at: new Date().toISOString() };
  appendMemory(memory);
  const vector = await embed(content);
  await ensureCollection(vector.length);
  await upsertPoint(id, vector, memory);
  return { content: [{ type: "text", text: JSON.stringify(memory, null, 2) }] };
});

server.tool("list_memories", "List durable memories", {}, async () => ({
  content: [{ type: "text", text: JSON.stringify(listMemories(), null, 2) }]
}));

server.tool("search_memory", "Semantic search over memories", { query: z.string(), limit: z.number().default(5) }, async ({ query, limit }) => {
  const vector = await embed(query);
  const results = await queryPoints(vector, limit);
  return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
});

await server.connect(new StdioServerTransport());
