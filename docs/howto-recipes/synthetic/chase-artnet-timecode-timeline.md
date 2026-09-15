---
status: candidate
source: synthetic
invented: true
level: advanced
surface: web
date: 2026-09-15
title: Lock a timeline to Art-Net timecode so it rejoins after a reboot
slug: chase-artnet-timecode-timeline
anonymized: true
docs_slugs:
  - dmx-core-100/playback/timecode-chase
  - dmx-core-100/playback/timelines
verified: docs be6f663, core v2026.914.3
---

# Lock a timeline to Art-Net timecode so it rejoins after a reboot

## Original ask

> QLab runs the show audio and spits out LTC. I want the DMX Core timeline slaved to it, so
> if the unit reboots mid-show it comes back at the right spot, not from the top. Show
> starts at TC 01:00:00:00. Also nobody should be able to fire it by hand off the
> touchscreen or a schedule and run it out of sync.

A follow-up after the first reply:

> So LTC straight into the box is a no-go? What do I actually need to send it then?

## Goal

A timeline set to **Timecode only** with Offset 01:00:00:00 and **Auto Start On** chases
Art-Net ArtTimeCode from a converter or generator. It rejoins live timecode after a reboot,
and it refuses Play whenever no timecode is in range.

## Walkthrough

```json
{
  "id": "chase-artnet-timecode-timeline",
  "title": "Lock a timeline to Art-Net timecode so it rejoins after a reboot",
  "steps": [
    {
      "id": "timecode-source",
      "label": "Feed Art-Net ArtTimeCode (not LTC or MTC) to the device IP or subnet broadcast on UDP 6454, using a converter or generator such as TimeCore or Timecode Expert",
      "docsUrl": "/dmx-core-100/playback/timecode-chase/#what-you-need",
      "screenshotId": null
    },
    {
      "id": "check-tc-chip",
      "label": "In the Web UI, go to Lighting → Timelines, open the show timeline in the Editor and confirm the TC: chip shows a running HH:MM:SS:FF instead of waiting…",
      "docsUrl": "/dmx-core-100/playback/timecode-chase/#the-tc-readout",
      "screenshotId": "timeline-editor"
    },
    {
      "id": "set-mode",
      "label": "Click More... next to the name and, under Timecode, choose Timecode only; set Art-Net stream to match the generator (often 0) and Offset to 01:00:00:00",
      "docsUrl": "/dmx-core-100/playback/timecode-chase/#timecode-mode",
      "screenshotId": "timeline-timecode-chase"
    },
    {
      "id": "auto-start",
      "label": "Set Auto Start to On so the timeline starts and rejoins by itself, pick Auto Stop / After Roll for signal loss, then Save",
      "docsUrl": "/dmx-core-100/playback/timecode-chase/#auto-start",
      "screenshotId": "timeline-timecode-chase"
    },
    {
      "id": "test-join",
      "label": "Test: locate the generator into the middle of the show and check the timeline follows; with timecode stopped, check that Play from the touchscreen is refused",
      "docsUrl": "/dmx-core-100/playback/timecode-chase/#restart-mid-show",
      "screenshotId": null
    }
  ]
}
```

## Gotchas

- The device **receives Art-Net ArtTimeCode only**. MTC and LTC are not supported, and QLab
  cannot send ArtTimeCode by itself, so a converter or generator is needed.
- Sending to `127.0.0.1` on a PC does not reach a unit bound to its LAN adapter.
- The timeline **Duration** must cover the clock window (Offset to Offset + show length).
  Timecode past the end is out of range.
- **Timecode only** refuses Play, Jump and Resume from every source (editor, touchscreen,
  schedules, custom menus, surfaces, triggers, OSC, API) unless they join live timecode.
  **Stop** and **Pause** still work.
- To preview from the cursor while programming, switch Timecode to **Internal** (or use
  **Chase**, which runs on its own clock when no timecode is present).
- A mid-show join takes about one second. **Loop** is treated as 1 while chasing.
- This is a playhead chase, not per-cue timecode triggers.
- A **Hold** milestone leaves the clock until it is released. Auto Resume then applies.

## Eval checks

- Says LTC/MTC are not supported and ArtTimeCode (Art-Net, UDP `6454`) is required
- Menu path is `Lighting > Timelines`, then the timeline **Editor** / **More...** settings
- Sets Timecode to **Timecode only** (Chase acceptable only if it explains that Chase still allows manual runs)
- Sets **Offset** to `01:00:00:00`
- Sets **Auto Start** to **On** for the reboot case
- Mentions the **TC:** chip to confirm packets
- Does not claim the device generates timecode or accepts LTC audio input
- Does not tell them to build Input Triggers or scripts to follow timecode
- Does not tell them to use MCP or the Integration API

## Gaps

- Screenshot missing: no screenshot of the TC: chip in the status bar on its own (the
  `timeline-editor` capture may not show live timecode), and no generator screenshot
  (external).

## Verification

- Step timecode-source: docs `playback/timecode-chase.md` › What You Need (OpTimeCode 0x9700,
  UDP 6454, MTC/LTC not supported, QLab note).
- Step check-tc-chip: docs › The TC Readout; navigation `web/timelines` actions `Open in Editor`
  and `web/timelines/details` action `Editor`; `src/AdminSite/ClientApp/src/components/timeline/StatusBar.vue`
  (v2026.914.3) text "waiting…".
- Step set-mode: docs › Timecode Mode ("expand timeline settings (the More... pill)"); navigation
  `web/timelines/editor` summary "More... / Less for the timeline settings";
  `TimelinePropertiesPanel.vue` labels "Timecode", "Art-Net stream", "Offset"; option labels
  Internal / Chase / Timecode only (`TimelinePropertiesPanel.spec.js`).
- Step auto-start: docs › Auto Start, › After Roll, Auto Stop, and Auto Resume; `TimelinePropertiesPanel.vue`
  labels "Auto Start", "Auto Stop", "After Roll", "Auto Resume", options "Off, pause",
  "Off, keep running", "On, stop"; navigation `web/timelines/editor` action `Save`.
- Step test-join: docs › Restart Mid-Show, › Timecode Only (refusal from every source, Stop and
  Pause still work), › While Locked (locates followed).

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
