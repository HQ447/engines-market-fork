import { NextResponse } from "next/server";
import { navMenus } from "@/lib/navData";
import { footerNavigation } from "@/lib/navigation";

export async function GET() {
  return NextResponse.json(
    { navMenus, footerNavigation },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    },
  );
}
