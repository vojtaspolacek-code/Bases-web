'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import { useRef, useCallback } from 'react'

/* ─── Levitation keyframes injected once ─── */
const FLOAT_CSS = `
@keyframes float-a {
  0%, 100% { transform: translateY(0px); }
  45%       { transform: translateY(-5px); }
  70%       { transform: translateY(-3px); }
}
@keyframes float-b {
  0%, 100% { transform: translateY(0px); }
  38%       { transform: translateY(-4px); }
  62%       { transform: translateY(-6px); }
}
@keyframes float-c {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-4.5px); }
  75%       { transform: translateY(-2px); }
}
`

/* ─── Produktová data ─── */
const FEATURED = [
  {
    slug:    'taco',
    name:    'Taco',
    brand:   'Seedos',
    label:   'Kořeněná taco chuť s výrazným charakterem.',
    desc:    'Paprika, česnek a lehká pálivost v jednom křupavém snacku. 🌶️',
    price:   '59 Kč',
    img:     '/products/seedos/taco/front.png.png',
    href:    '/slunecnicova-seminka/seedos?product=taco',
    hero:    false,
    floatAnim: 'float-a',
    floatDur:  '7.2s',
  },
  {
    slug:    'barbecue',
    name:    'Barbecue',
    brand:   'David',
    label:   'Kouřová klasika v americkém stylu.',
    desc:    'Intenzivní kouřové aroma a nekompromisní křupavost amerického barbecue. 🔥',
    price:   '169 Kč',
    img:     '/products/david/barbecue/front.png.png',
    href:    '/slunecnicova-seminka/david?product=barbecue',
    hero:    true,
    floatAnim: 'float-b',
    floatDur:  '6.4s',
  },
  {
    slug:    'dill-pickle',
    name:    'Dill Pickle',
    brand:   'Bigs',
    label:   'Svěží chuť s výrazným profilem.',
    desc:    'Americká rarita s návykovou kyselostí a dvojitě praženou texturou. 🥒',
    price:   '179 Kč',
    img:     '/products/bigs/front.png.png',
    href:    '/slunecnicova-seminka/bigs?product=dill-pickle',
    hero:    false,
    floatAnim: 'float-c',
    floatDur:  '8.1s',
  },
]

/* Staggered fan reveal — middle first, sides open outward */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0,   /* we manage delay per item manually */
    },
  },
}

