---
title: Remote Management
description: Manage your DMX Core devices remotely from the cloud portal
---

The DMX Core portal at [portal.dmxcore.com](https://portal.dmxcore.com) is a cloud service for managing your DMX Core devices — both hardware appliances and software installations — from anywhere. View your whole fleet at a glance, open each device's Web UI remotely, monitor device health with email alerts, run remote operations, and keep software up to date.

:::note[Requirements]
Remote features require the device to have internet access and an active remote-access subscription. The portal manages devices; live DMX output (Art-Net/sACN) still happens on the local network.
:::

![DMX Core portal showing the device fleet](/assets/device/portal-devices.png)

## Signing In

Go to [portal.dmxcore.com](https://portal.dmxcore.com) and sign in (email/password or single sign-on). Your devices appear automatically once they're registered to your account — hardware appliances are linked when they come online, and software installations are claimed during activation.

## Your Device Fleet

The portal lists every device in your account with its live status:

- **Online/offline state** and last-seen time
- **Model, IP address (local and public), and MAC**
- **Running software, OS, and supervisor versions**
- **Location and group** for organizing larger installations

Use **device groups** to organize devices by site, customer, or room, and filter the fleet view accordingly.

## Remote Web UI Access

Open a secure tunnel to any device's full Web UI directly from the portal — the same interface you'd use on the local network, now reachable from anywhere with no VPN or port forwarding. See [Cloud Tunnel](/dmx-core-100/integrations/cloud-tunnel) for how the connection works.

## Health Monitoring & Alerts

The portal surfaces the device health data each unit reports, including the health of connected peripherals — for example [Advatek](/dmx-core-100/integrations/advatek-lighting) controller temperature, supply voltage, and per-output current.

- **Live status** of each device and its monitored peripherals
- **Event history** — a timestamped record of status transitions (connected, disconnected, configuration drift, out-of-range)
- **Email alerts** — configure per-device recipients to be notified automatically when a device or peripheral enters a problem state

## Remote Operations

Run common maintenance actions on a device without being on-site:

- **Reboot** the device
- **Restart services**
- **Trigger a cloud backup** of the device's configuration and content

## Software Updates

Keep devices current remotely:

- **Release channels** — subscribe a device to a channel (for example, stable) to control which releases it receives
- **Per-device pinning** — pin a specific release to a device when you need to hold a version
- **Automatic updates** — opt devices into automatic updates so they stay current without manual steps

## Teams & Roles

Invite team members to your account and assign role-based access — for example, full administrators, operators who can reboot and open tunnels, and read-only viewers. Custom roles let you grant any subset of permissions. Every action is recorded in the account's audit log.

## For Installers & Integrators

If you manage lighting for multiple clients, you can be a member of several customer accounts and switch between them in the portal. Each account's devices, team, and subscriptions stay isolated. Any support access to your account is transparently recorded in your audit log.

## Licensing & Subscriptions

Manage your licenses and subscriptions from the portal — view what each device is entitled to, purchase or renew remote-access and auto-update subscriptions, and review order history.
