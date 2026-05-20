/**
 * Build-time script that generates a unique 1200x630 OG image for every
 * content-collection page. Satori (SVG generation) + Sharp (PNG conversion).
 *
 * Run: node scripts/generate-og-images.mjs
 * Wired into `npm run build` ahead of `astro build`.
 */

import satori from "satori";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = "public/og";

// Indigo/orange palette matching site theme
const COLORS = {
  bg1: "#eef2ff",
  bg2: "#fff7ed",
  accent1: "#4f46e5",
  accent2: "#f97316",
  text: "#111827",
  muted: "#6b7280",
  light: "#9ca3af",
};

const TYPE_BADGES = {
  reviews: { label: "Review", color: "#4f46e5" },
  comparisons: { label: "Comparison", color: "#ea580c" },
  faq: { label: "FAQ", color: "#6b7280" },
};

async function loadFont() {
  const localFont = path.resolve("public/fonts/Inter-Bold.ttf");
  if (fs.existsSync(localFont)) {
    return fs.readFileSync(localFont);
  }
  const res = await fetch(
    "https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap",
  );
  const css = await res.text();
  const fontUrl = css.match(/url\(([^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error("Could not extract font URL from Google Fonts CSS");
  const fontRes = await fetch(fontUrl);
  return Buffer.from(await fontRes.arrayBuffer());
}

function createOgMarkup(title, type, subtitle) {
  const badge = TYPE_BADGES[type] || { label: "Page", color: "#6b7280" };
  const displayTitle = title.length > 70 ? title.slice(0, 67) + "..." : title;

  return {
    type: "div",
    props: {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 80px",
        background: `linear-gradient(135deg, ${COLORS.bg1}, ${COLORS.bg2})`,
        fontFamily: "Inter",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: `linear-gradient(to right, ${COLORS.accent1}, ${COLORS.accent2})`,
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              flex: 1,
              justifyContent: "center",
            },
            children: [
              {
                type: "div",
                props: {
                  style: { display: "flex" },
                  children: [
                    {
                      type: "span",
                      props: {
                        style: {
                          fontSize: "16px",
                          fontWeight: 700,
                          color: badge.color,
                          padding: "6px 16px",
                          borderRadius: "20px",
                          backgroundColor: `${badge.color}15`,
                          letterSpacing: "0.5px",
                        },
                        children: badge.label,
                      },
                    },
                  ],
                },
              },
              {
                type: "h1",
                props: {
                  style: {
                    fontSize: displayTitle.length > 50 ? "40px" : "48px",
                    fontWeight: 700,
                    color: COLORS.text,
                    lineHeight: 1.2,
                    margin: 0,
                  },
                  children: displayTitle,
                },
              },
              subtitle
                ? {
                    type: "p",
                    props: {
                      style: {
                        fontSize: "20px",
                        color: COLORS.muted,
                        margin: 0,
                        lineHeight: 1.4,
                      },
                      children:
                        subtitle.length > 120
                          ? subtitle.slice(0, 117) + "..."
                          : subtitle,
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            },
            children: [
              {
                type: "span",
                props: {
                  style: {
                    fontSize: "18px",
                    fontWeight: 700,
                    color: COLORS.light,
                  },
                  children: "smarteroutboundreviews.com",
                },
              },
              {
                type: "span",
                props: {
                  style: {
                    fontSize: "14px",
                    color: COLORS.accent1,
                    fontWeight: 700,
                    letterSpacing: "1px",
                  },
                  children: "Independent reviews of SmarterOutbound",
                },
              },
            ],
          },
        },
      ],
    },
  };
}

function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*"?([^"]*)"?\s*$/);
    if (kv) fm[kv[1]] = kv[2];
  }
  return fm;
}

async function main() {
  const fontData = await loadFont();
  const fonts = [{ name: "Inter", data: fontData, weight: 700, style: "normal" }];

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const collections = [
    { dir: "src/content/reviews", type: "reviews", urlPrefix: "reviews" },
    { dir: "src/content/comparisons", type: "comparisons", urlPrefix: "vs" },
    { dir: "src/content/faq", type: "faq", urlPrefix: "faq" },
  ];

  let count = 0;

  for (const collection of collections) {
    const dirPath = path.resolve(collection.dir);
    if (!fs.existsSync(dirPath)) continue;

    const collectionOut = path.join(OUT_DIR, collection.urlPrefix);
    fs.mkdirSync(collectionOut, { recursive: true });

    const files = fs
      .readdirSync(dirPath)
      .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

    for (const file of files) {
      const slug = file.replace(/\.mdx?$/, "");
      const outPath = path.join(collectionOut, `${slug}.png`);

      if (fs.existsSync(outPath)) continue;

      const content = fs.readFileSync(path.join(dirPath, file), "utf-8");
      const fm = extractFrontmatter(content);

      const title = fm.title || slug;
      const subtitle = fm.summary || fm.description || "";

      const markup = createOgMarkup(title, collection.type, subtitle);

      const svg = await satori(markup, { width: 1200, height: 630, fonts });
      await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(outPath);
      count++;
    }
  }

  console.log(`Generated ${count} OG images in ${OUT_DIR}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
