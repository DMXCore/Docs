---
title: Config Utility
description: Instructions on how to use the Config Utility
---

## Download

Download the latest version of the Config Utility from [GitHub releases](https://github.com/DMXCore/Pico2ReMapper-Public/releases). Note that the current version of the config utility is text-based.

| Platform | File |
|----------|------|
| Windows | `DmxRemapperConfig.exe` |
| macOS (Intel, or Apple Silicon via Rosetta) | `DmxRemapperMACOSX64.zip` |

## Start the application

The Config Utility is a text-based, menu-driven application that interacts directly with the Pico 2 Re-Mapper. When launched it will iterate through all serial ports on your computer and query for the Re-Mapper firmware. Once found it will say: `Found Pico device, serial ******** on port COM**`.

### Windows

Double-click `DmxRemapperConfig.exe`.

### macOS

The macOS build is an unsigned command-line tool (not a signed `.app`), so macOS will not let it run until you mark it as executable and allow it through Gatekeeper. That is expected.

1. Download `DmxRemapperMACOSX64.zip` and double-click it to unzip. Keep `DmxRemapperConfig` and `libSystem.IO.Ports.Native.dylib` in the same folder — do not run the `.zip` file itself.
2. Open **Terminal** in that folder. In Finder you can right-click the folder and choose **New Terminal at Folder**, or `cd` to it.
3. Run:

```bash
chmod +x DmxRemapperConfig
xattr -d com.apple.quarantine DmxRemapperConfig
./DmxRemapperConfig
```

The `./` prefix is required. If `xattr` reports that the quarantine attribute does not exist, that is fine — continue with `./DmxRemapperConfig`.

On an Apple Silicon Mac (M1 or later), macOS runs this Intel (x64) build through Rosetta. If you are prompted to install Rosetta, accept it.

#### "zsh: permission denied"

This means the file is not marked executable, which is common after unzipping a download created on Windows. From the folder that contains `DmxRemapperConfig`:

```bash
chmod +x DmxRemapperConfig
./DmxRemapperConfig
```

#### macOS says it cannot be opened / the developer cannot be verified

Because the tool is not signed, Gatekeeper blocks it the first time. Use either of these:

* In Finder, **Control-click** (or right-click) `DmxRemapperConfig`, choose **Open**, then **Open** again.
* Or open **System Settings → Privacy & Security**, scroll to the message about `DmxRemapperConfig`, and choose **Open Anyway**.

If Terminal still refuses to run it, remove the download quarantine flag and try again:

```bash
xattr -d com.apple.quarantine DmxRemapperConfig
chmod +x DmxRemapperConfig
./DmxRemapperConfig
```

:::note
The Config Utility is a terminal program. Running it from Terminal (as shown above) is the most reliable way to use the menus.
:::

The menu options are:

* Read DMX
* Get Mapping
* Modify Mapping
* Revert Mapping
* Write Mapping to Flash
* Write Mapping to local file
* Read Mapping from local file
* Reset Mapping
* Read Status
* Quit

## Menu options

### Read DMX

Reads the last received DMX frame from DMX port A and outputs it on the screen. The channel number (1–512) is shown in gray and the current value (0–255) in green.

![DMX Read screen](/assets/dmx-core-pico-2-re-mapper/dmx-read.png)

### Get Mapping

Reads the current running mapping from the Re-Mapper. Note that this doesn't necessarily match what is stored in flash memory — as you modify the mapping it's only in volatile RAM until you write it to flash. Get Mapping reads what is currently in RAM.

### Modify Mapping

Modify the mapping one channel at a time. Select the output channel you want to modify (1–512), then choose to map it to one of the input channels (1–512) or set it to a fixed value (0–255). Once completed the mapping is immediately sent to the device. It is only written to RAM; write to flash if you want it to be permanent.

### Revert Mapping

Re-reads what is in flash memory into RAM — the same as a power cycle. Any mapping modified in RAM will be lost.

### Write Mapping to Flash

Writes the current mapping (in RAM) to the device flash memory, making it permanent across power cycles.

### Write Mapping to local file

Writes the current mapping to a file named `Mapping_*******.yaml` in the current directory (the `*` part is the device serial number). The file can be opened with any text editor for bulk changes. The format is a list of output channels, each mapped to either `input-***` or `fixed-***`.

Example:

```yaml
configVersion: 1.0
output:
  1: input-1
  2: input-2
  3: input-3
  4: input-4
  5: fixed-5
  6: input-6
  ...
```

### Read Mapping from local file

Lists all `*.yaml` files in the current directory and lets you select one. The selected mapping is loaded into the device RAM immediately. Remember to write to flash if you want it to be permanent.

### Reset Mapping

Resets the mapping in RAM to a straight 1:1 pass-through from input to output.

### Read Status

Displays details about the current DMX input stream: how many frames have been received since power-up, and the current frame rate (based on the last second).

### Quit

Quits the application. You can also close the window or unplug the device.
