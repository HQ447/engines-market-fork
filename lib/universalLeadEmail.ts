import "server-only";

import { randomUUID } from "node:crypto";
import { SITE_URL } from "@/lib/site";

const SITE_NAME = "Engines Market";
const NOT_PROVIDED = "Not provided";

type UniversalLead = {
  name: string;
  email: string;
  number: string;
  postcode: string;
  vehicleVrm: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  engineCapacity: string;
  fuelType: string;
  description: string;
  vehicleTitle: string;
  engineCode: string;
  fitting: string;
  engineType: string;
  sourcePage: string;
};

const UNIVERSAL_EMAIL_TEMPLATE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New Quote Request</title></head><body style="margin:0;padding:18px 8px;background:#eaf0f7;font-family:Arial,Helvetica,sans-serif;color:#101b2d"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(17,39,70,.16)"><tr><td style="background:#071d37;padding:0;color:#ffffff"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td valign="top" style="padding:24px 8px 22px 26px"><img src="{{LOGO_URL}}" alt="{{SITE_NAME}}" width="220" style="display:block;width:220px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px"><tr><td width="46" height="46" align="center" valign="middle" style="width:46px;height:46px;background:#0b9fea;border:1px solid #61c7fb;border-radius:8px;font-size:27px;line-height:46px;color:#ffffff">&#9993;</td><td style="padding-left:14px"><div style="font-size:27px;line-height:32px;font-weight:700;color:#ffffff">New Quote Request</div><div style="font-size:15px;line-height:21px;color:#d6e8f7;padding-top:3px">A new enquiry has been submitted from your website.</div></td></tr></table></td><td width="225" align="right" valign="bottom" style="width:225px;padding:12px 12px 0 0;background:linear-gradient(135deg,rgba(16,71,116,.55),rgba(7,29,55,0))"><img src="{{ENGINE_IMAGE_URL}}" alt="Engine" width="215" style="display:block;width:215px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none"></td></tr></table></td></tr><tr><td style="padding:18px 24px 8px;background:#ffffff">{{LEAD_CARD}}{{VEHICLE_CARD}}{{SOURCE_CARD}}</td></tr><tr><td style="padding:18px 24px;background:#071d37;color:#ffffff"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="font-size:14px;line-height:20px;font-weight:700">Lead Reference: <span style="color:#42c8fb">{{LEAD_REFERENCE}}</span></td><td align="right" style="font-size:13px;line-height:20px;color:#eef7ff">&#128197; Received: {{RECEIVED_UK}}</td></tr></table></td></tr></table></td></tr></table></body></html>`;

const REFINED_UNIVERSAL_EMAIL_TEMPLATE = UNIVERSAL_EMAIL_TEMPLATE
  .replace('padding:24px 8px 22px 26px', 'padding:20px 8px 18px 24px')
  .replace('width="220" style="display:block;width:220px', 'width="190" style="display:block;width:190px')
  .replace('style="margin-top:20px"', 'style="margin-top:16px"')
  .replace('width="46" height="46"', 'width="38" height="38"')
  .replace('width:46px;height:46px', 'width:38px;height:38px')
  .replace('font-size:27px;line-height:46px', 'font-size:21px;line-height:38px')
  .replace('padding-left:14px', 'padding-left:11px')
  .replace('font-size:27px;line-height:32px', 'font-size:24px;line-height:28px')
  .replace('font-size:15px;line-height:21px', 'font-size:14px;line-height:19px')
  .replace('width="225"', 'width="170"')
  .replace(
    'width:225px;padding:12px 12px 0 0;background:linear-gradient(135deg,rgba(16,71,116,.55),rgba(7,29,55,0))',
    'width:170px;padding:10px 14px 0 0',
  )
  .replace('width="215"', 'width="150"')
  .replace('width:215px', 'width:150px');

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function displayValue(value: string) {
  return value.trim() || NOT_PROVIDED;
}

function rowContent(label: string, content: string) {
  return `<tr><td valign="top" width="39%" style="padding:9px 12px 9px 14px;background:#f4f8fd;color:#101b2d;border-bottom:1px solid #b9cce2;font-size:14px;line-height:20px;font-weight:700">${escapeHtml(label)}</td><td valign="top" style="padding:9px 14px;background:#ffffff;color:#172238;border-bottom:1px solid #b9cce2;font-size:14px;line-height:20px;overflow-wrap:anywhere">${content}</td></tr>`;
}

