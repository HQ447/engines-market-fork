import "server-only";

import { Resend } from "resend";
import { SITE_URL } from "@/lib/site";

const DEFAULT_CRM_LEAD_ENDPOINT = "https://crm-api.enginesmarket.co.uk/api/v1/leads";
const DEFAULT_SUPABASE_WEBHOOK_URL = "https://gfrnxvolaqbfalerfhsr.supabase.co/functions/v1/receive-lead";

const RESEND_API_KEY =
  process.env.RESEND_API_KEY || "RESEND_API_KEY";
const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Engines Market <sales@enginesmarket.co.uk>";
const LEAD_RECIPIENT_EMAIL =
  process.env.LEAD_EMAIL_RECIPIENT || process.env.SMTP_TO_EMAIL || "ef2crm@gmail.com";

const resend = new Resend(RESEND_API_KEY);

type RawQuote = Record<string, unknown>;

type QuoteLead = {
  name: string;
  email: string;
  number: string;
  postcode: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleBrand: string;
  vehicleTitle: string;
  vehicleVrm: string;
  vehicleSeries: string;
  engineCode: string;
  engineCapacity: string;
  fuelType: string;
  color: string;
  wheelplan: string;
  description: string;
  sourceLabel: string;
  sourcePage: string;
  searchMode: string;
  partSupplied: string;
  supplyOnly: string;
  considerBoth: string;
  reconditionedCondition: string;
  usedCondition: string;
  newCondition: string;
  considerAllCondition: string;
  fitting: string;
  engineType: string;
};

type DeliveryResult = {
  delivered: boolean;
  emailSent: boolean;
  crmSent: boolean;
  webhookSent: boolean;
};

