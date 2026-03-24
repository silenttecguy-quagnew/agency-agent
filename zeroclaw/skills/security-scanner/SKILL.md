---
name: security-scanner
description: "Comprehensive security audit: dependency CVEs, supply chain policy, hardcoded secrets, injection patterns, unsafe code, and auth gaps. Generates SECURITY_REPORT.md. Run before any release or dependency update, or as a CI gate. Trigger keywords: 'security scan', 'check for vulnerabilities', 'audit dependencies', 'find secrets', 'CVE check', 'pentest', 'security review'."
---

# security-scanner

One command. Full picture. CRITICAL/HIGH/MEDIUM/LOW — with remediations.

## Usage

```
@ZeroClaw security-scanner --full
@ZeroClaw security-scanner --deps-only           # Dependency CVEs + supply chain only
@ZeroClaw security-scanner --secrets-only        # Hardcoded credential scan only
@ZeroClaw security-scanner --path src/           # Scan a specific directory
@ZeroClaw security-scanner --fail-on high        # Exit 1 if HIGH+ issues found (CI mode)
@ZeroClaw security-scanner --format json         # Machine-readable output
```

## Options

| Flag | Description |
|------|-------------|
| `--full` | Run all checks (recommended) |
| `--deps-only` | Dependency CVEs and license/supply chain policy |
| `--secrets-only` | Hardcoded credentials only |
| `--path` | Scope code analysis to a directory |
| `--fail-on` | `critical` \| `high` \| `medium` — exit 1 at threshold |
| `--format` | `markdown` (default) \| `json` \| `sarif` |

## What It Checks

### 1. Dependency CVEs
- Parses `Cargo.lock`, `package-lock.json`, `requirements.txt`, `go.sum`, `Gemfile.lock`
- Cross-references the [RustSec](https://rustsec.org/advisories/), [npm](https://www.npmjs.com/advisories), [PyPI](https://osv.dev), and [OSV](https://osv.dev) advisory databases
- Reports advisory ID, CVSS score, affected versions, and the minimum safe version

### 2. Supply Chain
- Duplicate/conflicting package versions
- Packages with suspicious names (typosquatting heuristics)
- Pinned vs. floating version policies
- License compliance: flags GPL/AGPL if your project is proprietary (configurable)

### 3. Hardcoded Secrets
- API keys, tokens, passwords, private keys, connection strings
- Regex + entropy analysis — low false-positive rate
- Checks `.env` files, config files, source files, and git history (last 50 commits)

### 4. Injection & Logic Vulnerabilities
- SQL injection (string concatenation into queries)
- Shell injection (`Command::new` with unsanitised input)
- Path traversal (file operations on user-controlled paths)
- Template injection (user input rendered in template strings)

### 5. Auth & Access Control Gaps
- Unauthenticated endpoints that should require auth
- Missing authorisation checks (any-user-can-do-anything patterns)
- Over-privileged service accounts and tokens

### 6. Unsafe Code Patterns
- `unsafe` blocks missing `// SAFETY:` documentation
- `transmute`, raw pointer dereferences, `from_raw_parts`
- `unwrap()` / `expect()` / `panic!()` in non-test library code
- Integer arithmetic on untrusted input without overflow protection

## Output Files

```
SECURITY_REPORT.md      ← human-readable, severity-sorted findings
security_audit.json     ← machine-readable (only with --format json)
```

### Report Format

```markdown
## Summary
CRITICAL: 0 | HIGH: 1 | MEDIUM: 3 | LOW: 7

Scanned: 1,847 files · 89 dependencies · 14,203 lines of code
Scan time: 23s

## HIGH Findings

### DEP-001: serde_json 1.0.85 — RUSTSEC-2023-0071
Severity: HIGH | CVSS: 7.5
Advisory: Denial of service via deeply nested JSON
Affected: serde_json < 1.0.92
Fix: Upgrade to serde_json = "1.0.108" in Cargo.toml

## MEDIUM Findings

### CODE-001: src/api/files.rs:94 — Path traversal risk
Issue: `std::fs::read(format!("uploads/{}", user_input))` allows `../` traversal.
Fix: Canonicalize the path and verify it stays within the uploads directory.
...
```

## CI Integration

```yaml
# .github/workflows/security.yml
- name: ZeroClaw Security Scan
  run: |
    zeroclaw skills install zeroclaw/skills/security-scanner
    @ZeroClaw security-scanner --full --fail-on high --format sarif \
      > security-results.sarif
- uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: security-results.sarif
```

## Philosophy

CRITICAL issues block release. HIGH issues block merge. MEDIUM goes in the next sprint.
LOW is tracked. The threshold is your team's call — but the scan runs on every PR.
A false positive you investigate is better than a real vulnerability you miss.
