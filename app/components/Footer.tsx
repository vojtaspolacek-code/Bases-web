import Link from 'next/link'

const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/bases.official' },
  { label: 'TikTok',    href: 'https://www.tiktok.com/@bases.official'   },
  { label: 'Facebook',  href: 'https://www.facebook.com/profile.php?id=61588261719759' },
]
const LEGAL = [
  { label: 'Podmínky', href: '/podminky' },
  { label: 'GDPR',     href: '/gdpr'     },
  { label: 'Kontakt',  href: '/kontakt'  },
]
function FooterLink({ label, href, small }: { label: string; href: string; small?: boolean }) {
  return (
    <Link href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="group relative flex flex-col items-center gap-[3px] no-underline">
      <span
        style={{ fontFamily: 'var(--font-montserrat)',
          fontSize: small ? '9px' : '10px',
          letterSpacing: '0.38em', textTransform: 'uppercase',
          color: small ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.5)',
          fontWeight: 400, transition: 'color 0.3s ease' }}
        className="group-hover:!text-[rgba(199,160,75,0.9)]">
        {label}
      </span>
      <span className="block h-[1px] w-0 group-hover:w-full transition-[width] duration-300 ease-out"
        style={{ background: 'linear-gradient(to right, #c7a04b, rgba(199,160,75,0.3))' }} />
    </Link>
  )
}

export default function Footer() {
  return (
    <footer style={{ background: '#0a0a0a', position: 'relative', zIndex: 10 }}>

      <div className="relative flex items-center" style={{ height: '1px' }}>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(199,160,75,0.5))' }} />
        <div style={{ color: 'rgba(199,160,75,0.7)', fontSize: '6px', padding: '0 14px', flexShrink: 0 }}>◆</div>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(199,160,75,0.5))' }} />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex items-end justify-between px-16 py-6">
        <div className="flex flex-col gap-[5px]">
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px',
            letterSpacing: '0.7em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>
            Bases
          </span>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '7px',
            letterSpacing: '0.4em', textTransform: 'uppercase',
            color: 'rgba(199,160,75,0.45)', fontWeight: 300 }}>
            Americká semínka
          </span>
        </div>
        <div className="flex items-center gap-10">
          {SOCIAL.map(s => <FooterLink key={s.label} {...s} />)}
        </div>
        <div className="flex items-center gap-7">
          {LEGAL.map(l => <FooterLink key={l.label} {...l} small />)}
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden flex-col items-center gap-5 px-8 py-7">
        <div className="flex flex-col items-center gap-[5px]">
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '10px', letterSpacing: '0.7em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>Bases</span>
          <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '7px', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(199,160,75,0.45)', fontWeight: 300 }}>Americká semínka</span>
        </div>
        <div className="flex items-center gap-8">
          {SOCIAL.map(s => <FooterLink key={s.label} {...s} />)}
        </div>
        <div style={{ height: '1px', width: '40px', background: 'rgba(199,160,75,0.18)' }} />
        <div className="flex items-center gap-6">
          {LEGAL.map(l => <FooterLink key={l.label} {...l} small />)}
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center pb-8">
        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '8px',
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.28)' }}>
          © 2025 Bases — Všechna práva vyhrazena
        </span>
      </div>
    </footer>
  )
}
