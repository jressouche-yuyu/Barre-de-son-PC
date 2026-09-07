#!/usr/bin/env node
/**
 * JOURNAL ANTI-DOUBLON — la mémoire de la routine entre deux exécutions.
 *
 * Sans lui, une routine n'a aucun moyen de savoir ce qu'elle a déjà publié :
 * elle republie indéfiniment le même sujet sous un titre légèrement différent.
 * Le journal est versionné dans Git — c'est ce qui le rend persistant d'une
 * exécution de Routine à l'autre, chaque exécution repartant d'un dépôt frais.
 *
 * Deux lecteurs :
 *   - `news-gate.mjs` compte les entrées `origin: 'auto'` de la semaine ISO ;
 *   - l'étape de veille lit les sujets déjà traités pour les écarter.
 *
 * Usage : node scripts/news-record.mjs <slug> [--origin auto|manuel]
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..');
const LEDGER = process.env.NEWS_LEDGER || join(HERE, 'news-ledger.json');

const slug = process.argv[2];
if (!slug) {
  console.error('Usage : node scripts/news-record.mjs <slug> [--origin auto|manuel]');
  process.exit(2);
}

const originFlag = process.argv.indexOf('--origin');
const origin = originFlag > -1 ? process.argv[originFlag + 1] : 'auto';
if (!['auto', 'manuel'].includes(origin)) {
  console.error(`✗ origin inconnu : ${origin} (attendu « auto » ou « manuel »)`);
  process.exit(2);
}

// ── Lecture du frontmatter de l'article ─────────────────────────────────────
const articlePath = join(REPO, 'src', 'content', 'blog', `${slug}.md`);
if (!existsSync(articlePath)) {
  console.error(`✗ Article introuvable : ${articlePath}`);
  process.exit(2);
}

const raw = readFileSync(articlePath, 'utf-8');
const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
if (!match) {
  console.error(`✗ Aucun frontmatter YAML dans ${articlePath}`);
  process.exit(2);
}

let front;
try {
  front = parseYaml(match[1]) ?? {};
} catch (error) {
  console.error(`✗ Frontmatter YAML invalide : ${error.message}`);
  process.exit(2);
}

/** Date de publication au format court, pour le comptage par semaine ISO. */
const toIsoDay = (value) => {
  if (!value) return new Date().toISOString().slice(0, 10);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
};

const entry = {
  slug,
  title: front.title ?? slug,
  date: toIsoDay(front.publishedAt),
  origin,
  sourceUrls: Array.isArray(front.sources)
    ? front.sources.map((s) => s?.url).filter((u) => typeof u === 'string')
    : [],
  // Les tags servent à écarter un sujet « trop proche » lors de la veille
  // suivante : c'est plus robuste qu'une comparaison de titres.
  topic: Array.isArray(front.tags) && front.tags.length > 0 ? front.tags.join(', ') : (front.title ?? slug),
};

// ── Écriture ────────────────────────────────────────────────────────────────
let ledger = { published: [] };
if (existsSync(LEDGER)) {
  try {
    const parsed = JSON.parse(readFileSync(LEDGER, 'utf-8'));
    if (Array.isArray(parsed?.published)) ledger = parsed;
  } catch {
    console.error(`⚠ Journal illisible, il est recréé : ${LEDGER}`);
  }
}

const already = ledger.published.findIndex((e) => e?.slug === slug);
if (already > -1) {
  ledger.published[already] = entry;
  console.log(`↻ Entrée mise à jour : ${slug}`);
} else {
  ledger.published.push(entry);
  console.log(`✓ Entrée ajoutée : ${slug}`);
}

writeFileSync(LEDGER, `${JSON.stringify(ledger, null, 2)}\n`, 'utf-8');
console.log(`  ${ledger.published.length} article(s) au journal · origine « ${origin} » · date ${entry.date}`);
console.log(`  ${entry.sourceUrls.length} source(s) enregistrée(s)`);
