/**
 * Modèle de données du site.
 * Tout le contenu structuré (produits, classements, guides) repose sur ces types.
 * Les notes sont sur 10 pour rester lisibles dans les tableaux et les schémas Review.
 */

export type ConnectivityType =
  | 'USB'
  | 'Bluetooth'
  | 'Jack 3.5mm'
  | 'Optique'
  | 'HDMI ARC'
  | 'Wi-Fi';

export interface ScoreBreakdown {
  /** Qualité sonore globale (clarté, équilibre, scène). */
  son: number;
  /** Restitution des basses / présence d'un caisson. */
  basses: number;
  /** Praticité sur un bureau : encombrement, commandes, micro éventuel. */
  ergonomie: number;
  /** Richesse et pertinence de la connectique pour un usage PC. */
  connectique: number;
  /** Rapport qualité-prix. */
  rapportQualitePrix: number;
}

export interface Soundbar {
  /** Identifiant d'URL (slug), unique et stable. */
  slug: string;
  /** Nom commercial complet. */
  name: string;
  brand: string;
  /** Prix indicatif constaté en euros (TTC). */
  price: number;
  /** Devise ISO 4217. */
  currency: 'EUR';
  /** Note globale sur 10 (sert au tri et au schéma Review). */
  score: number;
  /** Détail des notes par critère. */
  scores: ScoreBreakdown;
  /** Phrase d'accroche (≤ 160 caractères) — citable par les moteurs génératifs. */
  verdict: string;
  /** Résumé éditorial de 2 à 4 phrases. */
  summary: string;
  pros: string[];
  cons: string[];
  /** Public / usage idéal — utile pour les requêtes intentionnelles. */
  bestFor: string;
  connectivity: ConnectivityType[];
  /** Puissance annoncée en watts (RMS de préférence). */
  powerWatts: number;
  /** Présence d'un caisson de basses dédié. */
  hasSubwoofer: boolean;
  /** Présence d'un microphone intégré (visio, jeu). */
  hasMicrophone: boolean;
  /** Éclairage RGB (argument gaming). */
  hasRGB: boolean;
  /** Dimensions L×H×P en cm. */
  dimensionsCm: { width: number; height: number; depth: number };
  /** Date de la dernière vérification éditoriale (ISO 8601). Important pour la fraîcheur SEO/GEO. */
  lastUpdated: string;
  /** Année de sortie du produit. */
  releaseYear: number;
}

export interface RankingItem {
  /** Slug d'une barre de son présente dans le dataset. */
  soundbar: string;
  /** Justification courte du positionnement dans CE classement. */
  why: string;
}

export interface Ranking {
  slug: string;
  /** Titre H1 / balise title optimisé requête. */
  title: string;
  /** Sous-titre éditorial. */
  subtitle: string;
  /** Meta description dédiée (≤ 160 caractères). */
  metaDescription: string;
  /** Intro éditoriale (paragraphe d'ouverture, riche en contexte pour le GEO). */
  intro: string;
  /** Items classés, dans l'ordre. */
  items: RankingItem[];
  /** Questions / réponses spécifiques au classement (FAQ schema). */
  faq: { question: string; answer: string }[];
  lastUpdated: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  /** Date de publication ISO 8601. */
  publishedAt: string;
  lastUpdated: string;
  /** Temps de lecture estimé en minutes. */
  readingMinutes: number;
  /** Sections du guide (H2 + contenu en Markdown léger/HTML). */
  sections: { heading: string; body: string }[];
  faq: { question: string; answer: string }[];
}
