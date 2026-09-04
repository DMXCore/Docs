---
title: Play a Cue over OSC
description: Fire saved cues from show-control software, a console, or an OSC panel — and pick the right approach for your setup.
---

Send `/dmxcore/cue/<code>` to the device on UDP port 8000. No configuration is needed.

## Quick answer

The DMX Core 100 listens for OSC on UDP port **8000** and understands a set of built-in addresses out of the box. To play a cue, send the cue's code as the last part of the address:

```
/dmxcore/cue/ACT1
```

Replace `ACT1` with the cue's **Code / Short Name**, which you'll find on the cue's details page in the Web UI. The code must match exactly, including upper and lower case. No arguments are needed.

To stop playback:

```
/dmxcore/cuecontrol/stop
```

Point your OSC sender at the device's IP address, UDP port 8000, and you're done. The port can be changed under **Device > System > OSC Port** if 8000 is taken.

There are similar built-in addresses for presets, effects, the master dimmer, zone levels, and Control Values. The full list is in the [OSC reference](/dmx-core-100/integrations/osc-open-sound-control#built-in-address-reference).

## When to use an Input Trigger instead

The built-in addresses are fixed. If you want to choose your own address names, or you want an OSC message to do something the built-in set doesn't cover — playing a timeline or a sound, running a script, firing an output event — create an Input Trigger:

1. Go to **Control & Integrations > Input Triggers** and add a trigger.
2. Set the type to **OSC** and enter the address you want the device to listen for.
3. Choose the action, for example **Play Cue**, and pick the cue.

Built-in addresses and Input Triggers work side by side, so you can mix them freely. See [Input Triggers](/dmx-core-100/scheduling-automation/input-triggers) for the details.

## When to use an OSC Control Surface

If the OSC sender is an operator panel such as TouchOSC, rather than a cue list in show-control software, consider an OSC [control surface](/dmx-core-100/control-surfaces) instead. Register the panel under **Control & Integrations > OSC Clients**, create a Control Surface of type OSC bound to that client, and assign cues, presets, and levels to its buttons and faders in the Web UI. The device sends state back to the panel, so buttons light up with what is actually playing and faders track the current levels.

:::caution[One approach per sender]
Once a surface is bound to a panel's IP address, every OSC message from that address goes to the surface. The built-in addresses and Input Triggers no longer see them.
:::

## Nothing happens when I send the message

- Open **Control & Integrations > OSC Clients** in the Web UI. The **Discovered** section at the bottom lists every IP that has sent OSC to the device, with the message count and the last address received. Reload the page to see the latest message. If your sender's IP is not listed, check the IP address, the port, and that the sender is using UDP.
- On the touchscreen, opening an OSC input trigger shows a **Global Received** line with the last OSC message the device heard, from any sender.
- If the message is listed but the cue does not play, compare the address against the cue's Code / Short Name character by character. Case matters.
- If the sender's IP is bound to an OSC Control Surface, the message went to the surface. Either use the surface's assignments or remove the binding.
