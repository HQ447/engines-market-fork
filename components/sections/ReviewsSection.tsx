"use client";

import { useMemo, useState } from "react";
import type { ReviewsSectionData } from "@/types/brand";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

type Props = {
  data: ReviewsSectionData;
  useDataHeading?: boolean;
  documentMode?: boolean;
  newDesignMode?: boolean;
};

const REVIEW_SOURCES = ["google", "facebook", "trustpilot", "google", "facebook", "trustpilot"] as const;
const LEAVE_REVIEW_HREF = "mailto:ef2crm@gmail.com?subject=EnginesMarket%20review";

function ReviewBadgeIcon() {
  return (
    <span className="relative block h-11 w-11" aria-hidden="true">
      <img
        src="/icons/engine-market/colored-experience-positive.png"
        alt=""
        className="absolute -left-0.5 bottom-0 h-8 w-8 object-contain"
        loading="lazy"
      />
      <img
        src="/icons/engine-market/colored-experience-negative.png"
        alt=""
        className="absolute -right-0.5 top-0 h-7 w-7 object-contain"
        loading="lazy"
      />
    </span>
  );
}

function StarRow({ count = 5, size = "text-[20px]" }: { count?: number; size?: string }) {
  return (
    <div className={`flex gap-[2px] leading-none text-amber-500 ${size}`}>
      {Array.from({ length: count }).map((_, index) => (
        <span key={index}>★</span>
      ))}
    </div>
  );
}

function ChevronButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-1/2 z-[2] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-[0_4px_14px_rgba(13,27,46,0.10)] transition hover:border-[#0d1b2e] hover:text-[#0d1b2e] lg:flex ${
        direction === "prev" ? "-left-5" : "-right-5"
      }`}
      aria-label={direction === "prev" ? "Previous reviews" : "Next reviews"}
    >
      <span className="text-[18px] leading-none">{direction === "prev" ? "‹" : "›"}</span>
    </button>
  );
}

function ReviewSource({ source }: { source: (typeof REVIEW_SOURCES)[number] }) {
  if (source === "facebook") {
    return <span className="text-[11px] font-bold text-[#1877F2]">facebook</span>;
  }

  if (source === "trustpilot") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
        <span className="text-green-500">★</span>
        Trustpilot
      </span>
    );
  }

  return (
    <span className="font-['Manrope'] text-[18px] font-bold leading-none">
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#34A853]">g</span>
      <span className="text-[#EA4335]">l</span>
      <span className="text-[#4285F4]">e</span>
    </span>
  );
}

function getVisibleIndices(total: number, current: number, count: number) {
  return Array.from({ length: Math.min(count, total) }, (_, offset) => (current + offset) % total);
}

function splitHeading(title: string) {
  const match = title.match(/^(Trusted by .*? Owners)\s+(Across the UK)$/i);

  if (!match) {
    return {
      lineOne: title,
      lineTwo: "",
    };
  }

  return {
    lineOne: match[1],
    lineTwo: match[2],
  };
}

export default function ReviewsSection({ data, useDataHeading = false, documentMode = false, newDesignMode = false }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reviewCount = data.reviews.length;
  const heading = splitHeading(data.h2);
  const headingLines = data.headingLines?.length ? data.headingLines : [heading.lineOne, heading.lineTwo].filter(Boolean);
  const ui = data.ui ?? {};
  const reviewSources = data.sources?.length ? data.sources : REVIEW_SOURCES;
  const desktopIndices = useMemo(
    () => getVisibleIndices(reviewCount, currentIndex, 3),
    [currentIndex, reviewCount],
  );

  function goTo(index: number) {
    setCurrentIndex((index + reviewCount) % reviewCount);
  }

  function goNext() {
    goTo(currentIndex + 1);
  }

  function goPrev() {
    goTo(currentIndex - 1);
  }

  return (
    <Section className={newDesignMode ? "bg-white py-9 sm:py-10 lg:py-12" : "bg-white"}>
      <Container className={documentMode ? `max-w-7xl ${newDesignMode ? "!px-4 sm:!px-6 lg:!px-8" : "px-0 sm:px-0 lg:px-0"}` : ""}>
        <div className={`mx-auto max-w-[1400px] ${documentMode ? "" : "px-2"}`}>
          <div>
            <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#1289d5]/40 bg-[#06244d]/95 px-3.5 py-1.5 text-[14px] font-bold uppercase text-[white] shadow-[0_0_20px_rgba(26,145,232,0.25)] sm:mb-5 sm:text-[13px]">
              {/* <TagIcon /> */}
              {data.tag}
            </p>

            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <h2 className={`max-w-[1020px] ${newDesignMode ? "!text-[34px] font-extrabold leading-[1.04] tracking-[-0.04em] lg:!text-[40px]" : ""}`}>
                {useDataHeading ? (
                  headingLines.map((line, index) => (
                    <span key={`${line}-${index}`} className={`block ${headingLines.length > 1 && index === headingLines.length - 1 ? "text-[#15803d]" : ""}`}>
                      {line}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="block">Trusted by Land Rover <span className="text-[#15803d]">Owners</span></span>
                    <span className="block text-[#15803d]">Across the UK</span>
                  </>
                )}
              </h2>

              <div className="flex items-center gap-3 rounded-[10px] border border-[#18365d] bg-[linear-gradient(135deg,#07182c_0%,#0d2848_100%)] px-4 py-3 text-white shadow-[0_12px_30px_rgba(6,24,43,0.24)] lg:mb-1">
                <StarRow size="text-[18px]" />
                <div className="h-8 w-px bg-white/18" aria-hidden="true" />
                <div className="flex items-end gap-1.5 text-[12px] leading-none text-white/70">
                  <span className="font-['Manrope'] text-[24px] font-extrabold leading-none text-white">
                    {data.rating.value}
                  </span>
                  <span className="pb-1">out of 5</span>
                </div>
              </div>
            </div>

            <p className="mt-3 max-w-[680px] text-[13px] leading-[1.6] text-slate-500">{data.rating.summary}</p>
          </div>

          <div className="relative mt-5">
            <ChevronButton direction="prev" onClick={goPrev} />
            <ChevronButton direction="next" onClick={goNext} />

            <div className="hidden gap-3 lg:grid lg:grid-cols-3">
              {desktopIndices.map((reviewIndex) => {
                const review = data.reviews[reviewIndex];
                const source = reviewSources[reviewIndex % reviewSources.length] as (typeof REVIEW_SOURCES)[number];

                return (
                  <article
                    key={`${review.name}-${review.location}-${reviewIndex}`}
                    className="rounded-[14px] border border-slate-200 bg-white px-4 py-8 shadow-[0_2px_10px_rgba(13,27,46,0.06)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[14px] font-bold text-slate-700">
                          {review.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-['Manrope'] text-[15px] font-bold leading-[1.2] text-[#0d1b2e]">
                            {review.name}
                          </p>
                          <StarRow size="text-[14px]" />
                        </div>
                      </div>
                      <ReviewSource source={source} />
                    </div>

                    <p className="mt-3 text-[14px] leading-[1.6] text-slate-600">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="rounded-[14px] border border-[#d8e6f5] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 py-4 shadow-[0_8px_20px_rgba(13,27,46,0.08)] lg:hidden">
              <div className="flex items-center justify-between gap-3">
                <ReviewSource source={reviewSources[currentIndex % reviewSources.length] as (typeof REVIEW_SOURCES)[number]} />
                <StarRow size="text-[18px]" />
              </div>

              <div className="mt-4">
                <span className="block font-serif text-[36px] leading-[0.6] text-green-600/70">&ldquo;</span>
                <p className="mt-2 min-h-[96px] text-[15px] italic leading-[1.6] text-[#1a1a2e]">
                  {data.reviews[currentIndex]?.text}
                  <span className="float-right font-serif text-[36px] leading-none text-green-600/70">&rdquo;</span>
                </p>
                <p className="mt-3 text-[13px] text-slate-500">
                  - <strong className="font-bold text-[#0d1b2e]">{data.reviews[currentIndex]?.name}</strong>,{" "}
                  {data.reviews[currentIndex]?.location}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-center gap-[7px]">
              {data.reviews.map((review, index) => (
                <button
                  key={`${review.name}-${index}`}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`${ui.reviewAriaLabelPrefix ?? "Review"} ${index + 1}`}
                  className={`h-2 w-2 rounded-full transition ${
                    index === currentIndex ? "scale-[1.2] bg-green-600" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-[12px] border border-[#2a6dd6] bg-white px-4 py-4 shadow-[0_0_12px_rgba(42,109,214,0.2)]">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] border border-[#dbe4ef] bg-[#f8fafc] text-white shadow-[0_6px_18px_rgba(13,27,46,0.08)]">
                <ReviewBadgeIcon />
              </span>
              <div>
                <p className="font-['Manrope'] text-[14px] font-bold text-[#0d1b2e]">
                  {ui.leaveReviewTitle ?? "Had a good / bad experience? Please leave a review"}
                </p>
                <p className="mt-1 text-[12.5px] leading-[1.55] text-slate-500">
                  <a href={LEAVE_REVIEW_HREF} className="font-semibold text-[#0d1b2e] underline decoration-slate-300 underline-offset-2">
                    {data.leaveReviewCta.linkText.replace(/\s*-+>\s*$/, "")} →
                  </a>{" "}
                  - {data.leaveReviewCta.text.replace(/^Had a great experience\?\s*/i, "")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
