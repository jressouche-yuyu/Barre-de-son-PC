# Playbook — R4 Santé des liens

**Routine R4 — Santé des liens.** Cadence : **hebdomadaire**, cron `0 6 * * 4` (UTC) —
jeudi, 8 h heure de Paris en été, 7 h en hiver.

Ce fichier est le seul document vers lequel la routine est pointée. Il s'exécute sans
réflexion préalable : suis les étapes dans l'ordre, ne saute rien, n'improvise pas.

**Nomenclature de service, à ne pas confondre :** R1 = veille et blog
(`veille-playbook.md`), R2 = fiches produits (`produits-playbook.md`), R3 = classements et
sélection du mois (`classements-playbook.md`), **R4 = liens (ce fichier)**. Les anciens
en-têtes annonçaient l'inverse ; la référence est celle-ci. Titre tes issues avec le
préfixe `R4 Liens —`, jamais un autre numéro.

**Branche de déploiement : `main`.** `.github/workflows/deploy.yml` ne se déclenche que sur
un push vers `main`. Ni branche de travail, ni Pull Request, ni demande de validation. Une
correction restée ailleurs n'est pas publiée : c'est un échec.

**Tous les blocs de ce fichier sont du bash** (Git Bash sous Windows, `bash` sur un
runner). Les blocs `node --input-type=module <<'EOF'` sont des documents littéraux : ne
retouche ni les guillemets ni les `$`, le shell ne les interprète pas.

## Périmètre d'écriture de R4 — strict

R4 n'écrit que dans **trois** endroits :

| Chemin | Ce que R4 y fait |
|---|---|
| `src/content/blog/*.md` | maillage interne : ajouter ou réécrire un lien, corriger une ancre, corriger une URL de `sources` |
| `public/robots.txt` | maintenir `Disallow: /go/` |
| `scripts/liens-journal.md` | une ligne de journal par exécution (étape 9) |

Tout le reste est **hors périmètre**, y compris `src/data/*.ts`, `src/pages/`, `src/lib/`,
`src/consts.ts`, `scripts/news.config.mjs` et `.github/`. Une anomalie qui vit dans ces
fichiers part en issue, jamais en correction sauvage : R2 et R3 écrivent dans `src/data/`,
et une modification concurrente y coûte un push perdu.

---

## Étape 0 — Vérifier le canal d'incident, puis seulement travailler

Une routine qui ne peut pas alerter ne doit pas travailler : son échec serait invisible.

```bash
gh auth status >/dev/null 2>&1 \
  && echo "CANAL D INCIDENT : OK" \
  || { echo "CANAL D INCIDENT INDISPONIBLE — R4 s'arrête sans rien modifier"; exit 1; }

gh issue list --repo jressouche-yuyu/Barre-de-son-PC --state open --limit 30 \
  --search "in:title R4 Liens" --json number,title --jq '.[] | "\(.number)  \(.title)"'
```

Retiens la liste des issues R4 déjà ouvertes : à l'étape 6, **n'ouvre pas une seconde issue
pour une anomalie déjà déclarée**. Une anomalie persistante se commente, elle ne se
redéclare pas chaque jeudi.

Si `gh` tombe **en cours** d'exécution, ne perds pas l'incident : ajoute-le au journal de
l'étape 9 avec la mention `INCIDENT NON REMONTÉ`, il sera commité avec le reste.

### Collision de cron connue

R3 tourne à `0 6 1,15 * *`, soit **la même minute que R4** quand le 1er ou le 15 tombe un
jeudi. Dates énumérées : 2026-01-01, 2026-01-15, **2026-10-01**, 2026-10-15, 2027-04-01,
2027-04-15, 2027-07-01, 2027-07-15. Ce n'est pas une raison de s'arrêter — l'étape 8
resynchronise avant de pousser — mais si le push est rejeté deux fois ces jours-là, c'est
l'explication : dis-le dans l'issue.

---

## Étape 1 — Se placer sur `main` à jour, construire, et lire le socle

```bash
git checkout main && git fetch origin && git pull --ff-only origin main
npm run check      # les types d'abord : un build vert ne prouve pas que la donnée est bien typée
npm run build      # un échec ici, avant toute modification, est déjà une panne
node scripts/verifie-rendu.mjs
```

`npm run check` doit afficher `0 errors`. `npm run build` construit 64 pages en une dizaine
de secondes. `node scripts/verifie-rendu.mjs` doit afficher **`12/12 contrôles au vert`**
(mesuré le 07/09/2026 sur 65 fichiers HTML).

### Ce que `verifie-rendu.mjs` couvre déjà — ne le refais pas à la main

Ces douze invariants portent sur le HTML réellement servi. R4 les **lit**, il ne les
reproduit pas :

