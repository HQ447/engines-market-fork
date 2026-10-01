"use client";

import Image from "next/image";
import { useState } from "react";
import type { EngineCodesData } from "@/types/brand";
import type { ModelPageData } from "@/types/model";
import { CiCircleChevUp, CiCircleChevDown } from "react-icons/ci";
import { FiAlertCircle, FiSettings } from "react-icons/fi";
import { MdOutlineElectricMeter } from "react-icons/md";
import ModelMobileAccordion from "./ModelMobileAccordion";

type Props = { data: ModelPageData; engineLinks?: Record<string, string> };

function normalize(value: string) {
  return value.replace(/[–—]/g, "-").trim();
}
function splitHeading(data: EngineCodesData) {
  return data.headingLines?.length
    ? data.headingLines
    : data.h2
        .split(/\s+-\s+/)
        .map((line) => line.trim())
        .filter(Boolean);
}
function fallbackEngineImage(fuel: string) {
  const normalizedFuel = fuel.toLowerCase();

  if (normalizedFuel.includes("diesel")) {
    return "/images/shared/hero-engines/temporary-diesel-engine-cutout.png";
  }

  if (
    normalizedFuel.includes("hybrid") ||
    normalizedFuel.includes("electric")
  ) {
    return "/images/shared/hero-engines/temporary-performance-engine-cutout.png";
  }

  return "/images/shared/hero-engines/temporary-petrol-engine-cutout.png";
}
function EngineIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      aria-hidden="true"
    >
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
function FuelIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 28V6h13v22M8 10h13M21 10h4l3 4v10a2 2 0 0 1-4 0v-7h-3"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 14h7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function mobileTabLabel(tab: string) {
  const normalizedTab = tab.toLowerCase();

  if (normalizedTab.includes("diesel")) return "Diesel";
  if (normalizedTab.includes("petrol")) return "Petrol";
  if (normalizedTab.includes("electric")) return "Electric";
  if (normalizedTab.includes("hybrid") || normalizedTab.includes("mhev")) {
    return "Hybrid";
  }

  return tab;
}

function CompatibleVariants({ models }: { models: string }) {
  return (
    <>
      <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#a9d9ff]">
        Compatible variants
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {models
          .split(",")
          .slice(0, 6)
          .map((model) => (
            <span
              key={model}
              className="rounded-md border border-[#31b8ff] bg-[#061a33] px-2.5 py-1 text-[11px] text-white shadow-[0_0_11px_rgba(30,167,255,0.45)]"
            >
              {model.trim()}
            </span>
          ))}
      </div>
    </>
  );
}

