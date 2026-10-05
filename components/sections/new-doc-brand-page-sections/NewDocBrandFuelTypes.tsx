"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { BsFuelPumpDiesel } from "react-icons/bs";
import { FaSearch, FaShieldAlt, FaTools } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { IoStatsChart } from "react-icons/io5";
import { PiEngineBold } from "react-icons/pi";
import { RiCarLine } from "react-icons/ri";
import { SiFueler } from "react-icons/si";
import { MdOutlineElectricCar } from "react-icons/md";
import { BsFuelPumpFill } from "react-icons/bs";
import { MdOutlineElectricMeter } from "react-icons/md";
import { MdStars } from "react-icons/md";

import type { BrandPageData, FuelTypesData } from "@/types/brand";
import ModelMobileAccordion from "@/components/sections/new-doc-model-page-sections/ModelMobileAccordion";
import { splitBrandHeading } from "./brandHeading";

type Props = { data: BrandPageData };
type FuelSection = FuelTypesData;
type FuelItem = FuelSection["items"][number];
type FuelKind = "diesel" | "petrol" | "hybrid" | "phev" | "electric";
type DetailKey = "how" | "mpg" | "issues" | "models" | "cost" | "choice";

function normalize(value?: string) {
  return (value ?? "").replace(/[–—]/g, "-").trim();
}

function cleanCta(value?: string) {
  return normalize(value)
    .replace(/^\s*(?:→|->)\s*/i, "")
    .replace(/\s*(?:→|->)\s*$/i, "");
}

function splitHeading(value: string) {
  return splitBrandHeading(value);
}

function unique(values: string[]) {
  return [...new Set(values.map(normalize).filter(Boolean))];
}

function fuelKind(title: string): FuelKind {
  const value = title.toLowerCase();
  if (value.includes("electric") || value.includes("bev")) return "electric";
  if (
    value.includes("phev") ||
    value.includes("plug-in hybrid") ||
    value.includes("plug in hybrid")
  )
    return "phev";
  if (value.includes("hybrid") || value.includes("mhev")) return "hybrid";
  if (value.includes("petrol") || value.includes("gasoline")) return "petrol";
  return "diesel";
}

type CanonicalFuelKind = "diesel" | "petrol" | "hybrid" | "electric";

const fallbackFuelItems: Record<CanonicalFuelKind, FuelItem> = {
  diesel: {
    title: "Diesel Engines",
    description:
      "Excellent fuel economy, strong torque and proven long-distance durability.",
    descriptor:
      "Diesel engines remain a strong choice for motorway commuters and high-mileage drivers, especially where torque and fuel economy matter most.",
    families: ["Typical replacement cost: £1,500 - £4,000"],
    foundIn: ["1 Series", "3 Series", "5 Series", "X models"],
    knownFor: [
      "Timing chain wear",
      "DPF and AdBlue issues",
      "EGR cooler leaks",
    ],
    typicalModels: ["BMW 1 Series", "BMW 3 Series", "BMW X5"],
    importantNotes: ["Best for long-distance driving"],
    cta: "Get quotes for Diesel engines",
  },
  petrol: {
    title: "Petrol Engines",
    description: "Smooth and quiet performance with lower maintenance needs.",
    descriptor:
      "Petrol engines suit lower-mileage drivers, city use and performance-focused models where refinement and responsive power delivery matter.",
    families: ["Typical replacement cost: £1,500 - £3,800"],
    foundIn: ["1 Series", "3 Series", "M models"],
    knownFor: [
      "Timing chain guide wear",
      "Coolant housing leaks",
      "High pressure fuel pump faults",
    ],
    typicalModels: ["BMW 1 Series", "BMW 2 Series", "BMW M models"],
    importantNotes: ["Best for city and short trips"],
    cta: "Get quotes for Petrol engines",
  },
  hybrid: {
    title: "Hybrid (PHEV)",
    description:
      "Electric assistance with petrol efficiency for mixed driving.",
    descriptor:
      "Hybrid engines combine a combustion engine with an electric drive system, reducing urban running costs while keeping petrol flexibility.",
    families: ["Typical replacement cost: £2,500 - £4,500 + battery"],
    foundIn: ["PHEV models"],
    knownFor: [
      "Battery degradation",
      "Thermal shock wear",
      "Electric water pump failure",
    ],
    typicalModels: ["BMW 330e", "BMW 530e", "BMW X5 xDrive45e"],
    importantNotes: ["Best for company car users"],
    cta: "Get quotes for Hybrid engines",
  },
  electric: {
    title: "Electric (BEV)",
    description: "Zero tailpipe emissions with low routine maintenance.",
    descriptor:
      "Electric drivetrains remove many combustion-engine service items, though drive units, battery modules and charging systems still need specialist checks.",
    families: ["Typical replacement cost: £2,500 - £5,000 + battery"],
    foundIn: ["BEV models"],
    knownFor: [
      "Battery module degradation",
      "Onboard charger failure",
      "Electric motor bearing wear",
    ],
    typicalModels: ["BMW i3", "BMW i4", "BMW iX"],
    importantNotes: ["Best for low-maintenance city drivers"],
    cta: "Get quotes for Electric engines",
  },
};

function canonicalFuelKind(item: FuelItem): CanonicalFuelKind {
  const kind = fuelKind(item.title);
  return kind === "phev" ? "hybrid" : kind;
}