| # | Invariant |
|---|---|
| 1 | Les 15 URLs de maillage de `news.config.mjs` (`strategicPage` + `secondaryLinks`) existent dans `dist/` |
| 2 | Les six pages de conformité sont servies |
| 3-4 | `llms.txt` est servi et renvoie vers `/methodologie/` |
| 5 | Les 13 fiches produit datent leur gamme de prix |
| 6 | Aucun schéma `Offer` avec un prix exact figé |
| 7 | Tout lien marchand **en clair** porte `rel="sponsored nofollow"` |
| 8 | `robots.txt` contient `Disallow: /go/` |
| 9 | Les 13 pages `/go/` sont en `noindex` |
| 10 | Aucune page `/go/` dans les sitemaps |
| 11 | Aucune revendication de test physique dans le HTML servi |
| 12 | Les 50 pages éditoriales relient la mention d'affiliation à `/politique-affiliation/` |

Le contrôle 1 remplace le script `verifie-liens-config.mjs` évoqué en commentaire dans
`news.config.mjs` : **ce script n'existe pas**, ne cherche pas à le lancer. Signale la
mention périmée dans l'issue de fin de passage, une seule fois.

**Attention au contrôle 7 : il est aujourd'hui vide de sens.** Mesuré :
`grep -rhoE 'href="https?://(www\.)?(amazon|amzn)\.[^"]*"' dist --include='*.html' | wc -l`
→ **0**. Tous les liens marchands passent par `/go/`, que ce contrôle ne regarde pas. Le
garde-fou 4 n'est donc **pas** couvert par l'outillage : c'est l'étape 3 de ce playbook qui
le tient. Ne prends jamais un `12/12` pour une preuve que les liens d'affiliation sont
conformes.

### Que faire si un contrôle est ✗ dès l'étape 1

Un ✗ **avant** toute modification signifie que le site publié est déjà cassé, par une autre
routine ou par une modification manuelle.

- **✗ contrôle 8** (`Disallow: /go/` absent) → dans le périmètre de R4 : corrige
  `public/robots.txt` à l'étape 6 et continue.
- **✗ contrôle 1** (une URL de `news.config.mjs` absente de `dist/`) → hors périmètre
  (`news.config.mjs` est gelé). Issue `R4 Liens — URL de maillage inexistante`, puis
  continue les autres étapes : les articles qui citent cette URL portent des liens morts et
  l'étape 2 les remontera.
- **✗ n'importe quel autre contrôle** → hors périmètre. Une issue, et **tu ne publies rien
  du tout cette semaine** : pousser par-dessus une régression de gabarit la rendrait plus
  difficile à isoler. Va directement à l'étape 9.

---

## Étape 2 — Liens internes morts

Le site est statique : un lien interne est mort si aucun fichier ne lui correspond dans
`dist/`. Le contrôle est **hors ligne**, donc sans faux positif de réseau.

```bash
BASE=dist
grep -rhoE 'href="(/[^"]*)"' "$BASE" --include='*.html' \
  | sed -E 's/^href="//; s/"$//' \
  | cut -d'#' -f1 | cut -d'?' -f1 \
  | sort -u \
  | while read -r p; do
      [ -z "$p" ] && continue
      case "$p" in
        /go/*) continue ;;   # traité à l'étape 3
        *.xml|*.svg|*.webp|*.png|*.jpg|*.jpeg|*.avif|*.ico|*.css|*.js|*.txt|*.pdf|*.html) f="$BASE$p" ;;
        *) f="$BASE${p%/}" ;;
      esac
      if [ -f "$f" ] || [ -f "$f/index.html" ] || [ -f "$f.html" ]; then :; else
        echo "LIEN INTERNE MORT : $p"
      fi
    done
echo "=== fin du scan (aucune ligne au-dessus = zéro lien mort) ==="
```

**Attendu aujourd'hui : zéro ligne.** Les 21 URLs internes du maillage ont été vérifiées le
07/09/2026 et les 14 `secondaryLinks` existent bien dans `dist/`. Le stock de liens morts
est à zéro **à cette date** — il grossira au rythme des articles publiés, chacun apportant
3 à 5 liens internes.

Pour savoir **quelle page** porte un lien mort remonté ci-dessus :

```bash
grep -rl 'href="<URL MORTE>"' dist --include='*.html'
```

Si la page fautive est un article de blog (`dist/blog/<slug>/`), la correction est dans le
périmètre de R4 (étape 6). Si c'est un guide, un classement, une fiche produit ou un
gabarit, c'est une issue : ces liens viennent de `src/data/` ou de `src/pages/`.

---

## Étape 3 — Forme des destinations d'affiliation `/go/`

C'est ici que se tient le garde-fou 4, puisque le contrôle 7 de `verifie-rendu.mjs` ne voit
rien (étape 1). Trois choses se vérifient, **par lecture de l'URL, sans jamais l'appeler** :
le décodage base64, la présence du tag partenaire, l'orthographe exacte du nom de produit.

