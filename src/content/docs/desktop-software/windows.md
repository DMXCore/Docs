---
title: Windows
description: Install and run DMX Core 100 on Windows
---

The DMX Core 100 desktop software is available for Windows 10 and Windows 11 (x64) via a ClickOnce installer.

## Installation

Open this URL in **Microsoft Edge** to install:

[https://clickonce.dmxcore.com/DMXCore100.application](https://clickonce.dmxcore.com/DMXCore100.application)

1. Select **Open** and then **Install**.
2. You will see a security warning that the application is not verified — this is expected, as the installer is not signed with a commercial certificate. The software is safe to install.
3. When prompted, allow the application access to your network (required for DMX recording and playback).
4. If prompted, allow installation of **.NET 9** — it will be downloaded directly from Microsoft's website.

## Web Interface

The built-in web server defaults to:

| Protocol | Port |
|----------|------|
| HTTP | 5000 |
| HTTPS | 5001 |

If those ports are unavailable, a dynamic port is assigned instead. The current port number is always shown in the **About** view inside the application.

## Demo Mode

Without a license the software runs in demo mode. See [Desktop Software](index) for details on demo limitations and how to purchase a full license.
