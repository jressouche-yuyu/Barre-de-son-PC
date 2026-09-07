# Playbook R2 — Fiches produits

**Routine R2 — Fiches produits** — cadence **hebdomadaire** — cron `0 5 * * 1` (UTC, lundi
vers 7 h heure de Paris).

Ce fichier est le seul document vers lequel la routine est pointée. Il remplace
`scripts/prix-playbook.md`, supprimé : ce dernier prescrivait un champ `priceRange` qui
**n'existe pas** dans le modèle de données, ce qui faisait échouer `npm run check` au premier
passage et empêchait toute publication.

**Branche de déploiement : `main`.** `.github/workflows/deploy.yml` ne se déclenche que sur un
push vers `main`. Une mise à jour poussée ailleurs n'est jamais publiée : c'est un échec, pas
un travail en attente. Zéro branche, zéro Pull Request, zéro demande de validation.

---

## Ce que fait R2, ce qu'elle ne fait pas

R2 tient la **donnée commerciale et technique** des 13 fiches produit. Elle ne porte aucun
jugement éditorial, parce qu'elle n'a pas les produits en main.

| R2 fait | R2 ne fait pas |
|---|---|
| Sonder les fiches constructeur FR et constater l'état du catalogue | Écouter, mesurer ou essayer un produit |
| Écrire `priceCheckedAt`, `availability`, `price`, `lastUpdated` | Écrire `score`, `scores.*`, `verdict`, `summary`, `pros`, `cons`, `bestFor`, `tutorial` |
| Détecter une nouvelle version, un délistage, un modèle manquant | **Créer une fiche produit** (interdit — étape 10) |
| Ouvrir une issue nominative pour R3 et pour le propriétaire | Réordonner un classement, éditer `/selection-du-mois/` (c'est R3) |
| Constater le cron en vigueur | Modifier un cron, `news.config.mjs` ou un script |

Les quatre objets de la routine, dans l'ordre de priorité :

1. **Nouvelle version d'un produit du catalogue** (étape 8) — le cas qui coûte le plus cher si
   on le rate.
2. **Fin de commercialisation** (étapes 6 et 7) — un produit délisté toujours présenté comme
   disponible fait fuir l'acheteur et rend le schéma `Product` faux.
3. **Specs révisées** (étape 9).
4. **Fourchette de gamme et disponibilité** (étape 7) — la routine d'entretien de fond.

---

## Étape 0 — Vérifier que la routine peut travailler

Trois contrôles, dans cet ordre. Chacun est bloquant : si l'un échoue, **arrête-toi** sans
rien écrire.

```bash
# 0.1 — Le canal d'incident fonctionne. Une routine qui ne peut pas alerter ne travaille pas.
gh auth status || { echo "CANAL D INCIDENT INDISPONIBLE — arret"; exit 1; }

# 0.2 — La cadence servie est bien celle décidée (mardi/vendredi pour R1, 1 run/jour).
git show HEAD:scripts/news.config.mjs | grep -E "activeDays|runsPerDay|maxPerWeek"
# Attendu : activeDays: [2, 5]  ·  runsPerDay: 1  ·  maxPerWeek: 2
# Divergence -> issue (etape 14) et arret. R2 ne corrige JAMAIS news.config.mjs elle-meme.

# 0.3 — Le playbook constate le cron, il ne le prescrit pas.
ls .github/workflows/
grep -n "schedule\|branches" .github/workflows/deploy.yml
```

Sur 0.3 : au 07/09/2026, `deploy.yml` **n'a aucun `schedule:`** (mesuré). Conséquence à
connaître : la péremption des gammes à 45 jours est évaluée **au build**, donc si R2 s'arrête,
le site continue d'afficher indéfiniment un relevé périmé comme s'il était frais. C'est le
premier point à remonter au propriétaire (voir « Ce que R2 ne peut pas réparer seule »).

Si `gh` n'est pas disponible, écris le repli versionné plutôt que de perdre l'information :

```bash
printf '%s | R2 | %s\n' "$(date +%F)" "gh indisponible : <resume de l anomalie>" >> scripts/incidents.md
```

---

## Étape 1 — Se placer sur `main` à jour

```bash
git status --short
git fetch origin && git checkout main && git pull --ff-only origin main
```

Un dépôt sale ou en retard produit un conflit en fin de routine. Règle-le avant de commencer,
ou ouvre une issue et arrête-toi.

**Ce `git pull` n'est pas la resynchronisation avant push.** Entre cette étape et le commit il
s'écoule une vingtaine de sondes réseau : une autre routine peut avoir poussé entre-temps. La
resynchronisation obligatoire est à l'étape 13, et elle se fait en `rebase`, pas en `--ff-only`
(qui abandonne dès que la branche a divergé).

---

## Étape 2 — Contrôle de fraîcheur du catalogue, avant toute sonde

Une R2 tombée en panne est invisible : `node scripts/verifie-rendu.mjs` reste à 12/12 sur un
catalogue périmé de huit mois (mesuré), parce que son contrôle n° 5 accepte explicitement
l'état « Gamme à revérifier » comme un succès. C'est donc R2 qui doit se surveiller elle-même.

```bash
node -e "
const fs=require('fs');const t=fs.readFileSync('src/data/soundbars.ts','utf8');
const re=/slug: '([^']+)'[\s\S]*?priceCheckedAt: '([0-9-]+)'/g;let m,r=[];
while((m=re.exec(t)))r.push({slug:m[1],d:m[2]});
r.sort((a,b)=>a.d.localeCompare(b.d));
const j=d=>Math.floor((Date.now()-new Date(d+'T00:00:00Z'))/86400000);
r.forEach((x,i)=>console.log(String(i+1).padStart(2), x.d, String(j(x.d)).padStart(3)+' j', x.slug));
console.log('--- les 4 plus anciens, a sonder ce passage ---');
r.slice(0,4).forEach(x=>console.log(x.slug));
"
```

Lis la sortie et applique le barème :

| Âge du relevé le plus ancien | Ce que tu fais |
|---|---|
| ≤ 35 jours | rien de spécial, continue |
| 36 à 45 jours | ouvre une issue « catalogue proche de péremption » **et** continue : ces produits passent en tête de rotation |
| > 45 jours | ouvre une issue « catalogue périmé — R2 n'a pas tourné depuis le … » **avant** de commencer le travail, puis continue |

Repère mesuré : `PRICE_FRESHNESS_DAYS = 45` (`src/lib/prix.ts`). Un relevé du `2026-09-07` est
encore frais le `2026-10-22` et périmé le `2026-10-23` (vérifié par appel direct à
`isPriceFresh`). Au 07/09/2026 les 13 produits portent la **même** date : ils basculeraient
tous le même jour, ce que la rotation de l'étape 5 corrige.

---

## Étape 3 — Lire le type avant d'écrire une seule valeur

```bash
sed -n '/interface Soundbar/,/^}/p' src/data/types.ts
grep -n "export type Availability" -A 2 src/data/types.ts
```

**N'invente jamais un champ.** `npm run build` ne l'attrape pas : un champ fantôme passe le
build en vert et part en production, ignoré du rendu. C'est `npm run check` qui le refuse
(`ts(2353) … does not exist in type 'SoundbarInput'`). D'où l'ordre imposé à l'étape 12 :
**`check` avant `build`**.

Champs que R2 modifie, et eux seuls :

| Champ | Quand | Règle |
|---|---|---|
| `priceCheckedAt` | à chaque produit **effectivement sondé** | date du jour, `AAAA-MM-JJ` |
| `availability` | seulement si l'état a réellement changé | une des 3 valeurs de `Availability`, jamais une quatrième |
| `price` | seulement si la **bande de gamme** change (étape 7) | montant indicatif, jamais affiché tel quel |
| `lastUpdated` | seulement si un champ **de fond** a changé dans la même entrée | jamais pour un simple relevé de gamme |

Champs interdits à R2, sans exception : `score` (calculé, pas saisi), `scores.*` (étape 11),
`verdict`, `summary`, `pros`, `cons`, `bestFor`, `tutorial`, `image`, `imageAlt`, `gallery`,
`slug`, `name`, `brand`.

Champs sourçables mais qui exigent une issue avant modification (étape 9) :
`powerRmsWatts`, `powerPeakWatts`, `frequencyResponse`, `driverConfig`, `dimensionsCm`,
`connectivity`, `hasSubwoofer`, `hasMicrophone`, `hasRGB`, `releaseYear`.

Deux champs existent mais sont vides sur les 13 produits (`grep -c` → 0 pour chacun) :
`amazonAsin` et `manualUrl`. Ne les remplis pas au hasard : un ASIN faux est un lien
d'affiliation vers un autre produit.

**`priceRange` n'existe pas.** Si tu lis ce nom quelque part dans le dépôt, c'est un reste à
corriger, pas un champ à écrire.

### Le catalogue et ses pièges de nommage

13 produits, dans l'ordre du fichier source. Base de faits :
`scripts/faits-produits.md` (613 lignes, orthographe normalisée des entités).

| Slug | Nom exact | Marque |
|---|---|---|
| `razer-leviathan-v2-pro` | Razer Leviathan V2 Pro | Razer |
| `razer-leviathan-v2` | Razer Leviathan V2 | Razer |
| `razer-leviathan-v2-x` | Razer Leviathan V2 X | Razer |
| `creative-sound-blaster-katana-v2` | Creative Sound Blaster Katana V2 | Creative |
| `creative-sound-blaster-katana-v2x` | Creative Sound Blaster Katana V2X | Creative |
| `creative-sound-blaster-gs3` | Creative Sound Blaster GS3 | Creative |
| `creative-stage-v2` | Creative Stage V2 | Creative |
| `creative-stage-air-v2` | Creative Stage Air V2 | Creative |
| `creative-stage-360` | Creative Stage 360 | Creative |
| `logitech-z407` | Logitech Z407 | Logitech |
| `edifier-mg300` | Edifier MG300 | Edifier |
| `edifier-g1500` | Edifier G1500 | Edifier |
| `trust-gxt-620-axon` | Trust GXT 620 Axon | Trust |

Trois pièges à ne pas oublier :

- **Collision de préfixes.** « Sound Blaster Katana V2 » est un préfixe de « Katana V2X », et
  « Leviathan V2 » un préfixe de « V2 X » et « V2 Pro ». Un `grep` sur le nom compte donc les
  deux (mesuré : 2 occurrences de « Sound Blaster Katana V2 » sur la page de gamme Creative,
  dont une est le V2X). **Cherche le chemin d'URL du produit, pas son nom** — voir étape 4.
- `logitech-z407` et `edifier-g1500` sont des **kits d'enceintes 2.1 / 2.0**, pas des barres de
  son. Ne les appelle jamais « barre », y compris dans un libellé d'issue.
- `edifier-mg300` est le **seul** produit du catalogue avec `hasMicrophone: true`.

---

## Étape 4 — Sonde de gamme : les 5 pages de catalogue constructeur

Cinq requêtes qui donnent, d'un coup, le **signal de présence au catalogue** pour les 13
produits et la liste des modèles du marché absents du site. Fais-les **toutes les semaines**,
quel que soit l'état de la rotation.

Prépare la fonction de sonde (elle sert aussi à l'étape 5) :

```bash
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"

sonde() {
  local url="$1"
  local etat; etat=$(curl -sS -o /dev/null -A "$UA" -w '%{http_code} %{redirect_url}' --max-time 25 "$url")
  local titre; titre=$(curl -sSL -A "$UA" --max-time 30 "$url" | grep -oiE '<title>[^<]*</title>' | head -1)
  printf '%s\n  code+redir : %s\n  titre      : %s\n' "$url" "$etat" "$titre"
}
```

Les cinq pages de gamme, **en locale française épinglée** (URLs vérifiées le 07/09/2026, toutes
en 200) :

| Marque | Page de gamme FR — c'est la seule qui fait foi | Les produits y sont-ils listés en `href` ? |
|---|---|---|
| Razer | `https://www.razer.com/fr-fr/pc/gaming-speakers` | oui — `/fr-fr/gaming-speakers/<slug>` |
| Creative | `https://fr.creative.com/p/speakers` | oui — `/p/speakers/<slug>` |
| Logitech | `https://www.logitech.com/fr-fr/shop/c/speakers` | oui — `/fr-fr/shop/p/<slug>` |
| Trust | `https://www.trust.com/fr/gaming/speakers` | **non** (rendu client) — repli sur le nom |
| Edifier | `https://www.edifier.com/fr/product-category/gaming-speakers` | oui — `/int/fr/p/gaming-speakers/<slug>` |

Relève la présence par le **chemin d'URL**, pas par le nom :

```bash
catalogue() { curl -sSL -A "$UA" --max-time 30 "$1" > /tmp/gamme.html; grep -oE "$2" /tmp/gamme.html | sort | uniq -c; }

catalogue "https://www.razer.com/fr-fr/pc/gaming-speakers"            '/fr-fr/gaming-speakers/[a-z0-9-]+'
catalogue "https://fr.creative.com/p/speakers"                        '/p/speakers/[a-z0-9-]+'
catalogue "https://www.logitech.com/fr-fr/shop/c/speakers"            '/fr-fr/shop/p/[a-z0-9-]+'
catalogue "https://www.edifier.com/fr/product-category/gaming-speakers" '/int/fr/p/gaming-speakers/[a-z0-9-]+'
# Trust n expose pas de href produit : compte le nom du modele.
curl -sSL -A "$UA" --max-time 30 "https://www.trust.com/fr/gaming/speakers" | grep -oiE "Axon" | wc -l
```

Deux sorties à produire de cette étape :

1. **Pour chacun des 13 produits : présent ou absent** du catalogue de sa marque. C'est le
   signal (b) de la règle de concordance (étape 6).
2. **La liste des modèles présents chez le constructeur et absents du site.** Elle part en
   issue « candidats à l'ajout » (étape 10). Sans cette liste, personne ne la produit et le
   catalogue vieillit sans que quiconque le voie : au 07/09/2026 il contient **zéro modèle 2025
   ou 2026** (`releaseYear` : 2020 ×1, 2021 ×2, 2022 ×6, 2023 ×2, 2024 ×2 — mesuré).

Relevé de référence du 07/09/2026, à comparer à ce que tu obtiens :

- Razer FR liste **Leviathan V2** et **Leviathan V2 X** seulement, plus la gamme Nommo V2. La
  **Leviathan V2 Pro n'y figure pas** (0 occurrence).
- Creative FR liste GS3, **GS5**, **Katana SE**, Katana V2, Katana V2X, Stage 360, Stage Air V2,
  **Stage Pro**, **Stage SE mini**, **Creative XF1**. La **Creative Stage V2 n'y figure pas**.
- Logitech FR liste `z407-bluetooth-computer-speakers`.
- Trust FR : « Axon » présent (209 occurrences).
- Edifier FR liste G1000, G1000 II, G2000, G2000 PRO, G5000. **Ni MG300 ni G1500.**

---

## Étape 5 — Sonde produit : rotation de 4 par semaine

Ne sonde pas les 13 fiches produit chaque semaine, et surtout **ne redate pas les 13
`priceCheckedAt` le même jour** : un relevé raté ferait alors disparaître toute l'information
commerciale du site d'un seul coup, sur les 13 fiches, les 7 classements, le comparateur et les
cartes de l'accueil.

**Rotation : les 4 produits dont `priceCheckedAt` est le plus ancien** (la commande de l'étape 2
te les donne déjà). 13 produits par paquets de 4 = tour complet en 4 semaines, soit 28 jours,
donc **17 jours de marge** avant les 45 jours de péremption.

Deux promotions hors rotation, obligatoires :

- Un produit **absent de sa page de gamme** à l'étape 4 est sondé immédiatement, quelle que
  soit sa place dans la rotation.
- Un produit en `stock-limite` ou `fin-de-commercialisation` est sondé chaque semaine.

### Table des 13 URLs de fiche constructeur FR

**N'improvise jamais une URL de fiche constructeur.** Démonstration du risque, mesurée : en
devinant le numéro d'article Trust, `.../product/23644-gxt-620-axon-rgb-illuminated-soundbar`
répond en redirigeant vers un article de support qui traite d'un **autre produit**. Le bon
identifiant est `24482`. Une sonde sur une mauvaise URL ne rend pas une erreur, elle rend une
page crédible sur un autre appareil — et une mise à jour tracée, datée, sourcée, et fausse.

| Slug | URL de fiche constructeur FR | Résultat de sonde le 07/09/2026 |
|---|---|---|
| `razer-leviathan-v2-pro` | `https://www.razer.com/fr-fr/gaming-speakers/razer-leviathan-v2-pro` | **301 → `/fr-fr/pc/gaming-speakers/leviathan-line`** |
| `razer-leviathan-v2` | `https://www.razer.com/fr-fr/gaming-speakers/razer-leviathan-v2` | 200 |
| `razer-leviathan-v2-x` | `https://www.razer.com/fr-fr/gaming-speakers/razer-leviathan-v2-x` | 200 |
| `creative-sound-blaster-katana-v2` | `https://fr.creative.com/p/speakers/sound-blaster-katana-v2` | 200 |
| `creative-sound-blaster-katana-v2x` | `https://fr.creative.com/p/speakers/sound-blaster-katana-v2x` | 200 |
| `creative-sound-blaster-gs3` | `https://fr.creative.com/p/speakers/sound-blaster-gs3` | 200 |
| `creative-stage-v2` | `https://fr.creative.com/p/speakers/creative-stage-v2` | **302 → `/p/speakers`** |
| `creative-stage-air-v2` | `https://fr.creative.com/p/speakers/creative-stage-air-v2` | 200 |
| `creative-stage-360` | `https://fr.creative.com/p/speakers/creative-stage-360` | 200 |
| `logitech-z407` | `https://www.logitech.com/fr-fr/shop/p/z407-bluetooth-computer-speakers` | 200 |
| `trust-gxt-620-axon` | `https://www.trust.com/fr/product/24482-gxt-620-axon-rgb-illuminated-soundbar` | 200 |
| `edifier-mg300` | **à établir — aucune URL FR vérifiée** | sonde impossible |
| `edifier-g1500` | **à établir — aucune URL FR vérifiée** | sonde impossible |

Sur les deux Edifier : recherche menée le 07/09/2026 sur `edifier.com/fr` (catégories
`gaming-speakers`, `computer-speakers`, `tv-home-threater-systems` et la liste
`/fr/product-list/gaming`) — **ni MG300 ni G1500 n'y apparaissent**. Ces deux produits sont donc
**non contrôlables** en l'état : ne devine pas leur URL, ne conclus rien sur leur
disponibilité, laisse leur donnée en place, **ne touche pas leur `priceCheckedAt`**, et
mentionne-les dans l'issue de fin de passage. Le jour où le propriétaire fournit les deux URL,
ajoute-les à cette table.

### Les cinq pièges de sonde, tous mesurés le 07/09/2026

1. **Piège de locale (Razer).** `razer.com/gaming-speakers/razer-leviathan-v2-pro`, sans préfixe
   — la version américaine, celle qu'une recherche remonte — répond 200 sans redirection, alors
   que la version `fr-fr` répond 301. Le même produit est « en vente » ou « délisté » selon la
   locale. **Sonde toujours l'URL de la table ci-dessus, jamais un résultat de recherche.**
2. **Soft-404 (Edifier).** `edifier.com` répond **HTTP 200** sur une URL de produit
   inexistante, avec `<title>404 page - Page not Found</title>`. Sur ce domaine, le code HTTP ne
   veut rien dire : c'est le **titre de la page** qui tranche. D'où la fonction `sonde()`, qui
   relève les deux.
3. **Redirection générique (Creative).** `fr.creative.com/p/speakers/modele-inexistant-9999`
   répond 302 vers `/p/speakers` — **exactement la même signature** qu'un vrai délistage. Une
   redirection Creative ne prouve donc rien à elle seule : elle exige le second signal.
4. **Page de gamme périmée (Creative).** `fr.creative.com/soundbars/` liste encore la Stage V2
   avec un bouton d'achat, alors que `/p/speakers` ne la liste plus. **Seule la page de la table
   de l'étape 4 fait foi** ; `/soundbars/` est une page marketing, jamais un signal de
   catalogue. Ne la consulte pas.
5. **Numéro d'article devinable (Trust).** Voir plus haut : `23644` au lieu de `24482` mène à un
   autre produit.

### Ne lis jamais un stock, lis une présence au catalogue

`fr.creative.com` affiche « en rupture de stock » sur une large partie de sa gamme. Une rupture
temporaire n'est **pas** une fin de commercialisation. La question à laquelle tu réponds est :
« ce modèle est-il encore au catalogue du constructeur ? », pas « peut-on l'acheter aujourd'hui ? ».

### Et jamais, sous aucun prétexte, `amazon.fr`

Aucune requête HTTP vers une page Amazon. Ni pour un prix, ni pour un stock, ni « juste pour
vérifier ». C'est interdit par les conditions du programme, c'est détecté, et cela ne servirait
à rien : le site n'affiche pas de prix exact.

Sources de recoupement autorisées, en second rideau seulement (pour une spec, jamais pour une
disponibilité) : `clubic.com`, `tomshardware.fr`, `techradar.com`, `rtings.com`,
`soundguys.com`. À savoir : `lesnumeriques.com`, `frandroid.com` et `01net.com` sont
inaccessibles à l'agent (mesuré) — **ne cite jamais une URL que tu n'as pas ouverte dans
l'exécution en cours.**

---

## Étape 6 — Décider : la règle de concordance à deux signaux

C'est la règle la plus délicate de la routine, parce que les deux erreurs possibles n'ont pas
le même coût. Ne rien faire laisse le site mentir une semaine de plus. Basculer à tort pose
« Fin de commercialisation » et `schema.org/Discontinued` sur un produit encore vendu, ce qui
tue le taux de clic d'une page qui rapporte. Et le type `Availability` n'a **aucun état
« doute »** où consigner un signal non confirmé : il n'y a que trois valeurs.

**Pour passer un produit en `fin-de-commercialisation`, il faut les DEUX signaux :**

- **(a)** sa fiche constructeur FR renvoie 404, **ou** redirige hors d'elle-même vers une page
  de gamme ou de catégorie, **ou** sert un titre de page d'erreur ;
- **(b)** son chemin d'URL est **absent** de la page de gamme FR de la marque (étape 4).

**Charge de la preuve asymétrique :**

| Situation | Décision |
|---|---|
| (a) **et** (b) | passe en `fin-de-commercialisation` — étape 7 |
| (a) seul, ou (b) seul | **ne touche à rien.** Ouvre une issue « signal unique de délistage » nommant le produit, le signal obtenu et l'URL sondée |
| Fiche FR vivante (200 + titre du produit) | `disponible` — un seul signal suffit pour revenir |
| Sonde impossible (URL inconnue, réseau) | ne touche à rien, **pas même `priceCheckedAt`**, et signale-le |

Deux basculements sont **déjà dus** au 07/09/2026, chacun avec ses deux signaux vérifiés :

| Produit | Signal (a) | Signal (b) | Conclusion |
|---|---|---|---|
| `razer-leviathan-v2-pro` | 301 vers `leviathan-line` | 0 occurrence de `/fr-fr/gaming-speakers/razer-leviathan-v2-pro` sur la gamme FR | `fin-de-commercialisation` |
| `creative-stage-v2` | 302 vers `/p/speakers` | 0 occurrence de `/p/speakers/creative-stage-v2` sur la gamme FR | `fin-de-commercialisation` |

⚠ **`razer-leviathan-v2-pro` est le cas le plus grave du dépôt.** C'est le n° 1 du top 3 de
l'accueil, le n° 1 de 3 des 7 classements, le pick n° 1 de `/selection-du-mois/`, il est cité
dans un article de blog, et il porte la note la plus haute du site (8,7). Le drapeau
`availability` ne le déclasse nulle part : aucun gabarit de liste ne filtre sur la
disponibilité (`grep -n availability` sur `classements/[slug].astro`, `guides/[slug].astro`,
`selection-du-mois/index.astro`, `SoundbarCard.astro`, `RankingTable.astro` → aucune
occurrence), et `soundbarsByScore()` ne filtre pas non plus. Le site publierait donc « notre
n° 1 : fin de commercialisation ». Ce basculement **exige** l'issue immédiate pour R3 décrite à
l'étape 7, sans attendre le 1er ou le 15.

---

## Étape 7 — Écrire la donnée

Dans `src/data/soundbars.ts`, pour chaque produit **effectivement sondé** cette semaine.

### 7.1 `priceCheckedAt` — toujours, si et seulement si le produit a été sondé

Date du jour, `AAAA-MM-JJ`. Ne redate jamais un produit que tu n'as pas sondé : la date
affichée au lecteur serait fausse.

### 7.2 `availability` — sous la règle de concordance

Une des trois valeurs de `Availability` (`src/data/types.ts`), jamais une quatrième :
`'disponible' | 'stock-limite' | 'fin-de-commercialisation'`.

`stock-limite` décrit un stock, pas un doute : ne l'utilise pas pour ranger un signal que tu
n'arrives pas à confirmer.

### 7.3 `price` — seulement si la bande de gamme change

`price` n'est **jamais affiché**. Il sert à trois choses : déduire la bande de gamme affichée
(`priceBand()` de `src/lib/prix.ts`, bornes 30 / 80 / 200 / 450 avec le test `price < high`),
trier les classements « pas chères », et choisir les deux blocs d'alternatives de chaque fiche
produit (`barres-de-son/[slug].astro` : « Moins chère » = `price` inférieur, « Montée en
gamme » = `price` supérieur).

**Ne le colle jamais au prix du jour.** L'abstraction de bande existe précisément pour absorber
la dérive : le Logitech Z407 est relevé à 109,99 € sur `logitech.com/fr-fr` contre `price: 99`
dans la donnée — les deux tombent dans « Milieu de gamme · environ 80 à 200 € », donc **il n'y a
rien à changer**. Ne touche `price` que si le prix public constructeur fait réellement sortir le
produit de sa bande, et sache que tu réécris alors aussi le maillage interne des alternatives.

Deux produits sont **à 1 € de la frontière** milieu / haut (mesuré) et relèvent de l'**arbitrage
humain** : `creative-sound-blaster-katana-v2x` et `creative-stage-360`, tous deux à `199 €`.
Un relevé à 209 € ferait basculer leur affichage de « environ 80 à 200 € » à « environ 200 à
450 € ». Un changement de bande est une décision de positionnement éditorial, pas un relevé :
**ouvre une issue, ne bascule pas toi-même.** (`edifier-g1500`, à 89 €, est à 9 € de la
frontière basse : même prudence.)

Si un produit dépasse la borne haute des `PRICE_BANDS` (450 €), **ne le force pas** dans « Haut
de gamme » : ouvre une issue. Les bandes sont des bornes éditoriales, elles s'arbitrent.

### 7.4 `lastUpdated` — la règle la plus facile à enfreindre

`lastUpdated` alimente quatre surfaces à la fois : le `<lastmod>` du sitemap, la balise
`article:modified_time`, un texte visible « Mis à jour le … », et — c'est le point décisif —
`datePublished` du `Review` dans le schéma `Product` (`src/lib/schema.ts:93`).

Conséquence : redater une fiche sans changement de fond ne produit pas un signal creux, cela
**publie une affirmation fausse en trois exemplaires**, dont un avis dont le site prétend qu'il
a été publié ce jour-là. Une routine hebdomadaire qui redaterait ses 13 fiches à chaque passage
fabriquerait 13 faux avis frais par semaine.

Donc :

1. `lastUpdated` bouge **uniquement** si un champ de fond de la même entrée a changé :
   `availability`, ou une caractéristique technique validée par issue.
2. Un simple relevé de gamme met à jour `priceCheckedAt` **seul**. C'est précisément pour cela
   que les deux champs existent séparément.
3. Ne touche jamais le `lastUpdated` d'une entrée que tu n'as pas modifiée par ailleurs. Une
   ligne `lastUpdated` modifiée sans autre ligne modifiée dans la même entrée est une erreur à
   annuler.

### 7.5 Fin de commercialisation : trois gestes, et jamais de suppression

Une page produit supprimée jette le référencement qu'elle a acquis. **Ne supprime jamais une
fiche, ne la retire jamais du sitemap.**

1. `availability: 'fin-de-commercialisation'`, `priceCheckedAt` du jour, `lastUpdated` du jour
   (l'état commercial est un champ de fond).
2. Ouvre **immédiatement** une issue nominative pour R3 — sans attendre le 1er ou le 15 —
   nommant : le slug retiré, les classements et guides où il figure, s'il est pick de
   `/selection-du-mois/`, et le **slug de remplacement retenu** (successeur annoncé par le
   constructeur, ou à défaut le produit du catalogue le plus proche par usage et par bande de
   prix). La liste des emplacements s'obtient ainsi :

```bash
SLUG="razer-leviathan-v2-pro"
MODELE="Leviathan V2 Pro"   # la partie DISTINCTIVE du nom, sans la marque

# Classements et guides (champs `items` et `picks`)
grep -n "soundbar: '$SLUG'" src/data/rankings.ts src/data/guides.ts
# Selection du mois
grep -n "\"soundbar\": \"$SLUG\"" src/data/monthly.json
# Prose : articles, intros de classement, sections de guide
grep -rn "$MODELE" src/content/blog/ src/data/rankings.ts src/data/guides.ts
```

Deux avertissements sur ce dernier `grep`, tous deux vérifiés :

- **Cherche la partie distinctive du modèle, pas le nom complet.** `son-spatial-pc-thx-super-x-fi.md`
  écrit « les barres Razer Leviathan (V2, V2 Pro) » et « La Leviathan V2 Pro » : un `grep` sur
  « Razer Leviathan V2 Pro » ne trouve **rien**, un `grep` sur « Leviathan V2 Pro » trouve les
  deux.
- **Attention aux collisions de préfixes en sens inverse** : un `grep` sur « Leviathan V2 »
  remonte aussi les V2 X et V2 Pro. Lis les lignes retournées, ne compte pas les occurrences.

Le top 3 de l'accueil n'apparaît dans aucun de ces `grep` : il est **calculé** par
`soundbarsByScore().slice(0, 3)` dans `src/pages/index.astro`. Si le produit retiré est dans
les trois meilleures notes, il y reste — mentionne-le explicitement dans l'issue.

3. **N'écris pas le renvoi vers le remplaçant toi-même.** Aucun champ ne le porte :
   `grep -rn 'replacedBy\|remplac\|successeur' src/data/types.ts` ne rend que des commentaires.
   Le seul endroit où l'écrire aujourd'hui serait `summary` ou `verdict` — de la prose
   éditoriale, interdite à R2. R2 pose donc le drapeau et **nomme le remplaçant dans l'issue** ;
   le renvoi visible est écrit par un humain, ou attend le champ `replacedBy?: string` à
   arbitrer. C'est un travail volontairement à moitié fait : mieux vaut un drapeau juste qu'un
   champ inventé, que `npm run check` refuserait de toute façon.

---

## Étape 8 — Nouvelle version d'un produit du catalogue

C'est le cas que le propriétaire a nommé en premier, et le seul qui transforme un marché lent en
matière éditoriale. Le marché renouvelle 2 à 3 modèles par an : quand une nouvelle version
sort, il ne faut pas la rater.

Tu la détectes à l'étape 4, comme un modèle présent au catalogue constructeur, absent du site,
et dont le nom prolonge celui d'un produit du catalogue (« Katana SE » après « Katana V2 »,
« GS5 » après « GS3 », « Stage Pro » après « Stage 360 »).

Ce que tu fais, dans l'ordre :

1. **Ne crée pas la fiche du nouveau modèle** (étape 10 : c'est interdit, et pour de bonnes
   raisons).
2. Sonde l'ancien modèle et applique la règle de concordance de l'étape 6. Une nouvelle version
   ne suffit pas à délister l'ancienne : Razer a vendu les V2 et V2 X côte à côte pendant des
   années. Le seul juge est la présence au catalogue FR.
3. Ouvre **une** issue structurée qui couvre les deux moitiés du sujet :

```bash
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R2 — Nouvelle version : <nom exact du nouveau modele>" \
  --body "$(cat <<'TXT'
Detecte par la sonde de gamme du <date>.

NOUVEAU MODELE
- Nom exact (orthographe constructeur) :
- URL fiche constructeur FR sondee (code HTTP + titre releve) :
- Page de gamme FR ou il apparait :
- Specs relevees sur la fiche constructeur, champ par champ :
- Bande de prix estimee d apres le prix public constructeur :
- Commercialise en France : oui / non (si non, ne pas creer de fiche)

MODELE QU IL REMPLACE
- Slug au catalogue du site :
- Signal (a) fiche FR :
- Signal (b) presence au catalogue FR :
- Decision appliquee par R2 : availability inchangee / fin-de-commercialisation
- Emplacements ou l ancien figure (classements, guides, selection du mois) :

CE QUI RESTE A FAIRE PAR UN HUMAIN
- Les 5 sous-notes (scores), verdict, summary, pros, cons, bestFor, tutorial, image/imageAlt/gallery.
- R2 ne les produit pas : elle n a pas le produit en main.
TXT
)"
```

4. Note dans l'issue si le nouveau modèle est **commercialisé en France**. Cas mesuré à
   connaître : l'ASUS ROG Gjallar, annoncée le 9 juillet 2026, est sortie aux États-Unis à
   599,99 $ sans disponibilité mondiale annoncée — donc au-dessus de la borne haute des
   `PRICE_BANDS` (450 €) et sans lien marchand FR possible. Un tel modèle **n'entre pas au
   catalogue** : il reste en liste de veille, et si un article en parle, ce sera un article de
   contexte marché avec la mention explicite « non commercialisée en France à la date du
   relevé », sans bloc produit et sans lien `/go/`.

---

## Étape 9 — Specs révisées sur un produit existant

Un constructeur qui corrige une puissance annoncée ou une réponse en fréquence sur sa fiche
produit, c'est plausible et ça arrive. Mais une spec ne vit pas qu'à un endroit : elle est
recopiée dans `scripts/faits-produits.md` et parfois citée dans un article de blog. La changer
dans `soundbars.ts` seul crée une contradiction interne que rien ne détecte.

**Ce que R2 fait : elle constate et elle ouvre une issue. Elle ne réécrit pas la spec.**

```bash
# Ou la spec est-elle deja citee ?
grep -rn "45 Hz\|65 W" scripts/faits-produits.md src/data/ src/content/blog/
```

Issue à ouvrir, une par produit concerné :

```bash
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R2 — Spec revisee : <slug> · <champ>" \
  --body "Champ : <powerRmsWatts | frequencyResponse | driverConfig | dimensionsCm | connectivity | releaseYear>
Valeur dans src/data/soundbars.ts : <ancienne>
Valeur sur la fiche constructeur FR : <nouvelle>
URL sondee (ouverte dans cette execution) : <url> — code HTTP <code> — titre <titre>
Autres endroits qui citent cette valeur : <sortie du grep>
R2 n a rien modifie."
```

### La limite, et elle est catégorique

Une entrée de `soundbars.ts` fait 68 lignes, dont une quinzaine de champs de prose. R2 peut
sourcer une caractéristique sur une fiche constructeur. Elle **ne peut pas** produire :

- les 5 sous-notes `scores` — c'est un **jugement**, pas une mesure (étape 11) ;
- `verdict`, `summary`, `pros`, `cons`, `bestFor` — de la prose évaluative ;
- `tutorial` (intro + étapes + astuces) — le récit d'une **prise en main** ;
- `image`, `imageAlt`, `gallery` — `scripts/assign-photo.mjs` ne sait fournir qu'une image
  générique Pexels ou une image de la bibliothèque locale, **jamais une photo du modèle
  précis**. Et rien ne vérifie un chemin d'image : Astro ne valide pas les chemins `/public`
  au build. Une routine qui remplit ces champs produit soit une image cassée en production,
  soit la photo d'un autre appareil présentée comme le produit — c'est-à-dire une preuve
  fabriquée.

Si la routine ne peut pas le sourcer, elle ne l'écrit pas. Il n'y a pas de version dégradée
acceptable de ces champs.

---

## Étape 10 — Nouveau modèle du marché absent du catalogue

**R2 ne crée jamais une fiche produit.** Pas de porte de sortie, pas de cas particulier, pas
de « fiche minimale à compléter plus tard ». Une fiche incomplète est publiée dès le commit :
elle apparaît dans le comparateur, dans les 5 surfaces triées par note, dans `llms.txt`.

Quand ajouter un modèle : jamais par R2. Ce que R2 fait à la place, à chaque passage, c'est
produire la **liste de travail** issue de l'étape 4, en une seule issue :

```bash
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R2 — Candidats a l ajout au catalogue ($(date +%F))" \
  --body "Modeles presents au catalogue constructeur FR et absents de src/data/soundbars.ts.
Pour chacun : nom exact, URL FR sondee (code + titre), bande de prix estimee, perimetre PC oui/non.

<liste>

Rappel de perimetre : le site traite l ecoute assise a moins d un metre d un ecran d ordinateur.
Marques dans le perimetre : Razer, Creative, Logitech, Edifier, Trust, ASUS ROG, OXS, Redragon.
Hors perimetre, a ne pas proposer : Samsung HW-, LG S-/SC-, Sonos, Bose Smart Soundbar,
Hisense, TCL, Sony Bravia Theatre, Devialet."
```

Priorité mesurée le 07/09/2026, à traiter d'abord parce que ces modèles sont au catalogue
Creative FR et testés par des sources accessibles : **Sound Blaster GS5**, **Sound Blaster
Katana SE**, **Creative Stage Pro**, **Creative Stage SE mini**. Chaque fiche créée par un
humain vaut aussi un article possible pour R1 — c'est le seul mécanisme qui alimente la veille
dans un marché à 2-3 nouveautés par an.

Et la règle de dépendance, à rappeler dans l'issue : **R1 n'écrit sur un produit qu'après que
sa fiche existe dans `soundbars.ts`.** Un article sur un modèle absent du catalogue n'a rien
vers quoi lier, et échoue aux contrôles de maillage de `news-check.mjs`.

---

## Étape 11 — Les notes : interdiction, et les chiffres qui la justifient

**R2 ne touche jamais à un `scores.*`.** Voici pourquoi, en chiffres relevés dans le dépôt.

La note globale est calculée par `scoreFromBreakdown()` (`src/lib/notation.ts`) : son 40 %,
basses 30 %, ergonomie 20 %, connectique 5 %, rapport qualité-prix 5 %. Toutes les sous-notes
saisies sont au pas de 0,5. Effet d'un seul pas de 0,5 sur la note globale arrondie au dixième :

| Critère | Pondération | Déplacement de la note |
|---|---|---|
| `son` | 0,40 | **0,2** |
| `basses` | 0,30 | **0,2** (0,15 avant arrondi) |
| `ergonomie` | 0,20 | **0,1** |
| `connectique` | 0,05 | 0,0 |
| `rapportQualitePrix` | 0,05 | 0,0 |

Et voici les écarts réels entre notes voisines du classement (13 produits : 8,7 / 8,6 / 8,6 /
8,4 / 8,3 / 7,9 / 7,9 / 7,7 / 7,5 / 7,4 / 7,2 / 7,2 / 6,7) :

```
rang 1->2 : 0,1     rang 5->6 : 0,4     rang  9->10 : 0,1
rang 2->3 : 0,0     rang 6->7 : 0,0     rang 10->11 : 0,2
rang 3->4 : 0,2     rang 7->8 : 0,2     rang 11->12 : 0,0
rang 4->5 : 0,1     rang 8->9 : 0,2     rang 12->13 : 0,5
```

**Huit écarts sur douze valent 0,2 ou moins — la taille exacte d'un seul pas de 0,5 sur `son`.
Trois valent 0,0 : ce sont des ex æquo stricts** (`razer-leviathan-v2` = `creative-sound-blaster-katana-v2`
à 8,6 ; `creative-stage-v2` = `logitech-z407` à 7,9 ; `creative-stage-air-v2` = `edifier-mg300`
à 7,2). L'écart entre le n° 1 et le n° 2 est de 0,1.

`soundbarsByScore()` trie sur `b.score - a.score` **sans aucun critère de départage** : les ex
æquo sont résolus par la stabilité du tri, donc par l'ordre de saisie dans le tableau. Ses
consommateurs sont au nombre de cinq : le top 3 de l'accueil, `/barres-de-son/`,
`/comparateur/`, les 5 pages marques, et `llms.txt`.

Autrement dit : le plus petit ajustement éditorial concevable change le n° 1 de l'accueil et
l'ordre servi aux moteurs génératifs. Et un simple rangement du tableau source inverse les ex
æquo **sans qu'aucune note ne change**.

### Bornes

- **Borne nominale : zéro.** R2 ne modifie aucun `scores.*`. Si une spec révisée invalide une
  sous-note (une puissance corrigée à la baisse, un caisson retiré d'une version), R2 ouvre une
  issue « sous-note à réviser » et **n'y touche pas**.
- **N'écris jamais une note globale à la main.** Le champ `score` est calculé à l'export de
  `soundbars.ts` (`...sb` puis `score:` recalculé) : une valeur écrite à la main serait
  silencieusement écrasée, ce qui est le pire des cas — un diff qui ment.
- **Si et seulement si le propriétaire autorise explicitement un ajustement**, les bornes sont :
  un seul produit par exécution, un seul critère, un pas maximum de 0,5, **jamais un produit du
  top 3** (`razer-leviathan-v2-pro`, `razer-leviathan-v2`, `creative-sound-blaster-katana-v2`),
  et **refus si le mouvement franchit un rang ou crée un ex æquo** — à vérifier en recalculant
  les 13 notes avant et après.

---

## Étape 12 — Vérifier, dans cet ordre

```bash
npm run check                    # 0 erreur exigee — c est LUI qui refuse un champ inexistant
npm run build                    # doit passer ; s il echoue, corrige, ne publie pas
node scripts/verifie-rendu.mjs   # 12 controles sur le HTML servi — un seul ✗ et on ne pousse pas
git diff --stat src/data/
git diff src/data/soundbars.ts
```

Pourquoi cet ordre : `npm run build` seul **ne suffit pas**. Un champ inventé passe le build en
vert (mesuré) et part en production ; c'est `npm run check` qui le refuse en `ts(2353)`. Un
build vert ne prouve pas que la donnée est bien typée.

Pourquoi `verifie-rendu.mjs` : ses 12 contrôles portent sur les 65 pages servies et couvrent
des règles que rien d'autre ne vérifie — absence de revendication de test physique,
`rel="sponsored nofollow"` sur les liens marchands, `Disallow: /go/`, aucun schéma `Offer` avec
un prix exact figé, les 13 fiches qui datent leur gamme. R2 édite `src/data/`, donc R2 peut
casser chacune de ces règles. Il faut l'appeler **après** le build, puisqu'il lit `dist/`.

Relis le `git diff` ligne à ligne : la routine ne doit avoir touché que `priceCheckedAt`,
`availability`, `price` et `lastUpdated`. **Toute autre ligne modifiée est une erreur à
annuler**, y compris une reformulation involontaire.

### Bornes de correction

**3 tentatives maximum** pour faire passer `npm run check` ou `verifie-rendu.mjs`, **2** pour le
build. Au-delà : n'écris rien de plus, **ne commite pas**, `git checkout -- src/data/soundbars.ts`
pour rendre l'arbre propre, ouvre l'issue avec la sortie complète du dernier échec, et termine.
L'abandon **avec** issue est un résultat acceptable ; l'abandon silencieux ne l'est pas.

---

## Étape 13 — Publier sur `main`

```bash
# 13.1 — Rien a faire ? On s arrete, et c est un succes.
#        git status --porcelain, PAS git diff --quiet : ce dernier ignore les fichiers
#        non suivis (verifie) et annoncerait « rien a faire » en jetant le travail.
if [ -z "$(git status --porcelain)" ]; then
  echo "Aucun changement : rien a publier. Fin normale de la routine."
  exit 0
fi

# 13.2 — Chemins explicites, jamais git add -A.
git add src/data/soundbars.ts
git commit -m "Produits : sonde constructeur et disponibilite du $(date +%F)"

# 13.3 — Resynchronisation JUSTE AVANT le push, en rebase.
git fetch origin && git rebase origin/main || {
  echo "REBASE EN ECHEC — ne pas forcer"; exit 1; }

# 13.4 — Push, code de sortie lu, jamais canalise dans un pipe.
git push origin HEAD:main

# 13.5 — Verification comparative. `git log origin/main` seul NE detecte PAS un push
#        rejete : il affiche une ref de suivi perimee.
git fetch origin
if [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ]; then
  echo "PUBLIE"
else
  echo "NON PUBLIE"
  gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
    --title "R2 — Push non publie du $(date +%F)" \
    --body "HEAD local $(git rev-parse --short HEAD) != origin/main $(git rev-parse --short origin/main). Commit ecrit mais non publie."
fi
```

Sur 13.3 : si le rebase échoue, **ne force pas**. Résous, refais **un seul** nouvel essai de
push ; deuxième rejet → issue et arrêt. Ne fais jamais `git rebase --skip` (il jette ton
commit) et n'utilise jamais `git pull --ff-only` comme moyen de reprise (il abandonne dès que
la branche a divergé).

Sur les collisions : R2 tourne à `0 5 * * 1` et R3 à `0 6 1,15 * *`. Les 1er et 15 qui tombent
un lundi mettent R2 une heure avant R3, toutes deux sur `src/data/soundbars.ts`. Le
rebase-avant-push est la seule protection.

Règles fixes : **un seul commit par exécution**, **jamais de commit vide**, **jamais de
branche, jamais de Pull Request, jamais de demande de validation**. Un contenu resté local est
un contenu non publié.

---

## Étape 14 — Issue de fin de passage : toujours

Cette issue est écrite **même quand tout s'est bien passé**. C'est la seule trace qui distingue
« R2 a tourné et il n'y avait rien à changer » de « R2 n'a pas tourné ».

```bash
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R2 — Passage du $(date +%F)" \
  --body "Produits sondes ce passage (4 en rotation + promotions) : <slugs>
Pages de gamme sondees : 5/5 ? <detail>
Produits non controles et pourquoi (URL inconnue, reseau, soft-404) : <liste>
Basculements d availability appliques, avec les deux signaux : <detail>
Produits dont priceCheckedAt depasse 40 jours : <liste — alerte AVANT la bascule a 45>
Candidats a l ajout releves : <liste ou 'aucun'>
Issues ouvertes ce passage : <numeros>
Publie : oui / non — commit <sha>"
```

Ouvre-la **même** si onze produits sur treize ont été contrôlés. Une routine qui échoue en
silence est pire qu'une routine absente : on croit la donnée fraîche alors qu'elle ne l'est
plus.

---

## Le jour où une API produit sera disponible

Aujourd'hui le site n'affiche **aucun prix exact** : la PA-API d'Amazon est dépréciée au profit
de la Creators API, aucun ASIN n'est renseigné au catalogue (`grep -c amazonAsin` → 0 sur 13),
et le compte Partenaires n'est pas validé — il n'existe donc aucune source de prix qu'on ait le
droit d'afficher.

Le jour où une API produit sera accessible, la bascule se fait vers un **relevé de prix exact
quotidien**. Elle ne se fait **pas** avant que tous les prérequis soient réunis.

### Prérequis, tous obligatoires

| Prérequis | État au 07/09/2026 |
|---|---|
| Compte Partenaires **validé** (ventes qualifiantes atteintes) | non acquis |
| API produit effectivement ouverte au compte, avec sa documentation en vigueur | à confirmer (PA-API dépréciée) |
| Secret `AMAZON_ACCESS_KEY` dans l'environnement de la routine | absent |
| Secret `AMAZON_SECRET_KEY` | absent |
| Secret `AMAZON_PARTNER_TAG` correspondant au **compte validé** | à confirmer |
| Domaine de l'API autorisé dans la politique réseau de la routine | à faire |
| Les **13 ASIN** renseignés dans `amazonAsin` | 0 sur 13 |
| Un champ typé pour porter le prix relevé et son horodatage, ajouté explicitement à `types.ts` | inexistant |

### Ce qui change alors, et qui n'est pas négociable

1. **Cadence quotidienne obligatoire** — `0 5 * * *`, plus `0 5 * * 1`. La règle des 24 heures
   du contrat Partenaires s'applique dès qu'un prix issu de l'API est affiché. Un prix exact
   rafraîchi une fois par semaine est **non conforme** : ne l'implémente jamais, pas même comme
   étape intermédiaire.
2. **Un appel par ASIN**, jamais de scraping. L'interdiction de `amazon.fr` ne change pas.
3. **Effacement du prix si le relevé échoue.** Le mécanisme vit dans le **gabarit**, pas dans la
   routine : au rendu, si `maintenant − priceCheckedAt > 24 h`, la page n'affiche **aucun prix**
   et retombe sur « Voir le prix sur Amazon ». C'est une règle de gabarit précisément pour
   qu'elle tienne quand la routine tombe en panne — le seul scénario où elle sert. Corollaire
   mesuré aujourd'hui : cette péremption exige un **rebuild programmé** dans `deploy.yml`, qui
   n'existe pas encore.
4. **Le prix ne s'affiche jamais sans sa date de relevé** : « 229 € — prix constaté le 8
   septembre 2026 ». Un prix sans date est une promesse que le site ne peut pas tenir.
5. **Le prix reste rendu depuis la donnée, jamais recopié dans une prose.** Un chiffre recopié
   échappe au mécanisme de péremption : il reste faux et visible alors que le gabarit a masqué
   le vrai. C'est aussi la raison pour laquelle `formatPrice()` a été **supprimé** du code — ne
   le réintroduis pas.
6. **Relis la formulation en vigueur du contrat** avant de figer la bascule : les clauses
   évoluent, et une non-conformité sur le prix est un motif classique de fermeture de compte.

Tant qu'un seul prérequis manque, reste sur la conception actuelle : fourchette de gamme datée,
et lien vers le marchand pour le prix du jour.

---

## Ce que R2 ne peut pas réparer seule

À rappeler au propriétaire dans l'issue de fin de passage tant que ce n'est pas traité. Ce sont
des trous de gabarit, pas des erreurs de donnée : R2 n'a pas mandat de toucher `src/`.

1. **`deploy.yml` n'a aucun `schedule:`.** La péremption des gammes est évaluée au build : si
   R2 s'arrête, le site sert indéfiniment un relevé périmé comme s'il était frais. Le filet de
   sécurité dépend de la machinerie qu'il est censé rattraper.
2. **`soundbarsByScore()` ne filtre pas `availability`** et aucun gabarit de liste ne le fait :
   un produit en fin de commercialisation reste n° 1 de l'accueil, des classements et de la
   sélection du mois.
3. **`llms.txt` ne mentionne aucun état commercial** (`grep -c 'commercialisation\|disponib'
   dist/llms.txt` → 0) : il continue de recommander sans réserve un produit délisté, au canal
   le plus difficile à corriger après coup.
4. **Aucun champ ne porte le remplaçant** d'un modèle retiré. Il faudrait un
   `replacedBy?: string` et un bloc de renvoi dans le gabarit de fiche. Tant qu'il n'existe pas,
   la moitié du garde-fou n° 6 n'est pas implémentable.
5. **`soundbarsByScore()` n'a aucun départage déterministe** : trois ex æquo stricts sont
   résolus par l'ordre de saisie dans le tableau.
6. **`verifie-rendu.mjs` accepte « Gamme à revérifier » comme un succès** : il reste à 12/12 sur
   un catalogue périmé. Un 13e contrôle « aucun relevé au-delà de `PRICE_FRESHNESS_DAYS` »
   ferait échouer au lieu d'afficher vert.
7. **Deux produits Edifier n'ont aucune URL de fiche constructeur FR vérifiée** (`edifier-mg300`,
   `edifier-g1500`) : ils sont hors de portée de la sonde jusqu'à ce qu'un humain fournisse les
   deux URL.

---

## Garde-fous

Ces dix règles ne se négocient pas. Elles valent pour R2 comme pour les trois autres routines.

1. **Aucune expérience physique revendiquée.** La routine n'a pas écouté ces barres de son.
   Formule « d'après les caractéristiques constructeur », « sur le papier », « d'après les
   mesures publiées par X ». **Jamais** « nous avons testé », « à l'écoute, nous », « nous
   l'avons essayée », « à l'usage », « notre test ». **C'est la règle la plus importante.** Le
   contrôle n° 11 de `verifie-rendu.mjs` n'attrape aujourd'hui que « nous avons
   testé/écouté/mesuré », « testé pendant N », « à l'écoute, nous » et « après N jours
   d'utilisation » : ne t'appuie pas sur lui, il laisse passer le reste.
2. **Aucune preuve ne se fabrique.** Pas d'avis client, pas de témoignage, pas de « recommandé
   par » sans source, pas de « prix constaté » sans relevé réel, pas de photo d'un autre
   appareil, pas d'URL citée sans l'avoir ouverte dans l'exécution en cours.
3. **Aucun prix ni aucune note écrits dans une prose.** Toujours rendus depuis la donnée
   (`price` → `priceBand()`, `scores` → `scoreFromBreakdown()`), toujours datés. Le champ
   `priceRange` n'existe pas : ne l'écris pas.
4. **`rel="sponsored nofollow"` sur tout lien sortant marchand**, passage obligatoire par
   `/go/<slug>/`, `Disallow: /go/` maintenu dans `public/robots.txt`.
5. **Ne jamais scraper `amazon.fr`.** Aucune requête HTTP vers une page Amazon, sous aucun
   prétexte, y compris « juste pour vérifier un stock ».
6. **Ne jamais supprimer une fiche produit** dont le modèle est retiré : `availability:
   'fin-de-commercialisation'` + issue nommant le slug de remplacement (étape 7.5). Une
   suppression jette le référencement acquis.
7. **Orthographe des entités strictement identique partout** (`scripts/faits-produits.md`).
   « Sound Blaster Katana V2 » et « SoundBlaster Katana v2 » comptent pour deux produits
   différents, pour le site comme pour un moteur.
8. **Une routine qui échoue le dit.** Issue GitHub (étape 14), et repli sur
   `scripts/incidents.md` si `gh` est indisponible. Jamais d'échec silencieux. Un abandon avec
   issue est un succès ; un abandon muet est une panne invisible.
9. **Zéro Pull Request, zéro branche de travail, zéro demande de validation.** L'autorisation de
   pousser sur `main` est permanente. Une mise à jour restée locale est un échec.
10. **Aucun commit vide, un seul commit par exécution.** Rien à changer → ne rien pousser, et
    c'est une fin normale. Contrôle par `git status --porcelain`, jamais par
    `git diff --quiet`.
