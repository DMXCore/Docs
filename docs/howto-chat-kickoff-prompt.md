# Kickoff prompt (paste into a new chat)

Workspace: `D:\Projects\DMXCore`. Read the plans before coding.

---

Implement the DMX Core 100 **how-to help agent** (teach-only). Do not invent
scope: follow the plans and the GitHub issues.

**Read first**

1. `Docs/docs/howto-chat-plan.md` — product intent, grants, snapshot layout, Seq, cost
2. `Docs/docs/howto-chat-implementation-plan.md` — what to build in which repo, ship order
3. `Docs/docs/howto-recipes/AGENTS.md` — only if capturing a support question as a recipe

**Issues**

- Core snapshot: https://github.com/DMXCore/DmxCore100-Software/issues/128
- Portal + DeviceApi: https://github.com/DMXCore/AdminPortal/issues/28
- Docs copilot (Phase 1) is not filed; it is §1 of the implementation plan

**Non-goals**

- Writable MCP / applying setup for the user
- Reusing on-device MCP (that is live lighting control)
- Feeding a backup zip or SQLite dump to the model
- Running the LLM on the CM4
- Blocking on a large eval set (almost no real tickets; recipes grow in `Docs/docs/howto-recipes/`)

**Repos**

| Path | Repo |
|------|------|
| `100/Software` | DmxCore100-Software |
| `DeviceApi` | DeviceApi |
| `AdminPortal` | AdminPortal |
| `Docs` | Docs |

Ship order for the full product is Core → DeviceApi → Portal. **This session is Phase 1 only.** Core issue 128 is being done in a separate session — do not implement snapshot, `SnapshotNow`, DeviceApi, or Portal unless I explicitly ask.

**Unless I name a slice, start with the Docs copilot (§1):** plumbing + a v1 that can ship on docs.dmxcore.com. That means corpus index (chunk Starlight markdown, screenshot catalog from `SHOTS` + markdown image refs), Azure orchestrator (streaming chat, `search_docs` / `get_page` / `get_screenshot`, session store, walkthrough JSON), Starlight widget with checkable steps, and a **Continue with my device** deep link (`portal.dmxcore.com/help?continue={sessionId}` — portal side is later). No device snapshot. BM25 is fine if embeddings are not wired yet. Propose the file list, then implement.

If I say **Core 128**, do the snapshot builder only (that work may already be in flight elsewhere — check git status first).

If I paste a ticket/email/phone notes, add a recipe under `Docs/docs/howto-recipes/` per `AGENTS.md` and stop.
