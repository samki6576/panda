
<img width="1890" height="948" alt="Screenshot (191)" src="https://github.com/user-attachments/assets/c10b1e30-c26c-4dfa-a3e6-805018d5e9c6" />




<div align="center">

<img width="1920" height="938" alt="Panta Creator — Turn any post into a prediction market" src="https://github.com/user-attachments/assets/d202b785-c958-4c01-a095-6f5ef2bea39d" />

# Panta Creator

**Embed live prediction markets into any piece of content.**

A creator tool that turns blogs, newsletters, and social posts into interactive prediction markets — powered by the [Panta API](https://docs.panta.market/) on Solana.

[![Live Demo](https://img.shields.io/badge/Live_Demo-8B5CF6?style=for-the-badge&logo=vercel&logoColor=white)](https://panda-six-phi.vercel.app/)
[![Demo Video](https://img.shields.io/badge/Demo_Video-EF4444?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/3st4eGfaHdA)
[![Built on Solana](https://img.shields.io/badge/Built_on-Solana-14F195?style=for-the-badge&logo=solana&logoColor=black)](https://solana.com)
[![Powered by Panta](https://img.shields.io/badge/Powered_by-Panta_API-8B5CF6?style=for-the-badge)](https://panta.market)
[![License: MIT](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)

<sub>Built for <a href="https://colosseum.com">Colosseum Crypto World's Fair 2026</a></sub>

</div>

---

## Overview

Prediction markets have demonstrated real demand — Polymarket processed over **$1B in volume** during the 2024 US election cycle. Yet adoption remains confined to crypto-native users. The reason is not technical; it is structural. Prediction markets exist as **destinations**, requiring users to visit a separate platform, create an account, and fund a wallet before participating.

Meanwhile, content creators actively seek engagement tools beyond likes and comments. They already run informal prediction formats — polls, score predictions, Discord brackets — because engagement directly affects their reach and revenue.

Panta Creator closes this gap. It is a **distribution layer** that embeds prediction markets inside the content audiences already consume.

> The market is the context, not the product.

---


## How It Works

1. A creator signs in with email — Privy provisions an embedded Solana wallet in the background.
2. They define a question and expiry, then deploy the market on-chain via the Panta API.
3. They receive a single `<script>` tag to embed in any blog, newsletter, or CMS.
4. Their audience trades YES or NO directly inside the content — no redirect, no wallet setup, no crypto terminology.

---



## Features

| Feature | Description |
| :-- | :-- |
| **Email-only onboarding** | Privy provisions an embedded Solana wallet invisibly. No seed phrase, no browser extension. |
| **One-click market creation** | Define a question and expiry; the market deploys on-chain through the Panta API. |
| **Embeddable widget** | A single `<script>` tag works in Substack, Ghost, WordPress, and any custom CMS. |
| **Live pricing** | The widget displays real-time YES/NO prices sourced from Panta. |
| **Creator fee attribution** | Trades originating from an embed are attributed to the creator through Panta's fee system. |
| **Custody-safe design** | The server never holds user funds. Every transaction is signed client-side. |
| **Persistent storage** | PostgreSQL tracks creators, markets, and trades for auditing and analytics. |

---

## Architecture

```
<img width="1920" height="938" alt="Screenshot (192)" src="https://github.com/user-attachments/assets/be52de7d-afa0-4529-81f9-b08fa6e5c0c8" />
┌──────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER                           │
│  ┌───────────────┐   ┌──────────────┐   ┌─────────────────┐  │
│  │ Creator       │   │ Embeddable   │   │ Audience        │  │
│  │ Dashboard     │   │ Widget       │   │ Trade Page      │  │
│  │ (Next.js)     │   │ (vanilla JS) │   │ (Next.js)       │  │
│  └───────┬───────┘   └──────┬───────┘   └────────┬────────┘  │
└──────────┼──────────────────┼────────────────────┼───────────┘
           │                  │                    │
           ▼                  ▼                    ▼
┌──────────────────────────────────────────────────────────────┐
│                    API LAYER (Next.js routes)                │
│   /api/auth/sync   /api/markets/create   /api/trade/buy      │
└──────────┬──────────────────┬────────────────────┬───────────┘
           │                  │                    │
           ▼                  ▼                    ▼
    ┌───────────┐      ┌──────────────┐      ┌──────────────┐
    │ Postgres  │      │ Panta API    │      │ Privy        │
    │ (Neon)    │      │ (predictions)│      │ (auth)       │
    └───────────┘      └──────┬───────┘      └──────────────┘
                              │
                              ▼
                     ┌────────────────┐
                     │ Solana Network │
                     └────────────────┘
```

### Request lifecycle

| Layer | Responsibility |
| :-- | :-- |
| **Client** | Renders UI, requests unsigned transactions, signs with the embedded wallet |
| **API routes** | Verify Privy JWTs, proxy Panta calls, persist metadata to Postgres |
| **Panta API** | Handles market creation, pricing, transactions, positions, and fee attribution |
| **Solana** | Settles every market on-chain |
| **Privy** | Manages auth and embedded wallet infrastructure |
| **Postgres** | Stores creators, posts, and trade audit records |

---

## Panta API Integration

Panta provides the full prediction market infrastructure. This application builds only the creator and audience experience on top of it.

### Market creation

```ts
const market = await createMarket({
  question: "Will Bitcoin hit $100K by Friday?",
  expiry: "2026-10-15T00:00:00Z",
  initialLiquidityUsdc: "50000000", // 50 USDC
  creatorWallet: userSolanaAddress,
});
```
<img width="1920" height="938" alt="Screenshot (193)" src="https://github.com/user-attachments/assets/066df9ef-743e-4acd-bbca-dbc754c9c677" />

### Trading flow

Panta does not custody user funds. Every signature originates from the user's wallet.

1. User selects **YES** or **NO** inside the widget.
2. The backend requests an unsigned Solana transaction from Panta.
3. The unsigned transaction is returned to the client.
4. The user's Privy embedded wallet signs it.
5. The signed transaction is broadcast to Solana.
6. The transaction signature is reported back to Panta via `/trades/report`.

### Endpoints in use

| Status | Capability |
| :--: | :-- |
| ✅ | Market creation |
| ✅ | Market discovery and metadata |
| ✅ | Live price retrieval |
| ✅ | Building user transactions |
| ✅ | Reading wallet positions |
| ✅ | Claiming creator fees |
| 🔄 | Trade attribution *(in progress)* |

---
<img width="1920" height="1080" alt="Screenshot (188)" src="https://github.com/user-attachments/assets/74729791-1723-4adf-91c5-2673e0f6d6f8" />
<img width="1833" height="957" alt="Screenshot (189)" src="https://github.com/user-attachments/assets/dbf32c27-61a7-4c54-afef-22025b4470b2" />

## Tech Stack

<table>
<tr>
<td valign="top" width="33%">

**Frontend**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS

</td>
<td valign="top" width="33%">

**Backend**
- Next.js API Routes (Node.js)
- PostgreSQL (Neon serverless)
- `pg` (node-postgres)
- `@privy-io/server-auth`

</td>
<td valign="top" width="33%">

**Infrastructure**
- Panta API
- Solana
- Privy
- Vercel
- Neon

</td>
</tr>
</table>

---

## Getting Started

### Prerequisites

- Node.js 20 or later
- A [Neon](https://neon.tech) PostgreSQL database (free tier)
- A [Privy](https://dashboard.privy.io) application (free tier)
- A Panta API key — see the [Panta documentation](https://docs.panta.market)

### Installation

```bash
git clone https://github.com/samki6576/panda.git
cd panda
npm install
```

### Configuration

Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Privy
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# Panta API
PANTA_API_BASE_URL=https://live-api.panta.market/api/v1
PANTA_API_KEY=pk_test_your_key_here

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
```

> **Note:** `.env.local` is gitignored. Never commit secrets.

### Database initialization

```bash
node scripts/init-db.js
```

Creates the `creators`, `posts`, and `trades` tables.

### Running locally

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Verifying integrations

```bash
node scripts/test-db.js      # Confirms Postgres connectivity
node scripts/test-panta.js   # Confirms Panta API key and endpoint
```

Both scripts should return a success status.

---

## Project Structure

```
panta-creator-tool/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── dashboard/page.tsx          # Creator dashboard
│   ├── trade/[marketId]/page.tsx   # Trade page
│   ├── providers.tsx               # Privy provider
│   └── api/
│       ├── auth/sync/route.ts      # Creator record creation on login
│       ├── markets/create/route.ts # Market creation via Panta
│       ├── markets/[id]/price/     # Live price retrieval
│       └── trade/buy/route.ts      # Trade transaction builder
├── lib/
│   ├── db.ts                       # Postgres pool and query helper
│   ├── panta.ts                    # Panta API client
│   └── privy.ts                    # Privy server client
├── public/
│   └── embed.js                    # Embeddable widget script
├── scripts/
│   ├── init-db.js                  # Table creation
│   ├── test-db.js                  # Database connectivity check
│   └── test-panta.js               # Panta API check
└── .env.local                      # Secrets (not committed)
```

---

## Design System

The interface follows a minimal, high-contrast aesthetic inspired by Linear and Vercel.

| Token | Value | Usage |
| :-- | :-- | :-- |
| Background | `#0A0A0A` | Page canvas |
| Surface | `#161616` | Cards and panels |
| Border | `#2A2A2A` | Section separation |
| Accent | `#8B5CF6` | Primary actions |
| Success | `#22C55E` | YES positions |
| Danger | `#EF4444` | NO positions |
| Typeface | Inter | All text |

Depth is achieved through borders and spacing rather than shadows.

---

## Roadmap

**Shipped**
- [x] Creator authentication via Privy
- [x] End-to-end market creation through the Panta API
- [x] Persistent storage for creators, markets, and trades
- [x] Embeddable widget with live odds

**In progress**
- [ ] Full trade signing flow with Privy Solana hooks
- [ ] Trade attribution reporting to Panta

**Planned**
- [ ] Substack plugin for one-click embedding
- [ ] Streaming payouts to creators as markets resolve
- [ ] Telegram bot for community-driven market creation
- [ ] Creator analytics: engagement, volume, retention
- [ ] Mainnet deployment with Panta's production API

---

## Security Model

- **Server never holds private keys.** All transactions are signed in the user's Privy embedded wallet.
- **Panta API key is server-side only.** It is never exposed to the client bundle.
- **Privy JWTs are verified** on every authenticated API request.
- **Database credentials** live in environment variables, never in source.
- **Creator isolation** — creators can only view and modify their own markets.

---

## Scripts

| Command | Description |
| :-- | :-- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `node scripts/init-db.js` | Create database tables |
| `node scripts/test-db.js` | Verify Postgres connectivity |
| `node scripts/test-panta.js` | Verify Panta API access |

---

## Acknowledgements

- [Panta](https://panta.market) — prediction market infrastructure on Solana
- [Privy](https://privy.io) — authentication and embedded wallets
- [Neon](https://neon.tech) — serverless PostgreSQL
- [Colosseum](https://colosseum.com) — Crypto World's Fair 2026

---

## License

Released under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">
<sub>Built for <a href="https://colosseum.com">Colosseum Crypto World's Fair 2026</a></sub>
</div>
```

---


