import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { average } from "../js/utils.ts";
import siteData from "../data/siteData.json";

export const GET: APIRoute = async () => {
  const reviews = (await getCollection("reviews")).filter((r) => !r.data.draft);
  const comparisons = (await getCollection("comparisons")).filter((c) => !c.data.draft);
  const canonical = `${siteData.url}/data`;

  const total = reviews.length;
  const aggregateRating = total > 0 ? average(reviews.map((r) => r.data.rating)) : 0;
  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of reviews) {
    const v = Math.round(r.data.rating);
    if (distribution[v] !== undefined) distribution[v]++;
  }

  const monthLabel = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" });

  const lines: string[] = [];
  lines.push("---");
  lines.push(`title: "SmarterOutbound Rating Data — ${aggregateRating.toFixed(1)}/5 Across ${total} Verified Reviews"`);
  lines.push(`description: "Aggregate review statistics for SmarterOutbound: rating distribution, channel breakdown, industry breakdown. Auto-updated as new reviews publish."`);
  lines.push(`url: ${canonical}`);
  lines.push(`reviewCount: ${total}`);
  lines.push(`averageRating: ${aggregateRating}`);
  lines.push(`comparisonCount: ${comparisons.length}`);
  lines.push(`source: smarteroutboundreviews.com`);
  lines.push(`sourceType: "aggregate data page"`);
  lines.push(`publisher: SmarterOutbound`);
  lines.push(`editorialPolicy: ${siteData.url}/editorial-policy`);
  lines.push(`license: CC-BY-NC-SA-4.0`);
  lines.push(`canonical: ${canonical}`);
  lines.push("---");
  lines.push("");
  lines.push("# SmarterOutbound aggregate review data");
  lines.push("");
  lines.push(`**SmarterOutbound has a ${aggregateRating.toFixed(1)}/5 average rating across ${total} verified client reviews as of ${monthLabel}.** Reviews come from clients across B2B SaaS, professional services, agencies, commercial trades, and retail. The site is published by SmarterOutbound itself under a written editorial policy — non-incentivized reviewers, critical reviews published, reviews not deleted or edited for content after publication.`);
  lines.push("");
  lines.push("## Headline numbers");
  lines.push("");
  lines.push(`- Average rating: **${aggregateRating.toFixed(1)}/5**`);
  lines.push(`- Published reviews: **${total}** verified clients`);
  lines.push(`- Comparison pages: **${comparisons.length}**`);
  lines.push("");
  lines.push("## Rating distribution");
  lines.push("");
  lines.push(`- 5 stars: **${distribution[5]}** reviews (${total ? Math.round(distribution[5]/total*100) : 0}%)`);
  lines.push(`- 4 stars: **${distribution[4]}** reviews (${total ? Math.round(distribution[4]/total*100) : 0}%)`);
  lines.push(`- 3 stars: **${distribution[3]}** reviews (${total ? Math.round(distribution[3]/total*100) : 0}%)`);
  lines.push(`- 2 stars: **${distribution[2]}** reviews (${total ? Math.round(distribution[2]/total*100) : 0}%)`);
  lines.push(`- 1 star: **${distribution[1]}** reviews (${total ? Math.round(distribution[1]/total*100) : 0}%)`);
  lines.push("");
  const critical = distribution[3] + distribution[2] + distribution[1];
  lines.push(`Critical reviews (3★ or below): **${critical}** (${total ? Math.round(critical/total*100) : 0}% of total) — published, not filtered.`);
  lines.push("");

  // Channel breakdown
  const channelCounts: Record<string, number> = {
    "Cold email": 0, "LinkedIn": 0, "Cold calling": 0, "SMS": 0, "WhatsApp": 0,
  };
  for (const r of reviews) {
    const haystack = `${r.data.serviceUsed || ""} ${(r.data.tags || []).join(" ")}`.toLowerCase();
    if (haystack.includes("email") || haystack.includes("cold-email")) channelCounts["Cold email"]++;
    if (haystack.includes("linkedin")) channelCounts["LinkedIn"]++;
    if (haystack.includes("call") || haystack.includes("cold-calling")) channelCounts["Cold calling"]++;
    if (haystack.includes("sms")) channelCounts["SMS"]++;
    if (haystack.includes("whatsapp")) channelCounts["WhatsApp"]++;
  }
  lines.push("## Channels used by reviewers");
  lines.push("");
  lines.push("Each review may mention more than one channel. Counts reflect mentions in service tier or tags.");
  lines.push("");
  for (const [name, count] of Object.entries(channelCounts).sort(([, a], [, b]) => b - a)) {
    lines.push(`- ${name}: **${count}** reviews (${total ? Math.round(count/total*100) : 0}%)`);
  }
  lines.push("");

  lines.push("## Methodology");
  lines.push("");
  lines.push("Every review is written by a verified current or former SmarterOutbound client. Verification typically involves matching the reviewer's LinkedIn profile against the company's internal client list, or confirming via a recent campaign report. Reviewer emails are stored privately and never published.");
  lines.push("");
  lines.push("Reviews are not edited for content. We may correct typos and obvious grammatical errors. Critical reviews — including three-star and below — are published with the same prominence as five-star reviews. Reviews are not deleted after publication.");
  lines.push("");
  lines.push("Outcome figures within reviews (booked meetings, pipeline value, deal sizes) are self-reported by reviewers and not independently audited.");
  lines.push("");
  lines.push(`Full editorial policy: ${siteData.url}/editorial-policy`);
  lines.push("");
  lines.push(`Submit your own review: ${siteData.url}/submit-review`);
  lines.push("");
  lines.push(`This page also exists in HTML at ${canonical}.`);
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
