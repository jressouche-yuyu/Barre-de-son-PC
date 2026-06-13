# BarreSon PC

Site éditorial **comparatif des barres de son pour PC**, construit avec [Astro](https://astro.build) et pensé pour le **SEO** et le **GEO** (Generative Engine Optimization).

## ⚡ Démarrage

```bash
npm install
npm run dev      # serveur de dev sur http://localhost:4321
npm run build    # build statique dans dist/
npm run preview  # prévisualise le build
npm run check    # vérification TypeScript / Astro
```

## 🧭 Architecture

```
src/
├── consts.ts              # Config marque, URL, navigation (à personnaliser)
├── data/
│   ├── types.ts           # Modèle de données (Soundbar, Ranking, Guide)
│   ├── soundbars.ts        # Jeu de données produits + helpers
│   ├── rankings.ts         # Classements éditoriaux (par intention de recherche)
│   └── guides.ts           # Guides d'achat (contenu informationnel)
├── lib/schema.ts           # Fabriques JSON-LD schema.org (clé du GEO)
├── components/             # Header, Footer, Seo, Faq, cartes, tableaux…
├── layouts/BaseLayout.astro
└── pages/
    ├── index.astro                  # Accueil
    ├── classements/                 # /classements + /classements/[slug]
    ├── barres-de-son/               # /barres-de-son + /barres-de-son/[slug]
    ├── guides/                      # /guides + /guides/[slug]
    ├── comparateur/index.astro      # Comparateur filtrable
    ├── a-propos.astro               # Méthodologie & E-E-A-T
    ├── 404.astro
    └── rss.xml.ts                   # Flux RSS
public/
├── robots.txt              # Autorise crawlers SEO + IA (GPTBot, PerplexityBot…)
├── favicon.svg
└── og-default.svg          # Image Open Graph par défaut
```

## 🔍 Choix SEO / GEO

- **Rendu 100 % statique** : HTML complet servi aux crawlers et aux moteurs génératifs, excellents Core Web Vitals.
- **Données structurées JSON-LD** sur chaque page : `Organization`, `WebSite`, `BreadcrumbList`, `Product` + `Review`, `ItemList`, `FAQPage`, `Article`.
- **FAQ en clair + schéma** : réponses courtes et factuelles, directement citables par les IA (AI Overviews, Perplexity, ChatGPT).
- **Sitemap** auto-généré (`@astrojs/sitemap`) + **canonical**, Open Graph et Twitter Card centralisés dans `components/Seo.astro`.
- **robots.txt** autorisant explicitement les crawlers IA pour le GEO.
- **Signaux de fraîcheur** : date de dernière mise à jour affichée et exposée dans les schémas.
- **E-E-A-T** : page méthodologie, mention d'indépendance éditoriale et entité éditeur.

## 🚀 Déploiement sur GitHub Pages

Un workflow (`.github/workflows/deploy.yml`) build et publie le site à chaque push.

1. **Dépôt → Settings → Pages → Source : « GitHub Actions »**.
2. Le site se publie sur `https://jressouche-yuyu.github.io/Barre-de-son-PC/`.
3. Dépôt **privé** : GitHub Pages nécessite GitHub Pro, ou rendre le dépôt public
   (Settings → General → Change visibility).

Le build Pages utilise deux variables d'environnement (déjà câblées dans le workflow) :

```bash
SITE_URL=https://jressouche-yuyu.github.io BASE_PATH=/Barre-de-son-PC npm run build
```

Sur un domaine final (à la racine), il suffit de builder sans ces variables
(`npm run build`) après avoir mis à jour `SITE.url` dans `src/consts.ts`.
Tous les liens internes passent par le helper `src/lib/url.ts` pour rester
compatibles avec le sous-chemin GitHub Pages.

## 💸 Affiliation Amazon

- Configure ton tag dans `src/consts.ts` → `AFFILIATE.partnerTag` (compte
  [Partenaires Amazon](https://partenaires.amazon.fr)).
- Les boutons « Voir le prix sur Amazon » pointent vers la fiche produit si un
  `amazonAsin` est renseigné dans `src/data/soundbars.ts`, sinon vers une
  recherche Amazon par nom — toujours avec ton tag, et en `rel="sponsored nofollow"`.
- **Images officielles** : l'API Amazon Product Advertising (PA-API) peut fournir
  visuels et prix à jour, mais exige un compte Partenaires validé (ventes
  qualifiantes) + identifiants API en secret. En attendant, les visuels locaux
  (`/public/images/products/`) servent de placeholders.

## ✏️ Personnalisation

1. Modifie `src/consts.ts` (nom de marque, URL de prod, réseaux sociaux, tag d'affiliation).
2. Mets à jour le domaine dans `public/robots.txt`.
3. Enrichis `src/data/*` avec tes vrais produits, prix et tests vérifiés.
4. Remplace les visuels placeholder de `/public/images/products/` par de vraies photos.

> ⚠️ Les prix et notes sont indicatifs/éditoriaux. Vérifie prix, specs et
> disponibilités régulièrement : l'exactitude et la fraîcheur sont des signaux
> SEO/GEO majeurs.
