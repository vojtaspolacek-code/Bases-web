'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const STORY = [
  {
    num: '01',
    label: 'První impuls',
    text: 'Všechno to začalo o prázdninách roku 2025. Věděli jsme, že prémiová slunečnicová semínka existují, ale u nás byla buď nedostupná, nebo nesmyslně drahá. Zlom přišel, když se Jeňa vrátil ze třítýdenní cesty po USA a v kufru přivezl dvacet sáčků. Vozili jsme je pak na každý náš softbalový zápas. Představte si partu kluků, hru, smích a tenhle legendární snack. Byla to skvělá atmosféra. A tehdy nám to došlo – proč tenhle zážitek nepřinést k nám domů?',
  },
  {
    num: '02',
    label: 'Kdo jsme',
    text: 'Za projektem Bases stojíme my dva – Vojta a Jeňa. Jsme dlouholetí kamarádi, které před lety spojil právě softbal a láska ke sportu. Bases pro nás není jen obyčejný e-shop. Je to odraz toho, co máme rádi – komunity, hry a chuti bez kompromisů.',
  },
  {
    num: '03',
    label: 'Značky',
    text: 'V Americe jsou semínka fenomén. Najdete je na každé benzínce a žvýká je snad každý hráč MLB. Proto dovážíme značky DAVID a BIGS – absolutní americké ikony. K tomu jsme chtěli přidat i evropskou preciznost a objevili značku Seedos, která se americkým velikánům hrdě vyrovná.',
  },
  {
    num: '04',
    label: 'Naše vize',
    text: 'Náš cíl je jasný. Chceme tento fenomén v Česku znormalizovat. Zpřístupnit ho tak, aby mohl každý ochutnat pravou Ameriku a zažít tu stejnou pohodu, jakou jsme u těch prvních dvaceti sáčků zažili my.',
  },
]

