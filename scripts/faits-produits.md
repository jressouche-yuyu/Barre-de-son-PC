# Faits produits — base anti-hallucination

**Relevé le 2026-09-07 depuis `src/data/soundbars.ts` (13 produits) et `src/data/types.ts`.**

## À quoi sert ce fichier

Ce fichier existe pour une seule raison : **empêcher l'invention de caractéristiques techniques**
par une routine automatique qui publie du contenu sur barre-de-son-pc.fr sans relecture humaine.

Un modèle de langage à qui l'on demande « écris un paragraphe sur la Leviathan V2 X » et qui n'a
pas la donnée sous les yeux **produira des watts plausibles**. Pas par malice : parce qu'une barre
de son gaming de 40 cm « fait » statistiquement 30 ou 60 W dans son corpus d'entraînement. Le
chiffre sera crédible, cohérent avec le reste du texte, et faux. Sur un site qui compare des
produits, c'est la faute la plus coûteuse : elle décrédibilise tout le reste, elle est
indéfendable auprès d'un lecteur, et elle est reprise telle quelle par les moteurs génératifs.

### La règle

> **Toute caractéristique technique publiée sur ce site est soit écrite dans ce fichier, soit
> revérifiée dans `src/data/soundbars.ts` au moment de publier. Il n'y a rien entre les deux.**

Concrètement, pour une routine qui rédige :

1. Si le fait est dans la fiche ci-dessous → le citer tel quel.
2. Si le fait n'y est pas → **ne pas le produire**. Écrire « non communiqué par le constructeur »,
   ou reformuler la phrase pour ne pas avoir besoin du chiffre.
3. Si le fait semble manquant mais nécessaire → lire `src/data/soundbars.ts`. Si le champ y est
   vide aussi, la réponse est définitive : la donnée n'existe pas côté site. Ce n'est **pas** une
   invitation à aller chercher un chiffre ailleurs et à le publier sans traçabilité.
4. « Non communiqué » est une information publiable et honnête. Un chiffre inventé ne l'est pas.

### Cas particulier du prix

Le prix ne suit PAS la règle ci-dessus : il n'est ni dans ce fichier, ni à recopier depuis la
donnée. Le site n'affiche **aucun prix exact**, seulement une fourchette de gamme datée de son
relèvement (`src/lib/prix.ts`, rendu par `PrixGamme.astro`). La fonction qui formatait un prix
exact a été retirée du code exprès, pour qu'aucune routine ne puisse la rappeler.

Pour une routine qui rédige : **aucun montant en euros dans le corps d'un texte**. Le contrôle
qualité (`scripts/news-check.mjs`, contrôle 13) refuse l'article. Si le budget doit être évoqué,
citer la gamme (« entrée de gamme », « milieu de gamme », « haut de gamme ») ou renvoyer vers
le classement des modèles à petit budget.

### Ce que ce fichier ne contient pas, volontairement

- **Aucun prix.** Les prix bougent. Un prix recopié ici deviendrait faux en quelques semaines et
  échapperait à toute mise à jour, puisqu'il vivrait en double hors de la donnée source. Le prix
  se lit **uniquement** dans le champ `price` (+ `currency`) du produit.
- **Aucune caractéristique absente de la donnée source**, même « connue par ailleurs ».

### Vocabulaire des champs

| Champ source | Ce qu'il contient | Piège |
|---|---|---|
| `driverConfig` | Texte descriptif libre des haut-parleurs | Contient parfois des watts **par transducteur** qui ne sont **pas** la puissance du produit |
| `powerRmsWatts` | Puissance RMS, si communiquée | Absent ≠ 0 |
| `powerPeakWatts` | Puissance crête, si communiquée | Toujours supérieure au RMS, jamais interchangeable |
| `frequencyResponse` | Réponse en fréquence annoncée | Absent sur 7 des 13 produits |
| `connectivity` | Énumération fermée | `USB-A`/`USB-C` = connecteur côté PC, pas forcément de l'audio USB |
| `score` / `scores` | Notes **éditoriales** /10 | Ce sont nos avis, pas des mesures. Ne jamais les présenter comme des mesures |
| `verdict` / `summary` / `pros` / `cons` | Texte **éditorial** | Citable, mais ne pas en extraire de nouvelles specs par paraphrase |
| `lastUpdated` | Dernière vérification éditoriale | Date de notre relecture, pas de la sortie produit |

Valeurs possibles de `connectivity` (liste fermée, `ConnectivityType`) : `USB-C`, `USB-A`,
`Bluetooth`, `Jack 3.5mm`, `Optique`, `HDMI ARC`, `Wi-Fi`. Aucun produit du catalogue n'a `Wi-Fi`.

---

## Les 13 produits, dans l'ordre du fichier source

1. `razer-leviathan-v2-pro` — 2. `razer-leviathan-v2` — 3. `creative-sound-blaster-katana-v2` —
4. `creative-sound-blaster-katana-v2x` — 5. `razer-leviathan-v2-x` — 6. `creative-stage-v2` —
7. `creative-sound-blaster-gs3` — 8. `creative-stage-air-v2` — 9. `creative-stage-360` —
10. `logitech-z407` — 11. `edifier-mg300` — 12. `trust-gxt-620-axon` — 13. `edifier-g1500`

---

## Razer Leviathan V2 Pro

- Marque : Razer · Slug : `razer-leviathan-v2-pro` · Sortie : 2023
- Canaux / haut-parleurs : 5 haut-parleurs large bande 2" + caisson 13,3 cm (5,25") à émission vers le bas
- Caisson dédié : oui · Micro intégré : non · RGB : oui
- Connectique : USB-C, Bluetooth, Jack 3,5 mm
- Puissance : RMS **non communiquée par le constructeur** · crête **non communiquée par le constructeur**
- Réponse en fréquence annoncée : 40 Hz – 20 kHz
- Dimensions (L×H×P) : 60 × 11,4 × 9 cm
- Particularité : son 3D par beamforming avec suivi de tête par caméra infrarouge (AI Head Tracking), THX Spatial Audio, éclairage Chroma RGB. Fonctions avancées conditionnées à Razer Synapse.
- Version Bluetooth : non précisée dans la donnée source
- Public visé : joueurs solo en quête de l'immersion 3D maximale sur un seul poste
- Notes éditoriales /10 — globale 8,7 · son 9 · basses 9 · ergonomie 8 · connectique 7,5 · rapport qualité-prix 7,5
- Prix : jamais recopié ici. Le site n'affiche qu'une **fourchette de gamme** déduite de `Soundbar.price` par `priceBand()` (`src/lib/prix.ts`), rendue avec sa date de relèvement par `PrixGamme.astro`
- Vérifié le : 2026-09-07 (relevé de `src/data/soundbars.ts`) · `lastUpdated` du produit : 2026-06-13
- ⚠ Piège : **aucune puissance n'est renseignée pour ce modèle**. C'est le produit le plus exposé à l'invention de watts, parce que c'est le plus haut de gamme et que le lecteur attend un chiffre. Ne pas en produire.

