---
title: USB Interface
description: Firmware that turns DMX Core hardware, such as the DMX Core Pico 2, into a USB DMX interface with RDM and live monitoring
---

The USB Interface is firmware for DMX Core hardware. It turns the hardware into a USB-to-DMX interface: plug it into a computer and lighting software sees a USB DMX interface on a serial (COM) port. On a [DMX Core Pico 2](/dmx-core-pico-2/) it is the **DMX Core Pico 2 USB Interface**, with two isolated DMX512 ports.

It speaks the Enttec DMX USB Pro protocol, with extensions for a second port, so software that supports an Enttec DMX USB Pro or a DMXking ultraDMX can drive it. It also does RDM, so you can find fixtures and set their DMX address from your computer.

## Highlights

### Watch the DMX and use RDM while your lighting software runs

The [DMX Core USB Interface Utility](/usb-interface/config-utility/) shows each port's status and its live DMX levels **while your lighting software has the interface open**. The utility talks to the interface over a USB connection of its own, separate from the serial port the lighting software uses, so you don't have to close your show to see what the interface is sending or receiving.

**RDM works live, too.** With the show running, the utility can find fixtures, change their DMX address, label or personality, identify them and read their sensors. See [RDM](/usb-interface/config-utility/#rdm).

The utility runs on **Windows, macOS and Linux**.

![The DMX Core USB Interface Utility showing port A's live DMX levels while another program has the serial port open](/assets/usb-interface/monitor-while-program-runs.png)

### Both ports in one-port software (DMX Core Pico 2)

Some lighting software, such as Lightkey, uses only one port per interface. Turn on [a serial port per DMX port](/usb-interface/ports-and-wiring/#a-serial-port-per-dmx-port) and the Pico 2 shows up as two separate interfaces, one per DMX port, so that software can drive both ports, each from its own universe.

## Supported hardware

| Hardware | DMX ports | Notes |
| --- | --- | --- |
| [DMX Core Pico 2](/dmx-core-pico-2/) | 2 (A and B) | Output on both ports, input on port A (and on port B with a serial port per DMX port), RDM on both. See [DMX Core Pico 2 Ports](/usb-interface/ports-and-wiring/). |

On the Pico 2, the USB Interface firmware runs on the same hardware as the [Re-Mapper](/dmx-core-pico-2-re-mapper/) and your own code. You can switch between them at any time by copying a different `.uf2` file onto the board.

## What you need

* Supported hardware, such as a [DMX Core Pico 2](https://dmxcore.com/pico)
* The USB Interface firmware, free for every DMX Core Pico 2 owner, from [GitHub releases](https://github.com/DMXCore/USBInterface-Public/releases) or through the USB Interface Utility. See [Installing the Firmware](/usb-interface/installing-firmware/).
* A computer running Windows, macOS or Linux, and a USB cable
* Recommended: the [USB Interface Utility](/usb-interface/config-utility/) to monitor the ports, change settings, update the firmware and use RDM

## Features

### DMX

* **Steady output.** The interface repeats the latest frame on its own at the output rate (up to 40 frames per second, or as fast as the frame allows), whatever the computer is doing.
* **DMX input**, sent to the computer every frame or only on change. At most 40 received frames per second go to the computer by default, always the newest, so software keeps up with fast consoles.
* **On the DMX Core Pico 2:** port A sends or receives; port B sends, and also receives with a serial port per DMX port. See [DMX Core Pico 2 Ports](/usb-interface/ports-and-wiring/).

### RDM

* Discovery, GET and SET.
* Works with RDM-capable lighting software such as OLA, through the Enttec protocol.
* Works with the RDM tool in the [USB Interface Utility](/usb-interface/config-utility/#rdm), on every port.
* DMX keeps going between RDM requests.

### Settings kept on the interface

Port directions, output rate, DMX timing (break and mark after break), full 512-channel frames, RDM on or off, and what the outputs do when the computer stops sending. See [Settings](/usb-interface/settings/).

### USB

* USB ID `2E8A:1180`, assigned by Raspberry Pi to this interface, so software can recognize it by its USB ID.
* Standard USB serial (CDC) driver on Windows, macOS and Linux. Nothing to install.
* Firmware updates without opening the case: the USB Interface Utility puts the interface into its boot loader and installs the new firmware.

## Software compatibility

| Software | Platform | Status |
| --- | --- | --- |
| Lightkey | macOS | Tested: finds the interface and sends DMX. On a DMX Core Pico 2 with a serial port per DMX port, it finds two interfaces and drives both ports. |
| OLA (Open Lighting Architecture) | Linux | Tested: works, including RDM, after a small configuration change. |
| QLC+ | All | Not yet. QLC+ does not list the interface; we're working on getting support added to QLC+. |

Details and setup steps for each are on the [Lighting Software](/usb-interface/lighting-software/) page.

## Limitations

* Software that talks to interfaces through FTDI's D2XX driver, instead of a serial (COM) port, does not see the interface.
* No Art-Net or sACN over USB. The interface does DMX and RDM on its own ports.
* On the DMX Core Pico 2, DMX input on port B needs [a serial port per DMX port](/usb-interface/ports-and-wiring/#a-serial-port-per-dmx-port), and the digital inputs and outputs are not used by this firmware.

## Purchase Information

The USB Interface firmware is free and runs on the DMX Core Pico 2. See the [USB Interface page](https://dmxcore.com/usb-interface) on our website, and the [DMX Core Pico 2 product page](https://dmxcore.com/pico) for specs and pricing, or buy it from [dmxprosales.com](https://dmxprosales.com/products/dmx-core-pico2).
