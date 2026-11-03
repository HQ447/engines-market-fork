"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import {
  costLookupTable,
  engineConditions,
  failureTypes,
  formatCurrency,
  formatVehicleValueStep,
  getVerdict,
  staticCostTableRows,
  vehicleAgeOptions,
  vehicleValueSteps,
  type EngineConditionId,
  type FailureTypeId,
  type VehicleAgeId,
  type VerdictId,
} from "@/lib/homeDecisionHubData";

type StepId = 1 | 2 | 3;

// Store Step 1 card image URLs in a centralized object
const failureImages: Record<string, string> = {
  "timing-chain": "/Home/CalculatorIcons/01.webp",
  "seized-engine": "/Home/CalculatorIcons/02.webp",
  "head-gasket": "/Home/CalculatorIcons/03.webp",
  "turbo-damage": "/Home/CalculatorIcons/04.webp",
  "crankshaft-bearing": "/Home/CalculatorIcons/05.webp",
  "oil-pump": "/Home/CalculatorIcons/06.webp",
};

function TickIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="m5 12 4 4 10-10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CircleTickIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="m7.5 12 3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path d="M12 4v16M7 7h10M5 7l-3 5h6L5 7Zm14 0-3 5h6l-3-5Z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LoopIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path d="M4 12a8 8 0 0 1 14-5M20 12a8 8 0 0 1-14 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 3v4h-4M6 21v-4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path d="M12 4 3 20h18L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 9v5M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function getVerdictMeta(verdict: VerdictId) {
  if (verdict === "A") {
    return {
      icon: <CircleTickIcon />,
      accent: "text-[#22c55e]",
      bg: "bg-[#15803d]/10",
      border: "border-[#15803d]/30",
      title: "Replacement is likely worth it for your vehicle.",
      subtitle: "Based on your answers, engine replacement makes financial sense.",
    };
  }

  if (verdict === "B") {
    return {
      icon: <ScaleIcon />,
      accent: "text-[#fbbf24]",
      bg: "bg-[#fbbf24]/10",
      border: "border-[#fbbf24]/30",
      title: "Engine replacement is borderline. Get real quotes before deciding.",
      subtitle: "Real specialist quotes could change this picture significantly.",
    };
  }

  if (verdict === "C") {
    return {
      icon: <LoopIcon />,
      accent: "text-[#60a5fa]",
      bg: "bg-[#3b82f6]/10",
      border: "border-[#3b82f6]/30",
      title: "You have two strong options. Here is the comparison.",
      subtitle: "Your vehicle value supports both replacement and buying another used car.",
    };
  }

  return {
    icon: <WarningIcon />,
    accent: "text-[#f87171]",
    bg: "bg-[#ef4444]/10",
    border: "border-[#ef4444]/30",
    title: "Replacement costs may exceed your vehicle's value.",
    subtitle: "Consider all options carefully - but low-cost used routes can still be worth checking.",
  };
}

