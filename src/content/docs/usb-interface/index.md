---
title: USB Interface
description: Firmware that turns DMX Core hardware, such as the DMX Core Pico 2, into a USB DMX interface with RDM
---

The USB Interface is firmware for DMX Core hardware. On a [DMX Core Pico 2](/dmx-core-pico-2/) it is called the **DMX Core Pico 2 USB Interface**: the Pico 2 becomes a USB-to-DMX interface: plug it into a computer and lighting software sees it as a USB DMX interface on a serial (COM) port, with two isolated DMX512 ports.

It speaks the Enttec DMX USB Pro protocol, with the DMXking extensions for a second port, so software that supports an Enttec DMX USB Pro or a DMXking ultraDMX Pro can drive it. It also does RDM, so you can find fixtures and set their DMX address from your computer.

## Supported hardware

| Hardware | DMX ports | Notes |
| --- | --- | --- |
| [DMX Core Pico 2](/dmx-core-pico-2/) | 2 (A and B) | Output on both ports, input on port A (and on port B with a serial port per DMX port), RDM on both. See [DMX Core Pico 2 Ports](/usb-interface/ports-and-wiring/). |

On the Pico 2, the USB Interface firmware runs on the same hardware as the [Re-Mapper](/dmx-core-pico-2-re-mapper/) and your own code. You can switch between them at any time by copying a different `.uf2` file onto the board.

## What you need

* A [DMX Core Pico 2](https://dmxcore.com/pico)
* The USB Interface firmware, from [GitHub releases](https://github.com/DMXCore/USBInterface-Public/releases) or through the config utility. See [Installing the Firmware](/usb-interface/installing-firmware/).
* A computer running Windows, macOS or Linux, and a USB cable
* Optional: the [DMX Core USB Utility](/usb-interface/config-utility/) to check the ports, change settings, update the firmware and use RDM

## Features

### DMX

* **Two DMX512 ports.** Port A sends or receives DMX. Port B sends DMX, and can also receive when each port has its own serial port (below).
* **Steady output.** The interface repeats the latest frame on its own at the output rate (up to 40 frames per second, or as fast as the frame allows), whatever the computer is doing.
* **DMX input** on port A, sent to the computer every frame or only on change. At most 40 received frames per second go to the computer by default, always the newest, so software keeps up with fast consoles.
* **A serial port per DMX port** (a setting). The interface shows up as two one-port interfaces, so software that drives one port per interface, such as Lightkey, can use both ports. Port B can then also receive DMX.

### RDM

* Discovery, GET and SET on both ports.
* Port A works with RDM-capable lighting software such as OLA, through the Enttec protocol.
* Both ports work with the RDM tool in the [DMX Core USB Utility](/usb-interface/config-utility/#rdm).
* DMX keeps going between RDM requests.

### Settings kept on the interface

Port directions, output rate, DMX timing (break and mark after break), full 512-channel frames, RDM on or off, and what the outputs do when the computer stops sending. See [Settings](/usb-interface/settings/).

### USB

* USB ID `2E8A:1180`, assigned by Raspberry Pi to this interface, so software can recognize it by its USB ID.
* Standard USB serial (CDC) driver on Windows, macOS and Linux. Nothing to install.
* Firmware updates without opening the case: the config utility puts the interface into its boot loader and installs the new firmware.

## Software compatibility

What has been tested so far:

| Software | Platform | Status |
| --- | --- | --- |
| Lightkey | macOS | Works. Finds the interface and sends DMX on port A. With a serial port per DMX port, it finds two interfaces and drives both ports. |
| OLA (Open Lighting Architecture) | Linux | Works, including RDM on port A, after a small configuration change. |
| QLC+ | All | Not yet. QLC+ does not list the interface. |

Details and setup steps for each are on the [Lighting Software](/usb-interface/lighting-software/) page.

## Limitations

* Software that talks to interfaces through FTDI's D2XX driver, instead of a serial (COM) port, does not see the interface.
* DMX input on port B needs the [serial port per DMX port](/usb-interface/settings/#usb-serial-ports) setting.
* No Art-Net or sACN over USB. The interface does DMX and RDM on its two ports.
* The digital inputs and outputs on the Pico 2 are not used by this firmware.

## Purchase Information

The USB Interface firmware runs on the DMX Core Pico 2. See the [USB Interface page](https://dmxcore.com/usb-interface) on our website. See the [DMX Core Pico 2 product page](https://dmxcore.com/pico) for specs and pricing, or buy it from [dmxprosales.com](https://dmxprosales.com/products/dmx-core-pico2).
