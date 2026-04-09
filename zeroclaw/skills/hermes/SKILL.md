---
name: hermes
description: "Multi-agent orchestration, task routing, and inter-agent messaging. Invoke when a goal requires multiple specialised agents working in sequence or parallel, when you need to fan out subtasks and merge results, or when you want a single high-level command to coordinate a full workflow. Trigger keywords: 'orchestrate', 'coordinate', 'pipeline', 'fan out', 'delegate', 'run all agents', 'workflow', 'chain', 'parallel tasks'."
---

# hermes

The messenger between agents. Decomposes complex goals, routes subtasks to the right specialists, and assembles the final result.

## Usage

```
@ZeroClaw hermes --goal "audit, fix, and document the src/ directory"
@ZeroClaw hermes --goal "research competitors then write a blog post on findings" --agents researcher,content-writer
@ZeroClaw hermes --plan "full release checklist for v2.0.0"
@ZeroClaw hermes --pipeline research,code,review,security --input "add OAuth2 to the API"
@ZeroClaw hermes --goal "weekly engineering digest" --cron "0 9 * * 1"
```

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--goal` | High-level objective to decompose and execute (required unless `--pipeline`) | — |
| `--agents` | Comma-separated list of agents to use | auto-selected |
| `--pipeline` | Explicit ordered pipeline of agent names | — |
| `--input` | Input text or file path passed to the first agent | — |
| `--plan` | Print the execution plan without running it | — |
| `--parallel` | Run independent steps concurrently | false |
| `--cron` | Schedule the workflow on a cron expression | — |
| `--output` | Destination file or channel for the final result | stdout |

## What It Does

1. **Decompose** — Breaks the goal into an ordered list of subtasks, each matched to the most capable agent.
2. **Route** — Dispatches each subtask to its agent via `zeroclaw agent --agent <name>`.
3. **Pass context** — Feeds the output of each step as input to the next (pipeline mode).
4. **Merge** — Collects all outputs and assembles a unified final result.
5. **Report** — Delivers a structured summary: steps taken, agents used, outputs produced, and any failures.

## Agent Selection Logic

Hermes picks agents automatically based on the goal keywords:

| Keyword in goal | Agent selected |
|-----------------|---------------|
| research, find, look up | `researcher` |
| write, implement, build, fix | `coder` |
| review, check quality | `code-reviewer` |
| audit, vulnerability, CVE | `security-scanner` |
| deploy, pipeline, infra | `devops` |
| analyse, metrics, data | `data-analyst` |
| blog, docs, copy, changelog | `content-writer` |

Override with `--agents` when you need a specific set.

## Example Pipelines

```bash
# Full "ship it" pipeline for a feature branch
@ZeroClaw hermes \
  --pipeline coder,code-reviewer,security-scanner,devops \
  --input "implement and ship the user-profile endpoint"

# Research-to-publish content workflow
@ZeroClaw hermes \
  --pipeline researcher,content-writer \
  --input "the rise of edge AI in 2026" \
  --output blog-post.md

# Weekly repo health digest
@ZeroClaw hermes \
  --goal "code-review open PRs, scan for new CVEs, summarise as a Slack digest" \
  --cron "0 9 * * 1"
```

## Output Format

```
📬 Hermes — Workflow Report
Goal: "audit, fix, and document src/"
Steps: 3 | Agents: coder, code-reviewer, content-writer | Duration: 4m 12s

── Step 1 · code-reviewer ──────────────────────────
CRITICAL: 0 | HIGH: 1 | MEDIUM: 3 | LOW: 5
Full report → CODE_REVIEW.md

── Step 2 · coder ──────────────────────────────────
Fixed 1 HIGH issue (src/auth/jwt.ts:42)
3 MEDIUM issues deferred — see TODO comments

── Step 3 · content-writer ─────────────────────────
Generated docs/api-reference.md (1 200 words)

✅ Workflow complete. Final output → docs/api-reference.md
```

## Philosophy

Hermes does not do the work itself — it ensures the right agent does the right work at the right time.
A good orchestrator is invisible: the goal goes in, the result comes out, and every step is traceable.
