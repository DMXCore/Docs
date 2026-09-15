---
status: candidate
source: synthetic
invented: true
level: intermediate
surface: web
date: 2026-09-15
title: Route an sACN console through the DMX Core to Art-Net outputs
slug: route-sacn-console-to-artnet-outputs
anonymized: true
docs_slugs:
  - dmx-core-100/lighting/stream-routing
  - dmx-core-100/configuration/output-config
  - dmx-core-100/playback/layers-and-priority
verified: docs be6f663, core v2026.914.3
---

# Route an sACN console through the DMX Core to Art-Net outputs

## Original ask

> Our desk only outputs sACN (universes 1 and 2). The pixel controllers in the ceiling are Art-Net and they're already patched as outputs on the DMX Core, which runs the house schedule at night. Can the DMX Core convert the desk's sACN to Art-Net live, without me re-recording anything, and still run its schedule?

## Goal

The desk's sACN universes 1–2 land on slots 1–2, routing is on, and the existing Art-Net outputs on slots 1–2 carry the desk live, merged with the DMX Core's own playback by priority.

## Walkthrough

```json
{
  "id": "route-sacn-console-to-artnet-outputs",
  "title": "Route sACN universes 1–2 to Art-Net outputs",
  "steps": [
    {
      "id": "check-outputs",
      "label": "Go to Lighting Setup → Outputs and confirm the ArtNet output(s) to the pixel controllers cover Start Slot Id 1 with Universe Count 2",
      "docsUrl": "/dmx-core-100/configuration/output-config/#output-settings",
      "screenshotId": "outputs-list"
    },
    {
      "id": "add-input-row",
      "label": "Go to Lighting Setup → Inputs, click Add New, set Protocol sACN / E1.31, Start Universe Id 1, Universe Count 2, Start Slot Id 1, then Save",
      "docsUrl": "/dmx-core-100/lighting/stream-routing/#setting-it-up",
      "screenshotId": "inputs"
    },
    {
      "id": "route-on",
      "label": "On the Inputs page, turn on Route input to outputs",
      "docsUrl": "/dmx-core-100/lighting/stream-routing/#setting-it-up",
      "screenshotId": "inputs"
    },
    {
      "id": "check-live-sources",
      "label": "With the desk sending, check the Live Sources table shows the desk on universes 1 and 2 as live and lists the Art-Net outputs it reaches",
      "docsUrl": "/dmx-core-100/lighting/stream-routing/#setting-it-up",
      "screenshotId": "inputs"
    },
    {
      "id": "check-conflicts",
      "label": "Back in Lighting Setup → Outputs, look for Routing Conflict. An sACN output left on universe 1 or 2 without a unicast Destination IP is skipped for routing, so disable it or unicast it",
      "docsUrl": "/dmx-core-100/lighting/stream-routing/#loops-and-conflicts",
      "screenshotId": "outputs-routing-conflict"
    }
  ]
}
```

## Gotchas

- Adding input rows alone never drives the outputs. Only **Route input to outputs** does.
- Outputs receive routed data by **slot id**, not by universe number. The input row's Start Slot Id must match the outputs' Start Slot Id.
- The default sACN output on universe 1 sends multicast on a universe the device now listens to. It is flagged **Routing Conflict** and left out of routing, though it still works for playback.
- The desk's sACN priority competes with the DMX Core's cues and presets in the same priority merge. A desk at 200 takes over a cue at 100. At equal priority they combine per **Merge Mode** (Lighting Setup > Protocol).
- Stop leaves the desk streaming, Blackout masks it, Output Off parks it. The master dimmer also applies to routed input.
- Zone-scoped outputs are not fed by routing.
- Routing is saved and resumes after a restart.

## Eval checks

- Menu path `Lighting Setup > Inputs` for the mapping and the switch
- Row values: Protocol **sACN / E1.31**, Start Universe Id **1**, Universe Count **2**, Start Slot Id **1**
- Mentions turning on **Route input to outputs**
- Explains that routed input reaches outputs mapped to the same slot id
- Mentions Routing Conflict / loop for an sACN output on the same universe
- Says the schedule and cues keep working and merge by priority. Does not say routing replaces playback
- Does not say the 2-port board **Passthru Function** is needed (that is port-to-port DMX only)
- Does not tell them to record a cue first
- Does not tell them to use MCP or the Integration API

## Gaps

- stream-routing.md does not name the **Add New** button or the **Details** columns on the Inputs page (navigation `web/inputs`). It also does not say the row editor is a separate page with **Save / Save & Go Back** (`web/inputs/details`).
- Screenshot `inputs` shows sACN and Art-Net rows. There is no screenshot of the Input Mapping Details editor.

## Verification

- Outputs by slot: output-config.md "Output Settings" (Start Slot Id / Start Universe Id, Universe Count). Navigation `web/outputs/details`.
- Input row fields and protocol names: stream-routing.md "Setting it up" step 1. Navigation `web/inputs/details` (Protocol options `sACN / E1.31`, `Art-Net`, `DMX Serial`; Start Universe Id; Universe Count; Start Slot Id; Save). `InputMappingDetails.vue` at v2026.914.3.
- Route input to outputs switch: stream-routing.md step 3. `Inputs.vue` heading "Route input to outputs" and routing tooltip ("Configuring input alone never drives the outputs; this switch does"). `OutputConfig.RoutingEnabled` default false.
- Live Sources: stream-routing.md "Setting it up". `Inputs.vue` columns Universe, Slot Id, Source, Priority, Frames/s, State, Outputs.
- Routing Conflict: stream-routing.md "Loops and conflicts". `src/BusinessObject/Output.cs` `GetDescriptionText` returns "Routing Conflict". `InputRoutingGraph.ComesBackToUs` (multicast/broadcast always loop back; unicast only to own address).
- Priority merge: stream-routing.md "Merging with playback". layers-and-priority.md "Priorities".
- Zone-scoped outputs skipped: stream-routing.md last line. `InputRoutingGraph.BuildEdges` skips `output.ZoneId != null`.

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
