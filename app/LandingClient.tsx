'use client'

import { useState, useEffect, useRef } from 'react'

const STRIPE_PRICE_ID = 'price_1Th5lPCIO1w2FVrbK1c5HM3s'

async function handleCheckout() {
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: STRIPE_PRICE_ID })
    })
    const { url } = await res.json()
    if (url) window.location.href = url
  } catch (err) {
    console.error('Checkout error:', err)
  }
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, visible } = useInView()
  useEffect(() => {
    if (!visible) return
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [visible, target])
  return <span ref={ref}>{count}{suffix}</span>
}

function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const update = () => {
      const diff = targetDate.getTime() - Date.now()
      if (diff <= 0) return
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
      {[
        { val: timeLeft.days, label: 'jours' },
        { val: timeLeft.hours, label: 'heures' },
        { val: timeLeft.minutes, label: 'min' },
        { val: timeLeft.seconds, label: 'sec' },
      ].map((t, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            fontSize: '28px', fontWeight: 800, color: '#fff',
            background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '8px', padding: '8px 14px', minWidth: '56px', textAlign: 'center',
            fontFamily: "'JetBrains Mono', monospace",
            boxShadow: '0 1px 0 rgba(167,139,250,0.15) inset',
          }}>
            {String(t.val).padStart(2, '0')}
          </div>
          <div style={{
            fontSize: '10px', color: 'rgba(255,255,255,0.35)',
            fontFamily: "'JetBrains Mono', monospace", marginTop: '4px', letterSpacing: '0.08em',
          }}>{t.label}</div>
        </div>
      ))}
    </div>
  )
}

const MODULES = [
  { num: '01', title: 'Pourquoi les pubs sans paroles gagnent', desc: 'CTR -> Quality Score -> CPI. Le mecanisme complet avec mes screenshots reels.' },
  { num: '02', title: "Anatomie d'une video satisfaisante", desc: 'Hook 2s - contexte 3s - resolution 15s - CTA 2s. Structure exacte.' },
  { num: '03', title: "Workflow crea complet en moins d'1h", desc: 'ElevenLabs IA + CapCut. Mes prompts exacts. 3 variantes pretes.' },
  { num: '04', title: 'Le bon format selon ton business', desc: 'App - Produit physique - Service local - SaaS. Chaque cas detaille.' },
  { num: '05', title: "Strategie CPI bas \u2014 forcer l'algo", desc: 'Pourquoi commencer agressif. Les 3 phases. Le rythme exact.' },
  { num: '06', title: 'Modele economique & ROAS', desc: 'LTV, CPA max viable, autofinancement progressif. Simulation reelle.' },
  { num: '07', title: 'Setup campagne Google Ads clic par clic', desc: 'Interface reelle. Zero approximation. Tu crees en meme temps.' },
  { num: '08', title: 'Lire ses metriques \u2014 quand agir', desc: '6 metriques cles. Tableau de diagnostic. 5 situations -> 5 actions.' },
  { num: '09', title: 'Mots-cles negatifs', desc: 'Rapport des termes. Liste de depart. Routine 10 min/semaine.' },
  { num: '10', title: '5 erreurs fatales + plan 30 jours', desc: "Erreurs reelles. Plan d'action semaine par semaine." },
]

const FAQS = [
  { q: "Ca marche si mon app n'a pas encore d'utilisateurs ?", a: "Oui. Ma campagne a 0,07\u20ac/install a ete lancee sur une app recente avec moins de 100 telechargements. Google UAC ne necessite pas une base existante." },
  { q: 'Quel budget minimum pour commencer ?', a: "5 a 10\u20ac par jour suffit. Sur 7 jours : 35 a 70\u20ac de budget pub. C'est le minimum pour que l'algo apprenne correctement." },
  { q: "La methode s'applique a d'autres types de business ?", a: "Oui. La lecon 4 couvre apps, produits physiques, services locaux et SaaS. La strategie budget et les metriques sont universelles." },
  { q: "Zero experience Google Ads \u2014 c'est pour moi ?", a: "Oui. La lecon 7 guide la creation de ta premiere campagne clic par clic dans l'interface reelle. Tu peux suivre en parallele." },
  { q: 'Combien de temps pour voir des resultats ?', a: "L'algo a besoin de 5 a 7 jours pour apprendre. Les premieres conversions apparaissent generalement en fin de premiere semaine." },
  { q: 'Puis-je proposer ce service a des clients ?', a: "Oui. La formation couvre tous les aspects operationnels d'une campagne UAC. Plusieurs acheteurs l'utilisent pour facturer ce service 500 a 1500\u20ac/mois a des apps Android. Le tracker inclus est directement presentable a un client." },
]

