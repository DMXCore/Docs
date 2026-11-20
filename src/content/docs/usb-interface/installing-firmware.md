---
title: Installing the Firmware
description: Put the USB Interface firmware on a DMX Core Pico 2, update it, or go back to the Re-Mapper
---

The USB Interface firmware is free for every DMX Core Pico 2 owner, including Re-Mapper owners. It is a single `.uf2` file. You can install it with the [DMX Core USB Interface Utility](/usb-interface/config-utility/), or copy it onto the board yourself. Both use the RP2040's USB boot loader, which is in ROM and cannot be overwritten, so a failed or interrupted install can always be repeated.

:::caution[Power from USB only]
While the Pico 2 is connected to a computer, power it from USB only and leave the power input (7-28VDC) disconnected. On hardware v1.1 and v1.2, USB may not connect while the power input is in use. See [Errata](/dmx-core-pico-2/errata/).
:::

## With the DMX Core USB Interface Utility

1. [Install the utility](/usb-interface/config-utility/#install) and start it.
2. Hold the **BOOTSEL** button on the Pico 2 (next to the USB-C connector, marked on the label) and plug it into the computer. The `RPI-RP2` drive appears.
3. The utility shows **A board is in its boot loader**. Click **Install firmware…**.

   ![The utility's banner for a board in its boot loader, with the Install firmware button](/assets/usb-interface/bootloader-banner.png)
4. Pick a version (the latest is selected) and click **Install**. The utility downloads the firmware from GitHub, copies it to the board, and waits for the board to start it.

When it is done, the interface shows up in the utility's main window.

![The Firmware dialog for a board in its boot loader, ready to install the latest release](/assets/usb-interface/install-from-bootloader.png)

:::note
A board in its boot loader only tells the utility its chip type, so the utility asks you to check that it is a DMX Core Pico 2 before it copies anything.
:::

## By copying the file

1. Download `dmxcore-pico2-usb-interface-<version>.uf2` from [GitHub releases](https://github.com/DMXCore/USBInterface-Public/releases).
2. Hold the **BOOTSEL** button (next to the USB-C connector) and plug the Pico 2 into the computer. A drive named `RPI-RP2` appears.
3. Copy the `.uf2` file onto the drive.

The board restarts with the new firmware. The drive disappears and a new serial port appears.

## Updating

Once the USB Interface firmware is running, you don't need the BOOTSEL button for updates:

1. Open the [USB Interface Utility](/usb-interface/config-utility/) and select the interface.
2. Click **Firmware…**. The dialog shows the installed version and whether an update is available.
3. Pick a version and click **Install**. The utility puts the interface into its boot loader, copies the firmware, and waits until the interface is back.

![The Firmware dialog showing the installed version and the available releases](/assets/usb-interface/firmware.png)

Keep the interface plugged in until it is back. Settings are kept across updates.

If the utility cannot find the boot drive after the interface restarts into its boot loader, it saves the `.uf2` file to your **Downloads** folder and tells you to copy it onto the `RPI-RP2` drive yourself.

You can also install an older version from the same list.

:::note
Releases up to 1.0.10 used a different USB ID. After updating from one of them, the computer sees a new device and gives it a new serial (COM) port, so you may need to select the interface again in your lighting software.
:::

## Going back to the Re-Mapper or your own firmware

Copy a different `.uf2` the same way: hold BOOTSEL, plug in, and copy the file onto the `RPI-RP2` drive.

* **Re-Mapper:** download `dmxcorepico2-remapper.uf2` from the [Re-Mapper releases](https://github.com/DMXCore/Pico2ReMapper-Public/releases). The USB Interface firmware does not touch the part of the flash where the Re-Mapper keeps its mapping and license, so they are still there when you go back. The license is tied to the board, so if it is ever lost, the Re-Mapper can be activated again. To keep a copy of your mapping, use **Write Mapping to local file** in the [Re-Mapper Config Utility](/dmx-core-pico-2-re-mapper/config-utility/) before you switch.
* **Your own firmware:** see the Pico 2 [Software](/dmx-core-pico-2/software/) page.

## Release notes

Each release on [GitHub](https://github.com/DMXCore/USBInterface-Public/releases) lists what is new. The utility's **Firmware** dialog shows the same notes for the selected version.
