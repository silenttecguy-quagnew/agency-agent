import React, { useState } from 'react';
import MiniCoder from './MiniCoder';

const AGENTS = [
  {
    id: 'researcher',
    icon: '🔍',
    name: 'researcher',
    tagline: 'Multi-source research with citations. Always verify before you claim.',
    snippet: `# researcher — deep web research with source citations

# Single-message invocation (CLI)
zeroclaw agent --agent researcher \\
  -m "summarise the latest AI agent frameworks released in 2026"

# Skill invocations
@ZeroClaw researcher --query "compare Cloudflare Workers vs AWS Lambda cold-start latency" --depth 3
@ZeroClaw researcher --topic "Rust async runtimes" --format brief
@ZeroClaw researcher --query "SEC filings for OpenAI 2025" --sources sec.gov,reuters.com`,
  },
  {
    id: 'coder',
    icon: '💻',
    name: 'coder',
    tagline: 'Production-quality code. Reads before it writes. Tests before it ships.',
    snippet: `# coder — full-stack code generation, debugging, refactoring

zeroclaw agent --agent coder \\
  -m "add rate limiting middleware to my Express API"

@ZeroClaw coder --task "add rate limiting middleware to the Express API"
@ZeroClaw coder --file src/auth/login.rs --task "fix the session expiry bug"
@ZeroClaw coder --task "write a Python script to parse and deduplicate a CSV" --lang python
@ZeroClaw coder --test src/billing/ --framework jest
@ZeroClaw coder --explain src/scheduler.ts`,
  },
  {
    id: 'code-reviewer',
    icon: '👁️',
    name: 'code-reviewer',
    tagline: 'Static analysis + AI review. Severity-rated findings in CODE_REVIEW.md.',
    snippet: `# code-reviewer — AI-powered code review with severity ratings

zeroclaw agent --agent code-reviewer \\
  -m "review the changes in my last commit"

@ZeroClaw code-reviewer --path src/
@ZeroClaw code-reviewer --diff HEAD~1..HEAD
@ZeroClaw code-reviewer --pr 142
@ZeroClaw code-reviewer --path src/ --strict   # exit 1 on MEDIUM+ issues (CI mode)`,
  },
  {
    id: 'security-scanner',
    icon: '🔒',
    name: 'security-scanner',
    tagline: 'CVE audit, secrets detection, injection patterns. Generates SECURITY_REPORT.md.',
    snippet: `# security-scanner — comprehensive security audit

zeroclaw agent --agent security-scanner \\
  -m "scan this project for security issues"

@ZeroClaw security-scanner --full
@ZeroClaw security-scanner --deps-only          # CVEs + supply chain only
@ZeroClaw security-scanner --secrets-only       # hardcoded credential scan
@ZeroClaw security-scanner --fail-on high       # CI gate: exit 1 on HIGH+`,
  },
  {
    id: 'devops',
    icon: '⚙️',
    name: 'devops',
    tagline: 'CI/CD pipelines, Dockerfiles, Kubernetes manifests, Terraform configs.',
    snippet: `# devops — automation-first infrastructure

zeroclaw agent --agent devops \\
  -m "generate a GitHub Actions CI pipeline for a Python project"

@ZeroClaw devops --pipeline github-actions --lang python
@ZeroClaw devops --dockerfile --app node --port 3000 --multi-stage
@ZeroClaw devops --k8s deployment --app my-api --replicas 3 --autoscale
@ZeroClaw devops --terraform aws --resources "vpc,eks,rds"`,
  },
  {
    id: 'data-analyst',
    icon: '📊',
    name: 'data-analyst',
    tagline: 'EDA, trend detection, and actionable recommendations. Generates ANALYSIS_REPORT.md.',
    snippet: `# data-analyst — exploratory data analysis and business insights

zeroclaw agent --agent data-analyst \\
  -m "analyse metrics.csv and show me weekly active users and revenue trends"

@ZeroClaw data-analyst --input metrics.csv --describe "show weekly active users and revenue trends"
@ZeroClaw data-analyst --input orders.parquet --question "which product categories are declining?"
@ZeroClaw data-analyst --input users.csv --question "what drives churn?" --method regression`,
  },
  {
    id: 'content-writer',
    icon: '✍️',
    name: 'content-writer',
    tagline: 'Blog posts, docs, changelogs, READMEs. Clear, scannable, reader-first.',
    snippet: `# content-writer — polished written content, ready to publish

zeroclaw agent --agent content-writer \\
  -m "write a 900-word blog post: Why Rust is the future of AI infrastructure"

@ZeroClaw content-writer --type blog --topic "Why Rust is the future of AI infrastructure" --length 900
@ZeroClaw content-writer --type changelog --from v1.3.0 --to HEAD
@ZeroClaw content-writer --type readme --repo . --audience "developers, self-hosters"
@ZeroClaw content-writer --rewrite docs/setup.md --goal "make it clearer and shorter"`,
  },
];

