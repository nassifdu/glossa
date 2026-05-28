const COOKIE_NAME = 'glossa_session'
const SESSION_VALUE = 'authenticated'

function enc(s: string) {
  return new TextEncoder().encode(s)
}

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    enc(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

export async function signSession(secret: string): Promise<string> {
  const key = await getKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, enc(SESSION_VALUE))
  return Buffer.from(sig).toString('hex')
}

export async function verifySession(secret: string, token: string): Promise<boolean> {
  try {
    const key = await getKey(secret)
    const sig = Buffer.from(token, 'hex')
    return crypto.subtle.verify('HMAC', key, sig, enc(SESSION_VALUE))
  } catch {
    return false
  }
}

export { COOKIE_NAME }
