---
status: candidate
source: synthetic
invented: true
level: newbie
surface: web
date: 2026-09-15
title: Make the DMX Core 100 show up in Home Assistant
slug: home-assistant-discover-device-over-mqtt
anonymized: true
docs_slugs:
  - dmx-core-100/integrations/home-assistant
  - dmx-core-100/integrations/mqtt
  - dmx-core-100/integrations/plugins
verified: docs be6f663, core v2026.914.3
---

# Make the DMX Core 100 show up in Home Assistant

## Original ask

> i finally got home assistant running on a raspberry pi with the mosquitto thing installed. how do i get my dmx core to show up in there so i can put my lighting scenes on my dashboard? do i need some custom component or yaml

## Goal

The DMX Core 100 and Home Assistant use the same MQTT broker, and the device shows up
automatically under Home Assistant's MQTT integration, with its presets, cues, dimmers
and switches as entities. No custom component or YAML is needed.

## Walkthrough

```json
{
  "id": "home-assistant-discover-device-over-mqtt",
  "title": "Make the DMX Core 100 show up in Home Assistant",
  "steps": [
    {
      "id": "ha-mqtt-integration",
      "label": "In Home Assistant, add the MQTT integration (Settings → Devices & Services → Add Integration → MQTT) and connect it to your Mosquitto broker, if it is not set up already",
      "docsUrl": "/dmx-core-100/integrations/home-assistant/#setup",
      "screenshotId": null
    },
    {
      "id": "core-mqtt-broker",
      "label": "In the DMX Core Web UI, open Control & Integrations → MQTT, turn on Enable External MQTT, and enter the same broker in MQTT Server (e.g. 192.168.1.20), MQTT Port (1883) and the broker's MQTT Username / Password, then save",
      "docsUrl": "/dmx-core-100/integrations/mqtt/#broker-connection",
      "screenshotId": "mqtt-settings"
    },
    {
      "id": "check-plugin",
      "label": "Open Control & Integrations → Plugins and check that the Home Assistant plugin is on the Installed tab and Enabled (if it is missing, install it from the Browse tab)",
      "docsUrl": "/dmx-core-100/integrations/plugins/#the-installed-tab",
      "screenshotId": "plugins-settings"
    },
    {
      "id": "find-device-in-ha",
      "label": "Within a few seconds, find the DMX Core 100 device in Home Assistant under Settings → Devices & Services → MQTT and add its scenes to your dashboard",
      "docsUrl": "/dmx-core-100/integrations/home-assistant/#what-you-get",
      "screenshotId": "home-assistant-device"
    }
  ]
}
```

## Gotchas

- Both systems must use the **same** broker. That is the most common reason nothing
  shows up (docs › Troubleshooting).
- No custom component and no YAML. The Home Assistant plugin publishes everything via
  MQTT Discovery.
- The Mosquitto add-on usually needs a username and password. Enter a broker user in
  **MQTT Username / Password**. The assistant must not ask the user to paste the
  password into the chat.
- Leave the plugin's **Discovery prefix** at `homeassistant` unless it was changed in
  Home Assistant.
- In Home Assistant, presets, cues and timelines show up as **Scenes**. Master dimmer
  and zones show up as number sliders.
- The Long-lived access token / Home Assistant URL settings are only needed for the
  other direction (the device firing Home Assistant scenes). They are not needed for
  this task.
- If entities show *unavailable*, the device lost the broker. Check the network and
  the MQTT settings.

## Eval checks

- Menu path for the broker is `Control & Integrations > MQTT`
- Mentions turning on **Enable External MQTT** and entering the broker's address, port
  (`1883` default) and credentials
- Says Home Assistant and the DMX Core must point at the same broker
- Mentions the Home Assistant MQTT integration (`Settings > Devices & Services`)
- Mentions checking or installing the Home Assistant plugin under
  `Control & Integrations > Plugins`
- Says no custom component or YAML is needed (MQTT Discovery)
- Does not require a Long-lived access token for Home Assistant to control the device
- Does not tell them to use MCP or the Integration API
- Does not claim it changed a setting or connected anything for them

## Gaps

- `integrations/home-assistant.md` contradicts itself. The intro and the "Plugin
  settings" tip say the integration "ships as a built-in plugin, enabled by default",
  but Setup and "Triggering Home Assistant from the Device" say to install it from
  **Plugins > Browse**. Release notes v2026.726.7 say "bundled plugin". The core
  release `v2026.914.3` loads built-in plugins from an application `plugins` folder
  (`src/Shared/Services/PluginManager.cs`, `BuiltInPluginsRoot`), and
  `src/Shared/Controllers/WebsiteController.PluginRegistry.cs` lists
  `DMXCore.Plugin.HomeAssistant` as a registry package. Nothing in the repo shows
  whether a given build ships it. The gold answer therefore says "check Installed,
  install from Browse if missing".
- `integrations/home-assistant.md` does not document the plugin's optional **Home
  Assistant MQTT broker / port / username / password / TLS** settings, used when Home
  Assistant uses a different broker than the Core (plugin 1.2.3,
  `DMXCore100.Plugin.HomeAssistant/src/DMXCore100.HomeAssistantPlugin/HomeAssistantPlugin.cs`).
  That setting's in-product description says the Core MQTT setting is under
  "Settings → Remote Control". In the released Web UI it is
  **Control & Integrations > MQTT** (nav `web/settings/mqtt`; Remote Control is a
  separate page, `web/settings/remotecontrol`).
- `integrations/mqtt.md` does not say what happens when **Enable External MQTT** is
  off. On the appliance, a built-in local broker is used. On desktop installs there
  is no MQTT connection at all (nav `web/settings/mqtt`, help text of **Enable
  External MQTT**). A newbie who leaves it off will not see the device in Home
  Assistant.
- No screenshot of the Home Assistant MQTT integration setup (external app).

## Verification

- Step `ha-mqtt-integration`: `integrations/home-assistant.md` › Setup, step 1
  (Home Assistant side; not in Core source).
- Step `core-mqtt-broker`: `integrations/mqtt.md` › Broker Connection (**Enable
  External MQTT**, **MQTT Server / Port**, default 1883, **MQTT Username / Password**)
  and `home-assistant.md` › Setup, step 2. Source: nav `web/settings/mqtt`, path
  `Web > System > Control & Integrations > MQTT`, fields `Enable External MQTT`,
  `MQTT Server`, `MQTT Port`, `MQTT Username`, `MQTT Password`
  (`Settings.vue`); sidebar label `MQTT` under `Control & Integrations` in
  `src/AdminSite/ClientApp/src/_nav.js`.
- Step `check-plugin`: `integrations/plugins.md` › The Installed Tab and Installing a
  Plugin; `home-assistant.md` › Troubleshooting ("plugin shows as connected under
  Control & Integrations > Plugins"). Source: nav `web/plugins`; `Plugins.vue` tabs
  **Installed** / **Browse**, `Enabled` switch, **Install** button label.
- Step `find-device-in-ha`: `home-assistant.md` › Setup, step 3, and What You Get.
  Plugin source: `HomeAssistantPlugin.cs` (MQTT Discovery, **Discovery prefix**
  default `homeassistant`, expose toggles default on).

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
