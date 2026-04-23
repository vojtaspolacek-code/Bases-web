import Image from 'next/image'
import Hero from './components/Hero'
import SignatureSelection from './components/SignatureSelection'

export default function Home() {
  return (
    <main className="bg-transparent">

      {/* ═══════════════════════════════════════════════════════════════
          FIXNÍ TAPETA — stadion + VŠECHNY overlaye, přibito na obrazovce.
          Stejný vizuál od vrchu dolů, nehne se.
      ═══════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/hero-bg-bw.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          aria-hidden
        />
        {/* Uniformní ztmavení celé fotky */}
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.30)' }} />
        {/* Radiální vinětace — střed mírně vlevo, pravá strana tmavší */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 62% at 42% 48%, transparent 0%, rgba(0,0,0,0.52) 62%, rgba(0,0,0,0.90) 82%, #000 100%)',
          }}
        />
        {/* Extra ztmavení pravé strany */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 28%, transparent 52%)',
          }}
        />
        {/* Pravý dolní roh */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 55% 50% at 100% 100%, rgba(0,0,0,0.7) 0%, transparent 65%)',
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          OBSAH — scrolluje přes fixní tapetu
      ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10">
        <Hero />
        <SignatureSelection />
      </div>

    </main>
  )
}
