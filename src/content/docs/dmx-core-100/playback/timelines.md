---
title: Timelines
description: Sequence cues, presets, sounds, levels, and scripts into timed shows
---

Timelines choreograph complete shows: cues, presets, effects, sounds, [Control Value](/dmx-core-100/integrations/control-values) moves, and [scripts](/dmx-core-100/scheduling-automation/scripting) arranged on a visual multi-track editor, all firing at exact times.

:::tip[Web UI only]
The timeline editor is a Web UI feature, under **Lighting > Timelines**. Timelines can be played back from anywhere - touchscreen, schedules, custom menus, control surfaces, and triggers.
:::

![Timelines list in the Web UI](/assets/web/timelines-list.png)

![Timelines on the touchscreen](/assets/device/uno-timelines.png)

![Timeline editor with named tracks](/assets/web/timeline-editor.png)

## Timeline Settings

Each timeline has a **code** and **name**, plus:

- **Duration** - the total length of the timeline
- **Loop** - how many times to repeat (0 = forever)
- **Dimmer** - overall brightness for the timeline's playback
- **Fade-In / Fade-Out** - smooth start and end for the whole timeline
- **[Timecode chase](/dmx-core-100/playback/timecode-chase)** - lock playback to incoming Art-Net timecode instead of starting at t=0, or make the timeline **Timecode only** so nothing but the clock can run it
- **Description**, **Favorite**, and **Only Admin** flags

## The Editor

Open a timeline and click **Editor**. Drag events from the **Available Events** panel - cues, presets, sounds, effects, control values, and scripts - onto the tracks, then drag to position and resize them.

- **Cue tracks** - cue events show an **intensity profile** you can shape, ramping the cue's dimmer over its duration (fade a show in over ten seconds, dip it in the middle, out at the end)
- **Sound tracks** - audio events render their **waveform** on the track, making it easy to line lighting hits up with the music. Each sound event has a **Loop** count (0 = forever), a **Layer** for same-layer replacement, like [cue playback layers](/dmx-core-100/playback/layers-and-priority#playback-layers), and an **Audio Routing** that picks which file channels play on which outputs of a multichannel sound card (empty uses the sound's own; see [Audio Routing](/dmx-core-100/playback/sounds#audio-routing))
- **Control Value tracks** - move levels (like a DSP volume) at exact points in the show
- **Other events** - script events run a [script](/dmx-core-100/scheduling-automation/scripting) at an exact timestamp, and **[Hold milestones](/dmx-core-100/playback/hold-milestones)** make the timeline wait for a trigger before continuing

A playhead with **seek/scrub** lets you preview any point; **zoom** and snapping make fine alignment easy.

## Tracks

Each lane in the editor is a **track**. A track has a name, a type (Cue, Sound, Preset or Control Value) and a place in the order, and it stays even when it is empty, so a show with a few lighting layers and a few audio layers can be laid out and labeled the way you think about it: "Main Area", "Forest", "Deck Lights".

- **Rename** - double-click the track name, or open the **...** menu on the lane and type a new name. The same name can be used on a cue track and a sound track
- **Reorder** - drag a lane header up or down, or use the arrows in the menu. Tracks of different types can be mixed in any order, so a cue track can sit right above the sound track it belongs with
- **Add** - **Add Track** in the status bar adds a track of a type at the bottom; **Above** / **Below** in a lane's menu adds one next to it. Dropping an event onto an empty area, or onto a lane of another type, also creates a track of the event's type
- **Delete** - the trash icon in the menu removes the track and the events on it (it asks first when the track is not empty)

Dropping an event onto a lane of its own type puts it on that track, and an event can be dragged between tracks of the same type. Events on one track may overlap: the lane grows to show them stacked and they play together, so a crossfade between two sounds can stay on the one "Music" track. The **Other Events** lane at the bottom collects output events, comments, scripts and [Hold milestones](/dmx-core-100/playback/hold-milestones); it has no name or order of its own.

Timelines from before tracks were named keep their layout: each lane became a track named as it was labeled, "Cues 1", "Sounds 2" and so on.

## Interactive Timelines

A timeline doesn't have to run start-to-finish on its own. Drop a **[Hold milestone](/dmx-core-100/playback/hold-milestones)** on it and playback waits at that point - looping sounds keep looping, the lights hold - until a button release, another trigger, or a timeout continues the show. That's how a timeline follows a tap handle, an operator's cue, or a payment confirmation.

## Timecode Chase

Turn on **[Timecode chase](/dmx-core-100/playback/timecode-chase)** to lock the playhead to incoming Art-Net ArtTimeCode. Play then joins *live* timecode (for example three minutes in after a reboot) instead of starting at the cursor. The editor status bar shows a **TC:** chip so you can confirm packets before the show. **Timecode only** goes further: Play, Jump, and Resume are refused unless they join live timecode, from every source.

## Playback Controls

During playback, the Web UI provides a progress bar with **pause/resume**, **seek/scrub**, and **stop** - on the timeline page and on the dashboard. A timeline waiting at a [Hold milestone](/dmx-core-100/playback/hold-milestones) shows a red **HOLDING** badge, and play acts as *continue*.

## Triggering Timelines

Timelines can be started from:

- **Web UI** - the play button in the timeline list
- **Touchscreen** - via [schedules](/dmx-core-100/scheduling-automation/schedules) or [custom menus](/dmx-core-100/scheduling-automation/custom-menus)
- **Control surfaces** - a Play Timeline button assignment
- **External control** - API, OSC, MQTT, or other [input triggers](/dmx-core-100/scheduling-automation/input-triggers)
- **Scripts** - `dmx.playTimeline(code)`

## Duplicating Timelines

Duplicate a timeline from its detail page to create variations of an existing sequence.
