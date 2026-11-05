---
title: Input Triggers
description: Trigger actions and drive levels from external signals
---

Input triggers make the DMX Core 100 react to the outside world - a DMX channel crossing a threshold, an OSC or MQTT message, an HTTP request, a contact closure. A trigger either **runs an action** (play a cue, apply a preset, run a script) or **drives a level** directly from the signal's value.

Configure them under **Control & Integrations > Input Triggers** in the Web UI, or **Main Menu > Settings > Input Triggers** on the touchscreen.

Custom OSC addresses are shown in [Control your lights from TouchOSC](https://youtu.be/4Eh02x-Pkzk?t=174).

![Input triggers list](/assets/web/input-triggers-list.png)

![Input trigger editor - HTTP path, action, and Play Cue target](/assets/web/input-trigger-editor.png)

## Input Types

| Type | Description |
|------|-------------|
| **Art-Net / sACN** | A DMX channel in an incoming network stream reaching a threshold |
| **DMX Serial** | A DMX channel on the optional DMX-512 or ADIO board's input |
| **OSC** | An OSC message on the configured address |
| **MQTT** | A message published to an MQTT topic (requires the [MQTT integration](/dmx-core-100/integrations/mqtt)) |
| **HTTP** | An HTTP request to a path you define (e.g. `/hooks/party-mode`) |
| **TCP / UDP** | Raw data arriving on a TCP or UDP port. Each has its own **Port** field. If a UDP port cannot be opened, the device reports a configuration issue: **UDP input trigger port N** |
| **Digital Input** | A contact closure on one of the [ADIO board](https://dmxprosales.com/products/dmx-core-100-audio-2xdmx-input-board-adio)'s four digital inputs (the 2-port DMX-512 board does not have them). The trigger fires when the input goes active and releases when it goes inactive, so a **Flash** preset, a **Momentary** timeline or a Control Value **Follow input** action follows the contact. **Threshold** is the polarity: 1 (default) is active-high, 0 inverts it so the trigger fires when the contact opens |
| **Control Value** | A [Control Value](/dmx-core-100/integrations/control-values) changing - a Q-SYS or Symetrix button, fader or selector, or any control that writes the value |
| **Plugin** | A signal from an installed plugin |
| **Music** | The music heard on the [Tempo page](/dmx-core-100/lighting/tempo#music-signals)'s audio source: a kick starting or stopping, an energy step, an activity range, silence, or a drop. See [Music Triggers](#music-triggers) |

## Control Value Triggers

A Control Value trigger makes a Control Value the *source*: a wall panel button wired to a Symetrix controller plays a cue, a Q-SYS UCI fader crossing a threshold starts a scene, an internal Control Value moved from a Stream Deck dial runs a scene. Pick the Control Value to watch; the remaining settings depend on its kind:

- **Toggle** - fires when the control turns on.
- **Level** - set a **Threshold %**; fires when the level rises to or above it, and re-arms when it drops below.
- **Counter** - set a **Threshold %** of the counter's range; fires when the count rises to or above it (50% of a 0–99 score is 50), and re-arms when it drops below.
- **Selector** - set a **Start Choice** (choice name or index); fires when that choice becomes active. With no **Stop Choice**, leaving Start Choice for any other choice is a stop (so an applied Flash preset releases). With an explicit **Stop Choice**, other choices keep the triggered state until that stop choice is selected.

Any change fires the trigger, whoever made it - a DSP button, a custom menu slider, a fader on the Faders page, a schedule, a script or another trigger. The only change that never fires a trigger is its own action writing the same Control Value back, so a trigger can safely set the value it watches. On startup or reconnect the first reported value arms the trigger without firing, so a control that is already on never replays its edge.

In **Value mode**, the Control Value's live 0–100% position drives the target level instead - turning any DSP fader into a live lighting fader.

## Music Triggers

A Music trigger runs its action when the music changes, using the [Music Signals](/dmx-core-100/lighting/tempo#music-signals) from the **Tempo** page's audio source (the audio being played, or a microphone or line input). It gives conditional looks without programming a show:

- Lasers on while the kick plays, off when it stops: **Music state**, **Kick**, **Entered**, with a **Flash** preset
- A strobe preset only at the loudest moments: **Energy band**, **Peak**, **Entered**, with a **Flash** preset
- A fog burst on a drop: **Event**, **Drop**, **Hold for** a few seconds, with a **Flash** preset or output event
- Dim to the ambient look when the music stops: **Music state**, **Silence**, **Entered**, **Sustained for** 10 seconds, with **Apply Ambient Preset**

Pick a **Condition**:

| Condition | Fires on |
|-----------|----------|
| **Music state** | **Silence**, **No kick** (music without a kick) or **Kick** (a running kick) |
| **Energy band** | One of the five energy steps, **Quiet** to **Peak** |
| **Activity range** | Activity (0-100%) inside a range you set. It leaves the range only 5% beyond either end, so a level hovering at the edge does not flicker the trigger |
| **Event** | **Section change**, **Drop** (a kick coming in after a calmer part), **Breakdown** (the kick dropping out), **Silence start** or **Silence end** |

For a state, band or range, **Fires when** is **Entered** or **Left**. The trigger stays on while the condition lasts and releases the moment it ends, so a **Flash** preset is on exactly as long as the kick plays (with **Left**, exactly as long as it doesn't). **Sustained for** makes the condition hold that many seconds before the trigger fires, so a brief flip does not.

For an event, **Hold for** keeps the trigger on that many seconds after the event, for actions held while pressed (a Flash preset, a Momentary timeline, a Follow output); another of the same event during the hold extends it. With 0 it is a short press and release. A drop or breakdown fires only its own triggers, not Section change ones.

The editor shows the music live while it is open: the activity meter with your range in green, the energy and state steps with the one the trigger watches outlined, the last event, and whether the condition is met right now. Play music and set the range where the music sits. The music is analyzed while the editor is open and while any Music trigger is enabled, with nothing else needed.

When a trigger starts, or after any trigger is saved, the first reading only sets where the music is: a trigger saved while the kick is already playing waits for the kick to stop or start again. Saving a trigger that is holding its action (a Flash preset on during a kick) keeps it on if the trigger did not change, and releases it if the trigger was disabled, deleted or changed. Music triggers are set up in the Web UI; the touchscreen shows the condition but does not edit it.

## Two Modes

- **On/Off - run an action.** The trigger fires its action when the signal arrives (or crosses the threshold).
- **Value - set a level from the payload.** The numeric payload drives a target level continuously. Configure **JSON Path** (when the payload is JSON), **Input Min** (default 0), **Input Max** (default 1), and the **Value Target** section: **Target**, **Min value**, **Max value**, and **Inverted**. Targets include a [Control Value](/dmx-core-100/integrations/control-values) (e.g. a Symetrix volume), the master dimmer, a zone intensity, audio volume, and a preset, cue or sound as a [playback fader](/dmx-core-100/scheduling-automation/custom-menus#preset-cue-and-sound-faders). An OSC value trigger needs **exactly one** argument. A wall fader sending OSC or DMX becomes a live level control.

Value-mode triggers can name a **[Transform Script](/dmx-core-100/scheduling-automation/scripting#transform-scripts)** that reshapes the normalized 0–1 value before it lands - response curves, dead zones, thresholds.

## Actions

An On/Off trigger can: Apply Ambient Preset, Apply Preset, set/step a [Control Value](/dmx-core-100/integrations/control-values), Fade Out, Fire Output Event, Play Cue, Play Sound, Play Timeline, [Run Script](/dmx-core-100/scheduling-automation/scripting), [Step Effect](/dmx-core-100/lighting/effects#sync-modes), **Stop**, **Blackout**, Tap Tempo, **Audio Mute**, **DMX Output**, or Toggle Schedule.

For complex logic - conditions, sequencing, payload parsing - use **Run Script**: the raw payload arrives in the script as `ctx.payload`.

## Press Modes

Actions that respond to a button-like signal have a **Press Mode**:

| Mode | Behavior |
|------|----------|
| **Normal** | Fires the action on each press |
| **Toggle on/off** | First press starts, second press stops |
| **Flash (hold)** | Active only while held - a preset applies on press and releases on release; a cue or sound plays on press and stops on release, with the action's fade-out |
| **Momentary (release continues past Hold)** | For **Play Timeline** actions: press plays the timeline, release continues it past a [Hold milestone](/dmx-core-100/playback/hold-milestones) |

**Momentary** is the timeline counterpart to Flash - but where releasing a Flash button turns its preset *off*, releasing a Momentary button lets the timeline *continue*. It's how a tap handle, doorbell, or held button drives an interactive show: pull to start, hold to keep it going, let go to move on.

With a **Normal**-mode Play Timeline action, pressing again while the timeline waits at a Hold also continues it - press to start, press again to continue.

## Trigger Settings

- **Code** - unique identifier (checked for duplicates)
- **Name** - display name
- **Enabled** - turn the trigger on or off without deleting it
- **Address** - OSC address, HTTP path, or MQTT topic. UDP/TCP use a separate **Port** field. Art-Net / sACN / DMX Serial use **Universe Id/Sub Port** and **Channel** - Address does not cover those
- **Start Payload** / **Stop Payload** - for TCP, UDP, OSC, and MQTT (not HTTP; HTTP matches the path only). Put the text in **double quotes** to treat it as text; otherwise it is read as hex bytes (if that parse fails, the whole string is treated as text). For UDP/TCP the packet only has to *start with* the payload (it may have extra bytes after it)

### MQTT triggers

MQTT topics must match **exactly** (case-insensitive). `+` and `#` wildcards never fire. Start/Stop payloads must match exactly, **including case**. With no payload configured, boolean-like payloads (`true`/`false`, `on`/`off`, `1`/`0`, `yes`/`no`) act as on/off and any other payload fires the start action.

MIDI notes are **not** Input Triggers. Bind MIDI on a [control surface](/dmx-core-100/control-surfaces/supported-devices#midi-keypad).

## Recording Triggers

Starting a [recording](/dmx-core-100/playback/recording) from an external signal is configured on the Record page itself, as part of the recorder configuration.
