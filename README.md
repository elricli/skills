# elricli/skills

Personal engineering skills for Claude Code, Codex, and other Agent Skills
harnesses. Stuff I actually use daily — install once, use everywhere.

Mostly a port of [poteto's pstack](https://github.com/cursor/plugins/tree/main/pstack)
(MIT), with the Cursor-specific parts removed and my own adaptations. The
upstream design: `chef-mode` is the single entry point, it routes 23 playbooks
and the tactical skills as its steps need them, and 24 one-rule principle
skills form a vocabulary you can steer with mid-task ("apply prove it works").
Skills are tagged `disable-model-invocation`, so nothing self-triggers — the
entry point routes, or you type the skill.

Left upstream behind: `make-bot-ui`, `ketchup-video`, the benny automation
pack, and the Origin/Bugbot branches of the PR playbooks (rewritten around
`gh`). `poteto-mode` →
`chef-mode`; agents live in `agents/`.

## Install

**Claude Code**

```
/plugin marketplace add elricli/skills
/plugin install elricli@elricli
```

**Codex**

```sh
codex plugin marketplace add elricli/skills
codex plugin add elricli@elricli
```

**pi / opencode / other harnesses**

```sh
npx skills add elricli/skills
```

`npx skills` auto-detects which harnesses you have and installs the skills
there. To install only for a specific agent:

```sh
npx skills add elricli/skills --agent claude-code
npx skills add elricli/skills --agent pi
npx skills add elricli/skills --agent opencode
```

## What's inside

| Skill | What it does | Source |
| --- | --- | --- |
| `automate-me` | Mine your transcripts, draft a personal `-mode` skill in your style | pstack (ported) |
| `architect` | Sketch types and module shape before code, via parallel design exploration | pstack (ported) |
| `arena` | N parallel candidates at one task, pick a base, graft the best of the rest | pstack (ported) |
| `benchmark-checklist` | Vet a measured number before you report or act on it | pstack (ported) |
| `blast-radius` | What a small diff could break, with the safety fact proven by running code | pstack (ported) |
| `bro` | Restate the last message in plain human language, no jargon | pstack (ported) |
| `chef-mode` | The entry point: matches the task to a playbook, routes the other skills | pstack (ported) |
| `correct` | Mine repeated corrections, fix each at the highest level that works | pstack (ported) |
| `create-formal-verification-skill` | Prove one property with the tool that fits; generate a project skill to recheck it | pstack (ported) |
| `create-verification-skill` | Generate a project-local skill that drives the app and proves behavior | pstack (ported) |
| `elric-help` | Find the right skill, playbook, or principle; answers only, starts nothing | pstack (ported) |
| `figure-it-out` | Design a bespoke, auditable playbook when no bundled one fits | pstack (ported) |
| `how` | Walkthrough of how a subsystem works; placement and layering questions | pstack (ported) |
| `in-your-own-words` | Play back the goal and problem before starting | pstack (ported) |
| `interrogate` | Adversaries try to break a diff; only findings proven by a run survive | pstack (ported) |
| `ketchup` | What changed in this chat since your last message, every open call listed | pstack (ported) |
| `maintain-formal-verification-skill` | Re-sync formal verification after the code it covers changed | pstack (ported) |
| `maintain-verification-skill` | Re-sync a verification skill whose feature map drifted from the app | pstack (ported) |
| `no-comments` | Strip comments before review via the Comment Sicko reviewer | pstack (ported) |
| `prototype` | UI wireframes and product flows as multiple page artboards on one navigable canvas | pstack (adapted) |
| `recall` | Rebuild your recent working context from chat history and the shared record | pstack (ported) |
| `reflect` | Mine the transcript with three reviewers; route learnings into skill edits | pstack (ported) |
| `sharpen` | Rewrite a prompt deeper, not bigger, before you send it | pstack (ported) |
| `show-me-your-work` | A decision log a human can audit after stepping away | pstack (ported) |
| `statechart` | TLA+ model check, rendered as a Mermaid statechart with bad states marked | pstack (ported) |
| `swarm` | N parallel workers across slices, drained into one report | pstack (ported) |
| `tdd` | Failing test first, then the fix, when a cheap local test path exists | pstack (ported) |
| `teach` | Actually understand a change: runs how + why, weaves one plain explanation | pstack (ported) |
| `technical-writing` | Diátaxis + Google style + STE + Global English for docs and PR text | pstack (ported) |
| `typescript-best-practices` | Type-system-discipline principle grounded in TypeScript syntax | pstack (ported) |
| `unslop` | Cut AI tells from any writing | pstack (ported) |
| `why` | Why code is shaped this way: parallel evidence search, cited and confidence-rated | pstack (ported) |

| `principle-attack-the-premise` | Two fixes sharing a premise failed: test the premise, not a third fix | pstack (ported) |
| `principle-boundary-discipline` | Guards at system boundaries; trust internal types | pstack (ported) |
| `principle-build-the-lever` | Build the tool that does or proves the work; the reviewer reruns it | pstack (ported) |
| `principle-encode-lessons-in-structure` | Same instruction twice: make it a lint or script, not more text | pstack (ported) |
| `principle-exhaust-the-design-space` | 2-3 competing prototypes before committing | pstack (ported) |
| `principle-experience-first` | User delight over implementation convenience | pstack (ported) |
| `principle-explain-the-number` | Name the limiter before you trust or report a number | pstack (ported) |
| `principle-fix-root-causes` | Trace symptoms to the first place the system went wrong | pstack (ported) |
| `principle-foundational-thinking` | Core data structures first, so downstream code becomes obvious | pstack (ported) |
| `principle-guard-the-context-window` | Bulk to subagents; summaries stay in the main thread | pstack (ported) |
| `principle-laziness-protocol` | Bias to deletion and the smallest change that solves the problem | pstack (ported) |
| `principle-make-operations-idempotent` | Converge to the same end state despite crashes and retries | pstack (ported) |
| `principle-migrate-callers-then-delete-legacy-apis` | Migrate callers and delete the old API in one wave | pstack (ported) |
| `principle-minimize-reader-load` | Count layers and hidden state; collapse one-caller wrappers | pstack (ported) |
| `principle-model-the-domain` | Encode the domain in a structure, not scattered conditionals | pstack (ported) |
| `principle-never-block-on-the-human` | Proceed on reversible work; let the human course-correct after | pstack (ported) |
| `principle-outcome-oriented-execution` | Converge on the target design; no throwaway compatibility states | pstack (ported) |
| `principle-prove-it-works` | Verify the real artifact, never a proxy or self-report | pstack (ported) |
| `principle-redesign-from-first-principles` | Integrate a new requirement as if it had been there from day one | pstack (ported) |
| `principle-separate-before-serializing-shared-state` | Eliminate the sharing before adding coordination | pstack (ported) |
| `principle-sequence-verifiable-units` | Small units, each ending in a check, verified before the next | pstack (ported) |
| `principle-subtract-before-you-add` | Remove dead weight first, then build on the simpler base | pstack (ported) |
| `principle-test-behavior-not-implementation` | Assert what users observe, so tests survive refactors | pstack (ported) |
| `principle-type-system-discipline` | Make illegal states unrepresentable | pstack (ported) |

Agents in `agents/` (not skills): `elric-agent`, the subagent shell for
`chef-mode`; `comment-sicko`, the comment reviewer.

More land here as I build them.

## Model roles

Skills that delegate work discover the models supported by the current Agent.
They choose a suitable model for each role from that live catalog. If discovery
or model selection is unavailable, helpers inherit the parent model and settings.
No model configuration file is required or read.

Claude Opus for explanation and judgment, and Grok code models for implementation
and tooling, are recommendations when the current Agent offers them. Other
available models can fill the same roles. These recommendations do not select
another Agent or CLI. Cross-Agent delegation requires an explicit user instruction.

The shared [model selection policy](skills/chef-mode/references/model-selection.md)
owns discovery, role recommendations, option handling, and inheritance. A model
explicitly selected by the user takes precedence over recommendations.

## Layout

```
skills/   all skills, flat structure
agents/   subagent definitions (elric-agent, comment-sicko)
```
