#!/usr/bin/env node
/**
 * SIMULATION DE CADENCE — prouve que le portillon publie au rythme annoncé.
 *
 * Le portillon est le seul organe dont une erreur ne se voit pas tout de suite :
 * une routine qui publie deux fois trop, ou plus rien du tout, ne se remarque
 * qu'au bout de plusieurs semaines. Ce script rejoue une année entière de
 * réveils et compte ce qui serait sorti, semaine par semaine.
 *
 * Il n'écrit rien dans le dépôt : le journal simulé vit dans un fichier
 * temporaire supprimé à la fin.
 *
 * Usage : node scripts/simule-cadence.mjs [année]
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './news.config.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const GATE = join(HERE, 'news-gate.mjs');
const year = Number(process.argv[2]) || new Date().getUTCFullYear();

const workDir = mkdtempSync(join(tmpdir(), 'cadence-'));
const ledgerPath = join(workDir, 'news-ledger.json');
const published = [];

/** Créneaux de réveil : reflète le cron R1 (`0 7 * * 2,5` UTC). */
const RUN_HOURS_UTC = [7];

if (RUN_HOURS_UTC.length !== config.runsPerDay) {
  console.error(
    `✗ Incohérence : runsPerDay = ${config.runsPerDay} mais la simulation ` +
      `déclare ${RUN_HOURS_UTC.length} créneaux. Aligne l'un sur l'autre.`,
  );
  process.exit(1);
}

const isoWeekOf = (date) => {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
};

let runs = 0;
let gos = 0;

try {
  for (let day = new Date(Date.UTC(year, 0, 1)); day.getUTCFullYear() === year; day.setUTCDate(day.getUTCDate() + 1)) {
    for (const hour of RUN_HOURS_UTC) {
      const when = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hour));
      writeFileSync(ledgerPath, JSON.stringify({ published }, null, 2));
      runs++;

      const line = execFileSync(process.execPath, [GATE], {
        encoding: 'utf-8',
        env: { ...process.env, NEWS_NOW: when.toISOString(), NEWS_LEDGER: ledgerPath, NEWS_FORCE: '' },
      }).trim();

      if (!/^(GO|SKIP): /.test(line)) {
        console.error(`✗ Le portillon a répondu autre chose qu'une ligne GO/SKIP : ${JSON.stringify(line)}`);
        process.exit(1);
      }

      if (line.startsWith('GO')) {
        gos++;
        // La date parisienne du jour simulé — suffisant ici, les créneaux 7 h et
        // 14 h UTC tombent toujours le même jour civil à Paris.
        const iso = when.toISOString().slice(0, 10);
        published.push({ slug: `simule-${gos}`, title: `Simulé ${gos}`, date: iso, origin: 'auto' });
      }
    }
  }
} finally {
  rmSync(workDir, { recursive: true, force: true });
}

// ── Comptage par semaine ISO ─────────────────────────────────────────────────
const perWeek = new Map();
for (const entry of published) {
  const key = isoWeekOf(new Date(`${entry.date}T12:00:00Z`));
  perWeek.set(key, (perWeek.get(key) ?? 0) + 1);
}

const counts = [...perWeek.values()];
const weeksWithOutput = counts.length;
const min = Math.min(...counts);
const max = Math.max(...counts);
const total = counts.reduce((a, b) => a + b, 0);

// Bornes attendues : le plancher/plafond de base, élargis par la saisonnalité.
const boostMax = Math.max(config.maxPerWeek, ...(config.seasonalBoost ?? []).map((w) => w.maxPerWeek ?? 0));

console.log(`Année simulée        : ${year}`);
console.log(`Réveils joués        : ${runs}`);
console.log(`Articles publiés     : ${total}`);
console.log(`Semaines avec sortie : ${weeksWithOutput}`);
console.log(`Par semaine          : min ${min}, max ${max} (attendu ${config.minPerWeek} à ${boostMax})`);
console.log(`Moyenne              : ${(total / Math.max(1, weeksWithOutput)).toFixed(2)} article(s) / semaine active`);

const problems = [];
if (min < config.minPerWeek) problems.push(`une semaine est descendue à ${min} (plancher ${config.minPerWeek})`);
if (max > boostMax) problems.push(`une semaine est montée à ${max} (plafond ${boostMax})`);
if (weeksWithOutput < 50) problems.push(`seulement ${weeksWithOutput} semaines sur ~52 ont produit un article`);

if (problems.length) {
  console.log('');
  for (const p of problems) console.log(`✗ ${p}`);
  process.exit(1);
}

console.log('\n✓ Cadence conforme aux bornes de news.config.mjs.');
