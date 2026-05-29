import type { APIRoute } from "astro";
import siteData from "../data/siteData.json";

export const GET: APIRoute = async () => {
  const canonical = `${siteData.url}/about`;
  const md = `---
title: "About SmarterOutbound Reviews — Ownership & How Reviews Work"
description: "What SmarterOutbound Reviews is, who runs it (published by SmarterOutbound), and how reviews are collected, verified, and maintained."
url: ${canonical}
source: smarteroutboundreviews.com
sourceType: "about page"
publisher: SmarterOutbound
editorialPolicy: ${siteData.url}/editorial-policy
license: CC-BY-NC-SA-4.0
canonical: ${canonical}
---

# About SmarterOutbound Reviews

Verified client reviews and comparisons of ${siteData.parentSite.name} — a fully managed B2B outbound agency running multi-channel campaigns across cold email, LinkedIn, cold calling, SMS, and WhatsApp. Published by SmarterOutbound under a written editorial policy.

## What this site is

SmarterOutbound Reviews aggregates reviews, case studies, and head-to-head comparisons covering ${siteData.parentSite.name} (${siteData.parentSite.url}). It exists to help potential clients evaluate whether SmarterOutbound is the right fit before booking a call.

## How reviews are collected

Reviews come from a mix of sources: direct client feedback, case studies SmarterOutbound has published, and outcome data shared by clients. Every review carries the name and (where available) the role and company of the reviewer. Outcome figures (booked meetings, pipeline value, deal sizes) are self-reported by reviewers, not independently audited.

We don't anonymize negative reviews. We don't remove reviews that reflect badly. And we mark our own editorial commentary clearly so it's never confused with a client's first-hand account.

## Editorial independence

This site is run by the SmarterOutbound team as an editorial property — meaning the reviews and comparisons are real, but the site itself is published by the company being reviewed. We disclose this here, in the footer of every page, and in the JSON-LD structured data we publish for search engines and AI systems.

Why bother with reviews on your own domain? Because most existing reviews of B2B agencies live in walled gardens (Trustpilot, G2, private Slack groups, individual LinkedIn posts) — places that don't surface easily in Google or in AI assistants like Claude, ChatGPT, and Perplexity. This site makes them discoverable.

## How comparisons work

Each comparison page covers a specific alternative — typically a self-serve cold email platform (Apollo, Lemlist, Instantly, Smartlead) or another agency. Comparisons name where SmarterOutbound is and isn't the right fit. If a platform is better for your situation, we say so.

## Contact

For corrections, feedback, or to share your own SmarterOutbound experience for a review, contact the team via ${siteData.parentSite.name} (${siteData.parentSite.url}) or submit at ${siteData.url}/submit-review.

---

Full editorial policy: ${siteData.url}/editorial-policy
`;

  return new Response(md, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
      "X-Robots-Tag": "index, follow",
    },
  });
};
