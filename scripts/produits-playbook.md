# Playbook R2 — Fiches produits

**Routine R2 — une fois par semaine, le lundi — cron `0 5 * * 1` (UTC).**

R2 entretient les **13 fiches de `src/data/soundbars.ts`** : nouvelles versions, specs révisées,
disponibilité, fourchette de gamme. Elle ne rédige aucun article (R1), ne réordonne aucun
classement (R3), ne vérifie aucun lien (R4). Suis ce fichier dans l'ordre. **Le modèle de ce que
R2 doit savoir refaire seule** : `git show --stat 92c51b8` puis `66e0190` — 3 produits sortis des
recommandations, 13 prix indicatifs faux corrigés, 12 fiches aux specs redressées, 2 erreurs de
micro, 1 puissance inventée retirée.

## Étape 1 — Vérifier que la routine peut travailler

```bash
gh --version && gh auth status   # si ca echoue : pas de canal d incident. Travaille quand
                                 # meme, mais ecris "gh INDISPONIBLE" dans le compte rendu.
git rev-parse --abbrev-ref HEAD  # doit dire : main
git fetch origin
git status --porcelain           # AVANT tout reset. Voir l avertissement ci-dessous.
if [ -z "$(git status --porcelain)" ]; then
  git reset --hard origin/main   # arbre propre : on se recale sans rien detruire
else
  echo "ARBRE SALE — ne rien ecraser : issue + arret"
fi
```

⚠ **`git reset --hard` n'est jamais inconditionnel.** Le clone est partagé avec
les trois autres routines, et pour R1 un arbre de travail sale au démarrage
**signifie quelque chose** : « séance précédente interrompue, termine l'article
existant ». Un reset aveugle détruit définitivement cet article, et R1 ne le saura
jamais. Donc : `git status --porcelain` **d'abord**, et s'il renvoie quoi que ce
soit, **ouvre une issue** (« clone sale au démarrage de R2 », sortie collée) et
**arrête-toi**. Tu ne reprends pas le travail d'une autre routine, tu ne l'écrases
pas non plus.

Dépôt `jressouche-yuyu/Barre-de-son-PC`, déploiement sur `main`, **ni branche ni Pull Request**.

## Étape 2 — Fraîcheur du catalogue, avant toute sonde

Une R2 en panne est invisible : `verifie-rendu.mjs` reste à 17/17 sur un catalogue périmé, parce
qu'il accepte « Gamme à revérifier » comme un succès. R2 se surveille donc elle-même.

```bash
node -e "
const t=require('fs').readFileSync('src/data/soundbars.ts','utf8');
const re=/slug: '([^']+)'[\s\S]*?priceCheckedAt: '([0-9-]+)'/g;let m,r=[];
while((m=re.exec(t)))r.push({slug:m[1],d:m[2]});
r.sort((a,b)=>a.d.localeCompare(b.d));
const j=d=>Math.floor((Date.now()-new Date(d+'T00:00:00Z'))/86400000);
r.forEach(x=>console.log(x.d, String(j(x.d)).padStart(3)+' j', x.slug));
console.log('--- les 4 plus anciens, a sonder ce passage ---');
r.slice(0,4).forEach(x=>console.log(x.slug));"
```

| Âge du relevé le plus ancien | Ce que tu fais |
|---|---|
| ≤ 35 jours | rien de spécial, continue |
| 36 à 45 jours | issue « catalogue proche de péremption » **et** continue ; ces produits passent en tête de rotation |
| > 45 jours | issue « catalogue périmé — R2 n'a pas tourné depuis le … » **avant** de travailler, puis continue |

`PRICE_FRESHNESS_DAYS = 45` (`src/lib/prix.ts`) : passé ce délai, `PrixGamme.astro` **masque** la
fourchette. Les 13 produits portent aujourd'hui la même date (`2026-09-07`) : ils basculeraient
tous le même jour, ce que la rotation de l'étape 4.2 corrige.

## Étape 3 — Lire le type avant d'écrire une seule valeur

```bash
sed -n '/export interface Soundbar/,/^}/p' src/data/types.ts
```

