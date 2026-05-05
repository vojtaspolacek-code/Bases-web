'use client'

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

// Tato stránka dokončí OAuth flow – Clerk sem přesměruje po Google/Apple/Facebook přihlášení
// a AuthenticateWithRedirectCallback automaticky vytvoří session + přesměruje na /ucet/profil

export default function SsoCallbackPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      {/* Spinner — viditelný jen zlomek sekundy */}
      <div className="w-5 h-5 rounded-full border border-[#c7a04b]/30 border-t-[#c7a04b] animate-spin" />
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/ucet/profil"
        signUpFallbackRedirectUrl="/ucet/profil"
      />
    </main>
  )
}
