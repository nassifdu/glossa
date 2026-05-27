'use client'

import { SHORT_VOWELS, LONG_VOWELS } from '@/lib/phonology'
import type { PhonemeKey } from '@/lib/types'

interface PhonemeToggleProps {
  activePhonemes: Set<PhonemeKey>
  onChange: (phoneme: PhonemeKey, active: boolean) => void
}

const ALL_CONSONANTS: PhonemeKey[] = [
  'v', 'b', 'd', 't', 'h', 'm', 'n', 'x', 'r', 'l', 'k', 'c', 'g', 'f', 's',
]

export default function PhonemeToggle({ activePhonemes, onChange }: PhonemeToggleProps) {
  const activeVowelCount = [...SHORT_VOWELS, ...LONG_VOWELS].filter(v =>
    activePhonemes.has(v)
  ).length

  function toggle(p: PhonemeKey) {
    const isActive = activePhonemes.has(p)
    const isVowel = ([...SHORT_VOWELS, ...LONG_VOWELS] as PhonemeKey[]).includes(p)
    if (isActive && isVowel && activeVowelCount <= 2) return
    onChange(p, !isActive)
  }

  function Chip({ p }: { p: PhonemeKey }) {
    const active = activePhonemes.has(p)
    const isVowel = ([...SHORT_VOWELS, ...LONG_VOWELS] as PhonemeKey[]).includes(p)
    const isLong = (LONG_VOWELS as PhonemeKey[]).includes(p)
    const disabled = active && isVowel && activeVowelCount <= 2

    let activeClass = ''
    if (active) {
      if (isLong) {
        activeClass = 'bg-[#3d1727] border-[#D8456F] text-[#F7DDE4]'
      } else if (isVowel) {
        activeClass = 'bg-[#1a3d42] border-[#269BA6] text-[#C0E2DD]'
      } else {
        activeClass = 'bg-[#4a4f5c] border-[#6B7182] text-[#dee3ec]'
      }
    } else {
      activeClass = 'bg-[#282C36] border-[#3E424C] text-[#6B7182]'
    }

    return (
      <button
        onClick={() => toggle(p)}
        disabled={disabled}
        title={disabled ? 'Keep at least 2 vowels active' : undefined}
        className={[
          'px-1.5 py-0.5 rounded text-xs font-mono border transition-all leading-none',
          activeClass,
          disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:opacity-80',
        ].join(' ')}
      >
        {p}
      </button>
    )
  }

  return (
    <div className="space-y-2.5">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[#6B7182] mb-1.5">Short vowels</p>
        <div className="flex flex-wrap gap-1">
          {SHORT_VOWELS.map(p => <Chip key={p} p={p} />)}
        </div>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[#6B7182] mb-1.5">Long vowels</p>
        <div className="flex flex-wrap gap-1">
          {LONG_VOWELS.map(p => <Chip key={p} p={p} />)}
        </div>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[#6B7182] mb-1.5">Consonants</p>
        <div className="flex flex-wrap gap-1">
          {ALL_CONSONANTS.map(p => <Chip key={p} p={p} />)}
        </div>
      </div>
    </div>
  )
}
