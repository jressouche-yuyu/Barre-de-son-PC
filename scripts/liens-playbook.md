# Playbook — R4 Santé des liens

**Routine R4 — Santé des liens — hebdomadaire — cron `0 6 * * 4` (UTC), jeudi.**

Ce fichier est le seul document vers lequel la routine est pointée : suis les étapes dans
l'ordre, n'improvise pas. Tous les blocs sont du **bash** (Git Bash sous Windows, `bash` sur
un runner) ; les blocs `node --input-type=module <<'EOF'` sont littéraux — ne retouche ni les
guillemets ni les `$`, et ils n'écrivent aucun fichier.

**Branche de déploiement : `main`.** `deploy.yml` ne se déclenche que sur un push vers
`main`. Zéro branche, zéro Pull Request, zéro demande de validation : une correction restée
ailleurs n'est pas publiée, c'est un échec.

## Ce que R4 fait — et ce qu'il ne refait pas

`node scripts/verifie-rendu.mjs` porte déjà **17 invariants** du HTML servi : les 15 URLs de
maillage de `news.config.mjs` présentes dans `dist/`, six pages de conformité, `llms.txt` et
son lien `/methodologie/`, gamme de prix datée sur les 13 fiches, aucun schéma `Offer` à prix
figé, `rel="sponsored nofollow"` sur tout lien marchand, `Disallow: /go/` dans `robots.txt`,
`noindex` sur les 13 pages `/go/`, absence de ces pages des sitemaps, aucune revendication de
test physique, mention d'affiliation reliée sur les 52 pages éditoriales, page d'archive des 2
éditions de la sélection du mois, canonique de l'édition courante, non-dérive des archives,
aucun millésime périmé dans les `title`, et **« Aucun classement ne place un produit
indisponible avant un disponible »** — garanti structurellement par `resolveRankingItems()`
(`src/data/rankings.ts`), corps de page et schéma `ItemList` compris. **R4 s'appuie dessus : ne
réimplémente aucun de ces contrôles à la main**, et **cite-les par leur libellé, jamais par
leur numéro** — les numéros du rapport sont positionnels et se décalent au premier contrôle
ajouté. Il traite les quatre angles morts que ce script ne couvre pas :

| Angle mort | Pourquoi R4 |
|---|---|
| Liens internes des articles publiés | 3 à 5 par article, ils s'accumulent à chaque publication de R1 |
| **URLs des `sources` en frontmatter** | **personne ne les surveille — un lien mort à 3 mois n'est vu par personne** |
| Forme des destinations `/go/` | base64 décodable, tag partenaire présent, nom de produit exactement orthographié |
| Dette du lien pilier | 4 des 5 articles ne pointent pas vers `/classements/meilleures-barres-de-son-pc/` |

Les sources sont la vraie valeur ajoutée de R4 : le site ne teste rien physiquement, sa
crédibilité tient entièrement à la traçabilité de ce qu'il avance.

**État mesuré le 07/09/2026 :** les 15 URLs internes du maillage répondaient 200 — le stock
de liens morts est à **zéro aujourd'hui**. Il grossira mécaniquement à mesure que les
articles s'accumulent : R4 existe pour que cet état reste vrai, pas pour le découvrir.

**Périmètre d'écriture — strict.** R4 n'écrit que dans `src/content/blog/*.md` (liens
internes, ancres, URLs de `sources`), `public/robots.txt` (`Disallow: /go/`) et
`scripts/liens-journal.md` (étape 8). Tout le reste est hors périmètre, en particulier
`src/data/*.ts`, `src/pages/`, `src/lib/`, `src/consts.ts`, `scripts/news.config.mjs` et
`.github/` : R2 et R3 écrivent dans `src/data/`, une modification concurrente y coûte un push
perdu. Une anomalie qui vit dans ces fichiers part en **issue**, jamais en correction sauvage.

## Corrigé automatiquement vs. issue GitHub

