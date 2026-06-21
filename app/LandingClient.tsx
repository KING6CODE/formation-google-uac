'use client'

import { useState, useEffect, useRef } from 'react'

const STRIPE_PRICE_ID = 'price_1Tfe3rCIO1w2FVrbVgEYGMNZ'

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

// 5-star component
function StarRating() {
  return (
    <div style={{ display: 'flex', gap: '3px', marginBottom: '10px' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="#FBBF24" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 1l1.854 3.756 4.146.603-3 2.923.708 4.128L8 10.25l-3.708 1.16.708-4.128-3-2.923 4.146-.603L8 1z"/>
        </svg>
      ))}
    </div>
  )
}

const MODULES = [
  { icon: '🎯', num: '01', title: 'Le mécanisme caché derrière un CPI bas', desc: "Comprendre exactement ce que Google récompense — et pourquoi 95% des campagnes paient le prix fort sans le savoir." },
  { icon: '🎬', num: '02', title: 'Créer des publicités qui font baisser ton coût', desc: "Le format précis qui fait grimper ton taux de clic et fait chuter ton CPI, généré en moins d'une heure." },
  { icon: '⚙️', num: '03', title: 'Lancer une campagne qui apprend vite', desc: "La configuration exacte, étape par étape, dans l'interface réelle — pour que l'algorithme trouve tes meilleurs utilisateurs dès les premiers jours." },
  { icon: '📊', num: '04', title: 'Piloter ta campagne comme un pro', desc: "Les métriques qui comptent vraiment, et quoi faire quand un chiffre part dans le mauvais sens." },
  { icon: '💰', num: '05', title: 'Construire un modèle économique rentable', desc: "Calculer ce que tu peux te permettre de payer par utilisateur — et scaler sans jamais perdre d'argent." },
  { icon: '🚀', num: '06', title: 'En faire un service à facturer', desc: "La méthode complète pour proposer ça à des clients et transformer une compétence en revenu récurrent." },
]

