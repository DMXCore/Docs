---
title: MQTT
description: IoT integration via MQTT messaging protocol
---

The DMX Core 100 supports MQTT (Message Queuing Telemetry Transport), a lightweight messaging protocol common in IoT and building automation. MQTT lets IoT devices trigger lighting actions, and lets the DMX Core 100 publish its own state changes for other systems to react to.

## Broker Connection

Connect to an external MQTT broker under **Control & Integrations > MQTT** in the Web UI:

- **Enable External MQTT** — turn the broker connection on
- **MQTT Server / Port** — the broker's hostname or IP (default port 1883)
- **MQTT Username / Password** — credentials, if the broker requires them

![MQTT broker settings](/assets/web/mqtt-settings.png)

## Ways to Use MQTT

- **Input triggers** — fire an action when a message is published to a topic, or drive a level from a numeric payload (Value mode). See [Input Triggers](/dmx-core-100/scheduling-automation/input-triggers).
- **Output events** — publish a message when something happens on the DMX Core 100 (a cue starts, a schedule fires). See [Output Events](/dmx-core-100/scheduling-automation/output-events).
- **Scripts** — publish from JavaScript with `dmx.mqtt.publish(topic, payload)`, e.g. to bridge lighting state into a home automation bus. See the [Scripting API](/dmx-core-100/scheduling-automation/scripting-api#messaging).
- **MQTT output** — an [output](/dmx-core-100/configuration/output-config) can be of type MQTT, publishing DMX level data for downstream consumers such as Shelly RGBW devices (experimental).

## Use Cases

- **Smart home integration** — trigger lighting scenes from smart switches or sensors
- **Building management** — integrate with BMS systems that use MQTT
- **IoT automation** — coordinate lighting with other IoT devices
