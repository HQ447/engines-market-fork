"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LiveMarketPriceEntry, LiveMarketPricesData, ModelsSectionData } from "@/types/brand";
import { CtaStrip } from "@/components/ui/CalloutCards";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

type Props = {
  data: LiveMarketPricesData;
  modelCards?: ModelsSectionData["cards"];
  imageSrc?: string;
  displayMode?: "brand" | "document";
  initialTimestamp?: string;
  mobileHeadingOverride?: string;
  newDesignMode?: boolean;
};

type FeedRow = LiveMarketPriceEntry & {
  timestamp: Date;
};

type FilterTab = {
  key: string;
  label: string;
  matchers: string[];
};

type NotesConfig = {
  title: string;
  items: string[];
};

const TAB_GAP_PX = 6;
const MOBILE_BREAKPOINT_PX = 640;
const DROPDOWN_ITEM_HEIGHT_PX = 40;
const DROPDOWN_ITEM_GAP_PX = 4;
const DROPDOWN_PADDING_PX = 16;
const GENERIC_MATCHERS = new Set(["series", "class", "engine", "engines", "model", "models"]);

function normalizeFilterText(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/mercedes-benz/g, "mercedes")
    .replace(/mercedes benz/g, "mercedes")
    .replace(/rolls-royce/g, "rolls royce")
    .replace(/a-class/g, "a class")
    .replace(/b-class/g, "b class")
    .replace(/c-class/g, "c class")
    .replace(/e-class/g, "e class")
    .replace(/g-class/g, "g class")
    .replace(/s-class/g, "s class")
    .replace(/glc-class/g, "glc class")
    .replace(/gla-class/g, "gla class")
    .replace(/gle-class/g, "gle class")
    .replace(/glk-class/g, "glk class")
    .replace(/m-class/g, "m class")
    .replace(/r-class/g, "r class")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function RefreshIcon({ spinning = false }: { spinning?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-[13px] w-[13px] ${spinning ? "animate-spin" : ""}`}
      fill="none"
      aria-hidden="true"
    >
      <path d="M23 4v6h-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 20v-6h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-[12px] w-[12px] transition ${open ? "rotate-180" : ""}`}
      fill="none"
      aria-hidden="true"
    >
      <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoAlertIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7.5h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function MarketPulseIcon({ className = "h-[15px] w-[15px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4 18h16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M7 16V9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M12 16V6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M17 16v-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function buildFeedRows(
  entries: LiveMarketPriceEntry[],
  density: "standard" | "premium",
  visibleRows: number,
  refreshSeed: number,
  clock: Date,
) {
  if (!entries.length) return [];

  const gaps = density === "premium" ? [6, 8, 11, 15, 19, 24] : [12, 16, 21, 28, 36];
  const startIndex =
    ((clock.getUTCHours() * 11) + (clock.getUTCDate() * 7) + refreshSeed * visibleRows) % entries.length;

  let elapsedMinutes = density === "premium" ? 3 : 9;
  const rows: FeedRow[] = [];

  for (let index = 0; index < visibleRows; index += 1) {
    const entry = entries[(startIndex + index) % entries.length];
    elapsedMinutes += gaps[(index + refreshSeed) % gaps.length];

    rows.push({
      ...entry,
      timestamp: new Date(clock.getTime() - elapsedMinutes * 60_000),
    });
  }

  return rows;
}

function cleanModelLabel(label: string) {
  return label
    .replace(/\s+Engine Replacement$/i, "")
    .replace(/\s+Engines?$/i, "")
    .replace(/^BMW\s+/i, "")
    .replace(/^Land Rover\s+/i, "")
    .replace(/^Range Rover\s+/i, "")
    .trim();
}

function sanitizeMatchers(label: string, matchers: string[]) {
  const labelMatcher = normalizeFilterText(label);
  const deduped = new Set<string>();

  for (const matcher of [labelMatcher, ...matchers.map((value) => normalizeFilterText(value))]) {
    if (!matcher) continue;
    if (GENERIC_MATCHERS.has(matcher)) continue;

    const parts = matcher.split(" ").filter(Boolean);
    if (parts.length === 1 && !/\d/.test(parts[0]) && parts[0].length < 4) continue;

    deduped.add(matcher);
  }

  return [...deduped];
}

function buildFilterTabs(modelCards?: ModelsSectionData["cards"]): FilterTab[] {
  if (!modelCards?.length) return [];

  const tabs = modelCards.map((card) => {
    const label = cleanModelLabel(card.h3);
    const slugWords = cleanModelLabel(card.slug.replace(/-/g, " ").trim());

    return {
      key: card.slug,
      label,
      matchers: sanitizeMatchers(label, [slugWords]),
    };
  });

  return [
    {
      key: "all",
      label: "All",
      matchers: [],
    },
    ...tabs,
  ];
}

function sanitizeFilterTabs(filterTabs: FilterTab[]) {
  return filterTabs.map((tab) => {
    if (tab.key === "all") {
      return {
        ...tab,
        label: "All",
      };
    }

    return {
      ...tab,
      label: cleanModelLabel(tab.label),
      matchers: sanitizeMatchers(tab.label, tab.matchers),
    };
  });
}

function formatUpdatedAt(clock: Date) {
  void clock;
  return "4 Aug 26, 9:26";
}

function renderHeadingWithAccent(line: string) {
  const parts = line.split(/(Quotes & Price Guide|Engine Replacement)/);

  return parts.map((part, index) =>
    part === "Engine Replacement" || part === "Quotes & Price Guide" ? (
      <span key={`${part}-${index}`} className="text-[#15803d]">
        {part}
      </span>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
}

export default function LiveMarketPricesSection({
  data,
  modelCards,
  imageSrc,
  displayMode = "brand",
  initialTimestamp,
  mobileHeadingOverride,
  newDesignMode = false,
}: Props) {
  const [clock, setClock] = useState(() => new Date(initialTimestamp ?? "2025-01-01T12:00:00.000Z"));
  const [activeTab, setActiveTab] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [visibleTabCount, setVisibleTabCount] = useState(4);
  const [dropdownMaxVisibleItems, setDropdownMaxVisibleItems] = useState(13);
  const isDocumentMode = displayMode === "document";
  const tabBarRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setClock(new Date());
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const filterTabs = useMemo(
    () => sanitizeFilterTabs(data.filterTabs?.length ? data.filterTabs : buildFilterTabs(modelCards)),
    [data.filterTabs, modelCards],
  );
  const activeFilter = filterTabs.find((tab) => tab.key === activeTab) ?? filterTabs[0] ?? null;
  const ui = data.ui ?? {};
  const notes = (data as LiveMarketPricesData & { notes?: NotesConfig }).notes;
  const modelTabs = filterTabs.filter((tab) => tab.key !== "all");

  const modelEntryCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const tab of modelTabs) {
      const count = data.feed.entries.reduce((total, row) => {
        const model = normalizeFilterText(row.Model);
        return total + (tab.matchers.some((matcher) => model.includes(matcher)) ? 1 : 0);
      }, 0);

      counts.set(tab.key, count);
    }

    return counts;
  }, [data.feed.entries, modelTabs]);

  const rankedTabs = useMemo(() => {
    return [...modelTabs].sort((left, right) => {
      const countDiff = (modelEntryCounts.get(right.key) ?? 0) - (modelEntryCounts.get(left.key) ?? 0);
      if (countDiff !== 0) return countDiff;
      return left.label.localeCompare(right.label, "en", { sensitivity: "base" });
    });
  }, [modelEntryCounts, modelTabs]);

  const dropdownTabs = useMemo(() => {
    return [...modelTabs].sort((left, right) => left.label.localeCompare(right.label, "en", { sensitivity: "base" }));
  }, [modelTabs]);

  const filteredEntries = useMemo(() => {
    if (!activeFilter || activeFilter.key === "all") return data.feed.entries;

    return data.feed.entries.filter((row) => {
      const model = normalizeFilterText(row.Model);
      return activeFilter.matchers.some((matcher) => model.includes(matcher));
    });
  }, [activeFilter, data.feed.entries]);

  const visibleRows = useMemo(() => {
    const visibleRowCount = Math.min(data.feed.visibleRows, filteredEntries.length || data.feed.visibleRows);
    return buildFeedRows(filteredEntries, data.feed.density, visibleRowCount, 0, clock);
  }, [clock, data.feed.density, data.feed.visibleRows, filteredEntries]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateDropdownLimit = () => {
      setDropdownMaxVisibleItems(window.innerWidth < MOBILE_BREAKPOINT_PX ? 5 : 13);
    };

    updateDropdownLimit();
    window.addEventListener("resize", updateDropdownLimit);
    return () => window.removeEventListener("resize", updateDropdownLimit);
  }, []);

  useEffect(() => {
    if (isDocumentMode) return;
    if (!tabBarRef.current || !measureRef.current) return;

    const recomputeVisibleTabs = () => {
      const barWidth = tabBarRef.current?.clientWidth ?? 0;
      const measureElements = Array.from(
        measureRef.current?.querySelectorAll<HTMLElement>("[data-measure-key]") ?? [],
      );

      if (!barWidth || !measureElements.length) {
        setVisibleTabCount(4);
        return;
      }

      const widthMap = new Map(
        measureElements.map((element) => [element.dataset.measureKey ?? "", element.offsetWidth]),
      );
      const allWidth = widthMap.get("all") ?? 0;
      const moreWidth = widthMap.get("more") ?? 0;

      let fitWithoutDropdown = 0;
      let usedWithoutDropdown = allWidth;

      for (const tab of rankedTabs) {
        const tabWidth = widthMap.get(tab.key) ?? 0;
        const nextUsed = usedWithoutDropdown + TAB_GAP_PX + tabWidth;

        if (nextUsed > barWidth) break;
        usedWithoutDropdown = nextUsed;
        fitWithoutDropdown += 1;
      }

      if (fitWithoutDropdown >= rankedTabs.length) {
        setVisibleTabCount(fitWithoutDropdown);
        return;
      }

      let fitWithDropdown = 0;
      let usedWithDropdown = allWidth;

      for (const tab of rankedTabs) {
        const tabWidth = widthMap.get(tab.key) ?? 0;
        const nextUsed = usedWithDropdown + TAB_GAP_PX + tabWidth;
        const requiredWithMore = nextUsed + TAB_GAP_PX + moreWidth;

        if (requiredWithMore > barWidth) break;
        usedWithDropdown = nextUsed;
        fitWithDropdown += 1;
      }

      setVisibleTabCount(fitWithDropdown);
    };

    recomputeVisibleTabs();

    const observer = new ResizeObserver(() => {
      recomputeVisibleTabs();
    });

    observer.observe(tabBarRef.current);
    return () => observer.disconnect();
  }, [isDocumentMode, rankedTabs]);

  useEffect(() => {
    if (!notesOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNotesOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [notesOpen]);

  const pinnedTabs = rankedTabs.slice(0, visibleTabCount);
  const overflowTabs = visibleTabCount < rankedTabs.length ? dropdownTabs : [];
  const dropdownMaxHeight =
    dropdownMaxVisibleItems * DROPDOWN_ITEM_HEIGHT_PX +
    Math.max(0, dropdownMaxVisibleItems - 1) * DROPDOWN_ITEM_GAP_PX +
    DROPDOWN_PADDING_PX;

  const headingLines = data.headingLines?.length ? data.headingLines : [data.h2];
  const sectionImage = imageSrc || "";
  const gridClass = isDocumentMode
    ? "lg:grid-cols-[400px_minmax(0,1fr)] lg:items-stretch"
    : "lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-stretch";
  const imageColumnClass = isDocumentMode ? "order-2 w-full lg:order-none lg:flex lg:h-full lg:min-h-[792px]" : "w-full lg:h-full";
  const imageFrameClass = isDocumentMode
    ? "overflow-hidden rounded-[12px] border border-[#e4edf5] bg-white shadow-[0_14px_32px_rgba(13,27,46,0.08)] lg:flex lg:h-full lg:w-full"
    : "";
  const brandImageClass = "h-full min-h-[320px] w-full object-center lg:min-h-[370px]";
  const feedColumnClass = isDocumentMode
    ? "order-1 min-w-0 lg:order-none lg:flex lg:h-full lg:flex-col lg:min-h-[792px]"
    : "min-w-0 lg:flex lg:h-full lg:flex-col lg:min-h-[370px]";
  const imageSizes = isDocumentMode ? "(max-width: 1024px) 100vw, 34vw" : "(max-width: 1024px) 100vw, 48vw";
  const feedPanelClass = isDocumentMode
    ? "overflow-hidden rounded-b-[14px] border border-[#102845] border-t-0 bg-[linear-gradient(180deg,#10243e_0%,#0c1c31_46%,#091523_100%)] shadow-[0_18px_42px_rgba(9,21,35,0.34)] lg:flex lg:flex-1 lg:flex-col lg:min-h-[792px]"
    : "overflow-hidden rounded-b-[14px] border border-white/10 bg-gradient-to-br from-[#0b1a2e] via-[#0f2035] to-[#0a1628] shadow-[0_10px_28px_rgba(0,0,0,0.4)] lg:flex lg:flex-1 lg:flex-col lg:min-h-[370px]";
  const feedScrollClass = isDocumentMode
    ? "max-h-[440px] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(103,199,255,0.4)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#67c7ff]/50 [&::-webkit-scrollbar-thumb]:hover:bg-[#67c7ff]/75 lg:max-h-[740px] lg:flex-1"
    : "max-h-[440px] overflow-y-auto lg:max-h-none lg:flex-1";
  const documentContainerClass = newDesignMode
    ? "max-w-7xl !px-4 sm:!px-6 lg:!px-8"
    : "max-w-[1400px] px-0 sm:px-0 lg:px-0";
  const headingClass = newDesignMode
    ? "max-w-[760px] font-['Manrope'] !text-[34px] font-extrabold leading-[1.04] tracking-[-0.04em] text-[#0d1b2e] lg:!text-[40px] lg:leading-[1.04]"
    : "max-w-[700px] font-['Manrope'] text-[26px] font-extrabold leading-[1.18] tracking-[-0.4px] text-[#0d1b2e] md:text-[30px] md:tracking-[-0.7px] lg:text-[43px] lg:leading-[1.06] lg:tracking-[-1px]";

  return (
    <Section className={newDesignMode ? "bg-[#f2f8fe] py-9 sm:py-10 lg:py-12" : "bg-[#f8f9fa]"}>
      <Container className={isDocumentMode ? documentContainerClass : "!max-w-[1240px]"}>
        <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#1289d5]/40 bg-[#06244d]/95 px-3.5 py-1.5 text-[14px] font-bold uppercase text-[white] shadow-[0_0_20px_rgba(26,145,232,0.25)] sm:mb-5 sm:text-[13px]">
          <span>{data.tag}</span>
        </div>

        {mobileHeadingOverride ? (
          <>
            <h2 className={`${headingClass} sm:hidden`}>
              {renderHeadingWithAccent(mobileHeadingOverride)}
            </h2>
            <h2 className={`hidden ${headingClass} sm:block`}>
              {headingLines.map((line, index) => {
                const isAccent = headingLines.length > 1 && index === headingLines.length - 1;
                return (
                  <span key={`${line}-${index}`} className={`block ${isAccent ? "text-[#15803d]" : ""}`}>
                    {renderHeadingWithAccent(line)}
                  </span>
                );
              })}
            </h2>
          </>
        ) : (
          <h2 className={headingClass}>
            {headingLines.map((line, index) => {
              const isAccent = headingLines.length > 1 && index === headingLines.length - 1;
              return (
                <span key={`${line}-${index}`} className={`block ${isAccent ? "text-[#15803d]" : ""}`}>
                  {line}
                </span>
              );
            })}
          </h2>
        )}

        <p className="mt-[10px] max-w-[700px] text-[13px] leading-[1.6] text-[#6b7280] md:text-[14px]">
          {data.h3}
        </p>

        <div className={`mt-6 grid gap-5 ${gridClass}`}>
          {isDocumentMode ? (
            <div className={imageColumnClass}>
              <div className={imageFrameClass}>
                {sectionImage ? (
                  <div className="w-full lg:relative lg:h-full lg:min-h-[792px]">
                    <Image
                      src={sectionImage}
                      alt={data.imageAlt ?? ""}
                      width={960}
                      height={1400}
                      className="block h-auto w-full object-contain lg:hidden"
                      sizes="100vw"
                    />
                    <div className="hidden lg:block lg:h-full lg:min-h-[792px]">
                      <Image
                        src={sectionImage}
                        alt={data.imageAlt ?? ""}
                        fill
                        className="scale-[1.01] object-cover object-top"
                        sizes={imageSizes}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : sectionImage ? (
            <Image
              src={sectionImage}
              alt={data.imageAlt ?? ""}
              width={960}
              height={720}
              className={brandImageClass}
              sizes={imageSizes}
            />
          ) : null}

          <div className={feedColumnClass}>
            {isDocumentMode ? (
              <div className="relative z-20 rounded-t-[14px] border border-[#2e5c99] border-b-0 bg-[linear-gradient(180deg,#14325a_0%,#10243e_100%)] px-4 py-[12px] shadow-[0_0_0_1px_rgba(82,169,255,0.18),0_12px_28px_rgba(13,27,46,0.24)] sm:px-5 sm:py-[14px]">
                <div className="flex items-center gap-[9px] text-[10px] font-bold uppercase tracking-[0.1em] text-[#69d4ff] sm:text-[11px]">
                  <span className="grid h-[24px] w-[24px] shrink-0 place-items-center rounded-full bg-[#112948] text-[#69d4ff] shadow-[0_0_14px_rgba(105,212,255,0.26)]">
                    <MarketPulseIcon />
                  </span>
                  <span className="shrink-0">Average Market Prices</span>

                  {filterTabs.length > 1 ? (
                    <div className="relative ml-auto">
                      <button
                        type="button"
                        onClick={() => setDrawerOpen((current) => !current)}
                        className="inline-flex max-w-[132px] items-center justify-between gap-2 rounded-full border border-white/15 bg-white/[0.08] px-2.5 py-1.5 text-[9.5px] font-bold normal-case tracking-normal text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:bg-white/[0.12] sm:max-w-[180px] sm:text-[10.5px]"
                        aria-expanded={drawerOpen}
                      >
                        <span className="truncate">{activeFilter?.key === "all" ? "BMW Models" : activeFilter?.label}</span>
                        <ChevronDownIcon open={drawerOpen} />
                      </button>

                      {drawerOpen ? (
                        <div
                          className="absolute right-0 top-[calc(100%+8px)] z-30 flex min-w-[190px] flex-col gap-1 overflow-y-auto rounded-[12px] border border-[#dbe7f6] bg-white p-2 shadow-[0_18px_38px_rgba(5,17,35,0.24)]"
                          style={{ maxHeight: `${dropdownMaxHeight}px` }}
                        >
                          {filterTabs.map((tab) => (
                            <button
                              key={tab.key}
                              type="button"
                              onClick={() => {
                                setActiveTab(tab.key);
                                setDrawerOpen(false);
                              }}
                              className={`rounded-[9px] px-3 py-[9px] text-left text-[11px] font-bold transition ${
                                activeTab === tab.key
                                  ? "bg-[#0d1b2e] text-white"
                                  : "text-[#0d1b2e] hover:bg-[#f2f7fb]"
                              }`}
                            >
                              {tab.key === "all" ? "All BMW Models" : tab.label}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : filterTabs.length ? (
              <div className="rounded-[10px] bg-[#0d1b2e] p-[10px] shadow-[0_2px_12px_rgba(13,27,46,0.16)]">
                <div ref={tabBarRef} className="flex items-center gap-[6px]">
                  <div className="flex min-w-0 flex-1 items-center gap-[6px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {[filterTabs[0], ...pinnedTabs].filter(Boolean).map((tab) => {
                      if (!tab) return null;
                      const active = activeTab === tab.key;

                      return (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => {
                            setActiveTab(tab.key);
                            setDrawerOpen(false);
                          }}
                          className={`flex-none rounded-full border px-[12px] py-[7px] text-[11.5px] font-medium transition ${
                            active
                              ? "border-[#15803d] bg-[#15803d] text-white"
                              : "border-white/15 bg-transparent text-white/80 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {overflowTabs.length ? (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setDrawerOpen((current) => !current)}
                        className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
                      >
                        <ChevronDownIcon open={drawerOpen} />
                      </button>

                      {drawerOpen ? (
                        <div
                          className="absolute right-0 top-[calc(100%+8px)] z-20 flex min-w-[180px] flex-col gap-1 overflow-y-auto rounded-[12px] border border-[#e5e7eb] bg-white p-2 shadow-[0_14px_34px_rgba(13,27,46,0.16)]"
                          style={{ maxHeight: `${dropdownMaxHeight}px` }}
                        >
                          {overflowTabs.map((tab) => (
                            <button
                              key={tab.key}
                              type="button"
                              onClick={() => {
                                setActiveTab(tab.key);
                                setDrawerOpen(false);
                              }}
                              className="rounded-[9px] px-3 py-[10px] text-left text-[11px] font-bold text-[#0d1b2e] transition hover:bg-[#f8fafc]"
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div ref={measureRef} className="pointer-events-none absolute left-[-9999px] top-[-9999px] opacity-0">
                  <div className="flex items-center gap-[6px]">
                    {[filterTabs[0], ...rankedTabs].filter(Boolean).map((tab) => (
                      <span
                        key={`measure-${tab?.key ?? "unknown"}`}
                        data-measure-key={tab?.key ?? "unknown"}
                        className="flex-none rounded-full border px-[12px] py-[7px] text-[11.5px] font-medium"
                      >
                        {tab?.label}
                      </span>
                    ))}
                    <span
                      data-measure-key="more"
                      className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full border"
                    >
                      <ChevronDownIcon open={false} />
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="space-y-2 lg:flex lg:h-full lg:flex-col lg:space-y-0">
              <div className={feedPanelClass}>
                {isDocumentMode ? null : (
                  <div className="border-b border-[#e4e7ee] bg-[#f9fafc] px-4 py-[10px] text-[11px] font-medium text-[#9aa3b5]">
                    Showing {visibleRows.length} {visibleRows.length === 1 ? (ui.showingSingleLabel ?? "entry") : (ui.showingPluralLabel ?? "entries")}
                    {activeFilter?.key && activeFilter.key !== "all"
                      ? ` for ${activeFilter.label}`
                      : ` ${ui.acrossAllLabel ?? "across all models"}`}
                  </div>
                )}

                <div className={feedScrollClass}>
                  {visibleRows.length ? (
                    <ul className="list-none">
                      {visibleRows.map((row, index) => (
                        <li
                          key={`${row.Year}-${row.Model}-${row["Engine Code"]}-${index}`}
                          className="border-b border-white/10 px-[16px] py-[13px] transition hover:bg-[rgba(105,212,255,0.05)] last:border-b-0 md:px-[18px]"
                        >
                          <div className="mb-[5px] flex items-baseline justify-between gap-[10px]">
                            <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-white md:text-[14.5px]">
                              {row.Model}
                            </span>
                            <span className="flex-none whitespace-nowrap text-[11px] font-medium text-white/75">
                              {row.Year}
                            </span>
                            <span className="flex-none whitespace-nowrap text-[16px] font-extrabold text-[#35df77] [text-shadow:0_0_12px_rgba(53,223,119,0.22)]">
                              {row["Avg. Quoted Price"]}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-[8px]">
                            <span className="min-w-0 flex-1 truncate text-[11.5px] text-white/76">
                              {row["Reported Issue"]}
                            </span>
                            <div className="flex flex-none gap-[5px]">
                              <span className="rounded-full border border-white/12 bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold text-white/78">
                                {row["Engine Code"]}
                              </span>
                              <span className="rounded-full border border-white/12 bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold text-white/78">
                                {row.Fuel}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-10 text-center text-[13px] text-[#5a6478]">
                      {isDocumentMode ? (ui.noEntriesLabel || "") : (ui.noEntriesLabel ?? "No entries match that model filter yet.")}
                    </div>
                  )}
                </div>

                {isDocumentMode ? null : (
                  <div className="border-t border-[#e4e7ee] bg-[#f9fafc] px-4 py-[10px]">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-[6px] text-[11px] font-medium text-[#9aa3b5]">
                        <RefreshIcon />
                        <span>
                          {ui.updatedLabel ?? "Last updated:"} <span className="font-semibold text-[#6b7280]">{formatUpdatedAt(clock)}</span>
                        </span>
                      </div>

                      {notes?.items?.length ? (
                        <button
                          type="button"
                          onClick={() => setNotesOpen(true)}
                          className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-[#cfd7e3] bg-white text-[#6b7280] transition hover:border-[#0d1b2e] hover:text-[#0d1b2e]"
                          aria-label={`Open ${notes.title}`}
                        >
                          <InfoAlertIcon />
                        </button>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>

              {isDocumentMode ? (
                <div className="px-1 pt-[10px]">
                  <div className="flex items-center gap-[6px] text-[11px] font-medium text-[#42546e]">
                    <RefreshIcon />
                    <span>
                      {(ui.updatedLabel || "Last updated:")}{" "}
                      <span className="font-semibold text-[#0d1b2e]">{formatUpdatedAt(clock)}</span>
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {isDocumentMode ? null : (
          <div className="mt-5">
            <CtaStrip
              tone="light"
              label={ui.ctaLabel ?? "Live Quote Benchmark"}
              title={data.cta.heading}
              description={data.cta.text}
              buttonText={data.cta.buttonText.replace(/\s*->\s*$/, "")}
              linkProps={{
                href: "#quote-form",
                "data-quote-context": data.cta.heading,
                "data-quote-source": "live-market-prices",
              }}
            />
          </div>
        )}
      </Container>

      {notes?.items?.length && notesOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0d1b2e]/60 px-4 py-6"
          onClick={() => setNotesOpen(false)}
        >
          <div
            className="max-h-[min(80vh,720px)] w-full max-w-[720px] overflow-hidden rounded-[18px] bg-white shadow-[0_24px_80px_rgba(13,27,46,0.28)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#e5e7eb] px-5 py-4 md:px-6">
              <div>
                <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#15803d]">Market Notes</div>
                <h3 className="mt-1 text-[20px] font-extrabold text-[#0d1b2e]">{notes.title}</h3>
              </div>

              <button
                type="button"
                onClick={() => setNotesOpen(false)}
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[#d7dde8] text-[#6b7280] transition hover:border-[#0d1b2e] hover:text-[#0d1b2e]"
                aria-label="Close notes"
              >
                <span className="text-lg leading-none">x</span>
              </button>
            </div>

            <div className="max-h-[calc(min(80vh,720px)-88px)] overflow-y-auto px-5 py-4 md:px-6 md:py-5">
              <ul className="space-y-3">
                {notes.items.map((note) => (
                  <li key={note} className="flex items-start gap-3 text-[14px] leading-[1.65] text-[#445065]">
                    <span className="mt-[8px] h-[6px] w-[6px] flex-none rounded-full bg-[#15803d]" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </Section>
  );
}
