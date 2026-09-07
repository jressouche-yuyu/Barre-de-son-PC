# Playbook — Santé des liens

**Routine R3 — Liens.** Cadence : **hebdomadaire**, `0 6 * * 4` (UTC) —
jeudi vers 8 h heure de Paris.

Le stock de liens grossit tout seul : chaque article de blog en ajoute 3 à 5,
chaque guide et chaque classement en portent une dizaine. Sans contrôle, le
nombre de liens morts ne fait qu'augmenter, et un lien interne en 404 dilue le
maillage exactement là où il devait le renforcer.

**Branche de déploiement : `main`.** Le workflow
`.github/workflows/deploy.yml` ne se déclenche que sur un push vers `main`.
Une correction poussée ailleurs n'est jamais publiée.

---

## Étape 1 — Se placer sur `main` à jour et construire le site

```bash
git fetch origin && git checkout main && git pull --ff-only origin main
npm run build      # si le build échoue, corrige-le d'abord : c'est déjà une panne
```

Le contrôle porte sur `dist/` — le HTML réellement publié — et non sur les
sources. C'est la seule façon de voir les liens tels que les moteurs les voient.

---

## Étape 2 — Tester tous les liens internes

Le site est statique : un lien interne est mort si aucun fichier ne lui
correspond dans `dist/`. Le contrôle se fait **hors ligne**, donc sans faux
positif de réseau.

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
        *.xml|*.svg|*.webp|*.png|*.css|*.js|*.html|*.txt) f="$BASE$p" ;;
        *) f="$BASE${p%/}" ;;
      esac
      if [ -f "$f" ] || [ -f "$f/index.html" ] || [ -f "$f.html" ]; then
        :
      else
        echo "LIEN INTERNE MORT : $p"
      fi
    done
```

Toute ligne `LIEN INTERNE MORT` est à corriger à l'étape 5.

Vérifie aussi que la **page pilier** est bien atteignable et bien maillée : tout
article de blog doit pointer vers elle.

```bash
test -f dist/classements/meilleures-barres-de-son-pc/index.html \
  && echo "OK page pilier" || echo "MANQUE : page pilier"
echo "articles liant le pilier : $(grep -rl 'href="/classements/meilleures-barres-de-son-pc/"' dist/blog/*/index.html 2>/dev/null | wc -l)"
echo "articles au total        : $(ls -d dist/blog/*/ 2>/dev/null | wc -l)"
```

Les deux nombres doivent être égaux. S'ils diffèrent, un article ne pointe pas
vers la page pilier.

**Attendu au premier passage : 0 sur 5.** Les cinq articles publiés en juin 2026
sont antérieurs à cette règle et n'ont pas ce lien. Ce n'est pas une panne :
c'est une dette à résorber. Traite-la à l'étape 5, **un article par exécution**
— ajoute le lien avec une ancre descriptive dans le corps de l'article, sans
toucher au reste du texte, et sans dépasser 5 liens internes pour cet article.
Cinq exécutions hebdomadaires suffisent à solder la dette.

---

## Étape 3 — Contrôler les pages de redirection d'affiliation `/go/`

Il doit y avoir **13 pages `/go/`**, une par produit du catalogue.

```bash
ls -d dist/go/*/ | wc -l                            # doit afficher 13
grep -L 'noindex' dist/go/*/index.html              # doit ne rien afficher
```

Décode et affiche chaque destination réelle — sans jamais l'appeler :

```bash
for d in dist/go/*/; do
  slug=$(basename "$d")
  enc=$(grep -oE 'const enc = "[A-Za-z0-9+/=]+"' "$d/index.html" \
        | head -1 | sed -E 's/.*"([^"]*)".*/\1/')
  dest=$(printf '%s' "$enc" | base64 -d 2>/dev/null)
  echo "$slug -> $dest"
