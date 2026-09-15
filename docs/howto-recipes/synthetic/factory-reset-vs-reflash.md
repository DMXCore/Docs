---
status: candidate
source: synthetic
invented: true
level: advanced
surface: none
date: 2026-09-15
title: Factory Reset or re-flash to wipe a unit for a new venue
slug: factory-reset-vs-reflash
anonymized: true
docs_slugs:
  - dmx-core-100/configuration/utilities
  - dmx-core-100/troubleshooting/re-flash-instructions
  - dmx-core-100/troubleshooting
  - dmx-core-100/configuration/backup-and-restore
verified: docs be6f663, core v2026.914.3
---

# Factory Reset or re-flash to wipe a unit for a new venue

## Original ask

> I'm redeploying a DMX Core 100 from one install to another. It boots fine, has a static IP on our integrator VLAN and a license. I want it completely clean: no cues, no old user accounts, no API keys. Do I need to do the RPIBOOT + Etcher re-image, or is there a proper wipe that keeps the network config and license?

## Goal

The user understands that Factory Reset in the Web UI is the right tool for a unit that boots, what it keeps and deletes, and when a re-flash is actually needed.

## Expected answer

- Recommends **Factory Reset** in the Web UI, not a re-flash, because the unit still boots. Path: `Utilities > System`, **Danger zone** card, **Factory Reset**, type `RESET`, confirm.
- States what is deleted: cues, sounds, images, user-installed plugins, presets, timelines, schedules, effects, custom menus, input triggers, output events, users, roles, API keys, fixture layout, and application settings (show name, output configuration return to defaults).
- States what is kept: network settings (IP address, Wi-Fi, hostname override, NTP server, internet passthrough), the device license, local backup files, and extra non-show folders in the data directory.
- Says after the reset they sign in as **Administrator** with PIN `1111` and should change it right away; existing sessions and API keys stop working.
- Notes it needs the **Change System Settings** permission (Admin role has it, Operator does not), and that it is Web UI only.
- Mentions the local backup files remain on the device; if they must not travel to the new venue, delete them separately (optional, but must not claim Factory Reset removes them).
- Says re-flashing is only for a device that will not boot or needs a full OS recovery; it erases everything, and without copying `config.json` the device must be re-provisioned by support. Re-flashing is also not the way to change software version.
- Must not claim: that Factory Reset exists on the touchscreen, that it rewrites the OS or changes the software version, that it removes the license or network settings, or that a re-flash keeps the license/identity by default.

## Gotchas

- Local backups surviving the reset is a feature for restoring, but for a unit going to a different customer they may hold the old show and users.
- On the Windows, macOS or Linux desktop app, the application closes after the reset and must be started again; on the appliance the service restarts automatically.
- Taking a backup first (Backup & Restore) is cheap insurance in case the old show is needed later.
- "Clean" to an integrator may include the portal association; the docs do not say Factory Reset changes portal registration, so the answer should not claim either way.

## Eval checks

- Recommends `Factory Reset`, not re-flash
- Menu path is `Utilities > System` with the `Danger zone` card
- Mentions typing `RESET`
- Says network settings and license are kept
- Says users, roles and API keys are deleted
- Mentions default login `Administrator` / `1111` and changing it
- Says re-flash is only when the device will not boot (or a full OS recovery)
- Does not claim Factory Reset is available on the touchscreen
- Does not claim local backups are deleted
- Does not tell them to use MCP or the Integration API

## Gaps

- None found: `configuration/utilities.md` "Factory Reset" matches the Danger zone card text, the `RESET` phrase and the `CHANGESYSTEMSETTINGS` permission at v2026.914.3.
- Docs missing: whether Factory Reset affects the device's DMX Core portal association. Not stated in `utilities.md` or `remote-management.md`; not checked in source.

## Verification

- Factory Reset path, RESET phrase, Danger zone: `configuration/utilities.md` "Factory Reset" > "How to run it"; `src/AdminSite/ClientApp/src/views/operation/Utilities.vue` (card header "Danger zone", `requiredPhrase: 'RESET'`, button "Factory Reset", `hasPermission('CHANGESYSTEMSETTINGS')`); navigation `web/utilities/system` action "Factory Reset".
- Deleted / kept lists and Administrator 1111: `utilities.md` "What is deleted", "What is kept", "After the reset"; `Utilities.vue` card text ("…all configuration except network settings. The device license, local backups, and anything else in the data folder that is not show data are kept", "Administrator with PIN 1111").
- Web UI only: `utilities.md` tip "Web UI only"; navigation `uno/utilities/device operations` has no factory reset item.
- Desktop app closes: `utilities.md` "How to run it"; `src/Shared/Controllers/WebsiteController.Files.cs` `TriggerRestoreReload` (desktop cannot restart itself).
- Re-flash only when it will not boot, config.json, re-provision: `troubleshooting/index.md` intro; `troubleshooting/re-flash-instructions.md`.
- Do not re-flash to change version: `re-flash-instructions.md`; `utilities.md` "Releases".

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
