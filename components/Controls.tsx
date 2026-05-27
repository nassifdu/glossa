'use client'

import PhonemeToggle from './PhonemeToggle'
import type { PhonemeKey, SyllableCount, SyllableShape, LongVowelMode } from '@/lib/types'

interface ControlsProps {
  activePhonemes: Set<PhonemeKey>
  wordCount: number
  syllableCount: SyllableCount
  syllableShape: SyllableShape
  longVowelMode: LongVowelMode
  onPhonemeChange: (p: PhonemeKey, active: boolean) => void
  onWordCountChange: (n: number) => void
  onSyllableCountChange: (v: SyllableCount) => void
  onSyllableShapeChange: (v: SyllableShape) => void
  onLongVowelModeChange: (v: LongVowelMode) => void
  onGenerate: () => void
}

const selectCls = 'w-full border border-[#3E424C] rounded px-2 py-1 text-xs bg-[#3B3F48] text-[#dee3ec] focus:outline-none focus:ring-1 focus:ring-[#269BA6]'
const labelCls = 'text-xs text-[#6B7182] block mb-1'

export default function Controls({
  activePhonemes,
  wordCount,
  syllableCount,
  syllableShape,
  longVowelMode,
  onPhonemeChange,
  onWordCountChange,
  onSyllableCountChange,
  onSyllableShapeChange,
  onLongVowelModeChange,
  onGenerate,
}: ControlsProps) {
  return (
    <div className="flex flex-col gap-0 text-xs">
      <section className="px-3 py-3 border-b border-[#3E424C]">
        <p className="text-[10px] uppercase tracking-widest text-[#6B7182] mb-2.5">Phonemes</p>
        <PhonemeToggle activePhonemes={activePhonemes} onChange={onPhonemeChange} />
      </section>

      <section className="px-3 py-3 flex flex-col gap-3">
        <p className="text-[10px] uppercase tracking-widest text-[#6B7182]">Settings</p>

        <div>
          <div className="flex justify-between mb-1">
            <label className={labelCls}>Words</label>
            <span className="text-xs font-mono text-[#C0E2DD]">{wordCount}</span>
          </div>
          <input
            type="range" min={4} max={40} step={4} value={wordCount}
            onChange={e => onWordCountChange(Number(e.target.value))}
            className="w-full accent-[#269BA6] h-1"
          />
          <div className="flex justify-between text-[10px] text-[#6B7182] mt-0.5">
            <span>4</span><span>40</span>
          </div>
        </div>

        <div>
          <label className={labelCls}>Syllables</label>
          <select value={syllableCount} onChange={e => onSyllableCountChange(e.target.value as SyllableCount)} className={selectCls}>
            <option value="mono">Monosyllabic</option>
            <option value="di">Disyllabic</option>
            <option value="tri">Trisyllabic</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <div>
          <label className={labelCls}>Shape</label>
          <select value={syllableShape} onChange={e => onSyllableShapeChange(e.target.value as SyllableShape)} className={selectCls}>
            <option value="open">Open (CV)</option>
            <option value="closed">Closed (CVC)</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <div>
          <label className={labelCls}>Long vowels</label>
          <select value={longVowelMode} onChange={e => onLongVowelModeChange(e.target.value as LongVowelMode)} className={selectCls}>
            <option value="allowed">Allowed</option>
            <option value="disallowed">Disallowed</option>
            <option value="rare">Rare (~15%)</option>
          </select>
        </div>

        <button
          onClick={onGenerate}
          className="w-full bg-[#269BA6] hover:bg-[#1e7a84] active:bg-[#186570] text-[#dee3ec] text-xs font-medium py-1.5 rounded transition-colors"
        >
          Generate
        </button>
      </section>
    </div>
  )
}
