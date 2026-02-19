---
description: Describe common configuration issues and how to correct them
---

# Config Issues

Especially when running on non-DMX Core 100 hardware there are some configuration issues that the system detects that can cause incorrect functionality and degraded performance. Here's a list of a few of them and how to correct them.

#### Script to fix config issues

We have developed a script that will set the proper settings on your system. You can execute it with this command:

```bash
curl -s -L https://github.com/DMXCore/DmxCore100/raw/refs/heads/main/init-scripts/set-network-config.sh | sudo bash
```

#### IGMP Max Memberships for Multicast

Since the DMX Core 100 software supports up to 100 universes we must tell the Linux subsystem to support that many multicast memberships. The recommended value is 400 to allow for advanced configurations with triggers and sync packets as well. Setting the value requires root privileges on the host system.

```bash
sudo echo 400 > /proc/sys/net/ipv4/igmp_max_memberships
```

#### Network receive/send buffer memory

For the recording and playback functionality to keep up with the full streaming of packets we need the network buffers to be at least 5 MB.

```bash
sudo sysctl -w net.core.rmem_max=5000000
sudo sysctl -w net.core.wmem_max=5000000
```
