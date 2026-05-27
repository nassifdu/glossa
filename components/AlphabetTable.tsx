'use client'

import { useState } from 'react'
import { ALPHABET_TABLE } from '@/lib/phonology'

export default function AlphabetTable() {
  const [open, setOpen] = useState(false)

  const vowelRows = ALPHABET_TABLE.slice(0, 9)
  const consonantRows = ALPHABET_TABLE.slice(9)

  return (
    <div className="bg-[#3B3F48] border border-[#3E424C] rounded overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-[#6B7182] hover:text-[#dee3ec] hover:bg-[#3E424C] transition-colors"
      >
        <span className="text-[10px] uppercase tracking-widest">Alphabet reference</span>
        <span className="text-[10px] select-none">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-[#3E424C] pt-3 space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#6B7182] mb-1.5">Vowels</p>
            <TableSection rows={vowelRows} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#6B7182] mb-1.5">Consonants</p>
            <TableSection rows={consonantRows} />
          </div>
          <div className="text-[11px] text-[#6B7182] border-t border-[#3E424C] pt-3 space-y-1">
            <p><span className="font-semibold text-[#C0E2DD]">Allophony of ⟨h⟩:</span> realized as [ð] before a vowel, [θ] elsewhere.</p>
            <p><span className="font-semibold text-[#C0E2DD]">⟨t⟩</span> is a <em>linguolabial</em> stop [t̼] — the tongue tip touches the upper lip.</p>
            <p><span className="font-semibold text-[#C0E2DD]">⟨f⟩</span> is a <em>bilabial</em> fricative [ɸ] — both lips, no teeth.</p>
          </div>
        </div>
      )}
    </div>
  )
}

function TableSection({ rows }: { rows: typeof ALPHABET_TABLE }) {
  return (
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr className="text-left text-[10px] text-[#6B7182]">
          <th className="pb-1.5 font-normal w-10">Graph</th>
          <th className="pb-1.5 font-normal w-14">IPA</th>
          <th className="pb-1.5 font-normal">Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.orthographic} className="border-t border-[#3E424C]">
            <td className="py-1 font-mono text-[#D8456F] font-semibold">{row.orthographic}</td>
            <td className="py-1 font-mono text-[#C0E2DD]">[{row.ipa}]</td>
            <td className="py-1 text-[#6B7182] text-[10px]">{row.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
