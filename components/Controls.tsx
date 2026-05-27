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
    <aside className="w-full lg:w-80 xl:w-88 shrink-0 flex flex-col gap-6">
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm">
        <h2 className="text-xs uppercase tracking-widest text-stone-400 mb-4">Phoneme inventory</h2>
        <PhonemeToggle activePhonemes={activePhonemes} onChange={onPhonemeChange} />
      </div>

      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-5">
        <h2 className="text-xs uppercase tracking-widest text-stone-400">Generation settings</h2>

        {/* Word count slider */}
        <div>
          <div className="flex justify-between items-baseline mb-1.5">
            <label className="text-sm text-stone-600">Words</label>
            <span className="text-sm font-mono text-stone-800">{wordCount}</span>
          </div>
          <input
            type="range"
            min={4}
            max={40}
            step={4}
            value={wordCount}
            onChange={e => onWordCountChange(Number(e.target.value))}
            className="w-full accent-stone-700"
          />
          <div className="flex justify-between text-xs text-stone-400 mt-0.5">
            <span>4</span><span>40</span>
          </div>
        </div>

        {/* Syllable count */}
        <div>
          <label className="text-sm text-stone-600 block mb-1.5">Syllables per word</label>
          <select
            value={syllableCount}
            onChange={e => onSyllableCountChange(e.target.value as SyllableCount)}
            className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
          >
            <option value="mono">Monosyllabic</option>
            <option value="di">Disyllabic</option>
            <option value="tri">Trisyllabic</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        {/* Syllable shape */}
        <div>
          <label className="text-sm text-stone-600 block mb-1.5">Syllable shape</label>
          <select
            value={syllableShape}
            onChange={e => onSyllableShapeChange(e.target.value as SyllableShape)}
            className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
          >
            <option value="open">Open (CV)</option>
            <option value="closed">Closed (CVC)</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        {/* Long vowels */}
        <div>
          <label className="text-sm text-stone-600 block mb-1.5">Long vowels</label>
          <select
            value={longVowelMode}
            onChange={e => onLongVowelModeChange(e.target.value as LongVowelMode)}
            className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
          >
            <option value="allowed">Allowed</option>
            <option value="disallowed">Disallowed</option>
            <option value="rare">Rare (~15%)</option>
          </select>
        </div>

        <button
          onClick={onGenerate}
          className="w-full bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-stone-100 text-sm font-medium py-2.5 rounded transition-colors"
        >
          Generate
        </button>
      </div>
    </aside>
  )
}