| Anomalie | Traitement |
|---|---|
| Lien interne d'article vers une page absente de `dist/` | **corrigé** : réécrit vers la page équivalente existante, ou lien retiré si aucune |
| Article sans lien pilier, ou sans aucun lien interne | **corrigé**, un article par exécution (étape 5) |
| `Disallow: /go/` absent de `robots.txt` | **corrigé** |
| Source en 404/410 avec équivalent stable trouvé | **corrigé** : URL remplacée, `title` et `publisher` ajustés |
| Source en 404/410 sans équivalent | **issue** — ne jamais supprimer la source en silence |
| Source en 403 / timeout / erreur réseau | **rien** au 1er passage (faux positif fréquent), **issue** au 2e jeudi consécutif |
| Destination `/go/` non décodable, sans tag, ou nom mal orthographié | **issue** — la cause est dans `src/data/` ou `src/lib/`, hors périmètre |
| Un contrôle de `verifie-rendu.mjs` au rouge | **issue**, et arrêt sans commit si R4 n'en est pas la cause |
| URL de `news.config.mjs` en 404 | **issue** — le fichier est hors périmètre |

---

## Étape 0 — Vérifier le canal d'incident avant de travailler

Une routine qui ne peut pas alerter ne doit pas travailler : son échec serait invisible.

```bash
gh auth status >/dev/null 2>&1 \
  && echo "CANAL D INCIDENT : OK" \
  || { echo "CANAL D INCIDENT INDISPONIBLE — R4 s'arrête sans rien modifier"; exit 1; }

gh issue list --repo jressouche-yuyu/Barre-de-son-PC --state open --limit 30 \
  --search "in:title R4 Liens" --json number,title --jq '.[] | "\(.number)  \(.title)"'
```

Retiens cette liste : à l'étape 7, **n'ouvre pas une seconde issue pour une anomalie déjà
déclarée** — commente l'existante. Si `gh` tombe en cours d'exécution, note l'incident au
journal de l'étape 8 avec la mention `INCIDENT NON REMONTÉ`. Préfixe toutes tes issues par
`R4 Liens — `, jamais un autre numéro de routine.

---

## Étape 1 — Socle : `main` à jour, build, 17/17

```bash
git checkout main && git fetch origin && git pull --ff-only origin main
npm run check
npm run build
node scripts/verifie-rendu.mjs
```

`npm run check` doit afficher `0 errors`, `npm run build` construit **66 pages** en une dizaine
de secondes, `verifie-rendu.mjs` doit afficher **`17/17 contrôles au vert`**. Un rouge
**avant** toute modification n'est pas ton fait : ouvre une issue et arrête-toi là, sans rien
commiter.

⚠ **Deux compteurs différents, ne les confonds pas — et ne conclus pas à une régression.**
`npm run build` annonce « 66 page(s) built » : les pages **produites** par Astro.
`verifie-rendu.mjs` annonce « 67 pages HTML dans dist/ » : les fichiers `.html` **présents**,
dont `public/googlee99fdf6937227d8e.html` (vérification Google Search Console) simplement
recopié par le build sans compter comme une page. 66 et 67 sont donc tous les deux normaux.

```bash
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R4 Liens — verifie-rendu.mjs au rouge avant intervention" \
  --body "Sortie complète de node scripts/verifie-rendu.mjs sur main à jour, collée ici. R4 s'est arrêté sans modifier de fichier."
```

---

## Étape 2 — Liens internes des articles publiés

Chaque `](/...)` d'un article doit résoudre vers une page réellement construite dans
`dist/`. Le contrôle porte sur `dist/`, pas sur une liste écrite à la main.

```bash
node --input-type=module <<'EOF'
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const posts = readdirSync('src/content/blog').filter((f) => f.endsWith('.md'));
const resolves = (href) => {
  const clean = href.split('#')[0].replace(/^\/|\/$/g, '');
  if (clean === '') return true;
  return existsSync(join('dist', clean, 'index.html')) || existsSync(join('dist', `${clean}.html`));
};
let ko = 0, total = 0;
for (const p of posts) {
  const body = readFileSync(join('src/content/blog', p), 'utf8');
  const hrefs = [...body.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1]);
  const pilier = hrefs.some((h) => h.startsWith('/classements/meilleures-barres-de-son-pc/'));
  for (const h of hrefs) { total++; if (!resolves(h)) { console.log(`  x MORT ${p} -> ${h}`); ko++; } }
  console.log(`${pilier ? 'OK ' : '.. '}${p} — ${hrefs.length} liens internes${pilier ? '' : ' — SANS lien pilier'}`);
}
console.log(`\n${total - ko}/${total} liens internes résolus dans dist/.`);
EOF
```

