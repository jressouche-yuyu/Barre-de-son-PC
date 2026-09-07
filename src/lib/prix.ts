/**
 * Affichage du prix — fourchettes de gamme, pas de prix exact.
 *
 * POURQUOI LE SITE N'AFFICHE PAS DE PRIX EXACT
 * --------------------------------------------
 * Le site est monétisé par affiliation Amazon. Deux contraintes se cumulent :
 *
 * 1. Un prix exact relevé un jour est faux le lendemain. Affiché sans être
 *    rafraîchi, il fait fuir l'acheteur qui découvre un autre montant chez le
 *    marchand, et il rend `offers.price` du schéma Product mensonger.
 * 2. Les conditions du programme d'affiliation encadrent strictement la durée
 *    pendant laquelle une donnée de prix issue de leur API peut être affichée.
 *    Un site statique reconstruit une fois par jour — a fortiori une fois par
 *    semaine — ne peut pas tenir cette fenêtre de façon fiable.
 *
 * La réponse retenue : le site classe chaque produit dans une **fourchette de
 * gamme** qu'il définit lui-même, affichée avec sa date de relevé, et renvoie
 * vers le marchand pour le prix du jour. Une gamme ne bouge pas d'une semaine à
 * l'autre : c'est une information qui reste vraie.
 *
 * Conséquence de conception importante : le mécanisme de péremption vit ICI,
 * dans le rendu, et pas dans une routine. Une routine en panne cesse de
 * rafraîchir la donnée ; un gabarit qui masque une donnée périmée continue de
 * protéger le site même quand plus rien ne tourne.
 */

/** Identifiant de gamme. */
export type PriceBandKey = 'entree' | 'milieu' | 'haut';

export interface PriceBand {
  key: PriceBandKey;
  /** Intitulé affiché. */
  label: string;
  /** Borne basse de la gamme, en euros. */
  low: number;
  /** Borne haute de la gamme, en euros. */
  high: number;
}

/**
 * Fourchettes de gamme du marché des barres de son PC (France, 2026).
 *
 * Ce sont des bornes **éditoriales** : elles décrivent comment le site segmente
 * le marché, pas le prix d'un produit à un instant donné. C'est précisément ce
 * qui les rend affichables sans date de péremption courte.
 */
export const PRICE_BANDS: readonly PriceBand[] = [
  { key: 'entree', label: 'Entrée de gamme', low: 30, high: 80 },
  { key: 'milieu', label: 'Milieu de gamme', low: 80, high: 200 },
  { key: 'haut', label: 'Haut de gamme', low: 200, high: 450 },
] as const;

/** Classe un montant indicatif dans sa fourchette de gamme. */
export function priceBand(price: number): PriceBand {
  return (
    PRICE_BANDS.find((band) => price < band.high) ?? PRICE_BANDS[PRICE_BANDS.length - 1]
  );
}

/** Libellé complet, ex. « Milieu de gamme · environ 80 à 200 € ». */
export function formatPriceBand(price: number): string {
  const band = priceBand(price);
  return `${band.label} · environ ${band.low} à ${band.high} €`;
}

/**
 * Fenêtre de validité d'un relevé de gamme, en jours.
 *
 * 45 jours : une gamme n'évolue pas en une semaine, mais un produit peut sortir
 * du catalogue ou changer de positionnement en un trimestre. Au-delà, le site
 * préfère ne rien afficher plutôt qu'afficher une information qu'il ne peut plus
 * garantir.
 */
export const PRICE_FRESHNESS_DAYS = 45;

/** Vrai si le relevé est encore dans sa fenêtre de validité. */
export function isPriceFresh(checkedAt: string, now: Date = new Date()): boolean {
  const checked = new Date(`${checkedAt.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(checked.getTime())) return false;
  const ageDays = (now.getTime() - checked.getTime()) / 86400000;
  return ageDays >= 0 && ageDays <= PRICE_FRESHNESS_DAYS;
}

/** Date de relevé en français long, ex. « 7 septembre 2026 ». */
export function formatCheckedAt(checkedAt: string): string {
  const date = new Date(`${checkedAt.slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return checkedAt;
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}

/** Libellés de disponibilité affichés au lecteur. */
export const AVAILABILITY_LABELS = {
  disponible: 'Disponible',
  'stock-limite': 'Stock limité',
  'fin-de-commercialisation': 'Fin de commercialisation',
} as const;

/** Correspondance schema.org de la disponibilité. */
export const AVAILABILITY_SCHEMA = {
  disponible: 'https://schema.org/InStock',
  'stock-limite': 'https://schema.org/LimitedAvailability',
  'fin-de-commercialisation': 'https://schema.org/Discontinued',
} as const;
