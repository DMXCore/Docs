---
status: candidate
source: synthetic
invented: true
level: intermediate
surface: none
date: 2026-09-15
title: Will plugins update themselves in the middle of a show?
slug: plugin-updates-during-show-season
anonymized: true
docs_slugs:
  - dmx-core-100/integrations/plugins
  - dmx-core-100/integrations/qsys
verified: docs be6f663, core v2026.914.3
---

# Will plugins update themselves in the middle of a show?

## Original ask

> We run the QSys DSP plugin in a theater and I saw a little arrow badge on the plugins
> page. Does the unit update plugins on its own? I really don't want the DSP link
> restarting mid-show. Are plugin updates tied to the DMX Core firmware updates? And if
> a new version breaks something can I go back?

## Goal

The user understands how plugin updates work (independent of device software, policy
Notify/Auto/Off, per-plugin override, rollback), so they can keep the QSys DSP plugin
from updating during shows.

## Expected answer

- Plugins are updated **independently of the device software**. The device checks the
  plugin registry about once an hour, and when **Check for updates** is pressed on the
  Browse tab.
- What happens depends on the **Update policy** under
  **Control & Integrations > Plugins > Browse > Registry settings**. **Notify** is the
  default and only shows the update (badge and count), which is what the arrow badge
  is. It is applied only when someone presses **Update**. **Auto** downloads and
  applies updates as they are found, and the plugin restarts for a few seconds.
  **Off** turns update checks off.
- A single plugin can override the device policy in its settings panel
  (**Auto-update**: follow the device policy / always / never). For example, set the
  QSys DSP plugin to never auto-update and update it by hand during a maintenance
  window.
- Pressing **Update** keeps the plugin's settings. Only versions this device's
  software can run are offered. Updating the device software can unlock newer plugin
  versions.
- To go back, pick an older version in the version dropdown on the **Browse** tab and
  install it. The update check will offer the newer version again later.
- **Reload** restarts just one plugin without restarting the device. It is useful if
  the DSP link gets stuck after an update.
- Must not claim that plugins update only together with the device software, that
  Auto is the default, that a plugin update needs a device reboot, or that the
  assistant can change the policy for them.

## Gotchas

- The arrow badge next to the version (and the count on the Installed tab) means "an
  update is available", not "it will update itself".
- Under Auto, the plugin restarts for a few seconds when an update is applied. For a
  DSP plugin, that is a short loss of the DSP link.
- **Off** also stops the badge, so nobody will see that fixes are available.

## Eval checks

- Says plugin updates are independent of device software updates
- Names the policy location `Control & Integrations > Plugins` → **Browse** →
  **Registry settings** and the three policies **Notify** (default), **Auto**, **Off**
- Mentions the per-plugin **Auto-update** override (never, for the QSys DSP plugin)
- Mentions rollback via the version dropdown on the **Browse** tab
- Says settings are kept on update
- Does not claim Auto is the default or that a device reboot is needed
- Does not tell them to use MCP or the Integration API
- Does not claim it changed a setting

## Gaps

- `integrations/plugins.md` › Updates paraphrases the per-plugin choices as "follow the
  device policy / always / never". The released labels are **Follow the device
  policy**, **Always update automatically**, **Never update automatically**, and the
  policy options read "Notify — show available updates, apply manually", "Auto —
  download and apply updates automatically", "Off — do not check for updates"
  (`src/AdminSite/ClientApp/src/views/operation/Plugins.vue`, v2026.914.3). Not wrong,
  but a grader may see the exact labels quoted.
- `plugins.md` does not say that the check runs about 1 minute after startup and then
  hourly with a few minutes of jitter (`src/Shared/Services/PluginUpdateService.cs`
  `StartupDelay`, `CheckInterval`, `CheckJitter`). So an Auto update can land at any
  time of day, including during a show. The docs imply this but do not warn about it.

## Verification

- Independent of device software, hourly check, **Check for updates**:
  `integrations/plugins.md` › Plugins (intro) and › Updates. Source:
  `PluginUpdateService.cs` summary and `CheckInterval = TimeSpan.FromHours(1)`;
  `Plugins.vue` button "Check for updates".
- Policy Notify / Auto / Off, default Notify, location: `plugins.md` › Updates and
  › Registry Settings. Source: `Plugins.vue` `registrySettings.updatePolicy: 'NOTIFY'`
  default, **Registry settings** button, **Update policy** select; nav `web/plugins`
  section Registry (`Update policy`, `Auto-update`).
- Per-plugin override: `plugins.md` › Updates. Source: `Plugins.vue` **Auto-update**
  select; `PluginUpdateService.cs` `row.AutoUpdate ?? hostConfig.PluginUpdatePolicy == Auto`.
- Settings kept, compatible versions only: `plugins.md` › The Installed Tab (Update)
  and › Updates. Source: `Plugins.vue` downgrade dialog ("The plugin's settings are
  kept"); `PluginUpdateService.cs` `package.LatestCompatible(hostSdk, ...)`.
- Rollback: `plugins.md` › Installing a Plugin (version dropdown). Source: `Plugins.vue`
  install dialog "The update check will offer the newer version again."
- Reload: `plugins.md` › The Installed Tab. Source: `Plugins.vue` `reloadPlugin`,
  title "Reload".

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
