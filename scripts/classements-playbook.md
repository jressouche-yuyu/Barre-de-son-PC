# Playbook — R3 Classements et sélection du mois

**Routine R3 — Classements & sélection du mois — cadence bimensuelle — cron `23 6 1,15 * *` (UTC).**

Deux missions, dans cet ordre d'importance :

| Passage | Ce qu'il fait |
|---|---|
| **Le 1er** | **l'édition du mois**, et elle seule : un objet ajouté en tête de `src/data/monthly.json` (mission 1, due chaque mois). La reprise des classements attend le 15 |
| **Le 15** | **la reprise des classements**, et elle seule. Il n'ajoute **pas** d'édition. Il peut corriger l'édition courante (voir étape 3.4) |

**Branche de déploiement : `main`.** `.github/workflows/deploy.yml` ne se déclenche
que sur un push vers `main`. Ni branche de travail, ni Pull Request, ni demande
de validation. Un classement mis à jour ailleurs n'est pas publié.

**Un seul chantier par exécution** (garde-fou 10) : **le 1er, l'édition
mensuelle ; le 15, la reprise des classements.** Jamais les deux dans le même
passage, ni l'un des deux plus la page saisonnière.

### Un passage hors calendrier ne publie RIEN

Si la date du jour n'est ni le 1er ni le 15 — déclenchement manuel, cron rattrapé
en retard, test de mise en service — tu es en **passage de vérification** :

1. Fais l'étape 1 en entier (se placer sur `main`, relever l'état réel).
2. Lance `npm ci && npm run check && npm run build && node scripts/verifie-rendu.mjs`.
3. Rends compte de ce que tu ferais au prochain passage du 1er et du 15.
4. **N'écris aucun fichier, ne commit pas, ne pousse pas.** Termine là.

C'est volontaire : la valeur d'un passage hors calendrier est de prouver que la
chaîne fonctionne — clonage, lecture du playbook, build, contrôles — pas de
publier une édition à une date qui ne correspond à rien. Une édition « octobre »
créée le 8 septembre serait une fausse date, et les archives ne se réécrivent pas.

---

## Étape 1 — Se placer sur `main` à jour et lire l'état réel

```bash
cd "<racine du dépôt>"
git fetch origin && git checkout main && git pull --ff-only origin main
gh --version                                    # si gh ne répond pas, voir étape 9
head -40 src/data/monthly.json                  # l'édition en tête = la plus récente
grep -nE "^    slug: '|^    lastUpdated: '" src/data/rankings.ts
sed -n '/interface Ranking/,/^}/p' src/data/types.ts
sed -n '/interface MonthlyEdition/,/^}/p' src/data/monthly.ts
```

État mesuré au 07/09/2026, à ne pas remettre en cause : **13 produits**,
**7 classements**, **2 éditions** (`2026-09`, `2026-06`).

Les 7 classements (`src/data/rankings.ts`) :
`meilleures-barres-de-son-pc` (**page pilier**), `-gaming`, `-pas-cheres`,
`-compactes`, `-polyvalentes`, `-sans-fil`, `-avec-caisson`.

Relève la note calculée et la disponibilité de chaque produit avant de trancher
quoi que ce soit — c'est la seule base objective :

```bash
grep -nE "  slug: '|    son: |    basses: |    ergonomie: |    connectique: |    rapportQualitePrix: |  availability: '" src/data/soundbars.ts
```

`soundbars.ts` est du TypeScript : Node nu ne l'importe pas. Lis donc les
`scores` de chaque produit et applique la grille publiée sur `/methodologie/` :
son 40 %, basses 30 %, ergonomie 20 %, connectique 5 %, rapport qualité-prix 5 %.
**Tu ne saisis jamais la note globale** — elle est calculée par
`scoreFromBreakdown()` (`src/lib/notation.ts`). Tu la *lis* pour ordonner.

---

## Étape 2 — Recueillir la matière, sans expérience physique

