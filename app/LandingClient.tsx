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
  { num: '01', title: 'Pourquoi les pubs sans paroles gagnent', desc: 'CTR → Quality Score → CPI. Le mécanisme complet avec mes screenshots réels.' },
  { num: '02', title: "Anatomie d'une vidéo satisfaisante", desc: 'Hook 2s · contexte 3s · résolution 15s · CTA 2s. Structure exacte.' },
  { num: '03', title: "Workflow créa complet en moins d'1h", desc: 'ElevenLabs IA + CapCut. Mes prompts exacts. 3 variantes prêtes.' },
  { num: '04', title: 'Le bon format selon ton business', desc: 'App · Produit physique · Service local · SaaS. Chaque cas détaillé.' },
  { num: '05', title: "Stratégie CPI bas — forcer l'algo", desc: 'Pourquoi commencer agressif. Les 3 phases. Le rythme exact.' },
  { num: '06', title: 'Modèle économique & ROAS', desc: 'LTV, CPA max viable, autofinancement progressif. Simulation réelle.' },
  { num: '07', title: 'Setup campagne Google Ads clic par clic', desc: 'Interface réelle. Zéro approximation. Tu crées en même temps.' },
  { num: '08', title: 'Lire ses métriques — quand agir', desc: '6 métriques clés. Tableau de diagnostic. 5 situations → 5 actions.' },
  { num: '09', title: 'Mots-clés négatifs', desc: 'Rapport des termes. Liste de départ. Routine 10 min/semaine.' },
  { num: '10', title: '5 erreurs fatales + plan 30 jours', desc: 'Erreurs réelles. Plan d\'action semaine par semaine.' },
]

