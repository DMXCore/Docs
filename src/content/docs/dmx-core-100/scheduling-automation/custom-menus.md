---
title: Custom Menus
description: Build custom touchscreen menus for end-user operation
---

Custom menus let you create simplified, purpose-built menu screens for the touchscreen. Instead of exposing the full menu system, you can present end users with just the controls they need — buttons to trigger specific cues, presets, or other actions.

Custom menus are designed and configured in the **Web UI**, and displayed on the **touchscreen** for end-user operation. They are especially useful in lock-down mode, where the custom menu is the only interface available to non-admin users.

## Managing Custom Menus

In the **Web UI**, go to **Settings > Custom Menu** (under Settings) to configure the menu structure, or **Operation > Custom Menu** to preview the menu.

<!-- SCREENSHOT: Web UI custom menu editor (dark mode) -->

## Menu Items

Each menu item can be one of the following types:

| Type | Description |
|------|-------------|
| **Cue** | Play a specific cue |
| **Preset** | Activate a preset |
| **Sound** | Play a sound file |
| **Timeline** | Start a timeline |
| **Schedule Toggle** | Toggle a schedule on or off |
| **Stop Playback** | Stop the currently playing item |
| **Stop Output** | Stop all DMX output |
| **Master Dimmer** | Control the overall brightness level |
| **Player Control** | Display playback controls for the current item |
| **Submenu** | Navigate to a nested menu level |

## Menu Structure

Menus support **multiple levels** (nested submenus), allowing you to organize controls hierarchically. For example, a top-level menu might have buttons for different rooms, each opening a submenu with scene options for that room.

## Menu Item Options

Each menu item can be configured with:

- **Name** — Display text on the button
- **Icon** — Optional icon (supports small icons, useful for compact layouts)
- **Fade In / Fade Out** — Override fade settings for the triggered item
- **Loop Count** — Override loop settings
- **Confirm** — Require a confirmation tap before executing the action

## Visual Customization

- **Background color** — Set a custom background color for the menu
- **Background image** — Upload a custom background image (see [Menu Background](/dmx-core-100/customizations/menu-background))
- **Header logo** — Display a custom logo at the top of the menu
- **Glow state indicator** — Active items glow to show their current state

## Favorites

Items marked as [favorites](/dmx-core-100/scheduling-automation/favorites) can appear on the dashboard alongside the custom menu for quick access.
