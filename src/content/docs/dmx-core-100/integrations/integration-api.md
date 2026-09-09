---
title: Integration API
description: HTTP + WebSocket API for external control systems such as Bitfocus Companion
---

The DMX Core 100 exposes a small, versioned **Integration API** so external control
surfaces — Bitfocus Companion, Crestron, Medialon, Node-RED, Q-SYS control scripts, or a
plain `curl` — can list what the device can do, execute cues, presets and levels, and
receive live state over a WebSocket. It is the same entity model that
[Home Assistant](/dmx-core-100/integrations/home-assistant) and the
[MCP Server](/dmx-core-100/integrations/mcp-server) use, so a command from a control
system behaves exactly like the equivalent Stream Deck key, schedule or OSC input.

Unlike [OSC](/dmx-core-100/integrations/osc-open-sound-control), the Integration API
**enumerates**: a control system can populate its own dropdowns with the device's real
cues and presets instead of asking the operator to type codes, and it receives state for
button feedback without registering its IP address on the device.

This page is the **wire contract**. You do not need device source code. Live
`GET /catalog` is the source of truth for which entities exist on a given show;
the tables below document kinds, built-in `system.*` codes, and JSON shapes that
every device running protocol version 1 speaks.

## Enabling the Integration API

1. Under **Device > System**, turn on **Enable Integration API**.
2. Click **Issue Integration API Key** on the same page (or go to
   **User Management > API Keys**).
3. Copy the key when it is shown — it is only displayed once.
4. Point the control system at:

   `https://\u003cdevice-host\u003e:\u003chttps-port\u003e/api/integration/v1`

   HTTP works on the local HTTP port when TLS is not used.

5. Send `Authorization: Bearer \u003cintegration-api-key\u003e` on every request, including the
   WebSocket upgrade.

### Ports

Use the **same HTTP/HTTPS ports as the Web UI**. Do not use the OSC UDP port.

| Install | HTTP | HTTPS |
|---------|------|-------|
| Hardware appliance (wall unit) | **80** | **443** |
| Desktop software (Windows / macOS / Linux) | **8000** | **8001** |

On desktop, **Device > System > Local HTTP/HTTPS Ports** can change these (restart
required). OSC listens on UDP **8000** by default; that is a different service.
A module that “upgrades” OSC 8000 to HTTP 80 will miss a desktop instance on 8000.

:::note
Integration API keys are **long-lived** and **Integration-only**. They do not work on
[`/mcp`](/dmx-core-100/integrations/mcp-server), the Web UI login, or the admin REST
API (including `/api/status`). They cannot be exchanged for a JWT. User tokens and
other key types are refused here with **403**. Revoke keys anytime under
**User Management > API Keys**. When the Integration API is disabled, every path under
`/api/integration` returns **404**.
:::

Keep the endpoint on a trusted LAN or VPN. Treat API keys like passwords.

## Versioning

`protocolVersion` (in `GET /info` and the WebSocket `hello` frame) is currently
**1**. It is bumped only for breaking changes. New fields, kinds, or commands are
added without bumping it. Feature-detect on `protocolVersion`, not on the device
software version — control-system modules ship on their own cadence.

Tolerate unknown JSON fields and unknown entity kinds. A field that is **missing
was not sent**, not “false” or “0”. JSON uses **camelCase**; the product field is
`productName`, not `product`.

## Entities

Everything the API can control or observe is an **entity** with a stable
namespaced `code` (the user-assigned code, unchanged by renames), a display `name`,
and a **kind** that fixes its state shape and the commands it accepts.

**Live `GET /catalog` is authoritative.** Built-in `system.*` codes are listed
below so clients do not guess (`system.volume`, not `system.audiovolume`).
Everything else — cues, presets, zones, Control Values — is whatever the operator
has created. Populate dropdowns from the catalog; do not hard-code show content.

| Kind | Examples | State | Commands |
|------|----------|-------|----------|
| `scene` | `cue.INTRO`, `timeline.SHOW1`, `sound.WALKIN` | none | `activate` |
| `switch` | `preset.PARTY`, `ambient.DAY`, `schedule.EVENING`, `system.mute`, `system.blackout`, toggle Control Values | `isOn` | `turnOn`, `turnOff`, `toggle` |
| `level` | `system.masterdimmer`, `system.volume`, `zone.BAR`, `fixture.HOUSE` (intensity), level Control Values | `level` (0–1) | `setLevel` |
| `select` | selector Control Values (`cv.SRC`) | `choice` | `setChoice` |
| `button` | `system.stop`, `system.clearambient` | none | `activate` |
| `sensor` | `system.nowplaying` | `text` | none |

