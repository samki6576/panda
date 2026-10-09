// app/api/trade/buy/route.ts
import { NextRequest, NextResponse } from "next/server";
import { buildTradeTransaction } from "@/lib/panta";
import { userHasSolanaWallet } from "@/lib/privy";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "Sign in before trading." }, { status: 401 });
    const { marketId, side, amount, userWallet } = await req.json();
    if (typeof marketId !== "string" || !marketId.trim()) {
      return NextResponse.json({ error: "A market ID is required." }, { status: 400 });
    }
    if (side !== "YES" && side !== "NO") {
      return NextResponse.json({ error: "Side must be YES or NO." }, { status: 400 });
    }
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number." }, { status: 400 });
    }
    if (typeof userWallet !== "string" || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(userWallet)) {
      return NextResponse.json({ error: "A valid Solana wallet is required." }, { status: 400 });
    }
    if (!(await userHasSolanaWallet(token, userWallet))) {
      return NextResponse.json({ error: "This wallet is not linked to your account." }, { status: 403 });
    }

    // 1. Build unsigned transaction via Panta
    const { unsignedTransaction } = await buildTradeTransaction({
      marketId,
      side,
      amount,
      userWallet,
    });

    // 2. Return transaction to frontend for signing
    return NextResponse.json({ unsignedTransaction });
  } catch (error) {
    console.error("Trade build error:", error);
    return NextResponse.json({ error: "Unable to build the trade." }, { status: 502 });
  }
}

