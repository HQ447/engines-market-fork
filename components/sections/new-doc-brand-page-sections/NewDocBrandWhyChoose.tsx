"use client";

import Image from "next/image";
import {
  FiArrowRight,
  FiCheckCircle,
  FiHeadphones,
  FiShield,
  FiTruck,
  FiZap,
  FiDollarSign,
} from "react-icons/fi";
import type { BrandPageData } from "@/types/brand";
import ModelMobileAccordion from "../new-doc-model-page-sections/ModelMobileAccordion";

type Props = {
  data: BrandPageData;
  heroImage: string;
};

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M12 3 20 7v5c0 5-3 8-8 10-5-2-8-5-8-10V7l8-4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="m8.5 12 2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CompareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M4 7h8M4 17h8M12 7l3-3m-3 3 3 3M12 17l3-3m-3 3 3 3M20 7h-2M20 17h-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function getPointIcon(title: string) {
  const normalized = title.toLowerCase();

  if (normalized.includes("compare")) {
    return CompareIcon;
  }

  if (
    normalized.includes("service") ||
    normalized.includes("supply") ||
    normalized.includes("replacement") ||
    normalized.includes("fitting")
  ) {
    return WrenchIcon;
  }

  return ShieldIcon;
}

function getBadgeIcon(label: string) {
  const normalized = label.toLowerCase();

  if (
    normalized.includes("price") ||
    normalized.includes("competit") ||
    normalized.includes("£")
  ) {
    return FiDollarSign;
  }

  if (
    normalized.includes("fast") ||
    normalized.includes("secure") ||
    normalized.includes("thousand")
  ) {
    return FiZap;
  }

  if (
    normalized.includes("uk") ||
    normalized.includes("support") ||
    normalized.includes("network") ||
    normalized.includes("trust")
  ) {
    return FiHeadphones;
  }

  if (normalized.includes("delivery") || normalized.includes("nationwide")) {
    return FiTruck;
  }

  if (normalized.includes("free") || normalized.includes("obligation")) {
    return FiCheckCircle;
  }

  return FiShield;
}

function splitHeading(value: string) {
  const match = value.match(/^(.*?)(Engines?Market)$/i);

  if (!match) return [{ text: value, accent: false }];

  return [
    { text: match[1].trim(), accent: false },
    { text: match[2], accent: true },
  ];
}

// Parses "Trusted Network|UK BMW engine specialists" → { title, sub }
function parseBulletItem(item: string): { title: string; sub: string } {
  const pipeIdx = item.indexOf("|");
  if (pipeIdx !== -1) {
    return {
      title: item.slice(0, pipeIdx).trim(),
      sub: item.slice(pipeIdx + 1).trim(),
    };
  }
  // Try to split on first newline
  const nlIdx = item.indexOf("\n");
  if (nlIdx !== -1) {
    return {
      title: item.slice(0, nlIdx).trim(),
      sub: item.slice(nlIdx + 1).trim(),
    };
  }
  return { title: item, sub: "" };
}

