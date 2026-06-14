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

## 🚀 Déploiement sur Cloudflare Pages

Hébergement gratuit, compatible dépôt privé, URL racine (pas de sous-chemin) et
redéploiement automatique à chaque push.

**Mise en place (une fois) :**
1. Va sur [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages**
   → **Create** → onglet **Pages** → **Connect to Git**.
2. Autorise Cloudflare à accéder au dépôt `Barre-de-son-PC` (installe l'app
   GitHub Cloudflare sur ce dépôt).
3. Renseigne les paramètres de build :
   - **Framework preset** : `Astro`
   - **Build command** : `npm run build`
   - **Build output directory** : `dist`
   - **Production branch** : `claude/soundbar-ranking-site-uwpfvi`
4. (Optionnel mais recommandé) Variables d'environnement :
   - `SITE_URL` = l'URL finale du projet (ex. `https://barre-de-son-pc.pages.dev`)
     pour des `canonical`/sitemap corrects.
5. **Save and Deploy**. Le site sera publié sur `https://<projet>.pages.dev`.

La version de Node est figée via `.nvmrc` (Node 20). Aucune variable `BASE_PATH`
n'est nécessaire : à la racine, les liens internes (helper `src/lib/url.ts`)
restent neutres.

> Pour passer plus tard sur GitHub Pages (dépôt public ou GitHub Pro), il suffit
> de rebuild avec `SITE_URL=https://<user>.github.io BASE_PATH=/Barre-de-son-PC`.

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
