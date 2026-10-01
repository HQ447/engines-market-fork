"use client";

import Image from "next/image";
import { useState } from "react";
import type { ModelPageData } from "@/types/model";
import { FaChevronRight } from "react-icons/fa6";
import { TbArrowRight, TbEngine, TbRefresh } from "react-icons/tb";
import ModelMobileAccordion from "./ModelMobileAccordion";

type Props = { data: ModelPageData };

function normalize(value: string) {
  return value.replace(/[–—]/g, "-").trim();
}

function engineArtwork(title: string, index: number) {
  const value = title.toLowerCase();
  if (
    value.includes("performance") ||
    value.includes("remanufactured") ||
    index % 3 === 2
  ) {
    return "/images/shared/hero-engines/temporary-performance-engine-cutout.png";
  }
  if (
    value.includes("petrol") ||
    value.includes("refurbished") ||
    index % 3 === 1
  ) {
    return "/images/shared/hero-engines/temporary-petrol-engine-cutout.png";
  }
  return "/images/shared/hero-engines/temporary-diesel-engine-cutout.png";
}

function Check() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#18d29e] text-[12px] font-black text-[#04284d]">
      ✓
    </span>
  );
}

function modelTypeTitle(modelName: string, typeTitle: string) {
  return typeTitle.toLowerCase().startsWith(modelName.toLowerCase())
    ? typeTitle
    : `${modelName} ${typeTitle}`;
}

function EngineTypeIcon({
  title,
  className = "h-6 w-6",
}: {
  title: string;
  className?: string;
}) {
  const normalizedTitle = title.toLowerCase();
  let iconName = "type-rebuilt";

  if (normalizedTitle.includes("used")) iconName = "type-used";
  else if (normalizedTitle.includes("refurbished"))
    iconName = "type-refurbished";
  else if (normalizedTitle.includes("reconditioned"))
    iconName = "type-reconditioned";
  else if (
    normalizedTitle.includes("supply") ||
    normalizedTitle.includes("fit")
  )
    iconName = "type-supply-fit";
  else if (
    normalizedTitle.includes("remanufactured") ||
    normalizedTitle.includes("manufactured")
  )
    iconName = "type-remanufactured";

  return (
    <img
      src={`/icons/engine-market/${iconName}.png`}
      alt=""
      aria-hidden="true"
      className={`${className} object-contain`}
      loading="lazy"
    />
  );
}

function splitPriceRange(value: string) {
  const normalizedValue = normalize(value);
  const match = normalizedValue.match(
    /^(.*?)(\s*\([^)]*\)|\s+supply only|\s+added to engine price)$/i,
  );

  return {
    price: match?.[1]?.trim() || normalizedValue,
    suffix: match?.[2]?.trim(),
  };
}

function typeVariant(title: string) {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes("remanufactured")) return "remanu";
  if (normalizedTitle.includes("refurbished")) return "refurb";
  if (normalizedTitle.includes("supply")) return "supplyfit";
  if (normalizedTitle.includes("used")) return "used";
  if (normalizedTitle.includes("rebuilt")) return "rebuilt";
  return "recon";
}

function typeBadge(title: string) {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes("remanufactured")) return "Remanufactured";
  if (normalizedTitle.includes("refurbished")) return "Refurbished";
  if (normalizedTitle.includes("supply")) return "Supply & Fit";
  if (normalizedTitle.includes("used")) return "Used";
  if (normalizedTitle.includes("rebuilt")) return "Rebuilt";
  return "Reconditioned";
}

