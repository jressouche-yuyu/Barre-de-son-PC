---
title: "Mise à jour Windows 11 septembre : pourquoi votre barre de son USB ne fonctionne plus"
metaTitle: "Windows 11 : bug audio USB après mise à jour de septembre"
description: "La mise à jour KB5124008 de Windows 11 coupe le son des périphériques USB Audio Class 1.0. Diagnostic, contournements et calendrier du correctif officiel."
publishedAt: 2026-09-25
updatedAt: 2026-09-25
tags: ["windows", "tutoriel", "technique"]
readingMinutes: 5
faq:
  - question: "La mise à jour Windows 11 de septembre a-t-elle cassé ma barre de son USB ?"
    answer: "La mise à jour KB5124008 de septembre a désactivé les périphériques USB Audio Class 1.0 sur Windows 11 24H2 et versions ultérieures. Si votre barre de son ne produit plus de son après une mise à jour récente, ouvrez le Gestionnaire de périphériques et cherchez une erreur Code 10 sur votre périphérique audio."
  - question: "Comment diagnostiquer le bug audio KB5124008 sur mon PC ?"
    answer: "Clic droit sur Démarrer → Gestionnaire de périphériques → Contrôleurs audio, vidéo et jeux. Double-cliquez sur votre barre de son : si l'onglet Général indique Code 10, le bug est confirmé. Si aucune erreur n'apparaît, votre connexion audio n'est pas affectée par cette mise à jour."
  - question: "Faut-il désinstaller KB5124008 pour retrouver le son de ma barre de son ?"
    answer: "La désinstallation est possible mais supprime une mise à jour de sécurité. L'option la plus simple est de passer en mode 2 canaux dans les propriétés du périphérique, ou d'utiliser une connexion alternative (jack ou Bluetooth). Un correctif officiel est prévu pour le 13 octobre."
  - question: "Mon branchement jack ou Bluetooth est-il touché par ce bug Windows 11 ?"
    answer: "Non. Le bug KB5124008 est limité aux connexions USB Audio Class 1.0. Les entrées jack 3,5 mm, Bluetooth, optique et HDMI ARC ne sont pas affectées. Si votre barre de son dispose d'un port jack, c'est le contournement le plus simple à mettre en place immédiatement."
sources:
  - title: "Microsoft confirms Windows 11's update kills audio on some PCs"
    url: "https://www.windowslatest.com/2026/09/13/microsoft-confirms-windows-11s-update-kills-audio-on-some-pcs-and-the-bugs-keep-piling-up/"
    publisher: "Windows Latest"
  - title: "Microsoft: September updates break audio on some Windows PCs"
    url: "https://www.bleepingcomputer.com/news/microsoft/microsoft-september-updates-break-audio-on-some-windows-pcs/"
    publisher: "Bleeping Computer"
  - title: "Windows 11 KB5124008 Causes No Sound or USB Audio Code 10: How to Fix"
    url: "https://www.wintips.org/windows-11-kb5124008-causes-no-sound-or-usb-audio-code-10-how-to-fix/"
    publisher: "WinTips.org"
cover: "/images/blog/windows-11-bug-audio-usb-barre-de-son.webp"
coverAlt: "Paire de câbles USB Samsung noirs soigneusement disposés sur une surface jaune vif."
---

La mise à jour de sécurité KB5124008, déployée le 8 septembre sur Windows 11, a rendu muets les périphériques audio USB sur de nombreux PC. Barres de son, casques USB et cartes son externes sont en première ligne si votre système est en Windows 11 24H2 ou ultérieur.

## Ce que la mise à jour KB5124008 a cassé

La mise à jour KB5124008, ainsi que la mise à jour liée KB5124012, désactivent les appareils USB Audio Class 1.0 sur Windows 11 24H2 et ultérieur. Les machines affectées perdent la sortie audio USB ou rencontrent des dysfonctionnements en mode multicanal, d'après les informations publiées par Microsoft.

Symptômes rapportés par les utilisateurs concernés :

- Aucun son, même à volume maximum
- Contrôles de volume et panneau de paramètres sonores non réactifs
- Erreur « Ce périphérique ne peut pas démarrer (Code 10) » dans le Gestionnaire de périphériques
- Perte du son spatial et des modes 3D ou 8 canaux

## Quelles connexions sont touchées

Le bug cible exclusivement le protocole USB Audio Class 1.0, une norme ancienne encore répandue sur les périphériques d'entrée de gamme. Les connexions alternatives restent pleinement fonctionnelles sur les machines concernées, ce qui ouvre des solutions immédiates.

