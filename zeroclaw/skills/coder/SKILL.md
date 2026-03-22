---
name: coder
description: "Full-stack code generation, debugging, refactoring, and explanation across all major languages and frameworks. Invoke when the user wants to write new code, fix a bug, understand existing code, add tests, or improve code quality. Trigger keywords: 'write', 'implement', 'build', 'fix', 'debug', 'refactor', 'add tests', 'explain this code', 'how do I', 'help me code'."
---

# coder

Production-quality code, every time. Reads before it writes. Tests before it ships.

## Usage

```
@ZeroClaw coder --task "add rate limiting middleware to the Express API"
@ZeroClaw coder --file src/auth/login.rs --task "fix the session expiry bug"
@ZeroClaw coder --task "write a Python script to parse and deduplicate a CSV" --lang python
@ZeroClaw coder --explain src/scheduler.ts
@ZeroClaw coder --test src/billing/ --framework jest
@ZeroClaw coder --refactor src/utils/ --goal "reduce duplication"
```

## Options

| Flag | Description |
|------|-------------|
| `--task` | What to build or fix (required unless `--explain`) |
| `--file` | File(s) to read for context (glob OK) |
| `--lang` | Force a language if not inferrable |
| `--explain` | Explain an existing file or function |
| `--test` | Generate tests for a path |
| `--framework` | Test framework (`jest`, `pytest`, `cargo test`, etc.) |
| `--refactor` | Refactor a path toward a goal |
| `--dry-run` | Show the plan; don't write files |

## Workflow

1. **Read** — loads relevant files to understand context, conventions, and types.
2. **Clarify** — asks one focused question if the task is ambiguous.
3. **Plan** — outlines the approach before writing (shown in `--dry-run` mode).
4. **Implement** — writes the minimal, correct, well-named code.
5. **Test** — runs existing tests; adds new ones for non-trivial logic.
6. **Summarise** — explains what changed and why.

## Language Support

| Language | Strength |
|----------|----------|
| Rust | Ownership, async/await, WASM, no_std |
| TypeScript / JavaScript | React, Next.js, Node, Deno, Bun |
| Python | FastAPI, Django, data science, scripting |
| Go | HTTP services, concurrency, CLI tools |
| SQL | PostgreSQL, MySQL, SQLite, query optimisation |
| Bash | Automation scripts, DevOps tooling |
| HTML/CSS | Semantic markup, accessibility, responsive design |

## Code Standards

- **Types**: always typed; no `any` in TypeScript, explicit generics in Rust.
- **Errors**: explicit error handling; no silent swallows.
- **Names**: descriptive — `fetch_user_by_email`, not `get_u`.
- **Tests**: at least one happy-path and one failure case per function.
- **Comments**: explain *why*, not *what*.
- **Dependencies**: ask before adding any new dependency.

## Example Output

```
📋 Plan
  1. Add `RateLimiter` struct with token bucket algorithm
  2. Implement `tower::Layer` so it composes with existing middleware
  3. Wire into `App::layer()` in main.rs
  4. Add integration test: 100 req/s allowed, 101st returns 429

✅ Changes
  src/middleware/rate_limiter.rs  (new, 87 lines)
  src/main.rs                     (3 lines changed)
  tests/rate_limiter_test.rs      (new, 42 lines)

All 47 tests pass.
```
