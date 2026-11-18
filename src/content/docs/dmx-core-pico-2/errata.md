---
title: Errata
---

## Hardware v1.0

* USB-C power delivery missing. Requires power via power connector (7-28VDC) or with a USB-A to USB-C cable (included)
* Optional pads for UART (TX/RX) are connected to the wrong GPIO pins. Can be used, but will then disable DMX Port A.

## Hardware v1.1

* Expansion port mapped to GPIO 21 and 22, which are unused, but are not tied to a hardware UART.
* USB may not connect while the board is powered from the power input (7-28VDC). The onboard 5V supply is tied directly to USB-C VBUS, so the board puts 5V on the USB cable before the computer does. USB-C ports (USB-C to USB-C cables, docks and hubs) wait for VBUS to be at 0V before they connect, so the serial port (Re-Mapper) or the `RPI-RP2` drive never appears. The board also feeds its 5V back into the computer's USB port. **Workaround:** disconnect the power input while connected to a computer, and power the board from USB only. Re-Mapper settings are stored in flash, so reconnect the power input after configuring.

## Hardware v1.2

* USB may not connect while the board is powered from the power input. Same issue and workaround as v1.1 above.
