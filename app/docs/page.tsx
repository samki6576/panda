import Link from "next/link";

export default function DocsPage() {
  return (
    <main className="min-h-screen px-6 py-16 sm:px-10">
      <article className="mx-auto max-w-2xl rounded-2xl border border-arena-border bg-arena-card p-8 sm:p-10">
        <Link href="/" className="text-sm font-semibold text-violet-300 hover:text-violet-200">← Back to Panta Creator</Link>
        <p className="mt-10 text-sm font-semibold uppercase tracking-[0.18em] text-violet-300">Getting started</p>
        <h1 className="mt-3 text-4xl font-bold">Create a prediction market</h1>
        <ol className="mt-8 space-y-5 text-arena-muted">
          <li>1. Sign in with an account that has a Solana wallet.</li>
          <li>2. Write a clear yes-or-no question and select a future resolution date.</li>
          <li>3. Create the market, then share its identifier with your audience.</li>
        </ol>
        <p className="mt-10 rounded-xl border border-violet-400/20 bg-violet-400/10 p-4 text-sm text-violet-100">Only use publicly verifiable outcomes. Your Panta API key and database connection must be configured on the server before creating markets.</p>
      </article>
    </main>
  );
}