function completeFuelItems(items: FuelItem[]) {
  const displayed: FuelItem[] = [];
  const used = new Set<FuelItem>();

  for (const kind of ["diesel", "petrol", "hybrid", "electric"] as const) {
    const item = items.find(
      (candidate) => canonicalFuelKind(candidate) === kind,
    );
    if (item) {
      displayed.push(item);
      used.add(item);
    } else {
      displayed.push(fallbackFuelItems[kind]);
    }
  }

  return [...displayed, ...items.filter((item) => !used.has(item))];
}

function fuelLabel(title: string) {
  const kind = fuelKind(title);
  if (kind === "phev") return "Hybrid (PHEV)";
  if (kind === "hybrid") return "Hybrid";
  if (kind === "electric") return "Electric (BEV)";
  return kind === "petrol" ? "Petrol" : "Diesel";
}

function cardTitle(title: string) {
  const kind = fuelKind(title);
  if (kind === "petrol") return "Petrol Engines";
  if (kind === "hybrid" || kind === "phev") return "Hybrid (PHEV)";
  if (kind === "electric") return "Electric (BEV)";
  return "Diesel Engines";
}

function cardSubtitle(title: string) {
  const kind = fuelKind(title);
  if (kind === "petrol") return "Performance & Refinement";
  if (kind === "hybrid" || kind === "phev") return "The Electrified Balance";
  if (kind === "electric") return "The Future of Driving";
  return "The Motorway Workhorse";
}

function fuelTone(title: string) {
  const kind = fuelKind(title);
  if (kind === "phev")
    return {
      border: "border-[#b7a4ed]",
      card: "bg-[#f6f3ff]",
      badge: "border-[#a58be4] bg-[#eee8ff] text-[#6845ad]",
      icon: "text-[#6845ad]",
      iconBg: "bg-[#e8defd]",
      button: "border-[#6845ad] bg-[#6845ad]",
      panel: "border-[#b7a4ed] bg-[#fbf9ff]",
      panelHeader: "bg-[#eee8ff] text-[#6845ad]",
      accent: "#6845ad",
    };
  if (kind === "hybrid")
    return {
      border: "border-[#d3b1f4]",
      card: "bg-[#fbf7ff]",
      badge: "border-[#b888ed] bg-[#eee1ff] text-[#7041aa]",
      icon: "text-[#7041aa]",
      iconBg: "bg-[#eee1ff]",
      button: "border-[#7041aa] bg-[#7041aa]",
      panel: "border-[#c39ae9] bg-[#fcf9ff]",
      panelHeader: "bg-[#f0e4ff] text-[#7041aa]",
      accent: "#7041aa",
    };
  if (kind === "petrol")
    return {
      border: "border-[#9cb4da]",
      card: "bg-[#f4f8ff]",
      badge: "border-[#9cb4da] bg-[#e8effb] text-[#0b2c83]",
      icon: "text-[#0b2c83]",
      iconBg: "bg-[#e8effb]",
      button: "border-[#0b2c83] bg-[#0b2c83]",
      panel: "border-[#9cb4da] bg-[#f7faff]",
      panelHeader: "bg-[#e8effb] text-[#0b2c83]",
      accent: "#0b2c83",
    };
  if (kind === "electric")
    return {
      border: "border-[#80c5ee]",
      card: "bg-[#f0f8ff]",
      badge: "border-[#80c5ee] bg-[#dceeff] text-[#0b5aa1]",
      icon: "text-[#0b5aa1]",
      iconBg: "bg-[#dceeff]",
      button: "border-[#0b5aa1] bg-[#0b5aa1]",
      panel: "border-[#80c5ee] bg-[#f5fbff]",
      panelHeader: "bg-[#e0f1ff] text-[#0b5aa1]",
      accent: "#0b5aa1",
    };
  return {
    border: "border-[#8bdcb8]",
    card: "bg-[#f4fff8]",
    badge: "border-[#8bdcb8] bg-[#dff8eb] text-[#087951]",
    icon: "text-[#087951]",
    iconBg: "bg-[#dff8eb]",
    button: "border-[#087951] bg-[#087951]",
    panel: "border-[#8bdcb8] bg-[#f4fff8]",
    panelHeader: "bg-[#e2f8ed] text-[#087951]",
    accent: "#087951",
  };
}

function artworkFor(title: string) {
  const kind = fuelKind(title);
  if (kind === "petrol")
    return "/images/shared/hero-engines/temporary-petrol-engine-cutout.png";
  if (kind === "hybrid" || kind === "phev" || kind === "electric")
    return "/images/shared/hero-engines/temporary-performance-engine-cutout.png";
  return "/images/shared/hero-engines/temporary-diesel-engine-cutout.png";
}

function cardArtworkFor(title: string, brandImages: string[]) {
  const images = [...new Set(brandImages.filter(Boolean))];
  if (!images.length) return artworkFor(title);
  const kind = fuelKind(title);
  const slot =
    kind === "petrol"
      ? 1
      : kind === "hybrid" || kind === "phev"
        ? 2
        : kind === "electric"
          ? 3
          : 0;
  return images[slot % images.length] ?? images[0];
}

