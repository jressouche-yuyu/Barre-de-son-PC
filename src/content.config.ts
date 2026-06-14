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
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    /** Temps de lecture estimé en minutes. */
    readingMinutes: z.number().default(5),
    /** Mettre à true pour ne pas publier. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
