---
title: macOS
description: Install and run DMX Core 100 on macOS
---

The DMX Core 100 desktop software is available for macOS in two variants:

* **ARM64** — for Macs with Apple Silicon (M1 or later)
* **x64** — for Macs with Intel processors

## Download

Download the version that matches your Mac:

* [Apple Silicon (M1 or later)](https://downloads.dmxcore.com/velopack/osx-arm64/DMXCore100App-stable-Setup.pkg)
* [Intel](https://downloads.dmxcore.com/velopack/osx-x64/DMXCore100App-stable-Setup.pkg)

If you are unsure which version to download, click the Apple menu () > **About This Mac**. If it says "Apple M1" (or M2, M3, etc.) download the Apple Silicon version. If it shows an Intel processor, download the Intel version.

## Installation

1. Open the downloaded `.pkg` file and follow the installer.
2. The app is signed and notarized by **DMX Pro Sales**, so macOS Gatekeeper allows it to run normally — no security override needed.
3. Launch **DMX Core 100** from your **Applications** folder. It keeps itself up to date after that.

## Web Interface

The built-in web server defaults to:

| Protocol | Port |
|----------|------|
| HTTP | 8000 |
| HTTPS | 8001 |

If those ports are unavailable, a dynamic port is assigned instead. The current port number is always shown in the **About** view inside the application.

## Demo Mode

Without a license the software runs in demo mode. See [Desktop Software](index) for details on demo limitations and how to purchase a full license.