Pour chaque `x MORT` : réécris le lien vers la page équivalente qui existe (une variante de
classement, un guide voisin) en gardant une ancre naturelle. Si aucune page n'y correspond,
retire le lien mais **garde la phrase** — ne mutile pas le texte pour sauver un lien. Un
article qui affiche `0 liens internes` est orphelin : il passe à l'étape 5.

---

## Étape 3 — Sources en 404 (le cœur de R4)

Les URLs de `sources` en frontmatter ne sont vérifiées par rien d'autre. Teste-les en HTTP
réel. `HEAD` d'abord, `GET` en repli quand le serveur refuse `HEAD`.

```bash
node --input-type=module <<'EOF'
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const UA = 'Mozilla/5.0 (compatible; barre-de-son-pc.fr link-health)';
const posts = readdirSync('src/content/blog').filter((f) => f.endsWith('.md'));
const rows = [];
for (const p of posts) {
  const fm = readFileSync(join('src/content/blog', p), 'utf8').split(/^---$/m)[1] ?? '';
  for (const m of fm.matchAll(/url:\s*["']?(https?:\/\/[^"'\s]+)/g)) rows.push({ p, url: m[1] });
}
for (const r of rows) {
  let code = 0;
  try {
    let res = await fetch(r.url, { method: 'HEAD', redirect: 'follow', headers: { 'user-agent': UA }, signal: AbortSignal.timeout(20000) });
    if ([403, 405, 501].includes(res.status)) {
      res = await fetch(r.url, { method: 'GET', redirect: 'follow', headers: { 'user-agent': UA }, signal: AbortSignal.timeout(20000) });
    }
    code = res.status;
  } catch { code = 0; }
  console.log(`${code === 200 ? 'OK ' : 'KO '}${code || 'ERR'}  ${r.p} -> ${r.url}`);
}
console.log(`\n${rows.length} sources testées.`);
EOF
```

Référence mesurée le 08/09/2026 : **4 sources testées, 4 en 200** — seul
`comprendre-puissance-barre-de-son-watts.md` en porte. Ce stock grossit de 2 à 4 URLs par
article publié : cette étape devient la plus utile avec le temps.

Lecture des codes, sans se tromper de diagnostic :

- **200** (redirections comprises, `redirect: 'follow'` les suit) — rien à faire.
- **404 / 410** — la page a disparu. Cherche l'équivalent chez **le même éditeur** (même
  publisher, même sujet). Trouvé et stable → remplace `url`, réaligne `title` et
  `publisher`. Pas trouvé → **issue**, et laisse la source en place : une source retirée,
  c'est une affirmation devenue non sourcée.
- **403 / 429 / `ERR`** — presque toujours un blocage anti-bot ou un incident passager, pas
  une disparition. **Ne touche à rien** au premier passage, note-le au journal ; issue si le
  même code revient le jeudi suivant.
- **500-599** — panne de l'éditeur, jamais ton problème : journal seulement.

```bash
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R4 Liens — source en 404 sans remplaçant" \
  --body "Article src/content/blog/<slug>.md — source <titre> / <url> / <publisher> — code 404 vérifié le <AAAA-MM-JJ>. Recherche d'équivalent chez le même éditeur infructueuse. La source est laissée en place : la retirer rendrait l'affirmation non sourcée. Décision humaine attendue."
```

**Attention au schéma** (`src/content.config.ts`). Le frontmatter blog n'accepte que
`title`, `metaTitle`, `description`, `publishedAt`, `updatedAt`, `tags`, `readingMinutes`,
`cover`, `coverAlt`, `draft`, `faq`, `sources`. Une entrée de `sources` n'a que trois clés :
`title`, `url` (URL valide, contrôlée par Zod) et `publisher` (facultatif). Toute autre clé
passe le build sans erreur et ne sert à rien. R1 exige **2 sources minimum, dont une non
marchande** : ne descends jamais sous ce seuil. Renseigne `updatedAt` à la date du jour sur
tout article modifié, et n'écris jamais une année en dur ailleurs que dans un champ de date.

