// app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <div className="text-center max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Embed Prediction Markets
          <span className="block text-arena-accent">Into Creator Content</span>
        </h1>

        <p className="text-xl text-arena-muted mb-10 max-w-2xl mx-auto">
          A seamless way for creators to engage their audience with live prediction markets.
          Built for the Colosseum Hackathon.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-arena-accent hover:bg-arena-accent-hover text-white font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Launch App
          </Link>
          <Link
            href="/docs"
            className="border border-arena-border hover:border-arena-accent text-arena-text font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>

    </main>
  )
}
