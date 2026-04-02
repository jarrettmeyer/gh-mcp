import { tokenize } from "./tokenize.js";

/** The default gh binary name, resolved from the system PATH. */
const DEFAULT_GH_BIN = "gh";

/** Result of executing a gh CLI command. */
export interface GhCommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * Executes a gh CLI command using Bun.spawn() and captures its output.
 *
 * The command string is tokenized with shell-quote to correctly handle quoted arguments,
 * then passed as arguments to `gh`. Both stdout and stderr are captured; the exit code
 * is returned alongside them so callers can distinguish success from failure without throwing.
 */
export async function executeGhCommand(command: string): Promise<GhCommandResult> {
  const args = tokenize(command);
  const ghBinary = process.env.GH_PATH || DEFAULT_GH_BIN;

  const proc = Bun.spawn([ghBinary, ...args], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdoutBuffer, stderrBuffer, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  return {
    stdout: stdoutBuffer,
    stderr: stderrBuffer,
    exitCode,
  };
}