Sources admises : salles de presse et pages produit des constructeurs, tests de
laboratoires et rédactions (Les Numériques, Frandroid, Clubic, Tom's Hardware,
TechRadar, RTINGS, SoundGuys), calendrier salon (CES janvier, Computex mai,
IFA septembre).

Le périmètre est élargi : barres de son en général et systèmes de son domestiques
ou professionnels (Sonos, Bose, JBL, Sony, Samsung, LG, Devialet, Focal, Denon,
Yamaha, Genelec, Sennheiser…). **Mais un classement ou une édition ne retient un
produit que s'il est utilisable sur un bureau** — alimentation USB, largeur
compatible avec un écran, écoute de proche champ. Une barre TV de 1,10 m n'entre
pas dans le catalogue, quelle que soit sa qualité.

Croise chaque caractéristique avec `scripts/faits-produits.md`. Si elle n'y
figure pas, revérifie-la à la source constructeur avant de l'écrire. Jamais
d'à-peu-près entre les deux. **Ne jamais scraper `amazon.fr`.**

Rien de neuf ? C'est le cas le plus fréquent et c'est un résultat normal :
le 1er du mois, va directement à l'étape 3 avec `status: "stable"` ; le 15,
termine sans rien pousser.

---

## Étape 3 — Mission 1 : l'édition du mois (le 1er, obligatoire)

### 3.1 La forme exacte

Ajoute un objet **EN TÊTE** du tableau de `src/data/monthly.json`. Champs de
`MonthlyEdition` (`src/data/monthly.ts`) — **ces neuf champs, pas un de plus** :

```json
{
  "id": "2026-10",
  "label": "Octobre 2026",
  "publishedAt": "2026-10-01",
  "status": "stable",
  "headline": "Une phrase citable qui dit l'état du marché, sans emphase.",
  "intro": "Deux à cinq phrases : ce qui a été revérifié, ce qui a changé, ce qui n'a pas changé, ce qui est attendu.",
  "picks": [
    { "soundbar": "creative-sound-blaster-katana-v2", "note": "Pourquoi ce modèle ce mois-ci, dans cette édition." },
    { "soundbar": "razer-leviathan-v2", "note": "…" },
    { "soundbar": "creative-sound-blaster-katana-v2x", "note": "…" }
  ],
  "newReleases": [],
  "upcoming": ["Aucune sortie confirmée pour novembre 2026 à ce jour."]
}
```

- `id` : **`AAAA-MM`, un seul par mois**. Il sert de slug d'archive
  `/selection-du-mois/<AAAA-MM>/`. Un `id` mal formé et la page d'archive
  manque : `verifie-rendu.mjs` le refuse, au contrôle « Les éditions de la
  sélection du mois ont leur page d'archive ».
- `publishedAt` : la **date réelle du passage**. Le commentaire de `monthly.ts`
  qui parle du « 2 du mois » est un reste de l'ancienne conception — le cron
  réveille la routine le 1er. La date compte : le contrôle d'immuabilité compare
  la date de modification servie à `publishedAt`.
- `newReleases` / `upcoming` : tableaux de **chaînes de caractères**. Vides
  plutôt que remplis pour faire nombre — et si `newReleases` est vide,
  l'`intro` doit le dire en clair.
- `picks` : 3 à 5 entrées `{ soundbar, note }`, `soundbar` étant un **slug
  existant** de `src/data/soundbars.ts`. Un slug inconnu est **ignoré
  silencieusement** : rien ne casse, l'entrée disparaît de la page. Vérifie-les
  un par un.

Modèle rédactionnel : l'édition **`2026-09`** de `monthly.json`. C'est le ton à
tenir — factuel, daté, sourcé, qui dit ce qui manque.

### 3.2 Les trois valeurs de `status`, et le piège

`MarketStatus = 'nouveautes' | 'stable' | 'a-venir'`. Rien d'autre.