## Razer Leviathan V2

- Marque : Razer · Slug : `razer-leviathan-v2` · Sortie : 2022
- Canaux / haut-parleurs : 2 large bande (48×95 mm) + 2 tweeters 20 mm + 2 radiateurs passifs + caisson 14 cm
- Caisson dédié : oui · Micro intégré : non · RGB : oui
- Connectique : USB-C, Bluetooth
- Puissance : **65 W RMS** · crête **non communiquée par le constructeur**
- Réponse en fréquence annoncée : 45 Hz – 20 kHz
- Dimensions (L×H×P) : 50 × 9,1 × 8,4 cm
- Particularité : Chroma RGB sur 18 zones, THX Spatial Audio. **Ni prise jack, ni optique** — c'est un point de comparaison réel avec les Katana.
- Version Bluetooth : 5.2 (mentionnée dans le tutoriel produit)
- Public visé : joueurs PC cherchant des basses physiques et du RGB sans encombrer le bureau
- Notes éditoriales /10 — globale 8,5 · son 8,5 · basses 9 · ergonomie 8,5 · connectique 7 · rapport qualité-prix 8
- Prix : jamais recopié ici. Le site n'affiche qu'une **fourchette de gamme** déduite de `Soundbar.price` par `priceBand()` (`src/lib/prix.ts`), rendue avec sa date de relèvement par `PrixGamme.astro`
- Vérifié le : 2026-09-07 (relevé de `src/data/soundbars.ts`) · `lastUpdated` du produit : 2026-06-13

## Creative Sound Blaster Katana V2

- Marque : Creative · Slug : `creative-sound-blaster-katana-v2` · Sortie : 2022
- Canaux / haut-parleurs : 2 médiums 6,3 cm + 2 tweeters 19 mm + caisson 16,5 cm (conception tri-amplifiée)
- Caisson dédié : oui · Micro intégré : non · RGB : oui
- Connectique : USB-C, Bluetooth, Jack 3,5 mm, Optique, HDMI ARC — la plus complète du catalogue
- Puissance : RMS **non communiquée par le constructeur** · **250 W crête**
- Réponse en fréquence annoncée : 50 Hz – 20 kHz
- Dimensions (L×H×P) : 60 × 9,5 × 6,2 cm
- Particularité : moteur Super X-Fi (excelle au casque branché sur la barre), écran d'état en façade, sélecteur de source. Pilotage via Sound Blaster Command.
- Version Bluetooth : non précisée dans la donnée source
- Public visé : usage hybride PC / console / TV exigeant une connectique riche et de la puissance
- Notes éditoriales /10 — globale 8,6 · son 9 · basses 8,5 · ergonomie 8 · connectique 9,5 · rapport qualité-prix 8
- Prix : jamais recopié ici. Le site n'affiche qu'une **fourchette de gamme** déduite de `Soundbar.price` par `priceBand()` (`src/lib/prix.ts`), rendue avec sa date de relèvement par `PrixGamme.astro`
- Vérifié le : 2026-09-07 (relevé de `src/data/soundbars.ts`) · `lastUpdated` du produit : 2026-06-13
- ⚠ Piège n°1 : **seule la puissance crête existe (250 W).** Écrire « 250 W RMS » est faux. Écrire « 250 W » sans préciser « crête » est trompeur.
- ⚠ Piège n°2 : **incohérence interne de la donnée source.** Le champ `summary` annonce « cinq haut-parleurs » alors que `driverConfig` n'en détaille que quatre (2 médiums + 2 tweeters). Ne pas trancher à la place du constructeur : citer `driverConfig` tel quel, ou parler de « conception tri-amplifiée » sans avancer de compte. À arbitrer par un humain lors d'une prochaine passe éditoriale.

## Creative Sound Blaster Katana V2X

- Marque : Creative · Slug : `creative-sound-blaster-katana-v2x` · Sortie : 2022
- Canaux / haut-parleurs : 2 médiums 34 mm + 2 tweeters 19 mm + caisson 16,5 cm (conception tri-amplifiée)
- Caisson dédié : oui · Micro intégré : non · RGB : oui
- Connectique : USB-C, Bluetooth, Jack 3,5 mm, Optique, HDMI ARC
- Puissance : **90 W RMS** · **180 W crête**
- Réponse en fréquence annoncée : 50 Hz – 20 kHz
- Dimensions (L×H×P) : 60 × 6 × 7,8 cm
- Particularité : caisson annoncé 40 % plus compact que celui de la Katana V2, surround virtuel 5.1, Super X-Fi. RGB décrit comme discret.
- Version Bluetooth : non précisée dans la donnée source
- Public visé : bureau hybride cherchant la polyvalence Katana sans l'encombrement ni le prix
- Notes éditoriales /10 — globale 8,3 · son 8,5 · basses 8 · ergonomie 8,5 · connectique 9 · rapport qualité-prix 8,5
- Prix : jamais recopié ici. Le site n'affiche qu'une **fourchette de gamme** déduite de `Soundbar.price` par `priceBand()` (`src/lib/prix.ts`), rendue avec sa date de relèvement par `PrixGamme.astro`
- Vérifié le : 2026-09-07 (relevé de `src/data/soundbars.ts`) · `lastUpdated` du produit : 2026-06-13
- ℹ Un des deux seuls produits du catalogue dont **RMS et crête sont tous deux renseignés avec la réponse en fréquence** : c'est la fiche la plus complète, donc la référence à citer quand on veut illustrer la différence RMS / crête.

## Razer Leviathan V2 X

