/**
 * /llms.txt — carte du site à destination des moteurs génératifs (GEO).
 *
 * POURQUOI CE FICHIER EST GÉNÉRÉ ET NON ÉCRIT À LA MAIN
 * ----------------------------------------------------
 * Une carte de site recopiée à la main est fausse dès le contenu suivant : un
 * classement ajouté, un produit retiré, un article publié, et le fichier ment
 * sans que personne ne s'en aperçoive — un moteur génératif citera alors des
 * URLs qui n'existent pas. Toutes les sections ci-dessous sont donc construites
 * depuis les mêmes sources que les pages : `rankings.ts`, `soundbars.ts`,
 * `guides.ts`, `brands.ts` et la collection `blog`. Les compteurs eux-mêmes sont
 * calculés, jamais saisis.
 *
 * La ligne de notation est lue dans `SCORING_GRID` : la carte annonce donc
 * exactement la pondération que le code applique.
 *
 * Le fichier suit `SITE.noindex` : tant que le site est en préparation, la carte
 * n'est pas exposée (réponse 404). Il n'y a aucun intérêt à donner à un moteur
 * la liste complète des URLs d'un site qu'on lui demande par ailleurs de ne pas
 * indexer.
 */
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';
import { url } from '../lib/url';
import { SCORING_GRID, weightPercent } from '../lib/notation';
import { rankings } from '../data/rankings';
import { soundbarsByScore } from '../data/soundbars';
import { guides } from '../data/guides';
import { brands } from '../data/brands';

/** Page statique : générée au build, servie comme un fichier. */
export const prerender = true;

