import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/projector', '/tap']

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  
  // For API routes, check authorization header
  if (pathname.startsWith('/api/auto-judge')) {
    const authHeader = request.headers.get('authorization')
    const validToken = process.env.API_SECRET_TOKEN
    
    if (authHeader !== `Bearer ${validToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
  
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (pathname === '/projector' || pathname === '/tap') {
      const accessCode = searchParams.get('access')
      const validCode = process.env.PROJECTOR_ACCESS_CODE
      
      if (accessCode !== validCode) {
        return NextResponse.rewrite(new URL('/404', request.url))
      }
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/projector', '/tap', '/api/auto-judge']
}