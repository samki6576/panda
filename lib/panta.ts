// lib/panta.ts
const PANTA_API_BASE_URL = process.env.PANTA_API_BASE_URL?.replace(/\/$/, "");
const PANTA_API_KEY = process.env.PANTA_API_KEY;

export class PantaApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "PantaApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function extractMarketId(response: unknown): string | undefined {
  function find(value: unknown, allowGenericId = false): string | undefined {
    if (Array.isArray(value)) {
      for (const item of value) {
        const nestedId = find(item, allowGenericId);
        if (nestedId) return nestedId;
      }
      return undefined;
    }
    if (!isRecord(value)) return undefined;

    for (const key of ["marketId", "market_id"]) {
      const marketId = value[key];
      if (typeof marketId === "string" && marketId.trim()) return marketId.trim();
    }

    // Panta may return a market directly, in a standard wrapper, or as an
    // element in a collection (for example `{ items: [{ marketId }] }`).
    for (const key of ["market", "markets", "data", "result", "items"]) {
      const nestedId = find(value[key], allowGenericId || key === "market" || key === "markets");
      if (nestedId) return nestedId;
    }

    const id = value.id;
    return allowGenericId && typeof id === "string" && id.trim() ? id.trim() : undefined;
  }

  return find(response, true);
}

async function pantaFetch(path: string, options: RequestInit = {}) {
  if (!PANTA_API_BASE_URL || !PANTA_API_KEY) {
    throw new Error("Panta is not configured. Set PANTA_API_BASE_URL and PANTA_API_KEY.");
  }

  const res = await fetch(`${PANTA_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": PANTA_API_KEY,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new PantaApiError(res.status, detail || "Panta rejected the request");
  }

  return res.json();
}

// --- Market Management ---
export async function createMarket(params: {
  question: string;
  expiry: string;
  initialLiquidityUsdc: string;
  creatorWallet: string;
}) {
  return pantaFetch(process.env.PANTA_MARKETS_PATH || "/markets", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function getMarket(marketId: string) {
  return pantaFetch(`/markets/${marketId}`);
}

export async function getMarketPrice(marketId: string) {
  return pantaFetch(`/markets/${marketId}/price`);
}

// --- Trading ---
export async function buildTradeTransaction(params: {
  marketId: string;
  side: "YES" | "NO";
  amount: number;
  userWallet: string;
}) {
  // Panta builds the unsigned transaction for the user to sign
  return pantaFetch("/trade/build", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function submitTrade(signedTransaction: string) {
  return pantaFetch("/trade/submit", {
    method: "POST",
    body: JSON.stringify({ signedTransaction }),
  });
}

// --- Positions & Claims ---
export async function getPositions(walletAddress: string) {
  return pantaFetch(`/positions/${walletAddress}`);
}

export async function checkClaimEligibility(marketId: string, wallet: string) {
  return pantaFetch(`/markets/${marketId}/claim-eligibility?wallet=${wallet}`);
}

export async function buildClaimTransaction(marketId: string, wallet: string) {
  return pantaFetch(`/markets/${marketId}/claim/build`, {
    method: "POST",
    body: JSON.stringify({ wallet }),
  });
}

export async function claimCreatorFees(marketId: string, creatorWallet: string) {
  return pantaFetch(`/markets/${marketId}/creator-fees/claim`, {
    method: "POST",
    body: JSON.stringify({ creatorWallet }),
  });
}