| Valeur | Quand | Libellé affiché |
|---|---|---|
| `nouveautes` | une entrée **ou** une sortie constatée dans la sélection | « Nouveautés ce mois-ci » |
| `stable` | rien n'a changé depuis l'édition précédente | « Marché stable » |
| `a-venir` | une sortie est annoncée pour le ou les mois suivants | « Sortie à venir » |

⚠ **`monthly.json` est importé puis converti par un simple `as MonthlyEdition[]`.
Le build ne vérifie donc RIEN.** Un `status` mal orthographié — `"nouveautés"`,
`"nouveaute"`, `"stables"` — passe `npm run build` et `npm run check` sans un
mot, puis retombe sur la branche `default` de `statusLabel()` : la page annonce
« Marché stable » un mois où deux modèles sont sortis. Relis la valeur écrite
caractère par caractère : `nouveautes`, sans accent, au pluriel.

### 3.3 Le mois où il ne s'est rien passé — le cas le plus fréquent

Le créneau produit environ quatre événements exploitables par an. Onze mois sur
douze, l'édition est un `stable`. **Un `stable` honnêtement rédigé vaut mieux
qu'une fausse nouveauté**, et une fausse nouveauté est un mensonge éditorial que
la routine n'a pas le droit de produire.

Ce qu'un mois stable contient, et qui suffit à faire une édition utile :

1. **Ce qui a été revérifié** — « les treize fiches ont été revérifiées à la
   source : gammes de prix, disponibilité, caractéristiques constructeur ».
   C'est un travail réel, il se dit.
2. **Ce qui n'a pas changé, nommément** — quel modèle reste premier et pourquoi
   il le reste. Pas « nos références restent les mêmes » en l'air.
3. **Ce qui a bougé sans être une nouveauté** — une disponibilité passée en
   `stock-limite`, une gamme de prix qui a glissé, une caractéristique corrigée.
4. **Ce qui est surveillé, daté** — « aucune sortie confirmée pour novembre à ce
   jour », le prochain salon, la marque active en fin d'année.

Interdits dans un mois stable : requalifier un vieux modèle en « nouveauté »,
présenter un changement de gamme de prix comme une sortie, inventer une rumeur
de lancement, écrire « à l'écoute » ou « nous avons testé » quoi que ce soit.

### 3.4 Une édition publiée ne se réécrit jamais

Chaque édition a son URL permanente et **l'archive est gelée**. Une archive
retouchée n'est plus une archive : `verifie-rendu.mjs` refuse toute édition
autre que la plus récente dont la date de modification servie dépasse son
`publishedAt`.

Conséquence pratique, à respecter à la lettre :

- Corriger une **édition antérieure** : **interdit**. Une erreur constatée dans
  une édition passée se corrige dans l'édition **suivante**, en le disant.
- Corriger l'**édition courante** (celle en tête) le 15 du même mois : toléré,
  parce qu'elle n'est pas encore une archive. Dès qu'une édition plus récente
  est ajoutée, elle est gelée définitivement.
- **Jamais deux `id` identiques.** Si l'édition du mois existe déjà (relance de
  la routine), tu es dans le cas ci-dessus : corrige, ne duplique pas.
- Les `picks` ne contiennent **que des produits `availability: 'disponible'`.**
  C'est une recommandation d'achat, pas un comparatif : un `stock-limite` ou un
  `fin-de-commercialisation` n'y a pas sa place. Si un pick du mois dernier est
  sorti, l'édition est un `nouveautes` et le dit.

---

## Étape 4 — Mission 2 : les classements

L'ordre des `items` de `src/data/rankings.ts` est saisi à la main. Depuis que la
note est calculée, l'ordre saisi peut contredire la note publiée sur la fiche —
et le lecteur voit la contradiction.

### 4.1 Sur quoi réordonner

