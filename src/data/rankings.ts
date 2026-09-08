import { annee } from '../lib/millesime';
import type { Ranking } from './types';

/**
 * Classements éditoriaux. Chaque classement cible une intention de recherche
 * précise (« meilleure barre de son PC », « pour gamer », « pas chère »…) et
 * réutilise les produits du dataset via leur slug.
 */
export const rankings: Ranking[] = [
  {
    slug: 'meilleures-barres-de-son-pc',
    title: `Les meilleures barres de son pour PC en ${annee()}`,
    subtitle: 'Notre classement général, toutes catégories confondues',
    cover: '/images/rankings/meilleures-barres-de-son-pc.webp',
    coverAlt: 'Barre de son sur un podium, classement de référence',
    metaDescription:
      `Classement ${annee()} des meilleures barres de son pour PC. Comparatif indépendant : son, basses, connectique et rapport qualité-prix.`,
    intro:
      'Choisir une barre de son pour PC, c\'est arbitrer entre encombrement sur le bureau, qualité sonore et connectique adaptée à un usage informatique (USB-C, Bluetooth, jack). Ce classement général réunit nos meilleures recommandations toutes catégories confondues, du modèle premium à son 3D au combo abordable, après évaluation sur cinq critères pondérés.',
    items: [
      { soundbar: 'creative-sound-blaster-katana-v2', why: 'La plus puissante et polyvalente, connectique exemplaire.' },
      { soundbar: 'razer-leviathan-v2', why: 'Le meilleur équilibre immersion / prix pour un bureau gaming.' },
      { soundbar: 'creative-sound-blaster-katana-v2x', why: 'La polyvalence Katana en plus compact et abordable.' },
      { soundbar: 'razer-leviathan-v2-pro', why: 'Techniquement la plus impressionnante du marché PC, mais Razer ne la distribue plus en France : à ne considérer qu\'en stock résiduel.' },
      { soundbar: 'creative-stage-v2', why: 'Creative ne la commercialise plus : conservée ici pour la comparaison, plus comme recommandation d\'achat.' },
    ],
    faq: [
      {
        question: `Quelle est la meilleure barre de son pour PC en ${annee()} ?`,
        answer:
          'Pour l\'immersion gaming, la Razer Leviathan V2 Pro arrive en tête grâce à son audio 3D à suivi de tête. Pour la polyvalence et la connectique (PC, console, TV), la Creative Sound Blaster Katana V2 est notre référence. À budget contenu, la Razer Leviathan V2 et la Creative Stage V2 offrent le meilleur compromis.',
      },
      {
        question: 'Faut-il un caisson de basses pour une barre de son PC ?',
        answer:
          'Pour le jeu et les films, un caisson dédié (Leviathan V2, Katana V2, Stage V2) apporte un impact physique appréciable. Pour la bureautique et un petit bureau, une barre compacte sans caisson comme la Razer Leviathan V2 X ou la Creative GS3 suffit.',
      },
      {
        question: 'Comment se branche une barre de son sur un PC ?',
        answer:
          'La plupart des modèles récents se branchent en USB-C : un seul câble gère l\'audio numérique et, sur les modèles compacts, l\'alimentation. Le Bluetooth dépanne pour le smartphone, et certaines barres ajoutent jack, optique ou HDMI ARC pour la TV et les consoles.',
      },
    ],
    lastUpdated: '2026-09-07',
  },
  {
    slug: 'meilleures-barres-de-son-pc-gaming',
    title: 'Les meilleures barres de son PC pour le gaming',
    subtitle: 'Immersion, basses et RGB pour les setups joueurs',
    cover: '/images/rankings/meilleures-barres-de-son-pc-gaming.webp',
    coverAlt: 'Setup gaming avec barre de son et ambiance RGB',
    metaDescription:
      `Comparatif des meilleures barres de son gaming pour PC : audio immersif, basses puissantes et éclairage RGB. Sélection ${annee()}.`,
    intro:
      'Pour le jeu, on attend d\'une barre de son une spatialisation convaincante (THX Spatial, Super X-Fi), des basses qui retranscrivent les explosions et, souvent, un éclairage RGB raccord avec le setup. Voici notre sélection orientée gaming, des modèles à son 3D aux options RGB compactes.',
    items: [
      { soundbar: 'razer-leviathan-v2', why: 'Caisson efficace, THX Spatial et RGB Chroma 18 zones.' },
      { soundbar: 'creative-sound-blaster-katana-v2', why: 'Puissance tri-amplifiée et Super X-Fi pour le jeu et les films.' },
      { soundbar: 'razer-leviathan-v2-x', why: 'L\'option RGB compacte la plus accessible en USB-C.' },
      { soundbar: 'razer-leviathan-v2-pro', why: 'Techniquement la plus impressionnante du marché PC, mais Razer ne la distribue plus en France : à ne considérer qu\'en stock résiduel.' },
    ],
    faq: [
      {
        question: 'Quelle barre de son gaming choisir pour du RGB ?',
        answer:
          'Les Razer Leviathan V2 et V2 Pro intègrent l\'éclairage Chroma synchronisable (18 et 14 zones). La Razer Leviathan V2 X propose du RGB compact à moins de 100 €, et la Creative GS3 ajoute aussi un éclairage d\'ambiance.',
      },
      {
        question: 'Le son 3D vaut-il le surcoût pour le jeu ?',
        answer:
          'Le suivi de tête de la Leviathan V2 Pro améliore réellement le repérage spatial en jeu solo. En multijoueur compétitif, un bon casque reste souvent préférable pour la précision et le chat vocal.',
      },
    ],
    lastUpdated: '2026-09-07',
  },
  {
    slug: 'meilleures-barres-de-son-pc-pas-cheres',
    title: 'Les meilleures barres de son PC pas chères (moins de 120 €)',
    subtitle: 'Le meilleur du son sur bureau à petit budget',
    cover: '/images/rankings/meilleures-barres-de-son-pc-pas-cheres.webp',
    coverAlt: 'Barre de son compacte au bon rapport qualité-prix',
    metaDescription:
      'Barres de son PC pas chères : notre sélection des meilleurs modèles à moins de 120 € pour améliorer le son de votre ordinateur.',
    intro:
      'Améliorer le son de son PC ne coûte pas forcément cher. Sous la barre des 120 €, on trouve un combo barre + caisson complet, des barres compactes RGB et des modèles nomades idéaux pour remplacer les haut-parleurs intégrés d\'un moniteur ou d\'un laptop. Voici les meilleurs choix à petit prix.',
    items: [
      { soundbar: 'razer-leviathan-v2-x', why: 'Barre gaming compacte USB-C avec RGB, la plus abordable des Razer.' },
      { soundbar: 'creative-sound-blaster-gs3', why: 'Mini-barre RGB avec SuperWide et prise casque, la plus compacte du classement.' },
      { soundbar: 'creative-stage-air-v2', why: 'Barre nomade sur batterie pour les petits espaces.' },
      { soundbar: 'creative-stage-v2', why: 'Creative ne la commercialise plus : conservée ici pour la comparaison, plus comme recommandation d\'achat.' },
    ],
    faq: [
      {
        question: 'Quelle barre de son PC à moins de 120 € choisir ?',
        answer:
          'La Creative Stage V2 est notre meilleur choix global sous 120 € : elle inclut un caisson de basses et une connectique complète (USB-C, HDMI ARC, optique, jack, Bluetooth). Pour le gaming compact, la Razer Leviathan V2 X est l\'alternative idéale.',
      },
      {
        question: 'Une barre de son à petit prix en vaut-elle la peine ?',
        answer:
          'Oui : face aux haut-parleurs intégrés d\'un moniteur ou d\'un PC portable, un modèle comme la Creative Stage V2 ou la Razer Leviathan V2 X apporte un gain de clarté et de basses immédiatement perceptible.',
      },
    ],
    lastUpdated: '2026-09-07',
  },
  {
    slug: 'meilleures-barres-de-son-pc-compactes',
    title: 'Les meilleures barres de son PC compactes',
    subtitle: 'Un son qui gagne de la place sur les petits bureaux',
    cover: '/images/rankings/meilleures-barres-de-son-pc-compactes.webp',
    coverAlt: 'Petite barre de son compacte sur un bureau épuré',
    metaDescription:
      'Sélection des meilleures barres de son PC compactes (≤ 41 cm) : USB-C, Bluetooth et faible encombrement pour petits bureaux et laptops.',
    intro:
      'Quand l\'espace sous l\'écran est compté, une barre compacte alimentée par un seul câble USB-C change tout. Sans caisson encombrant, ces modèles se glissent sous un moniteur ou devant un laptop tout en surpassant largement les haut-parleurs intégrés. Voici nos préférées.',
    items: [
      { soundbar: 'razer-leviathan-v2-x', why: 'La plus aboutie : USB-C unique, RGB et 40 cm seulement.' },
      { soundbar: 'creative-sound-blaster-gs3', why: 'SuperWide, prise casque en façade et RGB en 41 cm.' },
      { soundbar: 'creative-stage-air-v2', why: 'La plus petite, avec batterie intégrée pour la mobilité.' },
      { soundbar: 'creative-sound-blaster-katana-v2x', why: 'Pour qui veut un caisson sans sacrifier la compacité.' },
    ],
    faq: [
      {
        question: 'Quelle barre de son compacte pour un petit bureau ?',
        answer:
          'La Razer Leviathan V2 X (40 cm, un seul câble USB-C) est notre choix pour un petit bureau gaming. Pour le multimédia, la Creative GS3 ajoute une prise casque pratique, et la Stage Air V2 séduit par sa batterie et sa mobilité.',
      },
      {
        question: 'Une barre compacte peut-elle avoir des basses correctes ?',
        answer:
          'Sans caisson, les basses restent limitées mais les radiateurs passifs (Leviathan V2 X, GS3, Stage Air V2) apportent un grave honnête. Pour un vrai impact, optez pour une compacte avec caisson comme la Katana V2X.',
      },
    ],
    lastUpdated: '2026-09-07',
  },
  {
    slug: 'meilleures-barres-de-son-pc-polyvalentes',
    title: 'Les meilleures barres de son PC polyvalentes (PC, console, TV)',
    subtitle: 'Une seule barre pour tous vos écrans',
    cover: '/images/rankings/meilleures-barres-de-son-pc-polyvalentes.webp',
    coverAlt: 'Barre de son reliée à un PC, une TV et une console',
    metaDescription:
      `Barres de son PC polyvalentes : USB, HDMI ARC, optique et Bluetooth pour passer du PC à la console et à la TV. Comparatif ${annee()}.`,
    intro:
      'Un même bureau sert souvent de poste de jeu, de salle de cinéma et parfois de coin TV. Les barres dotées d\'une connectique riche (USB-C, HDMI ARC, optique, Bluetooth) basculent d\'une source à l\'autre sans rebrancher quoi que ce soit. Voici les plus polyvalentes.',
    items: [
      { soundbar: 'creative-sound-blaster-katana-v2', why: 'Connectique exemplaire et puissance pour tous les usages.' },
      { soundbar: 'creative-sound-blaster-katana-v2x', why: 'La même polyvalence, plus compacte et abordable.' },
      { soundbar: 'creative-stage-v2', why: 'Creative ne la commercialise plus : conservée ici pour la comparaison, plus comme recommandation d\'achat.' },
    ],
    faq: [
      {
        question: 'Quelle barre de son pour brancher PC, console et TV ?',
        answer:
          'La Creative Sound Blaster Katana V2 est la plus polyvalente : USB-C pour le PC, HDMI ARC et optique pour la TV et les consoles, Bluetooth pour le mobile. La Katana V2X offre la même connectique en plus compact.',
      },
      {
        question: 'À quoi sert l\'HDMI ARC sur une barre de son PC ?',
        answer:
          'L\'HDMI ARC relie la barre à une TV compatible et permet de piloter le volume avec la télécommande du téléviseur, tout en faisant transiter le son de la TV vers la barre par un seul câble.',
      },
    ],
    lastUpdated: '2026-09-07',
  },
  {
    slug: 'meilleures-barres-de-son-pc-sans-fil',
    title: 'Les meilleures barres de son PC sans fil (Bluetooth)',
    subtitle: 'Du son sans câble pour relier PC, smartphone et tablette',
    cover: '/images/rankings/meilleures-barres-de-son-pc-sans-fil.webp',
    coverAlt: 'Barre de son PC diffusant des ondes Bluetooth sans fil',
    metaDescription:
      `Comparatif des meilleures barres de son PC sans fil (Bluetooth) : connexion mobile facile, modèles compacts et nomades. Sélection ${annee()}.`,
    intro:
      'Le sans-fil ne remplace pas l\'USB pour le jeu (latence), mais le Bluetooth est idéal en appoint : garder le PC branché et diffuser ponctuellement depuis un smartphone, ou opter pour un modèle nomade sur batterie. Voici nos barres de son PC les plus pratiques en Bluetooth.',
    items: [
      { soundbar: 'creative-stage-air-v2', why: 'Bluetooth 5.3 + batterie intégrée : la plus nomade et autonome.' },
      { soundbar: 'creative-sound-blaster-gs3', why: 'Bluetooth 5.4, compacte, avec prise casque pratique.' },
      { soundbar: 'razer-leviathan-v2-x', why: 'Compacte gaming, USB-C + Bluetooth 5.0 et RGB.' },
      { soundbar: 'edifier-mg300', why: 'Jamais portée sur le marché français : la série MG n\'y est pas distribuée, elle reste difficile à obtenir en France.' },
    ],
    faq: [
      {
        question: 'Le Bluetooth est-il adapté au jeu sur PC ?',
        answer:
          'Pas idéalement : le Bluetooth introduit une latence et une légère compression. Pour le gaming, préférez l\'USB-C (latence négligeable) et gardez le Bluetooth en appoint pour le smartphone.',
      },
      {
        question: 'Existe-t-il des barres de son PC totalement sans fil ?',
        answer:
          'La Creative Stage Air V2 intègre une batterie et le Bluetooth 5.3, ce qui permet un usage réellement sans câble pendant quelques heures — pratique avec un PC portable en déplacement.',
      },
    ],
    lastUpdated: '2026-09-07',
  },
  {
    slug: 'meilleures-barres-de-son-pc-avec-caisson',
    title: 'Les meilleures barres de son PC avec caisson de basses',
    subtitle: 'Des basses physiques pour le jeu et les films',
    cover: '/images/rankings/meilleures-barres-de-son-pc-avec-caisson.webp',
    coverAlt: 'Barre de son PC accompagnée d\'un caisson de basses lumineux',
    metaDescription:
      `Comparatif des meilleures barres de son PC avec caisson de basses : impact, profondeur et immersion pour le gaming et les films. Sélection ${annee()}.`,
    intro:
      'Un caisson de basses dédié change tout pour le jeu et le cinéma : explosions, ambiances et bandes-son gagnent en impact physique. Voici nos barres de son PC livrées avec un caisson, de la référence premium au combo abordable.',
    items: [
      { soundbar: 'creative-sound-blaster-katana-v2', why: 'Caisson généreux et jusqu\'à 250 W crête.' },
      { soundbar: 'razer-leviathan-v2', why: 'Caisson 14 cm efficace, THX Spatial et RGB.' },
      { soundbar: 'razer-leviathan-v2-pro', why: 'Techniquement la plus impressionnante du marché PC, mais Razer ne la distribue plus en France : à ne considérer qu\'en stock résiduel.' },
      { soundbar: 'creative-stage-v2', why: 'Creative ne la commercialise plus : conservée ici pour la comparaison, plus comme recommandation d\'achat.' },
    ],
    faq: [
      {
        question: 'Un caisson de basses est-il utile sur un bureau ?',
        answer:
          'Oui pour le jeu et les films : il apporte un grave physique que les petites barres ne peuvent pas reproduire. Pour la bureautique ou la musique neutre, il est moins indispensable et peut être réglé plus bas.',
      },
      {
        question: 'Où placer le caisson de basses ?',
        answer:
          'Au sol, près du bureau, sans le coincer dans un meuble fermé ni contre un mur pour éviter les résonances. Son niveau se règle généralement indépendamment de la barre.',
      },
    ],
    lastUpdated: '2026-09-07',
  },
];

/** Retourne un classement par slug. */
export function getRanking(slug: string) {
  return rankings.find((r) => r.slug === slug);
}

/** Classements dans lesquels figure une barre de son (maillage interne). */
export function rankingsForSoundbar(slug: string) {
  return rankings.filter((r) => r.items.some((i) => i.soundbar === slug));
}
