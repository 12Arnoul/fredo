// Middleware Next.js — Protection minimale des routes privées
// NOTE: /admin est géré par sa propre vérification client-side
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Bloquer l'accès aux pages auth si déjà connecté (cookie simple)
    // La vérification complète Supabase se fait dans chaque page
    const routesAuth = ['/connexion', '/inscription']
    const estPageAuth = routesAuth.some(r => pathname.startsWith(r))
    const hasCookie = request.cookies.has('sb-access-token') ||
        request.cookies.getAll().some(c => c.name.includes('auth-token') || c.name.startsWith('sb-'))

    if (estPageAuth && hasCookie) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
