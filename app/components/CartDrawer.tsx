'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCart } from '../context/CartContext'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
}

export default function CartDrawer() {
  const { isOpen, items, closeCart, increment, decrement } = useCart()
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const router = useRouter()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay — fades in first */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer panel — arrives after overlay */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.06 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-[10001] flex flex-col"
            style={{
              background: 'rgba(8,8,8,0.98)',
              borderLeft: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Staggered content wrapper */}
            <motion.div
              className="flex flex-col h-full"
              variants={stagger}
              initial="hidden"
              animate="show"
            >

              {/* ── Header ── */}
              <motion.div
                variants={fadeUp}
                className="flex items-center justify-between px-8 py-7"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              >
                <h2
                  className="text-base font-light uppercase tracking-[0.3em] m-0"
                  style={{ color: '#c7a04b', fontFamily: 'var(--font-exo2)' }}
                >
                  Košík
                </h2>

                {/* Minimalist circle X */}
                <button
                  onClick={closeCart}
                  className="w-10 h-10 rounded-full flex items-center justify-center
                             transition-colors duration-300 hover:border-[#c7a04b]"
                  style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                  aria-label="Zavřít košík"
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <line x1="1" y1="1" x2="10" y2="10" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                    <line x1="10" y1="1" x2="1" y2="10" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </button>
              </motion.div>

              {/* ── Items ── */}
              <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-7">
                {items.length === 0 ? (
                  <motion.p
                    variants={fadeUp}
                    className="text-white/25 text-xs text-center mt-16 tracking-[0.3em] uppercase"
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                  >
                    Košík je prázdný
                  </motion.p>
                ) : items.map(item => (
                  <motion.div
                    key={item.id}
                    variants={fadeUp}
                    layout
                    exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
                    className="flex items-center gap-5"
                  >
                    {/* Obrázek + glow */}
                    <div className="relative w-[60px] h-[76px] shrink-0 flex items-center justify-center">
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse at center, rgba(199,160,75,0.18) 0%, transparent 68%)' }}
                      />
                      <Image
                        src={item.img}
                        alt={item.name}
                        width={60}
                        height={76}
                        className="object-contain relative z-10 w-full h-full"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] uppercase tracking-[0.4em] text-white/25 mb-1"
                         style={{ fontFamily: 'var(--font-montserrat)' }}>
                        {item.brand}
                      </p>
                      <p className="text-sm font-light text-white/90 tracking-wide truncate"
                         style={{ fontFamily: 'var(--font-montserrat)' }}>
                        {item.name}
                      </p>
                      <p className="text-sm font-medium mt-1"
                         style={{ color: '#c7a04b', fontFamily: 'var(--font-montserrat)' }}>
                        {item.price} Kč
                      </p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => decrement(item.id)}
                        className="w-7 h-7 flex items-center justify-center text-white/40
                                   text-sm transition-all duration-200
                                   hover:text-white hover:border-[#c7a04b]/60"
                        style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm text-white/70"
                            style={{ fontFamily: 'var(--font-montserrat)' }}>
                        {item.qty}
                      </span>
                      <button
                        onClick={() => increment(item.id)}
                        className="w-7 h-7 flex items-center justify-center text-white/40
                                   text-sm transition-all duration-200
                                   hover:text-white hover:border-[#c7a04b]/60"
                        style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                      >
                        +
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ── Checkout footer ── */}
              <motion.div
                variants={fadeUp}
                className="px-8 pb-8 pt-6"
                style={{ borderTop: '1px solid rgba(199,160,75,0.15)' }}
              >
                {/* Celkem */}
                <div className="flex items-baseline justify-between mb-6">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-white/35"
                        style={{ fontFamily: 'var(--font-montserrat)' }}>
                    Celkem
                  </span>
                  <span className="text-2xl font-light tracking-wide"
                        style={{ color: '#c7a04b', fontFamily: 'var(--font-exo2)' }}>
                    {total} Kč
                  </span>
                </div>

                {/* CTA — arrow shifts on hover */}
                <motion.button
                  onClick={() => { closeCart(); router.push('/objednavka') }}
                  className="group w-full py-5 flex items-center justify-center gap-3
                             text-[11px] uppercase tracking-[0.35em] font-bold text-black
                             transition-all duration-300 relative overflow-hidden"
                  style={{ background: '#c7a04b', fontFamily: 'var(--font-montserrat)' }}
                  whileHover={{ filter: 'brightness(1.08)' }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span>Dokončit objednávku</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1 text-base leading-none">
                    →
                  </span>
                </motion.button>

                {/* Shipping note */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="text-[10px]">🚚</span>
                  <p className="text-[9px] uppercase tracking-[0.28em] text-white/40 m-0"
                     style={{ fontFamily: 'var(--font-montserrat)' }}>
                    Doprava zdarma nad 1 000 Kč
                  </p>
                </div>
              </motion.div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
