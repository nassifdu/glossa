'use client'

import { useTransition, useState } from 'react'
import { saveManualWord } from '@/app/actions'
import { WORD_CLASSES } from '@/lib/types'

export default function AddWordForm() {
  const [open, setOpen] = useState(false)
  const [orthographic, setOrthographic] = useState('')
  const [meaning, setMeaning] = useState('')
  const [wordClass, setWordClass] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function reset() {
    setOrthographic('')
    setMeaning('')
    setWordClass('')
    setError(null)
    setOpen(false)
  }

  function handleSubmit() {
    setError(null)
    startTransition(async () => {
      const result = await saveManualWord(orthographic, meaning, wordClass)
      if (result.error) {
        setError(result.error)
      } else {
        reset()
      }
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-[#6B7182] hover:text-[#C0E2DD] border border-[#3E424C] hover:border-[#269BA6] rounded px-2.5 py-1 transition-colors"
      >
        + Add word
      </button>
    )
  }

  return (
    <div className="flex flex-wrap items-start gap-2 rounded border border-[#3E424C] bg-[#1E2128] px-3 py-2.5">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-[#6B7182] uppercase tracking-wider">Orthographic</label>
        <input
          autoFocus
          value={orthographic}
          onChange={e => { setOrthographic(e.target.value); setError(null) }}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); if (e.key === 'Escape') reset() }}
          placeholder="e.g. kabdik"
          className="text-sm bg-[#282C36] border border-[#3E424C] rounded px-2 py-1 text-[#dee3ec] placeholder-[#4B5060] outline-none focus:border-[#269BA6] transition-colors w-36"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-[#6B7182] uppercase tracking-wider">Meaning</label>
        <input
          value={meaning}
          onChange={e => setMeaning(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); if (e.key === 'Escape') reset() }}
          placeholder="optional"
          className="text-sm bg-[#282C36] border border-[#3E424C] rounded px-2 py-1 text-[#dee3ec] placeholder-[#4B5060] outline-none focus:border-[#269BA6] transition-colors w-36"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-[#6B7182] uppercase tracking-wider">Word class</label>
        <select
          value={wordClass}
          onChange={e => setWordClass(e.target.value)}
          className="text-sm bg-[#282C36] border border-[#3E424C] rounded px-2 py-1 text-[#dee3ec] outline-none focus:border-[#269BA6] transition-colors appearance-none w-36"
        >
          <option value="">—</option>
          {WORD_CLASSES.map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="flex items-end gap-2 pb-0.5 self-end">
        <button
          onClick={handleSubmit}
          disabled={pending || !orthographic.trim()}
          className="text-xs font-medium text-[#1E2128] bg-[#269BA6] hover:bg-[#C0E2DD] disabled:opacity-40 disabled:cursor-not-allowed rounded px-2.5 py-1.5 transition-colors"
        >
          {pending ? 'Adding…' : 'Add'}
        </button>
        <button
          onClick={reset}
          className="text-xs text-[#6B7182] hover:text-[#dee3ec] transition-colors"
        >
          Cancel
        </button>
      </div>

      {error && (
        <p className="w-full text-[11px] text-[#E0A8A8] mt-0.5">{error}</p>
      )}
    </div>
  )
}
