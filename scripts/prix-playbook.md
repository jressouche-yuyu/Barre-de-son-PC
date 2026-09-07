# Playbook — Contrôle de gamme et de disponibilité

**Routine R2 — Prix et disponibilité.** Cadence : **hebdomadaire**,
`0 5 * * 1` (UTC) — lundi vers 7 h heure de Paris.

**C'est la routine la plus importante des quatre et la première à mettre en
service.** Sur un site d'affiliation, ce n'est pas le blog qui protège le
chiffre d'affaires : c'est la fraîcheur de la donnée commerciale. Un produit
retiré du marché mais toujours présenté comme disponible fait fuir l'acheteur
et rend le `Product` schema faux.

**Branche de déploiement : `main`.** Le workflow
`.github/workflows/deploy.yml` ne se déclenche que sur un push vers `main`.
Une mise à jour de données poussée ailleurs n'est jamais publiée.

---

## Conception retenue : n°1 — aucun prix chiffré affiché

Décision prise après relevé du dépôt, et elle n'est pas provisoire par
paresse : elle est imposée par deux faits mesurés.

| Fait relevé dans le dépôt | Conséquence |
|---|---|
| **Aucun ASIN Amazon** n'existe dans `src/data/soundbars.ts` (`grep -c amazonAsin` → 0) | il n'y a rien pour interroger `GetItems`, produit par produit |
| Les liens d'affiliation sont des **liens de recherche** (`/s?k=<nom>&tag=…`, voir `src/lib/affiliate.ts`) | pas de fiche produit ciblée, donc pas d'offre unique à relever |
| **PA-API n'est pas accessible** : elle exige un compte Partenaires validé par des ventes qualifiantes, ce que `src/lib/affiliate.ts` documente déjà comme non acquis | aucune donnée de prix ne peut être obtenue légalement |
| Scraper `amazon.fr` est **interdit** par les conditions du programme, et détecté | l'alternative technique n'existe pas |

Le site affiche donc, pour chaque produit :

- une **fourchette de gamme** (`priceRange`) — pas un prix exact ;
- un **CTA « Voir le prix sur Amazon »** qui passe par `/go/<slug>/` ;
- la **date de relevé** (`priceCheckedAt`) affichée à côté de la fourchette ;
- un **état de commercialisation** (`availability`).

### Pourquoi hebdomadaire et non quotidien

La règle des 24 heures du contrat Amazon Partenaires porte sur **les
informations de prix et de disponibilité obtenues via PA-API**. En conception
n°1, **aucune donnée PA-API n'est affichée** : la fourchette de gamme est une
appréciation éditoriale construite à partir des fiches constructeur et des tests
de référence, pas un relevé d'offre Amazon. La règle des 24 heures **ne
s'applique donc pas**, et une cadence hebdomadaire est suffisante et conforme.

Un relevé quotidien n'aurait rien à relever : une gamme de prix ne bouge pas
d'un jour à l'autre, une fin de commercialisation se constate en quelques jours.
La cadence redeviendra quotidienne le jour où PA-API sera branchée — voir la
section dédiée en fin de playbook.

---

## Étape 1 — Se placer sur `main` à jour

```bash
git status --short
git fetch origin && git checkout main && git pull --ff-only origin main
```

Un dépôt sale ou en retard produit des conflits en fin de routine. Règle
l'incident avant de commencer, ou ouvre une issue et arrête-toi.

---

## Étape 2 — Lire la donnée et le type

```bash
grep -nE "slug: '|priceRange|priceCheckedAt|availability|lastUpdated" src/data/soundbars.ts
sed -n '/interface Soundbar/,/^}/p' src/data/types.ts
```

**Lis `src/data/types.ts` avant d'écrire une valeur.** Les valeurs autorisées de
`availability` et la forme de `priceRange` sont définies là et **nulle part
ailleurs** : ne les invente pas, ne les élargis pas. Si une valeur te manque
pour décrire une situation réelle, c'est le type qu'il faut faire évoluer
explicitement — pas la donnée qu'il faut tordre.

