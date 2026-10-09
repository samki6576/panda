import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { userHasSolanaWallet } from "@/lib/privy";

export const runtime = "nodejs";

const solanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ error: "Sign in before syncing your account." }, { status: 401 });

    const { walletAddress } = await req.json();
    if (typeof walletAddress !== "string" || !solanaAddress.test(walletAddress)) {
      return NextResponse.json({ error: "A valid Solana wallet address is required." }, { status: 400 });
    }
    if (!(await userHasSolanaWallet(token, walletAddress))) {
      return NextResponse.json({ error: "This wallet is not linked to your account." }, { status: 403 });
    }

    const result = await query(
      `INSERT INTO creators (wallet_address)
       VALUES ($1)
       ON CONFLICT (wallet_address) DO UPDATE SET wallet_address = EXCLUDED.wallet_address
       RETURNING id, wallet_address`,
      [walletAddress]
    );
    return NextResponse.json({ creator: result.rows[0] });
  } catch (error) {
    console.error("Auth sync error:", error);
    return NextResponse.json(
      { error: "We could not sync your creator profile. Check the database connection and try again." },
      { status: 503 }
    );
  }
}