**Critère objectif par défaut : la note calculée, en ordre décroissant**, restreinte
aux produits éligibles au classement. C'est le seul critère que le site publie et
qu'il peut défendre (`/methodologie/`). Toute exception se justifie par l'axe du
classement, jamais par une préférence.

Écarts légitimes, par classement thématique :

- **`-pas-cheres`** : filtre d'abord sur la gamme de prix (`price` →
  `priceBand()`), puis ordonne par note **à l'intérieur** du filtre. Un modèle
  mieux noté mais deux gammes au-dessus n'a rien à y faire.
- **`-compactes`** : l'axe est `dimensionsCm`. Un modèle mieux noté mais plus
  large peut légitimement finir dernier — c'est le cas de
  `creative-sound-blaster-katana-v2x`, meilleure note de sa liste et dernière
  par encombrement. Le `why` doit alors **dire** que le rang est un arbitrage de
  taille.
- **`-avec-caisson`** : `hasSubwoofer: true` est une condition d'entrée, pas un
  critère de rang. Une fois filtré, on ordonne par note.
- **`-sans-fil`** : `connectivity` conditionne l'entrée ; l'autonomie et le
  Bluetooth peuvent départager deux notes proches, mais **pas inverser** un
  écart net.
- **`-gaming`** : latence, son spatial et RGB peuvent départager, dans la limite
  de deux dixièmes de note. Au-delà, la note tranche.

⚠ **On ordonne sur la note AFFICHÉE, jamais sur la somme pondérée brute.**
`scoreFromBreakdown()` arrondit au dixième, et c'est ce dixième que le lecteur
voit sur la fiche comme sur la carte. **Deux produits qui affichent la même note
sont à égalité : l'ordre de saisie tranche, on n'y touche pas.** Une
contradiction n'existe que si le lecteur peut la voir.

**Un seul classement contredit aujourd'hui la note affichée** — à corriger au
prochain passage du 15 :

- **`-sans-fil`** : les trois premiers sont rangés en note **croissante**
  (7,2 puis 7,5 puis 7,7 affichés). Aucun argument d'axe ne justifie
  l'inversion : réordonne en décroissant.

Contre-exemple, à ne **pas** « corriger » : dans **`-gaming`**,
`razer-leviathan-v2` (somme 8,55) précède
`creative-sound-blaster-katana-v2` (somme 8,63) — mais les deux affichent **8,6**
sur le site. Le lecteur voit 8,6 puis 8,6 : il n'y a rien à voir, donc rien à
réordonner. Ne va pas chercher une précision que le site ne publie pas.

### 4.2 Un produit indisponible descend, il ne disparaît pas

**Le tri est désormais structurel, R3 n'a plus à le faire à la main.**
`resolveRankingItems()` (`src/data/rankings.ts`) fait descendre **au rendu** tout
produit dont `availability` n'est pas `'disponible'` — dans le corps de la page
comme dans le schéma `ItemList`. Le contrôle « Aucun classement ne place un
produit indisponible avant un disponible » le vérifie sur le HTML servi.

Ce qui reste, et que rien n'automatise : **réécrire le `why`.** Descendu en
dernière position, un `why` inchangé continue de **vendre** un produit qu'on ne
peut plus acheter. C'est un travail **éditorial**, pas structurel — et c'est la
seule raison pour laquelle R3 rouvre un classement après un basculement de
disponibilité. Un `why` d'indisponible **dit** pourquoi le produit est encore là.

Le retirer laisserait sa fiche orpheline : plus aucun lien interne, une page qui
perd son référencement sans être redirigée. Formulations déjà en place, à imiter :

```ts
{ soundbar: 'creative-stage-v2', why: 'Creative ne la commercialise plus : conservée ici pour la comparaison, plus comme recommandation d\'achat.' },
{ soundbar: 'razer-leviathan-v2-pro', why: 'Techniquement la plus impressionnante du marché PC, mais Razer ne la distribue plus en France : à ne considérer qu\'en stock résiduel.' },
```

