# Troubleshooting

We have worked hard to ensure the DMX Core 100 is as stable as possible, however it is running a full Linux OS so things can happen. Here are some suggestions that can help to recover a device.

The DMX Core 100 connects to a central web service to get updates and allow support personnel to analyze log files. The first thing you should try is to make sure the unit is on a network connected to the internet.

### Force DHCP mode

If you can't access the GUI to change the network settings, and the device was on an isolated network without internet access and a static IP then you need to make sure it has internet access. In some networks that is tricky when set up with static IP, perhaps without a default gateway. If your device is on release rev223 or later then there's a feature to reset the unit back to DHCP using a USB stick.

* Take a USB stick with either FAT32 or exFAT file system
* Create a plain text file at the root named `dmxcore.txt` with a single line like this:\
  `force-dhcp`
* Save the file and eject the USB stick
* Insert into the DMX Core 100 and reboot
* After a few minutes it should change the network settings back to DHCP. There may not be a visible indication that it has taken place, but you can contact our technical support to verify that the device has connected back to the deployment platform.



