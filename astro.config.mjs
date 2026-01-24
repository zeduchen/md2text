// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
const isBuild = process.argv.includes('build');

export default defineConfig({
    site: 'https://www.md2text.com',
    output: 'server',
    adapter: cloudflare({
        imageService: 'compile',
    }),
    integrations: [react(), tailwind(), sitemap()],
    vite: {
        resolve: {
            alias: isBuild ? {
                "react-dom/server": "react-dom/server.edge",
            } : undefined,
        },
    },
});