done
```

Sur chaque destination, contrôle **trois choses, par lecture de l'URL** :

1. Elle est **décodable** et non vide. Une destination vide = le CTA ne mène
   nulle part, c'est la panne la plus coûteuse du site.
2. Elle porte le **tag partenaire** (`tag=` avec la valeur de
   `AFFILIATE.partnerTag` dans `src/consts.ts`). Un lien sans tag est une vente
   offerte à Amazon.
3. Le **nom de produit encodé dans l'URL est exactement** celui de
   `src/data/soundbars.ts` — même casse, mêmes espaces. « SoundBlaster Katana
   v2 » ramène d'autres résultats que « Sound Blaster Katana V2 ».

### Pourquoi ces destinations ne se testent pas en HTTP

Le brief d'origine prévoyait de tester chaque destination (404, redirection vers
une page d'accueil, produit retiré). **Ce n'est ni possible ni souhaitable ici**,
pour deux raisons mesurées sur le dépôt :

- Aucun produit n'a d'ASIN (`grep -c amazonAsin src/data/soundbars.ts` → 0) :
  toutes les destinations sont des **liens de recherche** Amazon
  (`/s?k=<nom>&tag=…`, voir `src/lib/affiliate.ts`). Une page de recherche ne
  renvoie jamais 404 : le test HTTP ne dirait donc rien d'utile.
- Interroger `amazon.fr` est **interdit** par les conditions du programme
  Partenaires, et détecté. Le garde-fou passe avant le contrôle.

La question « ce produit est-il encore commercialisé ? » est donc traitée
**par R2** (`scripts/prix-playbook.md`, étape 3), à la source constructeur. R3
contrôle la **forme** des liens ; R2 contrôle la **réalité commerciale**. Si tu
constates un doute sur un produit, ne va pas voir sur Amazon : ouvre une issue à
destination de R2 (étape 6).

---

## Étape 4 — Vérifier les obligations de conformité

```bash
# 1. Aucun lien Amazon en clair sans rel conforme (il doit y en avoir zéro :
#    tout passe par /go/)
echo "amazon en clair non conformes : $(grep -rhoE '<a [^>]*href="https?://(www\.)?amazon\.[^"]*"[^>]*>' dist --include='*.html' | grep -vc 'rel="sponsored nofollow' || true)"

# 2. Tous les liens vers /go/ portent le rel attendu
echo "liens /go/ au total          : $(grep -rhoE '<a [^>]*href="[^"]*/go/[^"]*"[^>]*>' dist --include='*.html' | wc -l)"
echo "liens /go/ non conformes     : $(grep -rhoE '<a [^>]*href="[^"]*/go/[^"]*"[^>]*>' dist --include='*.html' | grep -vc 'rel="sponsored nofollow' || true)"

# 3. robots.txt bloque toujours /go/
grep -q '^Disallow: /go/' dist/robots.txt \
  && echo "OK : Disallow /go/ présent" \
  || echo "NON CONFORME : Disallow /go/ absent de robots.txt"

# 4. Aucune page /go/ dans le sitemap
echo "occurrences /go/ au sitemap  : $(grep -h -o '/go/' dist/sitemap-*.xml | wc -l)"
```

Valeurs attendues : **13** liens `/go/` au total (un par produit), et **0**
partout ailleurs. Un `grep -c` qui ne trouve rien sort en code 1 : c'est le
résultat souhaité, pas une panne — d'où les `|| true`, et d'où le fait que ces
quatre contrôles se lancent **séparément**, jamais chaînés par `&&`.

Le `rel` réellement rendu par les gabarits est `rel="sponsored nofollow
noopener"` : le contrôle porte sur le **préfixe** `rel="sponsored nofollow`, pas
sur une égalité stricte.

Contrôle aussi les **liens sortants non marchands** (les `sources` du
frontmatter des articles, les fiches constructeur). Ceux-là se testent bien en
HTTP, et ils meurent souvent :

```bash
grep -rhoE 'https?://[^"<) ]+' dist --include='*.html' \
  | grep -vE 'amazon\.|barre-de-son-pc\.fr|schema\.org|w3\.org|googletagmanager|fonts\.' \
  | sort -u \
  | while read -r u; do
      code=$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 15 -A 'Mozilla/5.0 (compatible; BarreSonPC-linkcheck)' "$u")
      case "$code" in
        2*|3*) : ;;
        *) echo "SORTANT $code : $u" ;;
      esac
    done
