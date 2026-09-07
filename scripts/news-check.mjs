#!/usr/bin/env node
/**
 * CONTRÔLE QUALITÉ MÉCANIQUE — l'organe qui remplace la relecture humaine.
 *
 * Il n'évalue PAS le fond : il ne sait pas si un article est intéressant. Il
 * vérifie la structure, et il le fait de façon binaire et sans pitié. C'est ce
 * qui permet de publier sans relecture : tant qu'un ✗ subsiste, la routine
 * corrige et relance.
 *
 * Les contrôles 13, 14 et 15 sont propres à un site d'affiliation. Ils
 * n'existent pas sur un site éditorial classique. NE LES RETIRE PAS :
 *   13 — un prix écrit dans une phrase est faux la semaine suivante ;
 *   14 — la routine n'a jamais écouté ces barres de son ;
 *   15 — un superlatif absolu est une affirmation invérifiable.
 *
 * Usage : node scripts/news-check.mjs src/content/blog/<slug>.md
 * Sortie : une ligne ✓ ou ✗ par contrôle, puis un total.
 * Code de sortie : 1 s'il reste un seul ✗, 0 sinon.
 */
import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import { config } from './news.config.mjs';

const file = process.argv[2];
if (!file) {
  console.error('Usage : node scripts/news-check.mjs src/content/blog/<slug>.md');
  process.exit(2);
}

let raw;
try {
  raw = readFileSync(file, 'utf-8');
} catch (error) {
  console.error(`✗ Fichier illisible : ${file} (${error.code ?? error.message})`);
  process.exit(2);
}

// ── Découpage frontmatter / corps ────────────────────────────────────────────
const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
if (!match) {
  console.error('✗ Aucun frontmatter YAML délimité par --- au début du fichier.');
  process.exit(2);
}

let front;
try {
  front = parseYaml(match[1]) ?? {};
} catch (error) {
  console.error(`✗ Frontmatter YAML invalide : ${error.message}`);
  process.exit(2);
}
const body = match[2];

// Corps débarrassé des blocs de code : on ne veut pas qu'un exemple de code
// déclenche un contrôle de prose.
const prose = body.replace(/```[\s\S]*?```/g, '').replace(/^ {4}.*$/gm, '');

// ── Petits utilitaires ──────────────────────────────────────────────────────
const results = [];
const ok = (label, detail = '') => results.push({ pass: true, label, detail });
const ko = (label, detail = '') => results.push({ pass: false, label, detail });
const check = (condition, label, detail = '') => (condition ? ok(label, detail) : ko(label, detail));
const len = (value) => (typeof value === 'string' ? value.trim().length : 0);
const countWords = (text) => (text.trim().match(/[\p{L}\p{N}''’-]+/gu) ?? []).length;

const C = config.check;
const MERCHANT_HOSTS = [
  'amazon.', 'amzn.', 'fnac.', 'darty.', 'boulanger.', 'cdiscount.', 'ldlc.',
  'materiel.net', 'rueducommerce.', 'topachat.', 'ebay.', 'aliexpress.',
  'razer.com', 'creative.com', 'logitech.com', 'edifier.com', 'trust.com',
];

// ═══ 1. metaTitle ═══════════════════════════════════════════════════════════
{
  const n = len(front.metaTitle);
  check(
    n >= C.metaTitle.min && n <= C.metaTitle.max,
    `metaTitle de ${C.metaTitle.min} à ${C.metaTitle.max} caractères`,
    n === 0 ? 'absent' : `${n} caractères`,
  );
}

// ═══ 2. description ═════════════════════════════════════════════════════════
{
  const n = len(front.description);
  check(
    n >= C.description.min && n <= C.description.max,
    `description de ${C.description.min} à ${C.description.max} caractères`,
    n === 0 ? 'absente' : `${n} caractères`,
  );
}

// ═══ 3. FAQ dans le frontmatter ═════════════════════════════════════════════
{
  const faq = Array.isArray(front.faq) ? front.faq : [];
  const complete = faq.filter((item) => len(item?.question) > 0 && len(item?.answer) > 0);
  check(
    complete.length >= C.faqMin,
    `FAQ de ${C.faqMin} questions minimum dans le frontmatter`,
    `${complete.length} question(s) complète(s)`,
  );
}

