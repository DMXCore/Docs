---
status: candidate
source: synthetic
invented: true
level: advanced
surface: web
date: 2026-09-15
title: Fire a lighting preset from a Q-SYS source selector
slug: qsys-source-selector-fires-preset
anonymized: true
docs_slugs:
  - dmx-core-100/integrations/qsys
  - dmx-core-100/external-control
  - dmx-core-100/integrations/control-values
  - dmx-core-100/scheduling-automation/input-triggers
verified: docs be6f663, core v2026.914.3
---

# Fire a lighting preset from a Q-SYS source selector

## Original ask

> Integrator here. Core 110f at 192.168.1.40, UCI has a source combo box exposed as the
> named control `BarSource` with choices Background / Party / Karaoke. When the
> bartender flips it to Party I want the DMX Core to apply its PARTY preset. No Lua on
> the Q-SYS side if I can avoid it. What's the cleanest way?

## Goal

The QSys DSP plugin connects to the core, a Selector Control Value mirrors
`BarSource`, and a Control Value input trigger with Start Choice `Party` applies the
`PARTY` preset. No scripting on the Q-SYS side.

## Walkthrough

```json
{
  "id": "qsys-source-selector-fires-preset",
  "title": "Fire a lighting preset from a Q-SYS source selector",
  "steps": [
    {
      "id": "install-qsys-plugin",
      "label": "Open Control & Integrations → Plugins, install QSys DSP from the Browse tab, enter 192.168.1.40 as the Server address (port stays at the Q-SYS default 1702) and Save Settings; check the link icon shows connected",
      "docsUrl": "/dmx-core-100/external-control/#configuration",
      "screenshotId": "plugins-settings"
    },
    {
      "id": "selector-control-value",
      "label": "Open Control & Integrations → Control Values → Add New: Code / Short Name BARSRC, Kind Selector, Plugin Q-SYS, Controller Number BarSource, add its choices (Background, Party, Karaoke), and Save",
      "docsUrl": "/dmx-core-100/integrations/control-values/#settings",
      "screenshotId": "control-values-list"
    },
    {
      "id": "check-live-value",
      "label": "Change the selector on the UCI and confirm the BARSRC value updates in the Control Values list",
      "docsUrl": "/dmx-core-100/integrations/control-values/#live-state-everywhere",
      "screenshotId": "control-values-list"
    },
    {
      "id": "control-value-trigger",
      "label": "Open Control & Integrations → Input Triggers → Add New: Type Control Value, pick BARSRC, Mode On/Off — run an action, Start Choice Party (optionally a Stop Choice)",
      "docsUrl": "/dmx-core-100/scheduling-automation/input-triggers/#control-value-triggers",
      "screenshotId": "input-triggers-list"
    },
    {
      "id": "apply-preset-action",
      "label": "Set Action Type to Apply Preset with Target PARTY, then Save",
      "docsUrl": "/dmx-core-100/scheduling-automation/input-triggers/#actions",
      "screenshotId": "input-triggers-list"
    },
    {
      "id": "test-from-dsp",
      "label": "Test by switching the selector to Party on the Q-SYS UCI (not from the DMX Core), and check that the PARTY preset applies",
      "docsUrl": "/dmx-core-100/scheduling-automation/input-triggers/#control-value-triggers",
      "screenshotId": null
    }
  ]
}
```

## Gotchas

- Only changes made **on the DSP side** fire a Control Value trigger. Changing BARSRC
  from the DMX Core (a custom menu selector, a schedule, another trigger) updates the
  state silently. Test from the UCI.
- On startup or reconnect, the first reported value arms the trigger without firing.
  If the selector is already on Party when the core reconnects, the preset is not
  re-applied.
- Start Choice takes the choice name or index.
- For Q-SYS, **Controller Number** is the named control from Q-SYS Designer. No Lua,
  scripting or extra licenses are needed on the DSP side.
- The port only needs changing if it is not the Q-SYS default 1702. Settings apply
  immediately with no restart.
