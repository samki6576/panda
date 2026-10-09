import { NextRequest, NextResponse } from "next/server";
import { submitTrade } from "@/lib/panta";
import { query } from "@/lib/db";
import { userHasSolanaWallet } from "@/lib/privy";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "Sign in before trading." }, { status: 401 });
    const { signedTransaction, marketId, userWallet, side, amount } =
      await req.json();

    if (typeof signedTransaction !== "string" || !signedTransaction.trim()) {
      return NextResponse.json({ error: "A signed transaction is required." }, { status: 400 });
    }
    if (typeof marketId !== "string" || !marketId.trim() ||
        typeof userWallet !== "string" || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(userWallet) ||
        (side !== "YES" && side !== "NO") ||
        typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Trade details are invalid." }, { status: 400 });
    }
    if (!(await userHasSolanaWallet(token, userWallet))) {
      return NextResponse.json({ error: "This wallet is not linked to your account." }, { status: 403 });
    }

    const result = await submitTrade(signedTransaction);

    await query(
      `INSERT INTO trades (market_id, user_wallet, side, amount, tx_signature)
       VALUES ($1, $2, $3, $4, $5)`,
      [marketId, userWallet, side, amount, result.txSignature]
    );

    return NextResponse.json({ txSignature: result.txSignature });
  } catch (error) {
    console.error("Trade submit error:", error);
    return NextResponse.json({ error: "Unable to submit the trade." }, { status: 502 });
  }
}
