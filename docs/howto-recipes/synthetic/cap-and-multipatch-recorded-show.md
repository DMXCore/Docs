---
status: candidate
source: synthetic
invented: true
level: advanced
surface: web
date: 2026-09-15
title: Cap a too-bright wash and multipatch new fixtures in a recorded show
slug: cap-and-multipatch-recorded-show
anonymized: true
docs_slugs:
  - dmx-core-100/playback/channel-rules
  - dmx-core-100/playback/cues
verified: docs be6f663, core v2026.914.3
---

# Cap a too-bright wash and multipatch new fixtures in a recorded show

## Original ask

> Show was recorded off a console weeks ago and plays back fine. Two issues on site now:
> the front wash on universe 1 ch 20-40 is way too hot, I need it at roughly half max; and
> the client added a pair of LED bars on universe 2 at 101-104 that should just mirror the
> bars already at 2/1-4. I really don't want to re-record the whole thing. Any way to patch
> this on playback?

## Goal

Two Channel Rules change the recorded show on playback without touching the cue file. A
Copy rule mirrors slot 2 ch 1–4 to ch 101–104. A Scale (or Cap) rule with Limit 128 holds
slot 1 ch 20–40 at about half.

## Walkthrough

```json
{
  "id": "cap-and-multipatch-recorded-show",
  "title": "Cap a too-bright wash and multipatch new fixtures in a recorded show",
  "steps": [
    {
      "id": "find-slot-ids",
      "label": "In the Web UI, go to Lighting → Cues, open the show cue and note its Used Slot/Universe Ids (the Slot Id the rules must use)",
      "docsUrl": "/dmx-core-100/playback/channel-rules/#rule-types",
      "screenshotId": "cues-list"
    },
    {
      "id": "copy-rule",
      "label": "Go to Lighting Setup → Channel Rules → Add New: Rule Type Copy, Slot Id 2, Start Channel 1, End Channel 4, Destination Slot Id 2, Destination Start Channel 101, Enabled on, then Save",
      "docsUrl": "/dmx-core-100/playback/channel-rules/#copy",
      "screenshotId": "channel-rules"
    },
    {
      "id": "scale-rule",
      "label": "Add New again: Rule Type Scale (or Cap for a hard ceiling), Slot Id 1, Start Channel 20, End Channel 40, Limit (0-255) 128, Enabled on, then Save",
      "docsUrl": "/dmx-core-100/playback/channel-rules/#scale",
      "screenshotId": "channel-rules"
    },
    {
      "id": "tune-live",
      "label": "Play the cue from Lighting → Cues and adjust the Limit while it plays; rules take effect as soon as they are saved",
      "docsUrl": "/dmx-core-100/playback/channel-rules/#when-rules-apply",
      "screenshotId": "cues-list"
    }
  ]
}
```

## Gotchas

- **Slot Id** is the internal universe id as recorded in the cue. It is not necessarily the
  console's universe number (Art-Net 0-based numbering, input mapping offsets). Check the
  cue's slot ids first.
- **Scale** keeps the relative fades (255 → 128, 127 → 64). **Cap** passes low values
  unchanged and clips anything above 128. Either fits "roughly half max".
- Order within a frame: copies first, then scales, then caps. A cap on the copy destination
  also limits the copied bars.
- Rules affect **cue playback only** (dynamic and static cues, including cues on timelines).
  They do not affect presets, fixture control or effects.
- For a Copy to a slot that has no output mapping, that slot must be mapped under Outputs.
  Here the destination is slot 2, which is already output.
- Rules are global: every cue that touches those channels is affected. Disable or delete a
  rule to get the original back. A duplicated rule is created disabled.
- Needs the **Edit Channel Rules** permission. Web UI only.

## Eval checks

- Menu path is `Lighting Setup > Channel Rules`
- Uses a **Copy** rule with Destination Start Channel 101 (range 1–4 to 101–104) on slot 2
- Uses **Scale** or **Cap** with Limit 128 on slot 1, channels 20–40
- Says the cue file is not changed and re-recording is not needed
- Mentions checking the cue's slot id (Slot Id is not simply the console universe)
- Does not suggest lowering the whole cue **Dimmer** as the fix (that dims everything)
- Does not suggest Cue Fade Masks, editing presets, or Fixture Control for this
- Does not claim it can be done on the touchscreen
- Does not tell them to use MCP, the Integration API, or a transform script

## Gaps

- Screenshot missing: no Channel Rules list/details screenshot in the catalog.
- Docs missing: `playback/channel-rules.md` › Rule types says each rule targets a Slot Id "as
  recorded in the cue", but does not say where to find it. The cue detail page shows it as
  **Used Slot/Universe Ids** (navigation `web/cues/details`, readOnly field
  `usedCosmosIdsText`).

## Verification

- Step find-slot-ids: docs `playback/cues.md` › Viewing and Playing Cues (`Lighting > Cues`,
  cue name opens details); navigation `web/cues/details` field `Used Slot/Universe Ids`
  (`src/AdminSite/ClientApp/src/views/operation/CueDetails.vue`).
- Step copy-rule: docs `playback/channel-rules.md` › Copy (Destination Slot Id / Destination
  Start Channel) and the Web-UI-only tip (`Lighting Setup > Channel Rules`); navigation
  `web/channelrules` action `Add New`, `web/channelrules/details` fields Name, Rule Type
  (option "Copy — duplicate channels to another location"), Slot Id, Start Channel, End
  Channel, Destination Slot Id, Destination Start Channel, Enabled
  (`ChannelRuleDetails.vue`, permission EDITCHANNELRULES).
- Step scale-rule: docs › Scale and › Cap; navigation field `Limit (0-255)` (visible for Cap or
  Scale), options "Scale — rescale the full range to a maximum value" / "Cap — limit channels to
  a maximum value".
- Step tune-live: docs › When rules apply ("take effect immediately when saved — even during
  playback"); navigation `web/cues` action `Play`.
- Processing order gotcha: docs › Processing order; field help text in navigation
  `web/channelrules/details` Rule Type.

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
