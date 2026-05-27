import type { GeneratedWord } from '@/lib/types'

interface WordCardProps {
  word: GeneratedWord
}

export default function WordCard({ word }: WordCardProps) {
  return (
    <div className="bg-[#3B3F48] border border-[#3E424C] rounded px-3 py-2 flex flex-col gap-0.5 hover:border-[#269BA6] transition-colors">
      <span className="text-sm font-semibold tracking-wide text-[#dee3ec] leading-snug">
        {word.orthographic}
      </span>
      <span className="font-mono text-[11px] text-[#C0E2DD] leading-snug break-all">
        {word.ipa}
      </span>
      <span className="text-[10px] text-[#6B7182] font-mono tracking-wide leading-snug">
        {word.syllableNotation}
      </span>
    </div>
  )
}
