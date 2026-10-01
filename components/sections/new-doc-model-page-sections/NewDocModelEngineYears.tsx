"use client";

import Image from "next/image";
import { useState } from "react";
import type { ModelPageData } from "@/types/model";
import { FiCalendar } from "react-icons/fi";
import ModelMobileAccordion from "./ModelMobileAccordion";

type Props = { data: ModelPageData };

function normalize(value: string) {
  return value.replace(/[–—]/g, "-").trim();
}
function Check() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7c90a5] text-[12px] font-black text-white">
      ✓
    </span>
  );
}
function ColumnTitle({
  icon,
  children,
}: {
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-center gap-3 text-[14px] font-extrabold text-[#09264e]">
      <span className="text-[25px]">{icon}</span>
      {children}
    </p>
  );
}

export default function NewDocModelEngineYears({ data }: Props) {
  const section = data.sections.engineYears;
  const headingLines = section.headingLines?.length
    ? section.headingLines
    : [section.h2];
  const [activeIndex, setActiveIndex] = useState(0);
  const active = section.years[activeIndex] ?? section.years[0];
  const sectionImage =
    data.assets.mainImage || data.assets.smallImage || data.assets.heroBg;
  const yearImage = sectionImage;
  if (!active) return null;

  return (
    <section className="relative overflow-hidden bg-[#f7f8fb] px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <ModelMobileAccordion
        title={normalize(headingLines[0] ?? section.h2)}
        icon={<FiCalendar className="h-5 w-5" aria-hidden="true" />}
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(242,248,254,0.5)_0%,rgba(242,248,254,0.75)_58%,#f2f8fe_100%)] lg:bg-none" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1289d5]/40 bg-[linear-gradient(135deg,#042f5a,#075b94)] px-3.5 py-1.5 text-[14px] font-bold uppercase text-white shadow-[0_0_20px_rgba(26,145,232,0.25)] sm:text-[13px]">
            {section.tag}
          </span>
          <h2
            style={{
              fontFamily:
                '"Bebas Neue", "Urbanist", ui-sans-serif, system-ui, sans-serif',
              letterSpacing: "0.01em",
            }}
            className="mt-5 max-w-[760px] !text-[40px] font-extrabold leading-[1.03] tracking-normal !tracking-[-0.02em] text-[#09264e] sm:!tracking-[0.01em] sm:!text-[41px] lg:max-w-[760px] lg:whitespace-normal lg:!text-[46px]"
          >
            <span className="lg:hidden">
              {headingLines.map((line, index) => (
                <span
                  key={`${line}-${index}`}
                  className={`block ${index > 0 ? "text-[#15803d]" : ""}`}
                >
                  {normalize(line)}
                </span>
              ))}
            </span>
            <span className="hidden lg:inline">
              {headingLines.length > 1 ? (
                <>
                  {normalize(headingLines[0])}{" "}
                  <span className="text-[#15803d]">
                    - {headingLines.slice(1).map(normalize).join(" ")}
                  </span>
                </>
              ) : (
                normalize(section.h2)
              )}
            </span>
          </h2>
          <p className="mt-4 max-w-[760px] text-[14px] leading-[1.6] text-[#526a87] lg:text-[15px]">
            {normalize(section.intro)}
          </p>
          <div
            className={`mt-8 flex gap-1 overflow-x-auto rounded-xl border border-[#b8d9f2] bg-white/75 p-1  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${section.years.length <= 5 ? "lg:overflow-x-visible" : ""}`}
          >
            {section.years.map((year, index) => {
              const selected = activeIndex === index;
              return (
                <button
                  key={year.year}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`relative flex min-h-[54px] min-w-[31%] flex-1 flex-col justify-center rounded-lg px-2 py-1.5 text-left transition sm:min-w-[154px] sm:px-4 sm:py-2 lg:min-w-[154px] ${section.years.length <= 5 ? "lg:min-w-0" : "lg:flex-none"} ${selected ? "border border-[#15803d] bg-[#061a33] text-white shadow-[0_0_16px_rgba(7,132,95,0.35)] after:absolute after:-bottom-[8px] after:left-1/2 after:h-0 after:w-0 after:-translate-x-1/2 after:border-x-[8px] after:border-t-[8px] after:border-x-transparent after:border-t-[#061a33] after:content-['']" : "border border-transparent text-[#17375f] hover:border-[#b9d8eb] hover:bg-[#eff9ff]"}`}
                >
                  <span className="text-[12px] font-extrabold sm:text-[15px]">
                    {normalize(year.year)}
                  </span>
                  <span
                    className={`truncate text-[10px] sm:text-[12px] ${selected ? "text-white/75" : "text-[#617b9c]"}`}
                  >
                    {normalize(year.preview)}
                  </span>
                </button>
              );
            })}
          </div>
          <article className="mt-5 overflow-hidden rounded-xl border border-[#8cc5ef] bg-white ">
            <div className="grid lg:grid-cols-[275px_minmax(0,1fr)]">
              <aside
                className="relative  min-h-[280px] overflow-hidden bg-[#061a33] p-6 text-white"
                style={{
                  background:
                    "linear-gradient(181deg, rgba(255, 255, 255, 0.32) 0%, rgb(248 248 248 / 5%) 42%, rgb(255 255 255 / 0%) 55%), linear-gradient(180deg, #244875 0%, #030e1c 50%, #051428 100%)",
                }}
              >
                <div className="relative flex h-full flex-col justify-center ">
                  <p className="text-[30px] font-black leading-none tracking-[-0.04em]">
                    {normalize(active.year)}
                  </p>
                  <h4 className="mt-2 text-[16px] text-white font-extrabold leading-tight">
                    {normalize(active.preview)}
                  </h4>
                  <p className="mt-4 text-[13px] leading-[1.5] text-white/85">
                    {normalize(active.description)}
                  </p>
                  <div className="mt-6 flex lg:flex-col lg:absolute lg:bottom-0  justify-between gap-2">
                    <span className="shrink-0 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[12px] font-bold lg:whitespace-nowrap">
                      {active.badges?.[0]
                        ? normalize(active.badges[0].label)
                        : "Generation"}
                    </span>
                    <span className="text-[12px] lg:ml-2 font-bold text-[#7bdfad]">
                      The original series
                    </span>
                  </div>
                </div>
              </aside>
              <div className="min-w-0 p-5 sm:p-6">
                <div className="grid divide-y divide-[#d9e6f0] lg:grid-cols-4 lg:divide-x lg:divide-y-0">
                  <div className="py-4 lg:px-4 lg:py-0 lg:first:pl-0">
                    <ColumnTitle icon="⚙">
                      {section.ui?.keyChangesLabel || "Key changes"}
                    </ColumnTitle>
                    <ul className="mt-4 space-y-3">
                      {(active.keyChanges ?? []).slice(0, 4).map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-[12px] leading-[1.4] text-[#526a87]"
                        >
                          <Check />
                          {normalize(item)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="py-4 lg:px-4 lg:py-0">
                    <ColumnTitle icon="▣">
                      {section.ui?.mainEnginesLabel || "Main engines"}
                    </ColumnTitle>
                    <div className="mt-4 space-y-2 lg:space-y-5">
                      {(active.mainEngines ?? []).slice(0, 5).map((item) => (
                        <p
                          key={item}
                          className="grid grid-cols-[78px_1fr] gap-2 text-[12px] leading-[1.35] text-[#526a87]"
                        >
                          <span className="rounded-md border border-[#d6e7f4] bg-[#f7fbff] px-2 py-1 flex justify-center items-center text-center font-bold text-[#17375f]">
                            {normalize(item.split(/\s+/)[0])}
                          </span>
                          <span>{normalize(item.replace(/^\S+\s*/, ""))}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="py-4 lg:px-4 lg:py-0">
                    <ColumnTitle icon="▰">
                      {section.ui?.popularModelsLabel || "Popular variants"}
                    </ColumnTitle>
                    <ul className="mt-4 space-y-3">
                      {(active.popularModels ?? []).slice(0, 5).map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-[13px] text-[#17375f]"
                        >
                          <span className="text-[#07845f]">•</span>
                          {normalize(item)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="py-4 lg:py-0 lg:px-4">
                    <ColumnTitle icon="🔧">
                      {section.ui?.knownForLabel || "Known for"}
                    </ColumnTitle>
                    <ul className="mt-4 space-y-3">
                      {(active.knownFor ?? []).slice(0, 5).map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-[12px] leading-[1.4] text-[#526a87]"
                        >
                          <Check />
                          {normalize(item)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-4 rounded-lg bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="mr-2 text-[11px] font-extrabold text-[#12345f]">
                      {section.ui?.engineCodesLabel || "Engine codes covered"}:
                    </p>
                    {(active.engineCodesCovered ?? []).map((code) => (
                      <span
                        key={code}
                        className="rounded-full border border-[#a9cceb] bg-white px-3 py-1 text-[11px] font-semibold text-[#294e76]"
                      >
                        {normalize(code)}
                      </span>
                    ))}
                  </div>
                  <a
                    href="#quote-form"
                    data-quote-context={active.year}
                    data-quote-source="engine-years"
                    className="inline-flex min-h-[43px] shrink-0 items-center justify-center rounded-lg bg-[#061a33] px-5 text-[12px] font-extrabold text-white shadow-[0_6px_14px_rgba(5,88,160,0.25)]"
                  >
                    {normalize(active.cta)}{" "}
                    <span className="ml-2 text-[17px]">→</span>
                  </a>
                </div>
              </div>
            </div>
          </article>
          <div className="mt-5 rounded-2xl border border-[#c7dff0] bg-white/60 p-5 text-[13px] leading-[1.6] text-[#526a87] backdrop-blur-xl">
            {normalize(section.closing)}
          </div>
        </div>
      </ModelMobileAccordion>
    </section>
  );
}
