import type { Soundbar } from './types';

/**
 * Jeu de données des barres de son pour PC.
 *
 * Les caractéristiques techniques proviennent des fiches constructeurs et de
 * tests de référence (Razer, Creative, GamesRadar, Tom's Hardware, TechPowerUp…).
 * Les PRIX sont indicatifs (marché FR, mi-2026) et fluctuent : à revérifier
 * avant publication. Les NOTES sont éditoriales (échelle /10).
 *
 * Images : place les visuels dans /public/images/products/<slug>.svg (ou .jpg/.webp)
 * puis mets à jour le champ `image`. Les fichiers fournis sont des placeholders.
 */
export const soundbars: Soundbar[] = [
  {
    slug: 'razer-leviathan-v2-pro',
    name: 'Razer Leviathan V2 Pro',
    brand: 'Razer',
    price: 399,
    currency: 'EUR',
    score: 8.7,
    scores: { son: 9, basses: 9, ergonomie: 8, connectique: 7.5, rapportQualitePrix: 7.5 },
    verdict:
      'Son 3D à suivi de tête par caméra IR : l\'expérience la plus immersive du marché PC, à prix premium.',
    summary:
      'La Leviathan V2 Pro combine beamforming et suivi de tête par caméra infrarouge pour créer une bulle de son surround 3D recentrée en permanence sur le joueur. Cinq haut-parleurs large bande de 2" et un caisson 13,3 cm à émission vers le bas assurent une assise solide (40 Hz – 20 kHz). Technologiquement bluffante, elle vise les passionnés prêts à payer l\'immersion.',
    pros: [
      'Audio 3D beamforming avec suivi de tête (AI Head Tracking)',
      'Caisson 13,3 cm puissant et précis',
      'THX Spatial Audio et finition premium',
      'Éclairage Chroma RGB',
    ],
    cons: [
      'Tarif élevé',
      'Suivi de tête perçu comme gadget par certains',
      'Dépendance au logiciel Synapse',
    ],
    bestFor: 'Joueurs solo en quête de l\'immersion 3D maximale sur un seul poste',
    connectivity: ['USB-C', 'Bluetooth', 'Jack 3.5mm'],
    driverConfig: '5 haut-parleurs large bande 2" + caisson 13,3 cm (5,25") à émission vers le bas',
    frequencyResponse: '40 Hz – 20 kHz',
    hasSubwoofer: true,
    hasMicrophone: false,
    hasRGB: true,
    dimensionsCm: { width: 60, height: 11.4, depth: 9 },
    image: '/images/products/razer-leviathan-v2-pro.svg',
    imageAlt: 'Barre de son Razer Leviathan V2 Pro avec son caisson de basses',
    tutorial: {
      intro:
        'La Leviathan V2 Pro se branche en USB-C sur le PC et tire le meilleur d\'elle-même avec le suivi de tête activé dans Synapse.',
      steps: [
        {
          title: 'Brancher la barre et le caisson',
          body: 'Reliez le caisson à la barre avec le câble fourni, puis branchez la barre au PC via le câble USB-C. La barre s\'allume automatiquement.',
        },
        {
          title: 'Installer Razer Synapse',
          body: 'Téléchargez Razer Synapse depuis razer.com. C\'est l\'application qui débloque le THX Spatial Audio, l\'égaliseur et le RGB Chroma.',
        },
        {
          title: 'Activer le suivi de tête',
          body: 'Dans Synapse, activez le « Head Tracking » : la caméra IR de la barre suit votre position pour recentrer le son 3D. Calibrez en restant face à l\'écran.',
        },
        {
          title: 'Choisir un profil sonore',
          body: 'Sélectionnez le profil THX adapté (Jeu, Film, Musique) ou réglez l\'EQ 10 bandes selon vos goûts.',
        },
      ],
      tips: [
        'Désactivez le suivi de tête pour la musique : un stéréo classique est souvent plus naturel.',
        'Placez la barre bien centrée sous l\'écran pour un suivi optimal.',
      ],
    },
    lastUpdated: '2026-06-13',
    releaseYear: 2023,
  },
  {
    slug: 'razer-leviathan-v2',
    name: 'Razer Leviathan V2',
    brand: 'Razer',
    price: 229,
    currency: 'EUR',
    score: 8.5,
    scores: { son: 8.5, basses: 9, ergonomie: 8.5, connectique: 7, rapportQualitePrix: 8 },
    verdict:
      'La référence gaming sur bureau : caisson dédié, RGB Chroma 18 zones et THX Spatial pour un son immersif.',
    summary:
      'Pensée pour le PC, la Leviathan V2 associe deux haut-parleurs large bande, deux tweeters, deux radiateurs passifs et un caisson 14 cm à émission vers le bas (65 W au total, 45 Hz – 20 kHz). Branchée en USB, elle offre un rendu dynamique, du THX Spatial Audio et un éclairage Chroma RGB sur 18 zones, le tout dans un format compact.',
    pros: [
      'Caisson de basses dédié très efficace',
      'Branchement USB plug-and-play sur PC',
      'Chroma RGB 18 zones + THX Spatial Audio',
      'Format compact adapté à un bureau',
    ],
    cons: ['Pas de prise jack ni d\'optique', 'Logiciel Synapse parfois lourd', 'Aigus un peu en retrait à fort volume'],
    bestFor: 'Joueurs PC cherchant des basses physiques et du RGB sans encombrer le bureau',
    connectivity: ['USB-C', 'Bluetooth'],
    driverConfig: '2 large bande (48×95 mm) + 2 tweeters 20 mm + 2 radiateurs passifs + caisson 14 cm',
    powerRmsWatts: 65,
    frequencyResponse: '45 Hz – 20 kHz',
    hasSubwoofer: true,
    hasMicrophone: false,
    hasRGB: true,
    dimensionsCm: { width: 50, height: 9.1, depth: 8.4 },
    image: '/images/products/razer-leviathan-v2.svg',
    imageAlt: 'Barre de son gaming Razer Leviathan V2 avec caisson de basses et RGB',
    tutorial: {
      intro:
        'Installation immédiate en USB ; Synapse débloque le THX Spatial Audio et la personnalisation du Chroma.',
      steps: [
        {
          title: 'Relier le caisson à la barre',
          body: 'Connectez le caisson de basses à la barre avec le câble dédié avant tout.',
        },
        {
          title: 'Brancher en USB sur le PC',
          body: 'Reliez la barre au PC via USB. Windows la reconnaît comme sortie audio par défaut, sans pilote.',
        },
        {
          title: 'Installer Synapse pour le THX Spatial',
          body: 'Le THX Spatial Audio et le Chroma RGB nécessitent Razer Synapse (Windows). Activez le surround virtuel pour le jeu.',
        },
        {
          title: 'Régler l\'égaliseur',
          body: 'Ajustez l\'EQ 10 bandes ou choisissez un préréglage selon le contenu (jeu, film, musique).',
        },
      ],
      tips: [
        'Pour le smartphone, l\'appairage Bluetooth 5.2 se fait via le bouton dédié de la barre.',
        'Posez le caisson au sol ou sous le bureau, jamais coincé contre un mur pour éviter les résonances.',
      ],
    },
    lastUpdated: '2026-06-13',
    releaseYear: 2022,
  },
  {
    slug: 'creative-sound-blaster-katana-v2',
    name: 'Creative Sound Blaster Katana V2',
    brand: 'Creative',
    price: 299,
    currency: 'EUR',
    score: 8.6,
    scores: { son: 9, basses: 8.5, ergonomie: 8, connectique: 9.5, rapportQualitePrix: 8 },
    verdict:
      'Tri-amplifiée et ultra-connectée : la barre la plus puissante et polyvalente pour un poste hybride PC/console/TV.',
    summary:
      'La Katana V2 mise sur une conception tri-amplifiée à cinq haut-parleurs (2 médiums 6,3 cm, 2 tweeters 19 mm) épaulée par un caisson 16,5 cm, pour jusqu\'à 250 W crête (50 Hz – 20 kHz). Sa connectique est exemplaire (USB-C, Bluetooth, optique, HDMI ARC, AUX) et le moteur Super X-Fi excelle au casque. La référence polyvalente.',
    pros: [
      'Connectique très complète (USB-C, BT, optique, HDMI ARC, AUX)',
      'Conception tri-amplifiée puissante (jusqu\'à 250 W crête)',
      'Super X-Fi et écran d\'état pratique',
      'Excellente pour PC, console et TV',
    ],
    cons: ['Caisson encombrant', 'Logiciel Sound Blaster Command dense', 'Prix au-dessus de la concurrence directe'],
    bestFor: 'Usage hybride PC / console / TV exigeant une connectique riche et de la puissance',
    connectivity: ['USB-C', 'Bluetooth', 'Jack 3.5mm', 'Optique', 'HDMI ARC'],
    driverConfig: '2 médiums 6,3 cm + 2 tweeters 19 mm + caisson 16,5 cm (tri-amplifié)',
    powerPeakWatts: 250,
    frequencyResponse: '50 Hz – 20 kHz',
    hasSubwoofer: true,
    hasMicrophone: false,
    hasRGB: true,
    dimensionsCm: { width: 60, height: 9.5, depth: 6.2 },
    image: '/images/products/creative-sound-blaster-katana-v2.svg',
    imageAlt: 'Barre de son Creative Sound Blaster Katana V2 avec caisson de basses',
    tutorial: {
      intro:
        'La Katana V2 se pilote depuis l\'appli Sound Blaster Command ; l\'USB-C est recommandé sur PC pour profiter du Super X-Fi.',
      steps: [
        {
          title: 'Choisir l\'entrée',
          body: 'Sur PC, privilégiez l\'USB-C (audio numérique + Super X-Fi). Pour une console ou une TV, utilisez l\'HDMI ARC ou l\'optique.',
        },
        {
          title: 'Brancher le caisson',
          body: 'Reliez le caisson sans fil ou filaire selon le modèle, puis allumez la barre. L\'écran d\'état affiche la source active.',
        },
        {
          title: 'Installer Sound Blaster Command',
          body: 'Sous Windows, l\'application déverrouille l\'égaliseur, les modes surround et le réglage Super X-Fi.',
        },
        {
          title: 'Calibrer le Super X-Fi (au casque)',
          body: 'Si vous branchez un casque sur la barre, lancez la cartographie SXFI via l\'appli mobile pour un rendu personnalisé.',
        },
      ],
      tips: [
        'Le bouton source en façade bascule rapidement entre PC, console et Bluetooth.',
        'Pour le cinéma, activez le mode surround ; pour la musique, restez en stéréo directe.',
      ],
    },
    lastUpdated: '2026-06-13',
    releaseYear: 2022,
  },
  {
    slug: 'creative-sound-blaster-katana-v2x',
    name: 'Creative Sound Blaster Katana V2X',
    brand: 'Creative',
    price: 199,
    currency: 'EUR',
    score: 8.3,
    scores: { son: 8.5, basses: 8, ergonomie: 8.5, connectique: 9, rapportQualitePrix: 8.5 },
    verdict:
      'La Katana en plus compact et abordable : 90 W RMS, caisson réduit de 40 % et connectique complète.',
    summary:
      'La V2X reprend la formule tri-amplifiée de la Katana V2 dans un format plus contenu : 2 médiums 34 mm, 2 tweeters 19 mm et un caisson 16,5 cm 40 % plus petit, pour 90 W RMS (180 W crête). La connectique reste très riche (USB, Bluetooth, optique, HDMI ARC, AUX) et le Super X-Fi est de la partie. Un excellent compromis.',
    pros: [
      'Connectique complète comme la grande Katana',
      'Caisson 40 % plus compact, plus facile à caser',
      'Super X-Fi et surround virtuel 5.1',
      'Très bon rapport qualité-prix',
    ],
    cons: ['Moins de puissance que la Katana V2', 'RGB discret', 'Logiciel un peu touffu'],
    bestFor: 'Bureau hybride cherchant la polyvalence Katana sans l\'encombrement ni le prix',
    connectivity: ['USB-C', 'Bluetooth', 'Jack 3.5mm', 'Optique', 'HDMI ARC'],
    driverConfig: '2 médiums 34 mm + 2 tweeters 19 mm + caisson 16,5 cm (tri-amplifié)',
    powerRmsWatts: 90,
    powerPeakWatts: 180,
    frequencyResponse: '50 Hz – 20 kHz',
    hasSubwoofer: true,
    hasMicrophone: false,
    hasRGB: true,
    dimensionsCm: { width: 60, height: 6, depth: 7.8 },
    image: '/images/products/creative-sound-blaster-katana-v2x.svg',
    imageAlt: 'Barre de son Creative Sound Blaster Katana V2X avec caisson compact',
    tutorial: {
      intro:
        'Même prise en main que la Katana V2, avec un caisson plus facile à placer sous le bureau.',
      steps: [
        {
          title: 'Brancher en USB sur PC',
          body: 'Reliez la barre au PC en USB pour l\'audio numérique et le Super X-Fi. Sélectionnez-la comme sortie par défaut dans Windows.',
        },
        {
          title: 'Connecter le caisson',
          body: 'Reliez le caisson compact à la barre, puis positionnez-le au sol près du bureau.',
        },
        {
          title: 'Installer Sound Blaster Command',
          body: 'L\'application gère l\'EQ, le surround virtuel 5.1 et le Super X-Fi.',
        },
        {
          title: 'Activer le surround pour le jeu',
          body: 'Pour les jeux et films, activez le mode surround virtuel ; gardez le stéréo pur pour la musique.',
        },
      ],
      tips: [
        'L\'HDMI ARC permet de piloter le volume avec la télécommande de la TV.',
        'Un seul caisson : évitez de le coincer dans un meuble fermé pour préserver le grave.',
      ],
    },
    lastUpdated: '2026-06-13',
    releaseYear: 2022,
  },
  {
    slug: 'razer-leviathan-v2-x',
    name: 'Razer Leviathan V2 X',
    brand: 'Razer',
    price: 99,
    currency: 'EUR',
    score: 7.9,
    scores: { son: 7.5, basses: 7, ergonomie: 9, connectique: 7.5, rapportQualitePrix: 9 },
    verdict:
      'Compacte, un seul câble USB-C et du RGB : la barre gaming la plus simple à vivre sous un moniteur.',
    summary:
      'La V2 X se contente de deux haut-parleurs large bande type racetrack et deux radiateurs passifs, sans caisson, pour un encombrement minimal (40 cm). Alimentée et alimentée en audio par un unique câble USB-C, elle monte à 90 dB et propose 14 zones de Chroma RGB. La porte d\'entrée idéale dans l\'univers Leviathan.',
    pros: [
      'Un seul câble USB-C (alimentation + audio)',
      'Format ultra-compact sous l\'écran',
      'Chroma RGB 14 zones',
      'Excellent rapport qualité-prix',
    ],
    cons: ['Pas de caisson de basses', 'Grave limité', 'Pas de prise jack'],
    bestFor: 'Setup gaming compact ou laptop cherchant un vrai upgrade simple et abordable',
    connectivity: ['USB-C', 'Bluetooth'],
    driverConfig: '2 haut-parleurs large bande racetrack (48×95 mm) + 2 radiateurs passifs',
    hasSubwoofer: false,
    hasMicrophone: false,
    hasRGB: true,
    dimensionsCm: { width: 40, height: 8, depth: 8.6 },
    image: '/images/products/razer-leviathan-v2-x.svg',
    imageAlt: 'Barre de son compacte Razer Leviathan V2 X avec éclairage RGB',
    tutorial: {
      intro:
        'La plus simple de la gamme : un seul câble USB-C suffit pour l\'alimentation et le son.',
      steps: [
        {
          title: 'Brancher le câble USB-C unique',
          body: 'Reliez la barre au PC via l\'unique câble USB-C : il fournit à la fois l\'alimentation et l\'audio. Aucune prise secteur nécessaire.',
        },
        {
          title: 'Définir la sortie audio',
          body: 'Dans Windows, sélectionnez la Leviathan V2 X comme périphérique de sortie par défaut.',
        },
        {
          title: 'Personnaliser le Chroma (optionnel)',
          body: 'Installez Synapse pour régler les 14 zones RGB et l\'égaliseur.',
        },
        {
          title: 'Appairer en Bluetooth',
          body: 'Pour le smartphone, maintenez le bouton Bluetooth jusqu\'au clignotement puis appairez.',
        },
      ],
      tips: [
        'Sur un port USB de façade peu puissant, préférez un port arrière pour un volume maximal stable.',
        'Sans caisson, montez légèrement les basses dans l\'EQ pour gagner en impact.',
      ],
    },
    lastUpdated: '2026-06-13',
    releaseYear: 2022,
  },
  {
    slug: 'creative-stage-v2',
    name: 'Creative Stage V2',
    brand: 'Creative',
    price: 119,
    currency: 'EUR',
    score: 8.0,
    scores: { son: 7.5, basses: 8, ergonomie: 8, connectique: 9, rapportQualitePrix: 9.5 },
    verdict:
      'Le meilleur combo barre + caisson à petit prix : 80 W RMS, Clear Dialog et une connectique étonnamment complète.',
    summary:
      'La Stage V2 démocratise le combo barre + caisson : deux satellites de 20 W et un caisson filaire 13,3 cm délivrent 80 W RMS (160 W crête). La connectique est généreuse pour le tarif (HDMI ARC, USB-C, optique, jack, Bluetooth 5.0) et la fonction Clear Dialog soigne les voix. Le choix malin des budgets serrés.',
    pros: [
      'Rapport qualité-prix imbattable',
      'Caisson de basses filaire inclus',
      'Connectique riche (HDMI ARC, USB-C, optique, jack, BT)',
      'Clear Dialog pour la clarté des voix',
    ],
    cons: ['Finition plastique', 'Scène sonore assez étroite', 'Caisson filaire à câbler'],
    bestFor: 'Petit budget voulant un vrai 2.1 polyvalent pour PC et TV',
    connectivity: ['USB-C', 'Bluetooth', 'Jack 3.5mm', 'Optique', 'HDMI ARC'],
    driverConfig: '2 satellites 20 W + caisson 13,3 cm (5,25") filaire',
    powerRmsWatts: 80,
    powerPeakWatts: 160,
    hasSubwoofer: true,
    hasMicrophone: false,
    hasRGB: false,
    dimensionsCm: { width: 68, height: 10, depth: 7.8 },
    image: '/images/products/creative-stage-v2.svg',
    imageAlt: 'Barre de son Creative Stage V2 avec son caisson de basses filaire',
    tutorial: {
      intro:
        'Un branchement simple : reliez le caisson, choisissez l\'entrée USB-C sur PC, et activez Clear Dialog si besoin.',
      steps: [
        {
          title: 'Câbler le caisson',
          body: 'Le caisson est filaire : reliez-le à la barre avec le câble fourni avant la mise sous tension.',
        },
        {
          title: 'Brancher sur le PC',
          body: 'Utilisez l\'USB-C pour l\'audio numérique sur PC, ou le jack 3.5 mm en repli universel.',
        },
        {
          title: 'Sélectionner la source',
          body: 'Le bouton source bascule entre USB, optique, HDMI ARC, AUX et Bluetooth.',
        },
        {
          title: 'Activer Clear Dialog et Surround',
          body: 'Les touches dédiées sur la barre/ télécommande renforcent les voix (films, visio) ou élargissent la scène.',
        },
      ],
      tips: [
        'Pour la TV, l\'HDMI ARC synchronise le volume avec la télécommande du téléviseur.',
        'Montez le caisson progressivement : son niveau se règle indépendamment.',
      ],
    },
    lastUpdated: '2026-06-13',
    releaseYear: 2021,
  },
  {
    slug: 'creative-sound-blaster-gs3',
    name: 'Creative Sound Blaster GS3',
    brand: 'Creative',
    price: 59,
    currency: 'EUR',
    score: 7.3,
    scores: { son: 7.5, basses: 6.5, ergonomie: 8.5, connectique: 7.5, rapportQualitePrix: 8.5 },
    verdict:
      'Mini-barre RGB en USB-C avec techno SuperWide et sortie casque en façade : idéale pour désencombrer un bureau.',
    summary:
      'La GS3 est une barre compacte (41 cm) alimentée en USB-C, avec deux haut-parleurs large bande (2×6 W, 24 W crête) et des radiateurs passifs. La techno SuperWide élargit la scène, le Bluetooth 5.4 assure la liaison mobile et une prise casque en façade évite de tâtonner derrière le PC. Une excellente entrée de gamme.',
    pros: [
      'Format compact alimenté en USB-C',
      'SuperWide pour une scène élargie',
      'Bluetooth 5.4 et prise casque en façade',
      'Éclairage RGB et prix doux',
    ],
    cons: ['Basses limitées sans caisson', 'Puissance modeste (24 W crête)', 'Pas pour les grandes pièces'],
    bestFor: 'Petits bureaux et moniteurs cherchant un gain de clarté discret à petit prix',
    connectivity: ['USB-C', 'Bluetooth', 'Jack 3.5mm'],
    driverConfig: '2 haut-parleurs large bande (2×6 W) + radiateurs passifs',
    powerPeakWatts: 24,
    frequencyResponse: '65 Hz – 20 kHz',
    hasSubwoofer: false,
    hasMicrophone: false,
    hasRGB: true,
    dimensionsCm: { width: 41, height: 9.3, depth: 7.4 },
    image: '/images/products/creative-sound-blaster-gs3.svg',
    imageAlt: 'Barre de son compacte Creative Sound Blaster GS3 avec éclairage RGB',
    tutorial: {
      intro:
        'Branchement plug-and-play en USB-C ; la prise casque en façade et le Bluetooth 5.4 ajoutent de la souplesse.',
      steps: [
        {
          title: 'Brancher en USB-C',
          body: 'Reliez la GS3 au PC avec le câble USB-C fourni : elle est alimentée et reçoit l\'audio par ce seul câble.',
        },
        {
          title: 'Définir la sortie par défaut',
          body: 'Sélectionnez la GS3 comme périphérique de lecture dans Windows.',
        },
        {
          title: 'Activer SuperWide',
          body: 'Le bouton dédié élargit la scène sonore : idéal pour les jeux et les films, à désactiver pour la musique pure.',
        },
        {
          title: 'Utiliser la sortie casque',
          body: 'Branchez un casque sur la prise façade pour basculer instantanément en écoute privée.',
        },
      ],
      tips: [
        'Le Bluetooth 5.4 permet de garder le PC en USB et le téléphone en sans-fil.',
        'Sans caisson, placez la barre contre le pied de l\'écran pour un léger renfort des basses.',
      ],
    },
    lastUpdated: '2026-06-13',
    releaseYear: 2024,
  },
  {
    slug: 'creative-stage-air-v2',
    name: 'Creative Stage Air V2',
    brand: 'Creative',
    price: 55,
    currency: 'EUR',
    score: 7.0,
    scores: { son: 7, basses: 6, ergonomie: 9, connectique: 7.5, rapportQualitePrix: 8.5 },
    verdict:
      'Mini-barre nomade sur batterie : USB-C, Bluetooth 5.3 et radiateur passif pour un son honnête sans encombrer.',
    summary:
      'La Stage Air V2 est une barre ultra-compacte pensée pour les petits espaces et la mobilité. Ses deux haut-parleurs large bande (2×5 W, 20 W crête) et son radiateur passif surdimensionné offrent un grave correct sans caisson. Batterie intégrée (≈ 6 h), USB-C et Bluetooth 5.3 en font une option polyvalente et abordable.',
    pros: [
      'Très compacte et transportable',
      'Batterie intégrée (~6 h)',
      'USB-C, jack et Bluetooth 5.3',
      'Radiateur passif pour un grave honnête sans caisson',
    ],
    cons: ['Puissance faible (20 W crête)', 'Pas de RGB', 'Réservée aux petits volumes'],
    bestFor: 'Laptop, petit bureau ou usage nomade cherchant le minimum d\'encombrement',
    connectivity: ['USB-C', 'Bluetooth', 'Jack 3.5mm'],
    driverConfig: '2 haut-parleurs large bande custom (2×5 W) + radiateur passif surdimensionné',
    powerPeakWatts: 20,
    hasSubwoofer: false,
    hasMicrophone: false,
    hasRGB: false,
    dimensionsCm: { width: 41, height: 7, depth: 7 },
    image: '/images/products/creative-stage-air-v2.svg',
    imageAlt: 'Mini barre de son nomade Creative Stage Air V2',
    tutorial: {
      intro:
        'Posez-la sous l\'écran, branchez l\'USB-C (ou appairez en Bluetooth) et c\'est parti — même sur batterie.',
      steps: [
        {
          title: 'Charger ou brancher',
          body: 'Branchez l\'USB-C au PC pour l\'audio numérique et l\'alimentation, ou utilisez la batterie après une première charge.',
        },
        {
          title: 'Choisir la source',
          body: 'Basculez entre USB, jack 3.5 mm et Bluetooth 5.3 avec le bouton dédié.',
        },
        {
          title: 'Appairer en Bluetooth',
          body: 'Maintenez le bouton Bluetooth jusqu\'au clignotement, puis sélectionnez « Stage Air V2 » sur votre appareil.',
        },
      ],
      tips: [
        'En déplacement, la batterie évite tout câble : pratique avec un laptop.',
        'Collez-la au mur ou au pied d\'écran pour renforcer légèrement les basses.',
      ],
    },
    lastUpdated: '2026-06-13',
    releaseYear: 2022,
  },
];

/** Retourne une barre de son par son slug. */
export function getSoundbar(slug: string): Soundbar | undefined {
  return soundbars.find((s) => s.slug === slug);
}

/** Liste triée par note décroissante. */
export function soundbarsByScore(): Soundbar[] {
  return [...soundbars].sort((a, b) => b.score - a.score);
}

/** Formatage prix en euros, locale FR. */
export function formatPrice(price: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);
}

/** Libellé d'affichage de la puissance (RMS prioritaire, sinon crête, sinon n.c.). */
export function powerLabel(sb: { powerRmsWatts?: number; powerPeakWatts?: number }): string {
  if (sb.powerRmsWatts) return `${sb.powerRmsWatts} W RMS`;
  if (sb.powerPeakWatts) return `${sb.powerPeakWatts} W crête`;
  return 'Non communiquée';
}
