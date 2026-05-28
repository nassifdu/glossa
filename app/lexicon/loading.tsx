export default function LexiconLoading() {
  return (
    <main className="flex-1 min-h-0 overflow-y-auto px-5 py-4 flex items-start gap-2">
      <svg
        className="animate-spin text-[#269BA6] mt-0.5"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="text-xs text-[#6B7182]">Loading lexicon…</span>
    </main>
  )
}
