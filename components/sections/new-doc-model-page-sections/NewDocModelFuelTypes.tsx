"use client";

import Image from "next/image";
import { useState } from "react";
import type { ModelPageData } from "@/types/model";
import { FaSearch } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { PiEngineBold } from "react-icons/pi";
import { RiCarLine } from "react-icons/ri";
import { FaTools } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { BsFuelPumpDiesel } from "react-icons/bs";
import { SiFueler } from "react-icons/si";
import ModelMobileAccordion from "./ModelMobileAccordion";

type Props = { data: ModelPageData };

function normalize(value: string) {
  return value.replace(/[–—]/g, "-").trim();
}

function splitFuelHeading(value: string) {
  const heading = normalize(value);
  const match = heading.match(/^(.*?)(\s+by\s+Fuel\s+Type)$/i);
  return match
    ? { primary: match[1].trim(), accent: match[2].trim() }
    : { primary: heading, accent: "" };
}

function fuelTone(title: string) {
  const value = title.toLowerCase();
  if (
    value.includes("phev") ||
    value.includes("plug-in hybrid") ||
    value.includes("plug in hybrid")
  )
    return {
      border: "border-[#b7a4ed]",
      card: "bg-[##f6f3ff73]",
      badge: "border-[#a58be4] bg-[#eee8ff] text-[#6845ad]",
      icon: "text-[#6845ad]",
      iconBg: "bg-[#e8defd]",
      button: "border-[#6845ad] bg-[#6845ad]",
    };
  if (value.includes("hybrid") || value.includes("mhev"))
    return {
      border: "border-[#f1c46c]",
      card: "bg-[#fffbf4]",
      badge: "border-[#efb458] bg-[#fff2d7] text-[#a76200]",
      icon: "text-[#a76200]",
      iconBg: "bg-[#fff0d5]",
      button: "border-[#d98300] bg-[#d98300]",
    };
  if (value.includes("petrol"))
    return {
      border: "border-[#8bdcb8]",
      card: "bg-[#f1fff863]",
      badge: "border-[#8bdcb8] bg-[#dff8eb] text-[#087951]",
      icon: "text-[#087951]",
      iconBg: "bg-[#dff8eb]",
      button: "border-[#15803d] bg-[#15803d]",
    };
  return {
    border: "border-[#91c9f5]",
    card: "bg-[#f0f8ff87]",
    badge: "border-[#91c9f5] bg-[#dceeff] text-[#0b5aa1]",
    icon: "text-[#0b5aa1]",
    iconBg: "bg-[#dceeff]",
    button: "border-[#061a33] bg-[#061a33]",
  };
}

function fuelBadgeLabel(title: string) {
  const value = title.toLowerCase();

  if (
    value.includes("phev") ||
    value.includes("plug-in hybrid") ||
    value.includes("plug in hybrid")
  ) {
    return "PHEV";
  }
  if (value.includes("hybrid") || value.includes("mhev")) return "MHEV";
  return /petrol/i.test(title) ? "Petrol" : "Diesel";
}

function FuelIcon({ hybrid = false }: { hybrid?: boolean }) {
  return hybrid ? (
    <span className="">
      <SiFueler />
    </span>
  ) : (
    <BsFuelPumpDiesel />
  );
}

function DetailIcon({ kind }: { kind: number }) {
  const icons = [PiEngineBold, RiCarLine, FaTools, IoStatsChart] as const;
  const Icon = icons[kind];

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center text-[22px]">
      {Icon ? <Icon /> : "●"}
    </span>
  );
}

function ExpandableBulletGroup({
  label,
  values,
  tone,
  kind,
}: {
  label: string;
  values: string[];
  tone: ReturnType<typeof fuelTone>;
  kind: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = values.length > 3;
  const visibleValues = expanded ? values : values.slice(0, 3);

  return (
    <div className="mt-4 border-t border-[#d6e6f2] pt-3">
      <div className="flex items-center gap-2 text-[#12345f]">
        <DetailIcon kind={kind} />
        <p className="text-[14px] font-extrabold">{label}</p>
      </div>
      <ul className="mt-1.5 space-y-1 text-[14px] leading-[1.4] text-[#526a87]">
        {visibleValues.map((value) => (
          <li key={value} className="flex gap-2">
            <span className={`font-bold ${tone.icon}`}>•</span>
            <span>{normalize(value)}</span>
          </li>
        ))}
      </ul>
      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className={`mt-2 text-[12px] font-extrabold underline underline-offset-2 ${tone.icon}`}
        >
          {expanded ? "See less" : "See more"}
        </button>
      ) : null}
    </div>
  );
}

type FuelSection = ModelPageData["sections"]["fuelTypes"];
type FuelItem = FuelSection["items"][number];

