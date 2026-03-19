# gh-mcp

This is a very thin wrapper around the `gh` CLI.

## Installation

1. Install the [GitHub CLI](https://cli.github.com/)

2. Verify your `gh` installation

   ```bah
   gh --version
   ```

3. Install [bun](https://bun.com/docs/installation)

4. Verify your `bun` installation

   ```bash
   bun --version
   ```

5. Update your Claude Desktop configuration

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

6. Restart Claude Desktop

## Resources

- [Bun](https://bun.com/)
- [GitHub CLI](https://cli.github.com/)
- [jarrettmeyer/gh-mcp](https://github.com/jarrettmeyer/gh-mcp)
- [Model Context Protocol TypeScript SDK](https://ts.sdk.modelcontextprotocol.io/)
