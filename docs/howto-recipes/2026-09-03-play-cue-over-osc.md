---
status: confirmed
source: ticket
date: 2026-09-03
title: Play a saved cue over OSC from QLab
slug: play-cue-over-osc
anonymized: true
docs_slugs:
  - dmx-core-100/common-tasks/play-a-cue-over-osc
  - dmx-core-100/integrations/osc-open-sound-control
  - dmx-core-100/playback/cues
  - dmx-core-100/scheduling-automation/input-triggers
---

# Play a saved cue over OSC from QLab

## Original ask

> I would like to control your unit through OSC. I have read the manual and
> still a bit confused. Specifically what is the command to execute a cue? Is
> there an OSC dictionary or do you create commands based on your list in
> output triggers? In the simplest application all I want to do is execute
> cues that I have saved through QLab.

## Goal

QLab (or any OSC sender) fires a saved cue by sending `/dmxcore/cue/<code>` to
the device on UDP 8000, with no Input Trigger required.

## Walkthrough

```json
{
  "id": "play-cue-over-osc",
  "title": "Play a saved cue over OSC from QLab",
  "steps": [
    {
      "id": "find-cue-code",
      "label": "In the Web UI, go to Lighting → Cues, open the cue, and copy its Code / Short Name exactly (case-sensitive)",
      "docsUrl": "/dmx-core-100/playback/cues/",
      "screenshotId": "cue-editor"
    },
    {
      "id": "send-builtin",
      "label": "In QLab, send OSC /dmxcore/cue/<that-code> to the device IP on UDP port 8000 (Device → System → OSC Port if 8000 is taken). No arguments.",
      "docsUrl": "/dmx-core-100/common-tasks/play-a-cue-over-osc/",
      "screenshotId": "system-settings"
    },
    {
      "id": "confirm-arriving",
      "label": "If nothing plays, open Control & Integrations → OSC Clients and check Recent OSC Senders at the bottom for the sender IP and last address",
      "docsUrl": "/dmx-core-100/integrations/osc-open-sound-control/",
      "screenshotId": "osc-clients-list"
    }
  ]
}
```

## Gotchas

- Built-in `/dmxcore/cue/<code>` is enough for saved cues. Do not send them
  looking for an OSC dictionary, Output Events, or Output Triggers.
- Input Triggers are only needed for custom address names, or for actions the
  built-in set does not cover (timelines, sounds, scripts).
- Code / Short Name must match exactly, including upper and lower case.
- Recent OSC messages live on **OSC Clients** (Recent OSC Senders / Discovered),
  not on Input Triggers. The list refreshes while that page is open on current
  software; older builds needed a reload.
- If the sender IP is bound to an OSC Control Surface, built-in addresses and
  Input Triggers no longer see those messages.

## Eval checks

- Mentions `/dmxcore/cue/` plus the cue **Code / Short Name**
- Mentions UDP port `8000` (or Device > System > OSC Port)
- Menu path includes `Lighting > Cues` for the code
- Troubleshooting path is `Control & Integrations > OSC Clients`, not Input
  Triggers
- Does not require creating an Input Trigger for plain cue playback
- Does not tell them to use MCP or the Integration API

## Gaps

- No QLab-app screenshot (external)
- Screenshot id `osc-clients-list` shows the clients table; Recent OSC Senders
  is the section at the bottom of that same page

## Source notes

Email ticket, 2026-09-03 UTC. Software mentioned later in the thread:
2026.717.2. Customer confirmed cue playback worked.
