---
title: "SBC, aptX, LDAC : les codecs Bluetooth d'une barre de son PC"
metaTitle: "SBC, aptX, LDAC : quel codec Bluetooth pour votre PC ?"
description: "SBC, aptX ou LDAC : les codecs Bluetooth ne se valent pas tous pour une barre de son reliée à un PC. Ce que Windows 11 supporte et ce que ça change."
publishedAt: 2026-09-22
updatedAt: 2026-09-22
tags: ["connectique", "bluetooth", "technique"]
readingMinutes: 5
faq:
  - question: "Windows 11 supporte-t-il le codec LDAC ?"
    answer: "Non. Windows 11 ne gère pas nativement LDAC. Le système prend en charge SBC, AAC et, sur certaines configurations Qualcomm sous Windows 11 24H2, aptX Adaptive — mais pas LDAC, que Microsoft n'a pas intégré à sa pile Bluetooth native."
  - question: "Quel codec Bluetooth utilise une barre de son PC ?"
    answer: "La quasi-totalité des barres de son PC se connecte en SBC par défaut sous Windows. Le codec effectivement retenu dépend à la fois de la barre et de l'adaptateur Bluetooth du PC, qui doivent tous deux le prendre en charge."
  - question: "Le codec Bluetooth change-t-il vraiment la qualité d'une barre de son PC ?"
    answer: "Oui, mais dans des proportions modestes à distance de bureau. La connexion USB reste recommandée pour supprimer la question entièrement : le signal reste numérique jusqu'à la barre, sans compression ni latence liées au Bluetooth."
sources:
  - title: "Bluetooth Codecs supported in Windows 11"
    url: "https://learn.microsoft.com/en-us/answers/questions/5560825/bluetooth-codecs-supported-in-windows-11"
    publisher: "Microsoft Learn"
  - title: "I added hi-res audio to my Windows 11 PC for under $6, and my music finally sounds right"
    url: "https://www.makeuseof.com/i-added-hi-res-audio-windows-11-my-music-finally-sounds-right/"
    publisher: "MakeUseOf"
cover: "/images/blog/codecs-bluetooth-pc-sbc-aptx-ldac.webp"
coverAlt: "Gros plan sur une main atteignant un haut-parleur sans fil sur un bureau à côté d'un ordinateur portable."
---

Brancher une barre de son en Bluetooth sur un PC semble trivial. Mais entre SBC, aptX et LDAC, le codec retenu par Windows conditionne en silence la qualité du signal transmis — et Windows 11 ne soutient pas tous les codecs que les constructeurs affichent sur leurs fiches.

## Le codec, c'est la compression de votre audio Bluetooth

Un codec Bluetooth est l'algorithme qui compresse le signal audio pour le transmettre sans fil, puis le décompresse côté enceinte. Sans codec commun entre le PC et la barre de son, la connexion tombe par défaut sur le plus bas dénominateur disponible.

Le choix du codec influence deux choses mesurables : le **débit** (et donc la fidélité théorique du signal) et la **latence** (délai entre l'image à l'écran et le son dans la barre). Pour une barre posée à 60 cm des oreilles, la latence est l'enjeu le plus perceptible au quotidien.

## SBC : le codec universel, mais le moins efficace

SBC (Subband Coding) est le seul codec que Windows 11 impose à toutes les liaisons Bluetooth audio. Tout appareil Bluetooth A2DP le parle, ce qui garantit la connexion — mais SBC compresse davantage que ses successeurs.

Sur le papier : un débit plafonné à environ 320 kbit/s, une latence variable selon l'implémentation du pilote, et une qualité audible inférieure à une connexion USB sur la même barre. SBC est le codec par défaut quand ni le PC ni la barre ne négocient mieux.

## aptX : ce que Windows supporte réellement

aptX Classic réduit la compression et améliore la latence par rapport à SBC. aptX Adaptive, sa version la plus récente, adapte son débit en temps réel selon les conditions de la liaison.

