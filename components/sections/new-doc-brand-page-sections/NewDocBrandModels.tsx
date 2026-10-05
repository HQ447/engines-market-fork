"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import type { ModelsSectionData } from "@/types/brand";
import ModelMobileAccordion from "@/components/sections/new-doc-model-page-sections/ModelMobileAccordion";
import { splitBrandHeading } from "./brandHeading";

type Props = { data: ModelsSectionData; brandSlug: string };

const ENGINE_IMAGE =
  "/images/engines/fac66331-c94d-48e9-983a-7997fd84a619_removalai_preview.webp";
const MOBILE_MODEL_BATCH_SIZE = 6;

function splitHeading(value: string) {
  const parts = value
    .split(/\s+-\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.length > 1 ? parts : [value];
}

function modelName(value: string) {
  return value.replace(/\s+Engines$/i, "").trim();
}

function priceRangeOnly(value: string) {
  const prices = value.match(/£\s?[\d,]+(?:\.\d+)?/gi) ?? [];

  if (prices.length >= 2) return `${prices[0]} - ${prices[1]}`;
  return prices[0] ?? value;
}

function ChevronIcon({ open }: { open: boolean }) {
  return open ? <FiChevronUp /> : <FiChevronDown />;
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[13px] w-[13px]" fill="none" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <polyline points="12 5 19 12 12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function NewDocBrandModels({ data, brandSlug }: Props) {
  const [openModel, setOpenModel] = useState<string | null>(null);
  const [columns, setColumns] = useState(2);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileVisibleCount, setMobileVisibleCount] = useState(
    MOBILE_MODEL_BATCH_SIZE,
  );
  const headingLines = splitHeading(data.h2);
  const headingParts = splitBrandHeading(headingLines[0] ?? data.h2);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1536) setColumns(6);
      else if (width >= 1280) setColumns(5);
      else setColumns(2);
      const mobile = width < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileVisibleCount(MOBILE_MODEL_BATCH_SIZE);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalRows = Math.ceil(data.cards.length / columns);
  const useStackedExpansion = columns <= 2;
  const visibleCards = isMobile
    ? data.cards.slice(0, mobileVisibleCount)
    : data.cards;
  const hasMoreMobileModels =
    isMobile && mobileVisibleCount < data.cards.length;

  return (
    <section
      id="brand-models"
      className="relative overflow-hidden bg-[#f7f8fb] px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-7"
    >
      <ModelMobileAccordion
        title={headingLines[0] ?? data.h2}
        icon={
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        }
      >
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="max-w-[760px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1289d5]/40 bg-[linear-gradient(135deg,#042f5a,#075b94)] px-3.5 py-1.5 text-[13px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_0_20px_rgba(26,145,232,0.25)]">
              {data.tag}
            </span>
            <h2
              style={{
                fontFamily: '"Bebas Neue", "Urbanist", ui-sans-serif, system-ui, sans-serif',
                letterSpacing: "0.01em",
              }}
              className="mt-5 !text-[40px] font-extrabold leading-[1.02] tracking-normal !tracking-[-0.02em] text-[#09264e] sm:!tracking-[0.01em] sm:!text-[41px] lg:!text-[46px]"
            >
              {headingLines.length > 1 ? (
                headingLines.map((line, index) => (
                  <span key={`${line}-${index}`} className={`block ${index === headingLines.length - 1 ? "text-[#15803d]" : ""}`}>
                    {line}
                  </span>
                ))
              ) : (
                <>
                  <span>{headingParts.primary}</span>{" "}
                  {headingParts.accent ? <span className="text-[#15803d]">{headingParts.accent}</span> : null}
                </>
              )}
            </h2>
            <p className="mt-4 max-w-[760px] text-[14px] leading-[1.6] text-[#526a87] lg:text-[15px]">
              {data.subheading}
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-5 2xl:grid-cols-6">
            {visibleCards.map((card, index) => {
              const href = `/${brandSlug}/${card.slug}`;
              const isOpen = openModel === card.slug;
              const image = card.image || ENGINE_IMAGE;
              const title = modelName(card.h3);
              const price = priceRangeOnly(card.priceRange);
              const rowIndex = Math.floor(index / columns);
              const isLastRow = rowIndex === totalRows - 1 && totalRows > 1;
              const opensUpward = isMobile && index >= visibleCards.length - 2;

              const expandedPanelClass = isMobile
                ? `absolute left-[-1px] right-[-1px] z-50 ${opensUpward ? "bottom-full rounded-t-[12px] border-b-0" : "top-full rounded-b-[12px] border-t-0"}`
                : useStackedExpansion
                  ? "relative rounded-b-[12px] border-t-0"
                  : `absolute left-[-1px] right-[-1px] z-50 ${isLastRow ? "bottom-full rounded-t-[12px] border-b-0" : "top-full rounded-b-[12px] border-t-0"}`;

              return (
                <article key={`${card.slug}-${index}`} className={`relative ${isOpen ? "z-[60]" : "z-[1]"}`}>
                  <div
                    className={`relative flex min-h-[214px] flex-col rounded-[12px] border bg-white transition duration-300 ${isOpen ? `overflow-visible border-[#2969af] shadow-[0_0_0_1px_rgba(42,109,214,1),0_0_5px_rgba(42,109,214,0.4),0_0_12px_rgba(42,109,214,0.3),0_0_20px_rgba(42,109,214,0.2),0_3px_10px_rgba(42,109,214,0.25)] ${!isMobile && useStackedExpansion ? "rounded-b-none border-b-0" : ""}` : "overflow-hidden border-slate-200 shadow-[0_2px_8px_rgba(13,27,46,0.05)] hover:border-slate-300 hover:shadow-[0_8px_18px_rgba(13,27,46,0.08)]"}`}
                  >
                    <Link href={href} className="block w-full">
                      <div className="relative h-[118px] w-full overflow-hidden rounded-t-[12px] bg-[linear-gradient(180deg,#f8fbff_0%,#eef3f9_100%)]">
                        <Image src={image} alt={title} fill className="object-contain object-center p-[6px]" sizes="(max-width: 767px) 50vw, (max-width: 1279px) 25vw, 16vw" />
                      </div>
                    </Link>

                    <div className="flex min-h-[80px] flex-col px-2 pb-1 text-center">
                      <Link href={href} className="mt-1 line-clamp-2 min-h-[18px] font-['Manrope'] text-[13px] font-semibold leading-[1.25] text-[#0d1b2e] transition hover:text-[#15803d]">
                        {title}
                      </Link>
                      <p className="mt-1 line-clamp-1 min-h-[14px] text-[9.5px] font-medium leading-[1.35] text-[#4b5563]">
                        {card.subtitle}
                      </p>
                      <p className="mt-1 pt-0 font-['Manrope'] text-[12px] font-semibold leading-[1.35] text-[#374151]">
                        {price}
                      </p>
                      <button
                        type="button"
                        onClick={() => setOpenModel((current) => current === card.slug ? null : card.slug)}
                        aria-expanded={isOpen}
                        aria-label={isOpen ? `Hide ${card.h3} details` : `Show ${card.h3} details`}
                        className="mx-auto mt-1 inline-flex text-[#15803d]"
                      >
                        <ChevronIcon open={isOpen} />
                      </button>
                    </div>
                  </div>

                  {isOpen ? (
                    <div className={`${expandedPanelClass} min-h-[180px] overflow-hidden border-[0.5px] border-[#2969af] bg-[#0d1b2e] px-3 pb-3 pt-3 text-white shadow-[0_0_0_1px_rgba(42,109,214,1),0_0_5px_rgba(42,109,214,0.4),0_0_12px_rgba(42,109,214,0.3),0_0_20px_rgba(42,109,214,0.2),0_3px_10px_rgba(42,109,214,0.25)] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(125deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.05)_22%,rgba(255,255,255,0)_42%,rgba(45,107,255,0.16)_50%,rgba(255,255,255,0)_64%)] after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/70 after:to-transparent`}>
                      <div className="relative z-10 space-y-2 xl:space-y-4">
                        <div className="flex items-center justify-between gap-2 rounded-[8px] border border-blue-500 bg-white/[0.03] px-2.5 py-2.5 shadow-[0_0_15px_rgba(59,130,246,0.5),inset_0_0_12px_rgba(59,130,246,0.3)]">
                          <span className="flex-none text-[10px] font-semibold uppercase tracking-[0.08em] text-white/60">Model</span>
                          <span className="min-w-0 flex-1 truncate text-right text-[11px] font-semibold leading-none text-white">{title}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 rounded-[8px] border border-blue-500 bg-white/[0.03] px-2.5 py-2.5 shadow-[0_0_15px_rgba(59,130,246,0.5),inset_0_0_12px_rgba(59,130,246,0.3)]">
                          <span className="flex-none text-[10px] font-semibold uppercase tracking-[0.08em] text-white/60">Details</span>
                          <span className="min-w-0 flex-1 truncate text-right text-[11px] font-semibold leading-none text-white">{card.subtitle}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 rounded-[8px] border border-blue-500 bg-white/[0.03] px-2.5 py-2.5 shadow-[0_0_15px_rgba(59,130,246,0.5),inset_0_0_12px_rgba(59,130,246,0.3)]">
                          <span className="flex-none text-[10px] font-semibold uppercase tracking-[0.08em] text-white/60">Price</span>
                          <span className="min-w-0 flex-1 text-right font-['Manrope'] text-[12px] font-extrabold leading-tight text-white">{price}</span>
                        </div>
                      </div>
                      <Link href={href} className="relative z-10 mt-3 inline-flex min-h-10 w-full items-center justify-between gap-2 overflow-hidden rounded-xl border border-green-400 bg-slate-900 px-2.5 py-2 text-white shadow-[0_0_15px_rgba(74,222,128,0.5),inset_0_0_12px_rgba(74,222,128,0.3)] transition hover:bg-slate-800 hover:shadow-[0_0_20px_rgba(74,222,128,0.8),inset_0_0_15px_rgba(74,222,128,0.5)]">
                        <span className="min-w-0 flex-1 break-words text-left text-[10px] font-semibold uppercase leading-[1.35] tracking-[0.08em] text-white/85">{card.cta}</span>
                        <span className="shrink-0"><ArrowIcon /></span>
                      </Link>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
          {hasMoreMobileModels ? (
            <div className="mt-5 flex justify-center md:hidden">
              <button
                type="button"
                onClick={() =>
                  setMobileVisibleCount((current) =>
                    Math.min(
                      current + MOBILE_MODEL_BATCH_SIZE,
                      data.cards.length,
                    ),
                  )
                }
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-[12px] font-bold text-[#0d1b2e] transition hover:border-[#0d1b2e] hover:bg-slate-50"
              >
                See More
                <FiChevronDown aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      </ModelMobileAccordion>
    </section>
  );
}
