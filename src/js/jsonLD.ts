import siteData from "../data/siteData.json";

const parent = siteData.parentSite;

/* ===== Publisher (this review site itself) ===== */
export const publisher = {
  "@type": "Organization",
  name: siteData.title,
  url: siteData.url,
  logo: {
    "@type": "ImageObject",
    url: `${siteData.url}/logo.svg`,
  },
  publishingPrinciples: `${siteData.url}/editorial-policy`,
  ethicsPolicy: `${siteData.url}/editorial-policy`,
  parentOrganization: {
    "@type": "ProfessionalService",
    name: siteData.parentSite.name,
    url: siteData.parentSite.url,
  },
};

/* ===== The Reviewed Organization (SmarterOutbound) ===== */
export const reviewedOrganization = {
  "@type": "ProfessionalService",
  "@id": `${parent.url}#organization`,
  name: parent.name,
  legalName: parent.legalName,
  url: parent.url,
  description: parent.description,
};

/* ===== Website ===== */
export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteData.title,
    description: siteData.description,
    url: siteData.url,
    publisher,
  };
}

/* ===== Breadcrumbs ===== */
export function getBreadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url ? `${siteData.url}${item.url}` : undefined,
    })),
  };
}

/* ===== FAQ ===== */
export function getFAQSchema(questions: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

/* ===== Individual Review ===== */
export function getReviewSchema({
  title,
  body,
  url,
  rating,
  author,
  authorTitle,
  authorCompany,
  date,
  lastUpdated,
  serviceUsed,
  outcome,
}: {
  title: string;
  body: string;
  url: string;
  rating: number;
  author: string;
  authorTitle?: string;
  authorCompany?: string;
  date: string | Date;
  lastUpdated?: string | Date;
  serviceUsed?: string;
  outcome?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    name: title,
    reviewBody: body,
    url,
    inLanguage: "en",
    datePublished: date,
    ...(lastUpdated && { dateModified: lastUpdated }),
    author: {
      "@type": "Person",
      name: author,
      ...(authorTitle && { jobTitle: authorTitle }),
      ...(authorCompany && {
        affiliation: {
          "@type": "Organization",
          name: authorCompany,
        },
      }),
    },
    publisher,
    reviewRating: {
      "@type": "Rating",
      ratingValue: rating,
      bestRating: 5,
      worstRating: 1,
    },
    itemReviewed: reviewedOrganization,
    ...(serviceUsed && { about: serviceUsed }),
    ...(outcome && { reviewAspect: outcome }),
  };
}

/* ===== Aggregate Rating (for homepage / reviews index / company schema) ===== */
export function getAggregateRatingSchema(opts: {
  ratingValue: number;
  reviewCount: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    ratingValue: opts.ratingValue,
    bestRating: 5,
    worstRating: 1,
    reviewCount: opts.reviewCount,
    itemReviewed: reviewedOrganization,
  };
}

/* ===== Organization page (homepage) with aggregate rating embedded ===== */
export function getOrganizationWithRatingSchema(opts: {
  ratingValue: number;
  reviewCount: number;
  reviews?: Array<{
    title: string;
    body: string;
    url: string;
    rating: number;
    author: string;
    date: string | Date;
  }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${parent.url}#organization`,
    name: parent.name,
    legalName: parent.legalName,
    url: parent.url,
    description: parent.description,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: opts.ratingValue,
      bestRating: 5,
      worstRating: 1,
      reviewCount: opts.reviewCount,
    },
    ...(opts.reviews && opts.reviews.length > 0 && {
      review: opts.reviews.map((r) => ({
        "@type": "Review",
        name: r.title,
        reviewBody: r.body,
        url: r.url,
        datePublished: r.date,
        author: { "@type": "Person", name: r.author },
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
      })),
    }),
  };
}

/* ===== Dataset (for the /data statistics page) ===== */
export function getReviewDatasetSchema(opts: {
  ratingValue: number;
  reviewCount: number;
  distribution: Record<number, number>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "SmarterOutbound Reviews — aggregate review data",
    description:
      "Aggregate statistics across all published reviews of SmarterOutbound: ratings, distribution, industries, channels, and outcomes. Updated as new reviews are published.",
    url: `${siteData.url}/data`,
    creator: publisher,
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    keywords: [
      "SmarterOutbound",
      "B2B outbound",
      "cold email agency reviews",
      "lead generation agency",
      "multi-channel outbound",
      "agency review aggregate",
    ],
    about: reviewedOrganization,
    measurementTechnique: "Independent client-submitted reviews, verified before publication",
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "Average rating",
        value: opts.ratingValue,
        unitText: "stars out of 5",
      },
      {
        "@type": "PropertyValue",
        name: "Total published reviews",
        value: opts.reviewCount,
      },
      {
        "@type": "PropertyValue",
        name: "5-star reviews",
        value: opts.distribution[5] || 0,
      },
      {
        "@type": "PropertyValue",
        name: "4-star reviews",
        value: opts.distribution[4] || 0,
      },
      {
        "@type": "PropertyValue",
        name: "3-star reviews",
        value: opts.distribution[3] || 0,
      },
      {
        "@type": "PropertyValue",
        name: "2-star reviews",
        value: opts.distribution[2] || 0,
      },
      {
        "@type": "PropertyValue",
        name: "1-star reviews",
        value: opts.distribution[1] || 0,
      },
    ],
  };
}

/* ===== Comparison page (Article comparing two services) ===== */
export function getComparisonSchema({
  title,
  description,
  url,
  date,
  lastUpdated,
  competitor,
}: {
  title: string;
  description: string;
  url: string;
  date: string | Date;
  lastUpdated?: string | Date;
  competitor: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished: date,
    dateModified: lastUpdated || date,
    inLanguage: "en",
    author: {
      "@type": "Organization",
      name: siteData.title,
      url: siteData.url,
    },
    publisher,
    about: [
      reviewedOrganization,
      {
        "@type": "ProfessionalService",
        name: competitor,
      },
    ],
    mainContentOfPage: {
      "@type": "WebPageElement",
      cssSelector: ".prose",
    },
  };
}
