"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getModelHref } from "@/lib/modelRoutes";
import type { ModelsSectionData } from "@/types/brand";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

type Props = {
  data: ModelsSectionData;
  brandSlug: string;
  documentMode?: boolean;
};

function splitHeading(title: string) {
  const marker = "Engine Replacement Models";
  if (!title.includes(marker)) {
    return { before: title, accent: "" };
  }

  const [before] = title.split(marker);
  return { before: before.trim(), accent: marker };
}

function normalizePriceRange(priceRange: string) {
  return priceRange.replace(/^Starting from\s*/i, "").trim();
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M9 3v18M3 9h6M3 15h6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ArrowIcon({ open = false }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AutoTicker({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const GAP = 28;
  const PIXELS_PER_SECOND = 18;

  // Detect whether the text is wider than its container
  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const measureElement = measureRef.current;

      if (!container || !measureElement) return;

      const textWidth = measureElement.scrollWidth;
      const containerWidth = container.clientWidth;

      setIsOverflowing(textWidth > containerWidth + 2);
    };

    const timer = window.setTimeout(measure, 50);

    const observer = new ResizeObserver(measure);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [text]);

  // Start / stop seamless marquee
  useEffect(() => {
    animationRef.current?.cancel();
    animationRef.current = null;

    const track = trackRef.current;
    const measureElement = measureRef.current;

    if (!track || !measureElement || !isOverflowing || isHovered) {
      return;
    }

    const textWidth = measureElement.scrollWidth;
    const distance = textWidth + GAP;

    const duration =
      (distance / PIXELS_PER_SECOND) * 1000;

    animationRef.current = track.animate(
      [
        {
          transform: "translateX(0)",
        },
        {
          transform: `translateX(-${distance}px)`,
        },
      ],
      {
        duration,
        iterations: Infinity,
        easing: "linear",
      }
    );

    return () => {
      animationRef.current?.cancel();
    };
  }, [text, isOverflowing, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full text-center ${className}`}
      title={text}
    >
      {/* Invisible copy used ONLY for measuring text width */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none absolute invisible whitespace-nowrap"
      >
        {text}
      </span>

      {isHovered && isOverflowing ? (
        /* HOVER: show complete text and expand */
        <div className="w-full whitespace-normal break-words text-center">
          {text}
        </div>
      ) : isOverflowing ? (
        /* NORMAL: seamless automatic marquee */
        <div className="w-full overflow-hidden whitespace-nowrap">
          <div
            ref={trackRef}
            className="flex w-max items-center whitespace-nowrap"
          >
            {/* COPY 1 */}
            <span className="shrink-0 whitespace-nowrap">
              {text}
            </span>

            {/* GAP */}
            <span
              aria-hidden="true"
              className="shrink-0"
              style={{ width: `${GAP}px` }}
            />

            {/* COPY 2 */}
            <span
              aria-hidden="true"
              className="shrink-0 whitespace-nowrap"
            >
              {text}
            </span>

            {/* GAP FOR SEAMLESS LOOP */}
            <span
              aria-hidden="true"
              className="shrink-0"
              style={{ width: `${GAP}px` }}
            />
          </div>
        </div>
      ) : (
        /* SHORT TEXT: stay centered */
        <div className="w-full whitespace-nowrap text-center">
          {text}
        </div>
      )}
    </div>
  );
}

export default function ModelsSection({ data, brandSlug, documentMode = false }: Props) {
  const heading = splitHeading(data.h2);
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [showAllModels, setShowAllModels] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const initialVisibleCount = 4;

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") {
        return;
      }

      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile) {
        setShowAllModels(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleCards = useMemo(
    () => (isMobile && !showAllModels ? data.cards.slice(0, initialVisibleCount) : data.cards),
    [data.cards, initialVisibleCount, isMobile, showAllModels],
  );
  const hiddenModelsCount = Math.max(data.cards.length - initialVisibleCount, 0);

  return (
    <Section id="brand-models" className="relative overflow-hidden bg-white !pt-2 sm:!pt-4 lg:!pt-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden lg:block">
        <div
          className="absolute right-0 top-0 h-[230px] w-[260px] opacity-[0.1]"
          style={{
            backgroundImage: `linear-gradient(270deg, rgba(255,255,255,0.08), rgba(255,255,255,0.9) 52%, rgba(255,255,255,1) 100%), url(/images/brands/${brandSlug}/brand/${brandSlug}-engine-code-directory-bg.webp)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "top right",
            filter: "grayscale(1)",
          }}
        />
      </div>

      <Container className={documentMode ? "max-w-[1400px] px-0 sm:px-0 lg:px-0" : ""}>
        <div className="relative z-[1] max-w-[760px] text-left">
          <p className="section-pill">
            <GridIcon />
            {data.tag}
          </p>

          <h2 className="mt-2">
            {heading.before}
            {heading.accent ? (
              <>
                {" "}
                <span className="text-[#15803d]">{heading.accent}</span>
              </>
            ) : null}
          </h2>

          <p className="text-body mt-2 max-w-[660px] text-slate-600">{data.subheading}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:hidden">
          {visibleCards.map((model) => {
            const modelHref = getModelHref(brandSlug, model);
            const isOpen = openCard === model.slug;

            return (
              <article
                key={model.slug}
                className="overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_8px_22px_rgba(13,27,46,0.07)]"
              >
                <Link href={modelHref} className="block">
                  <div className="relative aspect-[1.26/1] overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef3f9_100%)]">
                    <Image
                      src={model.image || `/images/brands/${brandSlug}/models/${brandSlug}-${model.slug}-small.webp`}
                      alt={model.h3}
                      fill
                      className="object-contain object-center p-[3px]"
                      sizes="(max-width: 767px) 50vw, 25vw"
                    />
                  </div>
                </Link>

                <div className="space-y-2 px-3 pb-3 pt-2.5">
                  <Link
                    href={modelHref}
                    className="block font-['Manrope'] text-[14px] font-extrabold leading-[1.15] text-[#0d1b2e] transition hover:text-[#15803d]"
                  >
                  <h3>
  {model.h3.replace(/\s+Engines$/i, "")}
</h3>
                  </Link>
                  <p className="text-[10.5px] leading-[1.35] text-slate-500">{model.subtitle}</p>

                  <button
                    type="button"
                    onClick={() => setOpenCard((current) => (current === model.slug ? null : model.slug))}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? `Hide ${model.h3} quote link` : `Show ${model.h3} quote link`}
                    className="flex w-full items-center justify-between gap-2 border-t border-slate-100 pt-1.5 text-left"
                  >
                    <span>
                      <span className="block text-[9.5px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                        Starting from
                      </span>
                      <span className="mt-0.5 block font-['Manrope'] text-[13px] font-extrabold leading-none text-[#0d1b2e]">
                        {normalizePriceRange(model.priceRange)}
                      </span>
                    </span>
                    <span className="text-[#0d1b2e]">
                      <ArrowIcon open={isOpen} />
                    </span>
                  </button>

                  {isOpen ? (
                    <Link
                      href={modelHref}
                      className="mt-2 flex items-center justify-between gap-2 rounded-[8px] bg-[#15803d] px-2.5 py-2 font-['Manrope'] text-[10.5px] font-bold leading-tight text-white shadow-[0_8px_18px_rgba(21,128,61,0.18)]"
                    >
                      <span>{model.cta.replace(/\s*-+>\s*$/, "")}</span>
                      <ArrowIcon />
                    </Link>
                  ) : null}
                  </div>
              </article>
            );
          })}
        </div>

        <div className="mt-7 hidden items-start gap-3 md:grid md:grid-cols-2 xl:grid-cols-5">
          {visibleCards.map((model) => {
            const isOpen = openCard === model.slug;
            const modelHref = getModelHref(brandSlug, model);

            return (
         <article
  key={model.slug}
  className="flex min-h-[214px] flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-[0_2px_8px_rgba(13,27,46,0.05)] transition hover:border-slate-300 hover:shadow-[0_8px_18px_rgba(13,27,46,0.08)]"
>
  {/* CLICKABLE IMAGE */}
  <Link href={modelHref} className="block w-full">
    <div className="relative h-[118px] w-full overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#eef3f9_100%)]">
      <Image
        src={
          model.image ||
          `/images/brands/${brandSlug}/models/${brandSlug}-${model.slug}-small.webp`
        }
        alt={model.h3}
        fill
        className="object-contain object-center p-[6px]"
        sizes="20vw"
      />
    </div>
  </Link>

  {/* CARD CONTENT */}
  <div className="flex flex-col px-2 pb-2 text-center">

    {/* CLICKABLE MODEL NAME */}
    <Link
      href={modelHref}
      className="mt-2 block w-full transition hover:text-[#15803d]"
    >
      <AutoTicker
        text={model.h3.replace(/\s+Engines$/i, "")}
        className="font-['Manrope'] text-[13px] font-semibold leading-[1.25] text-[#0d1b2e]"
      />
    </Link>

    {/* DESCRIPTION */}
    <AutoTicker
      text={model.subtitle}
      className="mt-1.5 text-[9.5px] font-medium leading-[1.35] text-[#4b5563]"
    />

    {/* PRICE — PUSHED LOWER */}
    <AutoTicker
      text={`Rebuilt Engines: ${normalizePriceRange(model.priceRange)}`}
      className="mt-2 font-['Manrope'] text-[12px] font-semibold leading-[1.35] text-[#374151]"
    />

    {/* DETAILS ARROW */}
    <button
      type="button"
      onClick={() =>
        setOpenCard((current) =>
          current === model.slug ? null : model.slug
        )
      }
      aria-expanded={isOpen}
      aria-label={
        isOpen
          ? `Hide ${model.h3} details`
          : `Show ${model.h3} details`
      }
      className="mx-auto mt-2 inline-flex text-[#15803d]"
    >
      <ArrowIcon open={isOpen} />
    </button>
  </div>

  {/* EXPANDED DETAILS */}
  {isOpen ? (
    <div className="border-t border-slate-100 px-4 pb-4 pt-3">
      <p className="mt-3 text-[10px] leading-[1.55] text-slate-500">
        {model.subtitle}
      </p>

      <Link
        href={modelHref}
        className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0d1b2e] transition hover:gap-2"
      >
        <span>{model.cta.replace(/\s*-+>\s*$/, "")}</span>

        <span className="text-[#15803d]">
          <ArrowIcon />
        </span>
      </Link>
    </div>
  ) : null}
</article>
            );
          })}
        </div>

        {isMobile && hiddenModelsCount > 0 ? (
          <div className="mt-5 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setShowAllModels((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] font-bold text-[#0d1b2e] transition hover:border-[#0d1b2e] hover:bg-slate-50"
            >
              <span>
                {showAllModels
                  ? "Show Fewer Models"
                  : `View More Models (${hiddenModelsCount})`}
              </span>
              <ArrowIcon open={showAllModels} />
            </button>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
