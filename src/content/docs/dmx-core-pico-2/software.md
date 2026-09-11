---
title: Software
---

The Pico 2 runs software/firmware that you create yourself using the Raspberry Pi Pico ecosystem. We have provided examples for both the Pico SDK (C/C++) and MicroPython. The MicroPython examples include a small support library (`dmxcore.py`) with the board pin definitions and ready-to-use DMX input/output classes.

[Example code on GitHub](https://github.com/DMXCore/Pico-Examples)

## Programming over USB (UF2)

The RP2040 has a USB bootloader in ROM. There is no extra bootloader to install, and it cannot be overwritten.

1. Hold the **BOOTSEL** button.
2. Plug in USB-C (or power the board while still holding BOOTSEL).
3. A drive named `RPI-RP2` appears. Copy your `.uf2` file onto it.

The board reboots into the new firmware. The same flow is used for Pico C/C++ SDK builds, MicroPython, CircuitPython, and Arduino-produced UF2 files.

You can also program and debug over the [J3 SWD port](pin-out/#j3-debug-swd) with a Raspberry Pi Debug Probe or a J-Link.

## Arduino IDE

Yes. Treat the board as a **Raspberry Pi Pico (RP2040)**, not a Raspberry Pi Pico 2 (RP2350). The DMX Core Pico 2 is RP2040-based.

Recommended board package: [Earle Philhower's Raspberry Pi Pico / RP2040 core](https://github.com/earlephilhower/arduino-pico). Select board **Raspberry Pi Pico**, then upload via UF2 (BOOTSEL) or picotool.

Use the GPIO numbers from the [examples](https://github.com/DMXCore/Pico-Examples) (for example digital inputs 1–4 are GPIO 8–11). The official Pico C/C++ SDK examples are the best-supported starting point if you are not already in Arduino.

## Commercial Software

We have developed a software suite for the Pico 2 called the [DMX Re-Mapper](/dmx-core-pico-2-re-mapper/), which provides features like re-mapping of DMX channels and using digital inputs with a configuration utility. It's possible to purchase this software as an add-on to a standard Pico 2; the firmware is locked to the serial number of the Pico 2. [Contact DMX Pro Sales](https://dmxprosales.com/pages/contact-us) for more information about this upgrade.
