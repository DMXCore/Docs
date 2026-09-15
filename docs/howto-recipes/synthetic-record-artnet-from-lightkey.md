---
status: likely
source: synthetic
date: 2026-09-14
title: Record Art-Net universes from lighting software
slug: record-artnet-from-lightkey
anonymized: true
docs_slugs:
  - dmx-core-100/getting-started/quick-start
  - dmx-core-100/lighting/stream-routing
  - dmx-core-100/playback/recording
---

# Record Art-Net universes from lighting software

Synthetic format demo (not a real ticket). Keep as a gold path until a
confirmed interaction replaces it.

## Original ask

> I want to record Art-Net universe 5–7 from my Lightkey app.

## Goal

A dynamic cue captured from Lightkey Art-Net on universes 5–7, with Preview
showing live levels before Save.

## Walkthrough

```json
{
  "id": "record-artnet-from-lightkey",
  "title": "Record Art-Net universes 5–7 from Lightkey",
  "steps": [
    {
      "id": "map-inputs",
      "label": "Go to Lighting Setup → Inputs and add Art-Net mapping rows for universes 5, 6, and 7 (watch 0-based vs 1-based Art-Net numbering)",
      "docsUrl": "/dmx-core-100/lighting/stream-routing/",
      "screenshotId": "inputs"
    },
    {
      "id": "recording-protocol",
      "label": "Set Recording protocol to Art-Net (a recording captures one protocol)",
      "docsUrl": "/dmx-core-100/playback/recording/",
      "screenshotId": "inputs"
    },
    {
      "id": "lightkey-output",
      "label": "In Lightkey, send Art-Net to the DMX Core’s IP on those universes",
      "docsUrl": "/dmx-core-100/playback/recording/",
      "screenshotId": null
    },
    {
      "id": "preview-save",
      "label": "Go to Utilities → Record, press Preview until the channel monitor moves, then Save Dynamic Cue",
      "docsUrl": "/dmx-core-100/playback/recording/",
      "screenshotId": "record"
    }
  ]
}
```

## Gotchas

- This is **Inputs + Record**, not Outputs.
- Recording protocol is a single choice even if several protocols are mapped.
- Art-Net from the same PC as the desktop software is ignored (stream-routing
  docs). Send sACN from that machine, or run Lightkey on another device.
- Confirm whether Lightkey’s “universe 5” is Art-Net 5 or 4 (0-based).

## Eval checks

- Mentions `Lighting Setup > Inputs` before Record
- Sets recording protocol to Art-Net
- Mentions Preview before Save Dynamic Cue
- Mentions 0- vs 1-based and/or same-PC Art-Net ignore

## Gaps

- Screenshot id `record` must match `SHOTS` in the capture script (verify
  when wiring eval)
- No Lightkey-app screenshot (external)

## Source notes

Synthetic; from product-planning chat 2026-09-14.
