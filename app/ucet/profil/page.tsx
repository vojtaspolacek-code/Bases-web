'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Package, MapPin, Plus, X, Check } from 'lucide-react'

type Tab = 'osobni' | 'objednavky' | 'adresy'

interface Address {
  id:      string
  street:  string
  city:    string
  zip:     string
  country: string
}

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
      <p className="text-[8px] uppercase tracking-[0.4em] mb-2"
        style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.30)' }}>
        {label}
      </p>
      <p className="text-xl font-light text-white/90"
        style={{ fontFamily: 'var(--font-exo2)', letterSpacing: '0.04em' }}>
        {value || '—'}
      </p>
    </div>
  )
}

/* ─── Editovatelný input ──────────────────────────────────────── */
function EditInput({ label, value, onChange, readOnly = false }:
  { label: string; value: string; onChange?: (v: string) => void; readOnly?: boolean }) {
  return (
    <div className="pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <p className="text-[8px] uppercase tracking-[0.4em] mb-2"
        style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.50)' }}>
        {label}
      </p>
      {readOnly ? (
        <p className="text-xl font-light text-white/40"
          style={{ fontFamily: 'var(--font-exo2)', letterSpacing: '0.04em' }}>
          {value || '—'}
        </p>
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className="w-full bg-transparent outline-none text-xl font-light text-white/90
                     border-b border-white/10 focus:border-[#c7a04b] transition-colors duration-300 py-1"
          style={{ fontFamily: 'var(--font-exo2)', letterSpacing: '0.04em' }}
        />
      )}
    </div>
  )
}

/* ─── Prázdný stav záložky ────────────────────────────────────── */
function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <Icon size={36} style={{ color: 'rgba(255,255,255,0.08)', marginBottom: '1.5rem' }} />
      <p className="text-sm font-light uppercase tracking-[0.22em] text-white/20"
        style={{ fontFamily: 'var(--font-exo2)' }}>
        {text}
      </p>
    </div>
  )
}

