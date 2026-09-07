# Playbook — Classements et sélection du mois

**Routine R4 — Classements.** Cadence : **bimensuelle**, `0 6 1,15 * *` (UTC) —
le 1er et le 15 de chaque mois, vers 8 h heure de Paris.

Un classement « 2026 » qui n'a pas bougé depuis juin n'est plus un classement,
et une page `/selection-du-mois/` qui promet du mensuel dans son URL sans jamais
bouger est un signal négatif — pour Google comme pour un lecteur.

**Les deux passages ne font pas la même chose :**

| Passage | Ce qu'il fait |
|---|---|
| **Le 1er** | veille secteur + **crée l'édition du mois** dans `src/data/monthly.json` (obligatoire, même si le marché est stable) |
| **Le 15** | veille secteur seulement ; il n'ajoute **pas** d'édition. Il corrige les classements si une nouveauté du milieu de mois le justifie |

**Branche de déploiement : `main`.** Le workflow
`.github/workflows/deploy.yml` ne se déclenche que sur un push vers `main`.
Un classement mis à jour ailleurs n'est jamais publié.

---

## Étape 1 — Se placer sur `main` à jour et lire l'état du catalogue

```bash
git fetch origin && git checkout main && git pull --ff-only origin main
grep -oE "slug: '[a-z0-9-]+'" src/data/soundbars.ts        # 13 produits attendus
grep -nE "slug: '|lastUpdated: '" src/data/rankings.ts     # 7 classements
head -30 src/data/monthly.json                              # dernière édition en tête
sed -n '/interface Soundbar/,/^}/p' src/data/types.ts
```

Le catalogue compte **13 produits** et **7 classements** :
`meilleures-barres-de-son-pc` (page pilier), `-gaming`, `-pas-cheres`,
`-compactes`, `-polyvalentes`, `-sans-fil`, `-avec-caisson`.

**Lis `src/data/types.ts` avant d'écrire une valeur.** Les champs et leurs
valeurs autorisées sont définis là et nulle part ailleurs. Un champ inventé
casse le build.

---

## Étape 2 — Veille des nouveautés du secteur

Cherche, sur les marques du catalogue **et leurs concurrents directs** :

- annonces constructeur : `razer.com`, `creative.com`, `logitech.com`,
  `edifier.com`, `trust.com` (salles de presse et pages produit) ;
- tests de référence publiés depuis le dernier passage : Les Numériques,
  Frandroid, Clubic, Tom's Hardware, TechRadar, RTINGS, SoundGuys ;
- calendrier salon : CES (janvier), IFA (septembre), Computex (mai).

Retiens une nouveauté **seulement si** elle est pertinente pour un usage PC de
bureau : barre de son alimentée en USB, largeur compatible avec un écran,
distance d'écoute courte. Une barre de son TV de 1,10 m n'entre pas dans ce
catalogue, même si elle est excellente.

Vérifie chaque caractéristique à la source constructeur. Croise
`scripts/faits-produits.md` : si la caractéristique n'y figure pas, revérifie-la
à la source avant de l'écrire. Rien entre les deux.

Rien de neuf ? C'est un résultat normal. Passe directement à l'étape 5 (le 1er
du mois) ou termine sans rien pousser (le 15).

---

## Étape 3 — Nouveau modèle pertinent : créer sa fiche

Ajoute l'entrée dans `src/data/soundbars.ts` en **copiant la forme d'une entrée
existante** — c'est la seule façon de ne rien oublier et de ne rien inventer.

Règles de remplissage :

- **Ne renseigne JAMAIS la note globale à la main.** Elle est calculée par
  `scoreFromBreakdown()` (`src/lib/notation.ts`) depuis le détail par critère.
  Tu renseignes uniquement :
  ```ts
  scores: {
    son: 8,                    // pondération 40 %
    basses: 7,                 // pondération 30 %
    ergonomie: 8,              // pondération 20 %
    connectique: 7,            // pondération  5 %
    rapportQualitePrix: 8,     // pondération  5 %
  },
  ```
  La grille de pondération est publiée sur `/methodologie/` : la note affichée
  et la grille publiée ne peuvent pas se contredire, à condition de ne jamais
  court-circuiter le calcul.
- **Chaque note par critère s'appuie sur une source**, pas sur une impression :
  caractéristiques constructeur et mesures publiées par des laboratoires
  indépendants. Note les URLs consultées dans le message de commit.
- `priceRange` et `priceCheckedAt` : renseigne la gamme et la date du jour.
  **Aucun prix exact.** Voir `scripts/prix-playbook.md`.
