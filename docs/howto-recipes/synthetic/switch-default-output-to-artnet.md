---
status: candidate
source: synthetic
invented: true
level: newbie
surface: both
date: 2026-09-15
title: Switch the default sACN output to Art-Net for a node
slug: switch-default-output-to-artnet
anonymized: true
docs_slugs:
  - dmx-core-100/configuration/output-config
  - dmx-core-100/getting-started/quick-start
  - dmx-core-100/configuration/output-monitor
verified: docs be6f663, core v2026.914.3
---

# Switch the default sACN output to Art-Net for a node

## Original ask

> just installed an art net node for the stage lights but the dmx core says sacn line 1. how do i change it to art net?? im standing at the box on the wall with the little screen

They follow up after the first answer:

> ok and can i do the same thing from my laptop instead

## Goal

The default output (slot 1) is sent as Art-Net on the universe the node listens to, changed on the touchscreen or in the Web UI, and the node receives data.

## Walkthrough

```json
{
  "id": "switch-default-output-to-artnet",
  "title": "Switch the default sACN output to Art-Net",
  "steps": [
    {
      "id": "open-output-touchscreen",
      "label": "On the touchscreen, go to Main Menu → Settings → Output Configuration and tap the existing sACN output",
      "docsUrl": "/dmx-core-100/configuration/output-config/#touchscreen",
      "screenshotId": "uno-output-config"
    },
    {
      "id": "set-artnet-touchscreen",
      "label": "Set Output Type to ArtNet, keep Start Slot Id 1, and set Start Universe Id to the universe the Art-Net node is set to",
      "docsUrl": "/dmx-core-100/configuration/output-config/#output-settings",
      "screenshotId": "uno-output-detail"
    },
    {
      "id": "open-output-web",
      "label": "Or, from a laptop, open the Web UI, go to Lighting Setup → Outputs and open the existing output's Details",
      "docsUrl": "/dmx-core-100/configuration/output-config/#web-ui",
      "screenshotId": "outputs-list"
    },
    {
      "id": "set-artnet-web",
      "label": "Set Output Type to ArtNet and Start Universe Id to the node's universe. Optionally enter the node's address in Destination IP (unicast). Then Save",
      "docsUrl": "/dmx-core-100/configuration/output-config/#output-settings",
      "screenshotId": "output-editor"
    },
    {
      "id": "check-output-monitor",
      "label": "If the lights still do not respond, open Utilities → Output Monitor in the Web UI, click Start Monitor and select slot 1 to see whether the DMX Core is sending values",
      "docsUrl": "/dmx-core-100/configuration/output-monitor/#starting-the-monitor",
      "screenshotId": null
    }
  ]
}
```

## Gotchas

- "Line 1" is universe 1 on the default output. A new install already has an sACN output on universe 1, so edit that output. Do not add a second output for the same slot.
- Art-Net universe numbering differs between products. Some count from 0 and some from 1. The DMX Core Inputs help says Art-Net "counts from 0". If the node shows nothing, check how the node numbers its universes and try the neighbouring number.
- Leaving Destination IP (unicast) empty sends broadcast. That works for a single node. Unicast to the node's IP is optional.
- Fixture setup is done in the Web UI. This task only changes the output, and it can be done on either surface.
- The Output Monitor shows what the DMX Core sends. If values move there but not on the node, the problem is the node's universe or network, not the DMX Core.

## Eval checks

- Touchscreen path is `Main Menu > Settings > Output Configuration`
- Web UI path is `Lighting Setup > Outputs`
- Changes the **Output Type** to ArtNet on the existing output (does not only add a new output)
- Mentions **Start Universe Id** matching the node, and warns about 0- vs 1-based Art-Net numbering
- Answers the follow-up with the Web UI path. Does not say it is Web UI only or touchscreen only
- If troubleshooting is mentioned, uses `Utilities > Output Monitor` (Web UI only)
- Does not invent a "Protocol" or "DMX line" dropdown on the output editor
- Does not tell them to use MCP or the Integration API

## Gaps

- Output Config page does not say which numbering Art-Net **Start Universe Id** uses on outputs. Only the input mapping help says "Art-Net counts from 0" (`src/AdminSite/ClientApp/src/views/operation/InputMappingDetails.vue`). `DataFormatting.GetArtNetAddress3` (`src/BusinessObject/DataFormatting.cs`) subtracts 1 before it formats net:subnet:universe for the Outputs list description. Output numbering needs confirming and documenting.
- Quick Start "Step 2 - Check Your Output" says to choose a **Protocol** and set the **Universe**. The released editor labels are **Output Type** and **Start Universe Id** (`OutputDetails.vue`; navigation `web/outputs/details`). **Protocol** is a different field, shown only for some output types.
- Output Config says to click **Add** in the Web UI via Quick Start. The Web list action is **Add New** (navigation `web/outputs`). The touchscreen item is **Add** (`uno/settings/output configuration`).
- No screenshot of the Output Monitor (catalog has no id).

## Verification

- Touchscreen path: output-config.md "Touchscreen" (**Main Menu > Settings > Output Configuration**, tap an output). Navigation `uno/settings/output configuration` and `uno/settings/output configuration/{output}` (`src/UnoHost/Services/MenuManager.cs`, Title "Output Configuration").
- Fields Output Type, Start Slot Id, Start Universe Id, Destination IP (unicast): output-config.md "Output Settings". Navigation `uno/settings/output configuration/{output}` and `web/outputs/details`. `OutputDetails.vue` labels at v2026.914.3.
- Web path: output-config.md "Web UI" (**Lighting Setup > Outputs**). Navigation `web/outputs` (Details column, Save action on `web/outputs/details`).
- Default sACN output on universe 1: output-config.md note "Default output".
- Output Monitor: output-monitor.md "Starting the Monitor" (**Utilities > Output Monitor**, **Start Monitor**, select a slot). Navigation `web/utilities/outputmonitor` (`OutputMonitor.vue`).
- Art-Net counts from 0: `InputMappingDetails.vue` infoText. stream-routing.md "Setting it up" example (sACN universe 1 vs Art-Net universe 0).

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