| Connexion | Touchée par KB5124008 | Remarque |
|---|---|---|
| USB Audio Class 1.0 | **Oui** | Erreur Code 10, aucune sortie audio |
| USB Audio Class 2.0 | Non | Norme plus récente, non impactée |
| Jack 3,5 mm | Non | Signal analogique, indépendant de l'USB |
| Bluetooth | Non | Protocole sans fil, non impacté |
| Optique (Toslink) | Non | Liaison numérique, non impactée |
| HDMI ARC / eARC | Non | Protocole HDMI, non impacté |

Pour les barres de son équipées à la fois d'un USB et d'un port jack — comme la Creative Sound Blaster Katana V2X, la Creative Stage V2 ou la Creative Sound Blaster GS3 — le branchement jack constitue un contournement immédiat si l'audio USB s'avère affecté. Les modèles qui ne proposent qu'un câble USB et le Bluetooth, comme la Razer Leviathan V2 X ou l'Edifier MG300, peuvent basculer en Bluetooth pour patienter jusqu'au correctif.

## Diagnostiquer le problème pas à pas

Pour confirmer que le bug KB5124008 affecte votre barre de son, ouvrez le Gestionnaire de périphériques et localisez votre périphérique audio USB : la procédure prend moins d'une minute.

1. Clic droit sur le bouton **Démarrer** → **Gestionnaire de périphériques**
2. Développez **Contrôleurs audio, vidéo et jeux**
3. Double-cliquez sur votre barre de son ou enceinte USB
4. Onglet **Général** : cherchez l'erreur « Ce périphérique ne peut pas démarrer (Code 10) »
5. Si aucune erreur n'apparaît : votre connexion n'est pas affectée par ce bug spécifique

> **Focus** — Si votre PC est en Windows 11 version 23H2 ou antérieure, ce bug ne vous concerne pas : KB5124008 ne casse l'audio que sur la version 24H2 et les suivantes, d'après les informations publiées par Microsoft. Vérifiez votre version dans *Paramètres → Système → Informations système*.

## Solutions disponibles en attendant le correctif

Microsoft a annoncé un correctif pour le 13 octobre, lors du prochain cycle Patch Tuesday. En attendant cette date, trois options permettent de retrouver du son sans attendre.

**Passer en mode 2 canaux (le plus simple) :** clic droit sur l'icône de volume → *Paramètres de son* → cliquez sur votre barre de son → *Propriétés de l'appareil* → onglet *Avancé* → sélectionnez **2 canaux, 16 bits, 48 000 Hz** → *Appliquer*. Ce mode désactive le son spatial et les configurations multicanal, mais l'essentiel du son revient dans la plupart des cas.

**Utiliser une connexion alternative :** si votre barre de son dispose d'une entrée jack ou d'un mode Bluetooth, branchez-la par ce biais. Le son spatial propre à certains modèles peut être conditionné à la connexion USB et ne sera temporairement plus disponible par les autres entrées.

**Désinstaller KB5124008 :** *Paramètres* → *Windows Update* → *Historique des mises à jour* → *Désinstaller les mises à jour* → localisez KB5124008 → *Désinstaller*. Cette option est plus radicale : elle supprime une mise à jour de sécurité et expose temporairement votre système à des vulnérabilités corrigées par ce patch.

## Ce que ce bug révèle sur la connectique des barres de son

Ce type d'incident met en évidence l'utilité d'une connectique diversifiée sur une barre de son de bureau. Un modèle avec plusieurs entrées — USB, jack, optique ou Bluetooth — offre des alternatives concrètes quand une connexion tombe en défaut, qu'il s'agisse d'un bug logiciel ou d'un câble défaillant.

[Notre classement des meilleures barres de son PC](/classements/meilleures-barres-de-son-pc/) précise pour chaque modèle les entrées disponibles, ce qui permet de comparer la connectique de secours avant l'achat. [Les modèles Bluetooth](/classements/meilleures-barres-de-son-pc-sans-fil/) ne sont pas affectés en mode sans fil. Pour évaluer chaque type de connexion selon votre usage, [les critères de choix](/guides/comment-choisir-barre-de-son-pc/) détaillent les compromis entre USB, jack et Bluetooth. Si le budget est une contrainte, [les modèles à petit budget](/classements/meilleures-barres-de-son-pc-pas-cheres/) incluent plusieurs options dotées d'un port jack.
