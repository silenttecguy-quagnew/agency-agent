import React, { useState, useEffect } from 'react';
import MiniCoder from './MiniCoder';
import SkillPanel from './SkillPanel';

const BASE = process.env.PUBLIC_URL || '';

const ICONS = {
  researcher:       '🔍',
  coder:            '💻',
  'code-reviewer':  '👁️',
  'security-scanner': '🔒',
  devops:           '⚙️',
  'data-analyst':   '📊',
  'content-writer': '✍️',
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { name: '', description: '', body: text.trim() };
  const fm = m[1];
  const nameM  = fm.match(/^name:\s*(.+)$/m);
  const descM  = fm.match(/^description:\s*"([^"]+)"/m);
  return {
    name:        nameM ? nameM[1].trim() : '',
    description: descM ? descM[1].trim() : '',
    body:        m[2].trim(),
  };
}

/** Pull the first fenced code block from the ## Usage section. */
function extractUsageSnippet(body) {
  const usageSection = body.match(/## Usage[\s\S]*?(?=\n##|$)/);
  if (!usageSection) return '';
  const cb = usageSection[0].match(/```(?:\w*)\n([\s\S]*?)```/);
  return cb ? cb[1].trim() : '';
}

/** First sentence only, for the card tagline. */
function firstSentence(text) {
  return text.split(/[.!?]\s+/)[0].replace(/[.!?]$/, '');
}

// ── Styles ─────────────────────────────────────────────────────────────────────

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
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '10px',
    marginBottom: '24px',
  },
  card: {
    background: '#1e1e1e',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '12px 14px',
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
    marginBottom: '5px',
  },
  cardIcon: { fontSize: '18px', lineHeight: 1 },
  cardName: {
    color: '#eee',
    fontSize: '13px',
    fontWeight: 'bold',
    fontFamily: "'Courier New', Courier, monospace",
    margin: 0,
  },
  cardTagline: {
    color: '#888',
    fontSize: '12px',
    lineHeight: '1.4',
    margin: 0,
  },
  activeHint: {
    color: '#4a9eff',
    fontSize: '11px',
    marginTop: '6px',
  },
  sectionLabel: {
    color: '#666',
    fontSize: '11px',
    fontWeight: 'bold',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    marginBottom: '10px',
  },
  loading: {
    color: '#666',
    fontSize: '13px',
    padding: '40px 0',
    textAlign: 'center',
  },
  error: {
    color: '#ff5555',
    fontSize: '13px',
    padding: '20px 0',
  },
  editorLabel: {
    color: '#666',
    fontSize: '11px',
    fontWeight: 'bold',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    marginBottom: '10px',
    marginTop: '20px',
  },
  quickStart: {
    background: '#1e1e1e',
    border: '1px solid #2e2e2e',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '12px',
    color: '#888',
    lineHeight: '1.8',
  },
  mono: {
    fontFamily: "'Courier New', Courier, monospace",
    color: '#d4d4d4',
  },
};

// ── Component ──────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const [agents,     setAgents]     = useState(null);   // null = loading
  const [error,      setError]      = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSkills() {
      try {
        // 1. Fetch the ordered list of agent names
        const indexRes = await fetch(`${BASE}/skills/index.json`);
        if (!indexRes.ok) throw new Error(`index.json: ${indexRes.status}`);
        const names = await indexRes.json();

        // 2. Fetch all skill files in parallel
        const markdowns = await Promise.all(
          names.map(name =>
            fetch(`${BASE}/skills/${name}.md`)
              .then(r => { if (!r.ok) throw new Error(`${name}.md: ${r.status}`); return r.text(); })
          )
        );

        if (cancelled) return;

        // 3. Parse frontmatter + body for each skill
        const loaded = names.map((name, i) => {
          const { description, body } = parseFrontmatter(markdowns[i]);
          return {
            id:          name,
            name,
            icon:        ICONS[name] || '🤖',
            tagline:     firstSentence(description),
            description,
            body,
            snippet:     extractUsageSnippet(body),
          };
        });

        setAgents(loaded);
        setSelectedId(loaded[0]?.id ?? null);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }

    loadSkills();
    return () => { cancelled = true; };
  }, []);

  const selected = agents?.find(a => a.id === selectedId) ?? null;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.h1}>🦀 ZeroClaw Agent Dashboard</h1>
        {agents && (
          <p style={styles.subtitle}>{agents.length} agents loaded · click one to explore</p>
        )}
      </div>

      <hr style={styles.divider} />

      {/* Loading / error */}
      {!agents && !error && (
        <div style={styles.loading}>Loading skills…</div>
      )}
      {error && (
        <div style={styles.error}>⚠ Failed to load skills: {error}</div>
      )}

      {/* Agent cards */}
      {agents && (
        <>
          <div style={styles.sectionLabel}>Agents</div>
          <div style={styles.grid}>
            {agents.map(agent => {
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
                  {isActive && <div style={styles.activeHint}>▼ details below</div>}
                </div>
              );
            })}
          </div>

          <hr style={styles.divider} />

          {/* Full skill content */}
          {selected && (
            <>
              <div style={styles.sectionLabel}>
                {selected.icon} {selected.name}
              </div>
              <SkillPanel body={selected.body} />

              {/* Usage in MiniCoder */}
              {selected.snippet && (
                <>
                  <div style={styles.editorLabel}>Try it — edit &amp; copy</div>
                  <MiniCoder
                    key={selected.id}
                    language="bash"
                    initialCode={selected.snippet}
                  />
                </>
              )}
            </>
          )}

          <hr style={styles.divider} />

          {/* Quick-start footer */}
          <div style={styles.quickStart}>
            <strong style={styles.mono}>Quick install: </strong>
            <code style={styles.mono}>cp zeroclaw/config.toml ~/.zeroclaw/config.toml</code>
            {'  ·  '}
            <code style={styles.mono}>export ZEROCLAW_API_KEY="sk-or-..."</code>
            {'  ·  '}
            <code style={styles.mono}>zeroclaw daemon</code>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;