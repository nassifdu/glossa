'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { parseOrthographic, syllablesToIPA } from '@/lib/phonology'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, { auth: { persistSession: false } })
}

async function isDuplicate(orthographic: string): Promise<boolean> {
  const { data } = await getClient()
    .from('lexicon')
    .select('id')
    .eq('orthographic', orthographic)
    .limit(1)
  return (data?.length ?? 0) > 0
}

export async function saveWord(
  orthographic: string,
  ipa: string,
  meaning?: string,
  wordClass?: string,
): Promise<{ error?: string }> {
  if (await isDuplicate(orthographic)) return { error: 'already-saved' }

  const { error } = await getClient().from('lexicon').insert({
    orthographic,
    ipa,
    meaning: meaning?.trim() || null,
    word_class: wordClass || null,
  })
  if (error) return { error: error.message }

  revalidatePath('/lexicon')
  return {}
}

export async function saveManualWord(
  orthographic: string,
  meaning?: string,
  wordClass?: string,
): Promise<{ error?: string }> {
  const trimmed = orthographic.trim()
  if (!trimmed) return { error: 'Word cannot be empty.' }

  const syllables = parseOrthographic(trimmed)
  if (!syllables) return { error: 'Could not parse — use only valid phonemes (a e i o u ä ë ï ö v b d t h m n x r l k c g f s).' }

  if (await isDuplicate(trimmed)) return { error: 'This word is already in the lexicon.' }

  const ipa = `/${syllablesToIPA(syllables)}/`

  const { error } = await getClient().from('lexicon').insert({
    orthographic: trimmed,
    ipa,
    meaning: meaning?.trim() || null,
    word_class: wordClass || null,
  })
  if (error) return { error: error.message }

  revalidatePath('/lexicon')
  return {}
}

export async function updateWord(
  id: number,
  meaning: string,
  wordClass: string,
): Promise<{ error?: string }> {
  const { error } = await getClient()
    .from('lexicon')
    .update({
      meaning: meaning.trim() || null,
      word_class: wordClass || null,
    })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/lexicon')
  return {}
}

export async function deleteWord(id: number): Promise<{ error?: string }> {
  const { error } = await getClient().from('lexicon').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/lexicon')
  return {}
}
