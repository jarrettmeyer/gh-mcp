import { describe, expect, test } from "bun:test";
import { tokenize } from "./tokenize.js";

describe("tokenize - basic quoting", () => {
  test("no quotes: baseline behavior", () => {
    expect(tokenize("issue list --repo cli/cli")).toEqual(["issue", "list", "--repo", "cli/cli"]);
  });

  test("double-quoted value with space", () => {
    expect(tokenize('issue create -t "My title"')).toEqual(["issue", "create", "-t", "My title"]);
  });

  test("single-quoted value with space", () => {
    expect(tokenize("issue create -t 'My title'")).toEqual(["issue", "create", "-t", "My title"]);
  });

  test("quoted search query", () => {
    expect(tokenize('issue list --search "open bugs"')).toEqual(["issue", "list", "--search", "open bugs"]);
  });
});

describe("tokenize - multi-word flag values", () => {
  test("multiple quoted flags in one command", () => {
    expect(tokenize('issue create -t "New skill: mcp-server" -b "Body text here"')).toEqual([
      "issue",
      "create",
      "-t",
      "New skill: mcp-server",
      "-b",
      "Body text here",
    ]);
  });

  test("realistic PR creation: title and body as single strings", () => {
    const tokens = tokenize('pr create -t "Fix tokenizer" -b "This PR fixes the argument parsing bug"');
    expect(tokens).toHaveLength(6);
    expect(tokens[3]).toBe("Fix tokenizer");
    expect(tokens[5]).toBe("This PR fixes the argument parsing bug");
  });
});

describe("tokenize - multiline bodies", () => {
  test("body token preserves newlines as a single string", () => {
    const tokens = tokenize('issue create -t "Title" -b "Line 1\\nLine 2\\nLine 3"');
    // shell-quote keeps the body as one token with literal \n sequences preserved
    expect(tokens).toHaveLength(6);
    expect(tokens[5]).toContain("Line 1");
    expect(tokens[5]).toContain("Line 2");
    expect(tokens[5]).toContain("Line 3");
  });
});

describe("tokenize - equals-sign flag syntax", () => {
  test("--method=GET: no quotes needed", () => {
    expect(tokenize("api repos/owner/repo --method=GET")).toEqual(["api", "repos/owner/repo", "--method=GET"]);
  });

  test("--search=value keeps flag and value as one token", () => {
    // shell-quote parses --search="open bugs" as a single token "--search=open bugs"
    const tokens = tokenize('issue list --search="open bugs"');
    expect(tokens).toHaveLength(3);
    expect(tokens[2]).toBe("--search=open bugs");
  });
});

describe("tokenize - empty and whitespace input", () => {
  test("empty string returns []", () => {
    expect(tokenize("")).toEqual([]);
  });

  test("whitespace-only returns []", () => {
    expect(tokenize("   ")).toEqual([]);
  });

  test("extra whitespace between tokens is collapsed", () => {
    expect(tokenize("  issue  list  ")).toEqual(["issue", "list"]);
  });
});

describe("tokenize - quotes within quotes and escaping", () => {
  test("single quote inside double quotes", () => {
    expect(tokenize('issue create -t "It\'s a title"')).toEqual(["issue", "create", "-t", "It's a title"]);
  });
});

describe("tokenize - shell operators are discarded", () => {
  test("pipe operator is discarded", () => {
    expect(tokenize("issue list | grep bug")).toEqual(["issue", "list", "grep", "bug"]);
  });

  test("redirect operator is discarded", () => {
    expect(tokenize("issue list > output.txt")).toEqual(["issue", "list", "output.txt"]);
  });
});

describe("tokenize - acceptance criteria", () => {
  test("6 tokens for issue create with title and body", () => {
    const tokens = tokenize('issue create -t "Title with spaces" -b "Body with spaces"');
    expect(tokens).toEqual(["issue", "create", "-t", "Title with spaces", "-b", "Body with spaces"]);
    expect(tokens).toHaveLength(6);
  });
});
