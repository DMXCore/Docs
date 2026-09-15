---
status: candidate
source: synthetic
invented: true
level: advanced
surface: none
date: 2026-09-15
title: Can the cloud tunnel carry Art-Net/sACN to a remote site?
slug: cloud-tunnel-does-not-carry-artnet
anonymized: true
docs_slugs:
  - dmx-core-100/integrations/cloud-tunnel
  - dmx-core-100/remote-management
  - dmx-core-100/integrations/advatek-lighting
verified: docs be6f663, core v2026.914.3
---

# Can the cloud tunnel carry Art-Net/sACN to a remote site?

## Original ask

> We maintain a DMX Core + PixLite install at a venue two hours away. Remote Access is
> on and I can open the Web UI from the portal. Can I run sACN from the grandMA onPC in
> my office through that tunnel to the PixLite on site, so I can program without
> driving out? And can I at least see if the PixLite is overheating from here?

## Goal

The user understands that the cloud tunnel carries the DMX Core Web UI, not live
Art-Net/sACN. They also learn what they can do remotely (Web UI operations, portal
health monitoring and alerts for Advatek controllers) and what still needs the local
network.

## Expected answer

- No. The cloud tunnel gives remote access to the DMX Core **Web UI only**. Art-Net and
  sACN output still needs local network connectivity, so a remote console's sACN
  stream cannot be sent through the tunnel to the PixLite.
- The tunnel is an outbound, encrypted connection from the device to the DMX Core
  cloud service. It is not a VPN or port forward for arbitrary traffic. It is switched
  on with **Enable Remote Access** under **Device > System**.
- What works remotely through the Web UI: anything the Web UI does on the device
  itself (play and stop cues and presets, check status, change configuration). The
  DMX Core then drives the PixLite locally.
- Programming that needs a live console feed has to happen on site. Another option is
  to record the show on the site network with the DMX Core (for example, with the
  desktop software on a laptop there) and move the data to the unit. The answer should
  point to Recording and Move Data Between Units, not to a tunnel workaround.
- For health: **Utilities > Device Monitor** discovers the PixLite and shows board
  temperature, supply voltage and per-output current, and firmware and port
  configuration can be pinned to catch drift. The DMX Core portal shows that health
  data remotely and can send **email alerts** when a device or peripheral enters a
  problem state.
- Portal remote features need internet access and an active remote-access
  subscription.
- Must not claim the tunnel carries Art-Net/sACN, OSC or other show-control traffic,
  that it works like a VPN, or that the PixLite's own configuration web page can be
  opened through it (the docs don't describe that).

## Gotchas

- "I can see the Web UI remotely" is easy to read as "I'm on the site network". The
  cloud tunnel docs explicitly say otherwise for DMX output.
- A password-protected PixLite needs its operator password saved on the DMX Core
  (**Device Status** → **Save password**) before temperature and current can be read.
- Advatek discovery uses multicast. Some managed switches block it (IGMP snooping).

## Eval checks

- Says clearly that the cloud tunnel does not carry Art-Net/sACN (Web UI only)
- Mentions **Enable Remote Access** under `Device > System` and/or the portal at
  portal.dmxcore.com
- Mentions `Utilities > Device Monitor` for Advatek temperature, voltage and current
- Mentions portal health monitoring / email alerts, and that remote features need a
  subscription and internet access
- Does not suggest a VPN, port forwarding or any other tunnel workaround as a DMX Core
  feature
- Does not claim the PixLite's own web page is reachable through the tunnel
- Does not tell them to use MCP or the Integration API
- Does not claim it changed a setting or opened a tunnel

## Gaps

- The docs do not describe **Expose web UI via tunnel**, a released switch on the
  Device Monitor's Edit Monitored Device dialog and on the Device Status page (nav
  `web/device-monitor` and `web/device-monitor/details`; `DeviceMonitor.vue`,
  `DeviceStatus.vue`). `src/Shared/Services/TunnelService.cs` has a separate
  `proxyHttpClient` for non-local targets, which suggests monitored peripherals'
  web UIs can be reached through the tunnel. `integrations/cloud-tunnel.md` says
  "access to the Web UI only" and `configuration/device-monitor.md` says nothing. So
  the gold answer cannot promise access to the PixLite web page even though the
  software may offer it. A Docs issue should describe the switch and where the
  exposed page opens (portal).
- `cloud-tunnel.md` › Enabling says "Enable **Remote Access**". The released field
  label is **Enable Remote Access** (nav `web/settings/system`, property
  `HostConfig.TunnelProxyEnabled`). Minor.
- `cloud-tunnel.md` does not mention the remote-access subscription requirement that
  `remote-management.md` states in its Requirements note.

## Verification

- Web UI only, DMX needs local network: `integrations/cloud-tunnel.md` › note ("The
  cloud tunnel provides access to the Web UI only. Direct DMX output (ArtNet/sACN)
  still requires local network connectivity") and `remote-management.md` ›
  Requirements. Source: `TunnelService.cs` forwards HTTP to
  `http://127.0.0.1:{HttpPort}` and WebSockets to `ws://127.0.0.1:{HttpPort}`. There
  are no Art-Net/sACN paths.
- Outbound, encrypted, Enable Remote Access: `cloud-tunnel.md` › How It Works and
  Enabling the Cloud Tunnel. Source: nav `web/settings/system` field `Enable Remote
  Access`.
- Recording on site / moving data: `playback/recording.md`,
  `common-tasks/move-data-between-dmx-core-100-units.md` (pointers only, no steps).
- Advatek health: `integrations/advatek-lighting.md` › Discovering Your Controller,
  Monitoring Device Health, Drift Detection, Authenticating. Source: nav
  `web/device-monitor` path `Web > System > Utilities > Device Monitor`;
  `web/device-monitor/details` actions `Save password`, `Start monitoring`, field
  `Monitor firmware version`.
- Portal alerts and subscription: `remote-management.md` › Health Monitoring & Alerts,
  Requirements note (portal is not in Core source).

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
