# engines-market — AI structure notes (incremental)

Purpose: compact map for agents. Update when fixing/touching an area. Not human docs.

## Stack
- Next.js App Router (`app/`), data JSON in `data/`, static HTML+assets in `public/`
- Site origin: `lib/site.ts` → `SITE_URL` (default `https://enginesmarket.co.uk`)

## Page types (hybrid)
| Kind | Where | URL pattern |
|------|--------|-------------|
| Dynamic brand | `app/[brand]/page.tsx` + `data/brands/*.json` | `/{brand}` |
| Dynamic model | `app/[brand]/[model]/page.tsx` + `data/models/*.json` | `/{brand}/{model}` |
| Dynamic variant | `app/[brand]/[model]/[variant]/page.tsx` + `data/variants/` | `/{brand}/{model}/{variant}` |
| Dynamic engine (same route as model) | `getEnginePageData` when slug is engine | `/{brand}/{engine}` |
| Static HTML via rewrite | `public/{section}/*.html` + `next.config.ts` rewrites | e.g. `/failures/:slug` content often React; `/services/:slug`, `/insights/:slug`, `/case-studies/:slug`, `/symptoms/:slug`, `/prices/:slug`, `/legal/:slug`, `/about/:slug` |
| Compare guides | `app/compare/[slug]/page.tsx` + parses `public/compare/*.html` | `/compare/:slug` — **App Router wins**; HTML canonical alone does nothing until metadata sets it |
| App routes | `app/blog`, `app/resources`, `app/compare`, `app/form`, hub pages | see `app/*` |

## SEO / robots (2026-09-17)
- `/robots.txt` → `app/robots.txt/route.ts` — `User-agent: *` / `Allow: /` + Sitemap
- Root `app/layout.tsx` metadata.robots = index,follow (site-wide default)
- Model (+ engine-on-model-route) `generateMetadata` also sets robots index,follow
- `next.config.ts` `X-Robots-Tag: index, follow, ...` on `/:path*` (was only `/`)
- Sitemap: `app/sitemap.ts` (+ root `sitemap.xml` if present)
- Canonicals: `lib/site.ts` → `normalizeCanonical` / `withNormalizedSeoCanonical` — strip trailing `/` except root. Applied on load for brands/models/engines/variants + `structuredData.toAbsoluteUrl`

## Key folders
- `components/sections/` — shared sections (e.g. `LiveMarketPricesSection.tsx`: brand vs `displayMode="document"`)
- `data/brands|models|engines|variants|live-market/`
- `public/images/brand-wcu/` — Live Market Prices brand infographics (`/images/brand-wcu/...`)
- `public/failures|services|insights|case-studies|symptoms|prices|legal|about/` — static HTML

## Touch log (append when changing)
- 2026-09-17: robots allow-all (layout + model metadata + X-Robots-Tag all paths); structure file seeded
- 2026-09-17: global canonical trailing-slash strip (`normalizeCanonical` in site.ts; engines had `/` in JSON)
- 2026-09-17: compare URLs served by `app/compare/[slug]` (not `public/compare/*.html`); HTML canonical ignored — fixed via `generateMetadata.alternates.canonical`; hub pages too via `getHubPageMetadata`
- 2026-09-17: static site nav broken — HTML pointed at `/static-nav.css-v=2` (404; should be `?v=2`); 11 case-studies also had literal `` `r`n `` before `</head>`/`</body>`; fixed 127 HTML + rewrite fallback in `next.config.ts`
- 2026-09-17: brand Models section cards — removed `scale-[1.25]` / `object-cover` crop; use `object-contain` (`ModelsSection.tsx`)
- 2026-09-17: model How It Works — 312 model JSONs had fewer than 3 cards (Land Rover Defender/Discovery/Freelander had 1); filled missing steps 2–3 from brand/model templates; remaining bad=0
- 2026-09-17: model Variants We Cover cards — same fit fix as brand Models (`object-contain` + `p-[6px]` + taller image box in `VariantCoverageSection.tsx`)
- 2026-09-17: static HTML robots — App layout robots do not apply to rewritten `public/**/*.html`; added `<meta name="robots" content="index, follow">` to 130 static pages missing it (incl. legal except cookie which already had it). Script: `scripts/add_robots_meta_to_static_html.py`
- 2026-09-17: navbar v2 — `Navbar.tsx` + `NavMenus.tsx`; data in `data/nav/{brands,engines,services,others}.json` via `lib/navData.ts`. Top-level: **Brands** (hover → models/variants) · **Engines** (search) · **Services** · **Others** (prices/knowledge/insights/company/legal).
- 2026-09-18: SSG timeout fix — `staticPageGenerationTimeout: 180` + concurrency 2; cache `getAllVariantPageData` (was reloading every page); race-safe promise cache for models/engines
- 2026-09-18: static `/public` nav now loads shared menu data from `app/api/static-nav/route.ts`; `public/static-nav.js`/`.css` updated to mirror current Brands/Engines/Services/Others structure. Manually corrected remaining wrong canonical/page URLs in affected `public/about/*`, `public/legal/*`, `public/services/engine-diagnostic.html`, `public/prices/garage-labour-rates.html`