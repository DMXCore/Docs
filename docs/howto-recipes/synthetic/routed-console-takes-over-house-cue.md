---
status: candidate
source: synthetic
invented: true
level: advanced
surface: web
date: 2026-09-15
title: Let a routed Art-Net console take over a house cue
slug: routed-console-takes-over-house-cue
anonymized: true
docs_slugs:
  - dmx-core-100/lighting/stream-routing
  - dmx-core-100/playback/layers-and-priority
  - dmx-core-100/playback/cues
verified: docs be6f663, core v2026.914.3
---

# Let a routed Art-Net console take over a house cue

## Original ask

> DMX Core runs the house look as a scheduled cue. Visiting LDs plug a console in on Art-Net and we route it through the DMX Core with Route input to outputs. Problem: their levels seem to get added on top of the house cue instead of replacing it. Their blackout is never dark and everything is brighter than they programmed. I want the console to win outright while it's live, and the house cue to come back by itself when they unplug. What do I change?

## Goal

Routed Art-Net input merges at a priority above the house cue, so it owns the universe while live and releases back to the cue after the input loss timeout.

## Walkthrough

```json
{
  "id": "routed-console-takes-over-house-cue",
  "title": "Make routed Art-Net win over the house cue",
  "steps": [
    {
      "id": "raise-input-priority",
      "label": "Go to Lighting Setup → Protocol and set Input Priority above the house cue's priority, e.g. 150 when the cue plays at the default 100",
      "docsUrl": "/dmx-core-100/lighting/stream-routing/#settings",
      "screenshotId": "protocol"
    },
    {
      "id": "input-loss-release",
      "label": "On the same page, leave On Input Loss at Release and Input Loss Timeout (ms) at 2500 so the house cue takes back over when the console goes quiet",
      "docsUrl": "/dmx-core-100/lighting/stream-routing/#settings",
      "screenshotId": "protocol"
    },
    {
      "id": "check-cue-override",
      "label": "In Lighting → Cues, open the house cue and check its Priority Override is not set at or above that Input Priority",
      "docsUrl": "/dmx-core-100/playback/layers-and-priority/#priorities",
      "screenshotId": "cues-list"
    },
    {
      "id": "verify-live",
      "label": "With the console sending, open Lighting Setup → Inputs and confirm the console shows as a live source reaching the outputs, then test a console blackout",
      "docsUrl": "/dmx-core-100/lighting/stream-routing/#setting-it-up",
      "screenshotId": "inputs"
    }
  ]
}
```

## Gotchas

- Art-Net and DMX Serial carry no priority, so routed Art-Net merges at **Input Priority**. A cue at the same priority is not replaced but combined per **Merge Mode**. With **Blend**, values are added and capped at full. That is exactly the "added on top" symptom.
- Changing **Merge Mode** to HTP is not the fix. At equal priority HTP still keeps the house cue's higher channels up, so the console's blackout still is not dark. Raise the priority instead.
- If the console sends **sACN** instead, the DMX Core uses the priority that console transmits. Turn on **Override Input Priority** to force Input Priority for all routed input.
- Input Priority above the **Fixture Control Priority** (default 100) also puts the console over presets and fixture control.
- **On Input Loss**: Release lets the cue underneath take back over. Hold last keeps the console's last frame. Blackout and release sends zeros once, then releases.
- The house master dimmer still applies to routed input, and a DMX Core Blackout still masks it. Stop does not stop routed input.
- The house cue keeps running underneath while the console owns the universe. It is not restarted when the console leaves.

## Eval checks

- Identifies the cause as **equal priority merged with Merge Mode** (Blend adds values)
- Fix is `Lighting Setup > Protocol` → **Input Priority** higher than the cue priority (default 100)
- Mentions **On Input Loss** = Release (and/or Input Loss Timeout) for the hand-back
- Mentions that sACN senders use their own priority unless **Override Input Priority** is on
- Does not propose the 2-port board Passthru Function as the fix
- Does not propose lowering the per-output **sACN Send Priority** as the fix (that is for downstream receivers)
- Does not tell them to use MCP, the Integration API or a script to switch sources

## Gaps

- stream-routing.md "Settings" gives no default for **Input Priority**. Source default is 100 (`src/BusinessObject/OutputConfig.cs` `InputPriority = 100`), equal to the cue default, so out of the box Art-Net routing blends with cues. Worth stating.
- layers-and-priority.md "Merge Mode" does not say the default is **Blend** (`OutputConfig.MergeMode = MergeModes.Blend`).
- layers-and-priority.md says cues "replay with the sACN priority they were recorded with". The Protocol help text says "the cue's priority (default 100)" (`web/settings/protocol` Input Priority help). Neither says what priority a cue recorded from Art-Net gets.
- No screenshot of the cue detail page Priority Override field in the Web UI (catalog has `cue-settings`, device only).

## Verification

- Input Priority, Override Input Priority, Input Loss Timeout (ms), On Input Loss (Release / Hold last / Blackout and release): stream-routing.md "Settings" table. Navigation `web/settings/protocol` fields and help. `OutputConfig.cs` defaults (InputPriority 100, InputLossTimeoutMS 2500, InputLossOperation Release).
- Merge Mode Blend/HTP and equal-priority rule: layers-and-priority.md "Merge Mode" and "Priorities". stream-routing.md "Merging with playback". Navigation `web/settings/protocol` Merge Mode; `OutputConfig.MergeMode` default Blend.
- Cue Priority Override: layers-and-priority.md "Priorities". cues.md "Layers & Priority".
- Fixture Control Priority default 100: layers-and-priority.md "Priorities". Navigation `web/settings/protocol` help.
- Master dimmer, Blackout, Stop with routed input: stream-routing.md "Merging with playback" and "Stop, Blackout and Output Off".
- Live sources on Inputs page: stream-routing.md "Setting it up". `Inputs.vue` Live Sources columns.
- sACN Send Priority is for downstream receivers: output-config.md "Output Settings". layers-and-priority.md "Priorities".

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
