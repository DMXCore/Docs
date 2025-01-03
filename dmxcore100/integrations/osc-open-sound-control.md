# OSC ‐ Open Sound Control

The DMX Core 100 has OSC remote control so you can use applications like [TouchOSC](https://hexler.net/touchosc) to trigger events like cues and presets.

All messages are prefixed with `/dmxcore` and the receiving UDP port is 8000. Status messages are sent back to each device on UDP port 9000.

Example: Start rainbow pattern on output with code OUT1: `/dmxcore/pattern/OUT1/rainbow`

If you omit the output then the first output will be used: `/dmxcore/pattern/rainbow`

To stop any playback you use this command: `/dmxcore/stop`

#### Reference

[OSC Specification](https://opensoundcontrol.stanford.edu/spec-1_0.html)