---

## Étape 4 — Forme des destinations `/go/`

Les 13 pages `/go/` encodent la destination Amazon en base64, coupée sur plusieurs lignes
par le formateur HTML : le décodage doit retirer les blancs avant `Buffer.from`.

```bash
node --input-type=module <<'EOF'
import { readFileSync, readdirSync } from 'node:fs';
const TAG = 'jrgrowth-21';
const faits = readFileSync('scripts/faits-produits.md', 'utf8');
const dirs = readdirSync('dist/go', { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
let ko = 0;
for (const d of dirs) {
  const html = readFileSync(`dist/go/${d}/index.html`, 'utf8');
  const m = html.match(/enc\s*=\s*"([^"]+)"/);
  if (!m) { console.log(`KO ${d} — base64 introuvable`); ko++; continue; }
  const dest = Buffer.from(m[1].replace(/\s+/g, ''), 'base64').toString('utf8');
  const nom = decodeURIComponent((dest.match(/[?&]k=([^&]*)/) ?? [, ''])[1]);
  const pbs = [];
  if (!dest.startsWith('https://www.amazon.fr/')) pbs.push('hote inattendu');
  if (!dest.includes(`tag=${TAG}`)) pbs.push('tag partenaire absent');
  if (nom && !faits.includes(nom)) pbs.push(`nom « ${nom} » absent de faits-produits.md`);
  if (pbs.length) { console.log(`KO ${d} — ${pbs.join(' / ')} — ${decodeURIComponent(dest)}`); ko++; }
  else console.log(`OK ${d} — ${decodeURIComponent(dest)}`);
}
console.log(`\n${dirs.length - ko}/${dirs.length} destinations /go/ conformes.`);
EOF
```

Référence mesurée : **13/13 conformes**. Aucun produit du catalogue n'a d'ASIN, donc toutes
les destinations sont des recherches `amazon.fr/s?k=<nom>&tag=jrgrowth-21` — c'est normal.
Toute ligne `KO` a sa cause dans `src/data/soundbars.ts`, `src/lib/affiliate.ts` ou
`src/consts.ts`, tous **hors périmètre R4** : ouvre une issue, ne corrige pas. Et **ne
visite jamais amazon.fr** — le contrôle porte sur la forme de l'URL, pas sur ce qu'elle
renvoie.

Vérifie au passage la ligne de blocage, la seule chose que R4 puisse corriger ici :

```bash
grep -q "Disallow: /go/" public/robots.txt && echo "robots.txt : OK" \
  || echo "A CORRIGER : ajouter 'Disallow: /go/' dans public/robots.txt"
```

---

## Étape 5 — Résorber la dette du lien pilier : un article par exécution

**Dette connue, mesurée le 07/09/2026 :** sur les 5 articles, seul
`comprendre-puissance-barre-de-son-watts.md` pointe vers la page pilier
`/classements/meilleures-barres-de-son-pc/`. Les quatre autres —
`5-reglages-windows-ameliorer-son-barre.md`, `barre-de-son-ou-casque-teletravail.md`,
`son-spatial-pc-thx-super-x-fi.md`, `usb-jack-bluetooth-quelle-connexion-audio-pc.md` — n'ont
**aucun lien interne du tout**.

**Traite exactement UN article par exécution**, le plus ancien d'abord (la liste `..` de
l'étape 2 te le donne). Quatre exécutions suffisent ; réécrire les quatre d'un coup produit
un diff illisible et un risque de conflit avec R1. Sur l'article retenu, insère **3 à 5 liens
internes** dans le corps du texte, dont obligatoirement le pilier, en piochant dans le
maillage vérifié de `news.config.mjs` (`strategicPage` + les 14 `secondaryLinks`).

Règles d'insertion, non négociables :

