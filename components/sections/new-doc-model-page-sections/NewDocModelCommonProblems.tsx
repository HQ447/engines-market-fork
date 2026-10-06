"use client";

import { useState } from "react";
import Image from "next/image";
import type { ModelPageData } from "@/types/model";
import { FaChevronDown, FaChevronRight, FaChevronUp } from "react-icons/fa6";
import { FiAlertTriangle } from "react-icons/fi";
import ModelMobileAccordion from "./ModelMobileAccordion";

type Props = { data: ModelPageData };

function normalize(value: string) {
  return value.replace(/[–—]/g, "-").replace(/\?/g, "·").trim();
}

function splitHeading(value: string) {
  const parts = value
    .split(/\s+-\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  return { primary: parts[0] ?? value, accent: parts.slice(1).join(" - ") };
}

function Gauge() {
  return (
    <svg
      viewBox="0 0 160 86"
      className="mx-auto h-[78px] w-[145px]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18 73a62 62 0 0 1 124 0"
        stroke="#d7e9fb"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M18 73a62 62 0 0 1 124 0"
        stroke="#287ee7"
        strokeWidth="13"
        strokeLinecap="round"
        strokeDasharray="180"
        strokeDashoffset="48"
      />
      <path
        d="M80 73 112 40"
        stroke="#08295b"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="80" cy="73" r="8" fill="#08295b" />
      <circle cx="80" cy="73" r="3" fill="#66c7ff" />
    </svg>
  );
}

type Problem = NonNullable<
  ModelPageData["sections"]["commonProblems"]
>["problems"][number];

function ProblemIcon({
  index,
  className = "h-[38px] w-[38px]",
}: {
  index: number;
  className?: string;
}) {
  const icons = [
    "/icons/engine-market/dark-green-timing-chain.png",
    "/icons/engine-market/dark-green-rod-bearing.png",
    "/icons/engine-market/dark-green-hpfp-icon.png",
    "/icons/engine-market/dark-green-cooling-system.png",
    "/icons/engine-market/dark-green-egr-icon.png",
  ];

  return (
    <Image
      src={icons[index % icons.length]}
      alt=""
      width={42}
      height={42}
      className={`${className} object-contain`}
    />
  );
}

function ProblemDetails({
  active,
  activeIndex,
  className = "",
}: {
  active: Problem;
  activeIndex: number;
  className?: string;
}) {
  return (
    <article
      className={`${className} min-w-0 w-full max-w-full overflow-hidden rounded-2xl border border-[#1e95df]/75 bg-[#061a33] p-4 text-white  sm:p-5 lg:p-6`}
    >
      <div className="flex items-center gap-3 border-b border-white/15 pb-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#64cfff]/50 bg-[#061a33] sm:h-12 sm:w-12">
          <ProblemIcon index={activeIndex} className="h-7 w-7 sm:h-9 sm:w-9" />
        </span>
        <div>
          <h3 className="line-clamp-2 text-[16px] text-white font-extrabold leading-[1.2] hover:line-clamp-none sm:line-clamp-none sm:text-[21px] lg:text-[22px]">
            {normalize(active.h4 || active.group)}
          </h3>
          <p className="mt-1 text-[13px] text-[#c9e7f8]">
            {normalize(active.group)}
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/85 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.62))] p-4 text-[#12315a] shadow-[0_8px_24px_rgba(0,35,75,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.08em]">
            Most affected vehicles
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {normalize(active.affectedModels)
              .split(",")
              .slice(0, 2)
              .map((model) => (
                <span
                  key={model}
                  className="rounded-md border border-[#75b7ef] bg-white/45 px-2 py-1 text-[12px] font-semibold"
                >
                  {model.trim()}
                </span>
              ))}
          </div>
          <p className="mt-3 text-[12px] leading-[1.5]">
            {normalize(active.affectedModels)}
          </p>
        </div>
        <div className="rounded-xl border border-white/85 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.62))] p-4 text-center text-[#12315a] shadow-[0_8px_24px_rgba(0,35,75,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.08em]">
            Failure mileage range
          </p>
          <Gauge />
          <p className="text-[16px] font-extrabold text-[#126dd4]">
            {normalize(active.typicalFailureMileage)}
          </p>
          <p className="text-[13px]">Typical failure window</p>
        </div>
        <div className="rounded-xl border border-white/85 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.62))] p-4 text-[#12315a] shadow-[0_8px_24px_rgba(0,35,75,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.08em]">
            Root cause
          </p>
          <p className="mt-3 text-[13px] leading-[1.55]">
            {normalize(active.rootCause)}
          </p>
        </div>
      </div>

      {active.repairOptions?.length ? (
        <div className="mt-5">
          <p className="mb-2 text-[14px] font-bold">
            &nbsp;Repair options &amp; estimated costs (UK ranges)
          </p>
          <div className="overflow-x-auto rounded-xl border border-white/25">
            <table className="w-full min-w-[680px] border-collapse text-left text-[12px]">
              <thead className="bg-[#061a33] text-[10px] uppercase tracking-[0.06em] text-white/80">
                <tr>
                  <th className="px-3 py-3">Repair tier</th>
                  <th className="px-3 py-3">Dealer price</th>
                  <th className="px-3 py-3">Specialist price</th>
                  <th className="px-3 py-3">What it involves</th>
                  <th className="px-3 py-3">Longevity / suitability</th>
                </tr>
              </thead>
              <tbody className="border border-white/85 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.62))] text-[#243f63] backdrop-blur-xl">
                {active.repairOptions.map((option) => (
                  <tr
                    key={option.tier}
                    className="border-t border-[#d7e5f0] align-top"
                  >
                    <td className="px-3 py-3 font-bold">
                      {normalize(option.tier)}
                    </td>
                    <td className="px-3 py-3">
                      {normalize(option.dealerPrice)}
                    </td>
                    <td className="px-3 py-3 font-bold text-[#07845f]">
                      {normalize(option.specialistPrice)}
                    </td>
                    <td className="px-3 py-3 leading-[1.45]">
                      {normalize(option.whatItInvolves)}
                    </td>
                    <td className="px-3 py-3 leading-[1.45]">
                      {normalize(option.longevity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className="mt-5 rounded-xl border border-[#28b8ff] bg-[#061a33] p-4 shadow-[0_0_18px_rgba(37,174,255,0.2)]">
        <p className="text-[14px] font-bold text-white">Our recommendation</p>
        <p className="mt-2 line-clamp-5 text-[13px] leading-[1.6] text-white/85 hover:line-clamp-none">
          {normalize(active.recommendation)}
        </p>
        <a
          href="#quote-form"
          data-quote-context={active.group}
          data-quote-source="common-problem-detail"
          className="mt-4 inline-flex items-center self-end rounded-lg border border-[#15803d] bg-[#15803d] px-4 py-2.5 text-[12px] font-bold text-white transition hover:bg-[#15803d]"
        >
          {normalize(active.cta)}{" "}
          <span className="ml-2">
            <FaChevronRight />
          </span>
        </a>
      </div>
    </article>
  );
}

export default function NewDocModelCommonProblems({ data }: Props) {
  const section = data.sections.commonProblems;
  const sectionImage =
    data.assets.mainImage || data.assets.smallImage || data.assets.heroBg;
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedIntro, setExpandedIntro] = useState(false);
  const [mobileExpandedIndex, setMobileExpandedIndex] = useState<number | null>(
    null,
  );

  if (!section || !section.problems.length) return null;

  const active = section.problems[activeIndex] ?? section.problems[0];
  const heading = splitHeading(section.h2);
  const intro = normalize(section.h3);
  const shownIntro =
    expandedIntro || intro.length <= 360
      ? intro
      : `${intro.slice(0, 360).replace(/\s+\S*$/, "")}...`;
  function selectProblem(index: number) {
    setActiveIndex(index);
    setMobileExpandedIndex((current) => (current === index ? null : index));
  }

  return (
    <section className="relative overflow-hidden bg-[#f7f8fb] px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-7">
      <ModelMobileAccordion
        title={heading.primary}
        icon={<FiAlertTriangle className="h-5 w-5" aria-hidden="true" />}
      >
        <div className="pointer-events-none absolute right-0 top-0 z-0 h-[210px] w-full opacity-25 sm:h-[240px] sm:opacity-30 md:right-[max(1rem,calc((100vw-80rem)/2+1rem))] md:top-[12px] md:h-[220px] md:w-[430px] md:overflow-hidden md:opacity-70">
          <span className="absolute right-0 top-0 text-[60px] font-black uppercase leading-none tracking-[-0.08em] text-[#a9c8e2]/50">
            {data.model.name.replace(
              new RegExp(`^${data.brand.name}\\s+`, "i"),
              "",
            )}
          </span>
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
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1289d5]/40 bg-[linear-gradient(135deg,#042f5a,#075b94)] px-3.5 py-1.5 text-[13px] font-bold uppercase text-white shadow-[0_0_20px_rgba(26,145,232,0.25)] sm:text-[13px]">
            {section.tag}
          </span>
          <h2
            style={{
              fontFamily:
                '"Bebas Neue", "Urbanist", ui-sans-serif, system-ui, sans-serif',
              letterSpacing: "0.01em",
            }}
            className="mt-5 max-w-[760px] !text-[40px] font-extrabold leading-[1.04] tracking-normal !tracking-[-0.02em] text-[#09264e] sm:!tracking-[0.01em] sm:!text-[41px] lg:!text-[46px]"
          >
            {heading.primary}{" "}
            {heading.accent ? (
              <span className="text-[#15803d]">- {heading.accent}</span>
            ) : null}
          </h2>
          <p className="mt-4 max-w-[760px] text-[14px] leading-[1.65] text-[#526a87] lg:text-[15px]">
            {shownIntro}{" "}
            {intro.length > 360 ? (
              <button
                type="button"
                onClick={() => setExpandedIntro((value) => !value)}
                className="font-bold text-[#126dd4] hover:underline"
              >
                {expandedIntro ? "see less" : "see more"}
              </button>
            ) : null}
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[245px_minmax(0,1fr)]">
            <aside className="min-w-0 space-y-2.5">
              {section.problems.map((problem, index) => {
                const selected = index === activeIndex;
                return (
                  <div
                    key={`${problem.group}-${index}`}
                    className="lg:contents"
                  >
                    <button
                      type="button"
                      onClick={() => selectProblem(index)}
                      className={`flex lg:mb-2 w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${selected ? "border-[#2da8ff] bg-[#061a33] text-white shadow-[0_0_18px_rgba(25,160,255,0.55)]" : "border-[#cde2f2] bg-white/75 text-[#09264e] shadow-[0_5px_15px_rgba(23,84,131,0.06)] hover:border-[#4bb7fb]"}`}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center">
                        <ProblemIcon index={index} className="h-9 w-9" />
                      </span>
                      <span className="min-w-0 flex-1 text-[13px] font-bold leading-[1.25]">
                        {normalize(problem.group)}
                      </span>
                      <span className="text-[16px] lg:hidden">
                        {mobileExpandedIndex === index ? (
                          <FaChevronUp aria-hidden="true" />
                        ) : (
                          <FaChevronDown aria-hidden="true" />
                        )}
                      </span>
                      <span className="hidden text-[20px] lg:inline">›</span>
                    </button>
                    {mobileExpandedIndex === index ? (
                      <ProblemDetails
                        active={problem}
                        activeIndex={index}
                        className="mt-3 lg:hidden"
                      />
                    ) : null}
                  </div>
                );
              })}
              <div className="mt-3 rounded-xl border border-[#cde2f2] bg-white/55 p-3 text-[12px] leading-[1.45] text-[#526a87] backdrop-blur-xl">
                <span className="mr-2 text-[#08aa78]">♢</span>Every rebuilt
                engine includes a minimum 12-month unlimited mileage warranty.
              </div>
            </aside>

            <ProblemDetails
              active={active}
              activeIndex={activeIndex}
              className="hidden lg:block"
            />
          </div>
        </div>
      </ModelMobileAccordion>
    </section>
  );
}
