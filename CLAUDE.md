# Barre-de-son-PC — notes pour Claude

Site statique **Astro** comparant des barres de son pour PC (tests, classements,
guides, blog). Données produit dans `src/data/`, rendu dans `src/pages/`.

## Commandes

- `npm run dev` — serveur de développement
- `npm run build` — build de production (vérifie aussi les types Astro)

## Architecture du contenu

- **Produits** : `src/data/soundbars.ts` (type `Soundbar` dans `src/data/types.ts`).
  Le champ `image` est la vignette de carte ; `gallery` est la galerie de la fiche.
- **Classements** : `src/data/rankings.ts` → `/classements/[slug]`. Affichent déjà
  les blocs produits (carte + « Pourquoi ce choix »).
- **Guides** : `src/data/guides.ts` → `/guides/[slug]` (type `Guide`).
- **Blog** : `src/content/blog/*.md` (collection Astro) → `/blog/[slug]`.

## RÈGLE ÉDITORIALE — sélections de produits (IMPORTANT)

**Tout article ou guide qui oriente le lecteur vers une sélection d'une ou
plusieurs barres de son DOIT intégrer les blocs (cartes) des pages produits
sélectionnées dans le corps du contenu** — pas seulement des mentions
textuelles. C'est systématique pour chaque nouveau contenu de ce type.

Concrètement :

- **Guide** (`src/data/guides.ts`) : renseigner le champ `picks` du guide —
  une liste de `{ soundbar: '<slug>', why: '<raison courte>' }` (+ `picksHeading`
  optionnel). Le composant `SoundbarPicks.astro` affiche automatiquement les
  cartes produit avec leur justification, déjà câblé dans `guides/[slug].astro`.

  ```ts
  picksHeading: 'Notre sélection',
  picks: [
    { soundbar: 'razer-leviathan-v2-x', why: 'Compacte et 100 % USB-C…' },
    { soundbar: 'creative-sound-blaster-katana-v2', why: 'La plus polyvalente…' },
  ],
  ```

- **Classement** (`src/data/rankings.ts`) : le pattern est déjà natif (cartes +
  « Pourquoi ce choix »), rien de plus à faire.

- **Article de blog** orienté sélection : réutiliser le composant
  `SoundbarPicks.astro`. Les articles purement informationnels/techniques
  (réglages, explications) n'ont pas de sélection produit et n'en ajoutent pas.

Les `soundbar` référencés doivent être des slugs existants de `soundbars.ts`
(résolus via `getSoundbar`, les slugs inconnus sont ignorés silencieusement).

## Conventions

- Tout en **français**.
- Les chemins d'URL passent par le helper `url()` (`src/lib/url.ts`) pour gérer
  le `base`.
- Après modification, lancer `npm run build` pour valider avant de committer.
