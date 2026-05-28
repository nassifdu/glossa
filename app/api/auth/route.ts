import { NextRequest, NextResponse } from 'next/server'
import { signSession, COOKIE_NAME } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const password = process.env.AUTH_PASSWORD
  const secret = process.env.AUTH_SECRET

  if (!password || !secret) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 500 })
  }

  const { password: input, from } = await req.json()

  if (input !== password) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }

  const token = await signSession(secret)
  const res = NextResponse.json({ ok: true })

  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(COOKIE_NAME)
  return res
}
