const QDRANT_URL = process.env.QDRANT_URL || "http://localhost:6333";
const COLLECTION = process.env.QDRANT_COLLECTION || "mini_lemon_memory";

export async function ensureCollection(size: number) {
  const exists = await fetch(`${QDRANT_URL}/collections/${COLLECTION}`);
  if (exists.ok) return;
  const r = await fetch(`${QDRANT_URL}/collections/${COLLECTION}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vectors: { size, distance: "Cosine" } })
  });
  if (!r.ok) throw new Error(await r.text());
}

export async function upsertPoint(id: string, vector: number[], payload: any) {
  const r = await fetch(`${QDRANT_URL}/collections/${COLLECTION}/points?wait=true`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ points: [{ id, vector, payload }] })
  });
  if (!r.ok) throw new Error(await r.text());
}

export async function queryPoints(vector: number[], limit = 5) {
  const r = await fetch(`${QDRANT_URL}/collections/${COLLECTION}/points/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: vector, limit, with_payload: true })
  });
  if (!r.ok) throw new Error(await r.text());
  const data = await r.json();
  return data.result.points;
}