Champs que R2 peut écrire : `price`, `priceCheckedAt`, `availability`, `alternative`,
`lastUpdated`, `powerRmsWatts`, `powerPeakWatts`, `frequencyResponse`, `dimensionsCm`,
`driverConfig`, `connectivity`, `hasSubwoofer`, `hasMicrophone`, `hasRGB`, `releaseYear`,
`manualUrl`, `amazonAsin`. Trois interdits : ⚠ **`priceRange` n'existe pas** (le prix indicatif
s'appelle `price`, non affiché, il déduit seulement la bande via `priceBand()`) ; ⚠ **`score` ne
se saisit pas** — calculé par `scoreFromBreakdown()` à l'export, le type d'entrée est
`SoundbarInput = Omit<Soundbar, 'score'>` et l'écrire casse `npm run check` ; ⚠ **aucune année en
dur** dans un texte publié — `annee()`, `src/lib/millesime.ts`.

`availability` n'a que trois valeurs : `'disponible' | 'stock-limite' |
'fin-de-commercialisation'`. **Aucun état « doute »** n'existe, d'où la règle de l'étape 6.

## Étape 4 — Sonde de gamme, puis rotation

### 4.1 Les cinq pages de catalogue constructeur, chaque semaine

```bash
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"
sonde() { curl -sS -o /dev/null -A "$UA" -w '%{http_code} %{redirect_url}\n' --max-time 25 "$1"
  curl -sSL -A "$UA" --max-time 30 "$1" | grep -oiE '<title>[^<]*</title>' | head -1; }
catalogue() { curl -sSL -A "$UA" --max-time 30 "$1" > /tmp/gamme.html; grep -oE "$2" /tmp/gamme.html | sort | uniq -c; }

