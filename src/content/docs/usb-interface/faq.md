---
title: FAQ
description: Frequently asked questions about the DMX Core Pico 2 USB Interface
---

### Which lighting software works with it?

Lightkey on macOS and OLA on Linux have been tested. QLC+ does not list the interface yet. See [Lighting Software](/usb-interface/lighting-software/).

### Does it need a driver?

No. It uses the standard USB serial driver built into Windows, macOS and Linux.

### Can I use both DMX ports?

Yes. Software that supports DMXking's two-port interfaces drives both ports over one serial port. For software that uses one port per interface, turn on **a serial port per DMX port** in the [settings](/usb-interface/settings/#usb-serial-ports), and the interface shows up as two interfaces.

### Can it receive DMX?

Yes, on port A, and on port B when each port has its own serial port.

### Does it support RDM?

Yes, on both ports. Port A works with RDM-capable lighting software such as OLA, and both ports work with the RDM tool in the [DMX Core USB Utility](/usb-interface/config-utility/#rdm).

### Does it support Art-Net or sACN?

No. The interface sends and receives DMX on its two ports. Your lighting software can convert to and from Art-Net or sACN if it supports that.

### How do I power it?

From the computer's USB port. Leave the power input disconnected while the board is connected to a computer; see [Errata](/dmx-core-pico-2/errata/).

### Can I go back to the Re-Mapper or my own firmware?

Yes. Copy the other `.uf2` file onto the board the same way. A Re-Mapper's mapping and license are kept. See [Installing the Firmware](/usb-interface/installing-firmware/#going-back-to-the-re-mapper-or-your-own-firmware).

### Is the firmware open source?

No. The firmware is available as a `.uf2` download, but the source code is not published. The open-source libraries it uses are listed in `THIRD-PARTY-NOTICES.txt` with each release.

### I have a suggestion for a new feature. Can you add it?

We're open to suggestions. [Open an issue on GitHub](https://github.com/DMXCore/USBInterface-Public/issues) or [contact us](https://dmxprosales.com/pages/contact-us).
