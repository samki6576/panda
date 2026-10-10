// app/api/markets/create/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { userHasSolanaWallet } from "@/lib/privy";
import { createMarket, extractMarketId, PantaApiError } from "@/lib/panta";
import { query } from "@/lib/db";

function objectKeys(value: unknown): string[] {
  return typeof value === "object" && value !== null ? Object.keys(value) : [];
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Missing auth" }, { status: 401 });
    const { question, expiry, creatorWalletAddress } = await req.json();
    const normalizedQuestion = typeof question === "string" ? question.trim() : "";
    const expiryDate = new Date(expiry);

    if (!normalizedQuestion || normalizedQuestion.length > 140) {
      return NextResponse.json({ error: "Question must be 1-140 chars" }, { status: 400 });
    }
    if (!expiry || Number.isNaN(expiryDate.valueOf()) || expiryDate <= new Date()) {
      return NextResponse.json({ error: "Expiry must be future" }, { status: 400 });
    }
    if (typeof creatorWalletAddress !== "string" ||
        !(await userHasSolanaWallet(token, creatorWalletAddress))) {
      return NextResponse.json({ error: "A Solana wallet linked to your account is required." }, { status: 403 });
    }

    const creator = await query("SELECT id FROM creators WHERE wallet_address = $1", [creatorWalletAddress]);
    if (!creator.rows[0]) {
      return NextResponse.json({ error: "Your creator profile is still syncing. Please try again." }, { status: 409 });
    }

    const pantaResponse = await createMarket({
      question: normalizedQuestion,
      expiry,
      initialLiquidityUsdc: "50000000",
      creatorWallet: creatorWalletAddress,
    });

    const marketId = extractMarketId(pantaResponse);
    if (!marketId) {
      const responseObject = pantaResponse && typeof pantaResponse === "object"
        ? pantaResponse as Record<string, unknown>
        : undefined;
      const responseShape = {
        topLevelKeys: objectKeys(pantaResponse),
        marketKeys: objectKeys(responseObject?.market),
        dataKeys: objectKeys(responseObject?.data),
        resultKeys: objectKeys(responseObject?.result),
      };
      console.error("Panta create response did not contain a market ID:", responseShape);
      return NextResponse.json(
        { error: "Panta created the market but did not return a recognizable market ID." },
        { status: 502 }
      );
    }

    const result = await query(
      `INSERT INTO posts (creator_id, title, market_id, status)
       VALUES ($1, $2, $3, 'draft')
       RETURNING id, market_id`,
      [creator.rows[0].id, normalizedQuestion, marketId]
    );

    return NextResponse.json({
      postId: result.rows[0].id,
      marketId,
    });
  } catch (error) {
    console.error("Market create error:", error);
    if (error instanceof PantaApiError && error.status === 401) {
      return NextResponse.json(
        { error: "The Panta API key was rejected. Update PANTA_API_KEY and restart the server." },
        { status: 502 }
      );
    }
    return NextResponse.json({ error: "Unable to create the market. Please try again." }, { status: 502 });
  }
}
