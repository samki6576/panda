import Link from "next/link";
import { Brand } from "@/components/brand";

const steps = [
  ["01", "Connect your account", "Sign in with a Privy account linked to a Solana wallet."],
  ["02", "Create a market", "Write a yes-or-no question and choose its resolution date."],
  ["03", "Share your market", "Use the market ID and embed instructions from the docs."],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white lg:grid lg:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)_300px]">
      <aside className="hidden min-h-screen border-r border-arena-border bg-[#111114] px-4 py-7 lg:flex lg:flex-col">
        <div className="px-2"><Brand /></div>
        <nav aria-label="Main navigation" className="mt-10 space-y-1">
          <Link href="/" aria-current="page" className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#24242a] px-3 py-3 text-sm text-white"><span className="text-lg" aria-hidden="true">⌂</span>Overview</Link>
          <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-arena-muted transition-colors hover:bg-white/5 hover:text-white"><span className="text-lg text-arena-accent" aria-hidden="true">＋</span>Create market</Link>
          <Link href="/docs" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-arena-muted transition-colors hover:bg-white/5 hover:text-white"><span className="text-lg" aria-hidden="true">▤</span>Documentation</Link>
        </nav>
        <div className="mt-auto border-t border-arena-border pt-5"><p className="px-3 text-xs leading-5 text-arena-muted">Create and share prediction markets with your audience.</p></div>
      </aside>

      <div className="min-w-0 px-5 sm:px-8 lg:px-7">
        <header className="flex items-center justify-between border-b border-arena-border py-5 lg:hidden"><Brand /><Link href="/docs" className="text-sm text-arena-muted hover:text-white">Documentation</Link></header>
        <section className="flex min-h-[calc(100vh-5rem)] flex-col justify-center py-16 lg:min-h-screen lg:py-10">
          <div className="mb-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[11px] font-medium tracking-wide text-arena-muted"><span className="size-1.5 rounded-full bg-arena-green" />PREDICTION MARKETS, BUILT FOR CREATORS</div>
          <h1 className="max-w-5xl text-5xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-6xl xl:text-[5.4rem]">Turn your audience into <span className="text-arena-accent">a point of view.</span></h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-arena-muted sm:text-lg sm:leading-8">Create clear yes-or-no markets, share them with your community, and let people put conviction behind what they think happens next.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link href="/dashboard" className="rounded-lg bg-arena-accent px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-arena-accent-hover">Open creator studio <span aria-hidden="true" className="ml-2">→</span></Link><Link href="/docs" className="rounded-lg border border-arena-border bg-arena-card px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:border-[#444]">Read the docs</Link></div>
          <div className="mt-16 grid gap-3 sm:grid-cols-3">{steps.map(([number, title, description]) => <article key={number} className="rounded-lg border border-arena-border bg-arena-card/70 p-4"><p className="font-mono text-xs text-arena-accent">{number}</p><h2 className="mt-4 text-sm font-semibold">{title}</h2><p className="mt-2 text-xs leading-5 text-arena-muted">{description}</p></article>)}</div>
        </section>
      </div>

      <aside className="border-t border-arena-border bg-[#0d0d10] px-5 py-7 sm:px-8 lg:col-start-2 lg:px-7 xl:col-start-auto xl:min-h-screen xl:border-l xl:border-t-0 xl:px-4 xl:py-8">
        <section className="rounded-xl border border-arena-border bg-[#17171c] p-5"><p className="text-xs font-medium uppercase tracking-[0.16em] text-arena-accent">Creator studio</p><h2 className="mt-3 text-lg font-semibold">Start a market</h2><p className="mt-2 text-sm leading-6 text-arena-muted">Create a clear question, set a future resolution date, and launch through Panta.</p><Link href="/dashboard" className="mt-5 flex items-center justify-center rounded-lg bg-arena-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-arena-accent-hover">Open creator studio <span className="ml-2" aria-hidden="true">→</span></Link></section>
        <section className="mt-6 border-t border-arena-border pt-5"><h2 className="text-sm font-semibold">Requirements</h2><ul className="mt-4 space-y-4 text-sm"><li className="flex gap-3"><span className="text-arena-accent" aria-hidden="true">•</span><span><span className="block font-medium">Privy account</span><span className="mt-1 block text-xs leading-5 text-arena-muted">Sign in to access the creator studio.</span></span></li><li className="flex gap-3"><span className="text-arena-accent" aria-hidden="true">•</span><span><span className="block font-medium">Linked Solana wallet</span><span className="mt-1 block text-xs leading-5 text-arena-muted">Required when creating a market.</span></span></li><li className="flex gap-3"><span className="text-arena-accent" aria-hidden="true">•</span><span><span className="block font-medium">Panta API access</span><span className="mt-1 block text-xs leading-5 text-arena-muted">Configured by the app operator.</span></span></li></ul></section>
        <section className="mt-6 border-t border-arena-border pt-5"><h2 className="text-sm font-semibold">Guides</h2><Link href="/docs" className="mt-3 flex items-center justify-between rounded-lg border border-arena-border px-3 py-3 text-sm text-arena-muted transition-colors hover:border-arena-accent hover:text-white">Getting started <span aria-hidden="true">→</span></Link></section>
      </aside>
    </main>
  );
}

