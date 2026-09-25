---
title: Configuration
description: Every key in config.txt, and the other files on the POECONTROL drive
---

Plug the controller into a computer over USB-C and a drive called **POECONTROL** appears. `config.txt` on it is the whole configuration: edit it, save, eject. Changes apply straight away, with no restart and no software to install.

A change is taken whole or not at all. If anything in the file is wrong - an unknown key, a pin that belongs to the Ethernet chip, two controls on one pin, a server name that matches nothing - the previous settings stay in force, nothing is saved, the status LED keeps flashing fast, and `status.txt` says what was refused and why. Fix it and save again.

The file is `key = value` lines. Blank lines and lines starting with `#` are ignored, and the file the device writes is full of `#` comments explaining each key, so it can be edited without this page open.

## Device

```
name = 
ip      = 
netmask = 
gateway = 
led_brightness = 4
```

| Key | Meaning |
|---|---|
| `name` | The controller's name on the network: its DHCP hostname and its mDNS name, `<name>.local`. Blank uses a name unique to the board, which `config.txt` shows. Takes effect at the next restart |
| `ip`, `netmask`, `gateway` | Blank means DHCP, the usual choice. To fix the address, fill in `ip` and `netmask`, and `gateway` if the Core is on another subnet. The numbers DHCP handed out, shown in `status.txt`, are the easiest to copy. A mask that is not contiguous, an address that is the subnet's network or broadcast address, or a gateway outside the subnet is refused rather than tried, since a wrong address takes the device off the network |
| `led_brightness` | Status LED, 0 to 100 percent; 0 turns it off. The default of 4 reads fine through the lid; full is far too bright to look at |

The keys below are the DMX Core / OSC firmware's. The Symetrix and Q-SYS firmware share the device, knob-pin and button-pin keys and replace the server and action keys with their own, listed on [Symetrix and Q-SYS](../symetrix-and-qsys/).

## Server

```
server = 
port = 0
momentary_repeat = 2
```

| Key | Meaning |
|---|---|
| `server` | Which DMX Core 100 (or other OSC server) to talk to: its device name exactly as it appears in `servers.txt`, or an IP address. Part of a name works as long as it matches only one server. Blank with exactly one server on the network uses that one; with several, the controller refuses to guess and `status.txt` says so |
| `port` | 0 means whatever the Core advertises over mDNS, or 8000 when the server is given by address. Only a Core on a changed OSC port and reached by address needs this |
| `momentary_repeat` | How many times a momentary button sends each press and release, a few milliseconds apart, 1 to 5. The network may drop a message, and a lost release would leave a Flash stuck on |

## Knobs

One section per knob, `[knob 1]` to `[knob 4]`:

```
[knob 1]
pins    = 2,3,4
invert  = 0
mode    = steps
control = VOL
up      =
down    =
level   =
min     = 0
max     = 1
step    = 0.05
start   = 0
press   = /poecontrol/press
```

| Key | Meaning |
|---|---|
| `pins` | The GPIOs of the port the knob is on: A, B and the push switch, in that order. Leave the third out if the knob has no switch. The port table below has the numbers. A and B must be neighbouring pins, which every port's are |
| `invert` | `1` swaps the direction, for a knob that turns the wrong way |
| `mode` | `steps` (the default): each click sends an address and the server keeps the value. `level`: each click sends a number and the knob keeps the value, for servers with no step addresses |
| `control` | Steps mode, on a DMX Core 100: the Control Value code the knob steps. It expands to the Core's built-in `/dmxcore/control/<code>/up` and `/down` addresses |
| `up`, `down` | Steps mode, instead of `control`: the full OSC addresses one click each way sends, with no argument. For another OSC server, or another address on the Core. When both are given, `up` and `down` win |
| `level` | Level mode: the OSC address that takes the value, sent as a float |
| `min`, `max`, `step`, `start` | Level mode: the value runs from `min` to `max`, one `step` per click, counted in whole steps from `min` so twenty steps of 0.05 reach 1 exactly. It is `start` at power-on, and nothing is sent until the first click |
| `press` | The OSC address the push switch sends, in either mode: `1` when pressed, `0` when released, so it suits On/Off, Flash and Momentary input triggers. Blank turns the switch off |

**Steps or level.** A DMX Core 100 has step addresses, so the Core owns the value and the knob never has to know it - that is steps mode, and the reason a knob cannot drift or spring back. Most other OSC servers - a mixer, a media player, a lighting desk - take only `/some/level <float>`, which is what level mode is for. Its known cost is that the knob cannot tell when something else moves the level; the next click continues from the knob's own value.

| Port | `pins` |
|---|---|
| 1 | `2,3,4` |
| 2 | `5,6,7` |
| 3 | `8,9,10` |
| 4 | `11,12,13` |

## Buttons

One section per button. A port used for buttons has its three input lines - A, B and S - as three button pins, so port 3 takes buttons on GPIO 8, 9 and 10:

```
[button 1]
pin  = 8
send = /dmxcore/cue/ACT1
mode = press

[button 2]
pin  = 9
send = /poecontrol/flash
mode = momentary
```

| Key | Meaning |
|---|---|
| `pin` | The GPIO the button pulls to ground: one of the port's A, B or S lines, from the table above |
| `send` | Any OSC address: one of the Core's built-in ones, such as `/dmxcore/cue/ACT1` to play a cue, or an address of your own bound to an input trigger |
| `mode` | `press` sends one message when the button is pressed. `momentary` sends `1` on press and `0` on release, for Flash and Momentary triggers |

A port is either a knob or buttons; a pin can be used once.

## The other files

The device writes these; they are read-only and update on their own about two seconds after something changes.

**`status.txt`** - the state the LED shows, in words: starting, searching, running, or refused, with the reason. Its own address, netmask and gateway. The server it settled on and the address it resolved to. The firmware version and the board. The reason for the last restart - a power cycle, a config change, a watchdog, or a crash with its location - and the progress or the result of the last firmware update.

**`servers.txt`** - every OSC server discovery has found: DMX Core 100 units by device name with their addresses and ports, and anything else on the network advertising `_osc._udp`. Copy a name from here into `server`. The list refreshes every 30 seconds, and the controller follows a Core that moves to a new address.

**`readme.txt`** - the short version of this page.

The drive lives in RAM. Files copied onto it are not kept - except a firmware `.uf2`, which installs itself; see [Firmware updates](../firmware-updates/).

## Fixed address

Set `ip` and `netmask`, and `gateway` if the Core is on another subnet - mDNS only finds servers on the same subnet, so a Core across a router is given by address in `server`. Clearing the three keys goes back to DHCP. Because a wrong address means a trip to the box with a laptop, obviously bad values are refused rather than tried.
