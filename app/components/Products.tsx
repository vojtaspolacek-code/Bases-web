'use client'

import Image from 'next/image'

const PRODUCTS = [
  { slug: 'original',        name: 'Original',          price: '89 Kč', front: '/products/original-front.png',        back: '/products/original-back.png'        },
  { slug: 'salt',            name: 'Salt',               price: '89 Kč', front: '/products/salt-front.png',            back: '/products/salt-back.png'            },
  { slug: 'caramel',         name: 'Caramel',            price: '89 Kč', front: '/products/caramel-front.png',         back: '/products/caramel-back.png'         },
  { slug: 'chilli-lime',     name: 'Chilli Lime',        price: '89 Kč', front: '/products/chilli-lime-front.png',     back: '/products/chilli-lime-back.png'     },
  { slug: 'taco',            name: 'Taco',               price: '89 Kč', front: '/products/taco-front.png',            back: '/products/taco-back.png'            },
  { slug: 'sourcream-onion', name: 'Sour Cream & Onion', price: '89 Kč', front: '/products/sourcream-onion-front.png', back: '/products/sourcream-onion-back.png' },
  { slug: 'flamin-blue',     name: 'Flamin\' Blue',      price: '89 Kč', front: '/products/flamin-blue-front.png',     back: '/products/flamin-blue-back.png'     },
]

function ProductCard({ name, price, front, back }: typeof PRODUCTS[number]) {
  return (
    <div className="group relative flex flex-col cursor-pointer">

      {/* Obrázek — flip front → back při hoveru */}
      <div className="relative overflow-hidden aspect-[3/4] bg-gradient-to-b from-neutral-900 to-black">

        {/* Front */}
        <div className="absolute inset-0 transition-opacity duration-500 ease-in-out group-hover:opacity-0">
          <Image
            src={front}
            alt={name}
            fill
            className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Back */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100">
          <Image
            src={back}
            alt={`${name} — zadní strana`}
            fill
            className="object-contain p-6 transition-transform duration-700 scale-105 group-hover:scale-100"
          />
        </div>

        {/* Jemná zlatá linka dole */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#c7a04b]/20
                        scale-x-0 origin-left transition-transform duration-500
                        group-hover:scale-x-100" />
      </div>

      {/* Popis */}
      <div className="pt-5 pb-2 flex items-end justify-between">
        <h3
          className="font-sans font-light text-sm uppercase tracking-[0.2em] text-white/85 m-0"
        >
          {name}
        </h3>
        <span
          className="font-sans text-xs tracking-widest"
          style={{ color: '#c7a04b' }}
        >
          {price}
        </span>
      </div>

      {/* Přidat do košíku */}
      <button
        className="mt-3 w-full py-3 text-[10px] uppercase tracking-[0.25em] font-medium
                   border border-white/10 text-white/40
                   transition-all duration-300
                   hover:border-[#c7a04b]/50 hover:text-[#c7a04b] hover:bg-[#c7a04b]/5"
      >
        Přidat do košíku
      </button>

    </div>
  )
}

export default function Products() {
  return (
    <section
      id="products"
      className="bg-black px-8 lg:px-20 py-28"
    >
      {/* Nadpis sekce */}
      <div className="mb-16">
        <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-white/40 mb-3">
          — NAŠE KOLEKCE
        </p>
        <h2
          className="font-sans font-light text-2xl md:text-3xl uppercase tracking-[0.15em] m-0"
          style={{ color: '#c7a04b' }}
        >
          Příchutě
        </h2>
        {/* Zlatá linka pod nadpisem */}
        <div className="mt-4 h-px w-12 bg-[#c7a04b]/40" />
      </div>

      {/* Grid produktů */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
        {PRODUCTS.map(p => (
          <ProductCard key={p.slug} {...p} />
        ))}
      </div>

    </section>
  )
}