function legacyPrice(item: FuelItem) {
  const source = [
    ...(item.families ?? []),
    item.description,
    item.descriptor,
  ].join(" ");
  const match = normalize(source).match(/£[\d,]+\s*-\s*£[\d,]+/);
  if (match) return match[0].replace(/\s*-\s*/g, " - ");
  const kind = fuelKind(item.title);
  if (kind === "petrol") return "£1,500 - £3,800";
  if (kind === "hybrid" || kind === "phev")
    return "£2,500 - £4,500 + £3,000 - £8,000 battery";
  if (kind === "electric") return "£2,500 - £5,000 + £5,000 - £12,000 battery";
  return "£1,500 - £4,000 + £5,000 - £12,000";
}

function cardPrice(item: FuelItem) {
  return (
    legacyPrice(item).match(/£[\d,]+\s*-\s*£[\d,]+/)?.[0] ?? legacyPrice(item)
  );
}

function legacyMpg(item: FuelItem) {
  const kind = fuelKind(item.title);
  if (kind === "petrol") return "30 - 50 mpg";
  if (kind === "hybrid" || kind === "phev") return "30 - 60 mpg + electric";
  if (kind === "electric") return "120 - 300 miles";
  return "45 - 65 mpg";
}

function legacyIssues(item: FuelItem) {
  const values = [...(item.knownFor ?? []), ...(item.importantNotes ?? [])]
    .map(normalize)
    .filter(Boolean);
  return values.length
    ? values.slice(0, 3)
    : ["Timing chain wear", "Cooling system leaks", "Turbo and EGR issues"];
}

function legacyBenefits(item: FuelItem) {
  const kind = fuelKind(item.title);
  const source = [
    ...(item.foundIn ?? []),
    ...(item.typicalModels ?? []),
    ...legacyIssues(item),
  ]
    .map(normalize)
    .filter(Boolean)
    .slice(0, 4);
  if (source.length >= 4) return source;
  if (kind === "petrol")
    return [
      "Smooth and quiet performance",
      "Lower maintenance needs",
      "Wide range of power options",
      "Great for city and short trips",
    ];
  if (kind === "hybrid" || kind === "phev")
    return [
      "Lower running costs",
      "Electric plus petrol efficiency",
      "20-40 miles electric range",
      "Ideal for company car drivers",
    ];
  if (kind === "electric")
    return [
      "Zero emissions",
      "Low running and maintenance",
      "120-300 miles real-world range",
      "Perfect for city and daily use",
    ];
  return [
    "Excellent fuel economy",
    "Strong torque and durability",
    "Ideal for long-distance driving",
    "Proven reliability",
  ];
}

function legacyBestFor(item: FuelItem) {
  const kind = fuelKind(item.title);
  if (kind === "petrol") return "Lower-mileage drivers and performance users";
  if (kind === "hybrid" || kind === "phev")
    return "Company car users and urban drivers";
  if (kind === "electric") return "Low-maintenance city drivers";
  return "Motorway commuters and high-mileage drivers";
}

function searchQueries(item: FuelItem) {
  const source = [
    ...(item.importantNotes ?? []),
    item.description,
    item.descriptor,
  ].find((value) => /typical searches:/i.test(value ?? ""));
  if (!source) return [];
  const queryText =
    source.split(/typical searches:/i)[1]?.split(/(?:→|->)/)[0] ?? "";
  return unique(queryText.split(","));
}

function queryRegistrationText(item: FuelItem) {
  const source = [
    ...(item.importantNotes ?? []),
    item.description,
    item.descriptor,
  ].find((value) => /not sure which/i.test(value ?? ""));
  if (!source) return "";
  return normalize(source.split(/(?:→|->)/).at(-1));
}

function cardHighlights(item: FuelItem) {
  return legacyBenefits(item);
}

function tableIssues(item: FuelItem) {
  return (item.importantNotes ?? []).map(normalize).filter(Boolean);
}

function tableBestFor(item: FuelItem) {
  return legacyBestFor(item);
}

function tableRange(item: FuelItem) {
  return legacyMpg(item);
}

function iconFor(title: string) {
  return fuelKind(title) === "diesel" ? (
    <BsFuelPumpDiesel />
  ) : fuelKind(title) === "petrol" ? (
    <BsFuelPumpFill />
  ) : fuelKind(title) === "hybrid" || fuelKind(title) === "phev" ? (
    <MdOutlineElectricMeter />
  ) : (
    <MdOutlineElectricCar />
  );
}

