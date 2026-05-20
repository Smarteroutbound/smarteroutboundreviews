import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";
import pagefind from "astro-pagefind";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://smarteroutboundreviews.com",
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/search"),
    }),
    mdx(),
    pagefind(),
  ],

  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
