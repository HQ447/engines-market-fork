import { NextResponse, type NextRequest } from "next/server";

const CONFIGURED_API_KEY = process.env.CHECKCARDETAILS_API_KEY ?? process.env.API_KEY ?? "";
const API_KEY =
  CONFIGURED_API_KEY ||
  process.env.CHECKCARDETAILS_LEGACY_API_KEY ||
  "157be19933d191db7628a7a7afa10bc9";
const BASE_URL = CONFIGURED_API_KEY
  ? process.env.CHECKCARDETAILS_BASE_URL ??
    process.env.BASE_URL ??
    "https://api.checkcardetails.co.uk/vehicledata/vehicleregistration"
  : "https://api.checkcardetails.co.uk/vehicledata/ukvehicledata";

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

function cleanRegistration(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringifyField(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function findField(source: unknown, keys: string[]): unknown {
  if (!isRecord(source)) return undefined;

  const normalizedKeys = keys.map((key) => key.toLowerCase());

  for (const [key, value] of Object.entries(source)) {
    if (normalizedKeys.includes(key.toLowerCase())) {
      return value;
    }
  }

  for (const value of Object.values(source)) {
    if (isRecord(value)) {
      const match = findField(value, keys);
      if (match !== undefined) return match;
    }
  }

  return undefined;
}

function normalizeVehicleData(raw: unknown, fallbackRegistration: string): VehicleRegistrationData {
  return {
    registrationNumber:
      stringifyField(findField(raw, ["registrationNumber", "registration", "regNumber", "vrm"])) ||
      fallbackRegistration,
    year: stringifyField(findField(raw, ["yearOfManufacture", "year", "manufactureYear"])),
    make: stringifyField(findField(raw, ["make"])),
    model: stringifyField(findField(raw, ["model"])),
    fuelType: stringifyField(findField(raw, ["fuelType", "fuel"])),
    engineCapacity: stringifyField(findField(raw, ["engineCapacity", "engineSize", "cc"])),
    color: stringifyField(findField(raw, ["colour", "color"])),
    wheelplan: stringifyField(findField(raw, ["wheelplan", "wheelPlan"])),
  };
}

export async function GET(request: NextRequest) {
  const registrationNumber = cleanRegistration(request.nextUrl.searchParams.get("registrationNumber") ?? "");

  if (!registrationNumber) {
    return NextResponse.json({ error: "Registration number is required." }, { status: 400 });
  }

  if (!API_KEY) {
    return NextResponse.json(
      { error: "Vehicle registration lookup is not configured." },
      { status: 503 },
    );
  }

  const lookupUrl = new URL(BASE_URL);
  lookupUrl.searchParams.set("apikey", API_KEY);
  lookupUrl.searchParams.set("registrationNumber", registrationNumber);
  lookupUrl.searchParams.set("vrm", registrationNumber);

  let response: Response;
  try {
    response = await fetch(lookupUrl, {
      headers: {
        Accept: "application/json",
        "x-api-key": API_KEY,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
  } catch (error) {
    console.error("Vehicle registration lookup failed", error);
    return NextResponse.json(
      { error: "The vehicle lookup service is temporarily unavailable. Please try again." },
      { status: 502 },
    );
  }

  const text = await response.text();
  let payload: unknown = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const providerMessage = isRecord(payload) ? stringifyField(findField(payload, ["message", "error"])) : "";
    return NextResponse.json(
      {
        error: providerMessage || "Vehicle lookup failed.",
        details: process.env.NODE_ENV === "development" && typeof payload === "string" ? payload : undefined,
      },
      { status: response.status },
    );
  }

  const vehicle = normalizeVehicleData(payload, registrationNumber);

  if (!vehicle.make && !vehicle.model) {
    return NextResponse.json({ error: "No vehicle details found for this registration." }, { status: 404 });
  }

  return NextResponse.json({ vehicle });
}