```bash
node --input-type=module <<'EOF'
import fs from 'node:fs';

// Noms de référence, lus dans la donnée : slug puis name, sur deux lignes consécutives.
const src = fs.readFileSync('src/data/soundbars.ts', 'utf8');
const noms = {};
for (const m of src.matchAll(/slug:\s*'([^']+)',\s*\n\s*name:\s*'([^']+)'/g)) noms[m[1]] = m[2];

const TAG = 'jrgrowth-21';            // = AFFILIATE.partnerTag dans src/consts.ts
const dirs = fs.readdirSync('dist/go');
let ko = 0;
console.log(`produits en donnée : ${Object.keys(noms).length} · pages /go/ : ${dirs.length}`);
if (dirs.length !== Object.keys(noms).length) { console.log('✗ autant de pages /go/ que de produits : NON'); ko++; }

for (const slug of dirs) {
  const html = fs.readFileSync(`dist/go/${slug}/index.html`, 'utf8');
  const m = html.match(/const enc = "([A-Za-z0-9+/=]+)"/);
  if (!m) { console.log(`✗ ${slug} : aucune destination encodée`); ko++; continue; }
  let dest = '';
  try { dest = Buffer.from(m[1], 'base64').toString('utf8'); } catch { /* laissé vide */ }
  if (!/^https:\/\/www\.amazon\.fr\//.test(dest)) { console.log(`✗ ${slug} : destination illisible ou hors amazon.fr → ${dest}`); ko++; continue; }
  if (!dest.includes(`tag=${TAG}`)) { console.log(`✗ ${slug} : tag partenaire absent → ${dest}`); ko++; continue; }
  const k = new URL(dest).searchParams.get('k');
  const attendu = noms[slug];
  if (!attendu) { console.log(`✗ ${slug} : aucun produit de ce slug dans soundbars.ts`); ko++; continue; }
  if (k !== attendu) { console.log(`✗ ${slug} : nom encodé « ${k} » ≠ donnée « ${attendu} »`); ko++; continue; }
  console.log(`✓ ${slug} → k=${k}`);
}
console.log(ko === 0 ? 'FORME DES /go/ : conforme' : `FORME DES /go/ : ${ko} anomalie(s)`);
EOF
```

**Attendu aujourd'hui : 13 pages, 13 ✓, `FORME DES /go/ : conforme`.** Exemple de
destination décodée, vérifiée le 07/09/2026 :
`https://www.amazon.fr/s?k=Razer%20Leviathan%20V2&tag=jrgrowth-21`.

Puis le `rel` des liens qui mènent à `/go/`, et l'absence de lien marchand écrit à la main
dans la prose :

```bash
echo "liens vers /go/ au total     : $(grep -rhoE '<a [^>]*href="[^"]*/go/[^"]*"[^>]*>' dist --include='*.html' | wc -l)"
echo "liens /go/ sans le rel       : $(grep -rhoE '<a [^>]*href="[^"]*/go/[^"]*"[^>]*>' dist --include='*.html' | grep -vc 'rel="sponsored nofollow' || true)"
echo "liens /go/ écrits en prose   : $(grep -rn '](/go/' src/content/blog/ | wc -l)"
echo "liens amazon écrits en prose : $(grep -rniE '\]\(https?://(www\.)?(amazon|amzn)\.' src/content/blog/ | wc -l)"
```

Attendu : **13** liens `/go/`, et **0** aux trois autres lignes (mesuré le 07/09/2026). Le
`rel` réellement rendu est `rel="sponsored nofollow noopener"` : le contrôle porte sur le
**préfixe** `rel="sponsored nofollow`, pas sur une égalité stricte. Un `grep -c` qui ne
trouve rien sort en code 1 : c'est le résultat souhaité, d'où les `|| true` et le fait que
ces lignes ne sont jamais chaînées par `&&`.

Un lien marchand ou un lien `/go/` écrit à la main dans un article Markdown sort **sans**
`rel` : violation directe du garde-fou 4. Corrige-le à l'étape 6 en le remplaçant par un
lien interne vers la fiche produit `/barres-de-son/<slug>/`, qui porte elle-même le bouton
conforme.

### Pourquoi ces destinations ne se testent jamais en HTTP

Deux raisons mesurées, pas deux préférences :

- Aucun produit n'a d'ASIN (`grep -c amazonAsin src/data/soundbars.ts` → **0**) : toutes les
  destinations sont des **liens de recherche** `?k=<nom>&tag=…` (voir `src/lib/affiliate.ts`).
  Une page de recherche ne renvoie jamais 404 : le test n'apprendrait rien.
- Interroger `amazon.fr` est interdit par les conditions du programme Partenaires
  (garde-fou 5). Le garde-fou passe avant le contrôle.

La question « ce produit est-il encore commercialisé ? » appartient à **R2**, à la source
constructeur. R4 contrôle la **forme** des liens, R2 la **réalité commerciale**. Un doute
sur un produit → issue à destination de R2, jamais une requête vers Amazon.

---

## Étape 4 — Sources citées et profils déclarés : les liens sortants que personne ne surveille

Les `sources` du frontmatter portent toute la crédibilité du site : il n'écoute pas les
produits, il cite. Une source qui meurt trois mois après publication ne casse rien
visuellement et n'est vue par aucun contrôle existant — `news-check.mjs` compte les sources
et vérifie qu'elles ne sont pas marchandes, il n'interroge aucune URL. C'est le point le
plus fragile du maillage sortant.

