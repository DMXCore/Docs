---
title: Software
description: Downloads for the Pico 2 Re-Mapper - the DMX Core Re-Mapper app, the firmware and the command-line Config Utility
---

## DMX Core Re-Mapper app

The app is the recommended way to set up the Re-Mapper: live DMX input and output, the mapping editor, activation and firmware updates. It updates itself. See [DMX Core Re-Mapper app](/dmx-core-pico-2-re-mapper/app/) for how to install and use it.

| Platform | Download |
|----------|----------|
| Windows 64-bit | [DMXCoreRemapper-Setup.exe](https://downloads.dmxcore.com/velopack/remapper/win/DMXCoreRemapper-Setup.exe) |
| macOS Apple silicon (M1 or later) | [DMXCoreRemapper-osx-arm64-Setup.pkg](https://downloads.dmxcore.com/velopack/remapper/osx-arm64/DMXCoreRemapper-osx-arm64-Setup.pkg) |
| macOS Intel | [DMXCoreRemapper-osx-x64-Setup.pkg](https://downloads.dmxcore.com/velopack/remapper/osx-x64/DMXCoreRemapper-osx-x64-Setup.pkg) |
| Linux x86_64 | [Install with one command](/dmx-core-pico-2-re-mapper/app/#linux-x86_64), or the [AppImage](https://downloads.dmxcore.com/velopack/remapper/linux-x64/DMXCoreRemapper-x86_64.AppImage) |

On 32-bit Windows, use the [command-line Config Utility](#config-utility-command-line) below.

## Firmware

The Re-Mapper comes with the firmware installed. The app updates it: click **Firmware…**. See [Updating the firmware](/dmx-core-pico-2-re-mapper/app/#updating-the-firmware).

The firmware files are on [GitHub releases](https://github.com/DMXCore/Pico2ReMapper-Public/releases), with release notes, if you want to copy one onto the board yourself:

| File | Use |
|------|-----|
| `dmxcorepico2-remapper-<version>.uf2` | Re-Mapper firmware. Hold BOOTSEL, plug in USB and copy it to the `RPI-RP2` drive. Releases before the app named it `dmxcorepico2-remapper.uf2`. |

:::caution[Activate again after updating to firmware 1.4]
Firmware 1.4 uses a new, signed device license. After updating from firmware 1.3 or older, the Re-Mapper has to be activated again, once, online: click **Activate online** in the app, or choose **Activate Online** in the command-line Config Utility. Its DMX output stays off until then, so do the update where the computer has internet access, not on site without a connection. The mapping is kept. See [Activation](/dmx-core-pico-2-re-mapper/app/#activation).
:::

## Config Utility (command line)

The older text-menu tool is still available on [GitHub releases](https://github.com/DMXCore/Pico2ReMapper-Public/releases) as an alternative to the app. It is the tool to use on 32-bit Windows.

| File | Platform |
|------|----------|
| `DmxRemapperConfig.exe` | Windows 64-bit |
| `DmxRemapperConfig-win-x86.exe` | Windows 32-bit |
| `DmxRemapperConfig-osx-arm64.dmg` | macOS Apple silicon |
| `DmxRemapperConfig-osx-x64.dmg` | macOS Intel |

It is portable, signed by DMX Pro Sales, and has no installer or auto-updater. On macOS, open the disk image and double-click **DmxRemapperConfig** (the application). See [Config Utility (command line)](/dmx-core-pico-2-re-mapper/config-utility/) for launch steps.