const FAQS = [
  { q: "Ça marche si mon app n'a pas encore d'utilisateurs ?", a: "Oui. Ma campagne à 0,07€/install a été lancée sur une app récente avec moins de 100 téléchargements. Google UAC ne nécessite pas une base existante." },
  { q: 'Quel budget minimum pour commencer ?', a: "5 à 10€ par jour suffit. Sur 7 jours : 35 à 70€ de budget pub. C'est le minimum pour que l'algo apprenne correctement." },
  { q: "La méthode s'applique à d'autres types de business ?", a: "Oui. La formation couvre apps, produits physiques, services locaux et SaaS. La stratégie budget et les métriques sont universelles." },
  { q: "Zéro expérience Google Ads — c'est pour moi ?", a: "Oui. Un module entier guide la création de ta première campagne clic par clic dans l'interface réelle. Tu peux suivre en parallèle." },
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

  .badge-discount {
    display: inline-flex; align-items: center;
    font-size: 12px; font-weight: 700; color: #4ade80;
    background: rgba(74,222,128,0.1);
    padding: 3px 10px; border-radius: 100px;
    border: 1px solid rgba(74,222,128,0.3);
  }

  .metric-card {
    position: relative; overflow: hidden;
    padding: 1.25rem 1.5rem; min-width: 120px;
    transition: transform 0.2s;
  }
  .metric-card::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent);
  }
  .metric-card:hover { transform: translateY(-2px); }

  .module-card {
    padding: 1.5rem; border-radius: 14px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.06);
    transition: all 0.2s;
    position: relative; overflow: hidden;
    height: 100%;
  }
  .module-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124,58,237,0), transparent);
    transition: background 0.2s;
  }
  .module-card:hover {
    background: rgba(124,58,237,0.08);
    border-color: rgba(124,58,237,0.25);
    box-shadow: inset 0 1px 0 rgba(167,139,250,0.1), 0 8px 30px rgba(124,58,237,0.08);
    transform: translateY(-2px);
  }
  .module-card:hover::before {
    background: linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent);
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
    padding: 12px 1.5rem;
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(8,8,16,0.95); backdrop-filter: blur(20px);
    border-top: 1px solid rgba(124,58,237,0.2);
    box-shadow: 0 -8px 40px rgba(124,58,237,0.08);
  }

  /* Avatar — grande photo, pas d'anneau animé */
  .avatar-wrap {
    position: relative;
    width: 100%;
    max-width: 340px;
    flex-shrink: 0;
  }
  .avatar-photo-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 2 / 3;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(115, 40, 46,0.3);
    box-shadow: 0 20px 60px rgba(115, 40, 46,0.18), inset 0 1px 0 rgba(255,255,255,0.05);
  }
  .avatar-photo-frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }
  .avatar-glow {
    position: absolute;
    inset: -20px;
    border-radius: 28px;
    background: radial-gradient(circle, rgba(115, 40, 46,0.28) 0%, transparent 5%);
    pointer-events: none;
    z-index: -1;
  }
  .avatar-floating-badge {
    position: absolute;
    padding: 10px 16px;
    border-radius: 12px;
    background: rgba(8,8,16,0.92);
    border: 1px solid rgba(124,58,237,0.4);
    backdrop-filter: blur(10px);
    font-family: 'JetBrains Mono', monospace;
    box-shadow: 0 8px 24px rgba(124,58,237,0.25), inset 0 1px 0 rgba(255,255,255,0.08);
  }
  .check-icon {
    display: inline-flex; align-items: center; justify-content: center;
    width: 18px; height: 18px; border-radius: 5px; flex-shrink: 0;
    background: rgba(74,222,128,0.15);
    border: 1px solid rgba(74,222,128,0.4);
  }

  /* Testimonial card */
  .testimonial-card {
    padding: 1.5rem; border-radius: 14px;
    background: rgba(15,10,30,0.8);
    border: 1px solid rgba(124,58,237,0.18);
    position: relative; overflow: hidden;
  }
  .testimonial-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent);
  }

  /* Hero anchor CTA */
  .btn-anchor {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 22px; border-radius: 100px;
    border: 1px solid rgba(124,58,237,0.4);
    background: rgba(124,58,237,0.08);
    color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
    text-decoration: none;
  }
  .btn-anchor:hover {
    background: rgba(124,58,237,0.15);
    border-color: rgba(124,58,237,0.6);
    color: #fff;
  }

  /* ── Mobile overrides ── */
  @media (max-width: 640px) {
    .hero-section {
      padding: 6rem 1.25rem 3rem !important;
      min-height: auto !important;
    }
    .hero-h1 {
      font-size: 38px !important;
      letter-spacing: -0.02em !important;
    }
    .hero-sub {
      font-size: 15px !important;
    }
    .metric-cards-row {
      flex-direction: column !important;
      gap: 6px !important;
    }
    .metric-card {
      border-radius: 10px !important;
      padding: 1rem 1.25rem !important;
    }
    .stats-grid {
      grid-template-columns: repeat(2,1fr) !important;
    }
    .modules-grid {
      grid-template-columns: 1fr !important;
    }
    .who-flex {
      flex-direction: column !important;
      gap: 2.5rem !important;
      align-items: center !important;
      text-align: center;
    }
    .who-badges {
      justify-content: center !important;
    }
    .avatar-wrap {
      max-width: 260px !important;
    }
    .badge-row {
      gap: 6px !important;
    }
    .offer-card-inner {
      padding: 1.5rem !important;
    }
    .guarantee-box {
      padding: 1.25rem !important;
      flex-direction: column !important;
      gap: 0.75rem !important;
    }
    .sticky-bar {
      padding: 10px 1rem !important;
    }
    .sticky-price {
      font-size: 17px !important;
    }
    .nav-bar {
      padding: 0 1rem !important;
    }
    .section-pad {
      padding: 4rem 1.25rem !important;
    }
    .final-cta-section {
      padding: 5rem 1.25rem !important;
    }
    .countdown-box {
      padding: 0.75rem 1rem !important;
    }
    .cta-price-row {
      flex-wrap: wrap !important;
      gap: 8px !important;
    }
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

  const scrollToOffer = () => {
    document.getElementById('acheter')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ background: '#080810', color: '#e8e8f0', overflowX: 'hidden' }}>
      <style>{GLOBAL_CSS}</style>

      {/* NAV */}
      <nav className="nav-bar" style={{
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
          UAC·METHODE
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ color: '#4ade80', marginRight: '5px' }}>●</span>Early bird
          </span>
          <button className="btn-nav" onClick={scrollToOffer}>
            67€ <ChevronRight size={13} />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section" style={{
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

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px', width: '100%' }}>

          {/* Badge */}
          <div className="badge-pill" style={{ marginBottom: '2rem', animation: 'slideUp 0.6s ease both' }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#4ade80', animation: 'pulse 2s ease infinite', display: 'inline-block', flexShrink: 0
            }} />
            <span style={{
              fontSize: '11px', color: 'rgba(255,255,255,0.7)',
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em'
            }}>
              Formation Google UAC · Early bird −83% · 67€
            </span>
          </div>

          <h1 className="hero-h1" style={{
            fontSize: 'clamp(38px,6vw,64px)', fontWeight: 800,
            lineHeight: 1.1, letterSpacing: '-0.03em',
            marginBottom: '1.5rem', animation: 'slideUp 0.6s ease 0.1s both'
          }}>
            <span className="hero-line-top">Maîtrisez</span>
            <span className="hero-line-gradient">Google UAC</span>
          </h1>

          <p className="hero-sub" style={{
            fontSize: '18px', color: 'rgba(255,255,255,0.55)', maxWidth: '540px',
            margin: '0 auto 2.5rem', lineHeight: 1.7, animation: 'slideUp 0.6s ease 0.2s both'
          }}>
            La méthode exacte pour générer des installs rentables grâce à l&apos;IA —
            sans agence, sans expérience, depuis ton téléphone.
          </p>

          {/* CTA bloc */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '14px', animation: 'slideUp 0.6s ease 0.3s both'
          }}>
            <div className="cta-price-row" style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{
                fontSize: 'clamp(36px,5vw,44px)', fontWeight: 800, color: '#fff',
                textShadow: '0 0 30px rgba(255,255,255,0.15), 0 2px 10px rgba(0,0,0,0.5)'
              }}>67€</span>
              <span style={{ fontSize: 'clamp(18px,3vw,22px)', color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through' }}>394€</span>
              <span className="badge-eb">↓ −83% Early bird</span>
            </div>

            <button className="btn-primary" onClick={handleCheckout} style={{ width: '100%', maxWidth: '360px', padding: '16px 32px' }}>
              Accéder à la formation <ChevronRight size={15} />
            </button>

            {/* Countdown — now visible, not hidden below fold */}
            <div className="countdown-box" style={{
              padding: '1rem 1.5rem', borderRadius: '12px', marginTop: '0.5rem',
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
              width: '100%', maxWidth: '380px',
            }}>
              <div style={{
                fontSize: '11px', color: '#f87171', fontFamily: "'JetBrains Mono', monospace",
                marginBottom: '10px', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                ⏱ Prix early bird — se termine dans
              </div>
              <Countdown targetDate={new Date('2026-06-28T23:59:59')} />
            </div>

            <button className="btn-anchor" onClick={scrollToOffer} style={{ marginTop: '6px' }}>
              Voir ce que tu vas apprendre <ChevronRight size={13} />
            </button>

            <div style={{
              display: 'flex', gap: '16px', fontSize: '11px', flexWrap: 'wrap', justifyContent: 'center',
              color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace"
            }}>
              {['✓ Accès à vie', '✓ Garantie 30 jours', '✓ Templates inclus'].map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section-pad" style={{
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
        <div className="stats-grid" style={{
          maxWidth: '780px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem'
        }}>
          {[
            { num: 0.07, suffix: '€', label: 'CPI le plus bas obtenu', isPrice: true },
            { num: 40, suffix: 'x', label: 'Moins cher que la moyenne' },
            { num: 10, suffix: '+%', label: 'CTR moyen obtenu' },
            { num: 30, suffix: 'j', label: 'Garantie remboursement' },
          ].map((s, i) => (
            <AnimatedSection key={i} delay={i * 80}>
              <div className="stat-card">
                <div style={{
                  fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800,
                  background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 10px rgba(167,139,250,0.4))'
                }}>
                  {s.isPrice ? '0,07€' : <Counter target={s.num} suffix={s.suffix} />}
                </div>
                <div style={{
                  fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '6px',
                  fontFamily: "'JetBrains Mono', monospace"
                }}>
                  {s.label}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CE QUE TU VAS MAITRISER — modules, résultats pas leçons */}
      <section className="section-pad" style={{
        padding: '7rem 2rem',
        background: 'rgba(255,255,255,0.015)',
        borderBottom: '1px solid rgba(124,58,237,0.1)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '200px',
          background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#a78bfa',
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem', textAlign: 'center'
            }}>— Programme complet</div>
            <h2 className="title-glow-subtle" style={{
              fontSize: 'clamp(28px,4.5vw,48px)', fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '0.75rem', textAlign: 'center'
            }}>
              Ce que tu vas <span style={{
                background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>maîtriser</span>
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', marginBottom: '3.5rem', textAlign: 'center', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
              6 modules pour passer de zéro à ta première campagne rentable — basés sur mon vrai compte Google Ads.
            </p>
          </AnimatedSection>
          <div className="modules-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
            {MODULES.map((m, i) => (
              <AnimatedSection key={i} delay={i * 50}>
                <div className="module-card">
                  <div style={{ fontSize: '26px', marginBottom: '14px' }}>{m.icon}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
                    color: '#a78bfa', fontWeight: 700, marginBottom: '8px', opacity: 0.7
                  }}>MODULE {m.num}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', lineHeight: 1.35 }}>{m.title}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{m.desc}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* QUI JE SUIS — version vendeuse, preuve par l'exemple */}
      <section className="section-pad" style={{ padding: '7rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <AnimatedSection>
          <div className="who-flex" style={{
            display: 'flex', gap: '3.5rem', alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            {/* Avatar — grande photo verticale */}
            <div className="avatar-wrap">
              <div className="avatar-glow" />
              <div className="avatar-photo-frame">
                <img
                  src="/alistair.jpg"
                  alt="Alistair Passé-Coutrin"
                />
              </div>
              <div className="avatar-floating-badge" style={{ bottom: '20px', right: '-18px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#a78bfa' }}>0,07€</div>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>CPI obtenu</div>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#a78bfa',
                letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem'
              }}>— Preuve par l&apos;exemple</div>
              <h2 className="title-glow-subtle" style={{
                fontSize: 'clamp(28px,4.5vw,48px)', fontWeight: 800,
                lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1.5rem'
              }}>
                Cette méthode <span style={{
                  background: 'linear-gradient(135deg, #a78bfa, #60a5fa, #34d399)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>a changé ma façon</span> de lancer des apps
              </h2>
              <p style={{
                fontSize: '16px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8,
                marginBottom: '2rem',
              }}>
                Sans agence. Sans expérience préalable en ads. J&apos;ai lancé ma première campagne Google UAC
                avec un simple budget de test, et obtenu <strong style={{ color: '#fff' }}>0,07€ par installation</strong> —
                là où la moyenne du marché tourne entre 1,50€ et 3€. Aujourd&apos;hui je transmets la méthode
                exacte, étape par étape, pour que tu puisses reproduire ce résultat sur ta propre app — ou la
                vendre comme service à tes clients.
              </p>

              <div className="who-badges" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Indépendance totale', sub: 'lance et pilote tes campagnes seul, sans dépendre d\'une agence' },
                  { label: 'Méthode reproductible', sub: 'la même structure appliquée sur 3 campagnes différentes' },
                  { label: 'Aucune compétence requise', sub: 'zéro code, zéro expérience en publicité au départ' },
                  { label: 'Résultats rapides', sub: 'premières données fiables en 5 à 7 jours' },
                ].map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span className="check-icon" style={{ marginTop: '1px' }}>
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 8.5L6.2 11.7L13 4.5" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                      <strong style={{ color: '#fff' }}>{b.label}</strong> — {b.sub}
                    </span>
                  </div>
                ))}
              </div>

              <div className="badge-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2rem' }}>
                {[
                  '📱 App publiée sur Play Store',
                  '⚡ Expert Google UAC',
                  '🛠 Développeur Flutter',
                ].map((badge, i) => (
                  <span key={i} style={{
                    fontSize: '11px', padding: '5px 12px', borderRadius: '100px',
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
      <section className="section-pad" style={{
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
            }}>— Ils l&apos;ont testé</div>
            <h2 className="title-glow-subtle" style={{
              fontSize: 'clamp(26px,4vw,46px)', fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '3rem'
            }}>
              Les premiers retours
            </h2>
          </AnimatedSection>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                text: "J'avais déjà essayé de faire des pubs Google pour mon app sans résultats. Le module sur le CPA cible bas a tout changé. En deux semaines j'étais sous 0,80€ par install.",
                name: 'Thomas R.',
                role: 'Dev indie Android · Paris',
                result: '−73% de CPI',
              },
              {
                text: "Ce qui m'a convaincu c'est que les chiffres sont réels et vérifiables. Pas de promesses floues. La méthode sur les créas satisfaisantes m'a permis d'atteindre un CTR de 8% dès la première semaine.",
                name: 'Maxime L.',
                role: "Créateur d'app · Lyon",
                result: 'CTR ×4',
              },
              {
                text: "Je pensais avoir besoin d'une agence pour faire des pubs rentables. Maintenant je propose ce service à mes clients. Première mission facturée 800€ après avoir suivi la formation.",
                name: 'Samir B.',
                role: 'Freelance développeur · Bordeaux',
                result: '800€ première mission',
              },
            ].map((t, i) => (
              <AnimatedSection key={i} delay={i * 80}>
                <div className="testimonial-card">
                  <StarRating />

                  <p style={{
                    fontSize: '14px', color: 'rgba(255,255,255,0.78)',
                    lineHeight: 1.7, marginBottom: '1.25rem', fontStyle: 'italic',
                  }}>
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
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
      <section id="acheter" className="section-pad" style={{ padding: '7rem 2rem', maxWidth: '780px', margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#a78bfa',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem'
          }}>— L&apos;offre</div>
          <h2 className="title-glow-subtle" style={{
            fontSize: 'clamp(26px,4vw,46px)', fontWeight: 800,
            lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '3rem'
          }}>
            Ce que tu obtiens aujourd&apos;hui
          </h2>
        </AnimatedSection>

        <AnimatedSection>
          <div className="card-glow" style={{ marginBottom: '16px' }}>
            <div className="offer-card-inner" style={{ padding: '2.5rem', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2.5rem' }}>
                {[
                  '6 modules screencast — mon vrai compte Google Ads ouvert',
                  'Mes 3 vraies campagnes disséquées — 0,07€ · 0,54€ · 0,57€',
                  'Tracker campagne Google Sheets — tableau de bord hebdo',
                  "Structure de campagne reproductible pour n'importe quel client",
                  "Plan d'action 30 jours — semaine par semaine",
                  'Accès à vie + mises à jour incluses',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '14px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#a78bfa', fontWeight: 700, flexShrink: 0, marginTop: '1px', filter: 'drop-shadow(0 0 4px rgba(167,139,250,0.6))' }}>✓</span>
                    <span style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem' }}>
                <div className="cta-price-row" style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 'clamp(40px,6vw,52px)', fontWeight: 800, color: '#fff',
                    textShadow: '0 0 30px rgba(255,255,255,0.15), 0 2px 10px rgba(0,0,0,0.5)'
                  }}>67€</span>
                  <span style={{ fontSize: 'clamp(18px,3vw,24px)', color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through' }}>394€</span>
                  <span className="badge-eb">↓ −83% Early bird</span>
                </div>
                <p style={{
                  fontSize: '11px', color: 'rgba(255,255,255,0.25)',
                  fontFamily: "'JetBrains Mono', monospace", marginBottom: '1.5rem'
                }}>
                  Prix augmente à 297€ au premier palier de ventes.
                </p>
                <button className="btn-primary" onClick={handleCheckout} style={{ width: '100%', padding: '18px 32px', fontSize: '16px', borderRadius: '12px' }}>
                  Accéder maintenant pour 67€ <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <div className="guarantee-box">
            <span style={{ fontSize: '36px', lineHeight: 1, flexShrink: 0 }}>🛡</span>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Garantie 30 jours — satisfait ou remboursé</div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>
                Tu appliques la méthode. Si tes résultats ne s&apos;améliorent pas, tu m&apos;envoies un email et je te rembourse intégralement. Sans question. Sans délai. Je prends le risque à ta place.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* FAQ */}
      <section className="section-pad" style={{
        padding: '7rem 2rem',
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(124,58,237,0.1)'
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#a78bfa',
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem'
            }}>— FAQ</div>
            <h2 className="title-glow-subtle" style={{
              fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800,
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
      <section className="final-cta-section" style={{ padding: '8rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
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
              fontSize: 'clamp(28px,5vw,56px)', fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1rem'
            }}>
              Une compétence. Un mois.<br />Des missions à 800€ pièce derrière.
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.4)', marginBottom: '2.5rem' }}>
              Chaque jour sans cette compétence, quelqu&apos;un d&apos;autre la facture à ta place.
            </p>
            <button className="btn-primary" onClick={handleCheckout} style={{ fontSize: '17px', padding: '18px 52px' }}>
              Accéder pour 67€ <ChevronRight size={16} />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2rem 1.5rem',
        textAlign: 'center', fontFamily: "'JetBrains Mono', monospace",
        fontSize: '11px', color: 'rgba(255,255,255,0.25)'
      }}>
        © 2026 · Formation Google UAC ·{' '}
        <a href="/mentions-legales" style={{ color: 'inherit' }}>Mentions légales</a> ·{' '}
        <a href="/cgv" style={{ color: 'inherit' }}>CGV</a>
      </footer>

      {/* STICKY BAR */}
      <div className="sticky-bar">
        <div>
          <div className="sticky-price" style={{ fontSize: '19px', fontWeight: 800 }}>
            67€{' '}
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through', fontWeight: 400 }}>394€</span>
            {' '}
            <span className="badge-discount">−83%</span>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
            Early bird · accès à vie · garanti 30j
          </div>
        </div>
        <button className="btn-sticky" onClick={handleCheckout}>
          Accéder <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}
