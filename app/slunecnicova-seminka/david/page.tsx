import Link from 'next/link'
import ProductReveal, { ProductItem } from '../../components/ProductReveal'

const PRODUCTS: ProductItem[] = [
  {
    slug: 'barbecue',
    name: 'Barbecue',
    img: '/products/david/barbecue/front.png.png',
    gallery: [
      '/products/david/barbecue/1.png.png',
      '/products/david/barbecue/2.png.png',
      '/products/david/barbecue/3.png.png',
      '/products/david/barbecue/4.png.png',
    ],
    price: '169 Kč',
    description: 'Autentická chuť amerického grilování s intenzivním kouřovým aroma 🍖. Dvojitě pražená semínka přinášejí nekompromisní křupavost a poctivou slanost. Ideální parťák, když tě přepadne chuť na něco opravdu výrazného 🔥.',
    badge: '💎 NÁŠ TIP',
  },
  {
    slug: 'cracked-pepper',
    name: 'Cracked Pepper',
    img: '/products/david/cracked-pepper/front.png.png',
    gallery: [
      '/products/david/cracked-pepper/1.png.png',
      '/products/david/cracked-pepper/2.png.png',
      '/products/david/cracked-pepper/3.png.png',
      '/products/david/cracked-pepper/4.png.png',
    ],
    price: '169 Kč',
    description: 'Ostrá pepřová tečka, která tě udrží ve hře ⚡. Legendární americká semínka kombinují precizní slanost s intenzitou černého pepře. Prémiová a nekompromisně křupavá svačina pro každého fanouška ⚾.',
    badge: '💎 NÁŠ TIP',
  },
  {
    slug: 'sweet-spicy',
    name: 'Sweet & Spicy',
    img: '/products/david/sweet-spicy/front.png.png',
    gallery: [
      '/products/david/sweet-spicy/1.png.png',
      '/products/david/sweet-spicy/2.png.png',
      '/products/david/sweet-spicy/3.png.png',
      '/products/david/sweet-spicy/4.png.png',
    ],
    price: '169 Kč',
    description: 'Sladko-pikantní exploze v každém prémiovém kousku 🌶️. Dvojitě pražená semínka DAVID zaručují maximální křupavost a chuťový zážitek, který tě zaručeně dostane ✨.',
  },
]

export default function DavidPage() {
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
            David
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
      <ProductReveal products={PRODUCTS} brand="David Seeds" backHref="/slunecnicova-seminka" />
    </main>
  )
}