const FAQS = [
  { q: "Ça marche si mon app n'a pas encore d'utilisateurs ?", a: "Oui. Ma campagne à 0,07€/install a été lancée sur une app récente avec moins de 100 téléchargements. Google UAC ne nécessite pas une base existante." },
  { q: 'Quel budget minimum pour commencer ?', a: "5 à 10€ par jour suffit. Sur 7 jours : 35 à 70€ de budget pub. C'est le minimum pour que l'algo apprenne correctement." },
  { q: "La méthode s'applique à d'autres types de business ?", a: "Oui. La leçon 4 couvre apps, produits physiques, services locaux et SaaS. La stratégie budget et les métriques sont universelles." },
  { q: 'Zéro expérience Google Ads — c\'est pour moi ?', a: "Oui. La leçon 7 guide la création de ta première campagne clic par clic dans l'interface réelle. Tu peux suivre en parallèle." },
  { q: 'Combien de temps pour voir des résultats ?', a: "L'algo a besoin de 5 à 7 jours pour apprendre. Les premières conversions apparaissent généralement en fin de première semaine." },
  { q: 'Puis-je proposer ce service à des clients ?', a: "Oui. La formation couvre tous les aspects opérationnels d'une campagne UAC. Plusieurs acheteurs l'utilisent pour facturer ce service 500 à 1500€/mois à des apps Android. Le tracker inclus est directement présentable à un client." },
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

      {/* ── NAV ── */}
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
          UAC·MÉTHODE
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ color: '#4ade80', marginRight: '6px' }}>●</span>Early bird
          </span>
          <button className="btn-nav" onClick={handleCheckout}>
            197€ <ChevronRight size={13} />
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
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
              Formation Google UAC · Compétence mobile · Early bird 197€
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(38px,5.5vw,68px)', fontWeight: 800,
            lineHeight: 1.08, letterSpacing: '-0.03em',
            marginBottom: '1.5rem', animation: 'slideUp 0.6s ease 0.1s both'
          }}>
            <span className="hero-line-top">Maîtrisez Google UAC</span>
            <span className="hero-line-gradient">la compétence mobile</span>
            <span className="hero-line-bottom">la plus sous-exploitée</span>
          </h1>

          <p style={{
            fontSize: '18px', color: 'rgba(255,255,255,0.5)', maxWidth: '580px',
            margin: '0 auto 3rem', lineHeight: 1.7, animation: 'slideUp 0.6s ease 0.2s both'
          }}>
            Que vous promouviez votre app ou proposiez ce service à vos clients —
            la méthode exacte issue de vraies campagnes à{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>0,07€/install</strong>.
          </p>

          {/* Metric cards */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '1px',
            marginBottom: '3rem', animation: 'slideUp 0.6s ease 0.3s both'
          }}>
            {[
              { val: '0,07€', lbl: 'CPI campagne 1', sub: 'moy. secteur 2,10€', featured: true },
              { val: '0,54€', lbl: 'CPI campagne 2', sub: 'moy. secteur 1,80€', featured: false },
              { val: '0,57€', lbl: 'CPI campagne 3', sub: 'moy. secteur 2,30€', featured: false },
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
              }}>197€</span>
              <span style={{ fontSize: '22px', color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through' }}>297€</span>
              <span className="badge-eb">↓ Early bird</span>
            </div>
            {/* Compteur urgence */}
            <div style={{
              padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '1rem',
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
            }}>
              <div style={{
                fontSize: '12px', color: '#f87171', fontFamily: "'JetBrains Mono', monospace",
                marginBottom: '10px', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                ⏱ Prix early bird — se termine dans
              </div>
              <Countdown targetDate={new Date('2026-06-28T23:59:59')} />
            </div>
            <button className="btn-primary" onClick={handleCheckout}>
              Accéder à la formation <ChevronRight size={15} />
            </button>
            <div style={{
              display: 'flex', gap: '20px', fontSize: '12px',
              color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace"
            }}>
              {['✓ Accès à vie', '✓ Garantie 30 jours', '✓ Templates inclus'].map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
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
            { num: 3, suffix: '+', label: 'Campagnes prouvées' },
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

      {/* ── PROBLEM ── */}
      <section style={{ padding: '7rem 2rem', maxWidth: '780px', margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#a78bfa',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem'
          }}>— Le problème</div>
          <h2 className="title-glow-subtle" style={{
            fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800,
            lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1rem'
          }}>
            Pourquoi ton budget<br />disparaît sans résultats
          </h2>
          <p style={{
            fontSize: '16px', color: 'rgba(255,255,255,0.4)',
            marginBottom: '3rem', maxWidth: '500px'
          }}>
            La plupart des devs font les mêmes erreurs. Et Google se fait payer pour les laisser faire.
          </p>
        </AnimatedSection>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="problem-card-bad">
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f87171', marginBottom: '1rem' }}>L'erreur classique</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              Laisser Google UAC gérer vos assets textuels et créatifs sans structure claire. L'algorithme tourne en boucle, dépense votre budget sur des placements inefficaces et fait exploser votre coût par installation (CPI).
            </p>
          </div>
          <div className="problem-card-good">
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#4ade80', marginBottom: '1rem' }}>La Méthode UAC</h3>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              Forcer l'apprentissage de l'algorithme avec une structure créative ultra-déterminée (Hook, contexte, CTA) combinée à un timing de scaling précis pour verrouiller un CPI bas dès la première semaine.
            </p>
          </div>
        </div>
      </section>

      {/* ── PROGRAMME ── */}
      <section style={{ padding: '4rem 2rem 7rem', maxWidth: '780px', margin: '0 auto' }}>
        <h2 className="title-glow-subtle" style={{ fontSize: '32px', fontWeight: 800, marginBottom: '2.5rem' }}>Au programme de la formation</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {MODULES.map((m, i) => (
            <div key={i} className="module-row">
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: 700, color: '#a78bfa' }}>{m.num}</span>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{m.title}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '0 2rem 7rem', maxWidth: '780px', margin: '0 auto' }}>
        <h2 className="title-glow-subtle" style={{ fontSize: '32px', fontWeight: 800, marginBottom: '2.5rem', textAlign: 'center' }}>Questions fréquentes</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map((f, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{f.q}</h3>
                <span style={{ color: '#a78bfa', transform: openFaq === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>➔</span>
              </div>
              {openFaq === i && (
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginTop: '10px', lineHeight: 1.6 }}>{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── STICKY BAR ── */}
      {scrolled && (
        <div className="sticky-bar">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.4)' }}>FORMATION GOOGLE UAC</span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>197€ <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through', fontWeight: 400 }}>297€</span></span>
          </div>
          <button className="btn-sticky" onClick={handleCheckout}>
            Rejoindre la formation <ChevronRight size={13} />
          </button>
        </div>
      )}
    </div>
  )
}
