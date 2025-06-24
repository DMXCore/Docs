---
description: Run the full DMX Core 100 software on Windows
---

# Demo Software (on Win PC)

We have an experimental version of the software for the DMX Core 100 that runs on a modern Windows 10-11 PC. Please note that it has some limitations, it's not meant to be used in any production capability, but it can be a good start to learn about the features of the DMX Core 100. _Every 16 minutes it will disable the output for 1 minute._

Using Microsoft Edge, open this URL: [ClickOnce](https://clickonce.dmxcore.com/DMXCore100.application)

Select Open and then Install (it will give you a warning that it's not verified as safe, since this is just experimental, we don't have it signed with a commercial certificate. There's nothing unsafe about it though). You also need to select to allow it access to your network to be able to record/playback DMX data. Depending on what's installed in your computer it may also prompt you to install dependencies like .NET 9 that it will download from Microsoft's website.

Once running you have access to the full DMX Core 100 software where you can test out the features prior to purchasing the hardware. The web server is available on port 5000 for HTTP and 5001 for HTTPS when running on Windows.
