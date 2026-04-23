'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

function NavLink({ href, children, small }: { href: string; children: React.ReactNode; small?: boolean }) {
  return (
    <Link
      href={href}
      className={`group relative inline-block uppercase tracking-widest
                 font-medium text-white/90 transition-colors duration-300
                 hover:text-[#c7a04b] no-underline pb-1
                 ${small ? 'text-[10px]' : 'text-sm'}`}
    >
      {children}
      <span
        className="absolute bottom-0 left-0 h-px w-full bg-[#c7a04b]
                   scale-x-0 origin-left transition-transform duration-300 ease-out
                   group-hover:scale-x-100"
      />
    </Link>
  )
}

export default function Header() {
  const { openCart, items } = useCart()
  const totalQty = items.reduce((s, i) => s + i.qty, 0)

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 pointer-events-none
                 bg-gradient-to-b from-black via-black/80 to-transparent pb-16"
    >
      <div className="grid grid-cols-3 items-center px-8 lg:px-14 py-5 pointer-events-auto">

        {/* Logo — vlevo */}
        <Link href="/" className="justify-self-start shrink-0">
          <Image
            src="/logo.png"
            alt="Bases Logo"
            width={180}
            height={56}
            className="h-14 object-contain"
            style={{ width: 'auto' }}
            priority
          />
        </Link>

        {/* Nav — střed */}
        <nav className="justify-self-center">
          <ul className="flex items-center gap-10 list-none m-0 p-0">
            <li><NavLink href="/slunecnicova-seminka">Slunečnicová semínka</NavLink></li>
            <li><NavLink href="/o-nas">O nás</NavLink></li>
          </ul>
        </nav>

        {/* Košík — vpravo */}
        <button
          onClick={openCart}
          className="justify-self-end text-sm uppercase tracking-widest font-medium
                     text-white/90 hover:text-[#c7a04b] transition-colors duration-300
                     bg-transparent border-0 cursor-pointer p-0 flex items-center gap-2"
        >
          KOŠÍK
          {totalQty > 0 && (
            <span
              className="text-[9px] font-medium rounded-full w-4 h-4 flex items-center justify-center"
              style={{ background: '#c7a04b', color: '#000' }}
            >
              {totalQty}
            </span>
          )}
        </button>

      </div>
    </header>
  )
}
