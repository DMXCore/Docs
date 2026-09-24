---
status: candidate
source: synthetic
invented: true
level: intermediate
surface: web
date: 2026-09-15
title: Play a cue when a message arrives on an MQTT topic
slug: mqtt-topic-plays-cue
anonymized: true
docs_slugs:
  - dmx-core-100/integrations/mqtt
  - dmx-core-100/scheduling-automation/input-triggers
  - dmx-core-100/playback/cues
verified: docs be6f663, core v2026.914.3
---

# Play a cue when a message arrives on an MQTT topic

## Original ask

> Our building controller publishes to a Mosquitto broker on the LAN. When the lobby
> occupancy sensor trips it sends `ON` to `building/lobby/occupancy`. I want the DMX
> Core to play our WELCOME cue when that happens. Where do I wire that up? Is it an
> output event or an input trigger?

## Goal

The DMX Core 100 is connected to the site broker, and an MQTT input trigger on
`building/lobby/occupancy` with Start Payload `ON` plays the cue with code `WELCOME`.

## Walkthrough

```json
{
  "id": "mqtt-topic-plays-cue",
  "title": "Play a cue when a message arrives on an MQTT topic",
  "steps": [
    {
      "id": "connect-broker",
      "label": "Open Control & Integrations → MQTT, turn on Enable External MQTT, enter the broker in MQTT Server (e.g. 192.168.1.30), MQTT Port (1883) and MQTT Username / Password if the broker needs them, and save",
      "docsUrl": "/dmx-core-100/integrations/mqtt/#broker-connection",
      "screenshotId": "mqtt-settings"
    },
    {
      "id": "check-cue-code",
      "label": "In Lighting → Cues, note the exact Code / Short Name of the cue to play (WELCOME)",
      "docsUrl": "/dmx-core-100/playback/cues/",
      "screenshotId": "cues-list"
    },
    {
      "id": "add-trigger",
      "label": "Open Control & Integrations → Input Triggers → Add New, set Type to MQTT, Address to building/lobby/occupancy and Mode to On/Off - run an action",
      "docsUrl": "/dmx-core-100/scheduling-automation/input-triggers/#input-types",
      "screenshotId": "input-trigger-editor"
    },
    {
      "id": "set-payload-and-action",
      "label": "Enter ON as the Start Payload, set Action Type to Play Cue with Target WELCOME, make sure Enabled is on, and Save",
      "docsUrl": "/dmx-core-100/scheduling-automation/input-triggers/#actions",
      "screenshotId": "input-trigger-editor"
    },
    {
      "id": "test",
      "label": "Publish ON to building/lobby/occupancy from the building controller (or any MQTT client) and check that the WELCOME cue starts",
      "docsUrl": "/dmx-core-100/scheduling-automation/input-triggers/#trigger-settings",
      "screenshotId": null
    }
  ]
}
```

## Gotchas

- Messages coming **into** the DMX Core are **Input Triggers**. **Output Events** go
  the other way: the DMX Core publishes when something happens on it.
- The Input Trigger's **Address** field is the MQTT topic. Enter the topic exactly as
  the controller publishes it.
- MQTT triggers need a working broker connection (**Control & Integrations > MQTT**)
  first.
- Enter the payload exactly as the controller sends it (`ON`).
- For complex payloads (JSON, conditions), use **Run Script** as the action. The raw
  payload is available as `ctx.payload`.
- For a numeric payload that should drive a level instead of firing an action, use
  **Value** mode.

## Eval checks

- Uses an Input Trigger at `Control & Integrations > Input Triggers`, not an Output
  Event
- Type is **MQTT**, Address is `building/lobby/occupancy`
- Uses **ON** as the payload that fires, with Action Type **Play Cue** and target
  `WELCOME`
- Mentions setting up the broker at `Control & Integrations > MQTT` (Enable External
  MQTT, server, port 1883)
- Does not tell them to write a script for this simple case (Run Script only as an
  option for complex payloads)
- Does not tell them to use MCP or the Integration API
- Does not claim it created the trigger for them

## Gaps

- `scheduling-automation/input-triggers.md` does not document MQTT matching details
  that matter in practice. In `src/Shared/Services/MqttManager.cs` (v2026.914.3,
  message handler around the `this.triggers.TryGetValue(...Topic.ToLower())` lookup
  and `InternalAddPattern`):
  - The topic is matched exactly and case-insensitively. MQTT wildcards (`+`, `#`) in
    a trigger Address are subscribed but never match the lookup, so they do not fire.
  - **Start Payload** / **Stop Payload** are compared as exact, case-sensitive strings.
  - With no Start/Stop Payload, a payload that parses as a boolean is used as on/off,
    and any other payload fires the trigger.
- The released Web UI help text for Type OSC **or MQTT** says "Address should start
  with a /" (`src/AdminSite/ClientApp/src/views/operation/InputTriggerDetails.vue`
  line 57; nav `web/inputtriggers/details` field **Address**). That is wrong for MQTT
  topics like `building/lobby/occupancy`: adding a leading slash creates a different
  topic, which then never matches. The docs don't mention it.
- `input-triggers.md` › Trigger Settings does not name the **Start Payload** /
  **Stop Payload** fields for MQTT, OSC and TCP/UDP (only "Start Choice" for Control
  Value triggers). Nav `web/inputtriggers/details` shows them for MQTT in On/Off mode.
- No screenshot of the Input Trigger details form. `input-triggers-list` shows only
  the list.

## Verification

- Step `connect-broker`: `integrations/mqtt.md` › Broker Connection. Source: nav
  `web/settings/mqtt` (`Enable External MQTT`, `MQTT Server`, `MQTT Port`,
  `MQTT Username`, `MQTT Password`).
- Step `check-cue-code`: `playback/cues.md` (cue code). Source: nav cues list column
  `Code / Short Name` (same pattern as the confirmed OSC recipe).
- Step `add-trigger`: `input-triggers.md` › Input Types (**MQTT**: "A message
  published to an MQTT topic (requires the MQTT integration)"), Two Modes, Trigger
  Settings (**Address** = MQTT topic). Source: nav `web/inputtriggers` action
  `Add New`; `web/inputtriggers/details` Type option `MQTT`, field `Address`, Mode
  option `On/Off - run an action`. `ExtConnManager.cs` `case TriggerTypes.MQTT` →
  `mqttManager.AddTrigger(Address, StartPayload, StopPayload)`.
- Step `set-payload-and-action`: `input-triggers.md` › Actions (Play Cue). Source:
  nav `web/inputtriggers/details` field `Start Payload` (visible for MQTT when Mode is
  not Value), Action section `Action Type` option `Play Cue`, `Target`, `Enabled`,
  action `Save`.
- Step `test`: `MqttManager.cs` handler fires on an exact Start Payload match.
- Output Events vs Input Triggers: `integrations/mqtt.md` › Ways to Use MQTT.

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
