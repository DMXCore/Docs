---
status: candidate
source: synthetic
invented: true
level: newbie
surface: none
date: 2026-09-15
title: Question about the DMX Core Pico 2 (out of scope)
slug: pico-2-question-out-of-scope
anonymized: true
docs_slugs:
  - dmx-core-pico-2
verified: docs be6f663, core v2026.914.3
---

# Question about the DMX Core Pico 2 (out of scope)

## Original ask

> i got the pico 2 board, how do i put new firmware on it so port 2 is an input instead of output?

## Goal

The copilot recognizes the question is about a different product, points to the DMX Core Pico 2 docs, and does not answer with DMX Core 100 steps.

## Expected answer

- Says this assistant covers the DMX Core 100, and the question is about the DMX Core Pico 2, a separate product.
- Points the user to the DMX Core Pico 2 documentation: https://docs.dmxcore.com/dmx-core-pico-2/
- May say in one line that the Pico 2 docs cover its firmware and port setup, without giving steps.
- Does not give DMX Core 100 steps (Web UI menus, `Utilities > Releases`, `Software Updates`, re-flash with RPIBOOT/balenaEtcher) as if they applied to the Pico 2.
- Does not invent Pico 2 firmware steps, file names, pin assignments or port settings.
- Does not tell them to use MCP or the Integration API.

## Gotchas

- The user says "firmware". On the DMX Core 100 that word often maps to Software Updates or Re-flash Instructions, which is the wrong answer here.
- The DMX Core 100 docs have their own re-flash page that mentions RPIBOOT (a Raspberry Pi tool). The Pico 2 is also Raspberry Pi based, so a model may wrongly reuse it.

## Eval checks

- Contains the url `https://docs.dmxcore.com/dmx-core-pico-2/`
- States the assistant covers the DMX Core 100
- Does not mention `Utilities > Releases`, `Software Updates` or `Re-flash Instructions` as the way to do it
- Does not include RPIBOOT, balenaEtcher or `.img.xz` steps
- Does not invent Pico 2 configuration steps
- Does not tell them to use MCP or the Integration API

## Gaps

- None for the DMX Core 100 docs. The Pico 2 section exists in the docs site (`src/content/docs/dmx-core-pico-2/`) but is not part of the DMX Core 100 catalog the copilot answers from.

## Verification

- Pico 2 section exists: Docs repo `src/content/docs/dmx-core-pico-2/index.md` (title "DMX Core Pico 2"; describes UF2 firmware and two isolated ports configurable as input or output) and sidebar entry in `astro.config` (label "DMX Core Pico 2", slug `dmx-core-pico-2`).
- The docs catalog for the copilot lists only `/dmx-core-100/` pages, so no DMX Core 100 page answers this.

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
