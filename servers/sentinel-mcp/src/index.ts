import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { logToolCall } from "./logger";

import {
  loadEvents,
  getIncident,
  searchIncidents,
} from "./events";

const server = new McpServer({
  name: "lemon-sentinel-mcp",
  version: "1.0.0",
});

server.tool(
  "list_incidents",
  "List mock security incidents, optionally filtered by severity",
  {
    severity: z.string().optional(),
  },
  async ({ severity }) => {
    let incidents = loadEvents();

    if (severity) {
      incidents = incidents.filter(
        (incident: any) =>
          incident.severity.toLowerCase() === severity.toLowerCase()
      );
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(incidents, null, 2),
        },
      ],
    };
  }
);

server.tool(
  "get_incident",
  "Get a security incident by ID",
  {
    id: z.string(),
  },
  async ({ id }) => {
    const incident = getIncident(id);

    logToolCall(
      "sentinel",
      "get_incident",
      Boolean(incident),
      { id }
    );

    return {
      content: [
        {
          type: "text",
          text: incident
            ? JSON.stringify(incident, null, 2)
            : `Incident ${id} not found`,
        },
      ],
    };
  }
);

server.tool(
  "search_incidents",
  "Search mock Sentinel incidents",
  {
    query: z.string(),
  },
  async ({ query }) => {
    const results = searchIncidents(query);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();

await server.connect(transport);
