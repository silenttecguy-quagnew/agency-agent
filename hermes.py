#!/usr/bin/env python3
"""
hermes.py — standalone NousResearch Hermes 3 chat
==================================================
Run:
    pip install openai
    export ZEROCLAW_API_KEY="sk-or-..."   # your OpenRouter key
    python hermes.py

Or pass a single message directly:
    python hermes.py "explain async/await in Python"

Model: nousresearch/hermes-3-llama-3.1-405b  (via OpenRouter)
Swap to the 70B for speed:  HERMES_MODEL=nousresearch/hermes-3-llama-3.1-70b python hermes.py
"""

import os
import sys

try:
    from openai import OpenAI
except ImportError:
    sys.exit("Missing dependency — run: pip install openai")

# ── Config ────────────────────────────────────────────────────────────────────
API_KEY = os.environ.get("ZEROCLAW_API_KEY") or os.environ.get("OPENROUTER_API_KEY")
MODEL   = os.environ.get("HERMES_MODEL", "nousresearch/hermes-3-llama-3.1-405b")

if not API_KEY:
    sys.exit(
        "No API key found.\n"
        "Set your OpenRouter key:  export ZEROCLAW_API_KEY=sk-or-...\n"
        "Get one free at:          https://openrouter.ai/keys"
    )

client = OpenAI(
    api_key=API_KEY,
    base_url="https://openrouter.ai/api/v1",
)

SYSTEM = (
    "You are Hermes — a highly capable AI agent built on NousResearch Hermes 3 "
    "(Llama 3.1 405B). You excel at complex reasoning, step-by-step planning, "
    "structured output, and precise instruction following. "
    "Be direct, thorough, and always show your reasoning."
)

# ── Single-shot mode (argument passed on CLI) ─────────────────────────────────
def one_shot(prompt: str) -> None:
    print(f"\n🪽 Hermes ({MODEL})\n")
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system",    "content": SYSTEM},
            {"role": "user",      "content": prompt},
        ],
        stream=True,
    )
    for chunk in response:
        delta = chunk.choices[0].delta.content
        if delta:
            print(delta, end="", flush=True)
    print("\n")

# ── Interactive chat loop ─────────────────────────────────────────────────────
def chat_loop() -> None:
    print(f"\n🪽  Hermes  |  {MODEL}")
    print("    Type your message and press Enter.  Ctrl+C or 'exit' to quit.\n")

    history: list[dict] = [{"role": "system", "content": SYSTEM}]

    while True:
        try:
            user_input = input("You: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nGoodbye.")
            break

        if not user_input:
            continue
        if user_input.lower() in {"exit", "quit", "bye"}:
            print("Goodbye.")
            break

        history.append({"role": "user", "content": user_input})

        print("\nHermes: ", end="", flush=True)
        reply_parts: list[str] = []

        try:
            stream = client.chat.completions.create(
                model=MODEL,
                messages=history,
                stream=True,
            )
            for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    print(delta, end="", flush=True)
                    reply_parts.append(delta)
        except Exception as exc:
            print(f"\n[Error: {exc}]")
            history.pop()  # remove the failed user turn
            continue

        full_reply = "".join(reply_parts)
        history.append({"role": "assistant", "content": full_reply})
        print("\n")

# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    if len(sys.argv) > 1:
        one_shot(" ".join(sys.argv[1:]))
    else:
        chat_loop()
