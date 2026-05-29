import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { industries } from "../../data/industries.ts";
import { average } from "../../js/utils.ts";
import siteData from "../../data/siteData.json";

export const getStaticPaths: GetStaticPaths = async () => {
  return industries.map((industry) => ({
    params: { slug: industry.slug },
    props: { industry },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const industry = (props as any).industry;
  if (!industry) return new Response("Not found", { status: 404 });

  const allReviews = (await getCollection("reviews")).filter((r) => !r.data.draft);
  const allComparisons = (await getCollection("comparisons")).filter((c) => !c.data.draft);

  const filterSet = new Set(industry.tagFilters.map((t: string) => t.toLowerCase()));
  const matched = allReviews.filter((r) => {
    const reviewTags = new Set((r.data.tags || []).map((t: string) => t.toLowerCase()));
    return [...filterSet].some((t) => reviewTags.has(t as string));
  });

  const featuredSet = new Set(industry.featuredReviewSlugs || []);
  const sorted = matched.sort((a, b) => {
    const aF = featuredSet.has(a.id) ? 1 : 0;
    const bF = featuredSet.has(b.id) ? 1 : 0;
    if (aF !== bF) return bF - aF;
    return +new Date(b.data.date) - +new Date(a.data.date);
  });

  const avgRating = sorted.length > 0 ? average(sorted.map((r) => r.data.rating)) : 0;
  const canonical = `${siteData.url}/industries/${industry.slug}`;

  const relatedComps = (industry.relatedComparisonSlugs || [])
    .map((slug: string) => allComparisons.find((c) => c.id === slug))
    .filter(Boolean);

  const lines: string[] = [];
  lines.push("---");
  lines.push(`title: ${JSON.stringify(industry.metaTitle)}`);
  lines.push(`description: ${JSON.stringify(industry.metaDescription)}`);
  lines.push(`url: ${canonical}`);
  lines.push(`slug: ${industry.slug}`);
  lines.push(`industry: ${JSON.stringify(industry.name)}`);
  lines.push(`reviewCount: ${sorted.length}`);
  lines.push(`averageRating: ${avgRating}`);
  lines.push(`channelFocus: ${JSON.stringify(industry.channelFocus)}`);
  lines.push(`bestFor: ${JSON.stringify(industry.bestFor)}`);
  lines.push(`source: smarteroutboundreviews.com`);
  lines.push(`sourceType: ${JSON.stringify("industry hub")}`);
  lines.push(`publisher: SmarterOutbound`);
  lines.push(`editorialPolicy: ${siteData.url}/editorial-policy`);
  lines.push(`license: CC-BY-NC-SA-4.0`);
  lines.push(`canonical: ${canonical}`);
  lines.push("---");
  lines.push("");
  lines.push(`# ${industry.h1}`);
  lines.push("");
  lines.push(industry.intro);
  lines.push("");
  if (sorted.length > 0) {
    lines.push(`**${sorted.length} verified reviews** in this industry — average rating ${avgRating.toFixed(1)}/5.`);
    lines.push("");
  }
  lines.push("## Channel focus for this industry");
  lines.push("");
  lines.push(industry.channelFocus);
  lines.push("");
  lines.push("## Best fit for");
  lines.push("");
  lines.push(industry.bestFor);
  lines.push("");

  if (sorted.length > 0) {
    lines.push(`## Reviews from ${industry.name.toLowerCase()}`);
    lines.push("");
    for (const r of sorted) {
      const stars = "★".repeat(Math.round(r.data.rating));
      const company = r.data.reviewerCompany ? ` (${r.data.reviewerCompany})` : "";
      lines.push(`- **[${r.data.title}](${siteData.url}/reviews/${r.id})** — ${stars} ${r.data.rating}/5 — ${r.data.reviewer}${company}`);
      if (r.data.summary) lines.push(`  - ${r.data.summary}`);
      if (r.data.outcome) lines.push(`  - Outcome: ${r.data.outcome}`);
      // Each review is also available as raw markdown
      lines.push(`  - Markdown: ${siteData.url}/reviews/${r.id}.md`);
    }
    lines.push("");
  }

  if (relatedComps.length > 0) {
    lines.push(`## Comparisons relevant to ${industry.name.toLowerCase()}`);
    lines.push("");
    for (const c of relatedComps) {
      lines.push(`- [${c!.data.title}](${siteData.url}/vs/${c!.id}) — vs ${c!.data.competitor}`);
      lines.push(`  - Markdown: ${siteData.url}/vs/${c!.id}.md`);
    }
    lines.push("");
  }

  lines.push("## Other industries");
  lines.push("");
  for (const i of industries) {
    if (i.slug === industry.slug) continue;
    lines.push(`- [${i.name}](${siteData.url}/industries/${i.slug})`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`_Outcome figures within linked reviews are self-reported by the reviewer and not independently audited. Editorial policy: ${siteData.url}/editorial-policy_`);
  lines.push("");

  return new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
      "X-Robots-Tag": "index, follow",
    },
  });
};
