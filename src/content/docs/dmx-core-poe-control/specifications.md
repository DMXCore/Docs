---
title: Specifications
description: DMX Core PoE Control technical specifications
---

## Network and power

| | |
|---|---|
| Ethernet | 10/100BASE-T, RJ45 with link and activity LEDs |
| PoE | IEEE 802.3af, Class 0, on the data pairs or the spare pairs; isolated PoE module |
| Alternative power | USB-C 5 V. PoE and USB-C may be connected at once; PoE carries the load |
| Consumption | About 1 W typical; under 1.5 W with panel LEDs lit |
| Addressing | DHCP, or a fixed IP address, netmask and gateway |
| Discovery | mDNS / DNS-SD (`_osc._udp`), matching the DMX Core 100's device name; or an IP address |
| Targets | DMX Core 100 or any OSC server (OSC over UDP); Symetrix DSPs (Composer control protocol, TCP 48631); Q-SYS Cores (External Control Protocol, TCP 1702). One firmware image per target |
| Knob modes | OSC: steps (the server keeps the value) or level (the knob sends a float between min and max). Symetrix and Q-SYS: a nudge of a set percent per click |

## Control inputs

| | |
|---|---|
| Control ports | 4, pluggable 3.5 mm pitch screw terminals, 4 poles (A, B, S, GND). Plugs included |
| Per port | 1 rotary encoder with push switch, or up to 3 push buttons |
| Input type | Contact closure to GND; 10 kΩ pull-up, about 0.3 mA wetting current |
| Encoder | Standard quadrature, one cycle per detent. Decoded in hardware (PIO), one step per click, no debounce needed |
| Buttons | Normally-open momentary, 20 ms firmware debounce |
| Protection | Per line: 1 kΩ series resistor, RC noise filter, TVS clamp to the rails. Survives ESD on the terminals and a wire brushed onto 5 V or 12 V |
| Cable | Up to about 10 m per port; twisted pair or shielded cable near dimmer or mains wiring |
| Panel LED port | 3.5 mm pitch terminal, 3 poles (5V, DATA, GND), for up to 8 WS2812-compatible RGB LEDs; 5 V output fused, chain current capped at 80 mA |

## Configuration and status

| | |
|---|---|
| Web page | HTTP at `http://<name>.local/` (mDNS, advertised as `_http._tcp`): live status, settings editor, listing, log, firmware upload, restart. Optional password (salted hash, never sent in the clear); `web = off` disables it entirely |
| USB-C | Device port: mass-storage drive (`config.txt`, `status.txt`, `servers.txt`) and a serial log |
| Configuration | Plain text file, edited on the web page or the drive, applied on save, validated whole; settings kept in flash |
| Firmware updates | `.uf2` uploaded on the web page or copied onto the drive; A/B partitions with trial boot and automatic rollback |
| Status LED | RGB, through a light pipe in the lid; brightness configurable |
| Reliability | Hardware watchdog (4 s), crash recording, automatic reconnection to a Core that changes address |

## Hardware

| | |
|---|---|
| Microcontroller | Raspberry Pi RP2350 (RP2354A, 2 MB flash in package) |
| Ethernet | WIZnet W5500 |
| MAC address | Factory-programmed, IEEE-registered |
| Board | 85 x 66 mm, 4 layers |
| Enclosure | Wall-mountable box with two mounting ears, about 91 x 72 x 29 mm. Ethernet and USB-C on one edge, control ports on the opposite edge, LED port on the side |
| Operating environment | Indoor, 0 to 40 °C, non-condensing |
| Compliance | FCC Part 15 B, CE (EMC), RoHS - targeted |

## In the box

* DMX Core PoE Control in its enclosure
* Four 4-pole control-port plugs and one 3-pole LED-port plug

Not included: knobs and buttons (see the [Rotary Encoder Kit](../wiring/#rotary-encoder-kit), [sold separately](https://dmxprosales.com/products/dmx-core-rotary-encoder-for-poe-control)), PoE switch or injector, Ethernet cable.

## Rotary Encoder Kit

| | |
|---|---|
| Encoder | Bourns PEC11R-4220K-S0024: 24 detents, 24 pulses per revolution, push switch, 20 mm knurled shaft |
| Board | 19 x 31 mm, held by the encoder's M7 nut; no mounting holes needed |
| Knob | Aluminium, 15 mm diameter, push-on |
| Cable | 200 mm, 4-core 22 AWG flexible, JST XH 4-pin plug to four ferrules |
| Panel | Drill for the encoder's M7 bush; the nut holds the whole assembly |
