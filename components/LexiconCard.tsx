'use client'

import { useState, useTransition } from 'react'
import { updateWord, deleteWord } from '@/app/actions'
import { WORD_CLASSES } from '@/lib/types'
import type { LexiconWord } from '@/lib/supabase'

export default function LexiconCard({ word }: { word: LexiconWord }) {
  const [editing, setEditing] = useState(false)
  const [meaning, setMeaning] = useState(word.meaning ?? '')
  const [wordClass, setWordClass] = useState(word.word_class ?? '')
  const [pending, startTransition] = useTransition()

  function handleSave() {
    startTransition(async () => {
      await updateWord(word.id, meaning, wordClass)
      setEditing(false)
    })
  }

  function handleDelete() {
    startTransition(async () => { await deleteWord(word.id) })
  }

  if (editing) {
    return (
      <div className="rounded-md border border-[#269BA6] bg-[#1E2128] px-3.5 py-3 flex flex-col gap-2.5">
        <div>
          <p className="text-[15px] font-semibold text-[#dee3ec] leading-snug">{word.orthographic}</p>
          <p className="font-mono text-[11px] text-[#C0E2DD] mt-0.5">{word.ipa}</p>
        </div>
        <input
          autoFocus
          value={meaning}
          onChange={e => setMeaning(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }}
          placeholder="Meaning"
          className="text-xs bg-[#282C36] border border-[#3E424C] rounded px-2 py-1.5 text-[#dee3ec] placeholder-[#4B5060] outline-none focus:border-[#269BA6] transition-colors"
        />
        <select
          value={wordClass}
          onChange={e => setWordClass(e.target.value)}
          className="text-xs bg-[#282C36] border border-[#3E424C] rounded px-2 py-1.5 text-[#dee3ec] outline-none focus:border-[#269BA6] transition-colors appearance-none"
        >
          <option value="">No class</option>
          {WORD_CLASSES.map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={pending}
            className="text-[11px] font-medium text-[#1E2128] bg-[#269BA6] hover:bg-[#C0E2DD] disabled:opacity-40 rounded px-2.5 py-1 transition-colors"
          >
            {pending ? '…' : 'Save'}
          </button>
          <button onClick={() => setEditing(false)} className="text-[11px] text-[#6B7182] hover:text-[#dee3ec] transition-colors">
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative group rounded-md border border-[#3E424C] bg-[#1E2128] px-3.5 pt-2.5 pb-2.5 flex flex-col gap-0.5 hover:border-[#4B5060] transition-colors" style={{ flex: '1 0 auto', minWidth: '8rem', maxWidth: '20rem' }}>
      {/* Hover actions */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setEditing(true)} title="Edit" className="text-[#4B5060] hover:text-[#dee3ec] transition-colors">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button onClick={handleDelete} disabled={pending} title="Delete" className="text-[#4B5060] hover:text-[#E0A8A8] transition-colors disabled:opacity-40">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <p className="text-[15px] font-semibold text-[#dee3ec] leading-snug pr-8">{word.orthographic}</p>
      <p className="font-mono text-[11px] text-[#5B9E9A]">{word.ipa}</p>

      {word.meaning && (
        <p className="text-[13px] text-[#C4C9D4] mt-1.5 leading-snug">{word.meaning}</p>
      )}
    </div>
  )
}
