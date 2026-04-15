// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ttrpg.pyrrhic-stars.com',
  base: '/',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    react(),
    sitemap(),
  ],
  image: {
    service: { entrypoint: 'astro/assets/services/noop' },
  },
  vite: {
    server: {
      fs: {
        allow: ['..'],
      },
    },
    optimizeDeps: {
      include: ['js-yaml'],
    },
    ssr: {
      noExternal: ['js-yaml'],
    },
  },
});
