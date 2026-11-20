---
title: Troubleshooting
description: Fixes for common problems with the DMX Core USB Interface
---

### The computer does not see the interface, or the status LED keeps blinking

* Disconnect the power input (7-28VDC) and power the Pico 2 from USB only. On hardware v1.1 and v1.2, USB may not connect while the power input is in use. See [Errata](/dmx-core-pico-2/errata/).
* Try another cable. Some USB-C cables carry power only.
* Check that the USB Interface firmware is installed. A board with other firmware (the Re-Mapper, your own code, or MicroPython) shows up differently or not at all. [Install the firmware](/usb-interface/installing-firmware/).

### The `RPI-RP2` drive does not appear

Hold **BOOTSEL** while you plug in the USB cable, and keep holding it until the drive appears. The same power-input note applies: power from USB only.

### The utility says "A board is in its boot loader"

The board has no firmware running, or was started with BOOTSEL held. Click **Install firmware…** to put the USB Interface firmware on it, or unplug it and plug it in again without BOOTSEL to start the firmware it has.

### The utility does not list the interface on Linux

Click **Allow USB access** in the utility and enter your password. If that does not work, the utility shows a command to run in a terminal instead. Then unplug the interface and plug it in again.

### My lighting software does not find the interface

* Check the [Lighting Software](/usb-interface/lighting-software/) page for your software. QLC+ does not list the interface yet (we're working on getting support added). OLA needs a configuration change on Linux.
* Close other programs that may have the serial port open. Only one program can open a serial port at a time. (The DMX Core USB Interface Utility does not use the serial port, so it can stay open.)
* Software that uses FTDI's D2XX driver does not see the interface. It needs to support the interface as a serial port.

### Windows says the COM port is in use or invalid

Lighting software reports an invalid port number, or can't open the COM port, even though nothing else is using the interface. FreeStyler, for example, shows **Error creating output thread. (Invalid port number)**.

This happens when Windows gave the interface a COM number that an old serial device, no longer plugged in, still holds. To fix it:

* In Device Manager, choose **View** > **Show hidden devices**, and under **Ports (COM & LPT)** uninstall the grayed-out serial ports you no longer use. Or:
* Give the interface a free COM number: in Device Manager, open the interface's port, then **Port Settings** > **Advanced** > **COM Port Number**.

Then unplug the interface and plug it in again.

### Only port A of my DMX Core Pico 2 works

Port B uses a two-port extension message, which only some software sends. If your software drives one port per interface, turn on [a serial port per DMX port](/usb-interface/ports-and-wiring/#a-serial-port-per-dmx-port), and the software sees two interfaces.

### DMX input stops working once the software opens the interface

Port A on **Auto** becomes an output as soon as the software sends it a frame, and some software sends output frames to every port it opens. Set port A to **Input** in the [settings](/usb-interface/settings/#port-direction).

### The lights keep their last look when the software quits

That is the default, and what other USB DMX interfaces do: the interface keeps sending the last frame until the software closes the serial port. Some software does not tell the interface when it closes the port. Set a **Timeout** under [When the program stops](/usb-interface/settings/#when-the-program-stops), and choose what the outputs do then.

### The input lags behind the console

The software reads input more slowly than the interface sends it. Lower the [input rate](/usb-interface/settings/#input-rate) to at or below the rate your software reads input (often the same as its output rate).

### A fixture does not answer RDM, or times out after a change

Some fixtures need a moment between RDM requests, especially after a new DMX address. Set an RDM **Pause** in the [settings](/usb-interface/settings/#rdm) (Advanced), for example 100 ms. Check that RDM is on, and that nothing on the DMX line between the interface and the fixture blocks RDM (many DMX splitters and some wireless DMX links do not pass it).

### A firmware update did not finish

Unplug the interface and plug it in again. If it does not come back, hold **BOOTSEL** while plugging it in and install the firmware again, from the utility or by [copying the file](/usb-interface/installing-firmware/#by-copying-the-file). The boot loader is in ROM, so this always works.

### Still stuck?

Note the firmware version (shown in the utility) and what you were doing, and [open an issue on GitHub](https://github.com/DMXCore/USBInterface-Public/issues) or [contact us](https://dmxprosales.com/pages/contact-us). The utility's log (**About > Open log folder**) helps us see what happened.
