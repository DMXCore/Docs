---
title: Connecting to the Web UI
description: How to access the DMX Core 100 Web UI from a browser
---

The DMX Core 100 includes a built-in Web UI that provides full access to all features from any browser on the same network. The Web UI offers advanced capabilities beyond what is available on the touchscreen, including fixture control, effects, timelines, input triggers, user management, and more.

## Finding the Device IP Address

To connect to the Web UI, you need the device's IP address. You can find it on the touchscreen:

1. Navigate to **Main Menu > About** on the touchscreen
2. The IP address is displayed on the About screen

![About screen — device details and version](/assets/device/about-screen-top.png)

![About screen — network address and Cloud Tunnel status](/assets/device/about-screen-bottom.png)

:::tip
If your network supports mDNS/Bonjour, you can also access the device using its hostname (e.g., `dmxcore100.local`).
:::

## Opening the Web UI

1. Open a web browser on any device connected to the same network
2. Enter the device IP address in the address bar:
   - **HTTP**: `http://<device-ip>:8000`
   - **HTTPS**: `https://<device-ip>:8001` (recommended)
3. If using HTTPS, your browser may show a certificate warning for the self-signed certificate — this is expected. Accept the warning to continue.

<!-- SCREENSHOT: Browser address bar with device IP and login screen (dark mode) -->

## Logging In

1. Enter your **PIN** (the default admin PIN is `1111`)
2. Click **Login**

After logging in, you'll see the [Web UI Dashboard](/dmx-core-100/getting-started/web-ui-dashboard).

:::note
The Web UI uses the same user accounts and PINs as the touchscreen. If you have multiple users configured, each user sees only the features their role permits. See [Users & Roles](/dmx-core-100/configuration/users-and-roles) for details.
:::

## Auto Log-off

For security, the Web UI will automatically log you out after a period of inactivity. This timeout can be configured in **Settings > System** on the Web UI, or in **Settings** on the touchscreen.
