# Automatisation éditoriale — point d'entrée

Ce document ne contient plus de procédure. **Toute la procédure détaillée vit
désormais dans les quatre playbooks de `scripts/`**, un par routine. C'est vers
ces fichiers, et vers eux seuls, que les routines Claude Code sont pointées.

## Les quatre routines

| Routine | Playbook | Rôle | Cadence |
|---|---|---|---|
| **R1 — Blog** | [`scripts/veille-playbook.md`](../scripts/veille-playbook.md) | veille et rédaction d'un article | 2 réveils par jour ouvré |
| **R2 — Prix** | [`scripts/prix-playbook.md`](../scripts/prix-playbook.md) | contrôle de gamme et de disponibilité des 13 produits | hebdomadaire |
| **R3 — Liens** | [`scripts/liens-playbook.md`](../scripts/liens-playbook.md) | santé des liens internes et des redirections `/go/` | hebdomadaire |
| **R4 — Classements** | [`scripts/classements-playbook.md`](../scripts/classements-playbook.md) | classements, fiches produit, sélection du mois | bimensuelle |

Sur un site d'affiliation, publier des articles ne suffit pas à maintenir le
site : ce qui périme, c'est la donnée commerciale. R2 et R3 protègent le chiffre
d'affaires, R1 est la plus visible mais pas la plus rentable — d'où l'ordre de
mise en service ci-dessous.

## ⚠ Erreur de branche à ne pas reproduire

Les versions précédentes de ce document décrivaient deux schedules Claude Code
qui poussaient leur travail sur la branche **`claude/soundbar-ranking-site-uwpfvi`**.

**Cette branche ne déploie pas.** Le commit `7fbcbbe`
(« Deploy from main branch — consolidate production onto main ») a consolidé la
production sur `main` sans que ce document soit mis à jour :
`.github/workflows/deploy.yml` ne se déclenche que sur un push vers `main`.
Tout contenu produit par ces routines n'aurait donc **jamais été publié** — il
serait resté invisible sur une branche, en donnant l'illusion d'un site
entretenu.

Règle, désormais rappelée dans les quatre playbooks :

```bash
git push origin HEAD:main
```

Pas de branche de travail, pas de Pull Request, pas de demande de validation.
**Un contenu resté sur une branche est un échec de la routine, pas un travail en
attente.** Si tu ajoutes une cinquième routine un jour, la première chose à
vérifier est cette ligne de push.

## Mise en service par étapes

On ne lance pas les quatre routines d'un coup : si une routine déraille, on ne
saurait pas laquelle. Réglages à saisir sur <https://claude.ai/code/routines>.

| Étape | Quand | Routine | Cron (UTC) | Ce qu'on vérifie avant de passer à la suite |
|---|---|---|---|---|
| **1** | maintenant | **R2 Prix** | `0 5 * * 1` | 7 jours : les `priceCheckedAt` ont avancé, aucun commit vide, aucun prix exact affiché |
| **2** | +1 semaine | R3 Liens | `0 6 * * 4` | un rapport produit, les liens morts corrigés ou une issue ouverte |
| **3** | +2 semaines | R1 Blog | `0 7 * * 1-5` et `0 14 * * 1-5` | un article sorti **sur `main`**, sans branche ni PR ; les deux réveils correspondent bien à `runsPerDay: 2` |
| **4** | +1 mois | R4 Classements | `0 6 1,15 * *` | `/selection-du-mois/` porte une date du mois en cours, les classements touchés ont un `lastUpdated` frais |

Pour chacune des quatre :

| Réglage | Valeur |
|---|---|
| Prompt | « Suis scrupuleusement les instructions de `scripts/<playbook>.md`. » |
| Dépôt | `jressouche-yuyu/Barre-de-son-PC` |
| Environnement | **avec accès web** (indispensable pour la veille et les contrôles) |
| Réglage critique | **activer « Allow unrestricted branch pushes »** — sans ça, rien ne se publie |

**R2 est hebdomadaire et non quotidienne**, contrairement à ce que prévoyait le
brief initial : aucun prix exact n'est affiché sur le site (aucun ASIN au
catalogue, PA-API non accessible), donc la règle des 24 heures du contrat Amazon
Partenaires ne s'applique pas. La justification complète et les conditions de
bascule vers un relevé quotidien sont dans
[`scripts/prix-playbook.md`](../scripts/prix-playbook.md).

## Politique réseau et secrets, par routine

| Routine | À autoriser | Secrets |
|---|---|---|
| R2 Prix | domaines constructeurs (`razer.com`, `creative.com`, `logitech.com`, `edifier.com`, `trust.com`) et sites de tests | — (aucun tant que PA-API n'est pas branchée) |
| R3 Liens | les domaines sortants cités par le site — **jamais `amazon.fr`** | — |
| R1 Blog | les domaines de `preferredSources` ; en option `api.pexels.com` et `images.pexels.com` | en option `PEXELS_API_KEY` |
| R4 Classements | domaines constructeurs et sites de tests | — |

`amazon.fr` n'est autorisé pour aucune routine : le scraping des pages Amazon
est interdit par les conditions du programme Partenaires, et détecté.

## Garde-fous

Les garde-fous non négociables (aucune expérience physique revendiquée, aucune
preuve fabriquée, aucun prix ni note en prose, `rel="sponsored nofollow"`,
jamais de suppression de fiche produit, échec jamais silencieux, zéro PR) sont
rappelés **dans chacun des quatre playbooks**, dans une section « Garde-fous ».
Ils y sont volontairement dupliqués : une routine ne lit qu'un seul fichier.
