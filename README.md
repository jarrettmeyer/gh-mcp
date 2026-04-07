# gh-mcp

This is a very thin wrapper around the `gh` CLI.

## Security

**This server passes any command directly to `gh` without filtering.** It can do anything your authenticated GitHub token allows.

To control what the server can do, scope your token:

- **Recommended:** Create a [fine-grained personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token) with only the repository access and permissions your AI tool needs.
- **Alternatively:** Use a classic PAT with the minimum required scopes.

The server prevents shell injection by design — commands are passed as argument arrays to `Bun.spawn`, never interpolated into a shell string.

## Installation

### 1. Install the GitHub CLI

Download the [GitHub CLI](https://cli.github.com/). Or use `brew install gh`. Verify your installation.

```bash
gh --version
```

### 2. Install bun

This project uses [bun](https://bun.com/docs/installation) for package management. Verify your installation.

```bash
bun --version
```

### 3. Clone the repo and install dependencies

```bash
git clone https://github.com/jarrettmeyer/gh-mcp.git
cd gh-mcp
bun install
```

### 4. Add the server to your MCP client

#### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

**Note**: `bun` installs to `~/.bun/bin/`, which is not on the default `PATH`. Use the full path to the `bun` executable.

```json
{
  "mcpServers": {
    "gh": {
      "command": "/Users/your-username/.bun/bin/bun",
      "args": ["run", "/path/to/gh-mcp/src/index.ts"]
    }
  }
}
```

Then restart Claude Desktop.

#### Claude Code

Install from your terminal:

```bash
claude mcp add gh -- bun run /path/to/gh-mcp/src/index.ts
```

If `gh` is in a non-standard location, pass `GH_PATH` via `--env`:

```bash
claude mcp add gh --env GH_PATH=/opt/homebrew/bin/gh -- bun run /path/to/gh-mcp/src/index.ts
```

## Usage

### `send_command`

Executes a `gh` CLI command. Pass everything that would follow `gh` on the command line as the `command` string.

| Parameter | Type   | Description                              |
| --------- | ------ | ---------------------------------------- |
| `command` | string | The `gh` subcommand and arguments to run |

**Examples:**

```text
List open pull requests in a repo:
  command: "pr list --repo owner/repo"

View an issue:
  command: "issue view 42 --repo owner/repo"

Check the authenticated user:
  command: "auth status"
```

This tool works with any MCP-compatible client, including Claude Desktop, Claude Code, and Cursor.

## Additional Configuration

### `GH_PATH`

By default, the server resolves `gh` from your `PATH`. If `gh` is installed in a non-standard location (e.g. Homebrew on Apple Silicon), set `GH_PATH` to its absolute path:

```json
{
  "mcpServers": {
    "gh": {
      "command": "/Users/your-username/.bun/bin/bun",
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
