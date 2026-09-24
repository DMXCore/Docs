---
status: candidate
source: synthetic
invented: true
level: newbie
surface: both
date: 2026-09-15
title: Make a recorded show repeat all evening with a fade in
slug: make-recorded-show-loop-with-fade
anonymized: true
docs_slugs:
  - dmx-core-100/playback/cues
verified: docs be6f663, core v2026.914.3
---

# Make a recorded show repeat all evening with a fade in

## Original ask

> i recorded my christmas light show onto the box and it works but it plays one time and then
> just stops. how do i make it keep going over and over all night? and can it come on softly
> instead of just popping on

## Goal

Cues start with a fade in and repeat forever. The user sets **Loop 0** and **Fade In** in
the cue playback settings, either in the Web UI or on the touchscreen.

## Walkthrough

```json
{
  "id": "make-recorded-show-loop-with-fade",
  "title": "Make a recorded show repeat all evening with a fade in",
  "steps": [
    {
      "id": "web-defaults",
      "label": "In the Web UI, go to Lighting → Cues and, under Default Settings below the list, set Loop to 0 (loop forever)",
      "docsUrl": "/dmx-core-100/playback/cues/#viewing-and-playing-cues",
      "screenshotId": "cues-list"
    },
    {
      "id": "web-fade",
      "label": "In the same Default Settings, set Fade In (seconds), for example 3, and Fade Out (seconds) if you also want a soft stop",
      "docsUrl": "/dmx-core-100/playback/cues/#viewing-and-playing-cues",
      "screenshotId": "cues-list"
    },
    {
      "id": "play",
      "label": "Click the play icon next to the show cue to start it",
      "docsUrl": "/dmx-core-100/playback/cues/#viewing-and-playing-cues",
      "screenshotId": "cues-list"
    },
    {
      "id": "touchscreen-alt",
      "label": "Or on the touchscreen: go to Main Menu → Cues, tap the arrow to expand the top bar, set Loop and Fade In, then tap the cue",
      "docsUrl": "/dmx-core-100/playback/cues/#viewing-and-playing-cues",
      "screenshotId": "cues-list-controls"
    }
  ]
}
```

## Gotchas

- In this release Loop, Fade In and Fade Out are **not on each cue's own page**. They are
  the playback settings on the Cues list: **Default Settings** in the Web UI, the expandable
  top bar on the touchscreen. They apply to cues started from there, not to one cue only.
- **Loop 0 = forever**. Loop 1 plays once, which is why the show stopped.
- **Bounce Playback** on the cue page (forward then backward) can hide a visible jump at the
  loop point. It is optional.
- To stop a looping show: Stop on the dashboard progress bar (Web UI) or the stop button on
  the touchscreen home screen / cue top bar.
- If it should start by itself every evening, that is a Schedule. Say so, but it is a
  separate task.

## Eval checks

- Sets Loop to `0` (forever)
- Sets a **Fade In** time
- Web UI path `Lighting > Cues`, Default Settings (not a Loop field on the cue detail page)
- Touchscreen path `Main Menu > Cues`, expand top bar (accept either surface)
- Does not tell them to re-record the show, or to build a Timeline just to loop it
- Does not invent a per-cue Loop / Fade In field on the Web UI cue details page
- Does not tell them to use MCP, the Integration API or a script

## Gaps

- Docs discrepancy: `playback/cues.md` › Cue Settings lists **Fade In / Fade Out** and **Loop**
  as per-cue settings ("Long-hold a cue on the touchscreen, or open it in the Web UI"). In
  v2026.914.3, neither the Web UI cue details (`src/AdminSite/ClientApp/src/views/operation/CueDetails.vue`,
  navigation `web/cues/details`) nor the touchscreen cue settings (navigation `uno/cues/{cue}`,
  `MenuManager.cs`) have those fields. They are **Default Settings** on the Cues list
  (`Cues.vue` `cueDefaults.cueLoop` / `cueFadeInDurationMS` / `cueFadeOutDurationMS`; labels
  "Loop", "0 = loop forever", "Fade In (seconds)", "Fade Out (seconds)") and the touchscreen
  cue player bar (`src/UnoHost/Views/CuePlayerControl.xaml` Loop, Dimmer, Fade In, Fade Out).
- Docs missing: `playback/cues.md` › Viewing and Playing Cues describes the Web UI list (duration,
  size, play, download) but not its **Default Settings** section.
- Screenshot: `cues-list` may not include the Default Settings section below the table.

## Verification

- Steps web-defaults / web-fade: navigation `web/cues` section "Default Settings" fields
  `Loop`, `Fade In (seconds)`, `Fade Out (seconds)`; `Cues.vue` (v2026.914.3) hint
  "0 = loop forever". Docs support for Loop semantics: `playback/cues.md` › Cue Settings
  ("Loop - Number of times to repeat playback (0 = forever)").
- Step play: docs `playback/cues.md` › Viewing and Playing Cues ("Click the play icon");
  navigation `web/cues` action `Play`.
- Step touchscreen-alt: docs same heading ("The top bar expands … adjustable Loop, Fade In, and
  Fade Out settings"); `CuePlayerControl.xaml` buttons "Loop", "Fade In", "Fade Out";
  navigation `uno/mainmenu` item `Cues`.
- Bounce Playback: docs › Cue Settings; navigation `web/cues/details` field `Bounce Playback`
  (visible for capture cues).
- Stopping: docs `playback/cues.md` › Playback Controls.

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
