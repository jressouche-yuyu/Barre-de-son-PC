#!/usr/bin/env node
/**
 * PIPELINE D'ILLUSTRATION À REPLI GARANTI.
 *
 * Contrainte : un article ne doit JAMAIS avoir de trou visuel, et la routine ne
 * doit JAMAIS se bloquer sur une image. D'où trois étages, du meilleur au plus
 * sûr, chacun rattrapant l'échec du précédent :
 *
 *   Étage 1 — Pexels. Photo fraîche et variée, si PEXELS_API_KEY est défini et
 *             api.pexels.com joignable. Converti en WebP (et pas en AVIF :
 *             l'encodage AVIF est environ dix fois plus lent et fait exploser
 *             le temps de build pour un gain marginal à cette taille).
 *   Étage 2 — Bibliothèque locale. Correspondance thématique sur les images
 *             déjà présentes dans /public/images, avec anti-répétition : une
 *             image déjà attribuée à un autre contenu n'est pas réutilisée.
 *   Étage 3 — Aucun `cover`. Le gabarit retombe alors sur `CoverArt.astro`, qui
 *             génère un visuel unique dérivé du slug. C'est le repli le plus
 *             robuste des trois : il est toujours disponible, toujours unique,
 *             et sans aucune question de droits. Un article sans photo n'est
 *             donc pas un article sans visuel.
 *
 * Le script écrit `cover` et `coverAlt` dans le frontmatter de l'article, et
 * journalise l'attribution dans scripts/photo-ledger.json.
 *
 * `coverAlt` DÉCRIT L'IMAGE. Il ne répète pas le titre de l'article : un texte
 * alternatif sert à quelqu'un qui ne voit pas la photo, pas à replacer un
 * mot-clé.
 *
 * Usage : node scripts/assign-photo.mjs "<slug>" "<thème FR : 3-6 mots-clés>"
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { config } from './news.config.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..');
const LEDGER = join(REPO, config.photo.ledger);

const slug = process.argv[2];
const theme = process.argv[3] ?? '';

if (!slug) {
  console.error('Usage : node scripts/assign-photo.mjs "<slug>" "<thème FR>"');
  process.exit(2);
}

const articlePath = join(REPO, 'src', 'content', 'blog', `${slug}.md`);
if (!existsSync(articlePath)) {
  console.error(`✗ Article introuvable : ${articlePath}`);
  process.exit(2);
}

// ── Journal des attributions (anti-répétition) ──────────────────────────────
function readPhotoLedger() {
  if (!existsSync(LEDGER)) return {};
  try {
    return JSON.parse(readFileSync(LEDGER, 'utf-8')) ?? {};
  } catch {
    return {};
  }
}

function writePhotoLedger(ledger) {
  mkdirSync(dirname(LEDGER), { recursive: true });
  writeFileSync(LEDGER, `${JSON.stringify(ledger, null, 2)}\n`, 'utf-8');
}

const ledger = readPhotoLedger();

/**
 * Chemins d'images déjà attribués à un AUTRE contenu du site.
 *
 * Le journal ne suffit pas : il ne connaît que les attributions faites par ce
 * script. Les visuels des guides, des classements et des fiches produit sont
 * référencés directement dans `src/`, et une première version de ce script
 * réattribuait tranquillement la couverture d'un guide à un article de blog.
 * On balaie donc aussi les sources pour construire la liste réelle.
 */
function alreadyUsedImages() {
  const used = new Set(
    Object.entries(ledger)
      .filter(([key]) => key !== `post:${slug}`)
      .map(([, value]) => value?.image)
      .filter(Boolean),
  );

  const scan = (dir) => {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        scan(full);
        continue;
      }
      if (!/\.(ts|md|astro|json)$/.test(name)) continue;
      // L'article en cours d'attribution ne se bloque pas lui-même.
      if (full === articlePath) continue;
      for (const m of readFileSync(full, 'utf-8').matchAll(/['"](\/images\/[^'"]+)['"]/g)) {
        used.add(m[1]);
      }
    }
  };

  scan(join(REPO, 'src'));
  return used;
}

const takenImages = alreadyUsedImages();

// ── Écriture du frontmatter ─────────────────────────────────────────────────
/**
 * Pose ou remplace `cover` / `coverAlt` dans le frontmatter, en respectant les
 * autres champs. On travaille en texte plutôt qu'en réécrivant du YAML pour ne
 * pas reformater l'article (ordre des clés, commentaires, style de guillemets).
 */
function setCover(coverPath, coverAlt) {
  const raw = readFileSync(articlePath, 'utf-8');
  const match = raw.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$/);
  if (!match) {
    console.error('✗ Aucun frontmatter YAML délimité par --- au début de l\'article.');
    process.exit(2);
  }

  let [, open, front, close, body] = match;
  const escape = (value) => `"${String(value).replace(/"/g, '\\"')}"`;

  const upsert = (key, value) => {
    const line = `${key}: ${escape(value)}`;
    const pattern = new RegExp(`^${key}:.*$`, 'm');
    front = pattern.test(front) ? front.replace(pattern, line) : `${front}\n${line}`;
  };

  const remove = (key) => {
    front = front.replace(new RegExp(`^${key}:.*\\r?\\n?`, 'm'), '');
  };

  if (coverPath) {
    upsert('cover', coverPath);
    upsert('coverAlt', coverAlt);
  } else {
    // Étage 3 : on RETIRE les champs pour que CoverArt prenne le relais.
    remove('cover');
    remove('coverAlt');
  }

  writeFileSync(articlePath, `${open}${front.trim()}${close}${body}`, 'utf-8');
}

