# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- MIT `LICENSE` file.
- `repository`, `keywords`, and `engines` fields to `package.json`.
- `GH_PATH` environment variable to specify a custom path to the `gh` binary (defaults to `gh` on `PATH`).

### Removed

- Allowlist-based command validation. All `gh` commands are now permitted. Configure a scoped GitHub token to control what this server can do.

## [0.1.1] - 2026-03-30

### Fixed

- Harden `tokenize()` with explicit error handling for unsafe or malformed input.

### Changed

- Bump `@modelcontextprotocol/sdk` to 1.28.0.
- Bump `typescript` to 6.0.2.
- Bump `actions/checkout` to v6.

## [0.1.0] - 2026-03-19

### Added

- MCP server wrapping the `gh` CLI via a single `send_command` tool.
- Allowlist-based command validation for safe command execution.
- Fully allowed commands: `gist`, `issue`, `label`, `pr`, `reference`, `release`, `repo`, `run`, `search`, `status`, `workflow`.
- Restricted `auth` command (only `status` subcommand allowed).
- Restricted `api` command (only `GET` requests allowed).
- `--help` / `-h` support on any `gh` command for discovery.
- CI workflow with typecheck, format check, and test steps.
- Dependabot configuration for weekly npm dependency updates.
- 34 unit tests covering validation and help flag handling.

[Unreleased]: https://github.com/jarrettmeyer/gh-mcp/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/jarrettmeyer/gh-mcp/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/jarrettmeyer/gh-mcp/releases/tag/v0.1.0