function ChevronRight({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px', opacity: 0.85 }}>
      <path d="M6 3L11 8L6 13" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .grid-bg {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(124,58,237,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,58,237,0.07) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
  }

  .light { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; }
  .light-1 {
    width: 600px; height: 600px; top: -200px; left: 50%;
    transform: translateX(-50%);
    background: radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%);
    animation: orbit1 14s ease-in-out infinite alternate;
  }
  .light-2 {
    width: 400px; height: 400px; top: 100px; right: -100px;
    background: radial-gradient(circle, rgba(79,70,229,0.18) 0%, transparent 70%);
    animation: orbit2 18s ease-in-out infinite alternate;
  }
  .light-3 {
    width: 300px; height: 300px; bottom: 0; left: -50px;
    background: radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%);
    animation: orbit3 20s ease-in-out infinite alternate;
  }
  .light-4 {
    width: 200px; height: 200px; top: 40%; right: 10%;
    background: radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%);
    animation: orbit1 16s ease-in-out infinite alternate-reverse;
  }

  @keyframes orbit1 {
    from { transform: translateX(-50%) translateY(0px) scale(1); }
    to   { transform: translateX(-50%) translateY(40px) scale(1.1); }
  }
  @keyframes orbit2 {
    from { transform: translateY(0px) rotate(0deg); }
    to   { transform: translateY(60px) rotate(20deg); }
  }
  @keyframes orbit3 {
    from { transform: translateY(0px); }
    to   { transform: translateY(-40px); }
  }

  @keyframes shimmer {
    0%   { background-position: 0% center; }
    100% { background-position: 200% center; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
    50%       { opacity: 0.7; box-shadow: 0 0 0 6px rgba(74,222,128,0); }
  }

  .btn-primary {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 14px 32px;
    border-radius: 100px;
    border: none; cursor: pointer;
    background: linear-gradient(160deg, #8b5cf6 0%, #6d28d9 60%, #5b21b6 100%);
    color: #fff; font-size: 15px; font-weight: 600; letter-spacing: -0.01em;
    box-shadow:
      0 0 0 1px rgba(124,58,237,0.5),
      0 4px 24px rgba(124,58,237,0.45),
      0 1px 0 rgba(255,255,255,0.04) inset;
    transition: all 0.22s ease;
  }
  .btn-primary::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 50%;
    background: linear-gradient(180deg, rgba(255,255,255,0.13) 0%, transparent 100%);
    border-radius: 100px 100px 0 0;
    pointer-events: none;
  }
  .btn-primary::after {
    content: '';
    position: absolute; top: 0; left: -120%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: skewX(-20deg);
    transition: left 0.55s ease;
    pointer-events: none;
  }
  .btn-primary:hover::after { left: 170%; }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow:
      0 0 0 1px rgba(124,58,237,0.7),
      0 6px 32px rgba(124,58,237,0.6),
      0 1px 0 rgba(255,255,255,0.06) inset;
  }
  .btn-primary:active { transform: translateY(0px); }

  .btn-nav {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center; justify-content: center; gap: 4px;
    padding: 7px 16px;
    border-radius: 100px; border: none; cursor: pointer;
    background: linear-gradient(160deg, #8b5cf6 0%, #6d28d9 100%);
    color: #fff; font-size: 13px; font-weight: 600;
    box-shadow:
      0 0 0 1px rgba(124,58,237,0.45),
      0 2px 14px rgba(124,58,237,0.4),
      inset 0 1px 0 rgba(255,255,255,0.12);
    transition: all 0.2s;
  }
  .btn-nav::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 50%;
    background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%);
    border-radius: 100px 100px 0 0;
    pointer-events: none;
  }
  .btn-nav:hover {
    box-shadow:
      0 0 0 1px rgba(124,58,237,0.7),
      0 4px 20px rgba(124,58,237,0.55),
      inset 0 1px 0 rgba(255,255,255,0.15);
    transform: translateY(-1px);
  }

  .btn-sticky {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center; justify-content: center; gap: 4px;
    padding: 9px 20px;
    border-radius: 100px; border: none; cursor: pointer;
    background: linear-gradient(160deg, #8b5cf6 0%, #6d28d9 100%);
    color: #fff; font-size: 13px; font-weight: 600;
    box-shadow:
      0 0 0 1px rgba(124,58,237,0.5),
      0 2px 16px rgba(124,58,237,0.45),
      inset 0 1px 0 rgba(255,255,255,0.12);
    transition: all 0.2s;
  }
  .btn-sticky::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 50%;
    background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%);
    border-radius: 100px 100px 0 0;
    pointer-events: none;
  }
  .btn-sticky:hover {
    box-shadow:
      0 0 0 1px rgba(124,58,237,0.7),
      0 4px 22px rgba(124,58,237,0.6),
      inset 0 1px 0 rgba(255,255,255,0.15);
    transform: translateY(-1px);
  }

  .hero-line-top {
    display: block;
    text-shadow:
      0 -8px 40px rgba(124,58,237,0.5),
      0 -2px 20px rgba(124,58,237,0.25),
      0 2px 12px rgba(0,0,0,0.7);
  }
  .hero-line-bottom {
    display: block;
    text-shadow:
      0 8px 40px rgba(124,58,237,0.4),
      0 2px 20px rgba(124,58,237,0.2),
      0 -2px 12px rgba(0,0,0,0.7);
  }
  .hero-line-gradient {
    display: block;
    background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #34d399 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 200% auto;
    animation: shimmer 4s linear infinite;
    filter: drop-shadow(0 0 18px rgba(167,139,250,0.45));
  }

  .title-glow-subtle {
    text-shadow:
      0 0 40px rgba(124,58,237,0.25),
      0 2px 16px rgba(0,0,0,0.6);
  }

  .card-glow {
    position: relative; border-radius: 16px; overflow: hidden;
    background: linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(79,70,229,0.08) 100%);
    border: 1px solid rgba(124,58,237,0.3);
  }
  .card-glow::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(167,139,250,0.8), rgba(96,165,250,0.6), transparent);
  }
  .card-glow::after {
    content: '';
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 80%; height: 120px;
    background: radial-gradient(ellipse at top, rgba(124,58,237,0.2) 0%, transparent 70%);
    pointer-events: none;
  }

  .badge-pill {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 16px; border-radius: 100px;
    border: 1px solid rgba(124,58,237,0.4);
    background: rgba(124,58,237,0.1);
  }
  .badge-pill::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 50%;
    background: linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 100%);
    border-radius: 100px 100px 0 0;
  }

  .badge-eb {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center;
    font-size: 11px; font-weight: 700; color: #fbbf24;
    background: rgba(251,191,36,0.1);
    padding: 3px 10px; border-radius: 100px;
    border: 1px solid rgba(251,191,36,0.35);
    box-shadow: 0 0 12px rgba(251,191,36,0.15), inset 0 1px 0 rgba(255,255,255,0.1);
  }
  .badge-eb::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 50%;
    background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%);
    border-radius: 100px 100px 0 0;
  }

  .metric-card {
    position: relative; overflow: hidden;
    padding: 1.25rem 2rem; min-width: 160px;
    transition: transform 0.2s;
  }
  .metric-card::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent);
  }
  .metric-card:hover { transform: translateY(-2px); }

  .module-row {
    display: flex; gap: 1.5rem; padding: 1.25rem 1.5rem;
    border-radius: 10px; align-items: flex-start;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    transition: all 0.2s;
    position: relative; overflow: hidden;
  }
  .module-row::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124,58,237,0), transparent);
    transition: background 0.2s;
  }
  .module-row:hover {
    background: rgba(124,58,237,0.08);
    border-color: rgba(124,58,237,0.2);
    box-shadow: inset 0 1px 0 rgba(167,139,250,0.1);
  }
  .module-row:hover::before {
    background: linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent);
  }

  .problem-card-bad {
    padding: 1.5rem; border-radius: 12px; height: 100%;
    background: rgba(239,68,68,0.05);
    border: 1px solid rgba(239,68,68,0.15);
    position: relative; overflow: hidden;
  }
  .problem-card-bad::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(248,113,113,0.4), transparent);
  }
  .problem-card-good {
    padding: 1.5rem; border-radius: 12px; height: 100%;
    background: rgba(124,58,237,0.08);
    border: 1px solid rgba(124,58,237,0.2);
    position: relative; overflow: hidden;
    transition: all 0.2s;
  }
  .problem-card-good::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent);
  }
  .problem-card-good:hover {
    border-color: rgba(124,58,237,0.4);
    box-shadow: 0 0 30px rgba(124,58,237,0.1);
  }

  .faq-item {
    padding: 1.25rem 1.5rem; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
    cursor: pointer; transition: all 0.2s;
  }
  .faq-item:hover, .faq-item.open {
    background: rgba(124,58,237,0.08);
    border-color: rgba(124,58,237,0.25);
    box-shadow: inset 0 1px 0 rgba(167,139,250,0.1);
  }

  .stat-card {
    text-align: center; padding: 1rem; border-radius: 12px;
    background: rgba(124,58,237,0.06);
    border: 1px solid rgba(124,58,237,0.12);
    position: relative; overflow: hidden;
    transition: transform 0.2s;
  }
  .stat-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent);
  }
  .stat-card:hover { transform: translateY(-3px); }

  .guarantee-box {
    padding: 1.5rem 2rem; border-radius: 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    display: flex; gap: 1rem; align-items: flex-start;
    position: relative; overflow: hidden;
  }
  .guarantee-box::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  }

  .sticky-bar {
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
    padding: 12px 2rem;
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(8,8,16,0.95); backdrop-filter: blur(20px);
    border-top: 1px solid rgba(124,58,237,0.2);
    box-shadow: 0 -8px 40px rgba(124,58,237,0.08);
  }