⚠ **`soundbarsByScore()` n'est PAS la référence d'ordre des classements.**
Vérifié (`grep -rn "soundbarsByScore" src/`) : **aucune page de classement ne
l'appelle**. Elle sert à `/barres-de-son/`, `/comparateur/`, `/marques/[brand]/`
et `llms.txt`. L'ordre d'un classement vient **uniquement de la saisie manuelle
de `src/data/rankings.ts`**, puis du tri des indisponibles appliqué au rendu par
`resolveRankingItems()`. Ne cherche pas ailleurs une autorité qui n'existe pas.

Une **recommandation** (accueil, sélection du mois, `picks` d'un guide) utilise
`availableSoundbarsByScore()` et ne contient donc aucun indisponible.

### 4.3 Ce qu'il faut relire à chaque réordonnancement

1. Le `why` est **propre à ce classement** — pas un copier-coller du `verdict`
   du produit. Il répond à « pourquoi ce rang, dans cette liste ».
2. L'`intro` et la `faq` du classement : si le premier a changé, une intro qui
   le nomme est devenue fausse. **C'est l'erreur la plus fréquente de l'étape.**
3. La `metaDescription` (≤ 160 caractères) si elle nomme un produit.
4. La **page pilier** `meilleures-barres-de-son-pc` se relit en entier dès
   qu'on y touche : c'est la page la plus importante du site.

### 4.4 `lastUpdated` : ne jamais le toucher à vide

**Un `lastUpdated` ne bouge que si le fond a changé** — un ordre modifié, un
`why` réécrit, un produit entré ou sorti. Corriger une virgule n'est pas un
changement de fond.

Deux raisons, la seconde étant la vraie : une date fraîche sur un classement
identique est un faux signal de fraîcheur, et surtout **ce champ alimente la
date de publication de l'avis dans les données structurées**. Le déplacer sans
motif fait déclarer aux moteurs un avis réévalué qui ne l'a pas été.

Mets à jour le `lastUpdated` **du seul classement modifié**. Jamais les sept en
bloc.

---

## Étape 5 — La page saisonnière Q4

Du **15 octobre au 31 décembre**, la page saisonnière (Black Friday / Noël) se
rafraîchit à chaque passage.

**Elle vit sur une URL stable, réutilisée chaque année.** Jamais d'URL portant le
millésime : une adresse `…-2026` repart de zéro en autorité chaque année, une
adresse stable capitalise année après année. Le millésime va dans le `title`,
dans l'intro et dans `lastUpdated` — **calculé** par `annee()`
(`src/lib/millesime.ts`), jamais écrit en dur. `verifie-rendu.mjs` refuse une
année révolue trouvée dans une balise `<title>`, au contrôle « Aucune balise
title n'annonce une année antérieure à <l'année courante> ».

**Cette page n'existe pas encore dans le dépôt** (vérifié : aucun fichier de
`src/pages`, `src/data` ni `src/content` ne la porte). Son support naturel est
un guide de `src/data/guides.ts`, avec un `picks` alimenté depuis
`availableSoundbarsByScore()`. **Ne l'improvise pas au milieu d'un passage de
routine** : ouvre une issue (étape 9) pour que son slug soit arbitré une fois
pour toutes, puis entretiens-la aux passages suivants.

Contenu admis : gammes de prix datées, disponibilités relevées, arguments
d'usage. **Aucun montant en euros, aucune promotion chiffrée, aucun compte à
rebours.** Pas de « meilleure offre » sans donnée derrière.

---

## Étape 6 — Contrôler avant de publier

```bash
npm run build          # doit passer
npm run check          # 0 erreur attendue
node scripts/verifie-rendu.mjs   # APRÈS le build : 17 contrôles sur le HTML servi
git diff --stat
```

`verifie-rendu.mjs` n'est **pas optionnel pour cette routine** : c'est lui qui
porte l'existence des pages d'archive, le canonique de l'édition courante,
l'immuabilité des archives et l'absence de millésime périmé. Cette routine édite
`src/data/*.ts` et `monthly.json` : elle est exactement celle qu'il protège.

