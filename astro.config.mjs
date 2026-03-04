// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://docs.dmxcore.com',
  integrations: [
    starlight({
      title: 'DMX Core 100',
      logo: {
        light: './src/assets/logo.png',
        dark: './src/assets/logo.png',
        replacesTitle: true,
      },
      social: {
        github: 'https://github.com/DMXCore/DmxCore100',
      },
      head: [],
      sidebar: [
        {
          label: 'Main',
          items: [
            { label: 'Overview', slug: '' },
            { label: 'Features', slug: 'main/features' },
            { label: 'Applications', slug: 'main/applications' },
            { label: 'FAQ', slug: 'main/faq' },
            { label: 'Specifications', slug: 'main/specifications' },
            { label: 'Warranty', slug: 'main/warranty' },
          ],
        },
        {
          label: 'Getting Started',
          items: [
            { label: 'Overview', slug: 'getting-started' },
            { label: 'Installation', slug: 'getting-started/installation' },
            { label: 'Home Screen', slug: 'getting-started/home-screen' },
            { label: 'Main Menu', slug: 'getting-started/main-menu' },
          ],
        },
        {
          label: 'Lighting',
          items: [
            { label: 'Overview', slug: 'lighting' },
            { label: 'Passthrough', slug: 'lighting/passthrough' },
          ],
        },
        {
          label: 'Configuration',
          items: [
            { label: 'Overview', slug: 'configuration' },
            { label: 'Admin Mode', slug: 'configuration/admin-mode' },
            { label: 'Settings', slug: 'configuration/settings' },
            { label: 'Output Config', slug: 'configuration/output-config' },
          ],
        },
        { label: 'Cues', slug: 'cues' },
        {
          label: 'Basics',
          items: [
            { label: 'Overview', slug: 'basics' },
            { label: 'Navigation', slug: 'basics/navigation' },
            { label: 'Numeric Input', slug: 'basics/numeric-input' },
            { label: 'Text Edit', slug: 'basics/text-edit' },
            { label: 'Blackout and Stop', slug: 'basics/blackout-and-stop' },
          ],
        },
        { label: 'Patterns', slug: 'patterns' },
        { label: 'Presets', slug: 'presets' },
        { label: 'Recording', slug: 'recording' },
        { label: 'Schedules', slug: 'schedules' },
        { label: 'Utilities', slug: 'utilities' },
        { label: 'External Control', slug: 'external-control' },
        {
          label: 'Integrations',
          items: [
            { label: 'Overview', slug: 'integrations' },
            { label: 'OSC – Open Sound Control', slug: 'integrations/osc-open-sound-control' },
          ],
        },
        {
          label: 'Screenshots',
          items: [
            { label: 'Overview', slug: 'screenshots' },
            {
              label: 'Presets',
              items: [
                { label: 'Presets', slug: 'screenshots/presets' },
                { label: 'Configuration', slug: 'screenshots/presets/configuration' },
              ],
            },
            {
              label: 'Cues',
              items: [
                { label: 'Cues', slug: 'screenshots/cues' },
                { label: 'Configuration/Recording', slug: 'screenshots/cues/configuration-recording' },
              ],
            },
            {
              label: 'Light Fixtures',
              items: [
                { label: 'Light Fixtures', slug: 'screenshots/light-fixtures' },
                { label: 'Configuration', slug: 'screenshots/light-fixtures/configuration' },
              ],
            },
            { label: 'Custom Menu', slug: 'screenshots/custom-menu' },
            { label: 'External Control', slug: 'screenshots/external-control' },
            { label: 'Admin Features', slug: 'screenshots/admin-features' },
            { label: 'Q-Sys Remote Control', slug: 'screenshots/q-sys-remote-control' },
          ],
        },
        {
          label: 'Troubleshooting',
          items: [
            { label: 'Overview', slug: 'troubleshooting' },
            { label: 'Re-flash Instructions', slug: 'troubleshooting/re-flash-instructions' },
            { label: 'Config Issues', slug: 'troubleshooting/config-issues' },
          ],
        },
        {
          label: 'Customizations',
          items: [
            { label: 'Overview', slug: 'customizations' },
            { label: 'Menu Background', slug: 'customizations/menu-background' },
            { label: 'Main/Home Screen Logo', slug: 'customizations/main-home-screen-logo' },
          ],
        },
        { label: 'Release Notes', slug: 'release-notes' },
        {
          label: 'Common Tasks',
          items: [
            { label: 'Overview', slug: 'common-tasks' },
            { label: 'Move Data Between Units', slug: 'common-tasks/move-data-between-dmx-core-100-units' },
          ],
        },
        {
          label: 'Desktop Software',
          items: [
            { label: 'Overview', slug: 'desktop-software' },
            { label: 'Windows', slug: 'desktop-software/windows' },
            { label: 'macOS', slug: 'desktop-software/mac' },
            { label: 'Linux', slug: 'desktop-software/linux' },
          ],
        },
      ],
    }),
  ],
});
