---
title: Passthrough
description: Passthrough of DMX data with the optional 2-port DMX-512 board
---

If you have the 2-port DMX-512 board on your DMX Core 100 then you can enable the passthrough feature with **Passthru Function**, under **Lighting Setup › Protocol** in the Web UI or **Settings › Output** on the touchscreen (the item only appears when the board is present). The two options are to either use port A as input and port B as output, or the opposite. This will take any DMX input and output it on the other port (rate limited to max 50 Hz), and at the same time you can record the DMX stream onto the DMX Core 100. Once you disconnect the DMX input (and after a 3-second timeout) the DMX output port will send data from the DMX Core 100 instead (presets, fixture control and cues).

This is commonly used to have the DMX Core 100 installed in a facility where it's connected to the DMX light fixtures, and with a DMX input. You would then connect a console or lighting software temporarily to the DMX input, set up your scenes while watching it control the lights in real time and record it onto the DMX Core 100. Once you've recorded your different scenes/cues you disconnect the DMX input and the DMX Core 100 is now in full control of the lights and can play back the recorded cues.

The passthrough is done by the board's firmware, from one DMX port to the other, and it does not merge with the DMX Core 100's own playback. To route input to network or plugin outputs, or to merge it with cues and presets, use [Stream Routing](/dmx-core-100/lighting/stream-routing). Both can be on at once: the passthrough source port is an ordinary input for routing, while its destination port is left out of routing because the firmware already drives it. Stop, Blackout and Output Off do not affect the firmware passthrough; they do apply to stream routing.