`

export default function LandingClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ background: '#080810', color: '#e8e8f0', overflowX: 'hidden' }}>
      <style>{GLOBAL_CSS}</style>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 2rem', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(8,8,16,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(124,58,237,0.15)' : 'none',
        boxShadow: scrolled ? '0 1px 30px rgba(124,58,237,0.08)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 600,
          letterSpacing: '0.1em',
          background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          UAC\u00b7METHODE
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ color: '#4ade80', marginRight: '6px' }}>{'\u25cf'}</span>Early bird
          </span>
          <button className="btn-nav" onClick={handleCheckout}>
            197{'\u20ac'} <ChevronRight size={13} />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        padding: '7rem 2rem 4rem', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          <div className="grid-bg" />
          <div className="light light-1" />
          <div className="light light-2" />
          <div className="light light-3" />
          <div className="light light-4" />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '820px' }}>

          {/* Badge */}
          <div className="badge-pill" style={{ marginBottom: '2rem', animation: 'slideUp 0.6s ease both' }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#4ade80', animation: 'pulse 2s ease infinite', display: 'inline-block'
            }} />
            <span style={{
              fontSize: '12px', color: 'rgba(255,255,255,0.7)',
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em'
            }}>
              Formation Google UAC {'\u00b7'} Competence mobile {'\u00b7'} Early bird 197{'\u20ac'}
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(38px,5.5vw,68px)', fontWeight: 800,
            lineHeight: 1.08, letterSpacing: '-0.03em',
            marginBottom: '1.5rem', animation: 'slideUp 0.6s ease 0.1s both'
          }}>
            <span className="hero-line-top">Ma\u00eetrisez Google UAC</span>
            <span className="hero-line-gradient">la comp\u00e9tence mobile</span>
            <span className="hero-line-bottom">la plus sous-exploit\u00e9e</span>
          </h1>

          <p style={{
            fontSize: '18px', color: 'rgba(255,255,255,0.5)', maxWidth: '580px',
            margin: '0 auto 3rem', lineHeight: 1.7, animation: 'slideUp 0.6s ease 0.2s both'
          }}>
            Que vous promouviez votre app ou proposiez ce service \u00e0 vos clients \u2014
            la m\u00e9thode exacte issue de vraies campagnes \u00e0{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>0,07{'\u20ac'}/install</strong>.
          </p>

          {/* Metric cards */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '1px',
            marginBottom: '3rem', animation: 'slideUp 0.6s ease 0.3s both'
          }}>
            {[
              { val: '0,07\u20ac', lbl: 'CPI campagne 1', sub: 'moy. secteur 2,10\u20ac', featured: true },
              { val: '0,54\u20ac', lbl: 'CPI campagne 2', sub: 'moy. secteur 1,80\u20ac', featured: false },
              { val: '0,57\u20ac', lbl: 'CPI campagne 3', sub: 'moy. secteur 2,30\u20ac', featured: false },
            ].map((p, i) => (
              <div key={i} className="metric-card" style={{
                background: p.featured ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${p.featured ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: i === 0 ? '12px 0 0 12px' : i === 2 ? '0 12px 12px 0' : '0',
                boxShadow: p.featured ? '0 0 30px rgba(124,58,237,0.2), inset 0 1px 0 rgba(167,139,250,0.2)' : 'none',
              }}>
                <div style={{
                  fontSize: '28px', fontWeight: 800,
                  background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  filter: p.featured ? 'drop-shadow(0 0 12px rgba(167,139,250,0.5))' : 'none'
                }}>
                  {p.val}
                </div>
                <div style={{
                  fontSize: '11px', color: 'rgba(255,255,255,0.5)',
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px'
                }}>
                  {p.lbl}
                </div>
                <div style={{
                  fontSize: '10px', color: 'rgba(255,255,255,0.25)',
                  fontFamily: "'JetBrains Mono', monospace",
                  textDecoration: 'line-through', marginTop: '2px'
                }}>
                  {p.sub}
                </div>
              </div>
            ))}
          </div>

          {/* CTA bloc */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '14px', animation: 'slideUp 0.6s ease 0.4s both'
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '2px' }}>
              <span style={{
                fontSize: '44px', fontWeight: 800, color: '#fff',
                textShadow: '0 0 30px rgba(255,255,255,0.15), 0 2px 10px rgba(0,0,0,0.5)'
              }}>197{'\u20ac'}</span>
              <span style={{ fontSize: '22px', color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through' }}>297{'\u20ac'}</span>
              <span className="badge-eb">{'\u2193'} Early bird</span>
            </div>
            {/* Countdown */}
            <div style={{
              padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '1rem',
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
            }}>
              <div style={{
                fontSize: '12px', color: '#f87171', fontFamily: "'JetBrains Mono', monospace",
                marginBottom: '10px', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                {'\u23f1'} Prix early bird \u2014 se termine dans
              </div>
              <Countdown targetDate={new Date('2026-06-28T23:59:59')} />
            </div>
            <button className="btn-primary" onClick={handleCheckout}>
              Acc\u00e9der \u00e0 la formation <ChevronRight size={15} />
            </button>
            <div style={{
              display: 'flex', gap: '20px', fontSize: '12px',
              color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace"
            }}>
              {['\u2713 Acc\u00e8s \u00e0 vie', '\u2713 Garantie 30 jours', '\u2713 Templates inclus'].map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{
        padding: '5rem 2rem',
        borderTop: '1px solid rgba(124,58,237,0.12)',
        borderBottom: '1px solid rgba(124,58,237,0.12)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          maxWidth: '780px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem'
        }}>
          {[
            { num: 40, suffix: 'x', label: 'Moins cher que la moyenne' },
            { num: 10, suffix: '+%', label: 'CTR moyen obtenu' },
            { num: 3, suffix: '+', label: 'Campagnes prouv\u00e9es' },
            { num: 30, suffix: 'j', label: 'Garantie remboursement' },
          ].map((s, i) => (
            <AnimatedSection key={i} delay={i * 80}>
              <div className="stat-card">
                <div style={{
                  fontSize: '40px', fontWeight: 800,
                  background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 10px rgba(167,139,250,0.4))'
                }}>
                  <Counter target={s.num} suffix={s.suffix} />
                </div>
                <div style={{
                  fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '6px',
                  fontFamily: "'JetBrains Mono', monospace"
                }}>
                  {s.label}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ padding: '7rem 2rem', maxWidth: '780px', margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#a78bfa',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem'
          }}>\u2014 Le probl\u00e8me</div>
          <h2 className="title-glow-subtle" style={{
            fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800,
            lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1rem'
          }}>
            Pourquoi ton budget<br />dispara\u00eet sans r\u00e9sultats
          </h2>
          <p style={{
            fontSize: '16px', color: 'rgba(255,255,255,0.4)',
            marginBottom: '3rem', maxWidth: '500px'
          }}>
            La plupart des devs font les m\u00eames erreurs. Et Google se fait payer pour les laisser faire.
          </p>
        </AnimatedSection>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { bad: true,  t: 'Ce que tu fais probablement', b: "Pub avec voix qui parle, logo, texte \"D\u00e9couvrez notre app\". CTR de 1%. L'algo te p\u00e9nalise. CPI de 2 \u00e0 3\u20ac. Budget \u00e9puis\u00e9 en 3 jours." },
            { bad: false, t: 'Ce que cette m\u00e9thode fait',   b: "Format visuel satisfaisant sans paroles. CTR de 10 \u00e0 14%. L'algo te r\u00e9compense. CPI qui s'effondre. R\u00e9sultats d\u00e8s le premier lancement." },
            { bad: true,  t: 'La strat\u00e9gie classique',      b: "Budget \u00e9lev\u00e9 d\u00e8s le d\u00e9part. Google le d\u00e9pense vite sur la mauvaise audience. Tu paies pour l'\u00e9ducation de l'algo." },
            { bad: false, t: 'La strat\u00e9gie CPI cible bas',  b: "CPA cible agressif au d\u00e9part. L'algo cherche tes conversions les moins ch\u00e8res. Tu augmentes progressivement." },
          ].map((c, i) => (
            <AnimatedSection key={i} delay={i * 60}>
              <div className={c.bad ? 'problem-card-bad' : 'problem-card-good'}>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: c.bad ? '#f87171' : '#a78bfa' }}>{c.bad ? '\u2717' : '\u2713'}</span>
                  {c.t}
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>{c.b}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* MODULES */}
      <section style={{
        padding: '7rem 2rem',
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(124,58,237,0.1)',
        borderBottom: '1px solid rgba(124,58,237,0.1)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '200px',
          background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#a78bfa',
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem'
            }}>\u2014 La formation</div>
            <h2 className="title-glow-subtle" style={{
              fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '0.75rem'
            }}>
              10 le\u00e7ons. Tout ce qu&apos;il faut.<br />Rien de superflu.
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', marginBottom: '3rem' }}>
              Chaque le\u00e7on est un screencast de mon vrai compte Google Ads. Z\u00e9ro approximation.
            </p>
          </AnimatedSection>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {MODULES.map((m, i) => (
              <AnimatedSection key={i} delay={i * 40}>
                <div className="module-row">
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
                    color: '#a78bfa', fontWeight: 700, minWidth: '28px', marginTop: '2px', opacity: 0.7
                  }}>{m.num}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '3px' }}>{m.title}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{m.desc}</div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* QUI JE SUIS */}
      <section style={{ padding: '7rem 2rem', maxWidth: '780px', margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#a78bfa',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem'
          }}>\u2014 Qui je suis</div>
          <h2 className="title-glow-subtle" style={{
            fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800,
            lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '3rem'
          }}>
            Pas une agence.<br />Quelqu&apos;un qui l&apos;a fait.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <div style={{
            display: 'flex', gap: '3rem', alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: '160px', height: '160px', borderRadius: '16px', overflow: 'hidden',
                border: '1px solid rgba(124,58,237,0.3)',
                boxShadow: '0 0 40px rgba(124,58,237,0.2), 0 1px 0 rgba(167,139,250,0.2) inset',
                position: 'relative',
              }}>
                <img
                  src="/alistair.jpg"
                  alt="Alistair Pass\u00e9-Coutrin"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, transparent 60%, rgba(124,58,237,0.3) 100%)',
                }} />
              </div>
              <div style={{ marginTop: '12px', textAlign: 'center', width: '160px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Alistair P-C.</div>
                <div style={{
                  fontSize: '11px', color: '#a78bfa', fontFamily: "'JetBrains Mono', monospace",
                  marginTop: '2px',
                }}>Cr\u00e9ateur de la formation</div>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '280px' }}>
              <p style={{
                fontSize: '16px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8,
                marginBottom: '1.5rem',
              }}>
                J&apos;ai lanc\u00e9 ma premi\u00e8re campagne Google UAC avec un budget de test.
                R\u00e9sultat : <strong style={{ color: '#fff' }}>0,07{'\u20ac'} par installation</strong>.
                La moyenne du march\u00e9 est entre 1,50{'\u20ac'} et 3{'\u20ac'}.
                J&apos;avais fait 20 \u00e0 40 fois mieux \u2014 sans agence, sans exp\u00e9rience pr\u00e9alable en ads.
              </p>
              <p style={{
                fontSize: '16px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8,
                marginBottom: '2rem',
              }}>
                Ce que j&apos;ai compris ce jour-l\u00e0, c&apos;est que personne dans l&apos;\u00e9cosyst\u00e8me mobile
                francophone n&apos;enseignait vraiment cette comp\u00e9tence.
                J&apos;ai cr\u00e9\u00e9 cette formation pour changer \u00e7a.
              </p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  '\ud83d\udcf1 App publi\u00e9e sur Play Store',
                  '\u26a1 Expert Google UAC',
                  '\ud83d\udee0 D\u00e9veloppeur Flutter',
                  '\ud83c\udf10 Cr\u00e9ateur de sites web',
                ].map((badge, i) => (
                  <span key={i} style={{
                    fontSize: '12px', padding: '5px 12px', borderRadius: '100px',
                    border: '1px solid rgba(124,58,237,0.25)',
                    background: 'rgba(124,58,237,0.08)',
                    color: 'rgba(255,255,255,0.65)',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>{badge}</span>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* TEMOIGNAGES */}
      <section style={{
        padding: '7rem 2rem',
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(124,58,237,0.1)',
        borderBottom: '1px solid rgba(124,58,237,0.1)',
      }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#a78bfa',
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem'
            }}>\u2014 Ils l&apos;ont test\u00e9</div>
            <h2 className="title-glow-subtle" style={{
              fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '3rem'
            }}>
              Les premiers retours
            </h2>
          </AnimatedSection>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                text: "J'avais d\u00e9j\u00e0 essay\u00e9 de faire des pubs Google pour mon app sans r\u00e9sultats. La le\u00e7on 5 sur le CPA cible bas a tout chang\u00e9. En deux semaines j'\u00e9tais sous 0,80\u20ac par install.",
                name: 'Thomas R.',
                role: 'Dev indie Android \u00b7 Paris',
                result: '\u221273% de CPI',
              },
              {
                text: "Ce qui m'a convaincu c'est que les chiffres sont r\u00e9els et v\u00e9rifiables. Pas de promesses floues. La m\u00e9thode sur les cr\u00e9as satisfaisantes m'a permis d'atteindre un CTR de 8% d\u00e8s la premi\u00e8re semaine.",
                name: 'Maxime L.',
                role: "Cr\u00e9ateur d'app \u00b7 Lyon",
                result: 'CTR \u00d74',
              },
              {
                text: "Je pensais avoir besoin d'une agence pour faire des pubs rentables. Maintenant je propose ce service \u00e0 mes clients. Premi\u00e8re mission factur\u00e9e 800\u20ac apr\u00e8s avoir suivi la formation.",
                name: 'Samir B.',
                role: 'Freelance d\u00e9veloppeur \u00b7 Bordeaux',
                result: '800\u20ac premi\u00e8re mission',
              },
            ].map((t, i) => (
              <AnimatedSection key={i} delay={i * 80}>
                <div style={{
                  padding: '1.75rem 2rem', borderRadius: '12px',
                  background: 'rgba(124,58,237,0.06)',
                  border: '1px solid rgba(124,58,237,0.15)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent)',
                  }} />

                  <p style={{
                    fontSize: '14px', color: 'rgba(255,255,255,0.75)',
                    lineHeight: 1.7, marginBottom: '1.25rem', fontStyle: 'italic',
                  }}>
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{t.name}</div>
                      <div style={{
                        fontSize: '11px', color: 'rgba(255,255,255,0.4)',
                        fontFamily: "'JetBrains Mono', monospace", marginTop: '2px',
                      }}>{t.role}</div>
                    </div>
                    <span style={{
                      fontSize: '12px', fontWeight: 700, color: '#4ade80',
                      background: 'rgba(74,222,128,0.1)', padding: '4px 12px',
                      borderRadius: '100px', border: '1px solid rgba(74,222,128,0.2)',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>{t.result}</span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* OFFER */}
      <section id="acheter" style={{ padding: '7rem 2rem', maxWidth: '780px', margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#a78bfa',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem'
          }}>\u2014 L&apos;offre</div>
          <h2 className="title-glow-subtle" style={{
            fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800,
            lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '3rem'
          }}>
            Ce que tu obtiens aujourd&apos;hui
          </h2>
        </AnimatedSection>

        <AnimatedSection>
          <div className="card-glow" style={{ padding: '2.5rem', marginBottom: '16px' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2.5rem' }}>
                {[
                  '10 le\u00e7ons screencast \u2014 mon vrai compte Google Ads ouvert',
                  'Mes 3 vraies campagnes dissequ\u00e9es \u2014 0,07\u20ac \u00b7 0,54\u20ac \u00b7 0,57\u20ac',
                  'Tracker campagne Google Sheets \u2014 tableau de bord hebdo',
                  "Structure de campagne reproductible pour n'importe quel client",
                  "Plan d'action 30 jours \u2014 semaine par semaine",
                  'Acc\u00e8s \u00e0 vie + mises \u00e0 jour incluses',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '14px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#a78bfa', fontWeight: 700, flexShrink: 0, marginTop: '1px', filter: 'drop-shadow(0 0 4px rgba(167,139,250,0.6))' }}>\u2713</span>
                    <span style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '52px', fontWeight: 800, color: '#fff',
                    textShadow: '0 0 30px rgba(255,255,255,0.15), 0 2px 10px rgba(0,0,0,0.5)'
                  }}>197{'\u20ac'}</span>
                  <span style={{ fontSize: '24px', color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through' }}>297{'\u20ac'}</span>
                  <span className="badge-eb">{'\u2193'} Early bird</span>
                </div>
                <p style={{
                  fontSize: '11px', color: 'rgba(255,255,255,0.25)',
                  fontFamily: "'JetBrains Mono', monospace", marginBottom: '1.5rem'
                }}>
                  Prix augmente \u00e0 297{'\u20ac'} au premier palier de ventes.
                </p>
                <button className="btn-primary" onClick={handleCheckout} style={{ width: '100%', padding: '18px 32px', fontSize: '16px', borderRadius: '12px' }}>
                  Acc\u00e9der maintenant pour 197{'\u20ac'} <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <div className="guarantee-box">
            <span style={{ fontSize: '36px', lineHeight: 1, flexShrink: 0 }}>{'\ud83d\udee1'}</span>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Garantie 30 jours \u2014 satisfait ou rembours\u00e9</div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>
                Tu appliques la m\u00e9thode. Si tes r\u00e9sultats ne s&apos;am\u00e9liorent pas, tu m&apos;envoies un email et je te rembourse int\u00e9gralement. Sans question. Sans d\u00e9lai. Je prends le risque \u00e0 ta place.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* FAQ */}
      <section style={{
        padding: '7rem 2rem',
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(124,58,237,0.1)'
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#a78bfa',
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem'
            }}>\u2014 FAQ</div>
            <h2 className="title-glow-subtle" style={{
              fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '2.5rem'
            }}>
              Avant d&apos;acheter
            </h2>
          </AnimatedSection>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {FAQS.map((f, i) => (
              <AnimatedSection key={i} delay={i * 50}>
                <div
                  className={`faq-item ${openFaq === i ? 'open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{f.q}</span>
                    <span style={{
                      color: '#a78bfa', fontSize: '20px',
                      transition: 'transform 0.2s',
                      transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)',
                      flexShrink: 0,
                      filter: 'drop-shadow(0 0 4px rgba(167,139,250,0.5))'
                    }}>+</span>
                  </div>
                  {openFaq === i && (
                    <p style={{
                      fontSize: '13px', color: 'rgba(255,255,255,0.45)',
                      lineHeight: 1.7, marginTop: '12px', marginBottom: 0
                    }}>{f.a}</p>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.18) 0%, transparent 70%)'
        }} />
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <AnimatedSection>
            <h2 className="title-glow-subtle" style={{
              fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1rem'
            }}>
              Une comp\u00e9tence. Un mois.<br />Des missions \u00e0 800{'\u20ac'} pi\u00e8ce derri\u00e8re.
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.4)', marginBottom: '2.5rem' }}>
              Chaque jour sans cette comp\u00e9tence, quelqu&apos;un d&apos;autre la facture \u00e0 ta place.
            </p>
            <button className="btn-primary" onClick={handleCheckout} style={{ fontSize: '17px', padding: '18px 52px' }}>
              Acc\u00e9der pour 197{'\u20ac'} <ChevronRight size={16} />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2rem',
        textAlign: 'center', fontFamily: "'JetBrains Mono', monospace",
        fontSize: '11px', color: 'rgba(255,255,255,0.25)'
      }}>
        {'\u00a9'} 2026 {'\u00b7'} Formation Google UAC {'\u00b7'}{' '}
        <a href="/mentions-legales" style={{ color: 'inherit' }}>Mentions l\u00e9gales</a> {'\u00b7'}{' '}
        <a href="/cgv" style={{ color: 'inherit' }}>CGV</a>
      </footer>

      {/* STICKY BAR */}
      <div className="sticky-bar">
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800 }}>
            197{'\u20ac'}{' '}
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through', fontWeight: 400 }}>297{'\u20ac'}</span>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
            Early bird {'\u00b7'} acc\u00e8s \u00e0 vie {'\u00b7'} garanti 30j
          </div>
        </div>
        <button className="btn-sticky" onClick={handleCheckout}>
          Acc\u00e9der <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}
