---
title: Windows
description: Install and run DMX Core 100 on Windows
---

The DMX Core 100 desktop software is available for Windows 10 and Windows 11 (x64) as a signed, self-updating installer.

## Installation

Download and run the installer:

[Download DMX Core 100 for Windows](https://downloads.dmxcore.com/velopack/win/DMXCore100App-stable-Setup.exe)

1. Run the downloaded **DMXCore100App-stable-Setup.exe**.
2. The installer is signed by **DMX Pro Sales**. For a brand-new release, Windows SmartScreen may still show a "Windows protected your PC" prompt until the signature accumulates reputation — if it appears, select **More info** and then **Run anyway**.
3. When prompted, allow the application access to your network (required for DMX recording and playback).
4. The app installs and launches automatically, and keeps itself up to date after that.

## Web Interface

The built-in web server defaults to:

| Protocol | Port |
|----------|------|
| HTTP | 8000 |
| HTTPS | 8001 |

If those ports are unavailable, a dynamic port is assigned instead. The current port number is always shown in the **About** view inside the application.

## Wire-Accurate Recording Timestamps

When [recording](/dmx-core-100/playback/recording), DMX Core 100 timestamps every incoming packet. On the DMX Core 100 hardware unit, packets are timestamped by the operating system the moment they arrive, so recorded timing is wire-accurate even under heavy load. Windows supports the same kernel timestamping, but it is off by default and must be enabled on the network adapter.

To enable it, run in an elevated (administrator) PowerShell:

```powershell
Set-NetAdapterAdvancedProperty -Name "Ethernet" -RegistryKeyword "*SoftwareTimestamp" -RegistryValue 1
```

- Replace `Ethernet` with your adapter's name (`Get-NetAdapter` lists them).
- The value `1` enables timestamping of received packets (**RxAll**). The adapter briefly resets when the setting changes.
- Requires Windows 10 version 2004 or later, and a network driver that supports the setting. If `Get-NetAdapterAdvancedProperty -Name "Ethernet" -RegistryKeyword "*SoftwareTimestamp"` returns nothing, the driver does not support it.

Recording works either way: without this setting the software falls back to timestamping packets as the application reads them, which is accurate on a lightly loaded system but can drift by a few milliseconds under load. The application log shows which mode was actually used when a recording stops (`Timestamps: kernel (wire-accurate)` or `user space`).

## Demo Mode

Without a license the software runs in demo mode. See [Desktop Software](index) for details on demo limitations and how to purchase a full license.
