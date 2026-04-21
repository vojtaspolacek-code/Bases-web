'use client'

import { useState } from 'react'
import Link from 'next/link'

const BRANDS = [
  { name: 'SEEDOS', slug: 'seedos', sub: 'Klasická volba'    },
  { name: 'DAVID',  slug: 'david',  sub: 'Americký originál' },
  { name: 'BIGS',   slug: 'bigs',   sub: 'Prémiová edice'    },
]

export default function SlunecnicovaSeminka() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <main className="h-screen w-full bg-black grid grid-cols-1 md:grid-cols-3 overflow-hidden">
      {BRANDS.map((brand, i) => {
        const isHovered = hovered === i
        const isDimmed  = hovered !== null && !isHovered

        return (
          <Link
            key={brand.slug}
            href={`/slunecnicova-seminka/${brand.slug}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="relative flex flex-col items-center justify-center
                       no-underline overflow-hidden cursor-pointer
                       transition-all duration-500 ease-out"
            style={{ opacity: isDimmed ? 0.2 : 1 }}
          >

            {/* Zlatá linka dole */}
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
                         transition-all duration-500 ease-out"
              style={{
                fontFamily: 'var(--font-exo2)',
                fontSize: 'clamp(2.5rem, 5vw, 6.5rem)',
                letterSpacing: '0.15em',
                transform: isHovered ? 'scale(1.10)' : 'scale(1)',
                ...(isHovered
                  ? {
                      background: 'linear-gradient(to right, #c7a04b, #e2c784, #c7a04b)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 0 35px rgba(212,175,55,0.7))',
                    }
                  : {
                      color: 'rgba(255,255,255,0.45)',
                      filter: 'none',
                    }),
              }}
            >
              {brand.name}
            </span>

            {/* Podtitulek */}
            <span
              className="relative z-10 font-light uppercase tracking-[0.3em] mt-4
                         transition-all duration-500 ease-out"
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.6rem',
                color: '#c7a04b',
                opacity: isHovered ? 0.8 : 0,
                transform: isHovered ? 'translateY(0)' : 'translateY(6px)',
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
