// app/layout.tsx
import './globals.css'
import Providers from './providers'
import { Brand } from '@/components/brand'

export const metadata = {
  title: 'Panta Creator | Prediction Markets',
  description: 'Embed prediction markets into creator content.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-arena-bg text-arena-text antialiased selection:bg-arena-accent/40">
        <Providers>
          <header className="mx-auto flex max-w-7xl items-center px-6 pt-7">
            <Brand />
          </header>
          {children}
        </Providers>
      </body>
    </html>
  )
}
