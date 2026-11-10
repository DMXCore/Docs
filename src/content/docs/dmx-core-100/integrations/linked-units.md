---
title: Linked Units
description: Run several DMX Core 100 units as one show, with a Main Unit that holds the show and Satellite Units that control it from their own touchscreens
---

Several DMX Core 100 units can work together as one show. One unit is the **Main Unit**: it holds the cues, presets, custom menus, schedules and users, and it drives the lights. Every other unit is a **Satellite Unit**: a touchscreen on the wall that shows and controls the Main Unit's content. Press a custom menu button on a Satellite Unit and the Main Unit plays the cue; the highlighting, the footer and **Stop Playback** on every Satellite Unit follow what the Main Unit is doing.

Typical uses: a restaurant with a wall panel at the bar and another at the entrance, a church with a panel in the lobby and one backstage, or a house of worship where a headless Main Unit sits in the rack and the only visible units are the panels.

:::note[Requirements]
Both units need the same software version. A Satellite Unit needs no lighting license of its own. The Satellite Unit reaches the Main Unit over the network on the Main Unit's web port (80 on an appliance, 8000 on a Windows, macOS or Linux unit unless changed), so the two must be able to see each other: the same network, or a route and firewall rule between them.
:::

## What each unit does

| | Main Unit | Satellite Unit |
|---|---|---|
| DMX outputs, routing, fixtures | Yes | None; its outputs are off |
| Cues, presets, custom menus, users | Its own database | Reads and writes the Main Unit's over the link |
| Schedules, triggers, output events, MQTT, OSC, plugins, scripts, Music Mode | Runs them | Does not run them; the Main Unit does. A plugin loads on a Satellite Unit only when its manifest says `runsOnSatelliteUnit`, which a plugin for a device plugged into the unit itself can do |
| Music Mode, Blinder, Strobe | Runs here, on its audio input and fixtures | Never listens or renders: its audio input stays closed. Its buttons and its Music page turn the Main Unit's Music Mode, Blinder and Strobe on and off and show their state. The Music page appears when the Main Unit has a Music Show; the setup (audio input, room level) is done on the Main Unit |
| Touchscreen | Full, when it has one | Custom menus, playback pages and the unit's own device settings |
| Web UI | Full; the only admin surface on a headless Main Unit | Device pages only: Network, Linked Units, System, Software Updates, About, Logs. Every other page shows where the show lives and opens it on the Main Unit |
| Web API, [Integration API](/dmx-core-100/integrations/integration-api) and [MCP server](/dmx-core-100/integrations/mcp-server) | Yes | Device calls only. Calls about the show are refused with a message that gives the Main Unit's address; point integrations at the Main Unit |
| USB Stream Deck or MIDI controller plugged into the unit | Controls the Main Unit | Controls the Main Unit too, as a remote plugged into the Satellite Unit |
| Digital inputs, on the unit's own board or its I/O module | Fire its Digital Input triggers | Fire the Main Unit's Digital Input triggers that name this unit (the trigger's **Unit** field on the Main Unit's Inputs page) |
| Digital outputs, on the unit's own board or its I/O module | Driven by its Digital Output events | Driven by the Main Unit's Digital Output events that name this unit (the event's **Unit** field on the Main Unit's Outputs page). The I/O module's DMX ports and audio input stay off on a Satellite Unit |
| Lighting license | Needed, as for any unit | Not needed |

One Main Unit can have many Satellite Units. A Satellite Unit has exactly one Main Unit, and a Main Unit is never itself a Satellite Unit.

A Satellite Unit keeps its own database and settings untouched while it is linked. Turn the link off and it is a standalone unit again with everything it had before.

## Setting up a Satellite Unit

