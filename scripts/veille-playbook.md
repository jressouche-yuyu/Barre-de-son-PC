# Playbook — Veille & rédaction automatique (audio PC / GEO 2026)

**Routine R1 — Blog.** Cadence : deux réveils par jour ouvré,
`0 7 * * 1-5` et `0 14 * * 1-5` (UTC) — soit environ 9 h et 16 h heure de Paris.
Ces deux réveils **doivent** correspondre à `runsPerDay: 2` dans
`scripts/news.config.mjs` : si tu changes le cron, change aussi cette valeur,
sinon le portillon de cadence calcule faux et la cadence part en vrille.

**Branche de déploiement : `main`.** Le workflow `.github/workflows/deploy.yml`
ne se déclenche que sur un push vers `main`. Un article poussé ailleurs (branche
de travail, Pull Request) n'est **jamais publié** : c'est un échec de la
routine, pas un travail en attente.

**Ce fichier est le seul document vers lequel la routine est pointée.** Exécute
les étapes dans l'ordre, sans improviser. Si une étape dit « arrête-toi », tu
t'arrêtes : ne rien publier est un résultat normal et fréquent.

---

## Étape 1 — Décider s'il faut publier maintenant

```bash
node scripts/news-gate.mjs
```

- La sortie est **une seule ligne** : `GO: <raison>` ou `SKIP: <raison>`.
- `SKIP` → **ARRÊTE-TOI IMMÉDIATEMENT.** Ne fais rien d'autre : pas de veille,
  pas de fichier, pas de commit. C'est le cas fréquent et normal.
- `GO` → continue à l'étape 2.

Ne lis pas le code de sortie (il vaut 0 dans les deux cas) : lis la ligne.

Pour un test manuel hors cadence : `NEWS_FORCE=1 node scripts/news-gate.mjs`
force un `GO`. Ne l'utilise jamais dans une exécution planifiée.

---

## Étape 2 — Veille (recherche web vérifiée)

