import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from './lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value

  // Paths requiring auth
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login'
  const isDashboardPath = request.nextUrl.pathname.startsWith('/dashboard')
  const isApiAdminPath = request.nextUrl.pathname.startsWith('/api/admin')
  const isApiSessionPath = request.nextUrl.pathname.startsWith('/api/sessions')

  if (!isAdminPath && !isDashboardPath && !isApiAdminPath && !isApiSessionPath) {
    return NextResponse.next()
  }

  if (!token) {
    if (isApiAdminPath || isApiSessionPath) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = isAdminPath ? '/admin/login' : '/login'
    return NextResponse.redirect(new URL(loginUrl, request.url))
  }

  try {
    const payload = await decrypt(token)
    
    // Check admin paths
    if ((isAdminPath || isApiAdminPath) && payload.role !== 'ADMIN') {
      if (isApiAdminPath) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    if (isApiAdminPath || isApiSessionPath) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = isAdminPath ? '/admin/login' : '/login'
    return NextResponse.redirect(new URL(loginUrl, request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/api/:path*'],
}
