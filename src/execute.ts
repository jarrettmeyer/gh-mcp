import { tokenize } from "./tokenize.js";

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

  const proc = Bun.spawn(["gh", ...args], {
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