Cherche **une** actualité française de moins de 30 jours sur les thèmes des
`preferredSources` / `keywords` de `scripts/news.config.mjs` : annonces
constructeur (Razer, Creative, Logitech, Edifier, Trust), tests de référence
publiés (Les Numériques, Frandroid, Clubic, Tom's Hardware, TechRadar, RTINGS),
évolutions Windows qui touchent l'audio.

À défaut d'actualité chaude, un sujet **evergreen** non encore traité est
acceptable — tutoriel de réglage, décryptage technique, format questions /
réponses. Ce site n'est pas un média d'actualité : un bon evergreen vaut mieux
qu'une actualité tirée par les cheveux.

```bash
cat scripts/news-ledger.json
ls src/content/blog/
```

1. Lis `scripts/news-ledger.json` et la liste des articles existants. **Écarte
   tout sujet déjà traité ou trop proche** d'un sujet déjà traité.
2. Vérifie **chaque caractéristique technique à la source** : fiche constructeur
   ou test de référence. Croise `scripts/faits-produits.md` — si la
   caractéristique n'y est pas, revérifie-la à la source avant de l'écrire.
   Rien entre les deux.
3. Rien d'inédit et de pertinent → **ARRÊTE-TOI sans publier.** Aucun commit.
4. Doute sérieux sur un fait → abandonne ce sujet, n'en publie pas un autre à
   la place dans la même exécution.

Note les URLs des sources retenues : il en faut **au moins deux, dont au moins
une non marchande**, et elles iront dans le frontmatter (`sources`).

---

## Étape 3 — Rédiger (les trois piliers)

Longueur cible : 500 à 900 mots (`wordRange`). Persona et ton : voir `persona`
et `tone` dans `scripts/news.config.mjs`.

### Pilier A — Citabilité (GEO)

- Chaque section s'ouvre, **juste sous son titre**, par une réponse autonome de
  **25 à 50 mots**, compréhensible hors contexte.
- Phrases auto-portantes : aucun « comme vu plus haut », aucun « ci-dessus »,
  aucun pronom sans référent explicite. Un moteur génératif cite un paragraphe,
  pas la page entière.
- Définition de l'entité dès l'introduction : « Une barre de son pour PC est… ».
- Un concept = une section. Pyramide inversée : l'essentiel d'abord.

### Pilier B — Couverture sémantique (SEO)

- L'intention de recherche est traitée dès le premier paragraphe.
- **Un seul H1**, porté par le `title` du frontmatter. Aucun `# ` en début de
  ligne dans le corps.
- Jamais de titre « Introduction » ni « Conclusion ».
- Typographie française : **une seule majuscule en début de titre**. Le Title
  Case anglo-saxon est interdit.
- Éléments enrichis obligatoires : **≥ 1 tableau** (5 lignes × 3 colonnes
  minimum), **≥ 1 liste à puces**, **≥ 1 bloc Focus** en citation `>`.
- **1 FAQ de 3 questions minimum, dans le frontmatter** (champ `faq`). Le
  gabarit la rend et l'injecte en JSON-LD — ne la duplique pas dans le corps.
- **3 à 5 liens internes**, ancres descriptives et **uniques** (une ancre par
  URL), dont **toujours** `/classements/meilleures-barres-de-son-pc/`.
  Prends les autres dans `secondaryLinks` de `scripts/news.config.mjs`.
- Si l'article oriente le lecteur vers une sélection de produits, intègre les
  **blocs produits** via le composant `SoundbarPicks.astro` (règle éditoriale de
  `CLAUDE.md`), avec des slugs existants de `src/data/soundbars.ts`. Un article
  purement technique n'a pas de sélection produit et n'en ajoute pas.

### Pilier C — Confiance (les règles propres à un site d'affiliation)

- **Aucun prix dans le corps du texte.** Ni chiffre en euros, ni « environ
  200 € ». Un prix se rend depuis la donnée produit avec sa date de relevé
  (`priceRange` + `priceCheckedAt`) ; un prix tapé dans une phrase est faux la
  semaine suivante, et le contrôle qualité de l'étape 6 le refuse.
- **Aucune note inventée.** La note globale d'un produit est **calculée** par
  `scoreFromBreakdown()` (`src/lib/notation.ts`) depuis le détail par critère,
  selon la grille publiée sur `/methodologie/`. Un article ne recopie pas une
  note et n'en invente jamais.
- **Aucune expérience physique revendiquée.** Tu n'as pas écouté ces barres de
  son. Écris « d'après les mesures publiées par X » ou « sur le papier », et
  **jamais** « à l'écoute, nous avons trouvé », « nous avons testé », « testé
  pendant X jours ». **C'est la règle la plus importante de ce playbook.**
- Voix de marque « nous », ton neutre, **zéro superlatif absolu** (« le
  meilleur », « incontournable », « imbattable », « leader »).
- Tout lien sortant marchand porte `rel="sponsored nofollow"` et passe par
  `/go/<slug>/` — jamais une URL Amazon en clair dans le Markdown.
- Orthographe des noms de produits **strictement identique** à
  `src/data/soundbars.ts` : « Creative Sound Blaster Katana V2 », pas
  « SoundBlaster Katana v2 ».

---

## Étape 4 — Créer le fichier

Chemin : `src/content/blog/<slug>.md`. Slug en minuscules, sans accents,
mots séparés par des tirets, **unique** (vérifie `ls src/content/blog/`).

Frontmatter : **exactement** les champs du schéma `src/content.config.ts`, pas
un de plus. Un champ inventé casse le build.

```yaml
---
title: "Titre de l'article — une seule majuscule initiale"
metaTitle: "Titre pour le moteur (45 à 65 caractères)"
description: "Meta description de 130 à 160 caractères, qui dit ce que le lecteur va apprendre."
publishedAt: 2026-09-08
updatedAt: 2026-09-08
tags: ["technique", "gaming"]
readingMinutes: 6
draft: false
faq:
  - question: "Première question réelle posée par un lecteur ?"
    answer: "Réponse autonome de 25 à 50 mots, compréhensible hors contexte."
  - question: "Deuxième question ?"
    answer: "…"
  - question: "Troisième question ?"
    answer: "…"
sources:
  - title: "Titre exact de la page source"
    url: https://www.lesnumeriques.com/…
    publisher: "Les Numériques"
  - title: "Fiche produit constructeur"
    url: https://www.razer.com/…
    publisher: "Razer"
---
```

Champs disponibles et **rien d'autre** : `title`, `metaTitle`, `description`,
`publishedAt`, `updatedAt`, `tags`, `readingMinutes`, `cover`, `coverAlt`,
`draft`, `faq` (liste de `{question, answer}`), `sources` (liste de
`{title, url, publisher}`).

Laisse `cover` et `coverAlt` **absents** : l'étape 5 les renseigne.
`updatedAt` est obligatoire (le contrôle qualité le vérifie).

---

## Étape 5 — Illustration

```bash
node scripts/assign-photo.mjs "<slug>" "<thème FR : 3 à 6 mots-clés>"
```

Exemple : `node scripts/assign-photo.mjs "regler-egaliseur-windows-11" "bureau
ordinateur barre de son réglage audio"`.

Le script renseigne `cover` et `coverAlt` et garantit une image dans tous les
cas (Pexels si `PEXELS_API_KEY` est disponible, sinon repli sur la bibliothèque
locale). Vérifie que `coverAlt` **décrit l'image** et ne répète pas le titre de
l'article — corrige-le à la main si besoin.

---

## Étape 6 — Contrôle qualité

```bash
node scripts/news-check.mjs src/content/blog/<slug>.md
```

- Chaque contrôle sort une ligne `✓` ou `✗`, puis un total.
- **Code de sortie 1 s'il reste un seul `✗`.**
- Tant qu'il reste un `✗` : **corrige et relance.** Ne publie que tout au vert.
- N'édite jamais `news-check.mjs` pour faire passer un article. Le contrôle a
  raison ; c'est l'article qui est à corriger.

---

## Étape 7 — Publier directement sur `main` (OBLIGATOIRE)

Tu disposes d'une autorisation explicite et permanente de pousser directement
sur la branche de déploiement. C'est le comportement attendu et demandé.

```bash
npm run build      # si le build échoue, corrige — ne publie pas
node scripts/news-record.mjs <slug>     # journal anti-doublon
git add src/content/blog/<slug>.md public/images/blog/ scripts/news-ledger.json
git commit -m "Blog : <titre de l'article>"
git push origin HEAD:main
```

Ajoute aussi au commit les fichiers touchés par l'étape 5 (données photo) et,
le cas échéant, `src/data/*.ts` si l'article a nécessité un `picks`.

Règles impératives :

- **NE crée PAS de branche de travail. NE crée PAS de Pull Request.**
- **NE demande PAS de validation** : la publication est autorisée d'avance.
- Un article resté sur une branche est **NON publié** — échec de la routine.
- **Un seul article par exécution.** Même si tu as repéré trois bons sujets.
- Vérifie que le push a bien atterri :
  ```bash
  git log --oneline -1 origin/main
  ```

---

## Garde-fous

Ces règles ne se négocient pas. Elles valent pour cette routine comme pour les
trois autres (`prix-playbook.md`, `liens-playbook.md`,
`classements-playbook.md`).

1. **Aucune expérience physique revendiquée.** La routine n'a pas écouté ces
   barres de son. Formule « d'après les mesures publiées par X » ou « sur le
   papier », **jamais** « à l'écoute, nous avons trouvé », « nous avons testé »,
   « testé pendant X jours ». **C'est la règle la plus importante.** La position
   défendable du site est : comparatif éditorial fondé sur les caractéristiques
   constructeur et les mesures publiées par des laboratoires indépendants, selon
   la grille de notation publique de `/methodologie/`.
2. **Aucune preuve ne se fabrique.** Pas d'avis client inventé, pas de
   témoignage de remplissage, pas de « recommandé par » sans source vérifiable.
   Y compris dans une maquette : un faux avis oublié finit en production.
3. **Aucun prix ni aucune note écrits dans une prose.** Toujours rendus depuis
   la donnée (`priceRange`, `priceCheckedAt`, `scores` → `scoreFromBreakdown`),
   toujours datés.
4. **`rel="sponsored nofollow"` sur tout lien sortant marchand**, passage
   obligatoire par `/go/<slug>/`, et `Disallow: /go/` maintenu dans
   `public/robots.txt`.
5. **Ne jamais scraper `amazon.fr`.** Aucune requête HTTP vers les pages Amazon,
   sous aucun prétexte : c'est interdit par les conditions du programme
   Partenaires, et détecté.
6. **Ne jamais supprimer une fiche produit** dont le modèle est retiré du
   marché : la passer en « fin de commercialisation » avec un renvoi vers le
   remplaçant. Une suppression jette du référencement acquis.
7. **Orthographe des noms d'entités strictement identique partout.** « Sound
   Blaster Katana V2 » et « SoundBlaster Katana v2 » comptent pour deux produits
   différents, pour le site comme pour un moteur.
8. **Une routine qui échoue le dit.** Jamais d'échec silencieux : ouvre une
   issue GitHub.
   ```bash
   gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
     --title "R1 Blog — échec du <date>" \
     --body "Étape en échec, message d'erreur, et ce qui a été tenté."
   ```
9. **Zéro Pull Request, zéro branche de travail, zéro demande de validation.**
   Autorisation permanente de pousser sur `main`. Un contenu resté sur une
   branche = échec de la routine.
10. **Un seul contenu publié par exécution.**
11. Jamais deux articles au sujet identique ou très proche — c'est le rôle de
    `scripts/news-ledger.json`, alimenté à l'étape 7.
12. Jamais un chiffre, une mesure ou une citation inventés. Doute sérieux sur un
    fait → ne publie pas ce sujet.
