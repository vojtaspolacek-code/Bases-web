'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthPanel, AuthInput, GoldButton, ErrorMsg, ease } from '../_components'

type Step = 'email' | 'verify'

export default function ResetPage() {
  const { signIn, fetchStatus } = useSignIn()
  const router                  = useRouter()

  const [step, setStep]             = useState<Step>('email')
  const [email, setEmail]           = useState('')
  const [otpCode, setOtpCode]       = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  /* ─── Krok 1: Odešli kód ─── */
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signIn || fetchStatus === 'fetching') return
    setLoading(true); setError('')
    try {
      // Inicializuj sign-in s identifikátorem
      const { error: err } = await signIn.create({ identifier: email })
      if (err) { setError(err.message ?? 'E-mail nebyl nalezen.'); return }

      // Odešli reset kód
      const { error: e2 } = await signIn.resetPasswordEmailCode.sendCode()
      if (e2) { setError(e2.message ?? 'Nepodařilo se odeslat kód.'); return }

      setStep('verify')
    } catch (err: unknown) {
      const e = err as { errors?: { message: string }[] }
      setError(e?.errors?.[0]?.message ?? 'Nepodařilo se odeslat kód.')
    } finally { setLoading(false) }
  }

  /* ─── Krok 2: Ověř kód + nastavit nové heslo ─── */
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signIn || fetchStatus === 'fetching') return
    setLoading(true); setError('')
    try {
      // Ověř OTP kód → signIn.status becomes 'needs_new_password'
      const { error: err } = await signIn.resetPasswordEmailCode.verifyCode({ code: otpCode })
      if (err) { setError(err.message ?? 'Nesprávný nebo vypršelý kód.'); return }

      // Nastav nové heslo → completes sign-in
      const { error: e2 } = await signIn.resetPasswordEmailCode.submitPassword({
        password: newPassword,
        signOutOfOtherSessions: true,
      })
      if (e2) { setError(e2.message ?? 'Heslo se nepodařilo nastavit.'); return }

      if (signIn.status === 'complete') {
        router.push('/ucet/profil')
      } else {
        setError('Heslo bylo obnoveno. Přihlaste se prosím.')
        router.push('/ucet')
      }
    } catch (err: unknown) {
      const e = err as { errors?: { message: string }[] }
      setError(e?.errors?.[0]?.message ?? 'Obnovení hesla selhalo.')
    } finally { setLoading(false) }
  }

  const resendCode = async () => {
    if (!signIn) return
    setError(''); setOtpCode('')
    const { error } = await signIn.resetPasswordEmailCode.sendCode()
    if (error) setError('Nepodařilo se znovu odeslat kód.')
  }

  /* ─── UI ─── */
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-[72px] md:pt-0 grid md:grid-cols-2">

      {/* ── LEVÝ SLOUPEC ── */}
      <div className="flex flex-col items-center justify-center px-8 min-h-[calc(100dvh-72px)] md:min-h-0 md:py-0 md:px-12 lg:px-20">
        <div className="w-full max-w-[400px]">

          <AnimatePresence mode="wait">

            {/* Krok 1: Zadání e-mailu */}
            {step === 'email' && (
              <motion.div key="email"
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.45, ease }}>

                {/* Zpět na login */}
                <Link href="/ucet"
                  className="inline-flex items-center gap-2 no-underline mb-10
                             text-[9px] uppercase tracking-[0.32em] text-white/25
                             hover:text-[#c7a04b]/60 transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-montserrat)' }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <polyline points="10,3 4,8 10,13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Zpět na přihlášení
                </Link>

                <p className="text-[10px] uppercase tracking-[0.45em] mb-4 text-center"
                  style={{ color: '#c7a04b', fontFamily: 'var(--font-montserrat)' }}>
                  — Obnovení přístupu
                </p>
                <h1 className="text-4xl font-thin uppercase tracking-[0.18em] text-white/90 text-center mb-2"
                  style={{ fontFamily: 'var(--font-exo2)' }}>
                  Reset hesla
                </h1>
                <div className="mx-auto mb-4 h-px w-10"
                  style={{ background: 'linear-gradient(to right, transparent, #c7a04b, transparent)' }} />
                <p className="text-center text-[11px] mb-10 leading-relaxed"
                  style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>
                  Zadejte svůj e-mail a my vám pošleme kód pro obnovení hesla.
                </p>

                <form onSubmit={handleSendCode} className="flex flex-col gap-7">
                  <AuthInput id="email" type="email" autoComplete="email" required
                    label="E-mail" placeholder="vas@email.cz"
                    value={email} onChange={e => setEmail(e.target.value)} />

                  {error && <ErrorMsg text={error} />}

                  <GoldButton loading={loading}
                    disabled={!signIn || fetchStatus === 'fetching'} label="Odeslat kód" />
                </form>
              </motion.div>
            )}

            {/* Krok 2: OTP + nové heslo */}
            {step === 'verify' && (
              <motion.div key="verify"
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.45, ease }}>

                <button onClick={() => { setStep('email'); setError(''); setOtpCode(''); setNewPassword('') }}
                  className="flex items-center gap-2 bg-transparent border-0 cursor-pointer p-0 mb-10
                             text-[9px] uppercase tracking-[0.32em] text-white/25 hover:text-[#c7a04b]/60
                             transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-montserrat)' }}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <polyline points="10,3 4,8 10,13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Zpět
                </button>

                <p className="text-[10px] uppercase tracking-[0.45em] mb-4 text-center"
                  style={{ color: '#c7a04b', fontFamily: 'var(--font-montserrat)' }}>
                  — Nové heslo
                </p>
                <h1 className="text-4xl font-thin uppercase tracking-[0.18em] text-white/90 text-center mb-2"
                  style={{ fontFamily: 'var(--font-exo2)' }}>Obnovení</h1>
                <div className="mx-auto mb-4 h-px w-10"
                  style={{ background: 'linear-gradient(to right, transparent, #c7a04b, transparent)' }} />
                <p className="text-center text-[11px] mb-10 leading-relaxed"
                  style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
                  Kód byl odeslán na<br />
                  <span style={{ color: 'rgba(199,160,75,0.7)' }}>{email}</span>
                </p>

                <form onSubmit={handleReset} className="flex flex-col gap-7">
                  {/* OTP kód */}
                  <div className="relative">
                    <label htmlFor="otp" className="block text-[9px] uppercase tracking-[0.38em] mb-3"
                      style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.55)' }}>
                      Ověřovací kód
                    </label>
                    <input id="otp" type="text" inputMode="numeric" autoComplete="one-time-code"
                      maxLength={6} required autoFocus
                      value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-transparent border-b outline-none py-2.5 text-center
                                 text-[1.6rem] font-thin text-white/90 placeholder-white/10
                                 tracking-[0.6em] border-white/15 focus:border-[#c7a04b] transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-exo2)' }} placeholder="······" />
                  </div>

                  {/* Nové heslo */}
                  <AuthInput id="newPassword" type="password" autoComplete="new-password" required
                    label="Nové heslo" placeholder="min. 8 znaků"
                    value={newPassword} onChange={e => setNewPassword(e.target.value)} />

                  {error && <ErrorMsg text={error} />}

                  <GoldButton loading={loading}
                    disabled={!signIn || fetchStatus === 'fetching' || otpCode.length < 6}
                    label="Obnovit heslo" />
                </form>

                <p className="mt-7 text-center text-[10px] tracking-[0.2em]"
                  style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.22)' }}>
                  Kód nepřišel?{' '}
                  <button onClick={resendCode}
                    className="bg-transparent border-0 cursor-pointer p-0 text-[#c7a04b]/65
                               hover:text-[#c7a04b] transition-colors duration-300 text-[10px] tracking-[0.2em]"
                    style={{ fontFamily: 'var(--font-montserrat)' }}>
                    Odeslat znovu
                  </button>
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── PRAVÝ SLOUPEC ── */}
      <AuthPanel />

    </main>
  )
}
