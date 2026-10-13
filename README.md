<img width="1920" height="938" alt="Screenshot (192)" src="https://github.com/user-attachments/assets/d202b785-c958-4c01-a095-6f5ef2bea39d" /># README.md


---

```markdown
<div align="center">

# Panta Creator

### Turn any post into a prediction market.

A creator tool that embeds live prediction markets into blogs, newsletters, and social posts — powered by the [Panta API](https://docs.panta.market/) on Solana.

[![Live Demo](https://img.shields.io/badge/Live-Demo-8B5CF6?style=for-the-badge)](https://panda-six-phi.vercel.app/)
[![Demo Video](https://img.shields.io/badge/Watch-Demo_Video-EF4444?style=for-the-badge)](https://youtu.be/3st4eGfaHdA)
[![Built on Solana](https://img.shields.io/badge/Built_on-Solana-14F195?style=for-the-badge)](https://solana.com)
[![Powered by Panta](https://img.shields.io/badge/Powered_by-Panta_API-8B5CF6?style=for-the-badge)](https://panta.market)

**Built solo for [Colosseum Crypto World's Fair 2026](https://colosseum.com)**

</div>

---

## 🎯 The Problem

Prediction markets have proven product-market fit — Polymarket processed **over $1B in volume** during the 2024 US election. But they're experienced as **destinations**: to use one, you must visit a site, sign up, fund an account, and browse markets.

Meanwhile, creators are starved for engagement tools beyond likes and comments. They already run informal prediction games — Twitter polls, "reply with your score prediction," Discord brackets. They do this because engagement matters to their business.

**What's missing isn't technology. It's distribution.**

---

## 💡 The Solution

**Panta Creator** lets any creator attach a live prediction market to a post in one click.

A sports blogger writes *"Will Real Madrid win tonight?"* — their audience trades **YES/NO** directly inside the post. No redirect. No new platform. No crypto learning curve.

- **Creators** earn a share of trading fees and get a new interactive format that doesn't exist on Substack, YouTube, or X
- **Audiences** get skin in the game without leaving the content they're consuming
- **Panta** gets a distribution channel that onboards mainstream users on-chain

> The market is the *context*, not the product.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Email-only onboarding** | Sign in with email — Privy creates an invisible Solana wallet in the background |
| **One-click market creation** | Enter a question, pick an expiry, click Create. The market deploys on-chain via Panta |
| **Embeddable widget** | A single `<script>` tag works in Substack, blogs, and any CMS |
| **Live odds** | Widget displays real-time YES/NO prices from Panta |
| **Creator fee attribution** | Trades through the embed are attributed back to the creator |
| **Dark-mode dashboard** | Linear/Vercel-inspired UI built with Tailwind CSS |
| **Persistent storage** | PostgreSQL tracks every creator, market, and trade |

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

## 🔌 Panta API Integration

Panta handles **all on-chain complexity**. Our app builds the creator experience; Panta is the infrastructure.

### Creating a market

```ts
const market = await createMarket({
  question: "Will Bitcoin hit $100K by Friday?",
  expiry: "2026-10-15T00:00:00Z",
  initialLiquidityUsdc: "50000000", // 50 USDC
  creatorWallet: userSolanaAddress,
});
```

### Trading flow (custody-safe)

Panta **never holds user funds**. Every signature comes from the user's own wallet.

1. User clicks YES or NO in the widget
2. Our backend asks Panta to build an **unsigned** Solana transaction
3. The transaction is returned to the client
4. The user's Privy embedded wallet signs it
5. The signed transaction is broadcast to Solana
6. We report the signature back to Panta via `/trades/report`

### Panta capabilities used

- ✅ Market creation
- ✅ Market discovery and data
- ✅ Live price retrieval
- ✅ Building user transactions
- ✅ Reading wallet positions
- ✅ Claiming creator fees
- 🔄 Trade attribution (in progress)

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS (custom dark palette)
- Privy React SDK (email auth + embedded Solana wallets)

**Backend**
- Next.js API Routes (Node.js runtime)
- PostgreSQL on [Neon](https://neon.tech) (serverless)
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
- A Panta API key — see [Panta docs](https://docs.panta.market)

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

# Privy — from dashboard.privy.io
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# Panta API
PANTA_API_BASE_URL=https://live-api.panta.market/api/v1
PANTA_API_KEY=pk_test_your_key_here

# Solana RPC
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

### 5. Verify the integrations

```bash
node scripts/test-db.js      # verify Postgres connection
node scripts/test-panta.js   # verify Panta API key
```

Both should print `✅ Success` / `Status: 200`.

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
│       ├── auth/sync/route.ts      # Creates creator row on login
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

## 🎨 Design Philosophy

The UI is intentionally minimal — **Linear** and **Vercel** inspired.

- **Dark mode first.** Background `#0A0A0A`, cards `#161616`, borders `#2A2A2A`
- **Purple accent** (`#8B5CF6`) used sparingly for primary CTAs
- **Green/red** (`#22C55E` / `#EF4444`) reserved for YES/NO
- **Inter font** throughout
- **No drop shadows.** Depth comes from borders and spacing

