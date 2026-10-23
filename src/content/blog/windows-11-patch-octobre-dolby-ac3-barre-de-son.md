---
title: "KB5127648 : Windows 11 corrige les crashs audio Dolby AC-3 — ce qui change pour une barre de son"
metaTitle: "Windows 11 KB5127648 : crashs audio Dolby AC-3 corrigés"
description: "KB5127648 corrige le bug Dolby AC-3 de Windows 11 qui faisait planter jeux et apps. Ce que cela change pour une barre de son en optique ou HDMI."
publishedAt: 2026-10-23
updatedAt: 2026-10-23
tags: ["windows", "connectique", "technique"]
readingMinutes: 4
faq:
  - question: "Qu'est-ce que le bug AC-3 qui faisait planter Windows 11 ?"
    answer: "La mise à jour optionnelle KB5124010, publiée fin septembre, a cassé le décodeur logiciel Dolby Digital (AC-3) intégré à Windows. Les apps qui s'appuyaient sur ce décodeur — certains jeux, lecteurs multimédia — plantaient lors d'actions audio simples. KB5127648, publié le 13 octobre, corrige ce comportement."
  - question: "Ma barre de son branchée en HDMI ARC ou optique était-elle concernée ?"
    answer: "Oui, si des apps que vous utilisiez passaient par le décodeur AC-3 de Windows avant d'envoyer l'audio vers la barre. Si l'app plantait lors de la lecture ou du changement de volume, KB5127648 règle le problème. Les connexions USB et jack n'étaient pas affectées par ce bug spécifique."
  - question: "Ce bug est-il le même que le bug USB Audio de septembre ?"
    answer: "Non. Le bug USB Audio (Code 10, dû à KB5124008) et le bug AC-3 (dû à KB5124010) sont deux défauts distincts. Le premier coupait la reconnaissance des périphériques USB Audio Class 1.0. Le second faisait planter les apps qui décodaient du Dolby Digital en logiciel. KB5127648 règle le second."
  - question: "Comment installer KB5127648 sur Windows 11 ?"
    answer: "Ouvrez Paramètres, puis Windows Update, puis cliquez sur Rechercher des mises à jour. La mise à jour est disponible pour Windows 11 24H2, 25H2 et 26H2. Un redémarrage est demandé en fin d'installation."
sources:
  - title: "KB5127648 — Notes de version Windows 11 24H2/25H2/26H2"
    url: "https://support.microsoft.com/en-us/servicing/os/windows-11/2026/10/kb5127648-windows-11-24h2-25h2-26h2-security-update"
    publisher: "Microsoft"
  - title: "Microsoft fixes game, app crashes caused by Windows KB5124010 preview update"
    url: "https://www.bleepingcomputer.com/news/microsoft/microsoft-fixes-game-app-crashes-caused-by-windows-kb5124010-preview-update/"
    publisher: "BleepingComputer"
  - title: "Windows 11's audio bug that's crashing games and apps is now fixed"
    url: "https://www.pcworld.com/article/3265051/windows-11s-audio-bug-thats-crashing-games-and-apps-is-now-fixed.html"
    publisher: "PCWorld"
cover: "/images/blog/windows-11-patch-octobre-dolby-ac3-barre-de-son.webp"
coverAlt: "Vue détaillée des ports de l'ordinateur portable, y compris HDMI, USB et Ethernet, montrant les options de connectivité."
---

Le Patch Tuesday d'octobre a apporté un correctif attendu : KB5127648 résout les plantages liés au décodeur Dolby Digital (AC-3) de Windows 11, introduits par la preview de septembre. Un bug différent du problème USB Audio du même mois, avec un impact propre selon la connexion utilisée vers la barre de son.

## Le décodeur AC-3 cassé par la preview de septembre

La mise à jour optionnelle KB5124010, publiée le 22 septembre sur Windows 11, a cassé le décodeur logiciel Dolby Digital (AC-3) intégré à Windows. Les apps qui s'appuient sur ce décodeur — certains jeux, lecteurs multimédia — plantaient lors d'actions audio simples comme modifier le volume.

