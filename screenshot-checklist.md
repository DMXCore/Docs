# Screenshot Checklist
All screenshots in **dark mode**.

---

## On-Device (Touchscreen)
Navigate in order — set dark mode first via Main Menu > Settings > Display Theme.

### Getting Started / Themes
- [x] Home screen — dark mode *(Themes page)*
- [x] Home screen — light mode *(Themes page — switch to light, screenshot, switch back)*

### Main navigation
- [x] Main Menu
- [x] About screen *(showing IP address)*
- [x] Admin login screen
- [x] Admin mode active *(red bottom bar)*
- [x] Logoff button

### Cues
- [x] Cues list
- [x] Cues list — controls expanded
- [x] Cue settings *(long-hold a cue)*
- [x] Cue settings — actions

### Presets
- [x] Presets list
- [x] Presets list — controls expanded
- [x] Preset settings

### Recording
- [x] Recording screen
- [x] DMX channel preview *(while previewing)*

### Schedules
- [ ] Schedules list
- [ ] Schedule settings

### Settings & Config
- [ ] Settings screen
- [ ] Settings popup *(tap a setting)*
- [ ] Output Config list
- [ ] Output Config detail

### Utilities
- [ ] Utilities screen
- [ ] Snooze schedules screen

### UI basics
- [ ] Numeric input screen
- [ ] On-screen keyboard
- [ ] Symbol keyboard

### Custom Menu *(if configured with demo data)*
- [ ] Custom menu — example layout 1
- [ ] Custom menu — example layout 2

---

## Web UI
Use a **fixed browser window** (1440×900 recommended). Enable dark mode with the theme toggle in the top bar.

### Getting Started
- [ ] Login page *(browser with device IP, user picker, and PIN field)*
- [ ] Dashboard — dark mode *(Themes page)*
- [ ] Dashboard — light mode *(Themes page — switch to light, screenshot, switch back)*
- [ ] Dashboard — full view *(sidebar + main content)*
- [ ] Dashboard — with item playing *(progress bar + system stats)*
- [ ] Sidebar with the System groups expanded *(Settings page)*

### Lighting — Fixture workflow
- [ ] File Explorer *(fixture profile import)*
- [ ] Fixture setup *(profile and personality selection)*
- [ ] Zone editor *(showing fixture assignment — enable Multi-Zone Playback first)*
- [ ] Fixture Control *(color picker with fixture list)*
- [ ] Effects list *(generator column)*
- [ ] Effect editor *(generator selection + parameters)*
- [ ] Tempo page *(BPM/tap + Audio Trigger levels)*

### Playback
- [ ] Cues list *(columns and play button)*
- [ ] Presets list *(with action buttons)*
- [ ] Ambient Presets page *(candidate with Activate button)*
- [ ] Sounds list
- [ ] Timeline editor *(cue, sound, control value, and script events on tracks)*
- [ ] Recording page *(preview and input mapping)*

### Scheduling & Automation
- [ ] Schedules list
- [ ] Schedule editor *(Start = Sunset with sun times hint)*
- [ ] Input triggers list
- [ ] Output events list
- [ ] Script editor *(source, Run On Events switches, Last Run panel)*
- [ ] Custom menu editor *(item list + item property panel)*
- [ ] Favorites list

### Control Surfaces
- [ ] Control Surfaces list *(transport, binding, status columns)*
- [ ] New Control Surface page *(the four surface type cards)*
- [ ] Surface editor *(banks, sections tabs, assignment grid)*
- [ ] Surface Operator *(Stream Deck + with pads and knob sliders)*

### Integrations
- [ ] Control Values list *(code, kind, mapping, live value)*
- [ ] OSC Clients list *(source IP, feedback port)*
- [ ] MQTT settings *(external broker fields)*
- [ ] Plugins settings *(External Control Type + DSP addresses)*
- [ ] Cloud tunnel settings
- [ ] Device Monitor *(monitored + discovered devices)*

### Configuration
- [ ] Output configuration list
- [ ] System settings *(Location setting with latlong.net link)*
- [ ] User management list
- [ ] Backup & restore page
- [ ] Audit log page

---

**Total: ~60 screenshots**
Run `grep -rn "SCREENSHOT:" src/content/docs/` to see where each one goes.
