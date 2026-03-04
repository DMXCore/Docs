---
title: External Control
description: Control QSC Q-Sys and Symetrix DSP Cores
---

### General

The DMX Core 100 can act as a remote or GUI for two popular DSP cores: the Q-SYS system from QSC and the Symetrix line of cores. This allows an integrator to use the DMX Core 100 as an inexpensive UI to control full building automation. It's also possible to have the DSP control the lighting features of the DMX Core 100, like selecting presets and triggering cue playback. Both QSC and Symetrix offer the same features so this document covers both types of integrations.

### Configuration

As an admin, go to System Settings on the DMX Core 100. Under the **Plugins** header you'll find the setting called `QSC Q-SYS DSP Address` and `Symetrix Address` — this is where you enter the IP of your DSP Core.

![System Settings — plugin addresses](/assets/image%20(1)%20(1).png)

Once saved you'll have a new option under the Utilities menu called `QSC Q-SYS Remote` and `Symetrix Remote` respectively.

![Utilities menu with remote options](/assets/image%20(2).png)

Now open the web UI of the DMX Core 100 by opening a browser and entering the IP of the device (supports both HTTP and HTTPS; we recommend HTTPS, but you must accept the self-signed certificate). You can find the IP in the About screen, or by holding down the clock for a few seconds. Login with your admin PIN and under **PLUGINS** you'll see **Q-SYS** and **Symetrix**. Select the type of system you have — this is where you configure what buttons should display on the screen. You also have to select which of the two systems to use under **Settings**. You'll find samples at the [public GitHub repository](https://github.com/DMXCore/DmxCore100/tree/main/samples), but here's a sample to get you started:

```json
{
  "Pages": [
    {
      "Code": "PAGE1",
      "Title": "Q-Sys Sample page",
      "Sections": [
        {
          "Title": "Power",
          "Controls": [
            {
              "ControlType": "BUTTON",
              "Name": "ON",
              "Description": "Power On",
              "ControlId": "AudioPower",
              "SelectorValue": 0,
              "Icon": "start"
            },
            {
              "ControlType": "BUTTON",
              "Name": "OFF",
              "Description": "Power Off",
              "ControlId": "AudioPower",
              "SelectorValue": 1,
              "Confirm": true
            }
          ]
        },
        {
          "Title": "Input",
          "Controls": [
            {
              "ControlType": "BUTTON",
              "Name": "Cable TV",
              "Description": "Cable TV Receiver",
              "ControlId": "DMXCORE1_Input1",
              "Icon": "input"
            },
            {
              "ControlType": "BUTTON",
              "Name": "Apple TV",
              "Description": "Apple TV",
              "ControlId": "DMXCORE1_Input2"
            },
            {
              "ControlType": "BUTTON",
              "Name": "BluRay",
              "Description": "BluRay Player",
              "ControlId": "DMXCORE1_Input3"
            },
            {
              "ControlType": "BUTTON",
              "Name": "Input 4",
              "Description": "Xbox",
              "ControlId": "DMXCORE1_Input4"
            }
          ]
        },
        {
          "Title": "Volume",
          "Controls": [
            {
              "ControlType": "LEVEL",
              "Name": "Volume",
              "ControlId": "DMXCORE1_Level"
            }
          ]
        }
      ]
    }
  ]
}
```

Click **Save** and you should immediately see the changes on the touch screen. Connect the buttons/slider using named control IDs on your DSP in Q-Sys Designer/Composer. Connectivity to the DSP is indicated by this icon in the status bar: ![DSP connectivity icon](/assets/image%20(3).png). Red means disconnected, white means connected.

### Next Steps

From here you can set up the custom menu to only display the external control remote when in lock-down mode.
