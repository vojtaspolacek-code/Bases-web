'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { useCart } from '../context/CartContext'
import { useUser, useSignUp } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, MapPin } from 'lucide-react'

// ── Sdílená třída pro inputy ─────────────────────────────────────────────────
const INPUT_CLS = [
  'w-full bg-transparent border-b text-white/90 text-[0.9rem]',
  'outline-none transition-all duration-300 py-2.5',
  'placeholder:text-white/20',
  'focus:border-[#c7a04b]',
].join(' ')

const LABEL_CLS = 'block text-[9px] tracking-[0.38em] uppercase mb-2'

// ── SVG ikony ────────────────────────────────────────────────────────────────
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

// ── Interfaces ────────────────────────────────────────────────────────────────
interface FormData {
  jmeno: string; prijmeni: string; email: string; telefon: string
  ulice: string; mesto: string; psc: string; stat: string
}
interface FormErrors {
  jmeno?: string; prijmeni?: string; email?: string; telefon?: string
  ulice?: string; mesto?: string; psc?: string
}
interface SavedAddress {
  id: string; street: string; city: string; zip: string; country: string
}

// ── Číslovaný nadpis sekce ────────────────────────────────────────────────────
function SectionHeader({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-7">
      <span className="text-[#c7a04b] text-[9px] tracking-[0.4em] font-medium shrink-0"
        style={{ fontFamily: 'var(--font-montserrat)' }}>{num}</span>
      <span className="text-white/60 text-[10px] tracking-[0.35em] uppercase shrink-0"
        style={{ fontFamily: 'var(--font-montserrat)' }}>{label}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-[#c7a04b]/20 to-transparent" />
    </div>
  )
}

// ── Formulářový input ─────────────────────────────────────────────────────────
function Field({
  label, name, value, onChange, error, type = 'text', placeholder, submitted, readOnly,
}: {
  label: string; name: keyof FormData; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string; type?: string; placeholder?: string; submitted?: boolean; readOnly?: boolean
}) {
  return (
    <div>
      <label className={`${LABEL_CLS}`}
        style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.55)' }}>
        {label}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} autoComplete="off" readOnly={readOnly}
        className={`${INPUT_CLS} ${submitted && error ? 'border-[#c7a04b]/70' : 'border-white/12'} ${readOnly ? 'opacity-50 cursor-default' : ''}`}
        style={{ fontFamily: 'var(--font-montserrat)' }}
      />
      {submitted && error && (
        <p className="text-[#c7a04b]/80 text-[10px] mt-1.5 tracking-[0.02em]"
          style={{ fontFamily: 'var(--font-montserrat)' }}>{error}</p>
      )}
    </div>
  )
}

// ── VOP + CTA ─────────────────────────────────────────────────────────────────
function CtaBlock({ submitted, vopChecked, setVopChecked, onSubmit, loading }:
  { submitted: boolean; vopChecked: boolean; setVopChecked: (v: boolean) => void; onSubmit: () => void; loading?: boolean }) {
  return (
    <>
      <div className="mb-5">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={vopChecked} onChange={e => setVopChecked(e.target.checked)}
            className="w-4 h-4 shrink-0 mt-0.5 accent-[#c7a04b]" />
          <span className="text-[11px] text-white/45 leading-relaxed"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            Souhlasím s{' '}
            <a href="/podminky" className="text-[#c7a04b]/70 underline underline-offset-2 hover:text-[#c7a04b]">
              obchodními podmínkami
            </a>
          </span>
        </label>
        {submitted && !vopChecked && (
          <p className="text-[#c7a04b]/80 text-[10px] mt-1.5 tracking-[0.02em]"
            style={{ fontFamily: 'var(--font-montserrat)' }}>Potvrďte souhlas s podmínkami</p>
        )}
      </div>
      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full bg-[#c7a04b] text-black text-[11px] font-bold tracking-[0.35em]
                   uppercase py-[18px] flex items-center justify-center gap-3
                   hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(199,160,75,0.3)]
                   transition-all duration-300 cursor-pointer border-none rounded-full
                   disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
        style={{ fontFamily: 'var(--font-montserrat)' }}
      >
        {loading ? 'Zpracovávám…' : 'Přejít k platbě'}
        {!loading && <span className="text-base font-light">→</span>}
      </button>
      <p className="text-center text-[9px] tracking-[0.25em] uppercase text-white/20 mt-3"
        style={{ fontFamily: 'var(--font-montserrat)' }}>
        Bezpečná platba · SSL šifrování
      </p>
    </>
  )
}

