'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Package, MapPin } from 'lucide-react'

type Tab = 'osobni' | 'objednavky' | 'adresy'

const TABS: { id: Tab; label: string }[] = [
  { id: 'osobni',     label: 'Osobní údaje'       },
  { id: 'objednavky', label: 'Historie objednávek' },
  { id: 'adresy',     label: 'Dodací adresy'       },
]

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ─── Read-only datové pole ───────────────────────────────────── */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <p
        className="text-[8px] uppercase tracking-[0.4em] mb-2"
        style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.30)' }}
      >
        {label}
      </p>
      <p
        className="text-xl font-light text-white/90"
        style={{ fontFamily: 'var(--font-exo2)', letterSpacing: '0.04em' }}
      >
        {value || '—'}
      </p>
    </div>
  )
}

/* ─── Prázdný stav záložky ────────────────────────────────────── */
function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 px-8 text-center">
      <Icon size={36} style={{ color: 'rgba(255,255,255,0.08)', marginBottom: '1.5rem' }} />
      <p
        className="text-sm font-light uppercase tracking-[0.22em] text-white/20"
        style={{ fontFamily: 'var(--font-exo2)' }}
      >
        {text}
      </p>
    </div>
  )
}

/* ─── Hlavní komponenta ───────────────────────────────────────── */
export default function ProfilPage() {
  const { user, isLoaded } = useUser()
  const { signOut }        = useClerk()
  const router             = useRouter()
  const [tab, setTab]      = useState<Tab>('osobni')

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
    <main className="min-h-screen bg-[#0a0a0a] pt-[72px]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 pt-14 pb-24">

        {/* ── Eyebrow ── */}
        <p
          className="text-[9px] uppercase tracking-[0.5em] mb-3"
          style={{ color: 'rgba(199,160,75,0.65)', fontFamily: 'var(--font-montserrat)' }}
        >
          — Váš účet
        </p>

        {/* ── Nadpis (mobil) ── */}
        <h1
          className="lg:hidden text-3xl font-thin uppercase tracking-[0.16em] text-white/85 mb-8"
          style={{ fontFamily: 'var(--font-exo2)' }}
        >
          Můj účet
        </h1>

        {/* ── Mobilní tab lišta ── */}
        <div
          className="flex lg:hidden gap-1 overflow-x-auto pb-6 mb-10 snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        >
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="snap-start shrink-0 px-4 py-2.5 rounded-full bg-transparent cursor-pointer
                         transition-all duration-300 whitespace-nowrap"
              style={{
                fontFamily:    'var(--font-montserrat)',
                fontSize:      '9px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color:         tab === t.id ? '#c7a04b' : 'rgba(255,255,255,0.30)',
                border:        tab === t.id
                  ? '1px solid rgba(199,160,75,0.35)'
                  : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Desktop grid 12 sloupců ── */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-6">

          {/* ════════════════════════════════════════
              LEVÝ SLOUPEC — navigace (desktop only)
          ════════════════════════════════════════ */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col">

            <h1
              className="text-4xl font-thin uppercase tracking-[0.16em] text-white/85 mb-14"
              style={{ fontFamily: 'var(--font-exo2)' }}
            >
              Můj účet
            </h1>

            {/* Tenká zlatá linka */}
            <div
              className="w-8 h-px mb-10"
              style={{ background: 'linear-gradient(to right, rgba(199,160,75,0.5), transparent)' }}
            />

            {/* Nav položky */}
            <nav className="flex flex-col">
              {TABS.map(t => {
                const isActive = tab === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className="group relative flex items-center text-left bg-transparent border-0
                               cursor-pointer py-5 pl-5 pr-3 transition-all duration-300"
                  >
                    {/* Zlatá linka vlevo — aktivní */}
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] transition-all duration-300"
                      style={{
                        height:     isActive ? '60%' : '0%',
                        background: '#c7a04b',
                        opacity:    isActive ? 1 : 0,
                      }}
                    />
                    <span
                      className="text-[11px] uppercase tracking-[0.32em] transition-colors duration-300"
                      style={{
                        fontFamily: 'var(--font-montserrat)',
                        color: isActive
                          ? '#c7a04b'
                          : 'rgba(255,255,255,0.28)',
                      }}
                    >
                      {t.label}
                    </span>
                  </button>
                )
              })}
            </nav>

            {/* Oddělovač */}
            <div
              className="my-8 h-px"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            />

            {/* Odhlásit se */}
            <button
              onClick={() => signOut(() => router.push('/'))}
              className="flex items-center gap-2.5 bg-transparent border-0 cursor-pointer p-0 pl-5
                         transition-colors duration-300 text-white/20 hover:text-red-400/50"
              style={{ fontFamily: 'var(--font-montserrat)', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase' }}
            >
              <LogOut size={11} />
              <span>Odhlásit se</span>
            </button>

          </aside>

          {/* ════════════════════════════════════════
              PRAVÝ SLOUPEC — obsah
          ════════════════════════════════════════ */}
          <section className="lg:col-span-8 lg:col-start-5">

            {/* Zlatá linka nahoře */}
            <div
              className="hidden lg:block w-full h-px mb-14"
              style={{ background: 'linear-gradient(to right, rgba(199,160,75,0.18), transparent)' }}
            />

            <AnimatePresence mode="wait">

              {/* ── OSOBNÍ ÚDAJE ── */}
              {tab === 'osobni' && (
                <motion.div key="osobni"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease }}>

                  {/* Eyebrow sekce */}
                  <p
                    className="text-[8px] uppercase tracking-[0.45em] mb-10"
                    style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.55)' }}
                  >
                    — Základní údaje
                  </p>

                  {/* Jméno + Příjmení */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                    <Field label="Jméno"    value={firstName} />
                    <Field label="Příjmení" value={lastName}  />
                  </div>

                  {/* E-mail */}
                  <div className="mb-8">
                    <Field label="E-mail" value={email} />
                  </div>

                  {/* Ghost tlačítko */}
                  <button
                    type="button"
                    className="mt-8 px-8 py-3 rounded-full uppercase tracking-[0.28em] text-[10px]
                               transition-all duration-300
                               hover:border-[#c7a04b]/50 hover:text-[#c7a04b]/70
                               text-white/30"
                    style={{
                      fontFamily: 'var(--font-montserrat)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(199,160,75,0.45)'
                      e.currentTarget.style.color       = 'rgba(199,160,75,0.7)'
                      e.currentTarget.style.boxShadow   = '0 0 18px rgba(199,160,75,0.08)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                      e.currentTarget.style.color       = 'rgba(255,255,255,0.30)'
                      e.currentTarget.style.boxShadow   = 'none'
                    }}
                  >
                    Upravit údaje
                  </button>

                  {/* Poznámka */}
                  <p
                    className="text-[9px] tracking-[0.14em] mt-6"
                    style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.15)' }}
                  >
                    Pro změnu kontaktujte{' '}
                    <span style={{ color: 'rgba(199,160,75,0.4)' }}>info@bases.cz</span>
                  </p>

                </motion.div>
              )}

              {/* ── HISTORIE OBJEDNÁVEK ── */}
              {tab === 'objednavky' && (
                <motion.div key="objednavky"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease }}>
                  <p
                    className="text-[8px] uppercase tracking-[0.45em] mb-10"
                    style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.55)' }}
                  >
                    — Historie objednávek
                  </p>
                  <EmptyState icon={Package} text="Zatím nemáte žádné objednávky" />
                </motion.div>
              )}

              {/* ── DODACÍ ADRESY ── */}
              {tab === 'adresy' && (
                <motion.div key="adresy"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease }}>
                  <p
                    className="text-[8px] uppercase tracking-[0.45em] mb-10"
                    style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.55)' }}
                  >
                    — Dodací adresy
                  </p>
                  <EmptyState icon={MapPin} text="Zatím nemáte uložené žádné adresy" />
                </motion.div>
              )}

            </AnimatePresence>

            {/* Odhlásit se — mobil */}
            <button
              onClick={() => signOut(() => router.push('/'))}
              className="flex lg:hidden items-center gap-2.5 mt-16 bg-transparent border-0 cursor-pointer p-0
                         transition-colors duration-300 text-white/20 hover:text-red-400/50"
              style={{ fontFamily: 'var(--font-montserrat)', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase' }}
            >
              <LogOut size={11} />
              <span>Odhlásit se</span>
            </button>

          </section>

        </div>
      </div>
    </main>
  )
}
