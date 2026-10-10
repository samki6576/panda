// app/dashboard/page.tsx
"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy();
  const [question, setQuestion] = useState("");
  const [expiry, setExpiry] = useState("");
  const [creating, setCreating] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [market, setMarket] = useState<{ marketId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- NEW: Sync creator on login ---
  useEffect(() => {
    async function syncUser() {
      if (!authenticated || !user) return;
      
      // Find the real Solana wallet address from Privy
      const solWallet = user.linkedAccounts?.find(
        (account) => account.type === "wallet" && account.chainType === "solana"
      );
      const walletAddress = solWallet && "address" in solWallet ? solWallet.address : undefined;
      
      if (walletAddress) {
        setSyncing(true);
        try {
          const token = await getAccessToken();
          const response = await fetch("/api/auth/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({ walletAddress }),
          });
          const data = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(data.error ?? "Unable to sync your creator profile.");
          setSynced(true);
        } catch (syncError) {
          setSynced(false);
          setError(syncError instanceof Error ? syncError.message : "Unable to sync your creator profile.");
        } finally {
          setSyncing(false);
        }
      }
    }
    syncUser();
  }, [authenticated, user, getAccessToken]);
  // -----------------------------------

  if (!ready) return <div className="grid min-h-screen place-items-center text-sm text-arena-muted">Loading creator studio…</div>;

  if (!authenticated) {
    return (
      <div className="min-h-screen px-6">
        <div className="mx-auto flex min-h-[75vh] max-w-7xl items-center">
          <section className="w-full max-w-lg rounded-lg border border-arena-border bg-arena-card p-8 sm:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-arena-accent">Creator studio</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Your next market starts here.</h1>
            <p className="mt-3 text-sm leading-6 text-arena-muted">Sign in to create a prediction market and share it with your audience.</p>
            <button onClick={login} className="mt-8 w-full rounded-lg bg-arena-accent px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-arena-accent-hover">
              Continue with email <span aria-hidden="true" className="ml-2">→</span>
            </button>
          </section>
        </div>
      </div>
    );
  }

  async function handleCreateMarket() {
    setCreating(true);
    setError(null);
    try {
      const accessToken = await getAccessToken();
      const solWallet = user?.linkedAccounts?.find(
        (account) => account.type === "wallet" && account.chainType === "solana"
      );
      const walletAddress = solWallet && "address" in solWallet ? solWallet.address : undefined;

      if (!walletAddress) {
        setError("No Solana wallet found. Please try logging out and in again.");
        setCreating(false);
        return;
      }

      const res = await fetch("/api/markets/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify({ 
          question, 
          expiry, 
          creatorWalletAddress: walletAddress
        }),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { 
        console.error("Non-JSON response:", text);
        setError(`Server error (${res.status})`);
        return; 
      }

      if (!res.ok) { setError(data.error ?? "Request failed"); return; }
      setMarket(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create the market.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen px-6 pb-16">
      <header className="mx-auto flex max-w-7xl items-center justify-between border-b border-arena-border py-6">
        <button onClick={logout} className="rounded-lg border border-arena-border px-4 py-2 text-sm text-arena-muted transition-colors hover:bg-arena-card hover:text-white">Sign out</button>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(340px,440px)] lg:gap-16 lg:pt-20">
        <section className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-arena-accent">Creator studio / New market</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Make a question worth watching.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-arena-muted">Give your community a clear outcome to follow. Set the question, choose when it resolves, and share the market wherever you publish.</p>

          <div className="mt-10 flex items-start gap-4 border-t border-arena-border pt-6">
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-arena-border text-xs font-medium text-arena-accent">01</span>
            <div>
              <p className="text-sm font-medium">One clear yes-or-no question</p>
              <p className="mt-1 text-sm leading-6 text-arena-muted">Keep the outcome specific and easy to verify.</p>
            </div>
          </div>
          <div className="mt-5 flex items-start gap-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-arena-border text-xs font-medium text-arena-accent">02</span>
            <div>
              <p className="text-sm font-medium">A future resolution date</p>
              <p className="mt-1 text-sm leading-6 text-arena-muted">Your audience has a clear window to participate.</p>
            </div>
          </div>
        </section>

        <section className="h-fit rounded-lg border border-arena-border bg-arena-card p-6 sm:p-8">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Market details</h2>
              <p className="mt-1 text-sm text-arena-muted">Fill in the essentials to get started.</p>
            </div>
            <span className="rounded-full border border-arena-border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-arena-muted">Draft</span>
          </div>

          <div className="space-y-5">
            <label className="block text-sm font-medium">
              Market question
              <input
                type="text"
                placeholder="Will Real Madrid win tonight?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="mt-2 w-full rounded-lg border border-arena-border bg-arena-bg px-4 py-3.5 text-sm text-arena-text placeholder:text-arena-muted/70 focus:border-arena-accent focus:outline-none"
              />
            </label>
            <label className="block text-sm font-medium">
              Resolution date
              <input
                type="datetime-local"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="mt-2 w-full rounded-lg border border-arena-border bg-arena-bg px-4 py-3.5 text-sm text-arena-text focus:border-arena-accent focus:outline-none"
              />
            </label>
            <button
              onClick={handleCreateMarket}
              disabled={creating || syncing || !synced || !question || !expiry}
              className="w-full rounded-lg bg-arena-accent px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-arena-accent-hover disabled:cursor-not-allowed disabled:opacity-45"
            >
              {creating ? "Creating market…" : syncing ? "Preparing account…" : "Create market"}
              {!creating && !syncing && <span aria-hidden="true" className="ml-2">→</span>}
            </button>
            <p className="text-center text-xs text-arena-muted">Your linked Solana wallet is required to create a market.</p>
          </div>

          {error && (
            <div role="alert" className="mt-5 rounded-lg border border-arena-red/30 bg-arena-red/10 p-3.5 text-sm leading-6 text-red-200">
              {error}
            </div>
          )}

          {market?.marketId && (
            <div className="mt-6 rounded-lg border border-arena-green/30 bg-arena-green/5 p-4">
              <p className="text-sm font-semibold text-arena-green">Market created</p>
              <p className="mt-2 break-all font-mono text-xs text-arena-muted">{market.marketId}</p>
              <p className="mb-2 mt-4 text-xs text-arena-muted">Embed this market in your post</p>
              <code className="block overflow-x-auto rounded-md border border-arena-border bg-arena-bg p-3 text-xs text-arena-text">
                {`<script src="https://your-domain.com/embed.js?market=${market.marketId}"></script>`}
              </code>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
