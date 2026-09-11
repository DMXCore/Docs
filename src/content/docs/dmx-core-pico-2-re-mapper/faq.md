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

### Is the Re-Mapper firmware source code available/open source?

At this time the firmware and config utility are not made available as open source.

### I get "zsh: permission denied" when running DmxRemapperConfig on a Mac

The macOS download is not marked executable, and the tool is not signed. From the unzipped folder in Terminal:

```bash
chmod +x DmxRemapperConfig
xattr -d com.apple.quarantine DmxRemapperConfig
./DmxRemapperConfig
```

See [Config Utility](/dmx-core-pico-2-re-mapper/config-utility/#macos) for the full macOS launch steps, including Gatekeeper ("developer cannot be verified").

### I have a suggestion for a new feature — can you add it?

We're open to suggestions. Please [open an issue on GitHub](https://github.com/DMXCore/Pico2ReMapper-Public/issues) or [contact us](https://dmxprosales.com/pages/contact-us) directly.
