"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { carSeries } from "@/data/brands_Models";
import styles from "./SharedRegistrationPanel.module.css";

type SearchMode = "registration" | "manual";
type VehicleRegistrationData = Record<string, string> & { registrationNumber: string };

const makeOptions = Object.keys(carSeries).sort();
const yearOptions = Array.from({ length: 37 }, (_, index) => String(2026 - index));

const statItems = [
  { src: "/Home/enginelogo.webp", alt: "Engine Codes", value: "8,000+", label: "Engine Codes" },
  { src: "/Home/carlogo.webp", alt: "Car Brands", value: "40+", label: "Car Brands" },
  { src: "/Home/verifiedlogo.webp", alt: "Free No Obligation", value: "100%", label: "Free · No Obligation" },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 20 20">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="m5 11 1.8-5.4A2 2 0 0 1 8.7 4h6.6a2 2 0 0 1 1.9 1.6L19 11" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <rect height="7" rx="2" stroke="currentColor" strokeWidth="1.5" width="18" x="3" y="11" />
      <circle cx="7.5" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16.5" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 18H3v-2M18.5 18H21v-2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function ManualSearchIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function UkFlag() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-5 shrink-0 rounded-[2px]" viewBox="0 0 20 14">
      <rect fill="#012169" height="14" width="20" />
      <path d="M0 0 20 14M20 0 0 14" stroke="#fff" strokeWidth="3" />
      <path d="M0 0 20 14M20 0 0 14" stroke="#c8102e" strokeWidth="1.8" />
      <path d="M10 0v14M0 7h20" stroke="#fff" strokeWidth="4.5" />
      <path d="M10 0v14M0 7h20" stroke="#c8102e" strokeWidth="2.8" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24">
      <path d="M12 3 20 6v5.6c0 4.5-3.05 7.58-8 9.4-4.95-1.82-8-4.9-8-9.4V6l8-3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      <path d="m8.5 12 2.15 2.15L15.8 9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

export type SharedRegistrationPanelVariant = "default" | "hero";

export default function SharedRegistrationPanel({ variant = "default", idPrefix = "shared-registration" }: { variant?: SharedRegistrationPanelVariant; idPrefix?: string }) {
  const isHero = variant === "hero";
  const router = useRouter();
  const [mode, setMode] = useState<SearchMode>("registration");
  const [registration, setRegistration] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [engineCode, setEngineCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const modelOptions = useMemo(() => make ? ((carSeries as Record<string, string[]>)[make] ?? []) : [], [make]);

  function goToForm(params: URLSearchParams) {
    params.set("sourceLabel", "static-page-quote-search");
    params.set("sourcePage", window.location.href);
    router.push(`/form?${params.toString()}`);
  }

  async function submitRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = registration.trim().toUpperCase();
    if (!value) {
      setError("Please enter your registration number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/vehicle-registration?registrationNumber=${encodeURIComponent(value)}`);
      const payload = (await response.json()) as { vehicle?: VehicleRegistrationData; error?: string };
      if (!response.ok || !payload.vehicle) throw new Error(payload.error || "We could not find vehicle details for that registration.");
      const params = new URLSearchParams({ searchMode: "registration" });
      Object.entries(payload.vehicle).forEach(([key, field]) => { if (field) params.set(key, field); });
      goToForm(params);
    } catch (lookupError) {
      setError(lookupError instanceof Error ? lookupError.message : "Vehicle lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  function submitManual(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!make || !model || !year) {
      setError("Select a make, model and year to continue.");
      return;
    }
    setError("");
    const params = new URLSearchParams({ searchMode: "manual", make, model, year });
    if (engineCode.trim()) params.set("engineCode", engineCode.trim().toUpperCase());
    goToForm(params);
  }

  if (isHero) {
    return (
      <aside className={`${styles.heroPanel} rounded-[1.15rem] border border-white/55 bg-[linear-gradient(145deg,rgba(105,167,209,0.48),rgba(10,43,75,0.78))] px-5 py-4 text-center shadow-[0_14px_34px_rgba(2,20,44,0.28)] backdrop-blur-xl sm:px-6`} id="quote-form" aria-label="Get your free engine quotes">
        <h2 className="!text-[18px] !font-extrabold !leading-[1.05] tracking-[-0.03em] text-white sm:!text-[20px]">Get Your Free Engine Quotes</h2>
        <p className="mt-1 text-[13px] text-white/90 sm:text-sm">Instant comparison from UK-vetted engine specialists</p>

        <form className="mt-4" onSubmit={submitRegistration} aria-label="Search by registration">
          <div className="flex items-center gap-3 rounded-xl border-4 border-[#102442] bg-[#ffdb00] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] focus-within:ring-2 focus-within:ring-white/80">
            <span className="flex shrink-0 items-center gap-1.5 text-sm font-extrabold text-[#0d1b2e]"><UkFlag /> UK</span>
            <span aria-hidden="true" className="h-5 w-px bg-[#102442]/30" />
            <input aria-label="UK vehicle registration" autoCapitalize="characters" autoComplete="off" className="min-w-0 flex-1 bg-transparent text-center text-lg font-black tracking-[0.07em] text-[#10151c] outline-none placeholder:tracking-[0.02em] placeholder:text-[#10151c] placeholder:opacity-90 sm:text-[22px]" maxLength={8} name="registrationNumber" onChange={(event) => setRegistration(event.currentTarget.value.toUpperCase())} placeholder="REG HERE" spellCheck={false} type="text" value={registration} />
          </div>
          <button className="mt-3 flex min-h-11 w-full items-center justify-center gap-3 rounded-xl bg-[#078d4a] px-5 text-[14px] font-extrabold text-white shadow-[0_7px_18px_rgba(0,25,16,0.34)] transition hover:-translate-y-0.5 hover:bg-[#05703d] disabled:cursor-wait disabled:opacity-60" disabled={loading} type="submit">
            <span>{loading ? "Checking Registration..." : "Get Free Engine Quotes"}</span>
            <ArrowIcon />
          </button>
        </form>
        {error ? <p className="mt-3 text-sm font-semibold text-red-200" role="alert">{error}</p> : null}

        <p className="mt-3 flex items-center justify-center gap-2 text-[11px] leading-4 text-white/90 sm:text-xs">
          <ShieldIcon />
          <span>Your details are secure. No spam - genuine quotes from vetted UK engine specialists only.</span>
        </p>
      </aside>
    );
  }

  return (
    <aside className={`rounded-2xl border p-2 shadow-[0_18px_50px_rgba(10,41,82,0.14)] ${isHero ? "border-white/25 bg-[linear-gradient(145deg,rgba(106,174,218,.3),rgba(7,32,66,.68))] backdrop-blur-xl" : "border-slate-200 bg-white"}`} aria-label="Get your free engine quotes">
      <div className={`flex gap-1 rounded-xl p-1 ${isHero ? "bg-black/20" : "bg-slate-100"}`}>
        <button
          aria-controls={`${idPrefix}-registration`}
          aria-pressed={mode === "registration"}
          className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-center text-xs font-bold transition sm:text-sm ${mode === "registration" ? "border border-white/20 bg-white text-[#0a2952] shadow-sm" : isHero ? "text-white/70 hover:text-white" : "text-slate-400 hover:text-slate-600"}`}
          onClick={() => setMode("registration")}
          type="button"
        >
          <CarIcon />
          <span>Search by Registration</span>
        </button>
        <button
          aria-controls={`${idPrefix}-manual`}
          aria-pressed={mode === "manual"}
          className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-center text-xs font-bold transition sm:text-sm ${mode === "manual" ? "border border-white/20 bg-white text-[#0a2952] shadow-sm" : isHero ? "text-white/70 hover:text-white" : "text-slate-400 hover:text-slate-600"}`}
          onClick={() => setMode("manual")}
          type="button"
        >
          <ManualSearchIcon />
          <span>Search Manually</span>
        </button>
      </div>

      {mode === "registration" ? (
        <div className="px-3 pb-3 pt-5 text-center sm:px-6 sm:pb-5" id={`${idPrefix}-registration`}>
          <h2 className={`text-lg font-extrabold tracking-tight ${isHero ? "text-white" : "text-[#0a2952]"}`}>Get Your Free Engine Quotes</h2>
          <p className={`mt-1 text-sm ${isHero ? "text-white/80" : "text-[#0a2952]"}`}>Instant comparison from UK-vetted engine specialists</p>

          <form className="mt-5" onSubmit={submitRegistration} aria-label="Search by registration">
            <div className={`flex items-center gap-3 rounded-lg px-3 py-2.5 focus-within:border-[#15803d] focus-within:ring-2 focus-within:ring-emerald-100 ${isHero ? "border-4 border-[#102442] bg-[#ffdd00]" : "border border-slate-200 bg-slate-50"}`}>
              <span className="flex shrink-0 items-center gap-1.5 text-xs font-extrabold text-[#0d1b2e]"><UkFlag /> UK</span>
              <span aria-hidden="true" className={`h-4 w-px ${isHero ? "bg-[#102442]/30" : "bg-slate-200"}`} />
              <input aria-label="UK vehicle registration" autoCapitalize="characters" autoComplete="off" className={`min-w-0 flex-1 bg-transparent text-sm font-bold tracking-[0.06em] outline-none placeholder:font-normal placeholder:tracking-normal ${isHero ? "text-[#10151c] placeholder:text-[#10151c] placeholder:opacity-80" : "text-[#0d1b2e] placeholder:text-slate-400"}`} maxLength={8} name="registrationNumber" onChange={(event) => setRegistration(event.currentTarget.value.toUpperCase())} placeholder={isHero ? "REG HERE" : "Enter your reg - e.g. AB12 CDE"} spellCheck={false} type="text" value={registration} />
            </div>
            <button className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#078d4a] px-5 text-sm font-bold text-white shadow-[0_6px_18px_rgba(7,141,74,0.28)] transition hover:-translate-y-0.5 hover:bg-[#05703d] disabled:cursor-wait disabled:opacity-60" disabled={loading} type="submit">
              <span>{loading ? "Checking Registration..." : "Get Free Engine Quotes"}</span>
              <ArrowIcon />
            </button>
          </form>
          {error ? <p className="mt-3 text-sm font-semibold text-red-600" role="alert">{error}</p> : null}

          <p className={`mt-4 flex items-center justify-center gap-2 text-xs leading-5 sm:text-sm ${isHero ? "text-white/85" : "text-[#0a2952]"}`}>
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Your details are secure. No spam - genuine quotes from vetted UK engine specialists only.</span>
          </p>

          <div className={`mt-4 grid grid-cols-3 gap-2 border-t pt-4 text-center ${isHero ? "border-white/20" : "border-slate-200"}`}>
            {statItems.map((item) => (
              <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-center sm:gap-1.5" key={item.label}>
                <Image alt={item.alt} className="h-7 w-7 object-contain" height={32} src={item.src} width={32} />
                <span className="min-w-0">
                  <strong className={`block text-sm leading-none sm:text-base ${isHero ? "text-white" : "text-[#0d1b2e]"}`}>{item.value}</strong>
                  <small className={`mt-1 block text-[10px] leading-tight ${isHero ? "text-white/65" : "text-slate-500"}`}>{item.label}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-3 pb-3 pt-5 sm:px-6 sm:pb-5" id={`${idPrefix}-manual`}>
          <form className="space-y-3" onSubmit={submitManual} aria-label="Search manually">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={`grid gap-1.5 text-left text-xs font-bold ${isHero ? "text-white" : "text-[#0d1b2e]"}`} htmlFor={`${idPrefix}-make`}>Make
                <select className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-normal text-[#0d1b2e] outline-none focus:border-[#15803d] focus:ring-2 focus:ring-emerald-100" id={`${idPrefix}-make`} name="make" onChange={(event) => { setMake(event.currentTarget.value); setModel(""); }} value={make}>
                  <option value="">Select Make</option>
                  {makeOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                </select>
              </label>
              <label className={`grid gap-1.5 text-left text-xs font-bold ${isHero ? "text-white" : "text-[#0d1b2e]"}`} htmlFor={`${idPrefix}-model`}>Model
                <select className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-normal text-[#0d1b2e] outline-none focus:border-[#15803d] focus:ring-2 focus:ring-emerald-100" id={`${idPrefix}-model`} name="model" onChange={(event) => setModel(event.currentTarget.value)} value={model}>
                  <option value="">Select a model</option>
                  {modelOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                </select>
              </label>
              <label className={`grid gap-1.5 text-left text-xs font-bold ${isHero ? "text-white" : "text-[#0d1b2e]"}`} htmlFor={`${idPrefix}-year`}>Year
                <select className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-normal text-[#0d1b2e] outline-none focus:border-[#15803d] focus:ring-2 focus:ring-emerald-100" id={`${idPrefix}-year`} name="year" onChange={(event) => setYear(event.currentTarget.value)} value={year}>
                  <option value="">Select Model First</option>
                  {yearOptions.map((option) => <option value={option} key={option}>{option}</option>)}
                </select>
              </label>
              <label className={`grid gap-1.5 text-left text-xs font-bold ${isHero ? "text-white" : "text-[#0d1b2e]"}`} htmlFor={`${idPrefix}-engine-code`}>Engine Code
                <input className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-normal uppercase text-[#0d1b2e] outline-none placeholder:normal-case placeholder:text-slate-400 focus:border-[#15803d] focus:ring-2 focus:ring-emerald-100" id={`${idPrefix}-engine-code`} name="engineCode" onChange={(event) => setEngineCode(event.currentTarget.value.toUpperCase())} placeholder="Enter engine code" spellCheck={false} type="text" value={engineCode} />
              </label>
            </div>
            <button className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#078d4a] px-5 text-sm font-bold text-white shadow-[0_6px_18px_rgba(7,141,74,0.28)] transition hover:-translate-y-0.5 hover:bg-[#05703d]" type="submit">
              <span>Get Free Engine Quotes</span>
              <ArrowIcon />
            </button>
          </form>
          {error ? <p className="mt-3 text-sm font-semibold text-red-600" role="alert">{error}</p> : null}
        </div>
      )}
    </aside>
  );
}
