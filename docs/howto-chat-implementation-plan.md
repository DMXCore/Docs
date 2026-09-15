# How-to chat — implementation plan

Cross-repo engineering spec. Product intent, grants, snapshot layout, Seq
rules, and cost are in [`howto-chat-plan.md`](howto-chat-plan.md). This file
is what to build, in which repo, in what order.

**Repos:** Core (`DmxCore100-Software`), DeviceApi, Admin Portal, Docs.

**Ship order:** Core first (inert until the cloud sends `SnapshotNow`), then
DeviceApi, then Portal. Docs copilot (Phase 1) can ship in parallel — it
does not need the snapshot.

Writable MCP / applying setup for the user remains **out of scope**.

Current status per piece: see **Status** in
[`howto-chat-plan.md`](howto-chat-plan.md). The chat API lives in its own repo,
[DMXCore/HelpApi](https://github.com/DMXCore/HelpApi) (README covers deploy,
transcripts and cost controls).

---

## 1. Docs copilot (Phase 1) — Docs repo + Azure chat API

Public how-to on docs.dmxcore.com. No device data.

### Azure

| Resource | Role |
|----------|------|
| Azure OpenAI (pay-as-you-go, **not** PTU) | Chat + embeddings |
| Container App (Consumption, scale to 0) | Orchestrator |
| Blob or Table | Chat sessions (messages, walkthrough progress, continue token) |
| Daily spend cap on the OpenAI resource | Abuse ceiling |

The static site stays Azure Static Web Apps. The widget POSTs to the
orchestrator (`https://help.dmxcore.com` or similar). CORS: `docs.dmxcore.com`,
later `portal.dmxcore.com`.

### Orchestrator

Streaming chat. System prompt: how-to only; cite a docs URL or say you don’t
know; never invent menu names; emit a `walkthrough` object.

Tools: `search_docs`, `get_page`, `get_screenshot`.

Index: chunk Starlight markdown in `src/content/docs/dmx-core-100/` by
heading; attach slug, title, screenshot paths. Rebuild on docs deploy
(post-deploy webhook or pipeline step). Screenshot ids from
`scripts/capture-web-screenshots.mjs` `SHOTS` plus markdown image refs.

### Navigation document (Core #129)

Core's `docs/generated/navigation.yaml` (`format: dmxcore-navigation`) lists
every Web UI and touchscreen screen: path, route, fields (label/key/type),
columns, actions, availability. It ships in the app and as an Azure Pipelines
artifact (`navigation/navigation.yaml`).

- Bring the file for the **release the docs describe** into the index build
  (not Core `main`).
