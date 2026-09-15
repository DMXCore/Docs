---
status: candidate
source: synthetic
invented: true
level: intermediate
surface: none
date: 2026-09-15
title: How much storage does a 15-minute, 10-universe recording use
slug: recording-storage-estimate
anonymized: true
docs_slugs:
  - dmx-core-100/playback/recording
  - dmx-core-100/playback/cues
  - dmx-core-100/main/specifications
verified: docs be6f663, core v2026.914.3
---

# How much storage does a 15-minute, 10-universe recording use

## Original ask

> how much storage can I expect 15 minutes of 10 universes (40 Hz) to use?

## Goal

The user learns that the docs give no size-per-minute figure, and learns where the unit
shows real sizes and free space so they can measure their own show.

## Expected answer

- Says plainly that the published docs **do not state** how much storage a recording uses per
  minute, per universe or per frame rate.
- Points to the closest pages. **Recording** (Web UI: while recording, the Record page shows
  the recorded size and the remaining recording space). **Specifications**: 32 GB eMMC, of
  which about 30 GB is available for cues and presets. **Cues** › Technical Details: cues are
  stored as PCAP files.
- Practical method: do a short test recording of the real source on `Utilities > Record`,
  read the size (live "recorded" figure, or **Size** on the saved cue under `Lighting > Cues`),
  and scale it to 15 minutes.
- May add a rough estimate only if it is clearly labelled as its own calculation, not a
  docs figure. A reasonable one: about 200–250 MB for 15 min × 10 full universes × 40 Hz
  (roughly 210 MB for Art-Net, 250 MB for sACN). That is small next to about 30 GB.
- Must not present any MB-per-minute number as documented, and must not claim that saved cues
  are compressed.
- Must not claim that the frame rate is a recording setting on the device. The recording keeps
  the timing of the packets the source sends (Recording › Timing Accuracy).
- For the desktop software, the limit is the computer's own free disk space. The 30 GB figure
  applies to the hardware unit.

## Gotchas

- Size depends on the packets received (protocol, number of universes, send rate), so a test
  recording of the actual source is the reliable answer.
- A recording stops on its own when free space runs low, and does not start when free space
  is already low. The docs do not mention this (see Gaps).

## Eval checks

- States that the docs do not give a storage-per-minute figure
- Mentions the Record page showing recorded size / free recording space, or the cue **Size**
  in `Lighting > Cues`
- Mentions about 30 GB available on the hardware (Specifications)
- Suggests a short test recording and scaling it up
- Any number given is labelled as an estimate and is in the hundreds of MB, not several GB
- Does not invent a docs page or table of recording sizes
- Does not tell them to use MCP or the Integration API

## Gaps

- Docs missing: no page gives recording storage use per minute, universe or frame rate.
  Closest are `playback/recording.md` › Recording in the Web UI (live size / remaining space),
  `playback/cues.md` › Technical Details (PCAP) and `main/specifications.md` (30 GB).
- `playback/recording.md` mentions recorded size and remaining space only under the Web UI. The
  touchscreen Record Cue screen shows them too, as "… recorded, … free"
  (`src/UnoHost/ViewModels/RecordViewModel.cs` `StorageText`).
- Undocumented limits: a recording needs 500 MB free to start and ends gracefully below 200 MB
  free. "Free for recording" already subtracts that 200 MB floor and the pending size of the
  capture (MagnusEngine `MagnusEngine/RecordManager.cs` `MinimumFreeSpaceToStart`,
  `MinimumFreeSpaceWhileRecording`, `RecorderFreeSpaceBytes`).
- Undocumented: captures are zstd-compressed on disk while recording, then saved as plain PCAP.
  The live "recorded" figure is the uncompressed size (`src/Shared/Services/StorageManager.cs`
  `SaveCueContent`; MagnusEngine `FileIO/CaptureCompression.cs` "saved cues stay plain";
  `RecordManager.RecordedBytes` = uncompressed bytes).

## Verification

- "Docs don't state it": searched `src/content/docs/dmx-core-100/**` at be6f663 for storage,
  size and space. The only hits are `main/specifications.md` (32 GB eMMC, ~30 GB available) and
  `playback/recording.md` › Recording in the Web UI (recorded size and remaining recording
  space).
- PCAP storage: docs `playback/cues.md` › Technical Details.
- Live size in the Web UI: `src/AdminSite/ClientApp/src/views/operation/Record.vue` (v2026.914.3)
  "… recorded," and "… free for recording" (`recordedBytes`, `recorderFreeSpaceBytes`).
  Cue size field: navigation `web/cues/details` field `Size`; list column set on `web/cues`.
- Estimate arithmetic (not from docs): MagnusEngine `FileIO/PCapFileWriter.cs` (checkout
  bd24a25, 2026-09-11) writes classic pcap with a 16-byte record header plus a 42-byte
  Ethernet/IPv4/UDP header per packet. ArtDmx payload with 512 slots is 530 bytes, E1.31 is
  638 bytes. 10 universes × 40 Hz × 900 s = 360,000 packets. × 588 B ≈ 212 MB (Art-Net);
  × 696 B ≈ 251 MB (sACN).

## Source notes

Invented scenario, 2026-09-15; not from a real interaction. The question itself came from
the owner's own test chat.
