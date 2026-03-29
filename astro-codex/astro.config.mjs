// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://lanmusic.github.io',
  base: '/rpg/',
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
