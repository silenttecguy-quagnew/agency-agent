---
name: hermes
description: "Fast, private, conversational AI agent powered by a local Ollama gemma4 model. Invoke for general-purpose Q&A, ideation, summarisation, drafting, translation, or any task that benefits from a low-latency, fully offline assistant. Trigger keywords: 'ask', 'chat', 'help me', 'summarise', 'explain', 'draft', 'translate', 'brainstorm', 'what is', 'quick question'."
---

# hermes

Your local, private messenger. Zero cloud calls — pure Ollama gemma4 speed.

## Usage

```
@ZeroClaw hermes --message "explain how transformers work in plain English"
@ZeroClaw hermes --message "brainstorm five product names for an AI dev tool"
@ZeroClaw hermes --message "translate this paragraph to French" --file docs/README.md
@ZeroClaw hermes --message "summarise this meeting transcript" --file notes.txt
@ZeroClaw hermes --chat                # open an interactive session
@ZeroClaw hermes --message "review my email draft" --file draft.txt --tone professional
```

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--message` | The prompt or question to send (required unless `--chat`) | — |
| `--file` | Path to a file whose content is appended as context | — |
| `--chat` | Open an interactive multi-turn session | false |
| `--tone` | Desired output tone: `casual` \| `professional` \| `technical` | `casual` |
| `--format` | Output format: `prose` \| `bullets` \| `json` | `prose` |
| `--max-tokens` | Maximum tokens in the response | 1024 |
| `--temperature` | Sampling temperature (0 = deterministic, 1 = creative) | 0.7 |

## What It Does

1. **Routes locally** — Every request goes directly to the Ollama daemon on `localhost:11434`. No data leaves your machine.
2. **Contextualises** — If `--file` is provided, the file content is injected before the user message so Hermes has full context.
3. **Responds fast** — gemma4 on Ollama is optimised for low-latency inference; typical responses arrive in under a second on modern hardware.
4. **Multi-turn** — `--chat` mode maintains a conversation history in memory so follow-up questions work naturally.
5. **Remembers** — Key facts from conversations are optionally saved to ZeroClaw memory under `hermes/<date>/<slug>` for recall in future sessions.

## Ollama Setup

Hermes requires the Ollama daemon and the gemma4 model to be available locally.

```bash
# Install Ollama (macOS / Linux)
curl -fsSL https://ollama.com/install.sh | sh

# Pull the gemma4 model
ollama pull gemma4

# Verify the daemon is running
ollama list
```

The ZeroClaw config connects to `http://localhost:11434` by default. Override with the `OLLAMA_HOST` environment variable if your daemon is on a different host or port.

## Example Interactions

```
You:    explain the CAP theorem in two sentences
Hermes: In a distributed system you can guarantee at most two of the three
        properties — Consistency, Availability, and Partition tolerance.
        When a network partition occurs you must choose: stay consistent
        (reject writes) or stay available (risk stale reads).

You:    give me a Python snippet that demonstrates it
Hermes: [writes a working code example]
```

## Privacy Guarantee

All inference runs inside your local Ollama process. No request payload, response, or metadata is sent to any external service. Hermes is the right agent for sensitive documents, internal data, and air-gapped environments.

## Philosophy

Hermes — the messenger of the gods — is fast, reliable, and moves between worlds without friction. This agent embodies the same ideals: instant responses, zero latency, complete privacy, and the ability to carry any message you need delivered.
