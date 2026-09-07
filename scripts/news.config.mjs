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
  // Objectif : que le rythme de publication ressemble à celui d'une rédaction,
  // pas à celui d'un script. Un site qui publie à chaque réveil de sa routine
  // laisse une empreinte de spam parfaitement lisible.
  minPerWeek: 1,
  maxPerWeek: 3,
  publishHours: { start: 8, end: 19 }, // Europe/Paris, jamais la nuit
  activeDays: [1, 2, 3, 4, 5], // 1 = lundi … 7 = dimanche
  /**
   * Nombre de réveils de la routine par jour actif.
   * ⚠ DOIT refléter le cron réel de la Routine R1. Aujourd'hui deux réveils :
   * `0 7 * * 1-5` et `0 14 * * 1-5` (UTC) → 2. Si tu changes le cron, change
   * cette valeur : le portillon répartit la probabilité sur les réveils restants
   * de la semaine, et un décalage ici fait dériver toute la cadence.
   */
  runsPerDay: 2,
  /** Probabilité d'accepter un second article le même jour. */
  sameDayChance: 0.15,

  // ── SAISONNALITÉ ──────────────────────────────────────────────────────────
  // Le pic de recherche « barre de son PC » tombe sur Black Friday et Noël :
  // c'est le moment où publier plus a un sens, et le seul.
  seasonalBoost: [{ from: '10-15', to: '12-31', minPerWeek: 2, maxPerWeek: 4 }],

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
  preferredSources: [
    'lesnumeriques.com', 'frandroid.com', 'clubic.com', 'tomshardware.fr',
    'journaldugeek.com', '01net.com', 'nextinpact.com',
    'techradar.com', 'rtings.com', 'soundguys.com',
    'razer.com', 'creative.com', 'logitech.com', 'edifier.com', 'trust.com',
  ],
  keywords: [
    'barre de son', 'soundbar', 'enceinte pc', 'audio pc', 'son spatial',
    'dolby atmos', 'thx', 'super x-fi', 'bluetooth', 'usb-c', 'jack',
    'caisson de basses', 'subwoofer', 'rgb', 'gaming', 'télétravail',
    'visioconférence', 'micro', 'latence', 'aptx', 'ldac', 'windows 11',
    'égaliseur', 'dac', 'moniteur', 'bureau',
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
