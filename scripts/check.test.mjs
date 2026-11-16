import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const checker = fileURLToPath(new URL("./check.mjs", import.meta.url));
const skill = (policy, body = "") =>
  ["---", "name: example", "description: Example skill.", policy, "---", "", body].join("\n");

function check(t, content) {
  const root = mkdtempSync(join(tmpdir(), "skills-check-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const dir of ["skills/example", "skills/other", ".claude-plugin", ".codex-plugin"]) {
    mkdirSync(join(root, dir), { recursive: true });
  }
  writeFileSync(join(root, "skills/example/SKILL.md"), content);
  writeFileSync(
    join(root, "skills/other/SKILL.md"),
    skill("disable-model-invocation: true").replace("name: example", "name: other"),
  );
  for (const dir of [".claude-plugin", ".codex-plugin"]) {
    writeFileSync(join(root, dir, "plugin.json"), JSON.stringify({ skills: "./skills/" }));
  }
  writeFileSync(join(root, "README.md"), "| \u0060example\u0060 |\n| \u0060other\u0060 |\n");
  return spawnSync(process.execPath, [checker], { cwd: root, encoding: "utf8" });
}

for (const [name, content] of [
  ["a literal true value", skill("disable-model-invocation: true")],
  ["a double-quoted key", skill('"disable-model-invocation": true')],
  ["a single-quoted key", skill("'disable-model-invocation': true")],
  ["whitespace and an inline comment", skill("disable-model-invocation:\ttrue  # Explicit invocation.")],
  ["CRLF frontmatter", skill("disable-model-invocation: true").replaceAll("\n", "\r\n")],
  [
    "inline delimiter text in a description",
    skill("disable-model-invocation: true").replace("Example skill.", "Explain --- markers."),
  ],
  [
    "a body example that differs from the actual policy",
    skill("disable-model-invocation: true", "disable-model-invocation: false"),
  ],
]) {
  test("accepts " + name, (t) => {
    const result = check(t, content);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(result.stderr, "");
  });
}

for (const [name, policy, body = ""] of [
  ["a missing policy", ""],
  ["false", "disable-model-invocation: false"],
  ["a double-quoted string", 'disable-model-invocation: "true"'],
  ["a single-quoted string", "disable-model-invocation: 'true'"],
  ["null", "disable-model-invocation: null"],
  ["an empty value", "disable-model-invocation:"],
  ["a number", "disable-model-invocation: 1"],
  ["a nested field", "metadata:\n  disable-model-invocation: true"],
  ["duplicate true fields", "disable-model-invocation: true\ndisable-model-invocation: true"],
  ["conflicting duplicate fields", "disable-model-invocation: true\ndisable-model-invocation: false"],
  ["a quoted duplicate after true", "disable-model-invocation: true\n'disable-model-invocation': false"],
  ["a quoted duplicate before true", '"disable-model-invocation": false\ndisable-model-invocation: true'],
  ["a policy only in the body", "", "disable-model-invocation: true"],
  ["false masked by a body example", "disable-model-invocation: false", "disable-model-invocation: true"],
]) {
  test("rejects " + name + " and identifies the field to fix", (t) => {
    const result = check(t, skill(policy, body));
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, /skills\/example\/SKILL\.md/);
    assert.match(result.stderr, /disable-model-invocation: true/);
  });
}

test("rejects a policy in a document section instead of opening frontmatter", (t) => {
  const result = check(t, "# Example\n\n" + skill("disable-model-invocation: true"));
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, /skills\/example\/SKILL\.md/);
  assert.match(result.stderr, /disable-model-invocation: true/);
});
