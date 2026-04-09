---
name: hermes
description: "General-purpose agentic AI powered by NousResearch Hermes 3. Excels at complex reasoning, structured JSON output, multi-step function calling, and instruction-following tasks that require long-context precision. Trigger keywords: 'hermes', 'reason through', 'function call', 'structured output', 'tool use', 'step by step', 'multi-step', 'complex task'."
---

# hermes

General-purpose powerhouse built on **NousResearch Hermes 3** (Llama 3.1 405B).  
Best-in-class instruction following, native function calling, and structured JSON output.

## Usage

```
zeroclaw agent --agent hermes -m "reason through the best database schema for a multi-tenant SaaS"
zeroclaw agent --agent hermes -m "call the GitHub API to list my open PRs and summarise them"
zeroclaw agent --agent hermes -m "extract structured JSON from this support ticket: <ticket>"
zeroclaw agent --agent hermes -m "plan a 5-step refactor of this codebase to add hexagonal architecture"
@ZeroClaw hermes --task "walk me step by step through deploying a Rust service to Fly.io"
@ZeroClaw hermes --json-schema '{"name":"string","score":"int"}' --input "rank these three candidates: ..."
```

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--task` / `-m` | The instruction or task (required) | — |
| `--model` | Override Hermes variant (see Models below) | `hermes-3-llama-3.1-405b` |
| `--json-schema` | Force structured JSON output matching a schema | — |
| `--tools` | Comma-separated tool list to enable | all allowed |
| `--max-steps` | Maximum agentic iterations | 20 |
| `--context` | Path to a file whose content is injected as context | — |

## Models

| Alias | OpenRouter model ID | Notes |
|-------|---------------------|-------|
| `hermes-3-405b` *(default)* | `nousresearch/hermes-3-llama-3.1-405b` | Maximum capability |
| `hermes-3-70b` | `nousresearch/hermes-3-llama-3.1-70b` | Faster, cheaper |
| `hermes-2-pro` | `nousresearch/hermes-2-pro-mistral-7b` | Lightweight, fast |

Switch model with `--model hermes-3-70b`.

## What It Does

Hermes 3 is NousResearch's flagship instruction-tuned model, built for:

1. **Complex Reasoning** — multi-hop logic, analogical reasoning, long-form planning.
2. **Native Function Calling** — uses the Hermes XML tool-call format for reliable tool use.
3. **Structured Output** — generates schema-compliant JSON without hallucinating fields.
4. **Long Context** — 128k context window; ideal for large codebases or document Q&A.
5. **Agentic Loops** — self-directs multi-step tasks with read/edit/exec/search tools.

## Output Modes

### Default (conversational)
Hermes answers in clear, structured markdown with reasoning visible.

### Structured JSON (`--json-schema`)
```bash
zeroclaw agent --agent hermes \
  --json-schema '{"title":"string","priority":"low|medium|high","tags":["string"]}' \
  -m "categorise this issue: the login button breaks on Safari iOS 17"
```
Output:
```json
{
  "title": "Login button broken on Safari iOS 17",
  "priority": "high",
  "tags": ["bug", "safari", "ios", "auth"]
}
```

### Function Calling
Hermes natively emits `<tool_call>` blocks in the Hermes-function-calling format,
which ZeroClaw intercepts and executes automatically.

## Example Workflows

### Multi-step code planning
```bash
zeroclaw agent --agent hermes \
  -m "audit src/ for N+1 queries, list each location, then propose fixes" \
  --max-steps 15
```

### Document Q&A with context injection
```bash
zeroclaw agent --agent hermes \
  --context ./docs/architecture.md \
  -m "which services would be affected by removing the Redis cache layer?"
```

### API orchestration
```bash
zeroclaw agent --agent hermes \
  -m "use the GitHub API to find my 5 most-starred repos and generate a Twitter thread about them"
```

## Philosophy

Hermes was built by NousResearch to push the frontier of open-weight instruction following.
It combines the raw capability of Llama 3.1 405B with fine-tuning specifically designed
for agentic tool use, structured output, and precise instruction adherence — making it
the right choice whenever you need a reliable, reasoned, controllable AI agent.
