/**
 * Configuration centrale du site.
 * Modifie ces valeurs pour adapter la marque, l'URL et les métadonnées globales.
 */

export const SITE = {
  /** Nom de marque affiché dans l'en-tête, les titres et les données structurées. */
  name: 'BarreSon PC',
  /** Domaine de production (sans slash final). Utilisé pour les URL canoniques, le sitemap et les schémas. */
  url: 'https://www.barresonpc.fr',
  /** Slogan court — réutilisé dans la home et les balises meta. */
  tagline: 'Tests, comparatifs & guides audio PC',
  /** Description par défaut (meta description de repli, ~155 caractères). */
  description:
    'Classements, comparatifs et guides d\'achat des meilleures barres de son pour PC. Tests indépendants, critères clairs et recommandations à jour.',
  /** Langue principale du contenu. */
  lang: 'fr-FR',
  locale: 'fr_FR',
  /** Auteur / éditeur du site (entité E-E-A-T). */
  author: 'La rédaction BarreSon PC',
  /** Réseaux sociaux et profils (utilisés dans le schéma Organization → sameAs). */
  social: {
    twitter: 'https://twitter.com/barresonpc',
    youtube: 'https://www.youtube.com/@barresonpc',
  },
  /** Image Open Graph par défaut (chemin relatif à /public). */
  defaultOgImage: '/og-default.svg',
} as const;

/**
 * Configuration de l'affiliation Amazon.
 * - `partnerTag` : ton identifiant Partenaires Amazon (à créer sur
 *   partenaires.amazon.fr). Remplace la valeur placeholder ci-dessous.
 * - `marketplace` : domaine Amazon ciblé.
 * Les liens sont générés par `lib/affiliate.ts` : lien direct si l'ASIN du
 * produit est connu, sinon recherche Amazon par nom — toujours avec ton tag.
 */
export const AFFILIATE = {
  partnerTag: 'jrgrowth-21',
  marketplace: 'https://www.amazon.fr',
  /** Active/désactive globalement l'affichage des boutons d'achat. */
  enabled: true,
} as const;

/** Navigation principale (header). */
export const NAV: { label: string; href: string }[] = [
  { label: 'Classements', href: '/classements' },
  { label: 'Barres de son', href: '/barres-de-son' },
  { label: 'Comparateur', href: '/comparateur' },
  { label: 'Guides', href: '/guides' },
  { label: 'Blog', href: '/blog' },
  { label: 'À propos', href: '/a-propos' },
];
