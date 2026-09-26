---
title: Bitfocus Companion
description: The controller as a surface in Bitfocus Companion - knobs and buttons that do whatever Companion says
---

With the Companion firmware the controller is a **surface** in [Bitfocus Companion](https://bitfocus.io/companion), the way a Stream Deck is: its knobs and buttons appear as keys on Companion's Buttons page, and what each one does - which of Companion's hundreds of connections it drives, which page it is on - is set up in Companion, not on the device. Nothing is configured on the controller but Companion's address.

| Firmware file | Talks to | How |
|---|---|---|
| `poecontrol-companion-w5500-*.uf2` | Bitfocus Companion 3.0 or later | The Satellite protocol over TCP, port 16622 |

Switching to it is a [firmware update](../firmware-updates/), like the [Symetrix and Q-SYS](../symetrix-and-qsys/) firmware. Everything about the device stays the same - the web page, the drive, `status.txt`, the LED, the ports, updates.

## Setting up

1. Find the address of the computer running Companion, and the **Satellite listen port** on its Settings page, 16622 unless changed, and check that Satellite is enabled there.
2. Put them in the controller's `config.txt`, on the web page or the drive:

```
# The address of the computer running Companion, and its satellite
# port - the one on Companion's Settings page under Satellite.
# 0 means the usual 16622.
host = 192.168.1.10
port = 0

[knob 1]
pins    = 2,3,4
invert  = 0

[button 1]
pin  = 10
```

3. The controller connects, and the surface **poecontrol-\<id\>** (or the device's name, if it has one) appears on Companion's **Surfaces** page. `status.txt` says `connected`, and the LED goes from amber to green.
4. On Companion's **Buttons** page, set up the keys the controls land on, below.

Companion's own mDNS advertisement is not used: the address is typed, so a Companion on another subnet, in Docker or on a server works the same.

## Which key is which

The surface is a grid of 12 keys in two rows of 6. The knobs are the first row and the buttons the second:

| Control | Key | Row / column on the surface |
|---|---|---|
| Knob 1 to 4 | 0 to 3 | row 1, columns 1 to 4 |
| Button 1 to 6 | 6 to 11 | row 2, columns 1 to 6 |

A knob's **turn** is its key's rotary action - **Rotate left** and **Rotate right** on the button's edit page - and its **push** is the key's press. So one button in Companion holds all three, the way a Stream Deck+ encoder does. A standalone button is a press and a release.

The surface starts on page 1 with no offset, so knob 1 is the top-left cell of page 1, which on a new Companion is the **page up** cell. Give the surface a horizontal offset of 1 on its Surfaces settings, or leave column 1 to the page cells and use the others, or clear the page cells. Which page the surface shows, and where on it, is Companion's to change, from a button's actions or a surface's settings, as for any other surface.

`keys.txt` on the drive, and the listing on the web page, show the map with each key's page, row and column in Companion, and the colour Companion last gave it.

## What comes back

Companion sends the surface each key's colour and state as it changes, which the controller keeps and lists in `keys.txt`. The controller has no display, so text and images are not asked for. A panel LED per key, showing Companion's colour, is planned for the panel LED port.

## Connection and status

The controller connects when it has an address, pings Companion once a second, and reconnects on its own after any loss - Companion drops a satellite that goes quiet for five seconds, and the controller does the same in return, so a Companion that restarts is picked up again within seconds. If Companion refuses the surface because its last connection is still being cleaned up, the controller asks again after six seconds. `status.txt` shows `connected`, or `connecting` with the reason - refused, no route, no reply - and the page's log shows every key press and turn sent, and every colour received.

## Why Companion

Companion talks to hundreds of things - video switchers, media servers, lighting consoles, DSPs, streaming software - and its triggers, variables and pages make a knob do more than nudge one fader. With this firmware a PoE wall knob is a Companion surface with no computer at the wall: Companion runs wherever it already runs, and the controller only needs the network cable.
