---
title: Pin out
---

The Re-Mapper uses the same hardware as the [DMX Core Pico 2](/dmx-core-pico-2/pin-out/). DMX, digital I/O, the J3 SWD debug connector, and jumper J4 are documented there.

## DMX pin out

* G - `Ground/Common` - pin 1
* A - `Data+` - pin 3
* B - `Data-` - pin 2

![XLR-3](/assets/dmx-core-pico-2-re-mapper/xlr3.png)

![XLR-5](/assets/dmx-core-pico-2-re-mapper/xlr5.png)

## Digital inputs (Re-Mapper)

The 4 digital inputs can drive mapped DMX channels even when there is no DMX input. They are **active when 3–24 VDC is applied** between `i1`–`i4` and `C`, not when the pin is pulled to GND.

For push buttons, fit jumper J4 (**Connect C to GND**) and wire each button between the `3v3` pin and an input. Full wiring is on the [Pico 2 pin out](/dmx-core-pico-2/pin-out/#digital-inputs) page.
