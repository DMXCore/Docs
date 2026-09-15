Internal design notes for the documentation site. These files are **not**
published to docs.dmxcore.com (Starlight only reads `src/content/docs`).

| Path | What |
|------|------|
| `howto-chat-plan.md` | Product plan for the how-to assistant |
| `howto-chat-implementation-plan.md` | Cross-repo engineering spec |
| `howto-chat-kickoff-prompt.md` | Paste into a new coding session |
| `howto-recipes/` | Use-cases captured from support; gold paths for the copilot |

Phase 1 of the copilot is built: corpus index (`scripts/build-help-index.mjs`),
widget (`src/components/HelpWidget.astro`, `src/help-widget/`), and the chat API
in the sibling `HelpApi` repo (see its README for deploy and configuration).
