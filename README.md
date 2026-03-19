# gh-mcp

This is a very thin wrapper around the `gh` CLI.

## Installation

1. Install [bun](https://bun.com/docs/installation)

2. Verify your `bun` installation

    ```bash
    bun --version
    ```

3. Update your Claude Desktop configuration

    On MacOS, this is located at `~/Application Support/Claude/claude_desktop_config.json`.

    ```json
    {
      "mcpServers": {
        "gh": {
          "command": "/path/to/.bun/bin/bun",
          "args": ["run", "/path/to/gh-mcp/src/index.ts"]
        }
      }
    }
    ```

4. Restart Claude Desktop

## Resources

- [jarrettmeyer/gh-mcp](https://github.com/jarrettmeyer/gh-mcp)
