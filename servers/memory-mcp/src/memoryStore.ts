import fs from "fs";
import path from "path";

const FILE = path.resolve(process.cwd(), "../../data/memory/memories.jsonl");

export function appendMemory(memory: any) {
  fs.appendFileSync(FILE, JSON.stringify(memory) + "\n");
}

export function listMemories() {
  if (!fs.existsSync(FILE)) return [];
  return fs.readFileSync(FILE, "utf8")
    .split("\n")
    .filter(Boolean)
    .map(line => JSON.parse(line));
}
