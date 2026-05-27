'use client'

import { SHORT_VOWELS, LONG_VOWELS, ONSET_CONSONANTS } from '@/lib/phonology'
import type { PhonemeKey } from '@/lib/types'

interface PhonemeToggleProps {
  activePhonemes: Set<PhonemeKey>
  onChange: (phoneme: PhonemeKey, active: boolean) => void
}

const ALL_CONSONANTS: PhonemeKey[] = [
  'v', 'p', 'd', 't', 'h', 'm', 'n', 'x', 'r', 'l', 'k', 'c', 'g', 'f', 's',
]

export default function PhonemeToggle({ activePhonemes, onChange }: PhonemeToggleProps) {
  const activeVowelCount = [...SHORT_VOWELS, ...LONG_VOWELS].filter(v =>
    activePhonemes.has(v)
  ).length

  function toggle(p: PhonemeKey) {
    const isActive = activePhonemes.has(p)
    const isVowel = ([...SHORT_VOWELS, ...LONG_VOWELS] as PhonemeKey[]).includes(p)
    if (isActive && isVowel && activeVowelCount <= 2) return // minimum 2 vowels
    onChange(p, !isActive)
  }

  function Chip({ p, label }: { p: PhonemeKey; label?: string }) {
    const active = activePhonemes.has(p)
    const isVowel = ([...SHORT_VOWELS, ...LONG_VOWELS] as PhonemeKey[]).includes(p)
    const isLong = (LONG_VOWELS as PhonemeKey[]).includes(p)
    const disabled = active && isVowel && activeVowelCount <= 2

    return (
      <button
        onClick={() => toggle(p)}
        disabled={disabled}
        title={disabled ? 'Keep at least 2 vowels active' : undefined}
        className={[
          'px-2.5 py-1 rounded text-sm font-mono border transition-all',
          active
            ? isLong
              ? 'bg-amber-100 border-amber-400 text-amber-800'
              : isVowel
              ? 'bg-sky-100 border-sky-400 text-sky-800'
              : 'bg-stone-800 border-stone-700 text-stone-100'
            : 'bg-stone-100 border-stone-300 text-stone-400',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80',
        ].join(' ')}
      >
        {label ?? p}
      </button>
    )
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Short vowels</p>
        <div className="flex flex-wrap gap-1.5">
          {SHORT_VOWELS.map(p => <Chip key={p} p={p} />)}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Long vowels</p>
        <div className="flex flex-wrap gap-1.5">
          {LONG_VOWELS.map(p => <Chip key={p} p={p} />)}
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Consonants</p>
        <div className="flex flex-wrap gap-1.5">
          {ALL_CONSONANTS.map(p => <Chip key={p} p={p} />)}
        </div>
      </div>
    </div>
  )
}
