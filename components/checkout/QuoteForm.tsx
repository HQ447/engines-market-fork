"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCar,
  FaEnvelope,
  FaGasPump,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
} from "react-icons/fa";

export type QuoteFormSeed = {
  registrationNumber?: string;
  make?: string;
  model?: string;
  variant?: string;
  year?: string;
  fuelType?: string;
  engineCapacity?: string;
  engineCode?: string;
  color?: string;
  wheelplan?: string;
  remarks?: string;
  sourceLabel?: string;
  sourcePage?: string;
  searchMode?: "registration" | "manual";
};

type Props = {
  initialData?: QuoteFormSeed;
  onClose?: () => void;
};

type VehicleRegistrationData = {
  registrationNumber: string;
  year: string;
  make: string;
  model: string;
  fuelType: string;
  engineCapacity: string;
  color: string;
  wheelplan: string;
};

const fieldClass =
  "h-11 w-full rounded-[7px] border border-slate-300 bg-white px-4 text-[14px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#168b4c] focus:ring-1 focus:ring-[#168b4c]";

function initialState(seed: QuoteFormSeed = {}) {
  return {
    registrationNumber: seed.registrationNumber || "",
    make: seed.make || "",
    model: seed.model || "",
    variant: seed.variant || "",
    year: seed.year || "",
    fuelType: seed.fuelType || "",
    engineCapacity: seed.engineCapacity || "",
    engineCode: seed.engineCode || "",
    color: seed.color || "",
    wheelplan: seed.wheelplan || "",
    fullName: "",
    phone: "",
    email: "",
    postcode: "",
    remarks: seed.remarks || "",
    engineType: "Reconditioned",
    fitting: "Supply & fit",
  };
}

function formatCapacity(value: string) {
  const rawValue = value.trim();
  if (!rawValue) return "";

  const numericValue = Number(rawValue.replace(/,/g, "").match(/\d+(?:\.\d+)?/)?.[0]);
  if (!Number.isFinite(numericValue)) return rawValue;

  if (/(?:litre|liter|\bl\b|l$)/i.test(rawValue)) {
    return `${numericValue.toFixed(1)}L`;
  }

  if (numericValue >= 500) {
    return `${(Math.round(numericValue / 100) / 10).toFixed(1)}L`;
  }

  return rawValue;
}

async function readVehiclePayload<T>(response: Response): Promise<T> {
  const text = await response.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      response.ok
        ? "The vehicle lookup service returned an invalid response. Please try again."
        : "The vehicle lookup service is temporarily unavailable. Please try again.",
    );
  }
}

