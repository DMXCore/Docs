---
status: candidate
source: synthetic
invented: true
level: advanced
surface: web
date: 2026-09-15
title: Map Art-Net and sACN inputs to separate slots
slug: artnet-and-sacn-inputs-on-separate-slots
anonymized: true
docs_slugs:
  - dmx-core-100/lighting/stream-routing
  - dmx-core-100/configuration/output-config
verified: docs be6f663, core v2026.914.3
---

# Map Art-Net and sACN inputs to separate slots

## Original ask

> Two sources into the DMX Core for routing: console on sACN uni 1 for the wash rig, media server on Art-Net uni 0 for the pixel wall. sACN row saved fine on slot 1. The Art-Net row on slot 1 won't save: "Slot 1 is already mapped from sACN / E1.31 1. Input rows on different protocols must use different slot ids." Art-Net 0 and sACN 1 are the same universe, so why is that a conflict? And how should I lay this out?

## Goal

The console's sACN universe 1 stays on slot 1, the media server's Art-Net universe 0 gets its own slot 2 with an output to the pixel controller, and both route at the same time.

## Walkthrough

```json
{
  "id": "artnet-and-sacn-inputs-on-separate-slots",
  "title": "Map Art-Net universe 0 and sACN universe 1 to separate slots",
  "steps": [
    {
      "id": "artnet-row-slot-2",
      "label": "In Lighting Setup → Inputs, add the Art-Net row with Protocol Art-Net, Start Universe Id 0 (Art-Net counts from 0), Universe Count 1, Start Slot Id 2, then Save",
      "docsUrl": "/dmx-core-100/lighting/stream-routing/#setting-it-up",
      "screenshotId": "inputs"
    },
    {
      "id": "output-slot-2",
      "label": "In Lighting Setup → Outputs, point the pixel wall output at Start Slot Id 2, with the controller's universe and its address in Destination IP (unicast), then Save",
      "docsUrl": "/dmx-core-100/configuration/output-config/#output-settings",
      "screenshotId": "output-editor"
    },
    {
      "id": "route-on",
      "label": "On Lighting Setup → Inputs, make sure Route input to outputs is on",
      "docsUrl": "/dmx-core-100/lighting/stream-routing/#setting-it-up",
      "screenshotId": "inputs"
    },
    {
      "id": "check-rows",
      "label": "Check Live Sources lists the console on slot 1 and the media server on slot 2 with the right outputs, and that no mapping row shows a warning triangle",
      "docsUrl": "/dmx-core-100/lighting/stream-routing/#loops-and-conflicts",
      "screenshotId": "inputs"
    }
  ]
}
```

## Gotchas

- The rule is about **slot ids**, not wire universes. Merging and recording both key on the slot, so two protocols on one slot would interleave two consoles into one universe. Different protocols need disjoint slot ranges.
- Two rows on the **same** protocol may share a slot; they merge highest-takes-precedence. If both sources really must drive the same fixtures, send both on sACN (or both on Art-Net) and map them to the same slot.
- Art-Net Start Universe Id is entered in Art-Net notation, which counts from 0. sACN counts from 1.
- An Art-Net output that broadcasts on universe 0 would loop into the Art-Net 0 input and show **Routing Conflict**. Unicast to the controller's IP, or use a different universe.
- A mapping that closes a loop through a second input row is refused on save.
- Art-Net from software on the same computer as the desktop software is ignored as the device's own output. Run the media server on another machine or send sACN.
- Any fixtures patched on slot 2 would also go out to the pixel wall. Keep the rig's fixtures on slot 1.

## Eval checks

- Explains slot ranges must be disjoint **between protocols**, and the same protocol may share a slot
- Gives the Art-Net row **Start Slot Id 2** (or another free slot) with **Start Universe Id 0**
- Moves or creates the pixel wall output on the same slot under `Lighting Setup > Outputs`
- Mentions `Route input to outputs` on `Lighting Setup > Inputs`
- Mentions Art-Net counting from 0 vs sACN from 1
- Warns that Art-Net broadcast on an input universe becomes a Routing Conflict (unicast is fine)
- Does not claim a setting that allows two protocols on one slot
- Does not tell them to use MCP, the Integration API or a script to merge the sources

## Gaps

- stream-routing.md does not quote the save error text. Source message: "Slot {n} is already mapped from {protocol} {universe}. Input rows on different protocols must use different slot ids." (`src/BusinessObject/InputMappingValidation.cs`).
- stream-routing.md never says outright that the Art-Net Start Universe Id is entered 0-based. The universe 0 example implies it, and the field help says it (`InputMappingDetails.vue`). Meanwhile `InputMapping.GetDisplayUniverse` passes the value through `DataFormatting.GetArtNetAddress3`, which subtracts 1 before formatting net:subnet:universe. The displayed Input Universe for Art-Net may not match the entered number. Needs a check against a real Art-Net row.

## Verification

- Disjoint slots between protocols, same protocol may share: stream-routing.md "Setting it up" (paragraph after step 3). `InputMappingValidation.Validate` (throws only for `other.PortType != value.PortType` with overlapping slot ranges). Navigation `web/inputs/details` Start Slot Id help.
- Art-Net counts from 0: `InputMappingDetails.vue` Start Universe Id infoText. `InputMapping.cs` summary. Navigation `web/inputs/details`.
- Output Start Slot Id / Destination IP (unicast): output-config.md "Output Settings". Navigation `web/outputs/details`.
- Route input to outputs, Live Sources, warning triangle: stream-routing.md "Setting it up" and "Loops and conflicts". `Inputs.vue` ("Routing loop: … not routed" warning icon on mapping rows; Live Sources columns).
- Broadcast loop and unicast exception: stream-routing.md "Loops and conflicts". `InputRoutingGraph.ComesBackToUs`.
- Loop through a second row refused: stream-routing.md "Loops and conflicts". `InputMappingValidation` "This mapping closes a routing loop".
- Same-PC Art-Net ignored: stream-routing.md "Setting it up" (own-output paragraph).

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