Namespaces: `preset.`, `ambient.`, `cue.`, `timeline.`, `sound.`, `fixture.`,
`zone.`, `schedule.`, `cv.`, `system.`.

Codes and commands are matched **case-insensitively**. State echoes the canonical
code from the catalog (`cue.INTRO`, not `CUE.intro`). `choice` is matched
case-insensitively and stored/returned in catalog canonical form (`Line`, not
`line`).

### Built-in `system.*` entities

Always present. Kind decides the commands — `system.blackout` is a **switch**
(not a button); `system.stop` is a **button**.

| Code | Name | Kind |
|------|------|------|
| `system.masterdimmer` | Master Dimmer | `level` |
| `system.volume` | Audio Volume | `level` |
| `system.mute` | Audio Mute | `switch` |
| `system.outputmute` | Output Mute | `switch` |
| `system.blackout` | Blackout | `switch` |
| `system.stop` | Stop | `button` |
| `system.clearambient` | Clear Ambient | `button` |
| `system.nowplaying` | Now Playing | `sensor` |

### `system.nowplaying` text

`text` is a **human-readable status line** for button labels, not a namespaced
entity code. Idle is an empty string (and the entity is omitted from list
`GET /state`). When something is playing:

| Situation | `text` |
|-----------|--------|
| One cue | `Cue: INTRO` |
| One sound | `Sound: WALKIN` |
| One timeline | `Playing timeline: SHOW1` |
| Several timelines | `Playing 3 timelines` |
| Routed input, nothing playing | `Routing input` |

The identifier after the prefix is the item's user-assigned **code** by default,
or its **display name** when **Settings → Display Name Instead of Code** is on
(`Cue: Intro` instead of `Cue: INTRO`). It is never `cue.INTRO`.

To light a button for a specific scene, match this string against that entity's
catalog `name` **and** the code suffix (the part after `cue.` / `timeline.` /
`sound.`), case-insensitively. Do not compare to the namespaced entity code.
`GET /info` `playerCode` / `playerName` are the raw code and name of the current
item (a snapshot, not live).

### Missing state

`GET /state` and `state` frames omit:

- stateless kinds (`scene`, `button`)
- entities that have not reported yet

A missing `isOn` is **unknown**, not off. Do not treat “not in the state map”
as switched off. One-entity `GET /state/{code}` answers `{ "code": "…" }` with
no value field in that case, and **404** for an unknown code.

`select` `choices` live on the **catalog entity**, not on state. A set-choice UI
must load `choices` from the selected entity in the catalog (they differ per
entity).

## HTTP endpoints

