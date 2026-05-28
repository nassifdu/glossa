import { createClient } from '@supabase/supabase-js'

export interface LexiconWord {
  id: number
  orthographic: string
  ipa: string
  meaning: string | null
  word_class: string | null
  created_at: string
}

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function fetchLexicon(): Promise<LexiconWord[]> {
  const client = getClient()
  if (!client) return []

  const { data, error } = await client
    .from('lexicon')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
}
