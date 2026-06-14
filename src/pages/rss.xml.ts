import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';
import { guides } from '../data/guides';
import { rankings } from '../data/rankings';

/** Flux RSS agrégeant articles de blog, guides et classements. */
export async function GET(context: APIContext) {
  const site = context.site ?? new URL(SITE.url);

  const posts = await getCollection('blog', (p) => !p.data.draft);
  const blogItems = posts.map((p) => ({
    title: p.data.title,
    description: p.data.description,
    link: `/blog/${p.id}`,
    pubDate: p.data.publishedAt,
  }));

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

  const items = [...blogItems, ...rankingItems, ...guideItems].sort(
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