// ═══ 4. Sources citées ══════════════════════════════════════════════════════
{
  const sources = Array.isArray(front.sources) ? front.sources : [];
  const withUrl = sources.filter((s) => /^https?:\/\//.test(s?.url ?? ''));
  const nonMerchant = withUrl.filter((s) => !MERCHANT_HOSTS.some((h) => s.url.includes(h)));
  check(
    withUrl.length >= C.sourcesMin && nonMerchant.length >= C.nonMerchantSourcesMin,
    `${C.sourcesMin} sources minimum, dont ${C.nonMerchantSourcesMin} non marchande`,
    `${withUrl.length} source(s), ${nonMerchant.length} non marchande(s)`,
  );
}

// ═══ 5. updatedAt ═══════════════════════════════════════════════════════════
check(
  front.updatedAt !== undefined && front.updatedAt !== null && String(front.updatedAt).length > 0,
  'updatedAt présent',
  front.updatedAt ? String(front.updatedAt).slice(0, 10) : 'absent',
);

// ═══ 6. Pas de H1 dans le corps ═════════════════════════════════════════════
{
  const h1 = body.match(/^# .+$/gm) ?? [];
  check(h1.length === 0, 'Aucun « # » en début de ligne (le H1 vient du title)', h1.length ? `${h1.length} trouvé(s)` : '');
}

// ═══ 7. Ni « Introduction » ni « Conclusion » en titre ══════════════════════
{
  const banned = (body.match(/^#{2,3}\s*(introduction|conclusion)\b.*$/gim) ?? []).map((t) => t.trim());
  check(banned.length === 0, 'Aucun titre « Introduction » ni « Conclusion »', banned.join(' / '));
}

// ═══ 8. Liens internes uniques ══════════════════════════════════════════════
const internalLinks = [];
{
  for (const m of prose.matchAll(/\[([^\]]+)\]\((\/[^)\s]*)\)/g)) {
    internalLinks.push({ anchor: m[1].trim(), url: m[2].replace(/\/$/, '') || '/' });
  }
  const urls = internalLinks.map((l) => l.url);
  const uniqueUrls = new Set(urls);
  const anchors = internalLinks.map((l) => l.anchor.toLowerCase());
  const uniqueAnchors = new Set(anchors);
  const { min, max } = config.internalLinks;
  const inRange = uniqueUrls.size >= min && uniqueUrls.size <= max;
  const noDupUrl = urls.length === uniqueUrls.size;
  const noDupAnchor = anchors.length === uniqueAnchors.size;
  const detail = `${uniqueUrls.size} URL(s) unique(s) sur ${urls.length} lien(s)`;
  check(
    inRange && noDupUrl && noDupAnchor,
    `${min} à ${max} liens internes, une ancre unique par URL`,
    !inRange ? detail : !noDupUrl ? `${detail} — URL répétée` : !noDupAnchor ? `${detail} — ancre répétée` : detail,
  );
}

// ═══ 9. Lien vers la page pilier ════════════════════════════════════════════
{
  const pillar = config.strategicPage.url.replace(/\/$/, '');
  check(
    internalLinks.some((l) => l.url === pillar),
    `Lien vers la page pilier ${config.strategicPage.url}`,
    internalLinks.length ? 'absent parmi les liens internes' : 'aucun lien interne',
  );
}

// ═══ 10. Tableau Markdown ═══════════════════════════════════════════════════
{
  const lines = prose.split(/\r?\n/);
  let best = { rows: 0, cols: 0 };
  let rows = 0;
  let cols = 0;
  for (const line of lines) {
    if (/^\s*\|.*\|\s*$/.test(line)) {
      // La ligne de séparation |---|---| ne compte pas comme une ligne de données.
      if (!/^\s*\|[\s:|-]+\|\s*$/.test(line)) {
        rows++;
        cols = Math.max(cols, line.split('|').filter((c) => c.trim() !== '').length);
      }
    } else {
      if (rows > best.rows) best = { rows, cols };
      rows = 0;
      cols = 0;
    }
  }
  if (rows > best.rows) best = { rows, cols };
  check(
    best.rows >= C.tableMinRows && best.cols >= C.tableMinCols,
    `Tableau de ${C.tableMinRows} lignes × ${C.tableMinCols} colonnes minimum`,
    best.rows ? `${best.rows} ligne(s) × ${best.cols} colonne(s)` : 'aucun tableau',
  );
}

// ═══ 11. Liste à puces ══════════════════════════════════════════════════════
{
  const bullets = prose.match(/^\s*[-*+] \S/gm) ?? [];
  check(bullets.length >= 1, 'Au moins une liste à puces', `${bullets.length} puce(s)`);
}

// ═══ 12. Bloc Focus (citation) ══════════════════════════════════════════════
{
  const quotes = prose.match(/^> \S/gm) ?? [];
  check(quotes.length >= 1, 'Au moins un bloc Focus en citation « > »', `${quotes.length} ligne(s) citée(s)`);
}

// ═══ 13. Aucun prix en euros dans le corps ══════════════════════════════════
{
  const hits = [...prose.matchAll(/\d+\s*(?:€|euros?)/gi)].map((m) => m[0].trim());
  check(
    hits.length === 0,
    'Aucun prix en euros écrit dans le corps',
    hits.length ? `trouvé : ${[...new Set(hits)].slice(0, 4).join(', ')}` : '',
  );
}

// ═══ 14. Aucune revendication d'expérience physique ════════════════════════
{
  const pattern = /nous avons (?:test|écout|mesur)|testé pendant|à l'écoute, nous|nous l'avons (?:testée?|écoutée?)|après \w+ (?:semaines?|jours?) d'utilisation/gi;
  const hits = [...prose.matchAll(pattern)].map((m) => m[0]);
  check(
    hits.length === 0,
    "Aucune revendication d'expérience physique",
    hits.length ? `trouvé : « ${[...new Set(hits)].slice(0, 3).join(' », « ')} »` : '',
  );
}

// ═══ 15. Aucun superlatif absolu ════════════════════════════════════════════
{
  const pattern = /\ble meilleur\s|\bincontournable|\bimbattable|\bleader\s|\bsans conteste\b|\ble plus performant\b/gi;
  const hits = [...prose.matchAll(pattern)].map((m) => m[0].trim());
  check(
    hits.length === 0,
    'Aucun superlatif absolu',
    hits.length ? `trouvé : « ${[...new Set(hits)].slice(0, 3).join(' », « ')} »` : '',
  );
}

// ═══ 16. Règle answer-first sous chaque ## ══════════════════════════════════
{
  const sections = [...prose.matchAll(/^## +(.+)$/gm)];
  const offenders = [];
  for (let i = 0; i < sections.length; i++) {
    const start = sections[i].index + sections[i][0].length;
    const end = i + 1 < sections.length ? sections[i + 1].index : prose.length;
    const block = prose.slice(start, end);
    // Premier paragraphe : jusqu'à la première ligne vide suivie d'autre chose.
    const first = block.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).find((p) => p.length > 0) ?? '';
    const words = countWords(first);
    if (words < C.answerFirstWords.min || words > C.answerFirstWords.max) {
      offenders.push(`« ${sections[i][1].trim()} » : ${words} mots`);
    }
  }
  check(
    sections.length > 0 && offenders.length === 0,
    `Chaque ## ouvre sur un paragraphe de ${C.answerFirstWords.min} à ${C.answerFirstWords.max} mots`,
    sections.length === 0 ? 'aucune section ##' : offenders.slice(0, 3).join(' · '),
  );
}

// ═══ 17. Aucune anaphore contextuelle ══════════════════════════════════════
{
  const pattern = /comme (?:vu|évoqué|expliqué|dit) (?:plus haut|précédemment|ci-dessus)|ci-dessus|comme on l'a vu/gi;
  const hits = [...prose.matchAll(pattern)].map((m) => m[0]);
  check(
    hits.length === 0,
    'Aucune anaphore contextuelle (phrases auto-portantes)',
    hits.length ? `trouvé : « ${[...new Set(hits)].slice(0, 3).join(' », « ')} »` : '',
  );
}

// ── Rapport ─────────────────────────────────────────────────────────────────
console.log(`Contrôle qualité — ${file}\n`);
results.forEach((r, i) => {
  const mark = r.pass ? '✓' : '✗';
  const num = String(i + 1).padStart(2, ' ');
  console.log(`${mark} ${num}. ${r.label}${r.detail ? ` — ${r.detail}` : ''}`);
});

const failed = results.filter((r) => !r.pass).length;
console.log(`\n${results.length - failed}/${results.length} contrôles au vert.`);

if (failed > 0) {
  console.log(`${failed} à corriger avant publication.`);
  process.exit(1);
}
console.log('Article publiable.');
process.exit(0);