function row(label: string, value: string) {
  return rowContent(label, escapeHtml(displayValue(value)).replace(/\r?\n/g, "<br>"));
}

function linkRow(label: string, text: string, href: string) {
  const safeText = displayValue(text);
  if (safeText === NOT_PROVIDED || !href) return row(label, safeText);
  return rowContent(label, `<a href="${escapeHtml(href)}" style="color:#075ccf;text-decoration:underline;font-weight:700">${escapeHtml(safeText)}</a>`);
}

function registrationRow(value: string) {
  const registration = value.trim();
  if (!registration) return row("Vehicle Reg", "");
  return rowContent("Vehicle Reg", `<span style="display:inline-block;min-width:126px;padding:3px 12px;background:#ffda18;border:1px solid #bf9100;border-radius:4px;color:#111827;font-size:18px;line-height:22px;font-weight:800;letter-spacing:1px;text-align:center">${escapeHtml(registration.toUpperCase())}</span>`);
}

function sectionCard(title: string, icon: string, rows: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 20px;border:1px solid #93b0d1;border-radius:10px;overflow:hidden"><tr><td style="padding:10px 14px;background:#071d37;color:#ffffff;font-size:18px;line-height:22px;font-weight:700">${icon}<span style="padding-left:10px">${escapeHtml(title)}</span></td></tr><tr><td><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse">${rows}</table></td></tr></table>`;
}

function siteUrl() {
  try {
    return new URL(SITE_URL);
  } catch {
    return new URL("https://enginesmarket.co.uk");
  }
}

export function normalizeSourcePage(value: string, trustedOrigins: readonly string[] = []) {
  if (!value) return "";

  try {
    const source = new URL(value, SITE_URL);
    const trustedSites = [siteUrl(), ...trustedOrigins.flatMap((origin) => {
      try {
        return [new URL(origin)];
      } catch {
        return [];
      }
    })];
    const sameSite = trustedSites.some(
      (trustedSite) =>
        source.hostname === trustedSite.hostname ||
        source.hostname.endsWith(`.${trustedSite.hostname}`),
    );

    if (!sameSite || !["http:", "https:"].includes(source.protocol)) return "";
    return source.toString();
  } catch {
    return "";
  }
}

