---
name: content-writer
description: "Polished written content: blog posts, technical documentation, marketing copy, changelogs, READMEs, and release notes. Optimised for clarity, scannability, and the reader's outcome. Invoke when the user needs to write, rewrite, or improve written content. Trigger keywords: 'write a blog post', 'draft docs', 'update README', 'write a changelog', 'marketing copy', 'rewrite this', 'make this clearer', 'social media post'."
---

# content-writer

Clear, scannable, reader-first content — ready to publish.

## Usage

```
@ZeroClaw content-writer --type blog --topic "Why we migrated from Python to Rust" --length 900
@ZeroClaw content-writer --type docs --path src/ --output docs/api-reference.md
@ZeroClaw content-writer --type changelog --from v1.3.0 --to HEAD
@ZeroClaw content-writer --type readme --repo . --audience "developers, self-hosters"
@ZeroClaw content-writer --type social --platform twitter --topic "ZeroClaw 2.0 launch"
@ZeroClaw content-writer --rewrite path/to/existing.md --goal "make it clearer and shorter"
```

## Options

| Flag | Description |
|------|-------------|
| `--type` | Content type (see table below) |
| `--topic` | Subject or title of the piece |
| `--length` | Target word count |
| `--audience` | Who is reading this? |
| `--tone` | `technical`, `casual`, `formal`, `punchy` |
| `--path` | Source code or existing docs to generate from |
| `--output` | Output file path |
| `--from` / `--to` | Git refs for changelog generation |
| `--platform` | Social platform: `twitter`, `linkedin`, `reddit` |
| `--rewrite` | Path to existing content to improve |
| `--goal` | What to improve: `clarity`, `seo`, `shorter`, `tone` |

## Content Types

| Type | Structure | When to Use |
|------|-----------|-------------|
| `blog` | Hook → Problem → Solution → Evidence → CTA | Thought leadership, tutorials, announcements |
| `docs` | Overview → Prerequisites → Steps → Troubleshooting → Reference | Technical documentation, guides |
| `changelog` | Version header → What changed → Why it matters → Migration | Release notes, version history |
| `readme` | What it is → Why use it → Quickstart → Full reference | GitHub READMEs, package docs |
| `social` | Hook → Value prop → CTA (platform-aware length) | Twitter/X, LinkedIn, Reddit |
| `email` | Subject → Opening hook → Body → CTA | Newsletters, outreach, announcements |
| `marketing` | Benefit-first headline → Proof points → CTA | Landing pages, product descriptions |
| `rewrite` | Preserves intent; improves clarity, tone, or length | Polishing existing content |

## Writing Principles

- **Benefit-first**: open with what the reader gains, not what you built.
- **Cut ruthlessly**: every sentence must earn its place.
- **Active voice**: "ZeroClaw processes requests in <10ms" not "requests are processed".
- **Scan-friendly**: headers, bullets, short paragraphs — assume people skim first.
- **Concrete over vague**: "reduces memory usage by 85%" beats "more efficient".
- **One idea per paragraph**: if you need a semicolon, consider two sentences.

## Example: Blog Post Outline (generated before writing)

```
Title: "From 450MB to 5MB: How We Rebuilt Our AI Runtime in Rust"

Hook (100w): The night our inference server OOM-killed in production.
Problem (150w): Python's runtime overhead; why it matters at edge scale.
Solution (300w): Rust rewrite; architecture decisions; what we kept.
Evidence (200w): Benchmarks — memory, latency, cold start.
Lessons (100w): What surprised us; what we'd do differently.
CTA (50w): GitHub repo + Discord link.
```

## Changelog Generation

Reads git log between two refs and groups commits into:

```markdown
## v2.0.0 — 2026-03-22

### New Features
- **Multi-agent swarms**: Run up to 12 sub-agents in parallel with shared memory
- **WebSocket streaming**: Real-time token streaming via ws://host:42617/ws/chat

### Improvements
- Cold start reduced from 45ms to 8ms
- Memory footprint down 60% in idle daemon mode

### Fixes
- Fixed Telegram channel dropping messages under high load (#234)
- Corrected UTC offset handling in cron scheduler (#241)

### Migration Notes
`config.toml` key `agent.max_depth` is renamed to `delegate.max_iterations`.
Run `zeroclaw migrate config` to update automatically.
```

## SEO Optimisation (blog/docs)

When `--goal seo` is specified:
- Keyword density check (target 1–2%)
- Title tag and meta description suggestions
- Header hierarchy validation (one H1, logical H2/H3)
- Internal linking suggestions
- Readability score (target Flesch-Kincaid grade 8–10)

## Philosophy

The best content makes the reader feel smarter, not impressed by the writer.
Write for the person who has 90 seconds and needs to decide whether to keep reading.
If the first paragraph doesn't earn the second, nothing else matters.