⚠ **Les numéros du rapport sont positionnels** : ils se décalent dès qu'un
contrôle est ajouté au milieu du fichier, et plusieurs sections en émettent
plusieurs lignes. **Ne cite jamais « le contrôle 13 »** — ni ici, ni dans une
issue, ni dans un compte rendu. Cite le **libellé** du contrôle : c'est le seul
repère stable. L'en-tête de `scripts/verifie-rendu.mjs` le dit aussi.

Relis à l'œil ce que les scripts ne voient pas : la valeur de `status`, les slugs
des `picks`, la cohérence intro / premier du classement.

---

## Étape 7 — Sortie de boucle : trois tentatives, puis abandon propre

Un contrôle insatisfaisable ne doit pas consommer la session entière.

- **Trois tentatives de correction au maximum** pour faire passer
  `npm run build`, `npm run check` et `verifie-rendu.mjs`.
- À la troisième tentative infructueuse : **abandon propre**. Aucun commit,
  aucun push. `git checkout -- .` pour ne rien laisser de bancal, puis une issue
  (étape 9) qui nomme le contrôle en échec et ce qui a été tenté.
- Un abandon documenté est un fonctionnement normal. Une session qui tourne en
  rond jusqu'à épuisement est une panne silencieuse.

---

## Étape 8 — Publier sur `main`

```bash
# 1. Y a-t-il quelque chose à publier ? --porcelain voit les fichiers NON SUIVIS,
#    ce que `git diff --quiet` ignore : une image ajoutée passerait pour « rien ».
if [ -z "$(git status --porcelain)" ]; then
  echo "Aucune évolution ce passage. Fin normale de la routine."
  exit 0
fi

# Chemins explicites, jamais `git add -A` ni un répertoire entier : `src/data/`
# abrite aussi `soundbars.ts` (territoire de R2), `src/content/` celui de R1 et
# R4, `public/images/` celui de R1 et R2. R3 ne modifie que ces deux fichiers.
git add src/data/monthly.json src/data/rankings.ts
git commit -m "R3 : sélection du mois <AAAA-MM> et classements du $(date +%F)"

# 2. Resynchroniser AVANT de pousser : une autre routine a pu pousser le même jour.
git pull --rebase origin main

# 3. Pousser, puis VÉRIFIER que le push a eu lieu. Une ligne d'apparence normale
#    ne prouve rien : on compare les deux références.
git push origin HEAD:main
git fetch origin
if [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ]; then
  echo "Push confirmé : HEAD == origin/main"
else
  echo "PUSH NON CONFIRMÉ — ouvrir une issue (étape 9), ne pas supprimer le clone"
fi
```

**Conflit de fusion sur `monthly.json` — c'est structurel**, pas accidentel :
chaque routine ajoute son entrée en tête du même tableau. Résolution :
**garder les deux entrées**, la plus récente en premier, tableau JSON valide.
Jamais `git rebase --skip` : ce serait jeter le travail de l'autre routine.
Même règle si le rebase touche `scripts/news-ledger.json` (fichier de R1) :
on garde les deux listes d'entrées sous `published`. Un journal illisible est
traité comme vide **en silence** — un JSON cassé rouvre la porte aux doublons
sans le dire.

Après résolution, valide le JSON. **Pas de `--input-type=module`** : dans un
module ES, `require` n'existe pas et la commande échoue **systématiquement** —
au pire moment, juste après un conflit de fusion. La variante qui fonctionne :

```bash
node -e "JSON.parse(require('fs').readFileSync('src/data/monthly.json','utf8')); console.log('monthly.json valide')"
```

Puis reprends l'étape 6 depuis le début.

**Pas de commit vide.** Un passage sans matière ne pousse rien — sauf le 1er du
mois, où l'édition mensuelle est due et se publie même en `status: "stable"`.

