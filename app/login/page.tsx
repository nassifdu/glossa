'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? '/wordforge'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, from }),
      })
      if (res.ok) {
        router.push(from)
        router.refresh()
      } else {
        setError('Wrong password.')
        setPassword('')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
      <div className="flex flex-col gap-1">
        <h1 className="text-sm font-semibold text-[#dee3ec]">Glossa</h1>
        <p className="text-xs text-[#6B7182]">Enter the password to continue.</p>
      </div>

      <input
        autoFocus
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="text-sm bg-[#1E2128] border border-[#3E424C] rounded px-3 py-2 text-[#dee3ec] placeholder-[#4B5060] outline-none focus:border-[#269BA6] transition-colors"
      />

      {error && <p className="text-xs text-[#E0A8A8]">{error}</p>}

      <button
        type="submit"
        disabled={pending || !password}
        className="text-sm font-medium text-[#1E2128] bg-[#269BA6] hover:bg-[#C0E2DD] disabled:opacity-40 disabled:cursor-not-allowed rounded px-3 py-2 transition-colors"
      >
        {pending ? 'Checking…' : 'Enter'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-[#282C36]">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
