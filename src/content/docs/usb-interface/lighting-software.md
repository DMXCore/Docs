---
title: Lighting Software
description: Using the DMX Core Pico 2 USB Interface with Lightkey, OLA, QLC+ and other lighting software
---

The USB Interface shows up on the computer as a USB serial port: a COM port on Windows, `/dev/cu.usbmodem…` on macOS and `/dev/ttyACM…` on Linux. It speaks the Enttec DMX USB Pro protocol, with the DMXking extensions for a second port. In lighting software, choose the option for an **Enttec DMX USB Pro** (port A only) or a **DMXking ultraDMX Pro** (both ports), whichever the software offers.

This page lists what has been tested. If you try it with other software, we'd like to hear how it went: [open an issue on GitHub](https://github.com/DMXCore/USBInterface-Public/issues).

## Monitoring while your software runs

While your lighting software has the interface open, the [DMX Core USB Utility](/usb-interface/config-utility/#monitoring-while-your-lighting-software-runs) can show each port's status and live DMX levels. It uses its own USB connection to the interface, not the serial port, so you can keep both open.

## Two ports (DMX Core Pico 2)

By default the Pico 2 has **one serial port for both DMX ports**:

* Port A uses the standard Enttec messages, so any software that supports an Enttec DMX USB Pro can send and receive on it.
* Port B uses DMXking's message for a second port. Only software that knows two-port DMXking interfaces sends DMX to it.

Software that drives only one port per interface (Lightkey, and other software built on OLA) can use both ports if you turn on [a serial port per DMX port](/usb-interface/ports-and-wiring/#a-serial-port-per-dmx-port). The Pico 2 then shows up as two one-port interfaces, each with its own serial port, and two programs can each drive a port.

## Using port A as an input

Port A starts out listening and forwards what it receives. Once a program sends DMX to it, it becomes an output and stays one until the program closes the serial port or stops sending ([When the program stops](/usb-interface/settings/#when-the-program-stops)).

Some software sends output frames to every port it has open, even when you only want input. If the input stops working, set port A to **Input** in the [settings](/usb-interface/settings/#port-direction). The interface then drops output frames for port A and keeps listening.

## Lightkey (macOS)

Tested: Lightkey finds the interface and sends DMX.

1. Plug in the interface.
2. In Lightkey, add a DMX output using Lightkey's option for a generic USB interface.

Lightkey uses one port per interface, so on a DMX Core Pico 2 it drives port A. To use both ports, turn on [a serial port per DMX port](/usb-interface/ports-and-wiring/#a-serial-port-per-dmx-port) in the [DMX Core USB Utility](/usb-interface/config-utility/) (Settings, Advanced). Lightkey then finds two interfaces and drives each from its own universe.

The DMX Core USB Utility shows port status and DMX levels while Lightkey is using the interface, so you can check what goes out on each port during a show.

Not tested yet: DMX input in Lightkey.

## OLA, Open Lighting Architecture (Linux)

Tested with OLA 0.10.9 on Ubuntu: OLA finds the interface as a USB Pro device on port A, with RDM. `ola_rdm_discover`, `ola_rdm_get` and `ola_rdm_set` work while DMX is streaming.

OLA needs two changes before it finds the interface:

1. OLA's USB serial plugin only looks at `ttyUSB` devices by default. Tell it to look at `ttyACM` devices too.
2. Keep ModemManager from opening the serial port, since it can probe the port when the interface is plugged in.

```bash
echo 'device_prefix = ttyACM' | sudo tee -a /etc/ola/ola-usbserial.conf
echo 'ATTRS{idVendor}=="2e8a", ATTRS{idProduct}=="1180", ENV{ID_MM_DEVICE_IGNORE}="1"' | sudo tee /etc/udev/rules.d/60-dmxcore-mm.rules
sudo udevadm control --reload && sudo systemctl restart olad
```

Then plug the interface in (again) and patch its port to a universe in OLA's web interface.

OLA uses one port per interface (port A on a DMX Core Pico 2). To use port B as well, turn on [a serial port per DMX port](/usb-interface/ports-and-wiring/#a-serial-port-per-dmx-port); OLA then finds two interfaces.

:::note
Some RDM fixtures take a moment after a SET (for example a new DMX address) before they answer again, and OLA then reports a timeout. The [RDM pause setting](/usb-interface/settings/#rdm) adds a pause between requests for fixtures like that.
:::

## QLC+

Not supported yet. QLC+ only lists USB DMX interfaces whose USB ID is on its own list, and the USB Interface's ID (`2E8A:1180`) is not on that list yet. We're working on getting support added to QLC+, and will update this page when a QLC+ version that lists the interface is available.

## Other software

Software that supports an Enttec DMX USB Pro or a DMXking ultraDMX Pro **through a serial (COM) port** may work, but has not been tested. A few things to know:

* Software that uses FTDI's D2XX driver to find interfaces, instead of the serial port, does not see the interface.
* The interface identifies itself as **DMX Core**, not as Enttec or DMXking. Software that only accepts its own vendor's interfaces won't use it.
* If the software lists interfaces by USB ID, it needs `2E8A:1180` on its list.

Developers adding support for the interface can [contact us](https://dmxprosales.com/pages/contact-us) for protocol details.