- Le lien vit **dans une phrase existante**, ou dans une phrase de transition que tu écris.
  Jamais une liste « À lire aussi » collée en fin d'article.
- **Ancre descriptive**, jamais « cliquez ici » ni l'URL nue. Reprends le `topic` de
  `news.config.mjs` : « les critères de choix », « les modèles avec caisson de basses ».
- **Un seul lien vers une même destination** par article, et **aucun lien vers `/go/`** :
  `/go/` ne se rejoint que par un bouton d'achat du gabarit produit.
- Aucun prix, aucune note dans la prose ajoutée (note **calculée** par
  `scoreFromBreakdown()`, gamme rendue datée depuis la donnée) ; aucune expérience physique
  revendiquée : « d'après les caractéristiques constructeur », « sur le papier », jamais
  « nous avons testé ».
- Renseigne `updatedAt` à la date du jour. Modèle à imiter : le dernier paragraphe de
  `comprendre-puissance-barre-de-son-watts.md`, trois liens dans une seule phrase.

---

## Étape 6 — Reconstruire et revérifier — trois tentatives, pas plus

```bash
npm run check && npm run build && node scripts/verifie-rendu.mjs
```

Puis **relance le bloc de l'étape 2** sur le `dist/` fraîchement reconstruit. Tu dois obtenir
`0 errors`, un build vert, `17/17 contrôles au vert` et zéro ligne `x MORT`.

**Sortie de boucle obligatoire.** Compte tes tentatives. **Au bout de 3 tentatives
infructueuses : abandon propre** — aucun commit, arbre restauré, et une issue :

```bash
git checkout -- . && git status --porcelain
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R4 Liens — abandon après 3 tentatives" \
  --body "Contrôle insatisfaisable après 3 tentatives. Aucun commit, arbre restauré. Détail des trois tentatives et dernière sortie collés ici."
```

---

## Étape 7 — Ouvrir les issues restantes

Une par anomalie non corrigée. Si l'anomalie figure déjà dans la liste de l'étape 0,
**commente** au lieu de rouvrir : une anomalie persistante ne se redéclare pas chaque jeudi.

```bash
gh issue comment <numéro> --repo jressouche-yuyu/Barre-de-son-PC \
  --body "Toujours présent au passage R4 du $(date -u +%Y-%m-%d). Code HTTP inchangé."
```

---

## Étape 8 — Journal

