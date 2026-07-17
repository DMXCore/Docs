---
title: Scripting API
description: Reference for the dmx API and ctx object available to scripts
---

Every script runs with two globals: **`dmx`**, the device API, and **`ctx`**, the context of the current run. Codes are the short names shown throughout the UI (`CUE1`, `P1`, `Z1`, `CVAL1`, ...). Levels are numbers from 0.0 to 1.0. Durations are milliseconds.

See [Scripting](/dmx-core-100/scheduling-automation/scripting) for how scripts are created, run, and sandboxed.

## Playback

| Function | Description |
|------|-------------|
| `dmx.playCue(code, options?)` | Plays a cue. Options: `fadeIn`, `fadeOut` (ms), `loop` (count, 0 = forever), `dimmer` (0–1 scale), `toggle` (true = stop if already playing). |
| `dmx.playSound(code, options?)` | Plays a sound. Options: `fadeIn`, `fadeOut`, `loop`, `volume` (0–1), `toggle`. |
| `dmx.playTimeline(code)` | Plays a timeline. |
| `dmx.stopPlayback()` | Stops all playback. |
| `dmx.fadeOut(ms?)` | Fades out and stops playback over the given time. |
| `dmx.fireOutputEvent(code)` | Fires an [Output Event](/dmx-core-100/scheduling-automation/output-events). |
| `dmx.isPlaying(code)` | Returns true while the cue, sound, or timeline with this code is playing. |

## Looks and Fixtures

| Function | Description |
|------|-------------|
| `dmx.fadeToPreset(code, ms?)` | Fades to a preset. |
| `dmx.masterDimmer(level, ms?)` | Fades the master dimmer to a level. |
| `dmx.zoneDimmer(zoneCode, level, ms?)` | Fades a zone's intensity to a level. |
| `dmx.setFixture(code, values)` | Partial update of one fixture: only the channels present in `values` change, e.g. `{ red: 1, intensity: 0.5 }`. Channels: `intensity`, `red`, `green`, `blue`, `amber`, `white`, `coolWhite`, `warmWhite`, `ultraViolet`; any other key addresses a custom function by its id. |
| `dmx.getFixture(code)` | Returns the fixture's current levels plus `controlledBy` and `presetCode`, or null. |
| `dmx.releaseFixture(code)` | Releases direct control of a fixture (back to ambient, or off). |
| `dmx.setZoneEffect(zoneCode, effectCode)` | Sets a zone's effect; pass null to clear. |
| `dmx.setGlobalEffect(effectCode)` | Sets the global effect; pass null to clear. |

## Control Values

Requires configured [external control](/dmx-core-100/external-control) backends.

| Function | Description |
|------|-------------|
| `dmx.controlValue.get(code)` | Last-known value (0–1), or null. |
| `dmx.controlValue.set(code, value, fadeMs?)` | Sets a value: a number for Level kind, a string for a Selector choice, a boolean for Toggle. |
| `dmx.controlValue.up(code)` / `down(code)` | Steps a Level or Selector. |
| `dmx.controlValue.toggle(code)` | Toggles a Toggle kind. |
| `dmx.controlValue.status(code)` | Returns `{ kind, value, choiceIndex, choiceName, muted }`, or null. |

## Messaging

| Function | Description |
|------|-------------|
| `dmx.mqtt.publish(topic, payload)` | Publishes to the configured [MQTT](/dmx-core-100/integrations/mqtt) broker. Throws (catchable) when no broker is connected. |
| `dmx.osc.send(target, address, value?)` | Sends one OSC message to `target` in `"ip:port"` form. Numbers are sent as float32. |

## Schedules and Sun Times

| Function | Description |
|------|-------------|
| `dmx.schedule.enable(code)` / `disable(code)` / `toggle(code)` | Changes a schedule's enabled state. |
| `dmx.schedule.isEnabled(code)` | Returns the enabled state, or null for an unknown code. |
| `dmx.sunrise(date?)` / `dmx.sunset(date?)` | Local sun times for today, or for an optional `"yyyy-MM-dd"` date. Returns `{ hour, minute, minutesSinceMidnight }`, or null when no device location is configured or the event does not occur that day. |

## State and Utilities

| Function | Description |
|------|-------------|
| `dmx.store.get(key)` / `set(key, value)` / `delete(key)` / `keys()` | Persistent per-script key-value store. Values must be JSON-serializable; writes are saved immediately and survive restarts. Capped at 64 KB per script. |
| `dmx.sleep(ms)` | Pauses the script. Sleep time counts toward the run's wall-clock timeout. |
| `dmx.log(...values)` | Writes to the script's Last Run log in the editor (and the device debug log). |

## The ctx Object

| Field | Description |
|------|-------------|
| `ctx.trigger.source` | What started the run: an input-trigger type (`"UDP"`, `"MQTT"`, `"HTTP"`, `"OSC"`, ...), `"MANUAL"` (editor Run button), `"EVENT"` (lifecycle event), `"TIMELINE"`, or `"TRIGGER"` (other surfaces). |
| `ctx.trigger.code` | Code of the Input Trigger that fired the run, when applicable. |
| `ctx.payload` | The raw payload string from the trigger, or the editor's Test Payload on manual runs. Null when there is none. |
| `ctx.event` | For lifecycle-event runs: `{ name, code }` where name is `"STARTUP"`, `"CUESTARTED"`, `"CUEENDED"`, or `"SCHEDULEFIRED"` and code identifies the cue or schedule. Null otherwise. |
| `ctx.now` | Local device time: `{ hour, minute, minutesSinceMidnight, weekday, iso }`. |

## Transform Script Globals

[Transform scripts](/dmx-core-100/scheduling-automation/scripting#transform-scripts) do not get `dmx` or `ctx`. They see:

| Global | Description |
|------|-------------|
| `value` | The normalized 0–1 input value. |
| `payload` | The raw payload string the value was parsed from. |

The value of the script's last expression is the result, clamped to 0–1. Non-numeric results and errors skip the update.