Le catalogue compte **13 produits** :

| Slug | Marque | Source constructeur |
|---|---|---|
| `razer-leviathan-v2-pro` | Razer | `razer.com` |
| `razer-leviathan-v2` | Razer | `razer.com` |
| `razer-leviathan-v2-x` | Razer | `razer.com` |
| `creative-sound-blaster-katana-v2` | Creative | `creative.com` |
| `creative-sound-blaster-katana-v2x` | Creative | `creative.com` |
| `creative-sound-blaster-gs3` | Creative | `creative.com` |
| `creative-stage-v2` | Creative | `creative.com` |
| `creative-stage-air-v2` | Creative | `creative.com` |
| `creative-stage-360` | Creative | `creative.com` |
| `logitech-z407` | Logitech | `logitech.com` |
| `edifier-mg300` | Edifier | `edifier.com` |
| `edifier-g1500` | Edifier | `edifier.com` |
| `trust-gxt-620-axon` | Trust | `trust.com` |

Rappel de désambiguïsation : `logitech-z407` et `edifier-g1500` sont des **kits
d'enceintes 2.1 / 2.0**, pas des barres de son. Ne les présente jamais comme des
barres, y compris dans un libellé de disponibilité.

---

## Étape 3 — Contrôler chaque produit à la source constructeur

Pour **chacun des 13 produits**, dans cet ordre :

1. Ouvre la **fiche produit officielle du constructeur** (recherche sur le site
   de la marque, jamais sur `amazon.fr`). C'est la seule source qui dit si un
   modèle est encore au catalogue.
2. Réponds à trois questions, et à trois seulement :
   - **Le modèle est-il toujours commercialisé ?** (présent au catalogue
     constructeur, page produit vivante, pas de mention « discontinued » /
     « fin de vie » / redirection vers un successeur)
   - **La fourchette de gamme est-elle toujours juste ?** Recoupe avec le prix
     public conseillé du constructeur et, si tu en trouves, un test de référence
     récent (Les Numériques, Frandroid, Clubic, Tom's Hardware, TechRadar,
     RTINGS).
   - **Un successeur a-t-il été annoncé ?** (utile pour l'étape 5 et pour R4)
3. Note l'URL consultée. Une valeur changée sans source consultable n'est pas
   une mise à jour, c'est une supposition.

**Ne fais aucune requête vers `amazon.fr`.** Ni pour un prix, ni pour un stock,
ni « juste pour vérifier ». Si la fiche constructeur est indisponible, note-le
et laisse la donnée en place — mieux vaut une donnée datée d'il y a une semaine
qu'une donnée inventée cette semaine.

---

## Étape 4 — Mettre à jour la donnée produit

Dans `src/data/soundbars.ts`, pour chaque produit **effectivement contrôlé** :

- `priceCheckedAt` → la date du jour, au format ISO (`AAAA-MM-JJ`).
- `priceRange` → seulement **si la gamme a réellement changé**.
- `availability` → seulement **si l'état a réellement changé**, avec une valeur
  autorisée par `src/data/types.ts`.
- `lastUpdated` → la date du jour **si et seulement si** une autre valeur que
  `priceCheckedAt` a changé. `lastUpdated` est une date de vérification
  éditoriale, pas un compteur de passage de routine.

Interdictions dans cette étape :

- **N'écris jamais une note globale à la main.** La note est calculée par
  `scoreFromBreakdown()` (`src/lib/notation.ts`) depuis `scores`. Si un
  jugement doit bouger, c'est le détail par critère (`son`, `basses`,
  `ergonomie`, `connectique`, `rapportQualitePrix`) qui bouge — et c'est le
  travail de R4, pas de R2.
- **Ne touche pas au texte éditorial** (`verdict`, `summary`, `pros`, `cons`).
  R2 met à jour de la donnée commerciale, pas de la prose.
