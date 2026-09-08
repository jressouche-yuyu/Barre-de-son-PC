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

## RÈGLE PRIX — aucun prix chiffré sur le site (IMPORTANT)

Le site n'affiche **jamais un prix exact en euros**. Deux raisons : un prix relevé un jour
est faux le lendemain, et le programme Amazon Partenaires encadre strictement la durée
d'affichage d'une donnée de prix issue de son API — durée qu'un site statique ne peut pas
tenir. `formatPrice()` a été **supprimé** du code pour qu'aucune routine ne puisse le
rappeler.

Ce qui s'affiche : une **fourchette de gamme** (`PRICE_BANDS` de `src/lib/prix.ts`),
toujours accompagnée de sa date de relevé (`Soundbar.priceCheckedAt`), rendue par
`PrixGamme.astro`. La péremption (45 jours) est portée par le **gabarit** et non par une
routine : elle tient même si la routine de relevé tombe en panne. Le schéma Product utilise
`AggregateOffer` avec les bornes de gamme, jamais un `price`.

**Aucun montant en euros dans le corps d'un texte** — `scripts/news-check.mjs` refuse
l'article.

## RÈGLE NOTATION — la note est calculée, pas saisie

`Soundbar.score` n'existe pas dans les données saisies : il est **calculé** à l'export de
`soundbars.ts` par `scoreFromBreakdown()` (`src/lib/notation.ts`), depuis la grille publiée
sur `/methodologie/` (son 40 %, basses 30 %, ergonomie 20 %, connectique 5 %, rapport
qualité-prix 5 %). On renseigne donc `scores: { son, basses, ergonomie, connectique,
rapportQualitePrix }` et la note s'en déduit. **Ne jamais écrire une note globale à la
main** : la page méthodologie et le calcul lisent la même constante, ils ne peuvent pas
diverger.

## RÈGLE HONNÊTETÉ — aucun test physique n'est revendiqué

Ce site n'écoute pas et ne mesure pas les produits. C'est un comparatif **éditorial** fondé
sur les caractéristiques constructeur et les mesures publiées par des laboratoires
indépendants, appliquées à une grille publique — position assumée sur `/methodologie/`.
Formuler « d'après les caractéristiques constructeur », « sur le papier », « d'après les
mesures publiées par X ». **Jamais** « nous avons testé », « à l'écoute, nous ». Ni avis
client, ni témoignage, ni « recommandé par » sans source.

## Machinerie d'autonomie éditoriale (`scripts/`)

Quatre routines Claude Code entretiennent le site. Chacune suit un playbook, et le playbook
est le seul fichier vers lequel la routine est pointée.

| Fichier | Rôle |
|---|---|
| `scripts/news.config.mjs` | tous les réglages, aucune logique — le seul fichier à ouvrir pour piloter la cadence |
| `scripts/news-gate.mjs` | portillon de cadence : `GO`/`SKIP`, une ligne, code 0 dans les deux cas |
| `scripts/news-check.mjs` | 17 contrôles mécaniques sur un article ; code 1 tant qu'un ✗ subsiste |
| `scripts/news-ledger.json` + `news-record.mjs` | mémoire anti-doublon, versionnée dans Git |
| `scripts/assign-photo.mjs` | illustration à trois étages, repli génératif garanti |
| `scripts/faits-produits.md` | base anti-hallucination des 13 produits + désambiguïsation |
| `scripts/verifie-rendu.mjs` | 17 contrôles sur le HTML réellement servi, après build |
| `scripts/simule-cadence.mjs` | rejoue une année de réveils pour valider la cadence |
| `scripts/{veille,produits,classements,liens}-playbook.md` | les quatre playbooks de routine (R1 blog, R2 fiches produits, R3 classements et sélection du mois, R4 liens) |

**Branche de déploiement : `main`.** `.github/workflows/deploy.yml` ne se déclenche que sur
`main`. Les routines poussent directement dessus : ni branche de travail, ni Pull Request,
ni demande de validation. Un contenu resté sur une branche est un contenu non publié.

Article de référence à imiter : `src/content/blog/comprendre-puissance-barre-de-son-watts.md`
(17/17 au contrôle qualité).

## Conventions

- Tout en **français**.
- Les chemins d'URL passent par le helper `url()` (`src/lib/url.ts`) pour gérer
  le `base`.
- Après modification, lancer `npm run build` pour valider avant de committer.
