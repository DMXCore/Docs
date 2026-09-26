---
title: Troubleshooting
description: The status LED, status.txt, and what to check when nothing moves
---

## The status LED

The RGB LED under the lid's light pipe shows what the controller is doing:

| LED | Meaning |
|---|---|
| Fast amber flashing (5 per second) | Starting up or looking for the Core: no link, no address yet, or the Core not found yet |
| Fast red flashing that does not stop | `config.txt` was refused - `status.txt` says why - or an error that stops the device |
| Slow green flashing (once every 2 seconds) | Running: Core found, sending |
| A brief flicker | A message went out |

`led_brightness` in `config.txt` sets how bright it is; 0 turns it off.

## status.txt

Open the controller's web page, `http://<name>.local/`, or plug in over USB-C and open `status.txt` on the POECONTROL drive; both show the same status, and the page has the log as well. It says, in words, what the LED shows and why: the state, the controller's address, the server it settled on and its address, the firmware version, the reason for the last restart, and the result of the last config change or firmware update. When something is wrong this is the first place to look.

## Nothing moves

Work down the list; each line rules out the ones above it.

| Check | Where | If not |
|---|---|---|
| The LED is flashing green | The lid | Amber: no link, no DHCP lease, or the Core not found - see `status.txt`. Red: the config was refused, and `status.txt` names the line |
| The controller appears under **Recent OSC Senders** with a growing message count when the knob is turned | Core Web UI > **Control & Integrations > OSC Clients**, bottom of the page | Packets are not arriving: wrong Core in `server`, a firewall, or the Core and the controller on different networks. `servers.txt` shows what the controller can see |
| The Control Value steps | **Control & Integrations > Control Values** | The code in `config.txt` does not match the code on the Core. Codes must match exactly |
| The driven target moves | The Faders page | **Drives** on the Control Value is empty, or something else owns the target - a running cue, the Faders page |

## Other symptoms

| Symptom | Cause |
|---|---|
| Steps of the wrong size | Step Size on the Control Value. Nothing on the controller sets it |
| The knob turns the wrong way | `invert = 1` in the knob's section |
| A step every other click | A half-step encoder, whose pulses per revolution are half its detents. Use one with a full cycle per detent, such as the encoder kit's |
| Level moves, then springs back | Something else is driving the same target - a cue, or the Faders page |
| The push switch or a button does nothing | It sends an address of its own, which needs an Input Trigger on the Core, or one of the Core's built-in addresses in `send`. See [DMX Core 100 setup](../dmx-core-100-setup/) |
| The config change did not apply | Red LED: the file was refused whole. `status.txt` names the problem. A save that lands in the one or two seconds while the drive refreshes itself can also fail; save again |
| Several Cores, none used | With more than one Core on the network, `server` has to name one. `servers.txt` lists them |
| The Core is on another subnet | mDNS does not cross routers. Put the Core's IP address in `server`, and if the controller has a fixed address, set its `gateway` |
| The controller's name did not change | A new `name` takes effect at the next restart - unplug power for a moment |

## Restarts

A hardware watchdog restarts the controller if its main loop stops for 4 seconds, and a crash is recorded before the restart. Either way the next boot says what happened on the `started` line of `status.txt`. If a unit restarts on its own more than once, copy that line and [contact support](https://dmxcore.com/about#contact).

## Factory reset

Delete every line in `config.txt` except the comments, save, and eject: the controller goes back to defaults - DHCP, no server, knob 1 on port 1 stepping `VOL`. Reinstalling firmware does not clear settings; see [Firmware updates](../firmware-updates/#recovery).
