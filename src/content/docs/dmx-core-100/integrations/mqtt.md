---
title: MQTT
description: IoT integration via MQTT messaging protocol
---

The DMX Core 100 supports MQTT (Message Queuing Telemetry Transport), a lightweight messaging protocol commonly used in IoT and building automation systems. MQTT integration allows you to trigger lighting actions from IoT devices and publish lighting state changes to other systems.

## Configuration

MQTT settings are available in the **Web UI** under **Settings > Protocol**.

<!-- SCREENSHOT: Web UI MQTT configuration -->

### Broker Connection

Configure the MQTT broker connection:

- **Broker address** — The hostname or IP address of your MQTT broker
- **Port** — The broker port (default: 1883)
- **Username / Password** — Credentials for broker authentication (if required)

## MQTT Input Triggers

You can create [input triggers](/dmx-core-100/scheduling-automation/input-triggers) that fire when a message is published to a specific MQTT topic. This lets you control the DMX Core 100 from any MQTT-capable device — smart buttons, sensors, home automation systems, etc.

## MQTT Output Events

[Output events](/dmx-core-100/scheduling-automation/output-events) can publish MQTT messages when actions occur on the DMX Core 100. For example, publish a message when a cue starts playing so other systems can react.

## Use Cases

- **Smart home integration** — Trigger lighting scenes from smart switches or sensors
- **Building management** — Integrate with BMS systems that use MQTT
- **IoT automation** — Coordinate lighting with other IoT devices
- **Shelly devices** — Experimental support for controlling Shelly RGBW devices via MQTT