function valueFrom(raw: RawQuote, ...keys: string[]) {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeSourcePage(value: string) {
  if (!value) return "";

  try {
    const url = new URL(value, SITE_URL);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

function normalizeQuote(raw: RawQuote): QuoteLead {
  return {
    name: valueFrom(raw, "name", "fullName"),
    email: valueFrom(raw, "email"),
    number: valueFrom(raw, "number", "phone"),
    postcode: valueFrom(raw, "postcode"),
    vehicleModel: valueFrom(raw, "vehicle_model", "model"),
    vehicleYear: valueFrom(raw, "vehicle_reg", "year"),
    vehicleBrand: valueFrom(raw, "vehicle_brand", "make"),
    vehicleTitle: valueFrom(raw, "vehicle_title", "engineTitle"),
    vehicleVrm: valueFrom(raw, "vehicle_vrm", "registrationNumber", "regNumber", "registration"),
    vehicleSeries: valueFrom(raw, "vehicle_series", "series", "selectedContext"),
    engineCode: valueFrom(raw, "engine_code", "engineCode"),
    engineCapacity: valueFrom(raw, "engine_capacity", "engin_capacity", "engineCapacity"),
    fuelType: valueFrom(raw, "fuel_type", "fuelType"),
    color: valueFrom(raw, "color", "colour"),
    wheelplan: valueFrom(raw, "wheelplan", "wheelPlan"),
    description: valueFrom(raw, "description", "remarks", "notes", "problem"),
    sourceLabel: valueFrom(raw, "source_label", "sourceLabel", "source", "quoteSource") || "website-quote",
    sourcePage: safeSourcePage(
      valueFrom(raw, "source_page", "sourcePage", "page_url", "pageUrl", "referrer"),
    ),
    searchMode: valueFrom(raw, "search_mode", "searchMode"),
    partSupplied: valueFrom(raw, "part_supplied"),
    supplyOnly: valueFrom(raw, "supply_only"),
    considerBoth: valueFrom(raw, "consider_both"),
    reconditionedCondition: valueFrom(raw, "reconditioned_condition"),
    usedCondition: valueFrom(raw, "used_condition"),
    newCondition: valueFrom(raw, "new_condition"),
    considerAllCondition: valueFrom(raw, "consider_all_condition"),
    fitting: valueFrom(raw, "fitting"),
    engineType: valueFrom(raw, "engine_type", "engineType"),
  };
}

async function readPayload(request: Request): Promise<RawQuote> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (contentType.includes("application/json")) {
    const payload = (await request.json()) as unknown;
    return payload && typeof payload === "object" && !Array.isArray(payload) ? (payload as RawQuote) : {};
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

function buildDescription(lead: QuoteLead) {
  return [
    lead.description,
    lead.color ? `Color: ${lead.color}` : "",
    lead.wheelplan ? `Wheelplan: ${lead.wheelplan}` : "",
    lead.sourceLabel ? `Quote source: ${lead.sourceLabel}` : "",
    lead.sourcePage ? `Source page: ${lead.sourcePage}` : "",
    lead.searchMode ? `Search mode: ${lead.searchMode}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildBackendPayload(lead: QuoteLead) {
  const sourcePage = lead.sourcePage || `${SITE_URL}/`;
  const requestedEngineType = lead.engineType.toLowerCase();
  const requestedFitting = lead.fitting.toLowerCase();
  const checked = "on";

  const reconditionedCondition =
    lead.reconditionedCondition ||
    (/reconditioned|rebuilt|remanufactured/.test(requestedEngineType) ? checked : "");
  const usedCondition = lead.usedCondition || (requestedEngineType === "used" ? checked : "");
  const newCondition = lead.newCondition || (requestedEngineType === "new" ? checked : "");
  const considerAllCondition =
    lead.considerAllCondition || (requestedEngineType.includes("all") ? checked : "");
  const partSupplied =
    lead.partSupplied || (/fit|both/.test(requestedFitting) ? checked : "");
  const supplyOnly =
    lead.supplyOnly || (/supply only|both/.test(requestedFitting) ? checked : "");
  const considerBoth = lead.considerBoth || (requestedFitting.includes("both") ? checked : "");

  return {
    name: lead.name || null,
    email: lead.email || null,
    number: lead.number || null,
    vehicle_model: lead.vehicleModel || null,
    vehicle_reg: lead.vehicleYear || null,
    vehicle_brand: lead.vehicleBrand || null,
    vehicle_title: lead.vehicleTitle || lead.engineCode || `${lead.vehicleBrand} ${lead.vehicleModel}`.trim() || null,
    vehicle_vrm: lead.vehicleVrm || null,
    vehicle_series: lead.vehicleSeries || lead.vehicleModel || null,
    vehicle_part: "engine",
    engine_capacity: lead.engineCapacity || null,
    fuel_type: lead.fuelType || null,
    part_supplied: partSupplied || null,
    supply_only: supplyOnly || null,
    consider_both: considerBoth || null,
    reconditioned_condition: reconditionedCondition || null,
    used_condition: usedCondition || null,
    new_condition: newCondition || null,
    consider_all_condition: considerAllCondition || null,
    postcode: lead.postcode || null,
    vehicle_drive: null,
    collection_required: null,
    description: buildDescription(lead) || null,
    engine_code: lead.engineCode || null,
    source: sourcePage,
    source_page: sourcePage,
    source_label: lead.sourceLabel || "website-quote",
    search_mode: lead.searchMode || null,
    fitting: lead.fitting || null,
    engine_type: lead.engineType || null,
  };
}

async function sendEmail(lead: QuoteLead): Promise<boolean> {
  try {
    const rows = [
      ["Name", lead.name],
      ["Email", lead.email],
      ["Phone", lead.number],
      ["Postcode", lead.postcode],
      ["Registration", lead.vehicleVrm],
      ["Make", lead.vehicleBrand],
      ["Model", lead.vehicleModel],
      ["Year", lead.vehicleYear],
      ["Fuel type", lead.fuelType],
      ["Engine capacity", lead.engineCapacity],
      ["Engine code", lead.engineCode],
      ["Color", lead.color],
      ["Wheelplan", lead.wheelplan],
      ["Engine type", lead.engineType],
      ["Fitting", lead.fitting],
      ["Quote source", lead.sourceLabel],
      ["Exact source page", lead.sourcePage || `${SITE_URL}/`],
      ["Search mode", lead.searchMode],
      ["Additional details", lead.description],
    ]
      .filter(([, value]) => Boolean(value))
      .map(
        ([label, value]) =>
          `<tr><th style="padding:8px 12px;text-align:left;background:#f3f4f6;border:1px solid #e5e7eb;font-size:13px;">${escapeHtml(
            String(label),
          )}</th><td style="padding:8px 12px;border:1px solid #e5e7eb;font-size:13px;">${escapeHtml(
            String(value),
          )}</td></tr>`,
      )
      .join("");

    const emailHtml = `
      <div style="font-family:Arial,sans-serif;padding:20px;color:#111;max-width:720px;margin:0 auto;">
        <h1 style="font-size:22px;margin:0 0 16px;color:#002244;">New Quote Request${lead.vehicleVrm ? ` - ${lead.vehicleVrm}` : ""} - enginesmarket.co.uk</h1>
        <table style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #e5e7eb;">
          ${rows}
        </table>
        <p style="font-size:11px;color:#888;margin-top:20px;">Timestamp: ${new Date().toUTCString()}</p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: [LEAD_RECIPIENT_EMAIL],
      replyTo: lead.email,
      subject: `New Quote Request${lead.vehicleVrm ? ` - ${lead.vehicleVrm}` : ""} - enginesmarket.co.uk`,
      html: emailHtml,
    });

    if (error) {
      console.error("[RESEND ERROR in quoteLead]:", error);
      return false;
    }

    console.log("[LEAD DISPATCHED VIA RESEND]:", data);
    return true;
  } catch (err) {
    console.error("[RESEND EXCEPTION in quoteLead]:", err);
    return false;
  }
}

async function postJson(url: string, payload: ReturnType<typeof buildBackendPayload>, headers: HeadersInit) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...headers },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`${response.status}: ${message.slice(0, 500)}`);
  }
}

