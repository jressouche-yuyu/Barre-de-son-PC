import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Collection « blog » : articles éditoriaux en Markdown.
 * Ajoute un fichier .md dans src/content/blog/ avec le frontmatter ci-dessous
 * et il apparaît automatiquement dans /blog, le sitemap et le flux RSS.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    /**
     * Titre de la balise <title>, distinct du H1.
     * Le H1 peut être long et éditorial ; la balise title doit tenir dans la
     * SERP. Contrôlé entre 45 et 65 caractères par `scripts/news-check.mjs`.
     * Facultatif : les articles antérieurs à la machinerie n'en ont pas, le
     * gabarit retombe alors sur `title`.
     */
    metaTitle: z.string().optional(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** Temps de lecture estimé en minutes. */
    readingMinutes: z.number().default(5),
    /**
     * Image de couverture (optionnelle). Chemin sous /public, ex.
     * "/images/blog/mon-article.jpg". Si absent, un visuel génératif unique
     * est affiché automatiquement.
     */
    cover: z.string().optional(),
    /** Texte alternatif de la couverture (accessibilité/SEO). */
    coverAlt: z.string().optional(),
    /** Mettre à true pour ne pas publier. */
    draft: z.boolean().default(false),
    /**
     * Questions / réponses de l'article.
     *
     * Elles vivent dans le frontmatter et PAS dans le corps : le gabarit les
     * rend en fin d'article et les injecte en JSON-LD `FAQPage`, ce qui est la
     * forme la plus reprise par les AI Overviews et les moteurs génératifs. Une
     * FAQ tapée dans le Markdown n'alimente aucune donnée structurée.
     *
     * `scripts/news-check.mjs` en exige 3 minimum sur un article produit
     * automatiquement.
     */
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .default([]),
    /**
     * Sources vérifiées à l'appui de l'article.
     *
     * Le site ne teste pas physiquement les produits : sa crédibilité repose
     * entièrement sur la traçabilité de ce qu'il avance. Le contrôle qualité
     * exige 2 sources minimum, dont au moins une non marchande.
     */
    sources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
          /** Éditeur de la source, ex. « Les Numériques ». */
          publisher: z.string().optional(),
        }),
      )
      .default([]),
  }),
});

export const collections = { blog };