function FuelTypeCard({
  item,
  section,
}: {
  item: FuelItem;
  section: FuelSection;
}) {
  const tone = fuelTone(item.title);
  const hybrid = /hybrid|mhev/i.test(item.title);
  const groups = [
    {
      label:
        item.familiesLabel ||
        section.ui?.familiesLabel ||
        "Common engine families",
      values: item.families,
    },
    {
      label: item.foundInLabel || section.ui?.foundInLabel || "Found in",
      values: item.foundIn,
    },
    {
      label: item.knownForLabel || section.ui?.knownForLabel || "Known for",
      values: item.knownFor,
    },
    {
      label: item.modelsLabel || section.ui?.modelsLabel || "Typical models",
      values: item.typicalModels,
    },
    {
      label: item.notesLabel || section.ui?.notesLabel || "Important notes",
      values: item.importantNotes,
    },
  ].filter((group) => group.values?.length);

  return (
    <article
      className={`flex h-full min-w-0 flex-col rounded-xl border p-4 shadow-[0_10px_28px_rgba(19,92,145,0.08)] sm:p-5 ${tone.border} ${tone.card}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${tone.iconBg} ${tone.icon}`}
        >
          <FuelIcon hybrid={hybrid} />
        </div>
        <h4 className="min-w-0 flex-1 font-[var(--font-urbanist)] text-[16px] font-extrabold leading-[1.12] text-[#09264e] lg:text-[15px]">
          {normalize(item.title)}
        </h4>
        <span
          className={`shrink-0 rounded-md border px-2.5 py-1 text-[10px] font-extrabold uppercase sm:px-3 sm:text-[11px] ${tone.badge}`}
        >
          {fuelBadgeLabel(item.title)}
        </span>
      </div>
      <p className="mt-3 min-h-[63px] line-clamp-3 text-[14px] leading-[1.55] text-[#526a87]">
        {normalize(item.description)}
      </p>
      {groups.map((group, index) => (
        <ExpandableBulletGroup
          key={group.label}
          label={group.label}
          values={group.values ?? []}
          tone={tone}
          kind={index}
        />
      ))}
      <div className="mt-auto pt-5">
        <a
          href="#quote-form"
          data-quote-context={item.title}
          data-quote-source="fuel-types"
          className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border px-4 text-center text-[12px] font-extrabold leading-[1.2] text-white shadow-[0_7px_16px_rgba(4,53,101,0.2)] ${tone.button}`}
        >
          <span className="min-w-0">{normalize(item.cta)}</span>
          <span className="shrink-0 text-[17px] leading-none">→</span>
        </a>
      </div>
    </article>
  );
}

export default function NewDocModelFuelTypes({ data: modelData }: Props) {
  const data = {
    ...modelData,
    assets: {
      ...modelData.assets,
      mainImage:
        modelData.assets.mainImage ||
        modelData.assets.smallImage ||
        modelData.assets.heroBg,
    },
  };
  const section = data.sections.fuelTypes;
  const fuelHeading = splitFuelHeading(section.h2);
  const fuelHeadingLines = section.headingLines?.length
    ? section.headingLines
    : [];
  const fuelItems = section.items;
  const [activeFuelIndex, setActiveFuelIndex] = useState(0);
  const [desktopFuelStart, setDesktopFuelStart] = useState(0);
  const activeItem = fuelItems[Math.min(activeFuelIndex, fuelItems.length - 1)];
  const maxDesktopFuelStart = Math.max(fuelItems.length - 3, 0);
  const visibleDesktopFuelItems = fuelItems.slice(
    Math.min(desktopFuelStart, maxDesktopFuelStart),
    Math.min(desktopFuelStart, maxDesktopFuelStart) + 3,
  );
  return (
    <section
      id="model-fuel-types"
      className="relative overflow-hidden bg-white px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-7"
    >
      <ModelMobileAccordion
        title={normalize(fuelHeadingLines[0] ?? fuelHeading.primary)}
        icon={<BsFuelPumpDiesel className="h-5 w-5" aria-hidden="true" />}
      >
        <div className="pointer-events-none absolute right-0 top-0 z-0 h-[210px] w-full opacity-25 sm:h-[250px] sm:opacity-30 md:right-[max(1rem,calc((100vw-80rem)/2+1rem))] md:top-[12px] md:h-[220px] md:w-[430px] md:overflow-hidden md:opacity-70">
          {data.assets.mainImage ? (
            <>
              <Image
                src={data.assets.mainImage}
                alt=""
                fill
                className="translate-x-[8%] object-contain object-right-top md:object-right-center md:scale-100 mix-blend-multiply [mask-image:linear-gradient(to_bottom,black_50%,transparent)] sm:translate-x-0"
                sizes="430px"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/15 to-white lg:hidden" />
            </>
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0.75)_58%,#fff_100%)] lg:bg-none" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="relative">
            <div className="max-w-[760px]">
              <span className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#042f5a,#075b94)] px-3.5 py-1.5 text-[13px] font-bold uppercase tracking-[0.08em] text-white">
                {section.tag}
              </span>
              <h2
                style={{
                  fontFamily:
                    '"Bebas Neue", "Urbanist", ui-sans-serif, system-ui, sans-serif',
                  letterSpacing: "0.01em",
                }}
                className="mt-5 font-[var(--font-urbanist)] !text-[40px] font-extrabold leading-[1.03] tracking-normal !tracking-[-0.02em] text-[#09264e] sm:!tracking-[0.01em] sm:!text-[41px] lg:!text-[46px]"
              >
                {fuelHeadingLines.length > 1 ? (
                  fuelHeadingLines.map((line, index) => (
                    <span
                      key={`${line}-${index}`}
                      className={`block ${index === fuelHeadingLines.length - 1 ? "text-[#15803d]" : ""}`}
                    >
                      {normalize(line)}
                    </span>
                  ))
                ) : (
                  <>
                    <span>{fuelHeading.primary}</span>{" "}
                    {fuelHeading.accent ? (
                      <span className="text-[#15803d]">
                        {fuelHeading.accent}
                      </span>
                    ) : null}
                  </>
                )}
              </h2>
              <p className="mt-4 max-w-[760px] text-[14px] leading-[1.6] text-[#526a87] lg:text-[15px]">
                {normalize(section.intro)}
              </p>
            </div>
          </div>
          {activeItem ? (
            <div className="mt-12 lg:mt-8">
              <div className="lg:hidden">
                <div className="relative">
                  <FuelTypeCard item={activeItem} section={section} />
                  {fuelItems.length > 1 ? (
                    <div className="pointer-events-none absolute inset-x-3 -top-10 z-10 flex items-center justify-between">
                      <button
                        type="button"
                        aria-label="Previous fuel type"
                        onClick={() =>
                          setActiveFuelIndex((current) =>
                            current === 0 ? fuelItems.length - 1 : current - 1,
                          )
                        }
                        className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full border border-[#0b5aa1] bg-white text-[#0b5aa1] shadow-sm"
                      >
                        <FiChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next fuel type"
                        onClick={() =>
                          setActiveFuelIndex((current) =>
                            current === fuelItems.length - 1 ? 0 : current + 1,
                          )
                        }
                        className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full border border-[#0b5aa1] bg-white text-[#0b5aa1] shadow-sm"
                      >
                        <FiChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  ) : null}
                </div>
                {fuelItems.length > 1 ? (
                  <div className="mt-2 flex justify-center">
                    <span className="text-[12px] font-bold text-[#526a87]">
                      {activeFuelIndex + 1} of {fuelItems.length}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="hidden lg:block">
                <div
                  className={`flex items-stretch gap-3 ${fuelItems.length <= 2 ? "justify-center" : ""}`}
                >
                  {visibleDesktopFuelItems.map((item) => (
                    <div
                      key={item.title}
                      className={
                        fuelItems.length <= 2
                          ? "w-full max-w-[420px]"
                          : "min-w-0 flex-1"
                      }
                    >
                      <FuelTypeCard item={item} section={section} />
                    </div>
                  ))}
                </div>
                {fuelItems.length > 3 ? (
                  <div className="mt-3 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      aria-label="Previous fuel types"
                      disabled={desktopFuelStart === 0}
                      onClick={() =>
                        setDesktopFuelStart((current) =>
                          Math.max(current - 1, 0),
                        )
                      }
                      className="grid h-9 w-9 place-items-center rounded-full border border-[#0b5aa1] bg-white text-[#0b5aa1] shadow-sm transition hover:bg-[#edf8ff] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FiChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="text-[12px] font-bold text-[#526a87]">
                      {Math.min(desktopFuelStart, maxDesktopFuelStart) + 1}-
                      {Math.min(
                        Math.min(desktopFuelStart, maxDesktopFuelStart) + 3,
                        fuelItems.length,
                      )}{" "}
                      of {fuelItems.length}
                    </span>
                    <button
                      type="button"
                      aria-label="Next fuel types"
                      disabled={desktopFuelStart >= maxDesktopFuelStart}
                      onClick={() =>
                        setDesktopFuelStart((current) =>
                          Math.min(current + 1, maxDesktopFuelStart),
                        )
                      }
                      className="grid h-9 w-9 place-items-center rounded-full border border-[#0b5aa1] bg-white text-[#0b5aa1] shadow-sm transition hover:bg-[#edf8ff] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FiChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
          <div className="mt-5 flex flex-col gap-5 rounded-2xl border border-[#1b8ed9]/60 bg-[#061a33] p-5 text-white  lg:flex-row lg:items-center lg:justify-between lg:px-7">
            <div className="flex items-start gap-4">
              <span className="flex lg:h-12 h-8 w-8 text-[17px] lg:w-12 shrink-0 items-center justify-center rounded-full border border-[#149ee8] lg:text-[20px]">
                <FaSearch />
              </span>
              <p className="max-w-[620px] line-clamp-5 lg:line-clamp-none hover:line-clamp-none text-[13px] leading-[1.55] text-white/85">
                {normalize(section.closing)}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <a
                href="#quote-form"
                data-quote-source="fuel-types-helper"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[#15803d] bg-[#15803d] px-5 text-[12px] font-extrabold text-white"
              >
                {section.ui?.closingButtonText || "Find My Engine"}{" "}
                <span className="ml-2 text-[17px]">→</span>
              </a>
            </div>
          </div>
        </div>
      </ModelMobileAccordion>
    </section>
  );
}
