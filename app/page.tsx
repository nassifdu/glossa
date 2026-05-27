'use client'

import { useState, useCallback, useEffect } from 'react'
import Controls from '@/components/Controls'
import WordCard from '@/components/WordCard'
import AlphabetTable from '@/components/AlphabetTable'
import { generateWords } from '@/lib/phonology'
import type { PhonemeKey, SyllableCount, SyllableShape, LongVowelMode, GeneratedWord } from '@/lib/types'

const DEFAULT_ACTIVE: PhonemeKey[] = [
  'a', 'e', 'i', 'o', 'u', 'ä', 'ë', 'ï', 'ö',
  'v', 'p', 'd', 't', 'h', 'm', 'n', 'x', 'r', 'l', 'k', 'c', 'g', 'f', 's',
]

function makeDefaultSet(): Set<PhonemeKey> {
  return new Set(DEFAULT_ACTIVE)
}

function generate(
  active: Set<PhonemeKey>,
  count: number,
  syllableCount: SyllableCount,
  shape: SyllableShape,
  longVowelMode: LongVowelMode
): GeneratedWord[] {
  return generateWords(active, count, syllableCount, shape, longVowelMode)
}

export default function Home() {
  const [activePhonemes, setActivePhonemes] = useState<Set<PhonemeKey>>(makeDefaultSet)
  const [wordCount, setWordCount] = useState(16)
  const [syllableCount, setSyllableCount] = useState<SyllableCount>('mixed')
  const [syllableShape, setSyllableShape] = useState<SyllableShape>('mixed')
  const [longVowelMode, setLongVowelMode] = useState<LongVowelMode>('allowed')

  const [words, setWords] = useState<GeneratedWord[]>([])

  useEffect(() => {
    setWords(generate(makeDefaultSet(), 16, 'mixed', 'mixed', 'allowed'))
  }, [])

  const handleGenerate = useCallback(() => {
    setWords(generate(activePhonemes, wordCount, syllableCount, syllableShape, longVowelMode))
  }, [activePhonemes, wordCount, syllableCount, syllableShape, longVowelMode])

  function handlePhonemeChange(p: PhonemeKey, active: boolean) {
    setActivePhonemes(prev => {
      const next = new Set(prev)
      if (active) next.add(p)
      else next.delete(p)
      return next
    })
  }

  function copyAll() {
    const text = words.map(w => `${w.orthographic} ${w.ipa}`).join('\n')
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-baseline gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-stone-900">Glossa</h1>
          <span className="text-stone-400 text-sm">Conlang word generator</span>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar controls */}
        <Controls
          activePhonemes={activePhonemes}
          wordCount={wordCount}
          syllableCount={syllableCount}
          syllableShape={syllableShape}
          longVowelMode={longVowelMode}
          onPhonemeChange={handlePhonemeChange}
          onWordCountChange={setWordCount}
          onSyllableCountChange={setSyllableCount}
          onSyllableShapeChange={setSyllableShape}
          onLongVowelModeChange={setLongVowelMode}
          onGenerate={handleGenerate}
        />

        {/* Main area */}
        <main className="flex-1 min-w-0 flex flex-col gap-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-500">
              {words.length} word{words.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={copyAll}
              className="text-sm text-stone-500 hover:text-stone-800 border border-stone-300 hover:border-stone-500 rounded px-3 py-1.5 transition-colors"
            >
              Copy all
            </button>
          </div>

          {/* Word grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {words.map((word, i) => (
              <WordCard key={i} word={word} />
            ))}
          </div>

          {/* Alphabet reference */}
          <AlphabetTable />
        </main>
      </div>
    </div>
  )
}