function StepIndicator({ step }: { step: StepId }) {
  const steps = [
    { number: 1, label: "Failure Type" },
    { number: 2, label: "Your Vehicle" },
    { number: 3, label: "Engine Type" },
  ] as const;

  return (
    // 1. Added w-full to ensure it stretches to the edges of its parent container
    <div className="hidden w-full sm:flex">
      {steps.map((item, index) => {
        const done = step > item.number;
        const active = step === item.number;
        const isLast = index === steps.length - 1;

        return (
          // 2. flex-1 ensures each step takes up equal width (spanning full section)
          // items-center keeps the circle and label perfectly centered under each other
          <div
            key={item.number}
            className="relative flex flex-1 flex-col items-center"
          >
            {/* Circle */}
            <div
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-[12px] font-bold transition ${
                done || active
                  ? 'border-[#15803d] bg-[#15803d] text-white'
                  : 'border-[#2d3748] bg-[#1a2744] text-white/40'
              }`}
            >
              {done ? <TickIcon /> : item.number}
            </div>

            {/* Connecting Line */}
            {!isLast && (
              <div
                className={`absolute top-[15px] left-1/2 h-[2px] w-full ${
                  step > item.number ? 'bg-[#15803d]' : 'bg-[#2d3748]'
                }`}
              />
            )}

            {/* Label */}
            <span
              className={`mt-2 text-[11px] font-bold uppercase tracking-[0.08em] ${
                done || active ? 'text-[#22c55e]' : 'text-white/40'
              }`}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function MobileStepIndicator({ step }: { step: StepId }) {
  const steps = [
    { number: 1, label: "Failure" },
    { number: 2, label: "Vehicle" },
    { number: 3, label: "Engine" },
  ] as const;

  return (
    // 1. Added w-full to ensure it stretches to the edges of its parent container
    <div className="mb-4 w-full sm:hidden">
      <div className="flex w-full">
        {steps.map((item, index) => {
          const done = step > item.number;
          const active = step === item.number;
          const isLast = index === steps.length - 1;

          return (
            // 2. flex-1 ensures each step takes up equal width (spanning full section)
            <div
              key={item.number}
              className="relative flex flex-1 flex-col items-center"
            >
              {/* Circle */}
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-[12px] font-bold transition ${
                  done || active
                    ? "border-[#15803d] bg-[#15803d] text-white"
                    : "border-[#2d3748] bg-[#1a2744] text-white/40"
                }`}
              >
                {done ? <TickIcon /> : item.number}
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={`absolute top-[15px] left-1/2 h-[2px] w-full ${
                    step > item.number ? "bg-[#15803d]" : "bg-[#2d3748]"
                  }`}
                />
              )}

              {/* Label */}
              <span
                className={`mt-2 text-[10px] font-bold uppercase tracking-[0.08em] ${
                  done || active ? "text-[#22c55e]" : "text-white/40"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResultPreview() {
  return (
    <div className="hidden rounded-[18px] border border-white/5 bg-gradient-to-b from-[#1a2744] via-[#0f1d33] to-[#0a1929] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.18)] lg:block">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-[#22c55e]" />
        <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/60">Preview Result</span>
      </div>
      <h3 className="mt-5 font-['Manrope'] text-[15px] font-bold leading-[1.25] text-white" style={{ fontSize: "18px" }}>
        Replacement is likely <span className="text-[#22c55e]">worth it</span>
      </h3>
      <div className="mt-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">Typical Cost</p>
        <p className="mt-2 font-['Manrope'] text-[25px] font-black text-[#22c55e]">£2,200–5,500</p>
        <p className="mt-3 text-[13px] leading-[1.6] text-white/60">
          Compare against your car&apos;s current value and see whether replacement makes financial sense.
        </p>
      </div>
    </div>
  );
}

function VerdictScreen({
  failureType,
  carAge,
  carValue,
  engineCondition,
  onReset,
}: {
  failureType: FailureTypeId;
  carAge: VehicleAgeId;
  carValue: number;
  engineCondition: EngineConditionId;
  onReset: () => void;
}) {
  const verdictState = getVerdict(failureType, carAge, carValue, engineCondition);
  const failureLabel = failureTypes.find((item) => item.id === failureType)?.label ?? "";
  const conditionLabel = engineConditions.find((item) => item.id === engineCondition)?.label ?? "";
  const verdict = getVerdictMeta(verdictState.verdict);

  return (
    <div>
      {/* Verdict Banner */}
      <div className={`rounded-[16px] border p-2 sm:p-6 ${verdict.bg} ${verdict.border}`}>
        <div className={`flex items-start gap-3 ${verdict.accent}`}>
          {verdict.icon}
          <div>
            <p className="font-['Manrope'] text-[14px] sm:text-[24px] font-bold leading-[1.2] text-white">{verdict.title}</p>
            <p className="mt-2 text-[14px] leading-[1.6] text-white/70">{verdict.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Cost Breakdown Card */}
      <div className="mt-5 overflow-hidden rounded-[16px] border border-white/10 bg-[#112240]">
        <div className="border-b border-white/10 bg-[#0d1b2e] px-5 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">Your Estimated Cost Breakdown</p>
        </div>

        <div className="grid gap-2 sm:gap-3 p-2 sm:p-5 sm:grid-cols-2 sm:p-6">
          <div className="rounded-[12px] border border-[#15803d]/30 bg-[#15803d]/10 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/60">{failureLabel} - {conditionLabel}</p>
            <p className="mt-2 font-['Manrope'] text-[18px] sm:text-[26px] font-black text-[#22c55e]">
              {formatCurrency(verdictState.costs.low)} - {formatCurrency(verdictState.costs.high)}
            </p>
            <p className="mt-1 text-[12px] text-white/50">Typical cost supplied & fitted</p>
          </div>

          <div className="rounded-[12px] border border-white/10 bg-[#1a2744] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/60">Main Dealer Estimate</p>
            <p className="mt-2 font-['Manrope'] text-[18px] sm:text-[26px] font-black text-[#94a3b8] line-through">
              {formatCurrency(verdictState.costs.mdLow)} - {formatCurrency(verdictState.costs.mdHigh)}
            </p>
            <p className="mt-1 text-[12px] text-white/50">Typical main dealer pricing</p>
          </div>

          <div className="rounded-[12px] border border-white/10 bg-[#1a2744] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/60">Your Car&apos;s Estimated Value</p>
            <p className="mt-2 font-['Manrope'] text-[18px] sm:text-[24px] font-black text-white">{formatCurrency(carValue)}</p>
            <p className="mt-1 text-[12px] text-white/50">Before the engine failure</p>
          </div>

          <div className="rounded-[12px] border border-white/10 bg-[#1a2744] p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/60">Replacement as % of Car Value</p>
            <p className="mt-2 font-['Manrope'] text-[18px] sm:text-[24px] font-black text-white">{verdictState.replacementAsPercentOfCarValue}%</p>
            <p className="mt-1 text-[12px] text-white/50">EnginesMarket typical cost only</p>
          </div>
        </div>

        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <div className="rounded-[12px] border border-[#15803d]/30 bg-[#15803d]/10 px-4 py-3 text-[14px] font-semibold text-[#22c55e]">
            Potential saving via EnginesMarket: up to {verdictState.savingVsDealer}%
          </div>

          {verdictState.verdict === "C" ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[12px] border border-white/10 bg-[#1a2744] p-4">
                <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#22c55e]">Option 1 - Replace the Engine</p>
                <p className="mt-2 font-['Manrope'] text-[20px] font-black text-white">
                  {formatCurrency(verdictState.costs.low)} - {formatCurrency(verdictState.costs.high)}
                </p>
                <p className="mt-2 text-[13px] leading-[1.6] text-white/60">
                  Your car retains its value. Cheaper than buying another equivalent vehicle outright.
                </p>
              </div>
              <div className="rounded-[12px] border border-white/10 bg-[#1a2744] p-4">
                <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#60a5fa]">Option 2 - Buy a Replacement Car</p>
                <p className="mt-2 font-['Manrope'] text-[20px] font-black text-white">
                  {formatCurrency(Math.round(carValue * 1.1))} - {formatCurrency(Math.round(carValue * 1.4))}
                </p>
                <p className="mt-2 text-[13px] leading-[1.6] text-white/60">
                  Higher upfront cost. May be preferable if the rest of the vehicle is also near end of life.
                </p>
              </div>
            </div>
          ) : null}

          {verdictState.verdict === "D" ? (
            <div className="mt-4 rounded-[12px] border border-[#ef4444]/30 bg-[#ef4444]/10 p-4">
              <p className="text-[13px] font-semibold text-white">Options worth considering:</p>
              <ul className="mt-3 space-y-2 text-[13px] leading-[1.6] text-white/70">
                <li>Get quotes anyway - some low-mileage used engines can bring total costs under GBP 1,200.</li>
                <li>DVLA scrap value is typically around GBP 150-350 for an unrunning vehicle.</li>
                <li>Part-exchange as a non-runner can still be an option with some dealers.</li>
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#quote-form"
            data-quote-context={`Engine replacement calculator - ${failureLabel}`}
            data-quote-source="decision-hub-result-primary"
            className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#15803d] px-5 text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(21,128,61,0.35)] transition hover:bg-[#166534]"
          >
            <span>{verdictState.verdict === "B" ? "Compare Quotes & Decide With Real Prices" : verdictState.verdict === "D" ? "Get Quotes Anyway" : "Get Free Engine Replacement Quotes"}</span>
            <ArrowIcon />
          </a>

          {verdictState.verdict === "C" ? (
            <a
              href="#quote-form"
              className="inline-flex min-h-[52px] items-center justify-center rounded-[10px] border border-white/10 bg-[#1a2744] px-5 text-[14px] font-semibold text-white transition hover:bg-[#0f1d33]"
            >
              View Car Value Guide
            </a>
          ) : verdictState.verdict === "D" ? (
            <a
              href="#quote-form"
              className="inline-flex min-h-[52px] items-center justify-center rounded-[10px] border border-white/10 bg-[#1a2744] px-5 text-[14px] font-semibold text-white transition hover:bg-[#0f1d33]"
            >
              Honest Cost Comparison Guide
            </a>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] text-white/50">
          <span>No obligation</span>
          <span>100+ vetted UK specialists</span>
          <span>Free to use</span>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="mx-auto mt-4 block text-[13px] text-white/60 underline underline-offset-2 hover:text-white"
        >
          Start again / Try different inputs
        </button>
      </div>
    </div>
  );
}

export default function HomeDecisionHubSection() {
  const [step, setStep] = useState<StepId>(1);
  const [failureType, setFailureType] = useState<FailureTypeId | null>(null);
  const [vehicleAge, setVehicleAge] = useState<VehicleAgeId | null>(null);
  const [vehicleValue, setVehicleValue] = useState<number>(5000);
  const [engineCondition, setEngineCondition] = useState<EngineConditionId>("reconditioned");
  const [showResult, setShowResult] = useState(false);

  const nearestValueIndex = useMemo(
    () =>
      vehicleValueSteps.indexOf(
        vehicleValueSteps.reduce((closest, current) =>
          Math.abs(current - vehicleValue) < Math.abs(closest - vehicleValue) ? current : closest,
        ),
      ),
    [vehicleValue],
  );

  const previewCosts = costLookupTable["timing-chain"].reconditioned;

  function resetTool() {
    setStep(1);
    setFailureType(null);
    setVehicleAge(null);
    setVehicleValue(5000);
    setEngineCondition("reconditioned");
    setShowResult(false);
  }

  return (
    <Section className="bg-[#0d1b2e] py-8 sm:py-9 lg:py-11">
      <Container className="max-w-[1400px]">
        <div className="mx-auto max-w-[960px] text-center">
          <div className="section-pill mx-auto border border-[rgba(94,209,255,0.68)] !bg-gradient-to-br from-[#042f5a] to-[#075b94] !text-[#e9f8ff] shadow-[inset_0_0_0_1px_rgba(113,212,255,0.12),0_7px_17px_rgba(3,54,96,0.17)]">
            <span className="text-white">Engine Failure Cost Calculator</span>
          </div>

          <h2 className="mt-4 font-['Manrope'] text-[30px] font-bold leading-[1.08] text-white sm:text-[34px] lg:text-[40px]">
            <span>Is Engine Replacement </span>
            <span className="text-[#22c55e]">Worth It?</span>
            <span> Find Out in 60 Seconds.</span>
          </h2>

          <p className="mx-auto mt-4 text-[15px] leading-[1.7] text-[#94a3b8] sm:text-[16px]">
            Enter your failure type and vehicle details below. We&apos;ll show you the typical replacement cost, how it compares to your car&apos;s value, and whether replacement makes financial sense. The most common question we receive: &quot;My engine has failed - is it worth replacing, or should I scrap the car?&quot; The answer depends on your failure type, vehicle value, and which type of replacement engine you choose - and the difference between a GBP 2,200 reconditioned engine via EnginesMarket and a GBP 14,000 main dealer quote is often the deciding factor.
          </p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
          <div className="overflow-hidden rounded-[24px] bg-[#03132a] shadow-[0_22px_60px_rgba(0,0,0,0.28)]">
            <div className="h-[3px] w-full bg-[#2d3748]">
              {!showResult ? (
                <div className="h-full bg-[#15803d] transition-[width]" style={{ width: `${Math.round((step / 3) * 100)}%` }} />
              ) : (
                <div className="h-full w-full bg-[#15803d]" />
              )}
            </div>

            <div className="p-2 sm:p-7 lg:p-9">
              {showResult && failureType && vehicleAge ? (
                <VerdictScreen
                  failureType={failureType}
                  carAge={vehicleAge}
                  carValue={vehicleValue}
                  engineCondition={engineCondition}
                  onReset={resetTool}
                />
              ) : (
                <>
                  <MobileStepIndicator step={step} />
                  <StepIndicator step={step} />

                  {step === 1 ? (
                    <div>
                      <div className="mb-6 mt-6">
                        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/60">Step 1 - Failure Type</p>
                        <h3 className="mt-2 font-['Manrope'] text-[28px] font-bold text-white">What happened to your engine?</h3>
                        <p className="mt-2 text-[14px] text-white/60">Select the issue that best describes your engine problem.</p>
                      </div>

                      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
                        {failureTypes.slice(0, 6).map((failure) => {
                          const selected = failureType === failure.id;

                          return (
                            <button
                              key={failure.id}
                              type="button"
                              onClick={() => setFailureType(failure.id)}
                              className={`relative flex min-h-[150px] flex-col items-center justify-center gap-3 rounded-[12px] border-2 p-1 sm:p-3 text-center transition-all duration-200 ${selected
                                  ? "border-[#15803d] bg-gradient-to-b from-[#1a2744] via-[#0f1d33] to-[#0a1929] shadow-[0_0_25px_rgba(21,128,61,0.4)]"
                                  : "border-[#2d3748] bg-gradient-to-b from-[#1a2744] via-[#0f1d33] to-[#0a1929] hover:border-[#15803d]/60 hover:shadow-[0_0_20px_rgba(21,128,61,0.25)]"
                                }`}
                            >
                              {selected && (
                                <div className="absolute left-2 top-2 sm:left-5 sm:top-5 flex h-7 w-7 items-center justify-center rounded-full bg-[#15803d] text-white shadow-lg">
                                  <TickIcon />
                                </div>
                              )}

                              <div className={`h-15 w-15 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-lg ${selected ? '' : 'opacity-90'}`}>
                                <Image
                                  src={failureImages[failure.id] || "/images/failures/default.png"}
                                  alt={failure.label}
                                  width={80}
                                  height={80}
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              <div className="flex-1">
                                <p className={`text-[13px] sm:text-[15px] font-bold leading-[1.35] ${selected ? "text-white" : "text-white"}`}>
                                  {failure.label}
                                </p>
                                <p className={`mt-2 text-[11px] sm:text-[13px] leading-[1.5] ${selected ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
                                  {failure.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}

                                                {/* Not Sure / Multiple Issues - Full Width */}
                        {(() => {
                          const unknown = failureTypes.find((item) => item.id === "unknown");
                          const selected = failureType === "unknown";

                          if (!unknown) return null;

                          return (
                            <button
                              type="button"
                              onClick={() => setFailureType("unknown")}
                              className={`col-span-2 sm:col-span-2 lg:col-span-3 flex min-h-[72px] items-center gap-4 rounded-[12px] border px-5 py-4 text-left transition ${selected
                                  ? "border-2 border-[#15803d] bg-[#0f1d33] shadow-[0_0_0_4px_rgba(21,128,61,0.08)]"
                                  : "border-[#2d3748] bg-[#0a1929] hover:border-[#15803d] hover:shadow-[0_2px_12px_rgba(21,128,61,0.15)]"
                                }`}
                            >
                              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${selected ? " text-[#15803d]" : "text-white"}`}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                  <path d="M12 17h.01" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className={`text-[14px] font-bold ${selected ? "text-white" : "text-white/80"}`}>{unknown.label}</p>
                                <p className={`mt-0.5 text-[12px] ${selected ? "text-[#94a3b8]" : "text-[#6b7280]"}`}>{unknown.description}</p>
                              </div>
                              <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#94a3b8]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                              </svg>
                            </button>
                          );
                        })()}
                      </div>

                      <button
                        type="button"
                        disabled={!failureType}
                        onClick={() => setStep(2)}
                        className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#15803d] px-5 text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(21,128,61,0.35)] transition hover:bg-[#166534] disabled:cursor-not-allowed disabled:bg-[#374151] disabled:text-white/50 disabled:shadow-none"
                      >
                        <span>Next Step</span>
                        <ArrowIcon />
                      </button>
                    </div>
                  ) : null}

                  {step === 2 ? (
                    <div>
                      <div className="mb-6 mt-6">
                        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/60">Step 2 - Your Vehicle</p>
                        <h3 className="mt-2 font-['Manrope'] text-[28px] font-bold text-white">Tell us about your vehicle</h3>
                        <p className="mt-2 text-[14px] text-white/60">Provide details about your car to get an accurate valuation.</p>
                      </div>

                      <div className="mt-6">
                        <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-white/60">Vehicle Age</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {vehicleAgeOptions.map((age) => {
                            const selected = vehicleAge === age.id;

                            return (
                              <button
                                key={age.id}
                                type="button"
                                onClick={() => setVehicleAge(age.id)}
                                className={`rounded-full border px-2 sm:px-4 py-2 sm:py-3 text-[14px] font-bold transition ${selected
                                    ? "border-[#15803d] bg-[#15803d]/20 text-white shadow-[0_0_15px_rgba(21,128,61,0.3)]"
                                    : "border-[#2d3748] bg-[#1a2744] text-white/70 hover:border-[#15803d]/60 hover:text-white"
                                  }`}
                              >
                                {age.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-7">
                        <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-white/60">Estimated Current Car Value</p>
                        <p className="mt-2 text-[14px] leading-[1.6] text-white/60">
                          What would your car sell for in its current condition, before the engine failure?
                        </p>

                        <div className="mt-4 rounded-[12px] border border-[#15803d]/30 bg-[#15803d]/10 px-5 py-4 text-center">
                          <p className="font-['Manrope'] text-[34px] font-black text-[#22c55e]">{formatCurrency(vehicleValue)}</p>
                          <p className="mt-1 text-[11px] text-white/60">estimated car value</p>
                        </div>

                        <input
                          type="range"
                          min={0}
                          max={vehicleValueSteps.length - 1}
                          step={1}
                          value={nearestValueIndex}
                          onChange={(event) => setVehicleValue(vehicleValueSteps[Number(event.currentTarget.value)] ?? 5000)}
                          className="mt-5 h-1 w-full cursor-pointer accent-[#15803d]"
                        />

                        <div className="mt-2 flex justify-between gap-2 text-[10px] text-white/40">
                          {vehicleValueSteps.map((value) => (
                            <span key={value}>{formatVehicleValueStep(value)}</span>
                          ))}
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px]">
                          <div className="text-[12px] leading-[1.6] text-white/50">
                            Not sure? Check a quick valuation on Auto Trader or We Buy Any Car. This helps us give you an accurate replacement vs. scrap comparison.
                          </div>
                          <label className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/60">Manual Value</span>
                            <input
                              type="number"
                              min={500}
                              step={100}
                              value={vehicleValue}
                              onChange={(event) => {
                                const nextValue = Number(event.currentTarget.value);
                                if (!Number.isFinite(nextValue)) return;
                                setVehicleValue(Math.max(500, Math.min(20000, nextValue)));
                              }}
                              className="h-[44px] rounded-[10px] border border-[#2d3748] bg-[#1a2744] px-3 text-[14px] font-semibold text-white outline-none transition focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d]/50"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="mt-6 hidden items-center gap-3 sm:flex">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-[13px] text-white/60 underline underline-offset-2 hover:text-white"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          disabled={!vehicleAge}
                          onClick={() => setStep(3)}
                          className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#15803d] px-5 text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(21,128,61,0.35)] transition hover:bg-[#166534] disabled:cursor-not-allowed disabled:bg-[#374151] disabled:text-white/50 disabled:shadow-none"
                        >
                          <span>Next Step</span>
                          <ArrowIcon />
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {step === 3 ? (
                    <div>
                      <div className="mb-6 mt-6">
                        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/60">Step 3 - Engine Type</p>
                        <h3 className="mt-2 font-['Manrope'] text-[28px] font-bold text-white">What type of replacement engine are you open to?</h3>
                        <p className="mt-2 text-[14px] leading-[1.6] text-white/60">
                          Not sure which is right for you? We&apos;ll show you the cost difference in your results.
                        </p>
                      </div>

                      <div className="mt-5 flex flex-col gap-3 lg:flex-row">
                        {engineConditions.map((condition) => {
                          const selected = engineCondition === condition.id;

                          return (
                            <button
                              key={condition.id}
                              type="button"
                              onClick={() => setEngineCondition(condition.id)}
                              className={`relative flex-1 rounded-[12px] border-2 px-4 py-5 text-center transition-all duration-200 ${selected
                                  ? "border-[#15803d] bg-gradient-to-b from-[#1a2744] via-[#0f1d33] to-[#0a1929] shadow-[0_0_25px_rgba(21,128,61,0.4)]"
                                  : "border-[#2d3748] bg-gradient-to-b from-[#1a2744] via-[#0f1d33] to-[#0a1929] hover:border-[#15803d]/60 hover:shadow-[0_0_20px_rgba(21,128,61,0.25)]"
                                }`}
                            >
                              {selected && (
                                <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#15803d] text-white shadow-lg">
                                  <TickIcon />
                                </div>
                              )}
                              <p className="font-['Manrope'] text-[18px] font-bold text-white">{condition.label}</p>
                              <p className={`mt-2 text-[13px] font-semibold ${selected ? "text-[#22c55e]" : "text-white/60"}`}>{condition.from}</p>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-6 hidden items-center gap-3 sm:flex">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="text-[13px] text-white/60 underline underline-offset-2 hover:text-white"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowResult(true)}
                          className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#15803d] px-5 text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(21,128,61,0.35)] transition hover:bg-[#166534]"
                        >
                          <span>See My Results</span>
                          <ArrowIcon />
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {step > 1 ? (
                    <div className="mt-6 flex items-center gap-3 sm:hidden">
                      <button
                        type="button"
                        onClick={() => setStep((current) => (current === 3 ? 2 : 1))}
                        className="text-[13px] text-white/60 underline underline-offset-2 hover:text-white"
                      >
                        Back
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>

          {!showResult ? (
            <div className="lg:sticky lg:top-8">
              <ResultPreview />
              <div className="mt-4 hidden rounded-[18px] border border-white/10 bg-gradient-to-b from-[#1a2744] via-[#0f1d33] to-[#0a1929] p-4 text-white/80 lg:block">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#94a3b8]">Cross-brand reference</p>
                <p className="mt-2 font-['Manrope'] text-[18px] font-bold text-white">Timing Chain Failure</p>
                <p className="mt-2 text-[13px] text-[#94a3b8]">
                  Reconditioned S&F typical range:
                </p>
                <p className="mt-1 font-['Manrope'] text-[20px] font-black text-[#22c55e]">
                  {formatCurrency(previewCosts.low)} - {formatCurrency(previewCosts.high)}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {!showResult ? (
          <div className="sticky bottom-0 z-10 mt-4 rounded-[16px] border border-white/10 bg-[#03132a] p-4 shadow-[0_-6px_22px_rgba(0,0,0,0.5)] sm:hidden">
            <div className="mb-3 text-[12px] font-semibold text-white/60">
              {step === 2 ? "Step 2 of 3 - Your Vehicle" : step === 3 ? "Step 3 of 3 - Engine Type" : "Step 1 of 3 - Failure Type"}
            </div>
            {step === 2 ? (
              <button
                type="button"
                disabled={!vehicleAge}
                onClick={() => setStep(3)}
                className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#15803d] px-5 text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(21,128,61,0.35)] transition disabled:cursor-not-allowed disabled:bg-[#374151] disabled:text-white/50 disabled:shadow-none"
              >
                <span>Next Step</span>
                <ArrowIcon />
              </button>
            ) : step === 3 ? (
              <button
                type="button"
                onClick={() => setShowResult(true)}
                className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#15803d] px-5 text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(21,128,61,0.35)] transition hover:bg-[#166534]"
              >
                <span>See My Results</span>
                <ArrowIcon />
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="mt-8">
          <h3 className="font-['Manrope'] text-[26px] font-bold text-white sm:text-[28px]">
            Typical UK Engine Replacement Costs by Failure Type
          </h3>

          <div className="mt-5 overflow-x-auto rounded-[16px] border border-white/10">
            <table className="min-w-[720px] w-full border-collapse">
              <thead>
                <tr className="bg-[#1a2744]">
                  {["Failure Type", "Reconditioned S&F", "Rebuilt S&F", "Used S&F", "Main Dealer Est."].map((heading) => (
                    <th
                      key={heading}
                      className="px-2 sm:px-4 py-2 sm:py-4 text-left text-[13px] font-bold uppercase tracking-[0.08em] text-[#7791b3]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staticCostTableRows.map((row, index) => (
                  <tr key={row.label} className={index % 2 === 0 ? "bg-[#0f1d33]" : "bg-[#0d1b2e]"}>
                    <td className="border-b border-white/5 px-2 sm:px-4 py-2 sm:py-4 text-[12px] sm:text-[14px] font-semibold text-white">{row.label}</td>
                    <td className="border-b border-white/5 px-2 sm:px-4 py-2 sm:py-4 text-[12px] text-[14px] font-bold text-[#22c55e]">{row.reconditioned}</td>
                    <td className="border-b border-white/5 px-2 sm:px-4 py-2 sm:py-4 text-[12px] text-[14px] font-bold text-[#cbd5e1]">{row.rebuilt}</td>
                    <td className="border-b border-white/5 px-2 sm:px-4 py-2 sm:py-4 text-[12px] text-[14px] font-bold text-[#cbd5e1]">{row.used}</td>
                    <td className="border-b border-white/5 px-2 sm:px-4 py-2 sm:py-4 text-[12px] text-[14px] font-bold text-[#94a3b8] line-through">{row.mainDealer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-[12px] leading-[1.6] text-white/60">
            Cost ranges shown are typical UK market ranges based on cross-brand EnginesMarket enquiry data. Actual costs vary by make, model, engine code, location, and supplier. Use the calculator above or get free personalised quotes.
          </p>
        </div>
      </Container>
    </Section>
  );
}
