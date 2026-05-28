'use client'

import { useTransition, useState, useRef, useEffect } from 'react'
import { saveWord } from '@/app/actions'
import { WORD_CLASSES } from '@/lib/types'

interface SaveButtonProps {
  orthographic: string
  ipa: string
}

type State = 'idle' | 'open' | 'saving' | 'saved' | 'duplicate'

export default function SaveButton({ orthographic, ipa }: SaveButtonProps) {
  const [state, setState] = useState<State>('idle')
  const [saveError, setSaveError] = useState(false)
  const [meaning, setMeaning] = useState('')
  const [wordClass, setWordClass] = useState('')
  const [, startTransition] = useTransition()
  const popoverRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close on outside click
  useEffect(() => {
    if (state !== 'open') return
    function handler(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setState('idle')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [state])

  // Focus meaning input when popover opens
  useEffect(() => {
    if (state === 'open') inputRef.current?.focus()
  }, [state])

  function handleConfirm() {
    setState('saving')
    startTransition(async () => {
      const result = await saveWord(orthographic, ipa, meaning, wordClass)
      if (result.error === 'already-saved') {
        setState('duplicate')
      } else if (result.error) {
        setSaveError(true)
        setState('open')
      } else {
        setState('saved')
      }
    })
  }

  if (state === 'saved') {
    return (
      <div className="absolute top-1.5 right-1.5">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-[#269BA6]">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    )
  }

  if (state === 'duplicate') {
    return (
      <div className="absolute top-1.5 right-1.5" title="Already in lexicon">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-[#6B7182]">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    )
  }

  return (
    <div ref={popoverRef} className="absolute top-1.5 right-1.5">
      {/* Trigger */}
      <button
        onClick={() => setState(s => s === 'open' ? 'idle' : 'open')}
        disabled={state === 'saving'}
        title="Save to Lexicon"
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:cursor-default"
      >
        {state === 'saving' ? (
          <svg className="animate-spin text-[#6B7182]" width="11" height="11" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-[#6B7182] hover:text-[#C0E2DD] transition-colors">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Popover */}
      {state === 'open' && (
        <div className="absolute top-5 right-0 z-50 w-48 rounded border border-[#3E424C] bg-[#1E2128] shadow-xl p-3 flex flex-col gap-2">
          <p className="text-[10px] font-semibold text-[#dee3ec] truncate">{orthographic}</p>

          <input
            ref={inputRef}
            value={meaning}
            onChange={e => setMeaning(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleConfirm() }}
            placeholder="Meaning (optional)"
            className="text-xs bg-[#282C36] border border-[#3E424C] rounded px-2 py-1 text-[#dee3ec] placeholder-[#4B5060] outline-none focus:border-[#269BA6] transition-colors"
          />

          <select
            value={wordClass}
            onChange={e => setWordClass(e.target.value)}
            className="text-xs bg-[#282C36] border border-[#3E424C] rounded px-2 py-1 text-[#dee3ec] outline-none focus:border-[#269BA6] transition-colors appearance-none"
          >
            <option value="">Word class (optional)</option>
            {WORD_CLASSES.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>

          <button
            onClick={handleConfirm}
            className="text-[11px] font-medium text-[#1E2128] bg-[#269BA6] hover:bg-[#C0E2DD] rounded px-2 py-1 transition-colors"
          >
            Save
          </button>

          {saveError && (
            <p className="text-[10px] text-[#E0A8A8]">Save failed — try again.</p>
          )}
        </div>
      )}
    </div>
  )
}
