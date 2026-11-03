import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import type { ReactNode } from "react";
import type { StaticPageRecord } from "@/lib/staticPagePreview";
import SourceStaticPageClient from "@/components/static-pages-comp/SourceStaticPageClient";
import StaticPagePreview from "@/components/pages/StaticPagePreview";

type SourceScript = { src?: string; code?: string };

const sourcePreviewOverrides = `
.source-preview-root,
.source-preview-root * {
  font-family: "Urbanist", ui-sans-serif, system-ui, sans-serif !important;
}
.source-preview-root h1,
.source-preview-root h2,
.source-preview-root h3,
.source-preview-root h4,
.source-preview-root [role="heading"] {
  font-family: "Urbanist", ui-sans-serif, system-ui, sans-serif !important;
  letter-spacing: -0.03em !important;
}
.source-preview-root h1 { font-size: clamp(2.3rem, 4.9vw, 3.8rem) !important; line-height: .95 !important; }
.source-preview-root h2 { font-size: clamp(1.75rem, 3.15vw, 2.95rem) !important; line-height: 1.02 !important; }
.source-preview-root h3 { font-size: clamp(1.12rem, 1.75vw, 1.58rem) !important; line-height: 1.1 !important; }
.source-preview-root .section-label,
.source-preview-root .sec-eyebrow,
.source-preview-root .section-eyebrow,
.source-preview-root .fc-eyebrow,
.source-preview-root .hero-eyebrow,
.source-preview-root .badge-pill,
.source-preview-root .category-pill,
.source-preview-root .cb-eyebrow,
.source-preview-root .cta-eyebrow,
.source-preview-root .final-cta-eyebrow,
.source-preview-root .section-kicker,
.source-preview-root .section-header-tag,
.source-preview-root .section-badge,
.source-preview-root .sec-label,
.source-preview-root .cs-label,
.source-preview-root .methodology-pill,
.source-preview-root .eyebrow,
.source-preview-root .eyebrow-row > .eyebrow,
.source-preview-root .card-header .section-label,
.source-preview-root .final-cta .section-label {
  display: inline-flex !important;
  width: fit-content !important;
  align-items: center !important;
  gap: .45rem !important;
  border: 1px solid rgba(94, 209, 255, .68) !important;
  border-radius: 999px !important;
  background: linear-gradient(135deg, #042f5a 0%, #075b94 100%) !important;
  padding: .38rem .82rem !important;
  color: #e9f8ff !important;
  font-size: .72rem !important;
  font-weight: 700 !important;
  letter-spacing: .09em !important;
  line-height: 1.2 !important;
  text-transform: uppercase !important;
  box-shadow: inset 0 0 0 1px rgba(113, 212, 255, .12), 0 7px 17px rgba(3, 54, 96, .17) !important;
}
.source-preview-root .hero .hero-eyebrow,
.source-preview-root .legal-hero .badge-pill,
.source-preview-root .hero .section-label,
.source-preview-root .hero .section-kicker {
  border-color: rgba(10, 41, 82, .12) !important;
  background: #fff !important;
  color: #0a2952 !important;
  box-shadow: 0 5px 14px rgba(7, 25, 54, .12) !important;
}
.source-preview-root h1 em,
.source-preview-root h2 em,
.source-preview-root h3 em,
.source-preview-root .source-hero-accent,
.source-preview-root .source-section-accent,
.source-preview-root .card-title strong,
.source-preview-root .section-card h2 strong {
  color: #15803d !important;
}
.source-preview-root .source-preview-section-pill,
.source-preview-root .pill {
  border-radius: 999px !important;
}
.source-preview-has-registration .hero,
.source-preview-has-registration .hero-section,
.source-preview-has-registration .page-hero,
.source-preview-has-registration .hero-banner {
  background: #061a33 !important;
  background-image: none !important;
  color: #fff !important;
}
.source-preview-has-registration .hero h1,
.source-preview-has-registration .hero h2,
.source-preview-has-registration .hero h3,
.source-preview-has-registration .hero .hero-h1,
.source-preview-has-registration .hero p,
.source-preview-has-registration .hero .hero-tagline,
.source-preview-has-registration .hero .hero-breadcrumbs,
.source-preview-has-registration .hero label,
.source-preview-has-registration .hero .stat-label,
.source-preview-has-registration .hero .stat-label-responsive {
  color: #fff !important;
}
.source-preview-has-registration .hero .hero-grid,
.source-preview-has-registration .hero .hero-layout,
.source-preview-has-registration .hero .hero-inner {
  grid-template-columns: minmax(0, .85fr) minmax(440px, 1.15fr) !important;
}
.source-preview-has-registration .hero .hero-widget-col,
.source-preview-has-registration .hero .cta-card,
.source-preview-has-registration .hero .cta-card-responsive,
.source-preview-has-registration .hero .cta-wrapper,
.source-preview-has-registration .hero .cta-wrapper-responsive {
  width: min(100%, 420px) !important;
  max-width: 420px !important;
  justify-self: end !important;
}
.source-preview-symptoms.source-preview-has-registration .hero .hero-widget-col,
.source-preview-symptoms.source-preview-has-registration .hero .cta-card,
.source-preview-symptoms.source-preview-has-registration .hero .cta-card-responsive,
.source-preview-symptoms.source-preview-has-registration .hero .cta-wrapper,
.source-preview-symptoms.source-preview-has-registration .hero .cta-wrapper-responsive {
  width: min(100%, 480px) !important;
  max-width: 480px !important;
}
.source-preview-symptoms .hero .btn-link,
.source-preview-symptoms .hero .btn-link:visited {
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  color: #fff !important;
}
.source-preview-symptoms .hero .secure-note,
.source-preview-symptoms .hero .secure-note-responsive,
.source-preview-symptoms .hero .reg-trust-item,
.source-preview-symptoms .hero .stat-label,
.source-preview-symptoms .hero .stat-label-responsive {
  visibility: visible !important;
  opacity: 1 !important;
  color: #fff !important;
  font-size: 12px !important;
}
.source-preview-root main h2,
.source-preview-root .content-section h2,
.source-preview-root .section-card-title {
  font-size: clamp(1.55rem, 2.8vw, 2.5rem) !important;
  line-height: 1.05 !important;
}
.source-preview-has-registration .hero .hero-costs {
  gap: 12px !important;
}
.source-preview-has-registration .hero .hcost,
.source-preview-has-registration .hero .cost-card,
.source-preview-has-registration .hero .price-card {
  min-width: 0 !important;
  min-height: 112px !important;
  overflow: hidden !important;
  border: 1px solid rgba(255, 255, 255, .28) !important;
  border-radius: 14px !important;
  background: rgba(255, 255, 255, .16) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .2), 0 10px 24px rgba(3, 25, 55, .16) !important;
  backdrop-filter: blur(18px) saturate(145%) !important;
}
.source-preview-has-registration .hero .hcost-label,
.source-preview-has-registration .hero .hcost-amount,
.source-preview-has-registration .hero .hcost-sub {
  color: #fff !important;
}
.source-preview-has-registration .hero .hcost-icon-box,
.source-preview-has-registration .hero .hcost-label span {
  display: none !important;
}
.source-preview-root .hero .hcost-icon-box,
.source-preview-root .hero .hcost-label span {
  display: none !important;
}
.source-preview-root .hero .hcost {
  grid-template-columns: minmax(0, 1fr) !important;
}
.source-preview-root .hero .hcost-info {
  min-width: 0 !important;
  width: 100% !important;
}
.source-preview-root .urgent-warning-card h2,
.source-preview-root .urgent-warning-card h3,
.source-preview-root .next-step-panel h2,
.source-preview-root .next-step-panel h3 {
  font-size: clamp(1.2rem, 2.1vw, 1.7rem) !important;
  line-height: 1.08 !important;
}
.source-preview-family-about .hero {
  padding-top: 32px !important;
  padding-bottom: 32px !important;
}
.source-preview-family-about .hero-inner {
  min-height: 400px !important;
  padding-top: 32px !important;
  padding-bottom: 32px !important;
}
.source-preview-family-case-studies .hero h1,
.source-preview-family-case-studies .hero h1 * {
  color: #fff !important;
}
.source-preview-family-case-studies .hero h1 em,
.source-preview-family-case-studies .hero h1 strong,
.source-preview-family-case-studies .hero h1 span,
.source-preview-family-case-studies .hero h1 .source-hero-accent {
  color: #15803d !important;
}
.source-preview-family-services [style*="border-left"],
.source-preview-family-services .section-card,
.source-preview-family-services .glass-card,
.source-preview-family-services [class*="card"],
.source-preview-family-services [class*="panel"] {
  border-left: 0 !important;
}
.source-preview-family-services a[class*="btn"],
.source-preview-family-services button,
.source-preview-family-services .nav-cta,
.source-preview-family-services .nav-cta-btn {
  border-color: #061a33 !important;
  background: #061a33 !important;
  color: #fff !important;
}
.source-preview-family-services a[class*="quote"],
.source-preview-family-services a[class*="primary"],
.source-preview-family-services .submit-btn,
.source-preview-family-services .submit-btn-responsive {
  border-color: #15803d !important;
  background: #15803d !important;
}
.source-preview-family-prices main [style*="color"],
.source-preview-family-compare main [style*="color"],
.source-preview-family-insights main [style*="color"] {
  color: inherit !important;
}
.source-preview-family-prices [style*="border-left"],
.source-preview-family-prices [style*="border-top"],
.source-preview-family-compare [style*="border-left"],
.source-preview-family-compare [style*="border-top"],
.source-preview-family-insights [style*="border-left"],
.source-preview-family-insights [style*="border-top"] {
  border-left: 0 !important;
  border-top: 0 !important;
}
.source-preview-family-compare [class*="card"],
.source-preview-family-compare [class*="panel"],
.source-preview-family-compare [class*="box"],
.source-preview-family-insights [class*="card"],
.source-preview-family-insights [class*="panel"],
.source-preview-family-insights [class*="box"] {
  border-left: 0 !important;
  border-top: 0 !important;
}
.source-preview-family-prices .bar-fill,
.source-preview-family-prices .bar-fill-inner,
.source-preview-family-prices .mb-bar-fill,
.source-preview-family-prices .mbar-fill {
  background: #15803d !important;
}
.source-preview-family-compare a[class*="btn"],
.source-preview-family-compare button,
.source-preview-family-compare .nav-cta {
  border-color: #061a33 !important;
  background: #061a33 !important;
  color: #fff !important;
}
.source-preview-family-compare .submit-btn,
.source-preview-family-compare .submit-btn-responsive,
.source-preview-family-compare a[class*="quote"] {
  border-color: #15803d !important;
  background: #15803d !important;
}
.source-preview-family-insights .hero {
  margin-top: 0 !important;
}
.source-preview-family-compare > .nav,
.source-preview-family-compare > header:has(.nav),
.source-preview-family-compare .nav[role="navigation"] {
  display: none !important;
}
.source-preview-family-compare .hero-quote-panel {
  width: 100% !important;
  max-width: 420px !important;
  padding: 16px !important;
  border: 1px solid rgba(255, 255, 255, .28) !important;
  border-radius: 16px !important;
  background: rgba(255, 255, 255, .16) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .2), 0 14px 30px rgba(3, 25, 55, .2) !important;
  backdrop-filter: blur(26px) saturate(155%) !important;
}
.source-preview-family-compare .hero-reg-input {
  min-height: 60px !important;
  border: 4px solid #102442 !important;
  border-radius: 9px !important;
  background: #ffdd00 !important;
  color: #10151c !important;
  text-align: center !important;
  box-shadow: none !important;
}
.source-preview-family-compare .hero-reg-input::placeholder {
  color: #10151c !important;
  opacity: 1 !important;
}
.source-preview-family-compare .hero-reg-button {
  min-height: 52px !important;
  border-radius: 8px !important;
  background: #15803d !important;
  color: #fff !important;
}
.source-preview-family-compare .hero-reg-note,
.source-preview-family-compare .hero-trust-item {
  color: rgba(255, 255, 255, .82) !important;
}
.source-preview-family-compare .market-block .sec-h2,
.source-preview-family-compare .market-block .sec-sub,
.source-preview-family-compare .market-block p,
.source-preview-family-compare .market-block .market-num-label,
.source-preview-family-compare .market-block .mi-label,
.source-preview-family-compare .market-block .mi-text,
.source-preview-family-compare .market-block .mi-source,
.source-preview-family-compare .market-block .mb-engine,
.source-preview-family-compare .market-block .mb-note,
.source-preview-family-compare .market-block .mb-count,
.source-preview-family-compare .market-block .mb-verified {
  color: #fff !important;
}
.source-preview-family-prices .sec-eyebrow::before,
.source-preview-family-prices .section-label::before,
.source-preview-family-prices .section-kicker::before,
.source-preview-family-prices .section-header-tag::before,
.source-preview-family-prices .section-badge::before {
  display: none !important;
  content: none !important;
}
.source-preview-family-prices .tag-pill {
  border: 1px solid #cbd5e1 !important;
  border-radius: 0 !important;
  background: #f1f5f9 !important;
}
.source-preview-has-registration .hero .hero-widget-col,
.source-preview-has-registration .hero .cta-card,
.source-preview-has-registration .hero .cta-card-responsive {
  width: 100% !important;
  min-width: 0 !important;
}
.source-preview-has-registration .hero .cta-card,
.source-preview-has-registration .hero .cta-card-responsive {
  border: 1px solid rgba(13, 27, 46, .1) !important;
  border-radius: 12px !important;
  background: rgba(255, 255, 255, .55) !important;
  box-shadow: 0 8px 30px rgba(13, 27, 46, .2) !important;
  backdrop-filter: blur(26px) saturate(155%) !important;
}
.source-preview-has-registration .hero .cta-card h3,
.source-preview-has-registration .hero .cta-card p,
.source-preview-has-registration .hero .cta-card label,
.source-preview-has-registration .hero .cta-card-responsive h3,
.source-preview-has-registration .hero .cta-card-responsive p,
.source-preview-has-registration .hero .cta-card-responsive label,
.source-preview-has-registration .hero .card-body,
.source-preview-has-registration .hero .card-body-responsive {
  color: #fff !important;
}
.source-preview-has-registration .hero .tab-group,
.source-preview-has-registration .hero .tab-group-responsive {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 0 !important;
  overflow: hidden !important;
  border-radius: 15px !important;
  background: rgba(255, 255, 255, .8) !important;
  box-shadow: 0 4px 12px rgba(10, 39, 83, .12) !important;
}
.source-preview-has-registration .hero .tab-active,
.source-preview-has-registration .hero .tab-active-responsive {
  border-color: rgba(255, 255, 255, .2) !important;
  background: linear-gradient(180deg, #0e2a4f 0%, #061a33 60%, #030d1a 100%) !important;
  color: #fff !important;
  box-shadow: inset 0 2px 0 rgba(255, 255, 255, .3), inset 0 -3px 6px rgba(0, 0, 20, .3), 0 4px 10px rgba(10, 30, 90, .35) !important;
}
.source-preview-has-registration .hero .tab-inactive,
.source-preview-has-registration .hero .tab-inactive-responsive {
  border-color: transparent !important;
  background: #fff !important;
  color: #0b245a !important;
  box-shadow: inset 0 2px 5px rgba(10, 39, 83, .1) !important;
}
.source-preview-has-registration .hero .reg-input-row,
.source-preview-has-registration .hero .reg-input-row-responsive {
  min-height: 60px !important;
  overflow: hidden !important;
  border: 4px solid #102442 !important;
  border-radius: 9px !important;
  background: #ffdd00 !important;
}
.source-preview-has-registration .hero .reg-input,
.source-preview-has-registration .hero .reg-input-responsive {
  min-width: 0 !important;
  background: transparent !important;
  color: #10151c !important;
  font-size: 22px !important;
  font-weight: 700 !important;
  letter-spacing: .07em !important;
  text-align: center !important;
  opacity: 1 !important;
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
}
.source-preview-has-registration .hero .reg-input::placeholder,
.source-preview-has-registration .hero .reg-input-responsive::placeholder {
  color: #10151c !important;
  font-size: 22px !important;
  font-weight: 700 !important;
  letter-spacing: .03em !important;
  text-align: center !important;
  opacity: 1 !important;
}
.source-preview-has-registration .hero .submit-btn,
.source-preview-has-registration .hero .submit-btn-responsive {
  border-radius: 8px !important;
  background: #15803d !important;
  color: #fff !important;
  font-weight: 800 !important;
}
@media (min-width: 768px) {
  .source-preview-has-registration .hero .reg-input,
  .source-preview-has-registration .hero .reg-input-responsive,
  .source-preview-has-registration .hero .reg-input::placeholder,
  .source-preview-has-registration .hero .reg-input-responsive::placeholder {
    font-size: 30px !important;
  }
}
@media (max-width: 900px) {
  .source-preview-has-registration .hero .hero-grid,
  .source-preview-has-registration .hero .hero-layout,
  .source-preview-has-registration .hero .hero-inner {
    grid-template-columns: minmax(0, 1fr) !important;
  }
  .source-preview-has-registration .hero .hero-widget-col,
  .source-preview-has-registration .hero .cta-card,
  .source-preview-has-registration .hero .cta-card-responsive,
  .source-preview-has-registration .hero .cta-wrapper,
  .source-preview-has-registration .hero .cta-wrapper-responsive {
    width: 100% !important;
    max-width: none !important;
    justify-self: stretch !important;
  }
  .source-preview-symptoms.source-preview-has-registration .hero .hero-widget-col,
  .source-preview-symptoms.source-preview-has-registration .hero .cta-card,
  .source-preview-symptoms.source-preview-has-registration .hero .cta-card-responsive,
  .source-preview-symptoms.source-preview-has-registration .hero .cta-wrapper,
  .source-preview-symptoms.source-preview-has-registration .hero .cta-wrapper-responsive {
    max-width: none !important;
  }
}
.source-preview-has-registration .hero h1,
.source-preview-has-registration .hero h2,
.source-preview-has-registration .hero h3,
.source-preview-has-registration .hero p,
.source-preview-has-registration .hero label { color: inherit; }
.source-preview-has-registration input,
.source-preview-has-registration select,
.source-preview-has-registration textarea { font-family: inherit !important; }
`;

