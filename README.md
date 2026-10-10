# Called It / Panta Creator

> **Turn any post into a prediction market.**
> A creator tool that embeds live prediction markets into blogs, newsletters, and social posts — powered by the Panta API on Solana.

---

## 🎯 What It Is

**Panta Creator** (working title: *Called It*) lets content creators attach a live prediction market to any piece of content in one click.

A sports blogger writes *"Will Real Madrid win tonight?"* and their audience trades YES/NO directly inside the post — no redirect, no new platform, no crypto learning curve.

- **Creators** earn a share of trading fees and get a new interactive format that didn't exist on Substack, YouTube, or X
- **Audiences** get skin in the game without leaving the content they're consuming
- **Panta** gets a distribution channel that onboards mainstream users on-chain

> Built solo for **Colosseum Crypto World's Fair 2026** — [live demo](https://panda-six-phi.vercel.app/)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Email-only onboarding** | Sign in with email — Privy creates an invisible Solana wallet in the background |
| **One-click market creation** | Enter a question, pick an expiry, click Create. The market is deployed on-chain via the Panta API |
| **Embeddable widget** | Copy a single `<script>` tag and paste it into any blog, Substack, or CMS |
| **Live odds** | Widget displays real-time YES/NO prices pulled from Panta |
| **Creator fee attribution** | Trades made through the embed are attributed back to the creator |
| **Dark-mode dashboard** | Clean Linear/Vercel-inspired UI, built with Tailwind CSS |
| **Persistent storage** | Postgres tracks every creator, market, and trade for auditing and analytics |

---

## 🏗️ Architecture

```
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
│   /api/auth/sync  /api/markets/create  /api/trade/buy        │
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

---

## 🔧 Tech Stack

**Frontend**
- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS (custom dark palette)
- Privy React SDK (email auth + embedded Solana wallets)

**Backend**
- Next.js API Routes (Node.js runtime)
- PostgreSQL (Neon serverless)
- `pg` (node-postgres)
- `@privy-io/server-auth` for JWT verification

**Integrations**
- **Panta API** — market creation, pricing, trading, positions, creator fees
- **Solana** — every market is settled on-chain
- **Privy** — invisible wallet onboarding

**Deployment**
- Vercel (frontend + API)
- Neon (database)

---

## 🚀 Quickstart

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) PostgreSQL database (free tier)
- A [Privy](https://dashboard.privy.io) app (free tier)
- A Panta API key (see [Panta docs](https://docs.panta.market))

### 1. Clone and install

```bash
git clone https://github.com/samki6576/panda.git
cd panda
npm install
```

### 2. Configure environment

Create `.env.local` in the project root:

```env
# Database (Neon connection string)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Privy — get from dashboard.privy.io
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# Panta API
PANTA_API_BASE_URL=https://live-api.panta.market/api/v1
PANTA_API_KEY=pk_test_your_key_here

# Solana RPC (free devnet endpoint)
SOLANA_RPC_URL=https://api.devnet.solana.com
```

> ⚠️ **Never commit `.env.local`.** It's already in `.gitignore`.

### 3. Initialize the database

```bash
node scripts/init-db.js
```

This creates the `creators`, `posts`, and `trades` tables.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Test the Panta integration

```bash
node scripts/test-panta.js
```

You should see `Status: 200` and a list of sandbox markets.

---

## 📁 Project Structure

```
panta-creator-tool/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── dashboard/page.tsx          # Creator dashboard
│   ├── trade/[marketId]/page.tsx   # Trade page (opened from widget)
│   ├── providers.tsx               # Privy provider
│   └── api/
│       ├── auth/sync/route.ts      # Creates a creator row on login
│       ├── markets/create/route.ts # Creates a market via Panta
│       ├── markets/[id]/price/     # Fetches live odds
│       └── trade/buy/route.ts      # Builds trade transaction
├── lib/
│   ├── db.ts                       # Postgres pool + query helper
│   ├── panta.ts                    # Panta API client
│   └── privy.ts                    # Privy server client
├── public/
│   └── embed.js                    # Embeddable widget script
├── scripts/
│   ├── init-db.js                  # Creates tables
│   ├── test-db.js                  # Verifies DB connection
│   └── test-panta.js               # Verifies Panta key
└── .env.local                      # Your secrets (not committed)
```

---

## 🔌 How the Panta Integration Works

Panta handles all on-chain complexity. Our app only builds the creator experience.

**Creating a market:**

```ts
const market = await createMarket({
  question: "Will Bitcoin hit $100K by Friday?",
  expiry: "2026-10-15T00:00:00Z",
  initialLiquidityUsdc: "50000000", // 50 USDC
  creatorWallet: userSolanaAddress,
});
```

**Trading flow (custody-safe):**

1. User clicks YES or NO in the widget
2. Our backend asks Panta to build an **unsigned** Solana transaction
3. The transaction is returned to the client
4. The user's Privy embedded wallet signs it
5. The signed transaction is broadcast to Solana
6. We report the signature back to Panta via `/trades/report`

**Panta never custodies user funds.** Every signature comes from the user's own wallet.

---

## 🎨 Design Philosophy

The UI is intentionally minimal — Linear and Vercel inspired.

- **Dark mode first.** Background `#0A0A0A`, cards `#161616`, borders `#2A2A2A`
- **Purple accent** (`#8B5CF6`) used sparingly for primary CTAs
- **Green/red** (`#22C55E` / `#EF4444`) reserved for YES/NO
- **Inter font** throughout
- **No drop shadows.** Depth comes from borders and spacing
- **Generous whitespace.** Every card gets room to breathe

---

## 🗺️ Roadmap

- [x] Creator login via Privy (email + invisible Solana wallet)
- [x] Market creation end-to-end via the Panta API
- [x] Persistent storage of creators, markets, trades
- [x] Embeddable widget with live odds
- [ ] Full trade signing flow with Privy Solana hooks
- [ ] Substack plugin — one-click market embedding
- [ ] Streaming payouts to creators as markets resolve
- [ ] Telegram bot so community managers can launch markets from chat
- [ ] Creator analytics: engagement, volume, retention per market
- [ ] Mainnet launch with Panta's production API

---

## 🔐 Security Notes

- **No private keys ever touch the server.** All signing happens in the user's Privy wallet
- **Panta API key** is stored server-side only (never exposed to the client)
- **Privy JWT** is verified on every authenticated API call via `@privy-io/server-auth`
- **Database credentials** live in `.env.local` (local) and Vercel env vars (production)
- **Row-level creator isolation** — creators can only see and modify their own markets

---

## 🧪 Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `node scripts/init-db.js` | Create database tables |
| `node scripts/test-db.js` | Verify Postgres connection |
| `node scripts/test-panta.js` | Verify Panta API key and endpoint |

---

## 🙏 Acknowledgements

- **[Panta](https://panta.market)** — prediction market infrastructure on Solana
- **[Privy](https://privy.io)** — invisible wallet onboarding
- **[Neon](https://neon.tech)** — serverless PostgreSQL
- **[Colosseum](https://colosseum.com)** — Crypto World's Fair 2026

---

## 📄 License

MIT

---

<p align="center">
  <strong>Built solo for Colosseum Crypto World's Fair 2026</strong><br/>
  <em>Prediction markets don't need better technology. They need distribution.</em>
</p>

---

**⭐ If this project helped you, consider giving it a star.**