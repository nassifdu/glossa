# Glossa — Conlang Word Generator

A Next.js 15 app for generating words in a constructed language. All phonological logic lives in [`lib/phonology.ts`](lib/phonology.ts).

## The phonology

### Vowel system

The language has five short vowels and four long vowels marked with diaeresis:

| Graph | IPA | Notes |
|-------|-----|-------|
| a | /a/ | Low central |
| e | /ɛ/ | Open-mid front |
| i | /i/ | Close front |
| **o** | **/ø/** | Close-mid **front rounded** — like German *schön* |
| u | /u/ | Close back rounded |
| ä | /aː/ | Long low central |
| ë | /eː/ | Long mid front |
| ï | /iː/ | Long close front |
| ö | /oː/ | Long close-mid front rounded |

The unusual member is ⟨o⟩ = /ø/: a front-rounded vowel, giving the language a distinctly Germanic or Finnish feel in its vowel space.

### Notable consonants

**Linguolabial stop ⟨t⟩ = /t̼/**
The diacritic `̼` marks a *linguolabial* place of articulation: the blade of the tongue makes contact with the upper lip rather than the alveolar ridge. Extremely rare cross-linguistically, documented primarily in Vanuatu languages (Tangga, Bao, Äiwoo).

**Bilabial fricative ⟨f⟩ = /ɸ/**
Unlike English /f/ (labiodental), this is a *bilabial* fricative where both lips produce the friction. Common in Japanese before /u/.

**Allophonic ⟨h⟩**
⟨h⟩ has no fixed realization — it varies by context:
- Before a vowel → [ð] (voiced dental fricative, like English *this*)
- Elsewhere (word-finally, before consonant) → [θ] (voiceless dental fricative, like English *thin*)

The allophony is computed at IPA generation time from phonological context; the underlying phoneme is abstract /h/.

### Stress system

Rules applied in priority order:

1. **Long vowel attraction** — if any syllable contains ä ë ï ö, stress falls on the *first* such syllable.
2. **Default penultimate** — otherwise, stress falls on the second syllable.
3. **Monosyllables** — no stress mark.

IPA output uses `ˈ` prefix and `.` syllable boundaries:
- `namel → /na.ˈmɛl/`
- `märon → /ˈmaː.ɾøn/`
- `kal → /kal/`

### Phonotactics

Syllable shapes: **V**, **CV**, **CVC**. Non-initial syllables always have an onset (no hiatus). Gemination is forbidden (no coda = following onset).

**Onset consonants** (by descending frequency weight): `m n l r s p d h k v t c x g f`

**Coda consonants** (only these may close a syllable): `n m l r s p k`

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

The app is fully client-side (no API routes). Deploy to **Vercel** by connecting the repository, or build for static hosting:

```bash
npm run build
```