- **N'écris aucun prix exact** dans un champ, un commentaire ou un texte.

---

## Étape 5 — Modèle retiré du marché : jamais de suppression

Un modèle qui disparaît du catalogue constructeur **ne se supprime pas**. Une
page produit supprimée jette le référencement qu'elle avait acquis.

1. Passe `availability` à l'état « fin de commercialisation » prévu par le type.
2. Le CTA reste en place (le lien de recherche Amazon reste utile : il montre
   les offres restantes et les alternatives).
3. Ajoute un **renvoi explicite vers le remplaçant** — successeur annoncé par
   le constructeur, ou à défaut le produit du catalogue le plus proche par usage
   et par gamme. Formule-le dans le champ éditorial prévu à cet effet ; si
   aucun champ n'existe encore, ouvre une issue (étape 8) plutôt que d'inventer
   un champ : un champ fantôme casse le build.
4. Signale-le à R4 en ouvrant une issue : un retrait du marché justifie souvent
   de réordonner un classement, et ce n'est pas le travail de R2.

---

## Étape 6 — Vérifier

```bash
npm run build      # si le build échoue, corrige — ne publie pas
npm run check      # 0 erreur attendue
git diff --stat
```

Relis le `git diff` avant de committer : la routine ne doit avoir touché que
`priceRange`, `priceCheckedAt`, `availability` et `lastUpdated`. Toute autre
ligne modifiée est une erreur à annuler.

---

## Étape 7 — Publier sur `main`, uniquement si quelque chose a changé

```bash
if git diff --quiet; then
  echo "Aucun changement : rien à publier. Fin normale de la routine."
else
  git add src/data/soundbars.ts
  git commit -m "Prix : contrôle de gamme et disponibilité du $(date +%F)"
  git push origin HEAD:main
  git log --oneline -1 origin/main
fi
```

- **Pas de commit vide, jamais.** Un historique bruité empêche de voir les vraies
  mises à jour, et un `lastmod` de sitemap qui bouge sans raison est un signal
  négatif.
- **NE crée PAS de branche de travail. NE crée PAS de Pull Request. NE demande
  PAS de validation** : l'autorisation de pousser sur `main` est permanente.
- Une seule exécution = un seul commit.

---

## Étape 8 — Si quelque chose échoue, le dire

```bash
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R2 Prix — contrôle incomplet du $(date +%F)" \
  --body "Produits non contrôlés, raison (fiche constructeur inaccessible, doute sur la gamme, champ manquant dans le type), et URLs consultées."
```

Une routine qui échoue en silence est pire qu'une routine absente : on croit la
donnée fraîche alors qu'elle ne l'est plus. Ouvre l'issue **même** si onze
produits sur treize ont été contrôlés.

---

## Le jour où PA-API sera disponible

Bascule alors en **conception n°2** : prix exact relevé quotidiennement, avec
péremption automatique. Ne bascule pas avant que **tous** les prérequis soient
réunis.

### Prérequis, tous obligatoires

| Prérequis | État au 07/09/2026 |
|---|---|
| Compte Amazon Partenaires **validé** (ventes qualifiantes atteintes) | non acquis |
| Secret `AMAZON_ACCESS_KEY` dans l'environnement de la routine | absent |
| Secret `AMAZON_SECRET_KEY` | absent |
| Secret `AMAZON_PARTNER_TAG` | à confirmer (le tag `jrgrowth-21` est dans `src/consts.ts`, mais le tag PA-API doit être celui du compte validé) |
| `webservices.amazon.fr` autorisé dans la politique réseau de la routine | à faire |
| Les **13 ASIN** renseignés dans `src/data/soundbars.ts` (`amazonAsin`) | 0 sur 13 |

### Ce qui change dans la conception

