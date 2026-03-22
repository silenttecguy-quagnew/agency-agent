---
name: researcher
description: "Deep web research, multi-source synthesis, and citation-backed answers. Invoke when the user needs to gather information, fact-check a claim, compare options, monitor a topic, or produce a researched brief. Trigger keywords: 'research', 'find out', 'look up', 'what is', 'compare', 'summarise', 'latest news on', 'who is', 'how does X work'."
---

# researcher

Multi-source research with citations. Always verify before you claim.

## Usage

```
@ZeroClaw researcher --query "best open-source LLM routers in 2026"
@ZeroClaw researcher --query "compare Cloudflare Workers vs AWS Lambda cold-start latency" --depth 3
@ZeroClaw researcher --query "SEC filings for OpenAI 2025" --sources sec.gov,reuters.com
@ZeroClaw researcher --topic "Rust async runtimes" --format brief
@ZeroClaw researcher --monitor "zeroclaw-labs/zeroclaw releases" --cron "0 9 * * 1"
```

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--query` | Research question (required) | — |
| `--depth` | Number of search + fetch iterations | 2 |
| `--sources` | Comma-separated domains to prioritise | all |
| `--format` | `brief` (500w) \| `standard` (1000w) \| `deep` (2500w) | `standard` |
| `--monitor` | Repeat query on a cron schedule | — |
| `--cite` | Citation style: `inline` \| `footnotes` \| `list` | `list` |

## What It Does

1. **Decompose** — Breaks the query into 3–5 targeted sub-questions.
2. **Search** — Runs `web_search` for each sub-question; scores results by relevance.
3. **Fetch** — Reads the top pages with `web_fetch`; extracts key passages.
4. **Cross-reference** — Compares sources; flags contradictions.
5. **Synthesise** — Writes a structured answer with inline citations.
6. **Save** — Stores the brief in memory under `research/<slug>` for future recall.

## Output Format

```markdown
## Executive Summary
One-paragraph answer to the core question.

## Key Findings
### [Finding 1]
...evidence... [^1]

### [Finding 2]
...evidence... [^2]

## Sources
[^1]: https://...
[^2]: https://...

## Confidence
HIGH / MEDIUM / LOW — with explanation of any gaps or contradictions.
```

## Monitoring Mode

```bash
# Get a weekly briefing on a topic
@ZeroClaw researcher \
  --query "significant AI safety papers published this week" \
  --monitor \
  --cron "0 8 * * 1" \
  --format brief
```

ZeroClaw will create a cron job that emails/messages the brief to your connected channel.

## Philosophy

A researcher that fabricates citations is worse than no researcher at all.
This skill never invents sources. If information is unavailable or unverifiable,
it says so explicitly. Uncertainty is always quantified.
