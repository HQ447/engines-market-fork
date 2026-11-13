import { getNormalizedPreviewContent } from "@/lib/staticPagePreview";
import type { StaticBlock, StaticPageRecord } from "@/lib/staticPagePreview";

type ParagraphBlock = Extract<StaticBlock, { type: "paragraph" }>;

function HeroTitle({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  const accentCount = text.toLowerCase().includes("how we handle") ? 3 : text.toLowerCase().includes("complaint") ? 2 : 1;
  return <h1 className="mb-4 font-display text-[clamp(2.25rem,4vw,3.25rem)] font-bold leading-[1.15] tracking-[-0.02em] text-white">{words.slice(0, -accentCount).join(" ")}{words.length > accentCount ? " " : null}<em className="bg-[linear-gradient(120deg,#34d399,#10b981)] bg-clip-text not-italic text-transparent">{words.slice(-accentCount).join(" ")}</em></h1>;
}

function getBadges(page: StaticPageRecord) {
  const paragraphs = getNormalizedPreviewContent(page).leadBlocks.filter((block): block is ParagraphBlock => block.type === "paragraph");
  const badges = ["Effective", "Version", "Last updated"].map((label) => {
    const index = paragraphs.findIndex((block) => block.text.trim().toLowerCase() === label.toLowerCase());
    return { label, value: index >= 0 ? paragraphs[index + 1]?.text.trim() || "" : "" };
  }).filter((badge) => badge.value);
  if (!badges.length) {
    const effective = paragraphs.find((block) => /^Effective:/i.test(block.text));
    const version = paragraphs.find((block) => /^Version\s/i.test(block.text));
    return [
      effective ? { label: "Effective", value: effective.text.replace(/^Effective:\s*/i, "") } : null,
      version ? { label: "Version", value: version.text } : null,
    ].filter((badge): badge is { label: string; value: string } => Boolean(badge));
  }
  return badges;
}

function badgeLabel(page: StaticPageRecord) {
  if (page.slug.endsWith("cookie-policy")) return "Legal";
  if (page.slug.endsWith("data-handlng-policy")) return "Data Handling Policy";
  if (page.slug.endsWith("privacy-policy") || page.slug.endsWith("terms-and-conditions")) return "PRESTIGE AUTO ENGINEERING LTD";
  if (page.slug.endsWith("complaints-procedure")) return "Complaints Procedure";
  return "Engines Market";
}

export default function LegalHero({ page }: { page: StaticPageRecord }) {
  const { hero } = getNormalizedPreviewContent(page);
  const title = hero.title || page.seo.title;
  const badges = getBadges(page);

  return <section className="relative overflow-hidden border-b-4 border-[#078d4a] bg-[linear-gradient(135deg,#071a32_0%,#0a2952_100%)] py-14 text-white sm:py-16">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(7,141,74,.12)_0%,transparent_45%),radial-gradient(circle_at_85%_30%,rgba(16,185,129,.1)_0%,transparent_50%),linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[length:100%_100%,100%_100%,32px_32px,32px_32px]" />
    <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
      <div className="max-w-[720px]">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.12] px-4 py-1 text-[13px] font-bold uppercase tracking-[0.08em] text-[#d1fae5]"><svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>{badgeLabel(page)}</span>
        <HeroTitle text={title} />
        {hero.description ? <p className="max-w-[720px] text-[17px] leading-[1.6] text-[#cbd5e1]">{hero.description}</p> : null}
        {badges.length ? <div className="mt-6 grid grid-cols-1 gap-4 border-t border-white/15 pt-6 sm:grid-cols-3 sm:gap-8">{badges.map((badge) => <div className="flex flex-col gap-1" key={badge.label}><span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">{badge.label}</span><strong className="font-display text-[17px] font-bold text-white">{badge.value}</strong></div>)}</div> : null}
      </div>
      <div className="hidden h-[280px] w-[280px] items-center justify-center rounded-3xl border border-white/[0.12] bg-[#0e2a47]/70 p-6 shadow-[0_20px_40px_rgba(0,0,0,.3)] lg:flex" aria-hidden="true">
        <svg className="h-full w-full drop-shadow-[0_8px_16px_rgba(7,141,74,.25)]" viewBox="0 0 200 200" fill="none"><circle cx="100" cy="100" r="96" stroke="#10b981" strokeWidth="2" strokeDasharray="8 8" opacity=".3" /><path d="M100 28 144 48v48c0 36-18 70-44 78-26-8-44-42-44-78V48l44-20Z" fill="rgba(7,141,74,.15)" stroke="#10b981" strokeWidth="2" /><path d="m100 44 32 14v36c0 28-14 56-32 64-18-8-32-36-32-64V58l32-14Z" fill="rgba(7,141,74,.25)" stroke="#34d399" strokeWidth="1.5" /><circle cx="100" cy="100" r="16" fill="rgba(16,185,129,.3)" stroke="#34d399" strokeWidth="1.5" /><path d="m92 96 6 6 12-12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  </section>;
}
