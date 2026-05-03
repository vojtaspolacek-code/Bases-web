'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

type Tab = 'osobni' | 'objednavky' | 'adresy'

const TABS: { id: Tab; label: string }[] = [
  { id: 'osobni',      label: 'Osobní údaje'       },
  { id: 'objednavky',  label: 'Historie objednávek' },
  { id: 'adresy',      label: 'Dodací adresy'       },
]

/* ─── Elegantní read-only pole ────────────────────────────────── */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="relative pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <p
        className="text-[9px] uppercase tracking-[0.42em] mb-3"
        style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.5)' }}
      >
        {label}
      </p>
      <p
        className="text-[0.9rem] text-white/75 pb-2"
        style={{ fontFamily: 'var(--font-montserrat)', letterSpacing: '0.03em' }}
      >
        {value || '—'}
      </p>
    </div>
  )
}

/* ─── Placeholder pro budoucí záložky ─────────────────────────── */
function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
      <div
        className="w-12 h-px mb-10 mx-auto"
        style={{ background: 'linear-gradient(to right, transparent, rgba(199,160,75,0.3), transparent)' }}
      />
      <p
        className="text-2xl font-thin uppercase tracking-[0.18em] text-white/20"
        style={{ fontFamily: 'var(--font-exo2)' }}
      >
        {text}
      </p>
      <div
        className="w-12 h-px mt-10 mx-auto"
        style={{ background: 'linear-gradient(to right, transparent, rgba(199,160,75,0.3), transparent)' }}
      />
    </div>
  )
}

/* ─── Hlavní komponenta ────────────────────────────────────────── */
export default function ProfilPage() {
  const { user, isLoaded } = useUser()
  const { signOut }        = useClerk()
  const router             = useRouter()
  const [tab, setTab]      = useState<Tab>('osobni')

  /* Loading */
  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border border-[#c7a04b]/30 border-t-[#c7a04b] animate-spin" />
      </main>
    )
  }

  const firstName = user?.firstName ?? ''
  const lastName  = user?.lastName  ?? ''
  const email     = user?.primaryEmailAddress?.emailAddress ?? ''

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-8 md:pt-36 pb-20 px-6 md:px-10 lg:px-20">

      {/* ── Eyebrow ── */}
      <p
        className="text-[10px] uppercase tracking-[0.42em] mb-10 md:mb-14"
        style={{ color: '#c7a04b', fontFamily: 'var(--font-montserrat)' }}
      >
        — Váš účet
      </p>

      {/* ── Dvousloupcové rozvržení ── */}
      <div className="flex flex-col md:flex-row md:gap-16 lg:gap-24">

        {/* ════════════════════════════════════════
            LEVÝ SLOUPEC — navigace
        ════════════════════════════════════════ */}
        <aside className="md:w-1/3 lg:w-[30%] flex-shrink-0">

          {/* Nadpis */}
          <h1
            className="hidden md:block text-3xl lg:text-4xl font-thin uppercase tracking-[0.18em] text-white/90 mb-10"
            style={{ fontFamily: 'var(--font-exo2)' }}
          >
            Můj účet
          </h1>

          {/* Mobilní scrollovací lišta záložek */}
          <div
            className="flex md:hidden gap-6 overflow-x-auto pb-4 mb-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="shrink-0 pb-2 bg-transparent border-0 cursor-pointer transition-colors duration-300"
                style={{
                  fontFamily:    'var(--font-montserrat)',
                  fontSize:      '10px',
                  letterSpacing: '0.32em',
                  textTransform: 'uppercase',
                  color:         tab === t.id ? '#c7a04b' : 'rgba(255,255,255,0.35)',
                  borderBottom:  tab === t.id ? '1px solid rgba(199,160,75,0.5)' : '1px solid transparent',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Desktop svislé menu */}
          <nav className="hidden md:flex flex-col gap-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="group flex items-center justify-between text-left bg-transparent border-0
                           cursor-pointer py-4 transition-all duration-300"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <span
                  className="text-[13px] uppercase tracking-[0.28em] transition-colors duration-300"
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    color: tab === t.id ? '#c7a04b' : 'rgba(255,255,255,0.38)',
                  }}
                >
                  {t.label}
                </span>
                <ChevronRight
                  size={14}
                  className="transition-all duration-300"
                  style={{
                    color:   tab === t.id ? '#c7a04b' : 'transparent',
                    opacity: tab === t.id ? 1 : 0,
                    transform: tab === t.id ? 'translateX(0)' : 'translateX(-4px)',
                  }}
                />
              </button>
            ))}
          </nav>

          {/* Odhlásit se — desktop */}
          <button
            onClick={() => signOut(() => router.push('/'))}
            className="hidden md:flex items-center gap-2 mt-12 bg-transparent border-0 cursor-pointer p-0
                       uppercase tracking-[0.32em] transition-colors duration-300
                       text-white/20 hover:text-red-400/60"
            style={{ fontFamily: 'var(--font-montserrat)', fontSize: '9px' }}
          >
            <span>Odhlásit se</span>
            <span style={{ fontSize: '10px' }}>→</span>
          </button>

        </aside>

        {/* ════════════════════════════════════════
            PRAVÝ SLOUPEC — obsah
        ════════════════════════════════════════ */}
        <section className="flex-1 min-w-0">

          {/* Tenká zlatá linka nahoře — desktop */}
          <div
            className="hidden md:block w-full h-px mb-12"
            style={{ background: 'linear-gradient(to right, rgba(199,160,75,0.2), transparent)' }}
          />

          {/* ── OSOBNÍ ÚDAJE ── */}
          {tab === 'osobni' && (
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.42em] mb-10 text-white/30"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                Osobní údaje
              </p>

              {/* Jméno + Příjmení vedle sebe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <Field label="Jméno"    value={firstName} />
                <Field label="Příjmení" value={lastName}  />
              </div>

              {/* E-mail přes celou šířku */}
              <div className="mb-8">
                <Field label="E-mail" value={email} />
              </div>

              {/* Poznámka */}
              <p
                className="text-[10px] tracking-[0.15em] mt-8"
                style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.18)' }}
              >
                Pro změnu údajů nás prosím kontaktujte na{' '}
                <span style={{ color: 'rgba(199,160,75,0.5)' }}>info@bases.cz</span>
              </p>
            </div>
          )}

          {/* ── HISTORIE OBJEDNÁVEK ── */}
          {tab === 'objednavky' && (
            <EmptyState text="Zatím nemáte žádné objednávky" />
          )}

          {/* ── DODACÍ ADRESY ── */}
          {tab === 'adresy' && (
            <EmptyState text="Zatím nemáte uložené žádné adresy" />
          )}

          {/* Odhlásit se — mobil */}
          <button
            onClick={() => signOut(() => router.push('/'))}
            className="flex md:hidden items-center gap-2 mt-14 bg-transparent border-0 cursor-pointer p-0
                       uppercase tracking-[0.32em] transition-colors duration-300
                       text-white/20 hover:text-red-400/60"
            style={{ fontFamily: 'var(--font-montserrat)', fontSize: '9px' }}
          >
            <span>Odhlásit se</span>
            <span style={{ fontSize: '10px' }}>→</span>
          </button>

        </section>

      </div>
    </main>
  )
}
