---
status: candidate
source: synthetic
invented: true
level: newbie
surface: web
date: 2026-09-15
title: Send both sACN and Art-Net outputs
slug: output-sacn-and-artnet
anonymized: true
docs_slugs:
  - dmx-core-100/configuration/output-config
verified: docs 41ec0c1, core main (MagnusEngine OutputManager.AddMapping)
---

# Send both sACN and Art-Net outputs

## Original ask

> Output both sACN and ArtNet?

## Goal

Two outputs on Lighting Setup > Outputs fed from the same slots, one with Output Type sACN (E1.31) and one ArtNet, each sending to its own universe or destination.

## Walkthrough

```json
{
  "id": "output-sacn-and-artnet",
  "title": "Send both sACN and Art-Net",
  "steps": [
    {
      "id": "open-outputs",
      "label": "In the Web UI, go to Lighting Setup → Outputs; the default sACN output on universe 1 is already there",
      "docsUrl": "/dmx-core-100/configuration/output-config/",
      "screenshotId": null
    },
    {
      "id": "add-artnet",
      "label": "Click Add New, set Output Type to ArtNet with the same Start Slot Id, choose its Start Universe Id and Destination IP, then Save",
      "docsUrl": "/dmx-core-100/configuration/output-config/#mirroring-outputs",
      "screenshotId": "output-editor"
    }
  ]
}
```

## Gotchas

- This is Outputs, not Inputs or Stream Routing: nothing needs to be received or routed to send on two protocols.
- Any number of outputs can share slots; only an output that sends to exactly the same type, universe and destination as another is not used.
- When input is also routed, don't send a slot back onto a universe the unit receives on the same protocol (routing loop).

## Eval checks

- Menu path includes `Lighting Setup > Outputs`
- Mentions **Output Type** with sACN and ArtNet as separate outputs
- Does not answer with the Inputs page or input mapping as the way to send output

## Gaps

- None left in the docs: Output Config's Mirroring Outputs section (docs 41ec0c1) states it. Before that, search ranked Stream Routing first for this question and gpt-4.1-mini answered with Lighting Setup › Inputs.

## Verification

- Steps: output-config.md, Web UI and Mirroring Outputs sections; navigation `web/outputs` (action Add New) and `web/outputs/details` (Output Type, Start Slot Id, Start Universe Id).
- Outputs sharing slots: MagnusEngine `OutputManager.AddMapping` appends every mapping per slot and refuses only a duplicate output key.

## Source notes

Owner's own test chat, 2026-09-15 (session 4vxMnDfn9fXZGTimLGV2BA). Invented scenario for eval purposes; not from a real installer.
