'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const GOLD = '#c7a04b'
const ease: [number,number,number,number] = [0.22,1,0.36,1]

const TIMELINE = [
  { id:'01', side:'left' as const, label:'PRVNÍ IMPULS', body:'Všechno to začalo o prázdninách roku 2025. Zlom přišel, když se Jeňa vrátil z USA s dvaceti sáčky v kufru. Vozili jsme je na každý softbalový zápas — partu kluků, hru, smích a tenhle legendární snack. Tehdy nám to došlo.' },
  { id:'02', side:'right' as const, label:'KDO JSME', body:'Za Bases stojíme my dva – Vojta a Jeňa. Dlouholetí kamarádi spojení softbalem a láskou ke sportu. Bases pro nás není jen e-shop. Je to odraz toho, co máme rádi.' },
  { id:'03', side:'left' as const, label:'ZNAČKY', body:'Dovážíme DAVID a BIGS – absolutní americké ikony, které najdete na každé benzínce a žvýká je snad každý hráč MLB. A k nim Seedos, evropskou preciznost, která se americkým velikánům hrdě vyrovná.' },
  { id:'04', side:'right' as const, label:'NAŠE VIZE', body:'Chceme tento fenomén v Česku znormalizovat. Zpřístupnit pravou Ameriku každému, kdo chce zažít tu stejnou pohodu, jakou jsme u těch prvních dvaceti sáčků zažili my.' },
]

function Card({ entry, delay=0, isMobile=false }: { entry: typeof TIMELINE[number]; delay?: number; isMobile?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  if (isMobile) {
    return (
      <motion.div ref={ref} initial={{ opacity:0, y:30 }} animate={inView ? { opacity:1, y:0 } : {}}
        transition={{ duration:0.8, delay, ease }} className="relative w-full py-12 px-6 overflow-hidden">

        {/* Velké vodoznakové číslo do pozadí */}
        <span aria-hidden className="absolute pointer-events-none select-none"
          style={{
            top: '0rem',
            left: '-1rem',
            fontFamily: 'var(--font-exo2)',
            fontWeight: 700,
            fontSize: '8rem',
            lineHeight: 0.8,
            letterSpacing: '-0.04em',
            color: GOLD,
            opacity: 0.04,
            zIndex: 0,
          }}>
          {entry.id}
        </span>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            {/* Jemná zlatá linka místo borderu */}
            <div className="w-8 h-[1px]" style={{ backgroundColor: GOLD, opacity: 0.6 }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em]"
              style={{ fontFamily: 'var(--font-montserrat)', color: GOLD }}>
              {entry.label}
            </p>
          </div>

          <p className="text-[15px] font-light leading-[1.8] pl-2"
            style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.75)' }}>
            {entry.body}
          </p>
        </div>
      </motion.div>
    )
  }

  // Desktop karta — glassmorphism
  return (
    <motion.div ref={ref} initial={{ opacity:0, y:28 }} animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.8, delay, ease }} className="w-full max-w-[420px] p-8 lg:p-10"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(199,160,75,0.15)',
        borderRadius: '2px',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 0 40px rgba(199,160,75,0.04), inset 0 0 0 1px rgba(255,255,255,0.03)',
      }}>
      <div style={{ width:'20px', height:'1px', background:GOLD, opacity:0.7, marginBottom:'1rem' }} />
      <p className="text-[10px] font-medium uppercase mb-5"
        style={{ fontFamily:'var(--font-montserrat)', letterSpacing:'0.44em', color:GOLD }}>
        {entry.label}
      </p>
      <p className="text-sm font-light leading-[1.9]"
        style={{ fontFamily:'var(--font-montserrat)', color:'rgba(255,255,255,0.62)' }}>
        {entry.body}
      </p>
    </motion.div>
  )
}

