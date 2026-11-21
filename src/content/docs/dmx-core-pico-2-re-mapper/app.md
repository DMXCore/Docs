---
title: DMX Core Re-Mapper app
description: Install and use the DMX Core Re-Mapper app to watch the DMX input and output, edit and save the mapping, activate the Re-Mapper and update its firmware
---

The DMX Core Re-Mapper app is the tool for setting up a DMX Core Pico 2 Re-Mapper. It shows the DMX going in and the re-mapped DMX going out, edits and saves the mapping, activates the Re-Mapper and updates its firmware. It runs on **Windows, macOS and Linux**, and updates itself when a new version is published.

The app works with Re-Mapper firmware 1.4 or later. With older firmware it offers the firmware update first; see [Updating the firmware](#updating-the-firmware).

The older text-menu tool is still available, and is the one to use on 32-bit Windows. See [Config Utility (command line)](/dmx-core-pico-2-re-mapper/config-utility/).

## Install

### Windows

Download and run [DMXCoreRemapper-Setup.exe](https://downloads.dmxcore.com/velopack/remapper/win/DMXCoreRemapper-Setup.exe) (64-bit Windows). It installs the app and starts it.

### macOS

Download and open the installer for your Mac (Apple menu > **About This Mac** shows which one you have):

* [Apple silicon (M1 or later)](https://downloads.dmxcore.com/velopack/remapper/osx-arm64/DMXCoreRemapper-osx-arm64-Setup.pkg)
* [Intel](https://downloads.dmxcore.com/velopack/remapper/osx-x64/DMXCoreRemapper-osx-x64-Setup.pkg)

### Linux (x86_64)

Paste this into a terminal:

```bash
curl -fsSL https://downloads.dmxcore.com/velopack/remapper/linux-x64/install.sh | sh
```

It puts the app in `~/Applications`, adds it to the applications menu and starts it. Or download the [AppImage](https://downloads.dmxcore.com/velopack/remapper/linux-x64/DMXCoreRemapper-x86_64.AppImage) yourself and make it executable.

The app talks to the Re-Mapper over its USB serial port, so it needs no libusb or other driver.

The first time the app sees a Re-Mapper, Linux may not let it open the serial port yet. Click **Allow access** and enter your password; the app adds the udev rule Linux needs. See [Linux: the Re-Mapper does not show up](#linux-the-re-mapper-does-not-show-up).

### Updates

The app checks for a new version every time it starts. When one is ready, a **Restart to update** button appears at the bottom of the window. **About > Check for updates** checks right away.

## Connecting

Plug the Re-Mapper into the computer with a USB-C cable. It shows up in the app by itself. With more than one Re-Mapper plugged in, pick one at the top.

:::caution[Power from USB only]
While the Re-Mapper is connected to a computer, power it from USB only and leave the power input (7-28VDC) disconnected. See [Errata](/dmx-core-pico-2/errata/).
:::

Only one program can use the Re-Mapper at a time. If the app says another program has the device open, close the command-line Config Utility or the terminal program that is using its serial port.

## The main window

The top of the window shows the Re-Mapper's serial number, firmware version and serial port. The buttons:

* **Identify** blinks the Re-Mapper's LEDs for 5 seconds, to tell which one you are working on.
* **Settings…** shows the settings the firmware has. Firmware 1.4 has none yet.
* **Firmware…** shows the installed firmware and installs a new one. See [Updating the firmware](#updating-the-firmware).
* **About** shows the app's version, checks for updates and opens the log folder.

Problems and things to do are shown as banners under the buttons: a Re-Mapper that is [not activated](#activation), firmware that has to be updated, or a board in its boot loader.

Under the banners, **Monitor** and **Mapping** switch between the two views.

### Monitor

![The Monitor view: DMX input and re-mapped output side by side](/assets/dmx-core-pico-2-re-mapper/app-monitor.png)

The **Monitor** view shows the DMX levels of all 512 channels, live, side by side:

* **DMX input (port A)**: what the Re-Mapper receives.
* **Re-mapped output (port B)**: what it sends after the mapping.

The line above each side shows the number of channels in the frame, the frame rate in frames per second, and whether the port is receiving or sending now. When the input signal goes away, the last frame stays on screen, dimmed, and the line says how long there has been no signal.

**Digital inputs** at the top right shows the four digital inputs: a dot lights up while its input is on.

## Editing the mapping

![The Mapping view with four outputs selected and unsaved changes](/assets/dmx-core-pico-2-re-mapper/app-mapping.png)

The **Mapping** view lists the 512 output channels. For each one, **Kind** and **Source** show where its level comes from:

| Kind | Meaning |
| --- | --- |
| 1:1 | The output takes the input channel with the same number. |
| Input | The output takes another input channel. |
| Fixed | The output always sends one level (0-255). |
| Digital | The output follows a digital input (1-4): it sends the level while the input is on, and 0 while it is off. Inverted is the other way around. |

To change channels:

1. Select one or more output channels in the list. Hold Shift or Ctrl to select several; **Select all** and **Clear** are on the right.
2. Under **Set the selected outputs to**, pick **1:1 (same input channel)**, **Input channel**, **Fixed level** or **Digital input**, and fill in the channel, level or digital input.
3. Click **Apply to selection**.

For a block of channels, **Patch** is quicker:

* **From input** with **Patch**: the selected outputs, lowest first, take consecutive input channels starting from the one you enter. Select outputs 101-110 and patch from input 1 to send inputs 1-10 to outputs 101-110.
* **Offset by** with **Offset**: each selected output takes the input that many channels away. Output 101 with an offset of -100 takes input 1.
* **Reset selection to 1:1** and **Reset all to 1:1** put channels back to straight pass-through.

Several outputs can take the same input channel.

Every change goes to the Re-Mapper right away, so you see the result on the fixtures and in the **Monitor** view while you work. It is not saved yet: see the next section.

## Saving to the device and reverting

A change is live on the output as soon as you make it, but it is lost when the Re-Mapper loses power until you save it. While there are unsaved changes, the changed channels have a dot in the list and the bottom of the window says **Unsaved changes**.

* **Save to device** stores the mapping in the Re-Mapper, so it starts with this mapping from now on.
* **Revert** puts back the mapping that is saved on the Re-Mapper and drops the unsaved changes.

## Mapping files

A mapping can be kept as a file on the computer, as a backup or to copy it to another Re-Mapper.

* **Save to file…** writes the current mapping, including unsaved changes, to a `.yaml` file. The suggested name has the Re-Mapper's serial number and the date.
* **Load from file…** reads a `.yaml` file and sends it to the Re-Mapper. Like any other change it is live right away but not saved: click **Save to device** to keep it, or **Revert** to go back.

The files are the same YAML files the [command-line Config Utility](/dmx-core-pico-2-re-mapper/config-utility/#write-mapping-to-local-file) writes, so files from either tool work in the other. They are plain text and can be edited in any text editor. If a line in a file can't be read, that channel is set to 1:1 and the app tells you which.

## Activation

![The Not activated banner with the Activate online button](/assets/dmx-core-pico-2-re-mapper/app-not-activated.png)

A Re-Mapper sends DMX only once it is activated. One that is not activated still receives and maps DMX, but its output stays off, and the app shows a **Not activated** banner. You will normally only see it after updating from firmware 1.3 or older; see [below](#after-updating-from-firmware-13-or-older).

To activate, make sure the computer is online and click **Activate online**. The app gets the Re-Mapper's license from DMX Core and stores it on the Re-Mapper. The banner goes away and the output starts. After that the Re-Mapper works without the app and without an internet connection, and the activation is kept through power cycles and later firmware updates.

If activation fails, the banner says why. If it keeps failing, [contact us](https://dmxprosales.com/pages/contact-us) with the serial number shown in the message.

### After updating from firmware 1.3 or older

Firmware 1.4 uses a new, signed device license. The activation from firmware 1.3 or older does not carry over, so after updating to 1.4 the Re-Mapper has to be activated again, **once**, online. Until then its DMX output stays off.

:::caution[Update where you have internet access]
Update a Re-Mapper from firmware 1.3 or older on a computer that is online, so you can activate it right after the update. Don't do it on site without a connection: the output stays off until the Re-Mapper is activated again.
:::

The mapping is kept through the update. Updates from 1.4 to later versions keep the activation.

## Updating the firmware

![The Firmware dialog with an update available](/assets/dmx-core-pico-2-re-mapper/app-firmware.png)

Click **Firmware…**. The dialog shows the firmware the Re-Mapper runs, whether an update is available, and the release notes of the version picked under **Available firmware**. The latest version is selected; you can also pick an older one.

The app downloads the firmware from GitHub, so the computer needs to be online.

### Firmware 1.4 or later

Click **Install**. The app restarts the Re-Mapper into its boot loader, copies the firmware and waits until the Re-Mapper is back. Keep it plugged in until then. The mapping and license are kept.

If the app cannot find the boot drive after the Re-Mapper restarts, it saves the `.uf2` file to your **Downloads** folder and tells you to copy it onto the `RPI-RP2` drive yourself.

### Firmware 1.3 or older

![The Firmware update required banner](/assets/dmx-core-pico-2-re-mapper/app-firmware-required.png)

![The Firmware dialog on firmware 1.3, with the BOOTSEL steps](/assets/dmx-core-pico-2-re-mapper/app-firmware-bootsel.png)

The app can't work with firmware 1.3 or older. It shows **Firmware update required**, and the Monitor and Mapping views stay hidden until the firmware is updated. Read [After updating from firmware 1.3 or older](#after-updating-from-firmware-13-or-older) first: the Re-Mapper has to be activated again after this update.

Older firmware can't restart itself for an update, so the app asks you to do it:

1. Click **Update firmware…**, then **Install**.
2. Unplug the Re-Mapper's USB cable.
3. Hold the **BOOTSEL** button (next to the USB-C connector, marked on the label), plug the cable back in and let go.
4. The app finds the `RPI-RP2` drive, copies the firmware and waits for the Re-Mapper to come back.
5. Click **Activate online**.

### From the boot loader

![The banner for a board in its boot loader](/assets/dmx-core-pico-2-re-mapper/app-bootloader-banner.png)

If a board is already in its boot loader (BOOTSEL was held while plugging it in, or it has no firmware), the app shows a banner saying a Raspberry Pi Pico is in its boot loader. Click **Install firmware…**, pick a version and click **Install**.

A board in its boot loader only tells the app its chip type, so check that it is the Re-Mapper before you install. This is also how you go back to the Re-Mapper firmware from the [USB Interface](/usb-interface/) firmware or your own.

You can also copy the file yourself: download `dmxcorepico2-remapper-<version>.uf2` from [GitHub releases](https://github.com/DMXCore/Pico2ReMapper-Public/releases), hold BOOTSEL while plugging in, and copy the file onto the `RPI-RP2` drive.

## Troubleshooting

### The Re-Mapper does not show up

* Use a USB cable that carries data, not a charge-only cable, and try another USB port.
* Close other programs that may have its serial port open, such as the command-line Config Utility.
* Disconnect the power input (7-28VDC) while it is connected to the computer. See [Errata](/dmx-core-pico-2/errata/).
* If the board runs the [USB Interface](/usb-interface/) firmware or your own, this app does not list it. Install the Re-Mapper firmware [from the boot loader](#from-the-boot-loader).

### Linux: the Re-Mapper does not show up

Linux does not let a regular user open the Re-Mapper's serial port until a udev rule allows it. When that happens the app says it found a Re-Mapper but can't open it yet, with an **Allow access** button. Click it and enter your password; this is needed once. If the Re-Mapper still doesn't show up, unplug it and plug it in again.

On a system without a graphical password prompt, the app shows a command to run in a terminal instead. It adds the same rule.

### No DMX on the output

* Check for a **Not activated** banner. See [Activation](#activation).
* The output follows the input: without DMX on port A nothing is sent, unless the mapping uses the digital inputs. The **Monitor** view shows what comes in.

### Troubleshooting log

The app keeps a log for support: a text file per day, kept for a week. **About > Open log folder** opens it. It records the devices found, errors, firmware installs, activation and update checks, but no DMX levels. Attach it when you ask us for help.

The folder is `DMXCoreRemapper` in the temporary files folder: `%TEMP%\DMXCoreRemapper` on Windows, `$TMPDIR/DMXCoreRemapper` on macOS and `/tmp/DMXCoreRemapper` on Linux.
