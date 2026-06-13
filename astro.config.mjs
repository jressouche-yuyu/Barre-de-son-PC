// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/consts';

// Permet de surcharger l'URL et le sous-chemin au build (ex. GitHub Pages).
// - En production sur le domaine final : valeurs par défaut (SITE.url, racine).
// - Sur GitHub Pages : SITE_URL=https://<user>.github.io et BASE_PATH=/<repo>.
const site = process.env.SITE_URL || SITE.url;
const base = process.env.BASE_PATH || '/';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-FR' },
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
