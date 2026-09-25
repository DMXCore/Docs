---
title: Symetrix and Q-SYS
description: Driving a Symetrix or Q-SYS DSP directly, with no DMX Core 100
---

The controller ships with three firmware images, and the one on it decides who the knobs talk to:

| Firmware file | Talks to | How |
|---|---|---|
| `poecontrol-osc-w5500-*.uf2` | A DMX Core 100, or any OSC server | OSC over UDP - the rest of these docs |
| `poecontrol-symetrix-w5500-*.uf2` | A Symetrix DSP | The Composer control protocol over TCP, port 48631 |
| `poecontrol-qsys-w5500-*.uf2` | A Q-SYS Core | The External Control Protocol over TCP, port 1702 |

Switching is a [firmware update](../firmware-updates/): copy the file for the DSP onto the POECONTROL drive. Everything about the device stays the same - the drive, `status.txt`, the LED, the ports, updates - and `config.txt` gains the DSP's own keys in place of the OSC ones. A knob is a fader, its push switch is a mute or a preset, and a button recalls a preset or fires a trigger. No DMX Core 100 is involved.

As with the Core, the DSP owns the value: a click sends one nudge, and the DSP clamps, so the knob has nothing to lose or to re-sync. Moves made in Composer, in Q-SYS Designer or from another panel simply show up as the fader's new position.

## Symetrix

Turn on the Composer control protocol on the DSP if it is not already; the controller connects to TCP 48631.

```
# The DSP's address, and its control port. 0 means the usual 48631.
host = 192.168.1.44
port = 0

[knob 1]
pins    = 2,3,4
# The controller number assigned in Composer. controls.txt lists the
# ones the DSP has, with their current values.
control = 4
# Percent of the controller's full range per detent.
step    = 2
# What the push does. See buttons for the choices.
press   = toggle 2
invert  = 0

[button 1]
pin  = 10
send = preset 3
```

| Key | Meaning |
|---|---|
| `host` | The DSP's IP address |
| `port` | 0 for the standard 48631 |
| `control` | The controller number assigned to the fader in Composer, 1 to 10000 |
| `step` | Percent of the controller's range one click moves it. The default of 2% is 50 clicks end to end; 5% is 20 |
| `press`, `send` | An action, from the table below |

| Action | What it does |
|---|---|
| `toggle <controller>` | Reads the controller, then sets it to off if it was on and on if it was off - a mute button |
| `set <controller> <percent>` | Sets the controller to a fixed position |
| `momentary <controller>` | Full while held, 0 when released |
| `pulse <controller>` | Full, then straight back to 0 - a trigger |
| `preset <n>` | Loads preset `n` |
| `none` | Nothing |

**controls.txt.** On every connection the controller asks the DSP for every assigned controller and its value, and writes the list to `controls.txt` on the drive, next to `config.txt`. So the number to type is read off the drive, the way `servers.txt` names Cores for the OSC firmware. Pushes from the DSP - a change made in Composer or from another panel - are seen as they happen. A `control` that is not assigned in the design is logged in `status.txt` when the first click is refused.

## Q-SYS

Talks to a Q-SYS Core over the External Control Protocol, TCP 1702, which is enabled per Core in Q-SYS Designer. Controls are addressed by the names given to them in the design.

```
# The Core's address, and its control port. 0 means the usual 1702.
host = 192.168.1.20
port = 0

[knob 1]
pins    = 2,3,4
# The named control, as set in Q-SYS Designer.
control = Zone 1 Gain
# Percent of the control's position range per detent.
step    = 2
press   = toggle Zone 1 Mute
invert  = 0

[button 1]
pin  = 10
send = snapshot Presets 3
```

| Action | What it does |
|---|---|
| `toggle <control>` | Off if the control is on, on if it is off - a mute. Uses the Core's last reported position, and asks the Core for it first if it is not known yet |
| `set <control> <percent>` | Sets the control's position to that percent |
| `momentary <control>` | Full while held, 0 when released |
| `trigger <control>` | Fires a trigger control |
| `snapshot <bank> <n>` | Loads snapshot `n` from the named bank |
| `none` | Nothing |

The Q-SYS protocol has no relative move, so the controller subscribes to every control its knobs and toggles name in a change group and keeps the Core's last reported position; a click sends that position plus or minus `step` (2% by default). The Core is still the source of truth - a move from anywhere else, in Q-SYS Designer or from a touch panel, replaces the cached position as soon as the Core reports it. After the connection is first made, or comes back, a click that arrives before the Core has reported the control's position is dropped rather than guessed. The controller keeps the link alive with the Core's status command and reconnects on its own.

## Connection and status

The controller connects when it has an address, reconnects two seconds after any loss, and keeps the link alive with the DSP's idle command; a DSP that vanishes without closing the connection is noticed within a few seconds and reconnected to when it returns. `status.txt` shows `connected`, or `connecting` with the reason - refused, no route, no reply - and the LED is amber until the DSP answers and green after.

## Why not through a DMX Core 100

A DMX Core 100 can also drive Symetrix and Q-SYS faders through its [DSP plugins](/dmx-core-100/external-control/), and a knob on the OSC firmware then steps them by way of a Control Value. That is the right shape where a Core is already in the room and lighting and audio share the wall panel. The direct firmware is for the room that has a DSP and no lighting controller, where the only thing wanted is a proper PoE wall knob.
