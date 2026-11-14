#!/usr/bin/env node
// One source of truth: skills/ on disk. Everything that lists skills must match it.
//
// Rules:
//   - every skills/<dir>/ has a SKILL.md with a `name:` frontmatter field
//   - .claude-plugin/plugin.json "skills" == the skills dir (auto-discovered, no hand list)
//   - .codex-plugin/plugin.json "skills" == the skills dir
//   - README "What's inside" table lists exactly the skills on disk
//   - model instructions do not restore model rule files or fixed model fallbacks
//
// Run: node scripts/check.mjs   (exit 1 with a listing on any drift)

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const errors = [];

const skillDirs = readdirSync("skills", { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

// each skill dir has a SKILL.md with a name
for (const dir of skillDirs) {
  const path = join("skills", dir, "SKILL.md");
  if (!existsSync(path)) {
    errors.push(`skills/${dir}/ has no SKILL.md`);
    continue;
  }
  const frontmatter = readFileSync(path, "utf8").split("---")[1] ?? "";
  if (!/^name:\s*\S+/m.test(frontmatter)) {
    errors.push(`skills/${dir}/SKILL.md frontmatter has no "name:" field`);
  }
}

const readJson = (file) => {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    errors.push(`${file} is not valid JSON: ${e.message}`);
    return {};
  }
};

// both plugin manifests auto-discover the skills dir — never a hand-maintained array
for (const file of [".claude-plugin/plugin.json", ".codex-plugin/plugin.json"]) {
  const doc = readJson(file);
  if (Array.isArray(doc.skills)) {
    errors.push(`${file} "skills" is a hand-maintained array; use "./skills/" so it cannot drift from skills/`);
  } else if (doc.skills !== "./skills/") {
    errors.push(`${file} "skills" should be "./skills/" (auto-discover), got ${JSON.stringify(doc.skills)}`);
  }
}

// README "What's inside" table is the human-readable index and must match disk
const readme = readFileSync("README.md", "utf8");
const readmeSkills = [...readme.matchAll(/^\| `([a-z0-9-]+)` \|/gm)].map((m) => m[1]).sort();
if (JSON.stringify(readmeSkills) !== JSON.stringify(skillDirs)) {
  const missing = skillDirs.filter((d) => !readmeSkills.includes(d));
  const stale = readmeSkills.filter((n) => !skillDirs.includes(n));
  for (const m of missing) errors.push(`README "What's inside" table is missing skills/${m}/`);
  for (const s of stale) errors.push(`README "What's inside" table lists \`${s}\` which does not exist on disk`);
}

const markdownFiles = (root) => existsSync(root)
  ? readdirSync(root, { withFileTypes: true })
      .filter((entry) => entry.name !== "node_modules" && !entry.name.startsWith("."))
      .flatMap((entry) => {
        const file = join(root, entry.name);
        return entry.isDirectory() ? markdownFiles(file) : file.endsWith(".md") ? [file] : [];
      })
  : [];

const retiredModelConfig = /\b(?:role-line rule|(?:pstack|elric(?:-skills)?)-models\.md)\b/i;
const fixedModelFallback = /\b(?:defaults?|fallback)\b[^\n.]*`(?:claude|grok|cursor-grok|composer)-[^`]+`/i;
for (const file of ["README.md", ...markdownFiles("skills"), ...markdownFiles("agents")]) {
  const source = readFileSync(file, "utf8");
  if (retiredModelConfig.test(source)) {
    errors.push(`${file} references model rule files; discover models through the current Agent instead`);
  }
  if (fixedModelFallback.test(source)) {
    errors.push(`${file} sets a fixed model fallback; keep model choices as recommendations from runtime discovery`);
  }
}

if (errors.length > 0) {
  console.error("repository drift:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log(`ok: ${skillDirs.length} skills (${skillDirs.join(", ")}) consistent across manifests and README; model policy checked`);
