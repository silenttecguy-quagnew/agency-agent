# 🦀 ZeroClaw Agent Dashboard

Two dashboards for the ZeroClaw agent pack — one Streamlit app and one React app — both loading the seven production-ready agents directly from the `zeroclaw/skills/` definitions.

## Agents

| Agent | Icon | Specialty |
|-------|------|-----------|
| `researcher` | 🔍 | Deep web research, synthesis, source citations |
| `coder` | 💻 | Code generation, debugging, refactoring |
| `code-reviewer` | 👁️ | Static analysis + AI review, severity ratings |
| `security-scanner` | 🔒 | CVE audit, secrets detection, injection patterns |
| `devops` | ⚙️ | CI/CD pipelines, Dockerfiles, Kubernetes, Terraform |
| `data-analyst` | 📊 | EDA, trend detection, actionable recommendations |
| `content-writer` | ✍️ | Blog posts, docs, changelogs, READMEs |

---

## Running on Replit

The repo is pre-configured for Replit — just hit **Run**:

```
run = "streamlit run app.py"
```

Replit will install dependencies from `requirements.txt` and open the Streamlit dashboard at the provided URL.

---

## Running Locally

### Streamlit dashboard

```bash
pip install -r requirements.txt
streamlit run app.py
# opens http://localhost:8501
```

### React dashboard (dev server)

```bash
npm install
npm start
# opens http://localhost:3000
```

### React dashboard (GitHub Pages deploy)

```bash
npm run deploy
# deploys to https://silenttecguy-quagnew.github.io/agency-agent/
```

---

## Using the ZeroClaw agents

### 1. Copy the config

```bash
cp zeroclaw/config.toml ~/.zeroclaw/config.toml
```

### 2. Set your API key

```bash
# OpenRouter — one key for 300+ models (recommended)
export ZEROCLAW_API_KEY="sk-or-..."
```

### 3. Install skills

```bash
for skill in zeroclaw/skills/*/; do
  zeroclaw skills install "$skill"
done
```

### 4. Start the runtime

```bash
zeroclaw daemon
```

### 5. Invoke an agent

```bash
zeroclaw agent --agent researcher -m "latest AI agent frameworks in 2026"
zeroclaw agent --agent coder      -m "add rate limiting to my Express API"
zeroclaw agent --agent devops     -m "GitHub Actions CI pipeline for Python"
@ZeroClaw security-scanner --full --fail-on high
@ZeroClaw data-analyst --input metrics.csv --describe "weekly active users"
```

---

## Project structure

```
├── app.py                  ← Streamlit dashboard (reads SKILL.md at runtime)
├── requirements.txt        ← Python deps (streamlit, pandas, plotly, ...)
├── package.json            ← React app (npm start / npm run deploy)
├── src/
│   ├── App.js              ← Dashboard — fetches public/skills/ at runtime
│   ├── SkillPanel.js       ← Markdown renderer for skill bodies
│   ├── MiniCoder.js        ← Inline editor for usage snippets
│   └── index.js
├── public/
│   ├── index.html
│   └── skills/             ← Static copies of SKILL.md files (served to browser)
│       ├── index.json      ← Ordered agent registry
│       ├── researcher.md
│       └── ... (one per agent)
└── zeroclaw/
    ├── config.toml         ← Drop into ~/.zeroclaw/config.toml
    └── skills/
        ├── researcher/     SKILL.md
        ├── coder/          SKILL.md
        └── ... (one per agent)
```
