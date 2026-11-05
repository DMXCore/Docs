---
title: Sounds
description: Manage and play audio files
---

The DMX Core 100 supports audio playback synchronized with your lighting. Sounds can be played alongside cues, used in timelines, or triggered independently via schedules and external control.

## Audio Requirements

On the hardware unit, audio playback requires a USB sound card or the optional onboard audio board connected via the piggy-back connector; the [desktop software](/dmx-core-100/desktop-software) uses the computer's own audio output. Select the audio device and sample rate under **Device > System**. The system supports **WAV**, **MP3**, **FLAC**, **OGG**, and **AIFF** audio file formats.

## Managing Sounds

:::tip[Web UI only]
Sound management is available in the Web UI under **Lighting > Sounds**. The touchscreen can trigger sound playback (via cues, schedules, or custom menus) but does not provide a dedicated sound management interface.
:::

![Sounds list in the Web UI](/assets/web/sounds-list.png)

### Uploading Sounds

1. In the Web UI, go to **Lighting > Sounds**
2. Click **Import** and pick a WAV, MP3, FLAC, OGG, or AIFF file
3. The sound is added to the list, named after the file, and ready to use

Audio can also be placed with **File Explorer** instead - a file uploaded there is available for import as a sound.

### Sound Settings

Each sound's detail page has:

- **Name** - Display name
- **Code** - Unique identifier for API and external control
- **Volume** - Playback volume level
- **In-point** and **Out-point** - Play only part of the file
- **Audio Routing** - Which channels of the file play on which outputs of the audio device (see [Multichannel Audio](#multichannel-audio))

**Loop**, **Fade In (seconds)**, and **Fade Out (seconds)** are not per-sound fields. They live on the Sounds list as **Default Settings** (**Lighting > Sounds**), the same pattern as [cues](/dmx-core-100/playback/cues#default-settings).

## Multichannel Audio

The DMX Core plays multichannel files (for example an 8-channel WAV or FLAC with one stem per channel) on a multichannel USB sound card, and each sound or timeline event can choose which file channel plays on which output.

### Sound Cards

Use a **USB Audio Class compliant** card: most current USB interfaces are, including MOTU's M series and UltraLite models, and they need no driver. Older interfaces that need their maker's driver do not work on the hardware unit. All of the card's outputs can be used, also past 8.

- **Hardware unit** - Plug the card in and select it under **Device > System > Audio Device**. Some cards appear twice in the list; pick the entry without **#1** (the other one is usually a separate headphone or stereo output).
- **Windows** - Windows sets a new card to stereo, and the DMX Core then sees only two outputs. Open **Sound settings > More sound settings**, select the card on the **Playback** tab, click **Configure** and choose **7.1 Surround** (or the largest layout offered).
- **macOS** - Check the card's output configuration in **Audio MIDI Setup**.

**Utilities > System** shows the selected card and its output count under **Audio System**: the device name followed by, for example, *8 outputs*. If it says 2 outputs for an 8-output card, the operating system has it set to stereo.

With no routing set, file channel 1 plays on output 1, channel 2 on output 2 and so on, so an 8-channel file on an 8-output card plays as it is.

### Audio Routing

The **Audio Routing** field on a sound's detail page, and on a sound event in the [timeline editor](/dmx-core-100/playback/timelines#the-editor), maps file channels to outputs:

| Routing | Plays |
|---------|-------|
| `1=3,2=5` | File channel 1 on output 3, file channel 2 on output 5 |
| `1=3+4` | File channel 1 on outputs 3 and 4 |
| `1+2=5` | File channels 1 and 2 mixed into output 5 |
| `1=3@-6` | File channel 1 on output 3, 6 dB quieter |
| `1=8,2=7,3=6,4=5,5=4,6=3,7=2,8=1` | An 8-channel file reversed |
| `1=5` | A mono file on output 5 only |

- File channels the routing leaves out are **not played**.
- Under the field, the editor spells the routing out (*File 1 → Outputs 3-4*, *Files 3-8 not played*) and warns about channels the file does not have or outputs the card does not have. A routing that cannot be read is refused with the entry that is wrong.
- A route to an output the card does not have is skipped, and the sound still plays on the outputs that exist, so a show built for a larger interface still plays on a smaller one.
- Mixing channels into one output adds them up; lower them with a gain (`1+2=5@-6`) if the result is too loud.
- **Pan** has no effect once a routing is set, so the timeline editor hides it.
- Leave the field empty to play the file as it is.

A timeline sound event's routing overrides the sound's. Leave it empty to use the sound's own routing, which the editor shows under the field. The same file can then play on different outputs in different timelines, or in two events of the same timeline.

Several sound events in one timeline can play at the same time, so separate files work too: route each mono or stereo file to its own outputs (`1=5`, `1=7,2=8`).

### Sounds on Shared Outputs

A sound played on its own (from the Web UI, a custom menu, a schedule, a trigger or the API) stops the other sounds that play on **any of the same outputs**, and leaves sounds on other outputs alone: a sound on outputs 3-4 replaces one on outputs 4-5 but not one on outputs 1-2. A sound with no routing uses every output, so it still replaces all other sounds, as before. The same sound can play on outputs 1-2 and 3-4 at once, and a toggle stops it when it plays on any of its outputs. Sound events in a timeline follow their **Layer** instead.

### Unplugging a Jack

On the hardware unit, plugging and unplugging the card's jacks does not interrupt playback. On Windows, many cards with jack sensing make the whole card disappear for about a second when a jack is unplugged; the DMX Core then pauses the playing sounds and picks them up where they were when the card is back. If the card stays away for more than 5 seconds, the sounds stop, and new sounds play as soon as the card returns. A dummy plug in unused jacks avoids the gap.

## Playback Controls

During sound playback, the Web UI dashboard shows:

- A **progress bar** with current position and total duration
- **Pause/Resume** controls
- **Scrub** - Drag the progress bar to jump to any position
- **Stop** button

## Aligning audio with lighting

There is no Audio Delay setting on a sound. To shift a cue's attached sound relative to the lighting, set that cue's **Sound Offset** (see [Attached Sound](/dmx-core-100/playback/cues#attached-sound)). To fire metronome-synced effects early to compensate for fixture lag, use **Output Latency** on the [Tempo](/dmx-core-100/lighting/tempo#output-latency) page (metronome only).

## Cloning Sounds

You can clone (duplicate) a sound in the Web UI to create a copy with different settings (e.g., different volume or loop count) while sharing the same audio file.
