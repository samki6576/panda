import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="min-h-screen px-6 pb-20">
      <header className="mx-auto flex max-w-7xl items-center justify-between py-7">
        <Link href="/dashboard" className="text-sm text-arena-muted transition-colors hover:text-white">Open creator studio <span aria-hidden="true">→</span></Link>
      </header>
      <article className="mx-auto mt-12 max-w-3xl border-t border-arena-border pt-10 sm:mt-20 sm:pt-14">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-arena-accent">Documentation / Getting started</p>
        <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Create a market your community can follow.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-arena-muted">A few simple steps take you from a sharp question to a shareable prediction market.</p>
        <ol className="mt-12 divide-y divide-arena-border border-y border-arena-border">
          {[
            ["01", "Connect your account", "Sign in with an account linked to a Solana wallet."],
            ["02", "Write the question", "Use a clear yes-or-no question with an outcome that can be publicly verified."],
            ["03", "Choose a resolution date", "Set a future date that gives your audience time to participate."],
            ["04", "Create and share", "Create the market, then add its embed code to your content."],
          ].map(([number, title, description]) => (
            <li key={number} className="grid gap-3 py-6 sm:grid-cols-[4rem_1fr] sm:gap-5">
              <span className="font-mono text-xs text-arena-accent">{number}</span>
              <div>
                <h2 className="text-base font-medium">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-arena-muted">{description}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-8 rounded-lg border border-arena-border bg-arena-card p-5 text-sm leading-6 text-arena-muted">Only use publicly verifiable outcomes. Your Panta API key and database connection must be configured on the server before creating markets.</p>
      </article>
    </main>
  );
}
