---
title: MCP Server
description: Control lighting from AI clients over the Model Context Protocol
---

The DMX Core 100 can expose a [Model Context Protocol](https://modelcontextprotocol.io/)
endpoint so AI clients such as Cursor or Claude Desktop can list entities, play cues,
adjust levels, and drive fixture colors over the LAN — without creating or editing
content on the device.

## Enabling the MCP Server

1. Under **Device > System**, turn on **Enable MCP Server**.
2. Click **Issue MCP API Key** on the same page (or go to **User Management > API Keys**).
3. Copy the key when it is shown — it is only displayed once.
4. Point your AI client at:

   `https://<device-host>:<https-port>/mcp`

   (HTTP works on the local HTTP port when TLS is not used.)

5. Configure the client to send these headers:

   - `Authorization: Bearer <mcp-api-key>`
   - `Accept: application/json, text/event-stream`

:::note
MCP API keys are **long-lived** and **MCP-only** — they cannot be exchanged for a Web UI JWT and do not work on the general REST API. Revoke them anytime under **User Management > API Keys**. When MCP is disabled, `/mcp` returns **404**.
:::

Keep the endpoint on a trusted network. Treat API keys like passwords.

## What the AI can do

| Tool | Purpose |
|------|---------|
| `list_entities` | List playables, fixtures, zones, and more by **code** and **name** |
| `get_entity_state` | Read the last known state of an entity |
| `activate` | Play a cue, sound, or timeline, or turn on a preset / ambient |
| `set_level` | Set master, zone, or fixture intensity (0–1), or a level control value |
| `set_switch` | Turn presets, ambient, schedules, mute, or toggle CVs on / off / toggle |
| `stop_playback` | Stop cue and sound playback |
| `get_fixture_capabilities` | List modifier ids for direct fixture control |
| `set_fixture_modifiers` | Set RGB, intensity, or custom modifiers (direct control) |
| `release_fixture_control` | Release direct fixture takeover |
| `get_live_status` | Snapshot of dimmers and fixture modifiers |

The server also exposes a `dmxcore://catalog` resource (full entity catalog JSON) and a
`control_lights` prompt with usage guidance for the model.

**CRUD is not available** via MCP — there is no create, edit, or delete of cues, presets,
or other content. Use the Web UI or REST API for configuration.

When calling tools, pass **`reference`** (entity code or name) and optional
**`entityType`** (for example `preset`, `cue`, or `fixture`) to disambiguate.

## Cursor example

In Cursor MCP settings (or `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "dmx-core": {
      "url": "https://dmxcore.local:8001/mcp",
      "headers": {
        "Authorization": "Bearer ${env:DMXCORE_MCP_KEY}",
        "Accept": "application/json, text/event-stream"
      }
    }
  }
}
```

Replace the URL with your device hostname or IP and HTTPS port (**Device > System**).
Store the API key in an environment variable rather than committing it to a project file.

## Related settings

- **Device > System** — enable the server and issue an MCP key (requires **Change System Settings** or **User Management**)
- **User Management > API Keys** — list, create, and revoke MCP keys; see first-used and last-used times
- [Users & Roles](/dmx-core-100/configuration/users-and-roles) — how API keys differ from user tokens
