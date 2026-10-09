"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function TradePage() {
  const { ready, authenticated, login } = usePrivy();
  const { marketId } = useParams<{ marketId: string }>();
  const side = useSearchParams().get("side") === "NO" ? "NO" : "YES";
  const [amount, setAmount] = useState("1");
  if (!ready) return <main className="min-h-screen p-8 text-arena-muted">Loading market…</main>;
  if (!authenticated) return <main className="grid min-h-screen place-items-center p-6"><button onClick={login} className="rounded-xl bg-arena-accent px-6 py-3 font-semibold text-white">Sign in to trade</button></main>;
  return <main className="min-h-screen p-6 sm:p-10"><section className="mx-auto max-w-md rounded-2xl border border-arena-border bg-arena-card p-6 sm:p-8"><p className="text-sm text-arena-muted">Market {marketId}</p><h1 className="mt-2 text-2xl font-bold">Buy {side} shares</h1><label className="mt-7 block text-sm font-medium">Amount (USDC)<input type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-2 w-full rounded-xl border border-arena-border bg-arena-bg p-4 outline-none focus:border-arena-accent" /></label><p className="mt-5 text-sm text-arena-muted">Trading requires a wallet-signing flow. Connect a Solana signer before enabling order submission.</p></section></main>;
}