- `availability` : une valeur autorisée par `src/data/types.ts`.
- `lastUpdated` : la date du jour.
- `name` : l'orthographe **officielle du constructeur**, à la lettre près. Elle
  devra être identique partout ensuite.
- `verdict`, `summary`, `pros`, `cons`, `bestFor` : rédigés « sur le papier »,
  **sans revendiquer aucune écoute**. Formule « d'après les mesures publiées
  par X », jamais « à l'écoute, nous avons trouvé ».
- `image` / `imageAlt` : dépose un visuel dans `public/images/products/` en
  WebP. Le `imageAlt` **décrit l'image**, il ne répète pas le nom du produit.
- `tutorial` : le tutoriel d'installation propre au produit, tiré de la notice
  constructeur.

Un modèle retiré du marché **ne se supprime pas** : voir
`scripts/prix-playbook.md`, étape 5 (état « fin de commercialisation » et renvoi
vers le remplaçant).

---

## Étape 4 — Réordonner les classements concernés

Dans `src/data/rankings.ts`, pour chaque classement où la nouveauté a sa place :

1. **Réordonne `items` seulement si la grille le justifie** — c'est-à-dire si la
   note calculée depuis `scores` place réellement le produit à ce rang, dans
   l'axe du classement. Un classement « pas chères » se trie d'abord sur la
   gamme de prix, un classement « avec caisson » exclut les modèles sans
   caisson : la note ne suffit pas à trancher seule.
2. Rédige un `why` **propre à ce classement** — pas un copier-coller du
   `verdict` du produit. Le `why` répond à « pourquoi ce rang, dans cette
   liste ».
3. Mets à jour le `lastUpdated` du classement modifié, **et de lui seul**. Ne
   touche pas au `lastUpdated` des six autres : une date fraîche sur un
   classement qui n'a pas bougé est un faux signal.
4. Vérifie l'`intro` et la `faq` du classement : si le premier du classement a
   changé, l'intro qui le nomme est devenue fausse. C'est l'erreur la plus
   fréquente de cette étape.
5. Si le produit entre dans la **page pilier**
   `/classements/meilleures-barres-de-son-pc/`, relis-la en entier : c'est la
   page argent du site.

---

## Étape 5 — Rafraîchir `/selection-du-mois/` (obligatoire le 1er du mois)

