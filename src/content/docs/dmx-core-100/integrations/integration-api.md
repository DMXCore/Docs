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

## Enabling the Integration API

1. Under **Device > System**, turn on **Enable Integration API**.
2. Click **Issue Integration API Key** on the same page (or go to
   **User Management > API Keys**).
3. Copy the key when it is shown — it is only displayed once.
4. Point the control system at:

   `https://<device-host>:<https-port>/api/integration/v1`

   (HTTP works on the local HTTP port when TLS is not used.)

5. Send `Authorization: Bearer <integration-api-key>` on every request, including the
   WebSocket upgrade.

:::note
Integration API keys are **long-lived** and **Integration-only** — they do not work on
`/mcp` or the admin REST API and cannot be exchanged for a Web UI login. Revoke them
anytime under **User Management > API Keys**. When the Integration API is disabled,
every path under `/api/integration` returns **404**.
:::

Keep the endpoint on a trusted network. Treat API keys like passwords.

## Entities

Everything the API can control or observe is an **entity** with a stable code (the code
you assigned in the admin UI, unchanged by renames), a display name and a **kind**:

| Kind | Examples | State | Commands |
|------|----------|-------|----------|
| `scene` | `cue.INTRO`, `timeline.SHOW1`, `sound.WALKIN` | none | `activate` |
| `switch` | `preset.PARTY`, `ambient.DAY`, `schedule.EVENING`, `system.mute` | `isOn` | `turnOn`, `turnOff`, `toggle` |
| `level` | `system.masterdimmer`, `zone.BAR`, `fixture.HOUSE` (intensity) | `level` (0–1) | `setLevel` |
| `select` | selector Control Values | `choice` | `setChoice` |
| `button` | `system.stop`, `system.clearambient` | none | `activate` |
| `sensor` | `system.nowplaying` | `text` | none |

## Endpoints

All responses are JSON. Errors are `{ "error": "…" }` with a 4xx status.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/integration/v1/info` | `protocolVersion`, serial, product and device name, software version |
| GET | `/api/integration/v1/catalog` | `{ "entities": [ { code, name, kind, choices? } ] }` |
| GET | `/api/integration/v1/state` | `{ "states": [ { code, isOn? / level? / choice? / text? } ] }` |
| GET | `/api/integration/v1/state/{code}` | One entity's state (404 for an unknown code) |
| POST | `/api/integration/v1/execute` | `{ "code", "command", "level"?, "choice"? }` → 202 |
| WS | `/api/integration/v1/events` | Live event stream (below) |

Example:

```bash
curl -sS -X POST "http://<device-host>:8080/api/integration/v1/execute" \
  -H "Authorization: Bearer <key>" -H "Content-Type: application/json" \
  -d '{"code":"cue.INTRO","command":"activate"}'
```

`execute` answers **202** when the command was accepted (the state change is the
confirmation), **400** when the command does not apply to the entity's kind or an
argument is missing, **404** for an unknown code, and **429** when a key exceeds the
execute rate limit (100 per second sustained, bursts to 200).

## Event stream

Open a WebSocket to `/api/integration/v1/events` with the same `Authorization` header.
Every frame is one JSON object with a `type`. On connect the device sends, in order:

1. `{ "type": "hello", "protocolVersion": 1, … }`
2. `{ "type": "catalog", "entities": [ … ] }`
3. `{ "type": "state", "states": [ … ] }` — the full state

After that, `state` frames carry the entities that changed (and a fresh `catalog` plus
full `state` whenever entities are added, renamed or removed). The client can send
`{ "type": "execute", … }` with the same fields as the HTTP execute — useful for fader
drags, where one HTTP request per step would be wasteful — and `{ "type": "ping" }`,
answered with `{ "type": "pong" }`. Rejected frames come back as
`{ "type": "error", "error": "…" }`.

:::tip
State is **coalesced**: the device reports where an entity settles, not every step of a
fade, so button feedback snaps to the final value rather than animating. A client that
cannot keep up has its oldest updates dropped and receives a full state snapshot once it
catches up, so it never ends up holding a stale value.
:::

## Versioning

`protocolVersion` is currently **1** and only changes for breaking changes; new fields,
kinds or commands are added without bumping it. Control-system modules ship on their own
release cadence, so they should check `protocolVersion` rather than the device software
version.

## Limits

| Limit | Value |
|-------|-------|
| Event-stream connections per key | 8 |
| Executes per key | 100/s sustained, bursts to 200 |

## What is not included

The Integration API deliberately covers catalog, state and execute only — no creating
or editing cues and presets, no user management, no file access, and no direct fixture
color control (`fixture.<code>` exposes intensity as a `level`). Those remain the domain
of the admin web UI, the [MCP Server](/dmx-core-100/integrations/mcp-server) and
[plugins](/dmx-core-100/integrations/plugins).
