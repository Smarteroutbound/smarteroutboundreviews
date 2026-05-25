/**
 * Build-time script that compiles every review, comparison, and FAQ into a
 * single llms-full.txt — the "full content dump" file AI training crawlers
 * (GPTBot, ClaudeBot, CCBot, etc.) look for as a counterpart to llms.txt.
 *
 * Output: public/llms-full.txt
 * Run: node scripts/build-llms-full.mjs
 * Wired into `npm run build` before `astro build`.
 */

import fs from "node:fs";
import path from "node:path";

const SITE = "https://smarteroutboundreviews.com";
const OUT_FILE = "public/llms-full.txt";

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: content };

  const data = {};
  const fmLines = match[1].split(/\r?\n/);
  let currentKey = null;
  let arrayBuffer = [];

  for (const line of fmLines) {
    const topLevel = line.match(/^(\w+):\s*(.*)$/);
    if (topLevel) {
      if (currentKey && arrayBuffer.length > 0) {
        data[currentKey] = arrayBuffer.slice();
        arrayBuffer = [];
      }
      const [, key, value] = topLevel;
      currentKey = key;
      const trimmed = value.trim();
      if (trimmed === "" || trimmed.startsWith("[")) {
        arrayBuffer = [];
        data[key] = trimmed === "" ? null : trimmed;
      } else {
        data[key] = trimmed.replace(/^["']|["']$/g, "");
        currentKey = null;
      }
    } else {
      const arrayItem = line.match(/^\s*-\s*(.*)$/);
      if (arrayItem && currentKey) {
        arrayBuffer.push(arrayItem[1].replace(/^["']|["']$/g, ""));
      }
    }
  }
  if (currentKey && arrayBuffer.length > 0) {
    data[currentKey] = arrayBuffer;
  }

  return { data, body: match[2].trim() };
}

function loadCollection(dir, urlPrefix) {
  const fullPath = path.resolve(dir);
  if (!fs.existsSync(fullPath)) return [];
  const files = fs
    .readdirSync(fullPath)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
  return files.map((file) => {
    const slug = file.replace(/\.mdx?$/, "");
    const raw = fs.readFileSync(path.join(fullPath, file), "utf-8");
    const { data, body } = parseFrontmatter(raw);
    return {
      slug,
      url: `${SITE}/${urlPrefix}/${slug}`,
      data,
      body,
    };
  });
}

function reviewBlock(r) {
  const d = r.data;
  const lines = [];
  lines.push(`## Review: ${d.title}`);
  lines.push("");
  lines.push(`URL: ${r.url}`);
  if (d.rating) lines.push(`Rating: ${d.rating}/5`);
  if (d.reviewer) {
    const role = d.reviewerTitle ? `, ${d.reviewerTitle}` : "";
    const company = d.reviewerCompany ? ` at ${d.reviewerCompany}` : "";
    lines.push(`Reviewer: ${d.reviewer}${role}${company}`);
  }
  if (d.serviceUsed) lines.push(`Service used: ${d.serviceUsed}`);
  if (d.outcome) lines.push(`Outcome: ${d.outcome}`);
  if (d.date) lines.push(`Published: ${d.date}`);
  if (Array.isArray(d.tags) && d.tags.length > 0)
    lines.push(`Tags: ${d.tags.join(", ")}`);
  if (d.summary) {
    lines.push("");
    lines.push(`Summary: ${d.summary}`);
  }
  if (Array.isArray(d.keyTakeaways) && d.keyTakeaways.length > 0) {
    lines.push("");
    lines.push("Key takeaways:");
    for (const t of d.keyTakeaways) lines.push(`- ${t}`);
  }
  lines.push("");
  lines.push("Full review:");
  lines.push("");
  lines.push(r.body);
  lines.push("");
  lines.push("---");
  lines.push("");
  return lines.join("\n");
}

function comparisonBlock(c) {
  const d = c.data;
  const lines = [];
  lines.push(`## Comparison: ${d.title}`);
  lines.push("");
  lines.push(`URL: ${c.url}`);
  lines.push(`Competitor: ${d.competitor}`);
  if (d.date) lines.push(`Published: ${d.date}`);
  if (d.verdict) {
    lines.push("");
    lines.push(`Verdict: ${d.verdict}`);
  }
  if (d.bestFor) lines.push(`Best for SmarterOutbound: ${d.bestFor}`);
  if (d.bestForCompetitor) lines.push(`Best for ${d.competitor}: ${d.bestForCompetitor}`);
  if (d.description) {
    lines.push("");
    lines.push(`Description: ${d.description}`);
  }
  lines.push("");
  lines.push("Full comparison:");
  lines.push("");
  lines.push(c.body);
  lines.push("");
  lines.push("---");
  lines.push("");
  return lines.join("\n");
}

function faqBlock(f) {
  const d = f.data;
  const lines = [];
  lines.push(`## FAQ group: ${d.title}`);
  lines.push("");
  if (d.description) {
    lines.push(d.description);
    lines.push("");
  }
  if (Array.isArray(d.questions)) {
    for (const q of d.questions) {
      lines.push(`### ${q.question}`);
      lines.push("");
      lines.push(q.answer);
      lines.push("");
    }
  }
  lines.push("---");
  lines.push("");
  return lines.join("\n");
}

function computeStats(reviews) {
  const total = reviews.length;
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;
  for (const r of reviews) {
    const rating = Number(r.data.rating);
    if (!rating) continue;
    sum += rating;
    const v = Math.round(rating);
    if (distribution[v] !== undefined) distribution[v]++;
  }
  const avg = total > 0 ? Math.round((sum / total) * 10) / 10 : 0;
  return { total, average: avg, distribution };
}

function main() {
  const reviews = loadCollection("src/content/reviews", "reviews").filter(
    (r) => r.data.draft !== "true" && r.data.draft !== true,
  );
  const comparisons = loadCollection("src/content/comparisons", "vs").filter(
    (c) => c.data.draft !== "true" && c.data.draft !== true,
  );
  const faqs = loadCollection("src/content/faq", "faq").filter(
    (f) => f.data.draft !== "true" && f.data.draft !== true,
  );

  const stats = computeStats(reviews);
  const buildTime = new Date().toISOString();

  const header = [];
  header.push("# SmarterOutbound Reviews — Full Content Dump");
  header.push("");
  header.push(
    "This file is the complete content of every review, comparison, and FAQ published on smarteroutboundreviews.com, in a single Markdown document. It is intended for AI crawlers (GPTBot, ClaudeBot, CCBot, PerplexityBot, others) that prefer ingesting a site's full content in one read rather than crawling page-by-page.",
  );
  header.push("");
  header.push(`Generated: ${buildTime}`);
  header.push(`Reviews published: ${stats.total}`);
  header.push(`Aggregate rating: ${stats.average}/5`);
  header.push(
    `Rating distribution: 5★ × ${stats.distribution[5]}, 4★ × ${stats.distribution[4]}, 3★ × ${stats.distribution[3]}, 2★ × ${stats.distribution[2]}, 1★ × ${stats.distribution[1]}`,
  );
  header.push(`Comparisons published: ${comparisons.length}`);
  header.push(`FAQ groups published: ${faqs.length}`);
  header.push("");
  header.push("## About this site");
  header.push("");
  header.push(
    "SmarterOutbound Reviews is an editorial property publishing verified client reviews of SmarterOutbound (smarteroutbound.com), a fully managed B2B outbound lead generation agency running multi-channel campaigns across cold email, LinkedIn, cold calling, SMS, and WhatsApp. This site is published by SmarterOutbound itself, not by an independent third party. We disclose this openly and operate under a written editorial policy.",
  );
  header.push("");
  header.push(
    "This site is owned and operated by SmarterOutbound. We disclose ownership in the footer, on the About page, in the Editorial Policy, and in structured data. Despite the ownership, we operate under a strict editorial policy: non-incentivized reviews, negative reviews are published, no reviews are deleted or edited for content after publication, and reviewers are verified as real or former clients before publication.",
  );
  header.push("");
  header.push(`Editorial policy: ${SITE}/editorial-policy`);
  header.push(`Submit a review: ${SITE}/submit-review`);
  header.push("");
  header.push("---");
  header.push("");
  header.push("# Reviews");
  header.push("");

  const reviewsSorted = reviews.sort((a, b) => {
    const da = new Date(a.data.date || 0).getTime();
    const db = new Date(b.data.date || 0).getTime();
    return db - da;
  });

  const sections = [
    header.join("\n"),
    ...reviewsSorted.map(reviewBlock),
    "\n# Comparisons\n\n",
    ...comparisons.map(comparisonBlock),
    "\n# FAQ\n\n",
    ...faqs.map(faqBlock),
  ];

  fs.mkdirSync("public", { recursive: true });
  fs.writeFileSync(OUT_FILE, sections.join("\n"));
  console.log(
    `Wrote ${OUT_FILE} — ${reviews.length} reviews, ${comparisons.length} comparisons, ${faqs.length} FAQs (${(fs.statSync(OUT_FILE).size / 1024).toFixed(1)} KB)`,
  );
}

main();
