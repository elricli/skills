# Agent rules

Each rule pairs with what enforces it. When a correction repeats, fix the
mistake here and add the rule. Drop a rule once its mistake cannot happen.

| Rule | Enforced by |
| --- | --- |
| The skills/ directory is the only skill list; never hand-list skills in a manifest | `scripts/check.mjs` (fails on a hand-listed `"skills"` array in either plugin manifest) |
| Every skill dir has a `SKILL.md` with a `name:` frontmatter field | `scripts/check.mjs` |
| Every skill sets the top-level literal `disable-model-invocation: true` exactly once in its opening YAML frontmatter | `scripts/check.mjs`; `node --test scripts/check.test.mjs` covers missing, false, string, duplicate, nested, and body-only values |
| README "What's inside" table lists exactly the skills on disk | `scripts/check.mjs` |
| Marketplace copy must not advertise skills that do not exist | manual — `check.mjs` cannot parse prose; keep skill names in it only via the table |
| New skills land as `skills/<name>/SKILL.md` and get a README table row in the same commit | `scripts/check.mjs` catches the missing row |
| Run the repository checks below before committing policy, manifest, README, or checker changes | this table; CI does not exist yet |
| Model choices use runtime discovery and recommendations; do not restore model rule files or fixed model fallbacks | `scripts/check.mjs` flags retired rule-file references and hardcoded Claude/Grok defaults |

## pstack updates

A request to update pstack authorizes porting compatible changes under these
rules. Commit and push when the user requests them.

The upstream is [cursor/plugins, pstack/](https://github.com/cursor/plugins/tree/main/pstack).
Read the imported version and full commit SHA from [README.md](README.md).
Do not duplicate the baseline version or SHA in this file.

Preserve these port boundaries unless the user changes the scope:

- Exclude `make-bot-ui`, `ketchup-video`, `automations/benny/`, and `setup-pstack`.
- Keep the PR playbooks' portable `gh` paths instead of Origin/Bugbot integrations.
  Adapt changed Cursor-specific tools to the current Agent's supported tools.
- Keep [runtime model selection](skills/chef-mode/references/model-selection.md).
  Skip upstream fixed model defaults and model-configuration rules.
- Preserve local prototype adaptations, supported frontmatter fields, and plugin
  identity. Do not overwrite this plugin's manifests with upstream manifests.

Retain the local names in paths, frontmatter, prompts, and references:

| Upstream | Local |
| --- | --- |
| `poteto-mode` | `chef-mode` |
| `poteto-help` | `elric-help` |
| `poteto-agent` | `elric-agent` |

For each update:

1. Find and pin the latest upstream commit touching `pstack/`. Compare
   `pstack/` at the README baseline with that target. Port file changes instead
   of merging the upstream repository's unrelated plugin history.
2. Port compatible changes and assess new skills against the boundaries above.
   Keep `disable-model-invocation: true` on every skill. Update affected agents,
   playbooks, callers, references, tests, and README entries together. Delete
   obsolete references after updating their callers.
3. Run the checks below and tests for changed executable code. Inspect the final
   diff for lost local adaptations and stale references.
4. Once all in-scope changes are handled, update README's upstream version,
   commit link, and date. Report the imported and skipped changes and validation
   results. Distinguish unavailable checks from passes.

Stay on the worktree's current branch. Create or switch a feature branch only
with explicit user authorization. Before merging or pushing, inspect the outgoing
commit range and stop if it contains unrelated history. Keep unrelated working
tree changes out of the update.

## Verification

Run from the repository root:

```sh
node scripts/check.mjs
node --test scripts/check.test.mjs
git diff --check
```

- For statechart code changes, install its locked dependencies and run `npm test`
  in `skills/statechart/scripts`. Set `TLA2TOOLS` to the TLC jar and `JAVA` to a
  working Java binary as documented in [statechart](skills/statechart/SKILL.md).
  TLC tests skipped for missing tools do not count as verified. On macOS, use
  `TMPDIR=/private/tmp` for the test run to avoid relative-symlink failures under
  the `/var` temporary-directory alias.
- For chef-mode tooling changes, run `bun test watch-pr check-plan.test.ts` and
  `bun run typecheck` in `skills/chef-mode/scripts` with its locked dependencies.
- Check relative links and references affected by moved or deleted files.
