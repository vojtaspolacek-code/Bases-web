'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Scale, CheckCircle2, Plane, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

export interface ProductItem {
  slug: string
  name: string
  img: string
  backImg?: string
  gallery?: string[]
  price?: string
  description?: string
  badge?: string
}

interface ProductRevealProps {
  products: ProductItem[]
  brand: string
  backHref: string
  gridCols?: string
}

export default function ProductReveal({
  products,
  brand,
  gridCols = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
}: ProductRevealProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [panelSide, setPanelSide]       = useState<'left' | 'right'>('right')
  const [qty, setQty]                   = useState(1)
  const [btnState, setBtnState]         = useState<'idle' | 'loading' | 'success'>('idle')
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex]   = useState(0)

  const selected = products.find(p => p.slug === selectedSlug) ?? null
  const { addItem, openCart } = useCart()

  // Auto-otevření produktu z URL ?product=slug
  useEffect(() => {
    const params  = new URLSearchParams(window.location.search)
    const product = params.get('product')
    if (product && products.some(p => p.slug === product)) {
      const idx    = products.findIndex(p => p.slug === product)
      const colPos = idx % 4
      const side: 'left' | 'right' = colPos <= 1 ? 'right' : 'left'
      setPanelSide(side)
      setSelectedSlug(product)
    }
  }, [products])

  // Fotky pro lightbox: pouze gallery (back.png zůstává jen v 3D flipu)
  const getLightboxImages = (product: ProductItem) =>
    product.gallery ?? []

  // Scroll lock (panel i lightbox)
  useEffect(() => {
    document.body.style.overflow = (selected || isLightboxOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected, isLightboxOpen])

  // Klávesnice pro lightbox
  useEffect(() => {
    if (!isLightboxOpen || !selected) return
    const imgs = getLightboxImages(selected)
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false)
      if (e.key === 'ArrowRight') setLightboxIndex(i => Math.min(i + 1, imgs.length - 1))
      if (e.key === 'ArrowLeft')  setLightboxIndex(i => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isLightboxOpen, selected])

  const handleSelect = (slug: string) => {
    // Zavřít panel při kliknutí na stejný produkt
    if (selectedSlug === slug) {
      setSelectedSlug(null)
      return
    }

    const idx      = products.findIndex(p => p.slug === slug)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    // Pozice v řádku (4 sloupce na desktopu): 0,1 = levá polovina → panel zprava; 2,3 = pravá polovina → panel zleva
    const colPos   = idx % 4
    const newSide: 'left' | 'right' = isMobile
      ? 'right'
      : colPos <= 1 ? 'right' : 'left'

    setQty(1)
    setBtnState('idle')
    setIsLightboxOpen(false)
    setLightboxIndex(0)

    if (selectedSlug !== null && newSide !== panelSide) {
      // Jiná strana — nejdřív zavřít, pak přepnout stranu a otevřít znovu
      setSelectedSlug(null)
      setTimeout(() => {
        setPanelSide(newSide)
        setSelectedSlug(slug)
      }, 590) // trochu víc než transition (570ms)
    } else {
      // Stejná strana nebo první otevření — rovnou
      setPanelSide(newSide)
      setSelectedSlug(slug)
    }
  }

  const handleClose = () => setSelectedSlug(null)

  const openLightbox = (idx = 0) => {
    setLightboxIndex(idx)
    setIsLightboxOpen(true)
  }

  const handleAddToCart = useCallback(() => {
    if (!selected || btnState !== 'idle') return
    setBtnState('loading')
    setTimeout(() => {
      addItem(
        {
          id: `${brand.toLowerCase().replace(/\s+/g, '-')}-${selected.slug}`,
          name: selected.name,
          brand: brand.toUpperCase(),
          price: parseInt(selected.price ?? '0'),
          img: selected.img,
        },
        qty
      )
      setBtnState('success')
      setTimeout(() => {
        openCart()
        setBtnState('idle')
      }, 700)
    }, 400)
  }, [selected, qty, brand, btnState, addItem, openCart])

  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          GRID
      ════════════════════════════════════════════════════════════ */}
      <div className={`grid ${gridCols} gap-x-8 gap-y-16`}>
        {products.map(product => {
          const isSelected = selectedSlug === product.slug
          const isOther    = !!selectedSlug && !isSelected

          return (
            <div
              key={product.slug}
              onClick={() => handleSelect(product.slug)}
              className="group flex flex-col items-center cursor-pointer relative"
              style={{
                zIndex: isSelected ? 45 : 1,
                transform: isSelected ? 'scale(1.22)' : isOther ? 'scale(0.88)' : 'scale(1)',
                opacity: isOther ? 0.45 : 1,
                transition: 'transform 550ms cubic-bezier(0.22,1,0.36,1), opacity 450ms ease',
              }}
            >
              {/* Zlatý glow */}
              <div
                className="absolute inset-0 pointer-events-none rounded-xl"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(199,160,75,0.18) 0%, transparent 70%)',
                  opacity: isSelected ? 1 : 0,
                  transition: 'opacity 400ms ease',
                }}
              />

              <div className="relative w-full aspect-[3/4] p-6 lg:p-10">
                {product.badge && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 shadow-lg transition-all duration-500 ease-out group-hover:scale-105 group-hover:border-blue-400/40 group-hover:shadow-[0_0_15px_rgba(96,165,250,0.2)]">
                      <span className="text-xs animate-pulse">💎</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-200 transition-colors duration-300 group-hover:text-white">
                        Náš tip
                      </span>
                    </div>
                  </div>
                )}

                {isSelected ? (
                  <div className="relative w-full h-full">
                    <Image src={product.img} alt={product.name} fill
                      className="object-contain scale-[1.15]" sizes="(max-width: 768px) 50vw, 25vw" />
                  </div>
                ) : product.backImg ? (
                  <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
                    <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:[transform:rotateY(180deg)]"
                      style={{ transformStyle: 'preserve-3d' }}>
                      <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                        <Image src={product.img} alt={product.name} fill
                          className="object-contain scale-[1.15]" sizes="(max-width: 768px) 50vw, 25vw" />
                      </div>
                      <div className="absolute inset-0"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <Image src={product.backImg} alt={`${product.name} — zadní strana`} fill
                          className="object-contain scale-[1.15]" sizes="(max-width: 768px) 50vw, 25vw" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <Image src={product.img} alt={product.name} fill
                      className="object-contain transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105 group-hover:drop-shadow-[0_15px_35px_rgba(212,175,55,0.2)]"
                      sizes="(max-width: 768px) 50vw, 25vw" />
                  </div>
                )}
              </div>

              <div className="mt-5 text-center">
                <div className="mx-auto mb-3 h-px transition-all duration-500"
                  style={{
                    background: 'linear-gradient(to right, transparent, #c7a04b, transparent)',
                    width: isSelected ? '48px' : '24px',
                  }} />
                <p className="font-light uppercase tracking-[0.25em] text-xs transition-colors duration-300"
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    color: isSelected ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
                  }}>
                  {product.name}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════
          BACKDROP
      ════════════════════════════════════════════════════════════ */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-500
                    ${selected ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
      />

      {/* ════════════════════════════════════════════════════════════
          DETAIL PANEL
      ════════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed top-0 h-screen z-50 flex flex-col ${panelSide === 'right' ? 'right-0' : 'left-0'}`}
        style={{
          width: 'clamp(300px, 34vw, 480px)',
          background: 'rgba(8,8,8,0.88)',
          backdropFilter: 'blur(28px)',
          borderLeft:  panelSide === 'right' ? '1px solid rgba(255,255,255,0.07)' : 'none',
          borderRight: panelSide === 'left'  ? '1px solid rgba(255,255,255,0.07)' : 'none',
          transform: selected
            ? 'translateX(0)'
            : panelSide === 'right' ? 'translateX(100%)' : 'translateX(-100%)',
          transition: 'transform 570ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.slug}
              className="flex flex-col h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* ── A: ZÁHLAVÍ ──────────────────────────────────────── */}
              <div
                className="flex-shrink-0 px-8 lg:px-10 pt-7 pb-6"
                style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,1) 65%, rgba(8,8,8,0))' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <motion.p
                    className="text-[9px] uppercase tracking-[0.5em]"
                    style={{ color: '#c7a04b', fontFamily: 'var(--font-montserrat)' }}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05, duration: 0.35 }}
                  >
                    {brand}
                  </motion.p>
                  <motion.button
                    onClick={handleClose}
                    className="w-7 h-7 flex items-center justify-center text-white/25
                               hover:text-white/70 transition-colors duration-200
                               border border-white/10 hover:border-white/25 rounded-sm text-base"
                    aria-label="Zavřít"
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.08, duration: 0.3 }}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                </div>

                <motion.h2
                  className="text-2xl lg:text-[1.7rem] font-thin uppercase leading-tight text-white"
                  style={{ fontFamily: 'var(--font-exo2)', letterSpacing: '0.07em' }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {selected.name}
                </motion.h2>

                {/* zlatá čára pod názvem */}
                <motion.div
                  className="mt-4 h-px"
                  style={{ background: 'linear-gradient(to right, rgba(199,160,75,0.35), transparent)', width: '48px' }}
                  initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.18, duration: 0.4, ease: 'easeOut' }}
                />
              </div>

              {/* ── B: POPIS (flex-1) ────────────────────────────────── */}
              <motion.div
                className="flex-1 px-8 lg:px-10 pb-2 flex flex-col justify-center"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.38 }}
              >
                {(() => {
                  const fullText = selected.description
                    ?? 'Prémiová ochucená slunečnicová semínka přímo z Ameriky. Pečlivě vybraná pro ty, kteří odmítají kompromisy.'
                  const dotIdx = fullText.search(/[.!?]\s/)
                  const lead   = dotIdx > -1 ? fullText.slice(0, dotIdx + 1) : fullText
                  const rest   = dotIdx > -1 ? fullText.slice(dotIdx + 1).trim() : ''
                  return (
                    <div style={{ fontFamily: 'var(--font-montserrat)' }}>
                      <p className="text-base font-medium leading-relaxed mb-2.5"
                        style={{ color: 'rgba(255,255,255,0.9)' }}>
                        {lead}
                      </p>
                      {rest && (
                        <p className="text-sm font-light leading-[1.85]"
                          style={{ color: 'rgba(255,255,255,0.48)' }}>
                          {rest}
                        </p>
                      )}
                    </div>
                  )
                })()}

                {/* Tlačítko Lightbox — ghost link styl */}
                {getLightboxImages(selected).length > 0 && (
                  <motion.button
                    onClick={() => openLightbox(0)}
                    className="group/lb mt-4 flex items-center gap-1.5 self-start"
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.26, duration: 0.32 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <motion.span
                      className="text-sm font-medium tracking-wide transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.45)' }}
                      whileHover={{ color: '#c7a04b' }}
                    >
                      Prohlédnout detailní složení obalu
                    </motion.span>
                    <motion.span
                      className="transition-all duration-300"
                      style={{ color: 'rgba(255,255,255,0.35)' }}
                      variants={{
                        rest:  { x: 0,   color: 'rgba(255,255,255,0.35)' },
                        hover: { x: 4,   color: '#c7a04b' },
                      }}
                      initial="rest"
                      whileHover="hover"
                    >
                      <ArrowRight size={14} strokeWidth={1.6} />
                    </motion.span>
                  </motion.button>
                )}
              </motion.div>

              {/* ── C: NÁKUPNÍ SEKCE (fixní dole) ───────────────────── */}
              <motion.div
                className="flex-shrink-0 px-8 lg:px-10 pt-5 pb-8"
                style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Glassmorphism štítky */}
                {(() => {
                  const weight = brand === 'David Seeds' ? '149 g' : brand === 'Bigs Seeds' ? '152 g' : '100 g'
                  const tags: { icon: React.ReactNode; label: string }[] = [
                    { icon: <Scale size={11} strokeWidth={1.6} />,        label: weight },
                    { icon: <CheckCircle2 size={11} strokeWidth={1.6} />, label: 'Skladem' },
                    ...(brand !== 'Seedos'
                      ? [{ icon: <Plane size={11} strokeWidth={1.6} />, label: 'Dovoz USA' }]
                      : []
                    ),
                  ]
                  return (
                    <div className="flex gap-2 mb-5 flex-wrap">
                      {tags.map(({ icon, label }) => (
                        <span key={label}
                          className="flex items-center gap-1.5 text-[9px] tracking-[0.22em]
                                     uppercase px-3 py-1.5 rounded-lg backdrop-blur-sm"
                          style={{
                            fontFamily: 'var(--font-montserrat)',
                            color: 'rgba(255,255,255,0.65)',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.10)',
                          }}
                        >
                          <span style={{ color: '#c7a04b', opacity: 0.8 }}>{icon}</span>
                          {label}
                        </span>
                      ))}
                    </div>
                  )
                })()}

                {/* Cena */}
                {selected.price && (
                  <p className="text-3xl font-light mb-5 tracking-wide"
                    style={{ color: '#c7a04b', fontFamily: 'var(--font-exo2)' }}>
                    {selected.price}
                  </p>
                )}

                {/* Množství + CTA */}
                <div className="flex items-center gap-4">
                  {/* Qty */}
                  <div className="flex items-center rounded-sm overflow-hidden flex-shrink-0"
                    style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-9 h-10 flex items-center justify-center text-white/40 text-sm
                                 hover:text-white hover:bg-white/5 transition-all duration-200">−</button>
                    <div className="w-9 h-10 flex items-center justify-center overflow-hidden"
                      style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span key={qty}
                          initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="text-sm text-white/75 select-none"
                          style={{ fontFamily: 'var(--font-montserrat)' }}>
                          {qty}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <button onClick={() => setQty(q => q + 1)}
                      className="w-9 h-10 flex items-center justify-center text-white/40 text-sm
                                 hover:text-white hover:bg-white/5 transition-all duration-200">+</button>
                  </div>

                  {/* CTA */}
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={btnState !== 'idle'}
                    className="group relative flex-1 overflow-hidden text-xs uppercase tracking-[0.3em]
                               font-bold h-10 flex items-center justify-center gap-2 disabled:cursor-default"
                    style={{
                      fontFamily: 'var(--font-montserrat)',
                      background: btnState === 'success' ? '#2d6a2d' : '#c7a04b',
                      color: btnState === 'success' ? '#fff' : '#000',
                    }}
                    whileHover={btnState === 'idle' ? { scale: 1.03, filter: 'drop-shadow(0 4px 20px rgba(212,175,55,0.55))' } : {}}
                    whileTap={btnState === 'idle' ? { scale: 0.97 } : {}}
                    animate={{ scale: btnState === 'success' ? [1, 0.96, 1] : 1 }}
                    transition={{ duration: 0.28 }}
                  >
                    {btnState === 'idle' && (
                      <span className="pointer-events-none absolute inset-0 -translate-x-full
                                       group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                        style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.3) 50%, transparent 65%)' }} />
                    )}
                    <AnimatePresence mode="wait" initial={false}>
                      {btnState === 'idle' && (
                        <motion.span key="idle"
                          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}>Do košíku</motion.span>
                      )}
                      {btnState === 'loading' && (
                        <motion.span key="loading"
                          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }} className="flex items-center gap-2">
                          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Zpracování…
                        </motion.span>
                      )}
                      {btnState === 'success' && (
                        <motion.span key="success"
                          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}>Přidáno ✓</motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* ════════════════════════════════════════════════════════════
          LIGHTBOX MODAL
      ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isLightboxOpen && selected && (() => {
          const imgs    = getLightboxImages(selected)
          const hasPrev = lightboxIndex > 0
          const hasNext = lightboxIndex < imgs.length - 1

          return (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(32px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={() => setIsLightboxOpen(false)}
            >

              {/* ── Zavírací křížek ─────────────────────────────────── */}
              <motion.button
                className="absolute top-6 right-6 flex items-center justify-center
                           text-white/60 hover:text-white
                           rounded-full p-3 backdrop-blur-md
                           border border-white/10 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.05)' }}
                onClick={() => setIsLightboxOpen(false)}
                initial={{ opacity: 0, scale: 0.75, y: -8 }}
                animate={{ opacity: 1, scale: 1,    y:  0 }}
                exit={{ opacity: 0, scale: 0.75 }}
                transition={{ delay: 0.08, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.12, background: 'rgba(255,255,255,0.10)' }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} strokeWidth={1.5} />
              </motion.button>

              {/* ── Název produktu + čítač (vlevo nahoře) ───────────── */}
              <motion.div
                className="absolute top-7 left-8 flex items-center gap-4"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x:   0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
              >
                <p className="text-[10px] uppercase tracking-[0.4em]"
                   style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.35)' }}>
                  {selected.name}
                </p>
                <span style={{ color: 'rgba(199,160,75,0.4)', fontSize: '10px' }}>·</span>
                <p className="text-[10px] tracking-[0.2em]"
                   style={{ fontFamily: 'var(--font-montserrat)', color: 'rgba(255,255,255,0.25)' }}>
                  {lightboxIndex + 1} / {imgs.length}
                </p>
              </motion.div>

              {/* ── Levitující obal obrázku ──────────────────────────── */}
              <motion.div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  maxWidth:  '85vw',
                  maxHeight: '82vh',
                  width:  '85vw',
                  height: '82vh',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 0 50px rgba(0,0,0,0.55), 0 0 40px rgba(212,175,55,0.08)',
                }}
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1,    y:  0 }}
                exit={{ opacity: 0, scale: 0.94, y: 12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                onClick={e => e.stopPropagation()}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={lightboxIndex}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1    }}
                    exit={{    opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <Image
                      src={imgs[lightboxIndex]}
                      alt={`${selected.name} — ${lightboxIndex + 1}`}
                      fill
                      className="object-contain p-6"
                      sizes="85vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* ── Šipka vlevo ─────────────────────────────────────── */}
              <AnimatePresence>
                {hasPrev && (
                  <motion.button
                    className="absolute left-6 top-1/2 -translate-y-1/2
                               flex items-center justify-center p-4 rounded-full
                               text-white/70 hover:text-white
                               backdrop-blur-md border border-white/10
                               hover:scale-110 transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                    onClick={e => { e.stopPropagation(); setLightboxIndex(i => i - 1) }}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x:   0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ background: 'rgba(255,255,255,0.12)' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft size={24} strokeWidth={1.5} />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* ── Šipka vpravo ────────────────────────────────────── */}
              <AnimatePresence>
                {hasNext && (
                  <motion.button
                    className="absolute right-6 top-1/2 -translate-y-1/2
                               flex items-center justify-center p-4 rounded-full
                               text-white/70 hover:text-white
                               backdrop-blur-md border border-white/10
                               hover:scale-110 transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                    onClick={e => { e.stopPropagation(); setLightboxIndex(i => i + 1) }}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x:  0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ background: 'rgba(255,255,255,0.12)' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight size={24} strokeWidth={1.5} />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* ── Apple pill indikátor dole ────────────────────────── */}
              {imgs.length > 1 && (
                <motion.div
                  className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y:  0 }}
                  transition={{ delay: 0.2, duration: 0.35 }}
                  onClick={e => e.stopPropagation()}
                >
                  {imgs.map((_, idx) => {
                    const isActive = idx === lightboxIndex
                    return (
                      <motion.button
                        key={idx}
                        onClick={() => setLightboxIndex(idx)}
                        className="rounded-full"
                        animate={{
                          width:      isActive ? 24 : 8,
                          height:     8,
                          background: isActive ? '#c7a04b' : 'rgba(255,255,255,0.28)',
                          boxShadow:  isActive ? '0 0 10px rgba(212,175,55,0.55)' : '0 0 0px transparent',
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    )
                  })}
                </motion.div>
              )}

            </motion.div>
          )
        })()}
      </AnimatePresence>
    </>
  )
}
