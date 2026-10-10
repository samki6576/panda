// app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen px-6">
      <header className="mx-auto flex max-w-7xl items-center justify-between py-7">
        <Link href="/docs" className="text-sm text-arena-muted transition-colors hover:text-white">Documentation <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl flex-col justify-center pb-24 pt-10">
        <div className="max-w-4xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-arena-border bg-arena-card px-3.5 py-2 text-xs font-medium text-arena-muted">
            <span className="size-1.5 rounded-full bg-arena-green" />
            PREDICTION MARKETS, BUILT FOR CREATORS
          </div>
          <h1 className="text-5xl font-semibold leading-[1.06] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
            Turn your audience into <span className="text-arena-accent">a point of view.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-arena-muted sm:text-xl">
            Create clear yes-or-no markets, share them with your community, and let people put conviction behind what they think happens next.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-lg bg-arena-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-arena-accent-hover">
              Open creator studio <span aria-hidden="true" className="ml-2">→</span>
            </Link>
            <Link href="/docs" className="rounded-lg border border-arena-border bg-arena-card px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-[#444]">
              Read the docs
            </Link>
          </div>
        </div>

        <div className="mt-20 grid max-w-4xl gap-3 sm:grid-cols-3">
          {[
            ["01", "Write the question", "Make it clear, timely, and verifiable."],
            ["02", "Create your market", "Launch a market from your creator studio."],
            ["03", "Share the moment", "Embed the market wherever your audience is."],
          ].map(([number, title, description]) => (
            <article key={number} className="rounded-lg border border-arena-border bg-arena-card/80 p-5">
              <p className="font-mono text-xs text-arena-accent">{number}</p>
              <h2 className="mt-5 text-sm font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-arena-muted">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
