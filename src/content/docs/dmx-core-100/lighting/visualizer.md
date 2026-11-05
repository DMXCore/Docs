---
title: Visualizer
description: 2D live visualizer - see your looks on photos of your venue
---

The Visualizer (Web UI: Operation > Visualizer) is a **2D live plot** of your lighting: place your fixtures on photos of your venue - or on a dark canvas with simple truss and stage shapes - and watch them light up with the color and brightness the rig is actually running. It is built for the moment you are *not* in the room: trigger a look from a laptop or over the [remote tunnel](/dmx-core-100/remote-management) and see that the bar went amber and the booths went magenta.

![Visualizer](/assets/web/visualizer.png)

It is intentionally a live picture, not a lighting-design tool - no 3D, no photometry, no beam simulation. If you need pre-visualization of that caliber, DMX Core plays nicely with the dedicated tools; see [External visualizers](#external-visualizers) below.

:::note
The Visualizer follows **Fixture Control, presets, and [effects](#effects)** - the fixture engine. Recorded **cue playback is not shown**: cues replay raw DMX below the fixture engine, so the plot sits idle while a cue runs. That is expected, not a fault.
:::

## Views

A **view** is one canvas: a photo of an angle of your venue, or a blank canvas you dress with scenery. Create as many as you need ("Bar", "Booths", "Stage") - the strip at the top switches between them. The same fixture can appear on any number of views: its look is shared everywhere, while position, aim, and size are set per view.

**With a photo:** upload a phone photo of the area, then drag fixtures from the tray onto the picture. A **Darken** slider dims the photo so the light overlays read clearly.

:::tip
Shoot the photo with the lights **off or dim**. A photo taken with the show running has the lighting baked into the image - the overlays still show what DMX Core is doing, but turning a fixture off will not un-paint the wall.
:::

**Without a photo:** the view is a dark canvas. Use **Add scenery** to sketch the space - straight/arc/tower truss, rectangles (stage, dance floor), text labels, and a person silhouette for scale - then hang fixtures on it.

## Edit and Live modes

The **Edit / Live** toggle switches what the same canvas does:

- **Edit** is for building: every placement renders with a bright white look so you can see and aim overlays regardless of what the rig is doing, fixture icons are shown, and all editing is enabled. Changes are **staged locally until you press Save** - Discard returns to the last saved state.
- **Live** is for operating: overlays follow the real fixture state, and clicking a light selects it and opens quick controls. **Fixture markers** (subtle icons that keep dark fixtures findable) can be toggled off for a clean picture of the room.

Editing requires the **Edit Visualizer** permission; everyone with page access gets the Live view.

## Placing fixtures

Drag a fixture from the tray onto the canvas. Each placement is an icon plus one overlay shape - pick the **Overlay** kind that matches how the light reads in the picture:

| Kind | Use for |
|------|---------|
| **Cone (spot)** | Ceiling spots and PARs - a beam with a pool where it lands. Drag the end handle to aim; length and spread are adjustable. |
| **Wash** | Light on a surface where the fixture itself is hidden - mural backlights, uplit walls. Place the wash where you *see* the light. |
| **Glow** | Omnidirectional sources - pendants, lanterns, globes. |
| **Strip** | LED tape and linear fixtures - a ribbon between two endpoints. |

- The same fixture can be placed **several times on one view**. One fixture instance is often many physical bulbs on a single DMX address (nine pendants over the bar) - drop it once per bulb; every placement follows the same live state. The tray shows a placement count, and clicking the tray row cycles through the placements.
- **Scale (depth)** shrinks or grows a placement's icon and overlay together - smaller means further back in the photo.
- **Multi-copy fixtures** list one tray row per copy. Place a copy, then use **Distribute copies…** to spread the remaining copies evenly along a line - or drag the **strip (all copies)** row to place the whole fixture as one ribbon, ideal for pixel tape.
- **Delete** (or the Remove button) removes the selected placements; placements on other views are untouched.

Only patched fixtures belong on the plot. Table lamps, signage, and other décor that DMX Core does not control stay in the photograph - an overlay that never changes would only mislead.

## Selecting several fixtures

Select several fixtures to set them together in Live mode, or to move and adjust them as a group in Edit mode:

| On the canvas | In the fixture list |
|---------------|---------------------|
| **Ctrl-click** (**Cmd-click** on a Mac) adds or removes a fixture | **Ctrl-click** (**Cmd-click**) adds or removes a row |
| **Shift-drag** on empty space draws a box; every fixture inside it is added | **Shift-click** adds every row between the last row you clicked and this one |
| **Ctrl+A** (**Cmd+A**) selects every fixture on the view | |

On a tablet or touchscreen, turn on **Select multiple** in the toolbar: a tap then adds or removes a fixture, and a drag on empty space draws the selection box (turn it off again to pan). **Esc** clears the selection, and a plain click on one fixture narrows it back to that one.

With several fixtures selected:

- **Live mode:** the intensity slider, color picker, **Effect** list and **Full Control…** set every selected fixture at once, the same way as [selecting several fixtures](/dmx-core-100/lighting/fixture-control#selecting-several-fixtures) on Fixture Control. When their levels differ, the slider shows the range (for example *20% to 80%*). **Release Control** releases all of them.
- **Edit mode:** drag any selected fixture to move the whole group. **Remove** (or **Delete**) removes them all, and the **Overlay**, size and **Scale (depth)** controls change all of them. Aiming handles, **Distribute copies…** and the copy trim need a single fixture.

## Live control

Selecting a fixture in Live mode gives you an intensity slider, a color picker and an **Effect** list right in the panel, and **Full Control…** opens the same per-function control dialog as [Fixture Control](/dmx-core-100/lighting/fixture-control). To set several fixtures at once, see [Selecting several fixtures](#selecting-several-fixtures).

For a placement of a multi-copy fixture, the panel also shows that copy's **trim** slider with a **Solo** button - "this one pendant is too bright" fixed without leaving the photo. These are the same persisted [Copy Trims](/dmx-core-100/lighting/fixture-control#copy-trims) as everywhere else: a trim is a calibration that scales the copy's intensity in all presets and faders.

## Effects

To start an effect from the Visualizer, select one or more fixtures in Live mode and pick it from the **Effect** list in the panel; **No Effect** stops it. With an effect running, **Effect Dimmer** sets how much of the effect is mixed in. Several fixtures selected together share one effect and run in sync, and the list is marked **Mixed** while they run different effects. This works like the [Effect card on Fixture Control](/dmx-core-100/lighting/fixture-control), including its warning when a fixture's intensity is at 0% (effects never raise a fixture's own intensity, so it stays dark).

In Live mode, [effects](/dmx-core-100/lighting/effects) show as they run: a Rainbow cycles its colors, a Breathing effect fades up and down, a music effect pulses with the song. This covers every way an effect starts: from Fixture Control, a preset, a zone or the whole rig, a fader, or a trigger.

- **Each copy shows its own look.** A multi-copy fixture under an effect gives every copy its own color and brightness, so a placement of one copy shows that copy. A **strip (all copies)** placement splits the ribbon into one slice per copy, the first copy at the end where the strip starts (the left end when you drop it), so a chaser or rainbow runs along it the way it runs along the real tape. If it runs the wrong way, drag the strip's start and end handles to swap them in Edit mode.
- **Strobes and flashes** too fast to show frame by frame (a strobe, lightning, an onset flash) are drawn as a flashing light rather than skipped.
- The picture updates about 20 times a second, so it shows how an effect looks and moves, not its exact timing. Master, zone and preset dimmers and copy trims are all included, as on the real output.
- The swatches in the fixture list keep showing the fixture's own color, not the effect.

## Good to know

- View photos and scenery are included in [backups](/dmx-core-100/configuration/backup-and-restore) - a restore brings the whole plot back.
- Pan with drag, zoom with the mouse wheel; **Fit** resets the camera. The camera position is remembered per view.
- Moving heads render with a static aim in this version - live pan/tilt is not animated.

## External visualizers

For true pre-visualization - photoreal 3D, beams, haze, moving-head simulation - use a dedicated visualizer such as **Capture**, **Depence**, **ChamSys MagicVis**, or **QLC+**. They all work the same way: they listen to DMX on the network, and DMX Core already outputs [sACN and Art-Net](/dmx-core-100/configuration/output-config).

1. Build (or import) your rig in the visualizer on a PC on the same network.
2. Patch it to the same universe numbers DMX Core outputs.
3. Point the visualizer at DMX Core's sACN or Art-Net stream.

The external visualizer then shows everything DMX Core plays - including recorded cues, since it decodes the actual DMX output. This is the industry-standard pairing (it is what lighting consoles recommend too), and it complements the built-in Visualizer rather than replacing it: one is a design-grade simulation, the other is a live picture of your venue on any browser.
