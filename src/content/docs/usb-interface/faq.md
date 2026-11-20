---
title: FAQ
description: Frequently asked questions about the DMX Core Pico 2 USB Interface
---

### Is the firmware free?

Yes. The USB Interface firmware is free for every DMX Core Pico 2 owner, including Re-Mapper owners. Download it from [GitHub releases](https://github.com/DMXCore/USBInterface-Public/releases) or install it with the [DMX Core USB Interface Utility](/usb-interface/config-utility/), which is free too.

### Which lighting software works with it?

Lightkey on macOS, Lightjams and FreeStyler on Windows, and OLA on Linux have been tested. QLC+ does not list the interface yet; we're working on getting support added to QLC+. See [Lighting Software](/usb-interface/lighting-software/).

### Does it need a driver?

No. It uses the standard USB serial driver built into Windows, macOS and Linux.

### Can I watch the DMX while my lighting software is running?

Yes. The [USB Interface Utility](/usb-interface/config-utility/#monitoring-and-rdm-while-your-lighting-software-runs) shows port status and live DMX levels while your software has the interface open, because it uses its own USB connection rather than the serial port.

### Can I use RDM while my lighting software is running?

Yes. The [DMX Core USB Interface Utility's RDM tool](/usb-interface/config-utility/#rdm) works while your software has the interface open: find fixtures, change their DMX address, label or personality, and read their sensors without stopping the show. DMX output keeps going between RDM requests. Discovery mutes the fixtures for a moment.

### Can I use both DMX ports of a DMX Core Pico 2?

Yes. Software that supports two-port extensions drives both ports over one serial port. For software that uses one port per interface, such as Lightkey, turn on [a serial port per DMX port](/usb-interface/ports-and-wiring/#a-serial-port-per-dmx-port), and the Pico 2 shows up as two interfaces.

### Can it receive DMX?

Yes. On the DMX Core Pico 2, on port A, and on port B when each port has its own serial port.

### Does it support RDM?

Yes, on every port. Port A works with RDM-capable lighting software such as OLA, and both ports work with the RDM tool in the [USB Interface Utility](/usb-interface/config-utility/#rdm).

### Does it support Art-Net or sACN?

No. The interface sends and receives DMX on its two ports. Your lighting software can convert to and from Art-Net or sACN if it supports that.

### How do I power it?

From the computer's USB port. Leave the power input disconnected while the board is connected to a computer; see [Errata](/dmx-core-pico-2/errata/).

### Can I go back to the Re-Mapper or my own firmware?

Yes. Copy the other `.uf2` file onto the board the same way. A Re-Mapper's mapping and license are kept, and the license is tied to the board, so it can always be activated again. See [Installing the Firmware](/usb-interface/installing-firmware/#going-back-to-the-re-mapper-or-your-own-firmware).

### Is the firmware open source?

No. The firmware is available as a `.uf2` download, but the source code is not published. The open-source libraries it uses are listed in `THIRD-PARTY-NOTICES.txt` with each release.

### I have a suggestion for a new feature. Can you add it?

We're open to suggestions. [Open an issue on GitHub](https://github.com/DMXCore/USBInterface-Public/issues) or [contact us](https://dmxprosales.com/pages/contact-us).
