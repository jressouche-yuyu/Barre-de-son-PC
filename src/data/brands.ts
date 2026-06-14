/**
 * Métadonnées des marques (pages /marques/[slug]).
 * Le slug correspond au nom de marque en minuscules utilisé dans soundbars.ts.
 */
export interface BrandInfo {
  /** Nom exact tel qu'utilisé dans le champ `brand` des produits. */
  name: string;
  slug: string;
  cover: string;
  coverAlt: string;
  /** Couleur d'accent de la marque (monogramme typographique). */
  accent: string;
  /**
   * Logo officiel (optionnel). Déposez le fichier sous
   * /public/images/brands/logos/ UNIQUEMENT si vous avez les droits d'usage.
   * Sinon, un monogramme typographique dans la couleur de marque est affiché.
   */
  logo?: string;
  /** Intro éditoriale (riche en contexte pour le SEO/GEO). */
  intro: string;
}

export const brands: BrandInfo[] = [
  {
    name: 'Razer',
    slug: 'razer',
    cover: '/images/brands/razer.webp',
    coverAlt: 'Barre de son gaming aux accents verts Razer',
    accent: '#44D62C',
    intro:
      'Razer décline sa gamme Leviathan pensée pour le gaming sur PC : son immersif (THX Spatial, audio 3D à suivi de tête), éclairage Chroma RGB et caissons de basses efficaces. Du modèle compact USB-C au modèle premium, c\'est la référence des setups joueurs.',
  },
  {
    name: 'Creative',
    slug: 'creative',
    cover: '/images/brands/creative.webp',
    coverAlt: 'Barre de son Creative aux accents orange',
    accent: '#F5821F',
    intro:
      'Pionnier de l\'audio PC avec la marque Sound Blaster, Creative couvre tous les besoins : barres compactes en USB-C, combos avec caisson, traitement Super X-Fi et connectique très complète (HDMI ARC, optique, Bluetooth), à des tarifs variés.',
  },
  {
    name: 'Edifier',
    slug: 'edifier',
    cover: '/images/brands/edifier.webp',
    coverAlt: 'Barre de son Edifier aux accents bleus',
    accent: '#0072CE',
    intro:
      'Edifier mise sur le rapport qualité-prix et la polyvalence : barres et enceintes compactes pour le bureau, souvent dotées d\'un Bluetooth récent, d\'un éclairage RGB et parfois d\'un micro intégré pour la visio.',
  },
  {
    name: 'Logitech',
    slug: 'logitech',
    cover: '/images/brands/logitech.webp',
    coverAlt: 'Enceintes de bureau Logitech aux accents cyan',
    accent: '#00B8FC',
    intro:
      'Logitech propose des solutions audio de bureau accessibles et fiables, comme le kit 2.1 Z407 à la molette de contrôle sans fil et aux basses généreuses — une alternative pratique à la barre de son classique.',
  },
  {
    name: 'Trust',
    slug: 'trust',
    cover: '/images/brands/trust.webp',
    coverAlt: 'Barre de son gaming RGB Trust aux accents rouges',
    accent: '#E2001A',
    intro:
      'Trust cible les setups gaming à petit budget avec ses barres RGB de la gamme GXT : simples à brancher en USB, pensées pour habiller un bureau et apporter un éclairage coloré sans se ruiner.',
  },
];

export function getBrand(slug: string) {
  return brands.find((b) => b.slug === slug);
}
