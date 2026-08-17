---
title: Building & Publishing Plugins
description: Write a DMX Core 100 plugin with the .NET plugin SDK and publish it to the plugin registry
---

DMX Core 100 plugins are .NET class libraries built against the
[DMXCore.PluginSdk](https://www.nuget.org/packages/DMXCore.PluginSdk) NuGet
package. Publishing one is a `dotnet nuget push` — the plugin registry the
device browses **is nuget.org**, so a plugin you publish there appears on
every DMX Core 100's **Plugins > Browse** page within minutes, and devices
that have it installed see the update.

## What a plugin can do

Through the SDK's `IPluginHost` a plugin can:

- react to MQTT messages and publish its own (using the device's broker
  connection),
- fire **input triggers** that the venue maps to cues, presets, and actions,
- register **Control Value backends** (how the DSP plugins work),
- register **output protocols** and **fixture profiles** for networked
  lighting devices, with device discovery behind the **Discover** button
  (how the Shelly and LIFX plugins work),
- expose **entities** to smart-home platforms and provide **output action
  providers** the device fires into your integration (how the Home
  Assistant plugin works),
- discover devices on the network via the device's shared mDNS browser,
- persist state and declare **settings** that admins edit on the Plugins
  page (including secrets, which are stored masked).

Plugins run **in-process and fully trusted**, with a serial dispatch queue
per plugin — an exception in a handler is logged and counted, but never takes
the device down.

## Getting started

Two public repositories show the way:

- [DMXCore100.ExamplePlugin](https://github.com/DMXCore/DMXCore100.ExamplePlugin) —
  the starting point: exercises the whole SDK surface with comments, ships an
  interactive dev harness (`DevHost`, no device needed) and MSTest tests
  against the SDK's `TestPluginHost`.
- [DMXCore100.ShellyPlugin](https://github.com/DMXCore/DMXCore100.ShellyPlugin) —
  a complete, shipping output plugin in one small file.

The essentials:

1. Create a .NET class library targeting `net10.0` and reference
   `DMXCore.PluginSdk` (with `ExcludeAssets="runtime"` — the device provides
   the SDK at run time).
2. Set the plugin identity and package metadata in the project file. The
   SDK generates `manifest.json` and a `PluginBuildInfo` constants class from
   these, so the version lives in exactly one place:

   ```xml
   <PropertyGroup>
     <PluginId>my-plugin</PluginId>
     <PluginDisplayName>My Plugin</PluginDisplayName>
     <Version>1.0.0</Version>
     <Authors>Your Name</Authors>

     <PackageId>YourCompany.DmxCorePlugin.MyPlugin</PackageId>
     <Description>What the plugin integrates with and what it does.</Description>
     <PackageProjectUrl>https://github.com/you/my-plugin</PackageProjectUrl>
     <PackageLicenseExpression>MIT</PackageLicenseExpression>
     <PackageReadmeFile>README.md</PackageReadmeFile>
   </PropertyGroup>
   ```

   `PluginId` is the plugin's identity on the device (letters, digits,
   hyphens); `PackageId` is its identity in the registry. Package ids under
   `DMXCore.*` are reserved for plugins published by DMX Core — use your own
   prefix.
3. Implement `IPlugin` in a public class with a parameterless constructor;
   `InitializeAsync(IPluginHost host, ...)` is where you subscribe and
   register things.
4. `dotnet pack`. The SDK's build targets produce two files in the output
   folder:
   - `<PackageId>.<Version>.nupkg` — the registry package (NuGet package type
     `DmxCorePlugin`, whose only payload is the plugin archive), and
   - `<PluginId>.dmxplugin` — the bare archive, for uploading to a device by
     hand during development. The example repo's `deploy-dev.ps1` packs and
     uploads it to a running device in one step.

## Compatibility and the SDK version

The SDK contract is versioned `major.minor` and is **additive**: new host
capabilities arrive as new minor versions, and a device reports the contract
it was built with (shown at the bottom of the Browse tab as *"This device
runs plugin SDK x.y"*).

Your plugin's package declares the oldest contract it needs as a dependency
range on `DMXCore.PluginSdk` — `[1.3.0, 2.0.0)` means "needs 1.3 or later,
same major". The SDK targets fill this in from the SDK version you compile
against; set `<PluginMinSdkVersion>` to declare a lower floor if you don't
use the newest APIs. Devices read this range **before** downloading and only
offer versions they can run, so publishing a plugin that needs a newer SDK
never breaks devices on older software — they simply keep the last
compatible version until they update.

## Publishing

Push the `.nupkg` to nuget.org:

```bash
dotnet nuget push artifacts/*.nupkg --source https://api.nuget.org/v3/index.json --api-key <your key>
```

From GitHub Actions, prefer keyless
[Trusted Publishing](https://learn.microsoft.com/nuget/nuget-org/trusted-publishing):
register the repository and workflow file on nuget.org once, then

```yaml
permissions:
  id-token: write
steps:
  - run: ./pack.sh
  - uses: NuGet/login@v1
    id: login
    with:
      user: your-nuget-profile-name
  - run: dotnet nuget push artifacts/*.nupkg --source https://api.nuget.org/v3/index.json --api-key ${{ steps.login.outputs.NUGET_API_KEY }} --skip-duplicate
```

With `--skip-duplicate`, re-running is harmless — bumping `<Version>` in the
project file is what publishes a new release. Devices check the registry
about hourly and show the update (or apply it automatically, per the
device's [update policy](/dmx-core-100/integrations/plugins#updates)).

A few practicalities:

- nuget.org lists a package a few minutes after the push; a version can be
  unlisted later but never deleted, so publish deliberately.
- Set `<Description>`, a license, and a README — the Browse tab shows the
  description and links to the license, and nuget.org renders the README as
  the package page.
- Private or internal plugins don't have to go to nuget.org: any NuGet V3
  feed (Azure Artifacts, BaGet, ...) works, and devices can be pointed at
  additional feeds under **Browse > Registry settings**.

## Testing without a device

The [DMXCore.PluginSdk.Testing](https://www.nuget.org/packages/DMXCore.PluginSdk.Testing)
package provides `TestPluginHost`, an in-memory host that records what your
plugin publishes, fires, and stores, and lets tests simulate MQTT messages,
cue events, settings changes, and more. The example repo's `DevHost` is an
interactive console harness built on it.
