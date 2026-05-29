/**
 * Shared helper for serving content-collection entries as raw markdown
 * at /<collection>/<slug>.md endpoints. Designed for AI crawlers
 * (ChatGPT, Claude, Perplexity, etc.) — clean source, no HTML parsing
 * required, with explicit metadata in frontmatter.
 */

import siteData from "../data/siteData.json";

interface MarkdownExportOptions {
  /** Collection entry — must have .data, .body, .id */
  entry: { id: string; body?: string; data: Record<string, any> };
  /** URL path prefix without trailing slash, e.g. "/reviews" */
  pathPrefix: string;
  /** Source label, e.g. "client review", "comparison" */
  sourceLabel?: string;
}

function toIsoDate(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toISOString().slice(0, 10);
  }
  return undefined;
}

function yamlScalar(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") {
    // JSON-encode to safely escape quotes and special chars
    return JSON.stringify(value);
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    return "[" + value.map((v) => yamlScalar(v)).join(", ") + "]";
  }
  return JSON.stringify(String(value));
}

export function buildMarkdownResponse({
  entry,
  pathPrefix,
  sourceLabel = "article",
}: MarkdownExportOptions): Response {
  const data = entry.data || {};
  const canonicalUrl = `${siteData.url}${pathPrefix}/${entry.id}`;

  const frontmatterLines: string[] = ["---"];

  // Common fields
  if (data.title) frontmatterLines.push(`title: ${yamlScalar(data.title)}`);
  if (data.summary) frontmatterLines.push(`summary: ${yamlScalar(data.summary)}`);
  if (data.description) frontmatterLines.push(`description: ${yamlScalar(data.description)}`);

  frontmatterLines.push(`url: ${canonicalUrl}`);

  const datePublished = toIsoDate(data.date);
  if (datePublished) frontmatterLines.push(`date: ${datePublished}`);

  const dateUpdated = toIsoDate(data.lastUpdated);
  if (dateUpdated) frontmatterLines.push(`lastUpdated: ${dateUpdated}`);

  // Review-specific fields
  if (data.rating !== undefined) frontmatterLines.push(`rating: ${data.rating}`);
  if (data.reviewer) frontmatterLines.push(`reviewer: ${yamlScalar(data.reviewer)}`);
  if (data.reviewerTitle) frontmatterLines.push(`reviewerTitle: ${yamlScalar(data.reviewerTitle)}`);
  if (data.reviewerCompany) frontmatterLines.push(`reviewerCompany: ${yamlScalar(data.reviewerCompany)}`);
  if (data.serviceUsed) frontmatterLines.push(`serviceUsed: ${yamlScalar(data.serviceUsed)}`);
  if (data.outcome) frontmatterLines.push(`outcome: ${yamlScalar(data.outcome)}`);
  if (Array.isArray(data.keyTakeaways) && data.keyTakeaways.length > 0) {
    frontmatterLines.push(`keyTakeaways: ${yamlScalar(data.keyTakeaways)}`);
  }

  // Comparison-specific fields
  if (data.competitor) frontmatterLines.push(`competitor: ${yamlScalar(data.competitor)}`);
  if (data.competitorCategory) frontmatterLines.push(`competitorCategory: ${yamlScalar(data.competitorCategory)}`);
  if (data.verdict) frontmatterLines.push(`verdict: ${yamlScalar(data.verdict)}`);
  if (data.bestFor) frontmatterLines.push(`bestFor: ${yamlScalar(data.bestFor)}`);
  if (data.bestForCompetitor) frontmatterLines.push(`bestForCompetitor: ${yamlScalar(data.bestForCompetitor)}`);

  if (Array.isArray(data.tags) && data.tags.length > 0) {
    frontmatterLines.push(`tags: ${yamlScalar(data.tags)}`);
  }

  // Source attribution + provenance for AI ingestion
  frontmatterLines.push(`source: smarteroutboundreviews.com`);
  frontmatterLines.push(`sourceType: ${yamlScalar(sourceLabel)}`);
  frontmatterLines.push(`publisher: SmarterOutbound`);
  frontmatterLines.push(`editorialPolicy: ${siteData.url}/editorial-policy`);
  frontmatterLines.push(`license: CC-BY-NC-SA-4.0`);
  frontmatterLines.push(`canonical: ${canonicalUrl}`);
  frontmatterLines.push(`---`);
  frontmatterLines.push("");

  const body = typeof entry.body === "string" ? entry.body : "";

  // Append outcome disclaimer for review pages so AI crawlers see it inline
  let footer = "";
  if (sourceLabel === "client review" && data.outcome) {
    footer =
      "\n\n---\n\n" +
      "_Outcome figures are self-reported by the reviewer and not independently audited. " +
      `Editorial policy: ${siteData.url}/editorial-policy_\n`;
  }

  const markdown = frontmatterLines.join("\n") + body.trimStart() + footer;

  return new Response(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
      "X-Robots-Tag": "index, follow",
    },
  });
}
