---
title: Timecode Chase
description: Lock a timeline to incoming Art-Net timecode so playback joins the site clock instead of starting at t=0
---

**Timecode chase** locks a timeline to incoming **Art-Net ArtTimeCode** so the playhead follows a site-wide clock instead of starting at the cursor. Play joins *wherever that clock is now* — three minutes into a show after a reboot, or at the same frame as every other controller on the network.

Typical setup: QLab, TimeCore, Timecode Expert, or another ArtTimeCode generator puts one clock on the LAN. Each DMX Core 100 runs its own zone timeline and chases that clock.

This is a **playhead chase**, not a per-cue timecode trigger. Cues, presets, and sounds on the timeline still fire by their timeline times; the clock only decides *where* the playhead is. A join that lands inside a cue or sound starts it part-way through (a soundtrack picks up mid-file); events that were already over before the join point are skipped.

:::tip[Web UI only]
Chase is configured in the timeline editor, under **Lighting > Timelines**. Playback still starts from anywhere — touchscreen, schedules, custom menus, control surfaces, and [input triggers](/dmx-core-100/scheduling-automation/input-triggers).
:::

See [Timelines](/dmx-core-100/playback/timelines) for the editor itself.

## What You Need

- An **Art-Net ArtTimeCode** source (`OpTimeCode` **0x9700**) on UDP port **6454** — the same port as Art-Net lighting.
- Packets sent to the **device's Ethernet address** (unicast) or the subnet broadcast. Sending to `127.0.0.1` on a PC will not reach a unit that is bound to its LAN adapter.
- A timeline whose **duration** covers the portion of the clock you want to chase.

The device listens for ArtTimeCode as soon as network lighting output is up. You do **not** need a dedicated Art-Net *input* or a special output mapping.

This release **receives** ArtTimeCode only. MIDI timecode (MTC) and LTC (audio timecode) are not supported. The device does not generate ArtTimeCode.

