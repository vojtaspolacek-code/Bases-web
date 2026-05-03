'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function StorySection() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px' })

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  const seedsHref = isMobile ? '/?brands=1' : '/slunecnicova-seminka'

  return (
    <section
      ref={ref}
      className="relative z-10 min-h-screen flex flex-col items-center justify-center py-32 px-6"
      style={{
        background:           'rgba(0,0,0,0.40)',
        backdropFilter:       'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div className="w-full max-w-6xl mx-auto">

        {/* Grid — dva sloupce */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-20">

          {/* Levý sloupec — velký serif nadpis */}
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease }}
            style={{
              fontFamily:    'var(--font-playfair)',
              fontSize:      'clamp(2rem, 4vw, 3.25rem)',
              fontWeight:    400,
              fontStyle:     'italic',
              color:         '#c7a04b',
              lineHeight:    1.2,
              letterSpacing: '-0.01em',
            }}
          >
            Extrémní křupnutí.<br />Legendární chuť.
          </motion.h2>

          {/* Pravý sloupec — dva odstavce */}
          <div className="flex flex-col gap-6">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.15, ease }}
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize:   '1rem',
                color:      'rgba(209,213,219,0.85)',
                lineHeight: 1.8,
                fontWeight: 300,
              }}
            >
              Zatímco běžná semínka vás po chvíli omrzí, náš výběr přináší velikost a chutě,
              na které jsou zvyklí hráči MLB.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.28, ease }}
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize:   '1rem',
                color:      'rgba(209,213,219,0.85)',
                lineHeight: 1.8,
                fontWeight: 300,
              }}
            >
              Od klasické soli, přes BBQ až po jalapeño. Žádné kompromisy.
            </motion.p>
          </div>
        </div>

        {/* Zlatá dělicí linka */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.35, ease }}
          className="w-full h-px mb-16 origin-left"
          style={{ background: 'linear-gradient(to right, rgba(199,160,75,0.5), rgba(199,160,75,0.08))' }}
        />

        {/* CTA — vystředěné */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.45, ease }}
          className="flex justify-center"
        >
          <Link
            href={seedsHref}
            className="group relative inline-flex items-center gap-3 no-underline
                       px-10 py-4 rounded-full overflow-hidden
                       border border-[#c7a04b]/50 backdrop-blur-sm
                       transition-all duration-500 hover:border-[#c7a04b]"
            style={{ fontFamily: 'var(--font-montserrat)', background: 'rgba(199,160,75,0.10)' }}
          >
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
                         transition-opacity duration-500"
              style={{ background: '#c7a04b' }}
            />
            <span
              className="relative uppercase text-sm font-semibold text-[#c7a04b]
                         group-hover:text-black transition-colors duration-500"
              style={{ letterSpacing: '0.3em' }}
            >
              Přejít do e-shopu
            </span>
            <span
              className="relative text-[#c7a04b] group-hover:text-black
                         transition-all duration-500 group-hover:translate-x-1 font-bold"
            >
              →
            </span>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
