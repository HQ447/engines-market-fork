"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  ModelPageData,
  ModelVariantCoverageSectionData,
} from "@/types/model";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { resolveVariantArtwork } from "@/lib/variantImageAssets";

type Props = {
  data: ModelVariantCoverageSectionData;
  brandName?: string;
  brandSlug?: string;
  modelName?: string;
  modelSlug?: string;
  modelImage?: string;
  variantRouteMap?: Record<string, string>;
  documentMode?: boolean;
  newDesignMode?: boolean;
};

type VariantCard = ModelVariantCoverageSectionData["cards"][number];
const MOBILE_VISIBLE_COUNT = 6;

function isRenderableVariantCard(card: VariantCard) {
  const hasHeading = card.h3.trim().length > 0;
  const hasSlug = card.slug.trim().length > 0 && card.slug.trim() !== "-engine";
  const hasSpecs =
    card.priceRange.trim().length > 0 ||
    card.power.trim().length > 0 ||
    (card.years?.trim().length ?? 0) > 0 ||
    card.engineCodes.length > 0;

  return hasHeading && hasSlug && hasSpecs;
}

function BookIcon() {
  return (
    <img
      src="/icons/engine-market/dark-green-variant-directory.png"
      alt=""
      aria-hidden="true"
      className="h-6 w-6 object-contain"
      loading="lazy"
    />
  );
}

function NotSureIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <img
      src="/icons/engine-market/dark-green-not-sure.png"
      alt=""
      aria-hidden="true"
      className={`${className} object-contain`}
      loading="lazy"
    />
  );
}

