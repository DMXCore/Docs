---
status: candidate
source: synthetic
invented: true
level: advanced
surface: web
date: 2026-09-15
title: Check what a slot is sending with the Output Monitor
slug: check-slot-data-with-output-monitor
anonymized: true
docs_slugs:
  - dmx-core-100/configuration/output-monitor
  - dmx-core-100/configuration/output-config
verified: docs be6f663, core v2026.914.3
---

# Check what a slot is sending with the Output Monitor

## Original ask

> Cue is playing on the Core but the pixel bars on our sACN universe 12 node stay dark. Before I blame the node I want to see the actual channel levels the Core is outputting for that universe and confirm which output it's mapped to. Is there a DMX sniffer view in the web UI?

## Goal

The user sees live channel values for the slot that feeds sACN universe 12 and confirms which output and universe that slot is sent to.

## Walkthrough

```json
{
  "id": "check-slot-data-with-output-monitor",
  "title": "Check what a slot is sending with the Output Monitor",
  "steps": [
    {
      "id": "find-slot",
      "label": "In Lighting Setup → Outputs, open the sACN output that covers universe 12 and note its Start Slot Id / Start Universe Id and Universe Count to work out which slot feeds universe 12",
      "docsUrl": "/dmx-core-100/configuration/output-config/#output-settings",
      "screenshotId": "output-editor"
    },
    {
      "id": "open-monitor",
      "label": "Go to Utilities → Output Monitor and click Start Monitor",
      "docsUrl": "/dmx-core-100/configuration/output-monitor/#starting-the-monitor",
      "screenshotId": "output-monitor"
    },
    {
      "id": "select-slot",
      "label": "Click that slot number in the slot grid and hover the 512-channel grid to read channel numbers and values while the cue plays",
      "docsUrl": "/dmx-core-100/configuration/output-monitor/#slot-selection",
      "screenshotId": "output-monitor"
    },
    {
      "id": "check-mapping",
      "label": "Check the output table under the grid shows the expected output code, sACN type and universe 12 for that slot",
      "docsUrl": "/dmx-core-100/configuration/output-monitor/#slot-selection",
      "screenshotId": "output-monitor"
    },
    {
      "id": "stop-monitor",
      "label": "Click Stop Monitor when done",
      "docsUrl": "/dmx-core-100/configuration/output-monitor/#session-behavior",
      "screenshotId": "output-monitor"
    }
  ]
}
```

## Gotchas

- The monitor is organized by internal slot, not by on-the-wire universe. The output table under the grid is what ties the slot to the output and universe.
- Only slots that are configured on an output appear. If no slot maps to universe 12, the problem is the output configuration, not the node.
- Values show as grayscale (black 0, white 255); the exact value only appears on hover.
- If the values are right and mapped to universe 12, the device is sending; next suspects are the node's universe, network path (multicast/unicast Destination IP) and the output's sACN priority against other sources.
- Web UI only. The session times out after 60 minutes of inactivity and resumes if you navigate away and come back.

## Eval checks

- Menu path is `Utilities > Output Monitor`
- Mentions `Start Monitor` and selecting a slot
- Explains slot vs universe, and checking the mapping via the table or `Lighting Setup > Outputs` (Start Slot Id / Start Universe Id)
- Mentions hover to read exact channel values
- Does not claim the Output Monitor shows incoming/input data or sniffs the network
- Does not send them to `Device Monitor` as the channel-level view
- Does not claim a touchscreen Output Monitor exists
- Does not tell them to use MCP or the Integration API

## Gaps

- Screenshot missing: no capture of `/op/utilities/outputmonitor`; all monitor steps have `screenshotId: null`.
- Docs label: `configuration/output-monitor.md` calls them "configured COSMOS output slots"; the UI heading is **Configured Slots (N)** and the selected view is titled **Slot N** (or "Select a slot to monitor"). Source: `src/AdminSite/ClientApp/src/views/operation/OutputMonitor.vue`.
- Docs incomplete: the output information table columns are **Code**, **Type** and **Slot => Universe**; the docs say "output code, protocol type, and universe mapping". Source: `OutputMonitor.vue`.
- Verified correct: "times out after 60 minutes of inactivity" matches source (`WebOutputMonitorInfo.Age` is time since last use; `StorageManager.cs` releases after 60 minutes).

## Verification

- Outputs, Start Slot Id / Start Universe Id, Universe Count: `configuration/output-config.md` "Web UI" (**Lighting Setup > Outputs**) and "Output Settings"; screenshot `output-editor`.
- Utilities → Output Monitor, Start Monitor: `configuration/output-monitor.md` "Starting the Monitor"; navigation `web/utilities/outputmonitor` (summary "Start Monitor / Stop Monitor … pick one of the Configured Slots"); `OutputMonitor.vue` button text `Start Monitor` / `Stop Monitor`.
- Slot grid, hover values, 32x16 grid: `output-monitor.md` "Starting the Monitor"; `OutputMonitor.vue` (canvas with `@mousemove`, "Hover over the grid to see the data").
- Output table: `output-monitor.md` "Slot Selection"; `OutputMonitor.vue` table Code / Type / Slot => Universe.
- Stop Monitor, 60-minute timeout, resume on return: `output-monitor.md` "Session Behavior"; `src/Shared/Services/StorageManager.cs` ("Timeout after 60 minutes"), `src/Shared/Models/WebOutputMonitorInfo.cs`.
- Web UI only: `output-monitor.md` tip; no Output Monitor item in navigation `uno/utilities`.

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
