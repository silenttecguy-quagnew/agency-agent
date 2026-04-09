"""
Hermes — local-only Gradio chat UI
===================================
Runs 100% offline by default using a rule-based placeholder agent.
To plug in a real local model, replace the body of `_model_reply()` below.
"""

import re
import time
import gradio as gr

# ---------------------------------------------------------------------------
# Rule-based offline agent (placeholder — no network calls, no GPU required)
# ---------------------------------------------------------------------------

_RULES = [
    (r"\bhello\b|\bhi\b|\bhey\b",          "Hey! I'm Hermes. Ask me anything."),
    (r"\bhelp\b",                           "I can answer questions, write code, review text, or just chat."),
    (r"\bwho are you\b|\bwhat are you\b",  "I'm Hermes, a local AI assistant. No cloud needed."),
    (r"\bbye\b|\bgoodbye\b|\bexit\b",       "Goodbye! Come back any time."),
    (r"\bthank",                            "You're welcome!"),
    (r"\bwrite.*code\b|\bcode.*\b",         "Sure — paste your requirements and I'll write the code."),
    (r"\breview\b",                         "Paste the text or code you'd like me to review."),
    (r"\bsummarise\b|\bsummarize\b",        "Paste the content you'd like summarised."),
]


def _rule_reply(message: str) -> str:
    lower = message.lower()
    for pattern, response in _RULES:
        if re.search(pattern, lower):
            return response
    return (
        f'You said: "{message}"\n\n'
        "(Hermes placeholder — swap `_model_reply()` for a real local model.)"
    )


# ---------------------------------------------------------------------------
# Model hook — replace this function to plug in any local model
# (e.g. llama-cpp-python, ollama, ctransformers, …)
# ---------------------------------------------------------------------------

def _model_reply(message: str, history: list) -> str:
    """
    Drop-in replacement point.  `history` is a list of [user, assistant] pairs.

    Example (llama-cpp-python):
        from llama_cpp import Llama
        llm = Llama(model_path="./models/hermes.gguf", n_ctx=2048)
        prompt = build_prompt(history, message)
        return llm(prompt, max_tokens=512)["choices"][0]["text"]
    """
    return _rule_reply(message)


# ---------------------------------------------------------------------------
# Gradio streaming wrapper
# ---------------------------------------------------------------------------

def _chat(message: str, history: list):
    reply = _model_reply(message, history)
    # Stream one character at a time so the UI feels alive
    partial = ""
    for char in reply:
        partial += char
        time.sleep(0.012)
        yield partial


# ---------------------------------------------------------------------------
# UI
# ---------------------------------------------------------------------------

with gr.Blocks(
    title="Hermes — local chat",
    theme=gr.themes.Soft(primary_hue="violet"),
    css=".contain { max-width: 780px; margin: auto; }",
) as demo:
    gr.Markdown(
        """
        # 🪽 Hermes — local chat
        *Fully offline · no API key · no cloud calls*

        This is a rule-based placeholder.  
        To use a real model, edit `_model_reply()` in `app.py`.
        """
    )

    chatbot = gr.ChatInterface(
        fn=_chat,
        chatbot=gr.Chatbot(height=460, label="Hermes"),
        textbox=gr.Textbox(placeholder="Ask Hermes anything…", scale=7),
        submit_btn="Send",
        retry_btn="↩ Retry",
        undo_btn="✕ Remove",
        clear_btn="🗑 Clear",
        examples=[
            "Hello!",
            "Who are you?",
            "Write a Python hello-world",
            "Summarize the Zen of Python",
        ],
    )


if __name__ == "__main__":
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False,
        inbrowser=True,
    )