```bash
node --input-type=module <<'EOF'
import fs from 'node:fs';

const dir = 'src/content/blog';
const items = [];
for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.md'))) {
  const m = fs.readFileSync(`${dir}/${f}`, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) { console.log(`✗ ${f} : frontmatter illisible`); continue; }
  for (const u of m[1].matchAll(/url:\s*['"]?(https?:\/\/[^'"\s]+)/g)) items.push({ slug: f.slice(0, -3), url: u[1] });
}
console.log(`sources citées : ${items.length}`);

const UA = 'Mozilla/5.0 (compatible; BarreSonPC-linkcheck/1.0)';
let ko = 0;
for (const it of items) {
  let code = 'ERR';
  let final = it.url;
  try {
    const r = await fetch(it.url, { redirect: 'follow', headers: { 'user-agent': UA }, signal: AbortSignal.timeout(20000) });
    code = String(r.status);
    final = r.url;
  } catch (e) { code = 'ERR-' + e.name; }
  const ok = code === '200';
  if (!ok) ko++;
  const drift = ok && final !== it.url ? `  (redirigée vers ${final})` : '';
  console.log(`${ok ? '✓ ' : '✗ '}${code}  ${it.slug}  ${it.url}${drift}`);
}
console.log(ko === 0 ? 'SOURCES : toutes en 200' : `SOURCES : ${ko} à traiter`);
EOF
```

