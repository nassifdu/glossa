import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Glossa — Conlang Word Generator',
  description: 'A phonologically-faithful word generator for a constructed language with linguolabial consonants, bilabial fricatives, and front-rounded vowels.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#282C36] text-[#dee3ec] antialiased">
        {children}
      </body>
    </html>
  )
}