function ChevronIcon({ open, animated }: { open: boolean; animated: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : animated ? "chevron-breathe-down" : ""
        }`}
      fill="none"
      aria-hidden="true"
    >
      <polyline
        points="6 9 12 15 18 9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[13px] w-[13px]"
      fill="none"
      aria-hidden="true"
    >
      <line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <polyline
        points="12 5 19 12 12 19"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatVariantName(title: string) {
  return title
    .replace(/\s+Engine Replacement$/i, "")
    .replace(/^BMW\s+/i, "")
    .trim();
}

function normalizeVariantSubtitle(subtitle: string) {
  return subtitle
    .replace(/\u00c2\u00b7/g, "\u00b7")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveVariantVehicleImage({
  card,
  brandSlug,
  brandName,
  modelSlug,
  modelName,
}: {
  card: VariantCard;
  brandSlug?: string;
  brandName?: string;
  modelSlug?: string;
  modelName?: string;
}) {
  const variantArtwork = resolveVariantArtwork({
    brandSlug,
    brandName,
    modelSlug,
    modelName,
    variantSlug: card.slug,
    cardTitle: card.h3,
    cardImage: card.image,
  });

  if (variantArtwork) {
    return {
      src: variantArtwork,
      zoomed: true,
    };
  }

  const years = card.years?.trim() ?? "";

  if (/^2019-2024$/.test(years) || /^2019/.test(years)) {
    return {
      src: "/images/brands/bmw/models/bmw-1-series-f40-model-card.png",
      zoomed: false,
    };
  }

  if (/^(2011|2012|2016)/.test(years)) {
    return {
      src: "/images/brands/bmw/models/bmw-1-series-f20-f21-model-card.png",
      zoomed: false,
    };
  }

  if (/^2004-2011$/.test(years) || /^2004/.test(years)) {
    return {
      src: "/images/brands/bmw/models/bmw-1-series-e81-e87-model-card.png",
      zoomed: false,
    };
  }

  if (/2004-2024/.test(years)) {
    return {
      src: "/images/brands/bmw/models/bmw-1-series-model-card.png",
      zoomed: false,
    };
  }

  return {
    src: "/images/brands/bmw/models/bmw-1-series-model-card.png",
    zoomed: false,
  };
}

function extractEngineType(card: VariantCard) {
  const match = card.subtitle.match(/\d(?:\.\d)?L\s+[A-Za-z]+/);
  return match?.[0] ?? `${card.fuel}`.trim();
}

function formatCodeAndType(card: VariantCard) {
  const codes = card.engineCodes.length ? card.engineCodes.join("/") : "";
  const engineType = extractEngineType(card);

  return [codes, engineType].filter(Boolean).join(" ");
}

function isRenderableDirectoryItem(item: string) {
  const normalizedItem = item.trim();

  if (!normalizedItem) {
    return false;
  }

  if (/^not sure which variant/i.test(normalizedItem)) {
    return false;
  }

  if (normalizedItem.length > 40 && /[.?!]$/.test(normalizedItem)) {
    return false;
  }

  if (
    /variants$/i.test(normalizedItem) &&
    normalizedItem.split(/\s+/).length > 2
  ) {
    return false;
  }

  return true;
}

function getRenderableDirectoryGroups(data: ModelVariantCoverageSectionData) {
  return data.directory.groups
    .map((group) => {
      const seenItems = new Set<string>();
      const items = group.items.filter((item) => {
        if (!isRenderableDirectoryItem(item)) {
          return false;
        }

        const normalizedKey = item.trim().toLowerCase();
        if (seenItems.has(normalizedKey)) {
          return false;
        }

        seenItems.add(normalizedKey);
        return true;
      });

      return {
        ...group,
        items,
      };
    })
    .filter((group) => group.items.length > 0);
}

function splitDirectoryHeading(heading: string) {
  const parts = heading
    .split(/\s+-\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.length ? parts : [heading];
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

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const measureElement = measureRef.current;

      if (!container || !measureElement) return;

      setIsOverflowing(measureElement.scrollWidth > container.clientWidth + 2);
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

  useEffect(() => {
    animationRef.current?.cancel();
    animationRef.current = null;

    const track = trackRef.current;
    const measureElement = measureRef.current;

    if (!track || !measureElement || !isOverflowing || isHovered) {
      return;
    }

    const distance = measureElement.scrollWidth + GAP;
    const duration = (distance / PIXELS_PER_SECOND) * 1000;

    animationRef.current = track.animate(
      [
        { transform: "translateX(0)" },
        { transform: `translateX(-${distance}px)` },
      ],
      {
        duration,
        iterations: Infinity,
        easing: "linear",
      },
    );

    return () => {
      animationRef.current?.cancel();
    };
  }, [text, isOverflowing, isHovered]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full text-center ${className}`}
      title={text}
    >
      <span
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none absolute invisible whitespace-nowrap"
      >
        {text}
      </span>

      {isHovered && isOverflowing ? (
        <div className="w-full whitespace-normal break-words text-center">
          {text}
        </div>
      ) : isOverflowing ? (
        <div className="w-full overflow-hidden whitespace-nowrap">
          <div
            ref={trackRef}
            className="flex w-max items-center whitespace-nowrap"
          >
            <span className="shrink-0 whitespace-nowrap">{text}</span>

            <span
              aria-hidden="true"
              className="shrink-0"
              style={{ width: `${GAP}px` }}
            />

            <span aria-hidden="true" className="shrink-0 whitespace-nowrap">
              {text}
            </span>

            <span
              aria-hidden="true"
              className="shrink-0"
              style={{ width: `${GAP}px` }}
            />
          </div>
        </div>
      ) : (
        <div className="w-full whitespace-nowrap text-center">{text}</div>
      )}
    </div>
  );
}

