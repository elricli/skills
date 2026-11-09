# elricli/skills

Personal engineering skills for Claude Code, Codex, and other Agent Skills
harnesses. Stuff I actually use daily — install once, use everywhere.

Inspired by [poteto's pstack](https://github.com/cursor/plugins/tree/main/pstack),
with adaptations for my own workflow.

## Install

**Claude Code**

```
/plugin marketplace add elricli/skills
/plugin install elricli-skills@elricli
```

**Codex**

```sh
codex plugin marketplace add elricli/skills
codex plugin add elricli-skills@elricli
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
| `statechart` | Write TLA+ spec, verify with TLC model checker, render as Mermaid | pstack |
| `tdd` | Test-driven development workflow | pstack |
| `prototype` | Build throwaway prototype to settle design decisions | pstack |

More land here as I build them.

## Layout

```
skills/   all skills, flat structure
```
