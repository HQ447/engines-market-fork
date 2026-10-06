import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { reg } = await req.json();

    if (!reg || typeof reg !== "string" || !reg.trim()) {
      return NextResponse.json(
        { success: false, message: "Please provide a vehicle registration number." },
        { status: 400 }
      );
    }

    const cleanReg = reg.replace(/\s+/g, "").toUpperCase();
    const apiKey = "157be19933d191db7628a7a7afa10bc9";
    const url = `https://api.checkcardetails.co.uk/vehicledata/ukvehicledata?apikey=${apiKey}&vrm=${encodeURIComponent(cleanReg)}`;

    const res = await fetch(url, { headers: { Accept: "application/json" } });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: `Vehicle lookup service responded with status ${res.status}.` },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (!data || !data.VehicleRegistration) {
      return NextResponse.json(
        { success: false, message: data?.Message || "Vehicle details not found for this registration." },
        { status: 404 }
      );
    }

    const regData = data.VehicleRegistration;

    return NextResponse.json({
      success: true,
      data: {
        VRM: cleanReg,
        Make: regData.Make || "",
        Model: regData.Model || "",
        YearOfManufacture: regData.YearOfManufacture || "",
        FuelType: regData.FuelType || "",
        EngineCapacity: regData.EngineCapacity
          ? Math.round(Number(regData.EngineCapacity) / 1000)
          : "",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch vehicle data." },
      { status: 500 }
    );
  }
}