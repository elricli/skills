#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";

const files = [".claude-plugin/plugin.json", ".codex-plugin/plugin.json"];
const sources = files.map((file) => readFileSync(file, "utf8"));
const versions = sources.map((source) => JSON.parse(source).version);
if (!/^\d+\.\d+\.\d+$/.test(versions[0] ?? "") || versions[0] !== versions[1]) {
  throw new Error("Plugin versions must be valid and equal before bumping");
}
const [major, minor, patch] = versions[0].split(".").map(Number);
const next = `${major}.${minor}.${patch + 1}`;
for (const [index, file] of files.entries()) {
  const doc = JSON.parse(sources[index]);
  doc.version = next;
  writeFileSync(file, JSON.stringify(doc, null, 2) + "\n");
}
console.log(`Plugin versions: ${versions[0]} → ${next}`);
