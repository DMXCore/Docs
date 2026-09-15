---
status: likely
source: ticket
date: 2026-09-03
title: Get software updates on an isolated network
slug: update-via-internet-passthrough
anonymized: true
docs_slugs:
  - dmx-core-100/integrations/internet-passthrough
  - dmx-core-100/configuration/software-updates
  - dmx-core-100/configuration/settings
  - dmx-core-100/configuration/utilities
  - dmx-core-100/getting-started/installation
---

# Get software updates on an isolated network

## Original ask

> The unit is on an isolated network with no internet. Perhaps I do not have
> the most recent update? [device on 2026.717.2]

Follow-up while configuring another unit, after being told the unit was behind
because it had no internet.

## Goal

An isolated DMX Core 100 temporarily shares a laptop’s internet via DMX Core
Connect so it can download current software releases.

## Walkthrough

```json
{
  "id": "update-via-internet-passthrough",
  "title": "Get software updates on an isolated network",
  "steps": [
    {
      "id": "enable-passthrough-setting",
      "label": "In the Web UI, go to Device → Network, follow the network settings link at the bottom, and turn on Enable Internet Passthrough (once)",
      "docsUrl": "/dmx-core-100/integrations/internet-passthrough/",
      "screenshotId": null
    },
    {
      "id": "run-connect",
      "label": "On a computer that is on the same network as the DMX Core and has its own internet, install and run DMX Core Connect from downloads.dmxcore.com/connect.html",
      "docsUrl": "/dmx-core-100/integrations/internet-passthrough/",
      "screenshotId": null
    },
    {
      "id": "activate",
      "label": "Go to Utilities → System, find Internet Passthrough, pick the computer (or enter its IP), and Activate. Wait until Internet access and Cloud connection are green",
      "docsUrl": "/dmx-core-100/integrations/internet-passthrough/",
      "screenshotId": "internet-passthrough"
    },
    {
      "id": "install-updates-web",
      "label": "In the Web UI of an Appliance, open Utilities → Releases and install the current software. Snap Linux has no Releases page — snapd updates it outside the app",
      "docsUrl": "/dmx-core-100/configuration/software-updates/",
      "screenshotId": null
    },
    {
      "id": "install-updates-touchscreen",
      "label": "Or on the touchscreen, open Utilities → Device Operations → Releases and install the current software",
      "docsUrl": "/dmx-core-100/configuration/software-updates/",
      "screenshotId": "uno-utilities"
    },
    {
      "id": "deactivate",
      "label": "Go back to Utilities → System and Deactivate Internet Passthrough",
      "docsUrl": "/dmx-core-100/integrations/internet-passthrough/",
      "screenshotId": "internet-passthrough"
    }
  ]
}
```

## Gotchas

- Internet Passthrough is **hidden until enabled**. Enabling it is Device >
  Network → **network settings**, not the Utilities page itself. Once on, the
  section appears under **Utilities > System**.
- Activating or deactivating briefly restarts services; lighting may blink.
  Don’t do it mid-show.
- Closing Connect or unplugging the laptop reverts the unit after a few
  minutes.
- A unit with no internet will sit on an older build and may not even see the
  current release list.
- **Utilities → Releases is platform-specific.** The Appliance (Balena) and
  Windows/macOS desktop installs show it. A **Snap** Linux install does not —
  snapd manages updates; Utilities → System reports that instead of offering
  an in-app picker.

## Eval checks

- Mentions `Device > Network` and **Enable Internet Passthrough** before
  Utilities
- Mentions **DMX Core Connect** and a computer that already has internet
- Activate path is `Utilities > System`
- For an Appliance: mentions `Utilities > Releases` and/or touchscreen
  `Utilities > Device Operations > Releases` for the actual upgrade
- Does not tell a Snap Linux user to open Utilities > Releases
- Does not tell them to re-flash unless the device will not boot

## Gaps

- No screenshot of Device > Network → network settings (Enable Internet
  Passthrough)
- No screenshot of **Utilities > Releases** or touchscreen
  **Utilities > Device Operations > Releases**; `uno-utilities` is the
  parent Utilities menu. Published walkthrough is
  [Software Updates](/dmx-core-100/configuration/software-updates/).

## Source notes

Email ticket, 2026-09-03 UTC. Same thread as the OSC cue question. Device was
on 2026.717.2 because it had no internet. Agent pointed at Internet
Passthrough / DMX Core Connect.
