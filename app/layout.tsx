import type { Metadata } from 'next'
import { Montserrat, Playfair_Display, Exo_2, Bodoni_Moda, Cinzel } from 'next/font/google'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import { CartProvider } from './context/CartContext'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

const exo2 = Exo_2({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  variable: '--font-exo2',
  display: 'swap',
})

const bodoni = Bodoni_Moda({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bodoni',
  display: 'swap',
})

const cinzel = Cinzel({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-cinzel',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BASES — Americká semínka',
  description: 'Ochucovaná slunečnicová semínka z Ameriky pro baseballisty a softballisty.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${montserrat.variable} ${playfair.variable} ${exo2.variable} ${bodoni.variable} ${cinzel.variable}`}>
      <body className="bg-transparent text-white font-sans">
        <CartProvider>
          <Header />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