async function deliverLead(lead: QuoteLead): Promise<DeliveryResult> {
  const payload = buildBackendPayload(lead);
  const crmEndpoint = process.env.CRM_LEAD_ENDPOINT || DEFAULT_CRM_LEAD_ENDPOINT;
  const supabaseEndpoint = process.env.SUPABASE_WEBHOOK_URL || DEFAULT_SUPABASE_WEBHOOK_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || "";

  const crmPromise = postJson(crmEndpoint, payload, { "x-frontend-url": `${SITE_URL}/` });
  const webhookPromise = supabaseKey
    ? postJson(supabaseEndpoint, payload, { Authorization: `Bearer ${supabaseKey}` })
    : Promise.resolve();

  const [crmResult, webhookResult, emailResult] = await Promise.allSettled([
    crmPromise,
    webhookPromise,
    sendEmail(lead),
  ]);

  const crmSent = crmResult.status === "fulfilled";
  const webhookSent = Boolean(supabaseKey) && webhookResult.status === "fulfilled";
  const emailSent = emailResult.status === "fulfilled" && emailResult.value;

  if (crmResult.status === "rejected") console.error("CRM lead delivery failed", crmResult.reason);
  if (webhookResult.status === "rejected") console.error("Supabase lead delivery failed", webhookResult.reason);
  if (emailResult.status === "rejected") console.error("Quote email delivery failed", emailResult.reason);

  return { delivered: crmSent || webhookSent || emailSent, emailSent, crmSent, webhookSent };
}

export async function handleQuoteRequest(request: Request) {
  try {
    const lead = normalizeQuote(await readPayload(request));

    if (!lead.name || !lead.email || !lead.number) {
      return Response.json(
        { success: false, message: "Name, email, and phone are required." },
        { status: 400 },
      );
    }

    if (!lead.vehicleVrm && !lead.vehicleModel && !lead.engineCode) {
      return Response.json(
        { success: false, message: "Please provide a registration number or vehicle details." },
        { status: 400 },
      );
    }

    const delivery = await deliverLead(lead);
    if (!delivery.delivered) {
      return Response.json(
        { success: false, message: "We could not deliver your request. Please try again." },
        { status: 502 },
      );
    }

    return Response.json({ success: true, delivery });
  } catch (error) {
    console.error("Quote request failed", error);
    return Response.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
