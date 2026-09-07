# Playbook R1 — Veille & blog

**Routine R1 — Veille & blog.** Cadence : **mardi et vendredi**, un seul réveil
par jour actif — cron `0 7 * * 2,5` (UTC), soit 9 h heure de Paris en été.
Publie **1 à 2 articles par semaine**, jamais plus.

**Ce playbook ne prescrit jamais un cron : il constate celui du service.** La
seule autorité sur la cadence est `scripts/news.config.mjs`. L'étape 0 vérifie
que la configuration servie porte bien `activeDays: [2, 5]`, `runsPerDay: 1`,
`minPerWeek: 1`, `maxPerWeek: 2`. En cas de divergence, tu ouvres une issue et
tu t'arrêtes — tu ne « corriges » ni le cron ni la configuration.

**Branche de déploiement : `main`.** `.github/workflows/deploy.yml` ne se
déclenche que sur un push vers `main`. Zéro branche de travail, zéro Pull
Request, zéro demande de validation : l'autorisation de pousser sur `main` est
permanente et acquise. Un article resté ailleurs est un article **non publié**,
donc un échec de la routine.

**Ce fichier est le seul document vers lequel tu es pointé.** Exécute les étapes
dans l'ordre, sans improviser. Quand une étape dit « arrête-toi », tu
t'arrêtes : ne rien publier est un résultat **normal, fréquent et réussi**.

**Ce site n'est pas un média d'actualité.** Le créneau « barre de son PC »
produit deux à quatre nouveautés par an. Le régime nominal de cette routine est
donc l'**evergreen** tiré de la réserve de l'étape 2 ; l'actualité est
l'exception qui passe devant quand elle existe. Une séance de veille qui ne
trouve aucune actualité n'a rien raté : c'est le fonctionnement attendu, environ
dix-neuf fois sur vingt.

---

## Étape 0 — Préflight (quatre contrôles, aucun n'est optionnel)

### 0.1 — Le canal d'incident répond-il ?

Une routine qui ne peut pas alerter ne doit pas travailler.

```bash
gh auth status || { echo "CANAL D INCIDENT INDISPONIBLE — arret"; exit 1; }
```

Si `gh` n'est pas authentifié : **arrête-toi**. N'écris rien, ne commite rien.

### 0.2 — La cadence servie est-elle bien celle décidée ?

```bash
grep -nE 'minPerWeek:|maxPerWeek:|activeDays:|runsPerDay:' scripts/news.config.mjs
git status --porcelain scripts/news.config.mjs
```

Attendu, exactement : `minPerWeek: 1`, `maxPerWeek: 2`, `activeDays: [2, 5]`,
`runsPerDay: 1`, et **aucune ligne** en sortie de `git status --porcelain`.

Toute autre valeur, ou un fichier modifié non commité, signifie que le portillon
ne calcule pas la cadence décidée. Dans ce cas :

```bash
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R1 Veille — cadence servie divergente" \
  --body "Valeurs relevees dans scripts/news.config.mjs : <colle la sortie du grep>. Attendu : minPerWeek 1, maxPerWeek 2, activeDays [2, 5], runsPerDay 1. Aucune publication ce jour."
```

puis **arrête-toi**. Ne publie pas, ne modifie pas la configuration.

### 0.3 — Le journal est-il lisible, et combien d'entrées porte-t-il ?

```bash
node -e "const j=require('./scripts/news-ledger.json');console.log('entrees : '+j.published.length)"
```

**Note ce nombre** : il s'appelle `N` dans la suite du playbook et sert de
garde-fou anti-amputation à l'étape 7. Si la commande échoue, le journal est
illisible (conflit de fusion mal résolu, fichier tronqué) : ouvre une issue
« R1 Veille — journal illisible », **arrête-toi**, et ne lance surtout pas
`news-record.mjs`, qui recréerait un journal amputé en code de sortie 0.

### 0.4 — Reste-t-il un article orphelin d'une exécution précédente ?

Un article écrit mais dont le journal n'a jamais été mis à jour est le résidu
d'une exécution interrompue (quota, délai, rejet de push). On le termine, on
n'en écrit pas un nouveau.

```bash
node -e "
const fs=require('fs');
const led=JSON.parse(fs.readFileSync('scripts/news-ledger.json','utf8')).published.map(e=>e.slug);
const files=fs.readdirSync('src/content/blog').filter(f=>f.endsWith('.md')).map(f=>f.replace(/\.md$/,''));
const orph=files.filter(s=>!led.includes(s));
console.log(orph.length?'ORPHELIN : '+orph.join(', '):'Aucun orphelin — '+files.length+' article(s), '+led.length+' entree(s)');
"
```

- « Aucun orphelin » → continue à l'étape 1.
- « ORPHELIN : `<slug>` » → **saute les étapes 1 à 4**, reprends directement à
  l'étape 5 sur ce slug (illustration, contrôle qualité, publication). Un seul
  orphelin traité par exécution. S'il y en a plusieurs, traite le plus ancien et
  ouvre une issue listant les autres.

---

## Étape 1 — Décider s'il faut publier

```bash
node scripts/news-gate.mjs
```

La sortie est **une seule ligne** : `GO: <raison>` ou `SKIP: <raison>`. Le code
de sortie vaut 0 dans les deux cas — **lis la ligne, jamais le code**.

- **`SKIP`** → **ARRÊTE-TOI IMMÉDIATEMENT.** Pas de veille, pas de fichier, pas
  de commit, pas d'issue. C'est le cas le plus fréquent et c'est une réussite.
- **`GO`** → continue à l'étape 2.

**Un `GO` autorise, il n'oblige pas.** Le portillon ne connaît que la date et le
journal : il ne sait pas s'il existe un sujet. La matière se décide à l'étape 2,
et un `GO` suivi d'un « aucun sujet admissible » se solde par un **SKIP
éditorial** (étape 2.6), qui est lui aussi un résultat réussi. Ne laisse jamais
la pression d'un `GO` te faire publier un sujet que tu n'aurais pas retenu.

