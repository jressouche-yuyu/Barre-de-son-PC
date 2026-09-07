#!/usr/bin/env node
/**
 * PORTILLON DE CADENCE — décide s'il faut publier MAINTENANT.
 *
 * C'est le premier organe de la machinerie, et le plus important : sans lui, une
 * routine publie à chaque réveil et le site prend une empreinte de spam
 * parfaitement lisible par un moteur.
 *
 * CONTRAT (respecté à la lettre, les playbooks en dépendent) :
 *   - sortie stdout : UNE seule ligne, `GO: <raison>` ou `SKIP: <raison>` ;
 *   - code de sortie : 0 dans les deux cas. Le playbook lit la ligne, pas le code.
 *     Un code non nul ferait échouer la routine alors qu'un SKIP est le cas
 *     normal et fréquent ;
 *   - fuseau Europe/Paris obligatoire. La Routine tourne en UTC : raisonner sur
 *     l'heure locale de la machine décalerait toute la cadence.
 *
 * ÉCHAPPATOIRES DE TEST :
 *   NEWS_FORCE=1 node scripts/news-gate.mjs      → GO
 *   touch scripts/force-next-publish             → GO
 *
 * Usage : node scripts/news-gate.mjs
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './news.config.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
// `NEWS_LEDGER` sert aux tests de cadence pour travailler sur un journal jetable.
const LEDGER = process.env.NEWS_LEDGER || join(HERE, 'news-ledger.json');
const FORCE_FILE = join(HERE, 'force-next-publish');
const TZ = 'Europe/Paris';

/** Émet la décision et sort. Toujours en code 0 — voir le contrat ci-dessus. */
function decide(verdict, reason) {
  process.stdout.write(`${verdict}: ${reason}\n`);
  process.exit(0);
}

// ── Date civile à Paris ──────────────────────────────────────────────────────

/**
 * Renvoie la date civile parisienne (année, mois, jour, heure, jour de semaine
 * ISO où 1 = lundi). On passe par Intl pour que le résultat soit correct quel
 * que soit le fuseau de la machine, heure d'été comprise.
 */
function parisNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    weekday: 'short',
  }).formatToParts(now);

  const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
  const weekdayMap = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    // '24' peut apparaître à minuit selon l'implémentation : on le ramène à 0.
    hour: Number(get('hour')) % 24,
    isoWeekday: weekdayMap[get('weekday')],
  };
}

/**
 * Clé de semaine ISO-8601, ex. « 2026-W37 ». C'est l'unité de comptage de la
 * cadence : tout ce qui est « par semaine » se mesure sur cette clé.
 */
