---
title: Stop, Blackout and Output Off
---

The DMX Core 100 has three global ways to stop output. They differ in one thing: **what the room looks like afterward.**

| Action | The room afterward | What it stops | What stays |
|--------|-------------------|---------------|------------|
| **Stop** | Your resting look | Cues, timelines, sound, and any preset or manual fixture control | The [ambient preset](/dmx-core-100/playback/presets#ambient-presets), if you have one |
| **Blackout** | Black | The same as Stop | Nothing is shown until the next fixture action |
| **Output Off** | Silent | Everything, and nothing new can start | Your fixture settings, ready for Output On |

## Stop

Stop ends everything that is *playing* — cues, timelines and sounds — and releases any preset or manual control you have put on the fixtures. The room returns to its resting look: the ambient preset if one is configured, otherwise whatever the [End of Data](/dmx-core-100/playback/layers-and-priority#end-of-data) setting does.

If you want a particular look to survive a Stop, make it an ambient preset. That is what ambient presets are for: the look that is there when nothing is playing.

To stop one cue or sound without touching anything else, use that item's own stop button, or the **Fade Out** action.

## Blackout

Blackout does everything Stop does and then sends 0% on every channel. The room stays black until the next fixture action — applying a preset, playing a cue, or **Start output** on the touchscreen — at which point the ambient preset returns.

Whether the stream stays alive while black follows the End of Data setting: with **Repeat last** or **Blackout**, the outputs keep streaming zeros so receivers hold; with **Stop output** or **Blackout and stop**, the stream ends and receivers may time out.

On the touchscreen, the **Stop/Blackout** button blackouts on a tap and stops on a hold.

## Output Off

Output Off is the [Toggle Output](/dmx-core-100/configuration/output-config#toggling-all-output) action: the unit stops everything, sends a stream terminate so receivers know it has gone, and then transmits nothing. Nothing that plays can start while output is off. Your fixture settings are kept, so **Output On** brings the room back exactly as it was — like a reboot — without restarting any cue that was playing.

This is the switch a backup unit is parked with.