**Attendu aujourd'hui : 4 sources, toutes en 200** — elles vivent toutes dans
`comprendre-puissance-barre-de-son-watts.md` ; les quatre autres articles n'en citent
aucune (voir l'étape 5). Ce nombre grossira de 2 à 4 par article publié : c'est la charge
de travail de R4 qui augmente vraiment d'ici un an.

### Comment lire un code de retour, sans fabriquer de preuve

| Code | Lecture | Action |
|---|---|---|
| `200` | vivante | rien |
| `200` + `(redirigée vers …)` sur le **même domaine** | l'éditeur a changé son URL | R4 réécrit l'URL vers la destination finale, **vérifiée en 200 dans cette exécution** |
| `200` + redirection vers un **autre domaine**, une page d'accueil ou une page de catégorie | l'article source a disparu | issue, pas de réécriture |
| `403`, `429` | refus de robot, pas un lien mort | ne touche à rien, mentionne-le dans l'issue comme « à vérifier à la main » |
| `ERR-TimeoutError`, `ERR-TypeError` | réseau | relance le bloc **une seule fois** ; si le code persiste, traite-le comme « à vérifier à la main » |
| `404`, `410` | morte | issue |

**Ne remplace jamais une source morte par une autre URL.** Une URL que tu n'as pas ouverte
dans cette exécution ne s'écrit pas : c'est le garde-fou 2. Et ne supprime pas l'entrée
`sources` non plus — elle documente ce sur quoi l'article s'appuyait. R4 remonte ; R1 ou le
propriétaire re-sourcent.

Contrôle enfin les profils déclarés dans le schéma `Organization` (`sameAs`), servis sur 51
pages :

```bash
node --input-type=module <<'EOF'
import fs from 'node:fs';
const src = fs.readFileSync('src/consts.ts', 'utf8');
const urls = [...src.matchAll(/(twitter|youtube|linkedin|facebook|instagram|mastodon)\s*:\s*'(https?:\/\/[^']+)'/g)].map((m) => m[2]);
for (const u of urls) {
  let code = 'ERR';
  try {
    const r = await fetch(u, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (compatible; BarreSonPC-linkcheck/1.0)' }, signal: AbortSignal.timeout(20000) });
    code = String(r.status);
  } catch (e) { code = 'ERR-' + e.name; }
  console.log(`${code === '200' ? '✓ ' : '✗ '}${code}  ${u}`);
}
EOF
```

**Mesuré le 07/09/2026 : les deux profils sont en 404** — `https://twitter.com/barresonpc`
et `https://www.youtube.com/@barresonpc`. Ils ne sont pas cliquables (ils ne vivent que
dans le `sameAs` du JSON-LD), mais un `sameAs` qui pointe vers un profil inexistant est un
signal d'entité faux, servi sur 51 pages. `src/consts.ts` est **hors périmètre** de R4 :
issue `R4 Liens — sameAs vers deux profils inexistants`, ouverte **une seule fois** (l'étape
0 t'a donné la liste des issues déjà ouvertes), en posant les deux options — créer les
comptes, ou retirer `SITE.social`.

### Ce qui ne se teste pas en HTTP, et pourquoi

- `amazon.fr` et `amzn.to` — garde-fou 5, jamais.
- `google.com/search?q=…` — les 13 fiches produit portent un lien « notice » de secours
  construit ainsi (`src/pages/barres-de-son/[slug].astro`). Une URL de recherche ne renvoie
  jamais 404 : la tester n'apprend rien et déclenche des 429.
- `schema.org`, `w3.org`, `googletagmanager`, `fonts.googleapis.com`, `fonts.gstatic.com`,
  `barre-de-son-pc.fr` — infrastructure, ou domaine propre.

---

## Étape 5 — Résorber la dette de maillage : un article par exécution

```bash
for d in dist/blog/*/; do
  s=$(basename "$d")
  if grep -q 'href="/classements/meilleures-barres-de-son-pc/"' "$d/index.html"; then
    echo "OK    $s"
  else
    echo "DETTE $s"
  fi
done
echo "--- liens internes dans la source Markdown ---"
for f in src/content/blog/*.md; do
  echo "$(grep -oE '\]\(/[^)]*\)' "$f" | wc -l)  $(basename "$f")"
done
```

**État mesuré le 07/09/2026 — c'est une dette, pas une panne :**

| Article | Liens internes | Pilier |
|---|---|---|
| `comprendre-puissance-barre-de-son-watts` | 4 | ✓ |
| `5-reglages-windows-ameliorer-son-barre` | **0** | ✗ |
| `barre-de-son-ou-casque-teletravail` | **0** | ✗ |
| `son-spatial-pc-thx-super-x-fi` | **0** | ✗ |
| `usb-jack-bluetooth-quelle-connexion-audio-pc` | **0** | ✗ |

Quatre articles sur cinq n'ont **aucun** lien interne : la dette ne se limite pas au lien
pilier manquant. Ces cinq articles de juin 2026 sont antérieurs à la règle de maillage.

**Traite exactement un article par exécution** — le premier de la liste `DETTE` par ordre
alphabétique, pour que la routine reste déterministe sans mémoire d'une semaine sur l'autre.
Quatre exécutions hebdomadaires soldent la dette.

### Comment réparer un article, sans rien réécrire d'autre

1. Ouvre `src/content/blog/<slug>.md` et lis-le en entier.
2. Choisis **4 destinations** : la page pilier `/classements/meilleures-barres-de-son-pc/`
   (obligatoire) plus 3 entrées de `config.secondaryLinks` (`scripts/news.config.mjs`) dont
   le `topic` colle réellement au sujet de l'article. Ces 15 URLs sont vérifiées à chaque
   build par le contrôle 1 de `verifie-rendu.mjs` : n'invente aucune autre destination.
3. Insère chaque lien **dans une phrase existante du corps**, avec une ancre descriptive —
   la valeur `topic` de la config est un bon point de départ (« notre classement des
   meilleures barres de son PC », « les critères de choix », « les limites du Bluetooth »…).
   Une ancre par URL, jamais deux fois la même ancre, jamais deux fois la même URL. Pas de
   bloc « À lire aussi » collé en fin d'article : un lien hors contexte ne vaut rien.
4. **Ne touche à rien d'autre.** Pas une phrase reformulée, pas un titre déplacé. Une
   réécriture est un acte éditorial, et le risque d'y glisser une revendication d'écoute
   (garde-fou 1) dépasse de loin le gain.
5. **Ne touche pas `updatedAt`.** Un ajout de liens ne révise pas le fond de l'article ;
   déplacer `updatedAt` publierait un `article:modified_time` qui promet une révision que
   le lecteur ne verra pas. La raison de la modification s'écrit dans le message de commit,
   pas sur la page. C'est la règle que R2 et R3 appliquent à `lastUpdated`.
6. Frontmatter : **exactement** les clés du schéma de `src/content.config.ts` — `title`,
   `metaTitle`, `description`, `publishedAt`, `updatedAt`, `tags`, `readingMinutes`,
   `cover`, `coverAlt`, `draft`, `faq`, `sources`. Rien d'autre. Et sache que ce schéma
   n'est **pas** `.strict()` : une clé inventée est silencieusement retirée au build, sans
   erreur — le build ne te rattrapera pas.

Vérifie ta réparation, et **seulement** ta réparation :

```bash
export SLUG=<slug-de-l-article>
node --input-type=module <<'EOF'
import fs from 'node:fs';
const slug = process.env.SLUG;
const body = fs.readFileSync(`src/content/blog/${slug}.md`, 'utf8').replace(/^---[\s\S]*?\n---/, '');
const liens = [...body.matchAll(/\[([^\]]+)\]\((\/[^)\s]*)\)/g)].map((m) => ({ ancre: m[1].trim(), url: m[2].replace(/\/$/, '') || '/' }));
const urls = liens.map((l) => l.url);
const ancres = liens.map((l) => l.ancre.toLowerCase());
const pilier = '/classements/meilleures-barres-de-son-pc';
const ok = [
  [new Set(urls).size >= 3 && new Set(urls).size <= 5, `3 à 5 URLs uniques (${new Set(urls).size})`],
  [urls.length === new Set(urls).size, 'aucune URL répétée'],
  [ancres.length === new Set(ancres).size, 'aucune ancre répétée'],
  [urls.includes(pilier), 'lien vers la page pilier'],
];
ok.forEach(([p, l]) => console.log(`${p ? '✓' : '✗'} ${l}`));
liens.forEach((l) => console.log(`    ${l.url}  « ${l.ancre} »`));
process.exit(ok.every(([p]) => p) ? 0 : 1);
EOF
```

Les bornes 3 et 5 sont celles de `config.internalLinks` (`{ min: 3, max: 5 }`) et du
contrôle 8 de `news-check.mjs` : elles ne s'inventent pas ici.

### `news-check.mjs` sur un article ancien : lis-le, ne boucle pas dessus

`node scripts/news-check.mjs src/content/blog/<slug>.md` t'informe utilement sur ses
contrôles **8** (« 3 à 5 liens internes, une ancre unique par URL ») et **9** (« Lien vers
la page pilier ») — le mandat de R4.

Mais les quatre articles de juin 2026 échouent **8 contrôles sur 17** pour des raisons
entièrement hors du périmètre de R4 : `metaTitle` absent, moins de 3 questions de FAQ,
moins de 2 sources, aucun tableau, aucun bloc `>` en citation, paragraphes d'ouverture trop
longs (mesuré sur `son-spatial-pc-thx-super-x-fi.md` : 9/17 au vert). **Ne cherche jamais à
les corriger** : ce serait réécrire l'article, donc produire du contenu — le travail de R1.
`news-check.mjs` sort en code 1 tant qu'un ✗ subsiste : **ne l'utilise pas comme condition
de sortie**, tu boucleras jusqu'à épuisement du budget. Le seul verdict qui compte pour R4
est le bloc de vérification ci-dessus.

Signale une fois, dans l'issue de fin de passage, que ces quatre articles restent non
conformes pour des motifs hors périmètre de R4.

---

## Étape 6 — Corriger : ce qui est automatique, ce qui part en issue

### Corrigé automatiquement par R4

| Anomalie | Correction |
|---|---|
| Lien interne mort **dans un article de blog** | réécriture vers la page équivalente existante (classement, guide), ou vers la page pilier à défaut d'équivalence. **Ne supprime pas le lien** : l'article doit conserver 3 à 5 liens internes |
| Ancre répétée, ou deux ancres différentes pour la même URL, **dans un article** | réécriture de l'ancre pour qu'elle décrive sa cible |
| Nom de produit mal orthographié dans une ancre ou une phrase **d'un article** | alignement sur `name` de `src/data/soundbars.ts`, à la lettre près (garde-fou 7) |
| Lien marchand, ou lien `/go/`, écrit à la main dans un article | remplacement par un lien interne vers `/barres-de-son/<slug>/` |
| URL de `sources` qui redirige en 200 vers le **même domaine** | réécriture vers l'URL finale, vérifiée dans cette exécution |
| `Disallow: /go/` absent de `public/robots.txt` | remise en place |
| Groupes de crawlers IA de `public/robots.txt` sans `Disallow: /go/` | ajout de la ligne dans chaque groupe (`GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Google-Extended`, `ClaudeBot`, `Applebot-Extended`). Mesuré le 07/09/2026 : la ligne n'existe que dans le groupe `User-agent: *`, donc ces sept agents sont autorisés à crawler `/go/`, et le contrôle 8 de `verifie-rendu.mjs` reste vert parce qu'il cherche la ligne n'importe où dans le fichier. Correction mécanique, sans arbitrage |
| Dette de maillage | un article par exécution (étape 5) |

### Ouvre une issue, et ne corrige pas

| Anomalie | Pourquoi |
|---|---|
| Source en 404 ou 410 | re-sourcer est un acte éditorial, et citer une URL non ouverte est interdit (garde-fou 2) |
| Source en 403 / 429 / timeout persistant | probablement vivante ; la déclarer morte serait faux |
| Lien mort dans un guide, un classement, une fiche produit ou un gabarit | vit dans `src/data/` ou `src/pages/`, hors périmètre, et R2/R3 y écrivent |
| Nom de produit mal orthographié dans `src/data/*.ts` ou `scripts/faits-produits.md` | hors périmètre : R2 tient la donnée produit |
| `sameAs` vers un profil inexistant (`src/consts.ts`) | hors périmètre ; créer ou retirer est une décision du propriétaire |
| URL de `news.config.mjs` absente de `dist/` (contrôle 1 ✗) | `news.config.mjs` est gelé |
| Doute sur la commercialisation d'un produit | c'est R2, à la source constructeur — jamais une requête Amazon |
| Destination `/go/` vide, illisible, sans tag, ou dont le nom ne correspond pas à la donnée | vient de `src/lib/affiliate.ts` ou de `src/data/soundbars.ts`, hors périmètre. **C'est l'anomalie la plus coûteuse du site** : titre l'issue `R4 Liens — URGENT destination d'affiliation cassée` |
| Contrôle de `verifie-rendu.mjs` ✗ autre que le 8 | régression de gabarit, hors périmètre (étape 1) |
| Absence de `schedule:` dans `.github/workflows/deploy.yml` | hors périmètre, et sans lui la péremption des gammes de prix ne s'arme jamais seule : rappelle-le dans l'issue de fin de passage |

Format d'issue — une par famille d'anomalie, jamais une par ligne :

```bash
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R4 Liens — <famille d'anomalie> du $(date +%F)" \
  --body "$(cat <<'BODY'
Constaté par R4, à partir de dist/ construit sur le HEAD du jour.

| Page / article | URL concernée | Constat (code, message) | Correction proposée |
|---|---|---|---|
| … | … | … | … |

Sortie brute des contrôles concernés :
<coller la sortie exacte, sans la résumer>
BODY
)"
```

Avant d'ouvrir, relis la liste de l'étape 0 : si une issue de la même famille est déjà
ouverte, **commente-la** (`gh issue comment <n> --body "…"`) au lieu d'en créer une seconde.

---

## Étape 7 — Revérifier, avec des bornes

```bash
npm run check
npm run build
node scripts/verifie-rendu.mjs
```

Les trois doivent passer : `0 errors`, build complet, `12/12 contrôles au vert`. Relance
aussi le scan de l'étape 2 : il doit rendre zéro ligne. Si tu as réparé un article,
relance son bloc de vérification de l'étape 5 : il doit sortir en code 0.

**Bornes de tentatives, non négociables :** 2 tentatives de correction maximum sur le build,
2 sur `verifie-rendu.mjs`. Au-delà :

```bash
git checkout -- src/content/blog public/robots.txt   # arbre propre : on ne publie pas un demi-travail
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R4 Liens — abandon après 2 tentatives du $(date +%F)" \
  --body "Sortie complète du dernier contrôle en échec, fichier ou article abandonné, et ce qui a été tenté."
```

puis va à l'étape 9. **Un abandon avec issue est un résultat acceptable ; un abandon
silencieux ne l'est pas.**

---

## Étape 8 — Publier sur `main`

```bash
# 1. Y a-t-il quelque chose à publier, dans le périmètre de R4 uniquement ?
#    --porcelain voit les fichiers non suivis, ce que « git diff --quiet » ignore.
git status --porcelain -- src/content/blog public/robots.txt scripts/liens-journal.md
```

Rien ne s'affiche → aucune correction à publier ; l'étape 9 ajoutera malgré tout sa ligne de
journal, et c'est elle qui sera commitée. Reviens alors ici après l'étape 9.

```bash
# 2. Chemins explicites : jamais « git add -A », qui embarquerait le travail
#    concurrent de R1, R2 ou R3 laissé dans l'arbre.
git add src/content/blog public/robots.txt scripts/liens-journal.md
git commit -m "Liens : <ce qui a changé, et pourquoi ce n'est pas une révision de fond>"

# 3. Resynchroniser JUSTE avant de pousser — pas à l'étape 1 : il s'est écoulé
#    un build, des requêtes HTTP et une réparation depuis.
git fetch origin && git rebase origin/main
```

**En cas de conflit de rebase :** `git rebase --abort`, n'insiste pas, ouvre une issue
`R4 Liens — rebase impossible du <date>` et arrête-toi. Le travail de R4 se refait à
l'identique jeudi prochain, ce qui n'est pas le cas d'un fichier mal fusionné. **Jamais
`git rebase --skip`, jamais de résolution manuelle.** Et jamais `git pull --ff-only` comme
moyen de reprise : il abandonne dès que la branche a divergé.

```bash
# 4. Pousser, et lire le code de sortie de git push lui-même — jamais dans un pipe.
git push origin HEAD:main
if [ $? -ne 0 ]; then
  git fetch origin && git rebase origin/main && git push origin HEAD:main   # un seul nouvel essai
fi

# 5. Vérification comparative : « git log origin/main » seul affiche une ref de
#    suivi périmée et fait passer un push rejeté pour un succès.
git fetch origin
if [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ]; then
  echo "PUBLIÉ : $(git rev-parse --short HEAD)"
else
  echo "NON PUBLIÉ — HEAD=$(git rev-parse --short HEAD) origin/main=$(git rev-parse --short origin/main)"
  gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
    --title "R4 Liens — push non publié du $(date +%F)" \
    --body "HEAD local et origin/main divergent après deux tentatives. Corrections perdues : <liste>."
fi
```

- **NE crée PAS de branche. NE crée PAS de Pull Request. NE demande PAS de validation** :
  l'autorisation de pousser sur `main` est permanente.
- **Un seul commit de corrections par exécution.**

---

## Étape 9 — Laisser une trace, même quand tout va bien

Une R4 tombée en panne est aujourd'hui indistinguable d'une R4 qui n'a rien trouvé : dans
les deux cas, rien ne bouge. D'où une ligne de journal à **chaque** exécution, versionnée :

```bash
printf '%s | liens morts: %s | /go/: %s | sources KO: %s | dette maillage restante: %s | %s\n' \
  "$(date +%F)" "<n>" "<conforme|n anomalies>" "<n>" "<n articles>" \
  "<publié SHA | rien à corriger | abandon + n° d'issue>" \
  >> scripts/liens-journal.md
```

Cette ligne se commite avec le reste à l'étape 8. Ce n'est pas un commit vide : il porte le
seul état de santé observable de la routine, et il déclenche par ricochet un rebuild
hebdomadaire — ce qui permet à la péremption de 45 jours des gammes de prix de
**s'exprimer** au lieu de rester figée sur un vieux relevé. **Ce n'est pas un substitut** au
`schedule:` manquant dans `.github/workflows/deploy.yml` : rappelle ce besoin dans l'issue
de fin de passage.

Termine en affichant le récapitulatif à l'écran : liens morts trouvés et corrigés, verdict
`/go/`, sources à traiter, article de dette traité, issues ouvertes ou commentées, SHA
publié.

---

## Garde-fous

Ces règles ne se négocient pas. Elles valent pour R4 comme pour `veille-playbook.md`,
`produits-playbook.md` et `classements-playbook.md`.

1. **Aucune expérience physique revendiquée.** La routine n'a pas écouté ces barres de son.
   Si une correction t'amène à écrire ou réécrire un fragment de texte, formule « d'après
   les caractéristiques constructeur », « sur le papier », « d'après les mesures publiées
   par X ». **Jamais** « nous avons testé », « à l'écoute, nous », « à l'usage », « notre
   test ». C'est la règle la plus importante — et sache que le contrôle 11 de
   `verifie-rendu.mjs` ne couvre que quatre formulations : il ne te rattrapera pas.
2. **Aucune preuve ne se fabrique.** Pas d'avis client, pas de témoignage, pas de
   « recommandé par » sans source. Corollaire propre à R4 : **une URL que tu n'as pas
   ouverte dans cette exécution ne s'écrit pas**, ni dans `sources`, ni dans une issue
   présentée comme un constat.
3. **Aucun prix ni aucune note écrits dans une prose.** Ils sont rendus depuis la donnée et
   toujours datés : `price` (indicatif, jamais affiché, sert à déduire la bande via
   `priceBand()` de `src/lib/prix.ts`), `priceCheckedAt`, `availability`, `lastUpdated`, et
   `scores: { son, basses, ergonomie, connectique, rapportQualitePrix }` d'où
   `scoreFromBreakdown()` déduit la note. Le champ `priceRange` **n'existe pas** : les
   anciens playbooks le prescrivaient, `npm run check` le refuse (ts 2353). Aucun de ces
   champs n'est dans le périmètre d'écriture de R4.
4. **`rel="sponsored nofollow"` sur tout lien sortant marchand**, passage obligatoire par
   `/go/<slug>/`, `Disallow: /go/` maintenu dans `public/robots.txt`. C'est l'objet des
   étapes 3 et 6 : ne dégrade jamais ces liens pour faire passer un contrôle. Et rappelle-toi
   que le contrôle 7 de `verifie-rendu.mjs` est aujourd'hui vide de sens (zéro lien Amazon
   en clair) : ce garde-fou repose sur R4, pas sur l'outillage.
5. **Ne jamais scraper `amazon.fr`.** Aucune requête HTTP vers une page Amazon, sous aucun
   prétexte — y compris pour « tester si le lien marche ». Le contrôle de forme de l'étape 3
   remplace ce test.
6. **Ne jamais supprimer une fiche produit** dont le modèle est retiré du marché : elle
   passe en `availability: 'fin-de-commercialisation'` avec un renvoi vers le remplaçant, et
   c'est R2 qui le fait, pas R4. Symétriquement, **ne supprime jamais une page pour faire
   disparaître un lien mort** : c'est le lien qu'on corrige, pas la cible qu'on efface. Une
   suppression jette du référencement.
7. **Orthographe des entités strictement identique partout.** « Sound Blaster Katana V2 » et
   « SoundBlaster Katana v2 » comptent pour deux produits, pour le site comme pour un
   moteur. La référence est `name` dans `src/data/soundbars.ts`, reprise dans
   `scripts/faits-produits.md`. R4 aligne les ancres qu'il écrit ; une divergence dans
   `src/data/` part en issue.
8. **Une routine qui échoue le dit.** Issue GitHub, jamais d'échec silencieux — et le canal
   se teste à l'étape 0 avant tout travail. Une anomalie non corrigeable, un abandon après
   bornes, un push non publié : chacun a son issue. À l'inverse, n'ouvre pas une issue pour
   une anomalie déjà déclarée : commente-la.
9. **Zéro Pull Request, zéro branche de travail, zéro demande de validation.** Autorisation
   permanente de pousser sur `main`. Une correction restée sur une branche est une
   correction non publiée, donc un échec.
10. **Aucun commit vide, et jamais `git add -A`.** Le test de changement porte sur les seuls
    chemins de R4 (`git status --porcelain -- src/content/blog public/robots.txt
    scripts/liens-journal.md`), et le `git add` les nomme explicitement. Une semaine sans
    lien mort n'est pas pour autant une semaine sans commit : la ligne de journal de
    l'étape 9 est un contenu, et c'est le seul signe de vie de la routine.
