---
status: likely
source: synthetic
date: 2026-09-14
title: Add a library fixture at a DMX address
slug: add-fixture-from-library
anonymized: true
docs_slugs:
  - dmx-core-100/getting-started/quick-start
  - dmx-core-100/lighting/fixture-setup
  - dmx-core-100/lighting/ai-fixture-profiles
---

# Add a library fixture at a DMX address

Synthetic format demo (not a real ticket). Keep as a gold path until a
confirmed interaction replaces it.

## Original ask

> I want to create a fixture for a Robe Spot 170 AT and set it to start
> address 100 on universe 1.

## Goal

A fixture instance on the device using a Lightkey/GDTF/Daslight (or
AI-from-manual) profile, personality matching the physical mode, start
channel 100, universe 1.

## Walkthrough

```json
{
  "id": "add-fixture-from-library",
  "title": "Add a Robe Spot 170 AT at address 100, universe 1",
  "steps": [
    {
      "id": "search-library",
      "label": "Open the Lightkey fixture library and search Robe Spot 170 AT (Daslight or GDTF Share if Lightkey has no profile)",
      "docsUrl": "/dmx-core-100/lighting/fixture-setup/",
      "screenshotId": null
    },
    {
      "id": "download-profile",
      "label": "Download the profile file (.lightkeyfxt, .ssl2, or .gdtf)",
      "docsUrl": "/dmx-core-100/lighting/fixture-setup/",
      "screenshotId": null
    },
    {
      "id": "import-profile",
      "label": "On the DMX Core, go to Lighting Setup → Fixtures, click Add a fixture (or Add New), click Add profile, and import the file",
      "docsUrl": "/dmx-core-100/lighting/fixture-setup/",
      "screenshotId": "add-fixture-profile"
    },
    {
      "id": "personality-address",
      "label": "Choose the personality that matches the fixture’s mode, set start address 100 and universe 1, then Save",
      "docsUrl": "/dmx-core-100/lighting/fixture-setup/",
      "screenshotId": "fixture-editor"
    }
  ]
}
```

## Gotchas

- If no library profile exists, use AI-from-manual (`ai-fixture-profiles`)
  instead of inventing channels.
- Personality must match the fixture’s physical DMX mode.
- Warn if no output is configured for that universe (fixture editor already
  shows this).

## Eval checks

- Menu path includes `Lighting Setup > Fixtures`
- Import uses **Add profile**, not File Explorer unless they are on the
  touchscreen-only path
- Address 100 and universe 1 appear in the steps
- Does not tell them to use MCP or the Integration API

## Gaps

- No screenshot of the Lightkey catalog (external site)
- Touchscreen has **Settings > Fixtures**; this recipe stays on the Web UI for profile import

## Source notes

Synthetic; from product-planning chat 2026-09-14.
