---
title: Firmware Updates
description: Copy the new firmware onto the POECONTROL drive
---

Firmware releases are on the [PoeControl-Public releases page](https://github.com/DMXCore/PoeControl-Public/releases) on GitHub. Each release has one `.uf2` file per target: **`poecontrol-osc-w5500-<version>.uf2`** for a DMX Core 100 or any OSC server, **`poecontrol-symetrix-w5500-<version>.uf2`** for a Symetrix DSP, and **`poecontrol-qsys-w5500-<version>.uf2`** for a Q-SYS Core. Copying a different target's file is how the controller is switched between them; the device settings are kept and `config.txt` changes to that target's keys. Files named for other boards (`w6300`) are for development hardware and are refused.

## Updating

1. Plug the controller into a computer over USB-C. The **POECONTROL** drive appears.
2. Copy the `.uf2` onto it. It takes about a second.
3. About a second after the copy, the controller restarts on its own: the drive disappears for a moment and comes back.
4. `status.txt` shows `started = updated from <old version>, on trial` for the first ten seconds, then `started = updated from <old version>`, and the new version on the `firmware` line.

Settings are kept across updates. The drive lives in RAM, so the file does not stay on it.

## What protects you

The new firmware is written into a second copy in flash, next to the running one, and the controller restarts into it **on trial**. It keeps the new firmware only once its Ethernet chip has answered and it has run for ten seconds. If the new firmware crashes, hangs or does not start, the next restart is the old firmware, and `status.txt` reports `update = <version> did not start properly, so this device went back to <old version>`.

Files that are refused, with nothing written and the reason on the `update` line of `status.txt`:

* A `.uf2` for a different board - the file names the board it is for.
* A file that is not PoE Control firmware.
* A copy cut short - the cable pulled, the copy cancelled. Copy it again.

A firmware that works, then misbehaves a week later, was kept on the first day. Copy the previous release's `.uf2` back on; a downgrade installs the same way.

## Recovery

If a unit will not take an update through the drive, the RP2350's own bootloader is behind a pinhole in the lid. Hold **BOOTSEL** with a paperclip while plugging in USB-C: a drive called **RP2350** appears. Copy `poecontrol-partition-table.uf2` from the release onto it, and when the drive comes back, the board's `.uf2`. That reinstalls everything from scratch; settings survive it.