function sourcePathFor(page: StaticPageRecord) {
  const relative = page.source.originalFile.replace(/[\\/]+/g, "/");
  if (!relative.startsWith("public/") && !relative.startsWith("content/")) return null;
  // Source pages are build-time inputs for SSG and must not be copied into the runtime function.
  const resolved = path.resolve(/* turbopackIgnore: true */ process.cwd(), relative);
  const root = path.resolve(/* turbopackIgnore: true */ process.cwd());
  return resolved.startsWith(`${root}${path.sep}`) ? resolved : null;
}

function localAssetPath(href: string) {
  if (!href.startsWith("/") || href.startsWith("//")) return null;
  const resolved = path.resolve(/* turbopackIgnore: true */ process.cwd(), "public", href.slice(1));
  const root = path.resolve(/* turbopackIgnore: true */ process.cwd(), "public");
  return resolved.startsWith(`${root}${path.sep}`) ? resolved : null;
}

function scopeSourceCss(css: string) {
  let root: ReturnType<typeof postcss.parse>;
  try {
    root = postcss.parse(css);
  } catch {
    let depth = 0;
    let inString = "";
    let balanced = "";
    for (const character of css) {
      if ((character === '"' || character === "'") && !inString) inString = character;
      else if (character === inString) inString = "";
      if (!inString && character === "{") depth += 1;
      if (!inString && character === "}") {
        if (depth === 0) continue;
        depth -= 1;
      }
      balanced += character;
    }
    try {
      root = postcss.parse(balanced);
    } catch {
      return "";
    }
  }
  root.walkRules((rule) => {
    if (rule.parent?.type === "atrule" && /keyframes/i.test(rule.parent.name || "")) return;
    rule.selectors = rule.selectors.flatMap((selector) => {
      const trimmed = selector.trim();
      if (/^(html|body|:root)(\b|\s|[>+~.:#[])/i.test(trimmed)) {
        return trimmed.replace(/^(html|body|:root)\b/i, ".source-preview-root");
      }
      if (trimmed === "*") return [".source-preview-root", ".source-preview-root *"];
      if (trimmed.startsWith("*::")) return [`.source-preview-root ${trimmed}`];
      if (trimmed.startsWith(".source-preview-root")) return [trimmed];
      return [`.source-preview-root ${trimmed}`];
    });
  });
  return root.toString();
}

function extractSource(source: string) {
  const bodyMatch = source.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  let body = bodyMatch?.[1] || source;
  const scripts: SourceScript[] = [];
  body = body.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (_match, attributes: string, code: string) => {
    const src = attributes.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    const type = attributes.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1];
    // The application layout already owns the navbar and footer behavior.
    if (src && !/static-nav\.js/i.test(src)) scripts.push({ src });
    if (!src && code.trim() && !/application\/ld\+json/i.test(type ?? "")) scripts.push({ code });
    return "";
  });
  body = body.replace(/\s*\[EM-QUOTE\]\s*/gi, " ");
  body = body.replace(/<([a-z0-9]+)\b[^>]*class=["'][^"']*(?:nav-breadcrumbs|hero-breadcrumbs|breadcrumbs|breadcrumb)[^"']*["'][^>]*>[\s\S]*?<\/\1>/gi, "");
  body = body.replace(/(placeholder\s*=\s*["'])Enter your reg\s*-\s*e\.g\.\s*AB12\s+CDE(["'])/gi, "$1REG HERE$2");

  const styles: string[] = [];
  const externalStyles: string[] = [];
  for (const match of source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) styles.push(scopeSourceCss(match[1]));
  for (const match of source.matchAll(/<link\b[^>]*rel=["'][^"']*stylesheet[^"']*["'][^>]*>/gi)) {
    const href = match[0].match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
    const assetPath = href ? localAssetPath(href) : null;
    if (assetPath && fs.existsSync(/* turbopackIgnore: true */ assetPath)) {
      styles.push(scopeSourceCss(fs.readFileSync(/* turbopackIgnore: true */ assetPath, "utf8")));
    }
    else if (href && /^https?:\/\//i.test(href)) externalStyles.push(href);
  }
  return { body, styles, externalStyles, scripts };
}

export default function SourceStaticPage({ page, customHero }: { page: StaticPageRecord; customHero?: ReactNode }) {
  const sourcePath = sourcePathFor(page);
  if (!sourcePath || !fs.existsSync(/* turbopackIgnore: true */ sourcePath)) {
    return <StaticPagePreview page={page} />;
  }
  const source = fs.readFileSync(/* turbopackIgnore: true */ sourcePath, "utf8");
  const { body, styles, externalStyles, scripts } = extractSource(source);
  const heroMarkup = body.match(/<section\b[^>]*class=["'][^"']*\bhero\b[^"']*["'][^>]*>[\s\S]*?<\/section>/i)?.[0] ?? body.match(/<div\b[^>]*class=["'][^"']*\bhero\b[^"']*["'][^>]*>[\s\S]*?<\/div>/i)?.[0] ?? "";
  const hasRegistrationHero = Boolean(heroMarkup) && (/<(?:form|input|button)\b[^>]*(?:registration|reg(?:istration)?)/i.test(heroMarkup) || /(?:Search by Registration|reg-input|registration-form)/i.test(heroMarkup));
  const isSymptoms = /(?:^|[\\/])symptoms(?:[\\/]|$)/i.test(page.source.originalFile) || /(?:^|[\\/])symptoms(?:[\\/]|$)/i.test(page.route);
  const family = page.route.match(/^\/(about|legal|symptoms|services|prices|compare|failures|insights|case-studies)(?:\/|$)/i)?.[1]?.toLowerCase();
  const renderedBody = customHero && heroMarkup ? body.replace(heroMarkup, "") : body;
  const renderedScripts = customHero
    ? scripts.filter((script) => !/var\s+tabRegistration\s*=|registrationForm\.addEventListener/i.test(script.code ?? ""))
    : scripts;
  return <>
    {page.structuredData.length ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(page.structuredData) }} /> : null}
    {externalStyles.map((href) => <link rel="stylesheet" href={href} key={href} />)}
    {styles.map((style, index) => <style data-source-preview-css key={index}>{style}</style>)}
    <style data-source-preview-overrides dangerouslySetInnerHTML={{ __html: sourcePreviewOverrides }} />
    <SourceStaticPageClient html={renderedBody} scripts={renderedScripts} customHero={customHero} hasRegistrationHero={customHero ? false : hasRegistrationHero} isSymptoms={isSymptoms} family={family} />
  </>;
}