---

## Étape 9 — Si quelque chose échoue, le dire

```bash
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R3 Classements — passage incomplet du $(date +%F)" \
  --body "Ce qui n'a pas pu être fait, pourquoi (contrôle en échec, source inaccessible, arbitrage éditorial impossible sur pièces, page saisonnière absente), les tentatives faites et les URLs consultées."
```

Vérifie que `gh` répond (`gh --version`, étape 1) **avant** de compter sur ce
canal. S'il ne répond pas, écris le compte rendu complet dans la sortie de la
session et signale explicitement que l'issue n'a pas pu être créée.

Ouvre une issue en particulier quand : un contrôle reste rouge après trois
tentatives, le push n'est pas confirmé, un arbitrage de classement demande un
jugement que tu ne peux pas rendre sur pièces, ou la page saisonnière Q4 n'existe
pas encore.

---

## Garde-fous

Ces onze règles ne se négocient pas.

1. **Aucune expérience physique revendiquée.** La routine n'a pas écouté ces
   barres de son. « d'après les caractéristiques constructeur », « sur le
   papier », « d'après les mesures publiées par X ». **Jamais** « nous avons
   testé », « à l'écoute, nous », « après deux semaines d'usage ». **C'est la
   règle la plus importante**, et c'est ici qu'elle est la plus tentante :
   un classement et une sélection du mois donnent envie d'écrire une écoute qui
   n'a pas eu lieu. La position défendable du site est un comparatif éditorial
   fondé sur les caractéristiques constructeur et les mesures publiées, appliquées
   à la grille publique de `/methodologie/`.
2. **Aucune preuve fabriquée** : ni avis client, ni témoignage, ni « recommandé
   par » sans source vérifiable, ni sortie inventée pour animer un mois stable.
3. **Aucun prix ni aucune note dans une prose.** Toujours rendus depuis la
   donnée (`price` → `priceBand()`, daté par `priceCheckedAt` ; `scores` →
   `scoreFromBreakdown()`). **Le champ `priceRange` n'existe pas** : l'écrire ne
   sert à rien. Une note globale ne s'écrit jamais à la main.
4. **`rel="sponsored nofollow"` sur tout lien marchand**, passage obligatoire par
   `/go/<slug>/`, `Disallow: /go/` maintenu dans `public/robots.txt`.
5. **Ne jamais scraper `amazon.fr`**, sous aucun prétexte. Les caractéristiques
   viennent du constructeur, la disponibilité de R2.
6. **Ne jamais supprimer la page d'un modèle retiré.** `availability` +
   `alternative` (une alternative **éditoriale** choisie dans notre catalogue,
   jamais un « successeur » que la marque n'a pas annoncé). Le sortir d'un
   classement : non — il descend en dernier avec un `why` explicite.
7. **Orthographe des entités strictement identique partout**
   (`scripts/faits-produits.md`). « Sound Blaster Katana V2 » et « SoundBlaster
   Katana v2 » comptent pour deux produits, pour le site comme pour un moteur.
8. **Une routine qui échoue le dit** : issue GitHub (étape 9), jamais d'échec
   silencieux. Un push non confirmé compte comme un échec.
9. **Zéro Pull Request, zéro branche, zéro demande de validation.** Autorisation
   permanente de pousser sur `main`. Un classement resté sur une branche est un
   classement non publié.
10. **Un seul chantier publié par exécution**, et **aucun commit vide**.
11. **Ne jamais écrire une année en dur** (`annee()` de `src/lib/millesime.ts`)
    **ni un champ absent du schéma.** Les champs d'une édition sont les neuf de
    `MonthlyEdition` ; ceux d'un classement, ceux de `Ranking` dans
    `src/data/types.ts`. Un champ inventé passe le build sans erreur et ne sert
    à rien — c'est un garde-fou imaginaire, pire que pas de garde-fou.
