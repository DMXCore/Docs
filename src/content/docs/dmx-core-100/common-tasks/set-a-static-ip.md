---
title: Set a Static IP on the Touchscreen
description: Step-by-step guide to giving a DMX Core 100 Appliance a fixed IPv4 address from the touchscreen, for standalone operation with no DHCP server on the network.
---

A DMX Core 100 Appliance gets its address from DHCP out of the box. For
standalone operation - a show network with no router or DHCP server, or an
installation where Art-Net/sACN nodes, a console and the Web UI must always
find the unit at the same address - give it a static address instead. The whole
job can be done on the touchscreen, with no computer attached.

:::note
These steps are for an Appliance. The **Network** section of the settings menu
only exists on the Appliance - the Windows, macOS and Linux desktop software
uses the host operating system's network configuration instead.
:::

## Before you start

Decide the three values first. Writing them on the inside of the rack door is
not a bad idea either.

- **IP address** - the fixed address for the unit, for example `192.168.1.50`.
  On a network that also has a DHCP server, pick an address outside the DHCP
  pool so nothing else is handed the same one.
- **Netmask** - almost always `255.255.255.0 / 24`. It must match the other
  devices on the network.
- **Gateway** - the router's address, for example `192.168.1.1`. On a closed
  show network with no router, leave this empty.

Note the unit's current address before you change anything, under
**Main Menu > About** (**Network Address**, shown as address and netmask
length, for example `192.168.1.50/24`). If something goes wrong you will know
what the unit used to answer on.

You need to be logged on with a user whose role is allowed to change network
settings - the built-in Admin role is. If the **Network** header is missing
from the settings menu, log on as Admin (see
[Admin Mode](/dmx-core-100/configuration/admin-mode)).

## Set the address

1. On the touchscreen, go to **Main Menu > Settings**.
2. Scroll down to the **Network** header and tap **Network Adapters...**.
3. The page lists every network adapter the unit has, one block per adapter,
   headed by the adapter name. Under each name you see read-only
   **Interface**, **Status** (**Connected** or **Not connected**) and
   **Address** (the current address and netmask length, or `-`). Find the
   adapter you are configuring - on a standard unit that is the wired
   ethernet port. A Wi-Fi adapter has **Network**,
   **Connect to Network...** and **Forget Current Network** items as well;
   join the wireless network first if that is the adapter you are setting up.
4. Tap **Use DHCP** to turn it **off**.
5. Tap **IP Address** and type the address on the keypad (digits and `.`),
   then accept it.
6. Tap **Netmask** and pick a value from the list. The options are labelled
   with both the dotted netmask and the prefix length, for example
   `255.255.255.0 / 24`.
7. Tap **Gateway** and enter the router address, or leave it empty for a
   network with no router.
8. Tap **Apply _adapter_ Settings** (the adapter's name is in the label) and
   confirm. The unit writes the configuration, waits a few seconds for the
   network to settle, rebinds the DMX outputs to the new address, and shows
   **Applied**.

:::caution
Applying the settings drops anything connected over that adapter - an open Web
UI session, the API, Art-Net/sACN traffic - and a running cue is rebuilt as the
outputs are rebound. Do this before the show, not during it.
:::

Each adapter has its own **Apply** item, and it applies only that adapter's IP
settings. The **Apply Network Changes** item further down the settings menu is
a different thing: it is for **Override Host Name** and **Custom NTP Server**.

## Check the result

1. Go to **Main Menu > About** and confirm **Network Address** shows the
   address you entered.
2. On the adapter page, **Address** shows the new address and **Status** is
   **Connected**.
3. From a computer on the same network, open `http://<new-address>` - see
   [Connecting to the Web UI](/dmx-core-100/getting-started/connecting-to-the-web-ui).
   The Web UI shows the same configuration under **Settings > Device >
   Network**, where it is marked **Static** rather than **DHCP**.

## Standalone networks

A few things to keep in mind on a unit that has no route to the internet:

- Put every device on the same subnet - the DMX Core 100, Art-Net/sACN nodes,
  and any computer or console you want to reach it from.
- With no gateway there is no internet access, so NTP cannot set the clock.
  When the clock is not NTP-synced, **Main Menu > Settings** grows a
  **Date / Time** header with **Current Date** and **Current Time** items -
  set them by hand, and check them if schedules or sunrise/sunset triggers
  matter. The [cloud tunnel](/dmx-core-100/integrations/cloud-tunnel)
  and [software updates](/dmx-core-100/configuration/software-updates) also
  need internet access.
- If the unit has a Wi-Fi adapter, a static wired address and a Wi-Fi
  connection to a network with internet can be combined - the wired adapter
  stays the one the DMX outputs bind to when it is connected.
- A [factory reset](/dmx-core-100/configuration/utilities#factory-reset) keeps
  the network configuration, and a
  [backup restore](/dmx-core-100/common-tasks/move-data-between-dmx-core-100-units)
  does not carry IP settings from one unit to another - each unit keeps its
  own address.

## If the unit becomes unreachable

A wrong address, netmask or gateway can leave the unit off the network. The
touchscreen still works, so the quickest fix is to go back to
**Main Menu > Settings > Network Adapters...** and either correct the values or
turn **Use DHCP** back on and apply again.

If you cannot reach the screen either, a USB stick can force the unit back to
DHCP - see
[Force DHCP mode](/dmx-core-100/troubleshooting/#force-dhcp-mode).