function cardVariants(index: number) {
  /* index 0 = left, 1 = center, 2 = right */
  const isCenter = index === 1
  const isLeft   = index === 0
  return {
    hidden: {
      opacity: 0,
      y:       isCenter ? 32 : 52,
      x:       isLeft ? 28 : (index === 2 ? -28 : 0),
      scale:   isCenter ? 0.95 : 0.93,
    },
    visible: {
      opacity: 1,
      y:       0,
      x:       0,
      scale:   1,
      transition: {
        duration: isCenter ? 0.82 : 0.9,
        delay:    isCenter ? 0.08 : 0.26,
        ease:     [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  }
}

/* ─── Jedna produktová karta ─── */
function ProductCard({
  product,
  index,
  inView,
}: {
  product: (typeof FEATURED)[0]
  index:   number
  inView:  boolean
}) {
  const { hero } = product
  const cardRef = useRef<HTMLDivElement>(null)
  const router  = useRouter()

  /* Spotlight mouse tracking */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width)  * 100
    const y = ((e.clientY - rect.top)  / rect.height) * 100
    card.style.setProperty('--sx', `${x}%`)
    card.style.setProperty('--sy', `${y}%`)
    card.style.setProperty('--spotlight', '1')
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--spotlight', '0')
  }, [])

  const variants = cardVariants(index)

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      whileHover={{ y: -8, transition: { duration: 0.35, ease: 'easeOut' } }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => router.push(product.href)}
      className="group relative flex flex-col cursor-pointer"
      style={{
        marginTop:  hero ? '-24px' : '0px',
        background: hero
          ? 'linear-gradient(160deg, rgba(15,13,10,1) 0%, rgba(10,9,7,1) 100%)'
          : '#0a0a0a',
        border:     `1px solid ${hero ? 'rgba(199,160,75,0.22)' : 'rgba(199,160,75,0.10)'}`,
        boxShadow:  hero
          ? 'inset 0 0 60px rgba(199,160,75,0.04), inset 0 1px 0 rgba(199,160,75,0.10), 0 24px 60px rgba(0,0,0,0.6)'
          : 'inset 0 0 30px rgba(199,160,75,0.02), inset 0 1px 0 rgba(199,160,75,0.06), 0 16px 40px rgba(0,0,0,0.45)',
        transition: 'box-shadow 0.45s ease, border-color 0.45s ease',
        /* CSS vars for spotlight */
        ['--sx' as string]: '50%',
        ['--sy' as string]: '50%',
        ['--spotlight' as string]: '0',
      }}
    >
      {/* Celá karta klikatelná */}
      <Link href={product.href} className="absolute inset-0 z-10 no-underline" aria-label={`Detail: ${product.brand} ${product.name}`} />

      {/* Spotlight overlay — golden radial gradient follows cursor */}
      <div
        className="absolute inset-0 pointer-events-none z-[5] transition-opacity duration-300 rounded-none"
        style={{
          background: 'radial-gradient(circle 200px at var(--sx) var(--sy), rgba(199,160,75,0.07) 0%, transparent 70%)',
          opacity: 'var(--spotlight)',
        }}
      />

      {/* Zlatý ambient glow za prostřední kartou */}
      {hero && (
        <div
          className="absolute -inset-10 pointer-events-none -z-10"
          style={{
            background:
              'radial-gradient(ellipse at 50% 42%, rgba(199,160,75,0.12) 0%, rgba(199,160,75,0.04) 45%, transparent 68%)',
            filter: 'blur(32px)',
          }}
        />
      )}

      {/* Hover border overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0
                   group-hover:opacity-100 transition-opacity duration-500"
        style={{
          border: `1px solid ${hero ? 'rgba(199,160,75,0.38)' : 'rgba(199,160,75,0.22)'}`,
          boxShadow: hero ? '0 0 40px rgba(199,160,75,0.06)' : '0 0 24px rgba(199,160,75,0.04)',
        }}
      />

      {/* ── Obrazová část ── */}
      <div
        className="relative flex items-center justify-center overflow-visible"
        style={{ padding: hero ? '56px 44px 40px' : '48px 38px 32px' }}
      >
        {/* Ambient light pod produktem */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500
                     opacity-30 group-hover:opacity-80"
          style={{
            background:
              'radial-gradient(ellipse at 50% 72%, rgba(199,160,75,0.09) 0%, transparent 62%)',
          }}
        />

        {/* Zlatý glow za packshot — vitrínovský efekt */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(199,160,75,0.07) 0%, transparent 70%)',
            filter: 'blur(18px)',
          }}
        />

        {/* Drop-shadow "na podlahu" */}
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: hero ? '62%' : '58%',
            height: '14px',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.7) 0%, transparent 72%)',
            filter: 'blur(10px)',
          }}
        />

        {/* Levitating packshot wrapper */}
        <div
          style={{
            animation: `${product.floatAnim} ${product.floatDur} ease-in-out infinite`,
          }}
          className="group-hover:[animation-play-state:paused] relative z-10 w-full flex items-center justify-center"
        >
          <Image
            src={product.img}
            alt={`${product.brand} ${product.name}`}
            width={300}
            height={300}
            className="object-contain transition-transform duration-500 ease-out
                       group-hover:-translate-y-2"
            style={{ height: '220px', width: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Oddělovač foto / text */}
      <div
        className="mx-7 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${hero ? 'rgba(199,160,75,0.22)' : 'rgba(199,160,75,0.12)'}, transparent)`,
        }}
      />

      {/* ── Textová část ── */}
      <div
        className="flex flex-col flex-1 px-7 pt-6"
        style={{ paddingBottom: hero ? '28px' : '24px' }}
      >

        {/* Brand */}
        <p
          className="text-[8px] uppercase tracking-[0.6em] mb-3"
          style={{
            fontFamily: 'var(--font-montserrat)',
            color: hero ? 'rgba(199,160,75,0.6)' : 'rgba(199,160,75,0.38)',
          }}
        >
          {product.brand}
        </p>

        {/* Název */}
        <h3
          className="uppercase mb-3"
          style={{
            fontFamily:    'var(--font-exo2)',
            fontSize:      hero ? '1.35rem' : '1.15rem',
            fontWeight:    300,
            letterSpacing: '0.16em',
            color:         'rgba(255,255,255,0.95)',
            lineHeight:    1.2,
          }}
        >
          {product.name}
        </h3>

        {/* Popisek */}
        <p
          className="font-light leading-relaxed mb-7"
          style={{
            fontFamily:    'var(--font-montserrat)',
            fontSize:      '11px',
            letterSpacing: '0.01em',
            color: hero ? 'rgba(255,255,255,0.50)' : 'rgba(255,255,255,0.38)',
            lineHeight:    1.7,
          }}
        >
          {product.desc}
        </p>

        {/* Cena + Detail */}
        <div className="flex items-center justify-between mt-auto">

          <span
            style={{
              fontFamily:    'var(--font-montserrat)',
              fontSize:      '15px',
              fontWeight:    400,
              color:         hero ? 'rgba(199,160,75,1)' : 'rgba(199,160,75,0.88)',
              letterSpacing: '0.03em',
            }}
          >
            {product.price}
          </span>

          {/* Detail — skrytý, odhaluje se na hover */}
          <Link
            href={product.href}
            className="relative z-20 no-underline transition-all duration-300
                       opacity-0 group-hover:opacity-100"
            style={{
              fontFamily:    'var(--font-montserrat)',
              fontSize:      '8px',
              letterSpacing: '0.36em',
              textTransform: 'uppercase',
              color:         'rgba(255,255,255,0.40)',
            }}
          >
            <span className="group-hover:text-[#c7a04b]/80 transition-colors duration-300">
              Detail
            </span>
            <span
              className="absolute -bottom-0.5 left-0 h-px w-full
                         bg-[#c7a04b]/0 group-hover:bg-[#c7a04b]/40
                         transition-all duration-400"
            />
          </Link>

        </div>
      </div>
    </motion.div>
  )
}

