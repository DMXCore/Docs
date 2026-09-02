---
title: FAQ
---

#### How many universes can the DMX Core 100 support?

You can output up to 800 universes at 40 Hz, or 600 universes at 60 Hz. It's possible to run more in some scenarios.

#### Can the DMX Core 100 run offline/disconnected?

Yes, the DMX Core 100 can run without internet access, but will not receive software updates. It is however possible to temporarily move it over to a network with internet access to receive updates, as it will attempt to connect to the cloud platform to receive them.

#### Can the DMX Core 100 be configured for static IP?

Yes. The DMX Core 100 is configured for DHCP by default; change to a static IP under **Device > Network** in the Web UI (IP address, netmask, and gateway). If a unit becomes unreachable because of a bad static configuration, see [Force DHCP mode](/dmx-core-100/troubleshooting/#force-dhcp-mode).

#### Can a timeline lock to Art-Net timecode?

Yes. [Timecode chase](/dmx-core-100/playback/timecode-chase) listens for Art-Net ArtTimeCode and joins the live clock on Play (or automatically when valid timecode appears). MIDI and LTC timecode are not supported in this release.

#### I have a question that isn't answered here, or I have an issue with the product

Feel free to leave a suggestion or issue under [Issues](https://github.com/DMXCore/DmxCore100/issues), or contact DMX Pro Sales directly.
