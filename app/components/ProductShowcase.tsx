'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const PRODUCTS = [
  {
    src:  '/products/david/barbecue/front.png.png',
    alt:  'David Barbecue',
    name: 'DAVID',
    sub:  'Barbecue',
    href: '/slunecnicova-seminka/david?product=barbecue',
  },
  {
    src:  '/products/bigs/front.png.png',
    alt:  'BIGS Dill Pickle',
    name: 'BIGS',
    sub:  'Dill Pickle',
    href: '/slunecnicova-seminka/bigs?product=dill-pickle',
  },
  {
    src:  '/products/david/cracked-pepper/front.png.png',
    alt:  'David Cracked Pepper',
    name: 'DAVID',
    sub:  'Cracked Pepper',
    href: '/slunecnicova-seminka/david?product=cracked-pepper',
  },
]

export default function ProductShowcase() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  const carouselRef  = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleCarouselScroll = () => {
    const el = carouselRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    setActiveIdx(idx)
  }

  return (
    <section
      ref={ref}
      className="relative z-10 flex flex-col items-center justify-center pt-6 pb-20 px-6
                 md:min-h-screen md:pt-28 md:pb-40"
    >
      {/* Nadpis */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease }}
        className="text-center font-normal mt-6 mb-8 md:mt-32 md:mb-16"
        style={{
          fontFamily:    'var(--font-playfair)',
          fontSize:      '1.45rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          fontStyle:     'italic',
          color:         '#c7a04b',
        }}
      >
        Vybraná nabídka
      </motion.p>

      {/* Card Grid — mobil: snap carousel, desktop: grid */}
      <div
        ref={carouselRef}
        onScroll={handleCarouselScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-5 pb-4 no-scrollbar w-full
                   md:grid md:grid-cols-3 md:gap-8 md:max-w-6xl md:mx-auto md:overflow-visible md:px-0 md:pb-0"
      >
        {PRODUCTS.map((p, i) => (
          <motion.div
            key={`${p.name}-${p.sub}`}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 + i * 0.13, ease }}
            className="min-w-[75vw] snap-center md:min-w-0 md:snap-align-none flex-shrink-0 md:flex-shrink"
          >
            <Link href={p.href} className="no-underline group">
              <div
                className="flex flex-col items-center justify-between p-8 rounded-2xl h-[370px] md:h-[450px]
                           overflow-hidden
                           transition-all duration-500 cursor-pointer
                           bg-transparent border-transparent
                           md:overflow-visible"
              >
                {/* Obrázek — statický na mobilu, hover efekt jen na desktopu */}
                <div className="flex-1 w-full flex items-center justify-center overflow-hidden md:overflow-visible">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={240}
                    height={300}
                    className="max-h-full max-w-full object-contain
                               scale-[1.12] md:scale-100
                               transition-all duration-500
                               md:group-hover:scale-110
                               md:group-hover:-translate-y-4
                               md:group-hover:drop-shadow-[0_30px_30px_rgba(0,0,0,0.8)]"
                    style={{ filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.5))' }}
                  />
                </div>

                {/* Texty — přikované ke spodní hraně karty */}
                <div className="flex flex-col items-center text-center mt-auto pt-10 w-full">
                  <span
                    className="uppercase font-semibold text-xs tracking-[0.3em]
                               transition-colors duration-500
                               text-[#c7a04b] md:text-white/[0.92]
                               group-hover:text-[#c7a04b]"
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                  >
                    {p.name}
                  </span>
                  <span
                    className="text-sm font-light tracking-wider mt-1
                               text-white/75 md:text-gray-400/[0.9]"
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                  >
                    {p.sub}
                  </span>
                </div>

              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Dots — pouze mobil */}
      <div className="flex md:hidden justify-center items-center gap-2 mt-4 mb-2">
        {PRODUCTS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              carouselRef.current?.scrollTo({ left: idx * carouselRef.current.clientWidth, behavior: 'smooth' })
              setActiveIdx(idx)
            }}
            style={{
              width:        activeIdx === idx ? 22 : 7,
              height:       7,
              borderRadius: 9999,
              background:   activeIdx === idx ? '#c7a04b' : 'rgba(255,255,255,0.22)',
              boxShadow:    activeIdx === idx ? '0 0 8px rgba(199,160,75,0.55)' : 'none',
              border:       'none',
              padding:      0,
              cursor:       'pointer',
              transition:   'all 300ms ease',
            }}
          />
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.65, ease }}
        className="flex justify-center mt-6 mb-6 md:mt-20 md:mb-20"
      >
        <Link
          href="/slunecnicova-seminka"
          onClick={(e) => {
            if (isMobile) {
              e.preventDefault()
              window.dispatchEvent(new CustomEvent('openBrandsMenu'))
            }
          }}
          className="inline-flex items-center gap-3 no-underline uppercase"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.8rem',
            letterSpacing: '0.35em',
            color: '#c7a04b',
            textDecoration: 'underline',
            textDecorationColor: 'rgba(199,160,75,0.65)',
            textDecorationThickness: '1px',
            textUnderlineOffset: '8px',
          }}
        >
          Zobrazit vše &nbsp;→
        </Link>
      </motion.div>

    </section>
  )
}
