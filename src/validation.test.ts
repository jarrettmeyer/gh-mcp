import { describe, expect, test } from "bun:test";
import { validateCommand } from "./validation";

describe("validateCommand", () => {
  describe("fully allowed commands", () => {
    test.each([
      "issue list",
      "pr view 123",
      "search repos --query foo",
      "gist create",
      "label list",
      "release view",
      "repo view",
      "run list",
      "status",
      "workflow list",
    ])("allows: %s", (cmd) => {
      expect(validateCommand(cmd)).toEqual({ valid: true });
    });
  });

  describe("auth command", () => {
    test("allows auth status", () => {
      expect(validateCommand("auth status")).toEqual({ valid: true });
    });

    test("rejects auth login", () => {
      const result = validateCommand("auth login");
      expect(result.valid).toBe(false);
    });

    test("rejects auth logout", () => {
      const result = validateCommand("auth logout");
      expect(result.valid).toBe(false);
    });

    test("rejects bare auth", () => {
      const result = validateCommand("auth");
      expect(result.valid).toBe(false);
    });
  });

  describe("api command - method validation", () => {
    test('rejects api -X"POST" (concatenated short flag bypasses naive check)', () => {
      const result = validateCommand('api -X"POST" /path');
      expect(result.valid).toBe(false);
    });

    test('rejects api -X"DELETE" (concatenated short flag)', () => {
      const result = validateCommand('api -X"DELETE" /path');
      expect(result.valid).toBe(false);
    });
  });

  describe("api command", () => {
    test("allows api with no method flag (GET default)", () => {
      expect(validateCommand("api /repos/cli/cli")).toEqual({ valid: true });
    });

    test("allows api --method GET", () => {
      expect(validateCommand("api --method GET /path")).toEqual({ valid: true });
    });

    test("allows api -X GET (case-insensitive)", () => {
      expect(validateCommand("api -X get /path")).toEqual({ valid: true });
    });

    test("allows api --method=GET", () => {
      expect(validateCommand("api --method=GET /path")).toEqual({ valid: true });
    });

    test("rejects api --method POST", () => {
      const result = validateCommand("api --method POST /path");
      expect(result.valid).toBe(false);
    });

    test("rejects api --method=PATCH", () => {
      const result = validateCommand("api --method=PATCH /path");
      expect(result.valid).toBe(false);
    });

    test("rejects api -X DELETE", () => {
      const result = validateCommand("api -X DELETE /path");
      expect(result.valid).toBe(false);
    });

    test("rejects api -X PUT", () => {
      const result = validateCommand("api -X PUT /path");
      expect(result.valid).toBe(false);
    });
  });

  describe("disallowed commands", () => {
    test("rejects unknown top-level command with helpful message", () => {
      const result = validateCommand("delete something");
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.reason).toContain("delete");
        expect(result.reason).toContain("Allowed commands:");
      }
    });

    test("rejects 'extension' command", () => {
      const result = validateCommand("extension install owner/repo");
      expect(result.valid).toBe(false);
    });
  });

  describe("help flag", () => {
    test("allows bare --help", () => {
      expect(validateCommand("--help")).toEqual({ valid: true });
    });

    test("allows bare -h", () => {
      expect(validateCommand("-h")).toEqual({ valid: true });
    });

    test("allows allowed command + --help", () => {
      expect(validateCommand("pr --help")).toEqual({ valid: true });
    });

    test("allows disallowed command + --help", () => {
      expect(validateCommand("extension --help")).toEqual({ valid: true });
    });

    test("allows disallowed command + -h", () => {
      expect(validateCommand("config -h")).toEqual({ valid: true });
    });

    test("allows auth --help (normally restricted)", () => {
      expect(validateCommand("auth --help")).toEqual({ valid: true });
    });

    test("allows nested subcommand + --help", () => {
      expect(validateCommand("pr list --help")).toEqual({ valid: true });
    });

    test("allows restricted subcommand + --help (auth login --help)", () => {
      expect(validateCommand("auth login --help")).toEqual({ valid: true });
    });
  });

  describe("empty / whitespace", () => {
    test("rejects empty string", () => {
      const result = validateCommand("");
      expect(result.valid).toBe(false);
    });

    test("rejects whitespace-only string", () => {
      const result = validateCommand("   ");
      expect(result.valid).toBe(false);
    });
  });
});
