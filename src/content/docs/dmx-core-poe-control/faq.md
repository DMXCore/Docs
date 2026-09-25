---
title: FAQ
description: Frequently Asked Questions
---

#### Do I need a PoE switch?

Any IEEE 802.3af or 802.3at PoE switch or injector powers the controller over the same Ethernet cable that carries control. Without PoE, a USB-C 5 V supply works too, and both together is fine.

#### Can I use my own knobs and buttons?

Yes. Each control port takes any standard quadrature rotary encoder (EC11, PEC11, KY-040-style modules) with or without a push switch, or up to three momentary push buttons. Nothing on the cable carries power, so the wiring is passive. The [Rotary Encoder Kit](../wiring/#rotary-encoder-kit) is the ready-made option. See [Wiring](../wiring/).

#### How many knobs and buttons can one unit drive?

Four control ports. Each port is one rotary encoder with a push switch, or up to three push buttons, in any mix - so up to four knobs, or up to twelve buttons.

#### Does it work with the DMX Core 100 desktop software?

Yes. It talks OSC over UDP, which every DMX Core 100 has built in, whether it runs on the dedicated hardware or as software on Windows, macOS or Linux. No MQTT broker or other service is needed.

#### How is it configured?

Plug it into a computer over USB-C and it appears as a small drive with a `config.txt` file. Type in the name of your DMX Core 100 and the Control Value each knob should step, save, and eject. No software to install. See [Configuration](../configuration/).

#### What happens after a power cut?

Nothing to restore. The controller keeps no level of its own - the Core owns the value and the knob only sends steps - so when power returns it finds the Core again and carries on. Settings live in flash and survive power cuts and firmware updates.

#### What can a knob control?

Anything a Control Value can drive: the master dimmer, a zone intensity, a fixture's intensity or colour channel, the audio output level, a fader on a Symetrix or Q-SYS DSP through the Core's DSP plugins, or another Control Value. Changing it is a dropdown on the Core. See [DMX Core 100 setup](../dmx-core-100-setup/).

#### What can a button do?

Anything an On/Off input trigger can run on the Core: play a cue, apply a preset, blackout, mute the audio, toggle a Control Value, run a script. A momentary button also suits Flash and Momentary triggers, where the action holds only while the button is down. A button can also send one of the Core's built-in OSC addresses directly, such as playing a cue by code.

#### Can two knobs in two rooms control the same thing?

Yes. Point both at the same Control Value. Because the Core owns the value, turning either knob moves the same level, and the Faders page shows it too.

#### Can it control a Symetrix or Q-SYS DSP without a DMX Core 100?

Yes. Copy the Symetrix or Q-SYS firmware onto the drive instead of the DMX Core one, put the DSP's address in `config.txt`, and each knob nudges a fader by controller number (Symetrix) or control name (Q-SYS) over the DSP's own control protocol. The push and the buttons mute, toggle, recall presets or fire triggers. See [Symetrix and Q-SYS](../symetrix-and-qsys/).

#### Can it control something else?

Yes, anything that takes OSC. On the DMX Core firmware each knob can be given its own `up` and `down` OSC addresses for a server that has step addresses, or switched to level mode, where the knob keeps a value between `min` and `max` and sends it as a number to a `level` address - for mixers, media players and lighting desks that only take an absolute level. Buttons send any OSC address. See [Configuration](../configuration/#knobs).

#### How far can the knob be from the box?

Up to about 10 m of ordinary multi-core cable per port. The encoder kit's cable is 200 mm; standard JST XH 4-pin extension cables lengthen it. See [Cable length](../wiring/#cable-length).

#### Is the control secure?

OSC is unauthenticated: anything that can reach the Core's UDP port can send the same messages. Keep the controller and the Core on a trusted network segment, as with any control system.

#### Can I update the firmware in the field?

Yes, without opening the box: copy the release's `.uf2` onto the POECONTROL drive. The new firmware runs on trial and the controller rolls back on its own if it does not start. See [Firmware updates](../firmware-updates/).
