export function formatDate(date: Date | string | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b, 0);
  return Math.round((sum / numbers.length) * 10) / 10;
}

/**
 * Strip basic Markdown formatting and return a clean text snippet up to `max` chars.
 * Used to populate Schema.org reviewBody with crawler-friendly plain text.
 */
export function plainTextSnippet(md: string, max = 500): string {
  return md
    .replace(/^---[\s\S]*?---\s*/m, "") // frontmatter if present
    .replace(/^#+\s+.*$/gm, "") // headings
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → just text
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1") // italic
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/^>\s+/gm, "") // blockquote markers
    .replace(/^\s*[-*]\s+/gm, "") // list bullets
    .replace(/\n{2,}/g, " ") // paragraph breaks
    .replace(/\n/g, " ") // single newlines
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}