function MobileEngineTypeStack({
  types,
  activeIndex,
  flippedIndex,
  onSelect,
  onFlip,
  onUnflip,
}: {
  types: ModelPageData["sections"]["engineTypes"]["types"];
  activeIndex: number | null;
  flippedIndex: number | null;
  onSelect: (index: number) => void;
  onFlip: (index: number) => void;
  onUnflip: () => void;
}) {
  return (
    <div className="mt-[18px] md:hidden">
      <div className="relative mx-auto max-w-[520px] overflow-visible px-[2px] pb-4">
        {types.map((type, stackIndex) => {
          const active = stackIndex === activeIndex;
          const flipped = stackIndex === flippedIndex;
          const priceRange = splitPriceRange(type.priceRange);
          const previousIsActive =
            stackIndex > 0 && stackIndex - 1 === activeIndex;
          const offsetX = Math.min(stackIndex * 14, 52);
          const badge = typeBadge(type.title);
          const variant = typeVariant(type.title);
          const badgeClass =
            variant === "remanu"
              ? "border-[#bfdbfe] bg-[#eff6ff] text-[#2563eb]"
              : variant === "refurb"
                ? "border-[#fde68a] bg-[#fefce8] text-[#a16207]"
                : variant === "supplyfit"
                  ? "border-[#e9d5ff] bg-[#fdf4ff] text-[#7c3aed]"
                  : variant === "used"
                    ? "border-[#e5e7eb] bg-[#f8f9fa] text-[#6b7280]"
                    : "border-[#d8e6f5] bg-[#edf7ff] text-[#0d1b2e]";

          return (
            <article
              key={type.title}
              className={`relative transition-all duration-300 ${active ? "z-30" : "z-10"}`}
              style={{
                marginTop: stackIndex === 0 ? 0 : previousIsActive ? 8 : -54,
                transform: `translateX(${offsetX}px)`,
                width: "calc(100% - 42px)",
                height: active ? (flipped ? 220 : 188) : undefined,
                perspective: active ? "1200px" : undefined,
                WebkitPerspective: active ? "1200px" : undefined,
              }}
            >
              {active ? (
                <div
                  className="relative h-full w-full transition-transform duration-[550ms]"
                  style={{
                    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    transformStyle: "preserve-3d",
                    WebkitTransformStyle: "preserve-3d",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => onFlip(stackIndex)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onFlip(stackIndex);
                        }
                      }}
                      className="flex h-full w-full cursor-pointer flex-col rounded-[10px] border border-[#d8e6f5] bg-white shadow-[0_8px_18px_rgba(13,27,46,0.07)]"
                      aria-expanded={!flipped}
                    >
                      <div className="flex items-center gap-3 px-3 py-2.5">
                        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#e8f4fd] text-[#0d1b2e]">
                          <EngineTypeIcon title={type.title} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-extrabold uppercase leading-[1.12] text-[#0d1b2e]">
                            {type.title}
                          </span>
                          <span className="mt-1 block text-[11px] leading-[1.45] text-[#64748b]">
                            {normalize(
                              type.frontDescription || type.description,
                            )}
                          </span>
                        </span>
                      </div>
                      <div className="mx-3 h-px bg-[#d8e6f5]" />
                      <div className="px-3 pb-2.5 pt-2.5">
                        <div className="grid grid-cols-[minmax(145px,1fr)_1px_minmax(0,1fr)] items-center gap-3">
                          <div className="min-w-0">
                            <div className="text-[10.5px] font-medium leading-[1.2] text-[#64748b]">
                              Average price range
                            </div>
                            <div className="mt-1 whitespace-nowrap text-[16px] font-extrabold leading-[1.1] text-[#0d1b2e]">
                              {priceRange.price}
                            </div>
                            {priceRange.suffix ? (
                              <div className="mt-0.5 whitespace-nowrap text-[9px] font-semibold leading-[1.2] text-[#64748b]">
                                ({priceRange.suffix})
                              </div>
                            ) : null}
                          </div>
                          <div className="h-10 w-px bg-[#d7dde5]" />
                          <div className="flex min-w-0 flex-col items-start gap-2 pl-1">
                            <a
                              href="#quote-form"
                              data-quote-context={type.title}
                              data-quote-source="engine-types-mobile-stack"
                              className="inline-flex min-w-0 items-center justify-between gap-2 text-[10px] font-semibold uppercase leading-[1.28] text-[#059669]"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <span className="min-w-0">{type.cta}</span>
                              <TbArrowRight className="h-3.5 w-3.5 flex-none" />
                            </a>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                onFlip(stackIndex);
                              }}
                              className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.04em] text-[#0d1b2e]/70"
                            >
                              <TbRefresh className="h-3.5 w-3.5" />
                              What is it?
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <div className="h-full overflow-y-auto rounded-[10px] border-[1.5px] border-[#3b82f6] bg-[#061a33] px-3 py-2.5 text-white shadow-[0_0_16px_rgba(59,130,246,0.38)]">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span
                          className={`inline-flex rounded-full border px-[8px] py-[1px] text-[8.5px] font-bold uppercase tracking-[0.7px] ${badgeClass}`}
                        >
                          {badge}
                        </span>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onUnflip();
                          }}
                          className="inline-flex items-center gap-1 text-[8.5px] font-bold text-[#94a3b8]"
                        >
                          <TbRefresh className="h-3.5 w-3.5" />
                          Flip back
                        </button>
                      </div>
                      <p className="text-[12px] leading-[1.48] text-[#e2e8f0]">
                        {normalize(type.backDescription || type.description)}
                      </p>
                      {type.backBullets?.length ? (
                        <ul className="mt-2 space-y-1 text-[10.5px] leading-[1.42] text-[#cbd5e1]">
                          {type.backBullets.slice(0, 3).map((bullet) => (
                            <li key={bullet} className="flex gap-2">
                              <span className="mt-[4px] h-[5px] w-[5px] flex-none rounded-full bg-[#22c55e]" />
                              <span>{normalize(bullet)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect(stackIndex)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(stackIndex);
                    }
                  }}
                  className="min-h-[112px] w-full cursor-pointer rounded-[8px] border border-[#d8e6f5] bg-white text-left shadow-[0_8px_18px_rgba(13,27,46,0.07)]"
                  aria-expanded={false}
                >
                  <div className="flex items-center gap-3 px-3 py-3">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#e8f4fd] text-[#0d1b2e]">
                      <EngineTypeIcon title={type.title} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 block text-[13px] font-extrabold uppercase leading-[1.12] text-[#0d1b2e]">
                        {type.title}
                      </span>
                    </span>
                    <span className="ml-auto flex-none text-right">
                      <span className="block whitespace-nowrap text-[12px] font-extrabold leading-none text-[#15803d]">
                        {priceRange.price}
                      </span>
                      {priceRange.suffix ? (
                        <span className="mt-1 block max-w-[82px] truncate whitespace-nowrap text-[8.5px] font-semibold leading-none text-[#64748b]">
                          ({priceRange.suffix})
                        </span>
                      ) : null}
                    </span>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function MobileSupplyFitCard({
  type,
  flipped,
  onToggle,
}: {
  type: ModelPageData["sections"]["engineTypes"]["types"][number];
  flipped: boolean;
  onToggle: () => void;
}) {
  const priceRange = splitPriceRange(type.priceRange);

  return (
    <div className="mt-4 flex justify-center md:hidden">
      <article
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onToggle();
          }
        }}
        className={`w-full max-w-[430px] cursor-pointer rounded-[10px] border shadow-[0_8px_18px_rgba(13,27,46,0.08)] ${flipped ? "border-[#d8e6f5] bg-white text-[#0d1b2e]" : "border-[#173a73] bg-[#061a33] text-white"}`}
        aria-expanded={flipped}
      >
        <div className="flex items-start gap-2.5 px-3 py-2.5">
          <span
            className={`flex h-9 w-9 flex-none items-center justify-center rounded-full ${flipped ? "bg-[#e8f4fd]" : "bg-white/10"}`}
          >
            <EngineTypeIcon title={type.title} />
          </span>
          <div className="min-w-0 flex-1">
            <h3
              className={`text-[13px] font-extrabold uppercase leading-[1.18] ${flipped ? "text-[#0d1b2e]" : "text-white"}`}
            >
              {type.title}
            </h3>
            <p
              className={`mt-1 text-[11px] leading-[1.38] ${flipped ? "text-[#475569]" : "line-clamp-2 text-white/78"}`}
            >
              {normalize(
                flipped
                  ? type.backDescription || type.description
                  : type.frontDescription || type.description,
              )}
            </p>
          </div>
          <span
            className={`mt-0.5 inline-flex items-center gap-1 text-[8.5px] font-bold uppercase ${flipped ? "text-[#0d1b2e]/60" : "text-white/60"}`}
          >
            <TbRefresh className="h-3 w-3" />
            {flipped ? "Flip back" : "What is it?"}
          </span>
        </div>
        {flipped && type.backBullets?.length ? (
          <ul className="mx-3 mb-2 space-y-1 rounded-[8px] bg-[#f8fbff] px-3 py-2 text-[10.5px] leading-[1.38] text-[#475569]">
            {type.backBullets.slice(0, 3).map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span className="mt-[5px] h-[4px] w-[4px] flex-none rounded-full bg-[#15803d]" />
                <span>{normalize(bullet)}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div
          className={`mx-3 h-px ${flipped ? "bg-[#d8e6f5]" : "bg-white/12"}`}
        />
        <div className="grid grid-cols-[minmax(132px,1fr)_1px_minmax(0,1fr)] items-center gap-3 px-3 py-2.5">
          <div className="min-w-0">
            <div
              className={`text-[10px] font-medium ${flipped ? "text-[#64748b]" : "text-white/65"}`}
            >
              Average price range
            </div>
            <div
              className={`mt-1 whitespace-nowrap text-[16px] font-extrabold ${flipped ? "text-[#0d1b2e]" : "text-white"}`}
            >
              {priceRange.price}
            </div>
            {priceRange.suffix ? (
              <div
                className={`mt-0.5 whitespace-nowrap text-[9px] font-semibold ${flipped ? "text-[#64748b]" : "text-white/65"}`}
              >
                ({priceRange.suffix})
              </div>
            ) : null}
          </div>
          <div
            className={`h-9 w-px ${flipped ? "bg-[#d7dde5]" : "bg-white/15"}`}
          />
          <a
            href="#quote-form"
            data-quote-context={type.title}
            data-quote-source="engine-types-supply-fit-mobile"
            className={`inline-flex min-w-0 items-center justify-between gap-2 text-[10px] font-semibold uppercase ${flipped ? "text-[#059669]" : "text-[#4ade80]"}`}
            onClick={(event) => event.stopPropagation()}
          >
            <span className="min-w-0">{type.cta}</span>
            <TbArrowRight className="h-3.5 w-3.5 flex-none" />
          </a>
        </div>
      </article>
    </div>
  );
}

function EngineCard({
  data,
  index,
  flipped,
  onFlip,
}: {
  data: ModelPageData;
  index: number;
  flipped: boolean;
  onFlip: () => void;
}) {
  const section = data.sections.engineTypes;
  const type = section.types[index];
  if (!type) return null;
  const priceRange = splitPriceRange(type.priceRange);
  const bullets = type.backBullets?.slice(0, 3) ?? [];
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onFlip();
    }
  };

  return (
    <div
      className="[perspective:1200px]"
      role="button"
      tabIndex={0}
      onClick={onFlip}
      onKeyDown={handleKeyDown}
      aria-pressed={flipped}
    >
      <div
        className="relative min-h-[400px] transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div
          className="absolute inset-0 flex  flex-col overflow-hidden rounded-2xl border border-[#d8e6f2] bg-white/95 p-3.5 shadow-[0_8px_24px_rgba(20,80,127,0.1)] sm:p-4"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="relative flex h-[96px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-transparent">
            <EngineTypeIcon title={type.title} className="h-16 w-16" />
            <span className="absolute left-3 top-3 rounded-lg bg-[#061a33] px-3 py-1.5 text-[13px] font-extrabold text-white">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h4 className="mt-3 line-clamp-1 text-[15px] font-extrabold leading-[1.12] text-[#09264e] lg:text-[15px]">
            {normalize(modelTypeTitle(data.model.name, type.title))}
          </h4>
          <p className="mt-2 line-clamp-4 hover:line-clamp-none min-h-[54px] text-[14px] leading-[1.45] text-[#476382]">
            {normalize(type.frontDescription || type.description)}
          </p>
          <div className="rounded-xl bg-[#f6f6f6] px-3.5 py-2.5">
            <p className="text-[11px] text-[#55708d]">
              {section.ui?.priceLabel || "Average price range"}:
            </p>
            <p className="mt-0.5 text-[16px] sm:text-[19px] font-extrabold leading-tight text-[#09264e]">
              {priceRange.price}
              {priceRange.suffix ? (
                <span className="ml-1 text-[10px] font-bold sm:text-[12px]">
                  {priceRange.suffix}
                </span>
              ) : null}
            </p>
          </div>
          <p className="mt-2 flex min-h-[42px] gap-2 text-[12px] leading-[1.45] text-[#476382]">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e4f0f8] text-[13px] font-bold text-[#28608f]">
              i
            </span>
            {normalize(
              type.frontDisclaimer ||
                "Prices vary by mileage, trim and engine code verification.",
            )}
          </p>
          <a
            href="#quote-form"
            data-quote-context={type.title}
            data-quote-source="engine-types"
            onClick={(event) => event.stopPropagation()}
            className=" inline-flex min-h-[48px] items-center justify-center rounded-lg border border-[#15803d] bg-[#15803d] px-3 text-center text-[11px] font-extrabold uppercase leading-[1.25] text-white shadow-[0_6px_14px_rgba(0,97,62,0.28)] transition hover:brightness-110"
          >
            {normalize(type.cta)}{" "}
            <span className="ml-2 text-[17px]">
              <FaChevronRight />
            </span>
          </a>
        </div>
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border-[1.5px] border-[#28aefe] bg-[#061a33] p-4 text-white shadow-[0_0_24px_rgba(35,166,255,0.58)]"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-lg border border-[#39b9ff] bg-[#061a33] px-3 py-1.5 text-[13px] font-extrabold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onFlip();
                }}
                className="rounded-full border border-white/40 px-3 py-1 text-[12px] font-bold text-white"
              >
                ← Back to front
              </button>
            </div>
            <h3 className="mt-2 text-[20px] font-extrabold leading-tight text-white">
              {normalize(type.title)}
            </h3>
            <p className="mt-1 text-[14px] text-white/75">
              Key benefits &amp; what to expect
            </p>
            <p className="mt-1 text-[13px] leading-[1.45] text-white/85">
              {normalize(type.backDescription || type.description)}
            </p>
            <ul className="mt-1 space-y-2">
              {bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex gap-2 text-[12px] leading-[1.35] text-white/90"
                >
                  <Check />
                  {normalize(bullet)}
                </li>
              ))}
            </ul>
            <div className="mt-auto border-t border-white/25 pt-2">
              <p className="text-[13px] font-bold">
                Trusted replacement engines
              </p>
              <p className="mt-1 text-[11px] text-white/70">
                Built for a longer journey with warranty-backed support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewDocModelEngineTypes({ data }: Props) {
  const section = data.sections.engineTypes;
  const sectionImage =
    data.assets.mainImage || data.assets.smallImage || data.assets.heroBg;
  const types = section.types.slice(0, 6);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [activeMobileCard, setActiveMobileCard] = useState<number | null>(null);
  const [flippedMobileCard, setFlippedMobileCard] = useState<number | null>(
    null,
  );

  return (
    <section
      id="model-engine-types"
      className="relative overflow-hidden bg-white px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
    >
      <ModelMobileAccordion
        title={normalize(
          (section.headingLines?.length
            ? section.headingLines
            : [section.h2])[0] ?? section.h2,
        )}
        icon={<TbEngine className="h-5 w-5" aria-hidden="true" />}
      >
        <div className="pointer-events-none absolute right-0 top-0 z-0 h-[210px] w-full opacity-25 sm:h-[240px] sm:opacity-30 md:right-[max(1rem,calc((100vw-80rem)/2+1rem))] md:top-[-2px] md:h-[220px] md:w-[430px] md:overflow-hidden md:opacity-70">
          {sectionImage ? (
            <Image
              src={sectionImage}
              alt=""
              fill
              className="translate-x-[8%] object-contain object-right-top md:object-right-center md:scale-100 mix-blend-multiply [mask-image:linear-gradient(to_bottom,black_50%,transparent)] sm:translate-x-0"
              sizes="390px"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0.75)_58%,#fff_100%)] lg:bg-none" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="relative">
            <div className="max-w-[760px]">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1289d5]/40 bg-[linear-gradient(135deg,#042f5a,#075b94)] px-3.5 py-1.5 text-[13px] font-bold uppercase text-white shadow-[0_0_20px_rgba(26,145,232,0.25)]">
                {section.tag}
              </span>
              <h2
                style={{
                  fontFamily:
                    '"Bebas Neue", "Urbanist", ui-sans-serif, system-ui, sans-serif',
                  letterSpacing: "0.01em",
                }}
                className="mt-5 !text-[40px] font-extrabold leading-[1.04] tracking-normal !tracking-[-0.02em] text-[#09264e] sm:!tracking-[0.01em] sm:!text-[41px] lg:!text-[46px]"
              >
                {(section.headingLines?.length
                  ? section.headingLines
                  : [section.h2]
                ).map((line, index) => (
                  <span
                    key={`${line}-${index}`}
                    className={`block ${index === 1 ? "text-[#15803d]" : ""}`}
                  >
                    {normalize(line)}
                  </span>
                ))}
              </h2>
              <p className="mt-4 max-w-[760px] text-[14px] leading-[1.6] text-[#526a87] lg:text-[15px]">
                {normalize(section.intro)}
              </p>
            </div>
          </div>
          <MobileEngineTypeStack
            types={types}
            activeIndex={activeMobileCard}
            flippedIndex={flippedMobileCard}
            onSelect={(index) => {
              setActiveMobileCard(index);
              setFlippedMobileCard(null);
            }}
            onFlip={(index) => {
              setActiveMobileCard(index);
              setFlippedMobileCard(index);
            }}
            onUnflip={() => setFlippedMobileCard(null)}
          />
          <div className="mt-8 hidden gap-4 md:grid lg:grid-cols-3">
            {types.map((type, index) => (
              <EngineCard
                key={type.title}
                data={data}
                index={index}
                flipped={flippedIndex === index}
                onFlip={() =>
                  setFlippedIndex((current) =>
                    current === index ? null : index,
                  )
                }
              />
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-[#1b8ed9]/60 bg-[#061a33] p-5 text-white  sm:p-6">
            <p className="text-[16px] font-extrabold">
              {section.closingCard?.title ||
                "All engine types include a minimum 12-month unlimited mileage warranty"}
            </p>
            <p className="mt-2 max-w-[1050px] text-[13px] leading-[1.6] text-white/80">
              {normalize(section.closing)}
            </p>
          </div>
        </div>
      </ModelMobileAccordion>
    </section>
  );
}