All JSON, camelCase. Field names are exactly those in the examples. Errors are
`{ "error": "\u003cmessage\u003e" }` with a 4xx status.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/integration/v1/info` | Identity plus a device snapshot (below) |
| GET | `/api/integration/v1/catalog` | `{ "entities": [ { code, name, kind, choices? } ] }` |
| GET | `/api/integration/v1/state` | `{ "states": [ { code, isOn? / level? / choice? / text? } ] }` |
| GET | `/api/integration/v1/state/{code}` | One entity's state |
| POST | `/api/integration/v1/execute` | Run a command → 202 |
| WS | `/api/integration/v1/events` | Live event stream |

### `GET /api/integration/v1/info`

Identity plus a device snapshot. Additive fields may appear without a
`protocolVersion` bump; ignore ones you do not use. Poll this for show name,
temperatures, and health. **Do not call `/api/status`** — that is admin REST,
not this API, and Integration keys are refused there.

```json
{
  "protocolVersion": 1,
  "serial": "…",
  "productName": "DMX Core 100",
  "deviceName": "FOH Rack",
  "softwareVersion": "2026.909.1",
  "hostName": "core-foh",
  "showName": "Mandylights",
  "cpuTemperatureC": 59.4,
  "boardTemperatureC": 47.0,
  "sysCpuUsage": 12.5,
  "appCpuUsage": 8.1,
  "sysMemoryUsageMB": 900,
  "sysMemoryTotalMB": 4000,
  "appMemoryUsageMB": 700,
  "storageUsageMB": 1000,
  "storageTotalMB": 28000,
  "networkSpeedMbit": 1000,
  "audioAvailable": true,
  "appUpTimeH": 2.5,
  "sysUpTimeH": 10.0,
  "recorder": "INACTIVE",
  "playerName": "Intro",
  "playerCode": "INTRO"
}
```

`deviceName` is the device nickname, falling back to the host name.
Temperatures and `networkSpeedMbit` are omitted when the platform has no
reading (typical on desktop). `playerCode` / `playerName` are omitted when
nothing is playing; `playerCode` is the user-assigned code (not namespaced).

`recorder` is an uppercase string: `INACTIVE`, `ACTIVE` (entered, waiting),
`PREVIEW`, `PREVIEWWITHDATA`, `RECORDING`, `SAVING`, `TRIGGERFINISHED`,
`UNKNOWN`.

The WebSocket `hello` frame carries **only the identity fields**
(`protocolVersion`, `serial`, `productName`, `deviceName`, `softwareVersion`)
so connect is not blocked on hardware sensors. Re-fetch `GET /info` for the
snapshot; a 30 s poll is plenty.

### `GET /api/integration/v1/catalog`

```json
{ "entities": [
  { "code": "cue.INTRO", "name": "Intro", "kind": "scene" },
  { "code": "preset.PARTY", "name": "Party", "kind": "switch" },
  { "code": "system.masterdimmer", "name": "Master Dimmer", "kind": "level" },
  { "code": "system.volume", "name": "Audio Volume", "kind": "level" },
  { "code": "cv.SRC", "name": "Source", "kind": "select", "choices": ["Mic", "Line"] }
] }
```

`choices` is present for `select` entities only.

### `GET /api/integration/v1/state`

```json
{ "states": [
  { "code": "preset.PARTY", "isOn": true },
  { "code": "system.masterdimmer", "level": 0.8 },
  { "code": "system.nowplaying", "text": "Cue: INTRO" }
] }
```

Only the field for the entity's kind is present.

### `GET /api/integration/v1/state/{code}`

One entity, same shape. Answers `{ "code": "…" }` with no value field for a
stateless or not-yet-reported entity, and **404** for an unknown code.

### `POST /api/integration/v1/execute`

```json
{ "code": "system.masterdimmer", "command": "setLevel", "level": 0.5 }
{ "code": "cue.INTRO", "command": "activate" }
{ "code": "cue.INTRO", "command": "activate", "loop": 0, "fadeInMs": 500, "fadeOutMs": 1000 }
{ "code": "preset.PARTY", "command": "toggle" }
{ "code": "cv.SRC", "command": "setChoice", "choice": "Line" }
```

Responses:

| Status | Meaning |
|--------|---------|
| 202 | Accepted; body echoes `{ "code", "command" }`. Confirmation arrives as a state change. |
| 400 | Malformed body, unknown command, command does not apply to the entity's kind, missing/invalid `level` or `choice`, playback fields on a command other than a scene `activate`, or a negative `loop` / fade. |
| 404 | Unknown entity code. |
| 429 | Execute rate limit exceeded for this key. |

`level` is clamped to 0–1. `choice` must be one of the entity's catalog choices
(case-insensitive).

#### Playback options

`activate` on a `cue.` or `sound.` entity accepts three optional fields.
**They are applied.** Omitting them is not the same as the device ignoring them —
omitted fields take **Settings → Playback** defaults (the same values a tap on
the touchscreen uses). Sending `loop` / `fadeInMs` / `fadeOutMs` on any other
command or a non-scene kind is 400.

| Field | Meaning |
|-------|---------|
| `loop` | `0` = loop forever, `1` = play once, `N` = play N times |
| `fadeInMs` | Fade-in in milliseconds; `0` = none |
| `fadeOutMs` | Fade-out at the natural end or on stop, in milliseconds; `0` = none |

A scene action can expose Loop / Fade fields that map to these, and leave them
unset to follow the device. Timelines carry their own Loop setting and ignore
these fields.

Example (desktop HTTP port; use **80** on a wall unit):

```bash
curl -sS -X POST "http://\u003cdevice-host\u003e:8000/api/integration/v1/execute" \
  -H "Authorization: Bearer \u003ckey\u003e" -H "Content-Type: application/json" \
  -d '{"code":"cue.INTRO","command":"activate"}'
