/**
 * Réglages de la machinerie éditoriale automatique.
 *
 * C'est le SEUL fichier à ouvrir pour piloter les routines : il ne contient que
 * des valeurs, aucune logique. Si tu dois modifier un comportement, modifie une
 * valeur ici — pas un script.
 *
 * Consommé par : news-gate.mjs (cadence), news-check.mjs (seuils de contrôle),
 * assign-photo.mjs (bibliothèque d'images), et les playbooks de scripts/.
 */

export const config = {
  // ── CADENCE (comportement humain) ─────────────────────────────────────────
  // Deux séances de veille par semaine, jusqu'à 2 articles publiés.
  //
  // `minPerWeek: 0` est un choix de conception, pas un oubli : le portillon ne
  // FORCE jamais une publication. Il autorise, et c'est l'étape de veille qui
  // tranche — pas d'actualité ni de donnée fraîche, pas de publication. Forcer
  // un GO pour tenir un quota mettrait l'agent sous pression de production alors
  // qu'il n'a peut-être rien à dire, et un site de créneau qui publie « parce
  // que c'est la fin de la semaine » produit du remplissage qui cannibalise ses
  // propres pages.
  minPerWeek: 0,
  maxPerWeek: 2,
  publishHours: { start: 8, end: 19 }, // Europe/Paris, jamais la nuit
  /**
   * Jours de veille : mardi et vendredi (1 = lundi … 7 = dimanche).
   * Deux séances de veille par semaine. Le portillon autorise ou non à chaque
   * séance ; l'étape de veille garde le dernier mot. Une semaine sans matière
   * est une semaine sans publication, et c'est un fonctionnement normal.
   */
  activeDays: [2, 5],
  /**
   * Nombre de réveils de la routine par jour actif.
   * ⚠ DOIT refléter le cron réel de la Routine R1 : `0 7 * * 2,5` (UTC), soit
   * un seul réveil par jour actif → 1. Si tu changes le cron, change cette
   * valeur : le portillon répartit la probabilité sur les réveils restants de
   * la semaine, et un décalage ici fait dériver toute la cadence.
   */
  runsPerDay: 1,
  /**
   * Probabilité d'accepter un second article le même jour.
   * Sans objet avec un seul réveil par jour, conservé pour le cas où le cron
   * repasserait à deux séances quotidiennes.
   */
  sameDayChance: 0.15,
  /**
   * Plafond de probabilité par séance de veille.
   *
   * Avec deux séances par semaine et un objectif de deux articles, la
   * probabilité brute atteint 1 et le portillon publierait mécaniquement chaque
   * mardi et chaque vendredi — un rythme de script. Ce plafond garantit qu'aucune
   * séance n'est acquise d'avance : la cadence reste irrégulière, ce qui est le
   * comportement demandé.
   */
  sessionChanceCap: 0.8,
  /**
   * Jours fériés français, au format `MM-JJ` — jamais de publication ces jours-là.
   *
   * Un article horodaté le matin du 25 décembre est exactement le signal « ceci
   * est un script » que toute la cadence à visage humain existe pour effacer.
   *
   * Seules les fêtes à date fixe sont listées : les fêtes mobiles (lundi de
   * Pâques, Ascension, lundi de Pentecôte) tombent un lundi ou un jeudi, donc
   * jamais un jour de veille tant que `activeDays` vaut mardi et vendredi.
   */
  holidays: [
    '01-01', // Jour de l'an
    '05-01', // Fête du Travail
    '05-08', // Victoire 1945
    '07-14', // Fête nationale
    '08-15', // Assomption
    '11-01', // Toussaint
    '11-11', // Armistice
    '12-25', // Noël
  ],

  // ── SAISONNALITÉ ──────────────────────────────────────────────────────────
  // Le pic de recherche tombe sur Black Friday et Noël. En saison, on ne relève
  // pas le plafond hebdomadaire — il est déjà à 2, faute d'une troisième séance
  // de veille — mais on relâche le plafond PAR SÉANCE : quand il y a de la
  // matière, les deux séances de la semaine publient plus souvent.
  //
  // `minPerWeek` reste à 0 y compris en saison : rien ne doit jamais forcer une
  // publication, pas même le Black Friday.
  seasonalBoost: [
    { from: '10-15', to: '12-31', minPerWeek: 0, maxPerWeek: 2, sessionChanceCap: 0.95 },
  ],

  // ── ÉDITORIAL ─────────────────────────────────────────────────────────────
  persona:
    "Un utilisateur de PC français, 20 à 45 ans, joueur ou en télétravail, " +
    "équipé d'un écran et des haut-parleurs d'origine, qui veut un meilleur " +
    "son sur son bureau sans encombrement ni installation complexe. Il lit " +
    "des fiches techniques mais ne les décode pas : watts, RMS, canaux, " +
    "codecs, latence Bluetooth restent flous pour lui.",
  tone:
    "concret, technique mais déjargonné, sans survente : on explique ce que " +
    "la caractéristique change à l'usage sur un bureau, puis on dit à qui " +
    "c'est utile et à qui ça ne sert à rien.",

  // ── MAILLAGE INTERNE ──────────────────────────────────────────────────────
  internalLinks: { min: 3, max: 5 },
  /**
   * Page pilier. Ce n'est PAS la page d'accueil : un lien vers la home est un
   * lien faible, un lien vers le classement général convertit.
   */
  strategicPage: {
    url: '/classements/meilleures-barres-de-son-pc/',
    label: 'notre classement des meilleures barres de son PC',
  },
  // Toutes ces URLs ont été vérifiées en 200 par requête réelle le 2026-09-07.
  // Une URL de config en 404 fabrique des liens internes morts : revérifie-les
  // avec `node scripts/verifie-liens-config.mjs` avant d'en ajouter une.
  secondaryLinks: [
    { url: '/classements/meilleures-barres-de-son-pc-gaming/', topic: 'le classement gaming' },
    { url: '/classements/meilleures-barres-de-son-pc-pas-cheres/', topic: 'les modèles à petit budget' },
    { url: '/classements/meilleures-barres-de-son-pc-compactes/', topic: 'les modèles compacts' },
    { url: '/classements/meilleures-barres-de-son-pc-polyvalentes/', topic: 'les modèles polyvalents PC / console / TV' },
    { url: '/classements/meilleures-barres-de-son-pc-sans-fil/', topic: 'les modèles Bluetooth' },
    { url: '/classements/meilleures-barres-de-son-pc-avec-caisson/', topic: 'les modèles avec caisson de basses' },
    { url: '/guides/comment-choisir-barre-de-son-pc/', topic: 'les critères de choix' },
    { url: '/guides/comment-installer-barre-de-son-pc/', topic: "l'installation pas à pas" },
    { url: '/guides/barre-de-son-vs-enceintes-pc/', topic: 'la comparaison avec des enceintes' },
    { url: '/guides/barre-de-son-pc-teletravail-visio/', topic: 'le télétravail et la visio' },
    { url: '/guides/barre-de-son-pc-sans-fil-bluetooth/', topic: 'les limites du Bluetooth' },
    { url: '/guides/barre-de-son-petit-bureau-moniteur/', topic: 'les petits bureaux' },
    { url: '/comparateur/', topic: 'le comparateur de modèles' },
    { url: '/methodologie/', topic: 'notre grille de notation' },
  ],

  // ── VEILLE ────────────────────────────────────────────────────────────────
  //
  // PÉRIMÈTRE ÉLARGI (décision du propriétaire, 07/09/2026).
  //
  // Un audit a mesuré le flux d'actualité du créneau strict « barre de son PC » :
  // environ 4 événements exploitables par an, pour une cadence qui en demande
  // plus de 80. Le créneau ne nourrit pas sa propre veille.
  //
  // Le périmètre couvre donc désormais les barres de son en général — pas
  // seulement PC — et plus largement les systèmes de son domestiques et
  // professionnels. Ce marché-là produit de l'actualité chaque semaine.
  //
  // ⚠ CONTRAINTE DE COHÉRENCE, non négociable : le domaine est
  // barre-de-son-pc.fr. Tout sujet hors du créneau strict DOIT se raccrocher
  // explicitement à l'usage bureau ou PC — « ce que la nouvelle X change pour un
  // bureau », « barre de son de salon branchée sur un PC : ce qui marche et ce
  // qui ne marche pas ». Un article qui parle de home cinéma sans jamais revenir
  // au bureau dilue le sujet du site et se retourne contre lui.
  preferredSources: [
    // Presse tech et audio francophone
    'lesnumeriques.com', 'frandroid.com', 'clubic.com', 'tomshardware.fr',
    'journaldugeek.com', '01net.com', 'nextinpact.com', 'numerama.com',
    'onmag.fr', 'son-video.com', 'diapasonmag.fr', 'lecinephileaverti.fr',
    // Tests et mesures de référence, internationaux
    'techradar.com', 'rtings.com', 'soundguys.com', 'whathifi.com',
    'audiosciencereview.com', 'stereophile.com', 'tomsguide.fr',
    // Constructeurs présents au catalogue
    'razer.com', 'creative.com', 'logitech.com', 'edifier.com', 'trust.com',
    // Constructeurs du périmètre élargi — barres de son, audio domestique et pro
    'sonos.com', 'bose.com', 'jbl.com', 'sony.fr', 'samsung.com', 'lg.com',
    'devialet.com', 'focal.com', 'denon.com', 'yamaha.com', 'sennheiser.com',
    'harmankardon.com', 'polkaudio.com', 'klipsch.com', 'kef.com',
    'genelec.com', 'presonus.com', 'audio-technica.com', 'steinberg.net',
  ],
  keywords: [
    // Créneau strict
    'barre de son', 'soundbar', 'enceinte pc', 'audio pc', 'moniteur', 'bureau',
    // Traitements et formats
    'son spatial', 'dolby atmos', 'dts', 'thx', 'super x-fi', 'égaliseur', 'dac',
    // Connectique et sans-fil
    'bluetooth', 'usb-c', 'jack', 'hdmi arc', 'earc', 'optique', 'wi-fi',
    'aptx', 'ldac', 'latence', 'airplay', 'chromecast',
    // Composants et mesures
    'caisson de basses', 'subwoofer', 'rms', 'réponse en fréquence', 'haut-parleur',
    // Usages
    'rgb', 'gaming', 'télétravail', 'visioconférence', 'micro', 'windows 11',
    'home cinéma', 'multiroom', 'streaming audio',
    // Périmètre élargi : audio domestique et professionnel
    'enceinte connectée', 'ampli', 'amplificateur', 'enceinte de monitoring',
    'moniteur de studio', 'casque studio', 'interface audio', 'table de mixage',
    'sonorisation', 'audio professionnel', 'audio domestique',
  ],
  priorityKeywords: [
    'barre de son pc', 'razer leviathan', 'sound blaster katana',
    'creative stage', 'logitech z407', 'son spatial pc', 'barre de son gaming',
  ],
  /** Fenêtre de fraîcheur d'une actualité, en jours. */
  freshnessDays: 30,

  // ── RÉDACTION ─────────────────────────────────────────────────────────────
  wordRange: { min: 500, max: 900 },
  angles: [
    'ce que la caractéristique change concrètement sur un bureau',
    'un décryptage technique déjargonné avec ordres de grandeur',
    'une mise en perspective avec les alternatives (casque, enceintes)',
    'les idées reçues à corriger et les pièges de fiche technique',
    'un tutoriel de réglage pas à pas sous Windows',
    'un format questions / réponses',
    'le contexte marché : nouveautés, gammes, calendrier',
  ],
  author: 'La rédaction BarreSon PC',

  // ── SEUILS DU CONTRÔLE QUALITÉ (news-check.mjs) ───────────────────────────
  check: {
    metaTitle: { min: 45, max: 65 },
    description: { min: 130, max: 160 },
    faqMin: 3,
    sourcesMin: 2,
    /** Au moins une source non marchande (ni amazon, ni site de marque). */
    nonMerchantSourcesMin: 1,
    tableMinRows: 5,
    tableMinCols: 3,
    /** Paragraphe d'ouverture sous chaque `##` (règle answer-first). */
    answerFirstWords: { min: 25, max: 50 },
  },

  // ── ILLUSTRATION (assign-photo.mjs) ───────────────────────────────────────
  photo: {
    /** Dossier de destination des couvertures d'article. */
    outDir: 'public/images/blog',
    /**
     * Bibliothèques locales fouillées par l'étage de repli, dans cet ordre.
     * Le repli local est ce qui garantit qu'un article n'a jamais de trou visuel
     * même sans PEXELS_API_KEY.
     */
    localLibraries: [
      'public/images/blog',
      'public/images/guides',
      'public/images/rankings',
      'public/images/products',
    ],
    /** Journal des attributions, pour l'anti-répétition. */
    ledger: 'scripts/photo-ledger.json',
    /**
     * WebP et pas AVIF : l'encodage AVIF est environ dix fois plus lent et fait
     * exploser le temps de build pour un gain de poids marginal à cette taille.
     */
    format: 'webp',
    width: 1200,
    height: 400,
  },
};

export default config;
