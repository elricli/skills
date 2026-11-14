---
name: elric-help
description: Guides users through this skills pack, /chef-mode, and picking the skill, playbook, or principle for a task. Type /elric-help with a question.
disable-model-invocation: true
---

# Elric help

Answer the user's question about this skills pack, hand them a prompt they can send, and link the file the answer came from. For a help question, don't start the work. The user asked how, and a full run spends real tokens, so let them send the prompt.

A message that asks for work, such as "use chef-mode to fix this bug", is not a help question. Read [`chef-mode`](../chef-mode/SKILL.md), do the work under it, and mention once that starting each new task with `/chef-mode` keeps the rigor on.

This file maps questions to the skills that hold the answers. Those files own the details. Read the file you route to before you quote it, and trust it when it disagrees with this map. Link files by their public copy: `https://github.com/elricli/skills/blob/main/skills/` followed by the skill's path.

## Find out what they need

Infer the need from the message and the conversation. A named situation, such as "which skill reviews a PR?", goes straight to its section. If the need is still unclear, ask one multiple-choice question with these options, then answer only the section they pick:

- Get set up
- Start a task with `/chef-mode`
- Pick a skill for a situation
- Fix a run that went wrong
- Make this pack my own

Check the state that changes the answer, and mention it only when it does:

- No usable model discovery or model-selection capability means helpers inherit the parent model and settings. No model configuration file is needed; the shared policy is in [`model selection`](../chef-mode/references/model-selection.md).
- No `verify-*` skill or other app harness in the project means agents have no scripted way to drive the app. Mention `/create-verification-skill` when the question is about proving a change works.
- No formal verification skill in the project means no property is checked past what tests reach. Mention `/create-formal-verification-skill` when the question is about a race, an invariant, or another case tests rarely hit. When one exists and the code it covers changed after the commit it records as last in sync, mention `/maintain-formal-verification-skill` if the question touches that code.

When model discovery is unavailable and it matters, explain that helpers inherit the parent model and settings. Do not ask the user to create a model configuration file.

## Get set up

1. Install from the elricli/skills marketplace: in Claude Code run `/plugin marketplace add elricli/skills` then `/plugin install elricli@elricli`. Commands may take an `elricli:` prefix, such as `/elricli:chef-mode`. In Codex run `codex plugin marketplace add elricli/skills` then `codex plugin add elricli@elricli`. Other Agent Skills harnesses: `npx skills add elricli/skills`.
2. No model setup is needed. Helpers discover models supported by the current Agent and choose for their role. If discovery or model selection is unavailable, they inherit the parent model and settings. The user can explicitly name a model for a task.
3. Start a real task with `/chef-mode`, a goal, and a check that can pass or fail.
4. Optional: give agents a scripted way to drive the app. Offer `/create-verification-skill` once if the project has no verification harness; offer `/create-formal-verification-skill` when the code has concurrency, retries, a state machine, or a parser.

Installing changes nothing until the user invokes a skill. This pack reads no model configuration files. Model recommendations do not select another Agent/provider.

If cost is the worry, say where the tokens go and how to spend fewer. This pack spends extra tokens on subagents and review panels. The user can request a cheaper supported model, inherited settings, or fewer candidates. Save `/chef-mode` for work that needs rigor.

Not every harness spawns subagents or registers slash commands. The skills degrade gracefully: a skill that would fan out says so, and any skill can always be run by reading its `SKILL.md` and following it in the main thread.

## Start a task with `/chef-mode`

`/chef-mode` matches the task to a playbook, copies the playbook's steps into the todo list, and runs the other skills as the steps need them. A step it skips stays in the list as `skip: <reason>`. A good prompt states the goal and how to tell it's done. It doesn't list skills, because a hand-written sequence tends to drop or reorder steps the playbook would keep. Read [`references/prompting.md`](references/prompting.md) before you help word one.

Whether `/chef-mode` stays on depends on the harness. Some editors offer a custom-mode toggle that pins a skill into every turn. Elsewhere, start each new task with `/chef-mode`. Mid-chat, "new task" makes the mode match a fresh playbook. `/chef-mode` already uses `elric-agent` for the subagents its playbook steps spawn. To get the same style from a subagent of your own, spawn it with `subagent_type: "elric-agent"` where the harness supports named agent types.

