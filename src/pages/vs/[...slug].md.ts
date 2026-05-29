import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { buildMarkdownResponse } from "../../js/markdown-export";

export const getStaticPaths: GetStaticPaths = async () => {
  let entries: any[] = [];
  try {
    entries = await getCollection("comparisons");
  } catch {
    return [];
  }
  return entries
    .filter((entry: any) => !entry.data.draft)
    .map((entry: any) => ({
      params: { slug: entry.id },
      props: { entry },
    }));
};

export const GET: APIRoute = async ({ props }) => {
  const entry = (props as any).entry;
  if (!entry) return new Response("Not found", { status: 404 });
  return buildMarkdownResponse({
    entry,
    pathPrefix: "/vs",
    sourceLabel: "comparison",
  });
};
