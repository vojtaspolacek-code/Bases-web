'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const BRANDS = [
  { name: 'SEEDOS', slug: 'seedos', sub: 'Klasická volba',    img: '/products/seedos/flamin-blue/front.png.png' },
  { name: 'DAVID',  slug: 'david',  sub: 'Americký originál', img: '/products/david/barbecue/front.png.png' },
  { name: 'BIGS',   slug: 'bigs',   sub: 'Prémiová edice',    img: '/products/bigs/front.png.png' },
]

export default function SlunecnicovaSeminka() {
  const [hovered,  setHovered]  = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const footer = document.querySelector('footer') as HTMLElement | null
    if (footer) footer.style.display = 'none'
    document.body.style.overflow = 'hidden'
    return () => {
      if (footer) footer.style.display = ''
      document.body.style.overflow = ''
    }
  }, [])

  if (isMobile) return (
    <main style={{ background: '#080808', minHeight: '100vh', color: '#fff' }}>
      <div style={{ paddingTop: '5.5rem', paddingLeft: '2rem', paddingRight: '2rem' }}>

        {/* Zpět */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-montserrat)',
            fontSize: '13px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            textDecoration: 'none',
            marginBottom: '2.5rem',
          }}
        >
          ‹ Zpět
        </Link>

        {/* Značky */}
        {BRANDS.map((brand) => (
          <Link
            key={brand.slug}
            href={`/slunecnicova-seminka/${brand.slug}`}
            style={{
              display: 'block',
              textDecoration: 'none',
              marginBottom: '2rem',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-exo2)',
              fontSize: 'clamp(1.8rem, 7vw, 2.2rem)',
              fontWeight: 300,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.92)',
            }}>
              {brand.name}
            </div>
            <div style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(199,160,75,0.6)',
              marginTop: '0.3rem',
            }}>
              {brand.sub}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )

  return (
    /*
      Desktop: h-screen overflow-hidden grid-cols-3 — tři sloupce přes celou obrazovku
    */
    <main className="w-full bg-black grid grid-cols-1
                     min-h-screen pt-24
                     md:h-screen md:grid-cols-3 md:pt-0 md:overflow-hidden">

      {BRANDS.map((brand, i) => {
        const isHovered = !isMobile && hovered === i
        const isDimmed  = !isMobile && hovered !== null && !isHovered

        return (
          <Link
            key={brand.slug}
            href={`/slunecnicova-seminka/${brand.slug}`}
            onMouseEnter={() => { if (!isMobile) setHovered(i)    }}
            onMouseLeave={() => { if (!isMobile) setHovered(null) }}
            className="relative flex flex-col items-center justify-center
                       no-underline overflow-hidden cursor-pointer
                       min-h-[33vh] md:min-h-0
                       transition-all duration-500 ease-out"
            style={{ opacity: isDimmed ? 0.2 : 1 }}
          >

            {isMobile && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Image
                  src={brand.img}
                  alt={brand.name}
                  fill
                  className="object-contain opacity-15"
                  sizes="100vw"
                />
              </div>
            )}

            {/* Zlatá linka dole — jen na desktopu při hoveru */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px transition-all duration-500 ease-out"
              style={{
                background: 'linear-gradient(to right, transparent, #D4AF37, transparent)',
                width: isHovered ? '60%' : '0%',
              }}
            />

            {/* Název značky */}
            <span
              className="relative z-10 font-thin uppercase select-none
                         transition-all duration-500 ease-out
                         drop-shadow-[0_0_22px_rgba(212,175,55,0.65)]
                         md:drop-shadow-none"
              style={{
                fontFamily:    'var(--font-exo2)',
                fontSize:      'clamp(2.5rem, 5vw, 6.5rem)',
                letterSpacing: '0.15em',
                transform:     isHovered ? 'scale(1.10)' : 'scale(1)',

                /* Mobil: trvale světlý text + glow (přes inline drop-shadow výše) */
                /* Desktop hover: zlatý gradient + filtr glow                      */
                /* Desktop idle: tmavý text                                        */
                ...(isMobile
                  ? { color: 'rgba(255,255,255,0.92)' }
                  : isHovered
                  ? {
                      background:           'linear-gradient(to right, #c7a04b, #e2c784, #c7a04b)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor:  'transparent',
                      backgroundClip:       'text',
                      filter:               'drop-shadow(0 0 35px rgba(212,175,55,0.7))',
                    }
                  : {
                      color:  'rgba(255,255,255,0.45)',
                      filter: 'none',
                    }),
              }}
            >
              {brand.name}
            </span>

            {/* Podtitulek — na mobilu trvale viditelný */}
            <span
              className="relative z-10 font-light uppercase tracking-[0.3em] mt-4
                         transition-all duration-500 ease-out"
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize:   '0.6rem',
                color:      '#c7a04b',
                opacity:    isMobile ? 0.65 : (isHovered ? 0.8 : 0),
                transform:  (isMobile || isHovered) ? 'translateY(0)' : 'translateY(6px)',
              }}
            >
              {brand.sub}
            </span>

          </Link>
        )
      })}
    </main>
  )
}
