---
title: Stream Routing
description: Route incoming sACN, Art-Net or DMX input to any output, including plugin outputs, merged with the DMX Core 100's own playback
---

Stream routing turns the DMX Core 100 into a live router: DMX it receives on the network or a DMX input port goes straight back out on every output mapped to the same slot id, including plugin outputs such as Govee, LIFX, WiZ and Shelly bulbs. A console or lighting software sends sACN or Art-Net, and the DMX Core 100 converts and fans it out, while its own cues, presets and fixture control keep working alongside.

Typical uses:

- Drive smart bulbs and other plugin outputs from a lighting console that only speaks sACN or Art-Net.
- Convert between protocols: sACN in, Art-Net, KiNet, TPM2.net or DMX-512 out.
- Keep a console live on a rig that the DMX Core 100 also runs cues and schedules on. Both merge by priority.

Stream routing is different from the [Passthrough](/dmx-core-100/lighting/passthrough) of the 2-port DMX-512 board: that one is done in the port's firmware, port to port only, and does not merge. Both can be on at the same time.

## Setting it up

Everything is on **Lighting Setup › Inputs** in the Web UI.

1. **Input protocol.** The protocol the DMX Core 100 listens on: sACN / E1.31, Art-Net or DMX Serial. One protocol at a time. This is the same setting the recorder uses; changing it here changes it for recording too.
2. **Input mapping.** Which received universes to accept and which slot id each lands on. An output mapped to that slot id receives the routed data, and the recorder captures it under that slot id. Universes that are not mapped are ignored.
3. **Route input to outputs.** The switch. Configuring input alone never drives the outputs; only this switch does, so a device that has input mappings for recording does not start driving its lights from a console after an upgrade.

The **Live Sources** table on the same page shows every sender seen on the mapped universes: its name and address, the universe and slot id, the priority it sends at, frames per second, whether it is live or has gone stale, and the outputs it reaches. An output shown struck through is not routed because of a [conflict](#loops-and-conflicts).

Routing is saved, and resumes on its own after a restart.

On the touchscreen, **Main Menu › Settings › Inputs** has the input protocol, the routing switch with a live status line, and the mapping.

### Settings

The finer settings are under **Lighting Setup › Protocol**:

| Setting | Meaning |
|---|---|
| **Input Priority** | Merge priority (1–200) for routed input from protocols that carry no priority of their own, Art-Net and DMX Serial. sACN input uses the priority each sender transmits. |
| **Override Input Priority** | Use Input Priority for all routed input, ignoring what sACN senders transmit. |
| **Input Loss Timeout (ms)** | How long a routed universe may go without a packet before its source counts as lost. The default 2500 ms is the E1.31 value. |
| **On Input Loss** | What happens then. **Release**: stop sending the universe, so a cue or preset underneath takes back over and otherwise the [End of Data](/dmx-core-100/playback/layers-and-priority#end-of-data) applies. **Hold last**: keep sending the last received frame. **Blackout and release**: send zeros once, then release. |

## Merging with playback

Routed input is one more source in the same [priority merge](/dmx-core-100/playback/layers-and-priority) that cues, presets and fixture control use. A console sending sACN at priority 200 takes over a universe that a cue plays at 100; at 50 the cue wins; at equal priority the two combine using the Merge Mode setting. Two consoles on the same universe merge highest-takes-precedence, as sACN receivers are expected to do.

The master dimmer applies to routed input like it does to fixtures, so pulling the house master to zero darkens the bulbs a console drives as well.

### Stop, Blackout and Output Off

Routed input is an external source, not something the DMX Core 100 is playing, so the [stop states](/dmx-core-100/basics/blackout-and-stop) treat it as such:

| State | Routed input |
|---|---|
| **Stop** | Keeps streaming. Stop ends the DMX Core 100's own playback; the console's universes carry on. |
| **Blackout** | Masked to zero like everything else, and comes back when Blackout is switched off. A live console cannot fill the output while Blackout is on. |
| **Output Off** | Parked: nothing is sent, but the device keeps listening so the Inputs page still shows the sources. **Output On** resumes routing at once. |

While a recording is being made, routing keeps running, which is exactly what you want when recording a show that the DMX Core 100 is itself routing. It is parked only while the recorder plays back a take for review, so that the live feed does not merge into what you are checking.

## Loops and conflicts

A routed universe must not be sent back onto the same protocol and universe the DMX Core 100 receives it on, or the signal loops. The DMX Core 100 checks every output for this and skips the ones that would loop:

- sACN multicast, or Art-Net broadcast, on a universe that is an input universe.
- Unicast to one of the DMX Core 100's own addresses on an input universe.
- The DMX-512 port that is the input, or the destination port of the firmware [Passthrough](/dmx-core-100/lighting/passthrough).

Such an output shows **Routing Conflict** in the Outputs list. It still works for normal playback; it is only left out of routing. Unicasting the same universe to a specific node's IP address, or sending on a different universe, is fine. A universe received on Art-Net universe 0 and sent as Art-Net broadcast on universe 1, for example, routes normally.

Zone-scoped outputs are not fed by routing; routed data goes to the outputs mapped for all zones.
