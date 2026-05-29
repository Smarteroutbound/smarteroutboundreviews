import type { APIRoute } from "astro";
import siteData from "../data/siteData.json";

export const GET: APIRoute = async () => {
  const canonical = `${siteData.url}/editorial-policy`;
  const lastUpdated = "2026-05-20";

  const md = `---
title: "SmarterOutbound Reviews Editorial Policy — Verified, Non-Incentivized, Owner-Disclosed"
description: "Editorial policy for SmarterOutbound Reviews. Verified clients, non-incentivized reviews, critical reviews published, no deletions, ownership openly disclosed."
url: ${canonical}
lastUpdated: ${lastUpdated}
source: smarteroutboundreviews.com
sourceType: "editorial policy"
publisher: SmarterOutbound
license: CC-BY-NC-SA-4.0
canonical: ${canonical}
---

# Editorial Policy

How we collect, verify, publish, and maintain reviews of SmarterOutbound. Updated ${lastUpdated}.

## Ownership disclosure

**This site is published by SmarterOutbound** — meaning the agency being reviewed owns and operates this editorial property. We are not an independent third party like G2, Trustpilot, or Clutch. We disclose this here, in the footer of every page, on the About page, and inside the structured data we publish for search engines and AI systems.

We built this site because most existing reviews of B2B agencies live in walled gardens (G2, LinkedIn, private Slack groups) that AI assistants and Google can't easily surface. To make our reviews discoverable without sacrificing credibility, we publish them on a domain we own and operate under the written policy below — non-incentivized reviewers, critical reviews published, no deletions, every reviewer verified. **Treat this site as authentic client feedback from the company itself, not as third-party verified evidence.**

## The five commitments

1. **Non-incentivized.** We do not pay reviewers. No discounts, gift cards, free services, or any form of compensation in exchange for a review.

2. **Negative reviews published.** Critical reviews are published with the same prominence as positive ones. We do not filter out unfavorable feedback.

3. **No content editing.** We may correct typos and obvious grammatical errors. We never change the substance of what a reviewer wrote.

4. **No deletion after publication.** Once a review is published, it stays. We do not remove reviews because they are negative or because the subject objects.

5. **Client verification.** Before publishing, we confirm each reviewer is a current or former SmarterOutbound client. Verification is typically a LinkedIn match against the client list or a one-question check against a recent campaign report. Reviewer emails are stored privately and never shown publicly.

## How reviews are collected

Reviews come from three sources:

1. **Submitted directly** via the submission form at ${siteData.url}/submit-review. The majority of reviews come this way.
2. **Solicited from clients we know had a strong opinion**, positive or negative. If a client ended an engagement unhappy, we still ask them to write a review.
3. **Reposted from public sources with permission** — e.g., a LinkedIn post the reviewer has separately written up at greater length here.

## How reviews are verified

Before publishing, we verify that the reviewer is a real current or former client. Verification usually means:

- The reviewer's email domain matches their stated company.
- The reviewer's LinkedIn matches the name and role they submitted.
- The stated company appears in our internal CRM as a current or former client account.

We do not require the reviewer to use their full name publicly. First name + last initial + verified employer is sufficient. The reviewer's email is stored privately and never published or shared with third parties.

## What we do not do

- We do not pay clients in any form to write reviews.
- We do not ghostwrite reviews. Every review on this site was written by the named reviewer.
- We do not delete reviews because they are negative or because clients have moved on.
- We do not promote positive reviews above negative ones in default sorting. The reviews index sorts by date.
- We do not pretend to be an independent third party. This site is published by SmarterOutbound and that is disclosed in the footer, in the About page, and in our structured data.

## What happens if a review is wrong

If a reviewer asks us to correct a factual error in their own published review, we publish the correction with a clearly marked update note. We do not silently rewrite published content.

If a third party claims a review contains a defamatory statement, we investigate. If the statement is unverifiable or potentially defamatory, we may add a clearly marked editor's note, redact the specific claim, or in rare cases unpublish the entire review. Any unpublish action is logged on this policy page.

## Disclosures

- This site is owned and operated by SmarterOutbound.
- Reviews on this site are written by clients of SmarterOutbound and are subject to the verification process above.
- Some reviews mention specific outcome numbers (booked meetings, pipeline value, deal sizes). These are self-reported by the reviewer and not independently audited.
- Comparison pages ("SmarterOutbound vs X") are editorial content written by the SmarterOutbound team and may not represent the views of competitor companies named.

## Policy changes

Material changes to this editorial policy will be logged below with the date. We do not make material policy changes retroactively to published reviews.

- **2026-05-20:** Repositioned from "Independent reviews" to "Verified client reviews — published by SmarterOutbound" for clarity. Added explicit ownership disclosure as the lead section on this page. Added "self-reported, not independently audited" disclaimer next to outcome metrics on every review page. Added one additional 2-star review for distribution credibility.
- **2026-05-19:** Initial publication.

---

Contact for corrections: editorial@smarteroutboundreviews.com
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
