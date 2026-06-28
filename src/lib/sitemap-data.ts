/**
 * Données d'enrichissement du sitemap.
 *
 * @astrojs/sitemap ne produit par défaut que des balises <loc>. Ce module
 * construit une table de correspondance « chemin d'URL → métadonnées » que la
 * fonction `serialize` de `astro.config.mjs` utilise pour ajouter, page par page :
 *
 *  - <lastmod>      : date de dernière mise à jour (fraîcheur SEO / GEO),
 *  - <image:image>  : image principale rattachée à l'URL (Google Images + LLM),
 *  - <changefreq> / <priority> : indices de crawl.
 *
 * Les images et dates proviennent des mêmes sources que les pages (src/data/*
 * et le frontmatter du blog), pour rester cohérentes et toujours à jour.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { soundbars } from '../data/soundbars.ts';
import { rankings } from '../data/rankings.ts';
import { guides } from '../data/guides.ts';
import { brands } from '../data/brands.ts';

export interface SitemapMeta {
  /** Date ISO de dernière modification (W3C datetime). */
  lastmod?: string;
  /** Chemin (sous /public) de l'image principale de la page. */
  image?: string;
  /** Texte alternatif de l'image. */
  imageAlt?: string;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
}

/** Normalise un chemin d'URL en clé : sans base, sans slash de bord. */
export function pathKey(pathname: string): string {
  return pathname.replace(/^\/+|\/+$/g, '');
}

/** Convertit une date 'YYYY-MM-DD' (ou ISO) en datetime ISO complet, ou undefined. */
function toIso(date?: string): string | undefined {
  if (!date) return undefined;
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

/** Retourne la date la plus récente d'une liste (ISO), pour les pages d'index. */
function maxIso(dates: (string | undefined)[]): string | undefined {
  const valid = dates.filter(Boolean) as string[];
  if (valid.length === 0) return undefined;
  return valid.reduce((a, b) => (new Date(a) > new Date(b) ? a : b));
}

/**
 * Lit le frontmatter des articles de blog (publishedAt, updatedAt, cover…).
 * On lit les fichiers directement : la config Astro n'a pas accès à
 * `astro:content`. Parsing minimal, suffisant pour ce frontmatter plat.
 */
function readBlogPosts() {
  const dir = fileURLToPath(new URL('../content/blog', import.meta.url));
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  } catch {
    return [] as {
      slug: string;
      lastmod?: string;
      cover?: string;
      coverAlt?: string;
    }[];
  }

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
      const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      const fm = match ? match[1] : '';
      const field = (name: string): string | undefined => {
        const m = fm.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
        if (!m) return undefined;
        return m[1].trim().replace(/^["']|["']$/g, '');
      };
      const draft = field('draft') === 'true';
      const published = field('publishedAt');
      const updated = field('updatedAt');
      return {
        slug: file.replace(/\.md$/, ''),
        draft,
        lastmod: toIso(updated) ?? toIso(published),
        cover: field('cover'),
        coverAlt: field('coverAlt'),
      };
    })
    .filter((p) => !p.draft);
}

/**
 * Construit la table de métadonnées indexée par clé de chemin (sans slash).
 * Ex. : 'barres-de-son/razer-leviathan-v2' → { lastmod, image, … }.
 */
export function buildSitemapLookup(): Map<string, SitemapMeta> {
  const map = new Map<string, SitemapMeta>();
  const posts = readBlogPosts();

  // Fiches produits — image de carte + date de vérification éditoriale.
  for (const sb of soundbars) {
    map.set(`barres-de-son/${sb.slug}`, {
      lastmod: toIso(sb.lastUpdated),
      image: sb.image,
      imageAlt: sb.imageAlt,
      changefreq: 'monthly',
      priority: 0.8,
    });
  }

  // Classements — couverture + date de mise à jour.
  for (const r of rankings) {
    map.set(`classements/${r.slug}`, {
      lastmod: toIso(r.lastUpdated),
      image: r.cover,
      imageAlt: r.coverAlt,
      changefreq: 'weekly',
      priority: 0.9,
    });
  }

  // Guides — couverture + date de mise à jour.
  for (const g of guides) {
    map.set(`guides/${g.slug}`, {
      lastmod: toIso(g.lastUpdated) ?? toIso(g.publishedAt),
      image: g.cover,
      imageAlt: g.coverAlt,
      changefreq: 'monthly',
      priority: 0.7,
    });
  }

  // Articles de blog — couverture + date de publication/mise à jour.
  for (const p of posts) {
    map.set(`blog/${p.slug}`, {
      lastmod: p.lastmod,
      image: p.cover,
      imageAlt: p.coverAlt,
      changefreq: 'monthly',
      priority: 0.6,
    });
  }

  // Pages marque — couverture + date max des produits de la marque.
  for (const b of brands) {
    const brandDates = soundbars
      .filter((s) => s.brand === b.name)
      .map((s) => toIso(s.lastUpdated));
    map.set(`marques/${b.slug}`, {
      lastmod: maxIso(brandDates),
      image: b.cover,
      imageAlt: b.coverAlt,
      changefreq: 'monthly',
      priority: 0.5,
    });
  }

  // Dates de fraîcheur agrégées pour les pages de liste (max des enfants).
  const productsMax = maxIso(soundbars.map((s) => toIso(s.lastUpdated)));
  const rankingsMax = maxIso(rankings.map((r) => toIso(r.lastUpdated)));
  const guidesMax = maxIso(
    guides.map((g) => toIso(g.lastUpdated) ?? toIso(g.publishedAt)),
  );
  const blogMax = maxIso(posts.map((p) => p.lastmod));
  const globalMax = maxIso([productsMax, rankingsMax, guidesMax, blogMax]);

  // Accueil et pages de section — priorités et fraîcheur dédiées.
  map.set('', { lastmod: globalMax, changefreq: 'weekly', priority: 1.0 });
  map.set('classements', {
    lastmod: rankingsMax,
    changefreq: 'weekly',
    priority: 0.9,
  });
  map.set('selection-du-mois', {
    lastmod: globalMax,
    changefreq: 'monthly',
    priority: 0.8,
  });
  map.set('barres-de-son', {
    lastmod: productsMax,
    changefreq: 'weekly',
    priority: 0.8,
  });
  map.set('comparateur', {
    lastmod: productsMax,
    changefreq: 'monthly',
    priority: 0.7,
  });
  map.set('guides', { lastmod: guidesMax, changefreq: 'weekly', priority: 0.7 });
  map.set('blog', { lastmod: blogMax, changefreq: 'weekly', priority: 0.6 });
  map.set('marques', {
    lastmod: productsMax,
    changefreq: 'monthly',
    priority: 0.5,
  });
  map.set('a-propos', { changefreq: 'yearly', priority: 0.3 });

  return map;
}
