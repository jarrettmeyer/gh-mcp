# gh-mcp

This is a very thin wrapper around the `gh` CLI.

## Security

**This server passes any command directly to `gh` without filtering.** It can do anything your authenticated GitHub token allows.

To control what the server can do, scope your token:

- **Recommended:** Create a [fine-grained personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token) with only the repository access and permissions your AI tool needs.
- **Alternatively:** Use a classic PAT with the minimum required scopes.

The server prevents shell injection by design — commands are passed as argument arrays to `Bun.spawn`, never interpolated into a shell string.

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

## Configuration

### `GH_PATH`

By default, the server resolves `gh` from your `PATH`. If `gh` is installed in a non-standard location (e.g. Homebrew on Apple Silicon), set `GH_PATH` to its absolute path:

```json
{
  "mcpServers": {
    "gh": {
      "command": "/path/to/.bun/bin/bun",
      "args": ["run", "/path/to/gh-mcp/src/index.ts"],
      "env": {
        "GH_PATH": "/opt/homebrew/bin/gh"
      }
    }
  }
}
```

## Resources

- [Bun](https://bun.com/)
- [GitHub CLI](https://cli.github.com/)
- [jarrettmeyer/gh-mcp](https://github.com/jarrettmeyer/gh-mcp)
- [Model Context Protocol TypeScript SDK](https://ts.sdk.modelcontextprotocol.io/)

## License

[MIT](LICENSE)
