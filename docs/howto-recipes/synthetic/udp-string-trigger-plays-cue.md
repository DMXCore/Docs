---
status: candidate
source: synthetic
invented: true
level: intermediate
surface: web
date: 2026-09-15
title: Play a cue when a show controller sends a UDP string
slug: udp-string-trigger-plays-cue
anonymized: true
docs_slugs:
  - dmx-core-100/scheduling-automation/input-triggers
  - dmx-core-100/playback/cues
verified: docs be6f663, core v2026.914.3
---

# Play a cue when a show controller sends a UDP string

## Original ask

> Integrating a DMX Core 100 into a room with a show controller. It can only fire raw UDP, no OSC. I want the ASCII string LOBBY_ON on UDP port 7000 to start the cue with code WELCOME. How do I set up the listener on the Core side?

## Goal

An enabled UDP Input Trigger on port 7000 matches the payload `"LOBBY_ON"` and plays cue `WELCOME`.

## Walkthrough

```json
{
  "id": "udp-string-trigger-plays-cue",
  "title": "Play a cue from a UDP string",
  "steps": [
    {
      "id": "open-input-triggers",
      "label": "In the Web UI, go to Control & Integrations → Input Triggers and click Add New",
      "docsUrl": "/dmx-core-100/scheduling-automation/input-triggers/",
      "screenshotId": "input-triggers-list"
    },
    {
      "id": "set-udp-port",
      "label": "Enter a Code / Short Name and Name, turn Enabled on, set Type to UDP and Port to 7000",
      "docsUrl": "/dmx-core-100/scheduling-automation/input-triggers/#input-types",
      "screenshotId": "input-trigger-editor"
    },
    {
      "id": "set-start-payload",
      "label": "In Start Payload enter \"LOBBY_ON\" including the double quotes (without quotes the field is read as hex bytes, e.g. 4C,4F,42,42,59,5F,4F,4E)",
      "docsUrl": "/dmx-core-100/scheduling-automation/input-triggers/#trigger-settings",
      "screenshotId": "input-trigger-editor"
    },
    {
      "id": "set-action",
      "label": "Under Action, set Action Type to Play Cue, Target to WELCOME, Press Mode Normal, then Save",
      "docsUrl": "/dmx-core-100/scheduling-automation/input-triggers/#actions",
      "screenshotId": "input-trigger-editor"
    },
    {
      "id": "test",
      "label": "Send LOBBY_ON to the device IP on UDP 7000 and confirm the cue plays; if not, check the Dashboard's View Configuration Status for a UDP input trigger port 7000 warning (port already in use)",
      "docsUrl": "/dmx-core-100/scheduling-automation/input-triggers/#trigger-settings",
      "screenshotId": "input-trigger-editor"
    }
  ]
}
```

## Gotchas

- String payloads must be wrapped in double quotes. Unquoted text is read as comma- or space-separated hex bytes. The field help shows `"TEST"` or `40,41,42,0D,0A`.
- Matching is case-sensitive, and the packet only has to **start with** the payload. A trailing CR/LF from the controller is fine. A pattern like `"LOBBY"` would also match `LOBBY_OFF`, so pick distinct strings.
- Do not pick the OSC port (8000 by default, **Device > System > OSC Port**) or a port something else already uses. If the port cannot be bound, the trigger does nothing and a configuration issue is raised.
- **Stop Payload** is optional. It only matters for press modes that react to a release, such as **Toggle on/off** or **Flash (hold)**.
- The cue **Code / Short Name** in Target must exist. It is chosen from a dropdown.
- If the controller can send OSC after all, the built-in `/dmxcore/cue/WELCOME` needs no trigger at all.

## Eval checks

- Path is `Control & Integrations > Input Triggers`, action **Add New**
- Type **UDP**, **Port** 7000
- **Start Payload** written with double quotes (`"LOBBY_ON"`), or the hex equivalent, and explains why
- Action Type **Play Cue** with Target `WELCOME`
- Mentions case-sensitivity or prefix matching of the payload
- Does not put the string in the **Address** field (Address is not shown for UDP)
- Does not invent a "UDP listener" setting under Device > System
- Does not require a script for a plain string match
- Does not tell them to use MCP or the Integration API

## Gaps

- input-triggers.md "Trigger Settings" says **Address** is "the OSC address, HTTP path, MQTT topic, port, or channel". For TCP/UDP the released editor has a separate **Port** field and no Address. DMX types use **Universe Id/Sub Port** and **Channel**. It does not document **Start Payload** / **Stop Payload** at all: the quoted-string vs hex format and prefix matching. Source: `InputTriggerDetails.vue` field help (navigation `web/inputtriggers/details`), `TriggerInstance.GetPayloadBytes` (`src/Shared/Models/TriggerInstance.cs`), `UdpListener.ListenAsync` prefix compare (`src/Shared/Services/UdpListener.cs`).
- input-triggers.md tip says input triggers are "Web UI only". The touchscreen has **Settings > Input Triggers** with Add new input trigger (navigation `uno/settings/input triggers`, `src/UnoHost/Services/MenuManager.cs`). The same tip on output-events.md is contradicted by **Settings > Output Events** (navigation `uno/settings/output events`).
- input-triggers.md "Actions" lists Toggle Mute, Toggle Output and Stop Playback. The released **Action Type** dropdown uses **Audio Mute**, **DMX Output** (with **Set To** Toggle/On/Off) and **Stop**, and also offers **Blackout**. "Input Types" omits **Plugin**. Navigation `web/inputtriggers/details`.
- input-triggers.md does not mention that a port bind failure raises the configuration issue "UDP input trigger port N" (`ExtConnManager.cs`, `UDP_TRIGGER_PORT_{port}_IN_USE`).
- No screenshot of the Input Trigger details editor (catalog only has `input-triggers-list`).

## Verification

- open-input-triggers: input-triggers.md tip (**Control & Integrations > Input Triggers**). `_nav.js` Control & Integrations → Input Triggers. Navigation `web/inputtriggers` action **Add New**.
- set-udp-port: input-triggers.md "Input Types" (**TCP / UDP**). Navigation `web/inputtriggers/details` **Type** option UDP and **Port** (visible when Type is TCP or UDP).
- set-start-payload: navigation `web/inputtriggers/details` **Start Payload** help (quoted string or hex bytes). `TriggerInstance.GetPayloadBytes` (quotes → UTF-8, else hex). `UdpListener.cs` `SequenceEqual(result.Buffer.Take(pattern.Length))`.
- set-action: input-triggers.md "Actions" (Play Cue) and "Press Modes" (Normal). Navigation `web/inputtriggers/details` **Action Type** Play Cue, **Target**, **Press Mode**, action **Save**.
- test: `ExtConnManager.cs` (`src/Shared/Services/`) UDP case adds ConfigIssue "UDP input trigger port {port}" when `udpListener.Start()` fails. Navigation `web/dashboard` summary (View Configuration Status button). OSC alternative: osc-open-sound-control.md "Playing a Cue".

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
