import type { Soundbar } from './types';

/**
 * Jeu de données des barres de son pour PC.
 *
 * ⚠️ Contenu de démonstration : les caractéristiques, prix et notes sont des
 * exemples destinés à structurer le site. Avant mise en ligne, vérifie et
 * actualise chaque fiche (prix, dispo, specs constructeur) — la fraîcheur et
 * l'exactitude sont des signaux SEO/GEO majeurs.
 */
export const soundbars: Soundbar[] = [
  {
    slug: 'razer-leviathan-v2',
    name: 'Razer Leviathan V2',
    brand: 'Razer',
    price: 249,
    currency: 'EUR',
    score: 8.6,
    scores: { son: 8.5, basses: 9, ergonomie: 8.5, connectique: 8, rapportQualitePrix: 8 },
    verdict:
      'La référence gaming sur bureau : caisson compact, RGB Chroma et son immersif via USB-C.',
    summary:
      'Pensée pour le PC, la Leviathan V2 se branche en USB-C et s\'accompagne d\'un caisson de basses dédié qui tient sous le bureau. Le rendu est dynamique, l\'éclairage Chroma soigné, et l\'ensemble reste compact sous un moniteur.',
    pros: [
      'Caisson de basses dédié très efficace',
      'Branchement USB-C plug-and-play sur PC',
      'Éclairage RGB Chroma personnalisable',
      'Format compact adapté à un bureau',
    ],
    cons: ['Pas de prise jack', 'Logiciel Synapse parfois lourd', 'Aigus un peu en retrait à fort volume'],
    bestFor: 'Joueurs PC cherchant des basses physiques et du RGB sans encombrer le bureau',
    connectivity: ['USB', 'Bluetooth'],
    powerWatts: 60,
    hasSubwoofer: true,
    hasMicrophone: false,
    hasRGB: true,
    dimensionsCm: { width: 50, height: 8.2, depth: 9.5 },
    lastUpdated: '2026-06-01',
    releaseYear: 2022,
  },
  {
    slug: 'creative-sound-blaster-katana-v2x',
    name: 'Creative Sound Blaster Katana V2X',
    brand: 'Creative',
    price: 199,
    currency: 'EUR',
    score: 8.4,
    scores: { son: 8.5, basses: 8.5, ergonomie: 8, connectique: 9, rapportQualitePrix: 8.5 },
    verdict:
      'Connectique riche et caisson généreux : la polyvalente qui passe du PC à la TV sans broncher.',
    summary:
      'La Katana V2X mise sur la polyvalence : USB, Bluetooth et optique cohabitent, le caisson est ample et le moteur Super X-Fi pousse le rendu casque. Un excellent compromis pour un poste hybride PC/console/TV.',
    pros: [
      'Connectique complète (USB, Bluetooth, optique)',
      'Caisson de basses imposant',
      'Traitement Super X-Fi convaincant au casque',
      'Bon rapport qualité-prix',
    ],
    cons: ['Encombrement du caisson', 'Interface logicielle dense', 'RGB plus discret que la concurrence'],
    bestFor: 'Usage hybride PC / console / TV avec besoin de connectique variée',
    connectivity: ['USB', 'Bluetooth', 'Optique'],
    powerWatts: 126,
    hasSubwoofer: true,
    hasMicrophone: false,
    hasRGB: true,
    dimensionsCm: { width: 60, height: 6, depth: 7.8 },
    lastUpdated: '2026-05-20',
    releaseYear: 2022,
  },
  {
    slug: 'creative-stage-v2',
    name: 'Creative Stage V2',
    brand: 'Creative',
    price: 99,
    currency: 'EUR',
    score: 7.9,
    scores: { son: 7.5, basses: 8, ergonomie: 8, connectique: 7.5, rapportQualitePrix: 9.5 },
    verdict:
      'Le meilleur premier prix : un combo barre + caisson honnête pour moins de 100 €.',
    summary:
      'La Stage V2 démocratise le combo barre + caisson. Le rendu reste correct, les basses présentes pour le tarif, et la connectique couvre l\'essentiel (USB, Bluetooth, optique). Le choix malin des petits budgets.',
    pros: [
      'Excellent rapport qualité-prix',
      'Caisson de basses inclus',
      'Clear Dialog pour la voix',
      'Compacte et discrète',
    ],
    cons: ['Puissance limitée', 'Finition plastique', 'Scène sonore étroite'],
    bestFor: 'Petit budget cherchant un vrai upgrade face aux haut-parleurs de moniteur',
    connectivity: ['USB', 'Bluetooth', 'Optique', 'Jack 3.5mm'],
    powerWatts: 80,
    hasSubwoofer: true,
    hasMicrophone: false,
    hasRGB: false,
    dimensionsCm: { width: 41, height: 7.8, depth: 7 },
    lastUpdated: '2026-05-28',
    releaseYear: 2021,
  },
  {
    slug: 'razer-leviathan-v2-pro',
    name: 'Razer Leviathan V2 Pro',
    brand: 'Razer',
    price: 449,
    currency: 'EUR',
    score: 8.8,
    scores: { son: 9, basses: 9, ergonomie: 8.5, connectique: 8, rapportQualitePrix: 7.5 },
    verdict:
      'Son 3D à suivi de tête : l\'expérience la plus immersive du marché PC, à prix premium.',
    summary:
      'La V2 Pro intègre le beamforming et un suivi de tête par caméra IR pour une bulle sonore 3D recentrée sur le joueur. Technologiquement bluffante, elle vise les passionnés prêts à payer le prix de l\'immersion.',
    pros: [
      'Audio 3D avec suivi de tête (THX Spatial)',
      'Caisson puissant et précis',
      'Finition premium',
      'RGB Chroma',
    ],
    cons: ['Tarif élevé', 'Suivi de tête gadget pour certains', 'Dépendance au logiciel Synapse'],
    bestFor: 'Joueurs solo en quête de l\'immersion 3D maximale sur un seul poste',
    connectivity: ['USB', 'Bluetooth'],
    powerWatts: 60,
    hasSubwoofer: true,
    hasMicrophone: false,
    hasRGB: true,
    dimensionsCm: { width: 50, height: 8.2, depth: 9.5 },
    lastUpdated: '2026-06-05',
    releaseYear: 2023,
  },
  {
    slug: 'edifier-mr4',
    name: 'Edifier MR4',
    brand: 'Edifier',
    price: 119,
    currency: 'EUR',
    score: 8.1,
    scores: { son: 8.5, basses: 7.5, ergonomie: 7.5, connectique: 7.5, rapportQualitePrix: 9 },
    verdict:
      'Des moniteurs studio détournés pour le bureau : neutralité et clarté pour les puristes.',
    summary:
      'Techniquement des enceintes de monitoring plutôt qu\'une barre, les MR4 séduisent ceux qui privilégient la fidélité. Le son est neutre et détaillé, idéal pour la musique et le montage, au détriment du spectacle des basses.',
    pros: [
      'Restitution neutre et fidèle',
      'Très bon prix pour du monitoring',
      'Double entrée (TRS + RCA)',
      'Construction solide',
    ],
    cons: ['Pas de Bluetooth', 'Format à deux enceintes (pas une barre)', 'Basses sobres sans caisson'],
    bestFor: 'Création audio, musique et utilisateurs recherchant la neutralité',
    connectivity: ['Jack 3.5mm'],
    powerWatts: 42,
    hasSubwoofer: false,
    hasMicrophone: false,
    hasRGB: false,
    dimensionsCm: { width: 14, height: 22.8, depth: 18 },
    lastUpdated: '2026-05-15',
    releaseYear: 2022,
  },
  {
    slug: 'trust-gxt-619-thorne',
    name: 'Trust GXT 619 Thorne',
    brand: 'Trust',
    price: 59,
    currency: 'EUR',
    score: 7.0,
    scores: { son: 6.5, basses: 6.5, ergonomie: 8, connectique: 7, rapportQualitePrix: 8.5 },
    verdict:
      'La barre RGB la moins chère pour habiller un setup gaming à petit prix.',
    summary:
      'La Thorne vise les setups colorés sans se ruiner : barre unique alimentée en USB, éclairage RGB et son correct pour de la bureautique et du jeu occasionnel. À réserver aux budgets serrés.',
    pros: ['Prix plancher', 'Éclairage RGB', 'Alimentation USB simple', 'Très compacte'],
    cons: ['Basses faibles', 'Puissance modeste', 'Pas de caisson'],
    bestFor: 'Setup gaming d\'entrée de gamme et usage bureautique',
    connectivity: ['USB', 'Jack 3.5mm'],
    powerWatts: 12,
    hasSubwoofer: false,
    hasMicrophone: false,
    hasRGB: true,
    dimensionsCm: { width: 40, height: 6, depth: 9 },
    lastUpdated: '2026-04-30',
    releaseYear: 2021,
  },
  {
    slug: 'creative-sound-blaster-gs5',
    name: 'Creative Sound Blaster GS5',
    brand: 'Creative',
    price: 79,
    currency: 'EUR',
    score: 7.4,
    scores: { son: 7.5, basses: 6.5, ergonomie: 8.5, connectique: 7, rapportQualitePrix: 8.5 },
    verdict:
      'Compacte et nerveuse : la barre USB qui muscle l\'audio d\'un moniteur sans caisson.',
    summary:
      'La GS5 condense une barre 2.0 dans un format mini avec radiateurs passifs pour gonfler les basses. Branchée en USB ou jack, elle est idéale pour gagner en clarté sur un petit bureau, sans encombrement.',
    pros: ['Format ultra-compact', 'Radiateurs passifs pour les basses', 'USB-C ou jack', 'Bon prix'],
    cons: ['Pas de Bluetooth', 'Basses limitées sans caisson', 'Volume max modeste'],
    bestFor: 'Petits bureaux et moniteurs cherchant un gain de clarté discret',
    connectivity: ['USB', 'Jack 3.5mm'],
    powerWatts: 10,
    hasSubwoofer: false,
    hasMicrophone: false,
    hasRGB: false,
    dimensionsCm: { width: 41, height: 6.4, depth: 7.3 },
    lastUpdated: '2026-05-10',
    releaseYear: 2022,
  },
  {
    slug: 'logitech-z407',
    name: 'Logitech Z407',
    brand: 'Logitech',
    price: 99,
    currency: 'EUR',
    score: 7.6,
    scores: { son: 7.5, basses: 8.5, ergonomie: 7, connectique: 7, rapportQualitePrix: 8 },
    verdict:
      'Basses généreuses et molette sans fil : un 2.1 polyvalent plus qu\'une vraie barre.',
    summary:
      'Le Z407 n\'est pas une barre mais un kit 2.1 avec gros caisson et molette de contrôle sans fil. Les basses sont son point fort ; à considérer si tu privilégies l\'impact au format barre épuré.',
    pros: ['Caisson de basses puissant', 'Molette de contrôle sans fil', 'Bluetooth + USB + jack', 'Prix contenu'],
    cons: ['Format 2.1, pas une barre', 'Aigus perfectibles', 'Encombrement du caisson'],
    bestFor: 'Recherche de basses marquées avec un budget maîtrisé',
    connectivity: ['USB', 'Bluetooth', 'Jack 3.5mm'],
    powerWatts: 80,
    hasSubwoofer: true,
    hasMicrophone: false,
    hasRGB: false,
    dimensionsCm: { width: 39, height: 12, depth: 12 },
    lastUpdated: '2026-05-22',
    releaseYear: 2020,
  },
];

/** Retourne une barre de son par son slug. */
export function getSoundbar(slug: string): Soundbar | undefined {
  return soundbars.find((s) => s.slug === slug);
}

/** Liste triée par note décroissante. */
export function soundbarsByScore(): Soundbar[] {
  return [...soundbars].sort((a, b) => b.score - a.score);
}

/** Formatage prix en euros, locale FR. */
export function formatPrice(price: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);
}
