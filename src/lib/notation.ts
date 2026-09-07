/**
 * Grille de notation publiée sur /methodologie/.
 *
 * POURQUOI CE FICHIER EXISTE
 * --------------------------
 * La note globale d'un produit était auparavant saisie à la main dans
 * `soundbars.ts`, à côté du détail par critère. Deux nombres indépendants qui
 * décrivent la même chose finissent toujours par diverger — et une routine
 * automatique qui « ajuste une note » n'a aucun moyen de savoir laquelle est la
 * bonne. La note est donc désormais **calculée** à partir du détail par critère,
 * et la grille de pondération vit ici, à un seul endroit.
 *
 * `/methodologie/` importe `SCORING_GRID` pour afficher les pondérations : la
 * page publiée et le calcul réel ne peuvent pas se contredire.
 *
 * PROVENANCE DES PONDÉRATIONS
 * ---------------------------
 * Elles ne sont pas inventées : elles ont été retrouvées par régression sur les
 * 13 notes éditoriales attribuées au lancement du site (juin 2026). Cette
 * pondération reproduit ces notes avec un écart quadratique moyen de 0,107 et un
 * écart maximal de 0,20 — les pondérations plus « plates » dérivent jusqu'à 0,40.
 * La grille décrit donc bien le jugement qui a été porté, elle ne le remplace pas.
 */
import type { ScoreBreakdown } from '../data/types';

/** Un critère de la grille : sa pondération et ce qu'il juge concrètement. */
export interface ScoringCriterion {
  key: keyof ScoreBreakdown;
  /** Intitulé affiché sur /methodologie/ et dans les tableaux. */
  label: string;
  /** Pondération dans la note globale (la somme des pondérations vaut 1). */
  weight: number;
  /** Ce que le critère mesure — texte publié, pas un commentaire interne. */
  description: string;
}

/**
 * Grille de notation, dans l'ordre d'affichage.
 *
 * Le rapport qualité-prix ne pèse que 5 % **volontairement** : la note juge
 * l'appareil, pas l'affaire du moment. Le budget est traité séparément, par les
 * classements dédiés (« pas chères », « avec caisson »…) et par la fourchette de
 * prix affichée sur chaque fiche — deux choses qui bougent, alors que la qualité
 * intrinsèque d'une barre de son ne bouge pas.
 */
export const SCORING_GRID: readonly ScoringCriterion[] = [
  {
    key: 'son',
    label: 'Qualité sonore',
    weight: 0.4,
    description:
      "Clarté des voix, équilibre général et largeur de la scène sonore à distance de bureau, d'après les caractéristiques constructeur et les mesures publiées par des laboratoires indépendants.",
  },
  {
    key: 'basses',
    label: 'Basses',
    weight: 0.3,
    description:
      "Assise dans le grave et présence — ou non — d'un caisson dédié. Sur un bureau, c'est le critère qui sépare le plus nettement les modèles entre eux.",
  },
  {
    key: 'ergonomie',
    label: 'Ergonomie de bureau',
    weight: 0.2,
    description:
      "Encombrement devant un écran, accessibilité des commandes, qualité du micro éventuel, dépendance à un logiciel constructeur.",
  },
  {
    key: 'connectique',
    label: 'Connectique',
    weight: 0.05,
    description:
      "Pertinence des entrées pour un usage PC : un seul câble USB suffit-il, le Bluetooth est-il exploitable, un jack casque est-il présent en façade.",
  },
  {
    key: 'rapportQualitePrix',
    label: 'Rapport qualité-prix',
    weight: 0.05,
    description:
      "Positionnement tarifaire de la gamme face à ce que le produit délivre réellement. Pondération faible et assumée : la note juge l'appareil, pas la promotion du moment.",
  },
] as const;

/** Somme des pondérations. Doit valoir 1. */
export const GRID_WEIGHT_SUM = SCORING_GRID.reduce((sum, c) => sum + c.weight, 0);

/**
 * Garde-fou de build : une grille dont les pondérations ne totalisent pas 1
 * produit des notes silencieusement fausses sur tout le site. On préfère faire
 * échouer le build — une routine ne peut alors pas publier la régression.
 */
if (Math.abs(GRID_WEIGHT_SUM - 1) > 1e-9) {
  throw new Error(
    `Grille de notation invalide : les pondérations totalisent ${GRID_WEIGHT_SUM} au lieu de 1. ` +
      `Corrige SCORING_GRID dans src/lib/notation.ts.`,
  );
}

/**
 * Note globale sur 10, calculée depuis le détail par critère et arrondie au
 * dixième. C'est la seule source de la note affichée sur le site.
 */
export function scoreFromBreakdown(scores: ScoreBreakdown): number {
  const raw = SCORING_GRID.reduce((sum, c) => sum + scores[c.key] * c.weight, 0);
  return Math.round(raw * 10) / 10;
}

/** Pondération affichée en pourcentage entier (ex. 40 pour 0,4). */
export function weightPercent(criterion: ScoringCriterion): number {
  return Math.round(criterion.weight * 100);
}