- Marque : Razer · Slug : `razer-leviathan-v2-x` · Sortie : 2022
- Canaux / haut-parleurs : 2 haut-parleurs large bande racetrack (48×95 mm) + 2 radiateurs passifs
- Caisson dédié : **non** · Micro intégré : non · RGB : oui
- Connectique : USB-C, Bluetooth
- Puissance : RMS **non communiquée par le constructeur** · crête **non communiquée par le constructeur**
- Réponse en fréquence annoncée : **non communiquée par le constructeur**
- Dimensions (L×H×P) : 40 × 8 × 8,6 cm
- Particularité : **un seul câble USB-C assure l'alimentation ET l'audio** (aucune prise secteur), 14 zones de Chroma RGB, niveau maximal annoncé 90 dB. Pas de prise jack.
- Version Bluetooth : non précisée dans la donnée source
- Public visé : setup gaming compact ou laptop cherchant un vrai upgrade simple et abordable
- Notes éditoriales /10 — globale 7,9 · son 7,5 · basses 7 · ergonomie 9 · connectique 7,5 · rapport qualité-prix 9
- Prix : jamais recopié ici. Le site n'affiche qu'une **fourchette de gamme** déduite de `Soundbar.price` par `priceBand()` (`src/lib/prix.ts`), rendue avec sa date de relèvement par `PrixGamme.astro`
- Vérifié le : 2026-09-07 (relevé de `src/data/soundbars.ts`) · `lastUpdated` du produit : 2026-06-13
- ⚠ Piège : **la fiche la plus pauvre du catalogue** — ni RMS, ni crête, ni réponse en fréquence. Le seul chiffre de niveau sonore disponible est « 90 dB », qui vient du texte éditorial `summary` et n'est **pas** une puissance. Ne jamais convertir un dB en watts.

## Creative Stage V2

