import Link from 'next/link'
import ProductReveal, { ProductItem } from '../../components/ProductReveal'

const PRODUCTS: ProductItem[] = [
  {
    slug: 'dill-pickle',
    name: 'Dill Pickle',
    img: '/products/bigs/front.png.png',
    gallery: [
      '/products/bigs/1.png.png',
      '/products/bigs/2.png.png',
      '/products/bigs/3.png.png',
      '/products/bigs/4.png.png',
    ],
    price: '179 Kč',
    description: 'Nečekaný, ale naprosto návykový zásah kyselé okurky v každém kousku 🥒. Tahle americká rarita s dvojitě praženou texturou je stvořená pro ty, co hledají něco neokoukaného. Připrav se na chuťový šok, který tě nepřestane bavit ⚡.',
    badge: '💎 NÁŠ TIP',
  },
]

export default function BigsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-32 pb-24 px-8 lg:px-16">
      <div className="mb-16 flex items-end justify-between border-b border-white/5 pb-8">
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.4em] mb-3"
            style={{ color: '#c7a04b', fontFamily: 'var(--font-montserrat)' }}
          >
            — Slunečnicová semínka
          </p>
          <h1
            className="text-4xl lg:text-5xl font-thin uppercase tracking-[0.15em] text-white/90 m-0"
            style={{ fontFamily: 'var(--font-exo2)' }}
          >
            Bigs
          </h1>
        </div>
        <Link
          href="/slunecnicova-seminka"
          className="text-[10px] uppercase tracking-[0.3em] text-white/30
                     hover:text-white/70 transition-colors duration-300 no-underline"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          ← Zpět
        </Link>
      </div>
      <ProductReveal products={PRODUCTS} brand="Bigs Seeds" backHref="/slunecnicova-seminka" />
    </main>
  )
}
