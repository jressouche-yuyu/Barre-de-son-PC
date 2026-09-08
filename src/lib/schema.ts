/**
 * Fabriques de données structurées schema.org (JSON-LD).
 *
 * Les données structurées sont déterminantes pour le SEO (rich results) et le
 * GEO : elles donnent aux moteurs génératifs un contenu factuel, désambiguïsé
 * et directement citable. On privilégie les types les plus exploités :
 * Organization, WebSite, BreadcrumbList, Product/Review, ItemList, FAQPage,
 * Article.
 */
import { SITE } from '../consts';
import type { Soundbar, Ranking, Guide } from '../data/types';
import { AVAILABILITY_SCHEMA, priceBand } from './prix';
import { resolveRankingItems } from '../data/rankings';

const abs = (path: string) => new URL(path, SITE.url).href;

/** Schéma éditeur du site (E-E-A-T). À inclure sur toutes les pages. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    sameAs: Object.values(SITE.social),
  };
}

/** Schéma WebSite avec action de recherche potentielle. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: SITE.lang,
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

/** Fil d'Ariane structuré. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

/** Produit + avis éditorial (note sur 10 → ramenée sur l'échelle native). */
export function productReviewSchema(sb: Soundbar) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: sb.name,
    brand: { '@type': 'Brand', name: sb.brand },
    category: 'Barre de son PC',
    description: sb.summary,
    image: abs(sb.image),
    /**
     * AggregateOffer et non Offer : le site ne connaît pas le prix du jour et
     * n'a pas le droit de l'affirmer. Ce qu'il peut affirmer, c'est la
     * fourchette de gamme dans laquelle il classe le produit — une information
     * éditoriale qui reste vraie d'une semaine à l'autre. Publier un
     * `offers.price` figé depuis des mois expose les résultats enrichis à une
     * incohérence prix page / prix marchand.
     */
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: priceBand(sb.price).low,
      highPrice: priceBand(sb.price).high,
      priceCurrency: sb.currency,
      offerCount: 1,
      availability: AVAILABILITY_SCHEMA[sb.availability],
      url: abs(`/barres-de-son/${sb.slug}`),
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: sb.score,
        bestRating: 10,
        worstRating: 0,
      },
      author: { '@type': 'Organization', name: SITE.name },
      datePublished: sb.lastUpdated,
      name: `Test : ${sb.name}`,
      reviewBody: sb.summary,
      positiveNotes: {
        '@type': 'ItemList',
        itemListElement: sb.pros.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p })),
      },
      negativeNotes: {
        '@type': 'ItemList',
        itemListElement: sb.cons.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c })),
      },
    },
  };
}

/** Liste ordonnée d'un classement (ItemList → rich result « liste »). */
export function rankingItemListSchema(ranking: Ranking, resolve: (slug: string) => Soundbar | undefined) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: ranking.title,
    description: ranking.metaDescription,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: ranking.items.length,
    // Même ordre que la page : les produits indisponibles y descendent aussi,
    // sinon les données structurées annonceraient un n°1 que la page n'affiche
    // pas en premier — une incohérence directement vérifiable par un moteur.
    itemListElement: resolveRankingItems(ranking, resolve).map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.sb.name,
      url: abs(`/barres-de-son/${item.sb.slug}`),
    })),
  };
}

/** Liste de produits (ItemList) générique — ex. top 3 de la page d'accueil. */
export function soundbarsItemListSchema(list: Soundbar[], name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: list.length,
    itemListElement: list.map((sb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: sb.name,
      url: abs(`/barres-de-son/${sb.slug}`),
    })),
  };
}

/** FAQ structurée — fortement reprise dans les AI Overviews et les réponses génératives. */
export function faqSchema(faq: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** Tutoriel d'installation → schéma HowTo, très exploité par les moteurs génératifs (GEO). */
export function howToSchema(sb: Soundbar) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Comment installer la ${sb.name} sur un PC`,
    description: sb.tutorial.intro,
    step: sb.tutorial.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.body,
    })),
  };
}

/** Article de blog (BlogPosting). */
export function blogPostingSchema(post: {
  title: string;
  description: string;
  slug: string;
  publishedAt: Date;
  updatedAt?: Date;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    inLanguage: SITE.lang,
    datePublished: post.publishedAt.toISOString(),
    dateModified: (post.updatedAt ?? post.publishedAt).toISOString(),
    author: { '@type': 'Organization', name: SITE.author },
    publisher: { '@id': `${SITE.url}/#organization` },
    mainEntityOfPage: abs(`/blog/${post.slug}`),
  };
}

/** Article éditorial (guides). */
export function articleSchema(guide: Guide) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    inLanguage: SITE.lang,
    datePublished: guide.publishedAt,
    dateModified: guide.lastUpdated,
    author: { '@type': 'Organization', name: SITE.author },
    publisher: { '@id': `${SITE.url}/#organization` },
    mainEntityOfPage: abs(`/guides/${guide.slug}`),
  };
}
