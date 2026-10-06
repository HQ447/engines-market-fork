import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Large brand/model/engine SSG set — default 60s page timeout kills late pages (e.g. /seat/*).
  staticPageGenerationTimeout: 180,
  experimental: {
    // Fewer concurrent pages per worker reduces thrashing on large JSON-heavy routes.
    staticGenerationMaxConcurrency: 2,
    staticGenerationRetryCount: 3,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/static-nav.css-v=:version",
          destination: "/static-nav.css",
        },
        {
          source: "/static-nav.js-v=:version",
          destination: "/static-nav.js",
        },
        {
          source: "/about",
          destination: "/about/about-us.html",
        },
        {
          source: "/insights/:slug",
          destination: "/insights/:slug.html",
        },
        {
          source: "/services/:slug",
          destination: "/services/:slug.html",
        },
        {
          source: "/prices/:slug",
          destination: "/prices/:slug.html",
        },
        {
          source: "/services/gearbox-replacement/:slug",
          destination: "/services/gearbox-replacement/:slug.html",
        },
        {
          source: "/about/:slug",
          destination: "/about/:slug.html",
        },
        {
          source: "/legal/:slug",
          destination: "/legal/:slug.html",
        },
        {
          source: "/reviews",
          destination: "/reviews.html",
        },
        {
          source: "/get-a-quote",
          destination: "/form",
        },
        {
          source: "/case-studies/nissan-navara-engine-failure",
          destination: "/case-studies/nissan-navara-d40-case-study.html",
        },
        {
          source: "/case-studies/:slug",
          destination: "/case-studies/:slug.html",
        },
        {
          source: "/symptoms/:slug",
          destination: "/symptoms/:slug.html",
        },
      ],
    };
  },
};

export default nextConfig;
