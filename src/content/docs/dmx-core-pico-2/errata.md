---
title: Errata
---

## Hardware v1.0

* USB-C power delivery missing. Requires power via power connector (7-28VDC) or with a USB-A to USB-C cable (included)
* Optional pads for UART (TX/RX) are connected to the wrong GPIO pins. Can be used, but will then disable DMX Port A.

## Hardware v1.1

* Expansion port mapped to GPIO 21 and 22, which are unused, but are not tied to a hardware UART.
