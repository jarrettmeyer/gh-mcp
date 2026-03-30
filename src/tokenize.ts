import { parse } from "shell-quote";

/**
 * Tokenizes a shell-style command string into an array of argument strings.
 *
 * Uses shell-quote's parse() to correctly handle quoted strings (both single and double quotes),
 * preserving spaces inside quotes as single tokens. Shell operators (pipe, redirect, etc.) are
 * discarded since gh does not support shell piping — args are passed directly to Bun.spawn().
 */
export function tokenize(command: string): string[] {
  return parse(command.trim()).filter((entry): entry is string => typeof entry === "string");
}
