---
title: Custom Menus
description: Build simplified control panels for end users - on the touchscreen and in the browser
---

Custom menus are simplified, purpose-built control panels. Instead of exposing the full system, you present end users with just the controls they need - buttons for specific scenes, a volume slider, a source picker. Menus appear on the **touchscreen**, in the **Web UI** (under **Operation > Custom Menu**), and - when enabled - to **guests in the browser without logging in**.

You can create **multiple menus**, each with its own items, look, and audience. They are especially useful in lock-down mode, where a custom menu is the only interface available on the device.

## Managing Menus

Menus are designed under **Control & Integrations > Custom Menus** in the Web UI. Each menu has:

- **Code** - a short unique code (auto-generated, e.g. `MENU1`, but freely changeable) used for [direct links](#direct-links-and-qr-codes)
- **Enabled** - turn the whole menu on or off
- **Only Admin** - restrict the menu to admin users
- **Available to Guests** - expose the menu in the Web UI *without login*, so anyone on the network (or a wall tablet) can use it
- **Type** - **Items** (buttons, the default), **Items (small view)** for compact lists, or **Faders** (columns of sliders)
- **Look** - icon, header logo with height, and background

Menus can be exported and imported as JSON - see the [custom menu samples on GitHub](https://github.com/DMXCore/DmxCore100/tree/main/samples) for ready-made layouts.

On the **touchscreen**, open a menu from **Main Menu > Utilities > Custom Menu**. If **Only show custom menu** is on (**Device > System**), non-admin users start on the custom menu; admins are exempt.

![Custom Menus list in the Web UI](/assets/web/custom-menus-list.png)

![Custom menu editor - item list and item properties](/assets/web/custom-menu-editor.png)

![Operating a custom menu in the Web UI - actions, volume slider, and source picker](/assets/web/custom-menu-operate.png)

![Custom menu on the touchscreen](/assets/device/uno-custom-menu.png)

## Menu Items

Click **Add item** in the editor. Each item has a name, optional subtitle/description, icon, background color, and one of these types:

| Type | Description |
|------|-------------|
| **Action** | A button that triggers an action (see below) |
| **SubMenu** | Opens a nested menu level |
| **Slider** | A fader. The **Slider target** panel sets the target: a fixture's brightness, a zone dimmer, the master dimmer, the audio volume or a DSP level (**Control Value (Level)** and the Control Value from the dropdown). The code field suggests your fixtures and zones. On the touchscreen the item shows its level, and a tap opens a large fader (**Enter value** switches to a keypad for an exact number) |
| **Faders page** | Opens a page of faders, one per entry, for a set of lights and levels you pick (see [Faders Page](#faders-page)) |
| **Segmented selector** | A source/input picker bound to a Selector Control Value |
| **Value display** | A read-only live readout of a Control Value of any kind (see below) |
| **Presets / Cues list** | A browsable list of presets or cues (touchscreen only) |
| **Scene Panel** | Opens the [Scenes](/dmx-core-100/lighting/scene-panel) page: scene tiles with a color wheel and dimmer (Web UI only; the touchscreen leaves this item out) |
| **OSC direct message** | Send a raw OSC message when tapped |

### Value Display

A **Value display** item shows a [Control Value](/dmx-core-100/integrations/control-values) without offering to change it: a scoreboard's `HOME 14 / AWAY 7` next to the keys that step the scores, or the bar volume beside an Up/Down pair. Pick the Control Value; the item prints a Level as a percent, a Counter as its number, a Selector as its choice and a Toggle as On/Off, and follows the value live wherever it is changed from. On the web the value sits big under the item's name; on the touchscreen the value is the card title with the name beneath it. The optional **Format** uses the same syntax as a Stream Deck key's [value format](/dmx-core-100/control-surfaces/configuring#live-values-on-a-stream-deck): `{0}` is the value, `{1}` the default text, so `{0} pts` reads "14 pts" and `Vol {0:P0}` reads "Vol 63%"; for a Toggle, `Yes|No` names the two states.

### Faders Page

A **Faders page** item gives end users a mixing-desk page for exactly the lights and levels you choose: the bar lights, the patio and the music volume, without the rest of the system. Add the item, click **Open**, and add one entry per fader. Each entry is a fader target, the same as a Slider item:

- **Fixture Intensity** (the default) - the fixture's brightness. The strip shows the fixture's live color as a chip; tapping the chip opens a color picker, and tapping the name opens the fixture's full controls
- **Control Value (Level)** - a DSP or internal level such as a music volume, with **MUTED** shown while it is muted
- **Master Dimmer**, **Zone Intensity** or **Audio Volume**

Each entry can have a **Name** (left blank, the fixture's or Control Value's own name is used) and a **Color** for its strip. The faders appear in the order of the list.

![A Faders page on the touchscreen](/assets/device/uno-faders-page.png)

On the **touchscreen** the page shows as many faders as fit, with arrow buttons for the rest. Drag a fader by its cap; tapping the track does nothing, so a brushed screen cannot jump a light to full. The rotary knob moves the selected fader (tap a fader to select it, press the knob for the next one, hold it to open the fixture's controls). **Release** hands the page's lights back to whatever presets and cues are doing; it only affects the fixtures on this page.

![A Faders page in the Web UI](/assets/web/custom-menu-faders.png)

In the **Web UI** and for [guests](#guest-access), the item opens the same faders in the browser, with the fixture's color and controls in a pop-up.

Raising the brightness of a color fixture that has no color set (for example after a release) starts it from white, on this page and everywhere else a brightness fader or knob is used, so the light does not stay dark.

### Actions

An Action item can: Apply Ambient Preset, Apply Preset, set/step a Control Value, Fade Out, Fire Output Event, Play Cue, Play Sound, Play Timeline, [Run Script](/dmx-core-100/scheduling-automation/scripting), [Step Effect](/dmx-core-100/lighting/effects#sync-modes), [Stop or Blackout](/dmx-core-100/basics/blackout-and-stop), Tap Tempo, **Audio Mute**, **DMX Output**, or Toggle Schedule.

Per-item options:

- **Press mode** - **Normal**, **Toggle on/off**, or **Flash (hold)** - active only while the button is held
- **Fade-in / fade-out time and loop count** - override the item's playback settings
- **Dimmer** - playback brightness for this button
- **Require confirmation** - ask before executing. Control surface buttons use [Hold to confirm](/dmx-core-100/control-surfaces/configuring#hold-to-confirm) instead of a dialog (the [Surface Operator](/dmx-core-100/control-surfaces/surface-operator) still asks Yes/No)
- **Live state** - highlight the item while a Control Value equals a given value (e.g. light up "Input B" while that source is selected), or automatically while its own action is active

## Menu Structure

Menus support **multiple levels** via SubMenu items - a top-level menu with a button per room, each opening that room's scene options. A **glow state indicator** shows items whose target is currently active.

## Faders Menus

A menu of type **Faders** is the wall-controller layout for a DSP such as [Q-SYS](/dmx-core-100/integrations/qsys) or [Symetrix](/dmx-core-100/integrations/symetrix): each SubMenu item is one column on the touchscreen. A column of Action items shows them as buttons, lit while their state is active. A column of Slider items shows one fader that all its sliders share: the button above the fader switches which one it drives, and a slider with a switch-back time returns the fader to it after that many seconds without a touch. The rotary knob drives the fader, and a knob press switches, or runs the menu's knob action (such as a mute) when one is set. Drag the fader by its cap; tapping the track does nothing. A slider can drive any fader target, not only a DSP level.

## Guest Access

A menu marked **Available to Guests** can be used from a browser without logging in - ideal for a lobby tablet or letting staff trigger scenes from their phones without handing out PINs. Guests see only guest-enabled menus; everything else still requires a login. A **Faders page** item on a guest menu gives guests full control of the fixtures on it - brightness, color and every function in a fixture's controls - and nothing else. A **Scene Panel** item on a guest menu opens the panel for guests only when **Scene Panel available to guests** is on in **System** settings (see [Scenes](/dmx-core-100/lighting/scene-panel#guest-access)).

## Direct Links and QR Codes

Every menu has a **code** that opens it directly by URL - perfect for a QR code posted at the site, a wall-tablet home page, or a browser bookmark:

```
http://<device>/guest/custommenu?code=LOBBY
http://<device>/op/custommenu?code=LOBBY
```

The `guest/` form works without login for menus marked **Available to Guests**; the `op/` form is for logged-in users. Codes are matched case-insensitively and stay stable even as you rename or reorganize the menu, so printed QR codes keep working. The menu editor shows ready-made direct links next to the preview link once a code is set.

## Favorites

[Favorites](/dmx-core-100/scheduling-automation/favorites) are a Web UI list (**Operation > Favorites**). They are not shown on the touchscreen home screen.
