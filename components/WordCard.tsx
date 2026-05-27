import type { GeneratedWord } from '@/lib/types'

interface WordCardProps {
  word: GeneratedWord
}

export default function WordCard({ word }: WordCardProps) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg px-5 py-4 flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow">
      <span className="text-2xl font-semibold tracking-wide text-stone-900">
        {word.orthographic}
      </span>
      <span className="font-mono text-sm text-stone-500 leading-relaxed">
        {word.ipa}
      </span>
      <span className="text-xs text-stone-400 font-mono tracking-wider">
        {word.syllableNotation}
      </span>
    </div>
  )
}