D'après la documentation publiée sur Microsoft Learn, Windows 11 version 24H2 ajoute la prise en charge d'aptX Adaptive sur les PC équipés d'une radio Qualcomm compatible — pas sur tous les PC. Si le PC et la barre s'accordent sur aptX, la latence descend sous les 40 ms, ce qui rend la vidéo confortable sans synchronisation manuelle.

## LDAC : la haute résolution que Windows n'a pas adoptée

LDAC est le codec Sony : il transmet jusqu'à 990 kbit/s, soit environ trois fois plus que SBC, et est conçu pour le streaming hi-fi. Il est natif sur Android depuis 2017 et figure sur la plupart des barres de salon Bluetooth récentes.

Sur PC Windows, LDAC ne figure pas dans la pile Bluetooth native. Microsoft a choisi de soutenir LE Audio et le codec LC3 (Bluetooth 5.2+) comme voie d'avenir, plutôt que LDAC. Des pilotes tiers permettent de l'activer selon MakeUseOf, mais c'est une manipulation avancée, hors du périmètre d'une installation standard.

> **Focus** — pour les barres de son PC, la question du codec Bluetooth ne se pose qu'en mode sans fil. Une connexion USB-C reste numérique de bout en bout, sans algorithme de compression : la variation de codec Bluetooth n'a aucun effet sur une barre branchée en USB.

## Comparatif des codecs Bluetooth pour PC

Cinq codecs dominent le marché Bluetooth audio. Leur compatibilité avec Windows 11 et la latence qu'ils permettent varient considérablement, et ce sont ces deux critères qui décident de leur utilité réelle sur un bureau.

| Codec | Débit max | Latence typique | Support Windows 11 | Utilité sur bureau PC |
|---|---|---|---|---|
| **SBC** | ~320 kbit/s | 100–200 ms | Natif, universel | Connexion de base, toujours disponible |
| **AAC** | ~256 kbit/s | 60–120 ms | Natif (selon l'adaptateur) | Mieux pour la musique, moins pour la vidéo |
| **aptX Classic** | ~352 kbit/s | 40–60 ms | Natif (selon l'adaptateur) | Bon compromis qualité / latence |
| **aptX Adaptive** | 276–420 kbit/s | < 50 ms | 24H2 + chipset Qualcomm | Meilleur compromis disponible sous Windows |
| **LDAC** | 330–990 kbit/s | 80–200 ms | Absent du support natif | Non recommandé sans pilote tiers |

## Choisir sa barre de son PC avec le Bluetooth en tête

Sur un bureau, la liaison USB-C ou USB-A supprime la question entièrement : elle transporte un signal numérique non compressé, avec une latence négligeable. La plupart des barres de son PC du marché proposent les deux connexions.

Si le Bluetooth est prioritaire pour basculer entre le PC et un smartphone, deux critères pratiques méritent d'être vérifiés avant l'achat :

- **La version Bluetooth de la barre** : les modèles récents intègrent Bluetooth 5.3 ou 5.4, ce qui ouvre la voie à aptX Adaptive quand le PC le supporte aussi.
- **Le chipset Bluetooth du PC** : un PC équipé d'une radio Qualcomm récente sous Windows 11 24H2 sera le seul à tirer parti d'aptX Adaptive sans pilote tiers.

Pour les barres qui cumulent USB et Bluetooth, le réflexe reste valide : USB pour le PC, Bluetooth pour le smartphone. [Notre guide sur les barres sans fil](/guides/barre-de-son-pc-sans-fil-bluetooth/) détaille les modèles adaptés à ce double usage, et [le classement des barres sans fil](/classements/meilleures-barres-de-son-pc-sans-fil/) les isole. Pour une vue d'ensemble des connexions possibles, l'article sur [USB-C, jack et Bluetooth](/blog/usb-jack-bluetooth-quelle-connexion-audio-pc/) pose les bases. Pour choisir un modèle, [notre sélection des meilleures barres de son PC](/classements/meilleures-barres-de-son-pc/) reste le point de départ le plus direct.
