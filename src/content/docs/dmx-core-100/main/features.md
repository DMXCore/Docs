---
title: Features
---

![DMX Core 100 home screen](/assets/device/uno-home.png)

### Main

* Record and playback of dynamic DMX, up to 800 universes at 40 Hz (or 600 at 60 Hz)
* Playback of WAV and FLAC audio files via USB or onboard optional audio board, with pause/scrub controls
* Light fixture control with profiles and multi-function support
* Multi-room/zone support with zone-based fixture grouping
* Presets with smooth fades, copy/paste, effect assignment, and ambient (fallback) presets
* Effects engine with 14 built-in generators — breathing, fire, chaser, strobe, sound-reactive, and more — with zone-level control
* Beat-synced effects: tap tempo, metronome modes, and audio-trigger detection
* Timeline editor for sequencing cues, presets, sounds, levels, and scripts — with audio waveforms and intensity profiles
* Playback layers and priorities for concurrent playback control
* Scheduler with fixed and sunrise/sunset times, dimmer settings, and stop-at-completion
* User scripting in JavaScript — automate fixtures, playback, levels, and messaging with a built-in editor
* Favorites for quick access to frequently used cues, presets, and sounds
* Control surfaces: Stream Deck, MIDI controllers, Key Digital keypads, and OSC panels with two-way feedback
* Control Values: bridge Q-SYS/Symetrix DSP levels, selectors, and mutes to faders, menus, and triggers
* Installer-customizable menus with nested levels, sliders, icons, schedule toggles, status indicators, and guest access
* Set up multiple units as remote control/server
* Map outputs to a combination of ArtNet/sACN/KiNet/TPM2.net/DMX universes
* Support for optional 2-port DMX-512 board
* Record from any source (DMX-512, ArtNet, sACN or KiNet), plus live monitor feature
* Input triggers via DMX, OSC, MQTT, HTTP, TCP, UDP, and digital inputs — run actions or drive levels
* Output events for external notifications (MQTT, HTTP, OSC, serial) when actions occur

### Security

* Three main modes of access: admin, user and lock-down
* Screen lock with 4-digit PIN code
* Multiple user accounts with role-based permissions
* Web UI login per user with PIN or password
* Guest access limited to designated custom menus
* Admin Web UI with auto log-off
* Lock-down mode prevents admin access via touch screen (only accessible via Web UI)
* Admin PIN recovery — via another admin, the cloud portal, or offline challenge/response
* User tokens for programmatic access
* Audit log tracking all system actions

### Hardware

* 4.3" touchscreen, or the larger 7" model with the same capabilities
* Powerful compute module based on Raspberry Pi CM4
* Knob to navigate without touching the screen, plus used for easy control input
* RTC clock with (optional) battery backup
* Power over Ethernet or 8–28 VDC power input
* Uses max 8 watts of power
* Black bezel (3D-printed, STL files are available to customers)
* Aluminum mounting frame
* 1 GbE Ethernet, supporting up to 800 universes at 40 Hz (or 600 universes at 60 Hz) for network streams
* MicroSD and USB-A for file storage/bootloader updating
* Supports USB DMX output via Enttec Pro/DMXking USB device (up to 4 universes)
* Supports 2-port DMX512 board via piggy-back connector
* Support stereo audio playback via USB or audio interface board via piggy-back connector
* Designed to be installed in a 2-gang electrical box; optional [desk stand](https://dmxprosales.com/products/dmx-core-100-desk-stand) and [19" rack mount](https://dmxprosales.com/products/dmx-core-100-19-rack-mount) (3U) available

### Administration

* Full-featured Web UI accessible from any browser on the network (HTTP/HTTPS)
* Cloud tunnel for remote access from anywhere (no VPN required)
* Cloud portal for remote fleet management — device monitoring, email health alerts, remote reboot/backup, and software updates ([portal.dmxcore.com](https://portal.dmxcore.com))
* Remote configuration via BalenaCloud (secure VPN access)
* Configure settings via Web UI and API
* Remote software upgrade (requires internet connectivity)
* Admin/User/Lockdown mode
* DHCP or Static IP configuration on device or Web UI
* Device nickname (displays on-screen)
* Device network hostname override
* Time zone, language/region, and device location (for sunrise/sunset schedules)
* NTP server configuration and browser time sync
* Auto log-off of admin user
* Web Admin UI with features to view screenshot of the device, perform upgrades, view log file, restart and more
* VNC remote control to remotely operate the touch screen
* Backup/Restore to local files and cloud, including S-Play backup import
* Device monitor with discovery and health monitoring of Advatek, DMXking, and Stream Deck hardware
* Custom menu for locked-down device operation
* Demo data import for quick setup and testing

### Lighting

* ArtNet, sACN (E1.31) and KiNet (v1 and v2) support up to 800 universes at 40 Hz (or 600 universes at 60 Hz)
* TPM2.net output for pixel controllers, and MQTT output for IoT devices
* Supports sync packets over ArtNet, sACN and KiNet for multi-universe sync
* Per-output sACN send priority, with per-cue priority overrides and a global merge mode (Blend/HTP)
* Support for USB devices (Enttec Pro and DMXking devices)
* Optional 2-port isolated DMX512 board (mounts at the back of the DMX Core 100)
* Trigger cues, playback, presets, dimmers and more from QSC Q-Sys and Symetrix DSP cores
* Remote control via OSC (to be used with software like TouchOSC and more), MQTT, and MIDI
* Import light fixture profiles from [Lightkey](https://www.lightkeyapp.com/en/fixtures), [Daslight (SSL2)](https://store.daslight.com/en/ssl), and [GDTF](https://gdtf-share.com), or generate a profile from the fixture manual with an [AI assistant](/dmx-core-100/lighting/ai-fixture-profiles)
* Passthrough feature on DMX ports
* Fade in/out and cross-fade cues, including masking for DMX channels that shouldn't fade
* Bounce playback (play cues forward and backwards for simple seamless looping)
* Import cues from DMXking products and from [Pharos Controls DMX Recorder](https://www.pharoscontrols.com/support/designer/software-downloads/#dmx-record)

### External Control

* Build custom UI for external controllers like QSC/Q-Sys and Symetrix
* Up to 4 columns of controls based on a mix of buttons and faders
* Control multiple levels on single fader (switch between rooms/zones)
* Program push knob to control mute or switch level zones
* Two-way updates: see the current status and levels on all connected devices
* Compatible with Q-Sys from QSC and the Symetrix SymNet DSPs
* Uses built-in control interface of QSys and Symetrix — no scripting or extra licenses required
* Customize buttons, icons and colors
* Support multiple pages, accessible via custom menus
* Remote management via Web Admin UI and VNC
* Dynamic reload when configuration updated, completely remotely

### Customization

* Build customized menus for end-user control — buttons, sliders, and source selectors
* Replace home screen logo, backgrounds and icons
* Develop custom menus from Web UI and see the result on the touch screen
* Set custom properties on cue playback in menus like fade in/out, loop counts
* Supports multiple levels, header logo and much more