function VariantCoverageSectionImplementation({
  data,
  brandName,
  brandSlug,
  modelName,
  modelSlug,
  modelImage,
  variantRouteMap,
  documentMode = false,
  newDesignMode = false,
}: Props) {
  const renderableCards = useMemo(
    () => data.cards.filter(isRenderableVariantCard),
    [data.cards],
  );

  const renderableDirectoryGroups = useMemo(
    () => getRenderableDirectoryGroups(data),
    [data],
  );

  const [openCard, setOpenCard] = useState<string | null>(null);
  const [seenCards, setSeenCards] = useState<Record<string, boolean>>({});

  const [columns, setColumns] = useState<number>(2);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showAllCards, setShowAllCards] = useState<boolean>(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      const width = window.innerWidth;

      if (width >= 1536) setColumns(6);
      else if (width >= 1280) setColumns(5);
      else setColumns(2);

      const mobile = width < 768;
      setIsMobile(mobile);

      if (!mobile) {
        setShowAllCards(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mobileCardsToDisplay = useMemo(() => {
    if (
      isMobile &&
      !showAllCards &&
      renderableCards.length > MOBILE_VISIBLE_COUNT
    ) {
      return renderableCards.slice(0, MOBILE_VISIBLE_COUNT);
    }
    return renderableCards;
  }, [isMobile, showAllCards, renderableCards]);

  const totalRows = Math.ceil(renderableCards.length / columns);
  const useStackedExpansion = columns <= 2;

  const headingLines = data.headingLines?.length
    ? data.headingLines
    : [data.h2];
  const ui = data.ui ?? {};
  const directoryHeading = data.directory.h3.trim();
  const directoryHeadingLines = splitDirectoryHeading(directoryHeading);
  const directoryIntro = data.directory.intro.trim();

  if (!renderableCards.length) {
    return null;
  }

  function toggleCard(slug: string) {
    setOpenCard((current) => (current === slug ? null : slug));
    setSeenCards((current) =>
      current[slug] ? current : { ...current, [slug]: true },
    );
  }

  function renderExpandedPanel(card: VariantCard, extraClassName = "") {
    const isAbsolutePanel = extraClassName.includes("absolute");
    const variantHref = variantRouteMap?.[card.slug];

    return (
      <div
        className={`${isAbsolutePanel ? "" : "relative"} overflow-hidden border-[0.5px] border-[#2969af] bg-[#061a33] px-3 pb-3 pt-3 text-white shadow-[0_0_0_1px_rgba(42,109,214,1),0_0_5px_rgba(42,109,214,0.4),0_0_12px_rgba(42,109,214,0.3),0_0_20px_rgba(42,109,214,0.2),0_3px_10px_rgba(42,109,214,0.25)] ${extraClassName}`}
      >
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between gap-2 rounded-[8px] border border-blue-500 bg-white/[0.03] px-2.5 py-2.5 shadow-[0_0_15px_rgba(59,130,246,0.5),inset_0_0_12px_rgba(59,130,246,0.3)] transition hover:bg-slate-800 hover:shadow-[0_0_20px_rgba(59,130,246,0.8),inset_0_0_15px_rgba(59,130,246,0.5)] sm:py-3">
            <span className="flex-none text-[10px] font-semibold uppercase tracking-[0.08em] text-white/60">
              {ui.specsLabel ?? "Specs"}
            </span>
            <span className="min-w-0 flex-1 truncate text-right text-[11px] font-semibold leading-none text-white md:text-[11.5px]">
              {card.power}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-[8px] border border-blue-500 bg-white/[0.03] px-2.5 py-2.5 shadow-[0_0_15px_rgba(59,130,246,0.5),inset_0_0_12px_rgba(59,130,246,0.3)] transition hover:bg-slate-800 hover:shadow-[0_0_20px_rgba(59,130,246,0.8),inset_0_0_15px_rgba(59,130,246,0.5)] sm:py-3">
            <span className="flex-none text-[10px] font-semibold uppercase tracking-[0.08em] text-white/60">
              {ui.yearsLabel ?? "Years"}
            </span>
            <span className="min-w-0 flex-1 truncate text-right text-[11px] font-semibold leading-none text-white md:text-[11.5px]">
              {card.years?.trim() ||
                ui.yearsFallback ||
                "Check exact year coverage by registration"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-[8px] border border-blue-500 bg-white/[0.03] px-2.5 py-2.5 shadow-[0_0_15px_rgba(59,130,246,0.5),inset_0_0_12px_rgba(59,130,246,0.3)] transition hover:bg-slate-800 hover:shadow-[0_0_20px_rgba(59,130,246,0.8),inset_0_0_15px_rgba(59,130,246,0.5)] sm:py-3">
            <span className="flex-none text-[10px] font-semibold uppercase tracking-[0.08em] text-white/60">
              {ui.rebuiltLabel ?? "Rebuilt"}
            </span>
            <span className="min-w-0 flex-1 text-right font-[var(--font-urbanist)] text-[12px] font-extrabold leading-tight text-white md:text-[13px]">
              {card.priceRange}
            </span>
          </div>
        </div>

        {variantHref ? (
          <Link
            href={variantHref}
            className="mt-3 inline-flex min-h-10 w-full items-center justify-between gap-2 overflow-hidden rounded-xl border border-[#15803d] bg-[#15803d] px-2.5 py-2 text-white shadow-[0_0_15px_rgba(74,222,128,0.5)] transition hover:bg-[#15803d] hover:shadow-[0_0_20px_rgba(74,222,128,0.8)]"
            aria-label={`Open ${card.h3} variant page`}
          >
            <span className="min-w-0 flex-1 text-left text-[10px] font-semibold uppercase tracking-[0.08em] leading-[1.35] text-white/85 break-words">
              {card.cta || `Open ${brandName ?? ""} ${card.h3}`.trim()}
            </span>
            <span className="shrink-0">
              <ArrowIcon />
            </span>
          </Link>
        ) : (
          <a
            href="#quote-form"
            data-quote-context={card.h3}
            data-quote-source="variant-coverage"
            className="mt-3 inline-flex min-h-10 w-full items-center justify-between gap-2 overflow-hidden rounded-xl border border-[#15803d]  px-2.5 py-2 text-white shadow-[0_0_15px_rgba(74,222,128,0.5)] transition hover:shadow-[0_0_20px_rgba(74,222,128,0.8)]"
          >
            <span className="min-w-0 flex-1 text-left text-[10px] font-semibold uppercase tracking-[0.08em] leading-[1.35] text-white/85 break-words">
              {card.cta}
            </span>
            <span className="shrink-0">
              <ArrowIcon />
            </span>
          </a>
        )}
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes variant-marquee-slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .variant-marquee-box {
          max-width: 20ch;
        }
        .variant-marquee-track {
          display: inline-flex;
          white-space: nowrap;
          animation: variant-marquee-slide 12s linear infinite;
          animation-play-state: paused;
        }
        .variant-marquee-box:hover .variant-marquee-track {
          animation-play-state: running;
        }
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out forwards;
        }
      `}</style>

      <Section
        className={
          newDesignMode
            ? "relative isolate overflow-hidden bg-[#f7f8fb] !px-4 !py-5 sm:!px-6 sm:!py-8 lg:!px-8 lg:!py-10"
            : "bg-[#f7f8fb]"
        }
      >
        {newDesignMode && modelImage ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 z-0 h-[210px] w-full opacity-25 sm:h-[240px] sm:opacity-30 md:right-[max(1rem,calc((100vw-80rem)/2+1rem))] md:top-[-2px] md:h-[220px] md:w-[430px] md:overflow-hidden md:opacity-70"
          >
            <Image
              src={modelImage}
              alt=""
              fill
              sizes="(max-width: 1023px) 100vw, 430px"
              className="translate-x-[8%] object-contain object-right-top md:object-right-center md:scale-100 mix-blend-multiply [mask-image:linear-gradient(to_bottom,black_50%,transparent)] sm:translate-x-0"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(242,248,254,0.5)_0%,rgba(242,248,254,0.75)_58%,#f2f8fe_100%)] lg:bg-none" />
          </div>
        ) : null}

        <Container
          className={`relative z-10 !max-w-7xl ${documentMode ? (newDesignMode ? "!px-0" : "px-0 sm:px-0 lg:px-0") : "px-2"}`}
        >
          <div className="max-w-[760px] text-left">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#1289d5]/40 bg-[linear-gradient(135deg,#042f5a,#075b94)] px-3.5 py-1.5 text-[14px] font-bold uppercase text-white shadow-[0_0_20px_rgba(26,145,232,0.25)] sm:mb-5 sm:text-[13px]">
              <span>{documentMode ? "Variants We Cover" : data.tag}</span>
            </div>

            <h2
              style={{
                fontFamily:
                  '"Bebas Neue", "Urbanist", ui-sans-serif, system-ui, sans-serif',
                letterSpacing: "0.01em",
              }}
              className={`max-w-[760px] font-[var(--font-urbanist)] font-extrabold leading-[1.02] tracking-normal text-[#0d1b2e] ${newDesignMode ? "!text-[40px] sm:!text-[41px] lg:!text-[46px]" : "text-[30px] md:text-[40px]"}`}
            >
              {headingLines.map((line, index) => {
                const isAccent =
                  headingLines.length > 1 && index === headingLines.length - 1;
                return (
                  <span
                    key={`${line}-${index}`}
                    className={`block ${isAccent ? "text-[#15803d]" : ""}`}
                  >
                    {line}
                  </span>
                );
              })}
            </h2>
            <p className="mt-3 hidden max-w-[760px] text-[14px] leading-[1.75] text-slate-600 md:block">
              {data.subheading}
            </p>
          </div>

          <div className="mt-6 md:mt-9">
            <div className="grid grid-cols-2 gap-3 md:hidden">
              {mobileCardsToDisplay.map((card) => {
                const shortName = formatVariantName(card.h3);
                const isOpen = openCard === card.slug;
                const animateChevron = !isOpen && !seenCards[card.slug];
                const vehicleImage = resolveVariantVehicleImage({
                  card,
                  brandSlug,
                  brandName,
                  modelSlug,
                  modelName,
                });
                return (
                  <article
                    key={card.slug}
                    className={`relative isolate ${isOpen ? "z-[60]" : "z-[1]"}`}
                  >
                    <div
                      className={`relative ${isOpen ? "overflow-visible" : "overflow-hidden"} rounded-[12px] border bg-white transition duration-300 ${isOpen
                          ? "rounded-t-[12px] rounded-b-none border-b-0 border-[#2969af] shadow-[0_0_0_1px_rgba(42,109,214,1),0_0_5px_rgba(42,109,214,0.4),0_0_12px_rgba(42,109,214,0.3),0_0_20px_rgba(42,109,214,0.2),0_3px_10px_rgba(42,109,214,0.25)]"
                          : "border-slate-200 shadow-[0_2px_8px_rgba(13,27,46,0.05)]"
                        }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleCard(card.slug)}
                        aria-expanded={isOpen}
                        className="flex h-[252px] w-full flex-col items-center px-0 pb-4 pt-0 text-center"
                      >
                        <div className="relative h-[118px] w-full overflow-hidden rounded-t-[12px] bg-[#f8fbff]">
                          <Image
                            src={vehicleImage.src}
                            alt={shortName}
                            fill
                            className={
                              newDesignMode
                                ? "object-contain object-center p-[6px]"
                                : "object-contain object-center p-[6px]"
                            }
                            sizes="(max-width: 767px) 50vw, 25vw"
                          />
                        </div>

                        <div className="mt-2 flex w-full flex-1 flex-col px-3">
                          <div className="min-h-[32px] font-[var(--font-urbanist)] text-[13px] font-extrabold leading-[1.18] text-[#0d1b2e]">
                            {shortName}
                          </div>
                          <p className="mt-1.5 min-h-[28px] text-[10px] font-semibold leading-[1.4] text-[#4b5563]">
                            {normalizeVariantSubtitle(card.subtitle)}
                          </p>
                          <p className="mt-auto pt-2 font-[var(--font-urbanist)] text-[12.5px] font-semibold leading-tight text-[#374151]">
                            Rebuilt: {card.priceRange}
                          </p>
                        </div>

                        <span className="mt-2 inline-flex text-[#15803d]">
                          <ChevronIcon
                            open={isOpen}
                            animated={animateChevron}
                          />
                        </span>
                      </button>

                      {isOpen
                        ? renderExpandedPanel(
                          card,
                          "absolute left-[-1px] right-[-1px] top-full z-50 min-h-[252px] rounded-b-[12px] border-t-0",
                        )
                        : null}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="hidden items-start gap-4 md:grid md:grid-cols-2 xl:grid-cols-5 2xl:grid-cols-6">
              {renderableCards.map((card, index) => {
                const rowIndex = Math.floor(index / columns);
                const isLastRow = rowIndex === totalRows - 1 && totalRows > 1;
                const isOpen = openCard === card.slug;
                const shortName = formatVariantName(card.h3);
                const animateChevron = !isOpen && !seenCards[card.slug];
                const codeAndType = formatCodeAndType(card);
                const vehicleImage = resolveVariantVehicleImage({
                  card,
                  brandSlug,
                  brandName,
                  modelSlug,
                  modelName,
                });
                const variantHref = variantRouteMap?.[card.slug];

                return (
                  <article key={card.slug} className="relative">
                    <div
                      className={`flex min-h-[214px] flex-col overflow-hidden rounded-[12px] border bg-white transition duration-300 ${isOpen
                          ? `border-[#2969af] shadow-[0_0_0_1px_rgba(42,109,214,1),0_0_5px_rgba(42,109,214,0.4),0_0_12px_rgba(42,109,214,0.3),0_0_20px_rgba(42,109,214,0.2),0_3px_10px_rgba(42,109,214,0.25)] ${useStackedExpansion
                            ? "rounded-b-none border-b-0"
                            : isLastRow
                              ? "rounded-b-[12px] rounded-t-none border-t-0"
                              : "rounded-t-[12px] rounded-b-none border-b-0"
                          }`
                          : "border-slate-200 shadow-[0_2px_8px_rgba(13,27,46,0.05)] hover:border-slate-300 hover:shadow-[0_8px_18px_rgba(13,27,46,0.08)]"
                        }`}
                    >
                      {/* CLICKABLE WALL-TO-WALL IMAGE */}
                      {variantHref ? (
                        <Link href={variantHref} className="block w-full">
                          <div className="relative h-[118px] w-full overflow-hidden bg-[#f8fbff]">
                            <Image
                              src={vehicleImage.src}
                              alt={shortName}
                              fill
                              className={
                                newDesignMode
                                  ? "object-contain object-center p-[6px]"
                                  : "object-contain object-center p-[6px]"
                              }
                              sizes="20vw"
                            />
                          </div>
                        </Link>
                      ) : (
                        <div className="relative h-[118px] w-full overflow-hidden bg-[#f8fbff]">
                          <Image
                            src={vehicleImage.src}
                            alt={shortName}
                            fill
                            className={
                              newDesignMode
                                ? "object-contain object-center p-[6px]"
                                : "object-contain object-center p-[6px]"
                            }
                            sizes="20vw"
                          />
                        </div>
                      )}

                      {/* CONTENT */}
                      <div className="flex flex-col px-2 pb-2 text-center">
                        {/* CLICKABLE VARIANT TITLE */}
                        {variantHref ? (
                          <Link
                            href={variantHref}
                            className="mt-2 block w-full transition hover:text-[#15803d]"
                          >
                            <AutoTicker
                              text={shortName}
                              className="font-[var(--font-urbanist)] text-[13px] font-semibold leading-[1.25] text-[#0d1b2e]"
                            />
                          </Link>
                        ) : (
                          <AutoTicker
                            text={shortName}
                            className="mt-2 font-[var(--font-urbanist)] text-[13px] font-semibold leading-[1.25] text-[#0d1b2e]"
                          />
                        )}

                        {/* ENGINE CODE / TYPE */}
                        <AutoTicker
                          text={codeAndType}
                          className="mt-1.5 text-[9.5px] font-medium leading-[1.35] text-[#4b5563]"
                        />

                        {/* REBUILT PRICE */}
                        <AutoTicker
                          text={`Rebuilt Engines: ${card.priceRange}`}
                          className="mt-2 font-[var(--font-urbanist)] text-[12px] font-semibold leading-[1.35] text-[#374151]"
                        />

                        {/* EXPAND ARROW */}
                        <button
                          type="button"
                          onClick={() => toggleCard(card.slug)}
                          aria-expanded={isOpen}
                          aria-label={
                            isOpen
                              ? `Hide ${card.h3} details`
                              : `Show ${card.h3} details`
                          }
                          className="mx-auto mt-2 inline-flex text-[#15803d]"
                        >
                          <ChevronIcon
                            open={isOpen}
                            animated={animateChevron}
                          />
                        </button>
                      </div>
                    </div>

                    {isOpen
                      ? renderExpandedPanel(
                        card,
                        `${useStackedExpansion
                          ? "rounded-b-[12px] border-t-0"
                          : `absolute left-[-1px] right-[-1px] z-50 ${isLastRow
                            ? "bottom-full rounded-t-[12px] border-b-0"
                            : "top-full rounded-b-[12px] border-t-0"
                          }`
                        } min-h-[220px] sm:min-h-[236px]`,
                      )
                      : null}
                  </article>
                );
              })}
            </div>

            {isMobile && renderableCards.length > MOBILE_VISIBLE_COUNT && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllCards((prev) => !prev)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2d6bff] bg-[#061a33] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_0_15px_rgba(45,107,255,0.55)] transition hover:bg-[#061a33] hover:shadow-[0_0_20px_rgba(45,107,255,0.85)]"
                >
                  {showAllCards ? "View Less" : "View More"}
                  <ChevronIcon open={showAllCards} animated={false} />
                </button>
              </div>
            )}
          </div>

          {/* --- ACCORDION SECTION --- */}
          <div className="mt-5 rounded-[18px] border border-slate-200 bg-[#f8fafc] p-4 md:mt-8 md:p-5">
            <button
              type="button"
              onClick={() => setIsDirectoryOpen((prev) => !prev)}
              className="w-full text-left flex items-start justify-between gap-4 bg-transparent border-none outline-none cursor-pointer p-0"
            >
              <div>
                <div className="flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#15803d]">
                  <BookIcon />
                  <span>{data.directory.label ?? "Variant Directory"}</span>
                </div>
              </div>
              <span
                className={`mt-1 flex-shrink-0 text-[#15803d] transition-transform duration-300 ${isDirectoryOpen ? "rotate-180" : ""}`}
              >
                <ChevronIcon open={isDirectoryOpen} animated={false} />
              </span>
            </button>

            {!isDirectoryOpen && data.closing ? (
              <div className="mt-3 flex items-start gap-2.5">
                <NotSureIcon className="mt-[2px] h-6 w-6 flex-shrink-0" />
                <p className="text-[12.5px] leading-[1.6] text-slate-600">
                  {data.closing}
                </p>
              </div>
            ) : null}

            {isDirectoryOpen && (
              <div className="animate-fade-in-down mt-4 max-h-[calc(100vh-10rem)] overflow-y-auto pr-4 scroll-smooth overscroll-contain md:mt-0 md:max-h-none md:overflow-visible md:pr-0">
                {directoryHeading ? (
                  <h3 className="font-[var(--font-urbanist)] text-[22px] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#0d1b2e] md:text-[24px]">
                    {directoryHeadingLines.map((line, index) => (
                      <span key={`${line}-${index}`} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>
                ) : null}

                {directoryIntro ? (
                  <p className="mt-4 max-w-[900px] text-[13px] leading-[1.7] text-slate-600">
                    {directoryIntro}
                  </p>
                ) : null}

                <div className="mt-5 grid gap-3 lg:grid-cols-3">
                  {renderableDirectoryGroups.map((group) => (
                    <article
                      key={group.title}
                      className="rounded-sm border-[0.5px] border-[#2a6dd6] shadow-[0_0_3px_rgba(42,109,214,0.4),0_0_6px_rgba(42,109,214,0.2),0_2px_4px_rgba(42,109,214,0.15)] bg-white p-4"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#15803d]">
                        {group.title}
                      </p>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {group.items.map((item, index) => {
                          const fullText = [modelName, item]
                            .filter(Boolean)
                            .join(" ");
                          const isLong = fullText.length > 20;
                          const truncatedText = isLong
                            ? `${fullText.slice(0, 20)}...`
                            : fullText;

                          return (
                            <span
                              key={`${group.title}-${item}-${index}`}
                              className={`group/marquee relative inline-flex min-w-0 w-full items-center justify-center overflow-hidden rounded-[8px] border border-slate-200 bg-slate-50 px-[8px] py-[7px] text-[11px] font-semibold text-slate-700 ${isLong ? "variant-marquee-box max-w-none" : ""}`}
                              title={fullText}
                            >
                              {!isLong ? (
                                <span className="block w-full truncate text-center">
                                  {fullText}
                                </span>
                              ) : (
                                <>
                                  <span className="block w-full whitespace-nowrap text-center transition-opacity duration-300 group-hover/marquee:opacity-0">
                                    {truncatedText}
                                  </span>
                                  <span className="absolute inset-0 flex items-center px-[8px] opacity-0 transition-opacity duration-300 group-hover/marquee:opacity-100">
                                    <span className="variant-marquee-track">
                                      <span className="pr-8">{fullText}</span>
                                      <span className="pr-8">{fullText}</span>
                                    </span>
                                  </span>
                                </>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </article>
                  ))}
                </div>

                {data.closing ? (
                  <div className="mt-4 flex items-start gap-2.5">
                    <NotSureIcon className="mt-[2px] h-6 w-6 flex-shrink-0" />
                    <p className="text-[12.5px] leading-[1.6] text-slate-600">
                      {data.closing}
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}

export default function NewDocModelVariantCoverage({
  data,
  variantRouteMap,
}: {
  data: ModelPageData;
  variantRouteMap?: Record<string, string>;
}) {
  return (
    <VariantCoverageSectionImplementation
      data={data.sections.variantCoverage}
      brandName={data.brand.name}
      brandSlug={data.brand.slug}
      modelName={data.model.name}
      modelSlug={data.model.slug}
      modelImage={
        data.assets.mainImage || data.assets.smallImage || data.assets.heroBg
      }
      variantRouteMap={variantRouteMap}
      documentMode
      newDesignMode
    />
  );
}
