# DMX Core 100 how-to chat — implementation plan

Teach-only assistant. Generic help from the published docs with no device
data. Configuration snapshot and Seq logs only for devices the account has
granted in the portal. The agent never writes to a device. Local MCP stays
live playback and levels — a different product.

## Non-goals

- Writable MCP / “do the setup for me”
- Feeding a backup zip or SQLite dump to the model
- Running the LLM on the CM4 (the product is designed to run offline)
- Accepting a typed hardware ID as proof of ownership
- Reusing Device Settings → Enable MCP Server, or the planned MCP cloud-relay
  card, for this assistant

## Phases

| Phase | What | Notes |
|-------|------|--------|
| **1. Docs copilot** | Public chat on docs.dmxcore.com | Retrieval over Starlight + screenshots. Checkable walkthroughs. CTA to continue in the portal. **This is the first ship.** |
| **2. Device-aware** | Portal grant + config snapshot + optional Seq | Same chat, now able to name *this* unit’s fixtures, universes, and recent errors. |
| **3. Actuating agent** | Out of scope | Teach the operator to click through the Web UI. |

## Status (2026-09-15)

Per-requirement evidence: [`howto-chat-status.md`](howto-chat-status.md).
The plan for what remains: [`howto-chat-gap-plan.md`](howto-chat-gap-plan.md).