## Pick a skill

The default answer is `/chef-mode`, which runs most of the others when its steps need them. Name a skill directly when the user wants more or less of something than the playbook gives. Read the skill before you recommend it, and give one example prompt.

| The user wants to | Skill |
|---|---|
| Do any non-trivial task with rigor | [`/chef-mode`](../chef-mode/SKILL.md) |
| Check that the agent understood their goal and the problem before it starts | [`/in-your-own-words`](../in-your-own-words/SKILL.md) |
| Get a prompt rewritten deeper, not bigger, before sending it: what a top professional would add, their raw material and methods, and an outside check. It returns the prompt and doesn't do the task | [`/sharpen`](../sharpen/SKILL.md) |
| Know how code works now, or where new code should live | [`/how`](../how/SKILL.md) |
| Know why code is shaped this way, or where a number came from | [`/why`](../why/SKILL.md) |
| Understand a change or subsystem, explained plainly | [`/teach`](../teach/SKILL.md) |
| Know what a small diff could break outside itself | [`/blast-radius`](../blast-radius/SKILL.md) |
| Settle types and module shape before code that crosses a function boundary | [`/architect`](../architect/SKILL.md) |
| Get several attempts at one brief, merged into the best one | [`/arena`](../arena/SKILL.md) |
| Run parallel checks over slices, or race workers | [`/swarm`](../swarm/SKILL.md) |
| Have independent reviewers try to break a diff, using different available models when possible | [`/interrogate`](../interrogate/SKILL.md) |
| Fix a bug test-first when a cheap local test exists | [`/tdd`](../tdd/SKILL.md) |
| Apply TypeScript rules to `.ts` or `.tsx` work | [`/typescript-best-practices`](../typescript-best-practices/SKILL.md) |
| Strip comments before review, using a reviewer that didn't write them | [`/no-comments`](../no-comments/SKILL.md) |
| Clean AI tells out of prose | [`/unslop`](../unslop/SKILL.md) |
| Write docs, an RFC, a README, a PR description, or a commit message to a standard | [`/technical-writing`](../technical-writing/SKILL.md) |
| Hear the last reply again in plain words | [`/bro`](../bro/SKILL.md) |
| Give agents a scripted way to drive the app and prove behavior | [`/create-verification-skill`](../create-verification-skill/SKILL.md) |
| Bring a verification skill and its feature map back in line with the app | [`/maintain-verification-skill`](../maintain-verification-skill/SKILL.md) |
| Formally verify a race, invariant, or other property that tests rarely reach | [`/create-formal-verification-skill`](../create-formal-verification-skill/SKILL.md) |
| Bring a formal verification back in line after the code it covers changed, and learn whether a failure is drift or a bug | [`/maintain-formal-verification-skill`](../maintain-formal-verification-skill/SKILL.md) |
| Show a PM or designer what the user sees as a chart checked by a TLA+ model, with the shortest path to each state that breaks a rule | [`/statechart`](../statechart/SKILL.md) |
| Vet a performance number before reporting or acting on it | [`/benchmark-checklist`](../benchmark-checklist/SKILL.md) |
| Run a large or cross-cutting change, or one to review after stepping away | [`/figure-it-out`](../figure-it-out/SKILL.md) |
| Keep a decision log during a run, and review it afterward | [`/show-me-your-work`](../show-me-your-work/SKILL.md) |
| Turn what a finished task taught into skill edits | [`/reflect`](../reflect/SKILL.md) |
| Turn their own working habits into a personal mode skill | [`/automate-me`](../automate-me/SKILL.md) |
| Rebuild context across their own recent chats before resuming work | [`/recall`](../recall/SKILL.md) |
| Stop agents from repeating the same mistakes in this repo | [`/correct`](../correct/SKILL.md) |
| Catch up on what changed in this chat since their last message | [`/ketchup`](../ketchup/SKILL.md) |
| Find their way around this pack | `/elric-help` |

