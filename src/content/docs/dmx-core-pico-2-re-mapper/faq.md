---
title: FAQ
description: Frequently Asked Questions
---

### How can I power the Pico 2 Re-Mapper?

The Pico 2 can be powered either via USB-C at 5V, or via the power input connector at 7-28VDC.

Use one or the other, not both. When connecting to a computer over USB, disconnect the power input first; see [Errata](/dmx-core-pico-2/errata/).

### How much power does it use?

The Pico 2 draws about 30mA at 12V, less than 1 watt.

### Can I run my own firmware?

Yes, the re-mapper is built on the exact same hardware as the DMX Core Pico 2, but it comes pre-loaded with the Re-Mapper firmware and is set up with the [DMX Core Re-Mapper app](/dmx-core-pico-2-re-mapper/app/). You can run any Raspberry Pi Pico firmware on the hardware and later re-flash the Re-Mapper firmware.

Programming is the standard RP2040 USB UF2 flow (hold BOOTSEL, copy a `.uf2` file). Arduino IDE works if you select **Raspberry Pi Pico (RP2040)**. J3 is the SWD debug port; a [Raspberry Pi Debug Probe](https://www.raspberrypi.com/products/debug-probe/) plugs in directly. See the [Pico 2 Software](/dmx-core-pico-2/software/) and [Pin out](/dmx-core-pico-2/pin-out/) pages.

### Can I use the Re-Mapper as a USB DMX interface?

Yes. Install the [USB Interface](/usb-interface/) firmware to turn it into a two-port USB DMX interface for lighting software. Your mapping and license are kept, so you can copy the Re-Mapper firmware back later. See [Installing the Firmware](/usb-interface/installing-firmware/).

### How do I configure the Re-Mapper?

With the [DMX Core Re-Mapper app](/dmx-core-pico-2-re-mapper/app/) for Windows, macOS and Linux. Connect the Re-Mapper with USB-C, edit the mapping and click **Save to device**. On 32-bit Windows, or if you prefer a text menu, use the [command-line Config Utility](/dmx-core-pico-2-re-mapper/config-utility/).

### The DMX output stopped after I updated the firmware

Firmware 1.4 uses a new device license. After updating from firmware 1.3 or older, the Re-Mapper has to be activated again, once, online: click **Activate online** in the [app](/dmx-core-pico-2-re-mapper/app/#activation) on a computer with internet access. Its DMX output stays off until then. The mapping is kept.

### On Linux, the app finds my Re-Mapper but can't open it, even after Allow access

Another program is probably holding the Re-Mapper's serial port. The usual one is the Open Lighting Architecture service (`olad`): its USB serial plugin opens every `/dev/ttyACM` device, the Re-Mapper included, whenever the port is free. The app then says it found a Re-Mapper that Linux does not let it open, and **Allow access** does not change that.

To check, look for a lock file with `ls /var/lock/LCK..ttyACM*`. If there is one, stop OLA while you use the app:

```bash
sudo systemctl stop olad
```

The Re-Mapper then shows up in the app within a few seconds. Start OLA again afterwards with `sudo systemctl start olad`.

To keep OLA running without it taking the Re-Mapper, remove the `device_prefix = ttyACM` line from `/etc/ola/ola-usbserial.conf` and restart `olad`. OLA then no longer opens other `ttyACM` devices either.

If there is no lock file and you have not clicked **Allow access** yet, see [Linux: the Re-Mapper does not show up](/dmx-core-pico-2-re-mapper/app/#linux-the-re-mapper-does-not-show-up).

### Are the digital triggers pulled to GND to activate?

No. Apply 3–24 VDC between the input (`i1`–`i4`) and `C`. For a push button, fit jumper J4 (Connect C to GND) and switch the onboard `3v3` onto the input. See [Pin out](/dmx-core-pico-2/pin-out/#digital-inputs).

### What does the J4 jumper "Connect C to GND" mean?

It connects the digital-input common (`C`) to board ground. Fit it when using onboard 3.3 V for buttons; leave it open when an external 3–24 V source has its own return on `C`.

### Is the Re-Mapper firmware source code available/open source?

At this time the firmware, the Re-Mapper app and the config utility are not made available as open source.

### macOS will not open the Config Utility / it offers Move to Trash

This is about the command-line Config Utility. The [DMX Core Re-Mapper app](/dmx-core-pico-2-re-mapper/app/#macos) has a regular installer and is the easier choice on a Mac.

To keep using the Config Utility, use the current **`.dmg`** from [GitHub releases](https://github.com/DMXCore/Pico2ReMapper-Public/releases) (`osx-arm64` on Apple silicon, `osx-x64` on Intel). Open the disk image and double-click **DmxRemapperConfig** (the application). Do not run a raw Unix executable, a `.command` file, or an older `.zip`.

The first launch may ask whether the app can control Terminal - choose **Allow**.

See [Config Utility (command line)](/dmx-core-pico-2-re-mapper/config-utility/#macos) for the full macOS launch steps.

### I have a suggestion for a new feature - can you add it?

We're open to suggestions. Please [open an issue on GitHub](https://github.com/DMXCore/Pico2ReMapper-Public/issues) or [contact us](https://dmxprosales.com/pages/contact-us) directly.
