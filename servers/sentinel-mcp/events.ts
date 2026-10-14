import fs from "fs";
import path from "path";

const EVENTS_FILE = path.resolve(
  process.env.EVENTS_FILE ||
  "../../data/security-events.json"
);

export function loadEvents() {
  const raw = fs.readFileSync(EVENTS_FILE, "utf8");
  return JSON.parse(raw);
}

export function getIncident(id: string) {
  const events = loadEvents();

  return events.find(
    (event: any) => event.id === id
  );
}

export function searchIncidents(query: string) {
  const events = loadEvents();

  const q = query.toLowerCase();

  return events.filter((event: any) =>
    JSON.stringify(event)
      .toLowerCase()
      .includes(q)
  );
}
