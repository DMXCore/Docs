---
description: Install and run DMX Core 100 on Linux via the Snap Store
---

# Linux

The DMX Core 100 desktop software is available for Linux through the **Snap Store**, supporting both x64 and ARM64 architectures.

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

## Requirements

* A Linux distribution that supports [snapd](https://snapcraft.io/docs/installing-snapd) (Ubuntu, Debian, Fedora, and most others)
* x64 or ARM64 architecture

## Web Interface

The built-in web server defaults to:

| Protocol | Port |
|----------|------|
| HTTP | 5000 |
| HTTPS | 5001 |

If those ports are unavailable, a dynamic port is assigned instead. The current port number is always shown in the **About** view inside the application.

## Demo Mode

Without a license the software runs in demo mode. See [Desktop Software](README.md) for details on demo limitations and how to purchase a full license.
