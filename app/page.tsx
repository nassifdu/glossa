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
  const [longVowelMode, setLongVowelMode] = useState<LongVowelMode>('rare')

  const [words, setWords] = useState<GeneratedWord[]>([])

  useEffect(() => {
    setWords(generate(makeDefaultSet(), 16, 'mixed', 'mixed', 'rare'))
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
    <div className="h-screen flex flex-col overflow-hidden bg-[#282C36]">
      {/* Header */}
      <header className="shrink-0 border-b border-[#3E424C] bg-[#282C36] px-4 py-2.5 flex items-baseline gap-2.5">
        <h1 className="text-sm font-semibold tracking-tight text-[#dee3ec]">Glossa</h1>
        <span className="text-[#6B7182] text-xs">Conlang word generator</span>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 border-r border-[#3E424C] bg-[#282C36] overflow-y-auto">
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
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#6B7182]">
              {words.length} word{words.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={copyAll}
              className="text-xs text-[#6B7182] hover:text-[#C0E2DD] border border-[#3E424C] hover:border-[#269BA6] rounded px-2.5 py-1 transition-colors"
            >
              Copy all
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {words.map((word, i) => (
              <WordCard key={i} word={word} />
            ))}
          </div>

          <AlphabetTable />
        </main>
      </div>
    </div>
  )
}
