'use client'

import { useState, useTransition } from 'react'
import { updateWord, deleteWord } from '@/app/actions'
import { WORD_CLASSES } from '@/lib/types'
import type { LexiconWord } from '@/lib/supabase'

export default function LexiconRow({ word }: { word: LexiconWord }) {
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
    startTransition(async () => {
      await deleteWord(word.id)
    })
  }

  const classLabel = word.word_class
    ? word.word_class.charAt(0).toUpperCase() + word.word_class.slice(1)
    : null

  return (
    <tr className="group border-b border-[#3E424C] hover:bg-[#23272F] transition-colors">
      {/* Word */}
      <td className="px-3 py-2.5 align-top">
        <span className="text-sm font-semibold text-[#dee3ec]">{word.orthographic}</span>
      </td>

      {/* IPA + syllable notation */}
      <td className="px-3 py-2.5 align-top">
        <span className="font-mono text-xs text-[#C0E2DD]">{word.ipa}</span>
        <span className="block font-mono text-[10px] text-[#4B5060]">{word.syllable_notation}</span>
      </td>

      {/* Word class */}
      <td className="px-3 py-2.5 align-top">
        {editing ? (
          <select
            value={wordClass}
            onChange={e => setWordClass(e.target.value)}
            className="text-xs bg-[#282C36] border border-[#3E424C] rounded px-1.5 py-0.5 text-[#dee3ec] outline-none focus:border-[#269BA6] transition-colors appearance-none"
          >
            <option value="">—</option>
            {WORD_CLASSES.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        ) : (
          classLabel
            ? <span className="text-[11px] text-[#6B7182] border border-[#3E424C] rounded px-1.5 py-0.5">{classLabel}</span>
            : <span className="text-[11px] text-[#3E424C]">—</span>
        )}
      </td>

      {/* Meaning */}
      <td className="px-3 py-2.5 align-top w-full">
        {editing ? (
          <input
            autoFocus
            value={meaning}
            onChange={e => setMeaning(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }}
            className="text-xs w-full bg-[#282C36] border border-[#3E424C] rounded px-2 py-0.5 text-[#dee3ec] outline-none focus:border-[#269BA6] transition-colors"
          />
        ) : (
          <span className="text-xs text-[#6B7182]">
            {word.meaning ?? <span className="text-[#3E424C]">—</span>}
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-3 py-2.5 align-top">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={pending}
                className="text-[11px] text-[#269BA6] hover:text-[#C0E2DD] transition-colors"
              >
                {pending ? '…' : 'Save'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="text-[11px] text-[#6B7182] hover:text-[#dee3ec] transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="text-[11px] text-[#6B7182] hover:text-[#dee3ec] transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={pending}
                className="text-[11px] text-[#6B7182] hover:text-[#E0A8A8] transition-colors"
              >
                {pending ? '…' : 'Delete'}
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