function isoWeekKey({ year, month, day }) {
  // Algorithme ISO standard : le jeudi de la semaine détermine son millésime.
  const date = new Date(Date.UTC(year, month - 1, day));
  const dayNum = date.getUTCDay() || 7; // dimanche = 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/** Date au format ISO court (AAAA-MM-JJ) pour comparer au journal. */
function isoDate({ year, month, day }) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ── Aléatoire déterministe ───────────────────────────────────────────────────

/**
 * Hachage FNV-1a 32 bits. Sert de graine : deux exécutions qui partagent la même
 * clé obtiennent le même tirage. C'est indispensable pour l'objectif
 * hebdomadaire — deux réveils la même semaine doivent viser le même nombre
 * d'articles, sinon la cadence part en vrille.
 */
function hash32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Réel déterministe dans [0, 1) dérivé d'une clé. */
function seededUnit(key) {
  return hash32(key) / 0x100000000;
}

/** Entier déterministe dans [min, max] inclus. */
function seededInt(key, min, max) {
  return min + Math.floor(seededUnit(key) * (max - min + 1));
}

// ── Journal ──────────────────────────────────────────────────────────────────

/** Lit le journal. Un journal absent ou illisible vaut « rien de publié ». */
function readLedger() {
  if (!existsSync(LEDGER)) return { published: [] };
  try {
    const data = JSON.parse(readFileSync(LEDGER, 'utf-8'));
    return Array.isArray(data?.published) ? data : { published: [] };
  } catch {
    return { published: [] };
  }
}

// ── Cadence ──────────────────────────────────────────────────────────────────

/**
 * Applique `seasonalBoost` si la date du jour tombe dans une fenêtre.
 * Les bornes sont des `MM-JJ`, comparables littéralement.
 */
function weeklyBounds(paris) {
  let { minPerWeek, maxPerWeek, sessionChanceCap } = config;
  const today = `${String(paris.month).padStart(2, '0')}-${String(paris.day).padStart(2, '0')}`;
  for (const window of config.seasonalBoost ?? []) {
    const inWindow =
      window.from <= window.to
        ? today >= window.from && today <= window.to
        : today >= window.from || today <= window.to; // fenêtre à cheval sur janvier
    if (inWindow) {
      minPerWeek = window.minPerWeek ?? minPerWeek;
      maxPerWeek = window.maxPerWeek ?? maxPerWeek;
      sessionChanceCap = window.sessionChanceCap ?? sessionChanceCap;
    }
  }
  return { minPerWeek, maxPerWeek, sessionChanceCap };
}

/**
 * Indice du réveil courant dans la journée (0 = premier).
 * On découpe la plage `publishHours` en `runsPerDay` créneaux égaux et on
 * regarde dans lequel tombe l'heure actuelle. Cela permet de savoir combien de
 * réveils restent aujourd'hui sans avoir à connaître le cron exact.
 */
function slotIndexToday(paris) {
  const { start, end } = config.publishHours;
  const span = Math.max(1, end - start);
  const width = span / config.runsPerDay;
  const raw = Math.floor((paris.hour - start) / width);
  return Math.min(config.runsPerDay - 1, Math.max(0, raw));
}

/** Nombre de réveils restants dans la semaine ISO, celui-ci compris. */
function remainingRuns(paris) {
  const today = config.runsPerDay - slotIndexToday(paris);
  const daysLeft = config.activeDays.filter((d) => d > paris.isoWeekday).length;
  return today + daysLeft * config.runsPerDay;
}

// ── Décision ─────────────────────────────────────────────────────────────────

// `NEWS_NOW` permet de rejouer le portillon à une date arbitraire (ISO 8601).
// Sert uniquement aux tests de cadence (`scripts/simule-cadence.mjs`) : la
// routine ne définit jamais cette variable.
const paris = parisNow(process.env.NEWS_NOW ? new Date(process.env.NEWS_NOW) : new Date());
const weekKey = isoWeekKey(paris);
const todayIso = isoDate(paris);

// 1. Échappatoires de test — avant toute autre règle.
if (process.env.NEWS_FORCE === '1') {
  decide('GO', 'forçage par NEWS_FORCE=1');
}
if (existsSync(FORCE_FILE)) {
  decide('GO', 'forçage par le fichier scripts/force-next-publish');
}

// 2. Fenêtre à visage humain : jours ouvrés, heures de bureau.
if (!config.activeDays.includes(paris.isoWeekday)) {
  decide('SKIP', `jour ${paris.isoWeekday} hors des jours actifs (heure de Paris)`);
}
const mmdd = `${String(paris.month).padStart(2, '0')}-${String(paris.day).padStart(2, '0')}`;
if ((config.holidays ?? []).includes(mmdd)) {
  decide('SKIP', `jour férié (${mmdd}) — une rédaction ne publie pas ce jour-là`);
}
if (paris.hour < config.publishHours.start || paris.hour >= config.publishHours.end) {
  const { start, end } = config.publishHours;
  decide('SKIP', `${paris.hour} h à Paris, hors de la plage ${start} h – ${end} h`);
}

// 3. Objectif de la semaine : tiré au hasard, mais identique pour tous les
//    réveils de la même semaine ISO.
//
//    Le tirage part de 1 même quand `minPerWeek` vaut 0 : un objectif nul
//    condamnerait la semaine entière au silence dès le lundi, alors que ce que
//    l'on veut, c'est un objectif modeste que l'étape de veille pourra ensuite
//    refuser faute de matière. `minPerWeek: 0` ne veut pas dire « viser zéro »,
//    il veut dire « ne jamais forcer » — voir le point 5.
const { minPerWeek, maxPerWeek, sessionChanceCap } = weeklyBounds(paris);
const target = seededInt(`objectif:${weekKey}`, Math.max(1, minPerWeek), maxPerWeek);

// 4. Ce qui a déjà été publié automatiquement cette semaine.
const ledger = readLedger();
const autoThisWeek = ledger.published.filter(
  (entry) => entry?.origin === 'auto' && typeof entry.date === 'string' && isoWeekKey(parseIsoDate(entry.date)) === weekKey,
);
const publishedThisWeek = autoThisWeek.length;
const publishedToday = autoThisWeek.filter((entry) => entry.date === todayIso).length;

function parseIsoDate(value) {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return { year, month, day };
}

const needed = target - publishedThisWeek;

if (needed <= 0) {
  decide('SKIP', `objectif de la semaine ${weekKey} atteint (${publishedThisWeek}/${target})`);
}

// 5. Plancher hebdomadaire — DÉSACTIVÉ quand `minPerWeek` vaut 0.
//
//    C'était le défaut de conception le plus grave de cette machinerie : forcer
//    un GO pour tenir un quota, c'est mettre l'agent de veille sous pression de
//    production alors qu'il n'a peut-être rien à dire. Un site de créneau qui
//    doit publier « parce que c'est la fin de la semaine » produit du
//    remplissage, et le remplissage cannibalise ses propres pages.
//
//    Le portillon ne fait donc qu'AUTORISER. C'est l'étape de veille qui décide,
//    et elle a un droit de veto : pas d'actualité ni de donnée fraîche, pas de
//    publication — quel que soit l'objectif de la semaine.
const runsLeft = remainingRuns(paris);
if (minPerWeek > 0) {
  if (runsLeft <= 1 && publishedThisWeek < minPerWeek) {
    decide('GO', `dernier réveil de ${weekKey} et plancher non atteint (${publishedThisWeek}/${minPerWeek})`);
  }
  if (runsLeft <= needed) {
    decide('GO', `${needed} article(s) à publier pour ${runsLeft} réveil(s) restant(s)`);
  }
}

// 6. Tirage : on répartit la probabilité sur les réveils restants, et on bride
//    fortement un second article le même jour.
let probability = needed / runsLeft;
let cap = '';

// Plafond par séance. Sans lui, `needed / runsLeft` atteint 1 dès que l'objectif
// égale le nombre de séances restantes, et le portillon publie mécaniquement à
// chaque séance : un rythme de script, pas d'une rédaction. Le plafond garantit
// qu'aucune séance n'est jamais acquise d'avance.
if (probability > sessionChanceCap) {
  probability = sessionChanceCap;
  cap = `, plafonné à ${sessionChanceCap} par séance`;
}

if (publishedToday > 0) {
  probability = Math.min(probability, config.sameDayChance);
  cap = `, bridé à ${config.sameDayChance} car ${publishedToday} article(s) déjà publié(s) aujourd'hui`;
}

const draw = seededUnit(`tirage:${weekKey}:${todayIso}:${slotIndexToday(paris)}`);
const pct = (probability * 100).toFixed(0);

if (draw < probability) {
  decide('GO', `tirage ${draw.toFixed(3)} < ${probability.toFixed(3)} (${needed}/${target} restant sur ${runsLeft} réveils)`);
}

decide('SKIP', `tirage ${draw.toFixed(3)} ≥ ${probability.toFixed(3)} — ${pct} % de chance à ce réveil${cap}`);
