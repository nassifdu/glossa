'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  // Don't render if auth isn't configured (local dev)
  if (typeof window !== 'undefined') {
    // handled server-side via env — button is always shown when rendered
  }

  function handleLogout() {
    startTransition(async () => {
      await fetch('/api/auth', { method: 'DELETE' })
      router.push('/login')
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleLogout}
      disabled={pending}
      className="text-xs text-[#6B7182] hover:text-[#dee3ec] transition-colors disabled:opacity-40"
    >
      {pending ? '…' : 'Log out'}
    </button>
  )
}
