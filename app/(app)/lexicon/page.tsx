import { fetchLexicon, isSupabaseConfigured } from '@/lib/supabase'
import type { LexiconWord } from '@/lib/supabase'
import { WORD_CLASSES } from '@/lib/types'
import AddWordForm from '@/components/AddWordForm'
import LexiconCard from '@/components/LexiconCard'

const CLASS_ORDER = [...WORD_CLASSES]

function groupByClass(words: LexiconWord[]): [string, LexiconWord[]][] {
  const map = new Map<string, LexiconWord[]>()

  for (const word of words) {
    const key = word.word_class ?? ''
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(word)
  }

  // Sort groups: known classes in order, then uncategorized last
  const entries: [string, LexiconWord[]][] = []
  for (const cls of CLASS_ORDER) {
    if (map.has(cls)) entries.push([cls, map.get(cls)!])
  }
  if (map.has('')) entries.push(['', map.get('')!])

  return entries
}

function classLabel(key: string) {
  return key ? key.charAt(0).toUpperCase() + key.slice(1) : 'Uncategorized'
}

export default async function LexiconPage() {
  const configured = isSupabaseConfigured()
  const words = configured ? await fetchLexicon().catch(() => []) : []
  const groups = groupByClass(words)

  return (
    <main className="flex-1 min-h-0 overflow-y-auto px-5 py-4 flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 shrink-0">
        <p className="text-xs text-[#6B7182]">
          {configured
            ? `${words.length} word${words.length !== 1 ? 's' : ''} saved`
            : 'Supabase not connected'}
        </p>
        {configured && <AddWordForm />}
      </div>

      {!configured && (
        <p className="text-xs text-[#6B7182]">
          Set <code className="text-[#C0E2DD]">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code className="text-[#C0E2DD]">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to enable the lexicon.
        </p>
      )}

      {configured && words.length === 0 && (
        <p className="text-xs text-[#6B7182]">
          No words yet — generate some in Wordforge and save them, or add one manually above.
        </p>
      )}

      {groups.map(([cls, groupWords]) => (
        <section key={cls} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-[11px] font-semibold text-[#6B7182] shrink-0">
              {classLabel(cls)}
            </h2>
            <div className="flex-1 h-px bg-[#3E424C]" />
            <span className="text-[11px] text-[#3E424C] shrink-0">{groupWords.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {groupWords.map(word => (
              <LexiconCard key={word.id} word={word} />
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
