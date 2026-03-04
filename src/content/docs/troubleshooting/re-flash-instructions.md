---
title: Re-flash Instructions
---

If you need to recover the device back to factory default (you will lose all settings, presets and cues) then you can re-flash the boot image.

:::caution
Re-flashing erases all settings, presets, and cues. Make a backup first if possible.
:::

You will need a USB A-to-A cable to connect it to a computer. The device isn't delivered with one, but you can buy one from Amazon: [https://www.amazon.com/dp/B002KKXP3M](https://www.amazon.com/dp/B002KKXP3M)

Then you need to install **RPIBOOT**, a tool to put the unit in fixed disk mode. Installers for Windows and instructions for Mac/Linux are available here: [https://github.com/raspberrypi/usbboot](https://github.com/raspberrypi/usbboot)

Once you have that, you need this tool to write the image: [https://etcher.balena.io/](https://etcher.balena.io/)

And this is where you download the image: [https://dmxcorefiles.blob.core.windows.net/files/flash-images/balena-cloud-Unprovisioned-dmxcore100-4.0.16-v14.12.2.img.xz](https://dmxcorefiles.blob.core.windows.net/files/flash-images/balena-cloud-Unprovisioned-dmxcore100-4.0.16-v14.12.2.img.xz)

When you have everything installed, disconnect the DMX Core 100 from network and power and plug it into your computer via the USB A-A cable. You should see that it gets power. Then execute the RPIBOOT command line tool — it should complete in a few seconds and after that a new disk drive should appear.

If you want to preserve the identity of the previous device, copy the `config.json` file from that disk drive and overwrite it after flashing the restore image (this is optional).

Run BalenaEtcher and write the downloaded image onto the drive. It will take a few minutes.

The disk drive is automatically disconnected when BalenaEtcher finishes. Re-run RPIBOOT and unplug/replug the USB cable if you want to copy back the `config.json` file (again, optional).

Connect the DMX Core 100 back to an internet-connected network with DHCP. If you didn't copy the `config.json` file, you'll need to contact support to re-provision the device.
