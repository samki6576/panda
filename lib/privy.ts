// lib/privy.ts
import { PrivyClient } from "@privy-io/server-auth";

export const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

export async function getUserIdFromToken(token: string) {
  const claims = await privy.verifyAuthToken(token);
  return claims.userId;
}

export async function userHasSolanaWallet(token: string, walletAddress: string) {
  const userId = await getUserIdFromToken(token);
  const user = await privy.getUser(userId);
  return user.linkedAccounts.some(
    (account) =>
      account.type === "wallet" &&
      account.chainType === "solana" &&
      account.address === walletAddress
  );
}


