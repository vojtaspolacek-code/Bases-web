import Link from 'next/link'
import ProductReveal, { ProductItem } from '../../components/ProductReveal'

const PRODUCTS: ProductItem[] = [
  // ── Náš tip — vždy první ──────────────────────────────
  {
    slug: 'flamin-blue',
    name: "Flamin' Blue",
    img: '/products/seedos/flamin-blue/front.png.png',
    backImg: '/products/seedos/flamin-blue/back.png.png',
    gallery: [
      '/products/seedos/flamin-blue/1.png.png',
      '/products/seedos/flamin-blue/2.png.png',
    ],
    price: '59 Kč',
    description: 'Modrá jiskra pro tvoje chuťové pohárky. Nečekaná kombinace pikantnosti a svěžesti, která tě nepřestane bavit. Křupavá, zdravější a naprosto originální alternativa k běžným snackům.',
    badge: '💎 NÁŠ TIP',
  },
  {
    slug: 'sourcream-onion',
    name: 'Sour Cream & Onion',
    img: '/products/seedos/sourcream-onion/front.png.png',
    backImg: '/products/seedos/sourcream-onion/back.png.png',
    gallery: [
      '/products/seedos/sourcream-onion/1.png.png',
      '/products/seedos/sourcream-onion/2.png.png',
    ],
    price: '59 Kč',
    description: 'Dokonalá rovnováha jemné smetany a svěží cibulky v každém křupnutí. Prémiově pražená semínka pro ty, kteří hledají plnou, krémovou chuť bez pálivosti. Ideální parťák na tribunu i pro každodenní relax.',
    badge: '💎 NÁŠ TIP',
  },
  {
    slug: 'taco',
    name: 'Taco',
    img: '/products/seedos/taco/front.png.png',
    backImg: '/products/seedos/taco/back.png.png',
    gallery: [
      '/products/seedos/taco/1.png.png',
      '/products/seedos/taco/2.png.png',
    ],
    price: '59 Kč',
    description: 'Autentická mexická chuť v každém semínku. Kombinace papriky, česneku a lehké pálivosti vytváří perfektní snack pro sportovce i milovníky výrazných chutí. Křupavá, prémiová a nekompromisně návyková.',
    badge: '💎 NÁŠ TIP',
  },
  // ── Ostatní příchutě ──────────────────────────────────
  {
    slug: 'original',
    name: 'Original',
    img: '/products/seedos/original/front.png.png',
    backImg: '/products/seedos/original/back.png.png',
    gallery: [
      '/products/seedos/original/1.png.png',
      '/products/seedos/original/2.png.png',
    ],
    price: '59 Kč',
    description: 'Čistá klasika, která nikdy nezklame. Prémiová pražená semínka s přirozenou chutí bez zbytečností. Někdy je nejlepší vrátit se k základům. Seedos Original nabízí to nejdůležitější – poctivé, dokonale křupavé slunečnicové semínko a jemný proces pražení pro ten nejčistší zážitek.',
  },
  {
    slug: 'salt',
    name: 'Salt',
    img: '/products/seedos/salt/front.png.png',
    backImg: '/products/seedos/salt/back.png.png',
    gallery: [
      '/products/seedos/salt/1.png.png',
      '/products/seedos/salt/2.png.png',
    ],
    price: '59 Kč',
    description: 'Dvojitá dávka chuti, žádné výmluvy. Pořádně prosolená semínka pro ty nejnáročnější dny. Někdy si situace žádá ostřejší přístup. S verzí Extra Salt získáte uspokojující slaný profil a čistou, intenzivní energii, na kterou se můžete spolehnout.',
  },
  {
    slug: 'caramel',
    name: 'Caramel',
    img: '/products/seedos/caramel/front.png.png',
    backImg: '/products/seedos/caramel/back.png.png',
    gallery: [
      '/products/seedos/caramel/1.png.png',
      '/products/seedos/caramel/2.png.png',
    ],
    price: '59 Kč',
    description: 'Sladká stránka hry s nečekaným twistem. Jemně solený karamel na dvojitě pražených semínkách. Objevte chuť, kde se potkává jemný slaný podtón s poctivou karamelovou glazurou. Plná, intenzivní chuť s prémiovým křupnutím, která skvěle doplňuje každý večer.',
  },
  {
    slug: 'chilli-lime',
    name: 'Chilli & Lime',
    img: '/products/seedos/chilli-lime/front.png.png',
    backImg: '/products/seedos/chilli-lime/back.png.png',
    gallery: [
      '/products/seedos/chilli-lime/1.png.png',
      '/products/seedos/chilli-lime/2.png.png',
    ],
    price: '59 Kč',
    description: 'Ostrý start s limetkovým finišem. Odvážná a mistrovsky vyvážená kombinace pro probuzení smyslů. Zažijte pravý temperament v každém křupnutí. Osvěžující citrusový tón vzápětí přechází do hřejivého, pikantního dozvuku. Dokonalá chuťová jiskra.',
  },
]

export default function SeedosPage() {
  return (
    <main className="min-h-screen bg-black pt-8 md:pt-36 pb-6 md:pb-28 px-8 lg:px-16">

      {/* ── Heading ── */}
      <div className="flex -mt-6 md:mt-0 mb-8 md:mb-8 items-end justify-between md:border-b md:border-white/5 pb-8">
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
            Seedos
          </h1>
        </div>
        <Link
          href="/slunecnicova-seminka"
          className="text-[10px] uppercase tracking-[0.3em] text-white/30
                     hover:text-white/70 transition-colors duration-300 no-underline hidden md:inline"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          ← Zpět
        </Link>
      </div>

      <ProductReveal products={PRODUCTS} brand="Seedos" backHref="/slunecnicova-seminka" />
    </main>
  )
}
