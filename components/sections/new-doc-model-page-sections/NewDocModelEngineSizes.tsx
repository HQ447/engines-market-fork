"use client";

import Image from "next/image";
import { useState } from "react";
import type { ModelPageData } from "@/types/model";
import { BsFillFuelPumpDieselFill } from "react-icons/bs";
import { FaChevronRight } from "react-icons/fa6";
import { FaDroplet } from "react-icons/fa6";
import { CiCircleChevUp, CiCircleChevDown } from "react-icons/ci";
import { TbEngine } from "react-icons/tb";
import ModelMobileAccordion from "./ModelMobileAccordion";
type Props = { data: ModelPageData };
type SizeItem =
  ModelPageData["sections"]["engineSizes"]["groups"][number]["items"][number];

function normalize(value: string) {
  return value.replace(/[–—]/g, "-").trim();
}
function sizeLabel(title: string) {
  return title.match(/\d+(?:\.\d+)?L/i)?.[0] ?? "Size";
}
function groupLabel(title: string) {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes("diesel")) return "Diesel";
  if (normalizedTitle.includes("petrol")) return "Petrol";
  if (
    normalizedTitle.includes("hybrid") ||
    normalizedTitle.includes("mhev") ||
    normalizedTitle.includes("electrified")
  ) {
    return "Hybrid";
  }

  return normalize(title);
}
function groupDescriptor(title: string, index: number) {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes("diesel")) {
    return "Efficiency  |  Torque  |  Longer journeys";
  }
  if (normalizedTitle.includes("petrol")) {
    return "Performance  |  Responsive  |  Everyday usability";
  }
  if (
    normalizedTitle.includes("hybrid") ||
    normalizedTitle.includes("mhev") ||
    normalizedTitle.includes("electrified")
  ) {
    return "Efficiency  |  Electrified  |  Modern driving";
  }

  return index === 0
    ? "Efficiency  |  Torque  |  Longer journeys"
    : "Performance  |  Responsive  |  Everyday usability";
}
function EngineIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden="true">
      <path
        d="M8 19h8l4-5h10l4 5h6v16H8V19Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M14 19v-5M34 19v-5M18 35v5M31 35v5M40 24h5v7h-5M12 25h8v6h-8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SizeDetails({ item, data }: { item: SizeItem; data: ModelPageData }) {
  const ui = data.sections.engineSizes.ui;
  const detailCards = [
    [
      "⚙",
      ui?.engineCodesLabel || "Engine code(s)",
      item.engineCodes?.join(", ") || "Check by registration",
    ],
    [
      "▣",
      ui?.compatibleModelsLabel || "Compatible models (UK)",
      item.compatibleModels?.join(", ") || "UK market variants",
    ],
    ["ϟ", "Power output", "Verified by registration"],
    [
      "△",
      ui?.warningLabel || "Common failure points",
      item.commonFailurePoints?.join(", ") || "Confirm with a specialist",
    ],
  ];
  return (
    <div className="border-t border-[#d6e7f4] px-4 py-5 sm:px-7">
      <p className="max-w-[1230px] text-[14px] leading-[1.65] text-[#4f6887]">
        {normalize(item.description)}
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {detailCards.map(([icon, label, value]) => (
          <div
            key={label}
            className="flex items-center p-3 gap-3 rounded-xl bg-[#ebf1f5a9] "
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[22px] text-[#092b58] shadow-[0_3px_12px_rgba(28,87,133,0.1)]">
              {icon}
            </span>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.07em] text-black">
                {label}
              </p>
              <p className="mt-2 text-[13px] line-clamp-2 hover:line-clamp-none font-semibold leading-[1.45] text-[#18375e]">
                {normalize(value)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-3 border-t border-[#d6e7f4] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-[#4f6887]">
          {ui?.productionYearsLabel || "Production years"}:{" "}
          {normalize(item.productionYears || "Check by registration")}
        </p>
        <a
          href="#quote-form"
          data-quote-context={item.title}
          data-quote-source="engine-size"
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[#15803d] bg-[#15803d] px-5 py-3 text-[12px] font-extrabold text-white shadow-[0_6px_14px_rgba(2,129,92,0.2)]"
        >
          {normalize(item.cta)}{" "}
          <span className="ml-2 text-[17px]">
            <FaChevronRight />
          </span>
        </a>
      </div>
    </div>
  );
}

export default function NewDocModelEngineSizes({ data: modelData }: Props) {
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
  const section = data.sections.engineSizes;
  const groups = section.groups;
  const [activeGroup, setActiveGroup] = useState(0);
  const [activeItem, setActiveItem] = useState(0);
  const items = groups[activeGroup]?.items ?? [];
  const hasThreeGroups = groups.length > 2;

  return (
    <section
      id="model-engine-sizes"
      className="relative overflow-hidden bg-[#f7f8fb] px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
    >
      <ModelMobileAccordion
        title={normalize(
          (section.headingLines?.length
            ? section.headingLines
            : [section.h2])[0] ?? section.h2,
        )}
        icon={<TbEngine className="h-5 w-5" aria-hidden="true" />}
      >
        <div className="pointer-events-none absolute right-0 top-0 z-0 h-[215px] w-full opacity-24 sm:h-[240px] sm:opacity-30 md:right-[max(1rem,calc((100vw-80rem)/2+1rem))] md:top-[-2px] md:h-[220px] md:w-[430px] md:overflow-hidden md:opacity-80">
          {data.assets.mainImage ? (
            <Image
              src={data.assets.mainImage}
              alt=""
              fill
              className="translate-x-[8%] object-contain object-right-top md:object-right-center md:scale-100 sm:translate-x-0"
              sizes="390px"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(242,248,254,0.52)_0%,rgba(242,248,254,0.78)_58%,#f2f8fe_100%)] lg:bg-none" />
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
          <div
            className={`mt-6 grid overflow-hidden rounded-xl border border-[#b8d9f2] bg-white/75 shadow-[0_0_22px_rgba(30,145,229,0.18)] ${hasThreeGroups ? "grid-cols-3" : "grid-cols-2"}`}
          >
            {groups.map((group, index) => {
              const normalizedTitle = group.title.toLowerCase();
              const isDiesel = normalizedTitle.includes("diesel");
              const isPetrol = normalizedTitle.includes("petrol");
              const isHybrid =
                normalizedTitle.includes("hybrid") ||
                normalizedTitle.includes("mhev") ||
                normalizedTitle.includes("electrified");

              return (
                <button
                  key={group.title}
                  type="button"
                  onClick={() => {
                    setActiveGroup(index);
                    setActiveItem(0);
                  }}
                  className={`flex min-h-[43px] items-center justify-center px-1 py-1 text-left transition sm:justify-start sm:px-8 lg:min-h-[54px] ${hasThreeGroups ? "gap-2 sm:gap-3" : "gap-3"} ${activeGroup === index ? "bg-[#061a33] text-white " : "text-[#17375f] hover:bg-[#eff9ff]"}`}
                >
                  <span
                    className={
                      activeGroup === index
                        ? "text-[#18d29e]"
                        : "text-[#163f6c]"
                    }
                  >
                    {isDiesel ? (
                      <FaDroplet />
                    ) : isPetrol ? (
                      <BsFillFuelPumpDieselFill />
                    ) : isHybrid ? (
                      <EngineIcon />
                    ) : (
                      normalize(group.title)
                    )}
                  </span>
                  <span>
                    <span className="block text-[12px] font-extrabold uppercase lg:text-[15px]">
                      {groupLabel(group.title)}
                    </span>
                    <span
                      className={`hidden text-[10px] uppercase tracking-[0.12em] sm:block ${activeGroup === index ? "text-white/70" : "text-[#617b9c]"}`}
                    >
                      {groupDescriptor(group.title, index)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 space-y-2">
            {items.map((item, index) => {
              const expanded = activeItem === index;
              return (
                <article
                  key={item.title}
                  className={`overflow-hidden rounded-xl border bg-white/80 shadow-[0_3px_10px_rgba(22,94,145,0.04)] transition ${expanded ? "border-[#9bdcc4] shadow-[0_12px_34px_rgba(19,87,139,0.12)]" : "border-[#d4e6f3] hover:border-[#70c7f5]"}`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveItem(expanded ? -1 : index)}
                    className="flex w-full items-center gap-3 border-l-4 border-l-[#14b86d] sm:px-4 px-2 py-1 sm:py-3 text-left"
                  >
                    <span className="rounded-lg bg-[#061a33] sm:px-4 px-2 py-2 sm:py-2 text-[13px] sm:text-[18px] font-extrabold text-white">
                      {sizeLabel(item.title)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] sm:text-[16px] font-extrabold text-[#0b376b]">
                        {normalize(item.title)}
                      </span>
                      <span className="text-[13px] text-[#617b9c]">
                        {normalize(
                          item.compatibleModels?.join(", ") ||
                            item.engineCodes?.join(" / ") ||
                            "UK market variants",
                        )}
                      </span>
                    </span>
                    <span className="text-[20px] font-bold text-[#1461c9]">
                      {expanded ? <CiCircleChevUp /> : <CiCircleChevDown />}
                    </span>
                  </button>
                  {expanded ? <SizeDetails item={item} data={data} /> : null}
                </article>
              );
            })}
          </div>
        </div>
      </ModelMobileAccordion>
    </section>
  );
}