/* ─────────────────────────────────────────────
   Story block — focus efekt přes useInView
───────────────────────────────────────────── */
function StoryBlock({ num, label, text }: { num: string; label: string; text: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isActive = useInView(ref, { margin: '-30% 0px -30% 0px' })

  return (
    <motion.div
      ref={ref}
      className="min-h-[70vh] flex flex-col justify-center py-8"
      animate={{
        opacity: isActive ? 1 : 0.22,
        scale:   isActive ? 1  : 0.96,
      }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* 4. Oddělovač kapitoly */}
      <div
        className="mb-8 h-px w-20"
        style={{
          background: 'linear-gradient(to right, rgba(199,160,75,0.22), rgba(199,160,75,0.06))',
        }}
      />

      {/* Hlavička: číslo + animovaná čára + label */}
      <div className="flex items-center mb-8">
        <motion.span
          className="text-[10px] uppercase tracking-[0.55em] flex-shrink-0"
          style={{ fontFamily: 'var(--font-montserrat)' }}
          animate={{ color: isActive ? '#c7a04b' : 'rgba(199,160,75,0.3)' }}
          transition={{ duration: 0.45 }}
        >
          {num}
        </motion.span>

        <motion.div
          className="mx-4 h-px flex-shrink-0"
          style={{ background: '#c7a04b' }}
          animate={{ width: isActive ? 44 : 0, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.span
          className="text-[10px] uppercase tracking-[0.35em]"
          style={{ fontFamily: 'var(--font-montserrat)' }}
          animate={{ color: isActive ? 'rgba(199,160,75,0.75)' : 'rgba(199,160,75,0.2)' }}
          transition={{ duration: 0.45 }}
        >
          {label}
        </motion.span>
      </div>

      {/* Tělo textu */}
      <motion.p
        className="text-base font-light leading-[1.95] max-w-lg"
        style={{ fontFamily: 'var(--font-montserrat)' }}
        animate={{ color: isActive ? 'rgba(255,255,255,0.78)' : 'rgba(255,255,255,0.35)' }}
        transition={{ duration: 0.55 }}
      >
        {text}
      </motion.p>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Stagger varianty pro hero nadpis
───────────────────────────────────────────── */
const containerVariants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
}
const lineVariants = {
  hidden:   { opacity: 0, y: 44 },
  visible:  { opacity: 1, y:  0, transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function ONasPage() {
  const sectionRef = useRef<HTMLElement>(null)

  // Parallax: mapuje průchod sekce na vertikální posuv obrázku
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ═══════════════════════════════════════
          STICKY SPLIT-SCREEN
          Levý sloupec scrolluje, pravý (fotka) je sticky
      ═══════════════════════════════════════ */}
      <section
        ref={sectionRef}
        className="relative px-8 lg:px-24 max-w-6xl mx-auto pb-40"
      >

        {/* CSS: bg-clip-text pro gradient na písmu */}
        <style>{`
          .gold-text {
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
          }
        `}</style>

        {/* Zlatá aura */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '700px',
            height: '420px',
            left: '-120px',
            top: '180px',
            background: 'radial-gradient(ellipse at 40% 50%, rgba(218,165,32,0.18) 0%, rgba(184,134,11,0.07) 40%, transparent 68%)',
            filter: 'blur(90px)',
            zIndex: 0,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.2, ease: 'easeOut', delay: 0.5 }}
        />

        {/* Grid: items-start je kritické pro sticky */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* ── Levý sloupec: hero text + story bloky ── */}
          <div>

            {/* Hero text */}
            <div className="pt-32 pb-16">

              <motion.p
                className="text-[10px] uppercase tracking-[0.55em] mb-5 text-[#c7a04b]/45"
                style={{ fontFamily: 'var(--font-montserrat)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              >
                — Náš příběh
              </motion.p>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ fontFamily: 'var(--font-exo2)' }}
              >
                {['Více než', 'jen snack.'].map((line, i) => (
                  <div key={i} className="overflow-hidden">
                    <motion.h1
                      variants={lineVariants}
                      className="gold-text text-4xl md:text-5xl lg:text-6xl font-light uppercase
                                 tracking-[0.05em] leading-tight m-0 block
                                 bg-gradient-to-r from-[#b8903e] via-[#e8d4a0] to-[#b8903e] bg-clip-text text-transparent"
                    >
                      {line}
                    </motion.h1>
                  </div>
                ))}
              </motion.div>

              {/* 1. Perex — italic, větší, tlumená zlatá */}
              <motion.p
                className="mt-10 text-xl font-light italic leading-relaxed text-white/70 max-w-xs"
                style={{ fontFamily: 'var(--font-montserrat)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y:  0 }}
                transition={{ delay: 1.0, duration: 0.8, ease: 'easeOut' }}
              >
                Začalo to vášní pro hru a jedním kufrem z Ameriky.
              </motion.p>

              {/* 2. Svislá dekorativní linka — vede oko dolů ke kapitolám */}
              <motion.div
                className="mt-10 mb-2 w-px self-start ml-1"
                style={{
                  height: '96px',
                  background: 'linear-gradient(to bottom, rgba(199,160,75,0.35), rgba(199,160,75,0))',
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            {/* Story bloky */}
            {STORY.map(block => (
              <StoryBlock key={block.num} {...block} />
            ))}
          </div>

          {/* ── Pravý sloupec: sticky fotka ── */}
          <motion.div
            className="sticky top-[10vh] self-start flex flex-col items-center pt-32"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative overflow-hidden group w-full max-w-xl mx-auto"
              style={{ boxShadow: '0 0 60px rgba(0,0,0,0.55)' }}
            >
              <motion.div style={{ y: imgY }} className="w-full origin-center">
                <Image
                  src="/team.jpg"
                  alt="Vojta a Jeňa — zakladatelé Bases"
                  width={720}
                  height={900}
                  className="w-full h-auto object-cover block
                             grayscale brightness-50 opacity-80
                             group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100
                             group-hover:scale-105
                             transition-all duration-700 ease-out"
                  style={{ maxHeight: '78vh', objectFit: 'cover', transformOrigin: 'center' }}
                />
              </motion.div>

              {/* Spodní fade */}
              <div
                className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.55), transparent)' }}
              />
            </div>

            <p
              className="mt-4 text-[9px] uppercase text-[#c7a04b]/60 w-full text-right"
              style={{ fontFamily: 'var(--font-montserrat)', letterSpacing: '0.25em' }}
            >
              Vojta &amp; Jeňa — Bases
            </p>
          </motion.div>

        </div>
      </section>

    </main>
  )
}
