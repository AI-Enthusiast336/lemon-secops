const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "nomic-embed-text";

export async function embed(text: string): Promise<number[]> {
  const r = await fetch(`${OLLAMA_URL}/api/embed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text })
  });
  if (!r.ok) throw new Error(`Embedding failed: ${r.status}`);
  const data = await r.json();
  return data.embeddings[0];
}
