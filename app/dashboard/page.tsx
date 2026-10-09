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

  if (!ready) return <div className="p-8 text-arena-muted">Loading...</div>;

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect to Enter the Arena</h2>
          <button onClick={login} className="bg-arena-accent hover:bg-arena-accent-hover text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            Login with Email
          </button>
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
    <div className="min-h-screen p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Creator Dashboard</h1>
        <button onClick={logout} className="text-arena-muted hover:text-arena-text transition-colors">Logout</button>
      </div>

      <div className="bg-arena-card border border-arena-border rounded-xl p-6 max-w-2xl">
        <h2 className="text-xl font-semibold mb-6">Create Prediction Market</h2>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Will Real Madrid win tonight?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full bg-arena-bg border border-arena-border rounded-lg p-4 text-arena-text placeholder-arena-muted focus:border-arena-accent focus:outline-none transition-colors"
          />
          <input
            type="datetime-local"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full bg-arena-bg border border-arena-border rounded-lg p-4 text-arena-text focus:border-arena-accent focus:outline-none transition-colors"
          />
          <button
            onClick={handleCreateMarket}
            disabled={creating || syncing || !synced || !question || !expiry}
            className="w-full bg-arena-accent hover:bg-arena-accent-hover text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? "Creating..." : syncing ? "Preparing account..." : "Create Market"}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-900/50 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
            {error}
          </div>
        )}

        {market && (
          <div className="mt-6 bg-arena-bg border border-arena-green rounded-lg p-4">
            <p className="text-arena-green font-semibold mb-2">Market Created!</p>
            <p className="text-arena-muted text-sm mb-2">Market ID: {market.marketId}</p>
            <p className="text-arena-muted text-sm mb-2">Embed this in your post:</p>
            <code className="block bg-black p-3 rounded text-xs text-arena-text overflow-x-auto">
              {`<script src="https://your-domain.com/embed.js?market=${market.marketId}"></script>`}
            </code>
          </div>
        )}
      </div>
    </div>
  );
}
