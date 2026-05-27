export type PhonemeKey =
  | 'a' | 'e' | 'i' | 'o' | 'u'
  | 'ä' | 'ë' | 'ï' | 'ö'
  | 'v' | 'b' | 'd' | 't' | 'h'
  | 'm' | 'n' | 'x' | 'r' | 'l'
  | 'k' | 'c' | 'g' | 'f' | 's'

export type SyllableCount = 'mono' | 'di' | 'tri' | 'mixed'
export type SyllableShape = 'open' | 'closed' | 'mixed'
export type LongVowelMode = 'allowed' | 'disallowed' | 'rare'

export interface GeneratorSettings {
  activePhonemes: Set<PhonemeKey>
  wordCount: number
  syllableCount: SyllableCount
  syllableShape: SyllableShape
  longVowelMode: LongVowelMode
}

export interface Syllable {
  onset: string | null
  nucleus: string
  coda: string | null
}

export interface GeneratedWord {
  orthographic: string
  ipa: string
  syllableNotation: string
  syllables: Syllable[]
}