const styles = {
  page: {
    padding: '24px',
    background: '#121212',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    color: '#eee',
  },
  header: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
    marginBottom: '8px',
  },
  h1: {
    color: '#eee',
    fontSize: '22px',
    fontWeight: 'bold',
    margin: 0,
  },
  subtitle: {
    color: '#888',
    fontSize: '13px',
    margin: 0,
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #333',
    margin: '20px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '12px',
    marginBottom: '24px',
  },
  card: {
    background: '#1e1e1e',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '14px 16px',
    cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s',
  },
  cardActive: {
    background: '#1a2a3a',
    border: '1px solid #4a9eff',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
  },
  cardIcon: {
    fontSize: '20px',
    lineHeight: 1,
  },
  cardName: {
    color: '#eee',
    fontSize: '14px',
    fontWeight: 'bold',
    fontFamily: "'Courier New', Courier, monospace",
    margin: 0,
  },
  cardTagline: {
    color: '#999',
    fontSize: '12px',
    lineHeight: '1.4',
    margin: 0,
  },
  activeHint: {
    color: '#4a9eff',
    fontSize: '11px',
    marginTop: '8px',
  },
  sectionLabel: {
    color: '#888',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
  quickStart: {
    background: '#1e1e1e',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '14px 16px',
    marginBottom: '24px',
    fontSize: '12px',
    color: '#aaa',
    lineHeight: '1.7',
  },
  quickStartCode: {
    fontFamily: "'Courier New', Courier, monospace",
    color: '#d4d4d4',
  },
};

const Dashboard = () => {
  const [selectedId, setSelectedId] = useState('researcher');

  const selected = AGENTS.find(a => a.id === selectedId);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.h1}>🦀 ZeroClaw Agent Dashboard</h1>
        <p style={styles.subtitle}>7 agents · click one to load its usage into the editor</p>
      </div>

      <hr style={styles.divider} />

      <div style={styles.sectionLabel}>Agents</div>
      <div style={styles.grid}>
        {AGENTS.map(agent => {
          const isActive = agent.id === selectedId;
          return (
            <div
              key={agent.id}
              style={{ ...styles.card, ...(isActive ? styles.cardActive : {}) }}
              onClick={() => setSelectedId(agent.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setSelectedId(agent.id)}
              aria-pressed={isActive}
              aria-label={`Select ${agent.name} agent`}
            >
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>{agent.icon}</span>
                <span style={styles.cardName}>{agent.name}</span>
              </div>
              <p style={styles.cardTagline}>{agent.tagline}</p>
              {isActive && (
                <div style={styles.activeHint}>▼ usage loaded below</div>
              )}
            </div>
          );
        })}
      </div>

      <hr style={styles.divider} />

      <div style={styles.sectionLabel}>
        {selected ? `${selected.icon} ${selected.name} — usage` : 'Usage'}
      </div>
      <MiniCoder
        key={selectedId}
        language="bash"
        initialCode={selected ? selected.snippet : ''}
      />

      <hr style={styles.divider} />

      <div style={styles.quickStart}>
        <strong style={styles.quickStartCode}>Quick install:</strong>
        <br />
        <code style={styles.quickStartCode}>
          cp zeroclaw/config.toml ~/.zeroclaw/config.toml
        </code>
        {'  ·  '}
        <code style={styles.quickStartCode}>
          export ZEROCLAW_API_KEY="sk-or-..."
        </code>
        {'  ·  '}
        <code style={styles.quickStartCode}>
          zeroclaw daemon
        </code>
      </div>
    </div>
  );
};

export default Dashboard;