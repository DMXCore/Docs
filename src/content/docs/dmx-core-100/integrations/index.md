---
title: Integrations
---

The DMX Core 100 is built to talk to the rest of your installation - audio DSPs, IoT devices, pixel controllers, and control apps. The current integrations:

* [Open Sound Control (OSC)](/dmx-core-100/integrations/osc-open-sound-control) - two-way control with apps like TouchOSC
* [MQTT](/dmx-core-100/integrations/mqtt) - IoT and building automation messaging
* [MCP Server](/dmx-core-100/integrations/mcp-server) - AI clients (Cursor, Claude Desktop, and others) control lights over the Model Context Protocol
* [Bitfocus Companion](https://bitfocus.io/connections/dmxcore-dmxcore100) - the DMX Core 100 Companion module, built on the Integration API, puts cues and presets on Companion buttons.
* [Integration API](/dmx-core-100/integrations/integration-api) - versioned HTTP + WebSocket wire contract for control systems such as Bitfocus Companion, Crestron and Node-RED: enumerate the live catalog, execute entities, receive state, and poll device health from `GET /info`
* [Home Assistant](/dmx-core-100/integrations/home-assistant) - the device and all its scenes, dimmers, and switches appear in Home Assistant automatically
* [Control Values](/dmx-core-100/integrations/control-values) - bridge Q-SYS and Symetrix audio controls to faders, menus, and triggers
* [Q-SYS & Symetrix](/dmx-core-100/external-control) - use the DMX Core 100 as a DSP wall controller, and vice versa
* [Plugins](/dmx-core-100/integrations/plugins) - install and update on-device integration plugins from the plugin registry (DSP, Home Assistant, Shelly, LIFX, WiZ, Govee, ...)
* [Building & Publishing Plugins](/dmx-core-100/integrations/publishing-plugins) - write your own plugin with the .NET SDK and publish it to the registry
* [Advatek Lighting](/dmx-core-100/integrations/advatek-lighting) - discover, drive, and monitor Advatek PixLite pixel controllers
* [Cloud Tunnel](/dmx-core-100/integrations/cloud-tunnel) - remote access from anywhere
* [Internet Passthrough](/dmx-core-100/integrations/internet-passthrough) - temporary internet access via a computer on the same network
* [Linked Units](/dmx-core-100/integrations/linked-units) - several units as one show: a Main Unit holds the show, Satellite Units control it from their own touchscreens
* HTTP, TCP, and UDP via [input triggers](/dmx-core-100/scheduling-automation/input-triggers)

Physical controllers - Stream Deck, MIDI devices, Key Digital keypads, and OSC panels - are covered in [Control Surfaces](/dmx-core-100/control-surfaces).

Please contact us to let us work with you on extending this list.

## Linked Units

Several DMX Core 100 units can work together as one show: a **Main Unit** holds the cues, presets, custom menus and users and drives the lights, and each **Satellite Unit** is a touchscreen on the wall that shows and controls the Main Unit's content. Set a unit's **Main Unit** under **Control & Integrations > Linked Units**, approve it on the Main Unit, restart it, and it is a Satellite Unit. The [Linked Units](/dmx-core-100/integrations/linked-units) page has the setup steps, what each unit does, what happens while the Main Unit is unreachable, how to unlink, and the error messages.

Most installs use a single unit, so Linked Units is hidden until **Hide Linked Units** is turned off in System settings. Setting it up needs the **Edit Linked Units** permission, separate from the permission for keypads, Stream Decks and OSC panels.