function validEmail(value: string) {
  const email = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function validPhone(value: string) {
  const phone = value.trim();
  return /\d/.test(phone) ? phone : "";
}

function formatEngineCapacity(value: string) {
  const raw = value.trim().replace(/,/g, "");
  if (!raw) return "";

  const match = raw.match(/\d+(?:\.\d+)?/);
  if (!match) return "";

  const numericValue = Number(match[0]);
  if (!Number.isFinite(numericValue) || numericValue <= 0) return "";

  const isLitres = /litre|liter|\bl\b|l$/i.test(raw) && numericValue <= 20;
  const capacityCc = isLitres ? Math.round(numericValue * 1000) : Math.round(numericValue);
  if (capacityCc < 500 || capacityCc > 20000) return "";

  const litres = (capacityCc / 1000).toFixed(1);
  return `${capacityCc.toLocaleString("en-GB")} cc (${litres}L)`;
}

function buildAdditionalInformation(lead: UniversalLead) {
  const details = [
    lead.description,
    lead.vehicleTitle && lead.vehicleTitle !== lead.vehicleModel ? `Requested engine: ${lead.vehicleTitle}` : "",
    lead.engineCode ? `Engine code: ${lead.engineCode}` : "",
    lead.engineType ? `Engine type: ${lead.engineType}` : "",
    lead.fitting ? `Fitting: ${lead.fitting}` : "",
  ].filter(Boolean);

  return details.join("\n");
}

function receivedAtUk(date: Date) {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${formatted.replace(", ", " at ")} (UK)`;
}

function leadReference() {
  return `#EM-${randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

function plainTextValue(value: string) {
  return displayValue(value).replace(/\r?\n/g, "\n");
}

export function renderUniversalLeadEmail(lead: UniversalLead) {
  const configuredSite = siteUrl();
  const domain = configuredSite.hostname;
  const sourcePage = lead.sourcePage || `${SITE_URL}/`;
  const sourceSiteUrl = configuredSite.toString();
  const logoUrl = new URL("/branding/engine-market-logo-header-tight.png", configuredSite).toString();
  const engineImageUrl = new URL(
    "/images/shared/hero-engines/temporary-performance-engine-cutout.png",
    configuredSite,
  ).toString();
  const email = validEmail(lead.email);
  const phone = validPhone(lead.number);
  const additionalInformation = buildAdditionalInformation(lead);
  const engineCapacity = formatEngineCapacity(lead.engineCapacity);
  const reference = leadReference();
  const received = receivedAtUk(new Date());
  const vehicleName = [lead.vehicleBrand, lead.vehicleModel].filter(Boolean).join(" ").trim();
  const subject = ["New Lead", SITE_NAME, vehicleName, lead.vehicleVrm].filter(Boolean).join(" | ");

  const leadRows = [
    row("Name", lead.name),
    linkRow("Email", email, email ? `mailto:${encodeURIComponent(email)}` : ""),
    linkRow("Phone Number", phone, phone ? `tel:${encodeURIComponent(phone.replace(/\s+/g, ""))}` : ""),
    row("Postcode", lead.postcode),
    row("Additional Information", additionalInformation),
  ].join("");

  const vehicleRows = [
    registrationRow(lead.vehicleVrm),
    row("Vehicle Make", lead.vehicleBrand),
    row("Vehicle Model", lead.vehicleModel),
    row("Vehicle Year", lead.vehicleYear),
    row("Engine Capacity", engineCapacity),
    row("Fuel Type", lead.fuelType),
  ].join("");

  const sourceRows = [
    linkRow("Source", domain, sourceSiteUrl),
    linkRow("Page", sourcePage || "", sourcePage),
  ].join("");

  const leadCard = sectionCard("LEAD DETAILS", "&#128100;", leadRows);
  const vehicleCard = sectionCard("VEHICLE DETAILS", "&#128663;", vehicleRows);
  const sourceCard = sectionCard("SOURCE", "&#128279;", sourceRows);

  const html = REFINED_UNIVERSAL_EMAIL_TEMPLATE
    .replaceAll("{{SITE_NAME}}", escapeHtml(SITE_NAME))
    .replace("{{LOGO_URL}}", escapeHtml(logoUrl))
    .replace("{{ENGINE_IMAGE_URL}}", escapeHtml(engineImageUrl))
    .replace("{{LEAD_CARD}}", leadCard)
    .replace("{{VEHICLE_CARD}}", vehicleCard)
    .replace("{{SOURCE_CARD}}", sourceCard)
    .replace("{{LEAD_REFERENCE}}", escapeHtml(reference))
    .replace("{{RECEIVED_UK}}", escapeHtml(received));

  const text = [
    `${SITE_NAME} - New Quote Request`,
    "",
    "LEAD DETAILS",
    `Name: ${plainTextValue(lead.name)}`,
    `Email: ${plainTextValue(email)}`,
    `Phone Number: ${plainTextValue(phone)}`,
    `Postcode: ${plainTextValue(lead.postcode)}`,
    `Additional Information: ${plainTextValue(additionalInformation)}`,
    "",
    "VEHICLE DETAILS",
    `Vehicle Reg: ${plainTextValue(lead.vehicleVrm)}`,
    `Vehicle Make: ${plainTextValue(lead.vehicleBrand)}`,
    `Vehicle Model: ${plainTextValue(lead.vehicleModel)}`,
    `Vehicle Year: ${plainTextValue(lead.vehicleYear)}`,
    `Engine Capacity: ${plainTextValue(engineCapacity)}`,
    `Fuel Type: ${plainTextValue(lead.fuelType)}`,
    "",
    "SOURCE INFORMATION",
    `Source: ${domain} (${sourceSiteUrl})`,
    `Page: ${sourcePage || NOT_PROVIDED}`,
    "",
    `Lead reference: ${reference}`,
    `Received: ${received}`,
  ].join("\n");

  return { html, text, subject };
}