export default function NewDocBrandWhyChoose({ data, heroImage }: Props) {
  const section = data.sections.trustCta;
  const headingLines = splitHeading(section.h2);
  const pointLabel = section.ui?.pointLabel?.trim();
  const trustBullets = section.ui?.trustBullets ?? [
    "Trusted Network|UK BMW engine specialists",
    "Thousands of Drivers|Real customer reviews",
    "Nationwide Delivery|Across the UK",
    "Competitive Prices|Compare and save",
  ];

  const stripLabel =
    section.ui?.stripLabel?.trim() || "FIND THE RIGHT ENGINE TODAY";
  const stripTitle =
    section.ui?.stripTitle?.trim() ||
    `Compare ${data.brand.name} engine prices with vetted UK specialists`;
  const stripDescription =
    section.ui?.stripDescription?.trim() || section.finalText;

  // Image badge
  const imageBadgeLabel = section.ui?.imageBadgeLabel?.trim() || "12-Month";
  const imageBadgeText =
    section.ui?.imageBadgeText?.trim() || "Unlimited Mileage Warranty";

  return (
    <section className="relative overflow-hidden bg-[#f7f8fb] px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-7">
      <ModelMobileAccordion
        title={section.h2}
        icon={<FiShield className="h-5 w-5" aria-hidden="true" />}
          buttonClassName="!-my-[14px]"
      >
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[18px] bg-[#061a33] shadow-[0_14px_32px_rgba(7,25,54,0.14)]">
          {/* ── Mobile background image ── */}
          <div
            className="pointer-events-none absolute inset-0 z-0 md:hidden"
            aria-hidden="true"
          >
            <Image
              src={heroImage}
              alt=""
              fill
              sizes="100vw"
              className="object-contain object-right-center opacity-[0.22]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#061a33_0%,rgba(6,26,51,0.94)_44%,rgba(6,26,51,0.58)_100%)]" />
          </div>

          {/* ── Main content area ── */}
          <div className="relative z-10 px-4 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
            {/* top row: text left | car image right */}
            <div className="flex items-center gap-6 lg:gap-8">
              {/* Left: tag + heading + description */}
              <div className="min-w-0 flex-1">
                {/* Tag pill — matches other sections */}
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1289d5]/40 bg-[linear-gradient(135deg,#042f5a,#075b94)] px-3.5 py-1.5 text-[13px] font-bold uppercase text-white shadow-[0_0_20px_rgba(26,145,232,0.25)]">
                  {section.tag}
                </span>

                {/* Heading */}
                <h2
                  style={{
                    fontFamily:
                      '"Bebas Neue", "Urbanist", ui-sans-serif, system-ui, sans-serif',
                    letterSpacing: "0.01em",
                  }}
                  className="mt-5 !text-[40px] font-extrabold leading-[1.02] tracking-normal !tracking-[-0.02em] text-white sm:!tracking-[0.01em] sm:!text-[41px] lg:!text-[46px]"
                >
                  {headingLines.map((line, index) => (
                    <span
                      key={`${line.text}-${index}`}
                      className={`block ${line.accent ? "text-[#15803d]" : ""}`}
                    >
                      {line.text}
                    </span>
                  ))}
                </h2>

                <p className="mt-3 max-w-[480px] text-[14px] leading-[1.6] text-[#c6d7e9] lg:text-[15px]">
                  {section.intro}
                </p>
              </div>

              {/* Right: car image (inline, not absolute) */}
              <div
                className="relative hidden shrink-0 md:block"
                style={{ width: "38%", aspectRatio: "16/9" }}
              >
                {/* diagonal left-edge fade */}
                <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_right,#061a33_0%,rgba(6,26,51,0.3)_30%,transparent_60%)]" />
                <Image
                  src={heroImage}
                  alt={section.imageAlt ?? `${data.brand.name} engine`}
                  fill
                  sizes="(max-width: 1023px) 38vw, 500px"
                  className="rounded-xl object-contain object-center drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)]"
                />
                {/* 12-Month badge — overlaid on image */}
                <div className="absolute right-2 top-2 z-20 flex items-center gap-2 rounded-xl border border-[#38c9a0]/30 bg-[#0a243d]/90 px-3 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.28)] backdrop-blur-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#38c9a0]/40 bg-[linear-gradient(145deg,rgba(30,192,157,0.85),rgba(8,102,118,0.8))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]">
                    <FiShield className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[12px] font-extrabold leading-tight text-white">
                      {imageBadgeLabel}
                    </p>
                    <p className="text-[10px] leading-tight text-[#a8c7e0]">
                      {imageBadgeText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Feature cards ── */}
            <div className="mt-5 grid max-w-[830px] gap-3 md:grid-cols-3">
              {section.points.map((point) => (
                <article
                  key={point.title}
                  className="rounded-xl border border-white/25 bg-[linear-gradient(135deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.08)_34%,rgba(5,18,38,0.28)_100%)] p-3 shadow-[inset_1px_1px_0_rgba(255,255,255,0.45),inset_-1px_-1px_0_rgba(255,255,255,0.12),0_8px_20px_rgba(0,0,0,0.18)] backdrop-blur-xl"
                >
                  <div className="flex items-start gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[#38c9a0]/35 bg-[linear-gradient(145deg,rgba(30,192,157,0.85),rgba(8,102,118,0.75))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.26),0_4px_10px_rgba(0,0,0,0.16)]">
                      {(() => {
                        const Icon = getPointIcon(point.title);
                        return <Icon />;
                      })()}
                    </span>
                    <div className="min-w-0">
                      {pointLabel ? (
                        <p className="pt-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#75f0bd]">
                          {pointLabel}
                        </p>
                      ) : null}
                      <h6
                        className={`${pointLabel ? "mt-0.5" : "pt-0.5"} text-[13px] font-semibold leading-[1.3] text-white`}
                      >
                        {point.title}
                      </h6>
                    </div>
                  </div>
                  <p className="mt-2 text-[10px] leading-[1.55] text-[#d3e1ef] sm:text-[11px]">
                    {point.description}
                  </p>
                </article>
              ))}
            </div>

            {/* ── Trust badge strip ── */}
            {trustBullets.length ? (
              <div className="mt-4 grid w-full max-w-none grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-4">
                {trustBullets.map((item) => {
                  const { title, sub } = parseBulletItem(item);
                  const Icon = getBadgeIcon(title);
                  return (
                    <span
                      key={item}
                      className="flex items-center gap-2.5 bg-[#0d2c4a]/70 px-3 py-3 sm:px-3.5"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#082744]/80 text-[#d4e9ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] font-bold leading-tight text-white sm:text-[12px]">
                          {title}
                        </span>
                        {sub ? (
                          <span className="block text-[10px] leading-tight text-[#8ab0cc] sm:text-[11px]">
                            {sub}
                          </span>
                        ) : null}
                      </span>
                    </span>
                  );
                })}
              </div>
            ) : null}

            {/* ── Bottom CTA strip ── */}
            <div className="mt-4 flex w-full max-w-none flex-col gap-4 rounded-xl border border-white/15 bg-[#0a243d]/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md lg:flex-row lg:items-center lg:justify-between lg:gap-6">
              {/* Left: label + title + description */}
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#75f0bd]">
                  {stripLabel}
                </p>
                <h5 className="mt-1 text-[14px] font-bold leading-[1.25] text-white sm:text-[15px]">
                  {stripTitle}
                </h5>
                <p className="mt-1 text-[12px] leading-[1.55] text-[#c6d7e9] sm:text-[13px]">
                  {stripDescription}
                </p>
              </div>

              {/* Right: quote button */}
              <div className="flex shrink-0 flex-col gap-2 lg:items-end">
                <a
                  href="#quote-form"
                  data-quote-context={`Final ${data.brand.name} engine comparison`}
                  data-quote-source="trust-cta"
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg bg-[#16a34a] px-4 text-[12px] font-bold text-white transition hover:bg-[#15803d] active:scale-[0.98] sm:text-[13px]"
                >
                  {section.buttonText}
                  <FiArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                {/* Trust micro-pills */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {[
                    "No obligation",
                    "Fast results",
                    "Trusted UK suppliers",
                  ].map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1 text-[11px] text-[#8ab0cc]"
                    >
                      <FiCheckCircle
                        className="h-3 w-3 text-[#4ade80]"
                        aria-hidden="true"
                      />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModelMobileAccordion>
    </section>
  );
}
