/** Result of executing a gh CLI command. */
export interface GhCommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * Executes a gh CLI command using Bun.spawn() and captures its output.
 *
 * The command string is split on whitespace and passed as arguments to `gh`.
 * Both stdout and stderr are captured; the exit code is returned alongside them
 * so callers can distinguish success from failure without throwing.
 */
export async function executeGhCommand(command: string): Promise<GhCommandResult> {
  const args = command.trim().split(/\s+/).filter(Boolean);

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
