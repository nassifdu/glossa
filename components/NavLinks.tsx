'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/wordforge', label: 'Wordforge' },
  { href: '/lexicon', label: 'Lexicon' },
]

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="flex items-baseline gap-3">
      {links.map(({ href, label }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`text-xs transition-colors ${
              active
                ? 'text-[#dee3ec] font-medium'
                : 'text-[#6B7182] hover:text-[#C0E2DD]'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