| Piece | Where | State |
|-------|-------|-------|
| Docs copilot (Phase 1) | Docs widget + [HelpApi](https://github.com/DMXCore/HelpApi) at `helpapi.dmxcore.com` (`bd6bcd2`, deployed) | **Live** on docs.dmxcore.com: BM25 retrieval, in-chat checklists, screenshots, 👍/👎, redacted transcripts (1 year), validation of docs URLs, screenshot ids, UI names and menu paths. **Partial:** no cost budget, and the daily turn limit resets on scale-to-zero. Tool errors and checklist labels aren't redacted in transcripts (one Seq line carries model text). **Continue with my device** is built but hidden (`HELP_CONTINUE_URL` unset). Embeddings, recipe evals and model comparison belong to the quality workstream |
| Config snapshot builder | Core [#128](https://github.com/DMXCore/DmxCore100-Software/issues/128) (`1f087698`, from `v2026.914.1`) | Done. **Defect:** free-text timeline codes give file names DeviceApi rejects, which drops the whole capture. The empty-show test doesn't build the zip |
| Snapshot relay (`SnapshotNow`, `CONFIGSNAPSHOT`, `device-snapshots`) | DeviceApi (`44028e0`, deployed) | Done. **Partial:** a rejected capture is only logged, so the portal keeps showing the old one. Controller and TUS tests missing. The container is created at startup rather than in bicep |
| Grants, handoff, snapshot and logs endpoints, session context for the orchestrator | AdminPortal [#28](https://github.com/DMXCore/AdminPortal/issues/28) (`b484c42` … `31adfea`, deployed; issue closed) | Done; docs handoff verified in prod. **Partial:** **Ask for help** creates 32-char hex session ids that HelpApi can't use. Deleting a device that has a help session fails. No session retention. No version gate for devices without `SnapshotNow`. No download inventory. No frontend tests |
| Navigation document | Core [#129](https://github.com/DMXCore/DmxCore100-Software/issues/129) (`96c5e43d`, from `v2026.914.2`) | Done in Core; **not used by the copilot**. There is no release-pinned copy it could reach (the repo is private, with no releases). Web activity paths don't match its screen paths; Uno paths do |
| User activity events in Seq | Core [#130](https://github.com/DMXCore/DmxCore100-Software/issues/130) (`72917354`) + AdminPortal (`c60c021`) | Done; returned by the portal logs endpoint. **Unverified:** touchscreen events from Release builds, and where the Seq `Service` property the portal filters on comes from |
| Signed-in chat with device tools | HelpApi + portal help view | **Not started.** No credential design works yet: 15-min portal tokens with cookie refresh can't be held by HelpApi. The gap plan proposes a scoped help-agent token. Also missing: per-turn session context, `list_sections` / `get_section` / `get_recent_logs`, session binding, portal CORS, and the chat UI in the portal |

---

## Phase 1 — Docs copilot (what to build)

A widget on docs.dmxcore.com that answers how-to from the published corpus,
with screenshots and a structured checklist. No device connection. The two
example prompts work as generic walkthroughs.

### What already exists

| Asset | Where | Use |
|-------|-------|-----|
| ~97 Starlight pages | `src/content/docs/dmx-core-100/` | Primary knowledge. Quick Start already covers fixture setup and recording. |
| Screenshot pipeline | `scripts/capture-web-screenshots.mjs`, `capture-uno-screenshots.mjs` | `public/assets/web/*.png` and `public/assets/device/uno-*.png`. |
| Pagefind | `dist/pagefind/` after `astro build` | Client search only — not sufficient as the agent’s retrieval. |
| Common Tasks | 2 guides today | The real content gap. Chat quality tracks recipe coverage more than model choice. |
| Azure Static Web Apps | docs.dmxcore.com | The **UI** can live here. The **chat API** cannot — it needs a server. |

### Required pieces

#### 1. Corpus index (rebuild on every docs deploy)

Chunk the Starlight markdown by heading. Keep with each chunk: slug, title,
heading path, and any screenshot paths referenced in that section.

Do **not** stuff the whole tree into the prompt. ~97 pages is small enough to
re-index on deploy, large enough to drown a context window if dumped.

A screenshot catalog (id → PNG path, alt, docs slug) lets the model attach
the right image to a walkthrough step. Source of truth for ids: the `SHOTS`
array in the capture scripts plus the markdown `![alt](/assets/...)` refs.

#### 2. Chat API (Azure, next to DeviceApi — not on the device)

Streaming chat. System prompt: how-to only; cite a docs URL or say you don’t
know; never invent menu names or buttons; emit a walkthrough object, not a
prose numbered list.

Tools for v1:

| Tool | Purpose |
|------|---------|
| `search_docs` | Keyword / embedding search over chunks |
| `get_page` | Fetch one page (or a heading section) by slug |
| `get_screenshot` | Fetch catalog metadata + URL for a screenshot id |

Rate-limit the public endpoint (abuse / cost). No portal login required.

#### 3. Widget on the Starlight site

Overlay or sidebar on docs.dmxcore.com. Streaming markdown for asides; the
**steps** render as checkboxes from a structured `walkthrough` payload:

```json
{
  "id": "add-fixture-robe-spot-170",
  "title": "Add a Robe Spot 170 AT",
  "steps": [
    { "id": "search-lightkey", "label": "Open the Lightkey fixture library and search Robe Spot 170 AT", "docsUrl": "…", "screenshotId": null },
    { "id": "upload-profile", "label": "Lighting Setup → Fixtures → Add → Add profile, upload the .lightkeyfxt file", "screenshotId": "add-fixture-profile" }
  ]
}
```

Checking a box PATCHes the chat session. The next model turn includes
completed step ids so it can expand the current step if they are stuck.

CTA: **Continue with my device** → portal handoff (see below). For Phase 1
this can be a deep link; the portal side of the handoff is Phase 2.

#### 4. Session store

Short-lived sessions: messages, walkthrough progress, continue token (used
when they hop to the portal). Not a hardware ID.

#### 5. Recipes and eval (separate session, then grow)

There is almost no installer-ticket history (a couple of phone calls). Do
**not** invent a 50-question “real” eval set or block the copilot on
content we do not have.

**Later (separate chat):** draft candidate how-to recipes from the published
docs (Quick Start, fixture setup, recording, Inputs, Advatek, Q-SYS, …).
You review which ones are likely in the field. Store them as files in
`docs/howto-recipes/` (see that folder’s `AGENTS.md`). Those become:

- Common Task / walkthrough gold paths (steps bound to screenshot ids)
- Eval cases (menu names, universe numbering, matching screenshot)

**After ship:** any real question from a session gets added to
`docs/howto-recipes/` from the ticket/email/notes. That is how accuracy
improves — not a one-time dump.

The two prompts already used as examples (Robe fixture at an address;
record Art-Net from Lightkey) are the obvious first gold paths when that
review happens.

Pin the corpus to the **currently published** docs train so the chat does
not describe UI that is not on the site yet.

#### 6. Navigation document (Core #129)

Core generates `docs/generated/navigation.yaml` from source on every build
(Vue router and field schemas, Uno menus, settings pages): every Web UI and
touchscreen screen with its path (`Web > Lighting > Presets > Details`,
`Uno > Utilities > Device Operations > Restart`), route, fields (label, key,
type), list columns, actions, and availability conditions (license, hidden
features). It ships inside the app (`Shared.csproj` content) and as a build
artifact; CI warns when it is stale.

It is device-independent, so it belongs in Phase 1:

- **Retrieval** for "where do I set X" questions the prose docs do not
  answer, as a tool (screen / field / action lookup), not as prompt text.
- **Source of truth for UI names.** The checklist validator already rejects
  bold UI names and menu paths that are not in the docs text; the navigation
  document is the authoritative list, and it catches docs that lag the UI.
- **Pin to the published release**, like the docs corpus: use the file from
  the Core release the docs describe, not `main`, so the chat never names a
  screen users do not have yet.

The same `Web > …` / `Uno > …` paths name the user activity events in Seq
(#130), so Phase 2 can relate "what the user did" to "where that screen is".

### Not required for Phase 1

Config snapshot, Seq, portal grant, device online, MCP, website JWT.

### Suggested stack (Phase 1)

- Chat API: Azure (Container App or Functions) with the same org as DeviceApi.
- Model: a current tool-calling chat model (provider is swappable). Shipped on
  GPT-4.1 mini; live answers still invent menu paths, so compare stronger
  models on the recipe evals before settling. First impressions matter more
  than token cost at this volume.
- Retrieval: embeddings over chunks, rebuilt in the docs deploy pipeline
  (or a post-deploy webhook). BM25 alone is a fine fallback for v0.
- Frontend: small Starlight-injected widget; CORS allow `docs.dmxcore.com`.
- Secrets: model API key in Azure; never in the static site.

### Effort (Phase 1)

Roughly 2–4 weeks of engineering. Recipe drafting and review is a separate
session, not a Phase 1 gate. The chat UI is the easy part.

### Running cost (low volume)

Pay-as-you-go. Do **not** buy Azure OpenAI PTUs (those are tens of thousands
per month of reserved capacity).

At a few dozen to a few hundred conversations a month, **tokens dominate**.
The orchestrator is nearly free if Container Apps scales to zero.

Ballpark (Azure OpenAI Global Standard, ~8 turns/conversation):

| Load | GPT-4.1 mini | GPT-4.1 |
|------|----------------|---------|
| ~30 chats/month | a few dollars | ~$5–15 |
| ~300 chats/month | ~$10 | ~$40–60 |

Embeddings for ~97 docs pages are cents per re-index. Session blob storage
is pennies. Scale-to-zero Container Apps: ~$0 idle; min-replicas=1 is a few
dollars/month if you want no cold start.

Cap daily spend on the Azure OpenAI resource so a scrape cannot run away.


---

## Phase 2 — Device-aware help (later)

### Portal grant

A **Help agent** card on the device page, next to Tunnel and Cloud Backup.
Two independent standing switches (not a tunnel timeout):

| Control | Effect |
|---------|--------|
| Allow configuration snapshot | Chat may capture and read the redacted section files for this device. |
| Allow diagnostic logs | Chat may query Seq for this HardwareId (12-character prefix), filtered and capped. |

Permission: `devices.operate` (same as Backup now). Viewer cannot grant.
Audit: who, which boxes, when. Turning a switch off drops those tools on the
next chat turn.

This is **not** Device Settings → Enable MCP Server and **not** the planned
MCP cloud-relay card. Those are live lighting control.

The portal already has the hardware ID (CopyableId shows the same 12-char
prefix Seq stores as `HardwareId`). Do not accept a pasted HWID.

### Handoff from docs

1. Generic chat on docs.dmxcore.com. CTA: **Continue with my device**.
2. Portal sign-in. Carry a continue token so the thread and checklist are
   not lost.
3. Pick a device (name, last seen, online). One device → skip picker.
4. If Help agent is off, show the two switches. They can proceed with
   neither and stay generic.
5. Resume in the portal help agent, scoped to that device.

Starting already in the portal skips 1–2: **Ask for help** on the device
page is step 5 with the device already chosen.

In-depth help requiring a portal account is accepted.

### Config snapshot (new format — not a backup)

Do not feed a backup to the model. Today’s backup is SQLite + JSON sidecars
+ cue/sound blobs. Even the cloud zip (which omits `.cap` / `.wav`) still
holds API keys, user hashes, plugin MQTT passwords, and `Preset.Content`.

New versioned inventory, built on the device from the same list projections
the Web UI already uses. Upload as **one zip**, serve as **files**.

Device builds a folder, zips it, uploads once (same atomic pattern as
`BackupNow`). Portal/chat API unpacks to
`device-snapshots/{serial}/{captureId}/` so `get_section` is a single blob
GET.

```
manifest.json              always first: counts, bytes, one-line summaries
device.json
outputs.json
inputs.json
protocol.json              OutputConfig subset (merge, frequency, routing)
settings.json              explicit HostConfig allowlist only
fixtures.json
profiles/index.json
profiles/{id}.json         full channel map — only when discussing that profile
cues.json / presets.json / sounds.json     metadata only
timelines/index.json
timelines/{code}.json
schedules.json, triggers.json, …           omit empty sections
```

Do **not** split one file per cue. Split further only where a file can get
fat (pixel profile channel maps, timeline event lists).

Transport clone of cloud backup:

| Hop | Reuse | New |
|-----|-------|-----|
| Portal | `devices.operate`, 202/409 if offline | `POST /devices/{id}/config-snapshot`, `GET` latest |
| DeviceApi | SignalR `BackupNow` | `SnapshotNow`; blob prefix `device-snapshots/{serial}/` |
| Core | TunnelService fire-and-forget; existing list queries | `BuildConfigSnapshot()` → folder of JSON, redact, zip, upload |
| Chat API | Portal session knows the device | `list_sections`, `get_section`, `get_recent_logs` |

Not restorable. Must never appear in Backup & Restore. Show “captured 12 min
ago” and Refresh. Keep last N snapshots.

#### Include

Device identity (nickname, version, 4.3 / 7 / desktop, local IP), outputs,
inputs (mapping + recording protocol + routing switch), fixtures, profile
index, cue/preset/sound metadata (no frames, looks, or audio), timeline
indexes, schedules, triggers, installed plugins, control surfaces.

#### Exclude

Cue `.cap` / `.dmx` / `.idx`, sound audio, `Preset.Content`, visualizer
photos, `Api` keys, user password hashes, unlock PIN, MQTT / VNC / plugin
setting **values**, audit log, application logs, Wi-Fi secrets, raw SQLite,
whole `HostConfig.json`.

### settings.json — HostConfig allowlist

Copy **named** properties. Never serialize HostConfig as a whole. A unit
test fails if a public `HostConfig` property is neither allowlisted nor on
the deny list.

**Allow** (helps how-to):

- Identity / locale: `DeviceNickname`, `ShowName`, `DisplayNameInsteadOfCode`,
  `DisplayTimeZone`, `Culture`, `Location`, `OverrideHostName`,
  `WhiteLabelEnabled`
- Playback / UI: `EnableMultiZonePlayback`, `ConcurrentSoundPlayback`,
  `ReentrantPlayback`, `CustomMenuOnly`, `AdminLockDown`, `RecordOnlyForAdmin`,
  `HideFixtureFeature`, `HideRemoteControlFeature`,
  `StopOutputAvailableWhenLockDown`
- Ports / remote: `OscPort`, `LocalHttpPort`, `LocalHttpsPort`,
  `McpServerEnabled`, `IntegrationApiEnabled`, `TunnelConnectionEnabled`,
  `TunnelProxyEnabled`, `InternetPassthroughEnabled`
- MQTT (no password): `ExternalMqttEnabled`, `ExternalMqttServer`,
  `ExternalMqttPort`, `ExternalMqttUsername`, plus `hasPassword: bool`
- Audio / time / plugins: `DisableAudio`, `AudioFrequency`, `HasAudioBoard`,
  `CustomNtpServer`, `PluginUpdatePolicy`, `IncludePrereleasePlugins`,
  `ReleaseChannel`
- Operator UX: `LockScreenSeconds`, `HoldToConfirmMS`, `UseUpDownForPinInput`,
  `WrapNavigationKnob`, `DisplayHostName`, `HideOnScreenClock`, `FullScreen`,
  `CloseToTray`, `ExternalDisplay`, `InstallerName`

**Deny** (never copy): `ScreenUnlockPin`, `FixedVncPassword`,
`ExternalMqttPassword`, `JwtKey`, `ClientKey`, `LicenseString`, `InstanceId`,
`AcnSourceId`, `QSysDspServer`, `SymetrixServer`, `AutoLogonUserId`. For PIN /
VNC, emit `screenUnlockConfigured` / `vncPasswordConfigured` only.

`PluginFeeds` is deferred (may be private enterprise URLs).

Merge, frequency, recording protocol, and routing live on **OutputConfig** —
those stay in `protocol.json`.

### Seq logs

Devices already ship Verbose events to central Seq (`MachineName`,
`HardwareId` = first 12 chars of the full id, `BalenaName`, `AppVersion`).
The chat **backend** queries Seq; the model never gets a Seq API key.

Do not dump the last X hours of Verbose.

| Rule | Why |
|------|-----|
| Scope to this device | `HardwareId` **and** `Service = 'DmxCore100'` (cloud services share the Seq tenant). Never fleet-wide. |
| Default window 2 hours, cap ~100 events | Warning+ always; Information from every device source except the embedded web server's framework chatter, at most 5 per source (health and update polling log every minute). |
| Strip `ClientIp`, mask tokens, truncate exceptions | Logs can carry LAN addresses, JWTs and request paths. |
| Tool `get_recent_logs` | Short summary. “Preview started, no packets” → point at Inputs. |
| Grant | Logs tool stays off unless that box is on for this device. |

The on-device audit log is too thin for this (no fixture save / import).

#### User activity (Core #130)

Core logs **what the user did** — on the web API, touchscreen, Integration
API and MCP — as Debug `UserActivity` events: `ActivitySource`,
`ActivityEntity`, `ActivityVerb`, `ActivityEntityId`/`Name`,
`ActivityOutcome` (Ok / Failed / Denied / Cancelled), `ElapsedMs`. Messages
read like `Activity Web > Cue > Save - id 123` or
`Activity Uno > Utilities > Device Operations > Restart (Cancelled)`. Nothing
is stored on the device; it only goes to Seq. User names stay in properties
and never reach the model.

The portal logs endpoint adds up to 30 of these (`Has(UserActivity)`) next to
the filtered events, newest first. Uses in chat:

- Know where the user has been and what they last changed ("you saved the
  input mapping 2 minutes ago, but recording protocol is still sACN").
- Explain failures and denials (`Failed`, `Denied` — e.g. an admin-only
  screen).
- Paths match the navigation document (#129), so the agent can point to the
  exact screen and field.

Auto-checking walkthrough steps from these events ("saved Inputs" → tick the
mapping step) is a later option, not v1: it must stay a suggestion the user
confirms.

### Worked examples (Phase 2)

**Robe Spot 170 AT @ address 100, universe 1.** Snapshot: no Robe profile
yet; default sACN output covers universe 1; address 100 is free or collides.
Reply: import Lightkey/GDTF (or AI-from-manual), Fixtures → Add, personality
matching the fixture’s mode, start 100 / universe 1, with screenshot.

**Record Art-Net 5–7 from Lightkey.** Snapshot: inputs are sACN 1–4;
recording protocol is sACN; routing off; device IP is 192.168.1.40. Reply:
add three Art-Net mapping rows, switch recording protocol, point Lightkey at
that IP, Utilities → Record → Preview. Call out 0- vs 1-based Art-Net and
the same-PC ignore gotcha.

---

## Suggested build order

1. ✅ Corpus index + chat API + Starlight widget + walkthrough checklists
   (**Phase 1**). Candidate recipes + eval cases in a later review session.
2. ✅ Portal Help agent card + handoff (continue token, device picker).
3. ✅ Snapshot schema + `BuildConfigSnapshot()` + `SnapshotNow` + unpack-to-blobs.
   Can ship as “download inventory” on the device page before the chat uses it.
4. ✅ Navigation document (#129) and user activity events (#130) in Core; the
   portal logs endpoint returns the activity events.
5. Recipe evals + model comparison; navigation document into the copilot
   (lookup tool + UI-name validation).
6. Wire `list_sections` / `get_section` into the signed-in chat (HelpApi reads
   the portal session context each turn).
7. `get_recent_logs` behind the logs grant, including user activity.

Recipes stay in the docs corpus. The snapshot only fills in this unit’s names
and numbers.

Cross-repo file list, APIs, tests, and ship order:
[`howto-chat-implementation-plan.md`](howto-chat-implementation-plan.md).
