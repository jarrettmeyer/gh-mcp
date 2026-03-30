import { parse } from "shell-quote";

/** Detects shell variable references — $VAR or ${VAR} syntax. */
const SHELL_VAR_RE = /\$[{A-Za-z_]/;

/**
 * Tokenizes a shell-style command string into an array of argument strings.
 *
 * Uses shell-quote's parse() to correctly handle quoted strings (both single and double quotes),
 * preserving spaces inside quotes as single tokens. Leading and trailing whitespace is trimmed
 * before parsing.
 *
 * Throws a descriptive Error for input that cannot be tokenized safely:
 * - Shell variable references ($VAR, ${VAR}) — variables are not evaluated; callers must provide
 *   literal argument values.
 * - Unbalanced quotes — shell-quote silently produces wrong tokens; this function detects and
 *   rejects malformed input instead.
 * - Shell operators (|, >, >>, &, ;, &&, ||), glob patterns (*.json), and inline comments (#) —
 *   arguments are passed directly to Bun.spawn() with no shell interpretation, so these constructs
 *   have no meaning and are rejected rather than silently discarded.
 */
export function tokenize(command: string): string[] {
  const trimmed = command.trim();

  if (SHELL_VAR_RE.test(trimmed)) {
    throw new Error(
      "Tokenization failed: shell variable references ($VAR, ${VAR}) are not supported. Provide literal argument values instead.",
    );
  }

  assertBalancedQuotes(trimmed);

  // Pass an empty env object to prevent any expansion of $-references from process.env.
  const entries = parse(trimmed, {});

  const unsupported = entries.filter((e) => typeof e !== "string");
  if (unsupported.length > 0) {
    const labels = unsupported.map((e) => ("comment" in (e as object) ? "#" : (e as { op: string }).op)).join(", ");
    throw new Error(
      `Tokenization failed: shell syntax not supported (found: ${labels}). Arguments are passed directly to gh — piping, redirection, glob patterns, and chaining are not available.`,
    );
  }

  return entries.filter((e): e is string => typeof e === "string");
}

/**
 * Throws if the input contains an unmatched single or double quote.
 *
 * shell-quote silently produces mangled tokens for unclosed quotes rather than
 * signalling an error, so we detect the condition before calling parse().
 */
function assertBalancedQuotes(input: string): void {
  let inSingle = false;
  let inDouble = false;
  for (const ch of input) {
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
  }
  if (inSingle || inDouble) {
    const which = inSingle ? "single" : "double";
    throw new Error(`Tokenization failed: unmatched ${which} quote. Ensure all quoted arguments are properly closed.`);
  }
}
