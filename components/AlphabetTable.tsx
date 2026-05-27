'use client'

import { useState } from 'react'
import { ALPHABET_TABLE } from '@/lib/phonology'

export default function AlphabetTable() {
  const [open, setOpen] = useState(false)

  const vowelRows = ALPHABET_TABLE.slice(0, 9)
  const consonantRows = ALPHABET_TABLE.slice(9)

  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
      >
        <span className="text-xs uppercase tracking-widest text-stone-500">Alphabet reference</span>
        <span className="text-stone-400 text-base leading-none select-none">
          {open ? '▲' : '▼'}
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-stone-100 pt-4 space-y-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Vowels</p>
            <TableSection rows={vowelRows} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Consonants</p>
            <TableSection rows={consonantRows} />
          </div>
          <div className="text-xs text-stone-500 border-t border-stone-100 pt-3 space-y-1">
            <p><span className="font-semibold text-stone-700">Allophony of ⟨h⟩:</span> realized as [ð] before a vowel, [θ] elsewhere.</p>
            <p><span className="font-semibold text-stone-700">⟨t⟩</span> is a <em>linguolabial</em> stop [t̼] — the tongue tip touches the upper lip.</p>
            <p><span className="font-semibold text-stone-700">⟨f⟩</span> is a <em>bilabial</em> fricative [ɸ] — both lips, no teeth.</p>
          </div>
        </div>
      )}
    </div>
  )
}

function TableSection({ rows }: { rows: typeof ALPHABET_TABLE }) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="text-left text-xs text-stone-400">
          <th className="pb-1.5 font-normal w-12">Graph</th>
          <th className="pb-1.5 font-normal w-16">IPA</th>
          <th className="pb-1.5 font-normal">Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.orthographic} className="border-t border-stone-100">
            <td className="py-1.5 font-mono text-stone-800 font-semibold">{row.orthographic}</td>
            <td className="py-1.5 font-mono text-stone-600">[{row.ipa}]</td>
            <td className="py-1.5 text-stone-500 text-xs">{row.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
