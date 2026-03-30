# CLAUDE.md

## Workflow

Use git worktrees in `.worktrees/` for all changes. Create a pull request when work is complete.

## Changelog

Maintain `CHANGELOG.md` using [Keep a Changelog](https://keepachangelog.com/) format. Keep entries brief — commits and PRs provide full detail.

## Versioning

The version lives in `package.json`. The MCP server name, description, and version are all sourced from `package.json` (`src/index.ts` imports it directly). No other files need version updates.

## Verification

After making changes, always run:

```sh
bun test
bun run typecheck
bun run format:check
```
