// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightUtils from '@lorenzo_lewis/starlight-utils';

export default defineConfig({
  site: 'https://docs.dmxcore.com',
  redirects: {
    '/dmx-core-100/cues/': '/dmx-core-100/playback/cues/',
    '/dmx-core-100/presets/': '/dmx-core-100/playback/presets/',
    '/dmx-core-100/recording/': '/dmx-core-100/playback/recording/',
    '/dmx-core-100/schedules/': '/dmx-core-100/scheduling-automation/schedules/',
    '/dmx-core-100/patterns/': '/dmx-core-100/lighting/patterns/',
    '/dmx-core-100/utilities/': '/dmx-core-100/configuration/utilities/',
  },
  integrations: [
    starlight({
      title: 'DMX Core',
      logo: {
        light: './src/assets/logo.png',
        dark: './src/assets/logo.png',
        replacesTitle: true,
      },
      social: {
        github: 'https://github.com/DMXCore/DmxCore100',
      },
      plugins: [
        starlightUtils({
          multiSidebar: {
            switcherStyle: 'hidden',
          },
        }),
      ],
      customCss: ['./src/styles/custom.css'],
      head: [],
      sidebar: [
        {
          label: 'DMX Core 100',
          items: [
            { label: 'Overview', slug: 'dmx-core-100' },
            {
              label: 'Main',
              items: [
                { label: 'Features', slug: 'dmx-core-100/main/features' },
                { label: 'Applications', slug: 'dmx-core-100/main/applications' },
                { label: 'FAQ', slug: 'dmx-core-100/main/faq' },
                { label: 'Specifications', slug: 'dmx-core-100/main/specifications' },
                { label: 'Warranty', slug: 'dmx-core-100/main/warranty' },
              ],
            },
            {
              label: 'Getting Started',
              items: [
                { label: 'Overview', slug: 'dmx-core-100/getting-started' },
                { label: 'Installation', slug: 'dmx-core-100/getting-started/installation' },
                { label: 'Connecting to the Web UI', slug: 'dmx-core-100/getting-started/connecting-to-the-web-ui' },
                { label: 'Home Screen', slug: 'dmx-core-100/getting-started/home-screen' },
                { label: 'Main Menu', slug: 'dmx-core-100/getting-started/main-menu' },
                { label: 'Web UI Dashboard', slug: 'dmx-core-100/getting-started/web-ui-dashboard' },
              ],
            },
            {
              label: 'Basics',
              items: [
                { label: 'Overview', slug: 'dmx-core-100/basics' },
                { label: 'Navigation', slug: 'dmx-core-100/basics/navigation' },
                { label: 'Numeric Input', slug: 'dmx-core-100/basics/numeric-input' },
                { label: 'Text Edit', slug: 'dmx-core-100/basics/text-edit' },
                { label: 'Blackout and Stop', slug: 'dmx-core-100/basics/blackout-and-stop' },
              ],
            },
            {
              label: 'Lighting',
              items: [
                { label: 'Overview', slug: 'dmx-core-100/lighting' },
                { label: 'Zones', slug: 'dmx-core-100/lighting/zones' },
                { label: 'Fixture Control', slug: 'dmx-core-100/lighting/fixture-control' },
                { label: 'Fixture Setup', slug: 'dmx-core-100/lighting/fixture-setup' },
                { label: 'Effects', slug: 'dmx-core-100/lighting/effects' },
                { label: 'Passthrough', slug: 'dmx-core-100/lighting/passthrough' },
                { label: 'Patterns', slug: 'dmx-core-100/lighting/patterns' },
              ],
            },
            {
              label: 'Playback',
              items: [
                { label: 'Cues', slug: 'dmx-core-100/playback/cues' },
                { label: 'Presets', slug: 'dmx-core-100/playback/presets' },
                { label: 'Sounds', slug: 'dmx-core-100/playback/sounds' },
                { label: 'Timelines', slug: 'dmx-core-100/playback/timelines' },
                { label: 'Recording', slug: 'dmx-core-100/playback/recording' },
              ],
            },
            {
              label: 'Scheduling & Automation',
              items: [
                { label: 'Schedules', slug: 'dmx-core-100/scheduling-automation/schedules' },
                { label: 'Input Triggers', slug: 'dmx-core-100/scheduling-automation/input-triggers' },
                { label: 'Output Events', slug: 'dmx-core-100/scheduling-automation/output-events' },
                { label: 'Custom Menus', slug: 'dmx-core-100/scheduling-automation/custom-menus' },
                { label: 'Favorites', slug: 'dmx-core-100/scheduling-automation/favorites' },
              ],
            },
            {
              label: 'Configuration',
              items: [
                { label: 'Overview', slug: 'dmx-core-100/configuration' },
                { label: 'Admin Mode', slug: 'dmx-core-100/configuration/admin-mode' },
                { label: 'Settings', slug: 'dmx-core-100/configuration/settings' },
                { label: 'Output Config', slug: 'dmx-core-100/configuration/output-config' },
                { label: 'Users & Roles', slug: 'dmx-core-100/configuration/users-and-roles' },
                { label: 'Backup & Restore', slug: 'dmx-core-100/configuration/backup-and-restore' },
                { label: 'Utilities', slug: 'dmx-core-100/configuration/utilities' },
                { label: 'Audit Log', slug: 'dmx-core-100/configuration/audit-log' },
              ],
            },
            {
              label: 'Integrations',
              items: [
                { label: 'Overview', slug: 'dmx-core-100/integrations' },
                { label: 'OSC – Open Sound Control', slug: 'dmx-core-100/integrations/osc-open-sound-control' },
                { label: 'MQTT', slug: 'dmx-core-100/integrations/mqtt' },
                { label: 'Satellites', slug: 'dmx-core-100/integrations/satellites' },
                { label: 'Cloud Tunnel', slug: 'dmx-core-100/integrations/cloud-tunnel' },
              ],
            },
            { label: 'External Control', slug: 'dmx-core-100/external-control' },
            {
              label: 'Desktop Software',
              items: [
                { label: 'Overview', slug: 'dmx-core-100/desktop-software' },
                { label: 'Windows', slug: 'dmx-core-100/desktop-software/windows' },
                { label: 'macOS', slug: 'dmx-core-100/desktop-software/mac' },
                { label: 'Linux', slug: 'dmx-core-100/desktop-software/linux' },
              ],
            },
            {
              label: 'Customizations',
              items: [
                { label: 'Overview', slug: 'dmx-core-100/customizations' },
                { label: 'Menu Background', slug: 'dmx-core-100/customizations/menu-background' },
                { label: 'Main/Home Screen Logo', slug: 'dmx-core-100/customizations/main-home-screen-logo' },
              ],
            },
            {
              label: 'Screenshots',
              items: [
                { label: 'Overview', slug: 'dmx-core-100/screenshots' },
                {
                  label: 'Presets',
                  items: [
                    { label: 'Presets', slug: 'dmx-core-100/screenshots/presets' },
                    { label: 'Configuration', slug: 'dmx-core-100/screenshots/presets/configuration' },
                  ],
                },
                {
                  label: 'Cues',
                  items: [
                    { label: 'Cues', slug: 'dmx-core-100/screenshots/cues' },
                    { label: 'Configuration/Recording', slug: 'dmx-core-100/screenshots/cues/configuration-recording' },
                  ],
                },
                {
                  label: 'Light Fixtures',
                  items: [
                    { label: 'Light Fixtures', slug: 'dmx-core-100/screenshots/light-fixtures' },
                    { label: 'Configuration', slug: 'dmx-core-100/screenshots/light-fixtures/configuration' },
                  ],
                },
                { label: 'Custom Menu', slug: 'dmx-core-100/screenshots/custom-menu' },
                { label: 'External Control', slug: 'dmx-core-100/screenshots/external-control' },
                { label: 'Admin Features', slug: 'dmx-core-100/screenshots/admin-features' },
                { label: 'Q-Sys Remote Control', slug: 'dmx-core-100/screenshots/q-sys-remote-control' },
                { label: 'Web UI', slug: 'dmx-core-100/screenshots/web-ui' },
              ],
            },
            {
              label: 'Troubleshooting',
              items: [
                { label: 'Overview', slug: 'dmx-core-100/troubleshooting' },
                { label: 'Re-flash Instructions', slug: 'dmx-core-100/troubleshooting/re-flash-instructions' },
                { label: 'Config Issues', slug: 'dmx-core-100/troubleshooting/config-issues' },
              ],
            },
            {
              label: 'Common Tasks',
              items: [
                { label: 'Overview', slug: 'dmx-core-100/common-tasks' },
                { label: 'Move Data Between Units', slug: 'dmx-core-100/common-tasks/move-data-between-dmx-core-100-units' },
              ],
            },
            { label: 'Release Notes', slug: 'dmx-core-100/release-notes' },
          ],
        },
        {
          label: 'DMX Core Pico 2',
          items: [
            { label: 'Overview', slug: 'dmx-core-pico-2' },
            { label: 'FAQ', slug: 'dmx-core-pico-2/faq' },
            { label: 'Pin out', slug: 'dmx-core-pico-2/pin-out' },
            { label: 'Software', slug: 'dmx-core-pico-2/software' },
            { label: 'Errata', slug: 'dmx-core-pico-2/errata' },
          ],
        },
        {
          label: 'DMX Core Pico 2 Re-Mapper',
          items: [
            { label: 'Overview', slug: 'dmx-core-pico-2-re-mapper' },
            { label: 'FAQ', slug: 'dmx-core-pico-2-re-mapper/faq' },
            { label: 'Config Utility', slug: 'dmx-core-pico-2-re-mapper/config-utility' },
            { label: 'Pin out', slug: 'dmx-core-pico-2-re-mapper/pin-out' },
            { label: 'Software', slug: 'dmx-core-pico-2-re-mapper/software' },
          ],
        },
      ],
    }),
  ],
});
