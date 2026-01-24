// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
    site: 'https://www.md2text.com',
    output: 'server',
    adapter: cloudflare({
        imageService: 'compile',
    }),
    integrations: [react(), tailwind()],
    vite: {
        resolve: {
            alias: {
                "react-dom/server": "react-dom/server.edge",
            },
        },
    },
});