```

Un 403 sur un grand média est souvent un refus de robot, pas un lien mort :
vérifie-le à la main avant de le déclarer cassé. Un 404 est un vrai 404.

---

## Étape 5 — Corriger ce qui est corrigeable automatiquement

Corrige **seulement** ces cas, qui ne demandent aucun jugement :

- **Lien interne vers une URL qui n'existe plus** → réécris-le vers la page
  équivalente existante (le classement correspondant, le guide correspondant),
  ou vers la page pilier `/classements/meilleures-barres-de-son-pc/` si aucune
  équivalence n'existe. Ne supprime pas le lien : un article doit garder 3 à 5
  liens internes.
- **Ancre dupliquée** (deux fois la même ancre pour deux URLs différentes, ou
  l'inverse) → réécris l'ancre pour qu'elle décrive sa cible.
- **Nom de produit mal orthographié** dans un lien ou une ancre → aligne-le sur
  `src/data/soundbars.ts`, à la lettre près.
- **`Disallow: /go/` absent** de `public/robots.txt` → remets-le.

Tout le reste (destination d'affiliation à changer, produit à retirer d'un
classement, page à créer) demande un jugement éditorial : **issue, pas
correction sauvage.**

---

## Étape 6 — Publier sur `main`, uniquement si quelque chose a changé

```bash
npm run build      # revérifie après correction ; si ça échoue, ne publie pas
if git diff --quiet; then
  echo "Aucun lien à corriger cette semaine. Fin normale de la routine."
else
  git add -A
  git commit -m "Liens : correction des liens morts du $(date +%F)"
  git push origin HEAD:main
  git log --oneline -1 origin/main
fi
```

- **Pas de commit vide.** Une semaine sans lien mort est un succès silencieux.
- **NE crée PAS de branche de travail. NE crée PAS de Pull Request. NE demande
  PAS de validation** : l'autorisation de pousser sur `main` est permanente.

Puis, pour tout ce qui n'était **pas** corrigeable automatiquement :

```bash
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R3 Liens — anomalies non corrigeables du $(date +%F)" \
  --body "Une ligne par anomalie : URL concernée, page qui la porte, nature du problème, correction proposée."
```

Ouvre l'issue **même si tu as tout corrigé par ailleurs**. Une routine qui
échoue en silence est pire qu'une routine absente : on croit les liens sains
alors qu'ils ne le sont plus.

---

## Garde-fous

Ces règles ne se négocient pas. Elles valent pour cette routine comme pour les
trois autres (`veille-playbook.md`, `prix-playbook.md`,
`classements-playbook.md`).

1. **Aucune expérience physique revendiquée.** La routine n'a pas écouté ces
   barres de son. Si une correction t'amène à réécrire un fragment de texte,
   formule « d'après les mesures publiées par X » ou « sur le papier »,
   **jamais** « à l'écoute, nous avons trouvé » ni « nous avons testé ».
   **C'est la règle la plus importante.**
2. **Aucune preuve ne se fabrique.** Pas d'avis client inventé, pas de
   « recommandé par » sans source vérifiable.
3. **Aucun prix ni aucune note écrits dans une prose.** Toujours rendus depuis
   la donnée (`priceRange`, `priceCheckedAt`, `scores` → `scoreFromBreakdown`),
   toujours datés.
4. **`rel="sponsored nofollow"` sur tout lien sortant marchand**, passage
   obligatoire par `/go/<slug>/`, et `Disallow: /go/` maintenu dans
   `public/robots.txt`. C'est l'objet même de l'étape 4 : ne le dégrade jamais
   pour faire passer un contrôle.
5. **Ne jamais scraper `amazon.fr`.** Aucune requête HTTP vers les pages Amazon,
   sous aucun prétexte — y compris pour « tester si le lien marche ». Le
   contrôle de forme de l'étape 3 remplace ce test.
6. **Ne jamais supprimer une fiche produit** dont le modèle est retiré du
   marché : la passer en « fin de commercialisation » avec un renvoi vers le
   remplaçant. Et ne jamais supprimer une page pour faire disparaître un lien
   mort : c'est le lien qu'on corrige, pas la page qu'on efface.
7. **Orthographe des noms d'entités strictement identique partout.** « Sound
   Blaster Katana V2 » et « SoundBlaster Katana v2 » comptent pour deux produits
   différents, pour le site comme pour un moteur.
8. **Une routine qui échoue le dit.** Issue GitHub (étape 6), jamais d'échec
   silencieux.
9. **Zéro Pull Request, zéro branche de travail, zéro demande de validation.**
   Autorisation permanente de pousser sur `main`. Une correction restée sur une
   branche = échec de la routine.
10. **Un seul contenu publié par exécution** — ici, un seul commit de
    corrections.
11. **Aucun commit vide.** Si rien n'a changé, la routine se termine sans rien
    pousser, et c'est un succès.
