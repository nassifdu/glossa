import type { PhonemeKey, Syllable, GeneratedWord, SyllableCount, SyllableShape, LongVowelMode } from './types'

// ─── Phoneme inventory ────────────────────────────────────────────────────────

export const PHONEME_IPA: Record<PhonemeKey, string> = {
  a: 'a', e: 'ɛ', i: 'i', o: 'ø', u: 'u',
  'ä': 'aː', 'ë': 'eː', 'ï': 'iː', 'ö': 'oː',
  v: 'v', p: 'p', d: 'd', t: 't̼', h: 'ALLOPHONE',
  m: 'm', n: 'n', x: 'x', r: 'ɾ', l: 'l',
  k: 'k', c: 'tʃ', g: 'ɣ', f: 'ɸ', s: 's',
}

export const SHORT_VOWELS: PhonemeKey[] = ['a', 'e', 'i', 'o', 'u']
export const LONG_VOWELS: PhonemeKey[] = ['ä', 'ë', 'ï', 'ö']
export const ALL_VOWELS: PhonemeKey[] = [...SHORT_VOWELS, ...LONG_VOWELS]

// Weighted onset consonants: [phoneme, weight]
const ONSET_WEIGHTS: [PhonemeKey, number][] = [
  ['m', 8], ['n', 7], ['l', 7], ['r', 6], ['s', 6],
  ['p', 6], ['d', 5], ['h', 5], ['k', 5], ['v', 4],
  ['t', 4], ['c', 4], ['x', 3], ['g', 3], ['f', 3],
]

// Weighted coda consonants: [phoneme, weight]
const CODA_WEIGHTS: [PhonemeKey, number][] = [
  ['n', 9], ['m', 7], ['l', 7], ['r', 6], ['s', 5], ['p', 5], ['k', 4],
]

export const ONSET_CONSONANTS = new Set(ONSET_WEIGHTS.map(([p]) => p))
export const CODA_CONSONANTS = new Set(CODA_WEIGHTS.map(([p]) => p))

// ─── IPA conversion ──────────────────────────────────────────────────────────

function resolveHAllophone(context: 'before-vowel' | 'elsewhere'): string {
  return context === 'before-vowel' ? 'ð' : 'θ'
}

export function toIPA(phoneme: PhonemeKey, nextPhoneme: PhonemeKey | null): string {
  if (phoneme === 'h') {
    const nextIsVowel = nextPhoneme !== null && (ALL_VOWELS as string[]).includes(nextPhoneme)
    return resolveHAllophone(nextIsVowel ? 'before-vowel' : 'elsewhere')
  }
  return PHONEME_IPA[phoneme]
}

// Convert a full word (list of phoneme chars) to IPA string with syllabification and stress
export function syllablesToIPA(syllables: Syllable[]): string {
  if (syllables.length === 0) return ''

  // Determine stress position
  const stressIdx = getStressIndex(syllables)

  // Build flat list of chars per syllable for allophone resolution
  return syllables
    .map((syl, sIdx) => {
      const chars = syllableToChars(syl)
      const ipaChars = chars.map((ch, cIdx) => {
        const nextChar = getNextChar(syllables, sIdx, cIdx)
        return toIPA(ch as PhonemeKey, nextChar as PhonemeKey | null)
      })
      const prefix = stressIdx === sIdx && syllables.length > 1 ? 'ˈ' : ''
      return prefix + ipaChars.join('')
    })
    .join('.')
}

function syllableToChars(syl: Syllable): string[] {
  const chars: string[] = []
  if (syl.onset) chars.push(...splitMultichar(syl.onset))
  chars.push(...splitMultichar(syl.nucleus))
  if (syl.coda) chars.push(...splitMultichar(syl.coda))
  return chars
}

// Some orthographic chars like 'ä' are single code points — split by grapheme
function splitMultichar(s: string): string[] {
  return [...s]
}

function getNextChar(syllables: Syllable[], sylIdx: number, charIdx: number): string | null {
  const chars = syllableToChars(syllables[sylIdx])
  if (charIdx + 1 < chars.length) return chars[charIdx + 1]
  // look at next syllable
  if (sylIdx + 1 < syllables.length) {
    const nextChars = syllableToChars(syllables[sylIdx + 1])
    return nextChars[0] ?? null
  }
  return null
}

