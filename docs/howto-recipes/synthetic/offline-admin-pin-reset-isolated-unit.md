---
status: candidate
source: synthetic
invented: true
level: advanced
surface: web
date: 2026-09-15
title: Reset a lost admin PIN on a unit with no internet access
slug: offline-admin-pin-reset-isolated-unit
anonymized: true
docs_slugs:
  - dmx-core-100/troubleshooting/forgot-admin-pin
  - dmx-core-100/getting-started/connecting-to-the-web-ui
  - dmx-core-100/remote-management
verified: docs be6f663, core v2026.914.3
---

# Reset a lost admin PIN on a unit with no internet access

## Original ask

> Took over a museum install from another integrator. The wall unit sits on a closed AV VLAN with no internet by design, and the admin PIN isn't 1111 anymore. Nobody has it. The device does show up in our portal account from before it was moved. Can I get admin back without re-flashing or a factory reset, and without putting the box on the internet?

## Goal

Using the offline challenge/response, the first admin account gets a new 4-digit
PIN. Show content stays intact and the device never goes online.

## Walkthrough

```json
{
  "id": "offline-admin-pin-reset-isolated-unit",
  "title": "Reset a lost admin PIN on a unit with no internet access",
  "steps": [
    {
      "id": "open-forgot-pin",
      "label": "From a computer on the same network, open the device's Web UI login page and click Forgot admin PIN?",
      "docsUrl": "/dmx-core-100/troubleshooting/forgot-admin-pin/#offline-pin-reset-device-without-internet-access",
      "screenshotId": "login"
    },
    {
      "id": "note-challenge",
      "label": "Write down the device serial and the 9-digit challenge code shown on the page",
      "docsUrl": "/dmx-core-100/troubleshooting/forgot-admin-pin/#offline-pin-reset-device-without-internet-access",
      "screenshotId": "recover-pin"
    },
    {
      "id": "portal-response",
      "label": "On any internet-connected device (e.g. your phone), sign in at portal.dmxcore.com, open the device, choose Offline PIN Reset, and enter the challenge code to get a 9-digit response code",
      "docsUrl": "/dmx-core-100/troubleshooting/forgot-admin-pin/#offline-pin-reset-device-without-internet-access",
      "screenshotId": "portal-devices"
    },
    {
      "id": "enter-response",
      "label": "Back on the device's reset page, enter the response code and a new 4-digit admin PIN (and confirm it), then click Reset PIN",
      "docsUrl": "/dmx-core-100/troubleshooting/forgot-admin-pin/#offline-pin-reset-device-without-internet-access",
      "screenshotId": "recover-pin"
    },
    {
      "id": "log-in-new-pin",
      "label": "Go back to the login page and log in to the admin account with the new PIN",
      "docsUrl": "/dmx-core-100/getting-started/connecting-to-the-web-ui/#logging-in",
      "screenshotId": "login"
    }
  ]
}
```

## Gotchas

- The device must have been online at least once to get its recovery key from the
  portal. If it never was, the page says offline reset is not available. The next
  step is technical support, not re-flashing.
- The challenge code stays the same until it is used, so it can be read over the
  phone or entered in the portal later. After 5 wrong response codes the device
  invalidates the challenge and shows a new one; start over.
- The reset applies to the **first (oldest) admin account**. It switches that account
  back to PIN login, clears any web password, and signs out existing sessions. Both
  the device and portal audit logs record it.
- If they have no portal access, technical support can verify ownership and read the
  response code to them.
- Not the right tools here:
  - **Reset admin login** in the portal needs the device online.
  - The `reset-admin-login.txt` file is for desktop software only, not the Appliance.
  - Factory Reset wipes show content.
  - Re-flashing is only for a unit that won't boot.
- On a white-label device the login page does not show the **Forgot admin PIN?** link.
  The docs don't cover that case (see Gaps).

## Eval checks

- Starts from the Web UI login page link **Forgot admin PIN?**
- Portal action is **Offline PIN Reset** at portal.dmxcore.com (from another device)
- Mentions a 9-digit challenge code and a 9-digit response code
- New PIN is 4 digits; button is **Reset PIN**
- Says the device must have been online at least once (recovery key), else contact support
- States it resets the first/oldest admin account (and clears web password / signs out sessions)
- Does not tell them to connect the device to the internet, re-flash, or factory reset
- Does not suggest `reset-admin-login.txt` for the wall unit
- Does not tell them to use MCP or the Integration API

## Gaps

- `troubleshooting/forgot-admin-pin.md` › Offline PIN reset doesn't mention the
  **Confirm new PIN** field. The reset page asks for the new PIN twice
  (`src/AdminSite/ClientApp/src/views/pages/RecoverPin.vue`, placeholders "New 4-digit
  PIN" and "Confirm new PIN"; Reset PIN stays disabled until they match).
- The docs don't say the reset page (title "Reset admin PIN", route `/recover-pin`,
  nav `web/recover-pin`) also shows a QR code that opens the device in the portal, or
  a **Go to login** button after success (`RecoverPin.vue`).
- The docs don't mention that white-label devices hide the **Forgot admin PIN?** link
  (`src/AdminSite/ClientApp/src/views/pages/Login.vue` `showPinReset = !hasWhiteLabel`).
  A comment in `RecoverPin.vue` says `/recover-pin` stays reachable by URL there.
  Whether to document that is a docs decision; the gold answer does not rely on it.
- Portal wording: the docs say **Offline PIN Reset**; the device page text says
  "Offline PIN reset". The portal UI is not in the core repo, so the exact label is
  unverified.
- No screenshot of the Reset admin PIN page (steps `note-challenge`, `enter-response`).
  `portal-devices` shows the portal fleet, not the Offline PIN Reset dialog.

## Verification

- Step `open-forgot-pin`: `troubleshooting/forgot-admin-pin.md` › Offline PIN reset,
  step 1. Source: `Login.vue` router-link "Forgot admin PIN?" → `/recover-pin`; nav
  `web/recover-pin`.
- Step `note-challenge`: same section, step 2 (serial, 9-digit challenge). Source:
  `RecoverPin.vue` rows "Device serial" and "Challenge code" (grouped as `483 291 507`);
  `src/Shared/Controllers/WebsiteController.Auth.cs` `PinResetChallenge`.
- Step `portal-response`: same section, steps 3–4. Portal UI is not in core; the
  device page text in `RecoverPin.vue` confirms "sign in to portal.dmxcore.com … open
  this device … Offline PIN reset".
- Step `enter-response`: same section, step 5. Source: `RecoverPin.vue` (response code
  field, new PIN + confirm, **Reset PIN** button); `WebsiteController.Auth.cs`
  `PinResetComplete` (9-digit response, 4-digit PIN).
- Step `log-in-new-pin`: same section, step 6; `getting-started/connecting-to-the-web-ui.md`
  › Logging In. Source: `RecoverPin.vue` success state and **Go to login**.
- 5 attempts, invalidation: docs Notes. Source: `src/Shared/Services/RecoveryManager.cs`
  `MaxAttemptsPerChallenge = 5`, challenge file deleted on the 5th failure.
- Not available without a recovery key: docs Notes. Source: `RecoveryManager.cs`
  (`RecoverySecret` empty → `NotAvailable`); `RecoverPin.vue` warning text.

## Source notes

Invented scenario, 2026-09-15; not from a real interaction.
