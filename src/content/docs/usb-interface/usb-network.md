---
title: USB Network (sACN and Art-Net)
description: Drive the DMX Core USB Interface with sACN or Art-Net over its USB cable, for lighting software that can't use a USB serial interface
---

Some lighting software has no driver for USB serial DMX interfaces but can send **sACN** or **Art-Net**. QLab is one example. For that software, the USB Interface can also show up on the computer as a **USB network adapter**. It takes sACN and Art-Net over the same USB cable and sends them out on its DMX ports. You don't need a network switch, an Ethernet node or any network setup.

The USB network is a setting, off by default. It needs USB Interface firmware 1.0.24 or later and a current [DMX Core USB Interface Utility](/usb-interface/config-utility/). The list of received universes needs firmware 1.0.25 or later.

## Turning it on

1. Open the [USB Interface Utility](/usb-interface/config-utility/) and select the interface.
2. In the right-hand pane, choose **USB network** (next to the DMX levels and RDM).
3. Switch it to **USB network on** and click **Save and restart**.

The interface restarts and comes back as a network adapter as well as its serial port or ports. Software that has the serial port open loses it for a few seconds while the interface restarts. The serial ports keep working with the network on, including [a serial port per DMX port](/usb-interface/ports-and-wiring/#a-serial-port-per-dmx-port). There is no driver to install on Windows 11 or macOS.

### Addresses

The interface hands the computer its address itself, so there is nothing to set up. The pane shows both addresses:

* **Device**: the interface's own address.
* **Computer**: the address the computer gets on this adapter. The pane says when the computer has it.

Both start with `169.254`.

These are link-local addresses with no router, so the computer never sends other traffic through the interface, and your internet connection and other networks are not affected. Each interface keeps the same addresses every time.

## Universes

Each DMX port has its own **sACN universe** and its own **Art-Net Port-Address**. Set them in the **USB network** pane and click **Save**. A universe change takes effect right away, without a restart.

| Port | sACN universe (default) | Art-Net Port-Address (default) |
| --- | --- | --- |
| A | 1 | 0 (0.0.0) |
| B | 2 | 1 (0.0.1) |

* sACN universes go from 1 to 63999.
* Art-Net Port-Addresses go from 0 to 32767. The pane also shows them as Net.SubNet.Universe.

:::caution[Art-Net counts from 0]
Art-Net counts universes from 0, and sACN counts from 1. In many programs, "Universe 1" in Art-Net is Port-Address 0, the default for port A. If nothing comes out, check the **Received** list described below.
:::

## Setting up your lighting software

Set up an sACN or Art-Net output in your lighting software, on the universe of the port you want. Then do one of these:

* **Send to the device address** (unicast): enter the interface's **Device** address from the pane as the destination. This works on every computer.
* **Pick the adapter**: if the software lets you choose a network interface, choose the one with the **Computer** address. sACN multicast and Art-Net broadcast then reach the interface.

The interface takes sACN by multicast or unicast, and Art-Net by unicast or broadcast. It answers Art-Net discovery (ArtPoll) as **DMX Core** followed by its serial number, so software that discovers Art-Net devices can list it.

### Windows

Windows sends multicast and broadcast only on the network adapter the software picks, so point the software at the interface as described above. Windows also calls the network "Unidentified network" and puts it in the **Public** profile. In that profile, the firewall blocks replies coming back to lighting software that isn't allowed on public networks, such as replies to Art-Net discovery.

Sending DMX works either way. For discovery, the **USB network** pane has a **Make private** button that sets this network to Private. Windows asks for administrator rights. You can also allow your lighting software on public networks in Windows Firewall instead.

## Who drives a port

There is no merging. **Whichever source sent last drives the port**: the serial port, sACN or Art-Net, from any sender. If two senders, or a sender and the serial port, send to the same port at the same time, they take turns frame by frame, so use one source per port.

When a network sender stops, the port goes back to what the serial side has it do. A sender counts as stopped when sACN stops for 2.5 seconds or sends its stream-terminated message, or when Art-Net stops for 6 seconds. With no program on the serial port, the port stops sending, and fixtures do what they do when DMX is lost.

A port set to **Input** in [Settings](/usb-interface/settings/#port-direction) ignores the network.

## Seeing what arrives

While the network is on, the **USB network** pane shows:

* **Per port**, the senders it has heard: protocol, source name, address, sACN priority, frames per second, whether the sender is still sending, and lost frames. The port the interface is sending from is marked. A port that hasn't had anything says **Nothing has sent to this port yet.**
* **Received** (firmware 1.0.25 or later): the universes the interface has received lately, and which port takes each. A universe that isn't on any port says **Not on any port**. That usually means the software and the interface disagree on the universe. Click **Use on port A** or **Use on port B** to fill it in, then **Save**.
* The license, the device and computer addresses, and counters for packets and answered ArtPolls.

The port cards on the left also get a **Network** row that says who drives the port.

## License

The USB network is included with DMX Core hardware. It is part of the board's [activation](/usb-interface/installing-firmware/#activating). A board activated before firmware 1.0.24 needs to be activated once more to get it: the utility's banner says the license doesn't include the USB network. Click **Activate** with the computer online. Until then, the adapter appears but nothing from the network goes out.

## Tested with

| Software | Platform | Result |
| --- | --- | --- |
| Lightkey | macOS | Works with both ports on sACN, or both on Art-Net. Mixing them (sACN to one port and Art-Net to the other) did not work in Lightkey. |
| sACN and Art-Net test senders | Windows 11 | Works: sACN multicast and unicast, Art-Net unicast and broadcast, and Art-Net discovery. |

Other platforms and software have not been tested yet. If you try it, we'd like to hear how it went: [open an issue on GitHub](https://github.com/DMXCore/USBInterface-Public/issues).

## Not in this version

* DMX input sent out to the network. Input still goes to the computer over the serial port.
* RDM over Art-Net. RDM works over the serial port and in the [utility](/usb-interface/config-utility/#rdm).
* Merging or sACN priority between senders.
* sACN universe discovery and sync, and Art-Net sync and remote configuration.
* A web page on the interface.
