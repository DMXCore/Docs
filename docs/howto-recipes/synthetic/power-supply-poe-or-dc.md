---
status: candidate
source: synthetic
invented: true
level: newbie
surface: none
date: 2026-09-15
title: Powering the unit - PoE or a DC adapter, and is there a power switch
slug: power-supply-poe-or-dc
anonymized: true
docs_slugs:
  - dmx-core-100/getting-started/installation
  - dmx-core-100/main/specifications
  - dmx-core-100/configuration/utilities
verified: docs be6f663, core v2026.914.3
---

# Powering the unit - PoE or a DC adapter, and is there a power switch

## Original ask

> do i need to buy a power brick for this or does it run off the network cable? i have an old 12v 1A adapter from a router lying around, will that work? also where is the on/off switch

## Goal

The user understands the two documented power options and the documented limits.
They also learn what the docs do not say: connector type and polarity, PoE class,
and a power switch.

## Expected answer

- The unit can be powered either by **Power over Ethernet** on its network port or by
  an **8–28 VDC** supply on its power connector. Use the DC supply only if not using
  PoE. No supply is included.
- The specifications give **max 0.5 A at 12 VDC** and **max 8 W**. A 12 V adapter rated
  1 A is within the documented voltage range and current. The docs do not give the
  connector type, plug size or polarity, so a correct reply says to check the
  adapter's plug fits the power connector, without asserting it does.
- Power-up check: connect the network cable (and the DC supply if not on PoE), then
  look for the LED on the back. It takes about a minute before the screen comes up.
- Heat: the PoE module and processor produce about 6–7 W of heat. In a plastic box use
  open vents, or use a metal box or a low-voltage open frame.
- The docs do not describe a power switch or a shutdown procedure. **Restart** and
  **Reboot** exist in **Utilities** (Device Operations) for users with that permission.
- Must not claim: a specific barrel size or polarity, a PoE class/standard (e.g.
  802.3af/at), that a switch exists or where it is, or that the unit needs both PoE and
  DC at once.

## Gotchas

- "Router adapter" plugs vary; the docs give no connector spec to match against.
- The DC supply is optional. On a PoE switch/injector, no brick is needed.
- Mount after confirming power-up. A slipping screwdriver near the display can damage
  it, and that is not covered by the warranty.

## Eval checks

- States both options: PoE and `8–28 VDC`
- Mentions the documented max current `0.5 A at 12 VDC` (or max `8 W`)
- Says the supply is not included
- Says the docs do not specify the connector/polarity (or otherwise avoids asserting it)
- Says the docs do not describe an on/off switch; may point to Restart/Reboot under `Utilities` (Device Operations)
- Does not invent a PoE class, barrel size, polarity or a physical power button
- Does not tell them to use MCP or the Integration API

## Gaps

- `main/specifications.md` and `getting-started/installation.md` give no power
  connector type, plug size or polarity, and no PoE class/standard. Installers need
  these to pick a supply or switch.
- No docs page says whether it is safe to just remove power, or whether there is a
  shutdown step. `configuration/utilities.md` › Device Operations covers Restart and
  Reboot only. Core source gives no hardware answer; nav `uno/utilities` item
  **Device Operations** is "Reboot and restart services".
- No screenshot of the power connector on its own (`img-3130` shows the back of the
  main unit).

## Verification

- Power options, not included: `getting-started/installation.md` (intro paragraph;
  › Main unit list "8–28 VDC power connector (if not using PoE)"; › Power Up).
- Max 0.5 A at 12 VDC, max 8 W: `main/specifications.md` (Power options, Power usage).
- LED and about one minute to screen: `getting-started/installation.md` › Power Up.
- Heat 6–7 W, venting: `getting-started/installation.md` › Heat.
- Restart/Reboot: `configuration/utilities.md` › Device Operations ("Restart and Reboot
  are also available to users with Device Operations permission"). Source: nav
  `uno/utilities` item **Device Operations** (`MenuManager.cs`, permission
  `DeviceOperations or Not appliance`).
- Hardware facts are docs-only; core source does not describe the power hardware.

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
