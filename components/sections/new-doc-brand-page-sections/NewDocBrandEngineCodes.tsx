"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdOutlineElectricMeter } from "react-icons/md";
import type { BrandPageData, EngineCodesData } from "@/types/brand";
import ModelMobileAccordion from "@/components/sections/new-doc-model-page-sections/ModelMobileAccordion";
import { splitBrandHeading } from "./brandHeading";

type Props = {
  data: BrandPageData;
};

const ENGINE_IMAGE =
  "/images/engines/fac66331-c94d-48e9-983a-7997fd84a619_removalai_preview.webp";

type FuelTabKey = "diesel" | "petrol" | "hybrid";

type EngineCardData = EngineCodesData["groups"][number]["engines"][number] & {
  groupName: string;
  era: string;
  failureNote: string;
};

type FuelTab = {
  key: FuelTabKey;
  title: string;
  subtitle: string;
  engines: EngineCardData[];
};

function normalize(value?: string) {
  return (value ?? "").replace(/[–—]/g, "-").trim();
}

function priceOnly(value?: string) {
  return normalize(value).replace(/\s*\(?\s*supply\s+only\s*\)?/gi, "").trim();
}

function ctaText(value?: string) {
  return normalize(value).replace(/^(?:(?:→|->|➜|➝|⇒)\s*)+/, "").trim();
}

function splitHeading(section: EngineCodesData) {
  return section.headingLines?.length
    ? section.headingLines
    : section.h2
        .split(/\s+-\s+/)
        .map((line) => line.trim())
        .filter(Boolean);
}

function fuelTabKey(fuel: string): FuelTabKey {
  if (/hybrid|electric|phev|mhev|bev/i.test(fuel)) return "hybrid";
  if (/petrol|gasoline/i.test(fuel)) return "petrol";
  return "diesel";
}

function buildTabs(section: EngineCodesData): FuelTab[] {
  const labels: Record<FuelTabKey, Omit<FuelTab, "key" | "engines">> = {
    diesel: { title: "Diesel Engines", subtitle: "Most replaced in the UK" },
    petrol: { title: "Petrol Engines", subtitle: "Most replaced in the UK" },
    hybrid: {
      title: "Hybrid & Electrified Engines",
      subtitle: "Most replaced in the UK",
    },
  };
  const enginesByFuel = new Map<FuelTabKey, EngineCardData[]>();

  section.groups.forEach((group) => {
    group.engines.forEach((engine) => {
      const key = fuelTabKey(engine.fuel);
      enginesByFuel.set(key, [
        ...(enginesByFuel.get(key) ?? []),
        {
          ...engine,
          groupName: group.name,
          era: group.era,
          failureNote: group.failureNote,
        },
      ]);
    });
  });

  return (["diesel", "petrol", "hybrid"] as const)
    .map((key) => ({ key, ...labels[key], engines: enginesByFuel.get(key) ?? [] }))
    .filter((tab) => tab.engines.length);
}

function EngineIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <path
        d="M8 19h8l4-5h10l4 5h6v16H8V19Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M14 19v-5M34 19v-5M18 35v5M31 35v5M40 24h5v7h-5M12 25h8v6h-8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FuelIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <path
        d="M8 28V6h13v22M8 10h13M21 10h4l3 4v10a2 2 0 1 1-4 0v-7h-3"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11 14h7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function CubeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="m12 3 7 4v10l-7 4-7-4V7l7-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m5 7 7 4 7-4M12 11v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M5 5h14v15H5zM8 3v4M16 3v4M5 9h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TabIcon({ type, className }: { type: FuelTabKey; className?: string }) {
  if (type === "petrol") return <FuelIcon className={className} />;
  if (type === "hybrid") return <MdOutlineElectricMeter className={className ?? "h-7 w-7"} aria-hidden="true" />;
  return <EngineIcon className={className} />;
}

