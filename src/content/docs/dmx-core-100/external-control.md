---
title: Q-SYS & Symetrix
description: Two-way integration with QSC Q-SYS and Symetrix DSP cores
---

The DMX Core 100 integrates two ways with the two most common DSP platforms — the **Q-SYS** system from QSC and the **Symetrix** line of cores:

- **As a wall controller for the DSP** — the touchscreen displays buttons and faders wired to named controls on the DSP, giving an integrator an inexpensive UI for building automation: change audio inputs, ride levels, toggle power.
- **As a lighting controller driven by the DSP** — the DSP (or anything that talks to it) selects presets, triggers cues, and rides lighting levels on the DMX Core 100.

Both platforms use the DSP's built-in control interface — no scripting or extra licenses required on the DSP side.

## Configuration

1. In the Web UI, go to **Control & Integrations > Plugins**.
2. Set the **External Control Type** (Q-Sys or Symetrix) and enter the **DSP address** for your core.
3. Save. Connectivity is indicated in the touchscreen status bar — red means disconnected, white means connected.

<!-- SCREENSHOT: Plugins settings with External Control Type and DSP addresses (dark mode) -->

## Control Values

For levels, selectors, and mutes, define [Control Values](/dmx-core-100/integrations/control-values) that map to the DSP's controller numbers. They can then be bound anywhere — custom menu sliders, control surface knobs, input triggers, timelines, and scripts — with two-way state sync against the DSP. This is the recommended way to bridge DSP audio controls into the system.

## Touchscreen Remote Pages

To build DSP control pages for the touchscreen, open **Q-SYS** or **Symetrix** under the Web UI's plugin settings and define the pages as JSON. Once configured, the remote appears on the device under **Utilities > QSC Q-SYS Remote** / **Symetrix Remote**.

- Up to **4 columns** of controls mixing **buttons** and **faders**
- **Multiple levels on a single fader** — switch between rooms/zones, with the push knob assignable to mute or zone switching
- **Two-way updates** — current status and levels are reflected on all connected devices
- **Customizable** buttons, icons, colors, and multiple pages accessible via [custom menus](/dmx-core-100/scheduling-automation/custom-menus)
- **Dynamic reload** — saved changes appear on the touchscreen immediately, completely remotely

You'll find complete samples in the [public GitHub repository](https://github.com/DMXCore/DmxCore100/tree/main/samples). Here's one to get started:

```json
{
  "Pages": [
    {
      "Code": "PAGE1",
      "Title": "Q-Sys Sample page",
      "Sections": [
        {
          "Title": "Power",
          "Controls": [
            {
              "ControlType": "BUTTON",
              "Name": "ON",
              "Description": "Power On",
              "ControlId": "AudioPower",
              "SelectorValue": 0,
              "Icon": "start"
            },
            {
              "ControlType": "BUTTON",
              "Name": "OFF",
              "Description": "Power Off",
              "ControlId": "AudioPower",
              "SelectorValue": 1,
              "Confirm": true
            }
          ]
        },
        {
          "Title": "Input",
          "Controls": [
            {
              "ControlType": "BUTTON",
              "Name": "Cable TV",
              "Description": "Cable TV Receiver",
              "ControlId": "DMXCORE1_Input1",
              "Icon": "input"
            },
            {
              "ControlType": "BUTTON",
              "Name": "Apple TV",
              "Description": "Apple TV",
              "ControlId": "DMXCORE1_Input2"
            }
          ]
        },
        {
          "Title": "Volume",
          "Controls": [
            {
              "ControlType": "LEVEL",
              "Name": "Volume",
              "ControlId": "DMXCORE1_Level"
            }
          ]
        }
      ]
    }
  ]
}
```

Connect the buttons and sliders using named control IDs on your DSP in Q-Sys Designer / SymNet Composer.

## Lock-Down Deployments

Combine the remote pages with [lock-down mode](/dmx-core-100/configuration/settings) and a [custom menu](/dmx-core-100/scheduling-automation/custom-menus) so a wall-mounted unit only exposes the DSP remote — a dedicated room controller in a 2-gang box.
