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

## ✏️ Personnalisation

1. Modifie `src/consts.ts` (nom de marque, URL de prod, réseaux sociaux).
2. Mets à jour le domaine dans `public/robots.txt`.
3. Enrichis `src/data/*` avec tes vrais produits, prix et tests vérifiés.

> ⚠️ Les données produits actuelles sont des **exemples** destinés à structurer
> le site. Vérifie prix, specs et disponibilités avant toute mise en ligne :
> l'exactitude et la fraîcheur sont des signaux SEO/GEO majeurs.
