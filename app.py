import re
import pathlib

import streamlit as st

st.set_page_config(
    page_title="ZeroClaw Agent Dashboard",
    page_icon="🦀",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Constants ──────────────────────────────────────────────────────────────────
REPO_ROOT   = pathlib.Path(__file__).parent
SKILLS_DIR  = REPO_ROOT / "zeroclaw" / "skills"
CONFIG_PATH = REPO_ROOT / "zeroclaw" / "config.toml"

AGENT_ORDER = [
    "researcher", "coder", "code-reviewer",
    "security-scanner", "devops", "data-analyst", "content-writer",
    "hermes",
]

AGENT_ICONS = {
    "researcher":       "🔍",
    "coder":            "💻",
    "code-reviewer":    "👁️",
    "security-scanner": "🔒",
    "devops":           "⚙️",
    "data-analyst":     "📊",
    "content-writer":   "✍️",
    "hermes":           "🪽",
}


# ── Helpers ────────────────────────────────────────────────────────────────────

def _parse_skill(text, dir_name):
    """Return a dict with name, description, body, usage snippet, icon."""
    fm_match = re.match(r"^---\n(.*?)\n---\n(.*)", text, re.DOTALL)
    if not fm_match:
        return None
    frontmatter, body = fm_match.group(1), fm_match.group(2)
    name_m = re.search(r"^name:\s*(.+)$", frontmatter, re.MULTILINE)
    desc_m = re.search(r'^description:\s*"([^"]+)"', frontmatter, re.MULTILINE)
    name        = name_m.group(1).strip() if name_m else dir_name
    description = desc_m.group(1).strip() if desc_m else ""
    body        = body.strip()

    # Pull first fenced code block from the ## Usage section
    usage_match = re.search(r"## Usage\n+(```[\s\S]*?```)", body)
    if usage_match:
        usage = re.sub(r"^```\w*\n?|```$", "", usage_match.group(1),
                       flags=re.MULTILINE).strip()
    else:
        usage = ""

    return {
        "name":        name,
        "description": description,
        "body":        body,
        "usage":       usage,
        "icon":        AGENT_ICONS.get(name, "🤖"),
    }


@st.cache_data
def load_agents():
    """Load all agents in display order."""
    agents = {}
    for name in AGENT_ORDER:
        skill_file = SKILLS_DIR / name / "SKILL.md"
        if not skill_file.exists():
            continue
        parsed = _parse_skill(skill_file.read_text(encoding="utf-8"), name)
        if parsed:
            agents[name] = parsed
    return agents


@st.cache_data
def load_config():
    if CONFIG_PATH.exists():
        return CONFIG_PATH.read_text(encoding="utf-8")
    return None


def first_sentence(text):
    return re.split(r"[.!?]\s+", text)[0].rstrip(".!?")


# ── Session state ──────────────────────────────────────────────────────────────
if "page" not in st.session_state:
    st.session_state.page = "home"


def nav_to(page):
    st.session_state.page = page


# ── Load data ──────────────────────────────────────────────────────────────────
agents      = load_agents()
config_text = load_config()


# ── Sidebar ────────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## 🦀 ZeroClaw")
    st.caption("Agent Dashboard")
    st.markdown("---")

    if st.button("🏠  Home", use_container_width=True,
                 type="primary" if st.session_state.page == "home" else "secondary"):
        nav_to("home")

    st.markdown("**Agents**")
    for name, agent in agents.items():
        label = f"{agent['icon']}  {name}"
        btn_type = "primary" if st.session_state.page == name else "secondary"
        if st.button(label, key=f"nav_{name}", use_container_width=True, type=btn_type):
            nav_to(name)

    st.markdown("---")
    if st.button("⚙️  Config & Reference", use_container_width=True,
                 type="primary" if st.session_state.page == "config" else "secondary"):
        nav_to("config")

    st.markdown("---")
    st.caption(f"{len(agents)} agents loaded")


# ═══════════════════════════════════════════════════════════════════════════════
# HOME PAGE
# ═══════════════════════════════════════════════════════════════════════════════
if st.session_state.page == "home":

    st.title("🦀 ZeroClaw Agent Dashboard")
    st.markdown(
        "Seven production-ready AI agents, packaged and ready to run. "
        "Select an agent in the sidebar for full skill details and usage examples."
    )

    st.divider()

    # ── Quick Start ────────────────────────────────────────────────────────────
    st.subheader("⚡ Quick Start — four commands")

    c1, c2 = st.columns(2)
    with c1:
        st.markdown("**1 · Copy the config**")
        st.code("cp zeroclaw/config.toml ~/.zeroclaw/config.toml", language="bash")
        st.markdown("**2 · Set your API key**")
        st.code('export ZEROCLAW_API_KEY="sk-or-..."', language="bash")
    with c2:
        st.markdown("**3 · Install all seven skills**")
        st.code(
            'for skill in zeroclaw/skills/*/\n'
            '  do zeroclaw skills install "$skill"\ndone',
            language="bash",
        )
        st.markdown("**4 · Start the runtime**")
        st.code("zeroclaw daemon", language="bash")

    st.info(
        "💡 **Replit users:** just press **Run** — this dashboard starts automatically.  \n"
        "Get a free API key at **openrouter.ai** (works with Claude, GPT-4, Gemini, and 300+ more)."
    )

    st.divider()

    # ── Agent overview grid ────────────────────────────────────────────────────
    st.subheader(f"The Crew — {len(agents)} Agents")
    st.caption("Click an agent in the sidebar for its full skill spec and invocation commands.")

    cols = st.columns(3, gap="medium")
    for i, (name, agent) in enumerate(agents.items()):
        with cols[i % 3]:
            st.markdown(f"### {agent['icon']} `{name}`")
            st.caption(first_sentence(agent["description"]))
            if agent["usage"]:
                first_cmd = agent["usage"].splitlines()[0]
                st.code(first_cmd, language="bash")
            st.markdown("")


# ═══════════════════════════════════════════════════════════════════════════════
# AGENT DETAIL PAGE
# ═══════════════════════════════════════════════════════════════════════════════
elif st.session_state.page in agents:

    agent = agents[st.session_state.page]

    st.title(f"{agent['icon']} `{agent['name']}`")
    st.markdown(f"*{agent['description']}*")
    st.divider()

    # ── Invocation / usage ─────────────────────────────────────────────────────
    st.subheader("Invocation Commands")
    if agent["usage"]:
        st.code(agent["usage"], language="bash")
    else:
        st.code(f"@ZeroClaw {agent['name']}", language="bash")

    st.divider()

    # ── Full skill reference ───────────────────────────────────────────────────
    st.subheader("Skill Reference")
    st.markdown(agent["body"])


# ═══════════════════════════════════════════════════════════════════════════════
# CONFIG & REFERENCE PAGE
# ═══════════════════════════════════════════════════════════════════════════════
elif st.session_state.page == "config":

    st.title("⚙️ Config & Reference")
    st.markdown(
        "Drop `zeroclaw/config.toml` into `~/.zeroclaw/config.toml`, "
        "set `ZEROCLAW_API_KEY`, and run `zeroclaw daemon`."
    )
    st.divider()

    # ── Full config ────────────────────────────────────────────────────────────
    st.subheader("📄 zeroclaw/config.toml")
    if config_text:
        st.code(config_text, language="toml")
    else:
        st.warning("config.toml not found — expected at `zeroclaw/config.toml`")

    st.divider()

    # ── All invocation examples ────────────────────────────────────────────────
    st.subheader("📋 All Invocation Examples")
    all_examples = "\n\n".join(
        f"# {a['name']}\n{a['usage']}" for a in agents.values() if a["usage"]
    )
    st.code(all_examples, language="bash")

    st.divider()

    # ── Daemon invocation style ────────────────────────────────────────────────
    st.subheader("zeroclaw agent --agent … syntax")
    st.code(
        """\
zeroclaw agent --agent researcher       -m "latest AI agent frameworks in 2026"
zeroclaw agent --agent coder            -m "add rate limiting to my Express API"
zeroclaw agent --agent code-reviewer    -m "review src/ before merge"
zeroclaw agent --agent security-scanner -m "full audit before release"
zeroclaw agent --agent devops           -m "GitHub Actions CI for Python monorepo"
zeroclaw agent --agent data-analyst     -m "analyse metrics.csv for weekly trends"
zeroclaw agent --agent content-writer   -m "write a 900-word blog post on Rust + AI"
""",
        language="bash",
    )