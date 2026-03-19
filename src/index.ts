import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { executeGhCommand } from "./execute.js";
import { validateCommand } from "./validation.js";

const server = new McpServer({
  name: "gh-mcp",
  version: "0.1.0",
});

server.tool(
  "send_command",
  "Execute a gh CLI command. Provide the arguments after `gh` — e.g. `issue list --repo cli/cli`.",
  { command: z.string().describe("The gh subcommand and arguments to run.") },
  async ({ command }) => {
    const validation = validateCommand(command);
    if (!validation.valid) {
      return {
        isError: true,
        content: [{ type: "text", text: validation.reason }],
      };
    }

    const result = await executeGhCommand(command);

    if (result.exitCode !== 0) {
      const message = result.stderr.trim() || result.stdout.trim() || `gh exited with code ${result.exitCode}.`;
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `gh exited with code ${result.exitCode}:\n${message}`,
          },
        ],
      };
    }

    return {
      content: [{ type: "text", text: result.stdout }],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("gh-mcp server running on stdio");
