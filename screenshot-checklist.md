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
Use a **fixed browser window** (1440×900 recommended). Enable dark mode first via Settings > Preferences.

### Getting Started / Themes
- [ ] Login page *(browser with device IP and PIN field)*
- [ ] Dashboard — dark mode *(Themes page)*
- [ ] Dashboard — light mode *(Themes page — switch to light, screenshot, switch back)*

### Dashboard
- [ ] Dashboard — full view *(sidebar + main content)*
- [ ] Dashboard — with item playing *(progress bar + system stats)*

### Lighting — Fixture workflow
- [ ] File Explorer *(fixture profile import)*
- [ ] Fixture setup *(profile and personality selection)*
- [ ] Zone editor *(showing fixture assignment)*
- [ ] Fixture Control *(color picker with fixture list)*
- [ ] Effects list
- [ ] Effect editor *(generator selection + parameters)*

### Playback
- [ ] Cues list *(columns and play button)*
- [ ] Presets list *(with action buttons)*
- [ ] Sounds list
- [ ] Timeline editor *(with events on timeline)*
- [ ] Recording page *(preview and input mapping)*

### Scheduling & Automation
- [ ] Schedules list
- [ ] Input triggers list
- [ ] Output events list
- [ ] Custom menu editor
- [ ] Favorites list

### Configuration
- [ ] Settings sidebar *(expanded showing all categories)*
- [ ] Output configuration list
- [ ] User management list
- [ ] Backup & restore page
- [ ] Audit log page

### Integrations
- [ ] MQTT configuration
- [ ] Satellite configuration
- [ ] Cloud tunnel settings

---

**Total: ~55 screenshots**
Run `grep -r "SCREENSHOT:" src/content/docs/` to see where each one goes.