export default function Onas() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <main className="bg-[#080808] min-h-screen text-white overflow-x-hidden">

      {/* ── HERO SEKCE ── */}
      <section className="relative h-[100svh] min-h-[600px] flex overflow-hidden">
        <div className="absolute inset-0 md:left-[48%]">
          <Image src="/team.jpg" alt="Vojta a Jeňa" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 md:hidden" style={{ background:'rgba(8,8,8,0.58)' }} />
          <div className="hidden md:block absolute inset-0" style={{ background:'linear-gradient(to right, #080808 0%, rgba(8,8,8,0.55) 30%, transparent 60%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-56" style={{ background:'linear-gradient(to top, #080808, transparent)' }} />
        </div>
        <div className="relative z-10 flex items-center w-full md:w-[52%] px-8 md:pl-[clamp(3rem,7vw,9rem)] md:pr-0">
          <div>
            <motion.p initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.3 }}
              className="text-[11px] font-medium uppercase mb-10 md:mb-14"
              style={{ fontFamily:'var(--font-montserrat)', letterSpacing:'0.45em', color:GOLD }}>
              — NÁŠ PŘÍBĚH
            </motion.p>
            <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.9, delay:0.45, ease }}
              className="font-thin italic leading-[1.08] mb-8 md:mb-10"
              style={{ fontFamily:'var(--font-playfair)', color:'rgba(250,246,238,0.96)', maxWidth:'480px', fontSize: isMobile ? 'clamp(2.2rem,9vw,3rem)' : 'clamp(2.6rem,3.8vw,4.4rem)' }}>
              Začalo to vášní<br />pro hru a jedním<br />
              <span style={{ opacity:0.4, fontStyle:'normal', fontWeight:300 }}>kufrem z Ameriky.</span>
            </motion.h1>
            <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:0.85, delay:0.9, ease }}
              className="w-14 h-px origin-left mb-8"
              style={{ background:`linear-gradient(to right, ${GOLD}, transparent)` }} />
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6, delay:1.05 }}
              className="text-[11px] uppercase tracking-[0.35em]"
              style={{ fontFamily:'var(--font-montserrat)', color:'rgba(199,160,75,0.90)', fontSize:'13px', letterSpacing:'0.4em' }}>
              VOJTA &amp; JEŇA
            </motion.p>
          </div>
          <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden flex flex-col items-center gap-1"
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5, duration:0.6 }}>
            <span className="text-[9px] uppercase tracking-[0.3em]"
              style={{ fontFamily:'var(--font-montserrat)', color:'rgba(199,160,75,0.5)' }}>Scroll</span>
            <motion.div animate={{ y:[0,6,0] }} transition={{ duration:1.4, repeat:Infinity, ease:'easeInOut' }}
              style={{ color:'rgba(199,160,75,0.5)', fontSize:'1rem' }}>↓</motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── TIMELINE SEKCE ── */}
      <section className="relative py-16 md:py-[clamp(6rem,12vw,14rem)]">
        {!isMobile && (
          <div aria-hidden className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 pointer-events-none"
            style={{ background:'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.10) 8%, rgba(255,255,255,0.10) 92%, transparent 100%)' }} />
        )}

        <div className={`mx-auto ${isMobile ? 'px-0' : 'max-w-[1100px] px-5 md:px-[clamp(1.5rem,4vw,3rem)]'}`}>
          {TIMELINE.map((entry, i) => {
            const isLeft = entry.side === 'left'
            const isLast = i === TIMELINE.length - 1

            if (isMobile) return (
              <div key={entry.id} className="w-full"
                style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.03)' }}>
                <Card entry={entry} delay={0.1} isMobile={true} />
              </div>
            )

            return (
              <div key={entry.id} className="relative flex items-center"
                style={{ marginBottom: isLast ? 0 : 'clamp(3rem,5vw,5rem)' }}>
                <span aria-hidden className="absolute pointer-events-none select-none"
                  style={{ top:'50%', transform:'translateY(-50%)', left: isLeft ? '1%' : 'auto', right: isLeft ? 'auto' : '1%', fontFamily:'var(--font-exo2)', fontWeight:700, fontSize:'clamp(11rem,19vw,18rem)', lineHeight:1, letterSpacing:'-0.04em', color:GOLD, opacity:0.10, zIndex:0 }}>
                  {entry.id}
                </span>

                {/* Spojovací linka karta → tečka */}
                {isLeft && (
                  <div aria-hidden className="absolute z-[5] pointer-events-none"
                    style={{ left:'calc(50% - clamp(2.5rem,5vw,5rem))', right:'50%', top:'50%', transform:'translateY(-50%)', height:'1px', background:'linear-gradient(to right, transparent, rgba(199,160,75,0.25))' }} />
                )}
                {!isLeft && (
                  <div aria-hidden className="absolute z-[5] pointer-events-none"
                    style={{ left:'50%', right:'calc(50% - clamp(2.5rem,5vw,5rem))', top:'50%', transform:'translateY(-50%)', height:'1px', background:'linear-gradient(to left, transparent, rgba(199,160,75,0.25))' }} />
                )}

                <motion.div aria-hidden className="absolute left-1/2 -translate-x-1/2 rounded-full z-10"
                  style={{ width:11, height:11, background:GOLD }}
                  animate={{ boxShadow: [
                    '0 0 0 3px rgba(199,160,75,0.15), 0 0 18px 6px rgba(199,160,75,0.2)',
                    '0 0 0 6px rgba(199,160,75,0.05), 0 0 28px 10px rgba(199,160,75,0.35)',
                    '0 0 0 3px rgba(199,160,75,0.15), 0 0 18px 6px rgba(199,160,75,0.2)',
                  ]}}
                  transition={{ duration:2.5, repeat:Infinity, ease:'easeInOut' }} />

                <div className="w-1/2 flex justify-end" style={{ paddingRight:'clamp(2.5rem,5vw,5rem)' }}>
                  {isLeft && <Card entry={entry} delay={0.15} />}
                </div>
                <div className="w-1/2 flex justify-start overflow-hidden" style={{ paddingLeft:'clamp(2.5rem,5vw,5rem)' }}>
                  {!isLeft && <Card entry={entry} delay={0.15} />}
                </div>
              </div>
            )
          })}

          {/* CTA tlačítko — pouze mobil, plná šířka, zlaté pozadí */}
          {isMobile && (
            <div className="mt-16 mb-8 px-6">
              <Link
                href="/slunecnicova-seminka"
                onClick={(e) => {
                  e.preventDefault()
                  window.dispatchEvent(new CustomEvent('openBrandsMenu'))
                }}
                className="w-full flex justify-center items-center gap-3 px-8 py-5 rounded-full uppercase tracking-widest text-[0.75rem] font-semibold no-underline transition-all duration-300"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  color: '#080808',
                  background: GOLD,
                  boxShadow: '0 4px 20px rgba(199,160,75,0.25)',
                }}>
                Prozkoumat kolekci <span className="text-lg">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

    </main>
  )
}
