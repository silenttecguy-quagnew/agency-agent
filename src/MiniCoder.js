import React, { useState, useRef, useEffect } from 'react';

const LANGUAGES = ['javascript', 'python', 'html', 'css', 'json'];
const STORAGE_KEY = 'minicoder_saved_files';

const FILE_EXTENSIONS = {
  javascript: 'js',
  python: 'py',
  html: 'html',
  css: 'css',
  json: 'json',
};

function loadSavedFiles() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function persistSavedFiles(files) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

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
    flexWrap: 'wrap',
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
  saveButton: {
    background: '#2ecc71',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  downloadButton: {
    background: '#9b59b6',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  folderButton: {
    background: '#e67e22',
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
  savedPanel: {
    background: '#1a1a2e',
    borderTop: '2px solid #444',
    padding: '12px',
  },
  savedPanelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  savedPanelTitle: {
    color: '#e67e22',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  savedEmpty: {
    color: '#666',
    fontSize: '12px',
    fontStyle: 'italic',
    padding: '6px 0',
  },
  savedItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#252540',
    border: '1px solid #333',
    borderRadius: '5px',
    padding: '8px 10px',
    marginBottom: '6px',
  },
  savedItemInfo: {
    flex: 1,
    minWidth: 0,
  },
  savedItemName: {
    color: '#eee',
    fontSize: '13px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  savedItemMeta: {
    color: '#888',
    fontSize: '11px',
    marginTop: '2px',
  },
  savedItemActions: {
    display: 'flex',
    gap: '5px',
    flexShrink: 0,
  },
  actionBtn: (color) => ({
    background: color,
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    padding: '3px 8px',
    fontSize: '11px',
    cursor: 'pointer',
    fontWeight: 'bold',
  }),
};

const DEFAULT_SNIPPETS = {
  javascript: `// JavaScript\nconsole.log("Hello from MiniCoder!");\n\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet("World"));`,
  python: `# Python\nprint("Hello from MiniCoder!")\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))`,
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
  const [savedFiles, setSavedFiles] = useState(loadSavedFiles);
  const [showSaved, setShowSaved] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
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

  function handleSave() {
    const name = window.prompt('Enter a name for this file:', `untitled.${FILE_EXTENSIONS[language] || 'txt'}`);
    if (!name || !name.trim()) return;
    const entry = {
      id: Date.now().toString(),
      name: name.trim(),
      language,
      code,
      savedAt: new Date().toLocaleString(),
    };
    const updated = [entry, ...savedFiles];
    setSavedFiles(updated);
    persistSavedFiles(updated);
    setShowSaved(true);
    setSaveMsg(`✅ Saved "${entry.name}"`);
    setTimeout(() => setSaveMsg(''), 2500);
  }

  function handleDownload() {
    const ext = FILE_EXTENSIONS[language] || 'txt';
    const defaultName = `code.${ext}`;
    const name = window.prompt('Download as:', defaultName);
    if (!name || !name.trim()) return;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name.trim();
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleLoadFile(file) {
    if (window.confirm(`Load "${file.name}"? Your current unsaved code will be replaced.`)) {
      setLanguage(file.language);
      setCode(file.code);
      setOutput('');
    }
  }

  function handleDeleteFile(id) {
    const file = savedFiles.find(f => f.id === id);
    if (!file) return;
    if (window.confirm(`Delete "${file.name}"?`)) {
      const updated = savedFiles.filter(f => f.id !== id);
      setSavedFiles(updated);
      persistSavedFiles(updated);
    }
  }

  function handleDownloadFile(file) {
    const blob = new Blob([file.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
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
        <button style={styles.saveButton} onClick={handleSave}>💾 Save</button>
        <button style={styles.downloadButton} onClick={handleDownload}>⬇ Download</button>
        <button style={styles.folderButton} onClick={() => setShowSaved(s => !s)}>
          📁 My Files {savedFiles.length > 0 && `(${savedFiles.length})`}
        </button>
        {language === 'javascript' && (
          <button style={styles.button} onClick={handleRun}>▶ Run</button>
        )}
      </div>

      {saveMsg && (
        <div style={{ background: '#1a3a1a', color: '#2ecc71', fontSize: '11px', padding: '4px 12px', borderBottom: '1px solid #444' }}>
          {saveMsg}
        </div>
      )}

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

      {showSaved && (
        <div style={styles.savedPanel}>
          <div style={styles.savedPanelHeader}>
            <span style={styles.savedPanelTitle}>📁 My Saved Files</span>
            <button style={styles.actionBtn('#555')} onClick={() => setShowSaved(false)}>✕ Close</button>
          </div>
          {savedFiles.length === 0 ? (
            <div style={styles.savedEmpty}>No saved files yet. Click 💾 Save to add one.</div>
          ) : (
            savedFiles.map(file => (
              <div key={file.id} style={styles.savedItem}>
                <div style={styles.savedItemInfo}>
                  <div style={styles.savedItemName}>{file.name}</div>
                  <div style={styles.savedItemMeta}>{file.language.toUpperCase()} · {file.savedAt}</div>
                </div>
                <div style={styles.savedItemActions}>
                  <button style={styles.actionBtn('#4a9eff')} onClick={() => handleLoadFile(file)}>Load</button>
                  <button style={styles.actionBtn('#9b59b6')} onClick={() => handleDownloadFile(file)}>⬇</button>
                  <button style={styles.actionBtn('#e74c3c')} onClick={() => handleDeleteFile(file.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MiniCoder;
