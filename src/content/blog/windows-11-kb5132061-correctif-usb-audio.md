---
title: "KB5132061 : Windows 11 corrige enfin les pannes audio USB — ce que ça change pour une barre de son PC"
metaTitle: "KB5132061 : le correctif Windows pour l'audio USB PC"
description: "Le patch KB5132061 du 10 novembre corrige le Code 10 USB qui rendait muette une barre de son PC depuis les mises à jour de septembre. Voici la marche à suivre."
publishedAt: 2026-11-17
updatedAt: 2026-11-17
tags: ["windows", "tutoriel", "technique"]
readingMinutes: 4
faq:
  - question: "KB5132061 s'installe-t-il automatiquement ?"
    answer: "Oui, Microsoft déploie KB5132061 via Windows Update sans action manuelle requise. Vérifiez dans Paramètres > Windows Update > Afficher l'historique des mises à jour que le patch figure bien comme installé."
  - question: "Le Code 10 USB concerne-t-il toutes les barres de son ?"
    answer: "Non. Le bug touche spécifiquement les appareils USB Audio Class 1.0. Les barres connectées uniquement en Bluetooth, HDMI ARC ou optique — sans USB actif pour l'audio — ne sont pas concernées."
  - question: "Ma barre de son reste muette après KB5132061 : que faire ?"
    answer: "Vérifier d'abord que KB5132061 est bien listé dans l'historique Windows Update. Si oui, débrancher et rebrancher la barre pour forcer la réinitialisation du pilote, ou désinstaller l'entrée dans le Gestionnaire de périphériques puis rebrancher."
sources:
  - title: "November 10, 2026 — KB5132061 (OS Builds 26300.9974, 26200.9974 and 26100.9974)"
    url: "https://support.microsoft.com/en-us/servicing/os/windows-11/2026/11/kb5132061-windows-11-24h2-25h2-26h2-security-update"
    publisher: "Microsoft"
  - title: "Microsoft fixes USB audio issues caused by September security updates"
    url: "https://bleepingcomputer.com/news/microsoft/microsoft-fixes-usb-audio-issues-caused-by-september-security-updates"
    publisher: "BleepingComputer"
  - title: "Windows 11 KB5132061 November 2026 Patch Finally Fixes USB Audio Issues"
    url: "https://windowsreport.com/windows-11-kb5132061-november-2026-patch-finally-fixes-usb-audio-issues/"
    publisher: "WindowsReport"
cover: "/images/blog/windows-11-kb5132061-correctif-usb-audio.webp"
coverAlt: "Câble USB-C de haute qualité avec connecteur présenté sur un élégant fond en marbre pour les passionnés de technologie."
---

Le Patch Tuesday du 10 novembre referme enfin le dossier ouvert en septembre : Microsoft confirme que KB5132061 résout les pannes audio USB de type Code 10 qui ont rendu muettes des barres de son et des casques connectés par USB sur Windows 11 pendant plusieurs semaines.

## Ce qu'était le bug Code 10 USB

Depuis les mises à jour de sécurité de septembre, certains appareils USB Audio Class 1.0 refusaient de démarrer sous Windows 11. Le Gestionnaire de périphériques affichait une erreur Code 10, et la barre de son disparaissait du panneau Son sans explication visible à l'écran.

USB Audio Class 1.0 est la spécification la plus ancienne et la plus répandue dans les périphériques audio PC qui fonctionnent sans pilote à installer. Ces appareils s'appuient sur le pilote générique Windows — précisément celui modifié par la mise à jour de septembre. Un correctif partiel avait été publié en octobre pour les crashs audio Dolby AC-3, mais le Code 10 USB restait ouvert jusqu'au 10 novembre.

## Ce que corrige KB5132061 exactement

D'après la page d'assistance officielle publiée par Microsoft le 10 novembre, KB5132061 résout l'échec de démarrage des appareils USB Audio Class 1.0 et l'erreur Code 10 dans le Gestionnaire de périphériques. Le correctif s'applique à Windows 11 24H2, 25H2 et 26H2.

| Version Windows 11 | Build intégrée | Statut du correctif |
|---|---|---|
| 26H2 | 26300.9974 | Corrigé via KB5132061 |
| 25H2 | 26200.9974 | Corrigé via KB5132061 |
| 24H2 | 26100.9974 | Corrigé via KB5132061 |
| 23H2 | — | Correctif séparé (KB5131087) |
| 26H1 | — | Correctif séparé (KB5132059) |

Microsoft déploie KB5132061 automatiquement sur les machines connectées à Windows Update : d'après la page d'assistance, aucune action manuelle n'est requise pour recevoir la réparation.

## Quelle barre de son était exposée

Le bug visait les appareils USB Audio Class 1.0. Les barres connectées uniquement en Bluetooth, HDMI ARC ou optique — sans USB actif pour l'audio — n'étaient pas concernées. Sur les onze barres de son suivies sur ce site, la situation diffère selon le modèle.

| Produit | Audio par USB | Alternative disponible si USB défaillant |
|---|---|---|
| Razer Leviathan V2 X | Oui (USB-C, alim + audio) | Bluetooth |
| Creative Sound Blaster GS3 | Oui (USB-C, alim + audio) | Bluetooth 5.4, jack 3,5 mm |
| Edifier MG300 | Oui (USB-A, alim + audio) | Bluetooth 5.3 |
| Creative Sound Blaster Katana V2X | Oui (USB-C) | Bluetooth, jack 3,5 mm, optique, HDMI ARC |
| Trust GXT 620 Axon | USB uniquement pour l'alimentation | Jack 3,5 mm — non exposée |
| Creative Stage 360 | Aucun port USB | HDMI ARC, optique — non exposée |

> **Focus** — La Creative Stage 360 et la Trust GXT 620 Axon n'étaient structurellement pas exposées : la première n'a aucun port USB, la seconde route son audio par le jack et n'utilise l'USB que pour l'alimentation. Pour les barres qui passent l'audio par l'USB, basculer temporairement en Bluetooth restait la solution de dépannage pendant la période du bug.

## Que faire maintenant

Voici les vérifications à effectuer si votre barre de son en USB était muette depuis septembre : l'objectif est de confirmer que KB5132061 est bien installé, puis de forcer la réinitialisation du pilote USB.

- Ouvrir **Paramètres > Windows Update > Afficher l'historique des mises à jour** et vérifier que KB5132061 y figure comme installé.
- Débrancher la barre de son, attendre dix secondes, puis la rebrancher.
- Si le périphérique ne réapparaît pas dans le panneau Son, ouvrir le **Gestionnaire de périphériques** (clic droit sur le menu Démarrer) et chercher une entrée en erreur sous « Contrôleurs audio, vidéo et jeu ».
- Clic droit sur l'entrée en erreur > **Désinstaller l'appareil**, puis rebrancher : Windows réinstalle le pilote automatiquement.

Pour approfondir le diagnostic ou choisir une barre avec une connectique diversifiée — jack, optique ou HDMI ARC en complément de l'USB — [les critères de choix](/guides/comment-choisir-barre-de-son-pc/) donnent le détail. [Notre classement des meilleures barres de son PC](/classements/meilleures-barres-de-son-pc/) rassemble les modèles comparés avec leurs entrées disponibles. [Les barres sans fil](/classements/meilleures-barres-de-son-pc-sans-fil/) isolent les modèles entièrement Bluetooth, pour s'affranchir de la dépendance au pilote USB. [L'installation pas à pas](/guides/comment-installer-barre-de-son-pc/) couvre le paramétrage Windows depuis le début.
