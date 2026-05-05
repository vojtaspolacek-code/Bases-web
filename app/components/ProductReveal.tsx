'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Scale, CheckCircle2, Plane, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCart } from '../context/CartContext'

const BADGE_STYLE = `
@keyframes badgeScrollV {
  0%   { transform: translateY(120%); opacity: 0; }
  8%   { opacity: 1; }
  92%  { opacity: 1; }
  100% { transform: translateY(-120%); opacity: 0; }
}
@keyframes badgeScrollH {
  0%   { transform: translateX(-120%); opacity: 0; }
  8%   { opacity: 1; }
  92%  { opacity: 1; }
  100% { transform: translateX(120%); opacity: 0; }
}
`

export interface ProductItem {
  slug: string
  name: string
  img: string
  backImg?: string
  gallery?: string[]
  price?: string
  description?: string
  badge?: string
  mobileScale?: number
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
  gridCols = 'md:grid-cols-3 lg:grid-cols-4',
}: ProductRevealProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [panelSide, setPanelSide]       = useState<'left' | 'right'>('right')
  const [qty, setQty]                   = useState(1)
  const [btnState, setBtnState]         = useState<'idle' | 'loading' | 'success'>('idle')
  const [isLightboxOpen, setIsLightboxOpen]   = useState(false)
  const [lightboxIndex, setLightboxIndex]     = useState(0)
  const [isMobile, setIsMobile]               = useState(false)
  const [nutritionOpen, setNutritionOpen]     = useState(false)
  const [carouselIndex, setCarouselIndex]     = useState(0)
  const [sheetDragY, setSheetDragY]           = useState(0)
  const [isSheetDragging, setIsSheetDragging] = useState(false)
  const carouselRef        = useRef<HTMLDivElement>(null)
  const sheetScrollRef     = useRef<HTMLDivElement>(null)
  const sheetTouchStartY   = useRef(0)
  const sheetTouchStartX   = useRef(0)
  const sheetCanDrag       = useRef(false)
  const sheetDirLocked     = useRef<'none' | 'vertical' | 'horizontal'>('none')

  const selected = products.find(p => p.slug === selectedSlug) ?? null
  const { addItem, openCart } = useCart()

  // Detekce mobilu
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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

  // Fotky pro lightbox: front.png jako první, pak gallery (1.png, 2.png, ...)
  const getLightboxImages = (product: ProductItem) => [
    product.img,
    ...(product.gallery ?? []),
  ]

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
    setNutritionOpen(false)

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

  // Reset karuselu + drag stavu při každém přepnutí produktu
  useEffect(() => {
    setCarouselIndex(0)
    setSheetDragY(0)
    setIsSheetDragging(false)
    if (carouselRef.current) carouselRef.current.scrollLeft = 0
    if (sheetScrollRef.current) sheetScrollRef.current.scrollTop = 0
  }, [selectedSlug])

  const handleCarouselScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el  = e.currentTarget
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    setCarouselIndex(idx)
  }, [])

  const scrollToSlide = useCallback((idx: number) => {
    if (!carouselRef.current) return
    carouselRef.current.scrollTo({ left: idx * carouselRef.current.clientWidth, behavior: 'smooth' })
    setCarouselIndex(idx)
  }, [])

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
      <style>{BADGE_STYLE}</style>
      {/* ════════════════════════════════════════════════════════════
          GRID
      ════════════════════════════════════════════════════════════ */}
      <div className={`grid grid-cols-2 gap-x-3 gap-y-4 md:gap-x-8 md:gap-y-16 ${gridCols}`}>
        {products.map(product => {
          const isSelected = selectedSlug === product.slug
          const isOther    = !!selectedSlug && !isSelected

          /* ════ MOBILNÍ KARTA — 2-column grid ════ */
          if (isMobile) {
            return (
              <div
                key={product.slug}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleSelect(product.slug)}
              >
                {/* Obrázek s glow */}
                <div className="relative w-full aspect-[4/5] overflow-hidden">
                  {product.badge && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      zIndex: 10,
                      overflow: 'hidden',
                      height: '16px',
                      pointerEvents: 'none',
                    }}>
                      <div style={{
                        animation: 'badgeScrollH 4.5s ease-in-out infinite',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        gap: '8px',
                        filter: 'drop-shadow(0 0 6px rgba(199,160,75,0.35))',
                      }}>
                        <div style={{ width:'16px', height:'1px', background:'linear-gradient(to right, transparent, #c7a04b)', flexShrink:0 }} />
                        <span style={{
                          fontFamily: 'var(--font-montserrat)',
                          fontSize: '8px',
                          letterSpacing: '0.4em',
                          textTransform: 'uppercase',
                          color: 'rgba(199,160,75,0.92)',
                          whiteSpace: 'nowrap',
                          fontWeight: 500,
                        }}>Doporučujeme</span>
                        <div style={{ width:'16px', height:'1px', background:'linear-gradient(to left, transparent, #c7a04b)', flexShrink:0 }} />
                      </div>
                    </div>
                  )}
                  {/* Zlatý glow pod produktem */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-1/2 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at center bottom, rgba(199,160,75,0.14) 0%, transparent 70%)',
                      filter: 'blur(8px)',
                    }} />
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-contain"
                    style={{ transform: `scale(${product.mobileScale ?? 1.15})` }}
                    sizes="50vw"
                    priority
                  />
                </div>

                {/* Text — vycentrovaný */}
                <div className="pt-2 pb-4 text-center w-full px-1">
                  <div className="w-5 h-px mx-auto mb-2"
                    style={{ background: 'linear-gradient(to right, transparent, #c7a04b, transparent)' }} />
                  <p className="text-[0.72rem] font-thin uppercase leading-tight"
                    style={{ fontFamily: 'var(--font-exo2)', color: 'rgba(255,255,255,0.82)', letterSpacing: '0.08em' }}>
                    {product.name}
                  </p>
                  {product.price && (
                    <p className="text-[0.7rem] mt-1 font-light"
                      style={{ color: 'rgba(199,160,75,0.75)', fontFamily: 'var(--font-exo2)' }}>
                      {product.price}
                    </p>
                  )}
                </div>
              </div>
            )
          }

          /* ════ DESKTOPOVÁ KARTA — beze změny ════ */
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

              <div className="relative w-full aspect-[3/4] p-1 md:p-6 lg:p-10">
                {product.badge && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    overflow: 'hidden',
                    height: '18px',
                    pointerEvents: 'none',
                  }}>
                    <div style={{
                      animation: 'badgeScrollH 4.5s ease-in-out infinite',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      gap: '10px',
                      filter: 'drop-shadow(0 0 8px rgba(199,160,75,0.35))',
                    }}>
                      <div style={{ width:'22px', height:'1px', background:'linear-gradient(to right, transparent, #c7a04b)', flexShrink:0 }} />
                      <span style={{
                        fontFamily: 'var(--font-montserrat)',
                        fontSize: '9.5px',
                        letterSpacing: '0.42em',
                        textTransform: 'uppercase',
                        color: 'rgba(199,160,75,0.95)',
                        whiteSpace: 'nowrap',
                        fontWeight: 500,
                      }}>Doporučujeme</span>
                      <div style={{ width:'22px', height:'1px', background:'linear-gradient(to left, transparent, #c7a04b)', flexShrink:0 }} />
                    </div>
                  </div>
                )}

                {isSelected ? (
                  <div className="relative w-full h-full">
                    <Image src={product.img} alt={product.name} fill
                      className="object-contain scale-[1.15]" sizes="25vw" />
                  </div>
                ) : product.backImg ? (
                  <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
                    <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:[transform:rotateY(180deg)]"
                      style={{ transformStyle: 'preserve-3d' }}>
                      <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
                        <Image src={product.img} alt={product.name} fill
                          className="object-contain scale-[1.15]" sizes="25vw" />
                      </div>
                      <div className="absolute inset-0"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <Image src={product.backImg} alt={`${product.name} — zadní strana`} fill
                          className="object-contain scale-[1.15]" sizes="25vw" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <Image src={product.img} alt={product.name} fill
                      className="object-contain transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105 group-hover:drop-shadow-[0_15px_35px_rgba(212,175,55,0.2)]"
                      sizes="25vw" />
                  </div>
                )}
              </div>

              <div className="mt-5 text-center w-full px-2">
                <div className="mx-auto mb-3 h-px transition-all duration-500"
                  style={{
                    background: 'linear-gradient(to right, transparent, #c7a04b, transparent)',
                    width: isSelected ? '48px' : '24px',
                  }} />
                <p className="uppercase font-light text-xs tracking-[0.25em] transition-colors duration-300"
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
        className={`fixed inset-0 z-40 transition-opacity duration-500 bg-black/50 md:bg-black/60
                    ${selected ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
      />

      {/* ════════════════════════════════════════════════════════════
          MOBILNÍ BOTTOM SHEET
      ════════════════════════════════════════════════════════════ */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 md:hidden"
        style={{
          height: 'calc(100dvh - 120px)',
          background: 'linear-gradient(160deg, #16141a 0%, #100e0b 55%, #0d0b08 100%)',
          backdropFilter: 'blur(32px)',
          borderTop: '1px solid rgba(199,160,75,0.18)',
          borderLeft: '1px solid rgba(255,255,255,0.05)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '24px 24px 0 0',
          /* Živý drag: bez transition při tahu, animace zpět/zavřít po puštění */
          transform: selected ? `translateY(${sheetDragY}px)` : 'translateY(100%)',
          transition: isSheetDragging ? 'none' : 'transform 480ms cubic-bezier(0.22,1,0.36,1)',
          display: isMobile ? 'flex' : 'none',
          flexDirection: 'column',
          boxShadow: '0 -8px 40px rgba(199,160,75,0.08), 0 -1px 0 rgba(199,160,75,0.15)',
          /* Jemné zesvětlení drag pillu při tažení */
          willChange: 'transform',
        }}
        onClick={e => e.stopPropagation()}
        onTouchStart={e => {
          sheetTouchStartY.current = e.touches[0].clientY
          sheetTouchStartX.current = e.touches[0].clientX
          sheetDirLocked.current   = 'none'
          /* Drag povolený pouze když je scroll obsahu úplně nahoře */
          sheetCanDrag.current = (sheetScrollRef.current?.scrollTop ?? 0) === 0
        }}
        onTouchMove={e => {
          if (!sheetCanDrag.current) return
          const dy = e.touches[0].clientY - sheetTouchStartY.current
          const dx = Math.abs(e.touches[0].clientX - sheetTouchStartX.current)
          /* Zamknout směr po prvním výrazném pohybu */
          if (sheetDirLocked.current === 'none' && (Math.abs(dy) > 6 || dx > 6)) {
            sheetDirLocked.current = Math.abs(dy) > dx ? 'vertical' : 'horizontal'
          }
          if (sheetDirLocked.current === 'vertical' && dy > 0) {
            /* Mírná rezistence — sheet netlačí přímo s prstem, ale o 12 % pomaleji */
            setSheetDragY(Math.round(dy * 0.88))
            setIsSheetDragging(true)
          }
        }}
        onTouchEnd={() => {
          if (!sheetCanDrag.current || !isSheetDragging) {
            setSheetDragY(0)
            setIsSheetDragging(false)
            return
          }
          if (sheetDragY > 90) {
            /* Přes práh → zavřít */
            handleClose()
          }
          /* Pod prahem → snap back */
          setSheetDragY(0)
          setIsSheetDragging(false)
          sheetCanDrag.current  = false
          sheetDirLocked.current = 'none'
        }}
      >
        {/* ── Drag pill ─────────────────────────────────────────── */}
        <div className="flex-shrink-0 flex justify-center pt-3 pb-1">
          <div className="w-9 h-[3px] rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* ── Brand + Zavřít ────────────────────────────────────── */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 pt-1 pb-2"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[9px] uppercase tracking-[0.55em]"
            style={{ color: '#c7a04b', fontFamily: 'var(--font-montserrat)' }}>
            {brand.split(' ')[0]}
          </p>
          <button
            onClick={handleClose}
            className="flex items-center justify-center transition-all duration-200
                       active:scale-90"
            style={{
              width: 36, height: 36,
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: '50%',
              color: 'rgba(255,255,255,0.70)',
            }}
            aria-label="Zavřít"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* ── Scrollovatelný obsah ─────────────────────────────── */}
        <div ref={sheetScrollRef} className="flex-1 overflow-y-auto overscroll-contain"
          style={{ scrollbarWidth: 'none' }}>

          {selected && (() => {
            /* Slide 0 = front.png, pak gallery (1.png, 2.png, ...) */
            const slides: { src: string; fit: 'contain' | 'cover' }[] = [
              { src: selected.img, fit: 'contain' },
              ...(selected.gallery?.map(src => ({ src, fit: 'contain' as const })) ?? []),
            ]

            return (
              <div className="pb-14">

                {/* ━━ 1. SWIPE KARUSEL ━━ */}
                <div
                  ref={carouselRef}
                  className="flex overflow-x-auto snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
                  onScroll={handleCarouselScroll}
                >
                  {slides.map((slide, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-full snap-center relative"
                      style={{ height: 'clamp(180px, 36vh, 280px)', cursor: 'zoom-in' }}
                      onClick={() => openLightbox(i)}
                    >
                      {/* Zlatý glow pod slide 0 */}
                      {i === 0 && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 pointer-events-none"
                          style={{ background: 'radial-gradient(ellipse at center bottom, rgba(199,160,75,0.16) 0%, transparent 70%)', filter: 'blur(14px)' }} />
                      )}
                      <Image
                        src={slide.src}
                        alt={`${selected.name} — ${i + 1}`}
                        fill
                        className={slide.fit === 'cover' ? 'object-cover' : 'object-contain p-3'}
                        sizes="100vw"
                        priority={i === 0}
                      />
                    </div>
                  ))}
                </div>

                {/* Dots pagination */}
                {slides.length > 1 && (
                  <div className="flex justify-center items-center gap-[7px] pt-3 pb-1">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => scrollToSlide(i)}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width:      carouselIndex === i ? 22 : 7,
                          height:     7,
                          background: carouselIndex === i ? '#c7a04b' : 'rgba(255,255,255,0.22)',
                          boxShadow:  carouselIndex === i ? '0 0 8px rgba(199,160,75,0.55)' : 'none',
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* ━━ 2–5. TEXTOVÉ + NÁKUPNÍ PRVKY ━━ */}
                <div className="px-5 pt-4">

                  {/* Název + cena */}
                  <div className="text-center mb-4">
                    <div className="w-10 h-px mx-auto mb-3"
                      style={{ background: 'linear-gradient(to right, transparent, #c7a04b, transparent)' }} />
                    {selected.badge && (
                      <div className="flex items-center justify-center gap-[9px] mb-2">
                        <div style={{ width: '16px', height: '1px', background: 'linear-gradient(to right, transparent, #c7a04b)', flexShrink: 0 }} />
                        <span style={{
                          fontFamily: 'var(--font-montserrat)',
                          fontSize: '8px',
                          letterSpacing: '0.4em',
                          textTransform: 'uppercase',
                          color: 'rgba(199,160,75,0.9)',
                          whiteSpace: 'nowrap',
                          fontWeight: 500,
                          filter: 'drop-shadow(0 0 6px rgba(199,160,75,0.3))',
                        }}>Doporučujeme</span>
                        <div style={{ width: '16px', height: '1px', background: 'linear-gradient(to left, transparent, #c7a04b)', flexShrink: 0 }} />
                      </div>
                    )}
                    <h2 className="text-[1.55rem] font-bold uppercase leading-none mb-1.5"
                      style={{ fontFamily: 'var(--font-exo2)', color: 'rgba(255,255,255,0.97)', letterSpacing: '0.05em' }}>
                      {selected.name}
                    </h2>
                  </div>

                  {/* Tagy */}
                  {(() => {
                    const weight = brand === 'David Seeds' ? '149 g' : brand === 'Bigs Seeds' ? '152 g' : '100 g'
                    const tags = [
                      { label: weight },
                      { label: 'Skladem' },
                      ...(brand !== 'Seedos' ? [{ label: 'Dovoz USA' }] : []),
                    ]
                    return (
                      <div className="flex gap-2 justify-center flex-wrap mb-4">
                        {tags.map(({ label }) => (
                          <span
                            key={label}
                            className="text-[9px] uppercase tracking-[0.22em] px-3 py-1.5 rounded-lg"
                            style={{
                              fontFamily: 'var(--font-montserrat)',
                              color: 'rgba(255,255,255,0.60)',
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.10)',
                            }}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    )
                  })()}

                  {/* Popis — pod čarou ponoru (scroll reveal) */}
                  {selected.description && (
                    <p className="text-sm leading-relaxed mt-6"
                      style={{ color: 'rgba(209,213,219,0.80)', fontFamily: 'var(--font-montserrat)' }}>
                      {selected.description}
                    </p>
                  )}

                </div>
              </div>
            )
          })()}
        </div>

        {/* ── Sticky CTA — qty + tlačítko fixně dole ── */}
        {selected && selected.price && (
          <div
            className="flex-shrink-0 px-5 pb-5 pt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-3">

              {/* Cena */}
              <span style={{
                color: '#c7a04b',
                fontFamily: 'var(--font-exo2)',
                fontSize: '1.35rem',
                fontWeight: 300,
                letterSpacing: '0.04em',
                flexShrink: 0,
              }}>
                {selected.price}
              </span>

              {/* Qty stepper — kompaktní */}
              <div className="flex items-center rounded-xl overflow-hidden flex-shrink-0"
                style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.10)' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="flex items-center justify-center active:scale-90 transition-transform"
                  style={{ width: 36, height: 38, color: qty <= 1 ? 'rgba(199,160,75,0.28)' : '#c7a04b', fontSize: '1.1rem', borderRight: '1px solid rgba(255,255,255,0.08)' }}>−</button>
                <div className="flex items-center justify-center select-none"
                  style={{ width: 36, height: 38, color: 'rgba(255,255,255,0.90)', fontSize: '0.95rem', fontFamily: 'var(--font-exo2)', fontWeight: 600 }}>
                  {qty}
                </div>
                <button onClick={() => setQty(q => q + 1)}
                  className="flex items-center justify-center active:scale-90 transition-transform"
                  style={{ width: 36, height: 38, color: '#c7a04b', fontSize: '1.1rem', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>+</button>
              </div>

              {/* Tlačítko — flex-1 */}
              <button
                onClick={handleAddToCart}
                disabled={btnState !== 'idle'}
                className="flex-1 py-3 text-xs uppercase tracking-[0.28em] font-bold
                           rounded-xl disabled:opacity-60 disabled:cursor-default relative overflow-hidden"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  background: btnState === 'success'
                    ? 'linear-gradient(to right, #1e5e1e, #2d8a2d)'
                    : 'linear-gradient(105deg, #b89552, #d4af37, #b89552)',
                  color: btnState === 'success' ? '#fff' : '#1a0f00',
                  boxShadow: btnState === 'idle' ? '0 0 20px rgba(199,160,75,0.35)' : 'none',
                  transition: 'background 350ms, color 250ms',
                }}
              >
                {btnState === 'idle'    && 'Do košíku'}
                {btnState === 'loading' && '…'}
                {btnState === 'success' && '✓'}
              </button>

            </div>
          </div>
        )}

        {/* Gradient hint — naznačuje scrollovatelný obsah */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(to top, rgba(13,11,8,0.85), transparent)',
          pointerEvents: 'none',
          zIndex: 10,
          borderRadius: '0 0 24px 24px',
        }} />
      </div>

      {/* ════════════════════════════════════════════════════════════
          DETAIL PANEL
      ════════════════════════════════════════════════════════════ */}
      <aside
        className={`fixed top-0 h-screen z-50 hidden md:flex flex-col ${panelSide === 'right' ? 'right-0' : 'left-0'}`}
        style={{
          width: 'clamp(300px, 34vw, 480px)',
          background: 'rgba(8,8,8,0.88)',
          backdropFilter: 'blur(28px)',
          borderLeft:  panelSide === 'right' ? '1px solid rgba(199,160,75,0.12)' : 'none',
          borderRight: panelSide === 'left'  ? '1px solid rgba(199,160,75,0.12)' : 'none',
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
              style={{ position: 'relative' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Ambient glow */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '60%',
                background: 'radial-gradient(ellipse 120% 50% at 40% 35%, rgba(199,160,75,0.08) 0%, transparent 65%)',
                pointerEvents: 'none',
                zIndex: 0,
              }} />

              {/* Close button — absolute, mimo flow */}
              <motion.button
                onClick={handleClose}
                className="absolute top-7 right-8 w-8 h-8 flex items-center justify-center
                           text-white/25 hover:text-white/60 transition-colors duration-200
                           border border-white/10 hover:border-white/25 rounded-sm text-base"
                aria-label="Zavřít"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.08 }}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>

              {/* ── A: ZÁHLAVÍ ──────────────────────────────────────── */}
              <div
                className="flex-shrink-0 px-8 lg:px-10 pt-36 pb-6"
                style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,1) 65%, rgba(8,8,8,0))', position: 'relative', zIndex: 1 }}
              >
                {/* Badge */}
                {selected.badge && (
                  <motion.div
                    className="flex items-center gap-2 mb-4"
                    style={{ position: 'relative', zIndex: 1 }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.08, duration: 0.3 }}
                  >
                    <div style={{ width: '20px', height: '1px', background: 'rgba(199,160,75,0.6)' }} />
                    <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '8px', letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(199,160,75,0.75)' }}>Doporučujeme</span>
                  </motion.div>
                )}

                {/* Název */}
                <motion.h2
                  className="uppercase leading-[1.1] text-white"
                  style={{ fontFamily: 'var(--font-exo2)', fontSize: 'clamp(1.7rem, 2.4vw, 2.5rem)', fontWeight: 300, letterSpacing: '0.06em', textShadow: '0 0 40px rgba(199,160,75,0.15)', position: 'relative', zIndex: 1 }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {selected.name}
                </motion.h2>

                {/* Zlatá čára */}
                <motion.div
                  className="mt-5 h-px"
                  style={{ background: 'linear-gradient(to right, rgba(199,160,75,0.4), transparent)', width: '56px' }}
                  initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.18, duration: 0.4, ease: 'easeOut' }}
                />
              </div>

              {/* ── B: POPIS (flex-1) ────────────────────────────────── */}
              <motion.div
                className="flex-1 px-8 lg:px-10 pb-2 flex flex-col justify-center"
                style={{ position: 'relative', zIndex: 1 }}
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
              className="fixed inset-x-0 bottom-0 z-[100] flex flex-col md:inset-0 md:items-center md:justify-center"
              style={{
                top: isMobile ? '120px' : 0,
                background: 'rgba(0,0,0,0.72)',
                backdropFilter: 'blur(32px)',
                borderRadius: isMobile ? '20px 20px 0 0' : 0,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={() => setIsLightboxOpen(false)}
            >

              {/* ── Zavírací křížek ─────────────────────────────────── */}
              <motion.button
                className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center justify-center
                           text-white/60 hover:text-white cursor-pointer
                           rounded-full p-3 backdrop-blur-md
                           border border-white/10 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.08)', zIndex: 9999 }}
                onClick={e => { e.stopPropagation(); setIsLightboxOpen(false) }}
                initial={{ opacity: 0, scale: 0.75, y: -8 }}
                animate={{ opacity: 1, scale: 1,    y:  0 }}
                exit={{ opacity: 0, scale: 0.75 }}
                transition={{ delay: 0.08, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.12, background: 'rgba(255,255,255,0.14)' }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} strokeWidth={1.5} />
              </motion.button>

              {/* ── Název produktu + čítač (vlevo nahoře) — pouze desktop ── */}
              <motion.div
                className="absolute top-7 left-8 hidden md:flex items-center gap-4"
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
                  maxWidth:  isMobile ? '92vw' : '85vw',
                  maxHeight: isMobile ? 'calc(100dvh - 220px)' : '82vh',
                  width:     isMobile ? '92vw' : '85vw',
                  height:    isMobile ? 'calc(100dvh - 220px)' : '82vh',
                  margin:    isMobile ? 'auto' : undefined,
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 0 50px rgba(0,0,0,0.55), 0 0 40px rgba(212,175,55,0.08)',
                }}
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1,    y:  0 }}
                exit={{ opacity: 0, scale: 0.94, y: 12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                onClick={e => e.stopPropagation()}
                onTouchStart={(e) => { (e.currentTarget as any)._touchX = e.touches[0].clientX }}
                onTouchEnd={(e) => {
                  const startX = (e.currentTarget as any)._touchX
                  if (startX == null) return
                  const diff = startX - e.changedTouches[0].clientX
                  if (diff > 50 && lightboxIndex < imgs.length - 1) setLightboxIndex(i => i + 1)
                  if (diff < -50 && lightboxIndex > 0) setLightboxIndex(i => i - 1)
                }}
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
                    <div style={{ touchAction: 'pinch-zoom', overflow: 'auto', width: '100%', height: '100%' }}>
                      <Image
                        src={imgs[lightboxIndex]}
                        alt={`${selected.name} — ${lightboxIndex + 1}`}
                        fill
                        className="object-contain p-6"
                        sizes="85vw"
                        priority
                      />
                    </div>
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
