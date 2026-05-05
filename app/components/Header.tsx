'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

/* ─── Ikony (inline SVG — žádná závislost) ─── */
function IconMenu() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <rect x="2" y="5"  width="18" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="2" y="10" width="18" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="2" y="15" width="18" height="1.5" rx="0.75" fill="currentColor" />
    </svg>
  )
}

function IconX() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="4" x2="4"  y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <polyline points="7,4 13,10 7,16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ─── Desktop nav odkaz ─── */
function NavLink({ href, children, onClick }: {
  href: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative inline-block uppercase tracking-widest
                 text-sm font-medium text-white/90 transition-colors duration-300
                 hover:text-[#c7a04b] no-underline pb-1"
    >
      {children}
      <span
        className="absolute bottom-0 left-0 h-px w-full bg-[#c7a04b]
                   scale-x-0 origin-left transition-transform duration-300 ease-out
                   group-hover:scale-x-100"
      />
    </Link>
  )
}

/* ─────────────────────────────────────────
   Header
───────────────────────────────────────── */

const BRANDS = [
  { name: 'Seedos', slug: 'seedos', sub: 'Klasická volba'    },
  { name: 'David',  slug: 'david',  sub: 'Americký originál' },
  { name: 'Bigs',   slug: 'bigs',   sub: 'Prémiová edice'    },
]

export default function Header() {
  const { openCart, items } = useCart()
  const totalQty = items.reduce((s, i) => s + i.qty, 0)
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isProductPage = pathname.includes('/slunecnicova-seminka')

  const [isOpen,     setIsOpen]     = useState(false)
  const [activeMenu, setActiveMenu] = useState<'main' | 'seeds'>('main')

  // Zavři menu Escape klávesou
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Zablokuj scroll těla při otevřeném menu
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Auto-open brands panel via custom event
  useEffect(() => {
    const handler = () => {
      setIsOpen(true)
      setActiveMenu('seeds')
    }
    window.addEventListener('openBrandsMenu', handler)
    return () => window.removeEventListener('openBrandsMenu', handler)
  }, [])

  const close = () => { setIsOpen(false); setActiveMenu('main') }

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full pointer-events-none
                   bg-gradient-to-b from-[#0a0a0a] via-black/50 to-transparent
                   ${isHome ? 'pb-28' : 'pb-28 md:pb-6'}`}
        style={{ zIndex: 9999 }}
      >
        {/* TOP MASK GRADIENT - Pohlcuje text při scrollu */}
        {isHome ? (
          /* Hlavní stránka — beze změny */
          <div
            className="absolute top-0 left-0 w-full h-[200px] -z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,1) 0%, rgba(10,10,10,0.8) 40%, rgba(10,10,10,0) 100%)' }}
          />
        ) : isProductPage ? (
          <>
            {/* Produktové podstránky — MOBIL: fade začíná pod nav barem */}
            <div
              className="absolute left-0 w-full h-10 pointer-events-none md:hidden"
              style={{ top: '84px', background: 'linear-gradient(to bottom, #0a0a0a, transparent)', zIndex: -10 }}
            />
            {/* Produktové podstránky — DESKTOP: beze změny */}
            <div
              className="absolute left-0 w-full h-24 -z-10 pointer-events-none hidden md:block top-[10px]"
              style={{ background: 'linear-gradient(to bottom, #0a0a0a 0%, #0a0a0a 45%, rgba(10,10,10,0.75) 72%, transparent 100%)' }}
            />
          </>
        ) : (
          /* Ostatní podstránky (o-nas, kontakt…) — původní chování */
          <div
            className="absolute top-0 left-0 w-full h-20 -z-10 pointer-events-none md:top-[10px] md:h-24"
            style={{ background: 'linear-gradient(to bottom, #0a0a0a 0%, #0a0a0a 45%, rgba(10,10,10,0.75) 72%, transparent 100%)' }}
          />
        )}
        <div className={`pointer-events-auto px-6 md:px-8 lg:px-14 py-5${isProductPage ? ' bg-[#0a0a0a] md:bg-transparent' : ''}`}>

          {/* ── DESKTOP layout: logo vlevo | nav střed | košík vpravo ── */}
          <div className="hidden md:grid grid-cols-3 items-center">

            {/* Logo — vlevo */}
            <Link href="/" className="justify-self-start shrink-0">
              <Image
                src="/logo.png"
                alt="Bases Logo"
                width={180}
                height={56}
                className="h-14 object-contain"
                style={{ width: 'auto' }}
                priority
              />
            </Link>

            {/* Nav — střed */}
            <nav className="justify-self-center">
              <ul className="flex items-center gap-10 list-none m-0 p-0">
                <li><NavLink href="/slunecnicova-seminka">Slunečnicová semínka</NavLink></li>
                <li><NavLink href="/o-nas">O nás</NavLink></li>
              </ul>
            </nav>

            {/* Účet + Košík — vpravo */}
            <div className="justify-self-end flex items-center gap-8">
              <NavLink href="/ucet">Účet</NavLink>
              <button
                onClick={openCart}
                className="group relative inline-block bg-transparent border-0 cursor-pointer p-0 pb-1"
              >
                <span
                  className="uppercase tracking-widest text-sm font-medium text-white/90
                             transition-colors duration-300 group-hover:text-[#c7a04b]"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  Košík
                </span>
                {totalQty > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-[#c7a04b] text-black text-[10px] font-bold align-middle">
                    {totalQty}
                  </span>
                )}
                <span
                  className="absolute bottom-0 left-0 h-px bg-[#c7a04b]
                             scale-x-0 origin-left transition-transform duration-300 ease-out
                             group-hover:scale-x-100"
                  style={{ width: totalQty > 0 ? 'calc(100% - 26px)' : '100%' }}
                />
              </button>
            </div>

          </div>

          {/* ── MOBILNÍ layout: logo + [košík + hamburger] ── */}
          <div className="flex md:hidden items-center justify-between">

            {/* Logo */}
            <Link href="/" onClick={close} className="shrink-0">
              <Image
                src="/logo.png"
                alt="Bases Logo"
                width={140}
                height={44}
                className="h-11 object-contain"
                style={{ width: 'auto' }}
                priority
              />
            </Link>

            {/* Vpravo: košík + hamburger */}
            <div className="flex items-center gap-4">
              <button
                onClick={openCart}
                className="relative uppercase text-sm font-medium text-white/90
                           hover:text-[#c7a04b] transition-colors duration-300
                           bg-transparent border-0 cursor-pointer"
                style={{ fontFamily: 'var(--font-montserrat)', letterSpacing: '0.3em', fontSize: '0.72rem' }}
              >
                Košík
                {totalQty > 0 && (
                  <span
                    className="absolute -top-1.5 -right-3.5 text-[8px] font-bold rounded-full
                               w-3.5 h-3.5 flex items-center justify-center"
                    style={{ background: '#c7a04b', color: '#000' }}
                  >
                    {totalQty}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsOpen(true)}
                aria-label="Otevřít menu"
                className="text-white/90 hover:text-[#c7a04b] transition-colors duration-300
                           bg-transparent border-0 cursor-pointer p-1"
              >
                <IconMenu />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* ══════════════════════════════════
          MOBILNÍ MENU — FULLSCREEN OVERLAY
      ══════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="md:hidden fixed inset-0 z-[10000] flex flex-col"
            style={{
              background: 'rgba(6,6,6,0.96)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            {/* ── Top bar: logo + X ── */}
            <div className="flex items-center justify-between px-7 pt-6 pb-2 shrink-0">
              <Link href="/" onClick={close}>
                <Image
                  src="/logo.png"
                  alt="Bases Logo"
                  width={110}
                  height={36}
                  className="h-9 object-contain"
                  style={{ width: 'auto' }}
                />
              </Link>
              <button
                onClick={close}
                aria-label="Zavřít menu"
                className="bg-transparent border-0 cursor-pointer p-2 -mr-1"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                <IconX />
              </button>
            </div>

            {/* ── Střed: navigace s AnimatePresence pro přepínání fází ── */}
            <div className="flex-1 flex flex-col justify-center px-8 overflow-hidden">
              <AnimatePresence mode="wait">

                {activeMenu === 'main' && (
                  <motion.nav
                    key="main"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="flex flex-col gap-0"
                  >
                    {[
                      { label: 'Slunečnicová\nsemínka', sub: 'Seedos · David · Bigs', action: 'seeds' as const },
                      { label: 'O nás',                  sub: 'Náš příběh',            action: 'onas'  as const, href: '/o-nas' },
                      { label: 'Můj účet',               sub: 'Správa objednávek',     action: 'ucet'  as const, href: '/ucet' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.action}
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                          paddingTop: '1.9rem',
                          paddingBottom: '1.9rem',
                        }}
                      >
                        {item.action === 'seeds' ? (
                          <button
                            onClick={() => setActiveMenu('seeds')}
                            className="text-left bg-transparent border-0 cursor-pointer p-0 w-full"
                          >
                            <span style={{
                              display: 'block',
                              fontFamily: 'var(--font-exo2)',
                              fontSize: 'clamp(2.4rem, 10vw, 3.2rem)',
                              fontWeight: 200,
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                              color: 'rgba(255,255,255,0.90)',
                              lineHeight: 1.1,
                              whiteSpace: 'pre-line',
                            }}>
                              {item.label}
                            </span>
                            <span style={{
                              display: 'block',
                              marginTop: '0.55rem',
                              fontFamily: 'var(--font-montserrat)',
                              fontSize: '9px',
                              letterSpacing: '0.38em',
                              textTransform: 'uppercase',
                              color: 'rgba(199,160,75,0.65)',
                            }}>
                              {item.sub}
                            </span>
                          </button>
                        ) : (
                          <Link href={'href' in item ? item.href : '/'} onClick={close} className="no-underline block">
                            <span style={{
                              display: 'block',
                              fontFamily: 'var(--font-exo2)',
                              fontSize: 'clamp(2.4rem, 10vw, 3.2rem)',
                              fontWeight: 200,
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                              color: 'rgba(255,255,255,0.90)',
                              lineHeight: 1.1,
                            }}>
                              {item.label}
                            </span>
                            <span style={{
                              display: 'block',
                              marginTop: '0.55rem',
                              fontFamily: 'var(--font-montserrat)',
                              fontSize: '9px',
                              letterSpacing: '0.38em',
                              textTransform: 'uppercase',
                              color: 'rgba(199,160,75,0.65)',
                            }}>
                              {item.sub}
                            </span>
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </motion.nav>
                )}

                {activeMenu === 'seeds' && (
                  <motion.div
                    key="seeds"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    {/* ← Zpět */}
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      onClick={() => setActiveMenu('main')}
                      className="flex items-center gap-2 bg-transparent border-0 cursor-pointer p-0 mb-8"
                      style={{
                        fontFamily: 'var(--font-montserrat)',
                        fontSize: '10px',
                        letterSpacing: '0.32em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.28)',
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <polyline points="10,3 4,8 10,13" stroke="currentColor" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Zpět
                    </motion.button>

                    <nav className="flex flex-col gap-0">
                      {BRANDS.map((brand, idx) => (
                        <motion.div
                          key={brand.slug}
                          initial={{ opacity: 0, y: 22 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: idx * 0.09, ease: [0.22, 1, 0.36, 1] }}
                          style={{
                            borderBottom: idx < BRANDS.length - 1
                              ? '1px solid rgba(255,255,255,0.07)' : 'none',
                            paddingTop: '1.6rem',
                            paddingBottom: '1.6rem',
                          }}
                        >
                          <Link
                            href={`/slunecnicova-seminka/${brand.slug}`}
                            onClick={close}
                            className="no-underline block"
                          >
                            <span style={{
                              display: 'block',
                              fontFamily: 'var(--font-exo2)',
                              fontSize: 'clamp(2.4rem, 10vw, 3.2rem)',
                              fontWeight: 200,
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                              color: 'rgba(255,255,255,0.90)',
                              lineHeight: 1.1,
                              textShadow: '0 0 32px rgba(199,160,75,0.45)',
                            }}>
                              {brand.name}
                            </span>
                            <span style={{
                              display: 'block',
                              marginTop: '0.45rem',
                              fontFamily: 'var(--font-montserrat)',
                              fontSize: '9px',
                              letterSpacing: '0.38em',
                              textTransform: 'uppercase',
                              color: 'rgba(199,160,75,0.65)',
                            }}>
                              {brand.sub}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </nav>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* ── Luxury footer ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="shrink-0 flex items-center gap-7 px-8 pb-10 pt-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/bases.official'  },
                { label: 'TikTok',   href: 'https://www.tiktok.com/@bases.official' },
                { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61588261719759' },
              ].map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '9px',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.32)',
                    textDecoration: 'none',
                  }}
                >
                  {item.label}
                </a>
              ))}
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
