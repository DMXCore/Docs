---
title: FAQ
description: Frequently Asked Questions
---

### How can I power the Pico 2 Re-Mapper?

The Pico 2 can be powered either via USB-C at 5V, or via the power input connector at 7-28VDC.

### How much power does it use?

The Pico 2 draws about 30mA at 12V, less than 1 watt.

### Can I run my own firmware?

Yes, the re-mapper is built on the exact same hardware as the DMX Core Pico 2, but it comes bundled and pre-loaded with the Re-Mapper firmware and config utility. You can run any Raspberry Pi Pico firmware on the hardware and later re-flash the Re-Mapper firmware.

Programming is the standard RP2040 USB UF2 flow (hold BOOTSEL, copy a `.uf2` file). Arduino IDE works if you select **Raspberry Pi Pico (RP2040)**. J3 is the SWD debug port; a [Raspberry Pi Debug Probe](https://www.raspberrypi.com/products/debug-probe/) plugs in directly. See the [Pico 2 Software](/dmx-core-pico-2/software/) and [Pin out](/dmx-core-pico-2/pin-out/) pages.

### Are the digital triggers pulled to GND to activate?

No. Apply 3–24 VDC between the input (`i1`–`i4`) and `C`. For a push button, fit jumper J4 (Connect C to GND) and switch the onboard `3v3` onto the input. See [Pin out](/dmx-core-pico-2/pin-out/#digital-inputs).

### What does the J4 jumper "Connect C to GND" mean?

It connects the digital-input common (`C`) to board ground. Fit it when using onboard 3.3 V for buttons; leave it open when an external 3–24 V source has its own return on `C`.

### Is the Re-Mapper firmware source code available/open source?

At this time the firmware and config utility are not made available as open source.

### macOS will not open the Config Utility / it offers Move to Trash

Use the current **`.dmg`** from [GitHub releases](https://github.com/DMXCore/Pico2ReMapper-Public/releases) (`osx-arm64` on Apple silicon, `osx-x64` on Intel). Open the disk image and double-click **DmxRemapperConfig** (the application). Do not run a raw Unix executable, a `.command` file, or an older `.zip`.

The first launch may ask whether the app can control Terminal — choose **Allow**.

See [Config Utility](/dmx-core-pico-2-re-mapper/config-utility/#macos) for the full macOS launch steps.

### I have a suggestion for a new feature — can you add it?

We're open to suggestions. Please [open an issue on GitHub](https://github.com/DMXCore/Pico2ReMapper-Public/issues) or [contact us](https://dmxprosales.com/pages/contact-us) directly.