function FuelCard({
  item,
  brandName,
  brandImages,
  active,
  onToggle,
}: {
  item: FuelItem;
  brandName: string;
  brandImages: string[];
  active: boolean;
  onToggle: () => void;
}) {
  const tone = fuelTone(item.title);
  const highlights = cardHighlights(item);
  const cardImage = cardArtworkFor(item.title, brandImages);

  return (
    <article
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a, button")) return;
        onToggle();
      }}
      className={`relative flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-[#c4d6e6] bg-[linear-gradient(135deg,rgba(255,255,255,0.86)_0%,rgba(255,255,255,0.72)_52%,rgba(255,255,255,0.82)_100%)] p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.9),inset_-1px_-1px_0_rgba(255,255,255,0.58),0_8px_22px_rgba(19,92,145,0.12)] backdrop-blur-xl transition ${active ? "md:ring-2 md:ring-offset-2" : ""}`}
      style={
        active
          ? ({ "--tw-ring-color": tone.accent } as CSSProperties)
          : undefined
      }
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone.iconBg} ${tone.icon}`}
        >
          {iconFor(item.title)}
        </span>
        <div className="min-w-0 flex-1">
          <h4
            className={`text-[16px] font-extrabold uppercase leading-[1.1] lg:text-[14px] ${tone.icon}`}
          >
            {cardTitle(item.title)}
          </h4>
          <p
            className={`mt-1 min-h-[34px] line-clamp-2 text-[13px] font-bold ${tone.icon}`}
          >
            {cardSubtitle(item.title)}
          </p>
        </div>
      </div>

      <ul className="mt-4 h-auto min-h-[92px] space-y-1.5 overflow-visible pl-2 text-[13px] leading-[1.4] text-[#334e70]">
        {highlights.map((value, index) => (
          <li key={`${value}-${index}`} className="flex gap-2">
            <span className={`font-black ${tone.icon}`}>✓</span>
            <span>{normalize(value)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-2 flex min-h-[120px] items-center justify-center overflow-hidden rounded-lg bg-transparent px-2">
        <Image
          src={cardImage}
          alt={`${brandName} ${cardTitle(item.title)} vehicle`}
          width={220}
          height={130}
          className="h-[112px] w-full object-contain"
        />
      </div>

      <div className="mt-4 text-center">
        <p className="text-[9px] font-extrabold uppercase tracking-[0.05em] text-[#526a87]">
          Avg. replacement cost (supply only)
        </p>
        <p
          className={`mt-1 text-[17px] font-extrabold leading-[1.2] ${tone.icon}`}
        >
          {cardPrice(item)}
        </p>
      </div>

      <div className="mt-auto pt-4">
        <a
          href="#quote-form"
          data-quote-context={item.title}
          data-quote-source="brand-fuel-types"
          className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border px-3 text-center text-[12px] font-extrabold leading-[1.2] text-white shadow-[0_6px_14px_rgba(4,53,101,0.18)] ${tone.button}`}
        >
          <span className="min-w-0 line-clamp-2">{cleanCta(item.cta)}</span>
          <span className="shrink-0 text-[17px]">→</span>
        </a>
        <button
          type="button"
          aria-expanded={active}
          aria-controls="brand-fuel-detail-panel"
          onClick={onToggle}
          className={`mx-auto mt-3 flex items-center gap-2 text-[12px] font-extrabold ${tone.icon}`}
        >
          <span>Learn more about {fuelLabel(item.title)}</span>
          {active ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>
    </article>
  );
}