Le décodeur AC-3 de Windows intervient quand une application demande à Windows de convertir un flux Dolby Digital en PCM avant de l'envoyer vers la carte son. Ce chemin logiciel est distinct du passthrough HDMI ou optique, dans lequel le flux Dolby est envoyé brut vers la barre qui le décode elle-même. C'est le décodeur logiciel qui était cassé, et c'est lui qui faisait planter les apps.

Symptômes signalés :

- Apps et jeux qui se ferment sans message d'erreur lors d'une action audio
- Contrôles de volume inopérants après quelques secondes de lecture
- Certains lecteurs multimédia qui refusent de démarrer avec un flux Dolby Digital
- Coupures audio aléatoires dans des titres qui fonctionnaient sans incident avant la mise à jour

## Quelle connexion vers la barre de son était concernée

Tout dépend du chemin audio entre le PC et la barre de son. Les connexions USB et jack transmettent un signal PCM — le crash AC-3 ne les touchait pas. Les connexions optique et HDMI ARC sont les seules à impliquer un flux Dolby Digital côté PC.

| Connexion | Signal transmis vers la barre de son | Impact du bug AC-3 de KB5124010 |
|---|---|---|
| USB audio | PCM stéréo ou multicanal | Aucun : le décodeur AC-3 n'intervient pas dans ce chemin |
| Jack 3,5 mm | PCM analogique | Aucun : signal converti avant la sortie jack |
| Bluetooth | SBC, aptX ou LDAC | Aucun : aucun codec Bluetooth ne passe par l'AC-3 |
| Optique (S/PDIF) | Dolby Digital (AC-3) ou PCM | Potentiellement élevé si l'app utilise le décodeur Windows |
| HDMI ARC / eARC | AC-3, DTS ou PCM | Potentiellement élevé si l'app utilise le décodeur Windows |

Dans le catalogue suivi sur ce site, les barres avec connectique optique ou HDMI ARC — Creative Stage V2, Creative Sound Blaster Katana V2, Creative Sound Blaster Katana V2X, Creative Stage 360 — sont celles dont une configuration HDMI ou optique pouvait impliquer ce décodeur logiciel selon l'app utilisée.

## KB5127648 : la mise à jour qui corrige le crash

Microsoft a publié KB5127648 le 13 octobre dans le cadre du Patch Tuesday mensuel. Cette mise à jour corrige le bug du décodeur AC-3 sur Windows 11 24H2, 25H2 et 26H2. Les apps qui crashaient lors de la lecture audio reprennent un fonctionnement normal après installation.

Comment l'installer :

1. Ouvrez **Paramètres** → **Windows Update**
2. Cliquez sur **Rechercher des mises à jour**
3. KB5127648 apparaît comme mise à jour de sécurité disponible
4. Installez et redémarrez quand le système le demande

> **Focus** — KB5127648 corrige le bug AC-3 mais introduit un effet de bord sur Smart App Control, une fonctionnalité de protection des apps de Windows 11. Pour une utilisation standard d'une barre de son, cet effet de bord est sans conséquence : Smart App Control agit sur le déploiement des applications, pas sur le chemin audio entre Windows et un périphérique de sortie.

## Ce qui reste ouvert et comment vérifier

KB5127648 corrige le crash AC-3 mais n'est pas le seul bug audio de la rentrée. Les périphériques USB Audio Class 1.0 avaient reçu un correctif séparé en septembre via KB5129195. Vérifier que les deux mises à jour sont installées garantit de couvrir l'ensemble des problèmes audio récents.

Si des problèmes sonores persistent après KB5127648 sur une connexion USB, [le diagnostic du bug USB Audio de septembre](/blog/windows-11-bug-audio-usb-barre-de-son) détaille les étapes spécifiques à ce cas.

Pour les barres de son avec plusieurs types de connectique, [notre guide d'installation pas à pas](/guides/comment-installer-barre-de-son-pc/) explique comment choisir la connexion la mieux adaptée à chaque situation. [Les modèles polyvalents PC, console et TV](/classements/meilleures-barres-de-son-pc-polyvalentes/) regroupent les barres dotées d'entrées HDMI et optique en parallèle. [Notre classement des meilleures barres de son PC](/classements/meilleures-barres-de-son-pc/) précise pour chaque produit les connectiques disponibles.