Échappatoire de test, jamais dans une exécution planifiée :
`NEWS_FORCE=1 node scripts/news-gate.mjs`.

---

## Étape 2 — Veille : l'evergreen d'abord, l'actualité en exception

### 2.1 — Lire ce qui est déjà couvert (obligatoire, dans cet ordre)

```bash
node -e "require('./scripts/news-ledger.json').published.slice(-60).forEach(e=>console.log(e.date, e.slug, '|', e.topic))"
ls src/content/blog/
grep -n "  title: '" src/data/guides.ts src/data/rankings.ts
```

Le champ `topic` des anciennes entrées vaut une liste de tags (« technique,
conseils ») et ne discrimine rien : **ne t'y fie pas seul**. Lis aussi les slugs
et les titres. À partir de cette exécution, le `topic` porte la requête ciblée
et le numéro de réserve (étape 7.6) — c'est ce format qui devient la mémoire
utile.

Les intentions déjà servies, à ne **jamais** redoubler par un article :

- **7 classements** (`src/data/rankings.ts`) : comparatif général, gaming, pas
  chères, compactes, polyvalentes, sans fil, avec caisson.
- **6 guides** (`src/data/guides.ts`) : comment choisir, comment installer,
  barre contre enceintes, télétravail et visio, sans fil et Bluetooth, petit
  bureau et moniteur.
- **5 articles de blog** : réglages Windows, barre ou casque en télétravail,
  watts RMS et crête, son spatial THX contre Super X-Fi, USB / jack /
  Bluetooth.

**Test de non-recouvrement.** Si l'intention de recherche du sujet envisagé est
déjà servie par un classement ou un guide, la bonne action n'est pas d'écrire un
article : c'est d'enrichir la page existante — ce qui n'est **pas** le mandat de
R1. Dans ce cas, abandonne le sujet et passe au suivant de la réserve, ou ouvre
une issue « enrichissement de page » et continue.

### 2.2 — Test d'appartenance au périmètre (avant toute rédaction)

**Une seule question : le sujet concerne-t-il l'écoute assise à moins d'un mètre
d'un écran d'ordinateur ?** Si non, abandon immédiat, sans négociation.

- **Liste blanche** (dans le périmètre) : Razer, Creative / Sound Blaster,
  Logitech, Edifier, Trust, ASUS ROG, OXS, Redragon, et tout ce qui touche
  Windows, macOS, l'USB, le jack, le Bluetooth d'un PC, un moniteur, un bureau.
- **Liste noire** (hors périmètre, même si la source est excellente) : Samsung
  HW-, LG S- / SC-, Sonos, Bose Smart Soundbar, Hisense, TCL, Sony Bravia
  Theatre, Devialet, et tout ce qui se règle depuis un canapé.

Attention au piège de source : RTINGS et la rubrique « barre de son » de Clubic
sont d'excellentes sources de **mesure** (méthodologie, réponse en fréquence) et
de très mauvaises sources d'**actualité PC** — leur couverture est du home
cinéma à plus de 95 %. Les utiliser pour chercher une actualité fait
mécaniquement sortir du périmètre.

### 2.3 — Régime nominal : prendre le premier sujet non consommé de la réserve

La réserve est le tableau de l'étape 2.7 de ce fichier. **Prends la première
ligne dont la case n'est pas cochée**, applique le test de non-recouvrement
(2.1) et le test de périmètre (2.2), et garde-la. Si elle échoue un test, coche
la ligne avec la mention `[×]` et un motif d'une ligne, puis passe à la
suivante.

Combien reste-t-il de sujets ?

```bash
grep -c '^| \[ \] |' scripts/veille-playbook.md
```

**Règle de budget, non négociable.** Si ce nombre est **inférieur à 10**, la
routine **cesse de publier** :

```bash
gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
  --title "R1 Veille — reserve editoriale a reapprovisionner" \
  --body "Il reste <N> sujets non consommes dans scripts/veille-playbook.md, seuil d alerte 10. La routine ne publie plus jusqu a reapprovisionnement. La cadence servie demande environ 84 articles par an (verifie : node scripts/simule-cadence.mjs 2026|2027|2028 rend 86, 73 et 92)."
```

puis arrête-toi. Publier au-delà de la réserve, c'est republier le même sujet
sous un autre angle : le pire mode de défaillance de ce site.

### 2.4 — Exception : une actualité qui passe devant

Après avoir retenu un sujet de réserve, vérifie **en second** s'il existe une
actualité qui mérite de passer devant. **Trois critères cumulatifs**, aucun
négociable :

1. Elle concerne un produit d'écoute de bureau à moins d'un mètre (test 2.2).
2. Elle est datée de **moins de 30 jours** (`freshnessDays`) sur une page que tu
   as **réellement ouverte** dans cette exécution.
3. Elle n'a **aucune entrée** au journal (`news-ledger.json`).

Si les trois sont vrais, l'actualité remplace le sujet de réserve — et la ligne
de réserve **reste décochée** pour la prochaine fois. Sinon, tu gardes
l'evergreen sans le moindre état d'âme.

**Deux règles de dépendance.**

- **R1 n'écrit pas d'article produit sur un modèle absent du catalogue.** Sans
  fiche dans `src/data/soundbars.ts`, l'article n'a rien vers quoi lier et rate
  le maillage exigé par les contrôles 8 et 9 de `news-check.mjs`. Une nouveauté
  repérée déclenche une **issue pour R2** (« candidat à l'ajout au catalogue :
  nom exact, URL constructeur FR ouverte, specs relevées »), pas un article.
- **Nouveauté non commercialisée en France** : traitement nommé « contexte
  marché ». Mention explicite « non commercialisée en France à la date du
  relevé », aucun bloc produit, aucun lien `/go/`. Si son prix dépasse la borne
  haute des `PRICE_BANDS` de `src/lib/prix.ts` (450 €), dis-le dans l'article
  plutôt que de le ranger dans « haut de gamme ».

