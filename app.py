import re
import pathlib

import streamlit as st

st.set_page_config(page_title="ZeroClaw Agent Dashboard", layout="wide")

st.title("🦀 ZeroClaw Agent Dashboard")
st.caption("7 production-ready agents — packaged and ready to use")

# ── Constants ──────────────────────────────────────────────────────────────────
REPO_ROOT = pathlib.Path(__file__).parent
SKILLS_DIR = REPO_ROOT / "zeroclaw" / "skills"
CONFIG_PATH = REPO_ROOT / "zeroclaw" / "config.toml"

AGENT_ICONS = {
    "researcher":       "🔍",
    "coder":            "💻",
    "code-reviewer":    "👁️",
    "security-scanner": "🔒",
    "devops":           "⚙️",
    "data-analyst":     "📊",
    "content-writer":   "✍️",
}


# ── Helpers ────────────────────────────────────────────────────────────────────
@st.cache_data
def load_agents():
    """Read every SKILL.md under zeroclaw/skills/ and parse frontmatter + body."""
    agents = []
    for skill_dir in sorted(SKILLS_DIR.iterdir()):
        skill_file = skill_dir / "SKILL.md"
        if not skill_file.exists():
            continue
        text = skill_file.read_text(encoding="utf-8")
        fm_match = re.match(r"^---\n(.*?)\n---\n(.*)", text, re.DOTALL)
        if not fm_match:
            continue
        frontmatter, body = fm_match.group(1), fm_match.group(2)
        name_m = re.search(r"^name:\s*(.+)$", frontmatter, re.MULTILINE)
        desc_m = re.search(
            r'^description:\s*"([^"]+)"', frontmatter, re.MULTILINE
        )
        name = name_m.group(1).strip() if name_m else skill_dir.name
        description = desc_m.group(1).strip().strip('"') if desc_m else ""
        agents.append(
            {
                "name": name,
                "description": description,
                "body": body.strip(),
                "icon": AGENT_ICONS.get(name, "🤖"),
            }
        )
    return agents


# ── Quick Start ────────────────────────────────────────────────────────────────
with st.expander("⚡ Quick Start — four commands", expanded=False):
    st.code(
        """\
# 1. Copy the config
cp zeroclaw/config.toml ~/.zeroclaw/config.toml

# 2. Set your API key (OpenRouter recommended — one key for all providers)
export ZEROCLAW_API_KEY="sk-or-..."

# 3. Install all seven skills
for skill in zeroclaw/skills/*/; do zeroclaw skills install "$skill"; done

# 4. Start the full autonomous runtime
zeroclaw daemon
""",
        language="bash",
    )
    st.info(
        "Then invoke any agent:\n\n"
        "```\nzeroclaw agent --agent researcher -m \"your question here\"\n"
        "@ZeroClaw coder --task \"add pagination to the /users endpoint\"\n```"
    )

st.divider()

# ── Agent cards ────────────────────────────────────────────────────────────────
agents = load_agents()

st.subheader(f"Agents ({len(agents)})")

cols = st.columns(3, gap="medium")
for i, agent in enumerate(agents):
    with cols[i % 3]:
        st.markdown(f"#### {agent['icon']} `{agent['name']}`")
        short_desc = agent["description"]
        # Trim to first sentence for the card summary
        first_sentence = re.split(r'[.!?]\s+', short_desc)[0].rstrip(".!?")
        st.caption(first_sentence)
        with st.expander("Usage & details"):
            st.markdown(agent["body"])

st.divider()

# ── Invocation examples ────────────────────────────────────────────────────────
with st.expander("📋 Invocation examples", expanded=False):
    st.code(
        """\
# Research
zeroclaw agent --agent researcher -m "what are the best open-source LLM routers in 2026?"

# Generate code
zeroclaw agent --agent coder -m "write a Rust function that retries an async op with exponential backoff"

# Code review
@ZeroClaw code-reviewer --path src/ --strict

# Security scan
@ZeroClaw security-scanner --full --fail-on high

# DevOps
@ZeroClaw devops --pipeline github-actions --lang python

# Data analysis
@ZeroClaw data-analyst --input metrics.csv --describe "show weekly active users and revenue trends"

# Content writing
@ZeroClaw content-writer --type blog --topic "Why Rust is the future of AI infrastructure" --length 900
""",
        language="bash",
    )

# ── Config viewer ──────────────────────────────────────────────────────────────
with st.expander("📄 zeroclaw/config.toml", expanded=False):
    if CONFIG_PATH.exists():
        st.code(CONFIG_PATH.read_text(encoding="utf-8"), language="toml")
    else:
        st.warning("config.toml not found — expected at zeroclaw/config.toml")

# Optimize for mobile/tablet
st.markdown("<style>body { font-size: 1.1em; }</style>", unsafe_allow_html=True)