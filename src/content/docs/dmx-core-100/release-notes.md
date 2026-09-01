---
title: Release Notes
description: Release notes and highlights
---

| Version | Date | Highlights |
|---------|------|------------|
| v2026.831.x | 8/31/2026 | [Visualizer](/dmx-core-100/lighting/visualizer): 2D live visualizer — place fixtures on photos of your venue (or a truss canvas with a small scenery kit) and watch presets, fixture control, and effects light them up live; cone/wash/glow/strip overlays, the same fixture on many views (and many times on one — nine pendants on one address), place multi-copy fixtures as a strip, per-copy trims with Solo right from the photo |
| v2026.827.x | 8/27/2026 | [Factory reset](/dmx-core-100/configuration/utilities#factory-reset) from **Utilities > System**: type RESET to wipe show content, users, and settings while keeping network, license, and local backups — sign in afterward as Administrator with PIN 1111 |
| v2026.826.x | 8/26/2026 | [MCP Server](/dmx-core-100/integrations/mcp-server): control lighting from AI clients such as Claude Desktop and Cursor over the Model Context Protocol — list entities, play cues, adjust levels, and drive fixture colors, secured with MCP-only API keys issued from the Web UI |
| v2026.826.x | 8/26/2026 | Snappier live control: Faders and Fixture Control changes now stream over the persistent SignalR connection, and sliders animate locally during device-side fades; ambient, sound, and fixture intensity entities added to the integration catalog for Home Assistant and other plugins |
| v2026.825.x | 8/25/2026 | New [Faders](/dmx-core-100/lighting/faders) page: console-style vertical faders for every dimmable fixture — zone banks with submasters, grand master, FLASH buttons, fine-drag precision mode, per-copy trim fan-out, name/code filtering, and per-strip or Release All |
| v2026.825.x | 8/25/2026 | Fade to a level from Faders and [Fixture Control](/dmx-core-100/lighting/fixture-control): enable **Fade** mode (0.5–30 s) or Shift+click a fader to glide to the target — fades run on the device and continue even if the browser closes |
| v2026.825.x | 8/25/2026 | [Lightjams Recorder Import](/dmx-core-100/integrations/lightjams): new plugin imports Lightjams Art-Net recorder videos (.mp4/.avi) directly as cues, original frame timing and multi-universe sync included (plugin SDK 1.9 cue import providers — any plugin can now add importers) |
| v2026.825.x | 8/24/2026 | [Avolites fixture profiles](/dmx-core-100/lighting/avolites-fixture-profiles): import Titan personality files (.d4) from the 20,000+ fixture Avolites Personality Library |
| v2026.825.x | 8/25/2026 | Device discovery (outputs and control surfaces) now shows found devices in a pick list and never silently overwrites the destination address |
| v2026.824.1 | 8/24/2026 | Control surface setup fixes: dial-out connections require an address and port before enabling, and port-conflict errors show inline again |
| v2026.821.1 | 8/21/2026 | Plugins that need MQTT now warn when the device has no MQTT broker connection; fixed a 400 error when picking "(None)" in control surface dropdowns |
| v2026.817.x | 8/17/2026 | Plugin SDK 1.8: plugin fixture profiles can define 16-bit (fine) channels |
| v2026.817.6 | 8/17/2026 | [Plugin registry](/dmx-core-100/integrations/plugins): install and update plugins from the new **Browse** tab on the Plugins page (nuget.org is the registry), with hourly update checks and a Notify/Auto/Off update policy; plugins are no longer bundled with the device software; anyone can [publish a plugin](/dmx-core-100/integrations/publishing-plugins) |
| v2026.816.x | 8/16/2026 | [Copy Trims](/dmx-core-100/lighting/fixture-control#copy-trims): dim individual copies of a multi-copy fixture without splitting it — per-copy intensity trims with live preview and a Solo button to identify each unit, saved on the fixture and applied to presets, effects, and live control |
| v2026.815.x | 8/15/2026 | [Home Assistant](/dmx-core-100/integrations/home-assistant#triggering-home-assistant-from-the-device): the device can now fire Home Assistant scenes, scripts, and automations — a new **Home Assistant** [Output Event](/dmx-core-100/scheduling-automation/output-events) type with a live target picker, bindable to control surfaces, custom menus, input triggers, timelines, and scripts (plugin SDK 1.7 output action providers) |
| v2026.815.x | 8/15/2026 | Output Events get a **Test** button in the Web UI that reports delivery failures; plugin secret settings (tokens, passwords) are no longer sent to the browser |
| v2026.812.1 | 8/12/2026 | Status page now shows app-specific CPU and memory usage alongside system metrics, with CPU averaged over the reporting interval |
| v2026.804.2 | 8/4/2026 | Internet Passthrough is now opt-in: a new [Enable Internet Passthrough](/dmx-core-100/integrations/internet-passthrough) toggle in the Network settings shows the passthrough card on the Utilities page (off by default) |
| v2026.803.4 | 8/3/2026 | [Custom menus](/dmx-core-100/scheduling-automation/custom-menus) get an auto-generated menu code for direct links and QR codes — open a specific menu straight from a URL without navigating |
| v2026.803.4 | 8/3/2026 | Documentation links added to Web UI page headers; fixed inflated memory readings in health data on macOS |
| v2026.803.1 | 8/3/2026 | [Channel Rules](/dmx-core-100/playback/channel-rules): cap, scale, or copy (multipatch) DMX channels during cue playback — tame too-bright recordings or mirror channels to fixtures added after the show was recorded, without modifying the cue files |
| v2026.728.9 | 7/28/2026 | USB Wi-Fi adapter support and a new per-adapter [Device > Network page](/dmx-core-100/configuration/settings): join Wi-Fi networks (including hidden SSIDs) and configure DHCP/static addressing per adapter, from both the web and touchscreen UIs |
| v2026.728.9 | 7/28/2026 | Fixed device discovery (mDNS) reliability on multi-adapter and multi-homed networks |
| v2026.727.15 | 7/27/2026 | Mute and Toggle Output trigger actions now support Set To (Toggle/On/Off) |
| v2026.727.15 | 7/27/2026 | DMX Core Connect: more reliable Internet Passthrough — picks a reachable helper address and steps aside automatically when the device already has internet |
| v2026.726.7 | 7/26/2026 | Timeline hold milestones: pause a timeline at a milestone and release it from input triggers, the operator page, or a momentary button press — ideal for pour/dispense and step-through shows |
| v2026.726.7 | 7/26/2026 | [Home Assistant integration](/dmx-core-100/integrations/home-assistant): bundled plugin exposes zones, presets, cues, schedules, and Control Values to Home Assistant via MQTT discovery |
| v2026.726.7 | 7/26/2026 | Improved update safety: the database is backed up and automatically restored if a software update fails |
| v2026.725.5 | 7/25/2026 | New [plugin system](/dmx-core-100/integrations/plugins) with a Plugins page (upload, enable/disable, per-plugin settings) and a stable public plugin SDK on NuGet; Symetrix and Q-SYS DSP integrations now ship as bundled plugins |
| v2026.724.11 | 7/24/2026 | New Toggle Output action to suppress all DMX output, for backup-unit switchover |
| v2026.724.11 | 7/24/2026 | Windows desktop app can start hidden in the system tray with the -tray switch |
| v2026.722.3 | 7/22/2026 | Control Value input triggers: fire actions when a DSP value crosses a threshold |
| v2026.722.3 | 7/22/2026 | New close-to-tray option for the Windows desktop app |
| v2026.721.3 | 7/21/2026 | Added External Trigger effect stepping for enhanced control |
| v2026.720.6 | 7/20/2026 | Seamless cue and timeline loops: no more blackout frame at the loop point — playback holds the last frame through transitions and restarts |
| v2026.720.6 | 7/20/2026 | Unified brand color theme across Web UI and Uno UI |
| v2026.717.3 | 7/17/2026 | Web UI settings reorganized for easier navigation |
| v2026.716.5 | 7/16/2026 | New audio-reactive effects and enhanced scheduling with sunrise/sunset options |
| v2026.716.5 | 7/16/2026 | Schedules can now start/end at sunrise or sunset with an offset, using a new device location setting |
| v2026.716.5 | 7/16/2026 | User scripting: write JavaScript to control fixtures, presets, cues, Control Values, OSC/MQTT, and schedules — run scripts from input triggers, timelines, lifecycle events, or as value transforms, with a built-in web editor |
| v2026.716.5 | 7/16/2026 | OSC and HTTP Output Events now execute |
| v2026.715.13 | 7/15/2026 | Major playback performance improvements: now supports 800 universes at 40 Hz, or 600 universes at 60 Hz |
| v2026.715.13 | 7/15/2026 | Improved recording and playback stability |
| v2026.715.13 | 7/15/2026 | Recording UI now shows recorded size and remaining recording space |
| v2026.714.8 | 7/14/2026 | Control Values: connect Symetrix/Q-SYS DSP audio levels to faders, custom menu sliders, control surfaces, input triggers, and timelines |
| v2026.714.8 | 7/14/2026 | Enhanced output pacing and added timed level ramps for smoother control |
| v2026.713.11 | 7/13/2026 | Import fixture profiles from GDTF files and AI-generated JSON profiles |
| v2026.713.11 | 7/13/2026 | Guest-accessible custom menus in the Web UI — use menus without logging in |
| v2026.713.11 | 7/13/2026 | External MQTT broker connection setting |
| v2026.713.11 | 7/13/2026 | sACN send priority moved from system settings to a per-output setting |
| v2026.713.11 | 7/13/2026 | Improved OSC feedback and control surface responsiveness; Absolute/Relative input mode for sliders and press-and-hold auto-repeat for Up/Down keys |
| v2026.710.8 | 7/10/2026 | Timeline editor enhancements with waveform overlays and intensity profiles |
| v2026.710.8 | 7/10/2026 | Admin PIN recovery feature added for enhanced security |
| v2026.709.9 | 7/9/2026 | Web UI now supports per-user password login |
| v2026.708.7 | 7/8/2026 | New DMX Core Connect desktop app: give a device internet access through a computer on the same network |
| v2026.707.3 | 7/7/2026 | Restart/Reboot functionality restored for Balena devices |
| v2026.705.3 | 7/5/2026 | OSC triggers enhanced for better payload handling |
| v2026.7.2.7 | 7/2/2026 | Speed improvements for first boot and database operations |
| v2026.7.1.10 | 7/1/2026 | Web UI enhancements for smoother user experience |
| v2026.6.30.11 | 6/30/2026 | Velopack updates improve installation and signing processes |
| v2026.6.29.9 | 6/29/2026 | System state logging improved for better recovery |
| v2026.6.29.9 | 6/29/2026 | macOS: fixed sACN/TPM2 "No route to host" errors after upgrading |
| v2026.6.28.3 | 6/28/2026 | New global Merge Mode setting and Playback Layers for per-cue concurrency control |
| v2026.6.28.1 | 6/27/2026 | Velopack update channel now defaults to installed channel |
| v2026.6.26.1 | 6/26/2026 | Restart/Reboot buttons hidden for non-Balena deployments |
| v2026.6.25.7 | 6/25/2026 | Improved macOS Velopack signing and bundling |
| v2026.6.24.8 | 6/24/2026 | New Velopack release pipeline for Windows and macOS |
| v2026.6.23.4 | 6/23/2026 | Enhanced file upload capabilities for large files |
| v2026.6.23.1 | 6/22/2026 | Minor updates and fixes for overall stability |
| v2026.6.21.1 | 6/21/2026 | UI bug fix for timeline editor in light theme |
| v2026.6.17.3 | 6/17/2026 | Configurable OSC server port for better customization |
| v2026.6.8.3 | 6/8/2026 | Stabilized Data Protection keyring across platforms |
| v2026.6.3.1 | 6/3/2026 | RDM device monitoring over Art-Net and Advatek board temperature added |
| v2026.5.28.1 | 5/28/2026 | Stream Deck Plus features: LCD bank label and swipe-to-switch added |
| v2026.5.23.2 | 5/23/2026 | Improved device monitoring: snapshots sent on connect/startup |
| v2026.5.22.4 | 5/22/2026 | Enhanced device monitoring with electrical monitoring and UI polish |
| v2026.5.14.3 | 5/14/2026 | New Device Status page with per-port Create Output functionality |
| v2026.4.26.5 | 4/26/2026 | Stream Deck support enhancements and metronome fix |
| v2026.4.25.1 | 4/25/2026 | Added Stream Deck Dock support |
| v2026.4.24.14 | 4/24/2026 | Improved control surface navigation and connection status |
| v2026.4.23.3 | 4/23/2026 | Flash mode added and control surface color fixes |
| v2026.4.22.5 | 4/22/2026 | Improved control surface functionality and takeover fixes |
| v2026.4.21.1 | 4/21/2026 | Fixed navigation issue for OSC clients |
| v2026.4.19.4 | 4/19/2026 | NetworkMidi2 support for control surfaces |
| v2026.4.18.2 | 4/18/2026 | Added OSC Control Surface support |
| v2026.4.17.7 | 4/17/2026 | RtpMidi support and control surface template updates |
| v2026.4.16.10 | 4/16/2026 | Improvements to effects, tempo, and metronome |
| v2026.4.15.13 | 4/15/2026 | Control Surface editor and operator view enhancements |
| v2026.4.14.6 | 4/14/2026 | Custom menu updates and effect control improvements |
| v2026.4.9.2 | 4/9/2026 | Monitor device feature and Advatek scanner added |
| v2026.4.8.3 | 4/8/2026 | [Output Monitor](/dmx-core-100/configuration/output-monitor) for real-time DMX channel visualization, fixture CSV export, combine split fixtures, fixture slot warnings, preset status improvements, color wheel and effect UI fixes |
| v2026.4.3.3 | 4/3/2026 | TPM2.net output support, tunnel stability and logging improvements |
| v2026.4.2.9 | 4/2/2026 | Ambient presets — set a persistent fallback preset that activates when nothing else is playing; assignable from schedules and input triggers |
| v2026.3.31.10 | 3/31/2026 | Chaser effect (sequence fixtures through a list of colors), hide individual fixture functions, preset favorites, improved preset builder |
| v2026.3.30.2 | 3/30/2026 | Solid light fixture control improvements, scrollable fixture list, fixture Excel export enhancements |
| v2026.3.29.4 | 3/29/2026 | Cloud tunnel for remote access |
| v2026.3.27.4 | 3/27/2026 | Multi-function fixture support, effect fade durations, large screen layout improvements |
| v2026.3.24.13 | 3/24/2026 | Effects engine with zone support, fixture control and setup in Web UI, preset editing with copy/paste, presets in timeline |
| v2026.3.23.5 | 3/23/2026 | Fixture management in Web UI, duplicate presets and schedules |
| v2026.3.19.8 | 3/19/2026 | Help sections, demo data import, pin hints for easier setup |
| v2026.3.12.15 | 3/12/2026 | Improved version management and release screen, MacOS and platform fixes |
| v2026.3.10.4 | 3/10/2026 | Status reporting on Linux |
| v2026.3.4.18 | 3/4/2026 | Available for macOS and Linux Snap |
| v2026.2.10.3 | 2/10/2026 | Device scanning |
| v2026.2.3.3 | 2/3/2026 | Timeline editor improvements |
| v2026.1.30.4 | 1/30/2026 | Timeline seek/scrub and loop |
| v2026.1.23.7 | 1/23/2026 | Stream Deck support with pan, mute, and configurable actions |
| v2026.1.15.8 | 1/15/2026 | Restore improvements and recorder bug fixes |
| v2025.12.9.1 | 12/9/2025 | Timeline editor (beta) |
| v2025.11.15.1 | 11/15/2025 | Web UI improvements for mobile |
| v2025.11.14.2 | 11/14/2025 | Audio delay feature. Custom Menu confirm option |
| v2025.11.12.21 | 11/12/2025 | Cue Fade Mask editor in Web UI |
| v2025.11.11.7 | 11/11/2025 | Dimmer setting for cues and schedules |
| v2025.10.31.5 | 10/31/2025 | Custom menu background color and glow state indicator |
| v2025.10.25.5 | 10/25/2025 | Fade in/out in seconds, loop/fade settings in Web UI |
| v2025.10.17.2 | 10/17/2025 | Favorites and custom menu on dashboard |
| v2025.10.13.5 | 10/13/2025 | Automatic cleanup of deleted/orphan files (cues/sounds), FLAC sound import |
| v2025.10.6.5 | 10/6/2025 | Pause and scrub feature for playback |
| v2025.9.26.3 | 9/26/2025 | Progress bar and scrub feature for sounds and cues |
| v2025.9.21.7 | 9/21/2025 | User tokens, white label improvements, stop-at-completion for schedules |
| v2025.9.12.5 | 9/11/2025 | Toggle schedules on/off in custom menu |
| — | 9/10/2025 | S-Play backup import |
| — | 9/3/2025 | Satellite config in Web UI |
| — | 7/27/2025 | Key Digital WP8 keypad support with LED status updates and display sleep timeout |
| — | 6/24/2025 | NTP server option and sync time from browser |
| — | 6/20/2025 | UI speed optimization |
| — | 5/30/2025 | Non-admin users can rename/delete cues within 24h of creation |
| — | 5/15/2025 | UI enhancement on cue list and home screen (tap logo for access to main menu) |
| — | 5/7/2025 | Master dimmer custom menu item, player control display in custom menus |
| — | 2/21/2025 | Support for MQTT input triggers and experimental support for Shelly RGBW devices |
| — | 2/14/2025 | More ways to control DMX input triggers for recording |
| — | 2/6/2025 | Better on-board File Explorer |
| — | 2/5/2025 | Improved output display and audit log |
| — | 2/3/2025 | Auto logoff on web/device after timeout |
| — | 1/31/2025 | Web Recorder monitoring |
| — | 1/27/2025 | Responsive Web UI support |
| — | 1/24/2025 | Input triggers for recording: DMX, HTTP, TCP, UDP, OSC |
| — | 1/18/2025 | Recording functionality in Web UI |
| — | 1/16/2025 | Light/Dark theme support |
| — | 1/14/2025 | Support for multiple users with different permissions |
| — | 1/7/2025 | Schedule editor in Web UI. Support for small icons in custom menus (can be used to send OSC messages) |
| — | 1/3/2025 | Backup/Restore via cloud storage |
| — | 12/18/2024 | Audio playback support (USB sound card) |
| — | 12/16/2024 | Performance enhancement with support for more than 100 universes (40 Hz) |
