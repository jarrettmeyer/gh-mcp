# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

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

[Unreleased]: https://github.com/jarrettmeyer/gh-mcp/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/jarrettmeyer/gh-mcp/releases/tag/v0.1.0
