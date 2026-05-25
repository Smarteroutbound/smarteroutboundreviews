// Industry hub configuration — drives /industries/[slug] pages.
// Each entry creates one landing page that ranks for "[industry] B2B outbound" queries
// and aggregates the reviews from that industry's clients.

export interface Industry {
  slug: string;
  name: string;
  shortName: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  /** Lede paragraph rendered under the H1. Plain text. */
  intro: string;
  /** Tags from review frontmatter — a review qualifies if it has ANY matching tag (lowercase). */
  tagFilters: string[];
  /** Slugs to optionally bias to top of the list (featured for this hub). */
  featuredReviewSlugs?: string[];
  /** Which SmarterOutbound channel(s) this industry primarily uses. */
  channelFocus: string;
  /** Short answer to "Is SmarterOutbound the right fit for [industry]?" */
  bestFor: string;
  /** Which comparison pages to link from this hub. */
  relatedComparisonSlugs?: string[];
  /** Sort order in the rollup hub. Lower = first. */
  sortOrder: number;
}

export const industries: Industry[] = [
  {
    slug: "paving-contractors",
    name: "Paving Contractors",
    shortName: "Paving",
    h1: "SmarterOutbound Reviews from Paving Contractors",
    metaTitle: "Paving Contractor Reviews of SmarterOutbound — SMS Lead Gen for Trades",
    metaDescription:
      "Reviews from paving and sealcoating contractors who used SmarterOutbound's local SMS outreach to reach commercial property managers, HOAs, and retail centers. Coverage across Mississippi Gulf Coast, Twin Cities, Kansas City metro, SoCal, Maryland, and the SF Bay Area.",
    intro:
      "Paving and sealcoating contractors typically can't reach commercial property managers through Google Ads or LinkedIn — those buyers live on their phones managing multiple properties. SmarterOutbound's SMS-led local outreach is the channel that consistently produces commercial paving leads across regional markets. These reviews come from owner-operators who use the service.",
    tagFilters: ["paving", "sealcoating"],
    featuredReviewSlugs: [
      "brent-lma-paving-sealcoating",
      "fernando-ib-paving-southern-california",
      "craig-czars-of-tar-twin-cities",
      "danny-advantage-asphalt-maryland",
    ],
    channelFocus: "Local SMS outreach to commercial property managers, HOAs, and retail center owners",
    bestFor:
      "Paving contractors in regional metro markets whose commercial pipeline is referral-dependent and want a reliable, channel-compliant way to reach property managers at scale.",
    relatedComparisonSlugs: [],
    sortOrder: 1,
  },
  {
    slug: "trades-and-local-services",
    name: "Trades & Local Commercial Services",
    shortName: "Trades & local",
    h1: "SmarterOutbound Reviews from Local Trade & Commercial Service Contractors",
    metaTitle: "Trade & Local Commercial Service Reviews — SmarterOutbound SMS Outreach",
    metaDescription:
      "Reviews from paving, HVAC, commercial cleaning, tree service, restoration, equipment rental, and other local trade contractors who used SmarterOutbound's SMS and multi-channel outreach to reach commercial property managers and facility leads in their service area.",
    intro:
      "Local trade contractors — paving, HVAC, commercial cleaning, tree service, restoration, equipment rental — share the same lead generation problem: their best buyers (property managers, facility leads, HOA boards) don't respond to digital ads or cold email. SMS and multi-channel outbound to verified commercial contacts is the channel that works for this category. Below: reviews from trade contractors across the US who use SmarterOutbound for this exact purpose.",
    tagFilters: [
      "paving",
      "sealcoating",
      "hvac",
      "commercial-cleaning",
      "janitorial",
      "tree-service",
      "arborist",
      "restoration",
      "equipment-rental",
      "construction",
      "commercial-roofing",
      "construction-tech",
    ],
    channelFocus: "Local SMS, cold calling, and multi-channel outreach to commercial property managers and facility decision-makers",
    bestFor:
      "Commercial trade and local-service contractors whose buyers are property managers, facility leads, or commercial owner-operators in defined regional markets.",
    relatedComparisonSlugs: [],
    sortOrder: 2,
  },
  {
    slug: "hvac-contractors",
    name: "HVAC Contractors",
    shortName: "HVAC",
    h1: "SmarterOutbound Reviews from Commercial HVAC Contractors",
    metaTitle: "Commercial HVAC Contractor Reviews of SmarterOutbound — SMS to Property Managers",
    metaDescription:
      "Reviews from commercial HVAC service contractors who used SmarterOutbound's local SMS outreach to reach property managers, facility leads, and commercial building owners. Direct contractor experience, not vendor marketing.",
    intro:
      "Commercial HVAC service contractors rely on relationships with property managers and facility leads who already have a preferred vendor. Breaking into those vendor lists typically requires a referral cycle that takes years. SMS outreach to verified commercial contacts is the fastest channel for new commercial HVAC contracts. These reviews come from HVAC owners who run this play.",
    tagFilters: ["hvac"],
    featuredReviewSlugs: ["commercial-hvac-local-sms"],
    channelFocus: "Local SMS outreach to commercial property managers and facility leads",
    bestFor:
      "Commercial HVAC service businesses with stable existing accounts who need a predictable channel for new commercial contract acquisition.",
    relatedComparisonSlugs: [],
    sortOrder: 3,
  },
  {
    slug: "commercial-cleaning",
    name: "Commercial Cleaning Services",
    shortName: "Cleaning",
    h1: "SmarterOutbound Reviews from Commercial Cleaning Services",
    metaTitle: "Commercial Cleaning Service Reviews of SmarterOutbound — SMS + Calling for Property Managers",
    metaDescription:
      "Reviews from commercial janitorial and cleaning service businesses who used SmarterOutbound's SMS plus cold calling outreach to win office building and retail center contracts.",
    intro:
      "Commercial janitorial contractors compete in a fragmented local market where most office building managers already have an existing vendor. SmarterOutbound's SMS + calling combination produces the multi-touch sequence buyers need before considering a vendor switch. These reviews are from cleaning service owners running this approach.",
    tagFilters: ["commercial-cleaning", "janitorial"],
    featuredReviewSlugs: ["commercial-cleaning-sms-calling"],
    channelFocus: "Combined SMS + cold calling outreach to commercial property managers",
    bestFor:
      "Commercial cleaning and janitorial service companies in major metros who want to expand into property-managed buildings.",
    relatedComparisonSlugs: [],
    sortOrder: 4,
  },
  {
    slug: "construction-firms",
    name: "Construction Firms",
    shortName: "Construction",
    h1: "SmarterOutbound Reviews from Commercial Construction Firms",
    metaTitle: "Commercial Construction Firm Reviews of SmarterOutbound — Multi-Trade Lead Gen",
    metaDescription:
      "Reviews from commercial construction firms — multi-trade contractors covering roofing, paving, waterproofing, and structural work — who used SmarterOutbound's SMS outreach to win commercial property maintenance work.",
    intro:
      "Multi-trade commercial construction firms need a predictable inflow of commercial work across several service lines simultaneously. SmarterOutbound's SMS outreach can be steered by property type and trade need, letting these firms direct their pipeline rather than scramble. These reviews are from commercial construction owners and operations leaders.",
    tagFilters: ["construction", "commercial-roofing"],
    featuredReviewSlugs: ["dennis-airtight-construction-bay-area"],
    channelFocus: "Local SMS outreach to commercial property managers and facility leads, segmented by property type and trade need",
    bestFor:
      "Multi-trade commercial construction firms (roofing, paving, waterproofing, structural) covering diversified service areas.",
    relatedComparisonSlugs: [],
    sortOrder: 5,
  },
  {
    slug: "b2b-saas",
    name: "B2B SaaS",
    shortName: "B2B SaaS",
    h1: "SmarterOutbound Reviews from B2B SaaS Companies",
    metaTitle: "B2B SaaS Reviews of SmarterOutbound — Cold Email, LinkedIn &amp; Multi-Channel Outbound",
    metaDescription:
      "Reviews from B2B SaaS founders, demand gen leaders, and revenue teams who used SmarterOutbound to build or scale their outbound pipeline. Spans Foundation, Multi-Channel Pipeline, and Full Outbound Engine tiers across fintech, healthtech, devops, marketing automation, real estate SaaS, and more.",
    intro:
      "B2B SaaS companies are SmarterOutbound's largest single industry segment. Reviews span pre-Series A founders building first outbound channels, Series B teams scaling past internal SDR capacity, and demand gen leaders rebuilding broken deliverability. Most use cold email plus LinkedIn; some add cold calling for senior buyers like CFOs or platform engineers.",
    tagFilters: [
      "saas",
      "vertical-saas",
      "marketing-automation",
      "data-analytics",
      "devops",
      "cybersecurity",
      "fintech",
      "healthtech",
      "edtech",
      "real-estate",
      "construction-tech",
      "project-management",
      "workflow-automation",
    ],
    channelFocus: "Cold email, LinkedIn outreach, and multi-channel orchestration for B2B SaaS buyer personas",
    bestFor:
      "B2B SaaS companies with ACVs above ~$10k that need consistent qualified pipeline and don't want to build or scale an internal SDR team.",
    relatedComparisonSlugs: ["smarteroutbound-vs-apollo", "smarteroutbound-vs-lemlist", "smarteroutbound-vs-instantly"],
    sortOrder: 6,
  },
  {
    slug: "agencies",
    name: "Agencies",
    shortName: "Agencies",
    h1: "SmarterOutbound Reviews from Marketing &amp; Service Agencies",
    metaTitle: "Agency Owner Reviews of SmarterOutbound — Outbound for PR, SEO, Web Design &amp; Marketing Firms",
    metaDescription:
      "Reviews from marketing agency, PR firm, SEO agency, web design studio, and branding studio owners who used SmarterOutbound to grow their own client base. Agency-to-agency outsourced outbound.",
    intro:
      "Marketing and service agencies face the cobbler's-children problem: they're good at generating leads for clients and bad at it for themselves. Outsourcing outbound to a peer agency that specializes in it is increasingly common — reviewed here by agency owners running the play.",
    tagFilters: ["agency", "pr-agency", "seo-agency", "web-design", "branding", "digital-marketing"],
    channelFocus: "Cold email targeting marketing leaders at growth-stage SaaS, plus LinkedIn for senior buyers",
    bestFor:
      "Boutique-to-mid-size marketing, PR, SEO, web design, and branding agencies who want a parallel outbound channel without hiring an internal BD person.",
    relatedComparisonSlugs: ["smarteroutbound-vs-apollo"],
    sortOrder: 7,
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    shortName: "Pro Services",
    h1: "SmarterOutbound Reviews from Professional Services Firms",
    metaTitle: "Professional Services Firm Reviews of SmarterOutbound — CPAs, M&amp;A, Law, Recruiting, IT Consulting",
    metaDescription:
      "Reviews from CPA firms, M&amp;A advisory boutiques, patent law firms, recruiting search firms, and IT consultancies who used SmarterOutbound for new client acquisition.",
    intro:
      "Professional services firms — accounting, M&A advisory, law, recruiting, IT consulting — usually grow through referrals. When referrals plateau, outbound to specific senior-buyer profiles becomes the next channel. These reviews are from professional services partners and managing directors who use SmarterOutbound for new business development.",
    tagFilters: [
      "accounting",
      "cpa",
      "law",
      "patent",
      "m-and-a",
      "advisory",
      "recruiting",
      "it-consulting",
      "consultancy",
      "professional-services",
    ],
    channelFocus: "Targeted cold email and multi-channel outreach to senior buyer personas (founders, CFOs, IT directors)",
    bestFor:
      "Professional services firms with high-ACV engagements and clearly defined senior buyer profiles who have hit a referral plateau.",
    relatedComparisonSlugs: [],
    sortOrder: 8,
  },
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}

/** Given a review's tags, find the first matching industry hub (for tag-link routing). */
export function getPrimaryIndustryForTags(tags: string[]): Industry | undefined {
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));
  // Search in sortOrder so the most specific hub (e.g. paving) wins over trades rollup
  const sorted = [...industries].sort((a, b) => a.sortOrder - b.sortOrder);
  // Skip the broad "trades" rollup when finding the most specific match
  const specificFirst = sorted.filter((i) => i.slug !== "trades-and-local-services");
  for (const ind of specificFirst) {
    if (ind.tagFilters.some((t) => tagSet.has(t))) return ind;
  }
  // Fall back to trades rollup
  const trades = sorted.find((i) => i.slug === "trades-and-local-services");
  if (trades && trades.tagFilters.some((t) => tagSet.has(t))) return trades;
  return undefined;
}