QLab can generate timecode, but not Art-Net ArtTimeCode by itself — use a converter, [Visual Productions TimeCore](https://www.visualproductions.nl/products/timecore), [Timecode Expert](https://timecodeexpert.com/), or another ArtTimeCode generator.

## The TC Readout

The timeline editor status bar has a **TC:** chip:

- **waiting…** — no live ArtTimeCode on this network (or it went silent).
- `HH:MM:SS:FF` plus fps and source IP — packets are arriving.

Confirm this chip before opening day. Chase settings do not have to be on for the readout to work.

## Enabling Chase

Open the timeline editor, expand **timeline settings** (chevron next to the name), and turn on **Timecode chase**. Chase is off by default. The knobs below appear when it is on.

![Timeline settings with Timecode chase enabled](/assets/web/timeline-timecode-chase.png)

| Setting | Meaning |
|---------|---------|
| **Stream** | Art-Net timecode stream **0–255**. Must match the generator (often **0**). |
| **t=0 timecode** | Incoming timecode that maps to the start of this timeline. Default is **1 hour** (`01:00:00:00` / `1h00m00s`). |
| **Dropout wait** | How long timecode can go silent *or freeze on the same frame* before this is treated as a dropout. Default **500 ms**, minimum **100 ms**. Separate from **On dropout** (what to do afterward). |
| **On dropout** | After the wait: **Pause**, **Keep playing**, or **Stop until Play**. |
| **On return** | When timecode comes back after a dropout: **Follow again** or **Wait for Play**. Hidden when dropout is **Stop until Play** (that mode always waits for Play). |
| **On start** | How the timeline first locks: **When TC appears** or **Join on Play**. |

Save the timeline after changing these. Suggested defaults when you first enable chase: Stream **0**, t=0 **1 hour**, Dropout wait **500 ms**, On dropout **Pause**, On return **Follow again**, On start **Join on Play**.

### t=0 and range

Timeline position is *incoming timecode minus t=0*. With t=0 at `01:00:00:00`, a packet of `01:00:08:00` is **8 seconds** into the timeline.

- **Before t=0** (pre-roll) is out of range: **When TC appears** does not start yet; **Play** starts at the beginning of the timeline and then catches the clock when it reaches t=0. In the last second before t=0 the timeline is loaded in advance so the start at t=0 is frame-accurate.
- **Past the timeline duration** is also out of range: no auto-join. If the timeline is already playing, it ends (or follows **On dropout**) as usual.

Frame rate follows the packet (24, 25, 29.97 drop-frame, or 30 fps). There is no separate fps setting.

## How Play Joins

When chase is on and live timecode is **in range** (matching **Stream**):

- **Play** — from the Web UI, touchscreen, a schedule, a custom menu, OSC, the API, or a script — **joins the live clock**. It does not start at the editor cursor.
- **Jump / scrub Play** in the editor does the same: disable chase if you need to preview from the cursor.
- **Loop** is treated as **1** while chasing. A non-looping site clock should not wrap a looping timeline.

A mid-show join takes about **one second**: the timeline is loaded one second ahead of the clock and started the moment the clock gets there, so the playhead lands within a few milliseconds of timecode instead of a load time behind it. Expect that short delay after pressing Play.

To preview or run the timeline on its own clock, turn **Timecode chase** off.

## While Locked

- **Locates and restarts on the generator are followed.** If the clock jumps forward by more than a second, or backwards at all (a stop and restart at the top, for example), the timeline re-seeks to the new position. Small drift is not corrected: once locked, the timeline runs on its own clock until the next dropout, jump, or Play.
- **A rewind to before t=0 stops the timeline.** The clock says the show has not started; the timeline re-arms for t=0 and starts again when the clock gets there (**When TC appears**) or waits for Play.
- **Stop and Pause are yours.** Stopping or pausing a chased timeline (from the Web UI, touchscreen, or any trigger) sticks: it does not restart by itself while the same pass of the clock is running, even with **When TC appears**. Play rejoins the live clock; **Resume** on a paused timeline also rejoins live timecode rather than continuing from where it was paused.
- **A new show clears that.** When the clock rewinds or leaves the timeline's range, a stopped or paused timeline is ready to auto-join again (**When TC appears**), or waits for Play (**Join on Play**).

## On Start

| Choice | Behavior |
|--------|----------|
| **Join on Play** (default) | The timeline stays idle until Play (or another trigger). Then it joins live timecode if it is in range. |
| **When TC appears** | As soon as valid timecode is in range, the timeline starts by itself — including after a device restart, as long as the clock is still in range. |

Use **When TC appears** when the site clock is the master and you want every Core to catch the show without someone pressing Play. Use **Join on Play** when an operator or schedule should still *choose* to join.

## On Dropout and On Return

A dropout is either **silence** (packets stop) or a **hold** (the same frame repeats) for longer than **Dropout wait**. Both count.

| On dropout | What happens |
|------------|----------------|
| **Pause** | Hold the last look. The playhead freezes. |
| **Keep playing** | Keep running on this timeline's own clock (freerun). |
| **Stop until Play** | Stop the timeline. The next Play joins live timecode again; timecode returning on its own is ignored for the rest of this pass. **On return** is not used. When the clock rewinds for the next show, **When TC appears** starts the timeline again without a Play. |

When timecode comes back (Pause or Keep playing):

| On return | What happens |
|-----------|----------------|
| **Follow again** | Re-lock to live timecode immediately. A paused timeline seeks to the current clock; a freerunning one re-locks in place if it is still within half a second of the clock and seeks only if it has drifted further. |
| **Wait for Play** | Stay paused or freerunning. Play (or Resume, if the timeline is paused) joins the live clock when you are ready. With **When TC appears**, the next show (clock rewinds or leaves range) stops the paused timeline and starts it again at t=0 by itself. |

## Restart Mid-Show

Chase settings are stored with the timeline. After a reboot, chase-enabled timelines load again and the Art-Net listener re-attaches.

- **When TC appears** — if the clock is still in range, the timeline **auto-joins at the live position**, not t=0.
- **Join on Play** — wait for Play; that Play still joins live timecode, not the start.

## Holds

A [Hold milestone](/dmx-core-100/playback/hold-milestones) **leaves chase** while the timeline is holding. Incoming timecode is ignored until the hold is released, including generator restarts. After release, **On return** applies: **Follow again** re-locks to live TC if it is in range; **Wait for Play** (or **Stop until Play** as the dropout mode) stays uncoupled until Play.

## Troubleshooting

| Symptom | Check |
|---------|--------|
| TC chip stays on **waiting…** | Generator destination is the device IP (or broadcast) on UDP **6454**, not loopback. Device and generator are on the same subnet. Firewall is not blocking UDP 6454. |
| Play starts at 0 instead of joining | Chase is saved **on**. Stream matches the generator. Live TC is **in range** (at or after t=0, before duration). |
| One unit chases, another does not | Stream IDs match. Each unit's t=0 and duration cover the same clock window. |
| Timeline stops when TC freezes | That is **Pause** or **Stop until Play**. Use **Keep playing** if a frozen frame should not hold the look. |
| Auto-join never starts | **On start** is **Join on Play** (the default) — press Play. Or TC is still in pre-roll / past the end. Or the timeline was stopped or paused during this pass of the clock: press Play, or let the clock rewind for the next show. |
| Timeline starts about a second after Play | Expected: a mid-show join is loaded one second ahead so it lands on the clock. |
| Playhead is a few frames off after a restart | Check the generator's frame-rate flag matches its actual rate; the timeline follows the packet's rate. |
