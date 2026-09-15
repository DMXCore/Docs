---
status: candidate
source: email
date: 2026-08-26
title: Route LIFX or Govee lights through plugin outputs and fixtures
slug: route-lifx-govee-plugin-output
anonymized: true
docs_slugs:
  - dmx-core-100/integrations/lifx
  - dmx-core-100/integrations/govee
  - dmx-core-100/integrations/plugins
  - dmx-core-100/configuration/output-config
  - dmx-core-100/lighting/fixture-setup
---

# Route LIFX or Govee lights through plugin outputs and fixtures

## Original ask

> We're operating primarily within a Windows environment. Our production
> integrates LIFX and Govee alongside a wireless DMX rig of moving heads. The
> LIFX plugin instantly discovered our array of 7 Beams. Our primary
> objective is finalizing the output configuration. The software identifies
> the fixtures and the initial mapping appears correct, but we are
> experiencing a routing hurdle preventing the signal from actually reaching
> the physical devices.
>
> In the Outputs tab, when I get to the destination address and click
> Discover, it accurately returns all applicable devices on the network,
> Govee or LIFX. As soon as I save this and go to the Fixtures tab, this is
> where I lose track.

## Goal

Each LIFX or Govee light has its own plugin output on a free internal slot,
and a fixture patched to that same slot and start channel, so Fixture Control
and cues actually reach the physical devices.

## Walkthrough

```json
{
  "id": "route-lifx-govee-plugin-output",
  "title": "Route LIFX or Govee lights through plugin outputs and fixtures",
  "steps": [
    {
      "id": "install-plugin",
      "label": "Go to Control & Integrations → Plugins → Browse and install LIFX and/or Govee if they are not already installed",
      "docsUrl": "/dmx-core-100/integrations/plugins/",
      "screenshotId": "plugins-settings"
    },
    {
      "id": "add-output-discover",
      "label": "Go to Lighting Setup → Outputs, Add an output, set type LIFX or GOVEE, click Discover, pick one light, and set Start Slot Id to a free slot (slot 2 if slot 1 already has a pixel fixture)",
      "docsUrl": "/dmx-core-100/configuration/output-config/",
      "screenshotId": "output-editor"
    },
    {
      "id": "protocol-and-save",
      "label": "Choose the protocol that matches the light (Pixel for a LIFX Beam; RGB or Realtime RGB for a Govee Glide), set Start Channel, match Color mode to the fixture personality, then Save. One output per physical light",
      "docsUrl": "/dmx-core-100/integrations/lifx/",
      "screenshotId": "output-editor"
    },
    {
      "id": "patch-fixture",
      "label": "Go to Lighting Setup → Fixtures → Add, pick LIFX — Color Bulb or Govee — Color Light, use Mapped Device to prefill slot, start channel, and personality from that output, then Save",
      "docsUrl": "/dmx-core-100/lighting/fixture-setup/",
      "screenshotId": "fixture-editor"
    }
  ]
}
```

## Gotchas

- Discover finding the lights is not enough. The plugin output only consumes
  DMX on a **slot** (internal universe). A fixture must be patched to the
  **same slot and start channel** or nothing you do in Fixtures / Fixture
  Control is sent to the bulb.
- One plugin output drives **one** device. Seven Beams need seven LIFX
  outputs; eleven Govee Glides need eleven GOVEE outputs. Put each on a
  non-overlapping slot or channel range.
- Do not park a LIFX Beam on the same slot as an existing pixel fixture (in
  this thread a 170-pixel fixture already occupied slot 1). Support put LIFX
  on slot 2 and Govee on slot 3.
- Govee needs **LAN Control** switched on once in the Govee Home app or
  Discover will not see the device.
- Give LIFX / Govee lights a static DHCP lease; destination address is the
  light’s IP.
- For LIFX Pixel, Color mode on the output must match the fixture
  personality. At the time of this thread, per-pixel RGBW+CT 16-bit was not
  supported — only RGB and RGB16 drove each pixel. If RGBW+CT 16-bit does
  not move the Beam, switch Color mode (and personality) to RGB or RGB16.
- Govee’s documented LAN API treats the whole device as one zone; use a
  Realtime Pixel protocol if you need per-segment RGBIC.

## Eval checks

- Menu path includes `Lighting Setup > Outputs` **and** `Lighting Setup > Fixtures`
- Uses **Discover** on the plugin output, then patches a fixture — not
  Discover alone
- Mentions **slots** as internal universes, with LIFX on a different slot
  from an existing pixel fixture (slot 2 vs slot 1 in the gold path)
- One output per physical light
- Profile names **LIFX — Color Bulb** and/or **Govee — Color Light**
- Mentions **Mapped Device** or matching start slot and start channel
- Does not tell them to use MCP or the Integration API

## Gaps

- No screenshot of the Discover device picker
- Docs split **Mapped Device** across a line in output-config; fixture-setup
  does not mention it
- Published LIFX docs now list RGBW+CT 16-bit as a Pixel Color mode; this
  thread said that layout did not work yet — confirm before treating it as
  supported in a public Common Task
- No screenshot of a LIFX or GOVEE output editor (capture id `output-editor`
  is a generic sACN output)

## Source notes

Email, 2026-08-26 UTC (follow-up through 2026-09-05). Windows desktop app,
not the wall unit. Detroit. LIFX Beams plus Govee Glides. Support configured
LIFX on slot 2 and Govee on slot 3 so they would not overlap a 170-pixel
fixture already on slot 1. Customer had not yet confirmed the lights
responded.