function getStressIndex(syllables: Syllable[]): number {
  if (syllables.length === 1) return -1 // monosyllabic: no stress

  // Rule 1: first syllable with a long vowel
  const longIdx = syllables.findIndex(s => (LONG_VOWELS as string[]).includes(s.nucleus))
  if (longIdx !== -1) return longIdx

  // Rule 2: penultimate if 2 syllables, second if 3+
  if (syllables.length === 2) return 1
  return 1
}

// ─── Weighted random selection ───────────────────────────────────────────────

function weightedPick<T>(pool: [T, number][]): T {
  const total = pool.reduce((s, [, w]) => s + w, 0)
  let rand = Math.random() * total
  for (const [item, weight] of pool) {
    rand -= weight
    if (rand <= 0) return item
  }
  return pool[pool.length - 1][0]
}

function filterByActive<T extends PhonemeKey>(
  weights: [T, number][],
  active: Set<PhonemeKey>
): [T, number][] {
  return weights.filter(([p]) => active.has(p))
}

// ─── Syllable generation ─────────────────────────────────────────────────────

function pickVowel(
  active: Set<PhonemeKey>,
  longVowelMode: LongVowelMode
): PhonemeKey {
  const activeShort = SHORT_VOWELS.filter(v => active.has(v))
  const activeLong = LONG_VOWELS.filter(v => active.has(v))

  if (activeLong.length === 0 || longVowelMode === 'disallowed') {
    return activeShort[Math.floor(Math.random() * activeShort.length)]
  }
  if (longVowelMode === 'rare') {
    const useLong = Math.random() < 0.15
    const pool = useLong && activeLong.length > 0 ? activeLong : activeShort
    return pool[Math.floor(Math.random() * pool.length)]
  }
  // allowed: equal chance
  const pool = [...activeShort, ...activeLong]
  return pool[Math.floor(Math.random() * pool.length)]
}

function pickOnset(
  active: Set<PhonemeKey>,
  prevCoda: PhonemeKey | null
): PhonemeKey | null {
  let pool = filterByActive(ONSET_WEIGHTS, active)
  // No gemination: exclude onset === previous coda
  if (prevCoda) pool = pool.filter(([p]) => p !== prevCoda)
  if (pool.length === 0) return null
  return weightedPick(pool)
}

function pickCoda(
  active: Set<PhonemeKey>,
  onset: PhonemeKey | null
): PhonemeKey | null {
  let pool = filterByActive(CODA_WEIGHTS, active)
  // No gemination: exclude coda === next onset (we approximate: just return null if pool empty)
  if (pool.length === 0) return null
  return weightedPick(pool)
}

function generateSyllable(
  active: Set<PhonemeKey>,
  position: 'initial' | 'non-initial',
  shape: SyllableShape,
  longVowelMode: LongVowelMode,
  prevCoda: PhonemeKey | null
): Syllable {
  const nucleus = pickVowel(active, longVowelMode)

  let useOnset: boolean
  let useCoda: boolean

  if (position === 'initial') {
    // V, CV, or CVC
    if (shape === 'open') {
      useOnset = Math.random() < 0.8
      useCoda = false
    } else if (shape === 'closed') {
      useOnset = Math.random() < 0.8
      useCoda = true
    } else {
      useOnset = Math.random() < 0.8
      useCoda = Math.random() < 0.5
    }
  } else {
    // Non-initial: always CV or CVC (never bare V)
    useOnset = true
    if (shape === 'open') {
      useCoda = false
    } else if (shape === 'closed') {
      useCoda = true
    } else {
      useCoda = Math.random() < 0.5
    }
  }

  const onset = useOnset ? pickOnset(active, prevCoda) : null
  const coda = useCoda ? pickCoda(active, onset) : null

  return { onset: onset ?? null, nucleus, coda: coda ?? null }
}

// ─── Word generation ─────────────────────────────────────────────────────────

