/**
 * Modèle de données du site.
 * Tout le contenu structuré (produits, classements, guides) repose sur ces types.
 * Les notes sont sur 10 pour rester lisibles dans les tableaux et les schémas Review.
 */

export type ConnectivityType =
  | 'USB-C'
  | 'USB-A'
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

/** Étape d'un tutoriel d'installation / prise en main. */
export interface TutorialStep {
  title: string;
  body: string;
}

export interface Tutorial {
  /** Phrase d'introduction du tuto. */
  intro: string;
  steps: TutorialStep[];
  /** Astuces optionnelles (réglages, EQ, dépannage). */
  tips?: string[];
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
  /** Configuration des haut-parleurs (texte descriptif). */
  driverConfig: string;
  /** Puissance RMS en watts (si communiquée par le constructeur). */
  powerRmsWatts?: number;
  /** Puissance crête en watts (si communiquée). */
  powerPeakWatts?: number;
  /** Réponse en fréquence annoncée (ex. "45 Hz – 20 kHz"). */
  frequencyResponse?: string;
  /** Présence d'un caisson de basses dédié. */
  hasSubwoofer: boolean;
  /** Présence d'un microphone intégré (visio, jeu). */
  hasMicrophone: boolean;
  /** Éclairage RGB (argument gaming). */
  hasRGB: boolean;
  /** Dimensions de la barre L×H×P en cm. */
  dimensionsCm: { width: number; height: number; depth: number };
  /** Chemin de l'image produit (sous /public). */
  image: string;
  /** Texte alternatif de l'image (accessibilité + SEO image). */
  imageAlt: string;
  /** Galerie de photos réelles (chemins sous /public). Si présente, affiche un carrousel. */
  gallery?: string[];
  /** Tutoriel d'installation et de prise en main propre au produit. */
  tutorial: Tutorial;
  /** ASIN Amazon (optionnel) pour un lien d'affiliation direct. Sinon recherche par nom. */
  amazonAsin?: string;
  /** Lien direct vers la notice/manuel (PDF) du produit, si connu. Sinon lien de recherche. */
  manualUrl?: string;
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
  /** Image de couverture (chemin sous /public). Repli sur visuel génératif si absent. */
  cover?: string;
  coverAlt?: string;
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
  /** Image de couverture (chemin sous /public). Repli sur visuel génératif si absent. */
  cover?: string;
  coverAlt?: string;
  /** Date de publication ISO 8601. */
  publishedAt: string;
  lastUpdated: string;
  /** Temps de lecture estimé en minutes. */
  readingMinutes: number;
  /** Sections du guide (H2 + contenu en Markdown léger/HTML). */
  sections: { heading: string; body: string }[];
  faq: { question: string; answer: string }[];
}
