"use client";

import { useState, type CSSProperties } from "react";
import type { HowItWorksData } from "@/types/brand";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

type Props = {
  data: HowItWorksData;
  bgImage: string;
  sectionId?: string;
  flush?: boolean;
  variantLayout?: boolean;
  compactSpacing?: boolean;
  newDesignMode?: boolean;
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TickIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path d="m3.2 8.3 3 3.1 6.7-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function splitHeading(title: string) {
  return title
    .split(/\s+-\s+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function renderMobileHeadingLine(line: string, index: number, isAccentLine: boolean) {
  const normalizedLine = normalizeCopy(line);
  const accentMatch = normalizedLine.match(/(BMW Replacement Engine|Replacement Engine|What to Choose|Choose)/i);
  if (!accentMatch || accentMatch.index === undefined) {
    if (isAccentLine) {
      const words = normalizedLine.split(/\s+/);
      const accentWordCount = Math.min(3, Math.max(1, words.length));
      const before = words.slice(0, -accentWordCount).join(" ");
      const accent = words.slice(-accentWordCount).join(" ");
      return (
        <>
          {before ? `${before} ` : ""}
          <span className="text-[#15803d]">{accent}</span>
        </>
      );
    }

    return normalizedLine;
  }

  const before = normalizedLine.slice(0, accentMatch.index);
  const accent = accentMatch[0];
  const after = normalizedLine.slice(accentMatch.index + accent.length);

  return (
    <>
      {before}
      <span className="text-[#15803d]">{accent}</span>
      {after}
    </>
  );
}

function normalizeCopy(text: string) {
  return text
    .replaceAll("Â£", "£")
    .replaceAll("Â·", "·")
    .replace(/[â€“â€”]/g, "-")
    .replaceAll("Â", "")
    .trim();
}

function sanitizeStepText(text: string) {
  return normalizeCopy(text)
    .replace(/^(?:🖼️|ðŸ–¼ï¸)\s*/u, "")
    .replace(/^\[[^\]]+\]\.?\s*/u, "")
    .replace(/^\s*->\s*/u, "")
    .trim();
}

type TrustIconConfig = {
  src: string;
  className: string;
  style?: CSSProperties;
};

function trustIconForLabel(label: string): TrustIconConfig {
  const normalized = label.toLowerCase();

  if (normalized.includes("nationwide") || normalized.includes("delivery") || normalized.includes("uk-wide")) {
    return {
      src: "/icons/engine-market/light-green-nationwide-delivery.png",
      className: "h-[30px] w-[44px] object-contain sm:h-[18px] sm:w-[30px]",
    };
  }

  if (normalized.includes("supplier")) {
    return {
      src: "/icons/engine-market/light-green-trusted-seller.png",
      className: "h-[30px] w-[30px] object-contain sm:h-[18px] sm:w-[18px]",
    };
  }

  if (normalized.includes("warranty")) {
    return {
      src: "/icons/engine-market/light-green-warranty.png",
      className: "h-[30px] w-[30px] object-contain sm:h-[16px] sm:w-[16px]",
    };
  }

  return {
    src: "/icons/engine-market/light-green-supply-fit.png",
    className: "h-[30px] w-[30px] object-contain sm:h-[18px] sm:w-[18px]",
  };
}

function stepIconSrc(card: HowItWorksData["cards"][number]) {
  if (card.number === 1) return "/Home/reg-here.webp";
  if (card.number === 2) return "/icons/engine-market/how-compare-prices-3d.png";
  if (card.number === 3) return "/icons/engine-market/how-choose-deal.png";

  const combined = `${card.front.h3} ${card.front.text} ${card.back.heading}`.toLowerCase();

  if (combined.includes("registration") || combined.includes("reg")) return "/Home/reg-here.webp";
  if (combined.includes("choose") || combined.includes("best deal") || combined.includes("save")) {
    return "/icons/engine-market/how-choose-deal.png";
  }
  if (combined.includes("compare")) return "/icons/engine-market/how-compare-prices-3d.png";
  if (combined.includes("quote")) return "/icons/engine-market/how-get-quote.png";

  return "/icons/engine-market/how-choose-deal.png";
}

export default function HowItWorksSection({
  data,
  bgImage,
  sectionId,
  flush = false,
  variantLayout = false,
  compactSpacing = false,
  newDesignMode = false,
}: Props) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const headingLines = data.headingLines?.length ? data.headingLines : splitHeading(data.h2);
  const ui = data.ui ?? {};
  const cards = data.cards.map((card) => ({
    ...card,
    front: {
      ...card.front,
      h3: normalizeCopy(card.front.h3),
      text: sanitizeStepText(card.front.text),
    },
    back: {
      ...card.back,
      heading: normalizeCopy(card.back.heading),
      text: normalizeCopy(card.back.text),
      bullets: card.back.bullets.map((bullet) => normalizeCopy(bullet)),
    },
  }));

  const footerTrustItems = (ui.mobileTrustItems ?? [
    "12-Month Warranty",
    "Supply & Fit Available",
    "Nationwide Delivery",
    "Trusted UK Suppliers",
  ]).map((label) => ({
    label: normalizeCopy(label),
    icon: trustIconForLabel(label),
  }));

  return (
    <Section
      id={sectionId}
      className={`relative overflow-hidden ${newDesignMode ? "bg-white" : "bg-[#f7f8fb]"} ${
        flush
          ? "!px-0 !py-[2px]"
          : compactSpacing
            ? "px-2 pb-5 pt-3 sm:pb-6 sm:pt-5 lg:pb-7 lg:pt-6"
            : newDesignMode ? "px-2 py-9 sm:py-10 lg:py-12" : "px-2 pb-7 pt-4 sm:py-8 lg:py-10"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute right-0 top-0 hidden h-[340px] w-[440px] opacity-[0.08] lg:block"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(248,249,250,0.5), rgba(248,249,250,0.92)), url(${bgImage})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top right",
          }}
        />
      </div>

      <Container
        className={
          flush
            ? "relative max-w-[1400px] !px-0 sm:!px-0 lg:!px-0"
            : `relative max-w-7xl ${newDesignMode ? "!px-4 sm:!px-6 lg:!px-8" : variantLayout ? "px-4 sm:px-5 lg:px-6" : ""}`
        }
      >
        <div className="mx-auto lg:mx-0">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#1289d5]/40 bg-[#06244d]/95 px-3.5 py-1.5 text-[14px] font-bold uppercase text-[white] shadow-[0_0_20px_rgba(26,145,232,0.25)] sm:mb-5 sm:text-[13px]">
            <span>{normalizeCopy(data.tag)}</span>
          </div>

          <h2 className={`max-w-[850px] font-['Manrope'] font-extrabold text-[#0d1b2e] ${newDesignMode ? "!text-[34px] leading-[1.04] tracking-[-0.04em] lg:!text-[40px] lg:leading-[1.04] lg:tracking-[-0.04em]" : "text-[27px] leading-[1.12] tracking-[-0.5px] lg:text-[44px] lg:leading-[1.03] lg:tracking-[-1px]"}`}>
            {headingLines.map((line, index) => {
              const isAccent = headingLines.length > 1 && index === headingLines.length - 1;
              return (
                <span
                  key={`${line}-${index}`}
                  className={`block ${isAccent ? "lg:text-[#15803d]" : ""} ${index > 0 ? newDesignMode ? "mt-1 text-[34px] leading-[1.04] lg:text-[40px]" : "mt-1 text-[21px] leading-[1.15] lg:text-[34px]" : ""}`}
                >
                  <span className="lg:hidden">{renderMobileHeadingLine(line, index, isAccent)}</span>
                  <span className="hidden lg:inline">{renderMobileHeadingLine(line, index, isAccent)}</span>
                </span>
              );
            })}
          </h2>
        </div>

        <div className={`${compactSpacing ? "mt-4" : "mt-5"} grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-4 ${variantLayout ? "xl:gap-5" : ""}`}>
          {cards.map((card) => {
            const flipped = activeStep === card.number;
            const isRegistrationCard = card.number === 1;
            const isComparisonCard = card.number === 2;
            const stepNumber = `0${card.number}`;

            return (
              <div
                key={card.number}
                className={`perspective-1000 ${
                  variantLayout
                    ? "min-h-[252px] sm:min-h-[256px] lg:min-h-[248px] xl:min-h-[272px]"
                    : "min-h-[244px] sm:min-h-[252px] lg:min-h-[244px] xl:min-h-[274px]"
                } ${card.number === 1 ? "md:col-span-2 md:mx-auto md:w-full md:max-w-[420px] lg:col-span-1 lg:max-w-none" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setActiveStep(flipped ? null : card.number)}
                  className="block h-full w-full text-left"
                  aria-pressed={flipped}
                  aria-label={`${flipped ? "Hide details for" : "Show details for"} step ${card.number}`}
                >
                  <div
                    className={`relative h-full ${
                      variantLayout
                        ? "min-h-[252px] sm:min-h-[256px] lg:min-h-[248px] xl:min-h-[272px]"
                        : "min-h-[244px] sm:min-h-[252px] lg:min-h-[244px] xl:min-h-[274px]"
                    } rounded-[18px] transition duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
                  >
                    <div className="absolute inset-0 flex h-full flex-col overflow-hidden rounded-[18px] border border-[#dbe4ef] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] px-3 pb-2.5 pt-3 text-center shadow-[0_18px_40px_rgba(13,27,46,0.08)] [backface-visibility:hidden] sm:px-4 sm:pb-3 sm:pt-4 lg:px-4 lg:pb-3 lg:pt-4">
                      <span className={`ml-auto font-['Manrope'] font-extrabold uppercase leading-none tracking-[0.14em] text-[#b3bcc9] ${variantLayout ? "text-[18px] sm:text-[22px] lg:text-[21px]" : "text-[20px] sm:text-[24px] lg:text-[22px]"}`}>
                        {stepNumber}
                      </span>

                      <div
                        className={`mx-auto flex items-center justify-center rounded-[14px] ${
                          isRegistrationCard
                            ? variantLayout
                              ? "h-[74px] w-[224px] sm:h-[86px] sm:w-[242px] lg:h-[76px] lg:w-[214px]"
                              : "h-[82px] w-[238px] sm:h-[94px] sm:w-[256px] lg:h-[82px] lg:w-[230px]"
                            : isComparisonCard
                              ? variantLayout
                                ? "h-[76px] w-[76px] sm:h-[88px] sm:w-[88px] lg:h-[82px] lg:w-[82px]"
                                : "h-[84px] w-[84px] sm:h-[94px] sm:w-[94px] lg:h-[86px] lg:w-[86px]"
                              : variantLayout
                                ? "h-[72px] w-[72px] sm:h-[84px] sm:w-[84px] lg:h-[78px] lg:w-[78px]"
                                : "h-[80px] w-[80px] sm:h-[90px] sm:w-[90px] lg:h-[82px] lg:w-[82px]"
                        }`}
                      >
                        <img
                          src={stepIconSrc(card)}
                          alt={`Step ${card.number} icon`}
                          className={
                            isRegistrationCard
                              ? variantLayout
                                ? "h-[58px] w-[198px] object-contain sm:h-[66px] sm:w-[220px] lg:h-[60px] lg:w-[194px]"
                                : "h-[64px] w-[210px] object-contain sm:h-[72px] sm:w-[232px] lg:h-[66px] lg:w-[206px]"
                              : isComparisonCard
                                ? variantLayout
                                  ? "h-[68px] w-[68px] object-contain sm:h-[80px] sm:w-[80px] lg:h-[74px] lg:w-[74px]"
                                  : "h-[76px] w-[76px] object-contain sm:h-[84px] sm:w-[84px] lg:h-[78px] lg:w-[78px]"
                                : variantLayout
                                  ? "h-[64px] w-[64px] object-contain sm:h-[76px] sm:w-[76px] lg:h-[70px] lg:w-[70px]"
                                  : "h-[72px] w-[72px] object-contain sm:h-[80px] sm:w-[80px] lg:h-[74px] lg:w-[74px]"
                          }
                        />
                      </div>

                      <div className="mt-2.5 flex items-start justify-center lg:mt-2.5">
                        <h3
                          className={`font-['Manrope'] font-bold leading-[1.14] text-[#0d1b2e] ${
                            variantLayout ? "text-[17px] lg:text-[16px] xl:text-[18px]" : "text-[18px] lg:text-[17px] xl:text-[20px]"
                          }`}
                        >
                          {card.front.h3}
                        </h3>
                      </div>

                      <div className="mt-1.5 flex items-start justify-center lg:mt-1.5">
                        <p
                          className={`mx-auto w-full max-w-[340px] text-[#5a6478] ${
                            variantLayout ? "text-[13px] leading-[1.45] lg:max-w-[300px] lg:text-[12px] lg:leading-[1.45]" : "text-[13px] leading-[1.5] lg:max-w-[300px] lg:text-[13px] lg:leading-[1.5]"
                          }`}
                        >
                          {card.front.text}
                        </p>
                      </div>

                      <div className="mt-auto flex items-center justify-end pt-2.5 lg:pt-2.5">
                        <span className="inline-flex min-h-[22px] shrink-0 items-center gap-2 px-1 pb-0 pt-0 text-[12px] font-bold leading-none text-[#15803d] sm:min-h-[22px] sm:text-[13px] lg:text-[12px]">
                          <span>See more</span>
                          <ArrowIcon />
                        </span>
                      </div>
                    </div>

                    <div className="absolute inset-0 flex h-full flex-col overflow-hidden rounded-[18px] border-[0.5px] border-[#2969af] bg-[#0d1b2e] p-3.5 text-white shadow-[0_0_0_1px_rgba(42,109,214,1),0_0_5px_rgba(42,109,214,0.4),0_0_12px_rgba(42,109,214,0.3),0_0_20px_rgba(42,109,214,0.2),0_3px_10px_rgba(42,109,214,0.25)] [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-4 lg:p-4">
                      <div className="flex items-center justify-start gap-3">
                        <span className="font-['Manrope'] text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#86efac]">
                          Step {card.number}
                        </span>
                      </div>

                      <h3 className="mt-3 text-center font-['Manrope'] text-[18px] font-bold leading-[1.15] text-white sm:text-[21px] lg:text-[18px]">
                        {card.back.heading}
                      </h3>

                      <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-2 [scrollbar-color:#86efac_transparent] [scrollbar-width:thin]">
                        <p className="text-[12.5px] leading-[1.6] text-[#c3d1e2] sm:text-[13px] lg:text-[12.5px] lg:leading-[1.6]">
                          {card.back.text}
                        </p>

                        <ul className="mt-4 space-y-2.5 lg:mt-4 lg:space-y-2.5">
                          {card.back.bullets.map((bullet) => (
                            <li key={bullet} className="flex items-start gap-3 text-[12.5px] leading-[1.5] text-[#e7eef8] sm:text-[13px] lg:gap-3 lg:text-[12.5px] lg:leading-[1.5]">
                              <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#15803d] text-white lg:h-5 lg:w-5">
                                <TickIcon />
                              </span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        <div
          className={`mx-auto mt-2 flex flex-nowrap items-stretch justify-center gap-2 rounded-[12px] px-4 sm:mx-0 sm:flex-wrap sm:items-center sm:gap-3 lg:gap-4 ${
            compactSpacing ? "py-2 sm:mt-4 sm:py-3" : "py-4 sm:mt-6"
          } ${
            variantLayout ? `border-t border-[#e3ebf5] ${compactSpacing ? "lg:mt-3" : "lg:mt-5"} lg:px-0` : compactSpacing ? "lg:mt-4" : "lg:mt-[24px]"
          }`}
        >
          {footerTrustItems.map((item, index) => (
            <div key={item.label} className="contents">
              <div
                className={`flex flex-1 flex-col items-center justify-center gap-1 p-1.5 sm:flex-none sm:flex-row sm:gap-2 ${
                  variantLayout ? "rounded-none bg-transparent sm:px-1 sm:py-0" : "rounded-lg bg-slate-50 sm:rounded-full sm:px-3 sm:py-1.5"
                }`}
              >
                <img
                  src={item.icon.src}
                  alt=""
                  aria-hidden="true"
                  className={`${item.icon.className} shrink-0`}
                  style={item.icon.style}
                />
                <span className="text-center text-[10px] font-medium leading-tight text-slate-700 sm:text-sm sm:leading-none">
                  {item.label}
                </span>
              </div>
              {index < footerTrustItems.length - 1 ? (
                <div className="h-5 w-px shrink-0 self-center bg-slate-300 sm:h-6" aria-hidden="true"></div>
              ) : null}
            </div>
          ))}
        </div>

        {ui.footerNote ? (
          <p className={`mt-3 text-center text-[12px] leading-[1.6] text-[#64748b] ${variantLayout ? "sm:text-left" : "sm:text-center"}`}>
            {normalizeCopy(ui.footerNote)}
          </p>
        ) : null}
      </Container>
    </Section>
  );
}