function syllableNotation(syl: Syllable): string {
  const o = syl.onset ? 'C' : ''
  const c = syl.coda ? 'C' : ''
  return `${o}V${c}`
}

export function generateWord(
  active: Set<PhonemeKey>,
  syllableCount: SyllableCount,
  shape: SyllableShape,
  longVowelMode: LongVowelMode
): GeneratedWord {
  // Determine number of syllables
  let count: number
  if (syllableCount === 'mono') count = 1
  else if (syllableCount === 'di') count = 2
  else if (syllableCount === 'tri') count = 3
  else count = Math.floor(Math.random() * 3) + 1 // 1–3

  const syllables: Syllable[] = []
  let prevCoda: PhonemeKey | null = null

  for (let i = 0; i < count; i++) {
    const syl = generateSyllable(
      active,
      i === 0 ? 'initial' : 'non-initial',
      shape,
      longVowelMode,
      prevCoda
    )
    syllables.push(syl)
    prevCoda = syl.coda as PhonemeKey | null
  }

  const orthographic = syllables
    .map(s => (s.onset ?? '') + s.nucleus + (s.coda ?? ''))
    .join('')

  const ipa = syllablesToIPA(syllables)
  const notation = syllables.map(syllableNotation).join('.')

  return { orthographic, ipa: `/${ipa}/`, syllableNotation: notation, syllables }
}

export function generateWords(
  active: Set<PhonemeKey>,
  count: number,
  syllableCount: SyllableCount,
  shape: SyllableShape,
  longVowelMode: LongVowelMode
): GeneratedWord[] {
  return Array.from({ length: count }, () =>
    generateWord(active, syllableCount, shape, longVowelMode)
  )
}

// ─── Alphabet reference data ──────────────────────────────────────────────────

export interface AlphabetEntry {
  orthographic: string
  ipa: string
  notes?: string
}

export const ALPHABET_TABLE: AlphabetEntry[] = [
  { orthographic: 'a', ipa: 'a', notes: 'low central vowel' },
  { orthographic: 'e', ipa: 'ɛ', notes: 'open-mid front vowel' },
  { orthographic: 'i', ipa: 'i', notes: 'close front vowel' },
  { orthographic: 'o', ipa: 'ø', notes: 'close-mid front rounded vowel' },
  { orthographic: 'u', ipa: 'u', notes: 'close back rounded vowel' },
  { orthographic: 'ä', ipa: 'aː', notes: 'long low central vowel' },
  { orthographic: 'ë', ipa: 'eː', notes: 'long mid front vowel' },
  { orthographic: 'ï', ipa: 'iː', notes: 'long close front vowel' },
  { orthographic: 'ö', ipa: 'oː', notes: 'long close-mid front rounded vowel' },
  { orthographic: 'v', ipa: 'v', notes: 'voiced labiodental fricative' },
  { orthographic: 'p', ipa: 'p', notes: 'voiceless bilabial stop' },
  { orthographic: 'd', ipa: 'd', notes: 'voiced alveolar stop' },
  { orthographic: 't', ipa: 't̼', notes: 'voiceless linguolabial stop' },
  { orthographic: 'h', ipa: 'ð / θ', notes: '⟨ð⟩ before vowels, ⟨θ⟩ elsewhere (allophonic)' },
  { orthographic: 'm', ipa: 'm', notes: 'bilabial nasal' },
  { orthographic: 'n', ipa: 'n', notes: 'alveolar nasal' },
  { orthographic: 'x', ipa: 'x', notes: 'voiceless velar fricative' },
  { orthographic: 'r', ipa: 'ɾ', notes: 'alveolar tap/flap' },
  { orthographic: 'l', ipa: 'l', notes: 'alveolar lateral' },
  { orthographic: 'k', ipa: 'k', notes: 'voiceless velar stop' },
  { orthographic: 'c', ipa: 'tʃ', notes: 'voiceless palato-alveolar affricate' },
  { orthographic: 'g', ipa: 'ɣ', notes: 'voiced velar fricative' },
  { orthographic: 'f', ipa: 'ɸ', notes: 'voiceless bilabial fricative' },
  { orthographic: 's', ipa: 's', notes: 'voiceless alveolar fricative' },
]
