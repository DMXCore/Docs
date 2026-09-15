---
status: candidate
source: synthetic
invented: true
level: newbie
surface: web
date: 2026-09-15
title: Download a full backup to your computer before making changes
slug: download-backup-before-changes
anonymized: true
docs_slugs:
  - dmx-core-100/configuration/backup-and-restore
  - dmx-core-100/common-tasks/move-data-between-dmx-core-100-units
verified: docs be6f663, core v2026.914.3
---

# Download a full backup to your computer before making changes

## Original ask

> The guy who installed our lights is gone and I want to try changing some scenes. Before I break anything, how do I save a copy of everything on the box to my laptop so I can put it back the way it was?

## Goal

A full backup file of the DMX Core 100 is saved on the user's computer, and they know where to go to put it back.

## Walkthrough

```json
{
  "id": "download-backup-before-changes",
  "title": "Download a full backup to your computer",
  "steps": [
    {
      "id": "login-admin",
      "label": "Open the Web UI in a browser and log in as an admin user",
      "docsUrl": "/dmx-core-100/getting-started/connecting-to-the-web-ui/",
      "screenshotId": "login"
    },
    {
      "id": "open-backup-restore",
      "label": "Go to Backup & Restore in the sidebar",
      "docsUrl": "/dmx-core-100/configuration/backup-and-restore/#local-backup",
      "screenshotId": "backup-restore"
    },
    {
      "id": "download-backup",
      "label": "Click Download Backup, confirm with Backup, and wait (it can take several minutes) until the browser saves the ZIP file",
      "docsUrl": "/dmx-core-100/common-tasks/move-data-between-dmx-core-100-units/#method-b-web-dashboard",
      "screenshotId": "backup-restore"
    },
    {
      "id": "keep-file",
      "label": "Keep the downloaded file somewhere safe; to put it back later, use Backup & Restore → Restore backup",
      "docsUrl": "/dmx-core-100/configuration/backup-and-restore/#from-a-local-backup",
      "screenshotId": "backup-restore"
    }
  ]
}
```

## Gotchas

- **Download Backup** saves the file to the computer. **Backup to Local** stores the backup on the device only, and **Backup to Cloud** uploads it to the DMX Core cloud. For "a copy on my laptop", Download Backup is the one.
- A full backup includes cues, presets, sounds, timelines, schedules, input triggers, fixtures, zones, custom menus, users and roles, and system settings. The device IP configuration is not part of it.
- Restoring a full backup replaces everything currently on the device and restarts it (the desktop app closes and must be started again).
- The buttons only show for users with the backup permissions; the built-in Admin role has them.

## Eval checks

- Menu path is `Backup & Restore`
- Button named `Download Backup` (Backup to Local is acceptable only if it also explains how to get the file off the device)
- Mentions restoring later via `Backup & Restore` → `Restore backup`
- Does not tell them to use Factory Reset or re-flash
- Does not describe a "Create Backup" button as the page button
- Does not tell them to use MCP or the Integration API

## Gaps

- Docs wrong: `configuration/backup-and-restore.md` "Local Backup" says click **Create Backup**, then download. At v2026.914.3 the page has **Backup to Cloud**, **Backup to Local** and **Download Backup**; "Create Backup" is only the title of the confirm dialog. Source: `src/AdminSite/ClientApp/src/views/operation/BackupRestore.vue`.
- Docs wrong: same page "From a Local Backup" says click **Upload** on Backup & Restore. Upload is on the next page, reached with **Restore backup** (List of backups, Local). Source: `BackupRestore.vue` (`restoreBackup` routes to `/op/backuprestore/listbackups`), `ListBackups.vue`.
- Docs wrong: same page "Local Backup" says on the touchscreen use **Main Menu > Settings**. The touchscreen backup items are **Utilities > Local Backup** and **Utilities > Cloud Backup**. Source: navigation `uno/utilities`, `src/UnoHost/Services/MenuManager.cs` ("Local Backup", "Cloud Backup").
- The desktop app does not restart after a restore; it closes and the user must start it again. Not stated in the backup docs. Source: `src/Shared/Controllers/WebsiteController.Files.cs` (`RestoreFullBackup` Info text).

## Verification

- Log in: `getting-started/connecting-to-the-web-ui.md` "Logging In"; screenshot `login`.
- Backup & Restore page: `configuration/backup-and-restore.md` "Local Backup"; navigation `web/backuprestore` (path Web > System > Backup & Restore, actions Backup to Cloud, Backup to Local, Download Backup, Restore backup).
- Download Backup: `common-tasks/move-data-between-dmx-core-100-units.md` "Method B: Web Dashboard" (**Download Backup**); `BackupRestore.vue` button "Download Backup", confirm dialog title "Create Backup", ok button "Backup", message "...(it can take several minutes)".
- Restore later: `move-data...md` Method B "Backup & Restore > Restore Backup"; `BackupRestore.vue` button "Restore backup".
- Backup contents and IP note: `backup-and-restore.md` "What's Included in a Backup"; move-data "Notes".
- Permissions: `BackupRestore.vue` (`CREATELOCALBACKUP`, `CREATECLOUDBACKUP`, `RESTORELOCALBACKUP`/`RESTORECLOUDBACKUP`).

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
