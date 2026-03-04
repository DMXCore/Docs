---
description: What are the features of the Pico2 Re-Mapper
---

# Main

Ever needed to re-map DMX channels in an installation? Maybe you don't have access to the original programming and now you got a new light fixture with a different profile. This controller can hook up on your DMX line and re-map any of the channels. For each output channel you can configure which input channel it should take data from, or if it should be a fixed value.

Configuration is stored in the onboard non-volatile flash memory and can be easily updated by connecting the controller to your computer via USB-C. Powered via USB-C, or 7-28 VDC. Built on the [DMX Core Pico 2](https://app.gitbook.com/o/IX1AplGgX61XCtW7kGJr/s/NrAjrkxmjmBphd2kwES3/) so you could even replace the firmware with your own.

## Purchase Information

You can buy the DMX Core Pico 2 directly from our web site at [dmxprosales.com](https://dmxprosales.com/products/dmx-core-pico2-dmx-remapper). We also have these listed on our [Amazon ](https://www.amazon.com/DMX-Core-Pico-Raspberry-Re-Mapper/dp/B0CSVFFGQW/)and [eBay](https://www.ebay.com/itm/116047338946) stores.

## Features

### DMX features

* Refresh rate follows input
* Per-channel configuration:\
  \- straight channel to channel\
  \- channel X to Y\
  \- split any input channel to multiple output channels\
  \- fixed output value

### Digital Input

The 4 digital inputs can be configured to drive DMX channels, even when there's no DMX input to the re-mapper. This can be used as a simple setup with up to 4 push buttons driving light fixtures.

### Digital Output

The 4 digital outputs are connected to DMX channels 1-4 on the DMX input. Any time one of those channels go above 127 then the output for that channel goes high. This can be used to drive relays and other equipment directly from DMX.

### Configuration

Configuration via text-based configuration tool, connected via USB to a Windows machine (see [releases](https://github.com/DMXCore/Pico2ReMapper-Public/releases)). Configuration is stored in a dedicated part of the 2MB flash memory. The config utility allows you to download/upload settings and store/load into YML text files locally on your computer.

### Hardware

The Re-Mapper solution is software (firmware + configuration tool) that runs on the [DMX Core Pico 2](https://app.gitbook.com/o/IX1AplGgX61XCtW7kGJr/s/NrAjrkxmjmBphd2kwES3/) hardware. The hardware has additional features like digital inputs/outputs that are not currently used by the Re-Mapper code (it's possible though, contact us if you have a use-case).

### Mounting

* Wall/surface
* DIN rail

### Power

* USB-C (USB-A to C cable included)
* 7-28V DC via power input block (reverse polarity protected)
* Typical power consumption is 30mA at 12V, less than 1 watt

#### Limitations

* Output is driven by the input, even if all channels are set to fixed value, without an input nothing will be sent on the output. However when the digital inputs are used then a 40 Hz output is generated.
* Since the device is in-line in the DMX stream, it will introduce latency of about one DMX frame (\~25mS). It will read the full DMX frame, then run the mapping (which is very quick) and after that send out the frame on the output port. The latency will be consistent though, same on each frame.
* RDM data is not passed through the device

