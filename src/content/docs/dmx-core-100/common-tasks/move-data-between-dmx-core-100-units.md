---
title: Move Data Between DMX Core 100 Units
description: Guide to backing up and restoring DMX Core 100 data using USB, web dashboard, or cloud backup, with steps to preserve IP configuration.
---

This guide outlines three methods to copy backups between DMX Core 100 devices. OS-level IP/DHCP settings stay with each unit. A full restore does copy `host-config.json` (Override Host Name, Custom NTP Server, Enable Internet Passthrough), plus output configuration and background images.

### Method A: USB Memory Stick

Use a USB memory stick to transfer backups between devices.

* **Format Requirement**: Ensure the USB stick is formatted as FAT32 or exFAT. The DMX Core 100 does not support formatting.
* **Backup Process**:
  1. Insert the USB stick into the first DMX Core 100.
  2. Log in as Admin and navigate to **Utilities > Local Backup**.
  3. Confirm **Full Backup** Yes/No, then **Select backup destination (size: …)**. Pick **USB Flash Drive (Part N)**, **Micro SD Card**, or **Refresh**. If nothing is attached, the list shows **No external devices detected**.
* **Restore Process**:
  1. Insert the USB stick into the second DMX Core 100.
  2. Log in as Admin and go to **Utilities > File Explorer**.
  3. Browse to the USB stick, select the backup ZIP file, and choose **Restore as full backup (replace everything on this device)**.
  4. The restore overwrites local data (except OS IP/DHCP) and restarts the application.

### Method B: Web Dashboard

Transfer backups using the DMX Core 100 Web UI.

* **Backup Process**:
  1. Log in to the Web UI as Admin.
  2. Navigate to **Backup & Restore** and click **Download Backup** to save the backup file locally.
* **Restore Process**:
  1. Log in to the Web UI on the second device as Admin.
  2. Go to **Backup & Restore** and click **Restore backup**.
  3. Keep **Local** selected. Use **Drag and drop a file here, or click to select a file**, then **Upload**.
  4. Click the restore icon, choose **Full Backup (FULLDEVICE)** in **Select item to restore**, and confirm.
  5. On an Appliance the service restarts. On Windows, macOS, or Linux desktop, the application **closes** - start it again from the usual shortcut.

### Method C: Cloud Backup

Use the cloud backup feature to transfer backups between devices.

* **Backup Process**:
  1. On the first DMX Core 100, log in as Admin and go to **Utilities > Cloud Backup** (or Web UI **Backup to Cloud**).
  2. Confirm the cloud backup.
* **Restore Process**:
  1. On the second DMX Core 100, log in to the Web UI as Admin.
  2. Navigate to **Backup & Restore** and click **Restore backup**.
  3. Change **Local** to **Custom Cloud**.
  4. Enter the **Custom Device Serial** of the first unit.
  5. Select the desired backup from the list and restore.
  6. The backup downloads; the Appliance restarts, or the desktop app closes and must be started again.

### Notes

* **IP configuration**: OS-level IP/DHCP is not in the backup. Hostname override, custom NTP, and Internet Passthrough *are* in `host-config.json` and come across with a full restore.
* **Data scope**: Show content, users, output configuration, and background images are included.
