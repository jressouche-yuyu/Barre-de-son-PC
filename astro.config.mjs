// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/consts';
import { buildSitemapLookup, pathKey } from './src/lib/sitemap-data.ts';

// Permet de surcharger l'URL et le sous-chemin au build (ex. GitHub Pages).
// - En production sur le domaine final : valeurs par défaut (SITE.url, racine).
// - Sur GitHub Pages : SITE_URL=https://<user>.github.io et BASE_PATH=/<repo>.
const site = process.env.SITE_URL || SITE.url;
const base = process.env.BASE_PATH || '/';

// Table de métadonnées par page (lastmod, image principale, changefreq, priority).
const sitemapLookup = buildSitemapLookup();

// Préfixe d'assets « base-path aware » : en production base='/', sur GitHub
// Pages base='/<repo>/'. Les images sont servies sous ce préfixe.
const basePrefix = base === '/' ? '' : base.replace(/\/$/, '');

/**
 * Construit l'URL absolue d'un asset public à partir d'un chemin '/images/…'.
 * @param {string} imagePath
 */
function assetUrl(imagePath) {
  return new URL(`${basePrefix}${imagePath}`, site).href;
}

// https://astro.build/config
export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // Exclut les pages de redirection d'affiliation (/go/) du sitemap.
      filter: (page) => !/\/go\//.test(page),
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-FR' },
      },
      // Enrichit chaque entrée : <lastmod>, <image:image>, <changefreq>, <priority>.
      serialize(item) {
        const key = pathKey(new URL(item.url).pathname);
        const meta = sitemapLookup.get(key);
        if (!meta) return item;

        // `img` n'est pas exposé par les types de @astrojs/sitemap mais est bien
        // sérialisé en <image:image> à l'exécution — d'où le cast.
        /** @type {any} */
        const entry = item;
        if (meta.lastmod) entry.lastmod = meta.lastmod;
        if (meta.changefreq) entry.changefreq = meta.changefreq;
        if (typeof meta.priority === 'number') entry.priority = meta.priority;
        if (meta.image) {
          entry.img = [
            {
              url: assetUrl(meta.image),
              title: meta.imageAlt || undefined,
            },
          ];
        }
        return entry;
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
