import type { Ranking } from './types';

/**
 * Classements éditoriaux. Chaque classement cible une intention de recherche
 * précise (« meilleure barre de son PC », « pour gamer », « pas chère »…) et
 * réutilise les produits du dataset via leur slug.
 */
export const rankings: Ranking[] = [
  {
    slug: 'meilleures-barres-de-son-pc',
    title: 'Les meilleures barres de son pour PC en 2026',
    subtitle: 'Notre classement général, toutes catégories confondues',
    metaDescription:
      'Classement 2026 des meilleures barres de son pour PC. Comparatif indépendant : son, basses, connectique et rapport qualité-prix.',
    intro:
      'Choisir une barre de son pour PC, c\'est arbitrer entre encombrement sur le bureau, qualité sonore et connectique adaptée à un usage informatique (USB, Bluetooth, jack). Ce classement général réunit nos meilleures recommandations toutes catégories confondues, du combo gaming au modèle premium à son 3D, après évaluation sur cinq critères pondérés.',
    items: [
      { soundbar: 'razer-leviathan-v2-pro', why: 'L\'expérience la plus immersive grâce au son 3D à suivi de tête.' },
      { soundbar: 'razer-leviathan-v2', why: 'Le meilleur équilibre immersion / prix pour un bureau gaming.' },
      { soundbar: 'creative-sound-blaster-katana-v2x', why: 'La plus polyvalente, avec une connectique complète.' },
      { soundbar: 'edifier-mr4', why: 'Le choix des puristes pour la fidélité et la musique.' },
      { soundbar: 'creative-stage-v2', why: 'Le meilleur rapport qualité-prix avec caisson inclus.' },
    ],
    faq: [
      {
        question: 'Quelle est la meilleure barre de son pour PC en 2026 ?',
        answer:
          'Pour un usage gaming sur bureau, la Razer Leviathan V2 Pro arrive en tête grâce à son audio 3D à suivi de tête. Si le budget est plus serré, la Razer Leviathan V2 et la Creative Sound Blaster Katana V2X offrent le meilleur compromis immersion / prix.',
      },
      {
        question: 'Une barre de son est-elle meilleure que des enceintes pour un PC ?',
        answer:
          'Une barre de son privilégie le gain de place et la simplicité (un seul appareil, souvent en USB). Des enceintes de monitoring comme les Edifier MR4 offrent une meilleure fidélité, mais occupent plus d\'espace et demandent un placement soigné.',
      },
      {
        question: 'Faut-il un caisson de basses pour une barre de son PC ?',
        answer:
          'Pour le jeu et les films, un caisson dédié (Leviathan V2, Katana V2X, Stage V2) apporte un impact physique appréciable. Pour la bureautique et la musique neutre, une barre sans caisson ou des moniteurs suffisent.',
      },
    ],
    lastUpdated: '2026-06-10',
  },
  {
    slug: 'meilleures-barres-de-son-pc-gaming',
    title: 'Les meilleures barres de son PC pour le gaming',
    subtitle: 'Immersion, basses et RGB pour les setups joueurs',
    metaDescription:
      'Comparatif des meilleures barres de son gaming pour PC : audio immersif, basses puissantes et éclairage RGB. Sélection 2026.',
    intro:
      'Pour le jeu, on attend d\'une barre de son une spatialisation convaincante, des basses qui retranscrivent les explosions et, souvent, un éclairage RGB raccord avec le setup. Voici notre sélection orientée gaming, des modèles à son 3D aux options RGB abordables.',
    items: [
      { soundbar: 'razer-leviathan-v2-pro', why: 'Son 3D à suivi de tête : l\'immersion ultime en solo.' },
      { soundbar: 'razer-leviathan-v2', why: 'Caisson efficace et RGB Chroma à un tarif plus raisonnable.' },
      { soundbar: 'creative-sound-blaster-katana-v2x', why: 'Polyvalente PC/console avec gros caisson.' },
      { soundbar: 'trust-gxt-619-thorne', why: 'L\'option RGB la moins chère pour habiller un setup.' },
    ],
    faq: [
      {
        question: 'Quelle barre de son gaming choisir pour du RGB ?',
        answer:
          'La Razer Leviathan V2 et V2 Pro intègrent l\'éclairage Chroma synchronisable. Pour un budget réduit, la Trust GXT 619 Thorne propose du RGB à moins de 60 €.',
      },
      {
        question: 'Le son 3D vaut-il le surcoût pour le jeu ?',
        answer:
          'Le suivi de tête de la Leviathan V2 Pro améliore réellement le repérage spatial en jeu solo. En multijoueur compétitif, un bon casque reste souvent préférable pour la précision et le chat vocal.',
      },
    ],
    lastUpdated: '2026-06-08',
  },
  {
    slug: 'meilleures-barres-de-son-pc-pas-cheres',
    title: 'Les meilleures barres de son PC pas chères (moins de 100 €)',
    subtitle: 'Le meilleur du son sur bureau à petit budget',
    metaDescription:
      'Barres de son PC pas chères : notre sélection des meilleurs modèles à moins de 100 € pour améliorer le son de votre ordinateur.',
    intro:
      'Améliorer le son de son PC ne coûte pas forcément cher. Sous la barre des 100 €, on trouve des combos barre + caisson honnêtes et des barres compactes idéales pour remplacer les haut-parleurs intégrés d\'un moniteur. Voici les meilleurs choix à petit prix.',
    items: [
      { soundbar: 'creative-stage-v2', why: 'Combo barre + caisson le plus complet sous 100 €.' },
      { soundbar: 'logitech-z407', why: 'Basses généreuses et molette sans fil pour 99 €.' },
      { soundbar: 'creative-sound-blaster-gs5', why: 'Barre compacte et nerveuse à moins de 80 €.' },
      { soundbar: 'trust-gxt-619-thorne', why: 'Le prix plancher avec RGB.' },
    ],
    faq: [
      {
        question: 'Quelle barre de son PC à moins de 100 € choisir ?',
        answer:
          'La Creative Stage V2 est notre meilleur choix global sous 100 € : elle inclut un caisson de basses et une connectique complète. Pour des basses encore plus marquées, le Logitech Z407 est une excellente alternative.',
      },
      {
        question: 'Une barre de son à moins de 100 € en vaut-elle la peine ?',
        answer:
          'Oui : face aux haut-parleurs intégrés d\'un moniteur ou d\'un PC portable, un modèle comme la Creative Stage V2 apporte un gain de clarté et de basses immédiatement perceptible.',
      },
    ],
    lastUpdated: '2026-06-09',
  },
];

/** Retourne un classement par slug. */
export function getRanking(slug: string) {
  return rankings.find((r) => r.slug === slug);
}
