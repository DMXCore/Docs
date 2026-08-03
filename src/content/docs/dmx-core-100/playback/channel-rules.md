---
title: Channel Rules
description: Cap, scale, or copy DMX channels during cue playback
---

Channel rules adjust recorded DMX data on the fly during cue playback — without modifying the cue files. Use them when a show is already recorded but something on site has changed: fixtures that were recorded too bright can be capped or scaled down, and fixtures added after the recording can mirror existing channels (multipatch).

:::tip[Web UI only]
Channel rules are managed in the Web UI under **Lighting Setup > Channel Rules**. Editing requires the **Edit Channel Rules** permission.
:::

## When rules apply

Rules apply to **cue playback only** — both dynamic (recorded) and static (snapshot) cues, including cues played from timelines. They never affect fixture control, presets, or effects; to change those, edit the fixtures or presets directly.

Rules are global: once defined, they apply to every cue that touches the matching channels. They take effect immediately when saved — even during playback — so you can fine-tune a limit while watching the result on the fixtures. Recording is unaffected, and cue files are never changed; disable or delete a rule to instantly restore the original output.

## Rule types

Each rule targets a **Slot Id** (the internal universe id as recorded in the cue) and a channel range (1–512).

### Cap

Limits channels to a maximum value. Values at or below the limit pass through unchanged; values above it are held at the limit.

*Example: a cap of 128 leaves a recorded 100 untouched but outputs 128 when the recording says 255.*

### Scale

Rescales the whole 0–255 range so that full level becomes the limit — the recorded look keeps its relative intensity shape, just dimmer.

*Example: with a scale limit of 128, a recorded 255 outputs 128 and a recorded 127 outputs 64.*

### Copy

Duplicates a channel range to another location — the same or a different slot. The copied channels follow the recorded data through fades and the cue dimmer, so a fixture added after the show was recorded behaves exactly like the original it mirrors.

Set the **Destination Slot Id** and **Destination Start Channel**; the range keeps its length, so it must fit within channels 1–512 at the destination.

:::note[Copying to a new slot]
The destination slot needs an output mapping (see [Output Config](/dmx-core-100/configuration/output-config)) for the copied data to reach the wire. A copy into a slot the cue doesn't otherwise use only takes over the copied channels — other content playing on that slot keeps the rest.
:::

## Processing order

Within each frame, rules apply in a fixed order: **copies first, then scales, then caps.**

- A cap or scale addressing the copy **destination** also limits the copied data — so a newly added fixture can be both copied *and* capped.
- Copies read values before scales and caps are applied to the source.
- Caps run last, after the cue dimmer and any fades, making a cap an absolute output ceiling for its channels.

Overlapping limit rules combine predictably regardless of order: multiple caps on the same channel enforce the lowest limit, and multiple scales multiply together.

## Managing rules

The **Channel Rules** list shows each rule's type, enabled state, and a summary such as "Cap slot 1 ch 3 at 100". From the details page you can:

- **Enable/disable** a rule — takes effect immediately, also during playback.
- **Duplicate** a rule — the copy is created disabled so it can't double-apply before you've edited it.
- **Delete** a rule.