- Tool: look up screens, fields and actions by name ("where is Recording
  protocol set?" → `Web > Lighting Setup > Inputs`, field label, route).
- Validator: accept bold UI names and menu paths found in the navigation
  document as well as in the docs text; treat it as the authority when they
  disagree, and log the disagreement as a docs gap.

### Widget (Docs / Starlight)

Overlay on docs.dmxcore.com. Checklists from `walkthrough` JSON, not markdown
numbered lists. Check → PATCH session. CTA **Continue with my device** deep-
links to the portal with the continue token (portal side is Phase 2).

### Recipes and eval (grow later)

There is almost no installer-ticket corpus (a couple of phone calls). Do
**not** block Phase 1 on “50 real questions.”

A later session drafts **candidate recipes** from the product (Quick Start,
fixture setup, recording, Inputs, etc.). You review which ones real
installers are likely to hit; those become gold walkthroughs and eval
cases in `docs/howto-recipes/` (format: `AGENTS.md`). Score on menu names,
universe numbering, and matching screenshots.

When a future support session surfaces a new question, add a file there
from the ticket, email, or notes. Accuracy improves from real use, not
from a fictional helpdesk dump.

This work lands in **DMXCore/Docs** plus a new Azure app. It is not the Core
or Portal issues below.

---

## 2. Core — config snapshot builder + `SnapshotNow`

Clone the cloud-backup path. New payload. No cue/sound bytes, no SQLite dump,
no raw `HostConfig.json`.

### Behaviour

1. DeviceApi pushes SignalR `SnapshotNow` (same hub as `BackupNow`).
2. `TunnelService` fire-and-forgets `IMessageServer.TriggerConfigSnapshot()`.
3. Builder writes a folder of JSON files (layout in the product plan), zips
   it, uploads via TUS with `FileType=CONFIGSNAPSHOT`.
4. Empty sections omitted. `manifest.json` always present.

The device does **not** gate on a local “help agent” toggle. Portal grant is
the consent. Redaction is defense in depth if the hub method is ever invoked
without a grant.

### New types

`format`: `dmxcore-config-snapshot`, `version`: `1`.

Suggested folder:

```
src/Shared/ConfigSnapshot/
  ConfigSnapshotBuilder.cs      builds the folder
  HostConfigSnapshot.cs         allowlist projection
  HostConfigSnapshotAllowlist.cs
  SnapshotManifest.cs
  SnapshotSectionWriter.cs
```

Wire-in:

| File | Change |
|------|--------|
| `IMessageServer` | `Task TriggerConfigSnapshot()` |
| `MessageServer` | Implement; reuse list APIs (`ListCues`, `ListFixtureInstances`, outputs, input mappings, presets without `Content`, etc.) |
| `TunnelService` | `SnapshotNow` handler next to `HandleBackupNowAsync` |
| `WebServiceClient` / DeviceApi `FileTypes` | Accept `CONFIGSNAPSHOT` (enum change is DeviceApi; Core’s TUS metadata is the string) |
| `HostConfig` | No new fields |

Cue rows: code, name, duration, `UsedCosmosIds`, type, layer — not `.cap` /
`.dmx` / `.idx`. Presets: code, name, ambient, coverage — **not** `Content`.
Sounds: code, name, duration, format — not audio. Profiles: `profiles/index.json`
(manufacturer, name, personalities + channel counts); `profiles/{id}.json`
only for the full map.

### HostConfig allowlist

`HostConfigSnapshot` copies **named** properties only (list in the product
plan). Secrets become booleans (`screenUnlockConfigured`,
`vncPasswordConfigured`, MQTT `hasPassword`).

**Unit test (required):** every public instance property on `HostConfig` is
either on the allow list or the deny list. A new field fails CI until
classified. Do not serialize `HostConfig` with Newtonsoft “the whole object
minus a blacklist.”

`protocol.json` is **OutputConfig** (merge, frequency, recording protocol,
routing flags), not HostConfig.

### Tests

- Allowlist completeness (reflection over `HostConfig`).
- Fixture / cue / preset projections contain no content hashes that would
  fetch blobs; no PIN, JWT, API key, MQTT password in any section JSON.
- Manifest lists only files that exist in the zip.
- Empty show (fresh install) still produces a valid zip + manifest.

### Out of scope for Core

Chat UI, Seq queries, portal grant flags, unpacking the zip, walkthrough
widgets.

---

## 3. DeviceApi — trigger, ingest, unpack

Clone `CloudBackupApiController`. Separate blob prefix so snapshots never
appear in Backup & Restore.

### SignalR

`SnapshotNow` on the existing device hub, pushed like `BackupNow`. 409 if the
serial is not connected.

### TUS ingest

`FileTypes.ConfigSnapshot` (`CONFIGSNAPSHOT`). Today `OnBeforeCreateAsync`
only allows CloudBackup / Cues / Sounds / Text — add this type or uploads
fail.

On complete: store the zip **and** unpack to

```
device-snapshots/{serial}/{captureId}/manifest.json
device-snapshots/{serial}/{captureId}/inputs.json
…
```

`captureId` from zip metadata (`Timestamp` / a guid Core writes into
`manifest.json`). Keep last **N** captures per serial (start with 5); delete
older prefixes.

Do not use container `device-backups` or `FileTypes.CloudBackup`.

### Admin API (X-Service-Token, portal client)

| Method | Path | Result |
|--------|------|--------|
| POST | `/api/config-snapshot/{serial}/trigger` | 202 / 409 / 503 |
| GET | `/api/config-snapshot/{serial}` | Latest capture id, `capturedAt`, section list + bytes |
| GET | `/api/config-snapshot/{serial}/{captureId}/{*path}` | One section file (JSON) |

Portal never downloads the zip for the model; it reads section blobs.

### Infra

Create blob container `device-snapshots` (bicep / existing storage account).
No new domain, cert, or Container App.

---

## 4. Admin Portal — grant, trigger, handoff, Seq

### Grant (source of truth)

On `Device`:

- `HelpAgentSnapshotEnabled` (bool, default false)
- `HelpAgentLogsEnabled` (bool, default false)

EF migration. Standing flags, not a tunnel timeout. Viewer cannot change
them. Permission: `devices.operate` (same as Backup now).

Audit verbs: `help-agent.snapshot.enabled` / `.disabled`,
`help-agent.logs.enabled` / `.disabled`. Revoke drops tools on the **next**
chat turn (orchestrator reads flags per request).

### Device page card

`DeviceDetail.vue`, next to Tunnel / Cloud Backup, only if
`hardwareIdentity` is set.

- Two switches + short copy (inventory JSON, no cue/sound files, no secrets;
  Seq last ~2 hours, this device only).
- **Capture snapshot** (disabled unless snapshot grant on). 202/409 like
  Backup now. Show last capture time + Refresh.
- **Ask for help** → portal help-agent view scoped to this device.

### DeviceApi client

`IConfigSnapshotClient` mirroring `ICloudBackupClient`
(`MainWebApi:BaseUrl` + service token).

Portal endpoints (account-scoped device lookup, HWID required):

- `POST /devices/{id}/help-agent/snapshot` — 403 if grant off; 409 if offline
- `GET /devices/{id}/help-agent/snapshot` — latest manifest
- `GET /devices/{id}/help-agent/snapshot/{captureId}/{section}`
- `PUT /devices/{id}/help-agent` — `{ snapshotEnabled, logsEnabled }`

### Handoff from docs

Continue token = chat session id (not a hardware ID).

1. Docs widget: **Continue with my device** → `portal.dmxcore.com/help?continue={token}`
2. Sign-in (existing portal auth).
3. Device picker (name, last seen, online). One device → skip.
4. If both grants off, show the two switches; user may continue generic.
5. Resume the same session with `deviceId` attached.

**Ask for help** on the device page skips 1–3.

### Seq tool (portal or orchestrator backend)

Server-side only. Seq API key never in the browser or in the model prompt
as a credential.

Query: `HardwareId` equals the first 12 characters of `Device.HardwareIdentity`
(Core already truncates in `BalenaInfoEnricher`). Fallback `MachineName`.

Default window 2 hours, cap ~100 events. Warning+ always; Information from
app source contexts (record, fixtures, inputs, import). Drop
`Microsoft.AspNetCore` Information. Strip `ClientIp`; truncate exceptions.

Tool `get_recent_logs` is registered only when `HelpAgentLogsEnabled` is on
for that device.

**User activity (Core #130):** a second capped query returns up to 30
`Has(UserActivity)` events (Debug level; `Activity Web > Cue > Save - id 123`,
outcome Ok / Failed / Denied / Cancelled), merged newest first with the
filtered events. Paths match the navigation document. User names are
properties only and are never returned. Implemented in the portal
(`SeqLogQueryClient`, `c60c021`); the chat API consumes it through
`get_recent_logs`.

### Signed-in chat

Same orchestrator as Phase 1, with extra tools when grants are on:
`list_sections`, `get_section`, `get_profile`, `get_timeline`,
`get_recent_logs`. Portal session JWT identifies the user; orchestrator
asks the portal “may this user read snapshot/logs for device X?”

Do not give the model a website JWT or DeviceApi service token.

---

## 5. Tests (cloud)

DeviceApi: trigger 202 when connected, 409 when not; TUS rejects unknown
types still; `CONFIGSNAPSHOT` unpacks to expected paths; old captures pruned.

Portal: grant 403 for Viewer; 403 trigger when snapshot grant off; account
scoping; audit rows; Seq query never runs with grant off (mocked Seq).

---

## 6. Rollout

| Stage | Core | DeviceApi | Portal |
|-------|------|-----------|--------|
| A | Builder + `SnapshotNow` no-op if cloud never sends it | — | — |
| B | Upload `CONFIGSNAPSHOT` | Enum + unpack + trigger | — |
| C | — | — | Grant card, capture button, download inventory |
| D | — | — | Handoff + signed-in chat tools |
| E | — | — | Seq tool |

Old Core + new cloud: `SnapshotNow` unknown → log, 502/ignore; portal shows
“update device software.”

New Core + old cloud: TUS `CONFIGSNAPSHOT` rejected; capture fails until
DeviceApi ships.

---

## 7. Issue split

| Repo | Tracks | Issue |
|------|--------|-------|
| [DmxCore100-Software](https://github.com/DMXCore/DmxCore100-Software) | §2 Core snapshot | [#128](https://github.com/DMXCore/DmxCore100-Software/issues/128) (closed) |
| [DmxCore100-Software](https://github.com/DMXCore/DmxCore100-Software) | §1 navigation document | [#129](https://github.com/DMXCore/DmxCore100-Software/issues/129) (closed) |
| [DmxCore100-Software](https://github.com/DMXCore/DmxCore100-Software) | §4 user activity logging | [#130](https://github.com/DMXCore/DmxCore100-Software/issues/130) (closed) |
| [AdminPortal](https://github.com/DMXCore/AdminPortal) | §3 DeviceApi **and** §4 Portal | [#28](https://github.com/DMXCore/AdminPortal/issues/28) (code landed; open) |
| Docs + [HelpApi](https://github.com/DMXCore/HelpApi) | §1 copilot (live); signed-in chat tools (not started) | Not filed |
