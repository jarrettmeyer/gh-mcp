# gh-mcp

This is a very thin wrapper around the `gh` CLI.

Add to Claude Desktop with the following configuration.

```json
{
  "mcpServers": {
    "gh": {
      "command": "/path/to/.bun/bin/bun",
      "args": [
        "run",
        "/path/to/gh-mcp/src/index.ts"
      ]
    }
  }
}
```