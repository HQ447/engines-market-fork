"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { ModelPageData } from "@/types/model";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

type Props = { data: ModelPageData };

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function splitMarketHeading(value: string) {
  const heading = value.replace(/[–—]/g, "-").replace(/-\s*$/, "").trim();
  const match = heading.match(/^(.*?\sfor\s)(.+)$/i);
  return match
    ? { primary: match[1].trim(), accent: match[2].trim() }
    : { primary: heading, accent: "" };
}

function PulseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M4 18h16M7 16V9m5 7V6m5 10v-4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** This document-page copy keeps its type scale and gutters independent of the brand-page widget. */
export default function NewDocModelLiveMarketPrices({ data }: Props) {
  const market = data.sections.liveMarketPrices;
  const [activeTab, setActiveTab] = useState("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const tabs = market.filterTabs?.length
    ? market.filterTabs
    : [{ key: "all", label: "All models", matchers: [] }];
  const currentTab = tabs.find((tab) => tab.key === activeTab) ?? tabs[0];
  const rows = useMemo(
    () =>
      !currentTab || currentTab.key === "all"
        ? market.feed.entries
        : market.feed.entries.filter((row) =>
          currentTab.matchers.some((matcher) =>
            normalize(row.Model).includes(normalize(matcher)),
          ),
        ),
    [currentTab, market.feed.entries],
  );
  const visibleRows = rows.slice(0, market.feed.visibleRows);
  const headingLines = market.headingLines?.length
    ? market.headingLines
    : [market.h2];
  const marketHeading = splitMarketHeading(market.h2);
  const imageSrc = market.imageSrc ?? data.assets.mainImage;

  return (
    <Section className="bg-[#f7f8fb] !px-4 !py-5 sm:!px-6 sm:!py-8 lg:!px-8 lg:!py-10">
      <Container className="!max-w-7xl !px-0">
        <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#1289d5]/40 bg-[linear-gradient(135deg,#042f5a,#075b94)] px-3.5 py-1.5 text-[13px] font-bold uppercase text-white shadow-[0_0_20px_rgba(26,145,232,0.25)]">
          {market.tag}
        </div>
        <h2
          style={{
            fontFamily:
              '"Bebas Neue", "Urbanist", ui-sans-serif, system-ui, sans-serif',
            letterSpacing: "0.01em",
          }}
          className="max-w-[760px] font-[var(--font-urbanist)] !text-[40px] font-extrabold leading-[1.04] tracking-normal text-[#0d1b2e] sm:!text-[41px] lg:!text-[46px]"
        >
          {headingLines.length > 1 ? (
            headingLines.map((line, index) => (
              <span
                key={line}
                className={`block ${index === headingLines.length - 1 ? "text-[#15803d]" : ""}`}
              >
                {line}
              </span>
            ))
          ) : (
            <>
              <span>{marketHeading.primary}</span>{" "}
              {marketHeading.accent ? (
                <span className="text-[#15803d]">{marketHeading.accent}</span>
              ) : null}
            </>
          )}
        </h2>
        <p className="mt-3 max-w-[700px] text-[14px] leading-[1.6] text-[#6b7280]">
          {market.h3}
        </p>
        <div className="mt-6 grid gap-5 lg:grid-cols-[400px_minmax(0,1fr)] lg:items-stretch">
          <div className="order-2 w-full overflow-hidden rounded-[12px] border border-[#e4edf5] bg-white shadow-[0_14px_32px_rgba(13,27,46,0.08)] lg:order-none lg:flex lg:h-full lg:min-h-[792px]">
            {imageSrc ? (
              <div className="w-full lg:relative lg:h-full lg:min-h-[792px]">
                <Image
                  src={imageSrc}
                  alt={market.imageAlt ?? ""}
                  width={960}
                  height={1400}
                  className="block h-auto w-full object-contain lg:hidden"
                  sizes="100vw"
                />
                <div className="hidden lg:block lg:h-full lg:min-h-[792px]">
                  <Image
                    src={imageSrc}
                    alt={market.imageAlt ?? ""}
                    fill
                    className="scale-[1.01] object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 34vw"
                  />
                </div>
              </div>
            ) : null}
          </div>
          <div className="order-1 min-w-0 lg:order-none lg:flex lg:h-full lg:min-h-[792px] lg:flex-col">
            <div className="relative z-10 rounded-t-[14px] border border-[#2e5c99] border-b-0 bg-[linear-gradient(180deg,#14325a_0%,#10243e_100%)] px-4 py-[12px] shadow-[0_0_0_1px_rgba(82,169,255,0.18),0_12px_28px_rgba(13,27,46,0.24)] sm:px-5 sm:py-[14px]">
              <div className="flex items-center gap-[9px] text-[10px] font-bold uppercase tracking-[0.1em] text-[#69d4ff] sm:text-[11px]">
                <span className="grid h-[24px] w-[24px] shrink-0 place-items-center rounded-full bg-[#112948] text-[#69d4ff] shadow-[0_0_14px_rgba(105,212,255,0.26)]">
                  <PulseIcon />
                </span>
                <span className="shrink-0">Average Market Prices</span>
                {tabs.length > 1 ? (
                  <div className="relative ml-auto">
                    <button
                      type="button"
                      onClick={() => setMenuOpen((open) => !open)}
                      aria-expanded={menuOpen}
                      className="inline-flex max-w-[160px] items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-bold normal-case tracking-normal text-white"
                    >
                      <span className="truncate">{currentTab?.label}</span>
                      <Chevron open={menuOpen} />
                    </button>
                    {menuOpen ? (
                      <div className="absolute right-0 top-[calc(100%+8px)] z-20 flex min-w-[190px] flex-col gap-1 rounded-[12px] border border-[#dbe7f6] bg-white p-2 shadow-[0_18px_38px_rgba(5,17,35,0.24)]">
                        {tabs.map((tab) => (
                          <button
                            key={tab.key}
                            type="button"
                            onClick={() => {
                              setActiveTab(tab.key);
                              setMenuOpen(false);
                            }}
                            className={`rounded-[9px] px-3 py-2 text-left text-[11px] font-bold ${activeTab === tab.key ? "bg-[#0d1b2e] text-white" : "text-[#0d1b2e] hover:bg-[#f2f7fb]"}`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="overflow-hidden rounded-b-[14px] border border-[#102845] border-t-0 bg-[linear-gradient(180deg,#10243e_0%,#0c1c31_46%,#091523_100%)] shadow-[0_18px_42px_rgba(9,21,35,0.34)] lg:flex lg:min-h-[792px] lg:flex-1 lg:flex-col">
              {visibleRows.length ? (
                <ul className="max-h-[440px] overflow-y-auto [scrollbar-color:rgba(103,199,255,0.4)_transparent] [scrollbar-width:thin] lg:flex-1 lg:max-h-[740px]">
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
                <p className="px-4 py-10 text-center text-[13px] text-white/75">
                  {market.ui?.noEntriesLabel ??
                    "No entries match that model filter yet."}
                </p>
              )}
            </div>
            <div className="px-1 pt-2.5 text-[11px] font-medium text-[#42546e]">
              ↻ {market.ui?.updatedLabel ?? "Last updated:"}{" "}
              <span className="font-semibold text-[#0d1b2e]">
                4 Aug 26, 9:26
              </span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
