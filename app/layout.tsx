import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Glossa — Conlang Word Generator',
  description: 'A phonologically-faithful word generator for a constructed language with linguolabial consonants, bilabial fricatives, and front-rounded vowels.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#282C36] text-[#dee3ec] antialiased min-h-screen">
        <div className="h-screen flex flex-col overflow-hidden bg-[#282C36]">
          {/* Header */}
          <header className="shrink-0 border-b border-[#3E424C] bg-[#282C36] px-4 py-2.5 flex items-baseline gap-4">
            <h1 className="text-sm font-semibold tracking-tight text-[#dee3ec]">Glossa</h1>
            <nav className="flex items-baseline gap-3">
              <Link
                href="/wordforge"
                className="text-xs text-[#6B7182] hover:text-[#C0E2DD] transition-colors"
              >
                Wordforge
              </Link>
              <Link
                href="/lexicon"
                className="text-xs text-[#6B7182] hover:text-[#C0E2DD] transition-colors"
              >
                Lexicon
              </Link>
            </nav>
          </header>

          {/* Page content */}
          <div className="flex-1 flex overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
