# Agent rules

Each rule pairs with what enforces it. When a correction repeats, fix the
mistake here and add the rule. Drop a rule once its mistake cannot happen.

| Rule | Enforced by |
| --- | --- |
| The skills/ directory is the only skill list; never hand-list skills in a manifest | `scripts/check.mjs` (fails on a hand-listed `"skills"` array in either plugin manifest) |
| Every skill dir has a `SKILL.md` with a `name:` frontmatter field | `scripts/check.mjs` |
| README "What's inside" table lists exactly the skills on disk | `scripts/check.mjs` |
| Marketplace copy must not advertise skills that do not exist | manual — `check.mjs` cannot parse prose; keep skill names in it only via the table |
| New skills land as `skills/<name>/SKILL.md` and get a README table row in the same commit | `scripts/check.mjs` catches the missing row |
| Run `node scripts/check.mjs` before committing manifest or README changes | this table; CI does not exist yet |
