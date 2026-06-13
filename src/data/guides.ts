import type { Guide } from './types';

/**
 * Guides éditoriaux (contenu informationnel TOFU/MOFU).
 * Ils captent les requêtes « comment choisir », « comment installer »,
 * « différence entre… » et nourrissent le maillage interne vers les
 * classements et les fiches produit.
 */
export const guides: Guide[] = [
  {
    slug: 'comment-choisir-barre-de-son-pc',
    title: 'Comment choisir une barre de son pour PC ?',
    description:
      'Connectique, encombrement, caisson, RGB : tous les critères pour bien choisir une barre de son adaptée à un usage informatique.',
    publishedAt: '2026-03-12',
    lastUpdated: '2026-06-13',
    readingMinutes: 7,
    sections: [
      {
        heading: 'Connectique : USB-C, Bluetooth, jack ou optique ?',
        body: 'Sur un PC, la connexion USB-C est la plus pratique : elle gère le signal audio numérique et, sur les modèles compacts (Razer Leviathan V2 X, Creative GS3), l\'alimentation sur un seul câble, sans pilote la plupart du temps. Le Bluetooth ajoute la souplesse pour le smartphone. La prise jack 3.5 mm reste un repli universel, tandis que l\'entrée optique ou l\'HDMI ARC servent surtout à brancher une console ou une TV (Creative Katana V2, Stage V2).',
      },
      {
        heading: 'Faut-il un caisson de basses ?',
        body: 'Un caisson dédié transforme l\'expérience pour le jeu et les films grâce à un grave physique (Razer Leviathan V2, Creative Katana V2, Stage V2). Il occupe toutefois de la place sous le bureau. Pour la bureautique, la visio et un petit espace, une barre compacte à radiateurs passifs (Leviathan V2 X, GS3, Stage Air V2) suffit largement.',
      },
      {
        heading: 'Encombrement et placement sur le bureau',
        body: 'Mesurez la largeur disponible sous votre moniteur : une barre de 40 à 60 cm se glisse souvent devant le pied d\'écran. Vérifiez aussi la hauteur pour ne pas masquer le bas de la dalle. Les modèles de 40-41 cm (Leviathan V2 X, GS3, Stage Air V2) conviennent aux petits espaces, tandis que les Katana (60 cm) demandent un bureau plus large.',
      },
      {
        heading: 'Gaming : RGB, son 3D et spatialisation',
        body: 'Pour un setup gaming, l\'éclairage RGB synchronisable (Razer Chroma) et la spatialisation (THX Spatial Audio chez Razer, Super X-Fi chez Creative) sont des arguments. Le suivi de tête de la Leviathan V2 Pro pousse l\'immersion encore plus loin. En USB, la latence est négligeable ; pour le jeu compétitif en ligne, un casque reste souvent plus précis pour la localisation et le chat vocal.',
      },
      {
        heading: 'Budget : à quoi s\'attendre par tranche de prix',
        body: 'Sous 60 €, on vise une mini-barre compacte (Creative GS3, Stage Air V2). Autour de 100-120 €, on accède à une barre gaming compacte (Razer Leviathan V2 X) ou à un combo 2.1 complet (Creative Stage V2). Entre 200 et 300 €, on trouve les barres polyvalentes et puissantes (Katana V2X, Leviathan V2, Katana V2). Au-delà de 400 €, on paie des technologies premium comme le son 3D à suivi de tête (Leviathan V2 Pro).',
      },
    ],
    faq: [
      {
        question: 'Une barre de son se branche-t-elle en USB sur un PC ?',
        answer:
          'Oui, la majorité des barres de son pour PC se branchent en USB-C, ce qui assure le signal audio numérique et, sur les modèles compacts, l\'alimentation sur un seul câble, généralement sans pilote à installer.',
      },
      {
        question: 'Barre de son ou casque pour jouer sur PC ?',
        answer:
          'La barre de son offre un confort d\'usage et un grave physique pour le jeu solo et les films. Le casque reste préférable pour le jeu compétitif (précision spatiale, chat vocal) et pour ne pas déranger l\'entourage.',
      },
    ],
  },
  {
    slug: 'comment-installer-barre-de-son-pc',
    title: 'Comment installer une barre de son sur un PC ?',
    description:
      'Branchement USB, Bluetooth ou jack, réglage de la sortie audio Windows et logiciels constructeur : le guide pas à pas pour installer votre barre de son.',
    publishedAt: '2026-05-02',
    lastUpdated: '2026-06-13',
    readingMinutes: 6,
    sections: [
      {
        heading: 'Étape 1 : choisir le bon branchement',
        body: 'Sur PC, privilégiez l\'USB-C pour un son numérique propre et, sur les modèles compacts, une alimentation par le même câble. Réservez le jack 3.5 mm aux cas où l\'USB n\'est pas disponible, l\'optique ou l\'HDMI ARC à une TV ou une console, et le Bluetooth à un appoint sans fil pour le smartphone.',
      },
      {
        heading: 'Étape 2 : relier le caisson (si présent)',
        body: 'Avant la mise sous tension, reliez le caisson à la barre — filaire (Creative Stage V2) ou via son câble dédié (Razer Leviathan V2, Katana). Placez-le au sol ou sous le bureau, sans le coincer contre un mur pour éviter les résonances.',
      },
      {
        heading: 'Étape 3 : définir la sortie audio dans Windows',
        body: 'Faites un clic droit sur l\'icône de volume → « Paramètres de son », puis sélectionnez la barre comme périphérique de sortie par défaut. Sous macOS, allez dans Réglages Système → Son → Sortie.',
      },
      {
        heading: 'Étape 4 : installer le logiciel constructeur',
        body: 'Pour débloquer la spatialisation et l\'égaliseur, installez Razer Synapse (THX Spatial Audio, Chroma RGB) ou Sound Blaster Command (Super X-Fi, surround virtuel) selon la marque. Ces logiciels sont gratuits et disponibles sur les sites officiels.',
      },
      {
        heading: 'Étape 5 : régler l\'égaliseur et la spatialisation',
        body: 'Choisissez un préréglage selon l\'usage (Jeu, Film, Musique) ou ajustez l\'EQ. Activez le surround virtuel pour les jeux et films, mais préférez le stéréo pur pour la musique, plus naturel.',
      },
    ],
    faq: [
      {
        question: 'Ma barre de son USB n\'est pas détectée, que faire ?',
        answer:
          'Vérifiez qu\'elle est bien sélectionnée comme périphérique de sortie dans les paramètres de son de Windows. Essayez un autre port USB (de préférence à l\'arrière du PC), et redémarrez si besoin. Un port de façade peu alimenté peut limiter le volume des modèles alimentés en USB.',
      },
      {
        question: 'Faut-il installer un pilote pour une barre de son PC ?',
        answer:
          'Non, les barres USB sont reconnues nativement par Windows et macOS comme carte son. Le logiciel constructeur (Synapse, Sound Blaster Command) est optionnel : il sert à débloquer la spatialisation, l\'égaliseur et le RGB.',
      },
    ],
  },
  {
    slug: 'barre-de-son-vs-enceintes-pc',
    title: 'Barre de son ou enceintes pour PC : que choisir ?',
    description:
      'Avantages, inconvénients et cas d\'usage : faut-il préférer une barre de son ou des enceintes pour votre ordinateur ?',
    publishedAt: '2026-04-02',
    lastUpdated: '2026-06-13',
    readingMinutes: 5,
    sections: [
      {
        heading: 'La barre de son : gain de place et simplicité',
        body: 'Une barre concentre l\'audio dans un seul boîtier posé devant l\'écran. Branchement souvent unique en USB-C, commandes intégrées, encombrement minimal : c\'est la solution la plus simple pour désencombrer un bureau, surtout en version compacte (Razer Leviathan V2 X, Creative GS3).',
      },
      {
        heading: 'Les enceintes : fidélité et scène sonore',
        body: 'Deux enceintes séparées (moniteurs de bureau ou enceintes 2.0) créent une vraie stéréo avec une scène sonore plus large et un rendu souvent plus fidèle. Le prix de cette qualité : davantage d\'espace sur le bureau et un placement à soigner (triangle d\'écoute).',
      },
      {
        heading: 'Quel choix selon votre usage ?',
        body: 'Pour le jeu, les films et un bureau chargé, privilégiez une barre avec caisson (Razer Leviathan V2, Creative Katana V2). Pour la création audio, la musique et l\'écoute attentive, des enceintes de monitoring offrent une meilleure restitution. Pour la simple bureautique ou un petit espace, une barre compacte suffit.',
      },
    ],
    faq: [
      {
        question: 'Les enceintes sont-elles meilleures qu\'une barre de son pour le PC ?',
        answer:
          'En fidélité sonore et largeur de scène, des enceintes de monitoring dépassent généralement une barre de son. Mais elles occupent plus de place et demandent un placement soigné. Pour le confort, la simplicité et le gain de place, la barre de son l\'emporte.',
      },
    ],
  },
  {
    slug: 'barre-de-son-pc-teletravail-visio',
    title: 'Quelle barre de son PC pour le télétravail et la visio ?',
    description:
      'Clarté des voix, micro, confort d\'écoute : les critères et nos recommandations de barres de son adaptées au télétravail et aux visioconférences.',
    publishedAt: '2026-05-20',
    lastUpdated: '2026-06-13',
    readingMinutes: 5,
    sections: [
      {
        heading: 'Ce qui compte vraiment en visio',
        body: 'Pour le télétravail, on cherche d\'abord l\'intelligibilité des voix plutôt que des basses spectaculaires. Une fonction de renfort des dialogues (Clear Dialog de la Creative Stage V2) et un rendu médium clair font toute la différence en réunion.',
      },
      {
        heading: 'Faut-il un micro intégré ?',
        body: 'La plupart des barres de son PC n\'intègrent pas de micro : on garde donc le micro du PC, d\'un casque ou d\'une webcam. Si vous enchaînez les réunions, un micro dédié reste préférable à un micro de barre, plus éloigné de la bouche.',
      },
      {
        heading: 'Confort et basculement casque',
        body: 'Une prise casque en façade (Creative GS3) est précieuse pour passer en écoute privée sans tâtonner derrière le PC. Le Bluetooth permet aussi de garder le PC en USB tout en diffusant ponctuellement depuis le smartphone.',
      },
      {
        heading: 'Nos recommandations pour le télétravail',
        body: 'La Creative Stage V2 (Clear Dialog, connectique complète) et la Creative GS3 (compacte, prise casque, SuperWide) sont d\'excellents choix pour la visio. Sur un petit bureau nomade, la Stage Air V2 et sa batterie dépannent très bien.',
      },
    ],
    faq: [
      {
        question: 'Une barre de son PC a-t-elle un micro pour la visio ?',
        answer:
          'Rarement. La majorité des barres de son pour PC ne disposent pas de micro intégré ; on utilise le micro du PC, d\'un casque ou d\'une webcam. Privilégiez plutôt une barre offrant une bonne clarté des voix.',
      },
      {
        question: 'Quelle barre de son pour bien entendre les voix en réunion ?',
        answer:
          'La Creative Stage V2 dispose d\'une fonction Clear Dialog qui renforce les voix, idéale pour la visio. Plus compacte, la Creative GS3 offre aussi un rendu médium clair et une prise casque pratique.',
      },
    ],
  },
];

/** Retourne un guide par slug. */
export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}
