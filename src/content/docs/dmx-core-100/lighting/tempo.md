---
title: Tempo & Audio Sync
description: Step effects on a metronome beat that you tap or that follows the music, or on hits detected in DMX Core playback or a USB sound card input
---

Effects don't have to run on their own internal clock. They can fire on a musical beat, or step when hits are detected in DMX Core's own playback or a live input from a USB sound card. The **Tempo** page (under **Operation** in the Web UI) is the control center for both.

![Tempo page - the metronome with its Manual / Follow Music switch, and the audio trigger](/assets/web/tempo.png)

## Metronome

The metronome is the beat clock for effects. [Effects](/dmx-core-100/lighting/effects) with their sync mode set to **Metronome - Downbeat** fire once per bar, and **Metronome - All Beats** fire on every beat. The beat indicator cycles through beats 1-4 so you can confirm the phase.

Choose where the beat comes from at the top of the card:

- **Manual** - you set the tempo
- **Follow Music** - the beat comes from the music DMX Core is listening to

### Manual

Type a **BPM** directly or hit **TAP** in time with the music. Tap Tempo is also available as an action on [control surfaces](/dmx-core-100/control-surfaces), [custom menus](/dmx-core-100/scheduling-automation/custom-menus), and [input triggers](/dmx-core-100/scheduling-automation/input-triggers), so the operator can retap from wherever they're working.

### Follow Music

In **Follow Music** a beat tracker listens to the [audio source](/dmx-core-100/lighting/music-mode#audio-source-and-calibration) set on the **Music Mode** page, predicts where the next beats fall, and drives the metronome from them. Effects then step on the beat of the music without anyone tapping, and they keep stepping evenly through busy passages and short breaks. Listening runs for as long as Follow Music is on.

Instead of a BPM, the card shows how the metronome is following:

- **Searching** - listening for a steady beat. The metronome keeps running at its previous tempo meanwhile. Expect a few seconds after the music starts.
- **Locked** - the metronome is on the beat of the music.
- **Holding** - the beat was lost (a breakdown without drums, a pause between songs). The metronome keeps the last tempo and phase until it locks again.

Good to know:

- The beat tracker needs to hear the music clearly. A line-level feed from the mixer or DJ booth into a USB sound card works best. With a microphone, set the **Silence Floor** first (see [Music Signals](#music-signals)): below it, nothing drives the beat, so an empty room never sets a tempo.
- On some songs the tracker can lock half a beat off, or at double or half speed, typically club tracks with strong off-beat hi-hats or bass. A chase or a wash looks the same either way; a flash that should land exactly on the beat is where it shows.
- The Manual BPM is kept: switching back to **Manual** returns to it. **TAP** has no effect while following.
- The setting is saved and restored when DMX Core restarts.

### Output Latency

The **Output Latency** slider fires beats early to compensate for DMX and fixture response lag. If the lights feel like they're behind the music, increase it. In **Follow Music** DMX Core already places each step on the DMX frame that goes out on the beat, so the slider only needs to cover the fixtures' own response time.

## Audio Trigger

Effects with the **Audio Trigger** sync mode step, flash, or pulse on hits detected in audio - independent of the metronome. Listening starts automatically while such an effect is active, while the Tempo or Music Mode page is open, while the metronome follows the music, and while Music Mode is on.

The audio source, input level and gain, band meters, sensitivity and the Input Check are on the **Audio Source and Calibration** card, which moved to the **Music Mode** page; the Tempo page links to it. See [Audio Source and Calibration](/dmx-core-100/lighting/music-mode#audio-source-and-calibration).

The **Sound Reactive** effect generator steps on those detected hits, for example advancing a chaser. See [Effects](/dmx-core-100/lighting/effects).

## Music Signals

The **Music Signals** card shows what DMX Core hears in the music, from the [audio source](/dmx-core-100/lighting/music-mode#audio-source-and-calibration) set on the Music Mode page:

- **Activity** - how exciting the music is right now (loudness and how busy the hits are), scaled so a quiet and a loud master use the same range
- **Energy** - activity in five steps, from Quiet to Peak
- **State** - Silence, music without a kick (**No kick**), or a running **Kick**. The light next to it flashes on a new section, a drop, or a breakdown.
- **Beat** - **Locked** when the beat tracker trusts its beat, **Searching** otherwise, with a meter for how well the predicted beats land on the music
- **Bar** - **Downbeat found** when the tracker also hears where each bar starts (it assumes four beats to a bar), **Beats only** when it doesn't. The tempo next to it is the tracker's estimate, not an exact measurement of the song.

To make presets, cues and other actions follow these signals (a strobe only at Peak, lasers while the kick plays, a fog burst on a drop), use a [Music trigger](/dmx-core-100/scheduling-automation/input-triggers#music-triggers). To make effects follow them (faster and fuller at the peak, a Wash that changes color with the song, a graphic EQ across your fixtures, flashes on the kick only), see [Effects that follow the music](/dmx-core-100/lighting/effects#effects-that-follow-the-music).

### Calibration

- **Activity Gain** - if the meter rarely leaves the low steps on a busy track, raise it; if it sits at Peak all the time, lower it.
- **Level** and **Silence Floor** - below the silence floor (the line on the level meter) the input reads as Silence however busy it sounds, so an empty room never drives the lights or the beat. The default suits a line feed from a mixer.
- **Measure Room** - with a microphone, turn the music off and press **Measure Room**: it listens for 5 seconds and sets the floor just above the room. Music then needs to be clearly louder than the room to count.