Ajoute une nouvelle édition **EN TÊTE** du tableau de `src/data/monthly.json`
(le fichier est un tableau JSON ; `src/data/monthly.ts` ne fait que l'importer
et l'exposer, la plus récente en premier).

```json
{
  "id": "2026-10",
  "label": "Octobre 2026",
  "publishedAt": "2026-10-01",
  "status": "stable",
  "headline": "Phrase claire et citable, qui dit l'état du marché en une ligne.",
  "intro": "Deux à quatre phrases de contexte : ce qui a changé depuis le mois dernier, ce qui est attendu.",
  "picks": [
    { "soundbar": "razer-leviathan-v2-pro", "note": "Pourquoi ce modèle ce mois-ci." },
    { "soundbar": "creative-sound-blaster-katana-v2", "note": "…" },
    { "soundbar": "creative-stage-v2", "note": "…" }
  ],
  "newReleases": [],
  "upcoming": []
}
```

- `status` : `'nouveautes'` (entrées ou sorties constatées), `'stable'` (rien de
  neuf), `'a-venir'` (sortie attendue le mois suivant).
- `picks` : **3 à 5 modèles**, avec des `soundbar` qui sont des **slugs
  existants** de `src/data/soundbars.ts` (les slugs inconnus sont ignorés
  silencieusement — donc invisibles à la relecture, et c'est un piège).
- **Règle de transparence** : dis clairement s'il y a de nouvelles entrées, des
  sorties, si rien n'a changé, ou si une sortie est attendue le mois suivant.
  Un mois stable se dit ; il ne se déguise pas en nouveauté.
- `newReleases` et `upcoming` : listes vides plutôt qu'un remplissage. Si elles
  sont vides, l'`intro` doit le dire explicitement.
- Un `id` par mois, jamais deux. Si l'édition du mois existe déjà (relance,
  passage du 15), **corrige-la, ne la duplique pas.**

---

## Étape 6 — Saisonnalité (Q4)

À partir du **15 octobre** et jusqu'au 31 décembre, la page saisonnière
(Black Friday / Noël) se met à jour à chaque passage.

**Elle vit sur une URL stable, réutilisée chaque année.** Jamais d'URL avec le
millésime dedans : une URL `…-2026` repart de zéro en autorité chaque année,
alors qu'une URL stable capitalise. Le millésime va dans le `title`, dans
l'intro et dans `lastUpdated` — pas dans le slug.

Si cette page n'existe pas encore, ne l'improvise pas au milieu d'une exécution
de routine : ouvre une issue (étape 8) pour qu'elle soit créée proprement, avec
son URL arbitrée une fois pour toutes.

---

## Étape 7 — Publier sur `main`, uniquement si quelque chose a changé

```bash
npm run build      # si le build échoue, corrige — ne publie pas
npm run check      # 0 erreur attendue
git diff --stat

if git diff --quiet; then
  echo "Aucune évolution du marché ce passage. Fin normale de la routine."
else
  git add src/data/ public/images/products/
  git commit -m "Classements : mise à jour du $(date +%F)"
  git push origin HEAD:main
  git log --oneline -1 origin/main
fi
```

- **Pas de commit vide.** Un passage sans nouveauté est un succès silencieux —
  sauf le 1er du mois, où l'édition de `/selection-du-mois/` est due : si rien
  n'a changé, l'édition se publie tout de même avec `status: 'stable'`.
- **NE crée PAS de branche de travail. NE crée PAS de Pull Request. NE demande
  PAS de validation** : l'autorisation de pousser sur `main` est permanente.
- **Un seul contenu par exécution** : une édition mensuelle, ou une fiche
  produit et les classements qu'elle affecte. Pas les deux chantiers plus une
  refonte de classement dans le même passage.

---

## Étape 8 — Si quelque chose échoue, le dire

```bash
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R4 Classements — passage incomplet du $(date +%F)" \
  --body "Ce qui n'a pas pu être fait, pourquoi (source inaccessible, champ manquant dans le type, arbitrage éditorial nécessaire), et les URLs consultées."
```

Ouvre une issue en particulier quand : un arbitrage de classement demande un
jugement que tu ne peux pas trancher sur pièces, un champ manque dans
`src/data/types.ts`, ou la page saisonnière n'existe pas encore. Une routine
qui échoue en silence est pire qu'une routine absente.

---

## Garde-fous

Ces règles ne se négocient pas. Elles valent pour cette routine comme pour les
trois autres (`veille-playbook.md`, `prix-playbook.md`, `liens-playbook.md`).

1. **Aucune expérience physique revendiquée.** La routine n'a pas écouté ces
   barres de son. Formule « d'après les mesures publiées par X » ou « sur le
   papier », **jamais** « à l'écoute, nous avons trouvé », « nous avons testé »,
   « testé pendant X jours ». **C'est la règle la plus importante** — et c'est
   dans cette routine qu'elle est le plus tentante, puisqu'elle crée des fiches
   produit et des classements. La position défendable du site est : comparatif
   éditorial fondé sur les caractéristiques constructeur et les mesures publiées
   par des laboratoires indépendants, selon la grille de notation publique de
   `/methodologie/`.
2. **Aucune preuve ne se fabrique.** Pas d'avis client inventé, pas de
   témoignage de remplissage, pas de « recommandé par » sans source vérifiable.
3. **Aucun prix ni aucune note écrits dans une prose.** Toujours rendus depuis
   la donnée (`priceRange`, `priceCheckedAt`, `scores` → `scoreFromBreakdown`),
   toujours datés. Une note globale ne s'écrit jamais à la main.
4. **`rel="sponsored nofollow"` sur tout lien sortant marchand**, passage
   obligatoire par `/go/<slug>/`, et `Disallow: /go/` maintenu dans
   `public/robots.txt`.
5. **Ne jamais scraper `amazon.fr`.** Aucune requête HTTP vers les pages Amazon,
   sous aucun prétexte. Les caractéristiques viennent du constructeur, la
   disponibilité vient de R2.
6. **Ne jamais supprimer une fiche produit** dont le modèle est retiré du
   marché : la passer en « fin de commercialisation » avec un renvoi vers le
   remplaçant. Sortir un produit d'un classement, oui ; supprimer sa page, non.
7. **Orthographe des noms d'entités strictement identique partout.** « Sound
   Blaster Katana V2 » et « SoundBlaster Katana v2 » comptent pour deux produits
   différents, pour le site comme pour un moteur. Normalise le nom **avant** de
   construire une page qui regroupe plusieurs produits.
8. **Une routine qui échoue le dit.** Issue GitHub (étape 8), jamais d'échec
   silencieux.
9. **Zéro Pull Request, zéro branche de travail, zéro demande de validation.**
   Autorisation permanente de pousser sur `main`. Un classement resté sur une
   branche = échec de la routine.
10. **Un seul contenu publié par exécution.**
11. **Aucun commit vide** — hors édition mensuelle due le 1er du mois, qui se
    publie même quand le marché est stable.
