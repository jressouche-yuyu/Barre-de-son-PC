/**
 * Rubrique « Notre sélection du mois » — publiée le 2 de chaque mois.
 *
 * Chaque édition affiche un statut clair du marché :
 *  - 'nouveautes' : de nouveaux modèles entrent dans la sélection / sont sortis
 *  - 'stable'     : rien n'a changé depuis le mois dernier
 *  - 'a-venir'    : une sortie est attendue le(s) mois suivant(s)
 *
 * Pour ajouter une édition : place le nouvel objet EN TÊTE du tableau.
 * C'est ce fichier que la veille mensuelle automatisée viendra mettre à jour.
 */
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

export const monthlyEditions: MonthlyEdition[] = [
  {
    id: '2026-06',
    label: 'Juin 2026',
    publishedAt: '2026-06-02',
    status: 'stable',
    headline:
      'Aucune nouveauté majeure ce mois-ci : nos références restent les mêmes, le marché PC est stable.',
    intro:
      'Pour le lancement de cette rubrique, le marché des barres de son PC est stable : pas de sortie marquante en juin. Nos valeurs sûres conservent leur place. À surveiller toutefois du côté de Creative et Razer, historiquement actifs en fin d\'année.',
    picks: [
      { soundbar: 'razer-leviathan-v2-pro', note: 'Toujours la référence immersion, sans concurrente directe sur le son 3D.' },
      { soundbar: 'creative-sound-blaster-katana-v2', note: 'Le meilleur équilibre puissance/connectique du moment.' },
      { soundbar: 'creative-stage-v2', note: 'Notre meilleur rapport qualité-prix, stock et tarif stables.' },
    ],
    newReleases: [],
    upcoming: [
      'Aucune sortie confirmée pour juillet 2026 à ce jour.',
    ],
  },
];

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
