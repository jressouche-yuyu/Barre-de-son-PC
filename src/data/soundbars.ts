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
    image: '/images/products/razer-leviathan-v2-pro-card.webp',
    imageAlt: 'Barre de son Razer Leviathan V2 Pro avec son caisson de basses',
    gallery: [
      '/images/products/razer-leviathan-v2-pro-1.webp',
      '/images/products/razer-leviathan-v2-pro-2.webp',
      '/images/products/razer-leviathan-v2-pro-3.webp',
    ],
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
    image: '/images/products/razer-leviathan-v2-card.webp',
    imageAlt: 'Barre de son gaming Razer Leviathan V2 avec caisson de basses et RGB',
    gallery: [
      '/images/products/razer-leviathan-v2-1.webp',
      '/images/products/razer-leviathan-v2-2.webp',
      '/images/products/razer-leviathan-v2-3.webp',
      '/images/products/razer-leviathan-v2-4.webp',
    ],
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
    image: '/images/products/creative-sound-blaster-katana-v2-card.webp',
    imageAlt: 'Barre de son Creative Sound Blaster Katana V2 avec caisson de basses',
    gallery: [
      '/images/products/creative-sound-blaster-katana-v2-1.webp',
      '/images/products/creative-sound-blaster-katana-v2-2.webp',
      '/images/products/creative-sound-blaster-katana-v2-3.webp',
    ],
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
    image: '/images/products/creative-sound-blaster-katana-v2x-card.webp',
    imageAlt: 'Barre de son Creative Sound Blaster Katana V2X avec caisson compact',
    gallery: [
      '/images/products/creative-sound-blaster-katana-v2x-1.webp',
      '/images/products/creative-sound-blaster-katana-v2x-2.webp',
      '/images/products/creative-sound-blaster-katana-v2x-3.webp',
      '/images/products/creative-sound-blaster-katana-v2x-4.webp',
    ],
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
    image: '/images/products/razer-leviathan-v2-x-card.webp',
    imageAlt: 'Barre de son compacte Razer Leviathan V2 X avec éclairage RGB',
    gallery: [
      '/images/products/razer-leviathan-v2-x-1.webp',
      '/images/products/razer-leviathan-v2-x-2.webp',
      '/images/products/razer-leviathan-v2-x-3.webp',
      '/images/products/razer-leviathan-v2-x-4.webp',
      '/images/products/razer-leviathan-v2-x-5.webp',
    ],
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
    image: '/images/products/creative-stage-v2.webp',
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
    image: '/images/products/creative-sound-blaster-gs3.webp',
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
    image: '/images/products/creative-stage-air-v2.webp',
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
  {
    slug: 'creative-stage-360',
    name: 'Creative Stage 360',
    brand: 'Creative',
    price: 199,
    currency: 'EUR',
    score: 8.2,
    scores: { son: 8.5, basses: 8.5, ergonomie: 7.5, connectique: 9, rapportQualitePrix: 8 },
    verdict:
      'Du Dolby Atmos abordable : une barre 2.1 polyvalente, idéale pour un PC, un écran ultralarge ou une TV.',
    summary:
      'La Stage 360 apporte le Dolby Atmos (virtuel) à petit prix : la barre de 56,5 cm et son caisson délivrent jusqu\'à 120 W RMS (240 W crête). La connectique orientée salon (2 entrées HDMI + ARC, optique, Bluetooth) et la télécommande IR en font une excellente passerelle entre PC, moniteur ultralarge et TV.',
    pros: [
      'Dolby Atmos virtuel convaincant pour le prix',
      'Puissance confortable (jusqu\'à 240 W crête)',
      'Double entrée HDMI + ARC, optique et Bluetooth',
      'Télécommande IR fournie',
    ],
    cons: ['Pas de vraie voie verticale (Atmos simulé)', 'Pas d\'USB audio dédié PC', 'Caisson assez présent'],
    bestFor: 'Poste hybride PC/écran ultralarge/TV cherchant l\'effet surround à petit prix',
    connectivity: ['HDMI ARC', 'Optique', 'Bluetooth'],
    driverConfig: 'Barre 2.0 (60 W) + caisson dédié (60 W), Dolby Atmos virtuel',
    powerRmsWatts: 120,
    powerPeakWatts: 240,
    hasSubwoofer: true,
    hasMicrophone: false,
    hasRGB: false,
    dimensionsCm: { width: 56.5, height: 6.6, depth: 10 },
    image: '/images/products/creative-stage-360.webp',
    imageAlt: 'Barre de son Creative Stage 360 avec caisson et Dolby Atmos',
    tutorial: {
      intro:
        'Sur PC, branche la Stage 360 en HDMI (ou optique) ; la télécommande IR gère sources, volume et modes surround.',
      steps: [
        {
          title: 'Relier le caisson',
          body: 'Connecte le caisson à la barre, puis place-le au sol près du bureau ou du meuble TV.',
        },
        {
          title: 'Choisir l\'entrée',
          body: 'Sur PC/écran ultralarge, utilise l\'HDMI (ou l\'optique si pas de sortie HDMI audio). Pour une TV, branche en HDMI ARC pour piloter le volume avec la télécommande TV.',
        },
        {
          title: 'Activer le mode Surround / Atmos',
          body: 'Via la télécommande IR, active le traitement surround pour les films et jeux ; reste en stéréo pour la musique.',
        },
        {
          title: 'Régler les niveaux',
          body: 'Ajuste le niveau du caisson indépendamment selon ton bureau et le voisinage.',
        },
      ],
      tips: [
        'L\'effet Atmos est simulé : il élargit la scène sans vraies enceintes de plafond.',
        'Sur écran ultralarge, centre bien la barre sous la dalle pour une image sonore cohérente.',
      ],
    },
    lastUpdated: '2026-06-14',
    releaseYear: 2022,
  },
  {
    slug: 'logitech-z407',
    name: 'Logitech Z407',
    brand: 'Logitech',
    price: 99,
    currency: 'EUR',
    score: 7.7,
    scores: { son: 7.5, basses: 8.5, ergonomie: 7.5, connectique: 7.5, rapportQualitePrix: 8.5 },
    verdict:
      'Un 2.1 à grosses basses avec molette de contrôle sans fil : plus qu\'une barre, un vrai kit polyvalent.',
    summary:
      'Le Z407 n\'est pas une barre mais un ensemble 2.1 (deux satellites + caisson à émission vers le bas) délivrant 40 W RMS (80 W crête, 40 Hz – 20 kHz). Sa molette de contrôle sans fil et son Bluetooth en font un kit pratique et généreux en basses, à considérer si l\'impact prime sur le format épuré d\'une barre.',
    pros: [
      'Caisson de basses puissant et profond',
      'Molette de contrôle sans fil pratique',
      'Bluetooth + micro-USB + jack 3,5 mm',
      'Très bon rapport qualité-prix',
    ],
    cons: ['Format 2.1, pas une barre', 'Aigus perfectibles', 'Encombrement des satellites + caisson'],
    bestFor: 'Recherche de basses marquées sur le bureau avec un budget maîtrisé',
    connectivity: ['USB-A', 'Bluetooth', 'Jack 3.5mm'],
    driverConfig: '2 satellites 10 W + caisson 20 W à émission vers le bas (2.1)',
    powerRmsWatts: 40,
    powerPeakWatts: 80,
    frequencyResponse: '40 Hz – 20 kHz',
    hasSubwoofer: true,
    hasMicrophone: false,
    hasRGB: false,
    dimensionsCm: { width: 8.9, height: 16.8, depth: 12 },
    image: '/images/products/logitech-z407.webp',
    imageAlt: 'Kit 2.1 Logitech Z407 avec caisson de basses et molette de contrôle',
    tutorial: {
      intro:
        'Relie le caisson, choisis ta source (USB, jack ou Bluetooth) et pilote tout depuis la molette sans fil.',
      steps: [
        {
          title: 'Connecter les satellites et le caisson',
          body: 'Branche les deux satellites sur le caisson, puis alimente le caisson sur secteur.',
        },
        {
          title: 'Brancher sur le PC',
          body: 'Utilise le câble micro-USB (audio numérique) ou le jack 3,5 mm. Sélectionne le Z407 comme sortie par défaut dans Windows.',
        },
        {
          title: 'Appairer la molette et le Bluetooth',
          body: 'La molette sans fil contrôle volume et lecture ; appuie sur son bouton pour basculer/appairer une source Bluetooth.',
        },
      ],
      tips: [
        'Place le caisson au sol pour des basses plus pleines.',
        'La molette se pose à portée de main : pratique pour couper le son rapidement.',
      ],
    },
    lastUpdated: '2026-06-14',
    releaseYear: 2020,
  },
  {
    slug: 'edifier-mg300',
    name: 'Edifier MG300',
    brand: 'Edifier',
    price: 59,
    currency: 'EUR',
    score: 7.2,
    scores: { son: 7, basses: 6, ergonomie: 9, connectique: 7.5, rapportQualitePrix: 8.5 },
    verdict:
      'Mini-barre RGB avec micro intégré : le compagnon malin pour le gaming léger et la visio sur un petit bureau.',
    summary:
      'La MG300 est une barre compacte (48,5 cm) alimentée en USB, avec deux haut-parleurs 52 mm et des membranes de basses passives. Sa particularité : un micro intégré pratique pour la visio, un éclairage RGB et le Bluetooth 5.3. Idéale pour désencombrer un bureau et enchaîner jeu léger et réunions.',
    pros: [
      'Micro intégré (visio, chat vocal)',
      'Format compact alimenté en USB',
      'Éclairage RGB et Bluetooth 5.3',
      'Prix très accessible',
    ],
    cons: ['Puissance modeste', 'Basses limitées sans caisson', 'Réservée aux petits volumes'],
    bestFor: 'Petit bureau mêlant gaming léger et visioconférences',
    connectivity: ['USB-A', 'Bluetooth'],
    driverConfig: '2 haut-parleurs large bande 52 mm + 2 membranes passives',
    powerRmsWatts: 5,
    hasSubwoofer: false,
    hasMicrophone: true,
    hasRGB: true,
    dimensionsCm: { width: 48.5, height: 7.4, depth: 8 },
    image: '/images/products/edifier-mg300.webp',
    imageAlt: 'Barre de son compacte Edifier MG300 avec RGB et micro intégré',
    tutorial: {
      intro:
        'Branchement USB plug-and-play ; le micro intégré est reconnu par Windows pour la visio.',
      steps: [
        {
          title: 'Brancher en USB',
          body: 'Relie la MG300 au PC via l\'adaptateur USB fourni. Elle est alimentée et reçoit l\'audio par ce câble.',
        },
        {
          title: 'Activer entrée et sortie audio',
          body: 'Dans Windows, sélectionne la MG300 en périphérique de sortie (haut-parleurs) ET d\'entrée (microphone) pour la visio.',
        },
        {
          title: 'Personnaliser le RGB',
          body: 'Le bouton dédié fait défiler les 6 modes d\'éclairage RGB.',
        },
        {
          title: 'Appairer le Bluetooth',
          body: 'Maintiens le bouton Bluetooth jusqu\'au clignotement, puis sélectionne « Edifier MG300 » sur ton téléphone.',
        },
      ],
      tips: [
        'Pour les réunions, teste le micro dans les paramètres de son Windows.',
        'Sans caisson, relève légèrement les basses dans l\'égaliseur de l\'app de visio.',
      ],
    },
    lastUpdated: '2026-06-14',
    releaseYear: 2024,
  },
  {
    slug: 'trust-gxt-620-axon',
    name: 'Trust GXT 620 Axon',
    brand: 'Trust',
    price: 45,
    currency: 'EUR',
    score: 6.8,
    scores: { son: 6.5, basses: 6, ergonomie: 8, connectique: 6.5, rapportQualitePrix: 8 },
    verdict:
      'La barre RGB la moins chère pour habiller un setup gaming d\'entrée de gamme, alimentée en USB.',
    summary:
      'La GXT 620 Axon vise les setups colorés à tout petit prix : barre unique de 42 cm alimentée en USB, éclairage RGB « rainbow » et son correct pour la bureautique et le jeu occasionnel. À réserver aux petits budgets, sans caisson ni Bluetooth.',
    pros: ['Prix plancher', 'Éclairage RGB', 'Alimentation USB simple', 'Format compact (42 cm)'],
    cons: ['Puissance faible (12 W crête)', 'Pas de caisson ni de Bluetooth', 'Entrée audio en jack uniquement'],
    bestFor: 'Setup gaming d\'entrée de gamme et usage bureautique à petit budget',
    connectivity: ['USB-A', 'Jack 3.5mm'],
    driverConfig: '2 haut-parleurs large bande, illumination RGB',
    powerRmsWatts: 6,
    powerPeakWatts: 12,
    hasSubwoofer: false,
    hasMicrophone: false,
    hasRGB: true,
    dimensionsCm: { width: 42, height: 6.8, depth: 7.8 },
    image: '/images/products/trust-gxt-620-axon.webp',
    imageAlt: 'Barre de son gaming RGB Trust GXT 620 Axon',
    tutorial: {
      intro:
        'Deux câbles : l\'USB pour l\'alimentation et le RGB, le jack 3,5 mm pour le son.',
      steps: [
        {
          title: 'Brancher l\'alimentation USB',
          body: 'Relie le câble USB à un port du PC : il alimente la barre et son éclairage RGB.',
        },
        {
          title: 'Brancher l\'audio en jack',
          body: 'Connecte le câble 3,5 mm à la sortie casque/haut-parleurs du PC.',
        },
        {
          title: 'Régler le volume et le RGB',
          body: 'Utilise la molette en façade pour le volume ; l\'éclairage rainbow s\'anime automatiquement.',
        },
      ],
      tips: [
        'Sur un portable sans sortie jack, utilise un adaptateur USB-audio.',
        'Sans caisson, garde un volume modéré pour éviter la distorsion dans les basses.',
      ],
    },
    lastUpdated: '2026-06-14',
    releaseYear: 2021,
  },
  {
    slug: 'edifier-g1500',
    name: 'Edifier G1500',
    brand: 'Edifier',
    price: 89,
    currency: 'EUR',
    score: 7.4,
    scores: { son: 7.5, basses: 6.5, ergonomie: 8, connectique: 8, rapportQualitePrix: 8.5 },
    verdict:
      'Des mini-enceintes 2.0 RGB polyvalentes : une alternative compacte à la barre pour le jeu et la musique.',
    summary:
      'Le G1500 n\'est pas une barre mais une paire d\'enceintes 2.0 compactes, pensées pour le bureau gaming. Bluetooth 5.3, USB et entrée jack, modes Auto EQ (jeu/film) et éclairage RGB en font un kit polyvalent et abordable, à privilégier si tu préfères deux enceintes à une barre unique.',
    pros: [
      'Vraie stéréo avec deux enceintes séparées',
      'Bluetooth 5.3, USB et jack 3,5 mm',
      'Modes Auto EQ et éclairage RGB',
      'Bon rapport qualité-prix',
    ],
    cons: ['Format 2.0, pas une barre', 'Basses limitées sans caisson', 'Puissance modeste'],
    bestFor: 'Bureau gaming/musique préférant deux enceintes à une barre unique',
    connectivity: ['USB-A', 'Bluetooth', 'Jack 3.5mm'],
    driverConfig: '2 enceintes 2.0 compactes + radiateurs passifs, éclairage RGB',
    powerRmsWatts: 5,
    hasSubwoofer: false,
    hasMicrophone: false,
    hasRGB: true,
    dimensionsCm: { width: 9, height: 14, depth: 9 },
    image: '/images/products/edifier-g1500.webp',
    imageAlt: 'Paire d\'enceintes 2.0 RGB Edifier G1500 pour bureau',
    tutorial: {
      intro:
        'Relie les deux enceintes, branche en USB ou jack (ou appaire en Bluetooth) et choisis un mode EQ.',
      steps: [
        {
          title: 'Relier les deux enceintes',
          body: 'Connecte l\'enceinte secondaire à l\'enceinte principale avec le câble fourni.',
        },
        {
          title: 'Brancher sur le PC',
          body: 'Utilise l\'USB ou le jack 3,5 mm, puis sélectionne le G1500 comme sortie par défaut dans Windows.',
        },
        {
          title: 'Choisir un mode et le RGB',
          body: 'Bascule entre les modes Auto EQ (Musique/Jeu/Film) et fais défiler les effets RGB avec les boutons dédiés.',
        },
      ],
      tips: [
        'Écarte les deux enceintes et oriente-les vers tes oreilles pour une vraie scène stéréo.',
        'Le Bluetooth 5.3 permet de garder le PC en USB et le téléphone en sans-fil.',
      ],
    },
    lastUpdated: '2026-06-14',
    releaseYear: 2023,
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
  return '—';
}
