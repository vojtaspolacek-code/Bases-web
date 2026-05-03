'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { useCart } from '../context/CartContext'

// ── Sdílená Tailwind třída pro inputy ───────────────────────────────────────
const INPUT_CLS = [
  'w-full bg-white/[0.04] border text-white/90 text-sm px-4 py-3',
  'outline-none rounded-md transition-all duration-300',
  'placeholder:text-white/40',
  'focus:border-[#c7a04b] focus:ring-1 focus:ring-[#c7a04b]/30',
].join(' ')

// ── SVG ikony (zlatý nádech) ─────────────────────────────────────────────────
const IconLock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="rgba(199,160,75,0.65)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const IconPackage = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="rgba(199,160,75,0.65)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)
const IconTruck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="rgba(199,160,75,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)

// ── Interfaces (beze změny) ──────────────────────────────────────────────────
interface FormData {
  jmeno: string; prijmeni: string; email: string; telefon: string
  ulice: string; mesto: string; psc: string; stat: string
}
interface FormErrors {
  jmeno?: string; prijmeni?: string; email?: string; telefon?: string
  ulice?: string; mesto?: string; psc?: string
}

// ── Číslovaný nadpis sekce ───────────────────────────────────────────────────
// Číslo (zlaté) + text (bílý) vlevo, dekorativní čára vpravo
function SectionHeader({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span
        className="text-[#c7a04b] text-[9px] tracking-[0.4em] font-medium shrink-0"
        style={{ fontFamily: 'var(--font-montserrat)' }}
      >
        {num}
      </span>
      <span
        className="text-white/75 text-[10px] tracking-[0.35em] uppercase shrink-0"
        style={{ fontFamily: 'var(--font-montserrat)' }}
      >
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-[#c7a04b]/25 to-transparent" />
    </div>
  )
}

// ── Field komponenta — čistý Tailwind, žádný JS focus state ─────────────────
function Field({
  label, name, value, onChange, error, type = 'text', placeholder, submitted,
}: {
  label: string
  name: keyof FormData
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  type?: string
  placeholder?: string
  submitted?: boolean
}) {
  return (
    <div>
      <label
        className="block text-[9px] tracking-[0.32em] uppercase text-white/45 mb-2"
        style={{ fontFamily: 'var(--font-montserrat)' }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className={`${INPUT_CLS} ${
          submitted && error ? 'border-[#c7a04b]' : 'border-white/[0.12]'
        }`}
        style={{ fontFamily: 'var(--font-montserrat)' }}
      />
      {submitted && error && (
        <p
          className="text-[#c7a04b] text-[10px] mt-1.5 tracking-[0.02em]"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          {error}
        </p>
      )}
    </div>
  )
}

// ── VOP + CTA — sdílené pro mobil i desktop ──────────────────────────────────
function CtaBlock({
  submitted, vopChecked, setVopChecked, onSubmit,
}: {
  submitted: boolean
  vopChecked: boolean
  setVopChecked: (v: boolean) => void
  onSubmit: () => void
}) {
  return (
    <>
      {/* VOP checkbox */}
      <div className="mb-5">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={vopChecked}
            onChange={e => setVopChecked(e.target.checked)}
            className="w-4 h-4 shrink-0 accent-[#c7a04b]"
          />
          <span
            className="text-[11px] text-white/50"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            Souhlasím s{' '}
            <a href="/podminky" className="text-[#c7a04b] underline underline-offset-2">
              obchodními podmínkami
            </a>
          </span>
        </label>
        {submitted && !vopChecked && (
          <p
            className="text-[#c7a04b] text-[10px] mt-1.5 tracking-[0.02em]"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            Potvrďte souhlas s podmínkami
          </p>
        )}
      </div>

      {/* CTA tlačítko — čistý Tailwind hover, žádné JS mouse eventy */}
      <button
        onClick={onSubmit}
        className="w-full bg-[#c7a04b] text-black text-[11px] font-bold tracking-[0.35em]
                   uppercase py-[18px] flex items-center justify-center gap-3 rounded-md
                   hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(199,160,75,0.3)]
                   transition-all duration-300 cursor-pointer border-none"
        style={{ fontFamily: 'var(--font-montserrat)' }}
      >
        Přejít k platbě
        <span className="text-base font-light">→</span>
      </button>

      {/* SSL text */}
      <p
        className="text-center text-[9px] tracking-[0.25em] uppercase text-white/20 mt-3"
        style={{ fontFamily: 'var(--font-montserrat)' }}
      >
        Bezpečná platba · SSL šifrování
      </p>
    </>
  )
}

// ════════════════════════════════════════════════════════════════════════════
export default function ObjednavkaPage() {

  // ── State & refs (BEZE ZMĚNY) ────────────────────────────────────────────
  const { items } = useCart()
  const router = useRouter()

  const [form, setForm] = useState<FormData>({
    jmeno: '', prijmeni: '', email: '', telefon: '',
    ulice: '', mesto: '', psc: '', stat: 'Česká republika',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [vopChecked, setVopChecked] = useState(false)

  const uliceRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (items.length === 0) router.replace('/')
  }, [items, router])

  // ── initAutocomplete (BEZE ZMĚNY) ────────────────────────────────────────
  const initAutocomplete = () => {
    if (!uliceRef.current || typeof google === 'undefined') return
    const ac = new google.maps.places.Autocomplete(uliceRef.current, {
      componentRestrictions: { country: 'cz' },
      types: ['address'],
      fields: ['address_components'],
      language: 'cs',
    } as google.maps.places.AutocompleteOptions)
    ac.addListener('place_changed', () => {
      const place = ac.getPlace()
      if (!place.address_components) return
      let sn = '', rt = '', loc = '', pc = ''
      for (const c of place.address_components) {
        if (c.types.includes('street_number')) sn = c.long_name
        if (c.types.includes('route')) rt = c.long_name
        if (c.types.includes('locality')) loc = c.long_name
        if (!loc && c.types.includes('administrative_area_level_2')) loc = c.long_name
        if (!loc && c.types.includes('sublocality_level_1')) loc = c.long_name
        if (c.types.includes('postal_code')) pc = c.long_name.replace(/\s/g, '')
      }
      setForm(prev => ({
        ...prev,
        ulice: rt ? (sn ? `${rt} ${sn}` : rt) : sn,
        mesto: loc || prev.mesto,
        psc: pc || prev.psc,
      }))
    })
  }

  // ── Handlers (BEZE ZMĚNY) ────────────────────────────────────────────────
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (submitted && errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!form.jmeno.trim())    e.jmeno    = 'Vyplňte jméno'
    if (!form.prijmeni.trim()) e.prijmeni = 'Vyplňte příjmení'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Zadejte platný e-mail'
    if (!form.telefon.trim())  e.telefon  = 'Vyplňte telefon'
    if (!form.ulice.trim())    e.ulice    = 'Vyplňte ulici a číslo'
    if (!form.mesto.trim())    e.mesto    = 'Vyplňte město'
    if (!/^\d{5}$/.test(form.psc.replace(/\s/g, '')))
      e.psc = 'PSČ musí mít 5 číslic'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    setSubmitted(true)
    if (!validate()) return
    if (!vopChecked) return
    console.log('Objednávka:', { form, items, total })
    // Stripe v dalším kroku
  }

  if (items.length === 0) return null

  // ── Přehled produktů — sdílený JSX ──────────────────────────────────────
  const OrderItems = (
    <div className="flex flex-col gap-5">
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-4">
          {/* Obrázek s glow */}
          <div className="relative w-[52px] h-[64px] shrink-0">
            <div
              className="absolute inset-0 rounded"
              style={{ background: 'radial-gradient(ellipse at center, rgba(199,160,75,0.2) 0%, transparent 70%)' }}
            />
            {item.img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.img} alt={item.name}
                className="w-full h-full object-contain relative"
              />
            )}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p
              className="text-[11px] text-white/85 tracking-[0.04em] truncate"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {item.name}
            </p>
            <p
              className="text-[9px] text-white/30 tracking-[0.08em] mt-0.5"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {item.brand}
            </p>
            <p
              className="text-[10px] text-white/45 mt-1"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {item.qty} × {item.price} Kč
            </p>
          </div>
          {/* Cena */}
          <p
            className="text-sm font-light text-[#c7a04b] shrink-0"
            style={{ fontFamily: 'var(--font-exo2)' }}
          >
            {item.qty * item.price} Kč
          </p>
        </div>
      ))}
    </div>
  )

  // ════════════════════════════════════════════════════════════════════════
  return (
    <>
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDU7SuvjWBB28fhTYTYN5X7VIfQD0ixUI0&libraries=places&language=cs&region=CZ"
        strategy="afterInteractive"
        onLoad={initAutocomplete}
      />

      <main className="min-h-screen pt-24 md:pt-28 pb-20 px-5 md:px-10 lg:px-16 bg-[#0a0a0a]">

        {/* Page heading */}
        <div className="max-w-6xl mx-auto mb-10 md:mb-14 pb-6 border-b border-white/[0.05]">
          <p
            className="text-[#c7a04b] text-[10px] tracking-[0.4em] uppercase mb-2.5"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            — Dokončení objednávky
          </p>
          <h1
            className="font-light tracking-[0.1em] uppercase text-white/90"
            style={{ fontFamily: 'var(--font-exo2)', fontSize: 'clamp(1.6rem,3.5vw,2.4rem)' }}
          >
            Objednávka
          </h1>
        </div>

        {/* ── Dvousloupcový grid ─────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto flex flex-col md:grid md:grid-cols-[1fr_380px] md:items-start gap-10">

          {/* ══ MOBIL: přehled nahoře ══ */}
          <div className="md:hidden rounded-md border border-[#c7a04b]/15 bg-white/[0.02] p-6">
            <p
              className="text-[#c7a04b] text-[9px] tracking-[0.4em] uppercase mb-5"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              Vaše objednávka
            </p>
            {OrderItems}
            <div className="h-px bg-[#c7a04b]/20 my-5" />
            <div className="flex justify-between items-baseline">
              <span
                className="text-[9px] tracking-[0.3em] uppercase text-white/35"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                Celkem
              </span>
              <span
                className="text-[1.4rem] font-light text-[#c7a04b]"
                style={{ fontFamily: 'var(--font-exo2)' }}
              >
                {total} Kč
              </span>
            </div>
          </div>

          {/* ══ LEVÝ SLOUPEC: formulář ══ */}
          <div>

            {/* 01 Osobní údaje */}
            <section className="mb-9">
              <SectionHeader num="01" label="Osobní údaje" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Jméno"    name="jmeno"    value={form.jmeno}    onChange={handleChange} error={errors.jmeno}    submitted={submitted} />
                <Field label="Příjmení" name="prijmeni" value={form.prijmeni} onChange={handleChange} error={errors.prijmeni} submitted={submitted} />
                <Field label="E-mail"   name="email"    value={form.email}    onChange={handleChange} error={errors.email}    submitted={submitted} type="email" />
                <Field label="Telefon"  name="telefon"  value={form.telefon}  onChange={handleChange} error={errors.telefon}  submitted={submitted} type="tel" placeholder="+420" />
              </div>
            </section>

            {/* 02 Doručovací adresa */}
            <section className="mb-9">
              <SectionHeader num="02" label="Doručovací adresa" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Ulice — Google Places Autocomplete widget */}
                <div className="md:col-span-2">
                  <label
                    className="block text-[9px] tracking-[0.32em] uppercase text-white/45 mb-2"
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                  >
                    Ulice a číslo popisné
                  </label>
                  <input
                    ref={uliceRef}
                    type="text"
                    name="ulice"
                    value={form.ulice}
                    onChange={handleChange}
                    placeholder="Začněte psát adresu..."
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                    className={`${INPUT_CLS} ${
                      submitted && errors.ulice ? 'border-[#c7a04b]' : 'border-white/[0.12]'
                    }`}
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                  />
                  {submitted && errors.ulice && (
                    <p
                      className="text-[#c7a04b] text-[10px] mt-1.5"
                      style={{ fontFamily: 'var(--font-montserrat)' }}
                    >
                      {errors.ulice}
                    </p>
                  )}
                </div>

                <Field label="Město" name="mesto" value={form.mesto} onChange={handleChange} error={errors.mesto} submitted={submitted} />
                <Field label="PSČ"   name="psc"   value={form.psc}   onChange={handleChange} error={errors.psc}   submitted={submitted} placeholder="např. 110 00" />

                {/* Stát — zamčeno */}
                <div className="md:col-span-2">
                  <label
                    className="block text-[9px] tracking-[0.32em] uppercase text-white/45 mb-2"
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                  >
                    Stát
                  </label>
                  <div
                    className="w-full bg-white/[0.04] border border-white/[0.12] text-white/35
                               text-sm px-4 py-3 rounded-md flex items-center cursor-not-allowed"
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                  >
                    Česká republika
                  </div>
                  <p
                    className="text-[10px] text-white/20 mt-1.5 tracking-[0.02em]"
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                  >
                    Aktuálně doručujeme pouze do ČR
                  </p>
                </div>
              </div>
            </section>

            {/* 03 Doprava */}
            <section className="mb-9">
              <SectionHeader num="03" label="Doprava" />
              <div className="flex items-center gap-3 border border-white/[0.06] rounded-md px-6 py-5">
                <IconTruck />
                <p
                  className="text-[11px] tracking-[0.15em] text-[#c7a04b]/70"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  Výběr dopravy bude dostupný brzy.
                </p>
              </div>
            </section>

            {/* Mobil: VOP + CTA pod formulářem */}
            <div className="md:hidden">
              <CtaBlock
                submitted={submitted}
                vopChecked={vopChecked}
                setVopChecked={setVopChecked}
                onSubmit={handleSubmit}
              />
            </div>
          </div>

          {/* ══ PRAVÝ SLOUPEC: sticky panel (jen desktop) ══ */}
          <div className="hidden md:block" style={{ position: 'sticky', top: '120px' }}>
            <div className="rounded-md border border-[#c7a04b]/15 bg-white/[0.02] p-8">

              {/* Nadpis */}
              <p
                className="text-[#c7a04b] text-[9px] tracking-[0.4em] uppercase mb-6"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                Vaše objednávka
              </p>

              {/* Produkty */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  maxHeight: '280px',
                  overflowY: 'auto',
                  marginBottom: '16px',
                  paddingRight: '4px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(199,160,75,0.3) transparent',
                }}>
                  {OrderItems}
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: 0,
                  right: '4px',
                  height: '48px',
                  background: 'linear-gradient(to bottom, transparent, rgba(10,10,10,0.95))',
                  pointerEvents: 'none',
                }} />
              </div>

              {/* Dělicí čára */}
              <div className="h-px bg-[#c7a04b]/20 my-6" />

              {/* Celkem */}
              <div className="flex justify-between items-baseline mb-7">
                <span
                  className="text-[9px] tracking-[0.3em] uppercase text-white/35"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  Celkem
                </span>
                <span
                  className="text-[1.5rem] font-light text-[#c7a04b]"
                  style={{ fontFamily: 'var(--font-exo2)' }}
                >
                  {total} Kč
                </span>
              </div>

              {/* VOP + CTA + SSL */}
              <CtaBlock
                submitted={submitted}
                vopChecked={vopChecked}
                setVopChecked={setVopChecked}
                onSubmit={handleSubmit}
              />

              {/* Trust badges — SVG ikony */}
              <div className="flex gap-3 mt-5 pt-5 border-t border-white/[0.05]">
                <div className="flex-1 flex items-center gap-2">
                  <IconLock />
                  <span
                    className="text-[9px] tracking-[0.12em] text-white/30 leading-snug"
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                  >
                    Zabezpečená platba
                  </span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <IconPackage />
                  <span
                    className="text-[9px] tracking-[0.12em] text-white/30 leading-snug"
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                  >
                    Doprava do 3 pracovních dnů
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </>
  )
}
