---
status: candidate
source: synthetic
invented: true
level: newbie
surface: both
date: 2026-09-15
title: Find the device IP and log in to the Web UI for the first time
slug: find-ip-and-log-in-to-web-ui
anonymized: true
docs_slugs:
  - dmx-core-100/getting-started/connecting-to-the-web-ui
  - dmx-core-100/getting-started/quick-start
  - dmx-core-100/configuration/users-and-roles
verified: docs be6f663, core v2026.914.3
---

# Find the device IP and log in to the Web UI for the first time

## Original ask

> just put the dmx core in the wall and the screen came on. how do i get to the setup page from my laptop?? is there a firmware program i have to download or is it a website. and whats the password

## Goal

The user reads the device IP on the touchscreen, opens the built-in Web UI in a
browser on the same network, and logs in as the Administrator with the default
PIN `1111`.

## Walkthrough

```json
{
  "id": "find-ip-and-log-in-to-web-ui",
  "title": "Find the device IP and log in to the Web UI",
  "steps": [
    {
      "id": "find-ip",
      "label": "On the touchscreen, open Main Menu → About and note the IP address shown under Network Address (the part before the /, e.g. 192.168.1.50 from 192.168.1.50/24)",
      "docsUrl": "/dmx-core-100/getting-started/connecting-to-the-web-ui/#finding-the-device-ip-address",
      "screenshotId": "about-screen-bottom"
    },
    {
      "id": "open-web-ui",
      "label": "On a laptop on the same network, open http://<device-ip>:8000 in a browser (or https://<device-ip>:8001 and accept the self-signed certificate warning)",
      "docsUrl": "/dmx-core-100/getting-started/connecting-to-the-web-ui/#opening-the-web-ui",
      "screenshotId": "login"
    },
    {
      "id": "log-in",
      "label": "Select the Administrator user, enter the default PIN 1111, and click Login",
      "docsUrl": "/dmx-core-100/getting-started/connecting-to-the-web-ui/#logging-in",
      "screenshotId": "login"
    },
    {
      "id": "change-default-pin",
      "label": "Change the default PIN soon after setup under User Management → Users",
      "docsUrl": "/dmx-core-100/configuration/users-and-roles/#default-account",
      "screenshotId": "users-list"
    }
  ]
}
```

## Gotchas

- Nothing needs to be downloaded for the hardware unit: the Web UI is built in and
  runs in any browser. (Desktop software is a separate way to run DMX Core 100 on a
  PC, not a setup tool for the wall unit.)
- The port matters: `:8000` for HTTP, `:8001` for HTTPS. The bare IP without a port
  does not open the Web UI.
- The laptop must be on the same network as the device.
- The About screen shows the address with its network prefix (e.g. `/24`); type only
  the IP part in the browser.
- HTTPS shows a certificate warning for the self-signed certificate. That is expected.
- The hostname tip (`dmxcore100.local`) only works where mDNS/Bonjour works.
- The touchscreen and the Web UI use the same accounts and PIN.

## Eval checks

- Tells them to read the IP at `Main Menu > About` on the touchscreen
- Gives `http://<device-ip>:8000` and/or `https://<device-ip>:8001` (port included)
- Says the default admin PIN is `1111`
- Mentions selecting the user (Administrator) and clicking **Login**
- Recommends changing the default PIN (`User Management > Users`)
- Does not tell them to download or flash firmware, or install an app, to reach the Web UI
- Does not invent a default username/password pair such as admin/admin
- Does not tell them to use MCP or the Integration API

## Gaps

- The docs don't say the About screen's **Network Address** includes the netmask
  prefix (`address/prefix`, e.g. `/24`). Source:
  `src/UnoHost/ViewModels/AboutViewModel.cs` (the `"Network Address"` item formats
  `{Address}/{NetmaskLength}`). Docs page: `getting-started/connecting-to-the-web-ui.md`
  › Finding the Device IP Address.
- `getting-started/main-menu.md` describes **Help** only as "Quick links to
  documentation". The released Help screen also shows the Web UI address and the
  default PIN (nav `uno/help`, `src/UnoHost/ViewModels/HelpViewModel.cs`). That is
  another place a newbie can find the address.
- `getting-started/home-screen.md` does not mention the **Open Web UI** and
  **Getting started** actions that nav `uno/home` (`HomeViewModel.cs`) lists. I did
  not verify whether they appear on the Appliance.
- On the Appliance, the About screen has no "Web UI" row with the ports; that row is
  skipped on LinuxBalena (`AboutViewModel.cs`). The row for the default PIN only
  appears while the database is empty. So the port has to come from the docs, not
  from the About screen.

## Verification

- Step `find-ip`: `getting-started/connecting-to-the-web-ui.md` › Finding the Device
  IP Address (**Main Menu > About**). Source: nav `uno/mainmenu` item **About** →
  `uno/about`. `AboutViewModel.cs` item label `Network Address` under the "Network
  settings" header.
- Step `open-web-ui`: same page › Opening the Web UI (ports 8000 / 8001,
  certificate warning). Source: `src/Common/Consts.cs` `DefaultHttpPort = 8000`,
  `DefaultHttpsPort = 8001`.
- Step `log-in`: same page › Logging In (select user, PIN `1111`, **Login**). Source:
  nav `web/login` (actions Back, Login), `src/AdminSite/ClientApp/src/views/pages/Login.vue`
  (user dropdown shows "Name (Role)", "Pin code" field, **Login** button, hint
  "Default administrator PIN is 1111" on an empty database). Default user
  `Name = "Administrator"`, `Pin = "1111"` in `src/DataAccess/DataManager.cs`.
- Step `change-default-pin`: `configuration/users-and-roles.md` › Default Account.
  Source: nav `web/users` / `web/users/details` (field **Pin**).

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
