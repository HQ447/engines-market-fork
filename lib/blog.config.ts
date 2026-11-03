// lib/blog.config.ts
/**
 * Site-specific configuration for Headless CMS Blog & Lead Quote integration.
 */

export const blogConfig = {
  // 1. Site Identity
  siteName: "Engines Market",
  siteSlug: process.env.CMS_SITE_SLUG || "enginesmarket",
  siteDomain: "enginesmarket.co.uk",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "https://enginesmarket.co.uk").replace(/\/$/, ""),
  defaultAuthor: "Editorial Team",

  // 2. Headings & UI Copy
  copy: {
    metaTitle: "Blog & Engine Guides | Engines Market",
    metaDescription:
      "Expert automotive advice, engine diagnostic guides, failure solutions, and reconditioning insights from Engines Market.",
    blogTitlePrefix: "Engines Market",
    blogTitleAccent: "Blog",
    blogSubtitle:
      "Comprehensive engine reliability analysis, buyer guides, failure diagnosis, and expert replacement advice.",
    emptyTitle: "No articles published yet",
    emptySubtitle: "Articles published from the CMS will appear here instantly.",
    readMoreText: "Read More",
    widgetTitle: "Need the Right Engine?",
    widgetSubtitle: "Enter your registration or request a callback from our engine specialists.",
    widgetSubmitText: "Request A Quote",
    widgetSuccessTitle: "Quote Request Received!",
    widgetSuccessSubtitle:
      "An engine specialist will contact you shortly with prices and warranty options.",
    recentGuidesTitle: "Recent Guides",
    relatedGuidesTitle: "Related Guides",
    bottomCta: {
      enabled: true,
      badge: "UK Engine Network",
      title: "Need Help Identifying or Replacing Your Engine?",
      subtitle:
        "Connect directly with trusted UK engine suppliers and specialists. Get transparent quotes for recon, used engines, and fitting nationwide.",
      buttonText: "Request A Free Engine Quote »",
      buttonHref: "#sidebar-reg-input",
    },
  },

  // 3. Theme Colors (Exposed as CSS custom properties in blog.css)
  theme: {
    fontFamily: "'Montserrat', sans-serif",
    primaryColor: "#1E3A8A",       // H2 left border, links, active pagination, card title hover
    primaryHover: "#2563EB",
    accentColor: "#16A34A",        // "Blog" title accent, "Read More »", "View all »"
    accentHover: "#15803D",
    widgetBg: "#002244",           // Sidebar quote widget card background
    widgetBorder: "#003366",       // Sidebar quote widget card border
    widgetButtonBg: "#0055d4",     // "Find My Engine" & "Request A Quote" button
    widgetButtonHover: "#0047b8",
    ukBadgeBg: "#003399",          // UK flag reg badge
    fallbackThumbnail:
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80",
  },
};

export type BlogConfig = typeof blogConfig;
