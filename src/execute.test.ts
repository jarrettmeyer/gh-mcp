import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";

describe("executeGhCommand", () => {
  const originalSpawn = Bun.spawn.bind(Bun);
  const spawnCalls: string[][] = [];

  beforeEach(() => {
    spawnCalls.length = 0;
    // Guard against GH_PATH inherited from the developer's shell environment.
    delete process.env.GH_PATH;

    // @ts-expect-error — overriding Bun.spawn for testing
    Bun.spawn = mock((args: string[]) => {
      spawnCalls.push(args);
      const makeEmpty = () =>
        new ReadableStream({
          start(c) {
            c.enqueue(new TextEncoder().encode(""));
            c.close();
          },
        });
      return { stdout: makeEmpty(), stderr: makeEmpty(), exited: Promise.resolve(0) };
    });
  });

  afterEach(() => {
    Bun.spawn = originalSpawn;
    delete process.env.GH_PATH;
  });

  test("uses 'gh' by default when GH_PATH is not set", async () => {
    const { executeGhCommand } = await import("./execute");
    await executeGhCommand("issue list");
    expect(spawnCalls[0][0]).toBe("gh");
  });

  test("uses GH_PATH when set", async () => {
    process.env.GH_PATH = "/opt/homebrew/bin/gh";
    const { executeGhCommand } = await import("./execute");
    await executeGhCommand("issue list");
    expect(spawnCalls[0][0]).toBe("/opt/homebrew/bin/gh");
  });
});
