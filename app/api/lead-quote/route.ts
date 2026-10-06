import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY =
  process.env.RESEND_API_KEY || "re_H5mQ46DK_M9Uctefx1Nefm9sB1AaKMAff";
const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Engines Market <sales@enginesmarket.co.uk>";
const LEAD_RECIPIENT_EMAIL =
  process.env.LEAD_EMAIL_RECIPIENT || process.env.SMTP_TO_EMAIL || "ef2crm@gmail.com";

const resend = new Resend(RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      postal,
      note,
      VRM,
      vehicle_make,
      vehicle_model,
      vehicle_year,
      vehicle_fuel,
      vehicle_fuel_capacity,
      siteName = "enginesmarket.co.uk",
      pageUrl = "",
    } = body;

    if (!name || !email || !phone || !postal) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required contact fields (Name, Email, Phone, Postal Code)." },
        { status: 400 }
      );
    }

    const rows = [
      ["Name", name],
      ["Email", email],
      ["Phone", phone],
      ["Postcode", postal],
      ["Registration", VRM],
      ["Make", vehicle_make],
      ["Model", vehicle_model],
      ["Year", vehicle_year],
      ["Fuel type", vehicle_fuel],
      ["Engine capacity", vehicle_fuel_capacity ? `${vehicle_fuel_capacity}.0L` : ""],
      ["Additional details", note],
      ["Exact source page", pageUrl || "https://enginesmarket.co.uk/blog"],
      ["Quote source", `Blog Sidebar Quote Form (${siteName})`],
    ]
      .filter(([, value]) => Boolean(value))
      .map(
        ([label, value]) =>
          `<tr><th style="padding:8px 12px;text-align:left;background:#f3f4f6;border:1px solid #e5e7eb;font-size:13px;">${escapeHtml(
            String(label)
          )}</th><td style="padding:8px 12px;border:1px solid #e5e7eb;font-size:13px;">${escapeHtml(
            String(value)
          )}</td></tr>`
      )
      .join("");

    const emailHtml = `
      <div style="font-family:Arial,sans-serif;padding:20px;color:#111;max-width:720px;margin:0 auto;">
        <h1 style="font-size:22px;margin:0 0 16px;color:#002244;">New Quote Request${VRM ? ` - ${VRM}` : ""} - ${siteName}</h1>
        <table style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #e5e7eb;">
          ${rows}
        </table>
        <p style="font-size:11px;color:#888;margin-top:20px;">Timestamp: ${new Date().toUTCString()}</p>
      </div>
    `;

    // 1. Dispatch Email via Resend
    let emailSent = false;
    let emailStatus = "Pending";
    let resendData = null;

    try {
      const { data, error } = await resend.emails.send({
        from: RESEND_FROM_EMAIL,
        to: [LEAD_RECIPIENT_EMAIL],
        replyTo: email,
        subject: `New Quote Request${VRM ? ` - ${VRM}` : ""} - ${siteName}`,
        html: emailHtml,
      });

      if (error) {
        emailStatus = `Resend Error: ${error.message}`;
        console.error("[RESEND ERROR]:", error);
      } else {
        emailSent = true;
        resendData = data;
        emailStatus = `Email successfully sent via Resend to ${LEAD_RECIPIENT_EMAIL}`;
      }
    } catch (resendErr: any) {
      emailStatus = `Resend Exception: ${resendErr.message}`;
    }

    // 2. Optional Supabase Webhook forwarding
    const supabaseWebhookUrl = process.env.SUPABASE_WEBHOOK_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    if (supabaseWebhookUrl) {
      try {
        await fetch(supabaseWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(supabaseAnonKey ? { Authorization: `Bearer ${supabaseAnonKey}` } : {}),
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            postcode: postal,
            vehicleVrm: VRM,
            vehicleBrand: vehicle_make,
            vehicleModel: vehicle_model,
            vehicleYear: vehicle_year,
            fuelType: vehicle_fuel,
            engineCapacity: vehicle_fuel_capacity,
            description: note,
            sourcePage: pageUrl,
            sourceLabel: `Blog Sidebar (${siteName})`,
          }),
        });
      } catch {}
    }

    return NextResponse.json({
      success: true,
      emailSent,
      emailStatus,
      resendId: resendData?.id || null,
      message: "Quote request submitted successfully!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process quote request." },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}