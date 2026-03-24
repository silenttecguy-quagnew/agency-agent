---
name: code-reviewer
description: "AI-powered code review with static analysis and severity-rated findings (CRITICAL/HIGH/MEDIUM/LOW). Generates CODE_REVIEW.md. Use before merging PRs, after major refactors, or as a CI quality gate. Trigger keywords: 'review this code', 'check my PR', 'code review', 'what's wrong with', 'review src/', 'lint and review'."
---

# code-reviewer

Combines static analysis tools with an AI review pass for issues no linter catches.

## Usage

```
@ZeroClaw code-reviewer --path src/
@ZeroClaw code-reviewer --diff HEAD~1..HEAD
@ZeroClaw code-reviewer --file src/auth/session.rs
@ZeroClaw code-reviewer --pr 142
@ZeroClaw code-reviewer --path src/ --strict          # Exit non-zero on MEDIUM+ issues
@ZeroClaw code-reviewer --path src/ --lang typescript  # Force language if not inferred
```

## Options

| Flag | Description |
|------|-------------|
| `--path` | Directory to review |
| `--diff` | Git diff range to review (e.g. `HEAD~1..HEAD`) |
| `--file` | Single file to review |
| `--pr` | Pull request number (fetches diff automatically) |
| `--strict` | Exit 1 if any MEDIUM+ issue is found (CI mode) |
| `--lang` | Override language detection |
| `--skip-tools` | Skip static analysis; AI review only |

## Review Layers

### Layer 1 — Static Analysis (language-dependent)

| Language | Tools Run |
|----------|-----------|
| Rust | `cargo clippy -- -D warnings`, `rustfmt --check`, `cargo-udeps` |
| TypeScript | `eslint`, `tsc --noEmit` |
| Python | `ruff`, `mypy` |
| Go | `go vet`, `staticcheck` |
| All | `git diff` for leftover debug code and TODO sprawl |

### Layer 2 — AI Review Pass

Focuses on what static tools miss:

- **Logic errors** — off-by-one, wrong comparison operators, inverted conditions.
- **Concurrency bugs** — race conditions, mutex misuse, async/await misuse.
- **Security** — injection vectors, missing auth checks, over-privileged tokens.
- **Error handling** — swallowed errors, panic paths in library code.
- **Performance** — unnecessary cloning/allocation, N+1 patterns, blocking I/O.
- **Maintainability** — naming clarity, function length, missing tests.

## Output

```
CODE_REVIEW.md
```

### Format

```markdown
## Summary
CRITICAL: 0 | HIGH: 2 | MEDIUM: 4 | LOW: 9

## HIGH Issues

### src/billing/charge.rs:83 — unwrap() on payment provider response
**Issue**: `provider.charge(amount).unwrap()` panics if the provider is down,
taking down the entire billing service.
**Fix**: Return `Result<ChargeId, BillingError>` and propagate with `?`.
**Snippet**:
  - let id = provider.charge(amount).unwrap();
  + let id = provider.charge(amount).map_err(BillingError::ProviderFailure)?;

### src/api/users.rs:201 — Missing authorisation check on DELETE /users/:id
**Issue**: Any authenticated user can delete any other user's account.
**Fix**: Verify `request.user_id == path.id || request.user.is_admin()` before proceeding.

## MEDIUM Issues
...
```

## CI Integration

```yaml
# .github/workflows/review.yml
- name: ZeroClaw Code Review
  run: |
    zeroclaw skills install zeroclaw/skills/code-reviewer
    @ZeroClaw code-reviewer --diff ${{ github.event.pull_request.base.sha }}..${{ github.sha }} --strict
```

## Philosophy

"It compiles" is not "it's correct". This skill catches what the compiler and linter
allow but shouldn't. Every CRITICAL and HIGH finding includes a concrete, copy-paste fix.
