import fs from "fs";
import path from "path";

const LOG_FILE = path.resolve(
  import.meta.dir,
  "../../../logs/tool-calls.jsonl"
);

export function logToolCall(
  server: string,
  tool: string,
  success: boolean,
  details: any = {}
) {
  const entry = {
    timestamp: new Date().toISOString(),
    server,
    tool,
    success,
    details,
  };

  fs.appendFileSync(
    LOG_FILE,
    JSON.stringify(entry) + "\n"
  );
}
