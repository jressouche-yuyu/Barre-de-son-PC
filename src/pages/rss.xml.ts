import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../consts';
import { guides } from '../data/guides';
import { rankings } from '../data/rankings';

/** Flux RSS agrégeant guides et classements — utile pour la découverte et le partage. */
export function GET(context: APIContext) {
  const site = context.site ?? new URL(SITE.url);

  const guideItems = guides.map((g) => ({
    title: g.title,
    description: g.description,
    link: `/guides/${g.slug}`,
    pubDate: new Date(g.lastUpdated),
  }));

  const rankingItems = rankings.map((r) => ({
    title: r.title,
    description: r.metaDescription,
    link: `/classements/${r.slug}`,
    pubDate: new Date(r.lastUpdated),
  }));

  const items = [...rankingItems, ...guideItems].sort(
    (a, b) => b.pubDate.getTime() - a.pubDate.getTime(),
  );

  return rss({
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    site,
    items,
    customData: `<language>${SITE.lang}</language>`,
  });
}
