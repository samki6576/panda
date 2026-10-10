"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function TradePage() {
  const { ready, authenticated, login } = usePrivy();
  const { marketId } = useParams<{ marketId: string }>();
  const side = useSearchParams().get("side") === "NO" ? "NO" : "YES";
  const [amount, setAmount] = useState("1");

  if (!ready) {
    return <main className="grid min-h-screen place-items-center text-sm text-arena-muted">Loading market…</main>;
  }

  if (!authenticated) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <section className="w-full max-w-md rounded-lg border border-arena-border bg-arena-card p-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-arena-accent">Panta Creator</p>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Join the conversation.</h1>
          <p className="mt-3 text-sm leading-6 text-arena-muted">Sign in to continue to this market.</p>
          <button onClick={login} className="mt-7 w-full rounded-lg bg-arena-accent px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-arena-accent-hover">Sign in to continue</button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 pb-16">
      <section className="mx-auto mt-12 max-w-lg rounded-lg border border-arena-border bg-arena-card p-6 sm:mt-20 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-arena-muted">Prediction market</p>
        <p className="mt-3 break-all font-mono text-xs text-arena-muted">{marketId}</p>
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">Buy {side} shares</h1>
        <p className="mt-2 text-sm leading-6 text-arena-muted">Choose the amount you want to put behind your prediction.</p>
        <label className="mt-7 block text-sm font-medium">
          Amount <span className="text-arena-muted">(USDC)</span>
          <div className="mt-2 flex items-center rounded-lg border border-arena-border bg-arena-bg px-4 focus-within:border-arena-accent">
            <span className="font-mono text-sm text-arena-muted">$</span>
            <input type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} className="w-full bg-transparent p-3 text-sm outline-none" />
            <span className="font-mono text-xs text-arena-muted">USDC</span>
          </div>
        </label>
        <div className="mt-6 flex items-center justify-between rounded-lg border border-arena-border bg-arena-bg p-4">
          <span className="text-sm text-arena-muted">Your position</span>
          <span className={`text-sm font-semibold ${side === "YES" ? "text-arena-green" : "text-arena-red"}`}>{side}</span>
        </div>
        <p className="mt-5 rounded-lg border border-arena-border p-4 text-xs leading-5 text-arena-muted">Trading is in preview. Wallet signing and order submission are not enabled yet.</p>
      </section>
    </main>
  );
}
