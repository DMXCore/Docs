---
title: Effects
description: Apply dynamic lighting effects to fixtures and zones
---

The effects engine applies dynamic, animated looks to your fixtures - breathing, fire, chases, and strobes - without recording cues. Effects run continuously until stopped, and can step on a [metronome beat or on hits in DMX Core playback or a USB sound card input](/dmx-core-100/lighting/tempo). Some generators and settings follow the music itself: how exciting it is, its frequency bands, its kicks and its section changes (see [Effects that follow the music](#effects-that-follow-the-music)).

Effects are managed under **Lighting > Effects** in the Web UI, and applied from **Fixture Control** (per zone or globally) or via [presets](/dmx-core-100/playback/presets).

![Effects list showing each generator](/assets/web/effects-list.png)

## Built-in Effect Generators

| Generator | Description |
|-----------|-------------|
| Breathing | Smooth fade up and down, like a breathing rhythm |
| Chaser | Sequences fixtures through a configurable list of colors |
| Crackling | Random flickering similar to crackling embers |
| Fire | Simulates a flickering fire |
| Flickering | Random brightness variations (candle-like) |
| Lightning | Dramatic random flashes |
| Onset Flash | A flash on each hit in the music, on all fixtures, one random fixture, or running along the fixtures, each flash in the next color of its list |
| Pulse | Sharp on/off pulsing |
| Rainbow | Cycles fixtures through the color spectrum |
| Ramp Up/Down | Repeated rising or falling intensity ramps |
| Sinus | Smooth sinusoidal wave |
| Sound Reactive | Brightness follows one frequency band of the music, like a VU meter |
| Spectrum | A graphic EQ across your fixtures: each fixture follows one of six frequency bands, bass at one end and treble at the other |
| Strobe | Classic strobe flashing |
| TV Simulation | Mimics the shifting glow of a television |
| Twinkle | Random sparkles on single fixtures, more of them when a chosen frequency band is busy, brighter when the music is more exciting |
| Wash | All fixtures in one color that moves to the next color of its list when the music changes section, or on a timer |
| Welding | Harsh, irregular bursts like arc welding |

Each generator has its own parameters - speed, length, attack/decay, smoothing, secondary intensity, colors - and a **Preview** so you can tune it in the editor. **Test** runs the effect live, and **Apply Globally** puts it on all fixtures immediately.

![Effect editor - generator, parameters, and preview](/assets/web/effect-editor.png)

**Colors from a palette.** Chaser, Onset Flash and Wash have a **Palette** select above their color list. Pick a [color palette](/dmx-core-100/lighting/color-palettes) and the effect uses its colors (the preview shows them, and the palette's **Edit palette** link opens it); editing the palette later recolors the running effect. The effect's own color list is hidden while a palette is chosen, and is used again if the palette is cleared or deleted.

Effects that set only brightness (Breathing, Pulse, Sinus, Sound Reactive, Spectrum, Strobe, Twinkle and the like) keep the fixture's own color, so set the color with a preset or in Fixture Control. A fixture at zero intensity stays dark under them.

## Sync Modes

An effect's **Mode** controls its clock:

- **Single / Double - Internal** - free-running on the effect's own speed
- **Metronome - Downbeat / All Beats** - steps fire on the beat from the [Tempo](/dmx-core-100/lighting/tempo) page
- **Audio Trigger** - steps, flashes, or pulses on hits detected in DMX Core playback or a live USB sound card input. **Audio Trigger Onsets** and **Min Trigger Interval** (below) choose which hits count
- **External Trigger** - steps, flashes, or pulses each time a **Step Effect** action fires - bind it to a [control surface](/dmx-core-100/control-surfaces) button (MIDI pad, Stream Deck key), an [input trigger](/dmx-core-100/scheduling-automation/input-triggers) (OSC, HTTP, DMX threshold, contact closure), a [custom menu](/dmx-core-100/scheduling-automation/custom-menus) button, or a [script](/dmx-core-100/scheduling-automation/scripting), and tap through a chaser's colors by hand. The action can target one effect or all effects listening for external triggers.
- **Step on Section Change** (Chaser) - the chaser holds its colors and moves one color each time the music changes section (a new part of the song, a drop or a breakdown), so an existing chase changes color when the music does

## Effects that follow the music

These generators and settings listen to the [audio source](/dmx-core-100/lighting/music-mode#audio-source-and-calibration) set on the Music Mode page (DMX Core playback or a USB sound card input) and use the [Music Signals](/dmx-core-100/lighting/tempo#music-signals): **activity** (how exciting the music is, 0 to 100%), its frequency bands, its kicks, and its section changes. Listening starts by itself while such an effect runs and stops when none does. With a microphone, set the **Silence Floor** first so the room itself never counts as music.

### Music settings

Every effect has a **Music** group of settings under its own parameters:

| Setting | What it does |
|---------|--------------|
| **Energy to Speed** | How much the music's activity changes the effect's speed. At 1 the effect runs at half speed when the music is quiet, at its normal speed in the middle, and at 1.5 times its speed at the peak, changing smoothly with the music. 0 (default) turns it off. Not on Sound Reactive, Spectrum and Onset Flash, which have no speed |
| **Energy to Amount** | The same for the effect's depth: pulses, strobes and chases get shallower when the music is calm and fuller when it peaks |
| **Background** | A brightness floor for effects that set brightness, as a share of the fixture's own brightness, so a look never goes fully dark between pulses, flashes or sparkles |
| **Audio Trigger Onsets** | **All Onsets** (default) steps on every hit the analysis detects. **Kick Only** steps only on kick drums (low hits), so hi-hats and snares no longer step a chaser or fire a strobe. On effects with an Audio Trigger mode and on Onset Flash |
| **Min Trigger Interval (s)** | The shortest time between two audio trigger steps. It is longer when the music is calm (1.5 times the setting) and shorter at the peak (half the setting), so busy material cannot run a chase ragged. 0 (default) turns it off |

### Spectrum

Spectrum puts the six frequency bands (bass, low mid, mid, high mid, treble, air) across your fixtures in their order, like a graphic EQ, and each fixture's brightness follows its band.

- **Shape** - **Forward** (bass on the first fixture), **Backward** (bass on the last), or **Center Out** (bass in the middle, treble at both ends)
- **Spread** - how far along the bands each next fixture is. The default (1/6) puts six fixtures on the six bands; with eight fixtures use 0.125. Fixtures past the end start again from the bass
- **Gain**, **Attack**, **Release** - as on Sound Reactive: level scaling, how fast a fixture rises, and how long it hangs after a hit
- **Amount** - the depth of the effect

On a dense mix the bands stay busy and most fixtures stay up; lower **Gain** for more contrast.

### Twinkle

Twinkle gives each fixture its own random sparkle. Sparkles start only while the chosen **Band** is above the **Gate**, and more often the busier the band is; **Density** sets how many (up to about three a second per fixture with the band fully open). Each sparkle starts brighter when the music is more exciting, and **Decay** sets how long it lasts. Add a **Background** to keep a glow under the sparkles. If a track gives too few sparkles, raise **Density** or lower the **Gate**.

### Onset Flash

Onset Flash flashes on each hit in the music and fades out. Each flash takes the next color from its color list.

- **Shape** - **All Fixtures**, **Random Fixture** (never the same one twice in a row), or **Run Left to Right** (the next fixture in order on each hit)
- **Decay** - how fast a flash fades
- Set **Audio Trigger Onsets** to **Kick Only** for flashes on the kick drum only

### Wash

Wash holds all fixtures in one color from its list and moves to the next color with a smooth transition.

- **Advance On** - **Section Change**, **Timer**, or **Section Change or Timer** (default: the timer takes over when the music has not changed for that long)
- **Timer (s)** - the time between changes on the timer, sped up or slowed down by **Energy to Speed**
- **Minimum Hold (s)** - a section change that comes sooner than this after the last change is ignored. Section detection can be wrong, and a look that flips twice in a few seconds reads as a glitch; for acoustic sets, which can change sections often, 15-20 seconds works better than the default 8
- **Transition (s)** - how long the blend into the next color takes
- **Spread** - 0 keeps every fixture on the same color; higher values offset each next fixture along the color list

A Wash on **Timer** does not need audio at all.

### Previewing music effects

The **Preview** in the editor plays a simulated song for every effect that listens to the music: a quiet intro without a kick, a build with a kick, a breakdown, and a loud peak, with a section change, breakdown and drop between them. The dashed line is the song's activity. For Spectrum, Twinkle, Onset Flash and Wash the preview also shows eight fixtures in their order as strips, so you can see the pattern across fixtures without audio or a rig.

### Tips

- A line-level feed from the mixer or DJ booth into a USB sound card is the most reliable source. With a microphone, measure the room first (**Measure Room** on the Tempo page).
- Spoken word can read as music with a kick: plosive sounds in speech count as kick drums now and then, and can even read as a drop. For a venue with speeches, keep music effects off while someone speaks.
- Fixture order is the order of your fixture codes. Name fixtures so they sort in their physical order for Spectrum, Onset Flash runs and Wash spread.

## Applying Effects

Open **Fixture Control** and select the fixture or zone to animate - the effect controls appear in the panel and start immediately. With multiple zones configured, each zone has independent effect controls.

### Effect Assignment via Presets

Effects can be saved as part of a [preset](/dmx-core-100/playback/presets): activating the preset starts the effect, stopping it stops the effect. This is the main way to trigger effects from the touchscreen, schedules, custom menus, and external control.

## Effect Dimmer

Each effect has a dimmer that scales its intensity, settable at the global, zone, or fixture level.

## Fade Duration

Effects support configurable fade durations controlling how quickly they start and stop - a default for all effects, or per effect.
