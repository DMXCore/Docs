---
status: candidate
source: synthetic
invented: true
level: intermediate
surface: touchscreen
date: 2026-09-15
title: Copy a show to a second unit with a USB stick on the touchscreen
slug: copy-show-to-second-unit-usb-touchscreen
anonymized: true
docs_slugs:
  - dmx-core-100/common-tasks/move-data-between-dmx-core-100-units
  - dmx-core-100/configuration/backup-and-restore
verified: docs be6f663, core v2026.914.3
---

# Copy a show to a second unit with a USB stick on the touchscreen

## Original ask

> We have two DMX Core 100s in the same building. The second one is on a separate network I can't reach from my laptop. Can I clone the first one onto the second using a USB stick, just from the screens? I don't want the second unit to lose its own static IP.

## Goal

The full show from unit 1 is saved to a USB stick with the touchscreen and restored on unit 2 with the touchscreen, while unit 2 keeps its own IP configuration.

## Walkthrough

```json
{
  "id": "copy-show-to-second-unit-usb-touchscreen",
  "title": "Copy a show to a second unit with a USB stick",
  "steps": [
    {
      "id": "format-usb",
      "label": "Use a USB stick formatted as FAT32 or exFAT (the DMX Core 100 cannot format it) and insert it into the first unit",
      "docsUrl": "/dmx-core-100/common-tasks/move-data-between-dmx-core-100-units/#method-a-usb-memory-stick",
      "screenshotId": null
    },
    {
      "id": "admin-login-1",
      "label": "Log in as Admin on the first unit's touchscreen",
      "docsUrl": "/dmx-core-100/configuration/admin-mode/",
      "screenshotId": "admin-login-keypad"
    },
    {
      "id": "local-backup-usb",
      "label": "Go to Utilities → Local Backup, confirm the full backup, and pick the USB stick as the backup destination",
      "docsUrl": "/dmx-core-100/common-tasks/move-data-between-dmx-core-100-units/#method-a-usb-memory-stick",
      "screenshotId": "uno-utilities"
    },
    {
      "id": "admin-login-2",
      "label": "Move the USB stick to the second unit and log in as Admin on its touchscreen",
      "docsUrl": "/dmx-core-100/configuration/admin-mode/",
      "screenshotId": "admin-login-keypad"
    },
    {
      "id": "file-explorer-restore",
      "label": "Go to Utilities → File Explorer, open the USB stick, select the backup ZIP file and choose Restore",
      "docsUrl": "/dmx-core-100/common-tasks/move-data-between-dmx-core-100-units/#method-a-usb-memory-stick",
      "screenshotId": "uno-utilities"
    },
    {
      "id": "wait-restart",
      "label": "Wait for the restore to finish and the application to restart; the second unit keeps its own network settings",
      "docsUrl": "/dmx-core-100/common-tasks/move-data-between-dmx-core-100-units/#notes",
      "screenshotId": null
    }
  ]
}
```

## Gotchas

- The restore overwrites everything on the second unit (cues, presets, users, settings). Back up the second unit first if anything on it matters.
- On the touchscreen the restore option reads **Restore as full backup (replace everything on this device)**. The same list can also offer importing single cues from the backup; those are not a full copy.
- **Utilities > Local Backup** on the touchscreen writes to external storage only (USB stick or micro SD card). If the stick is not listed, it is not detected or not FAT32/exFAT; the list has a Refresh option.
- IP configuration is not affected by backup and restore, so the static IP on unit 2 stays.
- Both backup and restore need an admin (or a role with the backup, restore and File Explorer permissions); the menu items are hidden otherwise.

## Eval checks

- Backup path is `Utilities > Local Backup`
- Restore path is `Utilities > File Explorer`, then the USB stick and the backup ZIP
- Mentions FAT32 or exFAT
- Says the restore replaces the data on the second unit and restarts the application
- Says the IP configuration is kept
- Does not send them to the Web UI (the user said the second unit is not reachable from a laptop), or only mentions it as an alternative
- Does not tell them to re-flash or Factory Reset the second unit first
- Does not tell them to use MCP or the Integration API

## Gaps

- Docs incomplete: `common-tasks/move-data-between-dmx-core-100-units.md` Method A says "Select the external storage option". At v2026.914.3 the flow is a **Full Backup** Yes/No confirm with a size and time estimate, then **Select backup destination (size: …)** listing **USB Flash Drive (Part N)** / **Micro SD Card (Part N)**, **Refresh**, or **No external devices detected**. There is no internal-storage option on the touchscreen. Source: `src/UnoHost/Services/MenuManager.cs` ("Local Backup" TappedAction, `GetExternalStorage`).
- Docs label: Method A says choose **Restore**; the touchscreen action is **Restore as full backup (replace everything on this device)**, followed by "Restore complete, device will restart". Source: `src/UnoHost/ViewModels/FileExplorerViewModel.cs` (`.zip` case).
- Docs wrong: `configuration/backup-and-restore.md` "Local Backup" puts the touchscreen backup under **Main Menu > Settings**, and "USB Backup"/"From USB" say only "use the backup/restore feature" in admin mode. The items are **Utilities > Local Backup** and **Utilities > File Explorer**. Source: navigation `uno/utilities`, `uno/utilities/file explorer/{storage location}`.
- Possible docs discrepancy (needs confirmation): the docs say network settings are not in a backup. A full restore copies `host-config.json` from the backup wholesale, and that file holds **Override Host Name**, **Custom NTP Server** and **Enable Internet Passthrough** (fields the Factory Reset section calls network settings). The OS-level IP/DHCP configuration is not in it. Source: `src/Shared/Services/StorageManager.cs` (restore "Host Config" block), `src/BusinessObject/HostConfig.cs` (`OverrideHostName`, `CustomNtpServer`, `InternetPassthroughEnabled`).
- Screenshot missing: no touchscreen screenshot of the backup destination picker or the File Explorer restore action; `uno-utilities` shows the Utilities menu only.

## Verification

- FAT32/exFAT, no formatting: `move-data...md` Method A "Format Requirement"; `backup-and-restore.md` "USB Backup".
- Admin login on touchscreen: `configuration/admin-mode.md`; screenshot `admin-login-keypad`.
- Utilities → Local Backup: `move-data...md` Method A backup step 2; navigation `uno/utilities` item "Local Backup" (description "Create full local backup", permission CreateLocalBackup); `MenuManager.cs` confirm "Full Backup" and destination picker.
- Utilities → File Explorer → USB → ZIP → Restore: `move-data...md` Method A restore steps 2–3; navigation `uno/utilities` item "File Explorer" (permission FileExplorer) and `uno/utilities/file explorer/{storage location}` ("USB flash drive … cues, schedules and triggers from a backup"); `FileExplorerViewModel.cs` action "Restore as full backup (replace everything on this device)" (permission RestoreLocalBackup).
- Overwrites and restarts, IP kept: `move-data...md` Method A restore step 4 and "Notes"; `FileExplorerViewModel.cs` "Restore complete, device will restart" then `RestartService()`.

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
