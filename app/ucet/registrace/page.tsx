'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSignUp, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthPanel, AuthInput, GoldButton, ErrorMsg, SsoSection, ease, type SsoStrategy } from '../_components'

type Step = 'form' | 'otp'

export default function RegistracePage() {
  const { signUp, fetchStatus } = useSignUp()
  const { isSignedIn }          = useAuth()
  const router                  = useRouter()

  const [step, setStep]             = useState<Step>('form')
  const [firstName, setFirstName]   = useState('')
  const [lastName, setLastName]     = useState('')
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [otpCode, setOtpCode]       = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  useEffect(() => {
    if (isSignedIn) router.replace('/ucet/profil')
  }, [isSignedIn, router])

  /* ─── Krok 1: Registrace ─── */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signUp || fetchStatus === 'fetching') return
    setLoading(true); setError('')
    try {
      const { error: err } = await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      })
      if (err) { setError(err.message ?? 'Registrace selhala.'); return }

      if (signUp.status === 'complete') { router.push('/ucet/profil'); return }

      // Ověření e-mailu
      if (signUp.status === 'missing_requirements') {
        const { error: e2 } = await signUp.verifications.sendEmailCode()
        if (e2) { setError(e2.message ?? 'Nepodařilo se odeslat ověřovací kód.'); return }
        setStep('otp'); return
      }
      setError('Nastala neočekávaná chyba. Zkuste to znovu.')
    } catch (err: unknown) {
      const e = err as { errors?: { message: string }[] }
      setError(e?.errors?.[0]?.message ?? 'Registrace selhala.')
    } finally { setLoading(false) }
  }

  /* ─── Krok 2: OTP ─── */
  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signUp || fetchStatus === 'fetching') return
    setLoading(true); setError('')
    try {
      const { error: err } = await signUp.verifications.verifyEmailCode({ code: otpCode })
      if (err) { setError(err.message ?? 'Nesprávný nebo vypršelý kód.'); return }
      if (signUp.status === 'complete') router.push('/ucet/profil')
      else setError('Ověření nebylo úspěšné. Zkuste to znovu.')
    } catch (err: unknown) {
      const e = err as { errors?: { message: string }[] }
      setError(e?.errors?.[0]?.message ?? 'Ověření selhalo.')
    } finally { setLoading(false) }
  }

  const resendCode = async () => {
    if (!signUp) return
    setError(''); setOtpCode('')
    const { error } = await signUp.verifications.sendEmailCode()
    if (error) setError('Nepodařilo se znovu odeslat kód.')
  }

  /* ─── SSO ─── */
  const handleSso = async (strategy: SsoStrategy) => {
    if (!signUp) return
    setError('')
    const base = typeof window !== 'undefined' ? window.location.origin : ''
    try {
      await signUp.sso({ strategy, redirectUrl: `${base}/ucet/sso-callback`, redirectCallbackUrl: `${base}/ucet/sso-callback` })
    } catch (err: unknown) {
      const e = err as { errors?: { message: string }[] }
      setError(e?.errors?.[0]?.message ?? 'Registrace přes sociální síť selhala.')
    }
  }

  /* ─── UI ─── */
  return (
    <main className="min-h-screen md:h-screen bg-[#0a0a0a] pt-[72px] md:pt-0 grid md:grid-cols-2">

      {/* ── LEVÝ SLOUPEC ── */}
      <div className="flex flex-col items-center justify-center px-8 py-24 md:py-10 md:px-12 lg:px-20 md:overflow-y-auto">
        <div className="w-full max-w-[400px]">

          <AnimatePresence mode="wait">

            {/* Krok 1: registrační formulář */}
            {step === 'form' && (
              <motion.div key="form"
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.45, ease }}>

                <p className="text-[10px] uppercase tracking-[0.45em] mb-4 text-center"
                  style={{ color: '#c7a04b', fontFamily: 'var(--font-montserrat)' }}>
                  — Přidejte se k nám
                </p>
                <h1 className="text-4xl font-thin uppercase tracking-[0.18em] text-white/90 text-center mb-2"
                  style={{ fontFamily: 'var(--font-exo2)' }}>
                  Registrace
                </h1>
                <div className="mx-auto mb-10 h-px w-10"
                  style={{ background: 'linear-gradient(to right, transparent, #c7a04b, transparent)' }} />

                <form onSubmit={handleRegister} className="flex flex-col gap-7">
                  {/* Jméno + Příjmení vedle sebe */}
                  <div className="grid grid-cols-2 gap-4">
                    <AuthInput id="firstName" type="text" autoComplete="given-name" required
                      label="Jméno" placeholder="Jan"
                      value={firstName} onChange={e => setFirstName(e.target.value)} />
                    <AuthInput id="lastName" type="text" autoComplete="family-name" required
                      label="Příjmení" placeholder="Novák"
                      value={lastName} onChange={e => setLastName(e.target.value)} />
                  </div>

                  <AuthInput id="email" type="email" autoComplete="email" required
                    label="E-mail" placeholder="vas@email.cz"
                    value={email} onChange={e => setEmail(e.target.value)} />

                  <AuthInput id="password" type="password" autoComplete="new-password" required
                    label="Heslo" placeholder="min. 8 znaků"
                    value={password} onChange={e => setPassword(e.target.value)} />

                  {error && <ErrorMsg text={error} />}

                  <GoldButton loading={loading}
                    disabled={!signUp || fetchStatus === 'fetching'} label="Vytvořit účet" />
                </form>

                <SsoSection onSso={handleSso} />

                <p className="mt-8 text-center text-[13px] tracking-wide"
                  style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.40)' }}>
                  Již máte účet?{' '}
                  <Link href="/ucet"
                    className="no-underline font-semibold text-[#c7a04b] hover:text-[#c7a04b]/80 transition-colors duration-300 tracking-wider">
                    Přihlásit se
                  </Link>
                </p>
              </motion.div>
            )}

            {/* Krok 2: OTP */}
            {step === 'otp' && (
              <motion.div key="otp"
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.45, ease }}>

                <button onClick={() => { setStep('form'); setError(''); setOtpCode('') }}
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
                  — Ověřte svůj e-mail
                </p>
                <h1 className="text-4xl font-thin uppercase tracking-[0.18em] text-white/90 text-center mb-2"
                  style={{ fontFamily: 'var(--font-exo2)' }}>Kód</h1>
                <div className="mx-auto mb-4 h-px w-10"
                  style={{ background: 'linear-gradient(to right, transparent, #c7a04b, transparent)' }} />
                <p className="text-center text-[11px] mb-10 leading-relaxed"
                  style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
                  Odeslali jsme ověřovací kód na<br />
                  <span style={{ color: 'rgba(199,160,75,0.7)' }}>{email}</span>
                </p>

                <form onSubmit={handleOtp} className="flex flex-col gap-7">
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
                  {error && <ErrorMsg text={error} />}
                  <button type="submit"
                    disabled={loading || otpCode.length < 6 || fetchStatus === 'fetching'}
                    className="w-full py-4 rounded-full uppercase tracking-[0.25em] text-[0.72rem] font-semibold
                               transition-all duration-300
                               hover:shadow-[0_8px_28px_rgba(199,160,75,0.30)] hover:-translate-y-0.5
                               active:translate-y-0 active:shadow-none
                               disabled:opacity-50 disabled:cursor-not-allowed
                               disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    style={{ fontFamily: 'var(--font-montserrat)', background: '#c7a04b', color: '#0a0a0a' }}>
                    {loading ? 'Ověřuji…' : 'Potvrdit'}
                  </button>
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
