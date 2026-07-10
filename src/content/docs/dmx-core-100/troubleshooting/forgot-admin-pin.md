---
title: Forgot Admin PIN
description: How to regain admin access if the admin PIN or password is lost
---

If you have lost the admin PIN (or web password) for your DMX Core 100, there are a few ways to regain access depending on your setup.

## Another admin can reset it

If anyone else has an admin account on the device, they can simply log in to the Web UI and set a new PIN for your account under **User Management > Users**.

## Reset from the DMX Core portal

If the device is registered to your account and has internet access, you can reset the admin login from the [DMX Core portal](/dmx-core-100/remote-management):

1. Sign in at [portal.dmxcore.com](https://portal.dmxcore.com)
2. Open the device and choose **Reset admin login**
3. The portal sets a new PIN for the device's admin account and shows the result immediately

This resets the first (oldest) admin account back to PIN login and clears any web password on it. The reset is recorded in the device's audit log, and any active login sessions are signed out.

## Desktop software: reset file

If you run the DMX Core 100 software on your own computer (Windows, macOS, or Linux) and the portal option isn't available — for example on an isolated network — you can reset the admin login with a file in the data folder:

1. Quit the DMX Core 100 application
2. Create an empty text file named `reset-admin-login.txt` in the data folder:
   * **Windows:** `%LocalAppData%\DMXCore100\data`
   * **macOS / Linux:** `~/dmxcore100-data`
3. Start the application again

On startup the file is removed and the first (oldest) admin account is reset back to PIN login with the factory default PIN `1111`. Any web password on that account is cleared and existing login sessions are signed out. The reset is recorded in the audit log.

:::caution
Log in and change the PIN right away — `1111` is the factory default and should not be left in place.
:::

## Hardware appliance without internet access

If a wall-mounted DMX Core 100 appliance is on an isolated network and no other admin account exists, please contact our technical support to recover access.
