---
status: candidate
source: synthetic
invented: true
level: advanced
surface: web
date: 2026-09-15
title: Drive the master dimmer from a 0–255 OSC wall fader
slug: osc-wall-fader-master-dimmer-value-trigger
anonymized: true
docs_slugs:
  - dmx-core-100/scheduling-automation/input-triggers
  - dmx-core-100/scheduling-automation/scripting
  - dmx-core-100/integrations/osc-open-sound-control
verified: docs be6f663, core v2026.914.3
---

# Drive the master dimmer from a 0–255 OSC wall fader

## Original ask

> Control processor has a slider on the touch panel that sends OSC /lobby/level with a single int arg 0–255. I want it to ride the DMX Core master dimmer live, with a small dead zone at the bottom so the panel's noise doesn't leave the lights glowing at 1%. Can't change the address or the range on the processor side.

## Goal

A Value-mode OSC Input Trigger on `/lobby/level` maps 0–255 to the master dimmer. An enabled transform script sets everything below 5% to zero.

## Walkthrough

```json
{
  "id": "osc-wall-fader-master-dimmer-value-trigger",
  "title": "Drive the master dimmer from a 0–255 OSC fader",
  "steps": [
    {
      "id": "create-transform",
      "label": "In the Web UI, go to Control & Integrations → Scripts, click Add New, give it a Code / Short Name (e.g. DEADZONE), turn Enabled on, enter the Source value < 0.05 ? 0 : value; and Save",
      "docsUrl": "/dmx-core-100/scheduling-automation/scripting/#transform-scripts",
      "screenshotId": "script-editor"
    },
    {
      "id": "new-osc-trigger",
      "label": "Go to Control & Integrations → Input Triggers, click Add New, set Code / Short Name and Name, Enabled on, Type OSC and Address /lobby/level",
      "docsUrl": "/dmx-core-100/scheduling-automation/input-triggers/#input-types",
      "screenshotId": "input-triggers-list"
    },
    {
      "id": "value-mode-range",
      "label": "Set Mode to Value - set a level from the payload, Input Min 0 and Input Max 255, and pick DEADZONE in Transform Script (optional)",
      "docsUrl": "/dmx-core-100/scheduling-automation/input-triggers/#two-modes",
      "screenshotId": null
    },
    {
      "id": "value-target",
      "label": "Under Value Target, set Target to Master Dimmer (leave Min value 0, Max value 100, Inverted off) and Save",
      "docsUrl": "/dmx-core-100/scheduling-automation/input-triggers/#two-modes",
      "screenshotId": null
    },
    {
      "id": "verify-arrival",
      "label": "Move the panel slider; if the dimmer does not follow, open Control & Integrations → OSC Clients and check Recent OSC Senders for the processor's IP and the address /lobby/level",
      "docsUrl": "/dmx-core-100/integrations/osc-open-sound-control/#playing-a-cue",
      "screenshotId": "osc-clients-list"
    }
  ]
}
```

## Gotchas

- **Input Max** defaults to 1, which suits 0.0–1.0 floats. With 0–255 ints left at the default, any value of 1 or more pins the dimmer at full. Set **Input Max** to 255.
- The transform sees the value after it has been scaled to 0–1, so the threshold is `0.05`, not `13`. The last expression is the result, and it is clamped to 0–1.
- The transform script must be **Enabled**. A disabled, missing or failing transform skips the update, so the fader appears dead. Test it with **Run**/**Last Run** on the script page. Transforms have no `dmx` or `ctx`.
- Send exactly one numeric argument: an int, a float or a numeric string. Messages without an argument are ignored in Value mode.
- The address must start with `/`. Matching is not case-sensitive.
- If the processor's IP is bound to an enabled OSC Control Surface client, the surface takes its messages and the Input Trigger never sees them.
- If the processor could send 0.0–1.0, the built-in `/dmxcore/dimmer/master` would work with no trigger. That doesn't help here, because the address and range are fixed.
- Editing scripts requires an administrator account.

## Eval checks

- Path `Control & Integrations > Input Triggers`, **Type** OSC, **Address** `/lobby/level`
- **Mode** is Value (set a level from the payload), not On/Off
- **Input Min** 0 and **Input Max** 255, and explains why the default range is wrong for 0–255
- Value Target **Target** = **Master Dimmer**
- Transform script created under `Control & Integrations > Scripts`, enabled, using `value` in 0–1 terms (e.g. `value < 0.05 ? 0 : value;`)
- Does not use a Run Script action with `ctx.payload` parsing to set the dimmer
- Does not invent a "dead zone" or "curve" field on the trigger itself
- Does not tell them to use MCP or the Integration API

## Gaps

- input-triggers.md "Two Modes" does not document the Value-mode fields. The released editor has **JSON Path (optional)** (MQTT/HTTP), **Input Min** (default 0) and **Input Max** (default 1), plus a **Value Target** section with **Target** (Master Dimmer, Audio Volume, Fixture Intensity, Fixture RGB - Red/Green/Blue, Zone Intensity, Control Value (Level)), **Fixture code / Zone code / Control Value**, **Min value**, **Max value** and **Inverted**. The docs name only Control Value, master dimmer and zone intensity as targets. Source: `InputTriggerDetails.vue`; navigation `web/inputtriggers/details`; `ExtConnManager.NormalizeInput` (`src/Shared/Services/ExtConnManager.cs`).
- scripting.md "Transform Scripts" does not say the transform must be **Enabled**. `ScriptManager.BuildTransformEntry` (`src/Shared/Services/ScriptManager.cs`) returns null for a disabled script, and the update is then skipped. It also doesn't say a transform is an ordinary script picked by code: there is no script kind field (navigation `web/scripts/details`).
- The docs do not say a Value-mode OSC trigger needs exactly one argument (`OscServer.cs` uses `Arguments.Length == 1` for float/int/string).
- No screenshot of the Input Trigger details editor.

## Verification

- create-transform: scripting.md "Creating a Script" (**Control & Integrations > Scripts**, **Add New**, **Source**, **Save**) and "Transform Scripts" (`value`, last expression, dead-zone example). Navigation `web/scripts/details` (**Code / Short Name**, **Enabled**, actions Save/Run). `ScriptManager.BuildTransformEntry` requires Enabled.
- new-osc-trigger: input-triggers.md tip and "Input Types" (OSC). Navigation `web/inputtriggers/details` **Type** OSC, **Address** (help: should start with a /). `ExtConnManager.cs` lower-cases the address.
- value-mode-range: input-triggers.md "Two Modes" (Value mode, Transform Script). Navigation `web/inputtriggers/details` **Mode** "Value - set a level from the payload", **Input Min** / **Input Max** help (defaults 0 and 1), **Transform Script (optional)**. `ExtConnManager.NormalizeInput` clamps `(raw - min) / (max - min)` to 0–1.
- value-target: input-triggers.md "Two Modes" (master dimmer target). Navigation `web/inputtriggers/details` section **Value Target** (**Target** Master Dimmer, **Min value**, **Max value**, **Inverted**), action **Save**.
- verify-arrival: osc-open-sound-control.md tip "Which address did the device hear?" (**Recent OSC Senders** on **Control & Integrations > OSC Clients**) and "Three Ways to Use Incoming OSC" (control surface owns its sender IP).

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