/* ─── Hlavní sekce ─── */
export default function SignatureSelection() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })

  return (
    <section
      id="produkty"
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Inject float keyframes */}
      <style>{FLOAT_CSS}</style>

      <div className="relative max-w-5xl mx-auto px-6 lg:px-16 py-24">

        {/* ── Hlavička sekce ── */}
        <div className="text-center mb-12">

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="text-[9px] uppercase tracking-[0.6em] mb-4"
            style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(199,160,75,0.45)' }}
          >
            Výběr produktů
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-light text-white/88 mb-5"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            Vybraná Nabídka
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-16 h-px mx-auto mb-6 origin-center"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(199,160,75,0.8), transparent)',
            }}
          />

        </div>

        {/* ── Grid karet ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-start">
          {FEATURED.map((product, i) => (
            <ProductCard key={product.slug} product={product} index={i} inView={inView} />
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.75, ease: 'easeOut' }}
          className="flex flex-col items-center mt-14 gap-8"
        >
          <Link
            href="/slunecnicova-seminka"
            className="group/cta inline-flex items-center gap-3 no-underline
                       px-10 py-3 transition-all duration-300"
            style={{
              fontFamily:   'var(--font-montserrat)',
              borderRadius: '9999px',
              border:       '1px solid rgba(199,160,75,0.5)',
              background:   'transparent',
              boxShadow:    '0 0 0px rgba(199,160,75,0)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.boxShadow    = '0 0 20px rgba(199,160,75,0.2)'
              el.style.borderColor  = 'rgba(199,160,75,0.9)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.boxShadow    = '0 0 0px rgba(199,160,75,0)'
              el.style.borderColor  = 'rgba(199,160,75,0.5)'
            }}
          >
            <span
              className="text-xs uppercase text-[#c7a04b]"
              style={{ letterSpacing: '0.2em' }}
            >
              Zobrazit katalog
            </span>
            <span
              className="text-[#c7a04b] text-sm transition-transform duration-300 ease-out
                         group-hover/cta:translate-x-[5px]"
            >
              →
            </span>
          </Link>

          <div
            className="w-40 h-px"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(199,160,75,0.22), transparent)',
            }}
          />
        </motion.div>

      </div>
    </section>
  )
}