export default function NewDocModelEngineCodes({ data: modelData }: Props) {
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
  const section = data.sections.engineCodes;
  const [activeTab, setActiveTab] = useState(0);
  const [expandedCode, setExpandedCode] = useState(
    () => section.groups[0]?.engines[0]?.code ?? "",
  );
  const tabs = section.groups.map(
    (group, index) => section.filters[index] ?? group.name,
  );
  const activeGroup = section.groups[activeTab] ?? section.groups[0];
  const engines = activeGroup?.engines ?? [];
  const headingLines = splitHeading(section);
  const hasThreeGroups = section.groups.length > 2;

  return (
    <section
      id="model-engine-codes"
      className="relative overflow-hidden bg-white px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
    >
      <ModelMobileAccordion
        title={normalize(headingLines[0] ?? section.h2)}
        icon={<FiSettings className="h-5 w-5" aria-hidden="true" />}
      >
        <div className="pointer-events-none absolute right-0 top-0 z-0 h-[210px] w-full opacity-25 sm:h-[240px] sm:opacity-30 md:right-[max(1rem,calc((100vw-80rem)/2+1rem))] md:top-[-2px] md:h-[220px] md:w-[430px] md:overflow-hidden md:opacity-70">
          <span className="absolute right-0 top-0 text-[64px] font-black uppercase leading-none tracking-[-0.08em] text-[#a9c8e2]/45">
            {data.model.name.replace(
              new RegExp(`^${data.brand.name}\\s+`, "i"),
              "",
            )}
          </span>
          {data.assets.mainImage ? (
            <Image
              src={data.assets.mainImage}
              alt=""
              fill
              className="translate-x-[8%] object-contain object-right-top md:object-right-center md:scale-100 mix-blend-multiply [mask-image:linear-gradient(to_bottom,black_50%,transparent)] sm:translate-x-0"
              sizes="390px"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.52)_0%,rgba(255,255,255,0.76)_55%,#fff_100%)] lg:bg-none" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="max-w-[760px]">
            <span className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#042f5a,#075b94)] px-3.5 py-1.5 text-[13px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_4px_14px_rgba(9,39,71,0.18)]">
              {section.tag}
            </span>
            <h2
              style={{
                fontFamily:
                  '"Bebas Neue", "Urbanist", ui-sans-serif, system-ui, sans-serif',
                letterSpacing: "0.01em",
              }}
              className="mt-5 !text-[40px] font-extrabold leading-[1.02] tracking-normal !tracking-[-0.02em] text-[#09264e] sm:!tracking-[0.01em] sm:!text-[41px] lg:!text-[46px]"
            >
              {headingLines.map((line, index) => (
                <span
                  key={`${line}-${index}`}
                  className={`block ${index === headingLines.length - 1 && headingLines.length > 1 ? "text-[#15803d]" : ""}`}
                >
                  {normalize(line)}
                </span>
              ))}
            </h2>
            <p className="mt-4 max-w-[760px] text-[14px] leading-[1.6] text-[#4b6380] lg:text-[15px]">
              {normalize(section.h3)}
            </p>
          </div>
          <div
            className={`mt-4 grid overflow-hidden rounded-xl border border-[#b6d9f5] bg-white/70  ${hasThreeGroups ? "grid-cols-3" : "grid-cols-2"}`}
          >
            {tabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(index);
                  setExpandedCode(
                    section.groups[index]?.engines[0]?.code ?? "",
                  );
                }}
                className={`relative flex items-center justify-center overflow-hidden text-left transition sm:justify-start ${hasThreeGroups ? "gap-1 px-1 py-3 sm:gap-3 sm:px-8 sm:py-3" : "gap-3 px-4 py-3 sm:px-8 sm:py-3"} ${activeTab === index ? "bg-[#061a33] text-white  after:absolute after:inset-y-0 after:right-0 after:w-20 after:bg-[linear-gradient(115deg,transparent_0%,rgba(23,133,255,0.56)_55%,rgba(35,156,255,0.22)_100%)] after:[clip-path:polygon(0_0,65%_0,100%_50%,65%_100%,0_100%,25%_50%)] after:content-['']" : "bg-white/70 text-[#1c3760] hover:bg-[#edf8ff]"}`}
              >
                {tab.toLowerCase().includes("electric") ||
                tab.toLowerCase().includes("hybrid") ? (
                  <MdOutlineElectricMeter
                    className={
                      hasThreeGroups ? "h-5 w-5 sm:h-8 sm:w-8" : "h-8 w-8"
                    }
                    aria-hidden="true"
                  />
                ) : index === 0 ? (
                  <EngineIcon
                    className={
                      hasThreeGroups ? "h-5 w-5 sm:h-8 sm:w-8" : undefined
                    }
                  />
                ) : (
                  <FuelIcon
                    className={
                      hasThreeGroups ? "h-5 w-5 sm:h-8 sm:w-8" : undefined
                    }
                  />
                )}
                <span className="relative z-10">
                  <span className="block whitespace-nowrap text-[12px] font-extrabold sm:text-[13px] lg:text-[15px]">
                    <span className="sm:hidden">{mobileTabLabel(tab)}</span>
                    <span className="hidden sm:inline">{tab}</span>
                  </span>
                  <span
                    className={`hidden text-[12px] sm:block ${activeTab === index ? "text-white/75" : "text-[#6380a1]"}`}
                  >
                    Explore {tab.toLowerCase()}
                  </span>
                </span>
              </button>
            ))}
          </div>
          {activeGroup ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#b8d9f2] bg-white/65  backdrop-blur-xl">
              <div className="flex items-center gap-3 border-b border-[#cfe4f5] px-4 py-3 text-[#092b58] sm:px-6">
                <EngineIcon />
                <div className="min-w-0">
                  <h3 className="truncate text-[15px] font-extrabold lg:text-[19px]">
                    {activeGroup.name}
                  </h3>
                  <p className="mt-0.5 text-[11px] leading-[1.4] text-[#617b9c] sm:text-[12px]">
                    {normalize(activeGroup.era)}
                  </p>
                </div>
              </div>
              <div className="space-y-2 bg-[#f8fcff] p-1 sm:p-4 lg:grid lg:grid-cols-2 lg:gap-2 lg:space-y-0">
                {engines.map((engine) => {
                  const expanded = expandedCode === engine.code;
                  const engineImage = fallbackEngineImage(engine.fuel);
                  return (
                    <article
                      key={engine.code}
                      className={`overflow-hidden rounded-xl border bg-white transition ${expanded ? "border-[#36c79a] lg:col-span-2 lg:order-first" : "border-[#cfe5f6] hover:border-[#37aaf4]"}`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCode(expanded ? "" : engine.code)
                        }
                        className="flex w-full items-center gap-3 px-3 sm:px-2 py-2 text-left"
                      >
                        <span className="relative hidden h-12 w-14 shrink-0 overflow-hidden rounded-lg  sm:block">
                          <Image
                            src={engineImage}
                            alt=""
                            fill
                            className="object-contain p-1"
                            sizes="56px"
                          />
                        </span>
                        <span>
                          <span className="block text-[15px] lg:text-[17px] font-extrabold text-[#0b376b]">
                            {engine.code}
                          </span>
                          <span className="text-[13px] text-[#617b9c]">
                            {normalize(engine.title ?? "")} · {engine.power}
                          </span>
                        </span>
                        <span className="ml-auto text-right">
                          <span className="block text-[10px] uppercase text-[#617b9c]">
                            Avg. rebuilt price
                          </span>
                          <span className="text-[16px] font-extrabold text-[#07845f]">
                            {engine.avgRebuiltPrice}
                          </span>
                        </span>
                        <span className="text-[20px] font-bold text-[#1461c9]">
                          {expanded ? <CiCircleChevUp /> : <CiCircleChevDown />}
                        </span>
                      </button>
                      {expanded ? (
                        <div className="grid gap-4 border-t border-[#d7e9f5] bg-[#061a33] p-4 text-white sm:p-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(145px,0.65fr)_minmax(190px,0.85fr)_minmax(190px,0.85fr)]">
                          <div className="min-w-0">
                            <div className="grid grid-cols-[96px_minmax(0,1fr)] items-start gap-3 sm:flex sm:gap-4">
                              <div className="relative h-[96px] w-[96px] shrink-0 overflow-hidden rounded-lg bg-white/95 shadow-[0_5px_16px_rgba(0,0,0,0.24)] sm:h-[122px] sm:w-[136px] lg:h-auto lg:min-h-[176px] lg:w-[150px] lg:self-stretch">
                                <Image
                                  src={engineImage}
                                  alt={`${engine.code} engine`}
                                  fill
                                  className="object-contain p-2 lg:scale-[1.08]"
                                  sizes="150px"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[18px] font-extrabold leading-[1.15] sm:text-[20px] lg:text-[22px]">
                                  {engine.code}{" "}
                                  <span className="font-medium">
                                    - {normalize(engine.title ?? "")}
                                  </span>
                                </p>
                                <p className="mt-2 text-[12px] leading-[1.5] text-white/80 sm:text-[13px] sm:leading-[1.55]">
                                  {normalize(activeGroup.failureNote)}
                                </p>
                                <div className="mt-[2px] hidden sm:block lg:mt-[6px]">
                                  <CompatibleVariants
                                    models={engine.compatibleModels}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 sm:hidden">
                              <CompatibleVariants
                                models={engine.compatibleModels}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="rounded-xl border border-[#31b8ff] bg-[#061a33] p-3 shadow-[0_0_18px_rgba(30,167,255,0.35)]">
                              <p className="text-[10px] uppercase tracking-[0.08em] text-[#bfe9ff]">
                                Avg. rebuilt price
                              </p>
                              <p className="mt-2 text-[21px] font-extrabold text-[#34e6b1]">
                                {engine.avgRebuiltPrice}
                              </p>
                              <p className="text-[12px] text-white/75">
                                Supply only
                              </p>
                            </div>
                            <a
                              href="#quote-form"
                              data-quote-context={engine.code}
                              data-quote-source="engine-code"
                              className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-[#15803d] bg-[#15803d] px-3 py-3 text-center text-[12px] font-bold text-white transition hover:bg-[#15803d]"
                            >
                              Get quotes <span className="ml-2">→</span>
                            </a>
                          </div>
                          <div className="rounded-xl border border-white/85 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.62))] p-4 text-[#12315a] shadow-[0_8px_24px_rgba(0,35,75,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
                            <p className="flex items-center gap-2 border-b border-[#d5e7f5] pb-2 text-[16px] font-bold">
                              <FiSettings
                                className="h-5 w-5 shrink-0"
                                aria-hidden="true"
                              />
                              <span>Technical specifications</span>
                            </p>
                            <dl className="mt-3 space-y-2 text-[13px]">
                              <div className="flex justify-between gap-3">
                                <dt className="text-[#5d7798]">Fuel type</dt>
                                <dd className="font-semibold">{engine.fuel}</dd>
                              </div>
                              <div className="flex justify-between gap-3">
                                <dt className="text-[#5d7798]">Engine size</dt>
                                <dd className="font-semibold">{engine.size}</dd>
                              </div>
                              <div className="flex justify-between gap-3">
                                <dt className="text-[#5d7798]">Power output</dt>
                                <dd className="font-semibold">
                                  {engine.power}
                                </dd>
                              </div>
                              <div className="flex justify-between gap-3">
                                <dt className="text-[#5d7798]">Years fitted</dt>
                                <dd className="font-semibold">
                                  {engine.familyHeading?.match(
                                    /\d{4}[^)]*\d{4}/,
                                  )?.[0] ?? "Check by registration"}
                                </dd>
                              </div>
                            </dl>
                          </div>
                          <div className="rounded-xl border border-white/85 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.62))] p-3 text-[#12315a] shadow-[0_8px_24px_rgba(0,35,75,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
                            <p className="flex items-center gap-2 border-b border-[#d5e7f5] pb-1 text-[16px] font-bold">
                              <FiAlertCircle
                                className="h-5 w-5 shrink-0"
                                aria-hidden="true"
                              />
                              <span>Common failures</span>
                            </p>
                            <ul className="mt-2 space-y-1 text-[12.5px] leading-[1.3] text-[#526d8c]">
                              <li className="flex gap-1.5">
                                <span className="text-[#0a9c70]">●</span>
                                {normalize(activeGroup.failureNote)}
                              </li>
                              <li className="flex gap-1.5">
                                <span className="text-[#0a9c70]">●</span>Confirm
                                exact engine code and fitment before ordering.
                              </li>
                              <li className="flex gap-1.5">
                                <span className="text-[#0a9c70]">●</span>Ask for
                                warranty and supply &amp; fit terms.
                              </li>
                            </ul>
                          </div>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </div>
          ) : null}
          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-[#1c8bd5]/60 bg-[#061a33] p-5 text-white  sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="max-w-[650px]">
              <p className="text-[16px] font-extrabold">
                Not sure which engine code?
              </p>
              <p className="mt-1 text-[13px] leading-[1.5] text-white/80">
                {normalize(
                  section.closingLine ??
                    "Enter your registration and we will identify the exact engine and replacement options.",
                )}
              </p>
            </div>
            <a
              href="#quote-form"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#ffcb04] px-5 py-3 text-[13px] font-extrabold text-[#172849] transition hover:bg-[#ffe47a]"
            >
              Find My Engine <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </ModelMobileAccordion>
    </section>
  );
}
