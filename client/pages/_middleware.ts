import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const protectedRoutes = ['/', '/cost', '/db', '/dist', '/stat']

export async function middleware(req: any) {
  const url = req.nextUrl.clone()
  const isProtectedRoute = protectedRoutes.includes(url.pathname)
  if (!isProtectedRoute) return NextResponse.next()

  const session = await getToken({ req, secret: process.env.SECRET })
  if (session) return NextResponse.next()

  url.pathname = '/auth/login'
  return  NextResponse.redirect(url)
}