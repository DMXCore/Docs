---
title: FAQ
description: Frequently Asked Questions
---

#### How can I power the Pico 2?

The Pico 2 can be powered either via USB-C at 5V, or via the power input connector at 7-28VDC.

#### Is J3 DEBUG the SWD port? What connector is it?

Yes. J3 is the RP2040 Serial Wire Debug (SWD) port. It is a 3-pin **JST SH 1.0 mm** connector (`BM03B-SRSS-TB`), the same type used on a Raspberry Pi Pico H and the Raspberry Pi Debug Probe. Pinout: 1 = SWCLK, 2 = GND, 3 = SWDIO. See [Pin out](pin-out/#j3-debug-swd) for J-Link wiring.

#### Are you using a bootloader through the USB port? Can I use the Arduino IDE?

The RP2040 USB bootloader is in ROM. Hold **BOOTSEL**, connect USB, and copy a `.uf2` file to the `RPI-RP2` drive. Arduino IDE works if you select **Raspberry Pi Pico (RP2040)** — not Pico 2 / RP2350. Details are on the [Software](software) page.

#### What does the J4 jumper "Connect C to GND" mean?

J4 ties the digital-input common (`C`) to board ground. Fit the jumper when using the onboard `3v3` pin to power buttons or dry contacts. Leave it open when an external 3–24 V source brings its own 0 V to `C`. See [Pin out](pin-out/#j4-jumper).

#### Are the digital triggers pulled to GND to activate?

No. Apply **3–24 VDC** between the input (`i1`–`i4`) and `C`. For a push button, jumper J4 and switch the onboard `3v3` onto the input. See [Pin out](pin-out/#digital-inputs).
