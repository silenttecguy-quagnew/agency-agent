import React from 'react';

const s = {
  root: {
    background: '#161616',
    border: '1px solid #2e2e2e',
    borderRadius: '8px',
    padding: '20px 24px',
    overflowY: 'auto',
    maxHeight: '520px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
  },
  h1: {
    color: '#eee',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 10px',
    paddingBottom: '6px',
    borderBottom: '1px solid #2e2e2e',
  },
  h2: {
    color: '#c8c8c8',
    fontSize: '14px',
    fontWeight: 'bold',
    margin: '18px 0 6px',
    paddingTop: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  h3: {
    color: '#aaa',
    fontSize: '13px',
    fontWeight: 'bold',
    margin: '12px 0 4px',
  },
  para: {
    color: '#bbb',
    fontSize: '13px',
    margin: '4px 0',
  },
  listItem: {
    color: '#bbb',
    fontSize: '13px',
    margin: '3px 0 3px 12px',
  },
  codeBlock: {
    background: '#0d0d0d',
    color: '#00e676',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '12px',
    lineHeight: '1.6',
    padding: '10px 12px',
    borderRadius: '6px',
    overflowX: 'auto',
    margin: '8px 0',
    whiteSpace: 'pre',
  },
  codeLang: {
    display: 'block',
    color: '#555',
    fontSize: '10px',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  inlineCode: {
    background: '#252525',
    color: '#f0a500',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '12px',
    padding: '1px 5px',
    borderRadius: '3px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '8px 0',
    fontSize: '12px',
  },
  th: {
    color: '#aaa',
    borderBottom: '1px solid #333',
    padding: '4px 10px 4px 0',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  td: {
    color: '#bbb',
    borderBottom: '1px solid #222',
    padding: '4px 10px 4px 0',
    verticalAlign: 'top',
  },
  spacer: {
    height: '8px',
  },
};

/** Convert **bold** and `inline code` fragments to React nodes. */
function inlineMarkdown(text) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('`') && p.endsWith('`') && p.length > 2) {
      return <code key={i} style={s.inlineCode}>{p.slice(1, -1)}</code>;
    }
    if (p.startsWith('**') && p.endsWith('**') && p.length > 4) {
      return <strong key={i} style={{ color: '#ddd' }}>{p.slice(2, -2)}</strong>;
    }
    return p;
  });
}

/**
 * Parse a pipe-separated Markdown table into { headers, rows }.
 * Returns null if `lines` does not look like a table.
 */
function parseTable(lines) {
  if (!lines.length || !lines[0].startsWith('|')) return null;
  const headers = lines[0].split('|').map(c => c.trim()).filter(Boolean);
  const rows = lines.slice(2).map(l =>
    l.split('|').map(c => c.trim()).filter(Boolean)
  ).filter(r => r.length > 0);
  return { headers, rows };
}

/**
 * Render the markdown body of a SKILL.md file into React elements.
 * Handles: fenced code blocks, ATX headings, tables, ordered/unordered lists,
 * inline bold, inline code, and plain paragraphs.
 */
export default function SkillPanel({ body }) {
  if (!body) return null;

  const nodes = [];

  // Split on fenced code blocks; keep delimiters so we can process them.
  const segments = body.split(/(```[\s\S]*?```)/g);

  segments.forEach((seg, si) => {
    if (seg.startsWith('```')) {
      const lines = seg.split('\n');
      const lang = lines[0].slice(3).trim();
      const code = lines.slice(1, -1).join('\n');
      nodes.push(
        <pre key={`cb-${si}`} style={s.codeBlock}>
          {lang && <span style={s.codeLang}>{lang}</span>}
          {code}
        </pre>
      );
      return;
    }

    // Process non-code lines, collecting table rows when encountered.
    const lines = seg.split('\n');
    let tableLines = null;

    const flushTable = (keyPrefix) => {
      if (!tableLines) return;
      const tbl = parseTable(tableLines);
      tableLines = null;
      if (!tbl) return;
      nodes.push(
        <table key={keyPrefix} style={s.table}>
          <thead>
            <tr>{tbl.headers.map((h, i) => <th key={i} style={s.th}>{inlineMarkdown(h)}</th>)}</tr>
          </thead>
          <tbody>
            {tbl.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => <td key={ci} style={s.td}>{inlineMarkdown(cell)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      );
    };

    lines.forEach((line, li) => {
      const key = `${si}-${li}`;

      // Table rows
      if (line.startsWith('|')) {
        if (!tableLines) tableLines = [];
        tableLines.push(line);
        return;
      }
      flushTable(`tbl-${si}-${li}`);

      if (line.startsWith('# ')) {
        nodes.push(<div key={key} style={s.h1}>{inlineMarkdown(line.slice(2))}</div>);
      } else if (line.startsWith('## ')) {
        nodes.push(<div key={key} style={s.h2}>{inlineMarkdown(line.slice(3))}</div>);
      } else if (line.startsWith('### ')) {
        nodes.push(<div key={key} style={s.h3}>{inlineMarkdown(line.slice(4))}</div>);
      } else if (/^[-*] /.test(line)) {
        nodes.push(<div key={key} style={s.listItem}>· {inlineMarkdown(line.slice(2))}</div>);
      } else if (/^\d+\. /.test(line)) {
        nodes.push(<div key={key} style={s.listItem}>{inlineMarkdown(line)}</div>);
      } else if (line.trim() === '') {
        nodes.push(<div key={key} style={s.spacer} />);
      } else {
        nodes.push(<div key={key} style={s.para}>{inlineMarkdown(line)}</div>);
      }
    });

    flushTable(`tbl-end-${si}`);
  });

  return <div style={s.root}>{nodes}</div>;
}
