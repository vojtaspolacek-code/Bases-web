'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { useState, useEffect } from 'react'

const HERO_CSS = `
@keyframes hero-levitate {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-14px); }
}
@keyframes hero-glow-pulse {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50%       { opacity: 0.78; transform: scale(1.06); }
}
`

const PRODUCT = {
  src: '/products/david/barbecue/front.png.png',
  alt: 'David Barbecue — americká slunečnicová semínka',
  sub: 'Přivezli jsme chuť, co znají fanoušci na každém stadionu v USA.',
}

export default function Hero() {
  const prefersReduced = useReducedMotion()
  const skip           = prefersReduced === true
  const ease           = [0.22, 1, 0.36, 1] as [number, number, number, number]

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    /*
      Mobil:  h-[100svh] — přesná výška 1 obrazovky (svh bere v úvahu adresní lištu Safari)
              items-start + pt-[160px] — text začíná pod hlavičkou
      Desktop: h-screen min-h-[600px] items-center — vertikální centrování jako dříve
    */
    <section className="relative overflow-hidden
                        h-auto flex items-start pt-[100px] pb-16
                        md:h-screen md:min-h-[600px] md:items-center md:pt-0 md:pb-0">
      <style>{HERO_CSS}</style>

      {/* ── MOBILNÍ STATICKÉ POZADÍ — block md:hidden ─────────────────
          Obyčejný div, žádný Framer Motion, žádný JS.
          position: fixed → zůstane nehybně na místě při scrollu.
          Skryto na desktopu, kde pracuje pozadí z page.tsx.
      ── */}
      <div
        className="block md:hidden fixed top-0 left-0 w-full z-0 pointer-events-none"
        style={{ height: '100lvh', minHeight: '100vh' }}
        aria-hidden
      >
        <Image
          src="/hero-bg-bw.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        {/* Stejné overlaye jako desktop verze v page.tsx */}
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.30)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 62% at 42% 48%, transparent 0%, rgba(0,0,0,0.52) 62%, rgba(0,0,0,0.90) 82%, #000 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 28%, transparent 52%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 50% at 100% 100%, rgba(0,0,0,0.7) 0%, transparent 65%)' }} />
      </div>

      {/* ── OBSAH ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-6 lg:px-14 md:pt-24 pb-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

          {/* ── Levá: text ── */}
          <div className="flex-1 flex flex-col items-center text-center md:items-start md:text-left">

            {/* Eyebrow — mobilní luxusní verze */}
            <p
              className="block md:hidden uppercase text-[10px] font-bold tracking-[0.3em] mb-4 text-center"
              style={{ color: '#c7a04b', fontFamily: 'var(--font-montserrat)' }}
            >
              Originál z USA
            </p>

            {/* Eyebrow — desktopová verze */}
            <motion.p
              initial={skip ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: skip ? 0 : 0.4, ease: 'easeOut' }}
              className="hidden md:block uppercase text-[#c7a04b] text-xs font-medium mb-6"
              style={{ fontFamily: 'var(--font-montserrat)', letterSpacing: '0.42em' }}
            >
              Prémiový výběr z USA
            </motion.p>

            {/* H1 */}
            <motion.h1
              initial={skip ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: skip ? 0 : 0.55, ease }}
              className="uppercase mb-6
                         text-5xl leading-tight
                         md:leading-[0.95] md:text-[clamp(2.5rem,5.5vw,4rem)]"
              style={{
                fontFamily:    'var(--font-exo2)',
                fontWeight:    700,
                color:         'rgba(250, 246, 238, 0.97)',
                letterSpacing: '0.01em',
                textShadow:    '0 2px 30px rgba(0,0,0,0.55)',
              }}
            >
              Chuť{' '}
              <span
                className="md:not-italic md:font-medium"
                style={{ fontStyle: 'italic', fontWeight: 300 }}
              >
                pravé
              </span>
              <br />Ameriky
            </motion.h1>

            {/* Zlatá linka */}
            <motion.div
              initial={skip ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.85, delay: skip ? 0 : 0.9, ease }}
              className="w-24 h-px origin-left mb-8 md:mb-6 mx-auto md:mx-0"
              style={{ background: 'linear-gradient(to right, #c7a04b, rgba(199,160,75,0))' }}
            />

            {/* Popis */}
            <motion.p
              initial={skip ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: skip ? 0 : 1.0, ease: 'easeOut' }}
              className="font-light mb-8 max-w-md
                         text-sm text-gray-300 px-8
                         md:px-0 md:text-[1.0625rem] md:text-white/65"
              style={{
                fontFamily: 'var(--font-montserrat)',
                lineHeight: 1.7,
              }}
            >
              {PRODUCT.sub}
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={skip ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: skip ? 0 : 1.15, ease: 'easeOut' }}
              className="flex justify-center md:justify-start"
            >
              <Link
                href="/slunecnicova-seminka"
                onClick={(e) => {
                  if (isMobile) {
                    e.preventDefault()
                    window.dispatchEvent(new CustomEvent('openBrandsMenu'))
                  }
                }}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-4
                           w-full md:w-auto px-10 py-4 md:py-4 rounded-full
                           bg-black/40
                           border border-[#c7a04b]/30
                           shadow-[0_0_20px_rgba(199,160,75,0.15)]
                           hover:shadow-[0_0_35px_rgba(199,160,75,0.35)] hover:border-[#c7a04b]/60
                           hover:bg-black/60
                           transition-all duration-500 ease-out no-underline"
              >
                {/* Jemný vnitřní gradient pro pocit hloubky */}
                <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[#c7a04b]/10 via-transparent to-[#c7a04b]/10" />

                <span
                  className="relative text-[11px] font-medium tracking-[0.25em] uppercase text-white/90 group-hover:text-[#c7a04b] transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  Prozkoumat kolekci
                </span>

                <span className="relative text-[#c7a04b] text-sm font-light transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
            </motion.div>

            {/* ── Micro-text — pouze mobil ── */}
            <p
              className="block md:hidden text-[11px] text-gray-400/80 mt-4 text-center tracking-wide"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              Skladem v ČR&nbsp;&nbsp;·&nbsp;&nbsp;Limitovaná várka
            </p>

          </div>

          {/* ── Pravá: statický produkt — skrytý na mobilu ── */}
          <motion.div
            initial={skip ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: skip ? 0 : 0.7, ease }}
            className="hidden md:flex flex-1 relative items-center justify-center"
          >
            {/* Zlatý ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 70% 65% at 50% 50%, rgba(199,160,75,0.22) 0%, rgba(199,160,75,0.06) 40%, transparent 70%)',
                filter:     'blur(36px)',
                animation:  'hero-glow-pulse 6s ease-in-out infinite',
              }}
            />

            {/* Tmavý polštář za produktem */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset:        '-40px',
                background:   'rgba(0,0,0,0.50)',
                filter:       'blur(40px)',
                borderRadius: '50%',
                zIndex:       -1,
              }}
            />

            {/* Levitující wrapper */}
            <div
              className="relative"
              style={{ animation: 'hero-levitate 7s ease-in-out infinite' }}
            >
              {/* Stín na podlahu */}
              <div
                className="absolute bottom-1 left-1/2 -translate-x-1/2 pointer-events-none
                           w-40 h-7 bg-black/80 blur-xl rounded-[100%]"
              />

              <div
                className="drop-shadow-[0_35px_35px_rgba(0,0,0,0.85)]"
                style={{ filter: 'brightness(0.92) contrast(1.15)' }}
              >
                <Image
                  src={PRODUCT.src}
                  alt={PRODUCT.alt}
                  width={520}
                  height={640}
                  className="object-contain"
                  priority
                  style={{ maxHeight: '65vh', width: 'auto', height: 'auto' }}
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* MOBILNÍ HORNÍ MASKA PRO SCROLLING - texty pod ni zajedou a zmizí */}
      <div className="md:hidden fixed top-0 left-0 w-full h-[35vh] pointer-events-none z-[45] bg-gradient-to-b from-black via-black/80 to-transparent" />

    </section>
  )
}