1. **Cadence quotidienne obligatoire** : `0 5 * * *`. La règle des 24 heures du
   contrat Amazon Partenaires s'applique dès qu'un prix issu de PA-API est
   affiché. Une cadence hebdomadaire avec un prix exact est **non conforme** et
   c'est un motif classique de fermeture de compte.
2. **Relevé via `GetItems`**, un appel par ASIN, pour le prix et la
   disponibilité. Jamais de scraping : l'interdiction ne change pas.
3. **Mécanisme de péremption au niveau du gabarit, pas de la routine** : au
   rendu, si `maintenant - priceCheckedAt > 24 h`, la page **n'affiche aucun
   prix** et retombe sur « Voir le prix sur Amazon ». C'est une règle de
   gabarit précisément pour qu'elle tienne **même quand la routine tombe en
   panne** — ce qui est le scénario où elle sert.
4. **Le prix ne s'affiche jamais sans sa date de relevé** : « 229 € — prix
   constaté le 8 septembre 2026 ». Un prix sans date est une promesse que le
   site ne peut pas tenir.
5. **Le prix reste calculé depuis la donnée, jamais recopié dans une prose.** Un
   chiffre recopié dans un texte échappe au mécanisme de péremption : il reste
   faux et visible alors que le gabarit a masqué le vrai.
6. **Vérifie la formulation en vigueur** du contrat de licence Amazon
   Partenaires FR avant de figer la bascule : la clause des 24 heures évolue.

Tant qu'un seul prérequis manque, **reste en conception n°1**. La conception
n°3 (prix exact rafraîchi une fois par semaine) est **non conforme** : ne
l'implémente jamais, même comme étape intermédiaire.

---

## Garde-fous

Ces règles ne se négocient pas. Elles valent pour cette routine comme pour les
trois autres (`veille-playbook.md`, `liens-playbook.md`,
`classements-playbook.md`).

1. **Aucune expérience physique revendiquée.** La routine n'a pas écouté ces
   barres de son. Formule « d'après les mesures publiées par X » ou « sur le
   papier », **jamais** « à l'écoute, nous avons trouvé » ni « nous avons
   testé ». **C'est la règle la plus importante.** La position défendable du
   site est : comparatif éditorial fondé sur les caractéristiques constructeur
   et les mesures publiées par des laboratoires indépendants, selon la grille de
   notation publique de `/methodologie/`.
2. **Aucune preuve ne se fabrique.** Pas d'avis client inventé, pas de « prix
   constaté » sans relevé réel, pas de « recommandé par » sans source.
3. **Aucun prix ni aucune note écrits dans une prose.** Toujours rendus depuis
   la donnée (`priceRange`, `priceCheckedAt`, `scores` → `scoreFromBreakdown`),
   toujours datés.
4. **`rel="sponsored nofollow"` sur tout lien sortant marchand**, passage
   obligatoire par `/go/<slug>/`, et `Disallow: /go/` maintenu dans
   `public/robots.txt`.
5. **Ne jamais scraper `amazon.fr`.** Aucune requête HTTP vers les pages Amazon,
   sous aucun prétexte, y compris « juste pour vérifier un stock ».
6. **Ne jamais supprimer une fiche produit** dont le modèle est retiré du
   marché : la passer en « fin de commercialisation » avec un renvoi vers le
   remplaçant (étape 5).
7. **Orthographe des noms d'entités strictement identique partout.** « Sound
   Blaster Katana V2 » et « SoundBlaster Katana v2 » comptent pour deux
   produits différents, pour le site comme pour un moteur.
8. **Une routine qui échoue le dit.** Issue GitHub (étape 8), jamais d'échec
   silencieux.
9. **Zéro Pull Request, zéro branche de travail, zéro demande de validation.**
   Autorisation permanente de pousser sur `main`. Une mise à jour restée sur une
   branche = échec de la routine.
10. **Un seul contenu publié par exécution** — ici, un seul commit de données.
11. **Aucun commit vide.** Si rien n'a changé, la routine se termine sans rien
    pousser, et c'est un succès.
