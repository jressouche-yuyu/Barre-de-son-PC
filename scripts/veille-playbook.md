# Playbook R1 — Veille & blog

**Routine R1 — Veille & blog — cadence : mardi et vendredi, un réveil par jour — cron `0 7 * * 2,5` (UTC).**

Objectif de cadence : **1 à 2 articles par semaine**. Ce n'est pas un quota.
`scripts/news.config.mjs` porte `minPerWeek: 0` : **rien ne force jamais une
publication**. Une séance qui ne publie pas est un fonctionnement normal, pas un
échec.

**Ce playbook ne prescrit pas de cron : il constate celui du service.** Devant un
écart entre ce fichier et le cron réel, tu **ouvres une issue** et tu t'arrêtes.
Tu ne « réalignes » jamais l'un sur l'autre : multiplier la cadence est le pire
dégât que cette routine puisse faire.

**Branche de déploiement : `main`.** Zéro branche, zéro Pull Request, zéro
demande de validation. Un article resté ailleurs est un article **non publié**.

**Périmètre : élargi.** Le créneau strict « barre de son PC » ne produit que 4
événements exploitables par an. Le périmètre couvre donc les barres de son en
général, et plus largement l'audio domestique et professionnel (Sonos, Bose,
JBL, Sony, Samsung, LG, Devialet, Focal, Denon, Yamaha, Genelec, Sennheiser…).

⚠ **Contrainte de cohérence, non négociable.** Le domaine est
barre-de-son-pc.fr. Tout sujet hors du créneau strict **doit** se raccrocher
explicitement à l'usage bureau ou PC : « ce que la nouvelle X change pour un
bureau », « barre de son de salon branchée sur un PC : ce qui marche et ce qui ne
marche pas ». Un article home cinéma qui ne revient jamais au bureau dilue le
sujet du site : il ne se publie pas.

---

## Étape 1 — Le portillon autorise-t-il ?

### 1.1 — Préflight : le canal d'incident répond-il ?

Une routine qui ne peut pas alerter ne doit pas travailler.

```bash
gh auth status
```

Non authentifié → **arrête-toi**. N'écris rien, ne commite rien.

### 1.2 — Préflight : le dépôt est-il propre ?

```bash
git status --porcelain
```

`git diff --quiet` ne verrait pas un fichier **créé** : n'utilise que
`git status --porcelain`, qui liste aussi les fichiers non suivis.

- Sortie vide → continue.
- Sortie non vide → une séance précédente s'est arrêtée en cours de route. Va
  directement à l'**étape 7.0 (reprise)**, qui termine le travail existant avant
  d'en commencer un autre. Ne démarre jamais un second article par-dessus un
  premier inachevé.

### 1.3 — Le portillon

```bash
node scripts/news-gate.mjs
```

Le script écrit **une seule ligne** et sort toujours en code 0. Lis la ligne, pas
le code de sortie.

- **`SKIP: …`** → **arrêt immédiat**. Aucun fichier, aucun commit, aucune issue.
  C'est le cas le plus fréquent et il est correct. Signale le SKIP dans ton
  compte rendu et termine la séance.
- **`GO: …`** → tu peux continuer.

⚠ **Un `GO` est une autorisation, pas un ordre.** Il dit seulement que le budget
hebdomadaire n'est pas épuisé et que le tirage de la séance est passé. Il ne dit
rien de l'existence d'un sujet. La décision de publier appartient à l'étape 2,
qui garde un **droit de veto** sur ce `GO`.

---

## Étape 2 — Veille, avec droit de veto

### 2.1 — Lire le journal anti-doublon avant de chercher

```bash
node -e "const fs=require('fs');const l=JSON.parse(fs.readFileSync('scripts/news-ledger.json','utf8'));console.log(l.published.length+' entrees au journal')"
ls src/content/blog/*.md | wc -l
cat scripts/news-ledger.json
```

Les deux nombres doivent être **cohérents** (le journal peut être en retard d'une
entrée, jamais vide face à des articles existants).