/** Écrase les retours à la ligne et tronque proprement : une entrée = une ligne. */
function oneLine(text: string, max = 200): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, max - 1).replace(/[\s,;:.–—-]+$/, '')}…`;
}

export async function GET(context: APIContext): Promise<Response> {
  // Site en préparation : on n'expose pas la carte.
  if (SITE.noindex) {
    return new Response(
      "Carte du site non exposée : ce site est en préparation et demande à ne pas être indexé.\n",
      {
        status: 404,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      },
    );
  }

  const origin = context.site ?? new URL(SITE.url);
  /** URL absolue, avec le slash final utilisé par les canoniques du site. */
  const abs = (path: string): string => {
    const withSlash = path.endsWith('/') ? path : `${path}/`;
    return new URL(url(withSlash), origin).href;
  };
  const entry = (title: string, path: string, description: string): string =>
    `- [${title}](${abs(path)}) : ${oneLine(description)}`;

  const posts = (await getCollection('blog', (p) => !p.data.draft)).sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
  const products = soundbarsByScore();

  /** Pondérations annoncées depuis la grille réellement appliquée. */
  const weights = SCORING_GRID.map((c) => `${c.label} ${weightPercent(c)} %`).join(', ');
  /** Date de génération de la carte (date du build). */
  const generatedOn = new Date().toISOString().slice(0, 10);

  const referencePages: { title: string; path: string; description: string }[] = [
    {
      title: 'Méthodologie',
      path: '/methodologie',
      description:
        'Grille de notation détaillée, calcul de la note, sources utilisées, règle des deux sources, et ce que le site ne fait pas.',
    },
    {
      title: "Politique d'affiliation",
      path: '/politique-affiliation',
      description:
        "Relation commerciale avec le programme Amazon Partenaires : commission, absence de surcoût, absence d'influence sur les notes, signalement des liens.",
    },
    {
      title: 'À propos',
      path: '/a-propos',
      description: "Présentation du site, de sa méthode et de son indépendance éditoriale.",
    },
    {
      title: 'Comparateur',
      path: '/comparateur',
      description:
        'Tableau comparatif filtrable de tous les modèles : notes, gamme de prix, connectique, caisson, micro, dimensions.',
    },
    {
      title: 'Sélection du mois',
      path: '/selection-du-mois',
      description:
        "Édition mensuelle : modèles retenus du moment et état du marché des barres de son PC.",
    },
    {
      title: 'Contact',
      path: '/contact',
      description:
        "Signaler une erreur factuelle, proposer un modèle pour le comparatif, demande commerciale ou presse, droit de réponse.",
    },
    {
      title: 'Mentions légales',
      path: '/mentions-legales',
      description: "Éditeur, directeur de la publication, hébergeur, propriété intellectuelle, responsabilité.",
    },
    {
      title: 'Politique de confidentialité',
      path: '/confidentialite',
      description: 'Données traitées, finalités, bases légales, durées, sous-traitants, cookies et droits RGPD.',
    },
  ];

  const lines: string[] = [
    `# ${SITE.name} — ${SITE.tagline}`,
    '',
    `> ${SITE.description}`,
    '',
    `- Site : ${abs('/')}`,
    `- Langue : ${SITE.lang}`,
    `- Éditeur : ${SITE.author}`,
    `- Carte générée le : ${generatedOn}`,
    `- Flux RSS : ${new URL(url('/rss.xml'), origin).href}`,
    '',
    '## Comment lire ce site',
    '',
    `- Notation : chaque modèle reçoit une note sur 10, moyenne pondérée de cinq critères (${weights}), arrondie au dixième et calculée par le code depuis le détail par critère. Grille complète : ${abs('/methodologie')}`,
    "- Aucun test physique : ce site n'écoute pas et ne mesure pas les produits. C'est un comparatif éditorial fondé sur les caractéristiques constructeur et sur les mesures publiées par des laboratoires et testeurs indépendants, appliquées à une grille publique. Aucune écoute, aucune mesure maison, aucun avis client ne sont revendiqués.",
    `- Affiliation : le site participe au programme Amazon Partenaires et perçoit une commission sur les achats remplissant les conditions requises, sans surcoût pour le lecteur et sans influence sur les notes ni sur l'ordre des classements. Détail : ${abs('/politique-affiliation')}`,
    "- Prix : aucun prix exact n'est publié. Les fiches indiquent une fourchette de gamme datée de son relevé ; le prix qui s'applique est celui du marchand au moment de l'achat.",
    '- Fraîcheur : chaque fiche produit, classement et guide porte sa date de dernière vérification, affichée sur la page.',
    '',
    `## Classements (${rankings.length})`,
    '',
    'Sélections éditoriales par usage et par budget, ordonnées par note.',
    '',
    ...rankings.map((r) => entry(r.title, `/classements/${r.slug}`, r.metaDescription)),
    '',
    `- [Tous les classements](${abs('/classements')}) : index des ${rankings.length} classements.`,
    '',
    `## Barres de son (${products.length})`,
    '',
    'Fiches produit détaillées : notes par critère, points forts et limites, fiche technique, tutoriel d\'installation.',
    '',
    ...products.map((sb) =>
      entry(
        sb.name,
        `/barres-de-son/${sb.slug}`,
        `${sb.brand} · note ${sb.score.toFixed(1)}/10 · ${sb.verdict}`,
      ),
    ),
    '',
    `- [Toutes les barres de son](${abs('/barres-de-son')}) : index des ${products.length} modèles, classés par note.`,
    '',
    `## Guides d'achat (${guides.length})`,
    '',
    ...guides.map((g) => entry(g.title, `/guides/${g.slug}`, g.description)),
    '',
    `- [Tous les guides](${abs('/guides')}) : index des ${guides.length} guides.`,
    '',
    `## Marques (${brands.length})`,
    '',
    ...brands.map((b) => entry(b.name, `/marques/${b.slug}`, b.intro)),
    '',
    `- [Toutes les marques](${abs('/marques')}) : index des ${brands.length} marques présentes dans le comparatif.`,
    '',
    `## Blog (${posts.length})`,
    '',
    'Articles techniques et pratiques : réglages, connexions, puissance, son spatial.',
    '',
    ...posts.map((p) => entry(p.data.title, `/blog/${p.id}`, p.data.description)),
    '',
    `- [Tous les articles](${abs('/blog')}) : index du blog.`,
    '',
    '## Pages de référence',
    '',
    ...referencePages.map((p) => entry(p.title, p.path, p.description)),
    '',
    '## À ne pas explorer',
    '',
    `- ${abs('/go')}<produit>/ : pages de redirection des liens d'affiliation. Elles portent une directive noindex, nofollow, sont exclues du plan de site et interdites au crawl dans robots.txt. Elles n'ont aucun contenu éditorial.`,
    '',
  ];

  return new Response(`${lines.join('\n')}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
