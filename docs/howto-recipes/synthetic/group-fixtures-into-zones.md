---
status: candidate
source: synthetic
invented: true
level: newbie
surface: web
date: 2026-09-15
title: Group fixtures into zones and dim one zone
slug: group-fixtures-into-zones
anonymized: true
docs_slugs:
  - dmx-core-100/lighting/zones
  - dmx-core-100/configuration/settings
  - dmx-core-100/lighting/fixture-setup
  - dmx-core-100/lighting/faders
verified: docs be6f663, core v2026.914.3
---

# Group fixtures into zones and dim one zone

## Original ask

> I have all my lights added now, the bar ones and the dining room ones. How do I make groups so I can turn down just the bar? I don't see anywhere to make a group.

## Goal

Multi-Zone Playback is on, a "Bar" zone exists, the bar fixtures are assigned to it, and the bar can be dimmed on its own from the Faders page.

## Walkthrough

```json
{
  "id": "group-fixtures-into-zones",
  "title": "Group fixtures into a Bar zone and dim it",
  "steps": [
    {
      "id": "enable-multizone",
      "label": "In the Web UI, go to Device → System and turn on Multi-Zone Playback, then save",
      "docsUrl": "/dmx-core-100/configuration/settings/#device--system-highlights",
      "screenshotId": "system-settings"
    },
    {
      "id": "create-zone",
      "label": "Go to Lighting Setup → Zones, click Add New, enter a Code / Short Name and the Name Bar, then Save",
      "docsUrl": "/dmx-core-100/lighting/zones/#creating-a-zone",
      "screenshotId": "zones-list"
    },
    {
      "id": "assign-fixtures",
      "label": "Go to Lighting Setup → Fixtures, open each bar fixture, set its Zone to Bar, and Save",
      "docsUrl": "/dmx-core-100/lighting/fixture-setup/#adding-fixtures",
      "screenshotId": "fixture-editor"
    },
    {
      "id": "dim-zone",
      "label": "Go to Operation → Faders, pick the Bar zone chip, and use that zone's submaster fader next to Master",
      "docsUrl": "/dmx-core-100/lighting/faders/#master-and-zone-dimmers",
      "screenshotId": "faders"
    }
  ]
}
```

## Gotchas

- The **Zones** page does not appear until **Multi-Zone Playback** is turned on under **Device > System**.
- The zone editor has only a code and a name. Fixtures are put into a zone from each fixture's own **Zone** field. The Zone field only appears once at least one zone exists.
- A zone's submaster scales only that zone's fixtures and multiplies with the master dimmer.
- Zones also scope presets and effects, and Fixture Control groups fixtures by zone. The group is not just for faders.
- Zone submasters act on the fixture engine. Recorded cues are raw DMX and are not dimmed per zone.

## Eval checks

- Mentions turning on **Multi-Zone Playback** under `Device > System` before zones
- Menu path `Lighting Setup > Zones` to create the zone
- Assigns fixtures through the **Zone** field in `Lighting Setup > Fixtures`
- Dimming uses the zone bank / submaster on the Faders page (or Fixture Control per zone)
- Does not claim the zone editor has a fixture picker list
- Does not tell them to use MCP or the Integration API

## Gaps

- zones.md "Creating a Zone" step 4 says to "Assign fixtures to the zone by selecting from the available fixtures list" in the zone editor, and "Editing a Zone" says you can add or remove fixtures there. At v2026.914.3 `src/AdminSite/ClientApp/src/views/operation/ZoneDetails.vue` has only Internal Id, Code / Short Name and Name (navigation `web/zones/details`). Assignment is the **Zone** field on `FixtureSettingsDetails.vue` (navigation `web/fixturesettings/details`, visible when zones exist).
- zones.md says click **Add**. The released Zones list action is **Add New** (`Zones.vue`; navigation `web/zones`).
- zones.md and fixture-setup.md say zones and fixture setup are Web UI only. The touchscreen has **Main Menu > Settings > Zones** (Add, Code, Name) and **Settings > Fixtures** with a **Zone** field (navigation `uno/settings/zones`, `uno/settings/fixtures/{fixture}`; `src/UnoHost/Services/MenuManager.cs`). The gold path stays on the Web UI, as the docs describe.
- The Zone field on Fixture Details is not listed on fixture-setup.md beyond "Optionally assign the fixture to a Zone".

## Verification

- Multi-Zone Playback on Device > System: settings.md "Device > System highlights". zones.md tip. Navigation `web/settings/system` field "Multi-Zone Playback" (`HostConfig.EnableMultiZonePlayback`).
- Zones page requires it: navigation `web/zones` availableWhen "Multi-zone playback enabled". `Zones.vue` action Add New; `ZoneDetails.vue` labels Code / Short Name, Name; Save.
- Fixture Zone field: fixture-setup.md "Adding Fixtures" step 6. `FixtureSettingsDetails.vue` `zoneId` label 'Zone', `visible: () => zones.value.length > 0`. Navigation `web/fixturesettings/details`.
- Faders zone bank and submaster: faders.md "Banks and Paging" and "Master and Zone Dimmers". Navigation `web/faders` summary (zone bank chips, zone dimmer, Master).

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
