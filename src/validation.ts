/** Top-level gh commands that are fully allowed without restriction. */
export const ALLOWED_COMMANDS = new Set([
  "gist",
  "issue",
  "label",
  "pr",
  "reference",
  "release",
  "repo",
  "run",
  "search",
  "status",
  "workflow",
]);

/** Subcommands permitted under `auth`. */
const ALLOWED_AUTH_SUBCOMMANDS = new Set(["status"]);

/** HTTP methods permitted for the `api` command. */
const ALLOWED_API_HTTP_METHODS = new Set(["GET"]);

/** Flags that request help output — allowed on any command. */
const HELP_FLAGS = new Set(["--help", "-h"]);

/** Sorted list of all top-level commands shown in rejection messages. */
const ALLOWED_COMMANDS_LIST = [...ALLOWED_COMMANDS, "auth", "api"].sort().join(", ");

/** Sorted list with inline restriction notes for use in tool descriptions. */
export const ALLOWED_COMMANDS_ANNOTATED = [
  ...ALLOWED_COMMANDS,
  `api (${[...ALLOWED_API_HTTP_METHODS].join("/")} only)`,
  `auth (${[...ALLOWED_AUTH_SUBCOMMANDS].join("/")} only)`,
]
  .sort()
  .join(", ");

/**
 * Matches --method=VALUE or -X=VALUE flag syntax.
 */
const METHOD_EQ_RE = /^(?:--method|-X)=(.+)$/;

type ValidationResult = { valid: true } | { valid: false; reason: string };

/**
 * Validates a gh CLI command string against the allowlist policy.
 *
 * - Fully allowed commands pass without restriction.
 * - `auth` is restricted to `auth status` only.
 * - `api` is restricted to GET requests (no --method/-X with non-GET values).
 * - All other top-level commands are rejected.
 * - Empty or whitespace-only commands are rejected.
 */
export function validateCommand(command: string): ValidationResult {
  const tokens = command.trim().split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return { valid: false, reason: "Command cannot be empty." };
  }

  // Always allow '--help' for discovery.
  if (tokens.some((t) => HELP_FLAGS.has(t))) {
    return { valid: true };
  }

  const [topLevel, ...rest] = tokens;

  if (ALLOWED_COMMANDS.has(topLevel)) {
    return { valid: true };
  }

  if (topLevel === "auth") {
    return validateAuth(rest);
  }

  if (topLevel === "api") {
    return validateApi(rest);
  }

  return {
    valid: false,
    reason: `Command '${topLevel}' is not allowed. Allowed commands: ${ALLOWED_COMMANDS_LIST}.`,
  };
}

/**
 * Validates `auth` subcommand — only subcommands in ALLOWED_AUTH_SUBCOMMANDS are permitted.
 */
function validateAuth(rest: string[]): ValidationResult {
  if (rest[0] !== undefined && ALLOWED_AUTH_SUBCOMMANDS.has(rest[0])) {
    return { valid: true };
  }
  const allowed = [...ALLOWED_AUTH_SUBCOMMANDS].join(", ");
  return {
    valid: false,
    reason: `Only 'auth ${allowed}' is allowed. Other auth subcommands (login, logout, etc.) are not permitted.`,
  };
}

/**
 * Validates `api` command — rejects any --method/-X flag whose value is not GET.
 * Handles both `--method VALUE` and `--method=VALUE` syntax.
 */
function validateApi(rest: string[]): ValidationResult {
  for (let i = 0; i < rest.length; i++) {
    const token = rest[i];

    // --method=VALUE or -X=VALUE
    const eqMatch = METHOD_EQ_RE.exec(token);
    if (eqMatch) {
      if (!ALLOWED_API_HTTP_METHODS.has(eqMatch[1].toUpperCase())) {
        return methodNotAllowed(eqMatch[1]);
      }
      continue;
    }

    // --method VALUE or -X VALUE
    if (token === "--method" || token === "-X") {
      const value = rest[i + 1];
      if (value === undefined) {
        return {
          valid: false,
          reason: `Flag '${token}' requires a value.`,
        };
      }
      if (!ALLOWED_API_HTTP_METHODS.has(value.toUpperCase())) {
        return methodNotAllowed(value);
      }
      i++; // skip the value token
    }
  }

  return { valid: true };
}

/** Returns a rejection result for a disallowed HTTP method. */
function methodNotAllowed(method: string): ValidationResult {
  return {
    valid: false,
    reason: `HTTP method '${method}' is not allowed for 'api'. Only GET requests are permitted.`,
  };
}