- The same BARSRC Control Value can also be put on the touchscreen as a
  **Segmented selector** in a custom menu, if the client wants source select there too.

## Eval checks

- Uses the **QSys DSP** plugin at `Control & Integrations > Plugins` with **Server
  address** and default port 1702
- Creates a Control Value of Kind **Selector**, Plugin **Q-SYS**, mapped to the named
  control `BarSource` at `Control & Integrations > Control Values`
- Uses an Input Trigger of Type **Control Value** at
  `Control & Integrations > Input Triggers` with **Start Choice** `Party`
- Action is **Apply Preset** → `PARTY`
- Mentions that only DSP-side changes fire the trigger (test from the UCI)
- Does not require Lua/scripting on the Q-SYS side, OSC, or the Integration API
- Does not tell them to use MCP or the Integration API
- Does not claim it changed a setting

## Gaps

- `integrations/control-values.md` does not document how a Selector's choices are
  defined. The released editor has **Add Choice**, **Prefill Values** and a **Wrap
  Around** switch (nav `web/controlvalues/details`; `ControlValueDetails.vue`). The
  docs only say "One choice from a list". The walkthrough says "add its choices"
  without a documented procedure.
- `input-triggers.md` › Control Value Triggers does not say whether leaving the Start
  Choice releases the preset. That depends on how the Stop Choice and the action's
  Press Mode (Normal / Toggle on/off / Flash (hold)) interact. The docs describe
  "what clears the triggered state" but not the effect on an applied preset. The gold
  answer does not promise the preset turns off when the selector leaves Party.
- `integrations/qsys.md` / `external-control.md` call the setting **Port**. The plugin
  label is **Server port** (`DMXCore100.Plugin.QSys/src/DMXCore100.QSysPlugin/QSysPlugin.cs`).
- `control-values.md` › Settings does not say the **Plugin** dropdown only lists
  installed DSP plugins (`ControlValueDetails.vue` `fetchBackends`).
- No screenshot of the Control Value details or the Input Trigger details forms.

## Verification

- Step `install-qsys-plugin`: `external-control.md` › Configuration (install **QSys
  DSP** from **Browse**, **Server address**, Q-SYS 1702, **Save Settings**, link icon);
  `integrations/qsys.md` › Settings. Source: nav `web/plugins` (actions `Save
  Settings`); `QSysPlugin.cs` `Label = "Server address"`.
- Step `selector-control-value`: `control-values.md` › Kinds (Selector) and Settings
  (**Code / Short Name**, **Kind**, **Plugin**, **Controller Number** = named control
  in Q-SYS Designer). Source: nav `web/controlvalues/details` fields `Kind` (options
  Level/Selector/Toggle), `Plugin`, `Controller Number` (help "When Plugin = QSYS: The
  named control id from Q-SYS Designer"), action `Add Choice`;
  `ControlValueDetails.vue` display name `QSYS: 'Q-SYS'`.
- Step `check-live-value`: `control-values.md` › Live State Everywhere. Source: nav
  `web/controlvalues` column `Value`.
- Step `control-value-trigger`: `input-triggers.md` › Control Value Triggers (Selector
  → **Start Choice**, optional **Stop Choice**). Source: nav `web/inputtriggers/details`
  Type option `Control Value`; `InputTriggerDetails.vue` relabels `address` →
  "Control Value", `startPayload` → "Start Choice", `stopPayload` → "Stop Choice" for
  Type Control Value; help "Choice name (case insensitive) or index".
- Step `apply-preset-action`: `input-triggers.md` › Actions (Apply Preset). Source: nav
  `web/inputtriggers/details` Action Type option `Apply Preset`, field `Target`.
- Step `test-from-dsp`: `input-triggers.md` › Control Value Triggers ("Only changes
  made on the DSP side fire the trigger"; first value on startup arms without firing);
  `control-values.md` › Triggering From the DSP.

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
