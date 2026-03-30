---
title: Output Events
description: Send notifications when actions occur
---

Output events let the DMX Core 100 send notifications to external systems when specific actions occur. For example, you can send an MQTT message when a cue starts playing, or make an HTTP request when a schedule triggers.

:::tip[Web UI only]
Output event configuration is available in the Web UI under **Settings > Output Events**.
:::

<!-- SCREENSHOT: Web UI output events list (dark mode) -->

## Creating an Output Event

1. In the Web UI, go to **Settings > Output Events**
2. Click **Add** to create a new event
3. Configure the trigger condition — what system event should fire this output
4. Set the output type and destination
5. Click **Save**

## Output Types

Output events can send notifications via:

- **MQTT** — Publish a message to an MQTT topic
- **HTTP** — Make an HTTP request to an external URL
- **Serial** — Send data over a serial port

## Use Cases

- Notify a building management system when lighting changes
- Trigger actions in other IoT devices via MQTT
- Log lighting events to an external system
- Synchronize with other AV equipment