---

## 🗺️ Roadmap

- [x] Creator login via Privy (email + invisible Solana wallet)
- [x] Market creation end-to-end via the Panta API
- [x] Persistent storage of creators, markets, trades
- [x] Embeddable widget with live odds
- [ ] Full trade signing flow with Privy Solana hooks
- [ ] Substack plugin — one-click market embedding
- [ ] Streaming payouts to creators as markets resolve
- [ ] Telegram bot for community managers
- [ ] Creator analytics: engagement, volume, retention per market
- [ ] Mainnet launch with Panta's production API

---

## 🔐 Security

- **No private keys touch the server.** All signing happens in the user's Privy wallet
- **Panta API key** is stored server-side only (never exposed to the client)
- **Privy JWT** is verified on every authenticated API call
- **Database credentials** live in `.env.local` (local) and Vercel env vars (production)
- **Creator isolation** — creators can only see and modify their own markets

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

<div align="center">

**Built solo for [Colosseum Crypto World's Fair 2026](https://colosseum.com)**

*Prediction markets don't need better technology. They need distribution.*

</div>
```

---

## 📸 Add Screenshots (Recommended)

Screenshots make your README 10× stronger for judges. Do this:

1. Create a `docs/` folder in your repo
2. Take 4 screenshots:
   - `landing.png` — the landing page
   - `dashboard.png` — logged-in creator dashboard
   - `widget.png` — the embeddable widget
   - `panta-response.png` — terminal showing `Status: 200` from `test-panta.js`
3. Add this section right after the **Features** table:

```markdown
## 📸 Screenshots

### Landing page
![Landing page](<img width="1890" height="948" alt="Screenshot (191)" src="https://github.com/user-attachments/assets/1fd65a78-64d0-43b8-8fbf-52378dc62fb0" />
)

### Creator dashboard
![Creator dashboard](<img width="1920" height="938" alt="Screenshot (192)" src="https://github.com/user-attachments/assets/39463dfd-40c0-4237-a044-85bed49b19a5" />
)

### Embeddable widget
![Embeddable widget](<img width="1833" height="957" alt="Screenshot (189)" src="https://github.com/user-attachments/assets/62de97b0-df76-46a4-8eab-1c621c1f341b" />
<img width="1920" height="1080" alt="Screenshot (188)" src="https://github.com/user-attachments/assets/314b456a-a692-424c-9d6d-ae126174637d" />
)

### Verified Panta API integration
![Panta API response](<img width="1920" height="936" alt="Screenshot (195)" src="https://github.com/user-attachments/assets/9afde4c3-c816-444c-ac78-d83682263a19" />
)
```

---





**Send me a screenshot once it's live and I'll review it with you.**