/* ─── Ghost tlačítko ──────────────────────────────────────────── */
function GhostBtn({ onClick, children, className = '' }:
  { onClick?: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-6 py-2.5 rounded-full uppercase tracking-[0.28em] text-[10px]
                 transition-all duration-300 text-white/30 cursor-pointer ${className}`}
      style={{ fontFamily: 'var(--font-montserrat)', border: '1px solid rgba(255,255,255,0.12)' }}
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
      {children}
    </button>
  )
}

/* ══════════════════════════════════════════════════════════════
   ZÁLOŽKA — Osobní údaje
══════════════════════════════════════════════════════════════ */
function TabOsobni({ user }: { user: NonNullable<ReturnType<typeof useUser>['user']> }) {
  const [isEditing,  setIsEditing]  = useState(false)
  const [firstName,  setFirstName]  = useState(user.firstName ?? '')
  const [lastName,   setLastName]   = useState(user.lastName  ?? '')
  const [phone,      setPhone]      = useState((user.unsafeMetadata as { phone?: string }).phone ?? '')
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState('')
  const email = user.primaryEmailAddress?.emailAddress ?? ''

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      await user.update({
        firstName,
        lastName,
        unsafeMetadata: { ...user.unsafeMetadata, phone },
      })
      setIsEditing(false)
    } catch {
      setError('Uložení se nezdařilo. Zkuste to znovu.')
    } finally { setSaving(false) }
  }

  const handleCancel = () => {
    setFirstName(user.firstName ?? '')
    setLastName(user.lastName   ?? '')
    setPhone((user.unsafeMetadata as { phone?: string }).phone ?? '')
    setError('')
    setIsEditing(false)
  }

  const savedPhone = (user.unsafeMetadata as { phone?: string }).phone ?? ''

  return (
    <div>
      <p className="text-[8px] uppercase tracking-[0.45em] mb-10"
        style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.55)' }}>
        — Základní údaje
      </p>

      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div key="view"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <Field label="Jméno"    value={user.firstName ?? ''} />
              <Field label="Příjmení" value={user.lastName  ?? ''} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
              <Field label="E-mail"  value={email} />
              <Field label="Telefon" value={savedPhone || 'Není zadán'} />
            </div>
            <GhostBtn onClick={() => setIsEditing(true)}>Upravit údaje</GhostBtn>
          </motion.div>
        ) : (
          <motion.div key="edit"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <EditInput label="Jméno"    value={firstName} onChange={setFirstName} />
              <EditInput label="Příjmení" value={lastName}  onChange={setLastName}  />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
              <EditInput label="E-mail (nelze změnit)" value={email} readOnly />
              <EditInput label="Telefon" value={phone} onChange={setPhone} />
            </div>

            {error && (
              <p className="text-[10px] mb-5" style={{ color: 'rgba(199,160,75,0.8)', fontFamily: 'var(--font-montserrat)' }}>
                {error}
              </p>
            )}

            <div className="flex items-center gap-4 flex-wrap">
              {/* Zlaté CTA tlačítko */}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-7 py-3 rounded-full uppercase tracking-[0.28em]
                           text-[10px] font-semibold transition-all duration-300
                           hover:shadow-[0_6px_24px_rgba(199,160,75,0.28)] hover:-translate-y-0.5
                           disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'var(--font-montserrat)', background: '#c7a04b', color: '#0a0a0a' }}
              >
                <Check size={12} />
                {saving ? 'Ukládám…' : 'Uložit změny'}
              </button>
              {/* Zrušit */}
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em]
                           text-white/25 hover:text-white/50 transition-colors duration-300
                           bg-transparent border-0 cursor-pointer p-0"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                <X size={11} />
                Zrušit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   ZÁLOŽKA — Dodací adresy
══════════════════════════════════════════════════════════════ */
function TabAdresy({ user }: { user: NonNullable<ReturnType<typeof useUser>['user']> }) {
  const meta      = user.unsafeMetadata as { addresses?: Address[] }
  const saved     = meta.addresses ?? []

  const [showForm,  setShowForm]  = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')
  const [form, setForm] = useState({ street: '', city: '', zip: '', country: 'Česká republika' })

  const setField = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleAdd = async () => {
    if (!form.street || !form.city || !form.zip) { setError('Vyplňte všechna povinná pole.'); return }
    setSaving(true); setError('')
    try {
      const newAddr: Address = { id: Date.now().toString(), ...form }
      await user.update({ unsafeMetadata: { ...user.unsafeMetadata, addresses: [...saved, newAddr] } })
      setForm({ street: '', city: '', zip: '', country: 'Česká republika' })
      setShowForm(false)
    } catch { setError('Uložení se nezdařilo.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    try {
      await user.update({ unsafeMetadata: { ...user.unsafeMetadata, addresses: saved.filter(a => a.id !== id) } })
    } catch { /* silent */ }
  }

  const inputCls = `w-full bg-transparent outline-none text-[0.9rem] font-light text-white/85
                    border-b border-white/10 focus:border-[#c7a04b] transition-colors duration-300
                    py-2 placeholder-white/15`
  const inputStyle = { fontFamily: 'var(--font-montserrat)', letterSpacing: '0.03em' }
  const labelCls   = 'block text-[8px] uppercase tracking-[0.4em] mb-2'
  const labelStyle = { fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.50)' }

  return (
    <div>
      <p className="text-[8px] uppercase tracking-[0.45em] mb-10"
        style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.55)' }}>
        — Dodací adresy
      </p>

      {/* Seznam adres */}
      {saved.length > 0 && (
        <div className="flex flex-col gap-4 mb-8">
          {saved.map(addr => (
            <motion.div key={addr.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="group relative flex items-start justify-between p-5 rounded-lg
                         transition-all duration-300 cursor-default"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(199,160,75,0.22)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
            >
              <div>
                <p className="text-[0.95rem] font-light text-white/85 mb-1"
                  style={{ fontFamily: 'var(--font-exo2)', letterSpacing: '0.03em' }}>
                  {addr.street}
                </p>
                <p className="text-[11px] text-white/35"
                  style={{ fontFamily: 'var(--font-montserrat)', letterSpacing: '0.06em' }}>
                  {addr.zip} {addr.city} · {addr.country}
                </p>
              </div>
              <button
                onClick={() => handleDelete(addr.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                           bg-transparent border-0 cursor-pointer p-1 text-white/20 hover:text-red-400/50"
              >
                <X size={13} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Prázdný stav */}
      {saved.length === 0 && !showForm && (
        <EmptyState icon={MapPin} text="Zatím nemáte uložené žádné adresy" />
      )}

      {/* Formulář */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }}
            className="p-6 rounded-lg mb-6"
            style={{ border: '1px dashed rgba(199,160,75,0.25)' }}
          >
            <p className="text-[8px] uppercase tracking-[0.45em] mb-6"
              style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.55)' }}>
              — Nová adresa
            </p>

            <div className="flex flex-col gap-6">
              <div>
                <label className={labelCls} style={labelStyle}>Ulice a číslo popisné *</label>
                <input className={inputCls} style={inputStyle}
                  placeholder="Václavské náměstí 1"
                  value={form.street} onChange={e => setField('street')(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelCls} style={labelStyle}>Město *</label>
                  <input className={inputCls} style={inputStyle}
                    placeholder="Praha"
                    value={form.city} onChange={e => setField('city')(e.target.value)} />
                </div>
                <div>
                  <label className={labelCls} style={labelStyle}>PSČ *</label>
                  <input className={inputCls} style={inputStyle}
                    placeholder="110 00"
                    value={form.zip} onChange={e => setField('zip')(e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Země</label>
                <input className={inputCls} style={inputStyle}
                  value={form.country} onChange={e => setField('country')(e.target.value)} />
              </div>
            </div>

            {error && (
              <p className="text-[10px] mt-4" style={{ color: 'rgba(199,160,75,0.8)', fontFamily: 'var(--font-montserrat)' }}>
                {error}
              </p>
            )}

            <div className="flex items-center gap-4 mt-7 flex-wrap">
              <button
                type="button"
                onClick={handleAdd}
                disabled={saving}
                className="flex items-center gap-2 px-7 py-3 rounded-full uppercase tracking-[0.28em]
                           text-[10px] font-semibold transition-all duration-300
                           hover:shadow-[0_6px_24px_rgba(199,160,75,0.28)] hover:-translate-y-0.5
                           disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'var(--font-montserrat)', background: '#c7a04b', color: '#0a0a0a' }}
              >
                <Check size={12} />
                {saving ? 'Ukládám…' : 'Uložit adresu'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setError('') }}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em]
                           text-white/25 hover:text-white/50 transition-colors duration-300
                           bg-transparent border-0 cursor-pointer p-0"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                <X size={11} />
                Zrušit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* + Přidat adresu */}
      {!showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2.5 px-6 py-3 rounded-full uppercase tracking-[0.28em]
                     text-[10px] text-white/30 hover:text-[#c7a04b]/70 transition-all duration-300
                     cursor-pointer"
          style={{
            fontFamily: 'var(--font-montserrat)',
            border: '1px dashed rgba(255,255,255,0.15)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(199,160,75,0.35)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
        >
          <Plus size={12} />
          Přidat adresu
        </button>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   ZÁLOŽKA — Historie objednávek (mock)
══════════════════════════════════════════════════════════════ */
function TabObjednavky() {
  return (
    <div>
      <p className="text-[8px] uppercase tracking-[0.45em] mb-10"
        style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.55)' }}>
        — Historie objednávek
      </p>

      {/* Mock objednávka */}
      <div className="p-6 rounded-lg transition-all duration-300"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(199,160,75,0.20)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
      >
        {/* Hlavička objednávky */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[8px] uppercase tracking-[0.4em] mb-1.5"
              style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.25)' }}>
              Číslo objednávky
            </p>
            <p className="text-lg font-light text-white/90"
              style={{ fontFamily: 'var(--font-exo2)', letterSpacing: '0.06em' }}>
              #B-8429
            </p>
          </div>
          {/* Status badge */}
          <span
            className="text-[8px] uppercase tracking-[0.35em] px-3 py-1.5 rounded-full"
            style={{
              fontFamily:  'var(--font-montserrat)',
              color:       '#c7a04b',
              background:  'rgba(199,160,75,0.08)',
              border:      '1px solid rgba(199,160,75,0.22)',
            }}
          >
            Zpracovává se
          </span>
        </div>

        {/* Oddělovač */}
        <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.05)' }} />

        {/* Detaily */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {[
            { label: 'Datum',      value: '12. května 2026' },
            { label: 'Celková cena', value: '499 Kč'        },
            { label: 'Položky',    value: '1× BIGS Original'},
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[8px] uppercase tracking-[0.35em] mb-1.5"
                style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.25)' }}>
                {label}
              </p>
              <p className="text-[0.9rem] font-light text-white/75"
                style={{ fontFamily: 'var(--font-exo2)', letterSpacing: '0.03em' }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-[9px] tracking-[0.15em]"
        style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.15)' }}>
        Potřebujete pomoc s objednávkou?{' '}
        <span style={{ color: 'rgba(199,160,75,0.4)' }}>info@bases.cz</span>
      </p>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   HLAVNÍ KOMPONENTA
══════════════════════════════════════════════════════════════ */
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

  if (!user) { router.replace('/ucet'); return null }

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-[72px]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 pt-4 md:pt-10 lg:pt-14 pb-24">

        {/* Eyebrow */}
        <p className="text-[9px] uppercase tracking-[0.5em] mb-3"
          style={{ color: 'rgba(199,160,75,0.65)', fontFamily: 'var(--font-montserrat)' }}>
          — Váš účet
        </p>

        {/* Nadpis (mobil) */}
        <h1 className="lg:hidden text-3xl font-thin uppercase tracking-[0.16em] text-white/85 mb-8"
          style={{ fontFamily: 'var(--font-exo2)' }}>
          Můj účet
        </h1>

        {/* Mobilní tab lišta — vertikální */}
        <div className="flex lg:hidden flex-col gap-2 mb-10">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="w-full flex items-center justify-between px-5 py-4 bg-transparent
                         cursor-pointer transition-all duration-300"
              style={{
                fontFamily: 'var(--font-montserrat)', fontSize: '9px',
                letterSpacing: '0.32em', textTransform: 'uppercase',
                color:  tab === t.id ? '#c7a04b' : 'rgba(255,255,255,0.35)',
                border: tab === t.id ? '1px solid rgba(199,160,75,0.30)' : '1px solid rgba(255,255,255,0.07)',
                borderRadius: '4px',
                background: tab === t.id ? 'rgba(199,160,75,0.04)' : 'transparent',
              }}>
              <span>{t.label}</span>
              <span style={{ opacity: tab === t.id ? 1 : 0.3, fontSize: '12px' }}>
                {tab === t.id ? '→' : '›'}
              </span>
            </button>
          ))}
        </div>

        {/* Desktop grid */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-6">

          {/* LEVÝ SLOUPEC */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col">
            <h1 className="text-4xl font-thin uppercase tracking-[0.16em] text-white/85 mb-14"
              style={{ fontFamily: 'var(--font-exo2)' }}>
              Můj účet
            </h1>
            <div className="w-8 h-px mb-10"
              style={{ background: 'linear-gradient(to right, rgba(199,160,75,0.5), transparent)' }} />

            <nav className="flex flex-col">
              {TABS.map(t => {
                const isActive = tab === t.id
                return (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className="group relative flex items-center text-left bg-transparent border-0
                               cursor-pointer py-5 pl-5 pr-3 transition-all duration-300">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] transition-all duration-300"
                      style={{ height: isActive ? '60%' : '0%', background: '#c7a04b', opacity: isActive ? 1 : 0 }} />
                    <span className="text-[11px] uppercase tracking-[0.32em] transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-montserrat)', color: isActive ? '#c7a04b' : 'rgba(255,255,255,0.28)' }}>
                      {t.label}
                    </span>
                  </button>
                )
              })}
            </nav>

            <div className="my-8 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

            <button onClick={() => signOut(() => router.push('/'))}
              className="flex items-center gap-2.5 bg-transparent border-0 cursor-pointer p-0 pl-5
                         transition-colors duration-300 text-white/20 hover:text-red-400/50"
              style={{ fontFamily: 'var(--font-montserrat)', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              <LogOut size={11} />
              <span>Odhlásit se</span>
            </button>
          </aside>

          {/* PRAVÝ SLOUPEC */}
          <section className="lg:col-span-8 lg:col-start-5">
            <div className="hidden lg:block w-full h-px mb-14"
              style={{ background: 'linear-gradient(to right, rgba(199,160,75,0.18), transparent)' }} />

            <AnimatePresence mode="wait">
              {tab === 'osobni' && (
                <motion.div key="osobni"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease }}>
                  <TabOsobni user={user} />
                </motion.div>
              )}
              {tab === 'objednavky' && (
                <motion.div key="objednavky"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease }}>
                  <TabObjednavky />
                </motion.div>
              )}
              {tab === 'adresy' && (
                <motion.div key="adresy"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease }}>
                  <TabAdresy user={user} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Odhlásit se — mobil */}
            <button onClick={() => signOut(() => router.push('/'))}
              className="flex lg:hidden items-center gap-2.5 mt-16 bg-transparent border-0 cursor-pointer p-0
                         transition-colors duration-300 text-white/20 hover:text-red-400/50"
              style={{ fontFamily: 'var(--font-montserrat)', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              <LogOut size={11} />
              <span>Odhlásit se</span>
            </button>
          </section>

        </div>
      </div>
    </main>
  )
}
