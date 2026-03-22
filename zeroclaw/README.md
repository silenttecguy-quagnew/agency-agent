# ZeroClaw Agent Pack

A curated collection of production-ready [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw) agent
configurations and skills — the best ones, ready to drop in and run.

## What's Included

| Agent | Specialty | Best For |
|-------|-----------|----------|
| `researcher` | Deep web research, synthesis, source citation | Gathering and analysing information on any topic |
| `coder` | Code generation, debugging, refactoring | Building features, fixing bugs, explaining code |
| `code-reviewer` | Static analysis, AI review, severity ratings | PR reviews, pre-merge quality gates |
| `security-scanner` | CVE audit, supply chain, unsafe code, logic bugs | Pre-release hardening, dependency updates |
| `devops` | CI/CD pipelines, IaC, cloud ops, monitoring | Automating deployments, debugging infra |
| `data-analyst` | Analytics, visualisation, trend detection | Understanding data, generating reports |
| `content-writer` | Blog posts, docs, marketing copy, changelogs | Creating polished written content fast |

All seven agents are pre-wired in `config.toml` and usable as ZeroClaw skills via the
`@ZeroClaw <skill>` invocation syntax.

---

## Quick Install

### 1. Install ZeroClaw

```bash
# macOS / Linuxbrew
brew install zeroclaw

# Or clone + bootstrap (inspect before running)
git clone https://github.com/zeroclaw-labs/zeroclaw.git
cd zeroclaw && ./install.sh
```

### 2. Copy the config

```bash
cp zeroclaw/config.toml ~/.zeroclaw/config.toml
```

### 3. Set your API key

```bash
# OpenRouter gives access to every provider in one key — recommended
export ZEROCLAW_API_KEY="sk-or-..."

# Or use Anthropic / OpenAI directly
export ZEROCLAW_API_KEY="sk-ant-..."
```

### 4. Install the skills

```bash
for skill in zeroclaw/skills/*/; do
  zeroclaw skills install "$skill"
done
```

### 5. (Optional) Configure channels

```bash
zeroclaw onboard --channels-only
# Follow the prompts to connect Telegram, Discord, Slack, etc.
```

### 6. Start the runtime

```bash
zeroclaw daemon          # gateway + channels + scheduler
# or just chat:
zeroclaw agent -m "hello"
```

---

## Usage

### Invoke a sub-agent

```bash
zeroclaw agent --agent researcher -m "summarise the latest AI agent frameworks released in 2026"
zeroclaw agent --agent coder       -m "write a Rust function that retries an async operation with exponential backoff"
zeroclaw agent --agent devops      -m "generate a GitHub Actions workflow for a Rust project with caching"
```

### Invoke a skill directly

```bash
@ZeroClaw researcher --query "best open-source LLM routers 2026" --depth 3
@ZeroClaw coder --task "add pagination to the /users endpoint" --file src/routes/users.rs
@ZeroClaw code-reviewer --path src/ --strict
@ZeroClaw security-scanner --full --fail-on high
@ZeroClaw devops --deploy staging --stack docker-compose
@ZeroClaw data-analyst --input metrics.csv --describe "show weekly active users and revenue trends"
@ZeroClaw content-writer --type blog --topic "Why Rust is the future of AI infrastructure" --length 800
```

### Check everything is working

```bash
zeroclaw status
zeroclaw doctor
```

---

## Configuration

Edit `~/.zeroclaw/config.toml` to customise:

- **Provider / model** — switch between OpenRouter, Anthropic, OpenAI, Ollama, and 40+ others
- **Autonomy level** — `supervised` (default, safest), `assisted`, or `full`
- **Cost caps** — `max_cost_per_day_cents` prevents runaway spend
- **Channels** — add Telegram, Discord, Slack, WhatsApp, and 17 more

The `config.toml` in this directory is heavily commented — read it top to bottom before
deploying to a production machine.

---

## Directory Layout

```
zeroclaw/
├── README.md          ← you are here
├── config.toml        ← drop-in ZeroClaw configuration with all 7 agents
└── skills/
    ├── researcher/     SKILL.md
    ├── coder/          SKILL.md
    ├── code-reviewer/  SKILL.md
    ├── security-scanner/ SKILL.md
    ├── devops/         SKILL.md
    ├── data-analyst/   SKILL.md
    └── content-writer/ SKILL.md
```

---

## Sources

Built from the best patterns in the ZeroClaw ecosystem:

- [zeroclaw-labs/zeroclaw](https://github.com/zeroclaw-labs/zeroclaw) — official runtime
- [mk-knight23/AI-Agent-ZeroClaw](https://github.com/mk-knight23/AI-Agent-ZeroClaw) — community skills
- [Perseusmx/zeroclaw-skill](https://github.com/Perseusmx/zeroclaw-skill) — reference skill