function finish(stage, coverPath, coverAlt, detail) {
  setCover(coverPath, coverAlt);
  ledger[`post:${slug}`] = {
    stage,
    image: coverPath ?? null,
    coverAlt: coverAlt ?? null,
    theme,
    assignedAt: new Date().toISOString().slice(0, 10),
  };
  writePhotoLedger(ledger);

  console.log(`✓ Étage ${stage} — ${detail}`);
  if (coverPath) {
    console.log(`  cover    : ${coverPath}`);
    console.log(`  coverAlt : ${coverAlt}`);
  } else {
    console.log('  cover    : aucun — CoverArt génère un visuel unique depuis le slug');
  }
  process.exit(0);
}

// ── Étage 1 — Pexels ────────────────────────────────────────────────────────
async function tryPexels() {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return { ok: false, why: 'PEXELS_API_KEY non défini' };
  if (!theme) return { ok: false, why: 'aucun thème fourni' };

  try {
    const query = encodeURIComponent(theme);
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${query}&per_page=15&orientation=landscape&locale=fr-FR`,
      { headers: { Authorization: key }, signal: AbortSignal.timeout(15000) },
    );
    if (!response.ok) return { ok: false, why: `Pexels a répondu ${response.status}` };

    const data = await response.json();
    const photos = Array.isArray(data?.photos) ? data.photos : [];
    if (photos.length === 0) return { ok: false, why: 'aucune photo pour ce thème' };

    // On évite de retomber sur une photo déjà utilisée par un autre article.
    const usedIds = new Set(
      Object.values(ledger).map((v) => v?.pexelsId).filter(Boolean),
    );
    const photo = photos.find((p) => !usedIds.has(p.id)) ?? photos[0];

    const imageUrl = photo?.src?.large2x ?? photo?.src?.large ?? photo?.src?.original;
    if (!imageUrl) return { ok: false, why: 'aucune variante exploitable' };

    const binary = await fetch(imageUrl, { signal: AbortSignal.timeout(20000) });
    if (!binary.ok) return { ok: false, why: `téléchargement ${binary.status}` };

    const outDir = join(REPO, config.photo.outDir);
    mkdirSync(outDir, { recursive: true });
    const outPath = join(outDir, `${slug}.${config.photo.format}`);

    await sharp(Buffer.from(await binary.arrayBuffer()))
      .resize(config.photo.width, config.photo.height, { fit: 'cover', position: 'centre' })
      .webp({ quality: 82 })
      .toFile(outPath);

    // Texte alternatif : la description Pexels décrit bien l'image, ce qui est
    // exactement ce qu'on veut — et pas le titre de l'article.
    const described = (photo.alt ?? '').trim();
    const coverAlt = described.length > 5
      ? described.charAt(0).toUpperCase() + described.slice(1)
      : `Photographie d'illustration sur le thème : ${theme}`;

    ledger[`post:${slug}`] = { ...(ledger[`post:${slug}`] ?? {}), pexelsId: photo.id };

    return {
      ok: true,
      cover: `/${relative(join(REPO, 'public'), outPath).split(/[\\/]/).join('/')}`,
      coverAlt,
      detail: `photo Pexels #${photo.id} de ${photo.photographer ?? 'auteur inconnu'}`,
    };
  } catch (error) {
    return { ok: false, why: error.name === 'TimeoutError' ? 'délai dépassé' : error.message };
  }
}

// ── Étage 2 — Bibliothèque locale ───────────────────────────────────────────
function tryLocal() {
  const words = theme
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 4);

  const candidates = [];
  for (const dir of config.photo.localLibraries) {
    const absolute = join(REPO, dir);
    if (!existsSync(absolute)) continue;
    for (const name of readdirSync(absolute)) {
      if (!/\.(webp|jpg|jpeg|png)$/i.test(name)) continue;
      const publicPath = `/${relative(join(REPO, 'public'), join(absolute, name)).split(/[\\/]/).join('/')}`;
      if (takenImages.has(publicPath)) continue;

      const haystack = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const score = words.filter((w) => haystack.includes(w)).length;
      candidates.push({ publicPath, name, score });
    }
  }

  if (candidates.length === 0) return { ok: false, why: 'aucune image locale disponible et non attribuée' };

  candidates.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  const best = candidates[0];

  // Sans la moindre correspondance thématique, on refuse plutôt que d'illustrer
  // au hasard : l'étage 3 fera mieux qu'une image hors sujet.
  if (best.score === 0) {
    return { ok: false, why: `aucune correspondance thématique parmi ${candidates.length} image(s) libre(s)` };
  }

  const readable = basenameToWords(best.name);
  return {
    ok: true,
    cover: best.publicPath,
    coverAlt: `Illustration : ${readable}`,
    detail: `image locale « ${best.name} » (${best.score} mot(s)-clé(s) en commun)`,
  };
}

/** « barre-de-son-pc-gaming.webp » → « barre de son pc gaming ». */
function basenameToWords(name) {
  return name
    .slice(0, name.length - extname(name).length)
    .replace(/[-_]+/g, ' ')
    .replace(/\b(card|cover|banner|\d+)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Enchaînement des étages ─────────────────────────────────────────────────
const pexels = await tryPexels();
if (pexels.ok) finish(1, pexels.cover, pexels.coverAlt, pexels.detail);
console.log(`· Étage 1 (Pexels) écarté : ${pexels.why}`);

const local = tryLocal();
if (local.ok) finish(2, local.cover, local.coverAlt, local.detail);
console.log(`· Étage 2 (bibliothèque locale) écarté : ${local.why}`);

finish(3, null, null, 'repli génératif — visuel unique dérivé du slug, aucun droit à gérer');
