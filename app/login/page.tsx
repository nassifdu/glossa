'use client'

import { useState, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

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
    <div className="w-full max-w-xs flex flex-col gap-6">
      {/* Brand */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#dee3ec]">Glossa</h1>
        <p className="text-sm text-[#6B7182] mt-1">Conlang word generator</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#6B7182]">Password</label>
          <input
            autoFocus
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(null) }}
            placeholder="••••••••"
            className="text-sm bg-[#1E2128] border border-[#3E424C] rounded-md px-3 py-2.5 text-[#dee3ec] placeholder-[#3E424C] outline-none focus:border-[#269BA6] transition-colors"
          />
        </div>

        {error && (
          <p className="text-xs text-[#E0A8A8]">{error}</p>
        )}

        <button
          type="submit"
          disabled={pending || !password}
          className="text-sm font-medium text-[#1E2128] bg-[#269BA6] hover:bg-[#C0E2DD] disabled:opacity-40 disabled:cursor-not-allowed rounded-md px-3 py-2.5 transition-colors"
        >
          {pending ? 'Checking…' : 'Enter'}
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#282C36] flex items-center justify-center px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
