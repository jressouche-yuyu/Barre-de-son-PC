import type { Guide } from './types';

/**
 * Guides éditoriaux (contenu informationnel TOFU/MOFU).
 * Ils captent les requêtes « comment choisir », « différence entre… » et
 * nourrissent le maillage interne vers les classements et les fiches produit.
 */
export const guides: Guide[] = [
  {
    slug: 'comment-choisir-barre-de-son-pc',
    title: 'Comment choisir une barre de son pour PC ?',
    description:
      'Connectique, encombrement, caisson, RGB : tous les critères pour bien choisir une barre de son adaptée à un usage informatique.',
    publishedAt: '2026-03-12',
    lastUpdated: '2026-06-07',
    readingMinutes: 7,
    sections: [
      {
        heading: 'Connectique : USB, Bluetooth, jack ou optique ?',
        body: 'Sur un PC, la connexion USB est la plus pratique : elle gère l\'alimentation et le signal audio numérique sur un seul câble, sans pilote spécifique la plupart du temps. Le Bluetooth ajoute la souplesse pour le smartphone. La prise jack 3.5 mm reste un repli universel, tandis que l\'entrée optique sert surtout à brancher une console ou une TV.',
      },
      {
        heading: 'Faut-il un caisson de basses ?',
        body: 'Un caisson dédié transforme l\'expérience pour le jeu et les films grâce à un grave physique. Il occupe toutefois de la place sous le bureau. Pour la bureautique, la visio et la musique neutre, une barre seule ou des moniteurs compacts suffisent largement.',
      },
      {
        heading: 'Encombrement et placement sur le bureau',
        body: 'Mesure la largeur disponible sous ton moniteur : une barre de 50 à 60 cm se glisse souvent devant le pied d\'écran. Vérifie aussi la hauteur pour ne pas masquer le bas de la dalle. Les modèles compacts (Creative GS5) conviennent aux petits espaces.',
      },
      {
        heading: 'Gaming : RGB, son 3D et latence',
        body: 'Pour un setup gaming, l\'éclairage RGB synchronisable (Razer Chroma) et la spatialisation 3D sont des arguments. En USB, la latence est négligeable. Attention : pour le jeu compétitif en ligne, un casque reste souvent plus précis pour la localisation et le chat vocal.',
      },
      {
        heading: 'Budget : à quoi s\'attendre par tranche de prix',
        body: 'Sous 100 €, on vise un combo barre + caisson d\'entrée de gamme (Creative Stage V2). Entre 100 et 250 €, on accède à de vraies barres gaming avec caisson performant. Au-delà de 400 €, on paie des technologies premium comme le son 3D à suivi de tête.',
      },
    ],
    faq: [
      {
        question: 'Une barre de son se branche-t-elle en USB sur un PC ?',
        answer:
          'Oui, la majorité des barres de son pour PC se branchent en USB, ce qui assure à la fois l\'alimentation et le signal audio sur un seul câble, généralement sans pilote à installer.',
      },
      {
        question: 'Barre de son ou casque pour jouer sur PC ?',
        answer:
          'La barre de son offre un confort d\'usage et un grave physique pour le jeu solo et les films. Le casque reste préférable pour le jeu compétitif (précision spatiale, chat vocal) et pour ne pas déranger l\'entourage.',
      },
    ],
  },
  {
    slug: 'barre-de-son-vs-enceintes-pc',
    title: 'Barre de son ou enceintes pour PC : que choisir ?',
    description:
      'Avantages, inconvénients et cas d\'usage : faut-il préférer une barre de son ou des enceintes pour votre ordinateur ?',
    publishedAt: '2026-04-02',
    lastUpdated: '2026-06-03',
    readingMinutes: 5,
    sections: [
      {
        heading: 'La barre de son : gain de place et simplicité',
        body: 'Une barre concentre l\'audio dans un seul boîtier posé devant l\'écran. Branchement souvent unique en USB, commandes intégrées, encombrement minimal : c\'est la solution la plus simple pour désencombrer un bureau.',
      },
      {
        heading: 'Les enceintes : fidélité et scène sonore',
        body: 'Deux enceintes séparées (monitoring comme les Edifier MR4) créent une vraie stéréo avec une scène sonore plus large et un rendu plus fidèle. Le prix de cette qualité : davantage d\'espace et un placement à soigner.',
      },
      {
        heading: 'Quel choix selon votre usage ?',
        body: 'Pour le jeu, les films et un bureau chargé, privilégie une barre avec caisson. Pour la création audio, la musique et l\'écoute attentive, des enceintes de monitoring offrent une meilleure restitution. Pour la simple bureautique, une barre compacte suffit.',
      },
    ],
    faq: [
      {
        question: 'Les enceintes sont-elles meilleures qu\'une barre de son pour le PC ?',
        answer:
          'En fidélité sonore et largeur de scène, des enceintes de monitoring dépassent généralement une barre de son. Mais elles occupent plus de place et coûtent souvent plus cher à qualité égale d\'usage quotidien.',
      },
    ],
  },
];

/** Retourne un guide par slug. */
export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}
