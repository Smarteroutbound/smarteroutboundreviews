export interface NavItem {
  name: string;
  path: string;
  external?: boolean;
}

export const mainNav: NavItem[] = [
  { name: "Reviews", path: "/reviews" },
  { name: "vs Alternatives", path: "/vs" },
  { name: "FAQ", path: "/faq" },
  { name: "Submit a Review", path: "/submit-review" },
  { name: "About", path: "/about" },
];

export const footerSections = {
  explore: [
    { name: "All Reviews", path: "/reviews" },
    { name: "Comparisons", path: "/vs" },
    { name: "FAQ", path: "/faq" },
    { name: "Submit a Review", path: "/submit-review" },
  ],
  trust: [
    { name: "Editorial Policy", path: "/editorial-policy" },
    { name: "Aggregate Data", path: "/data" },
    { name: "About this site", path: "/about" },
    { name: "Sitemap", path: "/sitemap-index.xml" },
  ],
  parent: [
    { name: "SmarterOutbound.com", path: "https://smarteroutbound.com", external: true },
    { name: "Get a quote", path: "https://smarteroutbound.com/#contact", external: true },
  ],
};
