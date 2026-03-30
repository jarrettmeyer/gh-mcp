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
    expect(tokens).toHaveLength(6);
    expect(tokens[5]).toBe("Line 1\\nLine 2\\nLine 3");
  });
});

describe("tokenize - equals-sign flag syntax", () => {
  test("--method=GET: no quotes needed", () => {
    expect(tokenize("api repos/owner/repo --method=GET")).toEqual(["api", "repos/owner/repo", "--method=GET"]);
  });

  test("--search=value keeps flag and value as one token", () => {
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

describe("tokenize - unsupported syntax throws", () => {
  test("pipe operator throws", () => {
    expect(() => tokenize("issue list | grep bug")).toThrow(/not supported/i);
  });

  test("redirect operator throws", () => {
    expect(() => tokenize("issue list > output.txt")).toThrow(/not supported/i);
  });

  test("semicolon operator throws", () => {
    expect(() => tokenize("issue list; issue delete")).toThrow(/not supported/i);
  });

  test("inline comment (#) throws", () => {
    expect(() => tokenize("api /repos/cli/cli # --method DELETE")).toThrow(/not supported/i);
  });

  test("glob pattern throws", () => {
    expect(() => tokenize("issue list *.json")).toThrow(/not supported/i);
  });

  test("unbalanced double quote throws", () => {
    expect(() => tokenize('issue create -t "My title')).toThrow(/quote/i);
  });

  test("unbalanced single quote throws", () => {
    expect(() => tokenize("issue create -t 'My title")).toThrow(/quote/i);
  });

  test("shell variable reference throws", () => {
    expect(() => tokenize('issue create -t "$TITLE"')).toThrow(/variable/i);
  });

  test("shell variable without quotes throws", () => {
    expect(() => tokenize("issue list $REPO")).toThrow(/variable/i);
  });
});

describe("tokenize - acceptance criteria", () => {
  test("6 tokens for issue create with title and body", () => {
    const tokens = tokenize('issue create -t "Title with spaces" -b "Body with spaces"');
    expect(tokens).toEqual(["issue", "create", "-t", "Title with spaces", "-b", "Body with spaces"]);
    expect(tokens).toHaveLength(6);
  });
});