export default function QuoteForm({ initialData = {}, onClose }: Props) {
  const [formData, setFormData] = useState(() => initialState(initialData));
  const [isVehicleLocked, setIsVehicleLocked] = useState(Boolean(initialData.make && initialData.model));
  const [vehicleLookupError, setVehicleLookupError] = useState("");
  const [isVehicleLookupLoading, setIsVehicleLookupLoading] = useState(false);
  const [vehicleImage, setVehicleImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const initialLookupStarted = useRef(false);
  const initialRegistration = useRef(initialData.registrationNumber?.trim() || "");
  const lastLookupRegistration = useRef("");

  useEffect(() => {
    if (!formData.make || !formData.model) return;

    const controller = new AbortController();
    const query = new URLSearchParams({ make: formData.make, model: formData.model, year: formData.year });
    fetch(`/api/vehicle-image?${query.toString()}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((payload: { image?: string | null }) => setVehicleImage(payload.image || ""))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setVehicleImage("");
      });

    return () => controller.abort();
  }, [formData.make, formData.model, formData.year]);

  const lookupRegistration = useCallback(async (registrationNumber: string) => {
    const normalizedRegistration = registrationNumber.trim();
    if (!normalizedRegistration) {
      setVehicleLookupError("Please enter your vehicle registration.");
      return;
    }

    setIsVehicleLookupLoading(true);
    setVehicleLookupError("");
    lastLookupRegistration.current = normalizedRegistration.replace(/[^A-Z0-9]/gi, "").toUpperCase();

    try {
      const response = await fetch(
        `/api/vehicle-registration?registrationNumber=${encodeURIComponent(normalizedRegistration)}`,
      );
      const payload = await readVehiclePayload<{ vehicle?: VehicleRegistrationData; error?: string }>(response);
      if (!response.ok || !payload.vehicle) {
        throw new Error(payload.error || "We could not load the selected vehicle.");
      }

      setFormData((current) => ({
        ...current,
        registrationNumber: payload.vehicle?.registrationNumber || normalizedRegistration,
        make: payload.vehicle?.make || "",
        model: payload.vehicle?.model || "",
        year: payload.vehicle?.year || "",
        fuelType: payload.vehicle?.fuelType || "",
        engineCapacity: payload.vehicle?.engineCapacity || "",
        color: payload.vehicle?.color || "",
        wheelplan: payload.vehicle?.wheelplan || "",
      }));
      setIsVehicleLocked(true);
    } catch (error: unknown) {
      setIsVehicleLocked(false);
      setVehicleLookupError(error instanceof Error ? error.message : "Vehicle lookup failed.");
    } finally {
      setIsVehicleLookupLoading(false);
    }
  }, []);

  useEffect(() => {
    if (
      initialLookupStarted.current ||
      !initialRegistration.current ||
      formData.registrationNumber.trim() !== initialRegistration.current ||
      formData.make.trim() ||
      formData.model.trim()
    ) {
      return;
    }

    initialLookupStarted.current = true;
    void lookupRegistration(initialRegistration.current);
  }, [formData.make, formData.model, formData.registrationNumber, lookupRegistration]);

  useEffect(() => {
    if (formData.make.trim() || formData.model.trim()) return;

    const normalizedRegistration = formData.registrationNumber.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    if (normalizedRegistration.length < 7 || normalizedRegistration === lastLookupRegistration.current) return;

    const timer = window.setTimeout(() => {
      void lookupRegistration(formData.registrationNumber);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [formData.make, formData.model, formData.registrationNumber, lookupRegistration]);

  function updateField(name: string, value: string) {
    setSubmitError("");
    if (name === "registrationNumber") {
      setVehicleLookupError("");
      setIsVehicleLocked(false);
      setFormData((current) => ({
        ...current,
        registrationNumber: value.toUpperCase(),
        make: "",
        model: "",
        year: "",
        fuelType: "",
        engineCapacity: "",
        color: "",
        wheelplan: "",
      }));
      return;
    }
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          registrationNumber: formData.registrationNumber.trim(),
          source_label: initialData.sourceLabel || "checkout-page",
          source_page:
            initialData.sourcePage || (onClose ? window.location.href : document.referrer || window.location.href),
          search_mode: formData.registrationNumber ? "registration" : initialData.searchMode || "manual",
        }),
      });
      const result = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Your quote could not be sent. Please try again.");
      }

      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Your quote could not be sent. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full rounded-[7px] bg-white px-6 py-14 text-center shadow-[0_4px_22px_rgba(15,23,42,0.10)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-[#268b3b]">✓</div>
        <h2 className="mt-5 !text-xl !leading-tight font-extrabold text-slate-900">Your quote request has been sent</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">
          We have received the details for {formData.registrationNumber || `${formData.make} ${formData.model}`} and will match the right engine specialists.
        </p>
        {onClose ? (
          <button type="button" onClick={onClose} className="mt-6 rounded-[5px] bg-[#268b3b] px-6 py-3 text-sm font-bold text-white">
            Return to page
          </button>
        ) : null}
      </div>
    );
  }

  const vehicleName = [formData.make, formData.model, formData.variant].filter(Boolean).join(" ");
  const hasVehicleDetails = Boolean(formData.make || formData.model || formData.year);
  const hasSelectedVehicle = hasVehicleDetails;
  const vehicleDetails = [
    { label: "Year", value: formData.year, icon: <FaCalendarAlt /> },
    { label: "Fuel Type", value: formData.fuelType, icon: <FaGasPump /> },
    { label: "Engine", value: formatCapacity(formData.engineCapacity), icon: <FaCar /> },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.18)]"
    >
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition hover:bg-white/20"
          aria-label="Close quote form"
        >
          ×
        </button>
      ) : null}

      <header className="bg-[#061a33] px-5 py-6 pr-16 text-white sm:px-7 sm:py-7 sm:pr-20">
        <h1 className="!m-0 !text-[28px] !leading-none font-black tracking-[-0.04em] sm:!text-[36px]">
          <span className="text-white">Get My Vehicle</span>{" "}
          <span className="text-[#168b4c]">Information</span>
        </h1>
        <p className="mt-3 !text-[13px] !leading-5 text-white sm:!text-[15px]">
          Compare engine quotes from trusted Mercedes specialists - instantly.
        </p>
      </header>

      {hasSelectedVehicle ? (
        <section className="grid items-center gap-5 border-b border-slate-200 px-5 py-6 sm:grid-cols-[minmax(190px,250px)_1fr] sm:px-7 sm:py-7">
          {vehicleImage ? (
            <Image
              src={vehicleImage}
              alt={vehicleName || "Selected vehicle"}
              width={320}
              height={190}
              className="mx-auto h-[125px] w-[205px] object-contain sm:h-[145px] sm:w-[240px]"
            />
          ) : (
            <div className="mx-auto flex h-[125px] w-[205px] items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400 sm:h-[145px] sm:w-[240px]">Selected vehicle</div>
          )}
          <div className="min-w-0">
            {formData.registrationNumber ? (
              <div className="inline-flex overflow-hidden rounded-md border border-[#c38a00] shadow-sm">
                <span className="flex w-9 flex-col items-center justify-center bg-[#0b3f88] py-1 text-[9px] font-bold leading-3 text-white"><span>GB</span><span>UK</span></span>
                <span className="bg-[#ffcb18] px-4 py-1.5 text-[20px] font-black tracking-[0.08em] text-slate-950 sm:text-[26px]">{formData.registrationNumber}</span>
              </div>
            ) : null}
            {vehicleName ? <h2 className="mt-2 !text-[20px] !leading-tight font-extrabold uppercase text-[#172033] sm:!text-[24px]">{vehicleName}</h2> : null}
            <div className="mt-3 grid max-w-[480px] grid-cols-2 gap-x-5 gap-y-2 border-t border-slate-200 pt-3 text-[13px] text-slate-700 sm:grid-cols-3">
              {vehicleDetails.map((detail) => (
                <div className="flex min-w-0 items-center gap-2" key={detail.label}>
                  <span className="shrink-0 text-[#168b4c]" aria-hidden="true">{detail.icon}</span>
                  <span className="truncate"><span className="font-semibold">{detail.label}:</span> {detail.value || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {!hasVehicleDetails ? (
        <section>
          <div className="border-b border-slate-200 px-5 py-5 sm:px-7 sm:py-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 sm:px-6">
              <label className="block text-center text-[14px] font-semibold text-[#08295a]" htmlFor="quote-registration">
                Enter your vehicle registration
              </label>
              <div className="mx-auto mt-3 w-full max-w-[390px]">
                <div className="flex h-[52px] w-full overflow-hidden rounded-[6px] border-[3px] border-[#172033] bg-[#ffcc18] shadow-[0_4px_10px_rgba(15,23,42,0.12)]">
                  <span className="flex w-[45px] shrink-0 flex-col items-center justify-center gap-0.5 border-r-[3px] border-[#172033] bg-[#003399] text-[9px] font-black leading-none text-white">
                    <span className="text-[15px] leading-none">🇬🇧</span>
                    <span>GB</span>
                  </span>
                  <input
                    id="quote-registration"
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(event) => updateField("registrationNumber", event.currentTarget.value)}
                    placeholder="REG HERE"
                    maxLength={8}
                    autoCapitalize="characters"
                    autoComplete="off"
                    spellCheck={false}
                    className="min-w-0 flex-1 bg-transparent px-3 text-center text-[24px] font-black uppercase tracking-[0.08em] text-[#10151c] outline-none placeholder:text-[#10151c] placeholder:opacity-100 focus:ring-0"
                    style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}
                  />
                </div>
                {isVehicleLookupLoading ? <p className="mt-2 text-center text-[12px] font-semibold text-[#168b4c]">Loading vehicle details…</p> : null}
              </div>
              <p className="mt-2 text-center text-[12px] text-slate-500">Vehicle details load automatically after you enter your registration.</p>
            </div>
            {vehicleLookupError ? <p className="mt-3 text-sm font-medium text-red-600">{vehicleLookupError}</p> : null}
          </div>
        </section>
      ) : null}

      <section>
        <div className="px-5 py-6 sm:px-7 sm:py-7">
          <div className="flex items-center gap-3">
            <h2 className="!m-0 !text-[21px] !leading-tight font-extrabold text-[#172033]">Enter Your <span className="text-[#168b4c]">Details</span></h2>
            <span className="h-px flex-1 bg-[#d8c5ae]" aria-hidden="true" />
          </div>
          <div className="mt-5 grid gap-x-4 gap-y-4 sm:grid-cols-2">
            <EditableField icon={<FaUser />} label="Name" name="fullName" value={formData.fullName} placeholder="John Smith" required onChange={updateField} />
            <EditableField icon={<FaEnvelope />} label="Email" name="email" value={formData.email} placeholder="john@example.com" type="email" required onChange={updateField} />
            <EditableField icon={<FaPhone />} label="Phone Number" name="phone" value={formData.phone} placeholder="07XXXXXXXXX" type="tel" required onChange={updateField} />
            <EditableField icon={<FaMapMarkerAlt />} label="Post Code" name="postcode" value={formData.postcode} placeholder="W12 9AB" onChange={updateField} />
            <label className="sm:col-span-2">
              <span className="mb-2 block text-[14px] font-semibold text-[#172033]">Any Remarks <span className="font-normal text-slate-500">(Additional Information - Optional)</span></span>
              <textarea
                value={formData.remarks}
                onChange={(event) => updateField("remarks", event.currentTarget.value)}
                placeholder="Please enter any info you would like us to know."
                rows={3}
                className="min-h-[84px] w-full resize-y rounded-[7px] border border-slate-300 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#168b4c] focus:ring-1 focus:ring-[#168b4c]"
              />
            </label>
          </div>

          {submitError ? <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">{submitError}</p> : null}

          <p className="mt-5 text-[11px] leading-5 text-slate-500">
            By clicking &quot;Get Your Free Replacement Engine Quote&quot; you agree to our <Link className="underline hover:text-slate-800" href="/legal/terms-and-conditions">Terms &amp; Conditions</Link> and <Link className="underline hover:text-slate-800" href="/legal/privacy-policy">Privacy Policy</Link>.
          </p>

          <button
            type="submit"
            disabled={isSubmitting || (!isVehicleLocked && !formData.engineCode)}
            className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-3 rounded-[8px] bg-[#168b4c] px-4 text-[16px] font-extrabold text-white shadow-[0_10px_22px_rgba(4,150,77,0.2)] transition hover:bg-[#0f743e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : <>Get Your Free Replacement Engine Quote <FaArrowRight aria-hidden="true" /></>}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-slate-500">
            <FaLock className="shrink-0 text-slate-400" aria-hidden="true" />
            <span>Your details are secure, no spam - genuine quote from UK vetted engine specialists only.</span>
          </div>
        </div>
      </section>
    </form>
  );
}

function EditableField({
  icon,
  label,
  name,
  value,
  placeholder,
  type = "text",
  required = false,
  onChange,
}: {
  icon?: ReactNode;
  label: string;
  name: string;
  value: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-[14px] font-semibold text-[#172033]">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <span className="relative block">
        {icon ? <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-slate-400" aria-hidden="true">{icon}</span> : null}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(name, event.currentTarget.value)}
          placeholder={placeholder}
          className={`${fieldClass}${icon ? " pl-10" : ""}`}
          required={required}
        />
      </span>
    </label>
  );
}
