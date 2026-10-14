---
title: Connectors and Pinouts
description: DC power input and the pinouts of the DMX-512, audio and ADIO expansion boards
---

The pictures on this page are renders of the circuit boards, seen from the back of the DMX Core 100. The orange labels name each pin; the white text printed on the board (silkscreen) says the same thing, so you can check it on the unit.

## DC power input

If you don't use Power over Ethernet, power the DMX Core 100 from an **8–28 VDC** supply (not included) on the green 2-pin terminal next to the corner of the main board. It is a pluggable terminal block with 3.5 mm pitch: strip the wires, screw them into the plug, and push the plug onto the header.

![DC power input on the main board: + 8–28 VDC on the pin next to the 8-28VDC marking, GND on the pin next to the GND marking](/assets/hardware/dc-power.png)

| Pin | Board marking | Connect to |
| --- | --- | --- |
| Upper pin | `8-28VDC` | Supply **+** (positive) |
| Lower pin | `GND` | Supply **–** (negative / ground) |

- The unit draws at most 8 W (about 0.5 A at 12 VDC). A 12 V or 24 V adapter rated 1 A or more leaves plenty of headroom.
- For a wall adapter with a barrel plug, use a DC barrel-jack-to-screw-terminal adapter (pigtail) and wire its + and – to the plug as shown. Check the polarity with a meter before connecting; a center-positive adapter is not always marked.
- Use either PoE or the DC input.
- There is no power switch: the unit starts when power is applied. See [Installation](/dmx-core-100/getting-started/installation#power-up).

## DMX pinout and XLR

All the DMX ports on the expansion boards use the same three signals. To wire one to an XLR connector:

| Board pin | Signal | XLR pin |
| --- | --- | --- |
| `A` | Data + | 3 |
| `B` | Data – | 2 |
| `COM` / `GND` | Common (shield) | 1 |

![XLR-3 pin numbers, female and male](/assets/dmx-core-pico-2/xlr3.png)

![XLR-5 pin numbers, female and male](/assets/dmx-core-pico-2/xlr5.png)

On a 5-pin XLR, pins 4 and 5 (the optional second data pair) are not used.

## 2-port DMX-512 board

Two isolated DMX-512 ports, **DMX A** on the left and **DMX B** on the right. Each can be an input or an output; see [Passthrough](/dmx-core-100/lighting/passthrough) and [Stream Routing](/dmx-core-100/lighting/stream-routing). Note that the two terminals are mirror images: on **DMX A** the `A` pin is at the top, on **DMX B** it is at the bottom.

![2-port DMX-512 board with the pins of DMX A and DMX B labeled](/assets/hardware/dmx512-board.png)

| Terminal | Pin (top to bottom) | XLR pin |
| --- | --- | --- |
| DMX A | `A` Data + / `B` Data – / `COM` | 3 / 2 / 1 |
| DMX B | `COM` / `B` Data – / `A` Data + | 1 / 2 / 3 |

## Audio board

Stereo line outputs, available balanced and unbalanced at the same time.

![Audio board with the balanced and unbalanced output pins labeled](/assets/hardware/audio-board.png)

**Balanced line out** (6-pin, left), top to bottom:

| Pin | Signal | XLR pin |
| --- | --- | --- |
| 1 | LEFT + | 2 |
| 2 | LEFT – | 3 |
| 3 | GND | 1 (shield) |
| 4 | RIGHT + | 2 |
| 5 | RIGHT – | 3 |
| 6 | GND | 1 (shield) |

**Unbalanced line out** (3-pin, right), top to bottom: `LEFT`, `RIGHT`, `GND`.

- Use the balanced outputs for any cable that leaves the enclosure, into a balanced (differential) input. Connect `GND` to the cable shield only; don't use it as a signal return.
- Use the unbalanced output for short runs to equipment in the same rack or enclosure.
- The audio outputs are not isolated. If the connected amplifier puts DC on the line or there is a ground loop (hum), put a DI box or line isolation transformer in between.

## ADIO board

Audio outputs (same as the audio board), two isolated DMX-512 ports and four digital inputs.

![ADIO board with the digital inputs, audio outputs and DMX ports labeled](/assets/hardware/adio-board.png)

**DMX A** and **DMX B** (3-pin, bottom), left to right: `A` Data + (XLR 3), `B` Data – (XLR 2), `GND` (XLR 1). See [DMX pinout and XLR](#dmx-pinout-and-xlr).

**Balanced line out** (5-pin, left), top to bottom: `LEFT +`, `LEFT –`, `GND`, `RIGHT +`, `RIGHT –`. On an XLR: + to pin 2, – to pin 3, `GND` to pin 1.

**Unbalanced line out** (3-pin, right), top to bottom: `GND`, `RIGHT`, `LEFT`.

**Digital inputs** (6-pin, top), right to left: `In1`, `In2`, `In3`, `In4`, `3V3`, `GND`.

| Pin | Function |
| --- | --- |
| `In1`–`In4` | Trigger inputs 1–4 (opto-isolated, about 3–30 VDC, about 5 mA) |
| `3V3` | Supply for dry contacts (switches, push buttons, relay contacts) |
| `GND` | Input common |

- **Dry contact or push button:** wire the switch between `3V3` and an input.
- **Voltage signal or PLC output:** connect the signal + to an input and its 0 V / return to `GND`, and leave `3V3` unconnected.

An input is active while voltage is applied, so a closed switch is active. Use the inputs with [Digital Input triggers](/dmx-core-100/scheduling-automation/input-triggers#input-types).

The four `O1`–`O4` pads on the ADIO board are indicator LEDs for the [Digital Output](/dmx-core-100/scheduling-automation/output-events) events, not a field connector.
