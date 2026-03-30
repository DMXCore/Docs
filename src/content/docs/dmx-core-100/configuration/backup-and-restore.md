---
title: Backup & Restore
description: Back up and restore your configuration and content
---

The DMX Core 100 provides several ways to back up your data (cues, presets, schedules, settings, and more) and restore it — either on the same device or a different one.

## Backup Methods

### Local Backup

Create a backup file that can be downloaded and stored on your computer or USB drive.

In the **Web UI**, go to **Backup & Restore** and click **Create Backup**. You can then download the backup file.

On the **touchscreen**, go to **Main Menu > Settings** and use the backup option (admin mode required).

### Cloud Backup

Back up your data to the DMX Core cloud (api.dmxcore.com). Cloud backups can be restored on any DMX Core 100 device.

In the **Web UI**, go to **Backup & Restore** and select the cloud backup option.

<!-- SCREENSHOT: Web UI backup & restore page -->

### USB Backup

You can also back up to a USB memory stick:

1. Insert a FAT32 or exFAT formatted USB drive
2. On the touchscreen, go to admin mode and use the backup feature
3. The backup file is saved to the USB drive

## Restoring

### From a Local Backup

1. In the Web UI, go to **Backup & Restore**
2. Click **Upload** and select your backup file
3. The system will restore the data and restart

### From Cloud Backup

1. In the Web UI, go to **Backup & Restore**
2. Select **Cloud Restore**
3. Choose the backup to restore from the list

:::note
You can restore a cloud backup to a different DMX Core 100 device by specifying the serial number of the device the backup was created on.
:::

### From USB

1. Insert the USB drive with the backup file
2. On the touchscreen, go to admin mode and use the restore feature

## S-Play Import

The DMX Core 100 can import backup files from Enttec S-Play devices, making migration straightforward.

## Demo Data

The system includes a demo data import feature that creates sample fixtures, cues, presets, timelines, and schedules. This is useful for testing and learning the system before setting up your own data.

In the **Web UI**, you can import demo data from the utilities section.

## What's Included in a Backup

A full backup includes:

- All cues, presets, sounds, and timelines
- Schedules and input triggers
- Fixture configuration and zones
- Custom menu configuration
- User accounts and roles
- System settings

:::note
Network settings (IP address, etc.) are not included in backups by default, since they are typically specific to each installation.
:::

For moving data between units, see [Move Data Between DMX Core 100 Units](/dmx-core-100/common-tasks/move-data-between-dmx-core-100-units).
