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

/**
 * État commercial d'un produit.
 * « fin-de-commercialisation » remplace la suppression d'une fiche : supprimer
 * une page produit jette le référencement acquis.
 */
export type Availability = 'disponible' | 'stock-limite' | 'fin-de-commercialisation';

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
  /**
   * Prix indicatif constaté en euros (TTC).
   * ⚠ N'EST PLUS AFFICHÉ TEL QUEL. Il sert uniquement à déduire la fourchette
   * de gamme () et à trier les classements « pas chères ».
   * Un prix exact affiché est faux la semaine suivante — voir prix.ts.
   */
  price: number;
  /** Devise ISO 4217. */
  currency: 'EUR';
  /**
   * Note globale sur 10 (sert au tri et au schéma Review).
   * ⚠ CALCULÉE, jamais saisie :  de 
   * l'applique à  au moment de l'export de . La grille de
   * pondération est publiée sur /methodologie/.
   */
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
  /**
   * Date du dernier relevé de gamme et de disponibilité (ISO 8601).
   * Obligatoire : le site n'affiche JAMAIS une information commerciale sans sa
   * date. Passé  (src/lib/prix.ts), le gabarit masque la
   * fourchette au lieu d'afficher une donnée qu'il ne peut plus garantir.
   */
  priceCheckedAt: string;
  /** État commercial constaté au dernier relevé. */
  availability: Availability;
  /**
   * Slug d'une alternative encore disponible, à proposer quand ce produit ne
   * l'est plus.
   *
   * ⚠ C'est une alternative ÉDITORIALE, choisie par nous dans notre catalogue —
   * pas un successeur annoncé par le constructeur. La nuance compte : affirmer
   * « X remplace Y » sans que la marque l'ait dit serait une fausse preuve.
   *
   * Sert le garde-fou « ne jamais supprimer la page d'un modèle retiré » : la
   * page reste, garde son référencement, et redirige l'intention du lecteur.
   */
  alternative?: string;
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
  /**
   * Barres de son recommandées par ce guide, affichées sous forme de blocs
   * produits (cartes) dans la page.
   *
   * RÈGLE ÉDITORIALE : tout guide (ou article) qui oriente le lecteur vers une
   * sélection d'une ou plusieurs barres de son DOIT renseigner ce champ, afin
   * d'intégrer directement les blocs des produits sélectionnés dans le contenu
   * (et non de simples mentions textuelles). `soundbar` est le slug du produit.
   */
  picks?: { soundbar: string; why?: string }[];
  /** Titre du bloc de sélection (défaut : « Notre sélection »). */
  picksHeading?: string;
}

/**
 * Forme d'une barre de son telle qu'elle est SAISIE dans  :
 * identique à , mais sans  — la note globale est calculée à
 * l'export depuis , elle ne se tape pas.
 */
export type SoundbarInput = Omit<Soundbar, 'score'>;
