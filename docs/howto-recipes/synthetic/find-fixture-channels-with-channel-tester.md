---
status: candidate
source: synthetic
invented: true
level: intermediate
surface: web
date: 2026-10-21
title: Find which channels a fixture sits on with the Channel Tester
slug: find-fixture-channels-with-channel-tester
anonymized: true
docs_slugs:
  - dmx-core-100/configuration/channel-tester
  - dmx-core-100/lighting/fixture-setup
verified: docs (this commit), core 5dddbb3f
---

# Find which channels a fixture sits on with the Channel Tester

## Original ask

> We inherited a venue with a dozen LED bars patched by someone else. One of them never changes color and I don't know whether it is addressed where the fixture list says or whether the wire is dead. How do I send raw DMX to a few channels from the Core without building a preset?

## Goal

The user holds raw levels on a handful of channels of the slot the bar is on, sees the bar react (or not), and reads off which channels the fixture is patched to.

## Walkthrough

```json
{
  "id": "find-fixture-channels-with-channel-tester",
  "title": "Find which channels a fixture sits on with the Channel Tester",
  "steps": [
    {
      "id": "open-tester",
      "label": "Go to Utilities → Channel Tester and click Start Tester (the Channel Tester permission is required; Admin has it)",
      "docsUrl": "/dmx-core-100/configuration/channel-tester/#starting-a-session",
      "screenshotId": "channel-tester"
    },
    {
      "id": "pick-slot",
      "label": "Pick the slot the fixture is on. The Outputs on slot table under the picker shows the output and universe that slot goes to",
      "docsUrl": "/dmx-core-100/configuration/channel-tester/#starting-a-session",
      "screenshotId": "channel-tester"
    },
    {
      "id": "find-fixture",
      "label": "Under the faders, Fixtures on slot N lists every fixture copy on the slot with its channel span; click the code to highlight its channels, or click Full to bring the whole fixture to full",
      "docsUrl": "/dmx-core-100/configuration/channel-tester/#fixtures-on-the-slot",
      "screenshotId": "channel-tester"
    },
    {
      "id": "poke-channels",
      "label": "Type a command such as 13 thru 16 @ full and press Enter, or drag single faders, and watch the bar. Walk the channels until the right bar reacts",
      "docsUrl": "/dmx-core-100/configuration/channel-tester/#command-line",
      "screenshotId": "channel-tester"
    },
    {
      "id": "check-readback",
      "label": "If a held fader shows an amber tick at a different level, something after the merge changed the output - a channel rule, Blackout or Output Off - and the notice on the page says which",
      "docsUrl": "/dmx-core-100/configuration/channel-tester/#readback",
      "screenshotId": "channel-tester"
    },
    {
      "id": "release",
      "label": "Click Release All, then Stop Tester",
      "docsUrl": "/dmx-core-100/configuration/channel-tester/#holding-and-releasing-channels",
      "screenshotId": "channel-tester"
    }
  ]
}
```

## Gotchas

- Levels are held per slot, not per wire universe; the Outputs on slot table ties the slot to the output and universe.
- Only slots that an enabled output is mapped to can be selected. If the fixture's slot is not in the list, the problem is the output configuration.
- Channels that are not touched keep playing the show, so a cue running on the same slot is not stopped - stop it first if you want a dark baseline, or test one channel at a time.
- Changing the slot releases everything held on the previous one.
- `par1 @ full` works with the fixture code shown in the fixture list; `par1.2` targets copy 2 of a fixture with several copies.
- Web UI only. The session ends when the page is left, and an idle session ends after 60 minutes.

## Eval checks

- Menu path is `Utilities > Channel Tester`
- Mentions `Start Tester`, picking a slot, and `Release All` / `Stop Tester`
- Explains that the fixture list (or `par1 @ full`) shows and drives the fixture's channels
- Mentions the command line syntax (`thru`, `@`, `full`) or dragging faders
- Does not tell them to build a preset or cue for a channel test
- Does not claim a touchscreen Channel Tester exists
- Does not claim held levels survive a restart or are saved

## Gaps

- Screenshot shows faders with channels held, not the fixture list or the grid view.

## Verification

- Utilities → Channel Tester, Start Tester, slot picker, outputs table: `configuration/channel-tester.md` "Starting a session"; `src/AdminSite/ClientApp/src/views/operation/ChannelTester.vue`.
- Fixture list, highlight, Full/Release: `channel-tester.md` "Fixtures on the slot"; `/api/website/channeltester/fixtures` in `WebsiteController.ChannelTester.cs`.
- Command grammar: `channel-tester.md` "Command line"; `src/AdminSite/ClientApp/src/composables/useChannelCommand.js`.
- Readback tick and state notice: `channel-tester.md` "Readback"; `ChannelTesterStatusModel.State`.
- Permission: `UserPermissions.ChannelTester`; nav entry gated on `CHANNELTESTER`.

## Source notes

Invented scenario, 2026-10-21; not from a real interaction.
