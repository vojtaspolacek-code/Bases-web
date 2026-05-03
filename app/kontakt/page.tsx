'use client'

import { motion } from 'framer-motion'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div style={{ overflow: 'hidden' }}>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1.2, ease, delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default function KontaktPage() {
  return (
    <main
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >

      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 55%, rgba(199,160,75,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Center block — matematicky uprostřed na obou osách */}
      <div className="absolute top-[42%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full flex flex-col items-center text-center px-8">

        {/* Label */}
        <Reveal delay={0}>
          <p
            className="uppercase tracking-[0.4em] mb-6"
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '10px',
              color: '#c7a04b',
            }}
          >
            Zůstaňme ve spojení
          </p>
        </Reveal>

        {/* Email */}
        <Reveal delay={0.15}>
          <motion.a
            href="mailto:info@bases.cz"
            className="group relative no-underline block"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.35, ease }}
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.8rem, 7vw, 7rem)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}
          >
            <motion.span
              className="block"
              whileHover={{ color: '#c7a04b' }}
              transition={{ duration: 0.5 }}
              style={{ display: 'inline-block' }}
            >
              info@bases.cz
            </motion.span>

            {/* Underline reveal */}
            <span
              className="absolute left-0 bottom-[-4px] h-[1px] w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
              style={{ background: 'linear-gradient(to right, #c7a04b, rgba(199,160,75,0.3))' }}
            />
          </motion.a>
        </Reveal>

        {/* Phone */}
        <Reveal delay={0.3}>
          <motion.a
            href="tel:+420799794670"
            className="group relative no-underline block mt-5 md:mt-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.35, ease }}
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.08em',
            }}
          >
            <motion.span
              className="block"
              whileHover={{ color: '#c7a04b' }}
              transition={{ duration: 0.5 }}
              style={{ display: 'inline-block' }}
            >
              +420 799 794 670
            </motion.span>

            <span
              className="absolute left-0 bottom-[-4px] h-[1px] w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
              style={{ background: 'linear-gradient(to right, #c7a04b, rgba(199,160,75,0.3))' }}
            />
          </motion.a>
        </Reveal>

      </div>

      {/* Legal block */}
      <motion.div
        className="absolute bottom-8 md:bottom-12 w-full px-8 md:px-24
                   flex flex-col md:flex-row gap-6 md:gap-0
                   items-center md:items-end
                   justify-center md:justify-between
                   text-center md:text-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease, delay: 2 }}
      >
        <span
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            fontWeight: 300,
            lineHeight: 1.8,
          }}
        >
          Jan Kurdiovský (Bases)&nbsp;&nbsp;|&nbsp;&nbsp;Svatopluka Čecha 1939/106A, 612 00, Brno
        </span>
        <span
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            fontWeight: 300,
            lineHeight: 1.8,
          }}
        >
          IČO: 11762390&nbsp;&nbsp;|&nbsp;&nbsp;Zapsáno v živnostenském rejstříku
        </span>
      </motion.div>

    </main>
  )
}
