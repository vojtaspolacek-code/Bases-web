'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

export default function Hero() {
  const prefersReduced = useReducedMotion()
  const skip           = prefersReduced === true

  return (
    <motion.section
      initial={skip ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >

      {/* ── Stadion ── */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg-bw.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          aria-hidden
        />
        {/* Uniformní ztmavení celé fotky */}
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.30)' }} />
        {/* Radiální vinětace — střed mírně vlevo, pravá strana tmavší */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 62% at 42% 48%, transparent 0%, rgba(0,0,0,0.52) 62%, rgba(0,0,0,0.90) 82%, #000 100%)',
          }}
        />
        {/* Extra ztmavení pravé strany */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 28%, transparent 52%)',
          }}
        />
        {/* Pravý dolní roh */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 55% 50% at 100% 100%, rgba(0,0,0,0.7) 0%, transparent 65%)',
          }}
        />
      </div>

      {/* Horní gradient — podkres pro navigaci */}
      <div
        className="absolute top-0 left-0 w-full pointer-events-none z-10"
        style={{
          height: '220px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)',
        }}
      />

    </motion.section>
  )
}
