---
title: Hold Milestones
description: Pause a timeline at a marker until a trigger releases it — while looping sounds and cues keep playing
---

A **Hold** milestone makes a timeline wait. Playback stops advancing at the marker until the hold is *released* — by letting go of the button that started the timeline, by another input trigger, from the Web UI, or by a timeout. While the timeline waits, looping sounds and cues keep playing and the lighting output holds its last frame.

Holds turn a linear timeline into an interactive one: a sequence that pours while a handle is pulled, a show that waits for an operator's go, a step that only continues once a payment or sensor signal arrives.

:::tip[Web UI only]
Holds are placed in the timeline editor, under **Lighting > Timelines**. See [Timelines](/dmx-core-100/playback/timelines) for the editor basics.
:::

## Adding a Hold

Drag **Hold (wait for release)** from the **Other Events** tab of the **Available Events** panel onto the timeline. A hold is a point marker — it has a position but no duration, and it renders in the Other Events lane.

A timeline can contain **multiple holds**; each one waits in turn, and each can name its own release trigger.

## What Happens While Holding

- The timeline position **freezes** at the hold.
- Sound and cue events whose **Loop** setting is anything but 1 **keep playing** — an infinite loop keeps looping, a "3 passes" loop finishes its passes.
- Everything else pauses: one-shot sounds pause in place, and the DMX output **holds its last frame**.
- The editor's status bar shows a red **HOLDING** badge with the position frozen at the hold point, and the play button acts as *continue*.

Loop counts are respected during the hold: a finite loop can run out while the hold keeps waiting — the hold only ends when it is released.

## Hold Settings

Select the hold to edit its **Event Properties**:

| Field | Meaning |
|-------|---------|
| **Release Trigger** | Which [input trigger](/dmx-core-100/scheduling-automation/input-triggers) releases this hold. Leave it on **Playing trigger / manual** for the common case — the button that started the timeline, the Web UI, or the timeout. |
| **Timeout (s)** | Auto-release after this many seconds of holding. Empty = wait forever. A timeout is good insurance when the release signal could be missed. |
| **Release Fade** | Fade applied to the looping sounds/cues when the hold releases. **0** = no fade; the current loop pass finishes on its own instead. |
| **Finish Loop** | When on, the release waits until the looping sound/cue completes its current pass *before* the timeline continues — the loop always ends on its musical boundary. |

## Releasing a Hold

There are four ways past a hold:

1. **Let go of the button.** When the trigger or control surface pad that plays the timeline uses **Momentary** press mode, pressing it starts the timeline and *releasing* it continues past the hold. See [Momentary press mode](#momentary-press-mode).
2. **A named release trigger.** Set the hold's **Release Trigger** to any input trigger — an OSC message, an HTTP request, a contact closure, a [Control Value](/dmx-core-100/integrations/control-values) change. Each hold can wait for a different signal.
3. **The Web UI.** Pressing play/resume on a holding timeline continues it — the operator always has a manual override.
4. **The timeout**, if one is set.

**Early releases are remembered.** If the release arrives *before* the timeline reaches the hold — the handle was let go during the intro, the payment confirmed during the pour — the hold is passed through without waiting, and any looping events still get their configured release treatment. A remembered release never carries across a restart or into the next loop of the timeline.

**Re-press also continues.** With a Normal-mode trigger, pressing the playing button again while the timeline is holding continues past the hold (instead of restarting). Once the timeline is done, a new press starts it from the top again.

**Named holds are selective.** A hold with a **Release Trigger** only reacts to that trigger, the Web UI, or its timeout — letting go of the playing button can't skip it. That's what makes a "wait for payment" step safe even when the customer releases the tap handle early.

## Momentary Press Mode

**Momentary** is a press mode for *Play Timeline* actions, available on [input triggers](/dmx-core-100/scheduling-automation/input-triggers#press-modes) and [control surface](/dmx-core-100/control-surfaces/configuring) button assignments:

- **Press** — plays the timeline.
- **Release** — continues past the current Hold milestone.

It is the momentary-switch behavior for timelines. Unlike **Flash (hold)** on presets — where releasing turns the preset *off* — releasing a Momentary timeline button doesn't stop anything; it lets the show continue.

In the [Surface Operator](/dmx-core-100/control-surfaces/surface-operator) view, pads send both press and release, so a Momentary pad in the browser behaves exactly like a physical button: hold the pad down and the timeline holds with it.

## Looping Sounds & Layers

Two timeline event settings do the heavy lifting around holds:

- **Loop** — on sound and cue events: **0 = loop forever**, 1 = play once, N = that many passes. A looping event placed before a hold is what keeps playing while the timeline waits.
- **Layer** — timeline sound events have a **Layer** field, like [cue playback layers](/dmx-core-100/playback/layers-and-priority#playback-layers): when a sound starts, other sounds on the same layer stop with a short fade; different layers (or no layer) play together. The classic pattern: put a looping sound *and its follow-up* on the same layer — the follow-up cuts the loop at the exact moment it starts, no release fade needed.

## Worked Example: Self-Serve Beverage Tap

A tap handle plays a pour sequence: pulling the handle starts it, the pour loops for as long as the handle is held, and letting go finishes with a satisfying "ahh."

**The timeline** (duration 9 s):

| Time | Event | Settings |
|------|-------|----------|
| 0.0 s | Sound — can opening | Loop 1 |
| 1.5 s | Sound — pouring | **Loop 0** (forever), **Layer 1** |
| 4.5 s | **Hold** | Release Trigger: *Playing trigger / manual* |
| 4.7 s | Sound — "ahh" | Loop 1, **Layer 1** |

**The trigger:** an input trigger (or control surface pad) wired to the tap handle, action **Play Timeline**, press mode **Momentary**.

What happens: pulling the handle plays the can-open sound and the pour starts looping. At 4.5 s the timeline holds — the pour keeps looping for as long as the handle is held. Letting go releases the hold; the "ahh" starts 0.2 s later and, being on the same layer, cuts the pour instantly. A quick pull-and-release works too: the early release is remembered and the sequence plays straight through.

Add a second hold with a **Release Trigger** (say, a payment confirmation arriving as an [HTTP input trigger](/dmx-core-100/scheduling-automation/input-triggers#input-types)) after the "ahh," and the sequence waits for payment before playing its final step — no matter when the handle was released.
