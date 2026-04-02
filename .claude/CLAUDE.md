This project is a locally running MCP server that wraps the `gh` CLI.

## Workflow

1. Always begin in Plan Mode, even for trivial changes. Every plan must include:
   - The proposed branch and worktree name.
   - Concrete validation steps.
2. Always create a branch. Never work directly on `main`, even for trivial changes. Branch names should be short and descriptive, e.g. `refactor-auth`, `update-claude-md`.
3. Use git worktrees in `.worktrees/` for all changes. Do not use the `EnterWorktree` tool. Instead, use `git worktree add .worktrees/<branch> -b <branch>`.
4. Always use a tasks lists - `TaskCreate` - before starting work.
5. Follow test-driven design (TDD).
6. Create a pull request when work is complete.

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
