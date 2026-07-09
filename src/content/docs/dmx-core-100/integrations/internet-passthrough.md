---
title: Internet Passthrough
description: Temporarily give a DMX Core 100 internet access through a computer on the same network
---

Internet Passthrough gives a DMX Core 100 **temporary internet access through a computer on the same network** — useful when the unit is installed on an isolated network with no internet of its own (for example, a school or venue network), but you occasionally need to get it online to install software or Host OS updates.

You run a small companion app, **DMX Core Connect**, on a computer that is on the same network as the DMX Core *and* has its own internet connection (such as a laptop on Wi-Fi). While it is active, all of the DMX Core's internet traffic is routed through that computer.

## How It Works

The computer acts as a temporary gateway to the internet:

- The computer connects to the DMX Core's (isolated) network, usually by Ethernet.
- The same computer also has internet access — commonly Wi-Fi, including networks that require a login.
- DMX Core Connect shares that internet connection, and the DMX Core routes its traffic through it.

This covers **all** of the DMX Core's traffic, including software updates, Host OS updates, and the cloud connection — not just the app.

## What You Need

- A Windows or Mac computer that can be on the same network as the DMX Core (usually by Ethernet) **and** has internet access (for example, Wi-Fi).
- The **DMX Core Connect** app, available from the [downloads page](https://downloads.dmxcore.com/connect.html). It is signed and updates itself automatically.

## Using It

1. Connect the computer to the same network as the DMX Core (usually by Ethernet), and make sure it also has internet access.
2. Install and run **DMX Core Connect** on the computer.
3. In the DMX Core **Web UI**, go to **Utilities** and find the **Internet Passthrough** section.
4. Pick your computer from the list of discovered computers and select **Activate**. (If your computer isn't listed, enter its IP address manually — DMX Core Connect shows the computer's addresses in its window.)
5. Wait for the status to show green: **Internet access** and **Cloud connection** confirm the DMX Core is online. You can now install updates as usual.
6. When you're finished, select **Deactivate**.

<!-- SCREENSHOT: Web UI Utilities → Internet Passthrough, active with green status -->

:::note[Lighting output briefly restarts]
Activating and deactivating the passthrough briefly restarts the DMX Core's services, so lighting output may blink and the Web UI will reconnect after a moment. Avoid doing it in the middle of a live show.
:::

:::tip[It turns itself off]
If you simply close DMX Core Connect or unplug the computer, the DMX Core automatically reverts to its normal network settings after a few minutes — so a unit is never left pointing at a computer that has gone away.
:::

## Advanced: Use a Standard Proxy Instead

The DMX Core routes through any standard SOCKS5 proxy, so DMX Core Connect is optional. For example, with [gost](https://github.com/go-gost/gost) (free), run this on the computer:

```
gost -L socks5://:1080
```

Then enter that computer's IP address and port `1080` manually on the Internet Passthrough page.

:::caution[Windows security software]
On Windows, antivirus or security software often blocks third-party proxy tools like gost. DMX Core Connect is signed and is the recommended choice on Windows.
:::
