# Re-flash instructions

If you need to recover the device back to factory default (you will lose all settings, presets, cues) then you can re-flash the boot image to it.

You will need a USB A to A cable to connect it to a computer. The device isn't delivered with one, but you can buy one from Amazon: [https://www.amazon.com/dp/B002KKXP3M](https://www.amazon.com/dp/B002KKXP3M)

Then you need to install RPIBOOT which is a tool to put the unit in fixed disk mode. There are installers for Windows and instructions for Mac/Linux here: [https://github.com/raspberrypi/usbboot](https://github.com/raspberrypi/usbboot)\
\
Once you have that then we need this tool to write the image: [https://etcher.balena.io/](https://etcher.balena.io/)\
\
And this is where you download the image: [https://dmxcorefiles.blob.core.windows.net/files/flash-images/balena-cloud-Unprovisioned-dmxcore100-4.0.16-v14.12.2.img.xz](https://dmxcorefiles.blob.core.windows.net/files/flash-images/balena-cloud-Unprovisioned-dmxcore100-4.0.16-v14.12.2.img.xz)\
\
When you have everything installed you disconnect the DMX Core 100 from network and power and plug it into your computer via the USB A-A cable. You should see that it gets power. Then you execute the RPIBOOT command line tool. It should complete in a few seconds and after that you should have a new disk drive show up.

If you want to preserve the identity of the previous device then you can copy the config.json file in that disk drive and overwrite that after flashing the restore image. But it's optional.

Run BalenaEtcher and write the downloaded image onto the drive. It will take a few minutes.

The disk drive is automatically disconnected when BalenaEtcher finishes, re-run RPIBOOT and unplug/replug the USB cable if you want to copy back the config.json file, but again this is optional.

Connect the DMX Core 100 back to an internet-connected network with DHCP. If you didn't copy the config.json file then you need to contact support to re-provision the device.\