- Marque : Creative · Slug : `creative-stage-v2` · Sortie : 2021
- Canaux / haut-parleurs : 2 satellites 20 W + caisson 13,3 cm (5,25") filaire
- Caisson dédié : oui (filaire) · Micro intégré : non · RGB : **non**
- Connectique : USB-C, Bluetooth, Jack 3,5 mm, Optique, HDMI ARC
- Puissance : **80 W RMS** · **160 W crête**
- Réponse en fréquence annoncée : **non communiquée par le constructeur**
- Dimensions (L×H×P) : 68 × 10 × 7,8 cm — **la barre la plus large du catalogue**
- Particularité : fonction Clear Dialog (renfort des voix), mode Surround, caisson filaire à câbler, télécommande. Connectique de type salon à petit prix.
- Version Bluetooth : 5.0 (mentionnée dans le texte éditorial)
- Public visé : petit budget voulant un vrai 2.1 polyvalent pour PC et TV
- Notes éditoriales /10 — globale 8,0 · son 7,5 · basses 8 · ergonomie 8 · connectique 9 · rapport qualité-prix 9,5
- Prix : jamais recopié ici. Le site n'affiche qu'une **fourchette de gamme** déduite de `Soundbar.price` par `priceBand()` (`src/lib/prix.ts`), rendue avec sa date de relèvement par `PrixGamme.astro`
- Vérifié le : 2026-09-07 (relevé de `src/data/soundbars.ts`) · `lastUpdated` du produit : 2026-06-13
- ⚠ Piège : le « 20 W » de `driverConfig` est une valeur **par satellite** et ne s'additionne pas au RMS du produit (2 × 20 = 40 ≠ 80 W RMS). Ne jamais recalculer une puissance à partir de `driverConfig` : citer `powerRmsWatts`.

## Creative Sound Blaster GS3

- Marque : Creative · Slug : `creative-sound-blaster-gs3` · Sortie : 2024 — **l'un des deux produits les plus récents du catalogue, à égalité avec l'Edifier MG300** (ne pas écrire « le plus récent » au singulier)
- Canaux / haut-parleurs : 2 haut-parleurs large bande (2×6 W) + radiateurs passifs
- Caisson dédié : **non** · Micro intégré : non · RGB : oui
- Connectique : USB-C, Bluetooth, Jack 3,5 mm
- Puissance : RMS **non communiquée par le constructeur** · **24 W crête**
- Réponse en fréquence annoncée : 65 Hz – 20 kHz — **la plus haute borne basse du catalogue** (donc le grave le moins étendu parmi les produits qui communiquent ce chiffre)
- Dimensions (L×H×P) : 41 × 9,3 × 7,4 cm
- Particularité : techno SuperWide (élargissement de la scène), **prise casque en façade**, alimentation par USB-C.
- Version Bluetooth : 5.4 — la plus récente **parmi les versions effectivement précisées dans la donnée source** (5 produits sur 13 n'indiquent pas de version)
- Public visé : petits bureaux et moniteurs cherchant un gain de clarté discret à petit prix
- Notes éditoriales /10 — globale 7,3 · son 7,5 · basses 6,5 · ergonomie 8,5 · connectique 7,5 · rapport qualité-prix 8,5
- Prix : jamais recopié ici. Le site n'affiche qu'une **fourchette de gamme** déduite de `Soundbar.price` par `priceBand()` (`src/lib/prix.ts`), rendue avec sa date de relèvement par `PrixGamme.astro`
- Vérifié le : 2026-09-07 (relevé de `src/data/soundbars.ts`) · `lastUpdated` du produit : 2026-06-13
- ⚠ Piège : le « 2×6 W » de `driverConfig` n'est **pas** un RMS produit et `powerRmsWatts` est absent. La seule puissance publiable est **24 W crête**.

## Creative Stage Air V2

- Marque : Creative · Slug : `creative-stage-air-v2` · Sortie : 2022
- Canaux / haut-parleurs : 2 haut-parleurs large bande custom (2×5 W) + radiateur passif surdimensionné
- Caisson dédié : **non** · Micro intégré : non · RGB : **non**
- Connectique : USB-C, Bluetooth, Jack 3,5 mm
- Puissance : RMS **non communiquée par le constructeur** · **20 W crête**
- Réponse en fréquence annoncée : **non communiquée par le constructeur**
- Dimensions (L×H×P) : 41 × 7 × 7 cm
- Particularité : **batterie intégrée (autonomie annoncée ≈ 6 h)** — seul produit nomade du catalogue. Radiateur passif surdimensionné en guise de renfort du grave.
- Version Bluetooth : 5.3
- Public visé : laptop, petit bureau ou usage nomade cherchant le minimum d'encombrement
- Notes éditoriales /10 — globale 7,0 · son 7 · basses 6 · ergonomie 9 · connectique 7,5 · rapport qualité-prix 8,5
- Prix : jamais recopié ici. Le site n'affiche qu'une **fourchette de gamme** déduite de `Soundbar.price` par `priceBand()` (`src/lib/prix.ts`), rendue avec sa date de relèvement par `PrixGamme.astro`
- Vérifié le : 2026-09-07 (relevé de `src/data/soundbars.ts`) · `lastUpdated` du produit : 2026-06-13
- ⚠ Piège : ne pas confondre avec la **Creative Stage V2** (barre 68 cm avec caisson filaire, 80 W RMS). Ce sont deux produits distincts du même nom de gamme. Voir la section Désambiguïsation.

## Creative Stage 360

- Marque : Creative · Slug : `creative-stage-360` · Sortie : 2022
- Canaux / haut-parleurs : barre 2.0 (60 W) + caisson dédié (60 W), Dolby Atmos virtuel
- Caisson dédié : oui · Micro intégré : non · RGB : **non**
- Connectique : **HDMI ARC, Optique, Bluetooth** — aucune connexion USB, aucun jack
- Puissance : **120 W RMS** · **240 W crête** — le produit le plus puissant du catalogue en RMS
- Réponse en fréquence annoncée : **non communiquée par le constructeur**
- Dimensions (L×H×P) : 56,5 × 6,6 × 10 cm
- Particularité : Dolby Atmos **virtuel** (aucune voie verticale physique), 2 entrées HDMI + ARC, télécommande infrarouge fournie.
- Version Bluetooth : non précisée dans la donnée source
- Public visé : poste hybride PC/écran ultralarge/TV cherchant l'effet surround à petit prix
- Notes éditoriales /10 — globale 8,2 · son 8,5 · basses 8,5 · ergonomie 7,5 · connectique 9 · rapport qualité-prix 8
- Prix : jamais recopié ici. Le site n'affiche qu'une **fourchette de gamme** déduite de `Soundbar.price` par `priceBand()` (`src/lib/prix.ts`), rendue avec sa date de relèvement par `PrixGamme.astro`
- Vérifié le : 2026-09-07 (relevé de `src/data/soundbars.ts`) · `lastUpdated` du produit : 2026-06-14
- ⚠ Piège n°1 : **c'est le seul produit du catalogue sans aucune connectique USB.** Toute phrase généralisante du type « toutes nos barres se branchent en USB sur le PC » est fausse à cause de ce modèle.
- ⚠ Piège n°2 : Dolby Atmos **virtuel** ≠ Dolby Atmos avec haut-parleurs de plafond. Le champ `cons` le dit explicitement. Ne jamais écrire « vrai Atmos » ni « voies verticales » pour ce produit.

## Logitech Z407

- Marque : Logitech · Slug : `logitech-z407` · Sortie : 2020 — **le produit le plus ancien du catalogue**
- Canaux / haut-parleurs : 2 satellites 10 W + caisson 20 W à émission vers le bas (ensemble 2.1)
- Caisson dédié : oui · Micro intégré : non · RGB : **non**
- Connectique : USB-A, Bluetooth, Jack 3,5 mm
- Puissance : **40 W RMS** · **80 W crête**
- Réponse en fréquence annoncée : 40 Hz – 20 kHz
- Dimensions (L×H×P) : 8,9 × 16,8 × 12 cm
- Particularité : **molette de contrôle sans fil** (volume, lecture, bascule Bluetooth), caisson à émission vers le bas.
- Version Bluetooth : non précisée dans la donnée source
- Public visé : recherche de basses marquées sur le bureau avec un budget maîtrisé
- Notes éditoriales /10 — globale 7,7 · son 7,5 · basses 8,5 · ergonomie 7,5 · connectique 7,5 · rapport qualité-prix 8,5
- Prix : jamais recopié ici. Le site n'affiche qu'une **fourchette de gamme** déduite de `Soundbar.price` par `priceBand()` (`src/lib/prix.ts`), rendue avec sa date de relèvement par `PrixGamme.astro`
- Vérifié le : 2026-09-07 (relevé de `src/data/soundbars.ts`) · `lastUpdated` du produit : 2026-06-14
- 🚫 **CE N'EST PAS UNE BARRE DE SON.** C'est un kit 2.1 : deux satellites séparés + un caisson. Le champ `summary` du produit le dit noir sur blanc (« n'est pas une barre mais un ensemble 2.1 ») et `cons` le répète. Ne jamais l'appeler « barre de son », « soundbar », ni le faire figurer dans une phrase du type « les barres de son de notre sélection ».
- ⚠ Piège dimensions : `dimensionsCm` décrit **un satellite** (8,9 cm de large pour 16,8 cm de haut), pas une barre. Écrire « barre de 8,9 cm de large » serait absurde. Utiliser ces dimensions uniquement en parlant d'« un satellite ».
- ⚠ Piège connectique : `connectivity` indique `USB-A` (côté PC), mais le tutoriel produit parle d'un **câble micro-USB**. Formuler « liaison USB » ou « câble USB fourni », et ne pas affirmer de format de connecteur côté enceinte.

## Edifier MG300

- Marque : Edifier · Slug : `edifier-mg300` · Sortie : 2024 — **l'un des deux produits les plus récents du catalogue, à égalité avec la Creative Sound Blaster GS3**
- Canaux / haut-parleurs : 2 haut-parleurs large bande 52 mm + 2 membranes passives
- Caisson dédié : **non** · Micro intégré : **oui** · RGB : oui
- Connectique : USB-A, Bluetooth
- Puissance : **5 W** (champ `powerRmsWatts`) · crête **non communiquée par le constructeur**
- Réponse en fréquence annoncée : **non communiquée par le constructeur**
- Dimensions (L×H×P) : 48,5 × 7,4 × 8 cm
- Particularité : **micro intégré** reconnu par Windows en périphérique d'entrée (visio, chat vocal) — 6 modes d'éclairage RGB.
- Version Bluetooth : 5.3
- Public visé : petit bureau mêlant gaming léger et visioconférences
- Notes éditoriales /10 — globale 7,2 · son 7 · basses 6 · ergonomie 9 · connectique 7,5 · rapport qualité-prix 8,5
- Prix : jamais recopié ici. Le site n'affiche qu'une **fourchette de gamme** déduite de `Soundbar.price` par `priceBand()` (`src/lib/prix.ts`), rendue avec sa date de relèvement par `PrixGamme.astro`
- Vérifié le : 2026-09-07 (relevé de `src/data/soundbars.ts`) · `lastUpdated` du produit : 2026-06-14
- ℹ **Seul produit du catalogue avec `hasMicrophone: true`.** Toute recommandation « barre avec micro pour la visio » ne peut désigner que ce produit. Ne jamais attribuer un micro à un autre modèle.
- ⚠ Piège : `powerRmsWatts: 5` est à citer **tel quel**, en watts, sans préciser « par voie » ni « au total » — le champ ne le dit pas. Ne pas doubler le chiffre, ne pas l'arrondir, ne pas l'interpréter.

## Trust GXT 620 Axon

- Marque : Trust · Slug : `trust-gxt-620-axon` · Sortie : 2021
- Canaux / haut-parleurs : 2 haut-parleurs large bande, illumination RGB
- Caisson dédié : **non** · Micro intégré : non · RGB : oui
- Connectique : USB-A, Jack 3,5 mm — **pas de Bluetooth**
- Puissance : **6 W RMS** · **12 W crête** — la puissance crête la plus basse du catalogue. Attention : ce n'est **pas** le RMS le plus bas (`edifier-mg300` et `edifier-g1500` sont à 5 W).
- Réponse en fréquence annoncée : **non communiquée par le constructeur**
- Dimensions (L×H×P) : 42 × 6,8 × 7,8 cm
- Particularité : **l'USB ne transporte que l'alimentation et le RGB ; l'audio passe par le jack 3,5 mm.** Éclairage « rainbow » automatique, molette de volume en façade.
- Version Bluetooth : sans objet — le produit n'a pas de Bluetooth
- Public visé : setup gaming d'entrée de gamme et usage bureautique à petit budget
- Notes éditoriales /10 — globale 6,8 · son 6,5 · basses 6 · ergonomie 8 · connectique 6,5 · rapport qualité-prix 8
- Prix : jamais recopié ici. Le site n'affiche qu'une **fourchette de gamme** déduite de `Soundbar.price` par `priceBand()` (`src/lib/prix.ts`), rendue avec sa date de relèvement par `PrixGamme.astro`
- Vérifié le : 2026-09-07 (relevé de `src/data/soundbars.ts`) · `lastUpdated` du produit : 2026-06-14
- ⚠ Piège n°1 : **`USB-A` dans `connectivity` ne veut pas dire « audio USB ».** Ici l'USB est une prise d'alimentation. Écrire « barre USB plug-and-play » pour ce modèle est faux : sans jack disponible sur la machine, il faut un adaptateur USB-audio (le tutoriel produit le précise).
- ⚠ Piège n°2 : **seul produit du catalogue sans Bluetooth.** Toute phrase du type « toutes nos barres sont Bluetooth » est fausse à cause de ce modèle.

## Edifier G1500

- Marque : Edifier · Slug : `edifier-g1500` · Sortie : 2023
- Canaux / haut-parleurs : 2 enceintes 2.0 compactes + radiateurs passifs, éclairage RGB
- Caisson dédié : **non** · Micro intégré : non · RGB : oui
- Connectique : USB-A, Bluetooth, Jack 3,5 mm
- Puissance : **5 W** (champ `powerRmsWatts`) · crête **non communiquée par le constructeur**
- Réponse en fréquence annoncée : **non communiquée par le constructeur**
- Dimensions (L×H×P) : 9 × 14 × 9 cm
- Particularité : modes Auto EQ (Musique / Jeu / Film), effets RGB, vraie séparation stéréo par deux enceintes distinctes.
- Version Bluetooth : 5.3
- Public visé : bureau gaming/musique préférant deux enceintes à une barre unique
- Notes éditoriales /10 — globale 7,4 · son 7,5 · basses 6,5 · ergonomie 8 · connectique 8 · rapport qualité-prix 8,5
- Prix : jamais recopié ici. Le site n'affiche qu'une **fourchette de gamme** déduite de `Soundbar.price` par `priceBand()` (`src/lib/prix.ts`), rendue avec sa date de relèvement par `PrixGamme.astro`
- Vérifié le : 2026-09-07 (relevé de `src/data/soundbars.ts`) · `lastUpdated` du produit : 2026-06-14
- 🚫 **CE N'EST PAS UNE BARRE DE SON.** C'est une paire d'enceintes 2.0. Le champ `summary` du produit le dit explicitement (« n'est pas une barre mais une paire d'enceintes 2.0 compactes ») et `cons` le confirme (« Format 2.0, pas une barre »).
- ⚠ Piège dimensions : `dimensionsCm` décrit **une enceinte** (9 × 14 × 9 cm), pas une barre.
- ⚠ Piège : `powerRmsWatts: 5`, à citer tel quel, sans préciser « par enceinte » ni « au total » — le champ ne le dit pas.

---

# Désambiguïsation

Les confusions ci-dessous sont celles qu'un modèle de langage commet **spontanément**, parce que
les familles de produits se ressemblent statistiquement. Chacune a déjà un coût éditorial réel.

## 1. Barre de son PC ≠ barre de son TV

Ce sont deux catégories de produits différentes, pas deux tailles du même produit.

| | Barre de son **PC** | Barre de son **TV** |
|---|---|---|
| Largeur | 40 à 68 cm dans ce catalogue | 90 à 120 cm couramment |
| Alimentation | Souvent **un seul câble USB** depuis le PC (alim + audio) | Bloc secteur obligatoire |
| Distance d'écoute | 50 à 80 cm — écoute de proche champ | 2 à 4 m |
| Priorité sonore | **Clarté des voix** (visio, chat vocal, dialogues de jeu) et scène large à courte distance | Puissance, grave, effets surround dans un volume de pièce |
| Placement | Sous le moniteur, entre le clavier et le pied d'écran | Sous la TV, sur un meuble |
| Connectique attendue | USB, Bluetooth, jack | HDMI ARC/eARC, optique |

Conséquences pratiques pour la rédaction :

- **Ne jamais transposer un test de barre TV à une barre PC.** Une barre TV jugée « manquant de
  grave dans un salon » peut être largement suffisante à 60 cm des oreilles.
- **Ne jamais présenter une largeur de barre PC comme un défaut** par comparaison avec une barre
  TV : la contrainte, sur un bureau, est de tenir sous l'écran.
- **L'alimentation par un seul câble USB est un argument majeur** propre au monde PC. Dans ce
  catalogue, `razer-leviathan-v2-x` et `creative-sound-blaster-gs3` en sont les exemples ; à
  l'inverse `trust-gxt-620-axon` a bien un câble USB mais **seulement pour l'alimentation**.
- **La priorité voix** justifie de mettre en avant Clear Dialog (`creative-stage-v2`) ou le micro
  intégré (`edifier-mg300`), qui n'auraient pas le même poids sur une barre de salon.

## 2. Barre de son ≠ kit d'enceintes 2.0 / 2.1

Le catalogue contient **deux produits qui ne sont pas des barres de son**. C'est écrit dans leur
propre champ `summary` et dans leur champ `cons`.

| Produit | Ce que c'est réellement | Formulation interdite |
|---|---|---|
| **Logitech Z407** (`logitech-z407`) | Kit **2.1** : deux satellites séparés + un caisson à émission vers le bas | « la barre Logitech Z407 », « cette barre de son Logitech », inclusion dans « nos barres de son » |
| **Edifier G1500** (`edifier-g1500`) | Paire d'enceintes **2.0** compactes | « la barre Edifier G1500 », « cette barre RGB Edifier », inclusion dans « nos barres de son » |

Formulations correctes : « le kit 2.1 Logitech Z407 », « l'ensemble 2.1 Logitech Z407 », « la paire
d'enceintes 2.0 Edifier G1500 », « les enceintes Edifier G1500 ». Ces deux produits sont présentés
sur le site comme des **alternatives** à une barre de son, pas comme des barres.

**Nuance importante à ne pas confondre avec ce qui précède :** un produit peut être une vraie barre
de son **et** un système 2.1. C'est le cas de `creative-stage-v2` (barre de 68 cm + caisson
filaire), `creative-stage-360` (barre de 56,5 cm + caisson), `razer-leviathan-v2`,
`razer-leviathan-v2-pro` et des deux Katana. Avoir un caisson ne disqualifie pas une barre ; ce qui
disqualifie le Z407 et le G1500, c'est l'**absence de barre** dans le produit. Le test à appliquer :
le produit comporte-t-il un unique boîtier long à poser sous l'écran ? Si `dimensionsCm` a une
largeur inférieure à sa hauteur (Z407 : 8,9 × 16,8 ; G1500 : 9 × 14), ce n'est pas une barre.

## 3. Watts RMS ≠ watts crête

**Les watts affichés sur les emballages et dans les fiches marchandes sont presque toujours la
puissance crête** (peak, PMPO, « music power »), parce que le chiffre est plus grand. La puissance
RMS est la seule qui décrive une puissance soutenue.

Règles :

1. **Toujours dire lequel des deux on cite.** « 250 W » seul est trompeur ; « 250 W crête » est
   exact ; « 250 W RMS » pour la Katana V2 est **faux**.
2. **Ne jamais convertir l'un en l'autre.** Il n'existe pas de règle de trois valide (le rapport
   observé dans ce catalogue va de 1,5× à 2×). Si le RMS est absent, il reste absent.
3. **Ne jamais comparer un RMS à une crête.** La Katana V2 (250 W crête) n'est pas « deux fois plus
   puissante » que la Stage 360 (120 W RMS) : les deux chiffres ne mesurent pas la même chose.
4. **Ne jamais additionner les watts de `driverConfig`** pour fabriquer une puissance. Le champ
   décrit des transducteurs, pas le produit. Contre-exemple prouvé dans la donnée :
   `creative-stage-v2` annonce « 2 satellites 20 W » (soit 40 W) mais `powerRmsWatts: 80`.

État réel du catalogue, à connaître avant d'écrire une comparaison de puissances :

| Produit | RMS | Crête |
|---|---|---|
| Razer Leviathan V2 Pro | non communiqué | non communiqué |
| Razer Leviathan V2 | 65 W | non communiqué |
| Creative Sound Blaster Katana V2 | non communiqué | 250 W |
| Creative Sound Blaster Katana V2X | 90 W | 180 W |
| Razer Leviathan V2 X | non communiqué | non communiqué |
| Creative Stage V2 | 80 W | 160 W |
| Creative Sound Blaster GS3 | non communiqué | 24 W |
| Creative Stage Air V2 | non communiqué | 20 W |
| Creative Stage 360 | 120 W | 240 W |
| Logitech Z407 | 40 W | 80 W |
| Edifier MG300 | 5 W | non communiqué |
| Trust GXT 620 Axon | 6 W | 12 W |
| Edifier G1500 | 5 W | non communiqué |

Il n'existe donc **aucun classement complet par puissance** possible sur ce catalogue :

- **5 produits sans RMS** : `razer-leviathan-v2-pro`, `creative-sound-blaster-katana-v2`,
  `razer-leviathan-v2-x`, `creative-sound-blaster-gs3`, `creative-stage-air-v2`
- **5 produits sans crête** : `razer-leviathan-v2-pro`, `razer-leviathan-v2`,
  `razer-leviathan-v2-x`, `edifier-mg300`, `edifier-g1500`
- **2 produits sans aucune puissance** : `razer-leviathan-v2-pro`, `razer-leviathan-v2-x`

Toute phrase du type « la plus puissante de notre sélection » doit préciser l'unité de mesure et
exclure explicitement les produits sans donnée. Le helper `powerLabel()` de `soundbars.ts` applique
déjà cette logique côté site : RMS s'il existe, sinon crête, sinon `—`.

Attention au piège de raisonnement : **un produit sans puissance renseignée n'est pas un produit
peu puissant.** Les deux fiches les plus muettes du catalogue sont la Leviathan V2 Pro (le haut de
gamme) et la Leviathan V2 X. Ne jamais déduire une faiblesse d'une absence de donnée, ni classer un
produit en bas d'un comparatif parce que son champ est vide.

## 4. THX Spatial (Razer) ≠ Super X-Fi (Creative) ≠ Dolby Atmos

Trois technologies distinctes, de trois origines différentes, **non interchangeables**. Les
confondre revient à attribuer à un produit une techno qu'il ne possède pas.

| Techno | Propriétaire | Produits du catalogue | Ce que c'est |
|---|---|---|---|
| **THX Spatial Audio** | Razer (THX) | `razer-leviathan-v2-pro`, `razer-leviathan-v2` | Traitement spatial virtuel Razer, activé via Razer Synapse |
| **Super X-Fi** (noté aussi SXFI) | Creative | `creative-sound-blaster-katana-v2`, `creative-sound-blaster-katana-v2x` | Traitement Creative, dont le point fort documenté est l'écoute **au casque** branché sur la barre, avec cartographie personnalisée via l'appli mobile |
| **Dolby Atmos (virtuel)** | Dolby | `creative-stage-360` **uniquement** | Format audio objet ; ici en rendu **virtuel**, sans voie verticale physique |

Règles :

- **Un seul produit du catalogue est associé à Dolby Atmos** : `creative-stage-360`. Ne l'attribuer
  à aucun autre, en particulier pas aux Katana ni aux Leviathan.
- **THX Spatial n'est pas du Dolby Atmos** et ne doit jamais être décrit comme « du Atmos » ou
  « équivalent Atmos ».
- **Super X-Fi n'est pas un surround d'enceintes** : c'est d'abord un traitement casque.
- **Le suivi de tête par caméra infrarouge est propre à `razer-leviathan-v2-pro`.** Ni la
  Leviathan V2, ni la V2 X, ni aucun autre produit du catalogue ne l'a. C'est la confusion la plus
  probable de toute la fiche Razer.
- **Autres traitements maison à ne pas mélanger** : SuperWide (`creative-sound-blaster-gs3`),
  Clear Dialog (`creative-stage-v2`), Auto EQ (`edifier-g1500`), surround virtuel 5.1
  (`creative-sound-blaster-katana-v2x`). Chacun n'appartient qu'au produit indiqué.

## 5. Creative Stage ≠ Creative Sound Blaster Katana ≠ Creative Sound Blaster GS

Creative est la marque la plus représentée du catalogue (6 produits sur 13) avec **trois gammes
distinctes** qu'un modèle fusionne facilement.

| Gamme | Produits du catalogue | Positionnement |
|---|---|---|
| **Creative Stage** | `creative-stage-v2`, `creative-stage-air-v2`, `creative-stage-360` | Grand public / salon-bureau, connectique HDMI-optique, pas de Super X-Fi |
| **Creative Sound Blaster Katana** | `creative-sound-blaster-katana-v2`, `creative-sound-blaster-katana-v2x` | Gaming premium, tri-amplifié, Super X-Fi |
| **Creative Sound Blaster GS** | `creative-sound-blaster-gs3` | Mini-barre d'entrée de gamme, SuperWide |

- « Sound Blaster » fait partie du nom des Katana et de la GS3, **jamais** des Stage. Écrire
  « Creative Sound Blaster Stage V2 » est une erreur de nom de produit.
- À l'inverse, écrire « Creative Katana V2 » en omettant « Sound Blaster » ne correspond pas au
  champ `name`. Voir la section Orthographe.

## 6. Les trois « Stage » ne sont pas des variantes de taille du même produit

| Produit | Barre | Caisson | Puissance | Connectique |
|---|---|---|---|---|
| `creative-stage-v2` | 68 cm | oui, filaire | 80 W RMS / 160 W crête | USB-C, BT, jack, optique, HDMI ARC |
| `creative-stage-air-v2` | 41 cm | **non** | crête 20 W (RMS non communiqué) | USB-C, BT, jack |
| `creative-stage-360` | 56,5 cm | oui | 120 W RMS / 240 W crête | HDMI ARC, optique, BT — **pas d'USB** |

« Stage Air V2 » n'est pas « la Stage V2 en plus petit » : c'est un produit sur batterie, sans
caisson, 4× moins puissant en crête. Et « Stage 360 » n'est pas « la Stage V2 avec du surround » :
elle perd l'USB et le jack.

## 7. Suffixes Razer : V2 ≠ V2 X ≠ V2 Pro

Trois produits distincts de la gamme Leviathan, et le catalogue **n'en contient pas d'autre**.

| Nom exact | Caisson | RGB | Puissance | Trait distinctif |
|---|---|---|---|---|
| **Razer Leviathan V2** | oui (14 cm) | 18 zones | 65 W RMS | THX Spatial, ni jack ni optique |
| **Razer Leviathan V2 X** | **non** | 14 zones | non communiquée | Un seul câble USB-C, 40 cm |
| **Razer Leviathan V2 Pro** | oui (13,3 cm) | oui | non communiquée | Suivi de tête par caméra IR |

- Il n'existe **pas** de « Leviathan V2 X Pro », ni de « Leviathan V3 », ni de « Leviathan Pro »
  dans ce catalogue. N'inventer aucune variante intermédiaire.
- Attention à l'espace : Razer écrit **« V2 X » avec une espace**, Creative écrit **« V2X » sans
  espace** (Katana V2X). Les deux orthographes ne sont pas interchangeables et sont chacune
  attachée à une marque différente. C'est le piège d'orthographe le plus facile à commettre du
  catalogue.

## 8. « Alimenté en USB » ≠ « audio par USB »

Un câble USB peut ne transporter que du courant. La distinction est publiable telle quelle et se
vérifie produit par produit.

- **USB = alimentation + audio** : `razer-leviathan-v2-x`, `creative-sound-blaster-gs3`,
  `edifier-mg300`, et l'USB-C des Katana et des Leviathan V2/V2 Pro.
- **USB = alimentation seule, audio par jack** : `trust-gxt-620-axon`.
- **Aucun USB du tout** : `creative-stage-360`.

Donc : ne jamais écrire « toutes nos barres se branchent en USB », ni « une barre USB est forcément
plug-and-play ». Vérifier `connectivity` **et** le tutoriel du produit.

## 9. Autres généralisations fausses sur ce catalogue

Ces phrases sont fausses telles quelles. Elles sont listées parce qu'elles « sonnent vrai » et
qu'un modèle les produit volontiers en introduction de guide.

| Phrase à ne pas écrire | Pourquoi elle est fausse |
|---|---|
| « Toutes nos barres ont un caisson de basses » | 6 produits sur 13 n'en ont pas (`hasSubwoofer: false`) |
| « Toutes nos barres sont Bluetooth » | `trust-gxt-620-axon` n'a pas de Bluetooth |
| « Toutes nos barres sont RGB » | 4 produits ne le sont pas : `creative-stage-v2`, `creative-stage-air-v2`, `creative-stage-360`, `logitech-z407` |
| « Toutes nos barres ont un micro pour la visio » | **Un seul** produit a un micro : `edifier-mg300` |
| « Toutes nos barres se branchent en USB » | `creative-stage-360` n'a aucun USB |
| « Toutes nos barres ont une prise jack » | 4 produits n'en ont pas : `razer-leviathan-v2`, `razer-leviathan-v2-x`, `creative-stage-360`, `edifier-mg300` |
| « Nos 13 barres de son » | 11 barres + 1 kit 2.1 + 1 paire 2.0. Dire « nos 13 produits » ou « nos 11 barres de son » |
| « La plus puissante de notre sélection » | Indéfini : 4 produits sans RMS, 4 sans crête, 2 sans aucune puissance |
| « Toutes nos barres descendent à 40 Hz » | La réponse en fréquence est **absente sur 7 produits sur 13** |

Compteurs de contrôle (dérivés de la donnée au 2026-09-07, à revérifier si le catalogue change) :
13 produits · 11 barres de son · 7 avec caisson · 1 avec micro · 9 avec RGB · 12 avec Bluetooth ·
8 en USB-C · 4 en USB-A · 1 sans USB · 4 avec HDMI ARC · 4 avec optique · 9 avec jack ·
6 avec réponse en fréquence renseignée · aucun avec Wi-Fi.

---

# Orthographe normalisée des entités

**Pourquoi c'est une règle et pas une préférence de style :** deux orthographes comptent pour deux
produits différents. Pour le site, parce que la recherche interne, les slugs, les ancres de liens
internes et le balisage `schema.org` reposent sur des chaînes de caractères exactes — un nom mal
écrit ne se relie à rien. Pour un moteur, classique ou génératif, parce que la reconnaissance
d'entité se fait aussi par correspondance de chaîne : « SoundBlaster Katana v2 » et
« Sound Blaster Katana V2 » ne se consolident pas forcément vers la même entité, ce qui dilue le
signal au lieu de le renforcer. Sur un site dont l'enjeu est d'être **cité** comme source, une
orthographe flottante coûte directement en citations.

## Marques (5)

| Écriture correcte | Variantes à ne jamais utiliser |
|---|---|
| **Razer** | Rayzer, RAZER (en corps de texte), Razor |
| **Creative** | Creative Labs (hors mention historique explicite), CREATIVE, Creativ |
| **Logitech** | Logitec, Logi (hors marque Logi officielle), LOGITECH |
| **Edifier** | Ediffier, EDIFIER, Edifier Technology (hors mention de la raison sociale) |
| **Trust** | TRUST, Trust Gaming (le champ `brand` est `Trust`), Trust GXT (GXT est la gamme, pas la marque) |

## Produits (13)

| Écriture correcte (= champ `name`) | Variantes à ne jamais utiliser |
|---|---|
| **Razer Leviathan V2 Pro** | Leviathan V2 pro, Leviathan V2Pro, Razer Leviathan 2 Pro, Razer Leviathan V2 X Pro, Leviathan Pro, Razer Leviathan V2 PRO |
| **Razer Leviathan V2** | Leviathan v2, Razer Leviathan 2, Razer Leviathan V.2, Leviathan V2 Standard, Razer Leviathan |
| **Creative Sound Blaster Katana V2** | SoundBlaster Katana v2, Sound Blaster Katana 2, Creative Katana V2, Katana V2 Pro, Creative Sound Blaster Katana V2 Pro, Creative Stage Katana V2 |
| **Creative Sound Blaster Katana V2X** | Katana V2 X (avec espace — c'est l'orthographe Razer), SoundBlaster Katana V2X, Creative Katana V2X, Katana V2 Lite, Katana V2x |
| **Razer Leviathan V2 X** | Leviathan V2X (sans espace — c'est l'orthographe Creative), Razer Leviathan V2-X, Leviathan V2 x, Razer Leviathan X |
| **Creative Stage V2** | Creative Stage v2, Creative Sound Blaster Stage V2, Stage 2, Creative Stage V2 Air, Creative Stage Pro |
| **Creative Sound Blaster GS3** | SoundBlaster GS3, Sound Blaster GS-3, Creative GS3 Pro, Sound Blaster G3, Creative Stage GS3 |
| **Creative Stage Air V2** | Creative Air Stage V2, Creative Stage V2 Air, Stage Air 2, Creative Stage Air, Creative Stage Air V2 Pro |
| **Creative Stage 360** | Creative Stage V360, Stage 360 V2, Creative Sound Blaster Stage 360, Creative 360, Creative Stage 3.60 |
| **Logitech Z407** | Logitech Z-407, Logitech Z 407, Z407 soundbar, barre de son Logitech Z407, Logitech Z407 Pro |
| **Edifier MG300** | Edifier MG-300, Edifier MG 300, MG300 Pro, Edifier MG3000, Edifier M300 |
| **Trust GXT 620 Axon** | Trust GXT620 Axon, Trust Axon GXT 620, Trust GXT 620, Trust Axon, GXT 620 Axone |
| **Edifier G1500** | Edifier G-1500, Edifier G 1500, Edifier G1500 Pro, Edifier G1500 Max, Edifier G15000, barre de son Edifier G1500 |

### Formes courtes autorisées

Première mention dans une page : **toujours le nom complet exact**. Ensuite, ces raccourcis sont
acceptés parce qu'ils restent non ambigus dans ce catalogue :

- Razer Leviathan V2 Pro → « la Leviathan V2 Pro »
- Razer Leviathan V2 → « la Leviathan V2 »
- Razer Leviathan V2 X → « la Leviathan V2 X » (garder l'espace avant le X)
- Creative Sound Blaster Katana V2 → « la Katana V2 »
- Creative Sound Blaster Katana V2X → « la Katana V2X » (sans espace)
- Creative Stage V2 → « la Stage V2 »
- Creative Sound Blaster GS3 → « la GS3 »
- Creative Stage Air V2 → « la Stage Air V2 »
- Creative Stage 360 → « la Stage 360 »
- Logitech Z407 → « le Z407 » (masculin : c'est un kit, pas une barre)
- Edifier MG300 → « la MG300 »
- Trust GXT 620 Axon → « la GXT 620 Axon »
- Edifier G1500 → « le G1500 » ou « les G1500 » (masculin/pluriel : ce sont des enceintes)

### Règles de casse et de typographie

- Les suffixes de version sont en **majuscule** : `V2`, `V2X`, `V2 X`, jamais `v2`.
- « Sound Blaster » s'écrit **en deux mots**. « SoundBlaster » est incorrect.
- Les noms de marque ne sont pas en capitales dans le corps du texte : « Razer », pas « RAZER ».
- Les unités : `40 Hz`, `20 kHz`, `65 W`, `250 W crête`, `60 cm` — espace insécable avant l'unité,
  `Hz` et `kHz` avec cette casse exacte, `W` majuscule.
- Décimales en français : **virgule** (`11,4 cm`, `8,5/10`), pas de point.
- Les slugs sont en minuscules avec tirets et ne se traduisent ni ne se reformatent jamais.

---

## Journal de vérification

| Date | Portée | Source | Opérateur |
|---|---|---|---|
| 2026-09-07 | Création du fichier, 13 fiches produit relevées champ par champ | `src/data/soundbars.ts`, `src/data/types.ts`, `src/data/brands.ts` | Claude Code |

**Anomalies constatées dans la donnée source, à arbitrer par un humain :**

1. `creative-sound-blaster-katana-v2` — `summary` annonce « cinq haut-parleurs » là où
   `driverConfig` en détaille quatre (2 médiums + 2 tweeters). Incohérence interne non tranchée.
2. `creative-stage-v2` — les watts de `driverConfig` (2 × 20 W) ne concordent pas avec
   `powerRmsWatts: 80`. Normal si `driverConfig` décrit des transducteurs, mais c'est un piège
   permanent pour toute rédaction automatique.
3. `logitech-z407` et `edifier-g1500` — `dimensionsCm` est documenté comme « dimensions de la
   barre » dans `types.ts`, alors que ces deux produits n'ont pas de barre : les valeurs décrivent
   un satellite / une enceinte.
4. `logitech-z407` — `connectivity` indique `USB-A` tandis que le tutoriel produit mentionne un
   câble micro-USB.
5. `edifier-mg300` et `edifier-g1500` — `powerRmsWatts: 5` sans indication « par voie » ou
   « total ».

**Quand mettre ce fichier à jour :** à chaque ajout, retrait ou modification d'un produit dans
`src/data/soundbars.ts`. Un fichier de faits périmé est plus dangereux qu'un fichier absent,
parce qu'il inspire confiance.
