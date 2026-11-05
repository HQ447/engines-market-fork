import { handleQuoteRequest } from "@/lib/quoteLead";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleQuoteRequest(request);
}
