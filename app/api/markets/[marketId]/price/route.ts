import { NextRequest, NextResponse } from "next/server";
import { getMarketPrice, PantaApiError } from "@/lib/panta";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, ctx: RouteContext<"/api/markets/[marketId]/price">) {
  try {
    const { marketId } = await ctx.params;
    return NextResponse.json(await getMarketPrice(marketId));
  } catch (error) {
    const status = error instanceof PantaApiError ? 502 : 500;
    return NextResponse.json({ error: "Unable to load the market price." }, { status });
  }
}