⚠ **Un journal illisible est traité comme vide, en silence.** `news-record.mjs`
affiche `⚠ Journal illisible, il est recréé` et repart de zéro : tu perdrais tout
l'historique anti-doublon sans t'en apercevoir. Si la commande `node -e` échoue,
ou si elle annonce 0 entrée alors que `src/content/blog/` contient des articles :
**n'écris rien**, ouvre une issue (modèle de l'étape 6.3, titre adapté) et
arrête-toi.

⚠ **Limite du journal : il n'enregistre que `tags` et `title`.** Il ne repère pas
deux sujets **voisins** — « HDMI eARC sur un PC » et « brancher une barre de son
de salon sur un PC » passeraient pour distincts. **Compare donc aussi les titres
et les angles**, pas seulement les tags, et lis les `##` d'un article si le doute
subsiste. Un doublon d'angle nuit autant qu'un doublon de sujet.

### 2.2 — Chercher une actualité de moins de 30 jours

Fenêtre de fraîcheur : **30 jours** (`freshnessDays`). Sources de référence et
marques du périmètre : listes **`preferredSources`** et `keywords` de
`scripts/news.config.mjs` — lis-les, ne les réinvente pas.

```bash
grep -nE "freshnessDays|wordRange" scripts/news.config.mjs
```

Cherche : annonces produit, mises à jour de firmware ou de pilotes, formats et
traitements audio (Dolby Atmos, son spatial), connectique (HDMI eARC, USB-C,
LDAC), mesures publiées par un laboratoire, retraits de gamme, réglages Windows.
**Ne scrape jamais amazon.fr** — aucune exception.

### 2.3 — Trois issues possibles

**(a) Une actualité exploitable de moins de 30 jours, dans le périmètre, absente
du journal.** → Meilleur cas. Passe à l'étape 3. Si le sujet sort du créneau
strict, **note dès maintenant** la phrase qui le raccroche au bureau ou au PC :
elle devra apparaître dans le chapeau **et** dans au moins un `##`.

**(b) Aucune actualité, mais un sujet evergreen non traité.** → Acceptable.
Prends un angle dans la liste `angles` de `news.config.mjs` (ce que la
caractéristique change sur un bureau, décryptage déjargonné, mise en perspective
casque/enceintes, idées reçues de fiche technique, tutoriel Windows,
questions/réponses, contexte marché). Vérifie qu'aucun des 6 guides ni des 7
classements ne couvre déjà la question :

```bash
grep -oE "slug: '[a-z0-9-]+'" src/data/guides.ts src/data/rankings.ts
```

**(c) Rien de pertinent.** → **ARRÊT. Ne publie rien, ne commite rien, n'ouvre
aucune issue.**

**Noir sur blanc : (c) vaut mieux qu'un article de remplissage.** Ce site compte
une vingtaine de pages. Un article écrit pour honorer un `GO` traite forcément un
sujet déjà couvert par un guide ou un classement : il **cannibalise une page
existante** qui, elle, est travaillée et positionnée. Le coût d'un article de
remplissage n'est pas nul, il est négatif. Un rapport de séance qui dit « aucun
sujet, rien publié » est un rapport de séance **réussi**.

---

## Étape 3 — Rédiger : trois piliers

Longueur : **500 à 900 mots** (`wordRange`). Modèle de référence à 17/17 :
`src/content/blog/comprendre-puissance-barre-de-son-watts.md` — lis-le avant
d'écrire.

Base anti-hallucination : **`scripts/faits-produits.md`**. Aucun chiffre produit
qui n'y figure pas, et **orthographe des entités strictement identique** (Razer
Leviathan V2, Sound Blaster Katana V2X, Creative Stage, Logitech Z407…).

### Pilier 1 — Citabilité (GEO)

- **Sous chaque `##`, le premier paragraphe est une réponse autonome de 25 à 50
  mots.** Il se comprend sans avoir lu ce qui précède et se cite tel quel par un
  moteur génératif. C'est le contrôle 16.