If a skill directory next to this one is missing from the table, read its frontmatter and route by its description. The `principle-*` directories are covered under principles below.

Close calls:

- `/how` explains what the code does. `/why` explains the reasons. `/teach` runs one or both and explains the result plainly.
- `/arena` gives every worker the same brief and merges the best parts. `/swarm` splits work into slices or a race and returns one report.
- `/architect` implements right after it settles the design. Add "with checkpoint" to review the design before it writes code.
- `/interrogate` reviews the diff. `/blast-radius` looks for breakage outside the diff and proves the one fact that makes the change safe.
- `/ketchup` covers only this chat since the user's last message. Resuming one specific chat or branch is the Session pickup playbook.
- `/figure-it-out` designs one rigorous run. The Orchestrate playbook runs a program that spans days and many PRs. The Autonomous run playbook drives one task to a finish condition.

Not in this pack:

- pstack's `make-bot-ui` and `ketchup-video` were left out of this port. `ketchup` covers the same content as text.
- `/deslop`, `control-cli`, and `control-ui` ship in Cursor's `cursor-team-kit` plugin, not here.
- Orchestrate is an `/chef-mode` playbook, not a skill. If the slash menu shows `/orchestrate`, another plugin provides it.

## Playbooks and principles

Playbooks are step lists inside `/chef-mode`, not skills, so they have no slash command. Inside `/chef-mode`, describing the task picks one, and these phrases name one directly:

- "babysit this pr" or "check on pr 123" runs Babysit. It drives the PR to merge-ready and stops there. It doesn't merge unless the user asks to merge, land, or ship.
- "land the stack" runs Shipping.
- "take over this branch" runs Session pickup.
- "pause safely" runs Pause safely.
- "full autopilot on this queue" runs Autopilot-full. "autopilot, don't merge" runs Autopilot-stack.
- "run the eval playbook" runs Eval.

The Playbooks section of [`chef-mode`](../chef-mode/SKILL.md) lists every playbook and when it applies.

This pack ships no planning skill. For work that spans phases or stacked PRs, asking `/chef-mode` for a plan runs the [Multi-phase plan playbook](../chef-mode/playbooks/multi-phase-plan.md), which writes the plan and doesn't implement it. For a design question, the Prototype playbook or `/architect` settles it in code first.

Principles are one-rule skills that `/chef-mode` reads and cites in its replies. The user rarely invokes one. They steer with the names instead, as in "apply prove it works. show me the real output." Typing `/principle-<name>` still loads one on demand.

## Fix a run that went wrong

| Symptom | Fix |
|---|---|
| The mode stopped applying after a few turns | Re-attach it, or start each task with `/chef-mode`. |
| A question got treated as the next step of the last task | Say "new task", or say the turn doesn't need the mode. |
| A requested model was not used | Check the current Agent's model catalog and whether its subagent tool supports selection. An unavailable requested model must be reported. |
| Runs cost more than expected | See the cost paragraph under Get set up. |
| A skill didn't load on its own | Skills here don't self-trigger by design. The user types them or `/chef-mode` routes to them. |
| Parallel agents overwrote each other | Give each agent its own worktree. |
| An overnight run moved but finished nothing | The loop needs a check that can pass or fail, not a duration. |
| The reply claims success from a green build | Ask for the real command, flow, stored value, or profile. That's the prove-it-works principle. |

For a run that drifts, [`references/prompting.md`](references/prompting.md) has one-line steers.

## Make this pack my own

- [`/automate-me`](../automate-me/SKILL.md) drafts a personal mode skill from the user's own history, to use alongside `/chef-mode`.
- [`/reflect`](../reflect/SKILL.md) after a session turns its lessons into skill edits the user approves.
- `/chef-mode write a skill for <workflow>` runs the authoring playbook. The eval playbook tests a skill change blind.
- Fix a misbehaving skill in its own PR, not inside the feature work where it went wrong.

## Reply

Lead with the answer. Give at most one example prompt in a code block, adapted from [`references/recipes.md`](references/recipes.md) when one fits, then the link to that file. Keep it short unless the user asked for the whole map.
