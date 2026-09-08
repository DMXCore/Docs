---
title: Stop, Blackout and Output Off
---

The DMX Core 100 has three global ways to stop output. They differ in two things: **what the room looks like afterward**, and whether it is a one-time action or a state you switch on and off.

| Action | Kind | The room afterward | What it stops | What stays |
|--------|------|-------------------|---------------|------------|
| **Stop** | One-time | Your resting look | Cues, timelines, sound, and any preset or manual fixture control | The [ambient preset](/dmx-core-100/playback/presets#ambient-presets), if you have one |
| **Blackout** | Switched on and off | Black and silent | Nothing: everything keeps running underneath, you just cannot see or hear it | Everything; switching Blackout off shows it again |
| **Output Off** | Switched on and off | Silent (no signal) | Everything, and nothing new can start | Your fixture settings, ready for Output On |

## Stop

Stop ends everything that is *playing* — cues, timelines and sounds — and releases any preset or manual control you have put on the fixtures. The room returns to its resting look: the ambient preset if one is configured, otherwise whatever the [End of Data](/dmx-core-100/playback/layers-and-priority#end-of-data) setting does.

If you want a particular look to survive a Stop, make it an ambient preset. That is what ambient presets are for: the look that is there when nothing is playing.

To stop one cue or sound without touching anything else, use that item's own stop button, or the **Fade Out** action.

## Blackout

Blackout works like the blackout key on a lighting console: it is a mask over the output, and it stays on until you switch it off. While it is on, every DMX channel is sent as 0% and audio is muted, but nothing that is playing is stopped. Cues, timelines, schedules and sounds carry on underneath. Switch it off and whatever is current appears at once; a show that was chasing timecode is still in time.

Nothing else releases it: not a preset, not a schedule, not a cue starting. That is the point. During an evacuation nothing can bring the lights back by accident. Blackout is not saved across a restart.

Channels in a [Cue Fade Mask](/dmx-core-100/playback/cues#fade-mask) — gobo and color wheels, pan and tilt — keep their live value instead of going to 0%, so moving heads stay where the cue wants them rather than swinging to their end stops and back when the blackout lifts. If a channel should stay put under a blackout, add it to the fade mask for that universe.

Blackout is a trigger action with **Set To** On, Off or Toggle, available in [custom menus](/dmx-core-100/scheduling-automation/custom-menus), [schedules](/dmx-core-100/scheduling-automation/schedules), [input triggers](/dmx-core-100/scheduling-automation/input-triggers), [control surfaces](/dmx-core-100/control-surfaces/configuring), [scripts](/dmx-core-100/scheduling-automation/scripting) and the `system.blackout` switch for plugins. A button assigned to it lights while the blackout is on, the Web UI header shows **BLACKOUT**, the [Faders](/dmx-core-100/lighting/faders) page has a BLACKOUT button, and the touchscreen status line reads BLACKOUT. On the touchscreen, the **Stop/Blackout** button switches Blackout on with a tap (tap again to release) and stops on a hold. On a control surface, turn on [Hold to confirm](/dmx-core-100/control-surfaces/configuring#hold-to-confirm) so an accidental tap cannot black out the room.

To stop everything *and* stay dark, press Stop and then Blackout. When a cue ends while Blackout is on, the [End of Data](/dmx-core-100/playback/layers-and-priority#end-of-data) setting applies exactly as it would otherwise; the last thing the receivers saw was black, so a receiver that holds its last look stays dark.

## Output Off

Output Off is the [Toggle Output](/dmx-core-100/configuration/output-config#toggling-all-output) action: the unit stops everything, sends a stream terminate so receivers know it has gone, and then transmits nothing. Nothing that plays can start while output is off. Your fixture settings are kept, so **Output On** brings the room back exactly as it was — like a reboot — without restarting any cue that was playing.

This is the switch a backup unit is parked with. Unlike Blackout it is saved, so a parked unit stays silent after a power cycle. Note that Output Off cannot promise a dark room: after a terminate, what a receiver shows is up to the receiver. Blackout can.
