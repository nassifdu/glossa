import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#282C36]">
      <header className="shrink-0 border-b border-[#3E424C] bg-[#282C36] px-4 py-2.5 flex items-baseline justify-between">
        <div className="flex items-baseline gap-4">
          <h1 className="text-sm font-semibold tracking-tight text-[#dee3ec]">Glossa</h1>
          <nav className="flex items-baseline gap-3">
            <Link href="/wordforge" className="text-xs text-[#6B7182] hover:text-[#C0E2DD] transition-colors">
              Wordforge
            </Link>
            <Link href="/lexicon" className="text-xs text-[#6B7182] hover:text-[#C0E2DD] transition-colors">
              Lexicon
            </Link>
          </nav>
        </div>
        <LogoutButton />
      </header>
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  )
}
