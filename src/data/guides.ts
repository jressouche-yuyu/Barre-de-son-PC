import type { Guide } from './types';

/**
 * Guides éditoriaux (contenu informationnel TOFU/MOFU).
 * Ils captent les requêtes « comment choisir », « comment installer »,
 * « différence entre… » et nourrissent le maillage interne vers les
 * classements et les fiches produit.
 *
 * RÈGLE ÉDITORIALE — tout guide qui oriente vers une SÉLECTION d'une ou
 * plusieurs barres de son DOIT renseigner le champ `picks` (slug produit +
 * raison du choix). Les blocs produits (cartes) sont alors affichés
 * directement dans la page via <SoundbarPicks>, plutôt que de se limiter à
 * des mentions textuelles. Voir CLAUDE.md.
 */
export const guides: Guide[] = [
  {
    slug: 'comment-choisir-barre-de-son-pc',
    picksHeading: 'Notre sélection selon les usages',
    picks: [
      {
        soundbar: 'razer-leviathan-v2-x',
        why: 'Compacte et 100 % USB-C : le meilleur point d\'entrée gaming pour un bureau chargé, sans bloc secteur ni caisson.',
      },
      {
        soundbar: 'razer-leviathan-v2',
        why: 'Avec son caisson dédié et le RGB Chroma, l\'option immersive pour le jeu et les films sur PC.',
      },
      {
        soundbar: 'creative-sound-blaster-katana-v2',
        why: 'La plus polyvalente : connectique complète (USB-C, optique, HDMI ARC) et Super X-Fi pour relier PC, console et TV.',
      },
      {
        soundbar: 'creative-sound-blaster-gs3',
        why: 'Mini-barre à petit prix avec prise casque en façade : idéale en bureautique et pour un premier achat.',
      },
    ],
    title: 'Comment choisir une barre de son pour PC ?',
    description:
      'Connectique, encombrement, caisson, RGB : tous les critères pour bien choisir une barre de son adaptée à un usage informatique.',
    cover: '/images/guides/comment-choisir-barre-de-son-pc.webp',
    coverAlt: 'Plusieurs barres de son sur un bureau, l\'une mise en avant',
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
    cover: '/images/guides/comment-installer-barre-de-son-pc.webp',
    coverAlt: 'Câble USB-C lumineux se branchant à une barre de son',
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
    picksHeading: 'Nos barres de son recommandées',
    picks: [
      {
        soundbar: 'razer-leviathan-v2-x',
        why: 'Pour gagner de la place sans renoncer au son gaming : tout passe par un seul câble USB-C.',
      },
      {
        soundbar: 'razer-leviathan-v2',
        why: 'Le caisson apporte le grave physique que des enceintes 2.0 de bureau peinent à offrir.',
      },
      {
        soundbar: 'creative-sound-blaster-katana-v2',
        why: 'Polyvalente et richement connectée, elle remplace avantageusement un kit d\'enceintes encombrant.',
      },
    ],
    title: 'Barre de son ou enceintes pour PC : que choisir ?',
    description:
      'Avantages, inconvénients et cas d\'usage : faut-il préférer une barre de son ou des enceintes pour votre ordinateur ?',
    cover: '/images/guides/barre-de-son-vs-enceintes-pc.webp',
    coverAlt: 'Comparaison entre une barre de son et deux enceintes de bureau',
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
    picksHeading: 'Nos recommandations pour le télétravail',
    picks: [
      {
        soundbar: 'creative-sound-blaster-katana-v2x',
        why: 'Deux micros à formation de faisceau intégrés à la barre : la seule du catalogue à couvrir la visio sans casque.',
      },
      {
        soundbar: 'creative-sound-blaster-gs3',
        why: 'Compacte, médium clair et prise casque en façade pour basculer en écoute privée.',
      },
      {
        soundbar: 'creative-stage-air-v2',
        why: 'Sur batterie : parfaite pour un poste nomade ou pour alterner entre plusieurs espaces.',
      },
    ],
    title: 'Quelle barre de son PC pour le télétravail et la visio ?',
    description:
      'Clarté des voix, micro, confort d\'écoute : les critères et nos recommandations de barres de son adaptées au télétravail et aux visioconférences.',
    cover: '/images/guides/barre-de-son-pc-teletravail-visio.webp',
    coverAlt: 'Bureau de télétravail avec écran en visioconférence et barre de son',
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
  {
    slug: 'barre-de-son-pc-sans-fil-bluetooth',
    picksHeading: 'Nos choix pour un usage sans fil',
    picks: [
      {
        soundbar: 'creative-stage-air-v2',
        why: 'La seule à vraie batterie intégrée : un usage réellement sans câble pendant quelques heures.',
      },
      {
        soundbar: 'creative-sound-blaster-katana-v2',
        why: 'Bluetooth en appoint et USB-C en principal : le meilleur des deux mondes, sans latence pour le jeu.',
      },
      {
        soundbar: 'razer-leviathan-v2',
        why: 'Bluetooth pour le smartphone, USB-C pour le PC, et un grave assuré par son caisson.',
      },
    ],
    title: 'Barre de son PC sans fil : Bluetooth, batterie et limites',
    description:
      'Quand le sans-fil a-t-il du sens pour une barre de son PC ? Bluetooth, latence, autonomie sur batterie et multipoint : ce qu\'il faut savoir avant de choisir.',
    cover: '/images/guides/barre-de-son-pc-sans-fil-bluetooth.webp',
    coverAlt: 'Barre de son PC reliée sans fil à un smartphone, avec symbole de batterie',
    publishedAt: '2026-06-14',
    lastUpdated: '2026-06-14',
    readingMinutes: 5,
    sections: [
      {
        heading: 'Sans fil ne veut pas dire « sans câble »',
        body: 'La plupart des barres de son PC « Bluetooth » restent alimentées par un câble (USB-C ou secteur) : le sans-fil concerne le signal audio, pas l\'alimentation. Seuls quelques modèles nomades intègrent une batterie, comme la Creative Stage Air V2, pour un usage réellement sans câble pendant quelques heures.',
      },
      {
        heading: 'Le Bluetooth, idéal en appoint',
        body: 'Le Bluetooth brille pour basculer rapidement vers un smartphone ou une tablette, sans rebrancher quoi que ce soit. Sur PC, on le garde souvent en complément d\'une liaison USB-C filaire qui reste la connexion principale. Pour le détail des entrées (USB-C, jack, optique…), voyez notre comparatif des connexions audio PC.',
      },
      {
        heading: 'La latence : le vrai point faible pour le jeu',
        body: 'Le Bluetooth introduit un léger décalage entre l\'image et le son, et compresse le signal. C\'est imperceptible pour de la musique de fond, mais gênant pour le jeu compétitif ou le montage. Dans ces cas, privilégiez l\'USB-C, dont la latence est négligeable.',
      },
      {
        heading: 'Multipoint et autonomie',
        body: 'Certaines barres et enceintes récentes (Bluetooth 5.3/5.4) gèrent une reconnexion rapide, voire le multipoint pour jongler entre deux appareils. Si la mobilité prime, vérifiez l\'autonomie annoncée et la présence d\'une vraie batterie plutôt qu\'une simple alimentation USB.',
      },
    ],
    faq: [
      {
        question: 'Le Bluetooth dégrade-t-il la qualité du son ?',
        answer:
          'Légèrement, à cause de la compression, mais c\'est rarement audible pour un usage bureautique ou de la musique de fond. Pour une qualité optimale et zéro latence sur PC, l\'USB-C reste préférable.',
      },
      {
        question: 'Peut-on utiliser une barre de son PC sans aucun câble ?',
        answer:
          'Seulement avec un modèle à batterie intégrée comme la Creative Stage Air V2. Les autres barres « sans fil » reçoivent l\'audio en Bluetooth mais nécessitent une alimentation par câble.',
      },
    ],
  },
  {
    slug: 'barre-de-son-petit-bureau-moniteur',
    picksHeading: 'Nos barres compactes recommandées',
    picks: [
      {
        soundbar: 'razer-leviathan-v2-x',
        why: '40 cm, alimentée et pilotée par un seul câble USB-C : elle se glisse sous la plupart des écrans 24-27".',
      },
      {
        soundbar: 'creative-sound-blaster-gs3',
        why: 'Ultra-compacte avec prise casque : le bon compromis clarté/encombrement sur un petit bureau.',
      },
      {
        soundbar: 'creative-stage-air-v2',
        why: 'Mini-barre sur batterie, idéale pour un laptop ou un poste nomade.',
      },
      {
        soundbar: 'creative-sound-blaster-katana-v2x',
        why: 'Si l\'impact prime malgré l\'espace réduit : un caisson plus facile à caser que les gros modèles.',
      },
    ],
    title: 'Quelle barre de son pour un petit bureau ou un moniteur ?',
    description:
      'Largeur, hauteur sous l\'écran, alimentation par un seul câble : comment choisir une barre de son compacte adaptée à un petit bureau ou un simple moniteur.',
    cover: '/images/guides/barre-de-son-petit-bureau-moniteur.webp',
    coverAlt: 'Petite barre de son compacte sous un moniteur sur un bureau épuré',
    publishedAt: '2026-06-14',
    lastUpdated: '2026-06-14',
    readingMinutes: 5,
    sections: [
      {
        heading: 'Mesurer l\'espace sous l\'écran',
        body: 'Avant tout, mesurez la largeur disponible entre les pieds du moniteur et la hauteur libre sous la dalle. Une barre de 40-41 cm (Razer Leviathan V2 X, Creative GS3, Stage Air V2) se glisse sous la plupart des écrans 24-27", tandis qu\'une barre de 60 cm demande un bureau plus large.',
      },
      {
        heading: 'Un seul câble pour désencombrer',
        body: 'Sur un petit bureau, privilégiez une barre alimentée et alimentée en audio par un unique câble USB-C : pas de bloc secteur, pas de caisson au sol. C\'est le cas des modèles compacts, parfaits pour un setup épuré.',
      },
      {
        heading: 'Faut-il renoncer aux basses ?',
        body: 'Sans caisson, les basses sont plus discrètes, mais les radiateurs passifs des bonnes barres compactes (Leviathan V2 X, GS3) offrent un grave honnête. Si l\'impact prime malgré l\'espace réduit, la Creative Katana V2X propose un caisson plus facile à caser que les gros modèles.',
      },
      {
        heading: 'Et pour un PC portable ?',
        body: 'Pour un laptop ou un poste nomade, une mini-barre USB-C, voire un modèle sur batterie (Stage Air V2), apporte un vrai gain de clarté face aux haut-parleurs intégrés, sans alourdir le sac.',
      },
    ],
    faq: [
      {
        question: 'Quelle largeur de barre de son pour un écran 24 ou 27 pouces ?',
        answer:
          'Une barre de 40 à 50 cm convient à la plupart des moniteurs 24-27". Vérifiez surtout la hauteur pour ne pas masquer le bas de la dalle, et la largeur entre les pieds de l\'écran.',
      },
      {
        question: 'Une barre compacte suffit-elle pour un petit bureau ?',
        answer:
          'Oui : face aux haut-parleurs intégrés d\'un moniteur, une barre compacte comme la Razer Leviathan V2 X ou la Creative GS3 apporte un gain de clarté et de volume immédiatement perceptible, sans encombrer.',
      },
    ],
  },
];

/** Retourne un guide par slug. */
export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}
