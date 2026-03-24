import React, { useState, useRef, useEffect } from 'react';

const LANGUAGES = ['javascript', 'python', 'bash', 'html', 'css', 'json'];

const styles = {
  wrapper: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '900px',
    margin: '0 auto',
    border: '1px solid #444',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#2d2d2d',
    padding: '8px 12px',
    borderBottom: '1px solid #444',
  },
  title: {
    color: '#ccc',
    fontSize: '13px',
    fontWeight: 'bold',
    marginRight: 'auto',
    letterSpacing: '0.5px',
  },
  select: {
    background: '#3a3a3a',
    color: '#eee',
    border: '1px solid #555',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  button: {
    background: '#4a9eff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  runWarning: {
    background: '#2a2000',
    color: '#ffcc44',
    fontSize: '11px',
    padding: '4px 12px',
    borderBottom: '1px solid #444',
  },
  copyButton: {
    background: '#555',
    color: '#eee',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 12px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  editorArea: {
    display: 'flex',
    background: '#1e1e1e',
  },
  lineNumbers: {
    background: '#252526',
    color: '#858585',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '14px',
    lineHeight: '1.6',
    padding: '12px 8px',
    textAlign: 'right',
    userSelect: 'none',
    minWidth: '40px',
    borderRight: '1px solid #333',
  },
  textarea: {
    flex: 1,
    background: 'transparent',
    color: '#d4d4d4',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '14px',
    lineHeight: '1.6',
    padding: '12px',
    border: 'none',
    outline: 'none',
    resize: 'none',
    minHeight: '200px',
    whiteSpace: 'pre',
    overflowWrap: 'normal',
    overflowX: 'auto',
  },
  output: {
    background: '#0d0d0d',
    color: '#00ff88',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '13px',
    padding: '10px 12px',
    borderTop: '1px solid #333',
    minHeight: '40px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  outputLabel: {
    color: '#888',
    fontSize: '11px',
    marginBottom: '4px',
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    background: '#007acc',
    color: '#fff',
    fontSize: '11px',
    padding: '2px 10px',
  },
};

const DEFAULT_SNIPPETS = {
  javascript: `// JavaScript\nconsole.log("Hello from MiniCoder!");\n\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("World"));`,
  python: `# Python\nprint("Hello from MiniCoder!")\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))`,
  bash: `#!/usr/bin/env bash\n# ZeroClaw — quick reference\nzeroclaw status\nzeroclaw agent -m "hello"\nzeroclaw doctor`,
  html: `<!-- HTML -->\n<!DOCTYPE html>\n<html>\n  <head><title>Mini Page</title></head>\n  <body>\n    <h1>Hello from MiniCoder!</h1>\n    <p>Edit me!</p>\n  </body>\n</html>`,
  css: `/* CSS */\nbody {\n  font-family: Arial, sans-serif;\n  background: #f0f0f0;\n  color: #333;\n}\n\nh1 {\n  color: #007acc;\n}`,
  json: `{\n  "name": "MiniCoder",\n  "version": "1.0.0",\n  "description": "A mini code editor component",\n  "features": ["editable", "reusable", "lightweight"]\n}`,
};

function MiniCoder({ initialCode, language: initialLanguage = 'javascript', onChange }) {
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(
    initialCode !== undefined ? initialCode : DEFAULT_SNIPPETS[initialLanguage] || ''
  );
  const [output, setOutput] = useState('');
  const [copyLabel, setCopyLabel] = useState('Copy');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (initialCode === undefined && DEFAULT_SNIPPETS[language]) {
      setCode(DEFAULT_SNIPPETS[language]);
    }
    setOutput('');
  }, [language, initialCode]);

  const lineCount = code.split('\n').length;

  function handleChange(e) {
    const val = e.target.value;
    setCode(val);
    if (onChange) onChange(val, language);
  }

  function handleLanguageChange(e) {
    setLanguage(e.target.value);
  }

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopyLabel('Copied!');
      setTimeout(() => setCopyLabel('Copy'), 1800);
    }).catch(() => {
      setCopyLabel('Copy failed');
      setTimeout(() => setCopyLabel('Copy'), 2000);
    });
  }

  function handleRun() {
    if (language !== 'javascript') {
      setOutput(`ℹ️  Run is only supported for JavaScript in the browser.\nFor ${language}, copy the code and run it in your preferred environment.`);
      return;
    }
    const logs = [];
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    try {
      const iWin = iframe.contentWindow;
      iWin.console = {
        log: (...args) => logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ')),
        error: (...args) => logs.push('ERROR: ' + args.join(' ')),
        warn: (...args) => logs.push('WARN: ' + args.join(' ')),
      };
      iWin.eval(code);
      setOutput(logs.join('\n') || '(no output)');
    } catch (err) {
      setOutput('❌ Error: ' + err.message);
    } finally {
      document.body.removeChild(iframe);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.target;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = code.substring(0, start) + '  ' + code.substring(end);
      setCode(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2;
      });
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.toolbar}>
        <span style={styles.title}>⌨️ MiniCoder</span>
        <select
          style={styles.select}
          value={language}
          onChange={handleLanguageChange}
          aria-label="Select language"
        >
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
        <button style={styles.copyButton} onClick={handleCopy}>{copyLabel}</button>
        {language === 'javascript' && (
          <button style={styles.button} onClick={handleRun}>▶ Run</button>
        )}
      </div>

      {language === 'javascript' && (
        <div style={styles.runWarning}>
          ⚠️ Only run code you trust. Execution happens in your browser.
        </div>
      )}

      <div style={styles.editorArea}>
        <div style={styles.lineNumbers}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1}>{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          style={styles.textarea}
          value={code}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          rows={Math.max(lineCount, 8)}
          aria-label="Code editor"
        />
      </div>

      {output && (
        <div style={styles.output}>
          <div style={styles.outputLabel}>Output:</div>
          {output}
        </div>
      )}

      <div style={styles.statusBar}>
        <span>{language.toUpperCase()}</span>
        <span>Lines: {lineCount} | Chars: {code.length}</span>
      </div>
    </div>
  );
}

export default MiniCoder;
