/**
 * Rubrique « Notre sélection du mois » — publiée le 2 de chaque mois.
 *
 * Chaque édition affiche un statut clair du marché :
 *  - 'nouveautes' : de nouveaux modèles entrent dans la sélection / sont sortis
 *  - 'stable'     : rien n'a changé depuis le mois dernier
 *  - 'a-venir'    : une sortie est attendue le(s) mois suivant(s)
 *
 * Les éditions sont stockées dans monthly.json (mises à jour par le pipeline
 * automatisé) ; place la plus récente EN TÊTE du tableau.
 */
import editionsData from './monthly.json';

export type MarketStatus = 'nouveautes' | 'stable' | 'a-venir';

export interface MonthlyPick {
  /** Slug d'un produit du dataset. */
  soundbar: string;
  /** Pourquoi il est retenu ce mois-ci. */
  note: string;
}

export interface MonthlyEdition {
  /** Identifiant AAAA-MM (sert de slug d'archive). */
  id: string;
  /** Libellé lisible, ex. « Juin 2026 ». */
  label: string;
  /** Date de publication ISO (le 2 du mois). */
  publishedAt: string;
  status: MarketStatus;
  /** Résumé en une phrase, repris dans le bandeau de statut (citable GEO). */
  headline: string;
  /** Intro éditoriale. */
  intro: string;
  /** Sélection mise en avant (ordre = importance). */
  picks: MonthlyPick[];
  /** Sorties / nouveautés constatées ce mois-ci (vide si aucune). */
  newReleases: string[];
  /** Sorties attendues le(s) mois suivant(s) (vide si aucune). */
  upcoming: string[];
}

export const monthlyEditions: MonthlyEdition[] = editionsData as MonthlyEdition[];

/** Édition la plus récente. */
export function latestEdition(): MonthlyEdition {
  return monthlyEditions[0];
}

/** Libellé court du statut. */
export function statusLabel(status: MarketStatus): string {
  switch (status) {
    case 'nouveautes':
      return 'Nouveautés ce mois-ci';
    case 'a-venir':
      return 'Sortie à venir';
    case 'stable':
    default:
      return 'Marché stable';
  }
}
