---
title: Linux
description: Install and run DMX Core 100 on Linux via the Snap Store
---

The DMX Core 100 desktop software is available for Linux through the **Snap Store**, supporting both x64 and ARM64 architectures — including the **Raspberry Pi 4 and newer**.

## Install via Snap Store

[![Get it from the Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/dmxcore100)

Or install from the terminal:

```bash
sudo snap install dmxcore100
```

For the latest edge release:

```bash
sudo snap install dmxcore100 --edge
```

## Updates

The Snap install has **no** Web UI **Utilities > Releases** page. snapd refreshes the app on its own schedule, and **Utilities > System** reports that updates are managed by the Snap Store.

To refresh immediately:

```bash
sudo snap refresh dmxcore100
```

The Appliance and Windows/macOS desktop installs use an in-app picker instead — see [Software Updates](/dmx-core-100/configuration/software-updates).

## Requirements

* A Linux distribution that supports [snapd](https://snapcraft.io/docs/installing-snapd) (Ubuntu, Debian, Fedora, and most others)
* x64 or ARM64 architecture — ARM64 covers the Raspberry Pi 4 and newer (Raspberry Pi OS 64-bit or another 64-bit distribution)

## Web Interface

The built-in web server defaults to:

| Protocol | Port |
|----------|------|
| HTTP | 8000 |
| HTTPS | 8001 |

If those ports are unavailable, a dynamic port is assigned instead. The current port number is always shown in the **About** view inside the application.

## Demo Mode

Without a license the software runs in demo mode. See [Desktop Software](index) for details on demo limitations and how to purchase a full license.
