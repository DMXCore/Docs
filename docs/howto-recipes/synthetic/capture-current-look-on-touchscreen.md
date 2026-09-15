---
status: candidate
source: synthetic
invented: true
level: newbie
surface: touchscreen
date: 2026-09-15
title: Capture the current look as a static cue on the touchscreen
slug: capture-current-look-on-touchscreen
anonymized: true
docs_slugs:
  - dmx-core-100/playback/recording
  - dmx-core-100/playback/cues
  - dmx-core-100/lighting/stream-routing
verified: docs be6f663, core v2026.914.3
---

# Capture the current look as a static cue on the touchscreen

## Original ask

> my lighting desk is sending a nice scene to the box right now. how do i save that scene on the box itself using the little screen so i can bring it back later without the desk? i dont have a laptop here

## Goal

The look arriving from the console is stored on the unit as a **static cue**, captured from the touchscreen, and plays back from **Main Menu > Cues** without the console.

## Walkthrough

```json
{
  "id": "capture-current-look-on-touchscreen",
  "title": "Capture the current look as a static cue on the touchscreen",
  "steps": [
    {
      "id": "open-record-cue",
      "label": "On the touchscreen, go to Main Menu → Utilities → Record Cue (the docs call it Utilities > Record)",
      "docsUrl": "/dmx-core-100/playback/recording/#recording-on-the-touchscreen",
      "screenshotId": "record-cue"
    },
    {
      "id": "preview",
      "label": "With the desk still sending the scene, press Preview and wait until the universe grid shows channel levels",
      "docsUrl": "/dmx-core-100/playback/recording/#recording-on-the-touchscreen",
      "screenshotId": "record-cue-preview"
    },
    {
      "id": "save-static",
      "label": "Press Save Static Cue to store that single moment",
      "docsUrl": "/dmx-core-100/playback/recording/#recording-on-the-touchscreen",
      "screenshotId": "record-cue-preview"
    },
    {
      "id": "leave-preview",
      "label": "Press Abort to stop previewing, then go back",
      "docsUrl": "/dmx-core-100/playback/recording/#recording-on-the-touchscreen",
      "screenshotId": "record-cue"
    },
    {
      "id": "play-rename",
      "label": "Go to Main Menu → Cues, tap the new cue to play it, and long-hold it to change its Name",
      "docsUrl": "/dmx-core-100/playback/cues/#viewing-and-playing-cues",
      "screenshotId": "device-cues-list"
    }
  ]
}
```

## Gotchas

- What they call a "scene" is a **static cue** here (Save Static Cue), not a preset.
  Presets are built from fixtures (Fixture Control / preset editor), not from recorded DMX.
- Preview stops any playback that is running on the unit.
- Save Static Cue works straight from preview. **Manual Trigger** is only needed for a
  dynamic (moving) recording, before Save Dynamic Cue.
- If the grid stays empty, the recorder is not listening on the protocol or universes the
  desk sends. Check **Main Menu > Settings > Inputs** (mapping rows and **Recording
  protocol**).
- Static saves get no Play / Restart test buttons. Only dynamic saves do.
- If **Record Cue** is missing from Utilities, recording may be restricted to admins
  (lock-down option "Only allow admins to record"). Log in as admin first.

## Eval checks

- Path is `Main Menu > Utilities` then `Record Cue` (accept `Utilities > Record`)
- Mentions **Preview** before **Save Static Cue**
- Uses **Save Static Cue**, not Save Dynamic Cue, for a single look
- Playback from `Main Menu > Cues` (tap to play, long-hold for settings)
- Does not require the Web UI or a laptop for this task
- Does not tell them to save a preset or use Fixture Control to capture incoming DMX
- Does not tell them to use MCP or the Integration API

## Gaps

- Docs `playback/recording.md` › Recording on the Touchscreen says **Main Menu > Utilities >
  Record**. The touchscreen menu item and page title are **Record Cue**
  (`src/UnoHost/Services/MenuManager.cs`, navigation `uno/utilities` item "Record Cue";
  `src/UnoHost/Views/RecordPage.xaml` title "Record Cue").
- Same page: "Use the **Abort** button (touchscreen: **Stop**)". The touchscreen button is
  labelled **Abort** (`RecordPage.xaml` line 126 `Content="Abort"`; also visible in
  screenshot `record-cue`).
- Same page, step 1: "listening for ArtNet or sACN packets (depending on output configuration).
  The universe IDs are taken from the output configuration." In v2026.914.3 the recorder uses
  the input mapping and **Recording protocol** from Settings > Inputs, as documented on
  `lighting/stream-routing.md` and in navigation `uno/settings/inputs`
  (`RecordViewModel.cs` uses `storageManager.InputPortType` and the input mappings).
- Same page, step 3 (touchscreen) and the Web UI section: "While previewing … Press **Save
  Dynamic Cue**". **Save Dynamic Cue** is only enabled once recording has started, and
  recording starts with **Manual Trigger** (or the configured input trigger). The docs never
  mention Manual Trigger. The Web UI section also leaves out **Enable Recorder**, which is
  needed first (it starts Preview automatically). Source: `RecordViewModel.cs` `RecordCommand`
  (PreviewWithData) → `SaveCueCommand` (Recording only); `Record.vue` `canTrigger` /
  `canSaveCue`, `activateRecorder`.
- Docs `getting-started/quick-start.md` › Record a cue names the buttons **Save Cue** and
  **Save Snapshot** ("capture a single moment as a preset"). The buttons are **Save Dynamic Cue**
  and **Save Static Cue**, and a static save creates a static cue, not a preset (`Record.vue`,
  `RecordViewModel.OnSaveSnapshot` "Saved static cue"). The page also leaves out Enable
  Recorder and Manual Trigger.
- Same page does not mention the **Send to output** checkbox on the touchscreen Record Cue
  screen (`RecordPage.xaml` line 68).

## Verification

- Step open-record-cue: docs `playback/recording.md` › Recording on the Touchscreen; source
  navigation `uno/utilities` → item `Record Cue` → `uno/utilities/record cue`
  (`src/UnoHost/ViewModels/RecordViewModel.cs`).
- Step preview: docs same heading, steps 1–2; `RecordPage.xaml` button "Preview"
  (`PreviewCommand`, enabled when Idle); universe grid shown in PreviewWithData.
- Step save-static: docs same heading, step 3; `RecordPage.xaml` "Save Static Cue"
  (`SaveSnapshotCommand` enabled in `RecordStates.PreviewWithData`; `OnSaveSnapshot` →
  "Saved static cue with code …").
- Step leave-preview: docs same page, Abort sentence; `RecordPage.xaml` "Abort" (`StopCommand`).
- Step play-rename: docs `playback/cues.md` › Viewing and Playing Cues; navigation `uno/mainmenu`
  item `Cues` → `uno/cues` ("Hold to open its settings") → `uno/cues/{cue}` field `Name`.
- Lock-down gotcha: docs `configuration/settings.md` (lock-down options); navigation
  `uno/utilities` Record Cue availableWhen "Recording not restricted to admins or Permission: Record".

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
