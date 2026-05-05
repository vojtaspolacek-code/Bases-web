// Sdílené komponenty pro /ucet/* stránky
'use client'

import Image from 'next/image'
import { AlertCircle } from 'lucide-react'

/* ─── Pravý dekorativní panel ────────────────────────────────── */
export function AuthPanel() {
  return (
    <div className="hidden md:flex relative flex-col items-center justify-center overflow-hidden bg-[#070707]">
      {/* Foto na pozadí */}
      <Image
        src="/hero-bg-bw.jpg"
        alt=""
        fill
        className="object-cover object-center opacity-30"
        priority
      />
      {/* Vrstvené overlaye */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 20%, rgba(0,0,0,0.6) 80%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.85) 100%)' }} />

      {/* Textový obsah */}
      <div className="relative z-10 px-12 text-center">
        {/* Zlatá dekorativní linka */}
        <div className="mx-auto mb-10 w-8 h-px" style={{ background: 'linear-gradient(to right, transparent, #c7a04b, transparent)' }} />

        <p
          className="text-[9px] uppercase tracking-[0.55em] mb-8"
          style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.65)' }}
        >
          Prémiový výběr z USA
        </p>

        <h2
          className="font-thin uppercase leading-[1.1] text-white/80 mb-8"
          style={{
            fontFamily:    'var(--font-exo2)',
            fontSize:      'clamp(1.6rem, 2.4vw, 2.8rem)',
            letterSpacing: '0.12em',
          }}
        >
          Vstupte do světa<br />
          <span style={{ fontWeight: 300, opacity: 0.55 }}>prémiových chutí</span>
        </h2>

        <div className="mx-auto w-8 h-px" style={{ background: 'linear-gradient(to right, transparent, #c7a04b, transparent)' }} />
      </div>

      {/* Dolní text */}
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <p
          className="text-[8px] uppercase tracking-[0.4em]"
          style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.15)' }}
        >
          Skladem v ČR&nbsp;&nbsp;·&nbsp;&nbsp;Limitované várky
        </p>
      </div>
    </div>
  )
}

/* ─── Chybová hláška ─────────────────────────────────────────── */
export function ErrorMsg({ text }: { text: string }) {
  return (
    <div
      className="flex items-start gap-2.5 px-4 py-3 rounded-lg"
      style={{ background: 'rgba(199,160,75,0.07)', border: '1px solid rgba(199,160,75,0.18)' }}
    >
      <AlertCircle size={14} className="shrink-0 mt-0.5" style={{ color: 'rgba(199,160,75,0.8)' }} />
      <p
        className="text-[11px] leading-relaxed"
        style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.85)', letterSpacing: '0.03em' }}
      >
        {text}
      </p>
    </div>
  )
}

/* ─── Input s border-b stylem ────────────────────────────────── */
export function AuthInput(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props
  return (
    <div className="relative">
      <label
        htmlFor={rest.id}
        className="block text-[9px] uppercase tracking-[0.38em] mb-3"
        style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.55)' }}
      >
        {label}
      </label>
      <input
        {...rest}
        className="w-full bg-transparent border-b outline-none py-2.5
                   text-[0.9rem] text-white/85 placeholder-white/15
                   border-white/15 focus:border-[#c7a04b]
                   transition-colors duration-300"
        style={{ fontFamily: 'var(--font-montserrat)', letterSpacing: '0.04em' }}
      />
    </div>
  )
}

/* ─── Zlaté CTA tlačítko ─────────────────────────────────────── */
export function GoldButton({ children, disabled, loading, label }: {
  children?: React.ReactNode
  disabled?: boolean
  loading?: boolean
  label: string
}) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="w-full py-4 rounded-full uppercase tracking-[0.25em] text-[0.72rem] font-semibold
                 transition-all duration-300
                 hover:shadow-[0_8px_28px_rgba(199,160,75,0.30)] hover:-translate-y-0.5
                 active:translate-y-0 active:shadow-none
                 disabled:opacity-50 disabled:cursor-not-allowed
                 disabled:hover:translate-y-0 disabled:hover:shadow-none"
      style={{ fontFamily: 'var(--font-montserrat)', background: '#c7a04b', color: '#000000' }}
    >
      {loading ? `${label.split(' ')[0]}…` : label}
      {children}
    </button>
  )
}

/* ─── Brand SVG ikony ────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.805 10.023H12v3.977h5.62c-.54 2.695-2.862 4.477-5.62 4.477A6.477 6.477 0 1 1 12 5.523c1.61 0 3.065.592 4.18 1.563l2.83-2.83A10.454 10.454 0 0 0 12 1.5C6.201 1.5 1.5 6.201 1.5 12S6.201 22.5 12 22.5c5.52 0 10.5-4 10.5-10.5 0-.664-.065-1.312-.195-1.977z" />
    </svg>
  )
}
function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.025 10.125 11.927v-8.436H7.078v-3.49h3.047V9.43c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.927-1.956 1.874v2.25h3.328l-.532 3.491h-2.796v8.436C19.612 23.098 24 18.1 24 12.073z" />
    </svg>
  )
}

type SsoStrategy = 'oauth_google' | 'oauth_facebook'

const SSO_PROVIDERS = [
  { strategy: 'oauth_google'   as SsoStrategy, label: 'Google',   Icon: GoogleIcon   },
  { strategy: 'oauth_facebook' as SsoStrategy, label: 'Facebook', Icon: FacebookIcon },
]

/* ─── SSO sekce (oddělovač + 3 tlačítka) ────────────────────── */
export function SsoSection({ onSso }: { onSso: (s: SsoStrategy) => void }) {
  return (
    <>
      {/* Oddělovač */}
      <div className="flex items-center gap-3 my-7">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <span
          className="text-[8px] uppercase tracking-[0.35em] shrink-0"
          style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.2)' }}
        >
          nebo pokračovat přes
        </span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </div>

      {/* SSO tlačítka */}
      <div className="flex flex-col gap-3">
        {SSO_PROVIDERS.map(({ strategy, label, Icon }) => (
          <button
            key={strategy}
            type="button"
            onClick={() => onSso(strategy)}
            className="group w-full flex items-center justify-center gap-3 py-3.5 rounded-full
                       bg-transparent cursor-pointer transition-all duration-300"
            style={{ border: '1px solid rgba(255,255,255,0.12)' }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(199,160,75,0.45)'
              e.currentTarget.style.boxShadow   = '0 0 15px rgba(199,160,75,0.12)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
              e.currentTarget.style.boxShadow   = 'none'
            }}
          >
            <span className="text-white/38 group-hover:text-white/65 transition-colors duration-300">
              <Icon />
            </span>
            <span
              className="text-[11px] uppercase tracking-[0.3em] text-white/40
                         group-hover:text-white/70 transition-colors duration-300"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </>
  )
}

/* ─── OTP krok (sdílený pro login i registraci) ──────────────── */
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export { ease, type SsoStrategy }
