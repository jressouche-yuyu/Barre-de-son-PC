# Playbook — Veille hebdo & Sélection du mois

Ce document décrit le processus éditorial automatisé du site. Il sert de base à
l'exécution (par un trigger Claude Code planifié, un pipeline API, ou en manuel).

## 1. Veille hebdomadaire (chaque lundi)

**Objectif** : repérer l'actualité des barres de son PC et produire du contenu
frais, plus structuré et plus utile que la concurrence.

**Étapes :**
1. Rechercher l'actualité récente (7 derniers jours) via le web :
   - Requêtes types : « nouvelle barre de son PC », « Razer Leviathan », « Creative Sound Blaster soundbar », « Edifier gaming soundbar », « best PC soundbar 2026 », annonces CES/IFA.
   - Sources à surveiller : newsrooms Razer / Creative / Edifier / Logitech / Trust, et tests de référence (GamesRadar, Tom's Hardware, TechPowerUp, RTINGS).
2. Pour chaque info pertinente :
   - Si **nouveau produit** : créer/mettre à jour une fiche dans `src/data/soundbars.ts` (specs vérifiées + tutoriel + visuel placeholder).
   - Si **tendance / sortie** : rédiger un court article dans `src/content/blog/` (frontmatter complet), avec angle « mieux que la concurrence » : tableau comparatif, FAQ, données structurées.
3. Vérifier les faits (specs, prix) sur au moins 2 sources avant publication.
4. `npm run build` + `npm run check` (0 erreur) puis commit & push → déploiement auto.

**Garde-fous :** ne jamais inventer de specs/prix ; marquer comme « à confirmer »
toute donnée non vérifiée ; pas d'images sous copyright.

## 2. Sélection du mois (le 2 de chaque mois)

**Objectif** : tenir à jour `src/data/monthly.ts` avec un statut clair.

**Étapes :**
1. Re-évaluer le marché vs l'édition précédente.
2. Ajouter une nouvelle édition EN TÊTE de `monthlyEditions` :
   - `status` : `'nouveautes'` (entrées/sorties), `'stable'` (rien de neuf), ou `'a-venir'` (sortie attendue).
   - `headline` : phrase claire et citable (ex. « 1 nouvelle entrée ce mois-ci : … »).
   - `picks` : 3 à 5 modèles, avec justification du mois.
   - `newReleases` : sorties constatées (vide si aucune → le dire explicitement).
   - `upcoming` : sorties attendues le mois suivant (vide si aucune).
3. Build + check + commit & push.

**Règle de transparence (demande client)** : toujours dire clairement s'il y a
des nouvelles entrées, des sorties, si rien n'a changé, ou si une sortie est
attendue le mois suivant.

## 3. Cadence

| Tâche | Fréquence | Fichier(s) cible(s) |
|---|---|---|
| Veille actu | hebdomadaire (lundi) | `src/content/blog/`, `src/data/soundbars.ts` |
| Sélection du mois | mensuelle (le 2) | `src/data/monthly.ts` |