Une ligne par exécution dans `scripts/liens-journal.md` (crée le fichier s'il n'existe pas —
il n'existe pas encore). C'est la seule trace d'un passage sans correction, et un passage
sans correction est un fonctionnement **normal**, pas un échec.

```bash
[ -f scripts/liens-journal.md ] || printf '# Journal R4 — santé des liens\n\n' > scripts/liens-journal.md
printf -- '- %s — liens internes : %s / sources : %s / go : %s / pilier : %s / issues : %s\n' \
  "$(date -u +%Y-%m-%d)" "<n/n résolus>" "<n testées, n en 404>" "<13/13>" "<slug traité ou ->" "<numéros ou aucune>" \
  >> scripts/liens-journal.md
tail -3 scripts/liens-journal.md
```

---

## Étape 9 — Commiter, resynchroniser, pousser, **prouver que le push a eu lieu**

`git diff --quiet` **ignore les fichiers non suivis** : un fichier créé passerait pour
« rien à publier ». Utilise `git status --porcelain`, qui liste aussi les `??`.

```bash
git status --porcelain
```

Sortie vide → rien à publier, **pas de commit vide** : R4 s'arrête ici. Sinon, commite
uniquement ton périmètre, puis resynchronise **avant** de pousser — R1, R2 et R3 poussent sur
`main` aussi, et R3 tourne à la même minute que R4 quand le 1er ou le 15 tombe un jeudi
(2026-10-01, 2026-10-15, 2027-04-01, 2027-04-15, 2027-07-01, 2027-07-15) :

```bash
git add src/content/blog public/robots.txt scripts/liens-journal.md
git commit -m "R4 liens : <ce qui a changé, une ligne>"
git pull --rebase origin main
git push origin main
```

Conflit sur `scripts/liens-journal.md` ou sur `scripts/news-ledger.json` (R1 le touche à
chaque publication) : **garde les deux listes d'entrées**, jamais `git rebase --skip` — un
journal tronqué ou illisible est traité comme vide **en silence**, et le garde-fou
anti-doublon disparaît sans bruit. Résous, `git add`, `git rebase --continue`.

Puis prouve le push. Une ligne de sortie d'apparence normale ne prouve rien :

```bash
git fetch origin
LOCAL=$(git rev-parse HEAD); REMOTE=$(git rev-parse origin/main)
[ "$LOCAL" = "$REMOTE" ] \
  && echo "PUSH CONFIRME — $LOCAL" \
  || { echo "PUSH NON EFFECTIF — local $LOCAL != origin/main $REMOTE"; \
       gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
         --title "R4 Liens — push non effectif sur main" \
         --body "Après git pull --rebase puis git push, HEAD local ($LOCAL) diffère d'origin/main ($REMOTE). Le travail de R4 n'est pas déployé."; }
```

Si le push est rejeté deux fois de suite un 1er ou un 15 tombant un jeudi, c'est la
collision avec R3 : dis-le dans l'issue.

---

## Garde-fous

1. **Aucune expérience physique revendiquée** — la règle la plus importante. R4 n'a écouté
   aucune barre de son : les phrases de transition de l'étape 5 disent « d'après les
   caractéristiques constructeur », « sur le papier », « d'après les mesures publiées par
   X ». Jamais « nous avons testé », « à l'écoute, nous ». Invariant 11 de `verifie-rendu.mjs`.
2. **Aucune preuve fabriquée.** Ni avis client, ni témoignage, ni « recommandé par » dans une
   ancre. Une source de remplacement se **vérifie en HTTP** avant d'être écrite ; on n'invente
   jamais une URL plausible.
3. **Aucun prix ni aucune note dans la prose ajoutée.** La note est calculée par
   `scoreFromBreakdown()`, la gamme rendue datée depuis `src/lib/prix.ts`. Le champ
   `priceRange` **n'existe pas** : ne l'écris jamais.
4. **`rel="sponsored nofollow"`, passage par `/go/`, `Disallow: /go/` maintenu.** Aucun lien
   marchand en clair depuis un article ; aucun lien d'article vers `/go/`.
5. **Ne jamais scraper amazon.fr.** L'étape 4 contrôle la forme de l'URL décodée, pas la page
   d'arrivée.
6. **Ne jamais supprimer la page d'un modèle retiré.** Un lien interne vers une fiche
   `fin-de-commercialisation` reste valide : la page est servie et porte `availability` +
   `alternative`. Ne réécris pas ce lien vers l'alternative.
7. **Orthographe des entités strictement identique partout** — au caractère près par rapport
   à `scripts/faits-produits.md`, ancres comprises ; l'étape 4 le contrôle sur les 13 `/go/`.
8. **Une routine qui échoue le dit.** Issue GitHub, jamais d'échec silencieux : étape 0 avant
   tout travail, étape 7 pour le reste, journal à l'étape 8 même quand rien n'a changé.
9. **Zéro Pull Request, zéro branche, zéro demande de validation.** Commit direct sur `main`,
   push **prouvé** par la comparaison de l'étape 9.
10. **Pas de commit vide.** `git status --porcelain` vide → arrêt sans commit.
11. **Ne jamais écrire une année en dur, ni un champ absent du schéma.** Le millésime est
    calculé par `src/lib/millesime.ts` ; le frontmatter blog n'accepte que les douze champs
    listés à l'étape 3, et un champ inventé passe le build en faisant croire à un garde-fou
    inexistant.

**Incertitude relevée, à ne pas prendre pour un outil disponible :** un commentaire de
`scripts/news.config.mjs` renvoie vers `node scripts/verifie-liens-config.mjs`, **script qui
n'existe pas** dans le dépôt. Le contrôle « Les 15 URLs de maillage de news.config.mjs existent
dans dist/ » de `verifie-rendu.mjs` couvre déjà le besoin : ne cherche pas à l'écrire, c'est
hors périmètre R4.
