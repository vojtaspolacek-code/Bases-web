'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function ValueProp() {
  const ref      = useRef<HTMLDivElement>(null)
  const inView   = useInView(ref, { once: true, margin: '-15% 0px' })
  const ease     = [0.22, 1, 0.36, 1] as [number, number, number, number]

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-32 flex flex-col items-center text-center">

        {/* Zlatá dělicí linka nahoře */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1, ease }}
          className="w-12 h-px mb-12 origin-center"
          style={{ background: 'linear-gradient(to right, transparent, #c7a04b, transparent)' }}
        />

        {/* Hlavní serif nadpis */}
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.15, ease }}
          style={{
            fontFamily:    'var(--font-playfair)',
            fontSize:      'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight:    400,
            color:         'rgba(250, 246, 238, 0.97)',
            lineHeight:    1.15,
            letterSpacing: '-0.01em',
            textShadow:    '0 4px 40px rgba(0,0,0,0.6)',
          }}
        >
          Není semínko<br />
          <span style={{ fontStyle: 'italic', color: '#c7a04b' }}>jako semínko.</span>
        </motion.h2>

        {/* Zlatá linka pod nadpisem */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.85, delay: 0.45, ease }}
          className="w-20 h-px my-10 origin-center"
          style={{ background: 'linear-gradient(to right, transparent, #c7a04b, transparent)' }}
        />

        {/* Odstavec */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.55, ease }}
          className="max-w-2xl font-light leading-relaxed"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize:   '1.0625rem',
            color:      'rgba(255, 255, 255, 0.58)',
            lineHeight: 1.85,
          }}
        >
          Dovážíme pouze ty největší a nejkřupavější slunečnicová semínka přímo od legendárních
          amerických výrobců. Chuť, která ovládla stadiony za oceánem, je teď u vás.
        </motion.p>

        {/* Zlatá linka dole */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.75, ease }}
          className="w-12 h-px mt-14 origin-center"
          style={{ background: 'linear-gradient(to right, transparent, #c7a04b, transparent)' }}
        />

      </div>
    </section>
  )
}
