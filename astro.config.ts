import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import type { AstroUserConfig } from 'astro';
import rehypeKatex from 'rehype-katex';
import behead from 'remark-behead';
import remarkMath from 'remark-math';
import subsetFont from 'subset-font';
import { SITE_TITLE } from './src/consts';

export default {
  site: 'https://plexiglass.eyrin.jp',
  build: { format: 'file' },
  integrations: [sitemap(), react()],
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: 'bundle-font',
        async generateBundle(_, bundle) {
          const font = Object.values(bundle)
            .filter((output) => output.type === 'asset')
            .find((asset) =>
              asset.originalFileNames.some((name) =>
                name.endsWith('ubuntu-sans-mono-latin-wght-normal.woff2'),
              ),
            );
          if (font) {
            const subset = await subsetFont(
              Buffer.from(font.source),
              ` <>/-0123456789PrevNext${SITE_TITLE}`,
              {
                targetFormat: 'woff2',
              },
            );
            font.source = new Uint8Array(subset);
          }
        },
      },
    ],
  },
  markdown: {
    remarkPlugins: [[behead, { minDepth: 2 }], remarkMath],
    rehypePlugins: [rehypeKatex],
  },
} satisfies AstroUserConfig;