catalogue "https://www.razer.com/fr-fr/pc/gaming-speakers"              '/fr-fr/gaming-speakers/[a-z0-9-]+'
catalogue "https://fr.creative.com/p/speakers"                          '/p/speakers/[a-z0-9-]+'
catalogue "https://www.logitech.com/fr-fr/shop/c/speakers"              '/fr-fr/shop/p/[a-z0-9-]+'
catalogue "https://www.edifier.com/fr/product-category/gaming-speakers" '/int/fr/p/gaming-speakers/[a-z0-9-]+'
# Trust n expose pas de href produit (rendu client) : compte le nom du modele.
curl -sSL -A "$UA" --max-time 30 "https://www.trust.com/fr/gaming/speakers" | grep -oiE "Axon" | wc -l
```

Deux sorties obligatoires : **présent / absent** pour chacun des 13 produits, et la **liste des
modèles présents chez le constructeur et absents du site** — elle part en issue « candidats à
l'ajout », sans elle le catalogue vieillit sans que personne le voie. Relevé de référence du
07/09/2026 : Razer FR ne liste que Leviathan V2 et V2 X (pas la V2 Pro) ; Creative FR ne liste
pas la Stage V2 ; Edifier FR ne liste ni MG300 ni G1500.

### 4.2 Rotation : les 4 produits au `priceCheckedAt` le plus ancien

Ne sonde pas les 13 fiches chaque semaine et **ne redate jamais les 13 `priceCheckedAt` le même
jour** : un relevé raté ferait disparaître toute l'information commerciale du site d'un coup.
Paquets de 4 = tour complet en 4 semaines, 17 jours de marge avant péremption. Deux promotions
hors rotation, obligatoires : un produit **absent de sa page de gamme** en 4.1, et tout produit
déjà en `stock-limite` ou `fin-de-commercialisation`.

## Étape 5 — Sonde de disponibilité : deux locales, puis deux marchands

### 5.1 Fiche constructeur, sur au moins deux locales

**N'improvise jamais une URL de fiche constructeur.** Table vérifiée le 07/09/2026 :

| Slug | Fiche constructeur FR |
|---|---|
| `razer-leviathan-v2-pro` | `razer.com/fr-fr/gaming-speakers/razer-leviathan-v2-pro` (301 → `leviathan-line`) |
| `razer-leviathan-v2` | `razer.com/fr-fr/gaming-speakers/razer-leviathan-v2` |
| `razer-leviathan-v2-x` | `razer.com/fr-fr/gaming-speakers/razer-leviathan-v2-x` |
| `creative-sound-blaster-katana-v2` | `fr.creative.com/p/speakers/sound-blaster-katana-v2` |
| `creative-sound-blaster-katana-v2x` | `fr.creative.com/p/speakers/sound-blaster-katana-v2x` |
| `creative-sound-blaster-gs3` | `fr.creative.com/p/speakers/sound-blaster-gs3` |
| `creative-stage-v2` | `fr.creative.com/p/speakers/creative-stage-v2` (302 → `/p/speakers`) |
| `creative-stage-air-v2` | `fr.creative.com/p/speakers/creative-stage-air-v2` |
| `creative-stage-360` | `fr.creative.com/p/speakers/creative-stage-360` |
| `logitech-z407` | `logitech.com/fr-fr/shop/p/z407-bluetooth-computer-speakers` |
| `trust-gxt-620-axon` | `trust.com/fr/product/24482-gxt-620-axon-rgb-illuminated-soundbar` |
| `edifier-mg300` / `edifier-g1500` | **aucune URL FR vérifiée — sonde impossible, ne devine pas** |

Seconde locale : la même fiche sans préfixe FR (`razer.com/gaming-speakers/…`,
`us.creative.com/p/speakers/…`, `logitech.com/en-us/shop/p/…`), pour savoir si l'absence
constatée en France est un retrait mondial ou un simple retrait de distribution.

### 5.2 Les trois pièges, tous rencontrés pour de vrai le 07/09/2026

1. **La locale change la réponse.** `razer.com/gaming-speakers/razer-leviathan-v2-pro` — la
   version américaine, celle qu'une recherche remonte — répond 200 quand la `fr-fr` répond 301.
   Le même produit est « en vente » ou « délisté » selon la locale. Sonde l'URL de la table,
   jamais un résultat de recherche, et **conclus locale par locale**.
2. **Une URL constructeur devinée renvoie souvent 200 avec le contenu d'un AUTRE produit.** En
   devinant le numéro d'article Trust, `.../product/23644-gxt-620-axon-…` sert un article traitant
   d'un autre appareil ; le bon identifiant est `24482`. Une mauvaise URL ne rend pas une erreur :
   elle rend une page crédible sur un autre appareil, donc une mise à jour datée, sourcée et
   fausse. **Vérifie toujours que le nom du modèle apparaît à l'identique dans le `<title>` ou le
   `<h1>` servi**, à l'orthographe de `scripts/faits-produits.md` ; nom non concordant = sonde
   nulle et non avenue. Deux corollaires mesurés : `edifier.com` répond **200** sur une URL
   inexistante avec `<title>404 page - Page not Found</title>` (le code HTTP ne veut rien dire
   sur ce domaine), et `fr.creative.com/p/speakers/inexistant-9999` répond 302 vers
   `/p/speakers` — **la même signature** qu'un vrai délistage.
3. **Un faux positif de fin de commercialisation est destructeur** : il pose « Fin de
   commercialisation » et `schema.org/Discontinued` sur un produit encore vendu et sort la fiche
   de toutes les recommandations. La Leviathan V2 Pro a failli y passer : absente de
   `razer.com/fr-fr`, « n'est plus en vente » chez LDLC et Materiel.net — mais toujours listée
   par Razer US avec réapprovisionnement, d'où son **`stock-limite`**. **Dans le doute,
   `stock-limite`. Jamais `fin-de-commercialisation`.**

Et jamais, sous aucun prétexte : **aucune requête HTTP vers `amazon.fr`**.

### 5.3 Au moins deux marchands français

Pour confirmer un signal constructeur, jamais pour le remplacer : `ldlc.com/recherche/<termes>/`,
`materiel.net/recherche/<termes>/`, `boulanger.com/resultats?tr=<termes>`,
`fnac.com/SearchResult/ResultList.aspx?Search=<termes>`. Ce que tu lis : le produit a-t-il **une
page marchande active** ? Dit-elle « n'est plus en vente » / « fin de série », ou « en rupture » ?
**Une rupture temporaire n'est pas une fin de commercialisation.** Un marchand inaccessible à
l'agent ne compte pas comme sonde : note-le, il n'entre pas dans le décompte des deux.

## Étape 6 — Décider la disponibilité : charge de la preuve asymétrique

| Ce que les sondes disent | Décision |
|---|---|
| Fiche FR vivante (200 + nom du modèle confirmé sur la page) | `disponible` — un seul signal suffit pour revenir |
| Absent en FR (fiche morte **ou** hors page de gamme) mais vivant sur une autre locale, **ou** au moins un marchand FR a encore une page active | `stock-limite` |
| Fiche morte sur **toutes** les locales sondées **et** absent de la page de gamme **et** deux marchands FR annoncent la fin de vente | `fin-de-commercialisation` |
| Un seul signal, signaux contradictoires, ou sonde impossible | **ne touche à rien, pas même `priceCheckedAt`** ; issue « signal unique de délistage » avec le produit, le signal et l'URL sondée |

**Borne : 2 basculements d'`availability` au maximum par passage.** Trois ou plus signalent un
problème de sonde (réseau, blocage d'UA, DNS) plus probablement qu'un mouvement de marché :
`git checkout -- src/data/soundbars.ts`, n'écris rien, ouvre une issue.

Quand un produit quitte `disponible` :

1. **Ne supprime jamais sa page.** Elle garde son référencement, et l'encart de
   `barres-de-son/[slug].astro` redirige l'intention du lecteur.
2. Renseigne `alternative` : le **slug** d'un produit encore `disponible` du catalogue.
   Alternative **éditoriale**, pas un successeur annoncé par la marque — « X remplace Y » sans
   que le constructeur l'ait dit serait une fausse preuve.
3. `availableSoundbarsByScore()` le sort de ce qui RECOMMANDE (accueil, sélection du mois, picks
   de guide) ; ce qui COMPARE (comparateur, index, pages marque) le garde — y voir un modèle
   retiré est une information utile.
4. **Plus d'issue « R3 : n° 1 indisponible » à ouvrir : la page est déjà protégée.**
   `resolveRankingItems()` (`src/data/rankings.ts`) fait descendre au rendu tout produit dont
   `availability` n'est pas `'disponible'`, dans le corps de la page **comme dans le schéma
   `ItemList`** ; le contrôle « Aucun classement ne place un produit indisponible avant un
   disponible » le vérifie sur le HTML servi. **Le basculement d'`availability` suffit.**
   Reste utile à signaler, et seulement dans ce cas : quand un `why` de classement, une phrase
   de guide ou un passage d'article **vend** encore le produit. C'est une réécriture
   éditoriale qui revient à R3, pas un risque structurel.

```bash
grep -rn "<slug-concerne>" src/data/rankings.ts src/data/guides.ts src/data/monthly.json src/content/blog/
```

## Étape 7 — Fourchette de gamme : `price` et `priceCheckedAt`

`price` n'est **jamais affiché** : il n'alimente que `priceBand()` — entrée 30–80 €, milieu
80–200 €, haut 200–450 € (`src/lib/prix.ts`). Le lecteur voit la **bande**, avec sa date. Où
relever, dans cet ordre : prix public de la fiche constructeur (table 5.1), puis deux marchands
au moins (table 5.3). **Jamais Amazon.**

- `priceCheckedAt` = date du jour (`AAAA-MM-JJ`) **si et seulement si le produit a été
  effectivement sondé**. Redater une fiche non sondée affiche une date fausse au lecteur.
- Écris `price` seulement si l'écart **change la bande**, ou dépasse **15 %** ; en dessous, c'est
  du bruit dans le diff.
- Un écart au-delà de **60 %** n'est pas un changement de prix mais une erreur de relevé
  (mauvaise référence, pack, accessoire) : ne l'écris pas, ouvre une issue.

Le plus gros écart du 07/09/2026 : Katana V2X à 199 € au dépôt contre 259,99 € chez le
constructeur — elle change de bande, milieu → haut. C'est le cas qui justifie le champ.

## Étape 8 — Specs révisées

Source unique recevable : la **fiche constructeur** de la table 5.1, nom du modèle confirmé sur la
page servie. Recoupement en second rideau, pour une spec seulement et jamais pour une
disponibilité : `clubic.com`, `tomshardware.fr`, `techradar.com`, `rtings.com`, `soundguys.com`.
**Ne cite jamais une URL que tu n'as pas ouverte dans l'exécution en cours.**

**Ce que R2 corrige seule** — borne : **6 champs au maximum par produit et par passage** ;
au-delà, la fiche entière est suspecte → issue, aucune écriture : `powerRmsWatts`,
`powerPeakWatts`, `frequencyResponse`, `dimensionsCm`, `driverConfig`, `connectivity`,
`hasSubwoofer`, `hasMicrophone`, `hasRGB`, `releaseYear`, `manualUrl`.

Cas déjà rencontré : **si le constructeur ne publie aucune valeur, supprime le champ — mais
seulement s'il est OPTIONNEL.** Razer ne publie aucune puissance pour la Leviathan V2 et le
« 65 W » du dépôt ne venait d'aucune source : `powerRmsWatts` retiré **et** mention supprimée du
`summary` — une spec retirée du champ mais laissée dans la prose reste publiée.

⚠ **La liste de onze champs ci-dessus mélange requis et optionnels.** Vérifié dans
`src/data/types.ts` :

- **Supprimables**, parce que réellement optionnels (`?`) : `powerRmsWatts`, `powerPeakWatts`,
  `frequencyResponse`, `manualUrl` — et, hors du périmètre de correction de R2, `amazonAsin`,
  `gallery`, `alternative`. Ce sont les **sept seuls** champs optionnels de `Soundbar`.
- **REQUIS, jamais supprimés** : `dimensionsCm`, `driverConfig`, `connectivity`,
  `hasSubwoofer`, `hasMicrophone`, `hasRGB`, `releaseYear`.

Supprimer un champ requis casse `npm run check` en **`ts(2741)`**. Si le constructeur ne publie
plus une valeur requise, **laisse la valeur en place et ouvre une issue** : ne vide pas le champ.

⚠ **`connectivity` est une union FERMÉE de sept valeurs** (`ConnectivityType`,
`src/data/types.ts`) : `'USB-C'`, `'USB-A'`, `'Bluetooth'`, `'Jack 3.5mm'`, `'Optique'`,
`'HDMI ARC'`, `'Wi-Fi'`. **Rien d'autre.** Relever « HDMI eARC » ou « LDAC » sur une fiche
constructeur et l'écrire dans `connectivity` **casse le build**. Une connectique non listée se
mentionne dans `driverConfig` ou dans le `summary`, **jamais** dans `connectivity` — et élargir
l'union est un arbitrage humain : issue, aucune écriture.

**Ce qui exige un arbitrage humain** — R2 relève l'écart, ouvre une issue, **n'écrit rien** :
`scores.*`, `verdict`, `summary`, `pros`, `cons`, `bestFor`, `name`, `brand`, `slug`, le choix
d'`alternative` quand plusieurs candidats se valent, `image` / `imageAlt` / `gallery`, `tutorial`.

**Ce que R2 REFUSE de produire, faute d'avoir le produit en main. Catégorique :**

- **Les 5 sous-notes de `scores` sont un jugement, pas une mesure.** Attribuées à l'écoute par un
  humain ; la grille 40/30/20/5/5 de `src/lib/notation.ts` a été retrouvée *par régression* sur
  ces notes, elle ne les remplace pas. R2 modifie **zéro** sous-note par passage.
- **Le `tutorial`** — un tutoriel d'installation décrit des gestes qu'on a faits ; R2 ne les a
  pas faits.
- **La photo produit.** `scripts/assign-photo.mjs` écrit `cover` dans le frontmatter d'un article
  de blog, il ne sait rien faire pour un produit : ne l'appelle pas ici. Et ne réutilise jamais
  la `gallery` d'un autre modèle — une photo du prédécesseur présentée comme le nouveau modèle
  est une preuve fabriquée.
- **Toute mesure non publiée par le constructeur** : dB SPL, distorsion, latence, autonomie.
  Elles n'existent nulle part dans le dépôt et ne s'estiment pas.

## Étape 9 — Nouvelle version d'un produit du catalogue

Déclencheur : l'étape 4.1 fait apparaître, sur la page de gamme de la marque, un modèle qui
**succède visiblement** à l'un des 13 (Katana V2 → V3, Leviathan V2 → V3…).

1. **Sonde la fiche du nouveau modèle** comme à l'étape 5, sur deux locales. Nom confirmé sur la
   page servie, sinon on s'arrête là.
2. **R2 ne peut créer la fiche que si les deux conditions sont réunies :** même `connectivity`
   que le prédécesseur, **et** prédécesseur basculé au même passage. Sinon : issue « nouveau
   modèle à intégrer » avec toutes les specs relevées, et **aucune écriture**.
3. **Crée l'entrée en fin de tableau `saisie`** — jamais au milieu, l'ordre de déclaration décide
   des égalités de note (étape 10). Champs obligatoires : `slug`, `name`, `brand`, `price`,
   `currency`, `scores`, `verdict`, `summary`, `pros`, `cons`, `bestFor`, `connectivity`,
   `driverConfig`, `hasSubwoofer`, `hasMicrophone`, `hasRGB`, `dimensionsCm`, `image`,
   `imageAlt`, `tutorial`, `lastUpdated`, `priceCheckedAt`, `availability`, `releaseYear`.
   Jamais `score`.
4. **Hérédité déclarée, pas invention.** `scores` et `tutorial` sont **copiés à l'identique**
   depuis le prédécesseur (seul le nom change dans `tutorial.intro`), et une issue « sous-notes
   et tutoriel provisoires hérités » est ouverte **dans le même passage**. Fiche provisoire
   assumée, pas jugement neuf : le prédécesseur quitte les recommandations, la note héritée ne
   fabrique donc aucun classement. `verdict`, `summary`, `pros`, `cons`, `bestFor` sont rédigés
   **uniquement** depuis les specs relevées, au conditionnel du papier.
5. **Illustration : pas de photo**, un gabarit SVG générique comme les placeholders existants.
   `image` pointe dessus (`/images/products/<slug>.svg` — le gabarit rend un `<img src>` brut, le
   SVG passe) et `imageAlt` reste descriptif, sans promettre une photo.
   ```bash
   cp public/images/products/edifier-g1500.svg public/images/products/<nouveau-slug>.svg
   # puis edite l aria-label et le nom du modele dans le fichier
   ```
6. **Bascule le prédécesseur** selon l'étape 6, `alternative` = slug du nouveau modèle. **Ne
   supprime pas sa page.**
7. **Borne : un seul nouveau produit par passage.** Deux le même lundi → le premier, le second
   en issue.

## Étape 10 — Conséquence en cascade

Modifier un `scores.*` recalcule `score` via `scoreFromBreakdown()`, donc **réordonne** tout ce
qui trie par note : `src/pages/index.astro` (top 3 de l'accueil), `comparateur/index.astro`,
`barres-de-son/index.astro`, `marques/[brand].astro` et **`src/pages/llms.txt.ts`** — le fichier
que lisent les moteurs génératifs. C'est la raison de l'interdiction de l'étape 8. Deux effets
restent déclenchables par un `availability` ou un `price` :

- **Les égalités de note.** Deux produits sont à 8,6 (`razer-leviathan-v2` et
  `creative-sound-blaster-katana-v2`) : leur ordre relatif vient de l'ordre de déclaration dans
  `saisie`. **Ne réordonne jamais le tableau** — ce serait un changement de classement invisible
  dans le diff.
- **Le top 3 recommandé.** Compare avant / après :

```bash
node -e "
const t=require('fs').readFileSync('src/data/soundbars.ts','utf8');
const W={son:.4,basses:.3,ergonomie:.2,connectique:.05,rapportQualitePrix:.05};
const re=/slug: '([^']+)'[\s\S]*?scores: \{([^}]+)\}[\s\S]*?availability: '([^']+)'/g;let m,r=[];
while((m=re.exec(t))){const o={};m[2].split(',').forEach(p=>{const[k,v]=p.split(':');if(k)o[k.trim()]=parseFloat(v)});
let s=0;for(const k in W)s+=o[k]*W[k];r.push({slug:m[1],score:Math.round(s*10)/10,av:m[3]});}
r.sort((a,b)=>b.score-a.score);r.forEach(x=>console.log(x.score.toFixed(1),x.av.padEnd(24),x.slug));
console.log('--- top 3 recommande ---');
r.filter(x=>x.av==='disponible').slice(0,3).forEach(x=>console.log(x.score.toFixed(1),x.slug));"
```

Si le top 3 recommandé change de composition, issue « R3 : top 3 modifié » en même temps que le
commit. R2 ne réécrit ni classement, ni sélection du mois, ni prose. **`lastUpdated`** ne bouge
que si le contenu **éditorial** a changé (specs, prose) : un simple relevé met à jour
`priceCheckedAt`, **pas** `lastUpdated` — redater une fiche qu'on n'a pas retravaillée est une
fausse fraîcheur.

## Étape 11 — Vérifier, dans cet ordre

```bash
npm run check                    # 0 erreur exigee — c est LUI qui refuse un champ inexistant
npm run build                    # doit passer (66 pages) ; s il echoue, corrige, ne publie pas
node scripts/verifie-rendu.mjs   # 17 controles sur le HTML servi — un seul ✗ et on ne pousse pas
git diff src/data/soundbars.ts
```

L'ordre n'est pas cosmétique. **`npm run build` seul ne suffit pas** : un champ inventé passe le
build en vert et part en production ; c'est `npm run check` qui le refuse en `ts(2353)`. Et
`verifie-rendu.mjs` doit tourner **après** le build puisqu'il lit `dist/` : il porte les 17
invariants que rien d'autre ne vérifie (test physique, `rel="sponsored nofollow"`,
`Disallow: /go/`, `Offer` à prix figé, fiches qui datent leur gamme, année en dur dans un
`<title>`, classement qui place un indisponible avant un disponible) — R2 édite `src/data/`,
donc R2 peut casser chacun, et **aucun autre playbook ne l'appelle à ta place.**
**Nomme toujours le contrôle en échec par son libellé, jamais par son numéro** : les numéros du
rapport sont positionnels et se décalent au premier contrôle ajouté. Relis ensuite le `git diff` ligne à ligne : toute ligne modifiée hors de
ton plan est une erreur à annuler, reformulation involontaire comprise.

**Bornes : 3 tentatives** pour faire passer `npm run check` ou `verifie-rendu.mjs`, **2** pour le
build. Au-delà, abandon propre — aucun commit :

```bash
git checkout -- src/data/soundbars.ts   # + tout autre fichier touche
git status --porcelain                  # doit etre vide
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R2 — Abandon du $(date +%F) : controle qualite insatisfaisable" \
  --body "3 tentatives epuisees. Derniere sortie : <coller>. Aucun commit, arbre propre."
```

L'abandon **avec** issue est acceptable ; l'abandon silencieux ne l'est pas. Ne boucle pas
au-delà des bornes : une session consommée en entier ne publie rien du tout.

## Étape 12 — Publier sur `main`

```bash
# 12.1 — git status --porcelain, PAS git diff --quiet : ce dernier ignore les fichiers
#        NON SUIVIS, et un SVG tout neuf passerait pour « rien a publier ».
if [ -z "$(git status --porcelain)" ]; then
  echo "Aucun changement : rien a publier. Fin normale de la routine."; exit 0
fi

# 12.2 — Chemins explicites, jamais git add -A.
git add src/data/soundbars.ts   # + public/images/products/<slug>.svg si l etape 9 en a cree un
git commit -m "Produits : sonde constructeur, gamme et disponibilite du $(date +%F)"

# 12.3 — Resynchronisation JUSTE AVANT le push. Sans elle, la seconde routine du jour
#        est rejetee et son travail part avec le clone.
git pull --rebase origin main || { echo "REBASE EN ECHEC — ne pas forcer"; exit 1; }

# 12.4 — Push. Code de sortie lu, jamais canalise dans un pipe.
git push origin HEAD:main

# 12.5 — Verification comparative : une ligne d apparence normale ne prouve rien, et
#        `git log origin/main` seul affiche une ref de suivi perimee.
git fetch origin
if [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ]; then
  echo "PUBLIE — $(git rev-parse --short HEAD)"
else
  gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
    --title "R2 — Push non publie du $(date +%F)" \
    --body "HEAD $(git rev-parse --short HEAD) != origin/main $(git rev-parse --short origin/main). Commit ecrit, non publie."
fi
```

**Si le rebase entre en conflit** : résous, refais **un seul** essai de push, second rejet →
issue et arrêt. **Jamais `git rebase --skip`** (il jette ton commit), jamais `git push --force`,
jamais `git pull --ff-only` comme reprise (il abandonne dès que la branche a divergé). Sur
`scripts/news-ledger.json` — que R2 n'écrit jamais, un conflit dessus vient de R1 : ne choisis
pas un côté, **garde les deux listes d'entrées**, fusionne les tableaux à la main, aucune entrée
supprimée, puis valide — un journal illisible est traité **comme vide en silence** par
`news-gate.mjs`, ce qui rouvre la porte à un doublon d'article :

```bash
node -e "JSON.parse(require('fs').readFileSync('scripts/news-ledger.json','utf8'));console.log('JSON valide')"
```

**Collisions.** R2 tourne à `0 5 * * 1`, R3 à `0 6 1,15 * *` : les 1er et 15 tombant un lundi
mettent R2 une heure avant R3, toutes deux sur `src/data/soundbars.ts` — le rebase-avant-push est
la seule protection. Règles fixes : **un seul commit par exécution**, **jamais de commit vide**,
**jamais de branche, de Pull Request ni de demande de validation**.

## Étape 13 — Compte rendu : toujours, même quand tout va bien

Seule trace qui distingue « R2 a tourné, rien à changer » de « R2 n'a pas tourné ». Ouvre-la même
si onze produits sur treize ont été contrôlés.

```bash
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R2 — Passage du $(date +%F)" \
  --body "gh disponible : oui/non | pages de gamme sondees : <n>/5
Produits sondes (rotation + promotions) : <slugs>
Non controlables et pourquoi (URL inconnue, reseau, soft-404) : <liste>
Basculements d availability, signaux locale par locale : <detail>
price / priceCheckedAt ecrits : <liste> | champs supprimes faute de source : <liste>
Specs corrigees, champ par champ, avec l URL ouverte : <detail>
Top 3 recommande : inchange / modifie -> <detail>
priceCheckedAt au-dela de 40 jours : <liste — alerte AVANT la bascule a 45>
Candidats a l ajout : <liste ou aucun> | Issues ouvertes : <numeros>
Publie : oui/non — commit <sha>"
```

## Le jour où une API produit sera disponible

Aujourd'hui, non : le compte Partenaires n'est pas validé, **aucun des 13 produits ne porte
d'`amazonAsin`**, et la PA-API historique est dépréciée. D'où la bande de gamme datée plutôt
qu'un prix. Prérequis, tous obligatoires avant de basculer :

1. Compte Partenaires **validé** (ventes qualifiantes réalisées), pas seulement créé.
2. Secrets côté CI, jamais dans le dépôt : clé d'accès, clé secrète, tag de tracking.
3. Les **13 `amazonAsin`** renseignés et vérifiés un par un — un ASIN faux relève le prix d'un
   autre produit et personne ne le voit.
4. **Cadence quotidienne obligatoire** : les conditions du programme encadrent la durée
   d'affichage d'une donnée de prix issue de l'API, qu'un relevé hebdomadaire ne tient pas.
5. **Effacement si le relevé échoue** : la donnée est **retirée** de l'affichage, jamais
   conservée « en attendant ». Le mécanisme existe déjà — `PRICE_FRESHNESS_DAYS`
   (`src/lib/prix.ts`) masque une donnée périmée depuis le gabarit et protège donc le site même
   quand plus aucune routine ne tourne ; c'est là qu'il faudra raccourcir la fenêtre.

Tant que ces cinq points ne sont pas réunis, R2 relève à la main, et `formatPrice()` reste
supprimé du code : la meilleure façon d'empêcher un affichage interdit est de supprimer la
fonction qui le produit.

## Garde-fous

1. **Aucune expérience physique revendiquée.** R2 n'a écouté aucune barre de son. « d'après les
   caractéristiques constructeur », « sur le papier », « d'après les mesures publiées par X ».
   Jamais « nous avons testé », jamais « à l'écoute, nous ». Règle la plus importante ;
   `verifie-rendu.mjs` la contrôle sur le HTML servi.
2. **Aucune preuve fabriquée** : ni avis client, ni témoignage, ni « recommandé par » sans
   source ; ni photo d'un autre modèle ; ni « X remplace Y » que la marque n'a pas dit.
3. **Aucun prix ni aucune note dans une prose** : rendus depuis la donnée, toujours datés. Une
   spec retirée d'un champ doit aussi disparaître du `summary`.
4. **`rel="sponsored nofollow"`**, passage par `/go/`, `Disallow: /go/` maintenu — R2 n'écrit pas
   de lien marchand mais vérifie que `verifie-rendu.mjs` le confirme.
5. **Ne jamais scraper `amazon.fr`.** Aucune requête, aucun prétexte.
6. **Ne jamais supprimer la page d'un modèle retiré** : `availability` + `alternative`.
7. **Orthographe des entités strictement identique partout** — `scripts/faits-produits.md` fait
   foi, y compris pour vérifier qu'une page constructeur parle du bon modèle.
8. **Une routine qui échoue le dit** : `gh issue create`, jamais d'échec silencieux, et un compte
   rendu même quand tout va bien.
9. **Zéro Pull Request, zéro branche, zéro demande de validation.**
10. **Pas de commit vide** — `git status --porcelain`, pas `git diff --quiet`.
11. **Ne jamais écrire une année en dur, ni un champ absent du schéma** : `annee()` pour le
    millésime ; `priceRange` n'existe pas ; `score` est calculé, jamais saisi.
