---
title: Output Monitor
description: Real-time DMX output visualization
---

The Output Monitor is a diagnostic tool that lets you see DMX channel values in real time across your configured output slots. It is useful for verifying that fixtures are receiving the expected data, troubleshooting output issues, and confirming that your output configuration is working correctly.

:::tip[Web UI only]
The Output Monitor is available in the Web UI under **Utilities > Output Monitor**.
:::

## Starting the Monitor

1. Navigate to **Utilities > Output Monitor** in the Web UI
2. Click **Start Monitor** to begin a monitoring session
3. Select a **slot** from the grid of available slots to view its DMX data

The monitor displays a 32x16 grid representing the 512 DMX channels of the selected slot. Each cell shows a channel's current value as a grayscale intensity — black is 0, white is 255. Hover over a cell to see the exact channel number and value.

## Slot Selection

The available slots correspond to your configured COSMOS output slots. Click a slot button to switch the view to that slot's DMX data. The selected slot is highlighted with a colored border.

Below the channel grid, an **output information table** shows which output interfaces are mapped to the selected slot, including the output code, protocol type, and universe mapping.

## Session Behavior

- The monitor updates at approximately 5 times per second
- Sessions automatically time out after 60 minutes of inactivity
- The session persists across page navigation within the Web UI — if you navigate away and return, the monitor resumes
- Click **Stop Monitor** to end the session and release resources
