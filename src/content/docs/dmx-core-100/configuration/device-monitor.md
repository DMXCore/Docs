---
title: Device Monitor
description: Discover and monitor the devices in your lighting network
---

The Device Monitor discovers hardware on your network and keeps an eye on it — so you find out about a failing pixel controller or an unplugged interface before the audience does.

:::tip[Web UI]
The Device Monitor is available under **Utilities > Device Monitor**. (Earlier releases called this page *Device Status*.)
:::

![Device Monitor with discovered Advatek, DMXking, and Stream Deck devices](/assets/web/device-monitor.png)

## Discovering Devices

Click **Scan** to search the network. Discovered devices are listed with their identity read straight from the hardware:

- **Advatek PixLite** pixel controllers — model, firmware, and IP; see the [Advatek Lighting integration](/dmx-core-100/integrations/advatek-lighting) for the deeper features (per-port Create Output, electrical monitoring, drift detection)
- **DMXking** interfaces (eDMX, LeDMX, …) — model, serial, supported universes, and firmware
- **Stream Deck** devices connected over USB
- **RDM devices** reachable over Art-Net

Click **Monitor** on a discovered device to add it to the monitored list. Devices that can't be discovered automatically can be added with **Add Manual Monitor**.

## Monitoring

Monitored devices are checked periodically. The list shows each device's **status** and **last seen** time, and status snapshots are sent when a device connects and at startup. Events (connected, disconnected, configuration drift, out-of-range readings) flow into the system for alerting and history.

If the device is registered to the [DMX Core portal](/dmx-core-100/remote-management), its monitored peripherals are reported there too — including email alerts when a device or peripheral enters a problem state.

For real-time inspection of the DMX data itself, see the [Output Monitor](/dmx-core-100/configuration/output-monitor).
