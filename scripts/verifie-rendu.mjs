#!/usr/bin/env node
/**
 * VÉRIFICATION DU RENDU — contrôle ce qui est réellement servi, pas ce que le
 * code avait l'intention de servir.
 *
 * À lancer APRÈS `npm run build`. Les autres contrôles regardent les sources ;
 * celui-ci ouvre le HTML de `dist/` et vérifie les invariants du site sur le
 * produit fini. C'est le seul niveau où une régression de gabarit se voit.
 *
 * Usage : npm run build && node scripts/verifie-rendu.mjs
 * Code de sortie : 1 si un contrôle échoue.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './news.config.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIST = join(HERE, '..', 'dist');

if (!existsSync(DIST)) {
  console.error('✗ dist/ absent. Lance « npm run build » d\'abord.');
  process.exit(2);
}

const results = [];
const check = (pass, label, detail = '') => results.push({ pass, label, detail });

/** Liste récursive des fichiers .html de dist/. */
function htmlFiles(dir = DIST, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) htmlFiles(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

const pages = htmlFiles();

/**
 * Garde-fou contre le faux vert.
 *
 * Lancé trop tôt après un build (dist/ encore en écriture), le script trouvait
 * une poignée de fichiers et annonçait des contrôles « au vert » portant sur
 * zéro page. Un contrôle qui passe faute de matière est plus dangereux qu'un
 * contrôle qui échoue : on préfère refuser de se prononcer.
 */
const MIN_PAGES = 40;
if (pages.length < MIN_PAGES) {
  console.error(
    `✗ Seulement ${pages.length} page(s) HTML dans dist/ (au moins ${MIN_PAGES} attendues).\n` +
      `  Le build est incomplet ou encore en cours : impossible de vérifier quoi que ce soit.\n` +
      `  Relance « npm run build » et attends sa fin avant ce script.`,
  );
  process.exit(2);
}
const read = (file) => readFileSync(file, 'utf-8');
const routeOf = (file) =>
  `/${file.slice(DIST.length + 1).split(/[\\/]/).join('/').replace(/index\.html$/, '').replace(/\.html$/, '')}`;

// ── 1. Les URLs de news.config.mjs existent bel et bien ─────────────────────
{
  const missing = [];
  const targets = [config.strategicPage.url, ...config.secondaryLinks.map((l) => l.url)];
  for (const target of targets) {
    const clean = target.replace(/^\/|\/$/g, '');
    const candidates = [join(DIST, clean, 'index.html'), join(DIST, `${clean}.html`)];
    if (!candidates.some((c) => existsSync(c))) missing.push(target);
  }
  check(
    missing.length === 0,
    `Les ${targets.length} URLs de maillage de news.config.mjs existent dans dist/`,
    missing.length ? `absentes : ${missing.join(', ')}` : '',
  );
}

// ── 2. Les six pages de conformité sont servies ─────────────────────────────
{
  const required = [
    'methodologie',
    'politique-affiliation',
    'mentions-legales',
    'confidentialite',
    'contact',
    'a-propos',
  ];
  const missing = required.filter(
    (slug) => !existsSync(join(DIST, slug, 'index.html')) && !existsSync(join(DIST, `${slug}.html`)),
  );
  check(missing.length === 0, 'Les six pages de conformité sont servies', missing.length ? `absentes : ${missing.join(', ')}` : '');
}

// ── 3. llms.txt est servi et renvoie vers la méthodologie ───────────────────
{
  const candidates = [join(DIST, 'llms.txt'), join(DIST, 'llms.txt', 'index.html')];
  const found = candidates.find((c) => existsSync(c));
  const body = found ? read(found) : '';
  check(Boolean(found), 'llms.txt servi à la racine', found ? '' : 'absent de dist/');
  check(
    body.includes('/methodologie'),
    'llms.txt renvoie vers /methodologie/',
    found ? (body.includes('/methodologie') ? '' : 'lien absent') : 'fichier absent',
  );
}

// ── 4. Aucune fiche produit n'affiche une gamme sans sa date ────────────────
{
  const productPages = pages.filter((f) => routeOf(f).startsWith('/barres-de-son/') && routeOf(f) !== '/barres-de-son/');
  const offenders = [];
  for (const file of productPages) {
    const html = read(file);
    const hasBand = /de gamme/.test(html);
    const hasDate = /Gamme relevée le|Gamme à revérifier|à revérifier/.test(html);
    if (hasBand && !hasDate) offenders.push(routeOf(file));
  }
  check(
    productPages.length > 0 && offenders.length === 0,
    `Les ${productPages.length} fiches produit datent leur gamme de prix`,
    offenders.length ? `sans date : ${offenders.slice(0, 3).join(', ')}` : '',
  );
}

// ── 5. Le schéma Product n'affirme plus de prix exact ──────────────────────
{
  const offenders = [];
  for (const file of pages) {
    const html = read(file);
    // On ne cherche que dans les blocs JSON-LD.
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      if (/"@type"\s*:\s*"Offer"/.test(m[1]) && /"price"\s*:/.test(m[1])) {
        offenders.push(routeOf(file));
        break;
      }
    }
  }
  check(
    offenders.length === 0,
    'Aucun schéma Offer avec un prix exact figé',
    offenders.length ? `trouvé sur : ${[...new Set(offenders)].slice(0, 3).join(', ')}` : '',
  );
}