```

## Event stream

Open a WebSocket to `/api/integration/v1/events` with the same `Authorization`
header (Node's `ws`, Python's `websockets`, and .NET's `ClientWebSocket` all set
headers; browsers typically cannot, which is acceptable — this is not a browser
API). Every frame is one JSON object with `type` first.

On connect the device sends, in order:

```json
{ "type": "hello", "protocolVersion": 1, "serial": "…", "productName": "DMX Core 100", "deviceName": "…", "softwareVersion": "…" }
{ "type": "catalog", "entities": [ … ] }
{ "type": "state", "states": [ … ] }
```

Thereafter:

- `{ "type": "state", "states": [ … ] }` — changed entities. Full snapshot
  after a catalog change (preceded by a fresh `catalog` frame) or after a
  resync (see below). Handle every `state` frame the same way: apply each entry.
- `{ "type": "pong" }` — reply to a client `ping`.
- `{ "type": "error", "error": "…", "code": "…" }` — a rejected client frame;
  `code` is present when it concerns an execute.

Client → server:

- `{ "type": "execute", "code": "…", "command": "…", "level": …, "choice": "…", "loop": …, "fadeInMs": …, "fadeOutMs": … }`
  — same semantics and validation as HTTP execute; errors come back as `error`
  frames, success is silent (the state change is the confirmation). Use this for
  continuous control (fader drags) rather than one POST per tick.
- `{ "type": "ping" }`.

:::tip
State is **coalesced**: the device reports where an entity settles, not every
step of a fade, so button feedback snaps to the final value rather than
animating. A client that cannot keep up has its oldest updates dropped and
receives a full `state` snapshot once it catches up — that resync is a `state`
frame without a preceding `catalog`. Apply each entry; do not assume every full
snapshot is announced.

State changes are delivered to every subscriber, including the one that caused
them, so treat a state frame as the confirmation.
:::

The server also sends WebSocket protocol pings; the JSON `ping` / `pong` frames
are for clients whose library hides protocol pings. Reconnect by opening a new
socket; the hello / catalog / state sequence repaints everything, so no polling
is needed for entity state. Poll `GET /info` if you want temperatures or show
name.

## Limits

| Limit | Value |
|-------|-------|
| Event-stream connections per key | 8 (a further upgrade gets 429) |
| Executes per key | 100/s sustained, bursts to 200 |
| Inbound WebSocket frame | 64 KB |

## Building a control-system module

A Bitfocus Companion module, Crestron driver, or Node-RED node can follow this
mapping:

| Module concept | Source |
|----------------|--------|
| Action dropdowns | `catalog` entities, filtered by kind |
| Actions | `execute` with a command valid for that kind; a scene action can expose Loop / Fade in / Fade out mapping to `loop`, `fadeInMs`, `fadeOutMs` (leave unset for device defaults) |
| Feedbacks | `state` frames — boolean for `switch` when `isOn` is present, comparison for `level`; now-playing match against catalog name and code suffix |
| Variables | `sensor` / `level` / `switch` / `select` entities; device health and show name from `GET /info` |
| Instance status | WebSocket connect / disconnect |
| Instance config | host, **HTTP(S) port of the Web UI**, Integration API key |

Recommended connect flow:

1. `GET /info` — confirm `protocolVersion`, store identity and snapshot.
2. Open `WS /events` with the Bearer header.
3. On `hello`, check `protocolVersion` again. On `catalog`, rebuild dropdowns.
   On `state`, apply each entry (missing `isOn` stays unknown).
4. Poll `GET /info` about every 30 s for show name, temperatures, and health.
5. Send executes over the WebSocket for faders; HTTP POST is fine for buttons.

### Pitfalls

- Audio volume is `system.volume`.
- Blackout is a **switch** (`turnOn` / `turnOff` / `toggle`), not a button.
- Now-playing `text` looks like `Cue: INTRO`, never `cue.INTRO`.
- Select `choices` come from the **selected** catalog entity, not the first
  select in the list.
- Playback `loop` / fades on cue and sound `activate` **are applied**; omit them
  to use Settings → Playback defaults.
- Default HTTP is **80** on hardware and **8000** on desktop — not 8080, and not
  the OSC UDP port.

## What is not included

The Integration API covers catalog, state, execute, and a read-only device
snapshot. There is no CRUD, no user management, no file access, and no direct
fixture color control (`fixture.\u003ccode\u003e` exposes intensity as a `level`). Those
remain the domain of the admin Web UI, the
[MCP Server](/dmx-core-100/integrations/mcp-server), and
[plugins](/dmx-core-100/integrations/plugins). The admin REST API is not part of
this contract.

## Related settings

- **Device > System** — enable the API and issue an Integration key (requires
  **Change System Settings** or **User Management**)
- **Device > System > Local HTTP/HTTPS Ports** — the ports this API shares with
  the Web UI
- **User Management > API Keys** — list, create, and revoke Integration keys;
  see first-used and last-used times
- [Users & Roles](/dmx-core-100/configuration/users-and-roles) — how API keys
  differ from user tokens
