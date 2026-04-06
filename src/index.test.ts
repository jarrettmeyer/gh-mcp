import { describe, expect, mock, test } from "bun:test";
import { handleSendCommand } from "./index";

const mockExecute = mock(() => Promise.resolve({ exitCode: 0, stdout: "", stderr: "" }));

describe("handleSendCommand", () => {
  test("returns stdout on success", async () => {
    mockExecute.mockResolvedValue({ exitCode: 0, stdout: "issue list output", stderr: "" });
    const result = await handleSendCommand({ command: "issue list" }, mockExecute);
    expect(result.isError).toBeUndefined();
    expect(result.content).toEqual([{ type: "text", text: "issue list output" }]);
  });

  test("returns isError when executor throws an Error", async () => {
    mockExecute.mockRejectedValue(new Error("spawn failed"));
    const result = await handleSendCommand({ command: "issue list" }, mockExecute);
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("spawn failed");
  });

  test("returns generic message when executor throws a non-Error", async () => {
    mockExecute.mockRejectedValue("oops");
    const result = await handleSendCommand({ command: "issue list" }, mockExecute);
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Command execution failed.");
  });

  test("returns isError with stderr when exit code is non-zero and stderr is present", async () => {
    mockExecute.mockResolvedValue({ exitCode: 1, stdout: "", stderr: "not found" });
    const result = await handleSendCommand({ command: "issue list" }, mockExecute);
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("not found");
  });

  test("returns isError with stdout fallback when exit code is non-zero and only stdout is present", async () => {
    mockExecute.mockResolvedValue({ exitCode: 1, stdout: "some output", stderr: "" });
    const result = await handleSendCommand({ command: "issue list" }, mockExecute);
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("some output");
  });

  test("returns isError with generic message when exit code is non-zero and no output", async () => {
    mockExecute.mockResolvedValue({ exitCode: 2, stdout: "", stderr: "" });
    const result = await handleSendCommand({ command: "issue list" }, mockExecute);
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("gh exited with code 2");
  });
});