function EngineCard({
  engine,
  expanded,
  onToggle,
}: {
  engine: EngineCardData;
  expanded: boolean;
  onToggle: () => void;
}) {
  const history = normalize(engine.compatibleModels);

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#cbd5e1] bg-[linear-gradient(135deg,rgba(252,254,255,0.96)_0%,rgba(241,248,253,0.92)_52%,rgba(250,253,255,0.96)_100%)] p-4 text-[#111827] shadow-[inset_1px_1px_0_rgba(255,255,255,0.9),inset_-1px_-1px_0_rgba(255,255,255,0.58),0_8px_18px_rgba(6,26,51,0.1)] backdrop-blur-sm sm:p-4">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span
          data-no-auto-link="true"
          className="rounded-md bg-[linear-gradient(135deg,#08784a,#064f36)] px-2.5 py-1.5 text-[12px] font-extrabold leading-none text-white"
        >
          {normalize(engine.code)}
        </span>
        <span className="inline-block min-w-0 max-w-[150px] truncate rounded-md bg-[#123f91] px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.05em] text-white">
          {normalize(engine.size)} {normalize(engine.fuel)}
        </span>
      </div>

      <div className="mt-4 grid min-h-[132px] grid-cols-[minmax(96px,1fr)_minmax(92px,auto)] gap-2.5">
        <div className="relative h-[132px] min-w-[96px] overflow-hidden rounded-lg bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.92)_0%,rgba(247,251,255,0.58)_52%,rgba(247,251,255,0)_100%)]">
          <img
            src={ENGINE_IMAGE}
            alt={`${engine.code} engine`}
            loading="lazy"
            width="160"
            height="132"
            className="absolute inset-0 h-full w-full object-contain p-0.5 mix-blend-multiply opacity-90 drop-shadow-[0_12px_14px_rgba(6,26,51,0.14)]"
          />
        </div>
        <dl className="grid content-center gap-2 text-[13px] leading-[1.25] text-[#111827]">
          <div className="flex items-center gap-1.5">
            <MdOutlineElectricMeter className="h-[18px] w-[18px] shrink-0 text-[#0b5aa1]" />
            <dd>{normalize(engine.power)}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <FuelIcon className="h-[18px] w-[18px] shrink-0 text-[#0b5aa1]" />
            <dd>{normalize(engine.fuel)}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <CubeIcon className="h-[18px] w-[18px] shrink-0 text-[#0b5aa1]" />
            <dd>{normalize(engine.size)}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-[18px] w-[18px] shrink-0 text-[#0b5aa1]" />
            <dd className="min-w-0 line-clamp-2">{normalize(engine.era)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-3 border-t border-[#d8e7f3] pt-2.5">
        <p className="text-[13px] font-extrabold text-[#111827]">History:</p>
        <div className="relative pr-6">
          <p className={`${expanded ? "" : "line-clamp-3"} mt-1 text-[13px] leading-[1.5] text-[#1f2937]`}>
          {history}
          </p>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-label={`${expanded ? "Hide" : "Show"} ${engine.code} history`}
          className="absolute bottom-0 right-0 inline-flex h-5 w-5 items-center justify-center rounded-full text-[18px] text-[#111827] transition hover:bg-[#edf7ff] hover:text-[#08784a]"
        >
          {expanded ? <CiCircleChevUp /> : <CiCircleChevDown />}
        </button>
        </div>
      </div>

      {expanded ? (
        <div className="mt-2 rounded-lg border border-[#cfe4f5] bg-[#f8fbff] p-3 text-[12px] leading-[1.5] text-[#1f2937]">
          <p>
            <span className="font-extrabold text-[#111827]">Engine family: </span>
            {normalize(engine.groupName)}
          </p>
          <p className="mt-2">
            <span className="font-extrabold text-[#111827]">Compatible models: </span>
            {normalize(engine.compatibleModels)}
          </p>
          <p className="mt-2">
            <span className="font-extrabold text-[#111827]">Known failures: </span>
            {normalize(engine.failureNote)}
          </p>
        </div>
      ) : null}

      <div className="mt-auto border-t border-[#d8e7f3] pt-2.5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#627b99]">
          Avg. rebuilt price
        </p>
        <div className="mt-1 flex flex-nowrap items-center justify-between gap-1.5">
          <p className="flex shrink-0 items-baseline gap-1 whitespace-nowrap font-extrabold leading-tight text-[#08784a]">
            <span className="text-[16px] sm:text-[19px]">{priceOnly(engine.avgRebuiltPrice)}</span>
            <span className="whitespace-nowrap text-[9px] font-semibold normal-case tracking-normal text-[#8b98a8]">(supply only)</span>
          </p>
          <a
            href="#quote-form"
            data-quote-engine-code={engine.code}
            className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[10px] font-extrabold text-[#06265a] hover:text-[#08784a] sm:text-[11px]"
          >
            <span>View Details</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
        <a
          href="#quote-form"
          data-quote-engine-code={engine.code}
          className="mt-2 inline-flex min-h-[38px] w-full items-center justify-center gap-1 rounded-md border border-[#8bbca9] bg-white px-2 py-2 text-center text-[12px] font-extrabold leading-tight text-[#0b7650] transition hover:bg-[#f0faf5]"
        >
          <span className="min-w-0 truncate">{ctaText(engine.cta)}</span>
        </a>
      </div>
    </article>
  );
}
export default function NewDocBrandEngineCodes({ data }: Props) {
  const section = data.sections.engineCodes;
  const tabs = useMemo(() => buildTabs(section), [section]);
  const headingLines = splitHeading(section);
  const headingParts = splitBrandHeading(headingLines[0] ?? section.h2);
  const heroImage = ENGINE_IMAGE;
  const [activeTab, setActiveTab] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const currentTab = tabs[Math.min(activeTab, Math.max(tabs.length - 1, 0))];
  const engines = currentTab?.engines ?? [];
  const visibleEngines = engines.length <= cardsPerView
    ? engines
    : Array.from({ length: Math.min(cardsPerView, engines.length) }, (_, index) => engines[(startIndex + index) % engines.length]);
  const pageCount = Math.max(1, Math.ceil(engines.length / cardsPerView));
  const activePage = Math.min(pageCount - 1, Math.floor(startIndex / cardsPerView));

  useEffect(() => {
    const syncCardsPerView = () => {
      setCardsPerView(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4);
    };
    syncCardsPerView();
    window.addEventListener("resize", syncCardsPerView);
    return () => window.removeEventListener("resize", syncCardsPerView);
  }, []);

  if (!currentTab) return null;

  const moveCards = (direction: "previous" | "next") => {
    setStartIndex((current) => {
      if (!engines.length) return 0;
      const step = Math.min(cardsPerView, engines.length);
      return direction === "previous"
        ? (current - step + engines.length) % engines.length
        : (current + step) % engines.length;
    });
    setExpandedCode(null);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (cardsPerView !== 1 || engines.length <= 1) return;
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX === null || cardsPerView !== 1 || engines.length <= 1) return;

    const endX = event.changedTouches[0]?.clientX;
    if (endX === undefined || Math.abs(endX - startX) < 40) return;
    moveCards(endX < startX ? "next" : "previous");
  };

  return (
    <section id="brand-engine-codes" className="relative overflow-hidden bg-white px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-7">
      <ModelMobileAccordion
        title={normalize(headingLines[0] ?? section.h2)}
        icon={<EngineIcon className="h-5 w-5" />}
        buttonClassName="!-my-[14px]"
      >
        <div className="pointer-events-none absolute right-0 top-0 z-0 h-[210px] w-full opacity-25 sm:h-[240px] sm:opacity-30 md:right-[max(1rem,calc((100vw-80rem)/2+1rem))] md:top-[12px] md:h-[220px] md:w-[430px] md:overflow-hidden md:opacity-70">
          {heroImage ? <Image src={heroImage} alt="" fill className="object-contain object-right-top p-4 mix-blend-multiply [mask-image:linear-gradient(to_bottom,black_50%,transparent)]" sizes="430px" /> : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.52)_0%,rgba(255,255,255,0.76)_55%,#fff_100%)] lg:bg-none" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="max-w-[760px]">
            <span className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#042f5a,#075b94)] px-3.5 py-1.5 text-[13px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_4px_14px_rgba(9,39,71,0.18)]">{section.tag}</span>
            <h2 style={{ fontFamily: '"Bebas Neue", "Urbanist", ui-sans-serif, system-ui, sans-serif', letterSpacing: "0.01em" }} className="mt-5 !text-[40px] font-extrabold leading-[1.02] tracking-normal !tracking-[-0.02em] text-[#09264e] sm:!tracking-[0.01em] sm:!text-[41px] lg:!text-[46px]">
              {headingLines.length > 1 ? (
                headingLines.map((line, index) => <span key={`${line}-${index}`} className={`block ${index === headingLines.length - 1 ? "text-[#15803d]" : ""}`}>{normalize(line)}</span>)
              ) : (
                <>
                  <span>{normalize(headingParts.primary)}</span>{" "}
                  {headingParts.accent ? <span className="text-[#15803d]">{normalize(headingParts.accent)}</span> : null}
                </>
              )}
            </h2>
            <p className="mt-4 max-w-[760px] text-[14px] leading-[1.6] text-[#4b6380] lg:text-[15px]">{normalize(section.h3)}</p>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-[#b8d9f2] bg-white shadow-[0_12px_28px_rgba(6,26,51,0.08)]">
            <div className="grid divide-x divide-[#cfe4f5]" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
              {tabs.map((tab, index) => {
                const active = index === activeTab;
                return <button key={tab.key} type="button" onClick={() => { setActiveTab(index); setStartIndex(0); setExpandedCode(null); }} className={`relative flex min-h-[46px] min-w-0 items-center justify-between gap-1.5 overflow-hidden px-1.5 py-1.5 text-left transition after:w-10 sm:min-h-[62px] sm:gap-2 sm:px-4 sm:py-2 sm:after:w-20 ${active ? "bg-[#061a33] text-white after:absolute after:inset-y-0 after:right-0 after:bg-[linear-gradient(115deg,transparent_0%,rgba(23,133,255,0.56)_55%,rgba(35,156,255,0.22)_100%)] after:[clip-path:polygon(0_0,65%_0,100%_50%,65%_100%,0_100%,25%_50%)] after:content-['']" : "bg-white text-[#061a33] hover:bg-slate-50"}`}>
                  <span className="relative z-10 flex min-w-0 items-center gap-1.5 sm:gap-2"><TabIcon type={tab.key} className="h-5 w-5 sm:h-7 sm:w-7" /><span className="min-w-0"><span className="block whitespace-nowrap text-[12px] font-extrabold leading-tight sm:text-[14px]"><span className="sm:hidden">{tab.key === "diesel" ? "Diesel" : tab.key === "petrol" ? "Petrol" : "Hybrid"}</span><span className="hidden sm:inline">{tab.title}</span></span><span className={`mt-0.5 hidden text-[10px] leading-tight sm:block ${active ? "text-white/80" : "text-[#6380a1]"}`}>{tab.subtitle}</span></span></span>
                </button>;
              })}
            </div>
            <div className="relative border-t border-white/15 bg-[linear-gradient(135deg,rgba(6,26,51,0.98),rgba(12,50,107,0.9))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:p-4">
              {engines.length > cardsPerView ? <button type="button" onClick={() => moveCards("previous")} aria-label="Previous engines" className="absolute left-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-[#06265a] text-white shadow-lg sm:grid lg:left-3"><FiChevronLeft /></button> : null}
              <div
                className="grid touch-pan-y gap-3 sm:grid-cols-2 lg:grid-cols-4"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={() => {
                  touchStartX.current = null;
                }}
              >
                {visibleEngines.map((engine) => <EngineCard key={engine.code} engine={engine} expanded={expandedCode === engine.code} onToggle={() => setExpandedCode((current) => current === engine.code ? null : engine.code)} />)}
              </div>
              <div className="mt-3 flex items-center justify-center gap-2" aria-label={`${engines.length} engine cards`}>
                {Array.from({ length: pageCount }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setStartIndex(index * cardsPerView);
                      setExpandedCode(null);
                    }}
                    aria-label={`Show engine card page ${index + 1}`}
                    aria-current={index === activePage ? "true" : undefined}
                    className={`h-2.5 w-2.5 rounded-full transition ${index === activePage ? "bg-white shadow-[0_0_12px_rgba(255,255,255,0.75)]" : "bg-white/45 hover:bg-white/75"}`}
                  />
                ))}
              </div>
              {engines.length > cardsPerView ? <button type="button" onClick={() => moveCards("next")} aria-label="Next engines" className="absolute right-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-[#06265a] text-white shadow-lg sm:grid lg:right-3"><FiChevronRight /></button> : null}
            </div>
          </div>
        </div>
      </ModelMobileAccordion>
    </section>
  );
}