- **Aucune anaphore contextuelle** : pas de « ce modèle », « celui-ci », « comme
  vu plus haut » en ouverture de phrase. Chaque phrase se tient seule
  (contrôle 17).
- **FAQ de 3 questions minimum, dans le frontmatter** (`faq`), jamais dans le
  corps : le gabarit seul en fait du JSON-LD `FAQPage`. Une FAQ tapée en Markdown
  n'alimente aucune donnée structurée.
- Un **tableau** de 5 lignes × 3 colonnes minimum, au moins une **liste à
  puces**, au moins un **bloc Focus en citation `>`**.

### Pilier 2 — Couverture sémantique (SEO)

- `metaTitle` de **45 à 65 caractères**, distinct du `title` (qui porte le H1).
- `description` de **130 à 160 caractères**.
- **Pas de `#` en début de ligne** : le H1 vient de `title`. Pas de section
  « Introduction » ni « Conclusion ».
- **3 à 5 liens internes**, une ancre unique par URL, dont **obligatoirement**
  `/classements/meilleures-barres-de-son-pc/`. Vérifie que chaque cible existe
  dans `src/data/rankings.ts`, `src/data/guides.ts` ou `src/content/blog/`.
- Termes du champ sémantique tirés de `keywords` : formats, connectique,
  composants, usages.

### Pilier 3 — Confiance (règles d'affiliation)

- **Aucune expérience physique revendiquée.** La routine n'a écouté aucune barre
  de son. Autorisé : « d'après les caractéristiques constructeur », « sur le
  papier », « d'après les mesures publiées par X ». **Interdit** : « nous avons
  testé », « à l'écoute », « en usage réel ». C'est la règle la plus importante
  du site (contrôle 14).
- **Aucune preuve fabriquée** : ni avis client, ni témoignage, ni « recommandé
  par » sans source citée.
- **Aucun prix en euros, aucune note, dans la prose** (contrôle 13). Les prix
  n'existent que sous forme de fourchette de gamme datée, rendue par
  `PrixGamme.astro` ; les notes sont **calculées** par `scoreFromBreakdown()`.
- **Aucun superlatif absolu** (« le meilleur », « incontournable ») —
  contrôle 15.
- Tout lien marchand passe par **`/go/`** et porte **`rel="sponsored nofollow"`**.
  `Disallow: /go/` reste en place.
- **2 sources minimum, dont au moins une non marchande**, avec des URL réelles et
  vérifiées (le schéma exige une URL valide).
- **Jamais une année en dur** : le millésime est calculé (`src/lib/millesime.ts`).

---

## Étape 4 — Créer le fichier

Chemin : `src/content/blog/<slug>.md`. Slug en minuscules, tirets, sans année.

**Frontmatter — champs autorisés, et rien d'autre** (`src/content.config.ts`) :
`title`, `metaTitle`, `description`, `publishedAt`, `updatedAt`, `tags`,
`readingMinutes`, `cover`, `coverAlt`, `draft`, `faq` (`{question, answer}[]`),
`sources` (`{title, url, publisher}[]`).

⚠ **`priceRange` n'existe pas. Ne l'écris jamais.** Un champ inventé passe le
build sans erreur et ne sert à rien : il fait croire à un garde-fou absent.

`publishedAt` et `updatedAt` : date du jour au format `AAAA-MM-JJ`. `updatedAt`
est exigé par le contrôle 5. `draft` reste **absent ou `false`** — un article en
`draft: true` n'est pas publié.

`cover` et `coverAlt` sont posés par l'étape 5 : ne les écris pas à la main.

---

## Étape 5 — Illustration

```bash
node scripts/assign-photo.mjs "<slug>" "<thème FR : 3 à 6 mots-clés>"
```