Linked Units is hidden on most installs. On each unit that takes part, turn off **Hide Linked Units** under **Device > System** in the Web UI (or under **Settings > System** on the touchscreen). Setting up a link needs the **Edit Linked Units** permission; see [Users & Roles](/dmx-core-100/configuration/users-and-roles#roles-and-permissions).

1. **Set this unit's own admin PIN first.** A Satellite Unit still has its own user table, and its own admin PIN is what signs you in to its settings when the Main Unit is unreachable. A unit whose admin PIN is still the factory default refuses to link and tells you so; change the PIN under **User Management** (or **Forgot admin PIN** on the sign-in page) and try again.
2. On the unit that becomes the Satellite Unit, open **Control & Integrations > Linked Units** in the Web UI, or **Settings > Linked Units** on the touchscreen.
3. Set **Main Unit**. **Find Units...** lists the DMX Core 100 units found on the local network with their names and addresses; pick one, or type an address yourself: an IP address (`192.168.1.20`), a host name, or a `.local` name (`dmxcore-k84pgb82.local`). Without a port the unit tries 80 and then 8000, which covers an appliance and a desktop unit on its default port; add `:port` for anything else, for example a Windows or macOS Main Unit on `192.168.1.20:8080`.
4. **Save**. The unit resolves the address and contacts the Main Unit before it keeps the setting. A Main Unit that does not answer is not saved, and the message names the step that failed (see [Troubleshooting](#troubleshooting)). The first time a unit contacts a Main Unit the answer is **Approve this Satellite Unit on the Main Unit, then restart this unit to switch it to Satellite mode**. Saving only checks and stores the address: the unit keeps running on its own cues, presets, outputs and settings until it restarts.
5. **Approve it on the Main Unit.** In the Main Unit's Web UI, **Control & Integrations > Linked Units** has a **Satellite Units** card listing every unit that has registered, pending ones first, with the address it came from, its version and when it last connected; click **Approve**. On a Main Unit with a touchscreen, **Settings > Satellite Units** lists the same units. An approved unit that has not restarted yet shows as **Approved, not connected**.
6. **Restart the Satellite Unit.** It comes back with its outputs off and its touchscreen showing the Main Unit's custom menus and playback pages. A unit that restarts before it was approved shows the Main Unit as unreachable with the reason that it has not been approved yet, and links within about ten seconds of the approval. From then on a change to a custom menu on the Main Unit shows up on the Satellite Unit within a second, and its buttons light with the Main Unit's playback.

:::note[Restart pending]
A Linked Units change takes effect at the restart, in both directions. Until then the unit keeps the mode it started in, and it says so: the Web UI shows a yellow **Restart pending** bar, and the touchscreen footer shows an amber restart mark. Tap the mark to see what the restart will do; a user with the **Edit Linked Units** permission can restart from there.
:::

:::tip
Two appliances on the same switch is the common case and needs nothing but **Find Units...** and **Approve**. Units on different VLANs or subnets do not see each other in the list, since discovery does not cross routers: type the Main Unit's IP address, or a DNS name your network resolves, instead.
:::

**Find Units...** leaves out units that are already Satellite Units, since a Satellite Unit cannot be a Main Unit. Each unit says its role on the network, so the DMX Core Connect app (see [Internet Passthrough](/dmx-core-100/integrations/internet-passthrough)) lists a Main Unit as **Main Unit** and a Satellite Unit as **Satellite of** followed by its Main Unit's name. The support package (**Download Support Package**) has a **Linked Units** section with the unit's role and, on a Satellite Unit, its Main Unit and the state of the link, or on a Main Unit its Satellite Units.

## Satellite Units on the Main Unit

The **Satellite Units** card on the Main Unit's Linked Units page, and **Settings > Satellite Units** on its touchscreen, show each unit as **Pending approval**, **Connected** or **Approved, not connected**, with a warning mark next to a version that differs from the Main Unit's. From there you can:

- **Approve** a pending unit, or **Revoke** an approved one. A revoked unit drops its link at once and goes back to **Pending approval** until it is approved again. Its touchscreen shows the Main Unit as unreachable with that reason, so an installer on site sees why a wall panel went dark.
- **Rename** a unit. The name is how the unit appears here and in the audit log.
- **Remove** a unit. The Main Unit forgets it and drops its link at once; the unit registers again as pending the next time it connects unless its Main Unit setting is cleared.

The touchscreen's **Settings > Satellite Units** page has the same: the **Approved** switch approves and revokes, the name can be edited, and **Remove Satellite Unit** removes.

Approving, revoking, renaming and removing are recorded in the Main Unit's [audit log](/dmx-core-100/configuration/audit-log). What is done on a Satellite Unit (a cue played from its touchscreen, a preset from a Stream Deck plugged into it) is recorded there as well, with the unit as the client: **Satellite Unit Lobby (192.168.1.31)**.

## While the Main Unit is unreachable

A Satellite Unit keeps trying every ten seconds and recovers on its own when the Main Unit is back. Meanwhile its touchscreen shows a **Main Unit unreachable** dialog with the address and the reason, and the Web UI shows a red bar with the same text (a grey bar with an **Open Main Unit** link while linked).

You can still reach the Satellite Unit's own settings:

- **Touchscreen**: **Sign in locally** on the dialog asks for this unit's own admin PIN (not the Main Unit's users) and opens a session that sees **Settings** and **About** only. **Dismiss for a minute** hides the dialog without signing in.
- **Web UI**: the sign-in page has a **Satellite Unit: sign in locally** card for the same PIN. The session opens the device pages (Network, Linked Units, System, Software Updates, Logs, About); every content page is refused.

Local sign-in is disabled while the unit's admin PIN is the factory default, so the factory PIN from this documentation never opens a linked unit. Set the unit's own admin PIN, or use **Forgot admin PIN**, then sign in locally.

## Turning a Satellite Unit back into a standalone unit

On the Satellite Unit, under **Linked Units**:

- **Disable Satellite Mode** keeps the Main Unit address but stops the unit from acting as a Satellite Unit. Turn it on, save, and the unit says **Satellite mode is off. Restart this unit to return it to standalone with its own cues, presets and settings.**
- **Unlink from Main Unit** (the **Unlink** button beside the Main Unit field in the Web UI, the action under Linked Units on the touchscreen) forgets the address and does the same; clearing the **Main Unit** field by hand is the same thing.

Either way the link drops at once and the unit is standalone again after the restart: its outputs are created, its schedules run and its own database is in use. Until the restart the unit shows **Restart pending**, has no outputs yet, and its Web UI stays on the device pages; sign in there with the unit's own admin PIN (**Satellite Unit: sign in locally**). The Main Unit keeps running and keeps the unit in its Satellite Units list as **Approved, not connected** until you remove it there.

To move a Satellite Unit to a different Main Unit, set the new address; if the new Main Unit cannot be reached the previous one is restored.

## Troubleshooting

The message after **Save**, the touchscreen dialog and the Web UI bar name the step that failed:

| Message | Meaning |
|---|---|
| **Could not resolve 'name'. Enter the Main Unit's IP address, or make sure both units are on the same network for .local names.** | The name did not resolve. `.local` names and bare unit names (`dmxcore-k84pgb82`) are found by local discovery, which does not cross routers or VLANs; type the IP address or a name your DNS knows. |
| **Main Unit 192.168.1.20 did not answer on port 80 or 8000; check that it is on, on the same network and that no firewall blocks the port** | The address resolved but nothing answered on the web port. Check that the Main Unit is on, that the port is right (add `:port` for a Main Unit on another port) and that a firewall on the Main Unit allows inbound connections on it. On a Windows Main Unit, allow the DMX Core 100 application through Windows Defender Firewall on private networks. |
| **Main Unit 192.168.1.20:80 speaks Linked Units protocol 0 and this unit speaks 1; update both units to the same software version** | The two units run software with different Linked Units protocols and do not link. Update both to the same version. An older unit on the other side shows **answered 426 on port 80; both units may need the same version** instead. |
| **Main Unit 192.168.1.20 answered 404 on port 80; both units may need the same version** | Something answered, but not a DMX Core 100 of the same version: the wrong device on that port, or a Main Unit that needs the same software update. |
| **Approve this Satellite Unit on the Main Unit, then restart this unit** | Nothing is wrong; the Main Unit has not approved this unit yet. |
| **The Main Unit declined this unit (its approval was removed); approve it again on the Main Unit** | The unit was revoked or removed on the Main Unit. Approve it again there. |
| **This is a Satellite Unit: cues, presets, menus and the rest of the show are on its Main Unit (http://192.168.1.20). Use the Main Unit's web UI or API for this.** | An API call, an Integration API client or an MCP client is pointed at a Satellite Unit. Point it at the Main Unit's address instead. |
| **Lost the connection to Main Unit 192.168.1.20:80 at 10:28 AM; reconnecting** | The link was up and dropped: the Main Unit restarted or the network went away. The Satellite Unit reconnects by itself. After a few tries the message becomes **Main Unit 192.168.1.20:80 has not answered since 10:28 AM; retrying**, and later messages end with **(no link since 10:28 AM)**, so you can see how long the Main Unit has been away. |
| **Main Unit 192.168.1.20 has not approved this unit yet; approve this Satellite Unit on the Main Unit** | The unit runs as a Satellite Unit and waits for approval: after a restart before it was approved, or after it was pointed at a different Main Unit. It links within about ten seconds of the approval. |
| **Different versions. The Main Unit runs version 2026.1109.1 and this unit runs 2026.1108.9; update both to the same version** | The two units are linked but run different software. The Main Unit's Satellite Units card marks the unit too. Update both to the same version; until then some pages may fail. |

A Satellite Unit whose link is down still answers on its own Web UI and touchscreen through the local sign-in above, so it can always be unlinked or re-pointed from the site.
