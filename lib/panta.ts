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
  function find(value: unknown): string | undefined {
    if (!isRecord(value)) return undefined;

    const marketId = value.marketId;
    if (typeof marketId === "string" && marketId.trim()) return marketId.trim();

    for (const key of ["market", "data", "result"]) {
      const nestedId = find(value[key]);
      if (nestedId) return nestedId;
    }

    const id = value.id;
    return typeof id === "string" && id.trim() ? id.trim() : undefined;
  }

  return find(response);
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