### 2.5 — Sources : accessibles, ouvertes, et jamais citées de mémoire

`preferredSources` liste des sources **préférées**, pas des sources
**accessibles**. Mesuré par requête réelle le 7 septembre 2026 :

- **Inaccessibles à cette routine** (erreur 400 « not accessible to our user
  agent ») : `lesnumeriques.com`, `frandroid.com`, `01net.com`. **Ne les cite
  jamais** — même si tu sais qu'un test y existe.
- **Accessibles et non marchandes** : `learn.microsoft.com`,
  `support.microsoft.com`, `bluetooth.com`, `usb.org`, `dolby.com`, `aes.org`,
  `fr.wikipedia.org`, `sonelec-musique.com`, `rtings.com`, `soundguys.com`,
  `clubic.com`, `tomshardware.fr`, `journaldugeek.com`, `nextinpact.com`,
  `techradar.com`, `notebookcheck.net`, `press.asus.com`, `rog.asus.com`.
- **Accessibles mais comptées comme MARCHANDES** par le contrôle 4 de
  `news-check.mjs` : `razer.com`, `creative.com`, `logitech.com`,
  `edifier.com`, `trust.com`, plus tous les revendeurs. Une fiche constructeur
  ne peut donc **pas** servir de source non marchande. Attention aussi à la
  locale : une recherche renvoie souvent `us.creative.com` — pour une donnée de
  disponibilité, seule la locale FR fait foi.

Règles d'écriture des sources, sans exception :

1. **Interdiction formelle de citer une URL que tu n'as pas ouverte dans cette
   exécution.** Une source plausible mais non lue est une preuve fabriquée.
2. De chaque source citée, **extrais au moins une donnée réutilisée dans
   l'article**. Une source décorative ne sert à rien.
3. Si une source clé est inaccessible, **change de sujet** — ne cite pas de
   mémoire, ne remplace pas par une source approximative.
4. Croise chaque caractéristique technique avec `scripts/faits-produits.md`. Si
   elle n'y figure pas, revérifie-la à la source avant de l'écrire. Rien entre
   les deux.
5. Doute sérieux sur un fait → abandonne **ce** sujet, et n'en publie pas un
   autre à la place dans la même exécution.

Il faut **au moins deux sources, dont au moins une non marchande** (contrôle 4).

### 2.6 — Aucun sujet admissible : le SKIP éditorial

C'est un **résultat normal et réussi**, pas un échec. Consigne-le, pour qu'une
semaine calme se distingue d'une semaine en panne :

```bash
node -e "
const fs=require('fs');const p='scripts/news-ledger.json';
const j=JSON.parse(fs.readFileSync(p,'utf8'));
j.skips=j.skips||[];
j.skips.push({date:new Date().toISOString().slice(0,10),reason:process.argv[1]});
fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n');
console.log('SKIP editorial consigne — '+j.skips.length+' au total');
" "<motif en une phrase : ce qui a été cherché, et pourquoi rien n'était admissible>"

git add scripts/news-ledger.json
git commit -m "Veille : SKIP editorial du $(date +%F) — aucun sujet admissible"
git fetch origin && git rebase origin/main
git push origin HEAD:main
```

La clé `skips` est ignorée par `news-gate.mjs` et préservée par
`news-record.mjs` : elle n'altère aucun comptage de cadence. **C'est le seul cas
où la routine commite sans article.** Puis arrête-toi : pas d'article, pas
d'issue.

### 2.7 — La réserve de sujets evergreen

47 sujets distincts, hors de ce que les 7 classements, 6 guides et 5 articles
couvrent déjà. Une trentaine seulement portent une demande de recherche
mesurable — les autres se justifient par la **citabilité** (étape 3, pilier A),
pas par le trafic : c'est assumé, et c'est ce qui interdit d'en écrire 80 par
an.

