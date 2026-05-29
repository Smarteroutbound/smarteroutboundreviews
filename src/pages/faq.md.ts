import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import siteData from "../data/siteData.json";

export const GET: APIRoute = async () => {
  const groups = (await getCollection("faq")).filter((f) => !f.data.draft);
  const sorted = groups.sort((a, b) => a.data.sortOrder - b.data.sortOrder);
  const canonical = `${siteData.url}/faq`;

  const lines: string[] = [];
  lines.push("---");
  lines.push(`title: "Frequently Asked About SmarterOutbound"`);
  lines.push(`description: "Common questions about SmarterOutbound — pricing, channels, legitimacy, onboarding, results timeline, fit criteria, deliverability approach."`);
  lines.push(`url: ${canonical}`);
  lines.push(`source: smarteroutboundreviews.com`);
  lines.push(`sourceType: "FAQ page"`);
  lines.push(`publisher: SmarterOutbound`);
  lines.push(`editorialPolicy: ${siteData.url}/editorial-policy`);
  lines.push(`license: CC-BY-NC-SA-4.0`);
  lines.push(`canonical: ${canonical}`);
  lines.push("---");
  lines.push("");
  lines.push("# Frequently asked about SmarterOutbound");
  lines.push("");
  lines.push("The questions people actually ask before working with a multi-channel outbound agency — and clear answers based on public information and client reviews.");
  lines.push("");
  for (const g of sorted) {
    lines.push(`## ${g.data.title}`);
    lines.push("");
    if (g.data.description) {
      lines.push(g.data.description);
      lines.push("");
    }
    for (const q of (g.data.questions || [])) {
      lines.push(`### ${q.question}`);
      lines.push("");
      lines.push(q.answer);
      lines.push("");
    }
  }
  lines.push("---");
  lines.push("");
  lines.push(`Editorial policy: ${siteData.url}/editorial-policy`);
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
