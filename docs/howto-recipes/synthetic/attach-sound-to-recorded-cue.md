---
status: candidate
source: synthetic
invented: true
level: intermediate
surface: web
date: 2026-09-15
title: Attach a soundtrack to a recorded cue and line it up
slug: attach-sound-to-recorded-cue
anonymized: true
docs_slugs:
  - dmx-core-100/playback/sounds
  - dmx-core-100/playback/cues
verified: docs be6f663, core v2026.914.3
---

# Attach a soundtrack to a recorded cue and line it up

## Original ask

> I've got a 3-minute light show recorded as a cue and the matching mp3. I want the music to
> start with the cue every time it's triggered. When I tested, the audio feels about half a
> second off from the lights. Also where do I pick the USB audio interface I plugged in?

## Goal

The MP3 is imported as a sound and attached to the cue, and its **Sound Offset** is tuned
until the audio lines up. The USB audio device is selected under **Device > System**.

## Walkthrough

```json
{
  "id": "attach-sound-to-recorded-cue",
  "title": "Attach a soundtrack to a recorded cue and line it up",
  "steps": [
    {
      "id": "audio-device",
      "label": "In the Web UI, go to Device → System and pick the USB interface as Audio Device (and set Audio Sample Rate if needed), then save",
      "docsUrl": "/dmx-core-100/playback/sounds/#audio-requirements",
      "screenshotId": "system-settings"
    },
    {
      "id": "import-sound",
      "label": "Go to Lighting → Sounds, click Import and pick the MP3",
      "docsUrl": "/dmx-core-100/playback/sounds/#uploading-sounds",
      "screenshotId": "sounds-list"
    },
    {
      "id": "attach",
      "label": "Go to Lighting → Cues, click the show cue's name and set Sound to the imported track",
      "docsUrl": "/dmx-core-100/playback/cues/#attached-sound",
      "screenshotId": "cues-list"
    },
    {
      "id": "offset",
      "label": "Adjust Sound Offset by about 0.5 s (plus Sound Volume Adjustment if needed) and click Save",
      "docsUrl": "/dmx-core-100/playback/cues/#attached-sound",
      "screenshotId": "cues-list"
    },
    {
      "id": "test",
      "label": "Play the cue from Lighting → Cues and fine-tune Sound Offset until lights and audio match",
      "docsUrl": "/dmx-core-100/playback/cues/#attached-sound",
      "screenshotId": "cues-list"
    }
  ]
}
```

## Gotchas

- On the hardware unit, audio needs a USB sound card or the optional audio board. The desktop
  software uses the computer's audio output.
- Sound management (Import) is **Web UI only**. The touchscreen has no page for it.
  (The touchscreen cue settings do have Sound and Sound offset fields.)
- Supported formats: WAV, MP3, FLAC, OGG, AIFF.
- If the cue loops, set **Sound Loop (0=forever)** and consider **Restart Sound at Loop** so
  the audio restarts with each pass of the lights.
- **Sound Offset** is per cue. The docs also mention a general audio delay setting for a
  system-wide lag between audio and lights, but do not say where it is (see Gaps).
- A Timeline with a sound track is the alternative when several cues and sounds must be
  sequenced. It is not needed for one cue plus one track.

## Eval checks

- Import path is `Lighting > Sounds` → **Import**
- Attach via the cue page under `Lighting > Cues` → **Sound** field
- Uses **Sound Offset** to align the audio
- Audio device under `Device > System` (**Audio Device**)
- Mentions USB sound card / audio board requirement on hardware
- Does not claim the offset sign/direction as documented fact (the docs don't state it); may say to try and adjust
- Does not require a Timeline for this
- Does not send them to the touchscreen to import audio
- Does not tell them to use MCP or the Integration API

## Gaps

- Docs missing: `playback/cues.md` › Attached Sound and `playback/sounds.md` › Audio Delay do not
  say which direction a positive **Sound Offset** moves the audio relative to the lights.
  Source passes it straight through as `syncItemOffset` (`src/Shared/Services/StorageManager.cs`,
  `MessageServer.cs`). Needs a sign convention stated in the docs.
- Docs discrepancy: `playback/sounds.md` › Audio Delay describes an "audio delay setting" without
  a location. No field named Audio Delay exists in the v2026.914.3 navigation document (the
  closest are per-cue `Sound Offset` and `Output Latency` on the Tempo page, which is about the
  metronome). Either name the real setting or remove the section.
- `playback/sounds.md` › Sound Settings lists **Loop** and **Fade Duration** for sounds. The
  Web UI sound details page has neither (navigation `web/sounds/details`: Volume Adjustment,
  In-point, Out-point …). Loop / Fade In / Fade Out are **Default Settings** on the Sounds list
  (navigation `web/sounds` section Default Settings). Same pattern as cues.

## Verification

- Step audio-device: docs `playback/sounds.md` › Audio Requirements ("Select the audio device and
  sample rate under Device > System"); navigation `web/settings/system` (path
  `Web > System > Device > System`, route `/op/settings/SYSTEM`) fields `Audio Device`,
  `Audio Sample Rate`.
- Step import-sound: docs `playback/sounds.md` › Uploading Sounds; navigation `web/sounds`
  action `Import` (`Sounds.vue`).
- Step attach: docs `playback/cues.md` › Attached Sound; navigation `web/cues/details` field
  `Sound` (visible when sounds exist) (`CueDetails.vue`).
- Step offset: navigation `web/cues/details` fields `Sound Offset`, `Sound Volume Adjustment`,
  action `Save`; `CueDetails.vue` label 'Sound Offset'.
- Step test: navigation `web/cues` action `Play`; docs `playback/cues.md` › Playback Controls.
- Loop gotcha: navigation `web/cues/details` fields `Sound Loop (0=forever)`, `Restart Sound at Loop`
  (capture cues); docs › Attached Sound.
- Touchscreen note: docs `playback/sounds.md` Web-UI-only tip; navigation `uno/cues/{cue}` fields
  `Sound`, `Sound offset, ms`.

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
