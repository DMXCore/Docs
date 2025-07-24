---
description: >-
  Guide to backing up and restoring DMX Core 100 data using USB, web dashboard,
  or cloud backup, with steps to preserve IP configuration.
---

# Move data between DMX Core 100 units

This guide outlines three methods to copy backups between DMX Core 100 devices. Each method preserves the unit's IP configuration while restoring all other settings, including host settings, output configuration, and background images.

### Method A: USB Memory Stick

Use a USB memory stick to transfer backups between devices.

* **Format Requirement**: Ensure the USB stick is formatted as FAT32 or exFAT. The DMX Core 100 does not support formatting.
* **Backup Process**:
  1. Insert the USB stick into the first DMX Core 100.
  2. Log in as Admin and navigate to **Utilities** > **Local Backup**.
  3. Select the external storage option to save the backup to the USB stick.
* **Restore Process**:
  1. Insert the USB stick into the second DMX Core 100.
  2. Log in as Admin and go to **Utilities** > **File Explorer**.
  3. Browse to the USB stick, select the backup ZIP file, and choose **Restore**.
  4. The restore process will overwrite local data (except network settings) and restart the application.

### Method B: Web Dashboard

Transfer backups using the DMX Core 100 web dashboard.

* **Backup Process**:
  1. Log in to the web dashboard as Admin.
  2. Navigate to **Backup & Restore** and click **Download Backup** to save the backup file locally.
* **Restore Process**:
  1. Log in to the web dashboard on the second device as Admin.
  2. Go to **Backup & Restore** > **Restore Backup**.
  3. Click **Choose Files**, select the downloaded backup file, and click **Upload**.
  4. Locate the uploaded file in the **Restore** column and click its icon to start the restore process.
  5. The application will restart, restoring the unit to the backed-up data.

### Method C: Cloud Backup

Use the cloud backup feature to transfer backups between devices.

* **Backup Process**:
  1. On the first DMX Core 100, log in as Admin and go to **Utilities** > **Cloud Backup**.
  2. Select the option to create a cloud backup.
* **Restore Process**:
  1. On the second DMX Core 100, log in to the web dashboard as Admin.
  2. Navigate to **Backup & Restore** > **Restore Backup**.
  3. Change the default **Local** option to **Custom Cloud**.
  4. Enter the full serial number of the first unit (obtainable from the manufacturer, as it is not visible in the UI).
  5. Select the desired backup from the list of available cloud backups and click **Restore**.
  6. The backup will download, and the unit will restart upon completion.

### Notes

* **IP Configuration**: Backup and restore processes do not affect the unit's IP configuration.
* **Data Scope**: All other settings, including host settings, output configuration, and background images, are included in the backup and restored.