Colonnes : `Fait` (`[ ]` à prendre, `[x]` publié, `[×]` écarté),
`N°`, `Sujet`, `Requête ciblée`, `Angle` (codes de `config.angles`, voir
l'étape 3), `Source candidate` (accessible, non marchande, à **ouvrir** avant
d'écrire).

Codes d'angle : **A1** ce que la caractéristique change sur un bureau · **A2**
décryptage technique déjargonné avec ordres de grandeur · **A3** mise en
perspective avec les alternatives · **A4** idées reçues et pièges de fiche
technique · **A5** tutoriel de réglage pas à pas sous Windows · **A6** questions
/ réponses · **A7** contexte marché.

#### Réglages système

| Fait | N° | Sujet | Requête ciblée | Angle | Source candidate |
|---|---|---|---|---|---|
| [ ] | S01 | Où trouver un égaliseur sous Windows 11 : ce que le système fait (Améliorations audio, `mmsys.cpl`) et ce qu'il ne fait pas | égaliseur windows 11 | A5 | learn.microsoft.com |
| [ ] | S02 | Régler le volume par application dans le mixeur de Windows 11 | volume par application windows 11 | A5 | support.microsoft.com |
| [ ] | S03 | Le mode exclusif sur une barre USB : à quoi il sert, quand l'activer | mode exclusif audio windows | A2 | learn.microsoft.com |
| [ ] | S04 | Pilotes USB Audio Class 1 et 2 : quand installer celui du constructeur | pilote usb audio windows | A4 | learn.microsoft.com |
| [ ] | S05 | Windows Sonic, Dolby Atmos for Headphones, DTS Sound Unbound sur une barre de bureau — ⚠ voisin de `son-spatial-pc-thx-super-x-fi` : à ne prendre qu'en distinguant explicitement les virtualiseurs **système** des suites **constructeur** | son spatial windows 11 | A2 | learn.microsoft.com |
| [ ] | S06 | Basculer automatiquement du casque à la barre de son | changer sortie audio automatiquement windows | A5 | support.microsoft.com |
| [ ] | S07 | Récupérer un son parti dans le HDMI de l'écran | pas de son hdmi écran pc | A5 | support.microsoft.com |

#### Connectique et signal

| Fait | N° | Sujet | Requête ciblée | Angle | Source candidate |
|---|---|---|---|---|---|
| [ ] | S08 | USB-A ou USB-C sur une barre de son PC — ⚠ voisin de `usb-jack-bluetooth-quelle-connexion-audio-pc` : à limiter à la comparaison des deux connecteurs USB, jamais aux familles de connexion | barre de son usb-c pc | A1 | usb.org |
| [ ] | S09 | L'optique S/PDIF sur les cartes mères récentes : ce qu'il en reste | sortie optique carte mère | A4 | tomshardware.fr |
| [ ] | S10 | HDMI ARC branché sur un PC : ce qui marche et ce qui ne marche pas | hdmi arc pc | A4 | rtings.com |
| [ ] | S11 | Alimentation par le port USB ou bloc secteur : ce que ça bride | barre de son alimentée en usb | A1 | usb.org |
| [ ] | S12 | Longueur maximale d'un câble jack ou USB avant dégradation | longueur câble usb audio | A2 | usb.org |
| [ ] | S13 | Hub USB et barre de son : les pièges d'alimentation | barre de son sur hub usb | A4 | usb.org |

#### Sans fil

| Fait | N° | Sujet | Requête ciblée | Angle | Source candidate |
|---|---|---|---|---|---|
| [ ] | S14 | SBC, AAC, aptX, LDAC : ce qu'un PC sait réellement envoyer | codec bluetooth pc | A2 | soundguys.com |
| [ ] | S15 | La latence Bluetooth en millisecondes, et pourquoi elle est injouable | latence bluetooth jeu | A2 | soundguys.com |
| [ ] | S16 | Multipoint PC plus téléphone : ce que la barre gère vraiment | bluetooth multipoint | A1 | bluetooth.com |
| [ ] | S17 | Profils A2DP et mains-libres sous Windows : le piège du micro | a2dp windows micro | A4 | learn.microsoft.com |

#### Acoustique de bureau

| Fait | N° | Sujet | Requête ciblée | Angle | Source candidate |
|---|---|---|---|---|---|
| [ ] | S18 | Distance, hauteur et angle sous un écran | placer une barre de son sous l'écran | A1 | rtings.com |
| [ ] | S19 | Réflexions sur un plateau en verre | réflexions sonores bureau | A2 | rtings.com |
| [ ] | S20 | Découplage du caisson et vibrations du meuble | vibrations caisson de basses bureau | A1 | rtings.com |
| [ ] | S21 | Où poser un caisson sous un bureau | placement caisson de basses | A5 | rtings.com |
| [ ] | S22 | Ce que l'écoute à 60 cm change par rapport au salon | distance d'écoute barre de son | A2 | rtings.com |
| [ ] | S23 | Régler des basses en appartement | régler les basses en appartement | A5 | rtings.com |

#### Comparaisons de familles

| Fait | N° | Sujet | Requête ciblée | Angle | Source candidate |
|---|---|---|---|---|---|
| [ ] | S24 | Barre de son ou kit 2.1 — ⚠ recouvre `/guides/barre-de-son-vs-enceintes-pc/` : à ne prendre que centré sur l'apport du caisson, sinon écarte et ouvre une issue d'enrichissement du guide | barre de son ou kit 2.1 | A3 | soundguys.com |
| [ ] | S25 | Barre de son ou enceintes de monitoring | enceintes de monitoring bureau | A3 | soundguys.com |
| [ ] | S26 | Barre PC ou barre TV posée sur un bureau | barre de son tv sur un pc | A3 | rtings.com |
| [ ] | S27 | Barre de son ou haut-parleurs intégrés au moniteur | haut-parleurs de moniteur qualité | A3 | tomshardware.fr |
| [ ] | S28 | Barre de son ou DAC plus ampli casque | dac usb pc | A3 | soundguys.com |

#### Visioconférence

| Fait | N° | Sujet | Requête ciblée | Angle | Source candidate |
|---|---|---|---|---|---|
| [ ] | S29 | Le larsen sans casque : causes et réglages — ⚠ voisin du guide télétravail et visio : celui-ci résout un problème, le guide choisit un produit | larsen visio haut-parleur | A5 | learn.microsoft.com |
| [ ] | S30 | Ce que valent les micros intégrés aux barres de son | micro de barre de son | A4 | soundguys.com |
| [ ] | S31 | Où choisir la sortie audio dans Teams, Zoom et Meet | changer la sortie audio dans teams | A5 | learn.microsoft.com |
| [ ] | S32 | Ce que l'annulation d'écho logicielle fait déjà à ta place | annulation d'écho windows | A2 | learn.microsoft.com |

#### Dépannage

| Fait | N° | Sujet | Requête ciblée | Angle | Source candidate |
|---|---|---|---|---|---|
| [ ] | S33 | Barre de son non reconnue en USB | barre de son non reconnue pc | A5 | support.microsoft.com |
| [ ] | S34 | Souffle, grésillement et boucle de masse | grésillement enceintes pc | A5 | sonelec-musique.com |
| [ ] | S35 | Décalage entre l'image et le son | décalage son image pc | A5 | support.microsoft.com |
| [ ] | S36 | Volume trop faible même à fond | volume trop faible pc | A5 | support.microsoft.com |
| [ ] | S37 | Mise en veille intempestive de la barre | barre de son qui se met en veille | A4 | learn.microsoft.com |

#### Jargon et normes

| Fait | N° | Sujet | Requête ciblée | Angle | Source candidate |
|---|---|---|---|---|---|
| [ ] | S38 | 2.0, 2.1, 5.1, 5.1.2 : ce que les chiffres décrivent sur un bureau | barre de son 2.1 signification | A2 | dolby.com |
| [ ] | S39 | Dolby Atmos sur une barre de bureau : réel ou virtuel | dolby atmos barre de son pc | A4 | dolby.com |
| [ ] | S40 | Lire une réponse en fréquence annoncée | réponse en fréquence barre de son | A4 | rtings.com |
| [ ] | S41 | THD, SNR et sensibilité : ce que ces trois chiffres disent | thd snr audio | A2 | sonelec-musique.com |
| [ ] | S42 | DSP et upmixing : fabriquer du surround à partir de deux canaux | upmix stéréo surround | A2 | dolby.com |

#### Cycle de vie

| Fait | N° | Sujet | Requête ciblée | Angle | Source candidate |
|---|---|---|---|---|---|
| [ ] | S43 | Ce qui casse sur une barre de son et ce que couvre la garantie légale — ⚠ vérifie d'abord qu'une source publique française sur la garantie de conformité est accessible ; sinon écarte | garantie barre de son | A6 | à vérifier accessible |
| [ ] | S44 | Le reconditionné constructeur | barre de son reconditionnée | A7 | clubic.com |
| [ ] | S45 | Reconnaître un modèle abandonné avant de l'acheter | modèle fin de commercialisation | A7 | notebookcheck.net |
| [ ] | S46 | Firmwares et logiciels constructeurs : ce qu'ils changent, ce qu'ils imposent | mise à jour firmware barre de son | A4 | techradar.com |
| [ ] | S47 | Supports sous-écran, VESA et rehausseurs | rehausseur d'écran barre de son | A1 | tomshardware.fr |

---

## Étape 3 — Rédiger : les trois piliers

Longueur cible **500 à 900 mots** (`wordRange`). **Attention : cette borne n'est
vérifiée par aucun contrôle mécanique** — tu la vérifies toi-même à l'étape 6.
Persona et ton : `persona` et `tone` de `scripts/news.config.mjs`.

### Pilier A — Citabilité (GEO)

- Chaque section s'ouvre, **juste sous son titre `##`**, par une réponse
  autonome de **25 à 50 mots**, compréhensible hors contexte. Contrôle 16, la
  cause d'échec la plus fréquente : compte les mots avant de passer à la suite.
- **Phrases auto-portantes.** Aucun « comme vu plus haut », « ci-dessus »,
  « comme on l'a vu », aucun pronom sans référent explicite (contrôle 17). Un
  moteur génératif cite un paragraphe, pas une page.
- **Définition de l'entité dès l'introduction** : « Une barre de son pour PC
  est… ».
- Un concept par section. Pyramide inversée : la réponse d'abord, la nuance
  ensuite.
- Des ordres de grandeur chiffrés et sourcés partout où c'est possible : un
  paragraphe qui porte un nombre vérifiable est cité, un paragraphe d'ambiance
  ne l'est pas.

### Pilier B — Couverture sémantique (SEO)

- L'intention de recherche (la « requête ciblée » de la réserve) est traitée
  dans le **premier paragraphe**, pas au tiers de l'article.
- **Un seul H1**, porté par le `title` du frontmatter. Aucun `# ` en début de
  ligne dans le corps (contrôle 6).
- Jamais de titre « Introduction » ni « Conclusion » (contrôle 7).
- Typographie française : **une seule majuscule en début de titre**. Le Title
  Case anglo-saxon est interdit.
- Éléments enrichis obligatoires : **≥ 1 tableau** de 5 lignes × 3 colonnes
  (contrôle 10), **≥ 1 liste à puces** (contrôle 11), **≥ 1 bloc Focus** en
  citation `>` (contrôle 12).
- **FAQ de 3 questions minimum dans le `frontmatter`**, jamais dans le corps
  (contrôle 3) : le gabarit la rend et l'injecte en JSON-LD `FAQPage`. Réponses
  de 25 à 50 mots, autonomes.
- **3 à 5 liens internes, une ancre unique par URL** (contrôle 8), dont
  **toujours** `/classements/meilleures-barres-de-son-pc/` (contrôle 9). Prends
  les autres dans `secondaryLinks` de `scripts/news.config.mjs`.
  **Le compte inclut tout lien commençant par `/`**, fiches produit
  `/barres-de-son/<slug>/` comprises : quatre liens de maillage plus deux fiches
  produit font six, donc un ✗. Budgète-les ensemble.
- **Pas de bloc produit dans un article de blog.** La collection blog est du
  Markdown pur : le projet n'installe pas `@astrojs/mdx`, donc
  `SoundbarPicks.astro` **ne peut pas** y être importé. R1 écrit des articles
  informationnels et techniques ; un sujet qui appelle une sélection de produits
  n'est pas un sujet de R1 — il devient une issue d'enrichissement de guide ou
  de classement.

### Pilier C — Confiance (non négociable, sans exception, sans exemption)

Ces cinq règles ne se discutent pas et ne souffrent aucun cas particulier. Elles
sont la seule chose qui rende ce site défendable.

1. **Aucune expérience physique revendiquée. C'est la règle la plus
   importante.** Cette routine n'a jamais écouté une seule de ces barres de son.
   Écris « d'après les caractéristiques constructeur », « sur le papier »,
   « d'après les mesures publiées par X ». **Jamais** « nous avons testé »,
   « à l'écoute, nous », « nous l'avons essayée », « à l'usage », « notre test »,
   « après quelques jours d'utilisation ». Le contrôle 14 n'attrape que les
   quatre premières formulations : les autres, c'est toi qui les évites.
2. **Aucun prix dans le corps du texte.** Ni « 199 € », ni « environ 200 € », ni
   « moins de 120 euros » (contrôle 13). Un prix se rend depuis la donnée
   produit, avec sa date de relevé : le champ est `price` (indicatif, jamais
   affiché tel quel, sert à déduire la bande via `priceBand()` de
   `src/lib/prix.ts`) plus `priceCheckedAt`. **Le champ `priceRange` n'existe
   pas** — ne l'écris nulle part. Dans une prose, parle de « entrée de gamme »,
   « milieu de gamme », « haut de gamme », jamais d'un montant.
3. **Aucune note inventée, aucune note recopiée.** La note globale est
   **calculée** par `scoreFromBreakdown()` (`src/lib/notation.ts`) depuis les
   cinq sous-notes `scores`, selon la grille publiée sur `/methodologie/`. Un
   article ne cite pas de note, n'en déduit pas, n'en compare pas.
4. **Voix « nous », ton neutre, zéro superlatif absolu** : « le meilleur »,
   « incontournable », « imbattable », « leader », « sans conteste », « le plus
   performant » (contrôle 15). On dit à qui un produit convient et à qui il ne
   sert à rien.
5. **Aucune preuve fabriquée.** Pas d'avis client, pas de témoignage, pas de
   « recommandé par » sans source ouverte et citée. Aucun chiffre, aucune
   mesure, aucune citation inventés.

Deux règles de forme qui vont avec :

- Tout lien sortant marchand passe par `/go/<slug>/` et porte
  `rel="sponsored nofollow"` — jamais une URL Amazon en clair. En pratique, un
  article de R1 n'a aucune raison d'en contenir : lie la fiche produit interne.
- **Orthographe des entités strictement identique** à `src/data/soundbars.ts` et
  à `scripts/faits-produits.md` : « Creative Sound Blaster Katana V2 », pas
  « SoundBlaster Katana v2 ».

---

## Étape 4 — Créer le fichier

Chemin **exact** : `src/content/blog/<slug>.md`. Pas de sous-dossier —
`news-record.mjs` sort en code 2 si le fichier n'est pas à cet emplacement,
alors que le build l'accepterait.

Slug en minuscules, sans accent, mots séparés par des tirets, **unique**
(`ls src/content/blog/`), et **partageant moins de la moitié de ses segments**
avec un slug existant.

```yaml
---
title: "Titre de l'article — une seule majuscule initiale"
metaTitle: "Titre pour le moteur, 45 à 65 caractères"
description: "Meta description de 130 à 160 caractères, qui dit ce que le lecteur va apprendre en lisant cette page."
publishedAt: 2026-09-08
updatedAt: 2026-09-08
tags: ["technique", "conseils"]
readingMinutes: 5
draft: false
faq:
  - question: "Première question réellement posée par un lecteur ?"
    answer: "Réponse autonome de 25 à 50 mots, compréhensible hors contexte, sans prix et sans note."
  - question: "Deuxième question ?"
    answer: "…"
  - question: "Troisième question ?"
    answer: "…"
sources:
  - title: "Titre exact de la page ouverte"
    url: "https://learn.microsoft.com/…"
    publisher: "Microsoft Learn"
  - title: "Titre exact de la seconde page ouverte"
    url: "https://www.soundguys.com/…"
    publisher: "SoundGuys"
---
```

Champs autorisés par `src/content.config.ts` et **rien d'autre** : `title`,
`metaTitle`, `description`, `publishedAt`, `updatedAt`, `tags`,
`readingMinutes`, `cover`, `coverAlt`, `draft`, `faq` (liste de
`{question, answer}`), `sources` (liste de `{title, url, publisher}`).

⚠ **Un champ inventé ne casse pas le build.** Le schéma est un `z.object()` sans
`.strict()` : une clé inconnue est **silencieusement supprimée**, le build passe
au vert et l'information n'apparaît jamais sur la page. Le contrôle est manuel,
à l'étape 6.

Deux règles de date :

- `publishedAt` vaut **la date du run**, jamais une autre. Un `publishedAt`
  antidaté fait recompter la semaine au portillon et casse le plafond
  hebdomadaire.
- `updatedAt` est **obligatoire** (contrôle 5) et vaut la même date.

Laisse `cover` et `coverAlt` **absents** : l'étape 5 les renseigne.

---

## Étape 5 — Illustration

```bash
node scripts/assign-photo.mjs "<slug>" "<thème FR, 3 à 6 mots-clés>"
```

Exemple : `node scripts/assign-photo.mjs "regler-egaliseur-windows-11" "bureau ordinateur barre de son réglage audio"`.

Le script écrit `cover` et `coverAlt` dans le frontmatter et garantit un visuel
dans tous les cas : Pexels si `PEXELS_API_KEY` est disponible, sinon repli sur la
bibliothèque locale, sinon aucun `cover` et le gabarit `CoverArt.astro` génère un
visuel unique dérivé du slug. **Un article sans photo n'est pas un article sans
visuel** : ne bloque jamais la routine sur une image.

Deux vérifications :

- `coverAlt` **décrit l'image** pour quelqu'un qui ne la voit pas. Il ne répète
  pas le titre de l'article et n'y replace pas un mot-clé. Corrige-le à la main
  si besoin.
- Le script écrit aussi `scripts/photo-ledger.json` (anti-répétition d'image).
  Ce fichier **doit** entrer dans le commit de l'étape 7, sinon la
  déduplication ne voit jamais rien et plusieurs articles finissent avec la même
  photo.

---

## Étape 6 — Contrôle qualité, avec sortie de boucle

### 6.1 — Les deux contrôles que la machinerie ne fait pas

Ni la longueur, ni les clés de frontmatter ne sont vérifiées par
`news-check.mjs`. Lance-les toi-même, depuis la racine du dépôt :

```bash
node -e "
const fs=require('fs');
const raw=fs.readFileSync(process.argv[1],'utf8');
const m=raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)/);
if(!m){console.log('frontmatter introuvable');process.exit(1);}
const mots=(m[2].match(/[\p{L}\p{N}'’-]+/gu)||[]).length;
const permis=['title','metaTitle','description','publishedAt','updatedAt','tags','readingMinutes','cover','coverAlt','draft','faq','sources'];
const cles=(m[1].match(/^[A-Za-z][A-Za-z0-9_]*(?=:)/gm)||[]);
const intrus=cles.filter(k=>!permis.includes(k));
console.log('mots : '+mots+(mots>=500&&mots<=900?' OK':' HORS BORNES 500-900'));
console.log('champs intrus : '+(intrus.length?intrus.join(', ')+' — A SUPPRIMER':'aucun'));
" src/content/blog/<slug>.md
```

Les deux lignes doivent dire `OK` et `aucun`. Sinon corrige avant de continuer.

### 6.2 — Les 17 contrôles mécaniques

```bash
node scripts/news-check.mjs src/content/blog/<slug>.md
```

Une ligne `✓` ou `✗` par contrôle, puis un total. **Code de sortie 1 tant qu'il
reste un seul `✗`.** L'objectif est `17/17`. Article de référence à imiter :
`src/content/blog/comprendre-puissance-barre-de-son-watts.md`.

**N'édite jamais `news-check.mjs` pour faire passer un article.** Le contrôle a
raison ; c'est l'article qui est à corriger.

### 6.3 — Sortie de boucle : trois tentatives, pas quatre

**Maximum 3 tentatives de correction sur `news-check.mjs`.** Compte-les. Si le
troisième passage laisse un `✗` :

1. N'écris plus rien, ne corrige plus, **ne commite pas**.
2. Supprime le fichier de l'article et son éventuelle couverture, pour ne pas
   laisser un orphelin qui piégerait l'étape 0.4 de la prochaine exécution :
   ```bash
   rm src/content/blog/<slug>.md
   git checkout -- public/images/blog/ scripts/photo-ledger.json 2>/dev/null || true
   ```
3. **Ne coche pas** la ligne de réserve : le sujet reste disponible.
4. Ouvre l'issue avec la sortie **complète** du dernier `news-check` :
   ```bash
   gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
     --title "R1 Veille — abandon apres 3 tentatives sur <slug>" \
     --body "Sujet de reserve : S<NN>. Sortie complete du 3e news-check :
   <colle la sortie>
   Aucun commit. La ligne de reserve reste decochee."
   ```
5. Termine. **L'abandon avec issue est un résultat acceptable** ; l'abandon
   silencieux ne l'est pas.

---

## Étape 7 — Journal puis publication, dans cet ordre exact

L'ordre est ce qui rend la routine reprenable : à chaque sous-étape, un échec
s'arrête net et laisse un état que l'étape 0.4 sait diagnostiquer. **Ne
réordonne rien.**

### 7.1 — Typage, puis build

```bash
npm run check
npm run build
```

**`npm run check` avant `npm run build`** : un build vert ne prouve pas que la
donnée est bien typée, c'est `astro check` qui tient le type. **Maximum 2
tentatives de correction sur ce couple.** Au-delà : aucun commit, issue « R1
Veille — build en echec sur `<slug>` » avec la sortie d'erreur, suppression du
fichier comme en 6.3, et fin.

### 7.2 — Vérification du rendu servi

```bash
node scripts/verifie-rendu.mjs
```

12 contrôles à l'échelle du site sur le HTML de `dist/`, dont l'absence de
revendication de test physique sur les 65 pages, `Disallow: /go/`, le
`rel="sponsored nofollow"` et l'absence de prix exact en schéma. **Un seul `✗`
et on ne pousse pas.**

Son contrôle de test physique est étroit — complète-le à la main :

```bash
grep -rniE "notre test|a l usage|à l'usage|nous l'avons|nous avons pu" src/content/blog/<slug>.md
```

Cette commande doit ne **rien** renvoyer.

### 7.3 — Journal anti-doublon

```bash
node scripts/news-record.mjs <slug>
```

**Code de sortie ≠ 0 → ne commite pas, ouvre une issue, arrête-toi.** Un échec
ici pris pour du bruit fait publier un article hors comptage, donc au-delà du
plafond hebdomadaire.

### 7.4 — Porter le sujet au bon grain dans le journal

`news-record.mjs` remplit `topic` avec la liste des tags, qui ne discrimine
rien. Réécris-le avec le numéro de réserve, la requête ciblée et un résumé d'une
ligne :

```bash
node -e "
const fs=require('fs');const p='scripts/news-ledger.json';
const j=JSON.parse(fs.readFileSync(p,'utf8'));
const e=j.published.find((x)=>x.slug===process.argv[1]);
if(!e){console.error('Aucune entree pour ce slug — news-record.mjs n a pas tourne.');process.exit(1);}
e.topic=process.argv[2];
fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n');
console.log('topic = '+e.topic);
" "<slug>" "S<NN> · requête « <requête ciblée> » · <résumé du propos en une ligne>"
```

⚠ Si tu relances `news-record.mjs` après coup, il **écrase** ce `topic` : dans ce
cas, relance aussi cette commande.

### 7.5 — Le journal n'a pas rétréci

```bash
node -e "const j=require('./scripts/news-ledger.json');const n=j.published.length;console.log('entrees : '+n);if(n<Number(process.argv[1])+1){console.error('JOURNAL AMPUTE — ne pas commiter');process.exit(1);}" <N>
```

`<N>` est le nombre relevé à l'étape 0.3. **Un journal qui rétrécit est une
panne, pas un résultat** : si la commande sort en code 1, ne commite pas, ouvre
une issue « R1 Veille — journal ampute », arrête-toi.

### 7.6 — Cocher la réserve

Dans ce fichier, remplace `| [ ] | S<NN> |` par `| [x] | S<NN> |` sur la ligne
du sujet consommé. C'est ce qui fait tenir le décompte de l'étape 2.3. Ne coche
rien si l'article vient d'une actualité et non de la réserve.

### 7.7 — Commit

```bash
git add src/content/blog/<slug>.md public/images/blog/ \
        scripts/news-ledger.json scripts/photo-ledger.json \
        scripts/veille-playbook.md

if [ -z "$(git status --porcelain)" ]; then echo "RIEN A COMMITER — anomalie, ouvre une issue"; exit 1; fi

git commit -m "Blog : <titre de l article> — S<NN>, non-doublon car <raison en une ligne>"
```

`git status --porcelain` et **jamais** `git diff --quiet` : ce dernier ignore les
fichiers non suivis, donc un fichier neuf passerait pour « rien à faire ». Liste
les chemins explicitement, **jamais** `git add -A`.

Le message de commit **doit** dire pourquoi le sujet n'est pas un doublon : tant
que `news-check.mjs` n'a pas de contrôle d'unicité de sujet, cette phrase est la
seule trace de la vérification.

### 7.8 — Resynchroniser juste avant de pousser

Il s'est écoulé une veille, une rédaction et une boucle de correction depuis le
début de l'exécution : une autre routine a pu pousser entre-temps.

```bash
git fetch origin
git rebase origin/main
```

**Conflit sur `scripts/news-ledger.json`** — le cas normal quand deux routines
se croisent. Procédure imposée, aucune résolution manuelle du JSON :

```bash
git checkout origin/main -- scripts/news-ledger.json
node scripts/news-record.mjs <slug>
# puis relance la commande de l'étape 7.4 pour réécrire le topic
git add scripts/news-ledger.json
git rebase --continue
```

`git checkout origin/main -- <chemin>` est sans ambiguïté ; `--ours` et
`--theirs` sont **inversés** pendant un rebase par rapport à une fusion, et
`git rebase --skip` est **interdit** — il jette silencieusement l'entrée du
journal. Ne recours jamais non plus à `git pull --ff-only` comme moyen de
reprise : il abandonne dès que la branche a divergé.

### 7.9 — Pousser, et vérifier pour de vrai

```bash
git push origin HEAD:main
```

Lis le **code de sortie** de `git push` : ne le canalise jamais dans un pipe.

- Rejet (`! [rejected]`, `fetch first`) → reprends **une seule fois** à
  l'étape 7.8. Second rejet → issue « R1 Veille — push rejete deux fois » et
  arrêt.
- Puis vérifie, par comparaison et non par affichage :

```bash
git fetch origin
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" \
  && echo "PUBLIE" \
  || { echo "NON PUBLIE"; gh issue create --repo jressouche-yuyu/Barre-de-son-PC \
        --title "R1 Veille — article non publie" \
        --body "Le commit local n est pas le sommet de origin/main. Slug : <slug>."; }
```

`git log --oneline -1 origin/main` **ne suffit pas** : après un push rejeté, il
affiche une référence de suivi périmée et fait croire à une réussite.

### 7.10 — Un `GO` sans push est une panne

Si le portillon a dit `GO` et que cette exécution se termine sans push **et sans
SKIP éditorial consigné (2.6)**, ouvre une issue « R1 Veille — GO sans
publication du `<date>` ». C'est la seule condition qui distingue une semaine
calme d'une semaine en panne : le portillon n'a aucune mémoire de retard et la
semaine suivante repartira d'un objectif neuf.

**Un seul contenu publié par exécution**, même si tu as repéré trois bons sujets.

---

## Garde-fous

Non négociables. Ils valent pour cette routine comme pour les trois autres.

1. **Aucune expérience physique revendiquée.** La routine n'a pas écouté ces
   barres de son. « D'après les caractéristiques constructeur », « sur le
   papier », « d'après les mesures publiées par X ». Jamais « nous avons
   testé », « à l'écoute, nous », « nous l'avons essayée », « à l'usage »,
   « notre test ». **C'est la règle la plus importante.** La position défendable
   du site : un comparatif éditorial fondé sur les caractéristiques
   constructeur et les mesures publiées par des laboratoires indépendants, selon
   la grille publique de `/methodologie/`.
2. **Aucune preuve fabriquée.** Ni avis client, ni témoignage, ni « recommandé
   par » sans source ouverte dans l'exécution en cours. Interdiction formelle de
   citer une URL non ouverte — c'est le mode de fabrication de preuve le plus
   probable de cette routine, et `news-check.mjs` ne le détecte pas.
3. **Aucun prix ni aucune note dans une prose.** Toujours rendus depuis la
   donnée et toujours datés : `price` plus `priceCheckedAt` pour la bande de
   gamme, `scores` plus `scoreFromBreakdown()` pour la note. **`priceRange`
   n'existe pas dans le modèle de données** — l'écrire fait échouer
   `npm run check`.
4. **`rel="sponsored nofollow"` sur tout lien sortant marchand**, passage
   obligatoire par `/go/<slug>/`, `Disallow: /go/` maintenu dans
   `public/robots.txt`. Un article de R1 n'a normalement aucun lien marchand.
5. **Ne jamais scraper `amazon.fr`.** Aucune requête HTTP vers Amazon, sous
   aucun prétexte : interdit par les conditions du programme Partenaires, et
   détecté.
6. **Ne jamais supprimer une fiche produit** d'un modèle retiré. R1 ne touche
   pas à `src/data/soundbars.ts` : elle ouvre une issue pour R2. Une suppression
   jette du référencement acquis.
7. **Orthographe des entités strictement identique partout**, alignée sur
   `src/data/soundbars.ts` et `scripts/faits-produits.md`. « Sound Blaster
   Katana V2 » et « SoundBlaster Katana v2 » comptent pour deux produits
   différents, pour le site comme pour un moteur.
8. **Une routine qui échoue le dit.** Jamais d'échec silencieux : `gh auth
   status` en préflight, puis une issue à chaque abandon, avec la sortie
   complète du dernier contrôle. L'abandon documenté est un résultat acceptable ;
   le silence ne l'est pas.
9. **Zéro Pull Request, zéro branche, zéro demande de validation.** Autorisation
   permanente de pousser sur `main`. Un contenu resté sur une branche est un
   contenu non publié, donc un échec.
10. **Pas de commit vide.** Rien à changer, ne rien pousser — testé avec
    `git status --porcelain`, jamais avec `git diff --quiet`. L'unique commit
    sans article autorisé est le SKIP éditorial de l'étape 2.6.
