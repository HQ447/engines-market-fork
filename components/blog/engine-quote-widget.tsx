"use client";

import * as React from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Pencil,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Car,
} from "lucide-react";

interface Props {
  siteName?: string;
}

export function EngineQuoteWidget({ siteName = "Engines Market" }: Props) {
  const [reg, setReg] = React.useState("");
  const [isLookingUp, setIsLookingUp] = React.useState(false);
  const [lookupError, setLookupError] = React.useState("");

  const [vehicleData, setVehicleData] = React.useState<{
    VRM: string;
    Make: string;
    Model: string;
    YearOfManufacture: string;
    FuelType: string;
    EngineCapacity: number | string;
  } | null>(null);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [postal, setPostal] = React.useState("");
  const [note, setNote] = React.useState("");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!reg.trim()) {
      setLookupError("Please enter your vehicle registration");
      return;
    }

    setIsLookingUp(true);
    setLookupError("");

    try {
      const res = await fetch("/api/vehicle-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reg: reg.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setVehicleData(data.data);
      } else {
        setLookupError(data.message || "Vehicle lookup failed. Please check registration.");
      }
    } catch {
      setLookupError("Network error during lookup. Please try again.");
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleData?.Model) {
      alert("Please enter your registration and click 'Find My Engine' first.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/lead-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          postal,
          note,
          VRM: vehicleData.VRM,
          vehicle_make: vehicleData.Make,
          vehicle_model: vehicleData.Model,
          vehicle_year: vehicleData.YearOfManufacture,
          vehicle_fuel: vehicleData.FuelType,
          vehicle_fuel_capacity: vehicleData.EngineCapacity,
          siteName,
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSubmitted(true);
      } else {
        setSubmitError(data.error || "Failed to submit quote request. Please try again.");
      }
    } catch {
      setSubmitError("Network error submitting quote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl bg-[#002244] p-6 text-white border border-[#003366] shadow-xl text-center space-y-4 font-['Montserrat',sans-serif]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-black text-white">Quote Request Received!</h3>
        <p className="text-xs text-slate-200 leading-relaxed">
          Thank you, <b>{name}</b>. An engine specialist for your <b>{vehicleData?.Make} {vehicleData?.Model}</b> ({vehicleData?.VRM}) will contact you shortly with prices and warranty options.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSubmitted(false);
            setVehicleData(null);
            setReg("");
            setName("");
            setEmail("");
            setPhone("");
            setPostal("");
            setNote("");
          }}
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#0055d4] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0047b8] transition"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  const isFormDisabled = !vehicleData || !vehicleData.Model;

  return (
    <div className="rounded-2xl bg-[#002244] p-6 text-white shadow-xl space-y-4 font-['Montserrat',sans-serif]">
      {/* Title */}
      <div>
        <h3 className="text-2xl font-black tracking-tight text-white">
          Need the Right Engine?
        </h3>
        <p className="mt-1.5 text-xs text-slate-200 leading-snug">
          Enter your registration or request a callback from our engine specialists.
        </p>
      </div>

      {/* Reg Plate Input Section */}
      <div className="space-y-2 pt-1">
        <label htmlFor="sidebar-reg-input" className="block text-[11px] font-black uppercase tracking-wider text-white">
          ENTER YOUR REGISTRATION
        </label>

        <div className="flex items-center rounded-lg bg-white overflow-hidden shadow-inner">
          <div className="flex flex-col items-center justify-center bg-[#003399] px-2.5 py-2 text-white select-none leading-none gap-0.5 min-w-[36px]">
            <span className="text-xs leading-none">🇬🇧</span>
            <span className="font-black text-[9px] tracking-tight text-white">UK</span>
          </div>
          <input
            id="sidebar-reg-input"
            type="text"
            value={reg}
            onChange={(e) => setReg(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleLookup(e)}
            placeholder="ENTER REGISTRATION"
            className="flex-1 bg-transparent px-3 py-2.5 text-sm font-bold tracking-wider text-slate-900 placeholder:text-slate-400 uppercase focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => handleLookup()}
          disabled={isLookingUp || !reg.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0055d4] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#0047b8] active:scale-[0.99] disabled:opacity-60"
        >
          {isLookingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          <span>Find My Engine</span>
          <span className="text-base leading-none">→</span>
        </button>

        {lookupError && (
          <p className="text-[11px] font-medium text-rose-300 bg-rose-950/40 border border-rose-500/30 rounded-lg p-2">
            {lookupError}
          </p>
        )}

        {vehicleData && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs space-y-1 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Car className="h-3 w-3" /> Vehicle Identified:
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded">
                {vehicleData.VRM}
              </span>
            </div>
            <div className="font-bold text-white text-sm">
              {vehicleData.Make} {vehicleData.Model}
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] text-slate-300">
              {vehicleData.YearOfManufacture && <span>Year: <b>{vehicleData.YearOfManufacture}</b></span>}
              {vehicleData.FuelType && <span>• Fuel: <b>{vehicleData.FuelType}</b></span>}
              {vehicleData.EngineCapacity && <span>• Size: <b>{vehicleData.EngineCapacity}.0L</b></span>}
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20" />
        </div>
        <span className="relative bg-[#002244] px-3 text-[11px] font-bold uppercase tracking-wider text-slate-200">
          OR REQUEST A QUOTE
        </span>
      </div>

      {/* Quote Form */}
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="relative">
          <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full rounded-lg bg-white pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-lg bg-white pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="w-full rounded-lg bg-white pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            required
            value={postal}
            onChange={(e) => setPostal(e.target.value.toUpperCase())}
            placeholder="Postal Code"
            className="w-full rounded-lg bg-white pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 uppercase focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="relative">
          <Pencil className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Quick Note..."
            className="w-full rounded-lg bg-white pl-10 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>

        {submitError && (
          <p className="text-[11px] font-medium text-rose-300 bg-rose-950/40 border border-rose-500/30 rounded-lg p-2">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          id="blogFormSubmitBTN"
          disabled={isFormDisabled || isSubmitting}
          className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold text-white transition ${
            isFormDisabled
              ? "bg-[#0055d4]/60 cursor-not-allowed opacity-75"
              : "bg-[#0055d4] hover:bg-[#0047b8] shadow-lg active:scale-[0.99]"
          }`}
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          <span>Request A Quote</span>
        </button>

        {isFormDisabled && (
          <p className="text-[10px] text-slate-300 text-center pt-0.5">
            * Please enter your vehicle registration above to unlock quote request.
          </p>
        )}
      </form>

      {/* Security Footer */}
      <div className="flex items-center gap-3 pt-2 text-left">
        <div className="flex-shrink-0 text-white">
          <ShieldCheck className="h-7 w-7 stroke-[1.5]" />
        </div>
        <div className="text-[11px] leading-tight">
          <div className="font-bold text-white">100% Secure & Privacy Guaranteed</div>
          <div className="text-slate-300 text-[10px] mt-0.5">We never share your details with third parties.</div>
        </div>
      </div>
    </div>
  );
}