function ComparisonTable({
  section,
  brandName,
}: {
  section: FuelSection;
  brandName: string;
}) {
  return (
    <div className="mt-7 overflow-hidden rounded-xl border border-[#dce8f2] bg-white shadow-[0_8px_24px_rgba(19,92,145,0.07)]">
      <div className="flex items-center gap-2 bg-[#061a33] px-4 py-4 text-[13px] font-extrabold uppercase tracking-[0.06em] text-white sm:px-5">
        <IoStatsChart className="text-[22px]" /> Quick comparison:{" "}
        {normalize(brandName)}{" "}
        {section.items.map((item) => fuelLabel(item.title)).join(", ")}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[920px] w-full table-fixed border-collapse text-left text-[14px] align-middle text-[#183d72]">
          <colgroup>
            <col className="w-[15%]" />
            <col className="w-[16%]" />
            <col className="w-[15%]" />
            <col className="w-[36%]" />
            <col className="w-[18%]" />
          </colgroup>
          <thead className="bg-[#f7fbff] text-[13px] font-extrabold text-[#12345f]">
            <tr>
              <th className="px-4 py-3">Fuel type</th>
              <th className="px-4 py-3">
                Avg. replacement cost
                <br />
                (supply only)
              </th>
              <th className="px-4 py-3">Typical MPG / range</th>
              <th className="px-4 py-3">Common brand-wide issues</th>
              <th className="px-4 py-3">Best for</th>
            </tr>
          </thead>
          <tbody>
            {section.items.map((item, index) => {
              const tone = fuelTone(item.title);
              const issues = tableIssues(item);
              return (
                <tr
                  key={`${item.title}-${index}`}
                  className="border-t border-[#e3edf4] align-middle"
                >
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[20px] ${tone.iconBg} ${tone.icon}`}
                      >
                        {iconFor(item.title)}
                      </span>
                      <span className="font-extrabold">
                        {fuelLabel(item.title)}
                      </span>
                    </div>
                  </td>
                  <td
                    className={`px-4 py-3 align-middle font-extrabold ${tone.icon}`}
                  >
                    {legacyPrice(item)}
                  </td>
                  <td className="px-4 py-3 align-middle font-extrabold">
                    {tableRange(item)}
                  </td>
                  <td className="px-4 py-3 align-middle leading-[1.5]">
                    <div className="max-h-[96px] overflow-y-auto pr-1 [scrollbar-color:#cbd5e1_#f3f4f6] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-[#f3f4f6] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#cbd5e1]">
                      <ul className="space-y-1 pl-1">
                        {issues.map((issue, issueIndex) => (
                          <li
                            key={`${issue}-${issueIndex}`}
                            className="flex items-start gap-2"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-0.5 shrink-0 text-[18px] font-black leading-[1]"
                            >
                              •
                            </span>
                            <span className="min-w-0">{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle leading-[1.5]">
                    {tableBestFor(item)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InformationBlocks() {
  const labourText =
    "Hybrid and electric vehicles may require specialist safety training. Always ensure the quote includes labour and safety checks.";
  const premiumText =
    "High-output models command a premium due to specialist components, lower supply volumes and more complex fitting.";
  const runningText =
    "Diesel can suit motorway mileage, petrol often suits shorter trips, and hybrid or electric value depends on charging habits.";

  return (
    <div className="mt-4 grid gap-3 rounded-xl border border-[#e0eaf2] bg-white p-4 shadow-[0_6px_18px_rgba(19,92,145,0.05)] md:grid-cols-3">
      <div className="flex gap-3 border-b border-[#e3edf4] pb-3 md:border-b-0 md:border-r md:pb-0 md:pr-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0b2c83] text-[18px] text-white">
          <FaTools />
        </span>
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.07em] text-[#0b2c83]">
            Labour / installation notes
          </p>
          <p className="mt-1 text-[13px] leading-[1.5] text-[#526a87]">
            {normalize(labourText)}
          </p>
        </div>
      </div>
      <div className="flex gap-3 border-b border-[#e3edf4] pb-3 md:border-b-0 md:border-r md:pb-0 md:pr-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0b2c83] text-[18px] font-black text-white">
          <MdStars />
        </span>
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.07em] text-[#0b2c83]">
            Performance / model premium
          </p>
          <p className="mt-1 text-[13px] leading-[1.5] text-[#526a87]">
            {normalize(premiumText)}
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0b2c83] text-[18px] text-white">
          <IoStatsChart />
        </span>
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.07em] text-[#0b2c83]">
            Running cost comparison
          </p>
          <p className="mt-1 text-[13px] leading-[1.5] text-[#526a87]">
            {normalize(runningText)}
          </p>
        </div>
      </div>
    </div>
  );
}

function detailModelValues(item: FuelItem) {
  return unique([...(item.typicalModels ?? []), ...(item.foundIn ?? [])]);
}

function detailIssueValues(item: FuelItem) {
  return legacyIssues(item);
}

function isNegative(value: string) {
  return /not recommended|better served|don't drive|do not drive|without .*access|would benefit more|low-mileage users|high-mileage users who would/i.test(
    value,
  );
}

function DetailDisclosure({
  label,
  kind,
  values,
  open,
  onToggle,
  tone,
}: {
  label: string;
  kind: "check" | "mpg" | "issue" | "model" | "cost" | "choice";
  values: string[];
  open: boolean;
  onToggle: () => void;
  tone: ReturnType<typeof fuelTone>;
}) {
  return (
    <div
      className={`overflow-hidden rounded-lg border ${open ? tone.border : "border-[#dbe6ef]"} bg-white`}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex min-h-[56px] w-full items-center justify-between gap-3 px-3 py-3 text-left text-[13px] font-extrabold text-[#12345f]"
      >
        <span>{label}</span>
        {open ? (
          <FiChevronUp className={tone.icon} />
        ) : (
          <FiChevronDown className={tone.icon} />
        )}
      </button>
      {open ? (
        <div className="border-t border-[#e3edf4] px-3 pb-3 pt-3 text-[13px] leading-[1.55] text-[#526a87]">
          {kind === "mpg" ? (
            <div className="space-y-2">
              {values.map((value, index) => (
                <div
                  key={`${value}-${index}`}
                  className="flex items-center gap-2 rounded-md border border-[#e3edf4] px-2.5 py-2"
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${index === 0 ? "bg-[#15803d]" : index === values.length - 1 ? "bg-[#dc2626]" : "bg-[#2563eb]"}`}
                  />
                  <span>{value}</span>
                </div>
              ))}
            </div>
          ) : kind === "cost" ? (
            <div className="divide-y divide-[#e3edf4]">
              {values.map((value, index) => (
                <div
                  key={`${value}-${index}`}
                  className="flex items-start justify-between gap-4 py-2"
                >
                  <span>{normalize(value).split(":")[0]}</span>
                  <strong className={`text-right ${tone.icon}`}>
                    {normalize(value).includes(":")
                      ? normalize(value).split(":").slice(1).join(":").trim()
                      : normalize(value)}
                  </strong>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-2">
              {values.map((value, index) => (
                <li key={`${value}-${index}`} className="flex gap-2">
                  <span
                    className={`mt-0.5 shrink-0 font-black ${kind === "issue" || (kind === "choice" && isNegative(value)) ? "text-[#dc2626]" : tone.icon}`}
                  >
                    {kind === "issue" ||
                    (kind === "choice" && isNegative(value))
                      ? "!"
                      : "✓"}
                  </span>
                  <span>{normalize(value)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}

function warrantyCopy(data: BrandPageData) {
  const source = data.sections.trustCta.intro ?? "";
  const match = source.match(/minimum\s+[^.]+?warranty/i)?.[0];
  if (match) return `${match.charAt(0).toUpperCase()}${match.slice(1)}`;
  return (
    data.sections.hero.trustBadges.find((badge) => /warranty/i.test(badge)) ||
    "12-Month Warranty"
  );
}

function RegistrationWarrantyBox({ data }: Props) {
  const [registration, setRegistration] = useState("");
  const hero = data.sections.hero;
  const fuelSection = data.sections.fuelTypes;

  function submitRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.dispatchEvent(
      new CustomEvent("engine-market:open-quote", {
        detail: {
          regNumber: registration.trim(),
          source: "brand-fuel-types-registration",
        },
      }),
    );
  }

  return (
    <div className="mt-5 grid items-center gap-5 rounded-2xl border border-[#1b8ed9]/70 bg-[linear-gradient(135deg,#061a33,#07316f)] p-5 text-white lg:grid-cols-[1fr_330px_1fr] lg:px-7">
      <div className="flex items-center gap-2 md:gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/30 text-white md:h-14 md:w-14">
          <FaShieldAlt className="text-[19px] md:text-[27px]" />
        </span>
        <div>
          <p className="text-[12px] font-black uppercase md:text-[16px]">
            Not sure which fuel type your {data.brand.name} has?
          </p>
          <p className="mt-1 text-[11px] leading-[1.5] text-white/80 md:text-[13px]">
            Enter your registration to identify your model, engine code and
            compatible replacement options.
          </p>
        </div>
      </div>
      <form
        onSubmit={submitRegistration}
        className="grid rounded-[9px] bg-white/10 p-3 text-center ring-1 ring-white/20"
      >
        <label
          htmlFor="brand-fuel-registration"
          className="text-[11px] font-black uppercase tracking-[0.08em]"
        >
          Enter your registration
        </label>
        <div className="mt-2 flex h-[46px] overflow-hidden rounded-[7px] border-2 border-[#102442] bg-white">
          <span className="flex w-[42px] shrink-0 items-center justify-center border-r-2 border-[#102442] bg-[#003399] text-[11px] font-black text-[#ffdd00]">
            UK
          </span>
          <input
            id="brand-fuel-registration"
            type="text"
            value={registration}
            onChange={(event) =>
              setRegistration(event.currentTarget.value.toUpperCase())
            }
            placeholder={"AB12 CDE"}
            maxLength={8}
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent px-3 text-center text-[17px] font-black uppercase tracking-[0.08em] text-[#18304f] outline-none placeholder:text-[#9aa6b5]"
          />
        </div>
        <button
          type="submit"
          className="mt-2 inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[7px] border border-[#15803d] bg-[#15803d] px-4 text-[13px] font-extrabold text-white"
        >
          {fuelSection.ui?.closingButtonText || "Find My Engine"}
          <span className="text-[17px]">→</span>
        </button>
      </form>
      <div className="flex items-center gap-2 md:gap-4 lg:justify-end">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border-2 border-[#f5c542] text-[14px] font-black text-[#f5c542] md:h-14 md:w-14 md:rounded-[14px] md:text-[18px]">
          12
        </span>
        <p className="text-[12px] font-black uppercase md:text-[16px]">
          {warrantyCopy(data)}
        </p>
      </div>
    </div>
  );
}

function FuelDetailPanel({
  item,
  brandName,
  onClose,
}: {
  item: FuelItem;
  brandName: string;
  onClose: () => void;
}) {
  const tone = fuelTone(item.title);
  const [openDetail, setOpenDetail] = useState<DetailKey | null>(null);
  const modelValues = detailModelValues(item);
  const issueValues = detailIssueValues(item);
  const headingTitle = `${normalize(brandName)} ${normalize(item.title)}`;
  const headingSubtitle = normalize(item.descriptor || item.description).split(
    /[.!?]/,
  )[0];
  const choiceValues = (item.importantNotes ?? []).filter(
    (value) => !/^typical searches:/i.test(value),
  );
  const queryValues = searchQueries(item);
  const detailItems: Array<{
    key: DetailKey;
    label: string;
    kind: "check" | "mpg" | "issue" | "model" | "cost" | "choice";
    values: string[];
  }> = [
    {
      key: "how",
      label: `How ${brandName} ${fuelLabel(item.title)} Engines Work`,
      kind: "check",
      values: [item.description],
    },
    {
      key: "mpg",
      label: "Real-World MPG (Brand-Wide)",
      kind: "mpg",
      values: [
        `${legacyMpg(item)} is typical, depending on model, usage, maintenance and engine code.`,
      ],
    },
    {
      key: "issues",
      label: `Common ${brandName} ${fuelLabel(item.title)} Issues (Brand-Wide)`,
      kind: "issue",
      values: issueValues,
    },
    {
      key: "models",
      label: `Which ${brandName} Models Use ${fuelLabel(item.title)} Engines (2000–2026 UK Focus)`,
      kind: "model",
      values: modelValues.length
        ? modelValues
        : ["Model availability varies by year and trim."],
    },
    {
      key: "cost",
      label: `Average ${fuelLabel(item.title)} Replacement Cost (Supply Only)`,
      kind: "cost",
      values: [
        `${legacyPrice(item)} supply-only. Fitting varies by vehicle and workshop location.`,
      ],
    },
    {
      key: "choice",
      label: `Who Should Choose ${fuelLabel(item.title)}?`,
      kind: "choice",
      values: choiceValues.length ? choiceValues : [legacyBestFor(item)],
    },
  ];

  return (
    <article
      id="brand-fuel-detail-panel"
      className={`relative mt-1 rounded-xl border-2 p-4 shadow-[0_10px_30px_rgba(19,92,145,0.09)] sm:p-5 ${tone.panel}`}
    >
      <div className="relative grid gap-5 border-b border-current/10 pb-5 lg:grid-cols-[minmax(0,1fr)_190px_330px] lg:items-start">
        <div className="min-w-0 pr-10 lg:pr-0">
          <h3
            className={`text-[21px] font-extrabold leading-[1.15] ${tone.icon}`}
          >
            <span className="block font-extrabold">{headingTitle}</span>
            <span className="mt-1 block text-[16px] font-semibold leading-[1.35]">
              {headingSubtitle}
            </span>
          </h3>
          <p className="mt-3 text-[14px] leading-[1.6] text-[#526a87]">
            {normalize(item.description)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[13px] text-[#526a87] lg:grid-cols-1 lg:gap-3">
          <div className="flex gap-2">
            <span className={tone.icon}>⚡</span>
            <span>{fuelLabel(item.title)}</span>
          </div>
          <div className="flex gap-2">
            <span className={tone.icon}>
              <PiEngineBold />
            </span>
            <span>110 - 170 hp</span>
          </div>
          <div className="flex gap-2">
            <span className={tone.icon}>£</span>
            <span>{legacyPrice(item)}</span>
          </div>
          <div className="flex gap-2">
            <span className={tone.icon}>
              <RiCarLine />
            </span>
            <span>UK supply options</span>
          </div>
          <div className="flex gap-2">
            <span className={tone.icon}>◷</span>
            <span>2008 - present</span>
          </div>
        </div>
        <div className="flex min-h-[220px] items-center justify-center rounded-lg bg-white/70 lg:min-h-[160px]">
          <Image
            src={artworkFor(item.title)}
            alt={`${brandName} ${cardTitle(item.title)} engine`}
            width={360}
            height={250}
            className="h-[210px] w-full object-contain mix-blend-multiply lg:h-[150px]"
          />
        </div>
        <button
          type="button"
          aria-label="Close fuel type details"
          onClick={onClose}
          className={`absolute right-0 top-0 grid h-8 w-8 shrink-0 place-items-center rounded-full ${tone.panelHeader}`}
        >
          <FiChevronUp />
        </button>
      </div>

      <div className="mt-5 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {detailItems.map((detail) => (
          <DetailDisclosure
            key={detail.key}
            label={detail.label}
            kind={detail.kind}
            values={detail.values}
            open={openDetail === detail.key}
            onToggle={() =>
              setOpenDetail((current) =>
                current === detail.key ? null : detail.key,
              )
            }
            tone={tone}
          />
        ))}
      </div>

      {queryValues.length ? (
        <div className="mt-4 rounded-lg border border-current/10 bg-white/75 p-3">
          <p
            className={`flex items-center gap-2 text-[13px] font-extrabold ${tone.icon}`}
          >
            <FaSearch /> Typical {fuelLabel(item.title)} Search Queries
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {queryValues.map((query, index) => (
              <span
                key={`${query}-${index}`}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-bold ${tone.badge}`}
              >
                {query}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        <a
          href="#quote-form"
          data-quote-context={item.title}
          data-quote-source="brand-fuel-types-detail"
          className={`inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg px-4 text-center text-[12px] font-extrabold text-white ${tone.button}`}
        >
          {cleanCta(item.cta)} <span>→</span>
        </a>
        <a
          href="#quote-form"
          data-quote-context={queryRegistrationText(item)}
          data-quote-source="brand-fuel-types-registration"
          className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg border border-[#b8d7cb] bg-white px-4 text-center text-[12px] font-extrabold text-[#087951]"
        >
          {queryRegistrationText(item) ||
            `Not sure which ${fuelLabel(item.title).toLowerCase()} you have? Enter your registration number`}{" "}
          <span>→</span>
        </a>
      </div>
    </article>
  );
}

export default function NewDocBrandFuelTypes({ data }: Props) {
  const section = data.sections.fuelTypes;
  const fuelItems = completeFuelItems(section.items);
  const heading = splitHeading(section.h2);
  const headingLines = section.headingLines?.length ? section.headingLines : [];
  const brandImages = data.sections.models.cards
    .map((card) => card.image)
    .filter(Boolean);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mobileCardIndex, setMobileCardIndex] = useState(0);
  const [fuelColumns, setFuelColumns] = useState(2);
  const mobileCardsRef = useRef<HTMLDivElement | null>(null);
  const activeItem = activeIndex === null ? null : fuelItems[activeIndex];

  useEffect(() => {
    const syncFuelColumns = () => {
      setFuelColumns(window.innerWidth >= 1280 ? 4 : 2);
    };

    syncFuelColumns();
    window.addEventListener("resize", syncFuelColumns);
    return () => window.removeEventListener("resize", syncFuelColumns);
  }, []);

  const syncMobileCardIndex = (container: HTMLDivElement) => {
    const cards = Array.from(container.children) as HTMLElement[];
    if (!cards.length) return;

    const closestIndex = cards.reduce(
      (closest, card, index) =>
        Math.abs(card.offsetLeft - container.scrollLeft) <
        Math.abs(cards[closest].offsetLeft - container.scrollLeft)
          ? index
          : closest,
      0,
    );
    setMobileCardIndex(closestIndex);
  };

  const goToMobileCard = (index: number) => {
    const container = mobileCardsRef.current;
    const card = container?.children[index] as HTMLElement | undefined;
    if (!container || !card) return;

    setMobileCardIndex(index);
    container.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  };

  return (
    <section
      id="brand-fuel-types"
      className="relative overflow-hidden bg-white px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-7"
    >
      <ModelMobileAccordion
        title={normalize(headingLines[0] ?? heading.primary)}
        icon={<BsFuelPumpDiesel className="h-5 w-5" aria-hidden="true" />}
        buttonClassName="!-my-[14px]"
      >
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_0.85fr]">
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
                className="mt-5 !text-[40px] font-extrabold leading-[1.03] tracking-normal !tracking-[-0.02em] text-[#09264e] sm:!text-[41px] lg:!text-[46px]"
              >
                {headingLines.length > 1 ? (
                  headingLines.map((line, index) => (
                    <span
                      key={`${line}-${index}`}
                      className={`block ${index === headingLines.length - 1 ? "text-[#15803d]" : ""}`}
                    >
                      {normalize(line)}
                    </span>
                  ))
                ) : (
                  <>
                    <span>{heading.primary}</span>
                    {heading.accent ? (
                      <span className="text-[#15803d]"> {heading.accent}</span>
                    ) : null}
                  </>
                )}
              </h2>
              <p className="mt-4 max-w-[760px] text-[14px] leading-[1.6] text-[#526a87] lg:text-[15px]">
                {normalize(section.intro)}
              </p>
            </div>
            <div className="flex min-h-[185px] items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_center,#f2f7fb_0%,#ffffff_70%)]">
              <Image
                src={artworkFor(fuelItems[0]?.title ?? "Diesel")}
                alt={`${data.brand.name} fuel type engine`}
                width={390}
                height={220}
                className="h-[190px] w-full max-w-[390px] object-contain mix-blend-multiply"
                priority
              />
            </div>
          </div>

          <ComparisonTable
            section={{ ...section, items: fuelItems }}
            brandName={data.brand.name}
          />
          <InformationBlocks />

          <div
            ref={mobileCardsRef}
            onScroll={(event) => syncMobileCardIndex(event.currentTarget)}
            className="mt-6 flex snap-x snap-mandatory items-start gap-3 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-4"
            style={{ touchAction: "pan-x pan-y" }}
          >
            {fuelItems.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="w-full min-w-0 shrink-0 snap-start md:w-auto md:shrink"
              >
                <FuelCard
                  item={item}
                  brandName={data.brand.name}
                  brandImages={brandImages}
                  active={activeIndex === index}
                  onToggle={() =>
                    setActiveIndex((current) =>
                      current === index ? null : index,
                    )
                  }
                />
                {activeIndex === index ? (
                  <div className="relative lg:hidden">
                    <span
                      className={`pointer-events-none absolute -top-2 left-1/2 z-10 h-4 w-4 -translate-x-1/2 rotate-45 border-l-2 border-t-2 ${fuelTone(item.title).border} ${fuelTone(item.title).panel}`}
                    />
                    <div className="mt-4 pr-1">
                      <FuelDetailPanel
                        key={`mobile-${item.title}`}
                        item={item}
                        brandName={data.brand.name}
                        onClose={() => setActiveIndex(null)}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {fuelItems.length > 1 ? (
            <div
              className="mt-1 flex items-center justify-center gap-2 md:hidden"
              aria-label="Fuel type cards"
            >
              {fuelItems.map((item, index) => (
                <button
                  key={`fuel-card-dot-${item.title}-${index}`}
                  type="button"
                  aria-label={`Show ${fuelLabel(item.title)} card`}
                  aria-current={mobileCardIndex === index ? "true" : undefined}
                  onClick={() => goToMobileCard(index)}
                  className="h-2.5 w-2.5 rounded-full border border-slate-300 transition"
                  style={{
                    backgroundColor:
                      mobileCardIndex === index
                        ? fuelTone(item.title).accent
                        : "#dbe4ec",
                  }}
                />
              ))}
            </div>
          ) : null}

          {activeItem ? (
            <div className="relative hidden lg:block">
              <span
                className={`pointer-events-none absolute -top-2 z-10 h-4 w-4 rotate-45 border-l-2 border-t-2 ${fuelTone(activeItem.title).border} ${fuelTone(activeItem.title).panel}`}
                style={{
                  left: `calc(${((((activeIndex ?? 0) % fuelColumns) + 0.5) / fuelColumns) * 100}% - 8px)`,
                }}
              />
              <div
                className="mt-4 lg:max-h-none lg:overflow-visible"
                style={{
                  scrollbarColor: "#b9cbd7 transparent",
                  scrollbarWidth: "thin",
                }}
              >
                <FuelDetailPanel
                  key={`desktop-${activeItem.title}`}
                  item={activeItem}
                  brandName={data.brand.name}
                  onClose={() => setActiveIndex(null)}
                />
              </div>
            </div>
          ) : null}

          <RegistrationWarrantyBox data={data} />
        </div>
      </ModelMobileAccordion>
    </section>
  );
}
