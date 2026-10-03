// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://varshilanavadia.github.io',
  integrations: [sitemap()],
  // The browsers the CSS is written for. Without a target the minifier assumes the newest of
  // everything and drops prefixes, among them -webkit-backdrop-filter, which Safari needs for
  // the bar's glass before version 18 (iOS 17 and older); with it, the prefix stays.
  vite: { build: { cssTarget: ['safari16.4', 'ios16.4', 'chrome111', 'firefox114'] } },
});
