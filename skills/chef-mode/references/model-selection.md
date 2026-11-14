# Model selection

Use this policy for every delegated role. No model configuration file is needed or read.

## Discover before selecting

1. Honor a model or Agent explicitly selected by the user. Otherwise keep the current Agent/provider.
2. Read the models and options exposed by the current harness through its supported capability tool or subagent-tool documentation. Use that session's discovery result; refresh only when the harness permits or requires it. In T3, use `orchestrator_capabilities` before the first `delegate_task`, then reuse its result. Do not launch another Agent or CLI just to discover models.
3. Keep only models the current Agent/provider can actually use for child tasks. A catalog entry for a disabled provider, or for another Agent's driver, is not a model available through the current Agent. Changing the model and changing the Agent/provider are separate choices. Cross-Agent delegation requires an explicit user instruction.
4. Select a supported model for the role using the recommendations below. Take model IDs and option names from the live catalog; do not invent version, effort, or speed suffixes.
5. If discovery is unavailable, lists no usable models, or the subagent tool cannot select a model, inherit the parent model and settings. Omit model and provider overrides when the harness supports inheritance. If no subagent tool exists, do the work inline and report the limitation.

If a selected model is unavailable or a call rejects it, report that result and follow the harness's failure rules. Do not substitute an unrequested Agent or CLI. An unavailable model explicitly requested by the user stays unavailable; do not silently replace it.

Do not search for or import another pack's model rules. This pack uses runtime capabilities and the user's task instructions.

## Role recommendations

These are preferences among available models, never fixed requirements or fallback IDs.

| Role | Recommendation |
| --- | --- |
| Code, exploration, tooling, verification | Prefer a model suited to code and tool use. For routine work, favor lower latency when the catalog documents that tradeoff. Grok code models are candidates when the current Agent offers them. |
| Explanation, synthesis, prose, judgment | Prefer a model suited to reasoning and writing. Claude Opus models are candidates when the current Agent offers them. |
| Difficult design, concurrency, algorithms | Prefer the current Agent's strongest suitable reasoning or coding model. |
| Competing designs or independent review | Prefer distinct available models, and distinct model families when the current Agent offers them. With one usable model, use independent briefs on that model and report the lack of model diversity. |

Keep reasoning and speed settings within the options the selected model exposes. Preserve inherited settings unless the task warrants a supported adjustment. A recommendation never authorizes changing the Agent/provider.