Le script écrit `cover` et `coverAlt` dans le frontmatter. Trois étages, **repli
garanti** : sans image trouvée, il retire `cover` et le gabarit génère un visuel
unique depuis le slug — un étage 3 n'est donc pas un échec. Le thème décrit
**l'image**, pas l'article : « barre de son bureau écran nuit », et non le titre
recopié.

---

## Étape 6 — Contrôle qualité : 17/17, trois tentatives maximum

```bash
node scripts/news-check.mjs src/content/blog/<slug>.md
```

17 contrôles. Le script sort en **code 1** tant qu'un `✗` subsiste, en 0 à 17/17.

### 6.1 — La boucle, bornée

Corrige les `✗`, puis relance. **Trois exécutions au maximum.**

Un contrôle peut être insatisfaisable (contraintes de longueur qui se mordent la
queue, lien interne introuvable) : sans borne, la boucle consomme toute la séance
et la routine ne rend rien.

### 6.2 — Abandon propre après la 3ᵉ tentative

Aucun commit. Supprime le brouillon pour ne pas polluer la séance suivante — et
l'image si `assign-photo.mjs` en a téléchargé une. `git status --porcelain` doit
revenir vide.

```bash
rm -f src/content/blog/<slug>.md
git status --porcelain
```

### 6.3 — L'issue d'abandon

```bash
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R1 Veille — abandon apres 3 tentatives de controle qualite" \
  --body "Slug : <slug>. Controles rouges restants : <colle la sortie de news-check>. Brouillon supprime, aucun commit, aucune publication ce jour."
```

Si la commande échoue à cause d'une option (un `--label` inexistant, par
exemple), relance-la sans cette option : l'issue compte plus que son étiquette.
Une routine qui échoue le dit — **jamais d'échec silencieux**.

---

## Étape 7 — Journal, build, publication

L'ordre ci-dessous rend la routine **idempotente** : article, image et journal
partent dans **un seul commit**, il n'existe donc pas d'état « publié mais non
journalisé ».

### 7.0 — Reprise d'une séance interrompue (venant de l'étape 1.2)

```bash
git status --porcelain
git log --oneline -3
git fetch origin main && git rev-parse HEAD origin/main
```

- Article présent dans `src/content/blog/` mais **absent du journal** → reprends
  à l'étape 6 (contrôle qualité), puis 7.1. Ne réécris pas l'article, ne
  recommence pas la veille.
- Article **déjà commité** mais `origin/main` en retard → va directement en 7.3.
  Le travail existe, il n'est simplement pas publié.
- Fichiers résiduels sans article exploitable → nettoie-les et arrête la séance.

### 7.1 — Journal anti-doublon

```bash
node scripts/news-record.mjs "<slug>" --origin auto
```

Le script lit le frontmatter de l'article : lance-le **après** l'étape 4 et
**avant** le commit. `--origin manuel` est réservé aux articles écrits à la main.

### 7.2 — Build, vérifications, commit unique

```bash
npm run check && npm run build
node scripts/verifie-rendu.mjs
```

**`check` AVANT `build`, jamais l'inverse.** C'est `check` qui refuse un champ de
frontmatter inventé ; avec `build && check`, un build qui échoue pour une raison
sans rapport fait **sauter** `check` et le champ fantôme passe inaperçu.

