import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/* ===== 1. Reviews ===== */
const reviews = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/reviews" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    rating: z.number().min(1).max(5),
    reviewer: z.string(),
    reviewerTitle: z.string().optional(),
    reviewerCompany: z.string().optional(),
    serviceUsed: z.string().optional(),
    outcome: z.string().optional(),
    date: z.coerce.date(),
    lastUpdated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    keyTakeaways: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/* ===== 2. Comparisons (SmarterOutbound vs X) ===== */
const comparisons = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/comparisons" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    competitor: z.string(),
    competitorCategory: z
      .enum(["agency", "platform", "tool", "freelancer"])
      .default("platform"),
    date: z.coerce.date(),
    lastUpdated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    verdict: z.string().optional(),
    bestFor: z.string().optional(),
    bestForCompetitor: z.string().optional(),
    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/* ===== 3. FAQ ===== */
const faq = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/faq" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    sortOrder: z.number().default(0),
    questions: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  reviews,
  comparisons,
  faq,
};
