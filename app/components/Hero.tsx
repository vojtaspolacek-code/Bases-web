'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

/* ─── Levitace packshotu + pulsující glow ─── */
const HERO_CSS = `
@keyframes hero-levitate {
  0%, 100% { transform: translateY(0px); }
  50%      { transform: translateY(-16px); }
}
@keyframes hero-glow-pulse {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50%      { opacity: 0.78; transform: scale(1.06); }
}
`

export default function Hero() {
  const prefersReduced = useReducedMotion()
  const skip           = prefersReduced === true
  const ease           = [0.22, 1, 0.36, 1] as [number, number, number, number]

  return (
    <motion.section
      initial={skip ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative min-h-screen flex items-center"
    >
      <style>{HERO_CSS}</style>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-14 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ══════════ LEVÁ: prodejní text ══════════ */}
          <div className="flex flex-col items-start text-left">

            {/* Eyebrow */}
            <motion.p
              initial={skip ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: skip ? 0 : 0.4, ease: 'easeOut' }}
              className="uppercase text-[#c7a04b] text-xs font-medium mb-6"
              style={{
                fontFamily:    'var(--font-montserrat)',
                letterSpacing: '0.42em',
              }}
            >
              Prémiový výběr z USA
            </motion.p>

            {/* Hlavní H1 */}
            <motion.h1
              initial={skip ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: skip ? 0 : 0.55, ease }}
              className="uppercase leading-[0.95] mb-8"
              style={{
                fontFamily: 'var(--font-exo2)',
                fontSize:   'clamp(3rem, 7.5vw, 6.25rem)',
                fontWeight: 500,
                color:      'rgba(250, 246, 238, 0.97)',
                letterSpacing: '0.01em',
                textShadow: '0 2px 30px rgba(0,0,0,0.55)',
              }}
            >
              Chuť pravé<br />Ameriky
            </motion.h1>

            {/* Zlatá linka */}
            <motion.div
              initial={skip ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.85, delay: skip ? 0 : 0.9, ease }}
              className="w-24 h-px mb-8 origin-left"
              style={{
                background: 'linear-gradient(to right, #c7a04b, rgba(199,160,75,0))',
              }}
            />

            {/* Popisek */}
            <motion.p
              initial={skip ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: skip ? 0 : 1.0, ease: 'easeOut' }}
              className="font-light max-w-md mb-10"
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize:   '1.0625rem',
                color:      'rgba(255,255,255,0.65)',
                lineHeight: 1.7,
              }}
            >
              Legendární příchutě a extrémní křupnutí. Přímo z amerických stadionů až k vám domů.
            </motion.p>

            {/* Luxusní CTA — zlatá výplň na hover */}
            <motion.div
              initial={skip ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: skip ? 0 : 1.2, ease: 'easeOut' }}
            >
              <Link
                href="/slunecnicova-seminka"
                className="group relative inline-flex items-center gap-3 no-underline
                           px-10 py-4 border border-[#c7a04b] overflow-hidden"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {/* Zlatá výplň zleva doprava */}
                <span
                  className="absolute inset-0 scale-x-0 group-hover:scale-x-100
                             origin-left transition-transform duration-500 ease-out"
                  style={{ background: '#c7a04b' }}
                />

                <span
                  className="relative uppercase text-sm font-medium
                             text-[#c7a04b] group-hover:text-black
                             transition-colors duration-500"
                  style={{ letterSpacing: '0.3em' }}
                >
                  Koupit nyní
                </span>
                <span
                  className="relative text-[#c7a04b] group-hover:text-black
                             transition-all duration-500 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </motion.div>

          </div>

          {/* ══════════ PRAVÁ: levitující packshot ══════════ */}
          <motion.div
            initial={skip ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: skip ? 0 : 0.7, ease }}
            className="relative flex items-center justify-center"
          >
            {/* Zlatý ambient glow za produktem */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 70% 65% at 50% 50%, rgba(199,160,75,0.24) 0%, rgba(199,160,75,0.07) 40%, transparent 70%)',
                filter:     'blur(36px)',
                animation:  'hero-glow-pulse 6s ease-in-out infinite',
              }}
            />

            {/* Drop shadow "na podlahu" */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                width:      '58%',
                height:     '32px',
                background: 'radial-gradient(ellipse, rgba(0,0,0,0.7) 0%, transparent 72%)',
                filter:     'blur(16px)',
              }}
            />

            {/* Levitující packshot */}
            <div
              className="relative"
              style={{
                animation: 'hero-levitate 7s ease-in-out infinite',
                filter:    'drop-shadow(0 30px 55px rgba(0,0,0,0.8)) drop-shadow(0 10px 20px rgba(0,0,0,0.4))',
              }}
            >
              <Image
                src="/products/david/barbecue/front.png.png"
                alt="David Barbecue — americká slunečnicová semínka"
                width={520}
                height={640}
                className="object-contain"
                priority
                style={{
                  maxHeight: '68vh',
                  width:     'auto',
                  height:    'auto',
                }}
              />
            </div>
          </motion.div>

        </div>
      </div>

    </motion.section>
  )
}