`verifie-rendu.mjs` vérifie les 17 invariants du site sur le HTML **réellement
servi** (`dist/`) : il exige un build préalable, sinon il s'arrête sur `dist/
absent`. Un `✗` ici : corrige, rebuild, relance — **dans la même limite de 3
tentatives** qu'à l'étape 6, puis abandon propre et issue. **Cite toujours le
libellé du contrôle en échec, jamais son numéro** : les numéros du rapport sont
positionnels et se décalent au premier contrôle ajouté (les numéros de
`news-check.mjs` cités plus haut, eux, sont stables).

```bash
git status --porcelain
git add src/content/blog/<slug>.md scripts/news-ledger.json public/images/blog/
git commit -m "Blog : <titre de l article>"
```

**Pas de commit vide** : si `git status --porcelain` ne renvoie rien, il n'y a
rien à publier — arrête-toi sans commiter.

### 7.3 — Resynchroniser AVANT de pousser

R2, R3 ou R4 peuvent avoir poussé entre-temps. Sans rebase, ton push est rejeté
et ton travail meurt avec le clone de la séance.

```bash
git pull --rebase origin main
```

**Conflit sur `scripts/news-ledger.json`** — c'est le conflit structurel attendu,
deux routines ajoutant chacune une entrée :

1. Ouvre le fichier et **garde les deux listes d'entrées** : le tableau
   `published` fusionné contient les entrées des deux côtés, aucune supprimée.
2. Vérifie que le JSON reparse (commande de l'étape 2.1).
3. `git add scripts/news-ledger.json`, puis `git rebase --continue`.

⚠ **Jamais `git rebase --skip`** : cette option jette ton commit entier, article
compris.

### 7.4 — Pousser, puis vérifier que le push a eu lieu

```bash
git push origin main
git fetch origin main
echo "local  $(git rev-parse HEAD)"
echo "remote $(git rev-parse origin/main)"
```

**Une ligne de sortie d'apparence normale ne prouve rien.** Les deux empreintes
doivent être **identiques** : c'est la seule preuve de publication.

- Identiques → publication faite, `deploy.yml` se déclenche sur ce push. Termine
  la séance et rends compte.
- Différentes, ou push rejeté → **retente une fois** la séquence 7.3 puis 7.4.
  Toujours en échec :

```bash
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R1 Veille — push vers main rejete, article non publie" \
  --body "Slug : <slug>. HEAD local : <empreinte>. origin/main : <empreinte>. Sortie de git push : <colle-la>. Le commit existe en local et sera perdu avec le clone. Contenu complet de l article recopie ci-dessous : <colle le fichier .md>"
```

Recopier l'article dans l'issue est la seule sauvegarde disponible : le clone de
la séance est détruit à la fin.

---

## Garde-fous

1. **Aucune expérience physique revendiquée.** La routine n'a écouté aucune de
   ces barres de son. « d'après les caractéristiques constructeur », « sur le
   papier », « d'après les mesures publiées par X ». Jamais « nous avons
   testé », jamais « à l'écoute, nous ». **Règle la plus importante.**
2. **Aucune preuve fabriquée** : ni avis client, ni témoignage, ni « recommandé
   par » sans source citée et vérifiable.
3. **Aucun prix ni aucune note dans une prose.** Fourchettes de gamme et notes
   sont rendues depuis la donnée, calculées et datées.
4. **`rel="sponsored nofollow"`** sur tout lien marchand, passage par **`/go/`**,
   `Disallow: /go/` maintenu.
5. **Ne jamais scraper amazon.fr.**
6. **Ne jamais supprimer la page d'un modèle retiré.** Si l'article évoque un
   retrait, il renvoie à la fiche existante : la disponibilité se gère par
   `availability` + `alternative` (routine R2), jamais en supprimant une page.
7. **Orthographe des entités strictement identique partout**, telle qu'écrite
   dans `scripts/faits-produits.md`.
8. **Une routine qui échoue le dit** : `gh issue create`. Jamais d'échec
   silencieux — et le canal d'incident est vérifié à l'étape 1.1, avant tout
   travail.
9. **Zéro Pull Request, zéro branche, zéro demande de validation.** Un contenu
   resté sur une branche est un contenu non publié.
10. **Pas de commit vide.** Le juge est `git status --porcelain`, jamais
    `git diff --quiet`, qui ignore les fichiers créés.
11. **Ne jamais écrire une année en dur, ni un champ absent du schéma.** Le
    millésime est calculé ; `priceRange` n'existe pas.

**Et le garde-fou propre à R1 :** un `GO` du portillon n'oblige à rien. Ne rien
publier faute de sujet est le résultat nominal de cette routine, pas une panne.
