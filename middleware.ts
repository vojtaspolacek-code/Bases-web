import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Pouze /ucet/profil a jeho podstránky jsou chráněné
const isProtectedRoute = createRouteMatcher(['/ucet/profil(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Přeskočit Next.js interní soubory a statické assety
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Vždy spustit pro API routes
    '/(api|trpc)(.*)',
  ],
}
