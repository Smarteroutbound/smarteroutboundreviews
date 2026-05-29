import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import siteData from "../data/siteData.json";

export const GET: APIRoute = async () => {
  const allReviews = (await getCollection("reviews")).filter((r) => !r.data.draft);
  const canonical = `${siteData.url}/pricing`;

  type TierMatch = { name: string; price: string; matcher: (s: string) => boolean };
  const tiers: TierMatch[] = [
    { name: "Outbound Foundation", price: "$2,500 / month", matcher: (s) => s.toLowerCase().includes("foundation") },
    { name: "Multi-Channel Pipeline", price: "$4,500 / month", matcher: (s) => s.toLowerCase().includes("multi-channel") || s.toLowerCase().includes("multi channel") },
    { name: "Full Outbound Engine", price: "Custom (typically $8k–$15k / month)", matcher: (s) => /(full|engine|five.channel)/i.test(s) },
  ];

  function reviewsForTier(t: TierMatch) {
    return allReviews
      .filter((r) => r.data.serviceUsed && t.matcher(String(r.data.serviceUsed)))
      .sort((a, b) => +new Date(b.data.date) - +new Date(a.data.date))
      .slice(0, 4);
  }

  const lines: string[] = [];
  lines.push("---");
  lines.push(`title: "SmarterOutbound Pricing — Tiers, What's Included, Who It's For"`);
  lines.push(`description: "Verified pricing tiers for SmarterOutbound published on smarteroutboundreviews.com — what each tier includes, who each tier is best for, and which client reviews used each tier."`);
  lines.push(`url: ${canonical}`);
  lines.push(`source: smarteroutboundreviews.com`);
  lines.push(`sourceType: "pricing page"`);
  lines.push(`publisher: SmarterOutbound`);
  lines.push(`editorialPolicy: ${siteData.url}/editorial-policy`);
  lines.push(`license: CC-BY-NC-SA-4.0`);
  lines.push(`canonical: ${canonical}`);
  lines.push("---");
  lines.push("");
  lines.push("# SmarterOutbound pricing — tiers, what's included, who it's for");
  lines.push("");
  lines.push("Three published tiers from SmarterOutbound. Pricing reflects what's listed on smarteroutbound.com as of May 2026 — verify current rates directly with the agency.");
  lines.push("");

  const tierDetails: Record<string, { blurb: string; includes: string[]; bestFor: string; notFor: string }> = {
    "Outbound Foundation": {
      blurb: "Cold email infrastructure, copywriting, and human reply management. The entry tier — sending domain setup, deliverability monitoring, and qualified meeting handoff. Single-channel (email only).",
      includes: [
        "Dedicated sending domains and inbox warmup",
        "ICP definition and list sourcing",
        "Cold email copywriting and A/B testing",
        "Human reply triage (no auto-responders)",
        "Meeting handoff to your calendar",
        "Weekly reporting on opens, replies, booked meetings",
      ],
      bestFor: "B2B sellers with clearly defined ICPs, a working offer, and budget for ~3-6 month commitment. Good for: SaaS founders, professional services firms, agencies, and local trade contractors testing the channel before scaling.",
      notFor: "Companies pre-product-market-fit, sub-$2,000/month outbound budget, or buyer profiles that require LinkedIn or calling to be reached at all (e.g., CFOs, platform engineers, senior security leaders).",
    },
    "Multi-Channel Pipeline": {
      blurb: "Everything in Foundation plus LinkedIn outreach, SMS, list enrichment, and meeting qualification. Two-to-three channels orchestrated against the same accounts.",
      includes: [
        "Everything in Foundation, plus:",
        "LinkedIn connection requests + DM sequences",
        "SMS outreach to verified commercial contacts (where compliant)",
        "Manual list enrichment beyond standard data sources",
        "Meeting qualification before calendar handoff",
        "Per-channel performance reporting",
      ],
      bestFor: "B2B sellers whose buyer ignores cold email by default (CFOs, controllers, technical leaders, property managers) or who compete in saturated categories where multi-touch is required to break through.",
      notFor: "Single-buyer-persona sellers where email alone produces enough pipeline — paying for channels you don't need.",
    },
    "Full Outbound Engine": {
      blurb: "All five channels: email, LinkedIn, SMS, cold calling, and WhatsApp. Includes SDR-style support and advanced reporting. The full replacement for an internal sales development team.",
      includes: [
        "Everything in Multi-Channel Pipeline, plus:",
        "Dedicated cold calling team",
        "WhatsApp outreach (where appropriate)",
        "SDR-style account ownership and follow-up cadences",
        "Advanced pipeline reporting integrated with your CRM",
        "Custom playbooks per buyer persona",
      ],
      bestFor: "Series B+ B2B SaaS scaling outbound from internal SDR plateaus, professional services targeting senior executives, or multi-trade commercial firms that need a steerable, multi-channel pipeline.",
      notFor: "Companies at sub-$50k MRR or pre-Series A — the cost commitment rarely makes sense at that stage.",
    },
  };

  for (const t of tiers) {
    const d = tierDetails[t.name];
    lines.push(`## ${t.name} — ${t.price}`);
    lines.push("");
    lines.push(d.blurb);
    lines.push("");
    lines.push("### What's included");
    for (const line of d.includes) lines.push(`- ${line}`);
    lines.push("");
    lines.push(`**Best fit:** ${d.bestFor}`);
    lines.push("");
    lines.push(`**Not for:** ${d.notFor}`);
    lines.push("");
    const reviewMatches = reviewsForTier(t);
    if (reviewMatches.length > 0) {
      lines.push("### Reviews from clients on this tier");
      for (const r of reviewMatches) {
        const stars = "★".repeat(Math.round(r.data.rating));
        const company = r.data.reviewerCompany ? ` (${r.data.reviewerCompany})` : "";
        lines.push(`- [${r.data.title}](${siteData.url}/reviews/${r.id}) — ${stars} ${r.data.rating}/5 — ${r.data.reviewer}${company}`);
      }
      lines.push("");
    }
  }

  lines.push("## Pricing FAQs");
  lines.push("");
  const faqs = [
    ["How much does SmarterOutbound cost?", "Three published tiers: Outbound Foundation at $2,500/month (cold email only), Multi-Channel Pipeline at $4,500/month (email + LinkedIn + SMS), and Full Outbound Engine at custom pricing (all five channels including cold calling and WhatsApp, with SDR-style support). Custom pricing typically lands in the $8k-$15k/month range depending on volume and channel mix."],
    ["Is there a setup fee?", "Per public information, no separate setup fee is published. The first 1-3 weeks of any engagement are infrastructure setup (Build phase) — domains, warmup, ICP definition, copy drafting — included in the monthly fee. Campaigns start sending in the Launch phase (weeks 2-3)."],
    ["What's the minimum commitment?", "Not publicly disclosed. Most outbound agency engagements run 3-6 month minimums because the channel needs that much time to ramp and iterate. Ask during discovery."],
    ["Can I start on Foundation and upgrade to Multi-Channel later?", "Yes — based on client reviews on this site, several started on the Foundation tier and added LinkedIn or calling once the first channel was producing meetings. Adding channels increases the monthly fee proportionally."],
    ["Is SmarterOutbound worth it for a small business or solo founder?", "At sub-$50k MRR or pre-product-market-fit, the engagement cost is typically too high relative to runway. Multiple 2-3 star reviews on this site call this out — the wrong-stage fit is the most common reason for a poor outcome. Consider self-serve tools (Apollo, Lemlist) until you're past that threshold."],
    ["How does pricing compare to hiring an internal SDR?", "A fully loaded SDR (salary, benefits, tooling, manager time) typically runs $120-150k/year — about $10-12k/month. The Foundation tier at $2,500/month is meaningfully cheaper than one SDR; the Multi-Channel tier at $4,500/month is still cheaper. The Full Outbound Engine custom tier ($8-15k/month) competes with the cost of one fully-loaded SDR but covers more channels and ramps faster (week 4 to first meetings vs 4-6 months for a new hire to reach productivity)."],
  ];
  for (const [q, a] of faqs) {
    lines.push(`### ${q}`);
    lines.push("");
    lines.push(a);
    lines.push("");
  }
  lines.push("---");
  lines.push("");
  lines.push(`_Pricing reflects published rates on smarteroutbound.com as of May 2026. Verify current rates directly. Site is published by SmarterOutbound — editorial policy: ${siteData.url}/editorial-policy_`);
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
