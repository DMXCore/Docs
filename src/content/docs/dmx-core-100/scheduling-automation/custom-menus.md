---
title: Custom Menus
description: Build simplified control panels for end users — on the touchscreen and in the browser
---

Custom menus are simplified, purpose-built control panels. Instead of exposing the full system, you present end users with just the controls they need — buttons for specific scenes, a volume slider, a source picker. Menus appear on the **touchscreen**, in the **Web UI** (under **Operation > Custom Menu**), and — when enabled — to **guests in the browser without logging in**.

You can create **multiple menus**, each with its own items, look, and audience. They are especially useful in lock-down mode, where a custom menu is the only interface available on the device.

## Managing Menus

Menus are designed under **Device > Custom Menus** in the Web UI. Each menu has:

- **Enabled** — turn the whole menu on or off
- **Only Admin** — restrict the menu to admin users
- **Available to Guests** — expose the menu in the Web UI *without login*, so anyone on the network (or a wall tablet) can use it
- **Type** — **Items** (buttons, the default), **Items (small view)** for compact lists, or **Faders** (columns of sliders)
- **Look** — icon, header logo with height, and background

Menus can be exported and imported as JSON — see the [custom menu samples on GitHub](https://github.com/DMXCore/DmxCore100/tree/main/samples) for ready-made layouts.

<!-- SCREENSHOT: Custom menu editor with the item list and item property panel (dark mode) -->

## Menu Items

Each item has a name, optional subtitle/description, icon, background color, and one of these types:

| Type | Description |
|------|-------------|
| **Action** | A button that triggers an action (see below) |
| **SubMenu** | Opens a nested menu level |
| **Slider** | A fader bound to a volume, dimmer, or [Control Value](/dmx-core-100/integrations/control-values) |
| **Segmented selector** | A source/input picker bound to a Selector Control Value |
| **Presets / Cues list** | A browsable list of presets or cues (touchscreen only) |
| **Stop Output** | Stop all DMX output (touchscreen only) |
| **OSC direct message** | Send a raw OSC message when tapped |

### Actions

An Action item can: Apply Ambient Preset, Apply Preset, set/step a Control Value, Fade Out, Fire Output Event, Play Cue, Play Sound, Play Timeline, [Run Script](/dmx-core-100/scheduling-automation/scripting), Stop Playback, Tap Tempo, Toggle Mute, or Toggle Schedule.

Per-item options:

- **Press mode** — **Normal**, **Toggle on/off**, or **Flash (hold)** — active only while the button is held
- **Fade-in / fade-out time and loop count** — override the item's playback settings
- **Dimmer** — playback brightness for this button
- **Require confirmation** — ask before executing
- **Live state** — highlight the item while a Control Value equals a given value (e.g. light up "Input B" while that source is selected), or automatically while its own action is active

## Menu Structure

Menus support **multiple levels** via SubMenu items — a top-level menu with a button per room, each opening that room's scene options. A **glow state indicator** shows items whose target is currently active.

## Guest Access

A menu marked **Available to Guests** can be used from a browser without logging in — ideal for a lobby tablet or letting staff trigger scenes from their phones without handing out PINs. Guests see only guest-enabled menus; everything else still requires a login.

## Favorites

Items marked as [favorites](/dmx-core-100/scheduling-automation/favorites) can appear on the dashboard alongside the custom menu for quick access.