// ════════════════════════════════════════════════════════════════════════════
export default function ObjednavkaPage() {

  const { items } = useCart()
  const router    = useRouter()
  const { user, isLoaded } = useUser()
  const { signUp, fetchStatus } = useSignUp()

  // ── Form state ──────────────────────────────────────────────────────────
  const [form, setForm] = useState<FormData>({
    jmeno: '', prijmeni: '', email: '', telefon: '',
    ulice: '', mesto: '', psc: '', stat: 'Česká republika',
  })
  const [errors,      setErrors]      = useState<FormErrors>({})
  const [submitted,   setSubmitted]   = useState(false)
  const [vopChecked,  setVopChecked]  = useState(false)
  const [loading,     setLoading]     = useState(false)

  // ── Create account state (pouze nepřihlášení) ───────────────────────────
  const [createAccount, setCreateAccount] = useState(false)
  const [password,      setPassword]      = useState('')
  const [pwError,       setPwError]       = useState('')
  const [accountMsg,    setAccountMsg]    = useState('')

  const uliceRef = useRef<HTMLInputElement>(null)

  // ── Přihlas uživatele: předvyplň formulář ──────────────────────────────
  useEffect(() => {
    if (!isLoaded || !user) return
    const savedPhone = (user.unsafeMetadata as { phone?: string }).phone ?? ''
    setForm(prev => ({
      ...prev,
      jmeno:    user.firstName ?? prev.jmeno,
      prijmeni: user.lastName  ?? prev.prijmeni,
      email:    user.primaryEmailAddress?.emailAddress ?? prev.email,
      telefon:  savedPhone || prev.telefon,
    }))
  }, [isLoaded, user])

  useEffect(() => {
    if (items.length === 0) router.replace('/')
  }, [items, router])

  // ── Uložené adresy z profilu ────────────────────────────────────────────
  const savedAddresses: SavedAddress[] = (
    (user?.unsafeMetadata as { addresses?: SavedAddress[] })?.addresses ?? []
  )

  const applyAddress = (addr: SavedAddress) => {
    setForm(prev => ({
      ...prev,
      ulice: addr.street,
      mesto: addr.city,
      psc:   addr.zip,
    }))
  }

  // ── Google Places autocomplete ──────────────────────────────────────────
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
        psc:   pc  || prev.psc,
      }))
    })
  }

  // ── Helpers ─────────────────────────────────────────────────────────────
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (submitted && errors[name as keyof FormErrors])
      setErrors(prev => ({ ...prev, [name]: undefined }))
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

  const handleSubmit = async () => {
    setSubmitted(true)
    if (!validate() || !vopChecked) return

    // Validace hesla při tvorbě účtu
    if (!user && createAccount) {
      if (password.length < 8) { setPwError('Heslo musí mít alespoň 8 znaků.'); return }
      setPwError('')
    }

    setLoading(true)
    try {
      // ── Odeslání objednávky (zde napojit na backend/Stripe) ──
      console.log('Objednávka:', { form, items, total })

      // ── Tvorba účtu na pozadí (nepřihlášený uživatel) ──
      if (!user && createAccount && signUp && fetchStatus !== 'fetching') {
        try {
          const { error: signUpErr } = await signUp.create({
            firstName:    form.jmeno,
            lastName:     form.prijmeni,
            emailAddress: form.email,
            password,
          })
          if (signUpErr) throw signUpErr
          // Ulož telefon do unsafeMetadata nového účtu
          if (form.telefon) {
            try { await signUp.update({ unsafeMetadata: { phone: form.telefon } }) } catch { /* silent */ }
          }
          if (signUp.status === 'complete') {
            setAccountMsg('Účet byl vytvořen! Přihlašuji vás…')
            router.push('/ucet/profil')
            return
          } else {
            // Vyžaduje email verifikaci
            setAccountMsg('Účet vytvořen — zkontrolujte e-mail pro ověření.')
          }
        } catch {
          setAccountMsg('Objednávka přijata. Účet se nepodařilo vytvořit — zkuste se zaregistrovat ručně.')
        }
      }

      // Přesměrování na potvrzení (Stripe / děkovná stránka)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) return null

  // ── Přehled produktů ─────────────────────────────────────────────────────
  const OrderItems = (
    <div className="flex flex-col gap-5">
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-4">
          <div className="relative w-[52px] h-[64px] shrink-0">
            <div className="absolute inset-0 rounded"
              style={{ background: 'radial-gradient(ellipse at center, rgba(199,160,75,0.2) 0%, transparent 70%)' }} />
            {item.img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.img} alt={item.name} className="w-full h-full object-contain relative" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-white/85 tracking-[0.04em] truncate"
              style={{ fontFamily: 'var(--font-montserrat)' }}>{item.name}</p>
            <p className="text-[9px] text-white/30 tracking-[0.08em] mt-0.5"
              style={{ fontFamily: 'var(--font-montserrat)' }}>{item.brand}</p>
            <p className="text-[10px] text-white/45 mt-1"
              style={{ fontFamily: 'var(--font-montserrat)' }}>{item.qty} × {item.price} Kč</p>
          </div>
          <p className="text-sm font-light text-[#c7a04b] shrink-0"
            style={{ fontFamily: 'var(--font-exo2)' }}>{item.qty * item.price} Kč</p>
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

        {/* Heading */}
        <div className="max-w-6xl mx-auto mb-10 md:mb-14 pb-6"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[#c7a04b] text-[9px] tracking-[0.5em] uppercase mb-2.5"
            style={{ fontFamily: 'var(--font-montserrat)' }}>
            — Dokončení objednávky
          </p>
          <h1 className="font-light tracking-[0.1em] uppercase text-white/90"
            style={{ fontFamily: 'var(--font-exo2)', fontSize: 'clamp(1.6rem,3.5vw,2.4rem)' }}>
            Objednávka
          </h1>
          {/* Přihlášený badge */}
          {isLoaded && user && (
            <p className="mt-2 text-[10px] tracking-[0.08em]"
              style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.5)' }}>
              Přihlášeni jako {user.primaryEmailAddress?.emailAddress}
            </p>
          )}
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:grid md:grid-cols-[1fr_380px] md:items-start gap-10">

          {/* ══ MOBIL: přehled nahoře ══ */}
          <div className="md:hidden rounded-lg p-6"
            style={{ border: '1px solid rgba(199,160,75,0.15)', background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[#c7a04b] text-[9px] tracking-[0.4em] uppercase mb-5"
              style={{ fontFamily: 'var(--font-montserrat)' }}>Vaše objednávka</p>
            {OrderItems}
            <div className="h-px my-5" style={{ background: 'rgba(199,160,75,0.2)' }} />
            <div className="flex justify-between items-baseline">
              <span className="text-[9px] tracking-[0.3em] uppercase text-white/35"
                style={{ fontFamily: 'var(--font-montserrat)' }}>Celkem</span>
              <span className="text-[1.4rem] font-light text-[#c7a04b]"
                style={{ fontFamily: 'var(--font-exo2)' }}>{total} Kč</span>
            </div>
          </div>

          {/* ══ LEVÝ SLOUPEC: formulář ══ */}
          <div>

            {/* 01 Osobní údaje */}
            <section className="mb-10">
              <SectionHeader num="01" label="Osobní údaje" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Jméno"    name="jmeno"    value={form.jmeno}    onChange={handleChange} error={errors.jmeno}    submitted={submitted} readOnly={!!user} />
                <Field label="Příjmení" name="prijmeni" value={form.prijmeni} onChange={handleChange} error={errors.prijmeni} submitted={submitted} readOnly={!!user} />
                <Field label="E-mail"   name="email"    value={form.email}    onChange={handleChange} error={errors.email}    submitted={submitted} type="email" readOnly={!!user} />
                <Field label="Telefon"  name="telefon"  value={form.telefon}  onChange={handleChange} error={errors.telefon}  submitted={submitted} type="tel" placeholder="+420" readOnly={!!user} />
              </div>
              {isLoaded && user && (
                <p className="mt-3 text-[9px] tracking-[0.08em]"
                  style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.18)' }}>
                  Údaje jsou předvyplněny z vašeho účtu.{' '}
                  <a href="/ucet/profil" className="hover:text-[#c7a04b]/60 transition-colors"
                    style={{ color: 'rgba(199,160,75,0.35)' }}>Upravit v profilu →</a>
                </p>
              )}
            </section>

            {/* 02 Doručovací adresa */}
            <section className="mb-10">
              <SectionHeader num="02" label="Doručovací adresa" />

              {/* Uložené adresy — jen pro přihlášené */}
              {isLoaded && user && savedAddresses.length > 0 && (
                <div className="mb-7">
                  <p className="text-[9px] uppercase tracking-[0.35em] mb-3"
                    style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.25)' }}>
                    Vaše uložené adresy
                  </p>
                  <div className="flex flex-col gap-2">
                    {savedAddresses.map(addr => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => applyAddress(addr)}
                        className="group flex items-center gap-3 text-left px-4 py-3.5 rounded-lg
                                   transition-all duration-300 cursor-pointer w-full"
                        style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'transparent' }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'rgba(199,160,75,0.30)'
                          e.currentTarget.style.background  = 'rgba(199,160,75,0.04)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                          e.currentTarget.style.background  = 'transparent'
                        }}
                      >
                        <MapPin size={13} style={{ color: 'rgba(199,160,75,0.45)', flexShrink: 0 }} />
                        <div>
                          <p className="text-[11px] text-white/70"
                            style={{ fontFamily: 'var(--font-montserrat)', letterSpacing: '0.03em' }}>
                            {addr.street}
                          </p>
                          <p className="text-[10px] text-white/30 mt-0.5"
                            style={{ fontFamily: 'var(--font-montserrat)' }}>
                            {addr.zip} {addr.city}
                          </p>
                        </div>
                        <span className="ml-auto text-[9px] uppercase tracking-[0.25em] opacity-0
                                         group-hover:opacity-100 transition-opacity duration-300"
                          style={{ color: 'rgba(199,160,75,0.6)', fontFamily: 'var(--font-montserrat)' }}>
                          Použít
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="h-px mt-6 mb-1"
                    style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <p className="text-[9px] uppercase tracking-[0.3em] mt-4 mb-5"
                    style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.20)' }}>
                    nebo zadejte novou adresu
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ulice — Google Places */}
                <div className="md:col-span-2">
                  <label className={LABEL_CLS}
                    style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.55)' }}>
                    Ulice a číslo popisné
                  </label>
                  <input
                    ref={uliceRef}
                    type="text" name="ulice" value={form.ulice} onChange={handleChange}
                    placeholder="Začněte psát adresu…"
                    autoComplete="off" data-lpignore="true" data-form-type="other"
                    className={`${INPUT_CLS} ${submitted && errors.ulice ? 'border-[#c7a04b]/70' : 'border-white/12'}`}
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                  />
                  {submitted && errors.ulice && (
                    <p className="text-[#c7a04b]/80 text-[10px] mt-1.5"
                      style={{ fontFamily: 'var(--font-montserrat)' }}>{errors.ulice}</p>
                  )}
                </div>

                <Field label="Město" name="mesto" value={form.mesto} onChange={handleChange} error={errors.mesto} submitted={submitted} />
                <Field label="PSČ"   name="psc"   value={form.psc}   onChange={handleChange} error={errors.psc}   submitted={submitted} placeholder="110 00" />

                {/* Stát — zamčeno */}
                <div className="md:col-span-2">
                  <label className={LABEL_CLS}
                    style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.55)' }}>
                    Stát
                  </label>
                  <div className="border-b border-white/10 py-2.5 text-white/30 text-[0.9rem] cursor-not-allowed"
                    style={{ fontFamily: 'var(--font-montserrat)' }}>
                    Česká republika
                  </div>
                  <p className="text-[10px] text-white/18 mt-1.5 tracking-[0.02em]"
                    style={{ fontFamily: 'var(--font-montserrat)' }}>
                    Aktuálně doručujeme pouze do ČR
                  </p>
                </div>
              </div>
            </section>

            {/* 03 Doprava */}
            <section className="mb-10">
              <SectionHeader num="03" label="Doprava" />
              <div className="flex items-center gap-3 px-5 py-4 rounded-lg"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <IconTruck />
                <p className="text-[11px] tracking-[0.15em] text-[#c7a04b]/65"
                  style={{ fontFamily: 'var(--font-montserrat)' }}>
                  Výběr dopravy bude dostupný brzy.
                </p>
              </div>
            </section>

            {/* 04 Vytvořit účet (jen nepřihlášení) */}
            {isLoaded && !user && (
              <section className="mb-10">
                <SectionHeader num="04" label="Rychlejší příští nákup" />
                <label className="flex items-start gap-3 cursor-pointer mb-4">
                  <div className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={e => setCreateAccount(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className="w-4 h-4 rounded-sm transition-all duration-300 flex items-center justify-center"
                      style={{
                        border:     createAccount ? '1px solid #c7a04b' : '1px solid rgba(255,255,255,0.2)',
                        background: createAccount ? 'rgba(199,160,75,0.15)' : 'transparent',
                      }}
                    >
                      {createAccount && <Check size={10} style={{ color: '#c7a04b' }} />}
                    </div>
                  </div>
                  <span className="text-[11px] text-white/45 leading-relaxed"
                    style={{ fontFamily: 'var(--font-montserrat)' }}>
                    Chci vytvořit účet pro rychlejší příští nákup
                  </span>
                </label>

                <AnimatePresence>
                  {createAccount && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-1 pb-2">
                        <label className={LABEL_CLS}
                          style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.55)' }}>
                          Heslo
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={e => { setPassword(e.target.value); setPwError('') }}
                          placeholder="min. 8 znaků"
                          className={`${INPUT_CLS} ${pwError ? 'border-[#c7a04b]/70' : 'border-white/12'}`}
                          style={{ fontFamily: 'var(--font-montserrat)' }}
                        />
                        {pwError && (
                          <p className="text-[#c7a04b]/80 text-[10px] mt-1.5"
                            style={{ fontFamily: 'var(--font-montserrat)' }}>{pwError}</p>
                        )}
                        <p className="text-[9px] text-white/20 mt-2 tracking-[0.04em]"
                          style={{ fontFamily: 'var(--font-montserrat)' }}>
                          Účet bude vytvořen na e-mail{' '}
                          <span style={{ color: 'rgba(199,160,75,0.4)' }}>{form.email || '(vyplňte výše)'}</span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {accountMsg && (
                  <p className="mt-3 text-[10px] tracking-[0.06em]"
                    style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.7)' }}>
                    {accountMsg}
                  </p>
                )}
              </section>
            )}

            {/* Mobil: VOP + CTA */}
            <div className="md:hidden">
              <CtaBlock submitted={submitted} vopChecked={vopChecked}
                setVopChecked={setVopChecked} onSubmit={handleSubmit} loading={loading} />
            </div>
          </div>

          {/* ══ PRAVÝ SLOUPEC — sticky panel (desktop) ══ */}
          <div className="hidden md:block" style={{ position: 'sticky', top: '120px' }}>
            <div className="rounded-lg p-8"
              style={{ border: '1px solid rgba(199,160,75,0.15)', background: 'rgba(255,255,255,0.02)' }}>

              <p className="text-[#c7a04b] text-[9px] tracking-[0.4em] uppercase mb-6"
                style={{ fontFamily: 'var(--font-montserrat)' }}>Vaše objednávka</p>

              <div style={{
                maxHeight: '280px', overflowY: 'auto', marginBottom: '16px',
                paddingRight: '4px', scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(199,160,75,0.3) transparent',
              }}>
                {OrderItems}
              </div>

              <div className="h-px my-6" style={{ background: 'rgba(199,160,75,0.2)' }} />

              <div className="flex justify-between items-baseline mb-7">
                <span className="text-[9px] tracking-[0.3em] uppercase text-white/35"
                  style={{ fontFamily: 'var(--font-montserrat)' }}>Celkem</span>
                <span className="text-[1.5rem] font-light text-[#c7a04b]"
                  style={{ fontFamily: 'var(--font-exo2)' }}>{total} Kč</span>
              </div>

              <CtaBlock submitted={submitted} vopChecked={vopChecked}
                setVopChecked={setVopChecked} onSubmit={handleSubmit} loading={loading} />

              <div className="flex gap-3 mt-5 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex-1 flex items-center gap-2">
                  <IconLock />
                  <span className="text-[9px] tracking-[0.12em] text-white/30 leading-snug"
                    style={{ fontFamily: 'var(--font-montserrat)' }}>Zabezpečená platba</span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <IconPackage />
                  <span className="text-[9px] tracking-[0.12em] text-white/30 leading-snug"
                    style={{ fontFamily: 'var(--font-montserrat)' }}>Doprava do 3 pracovních dnů</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