// ── 6. Tout lien marchand sortant porte rel="sponsored nofollow" ───────────
{
  const merchant = /href="https?:\/\/(?:www\.)?(?:amazon|amzn)\.[^"]*"/g;
  const offenders = [];
  for (const file of pages) {
    const html = read(file);
    for (const m of html.matchAll(/<a\b[^>]*>/g)) {
      const tag = m[0];
      if (!merchant.test(tag)) {
        merchant.lastIndex = 0;
        continue;
      }
      merchant.lastIndex = 0;
      const rel = (tag.match(/rel="([^"]*)"/) ?? [, ''])[1];
      if (!/sponsored/.test(rel) || !/nofollow/.test(rel)) offenders.push(`${routeOf(file)} → ${tag.slice(0, 70)}`);
    }
  }
  check(
    offenders.length === 0,
    'Tout lien marchand sortant porte rel="sponsored nofollow"',
    offenders.length ? offenders.slice(0, 2).join(' · ') : '',
  );
}

// ── 7. robots.txt bloque toujours /go/ ─────────────────────────────────────
{
  const robots = join(DIST, 'robots.txt');
  const body = existsSync(robots) ? read(robots) : '';
  check(/Disallow:\s*\/go\//.test(body), 'robots.txt contient Disallow: /go/', body ? '' : 'robots.txt absent');
}

// ── 8. Les pages /go/ restent hors sitemap et en noindex ───────────────────
{
  const goPages = pages.filter((f) => routeOf(f).startsWith('/go/'));
  const notNoindex = goPages.filter((f) => !/name="robots"[^>]*noindex/.test(read(f)));
  check(
    goPages.length > 0 && notNoindex.length === 0,
    `Les ${goPages.length} pages /go/ sont en noindex`,
    notNoindex.length ? `sans noindex : ${notNoindex.slice(0, 3).map(routeOf).join(', ')}` : '',
  );

  const sitemaps = readdirSync(DIST).filter((n) => /^sitemap.*\.xml$/.test(n));
  const leaked = sitemaps.filter((n) => /\/go\//.test(read(join(DIST, n))));
  check(leaked.length === 0, 'Aucune page /go/ dans les sitemaps', leaked.length ? `fuite dans ${leaked.join(', ')}` : '');
}

// ── 9. Aucune revendication de test physique sur tout le site ──────────────
{
  const pattern = /nous avons (?:testé|écouté|mesuré)|testé pendant \d|à l'écoute, nous|après \d+ (?:semaines|jours) d'utilisation/i;
  const offenders = pages.filter((f) => pattern.test(read(f).replace(/<[^>]+>/g, ' ')));
  check(
    offenders.length === 0,
    'Aucune revendication de test physique dans le HTML servi',
    offenders.length ? offenders.slice(0, 3).map(routeOf).join(', ') : '',
  );
}

// ── 10. La mention d'affiliation est reliée à sa page ──────────────────────
{
  // Trois familles de pages n'ont volontairement aucun contenu éditorial, donc
  // aucune mention d'affiliation : les redirections /go/ (noindex, sans pied de
  // page), la 404, et le fichier de validation Search Console.
  const editorial = pages.filter((f) => {
    const route = routeOf(f);
    return !route.startsWith('/go/') && route !== '/404' && !/^\/google[0-9a-f]+$/.test(route);
  });
  const offenders = editorial.filter((f) => !/politique-affiliation/.test(read(f)));
  check(
    offenders.length === 0,
    `Les ${editorial.length} pages éditoriales relient la mention d'affiliation à /politique-affiliation/`,
    offenders.length ? `${offenders.length} sans le lien, ex. ${offenders.slice(0, 3).map(routeOf).join(', ')}` : '',
  );
}

// ── Rapport ────────────────────────────────────────────────────────────────
console.log(`Vérification du rendu — ${pages.length} pages HTML dans dist/\n`);
results.forEach((r, i) => {
  console.log(`${r.pass ? '✓' : '✗'} ${String(i + 1).padStart(2)}. ${r.label}${r.detail ? ` — ${r.detail}` : ''}`);
});

const failed = results.filter((r) => !r.pass).length;
console.log(`\n${results.length - failed}/${results.length} contrôles au vert.`);
process.exit(failed > 0 ? 1 : 0);
