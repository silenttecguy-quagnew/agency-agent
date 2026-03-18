import streamlit as st
import requests

# Set the title of the app
st.title('Agent Dashboard')

# Fetch agents from the msitarzewski/agency-agents repository
@st.cache
def fetch_agents():
    response = requests.get("https://api.github.com/repos/msitarzewski/agency-agents/contents/agents")
    agents = response.json()
    return agents

agents = fetch_agents()

# Organize by category
categories = {}
for agent in agents:
    category = agent['category']
    if category not in categories:
        categories[category] = []
    categories[category].append(agent)

# Display agents
for category, agents in categories.items():
    st.subheader(category)
    for agent in agents:
        st.write(f"**Name:** {agent['name']}")  # Adjust based on actual agent structure
        st.write(f"**Description:** {agent['description']}")  # Adjust based on actual agent structure
        st.write(f"**Execution Capabilities:** {agent['capabilities']}  # Adjust based on actual agent structure
        st.write("---")

# Optimize for mobile/tablet
st.markdown('<style>body { font-size: 1.5em; }</style>', unsafe_allow_html=True)