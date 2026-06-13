'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Constantes partagées ─────────────────────────────────────────────────────

const STRIPE_PRICE_ID = 'price_1Th5lPCIO1w2FVrbK1c5HM3s'
const DISCOUNT_MINUTES = 10

// ─── Checkout partagé ─────────────────────────────────────────────────────────

async function handleCheckout() {
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: STRIPE_PRICE_ID }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
  } catch (err) {
    console.error('Checkout error:', err)
  }
}

// ─── Landing : hooks utilitaires ──────────────────────────────────────────────

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

// ─── Landing : composants utilitaires ────────────────────────────────────────

function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const { ref, visible } = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
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

function StarRating() {
  return (
    <div style={{ display: 'flex', gap: '3px', marginBottom: '10px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="#FBBF24" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 1l1.854 3.756 4.146.603-3 2.923.708 4.128L8 10.25l-3.708 1.16.708-4.128-3-2.923 4.146-.603L8 1z" />
        </svg>
      ))}
    </div>
  )
}

function ChevronRight({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 16 16" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px', opacity: 0.85 }}
    >
      <path d="M6 3L11 8L6 13" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Landing : données ────────────────────────────────────────────────────────

const MODULES = [
  { num: '01', title: 'Pourquoi les pubs sans paroles gagnent', desc: 'CTR → Quality Score → CPI. Le mécanisme complet avec mes screenshots réels.' },
  { num: '02', title: "Anatomie d'une vidéo satisfaisante", desc: 'Hook 2s – contexte 3s – résolution 15s – CTA 2s. Structure exacte.' },
  { num: '03', title: "Workflow créa complet en moins d'1h", desc: 'ElevenLabs IA + CapCut. Mes prompts exacts. 3 variantes prêtes.' },
  { num: '04', title: 'Le bon format selon ton business', desc: 'App – Produit physique – Service local – SaaS. Chaque cas détaillé.' },
  { num: '05', title: "Stratégie CPI bas — forcer l'algo", desc: 'Pourquoi commencer agressif. Les 3 phases. Le rythme exact.' },
  { num: '06', title: 'Modèle économique & ROAS', desc: 'LTV, CPA max viable, autofinancement progressif. Simulation réelle.' },
  { num: '07', title: 'Setup campagne Google Ads clic par clic', desc: 'Interface réelle. Zéro approximation. Tu crées en même temps.' },
  { num: '08', title: 'Lire ses métriques — quand agir', desc: '6 métriques clés. Tableau de diagnostic. 5 situations → 5 actions.' },
  { num: '09', title: 'Mots-clés négatifs', desc: 'Rapport des termes. Liste de départ. Routine 10 min/semaine.' },
  { num: '10', title: '5 erreurs fatales + plan 30 jours', desc: "Erreurs réelles. Plan d'action semaine par semaine." },
]

const FAQS = [
  {
    q: "Ça marche si mon app n'a pas encore d'utilisateurs ?",
    a: "Oui. Ma campagne à 0,07€/install a été lancée sur une app récente avec moins de 100 téléchargements. Google UAC ne nécessite pas une base existante.",
  },
  {
    q: 'Quel budget minimum pour commencer ?',
    a: "5 à 10€ par jour suffit. Sur 7 jours : 35 à 70€ de budget pub. C'est le minimum pour que l'algo apprenne correctement.",
  },
  {
    q: "La méthode s'applique à d'autres types de business ?",
    a: "Oui. La leçon 4 couvre apps, produits physiques, services locaux et SaaS. La stratégie budget et les métriques sont universelles.",
  },
  {
    q: "Zéro expérience Google Ads — c'est pour moi ?",
    a: "Oui. La leçon 7 guide la création de ta première campagne clic par clic dans l'interface réelle. Tu peux suivre en parallèle.",
  },
  {
    q: 'Combien de temps pour voir des résultats ?',
    a: "L'algo a besoin de 5 à 7 jours pour apprendre. Les premières conversions apparaissent généralement en fin de première semaine.",
  },
  {
    q: 'Puis-je proposer ce service à des clients ?',
    a: "Oui. La formation couvre tous les aspects opérationnels d'une campagne UAC. Plusieurs acheteurs l'utilisent pour facturer ce service 500 à 1500€/mois à des apps Android. Le tracker inclus est directement présentable à un client.",
  },
]

// ─── Landing : CSS global ─────────────────────────────────────────────────────

const LANDING_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; }

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
  @keyframes ring-rotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
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
    padding: 12px 1.5rem;
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(8,8,16,0.95); backdrop-filter: blur(20px);
    border-top: 1px solid rgba(124,58,237,0.2);
    box-shadow: 0 -8px 40px rgba(124,58,237,0.08);
  }

  .avatar-ring-wrap {
    position: relative;
    width: 160px;
    height: 160px;
    flex-shrink: 0;
  }
  .avatar-ring-spin {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(
      #a78bfa 0deg,
      #60a5fa 90deg,
      #34d399 180deg,
      transparent 220deg,
      transparent 360deg
    );
    animation: ring-rotate 6s linear infinite;
  }
  .avatar-ring-inner {
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: #080810;
    overflow: hidden;
  }
  .avatar-ring-inner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }
  .avatar-glow {
    position: absolute;
    inset: -12px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 65%);
    pointer-events: none;
    z-index: -1;
  }

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

  @media (max-width: 640px) {
    .hero-section { padding: 6rem 1.25rem 3rem !important; }
    .hero-h1 { font-size: 36px !important; letter-spacing: -0.02em !important; }
    .hero-sub { font-size: 15px !important; }
    .metric-cards-row { flex-direction: column !important; gap: 6px !important; }
    .metric-card { border-radius: 10px !important; padding: 1rem 1.25rem !important; }
    .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
    .problem-grid { grid-template-columns: 1fr !important; }
    .who-flex { flex-direction: column !important; gap: 2rem !important; align-items: center !important; }
    .avatar-ring-wrap { width: 130px !important; height: 130px !important; }
    .badge-row { gap: 6px !important; }
    .offer-card-inner { padding: 1.5rem !important; }
    .guarantee-box { padding: 1.25rem !important; flex-direction: column !important; gap: 0.75rem !important; }
    .sticky-bar { padding: 10px 1rem !important; }
    .sticky-price { font-size: 17px !important; }
    .nav-bar { padding: 0 1rem !important; }
    .section-pad { padding: 4rem 1.25rem !important; }
    .final-cta-section { padding: 5rem 1.25rem !important; }
    .countdown-box { padding: 0.75rem 1rem !important; }
    .cta-price-row { flex-wrap: wrap !important; gap: 8px !important; }
  }
`

// ─── Quiz : types ─────────────────────────────────────────────────────────────

type Answer = string | null

interface Answers {
  name: string
  profile: Answer
  situation: Answer
  obstacle: Answer
  goal: Answer
}

// ─── Quiz : données ───────────────────────────────────────────────────────────

const PROFILES = [
  { id: 'dev',       icon: '📱', label: 'Dev / indie hacker',    sub: "J'ai une app sur le Play Store" },
  { id: 'freelance', icon: '💼', label: 'Freelance / agence',    sub: 'Je veux vendre ce service à des clients' },
  { id: 'founder',   icon: '🚀', label: 'Fondateur de startup',  sub: "Je gère les pubs de mon produit SaaS ou mobile" },
  { id: 'curious',   icon: '🎯', label: 'Curieux / débutant',    sub: "Je découvre Google Ads et le marketing mobile" },
]

const SITUATIONS = [
  { id: 'never',   icon: '🔰', label: 'Jamais lancé de campagne',              sub: 'Je pars de zéro' },
  { id: 'tried',   icon: '😤', label: "J'ai essayé, résultats décevants",      sub: 'Budget dépensé, peu de résultats' },
  { id: 'running', icon: '📊', label: 'Campagne active mais CPI trop élevé',   sub: "Je veux optimiser ce que j'ai déjà" },
  { id: 'client',  icon: '🤝', label: 'Je gère des campagnes pour des clients', sub: "Je veux améliorer mes résultats client" },
]

const OBSTACLES = [
  { id: 'creatives', icon: '🎬', label: "Je ne sais pas créer des pubs qui convertissent", sub: 'Format, style, durée...' },
  { id: 'budget',    icon: '💸', label: 'Mon budget disparaît sans résultats',              sub: "L'algo mange tout sans convertir" },
  { id: 'metrics',   icon: '📈', label: "Je ne sais pas lire mes métriques",               sub: 'CTR, CPI, ROAS... trop flou' },
  { id: 'setup',     icon: '⚙️', label: 'La configuration de campagne me bloque',          sub: 'Interface Google Ads = terrain miné' },
]

const GOALS = [
  { id: 'installs', icon: '⬇️', label: 'Faire exploser mes installations',    sub: 'Volume maximal, CPI minimum' },
  { id: 'revenue',  icon: '💰', label: 'Générer du revenu avec mon app',       sub: 'IAP, abonnements, monétisation' },
  { id: 'service',  icon: '🏆', label: 'Facturer ce service 500-1500€/mois',  sub: 'Devenir expert pour mes clients' },
  { id: 'learn',    icon: '🎓', label: 'Comprendre la pub mobile pour de bon', sub: 'Bases solides, méthode durable' },
]

// ─── Quiz : logique de résultat personnalisé ──────────────────────────────────

function getResultLines(answers: Answers) {
  const { profile, obstacle, goal } = answers

  const profileLine: Record<string, string> = {
    dev:       "En tant que dev indie, tu as déjà le plus dur : un produit live.",
    freelance: "En tant que freelance, maîtriser Google UAC te permet de facturer une prestation rare.",
    founder:   "En tant que fondateur, chaque euro de pub doit travailler. Cette méthode t'y aide.",
    curious:   "Partir de zéro est un avantage : tu n'as pas de mauvaises habitudes à défaire.",
  }

  const obstacleLine: Record<string, string> = {
    creatives: "La leçon 2 décompose la structure exacte d'une vidéo à CTR élevé — hook 2s, résolution 15s, CTA.",
    budget:    "La leçon 5 explique pourquoi un CPA cible agressif au départ réduit ton CPI de 70%+ en 7 jours.",
    metrics:   "La leçon 8 te donne un tableau de diagnostic : 6 métriques, 5 situations, 5 actions exactes.",
    setup:     "La leçon 7 est un screencast clic par clic dans l'interface réelle. Tu crées ta campagne en parallèle.",
  }

  const goalLine: Record<string, string> = {
    installs: "Objectif installations : mes 3 campagnes montrent 0,07€ – 0,57€ par install. C'est reproductible.",
    revenue:  "La leçon 6 modélise LTV, CPA max viable et autofinancement. Tu sauras exactement quand scale.",
    service:  "Le tracker inclus est présentable directement à un client. Plusieurs acheteurs facturent déjà 800€+ par mission.",
    learn:    "10 leçons, zéro rembourrage. Chaque module a un résultat concret, pas juste de la théorie.",
  }

  return [
    profileLine[profile ?? 'dev'] ?? profileLine.dev,
    obstacleLine[obstacle ?? 'creatives'] ?? obstacleLine.creatives,
    goalLine[goal ?? 'installs'] ?? goalLine.installs,
  ]
}

// ─── Quiz : CSS ───────────────────────────────────────────────────────────────

const QUIZ_CSS = `
  .qf-wrap {
    min-height: 100vh; background: #080810;
    color: #e8e8f0; display: flex; flex-direction: column;
    align-items: center; justify-content: flex-start;
    padding: 2rem 1.25rem 6rem;
    position: relative; overflow: hidden;
  }

  .qf-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%),
      radial-gradient(ellipse 50% 60% at 80% 80%, rgba(79,70,229,0.1) 0%, transparent 60%);
  }
  .qf-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%);
  }

  .qf-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 520px;
    animation: qfSlideIn 0.4s cubic-bezier(0.4,0,0.2,1) both;
  }

  @keyframes qfSlideIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes qfFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes qfShimmer {
    0%   { background-position: 0% center; }
    100% { background-position: 200% center; }
  }
  @keyframes qfPulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
    50%      { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
  }
  @keyframes resultReveal {
    from { opacity: 0; transform: scale(0.97) translateY(12px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes qfRingRotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .btn-next {
    width: 100%; padding: 15px 24px; border-radius: 100px;
    border: none; cursor: pointer; font-size: 15px; font-weight: 700;
    background: linear-gradient(160deg, #8b5cf6 0%, #6d28d9 60%, #5b21b6 100%);
    color: #fff; letter-spacing: -0.01em;
    box-shadow: 0 0 0 1px rgba(124,58,237,0.5), 0 4px 24px rgba(124,58,237,0.45);
    transition: all 0.2s ease; position: relative; overflow: hidden;
    margin-top: 1.5rem;
    font-family: 'Inter', sans-serif;
  }
  .btn-next::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 50%;
    background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%);
    border-radius: 100px 100px 0 0;
  }
  .btn-next:disabled {
    opacity: 0.35; cursor: not-allowed;
    box-shadow: none;
  }
  .btn-next:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 0 0 1px rgba(124,58,237,0.7), 0 6px 32px rgba(124,58,237,0.6);
  }

  .btn-cta-result {
    width: 100%; padding: 18px 28px; border-radius: 14px;
    border: none; cursor: pointer; font-size: 16px; font-weight: 700;
    background: linear-gradient(160deg, #8b5cf6 0%, #6d28d9 60%, #5b21b6 100%);
    color: #fff;
    box-shadow: 0 0 0 1px rgba(124,58,237,0.5), 0 8px 32px rgba(124,58,237,0.5);
    transition: all 0.2s ease; position: relative; overflow: hidden;
    letter-spacing: -0.01em;
    font-family: 'Inter', sans-serif;
  }
  .btn-cta-result::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 50%;
    background: linear-gradient(180deg, rgba(255,255,255,0.13) 0%, transparent 100%);
    border-radius: 14px 14px 0 0;
  }
  .btn-cta-result:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 0 1px rgba(124,58,237,0.8), 0 12px 40px rgba(124,58,237,0.65);
  }

  .name-input {
    width: 100%; padding: 14px 18px; border-radius: 12px;
    border: 1.5px solid rgba(124,58,237,0.3);
    background: rgba(255,255,255,0.04); color: #fff;
    font-size: 20px; font-weight: 700; font-family: 'Inter', sans-serif;
    outline: none; transition: border-color 0.2s;
    caret-color: #a78bfa;
  }
  .name-input::placeholder { color: rgba(255,255,255,0.2); font-weight: 400; font-size: 16px; }
  .name-input:focus { border-color: rgba(167,139,250,0.7); box-shadow: 0 0 0 3px rgba(124,58,237,0.12); }

  .gradient-text {
    background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #34d399 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-size: 200% auto; animation: qfShimmer 4s linear infinite;
  }

  .result-line {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 14px 16px; border-radius: 10px;
    background: rgba(124,58,237,0.07); border: 1px solid rgba(124,58,237,0.15);
    animation: qfFadeIn 0.5s ease both;
  }

  .logo-mark {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px; font-weight: 700; letter-spacing: 0.1em;
    background: linear-gradient(90deg, #a78bfa, #60a5fa);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }

  .btn-see-landing {
    background: none; border: none; cursor: pointer;
    font-size: 12px; color: rgba(255,255,255,0.3);
    font-family: 'JetBrains Mono', monospace;
    text-decoration: none; padding: 0;
    transition: color 0.2s;
  }
  .btn-see-landing:hover { color: rgba(255,255,255,0.6); }

  @media (max-width: 480px) {
    .qf-wrap { padding: 1.5rem 1rem 5rem; }
    .btn-cta-result { font-size: 15px; padding: 16px 20px; }
  }
`

// ─── Quiz : sous-composants ───────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div style={{ width: '100%', marginBottom: '2.5rem' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '8px',
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
          color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em',
        }}>
          ÉTAPE {step} / {total}
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
          color: '#a78bfa',
        }}>{pct}%</span>
      </div>
      <div style={{
        height: '3px', borderRadius: '100px',
        background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: '100px',
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
          transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 0 8px rgba(167,139,250,0.6)',
        }} />
      </div>
    </div>
  )
}

function ChoiceCard({
  icon, label, sub, selected, onClick,
}: {
  icon: string; label: string; sub: string; selected: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        padding: '1rem 1.25rem', borderRadius: '12px',
        background: selected ? 'rgba(124,58,237,0.18)' : 'rgba(255,255,255,0.03)',
        border: `1.5px solid ${selected ? 'rgba(167,139,250,0.6)' : 'rgba(255,255,255,0.07)'}`,
        boxShadow: selected ? '0 0 0 1px rgba(124,58,237,0.3), 0 0 20px rgba(124,58,237,0.12)' : 'none',
        display: 'flex', alignItems: 'center', gap: '1rem',
        transition: 'all 0.18s ease',
        position: 'relative', overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
      } as React.CSSProperties}
    >
      {selected && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.8), transparent)',
        }} />
      )}
      <span style={{ fontSize: '24px', flexShrink: 0, lineHeight: 1 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '14px', fontWeight: 600,
          color: selected ? '#fff' : 'rgba(255,255,255,0.8)',
          marginBottom: '2px',
        }}>{label}</div>
        <div style={{
          fontSize: '12px',
          color: selected ? 'rgba(167,139,250,0.8)' : 'rgba(255,255,255,0.35)',
          fontFamily: "'JetBrains Mono', monospace",
        }}>{sub}</div>
      </div>
      <div style={{
        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
        border: `1.5px solid ${selected ? '#a78bfa' : 'rgba(255,255,255,0.15)'}`,
        background: selected ? '#7c3aed' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.18s ease',
      }}>
        {selected && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4.2 7.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </button>
  )
}

function UrgencyTimer({ minutes }: { minutes: number }) {
  const endRef = useRef(Date.now() + minutes * 60 * 1000)
  const [secs, setSecs] = useState(minutes * 60)

  useEffect(() => {
    const t = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endRef.current - Date.now()) / 1000))
      setSecs(remaining)
      if (remaining === 0) clearInterval(t)
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const m = Math.floor(secs / 60)
  const s = secs % 60
  const expired = secs === 0

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '6px 16px', borderRadius: '100px',
      background: 'rgba(239,68,68,0.08)',
      border: `1px solid ${expired ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.25)'}`,
    }}>
      <span style={{ fontSize: '13px' }}>⏱</span>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: '13px',
        fontWeight: 700, color: expired ? '#6b7280' : '#f87171',
      }}>
        {expired
          ? 'Offre expirée'
          : `Réduction réservée encore ${m}:${String(s).padStart(2, '0')}`
        }
      </span>
    </div>
  )
}

// ─── Composant quiz (interne) ─────────────────────────────────────────────────

function QuizFunnelInner({ onShowLanding }: { onShowLanding: () => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({
    name: '', profile: null, situation: null, obstacle: null, goal: null,
  })
  const [nameInput, setNameInput] = useState('')
  const [animKey, setAnimKey] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const TOTAL_STEPS = 5

  function next() {
    setStep(s => s + 1)
    setAnimKey(k => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function setChoice(field: keyof Omit<Answers, 'name'>, value: string) {
    setAnswers(a => ({ ...a, [field]: value }))
  }

  const firstName = answers.name.trim().split(' ')[0] || 'toi'

  useEffect(() => {
    if (step === 5 && !showResult) {
      setLoading(true)
      const t = setTimeout(() => {
        setLoading(false)
        setShowResult(true)
      }, 1800)
      return () => clearTimeout(t)
    }
  }, [step, showResult])

  const resultLines = getResultLines(answers)

  // ── Étape 0 : Prénom ────────────────────────────────────────────────────────
  const StepName = (
    <div className="qf-card" key={`step-${animKey}`}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '5px 14px', borderRadius: '100px',
          border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.08)',
          marginBottom: '2rem',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#4ade80', display: 'block', animation: 'qfPulse 2s ease infinite',
          }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
            color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em',
          }}>
            Diagnostic Google UAC · 60 sec
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(26px,5vw,36px)', fontWeight: 800,
          lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.02em',
        }}>
          On va personnaliser<br />
          <span className="gradient-text">ta stratégie UAC</span>
        </h1>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
          5 questions. Résultat immédiat.<br />On commence par toi.
        </p>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{
          display: 'block', fontSize: '13px', fontWeight: 600,
          color: 'rgba(255,255,255,0.5)', marginBottom: '10px',
          fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          Ton prénom
        </label>
        <input
          className="name-input"
          type="text"
          placeholder="Thomas, Maxime, Samir..."
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && nameInput.trim().length > 0) {
              setAnswers(a => ({ ...a, name: nameInput.trim() }))
              next()
            }
          }}
          autoFocus
        />
      </div>
      <p style={{
        fontSize: '11px', color: 'rgba(255,255,255,0.2)',
        fontFamily: "'JetBrains Mono', monospace", marginBottom: '0',
      }}>
        Utilisé uniquement pour personnaliser ta recommandation.
      </p>

      <button
        className="btn-next"
        disabled={nameInput.trim().length === 0}
        onClick={() => {
          setAnswers(a => ({ ...a, name: nameInput.trim() }))
          next()
        }}
      >
        Commencer →
      </button>
    </div>
  )

  // ── Étape 1 : Profil ────────────────────────────────────────────────────────
  const StepProfile = (
    <div className="qf-card" key={`step-${animKey}`}>
      <ProgressBar step={1} total={TOTAL_STEPS} />
      <h2 style={{
        fontSize: 'clamp(20px,4vw,26px)', fontWeight: 800,
        marginBottom: '0.5rem', letterSpacing: '-0.02em',
      }}>
        {firstName}, tu es plutôt…
      </h2>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>
        Choisis ce qui te correspond le mieux.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {PROFILES.map(p => (
          <ChoiceCard
            key={p.id} icon={p.icon} label={p.label} sub={p.sub}
            selected={answers.profile === p.id}
            onClick={() => setChoice('profile', p.id)}
          />
        ))}
      </div>
      <button className="btn-next" disabled={!answers.profile} onClick={next}>
        Continuer →
      </button>
    </div>
  )

  // ── Étape 2 : Situation ─────────────────────────────────────────────────────
  const StepSituation = (
    <div className="qf-card" key={`step-${animKey}`}>
      <ProgressBar step={2} total={TOTAL_STEPS} />
      <h2 style={{
        fontSize: 'clamp(20px,4vw,26px)', fontWeight: 800,
        marginBottom: '0.5rem', letterSpacing: '-0.02em',
      }}>
        Où en es-tu avec Google Ads ?
      </h2>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>
        Sois honnête — c&apos;est ce qui rend le résultat utile.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {SITUATIONS.map(s => (
          <ChoiceCard
            key={s.id} icon={s.icon} label={s.label} sub={s.sub}
            selected={answers.situation === s.id}
            onClick={() => setChoice('situation', s.id)}
          />
        ))}
      </div>
      <button className="btn-next" disabled={!answers.situation} onClick={next}>
        Continuer →
      </button>
    </div>
  )

  // ── Étape 3 : Obstacle ──────────────────────────────────────────────────────
  const StepObstacle = (
    <div className="qf-card" key={`step-${animKey}`}>
      <ProgressBar step={3} total={TOTAL_STEPS} />
      <h2 style={{
        fontSize: 'clamp(20px,4vw,26px)', fontWeight: 800,
        marginBottom: '0.5rem', letterSpacing: '-0.02em',
      }}>
        Ton plus gros blocage en ce moment ?
      </h2>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>
        Ce qu&apos;on va résoudre en priorité.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {OBSTACLES.map(o => (
          <ChoiceCard
            key={o.id} icon={o.icon} label={o.label} sub={o.sub}
            selected={answers.obstacle === o.id}
            onClick={() => setChoice('obstacle', o.id)}
          />
        ))}
      </div>
      <button className="btn-next" disabled={!answers.obstacle} onClick={next}>
        Continuer →
      </button>
    </div>
  )

  // ── Étape 4 : Objectif ──────────────────────────────────────────────────────
  const StepGoal = (
    <div className="qf-card" key={`step-${animKey}`}>
      <ProgressBar step={4} total={TOTAL_STEPS} />
      <h2 style={{
        fontSize: 'clamp(20px,4vw,26px)', fontWeight: 800,
        marginBottom: '0.5rem', letterSpacing: '-0.02em',
      }}>
        Dans 30 jours, tu veux surtout…
      </h2>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>
        Ça définit la trajectoire de ton plan d&apos;action.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {GOALS.map(g => (
          <ChoiceCard
            key={g.id} icon={g.icon} label={g.label} sub={g.sub}
            selected={answers.goal === g.id}
            onClick={() => setChoice('goal', g.id)}
          />
        ))}
      </div>
      <button
        className="btn-next"
        disabled={!answers.goal}
        onClick={() => {
          setAnswers(a => ({ ...a }))
          next()
        }}
      >
        Voir mon résultat →
      </button>
    </div>
  )

  // ── Étape 5 : Résultat ──────────────────────────────────────────────────────
  const StepResult = (
    <div className="qf-card" key={`step-${animKey}`} style={{ maxWidth: '560px' }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <svg
              width="48" height="48" viewBox="0 0 48 48" fill="none"
              style={{ animation: 'qfRingRotate 1s linear infinite' }}
            >
              <circle cx="24" cy="24" r="20" stroke="rgba(124,58,237,0.15)" strokeWidth="4" />
              <path d="M24 4 A20 20 0 0 1 44 24" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '12px',
            color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em',
          }}>
            Analyse de ton profil en cours…
          </p>
        </div>
      ) : (
        <div style={{ animation: 'resultReveal 0.6s cubic-bezier(0.4,0,0.2,1) both' }}>
          {/* En-tête résultat */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '100px', marginBottom: '1.5rem',
              background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)',
            }}>
              <span style={{ fontSize: '14px' }}>✓</span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
                color: '#4ade80', letterSpacing: '0.08em',
              }}>
                ANALYSE COMPLÈTE
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(24px,5vw,34px)', fontWeight: 800,
              lineHeight: 1.15, marginBottom: '0.75rem', letterSpacing: '-0.02em',
            }}>
              <span className="gradient-text">{firstName}</span>,<br />
              cette formation est<br />faite pour toi.
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
              Voici pourquoi, selon tes réponses :
            </p>
          </div>

          {/* Lignes personnalisées */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '2rem' }}>
            {resultLines.map((line, i) => (
              <div className="result-line" key={i} style={{ animationDelay: `${i * 120}ms` }}>
                <span style={{
                  color: '#a78bfa', fontWeight: 700, flexShrink: 0,
                  marginTop: '1px', filter: 'drop-shadow(0 0 4px rgba(167,139,250,0.6))',
                }}>✓</span>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: 0 }}>
                  {line}
                </p>
              </div>
            ))}
          </div>

          {/* Urgence */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <UrgencyTimer minutes={DISCOUNT_MINUTES} />
          </div>

          {/* Bloc offre */}
          <div style={{
            padding: '1.5rem', borderRadius: '16px', marginBottom: '1rem',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(79,70,229,0.1) 100%)',
            border: '1px solid rgba(124,58,237,0.35)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.8), transparent)',
            }} />

            <div style={{ marginBottom: '1rem' }}>
              {[
                '10 leçons screencast — vrai compte Google Ads',
                '3 campagnes disséquées — 0,07€ · 0,54€ · 0,57€/install',
                'Tracker Google Sheets + plan 30 jours inclus',
                'Accès à vie + mises à jour',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ color: '#a78bfa', fontWeight: 700, flexShrink: 0, fontSize: '14px' }}>✓</span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1rem' }}>
              <div style={{
                display: 'flex', alignItems: 'baseline', gap: '10px',
                marginBottom: '4px', flexWrap: 'wrap',
              }}>
                <span style={{ fontSize: '42px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                  197€
                </span>
                <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through' }}>394€</span>
                <span style={{
                  fontSize: '12px', fontWeight: 700, color: '#fbbf24',
                  background: 'rgba(251,191,36,0.1)', padding: '3px 10px',
                  borderRadius: '100px', border: '1px solid rgba(251,191,36,0.3)',
                }}>−50% Early bird</span>
              </div>
              <p style={{
                fontSize: '11px', color: 'rgba(255,255,255,0.25)',
                fontFamily: "'JetBrains Mono', monospace", marginBottom: '1rem',
              }}>
                Garantie 30 jours — satisfait ou remboursé, sans question.
              </p>

              <button className="btn-cta-result" onClick={handleCheckout}>
                Accéder maintenant pour 197€ →
              </button>
            </div>
          </div>

          {/* Preuve sociale */}
          <div style={{
            padding: '1rem 1.25rem', borderRadius: '12px',
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', gap: '12px', alignItems: 'flex-start',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: 700, color: '#fff',
            }}>T</div>
            <div>
              <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <svg key={i} width="12" height="12" viewBox="0 0 16 16" fill="#FBBF24">
                    <path d="M8 1l1.854 3.756 4.146.603-3 2.923.708 4.128L8 10.25l-3.708 1.16.708-4.128-3-2.923 4.146-.603L8 1z" />
                  </svg>
                ))}
              </div>
              <p style={{
                fontSize: '12px', color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.5, margin: 0, fontStyle: 'italic',
              }}>
                &ldquo;En deux semaines j&apos;étais sous 0,80€ par install. La leçon 5 a tout changé.&rdquo;
              </p>
              <p style={{
                fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '4px',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                Thomas R. · Dev Android · −73% de CPI
              </p>
            </div>
          </div>

          {/* Lien vers la landing page complète */}
          <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              className="btn-see-landing"
              onClick={onShowLanding}
            >
              ← Voir la page complète de la formation
            </button>
          </p>
        </div>
      )}
    </div>
  )

  const steps = [StepName, StepProfile, StepSituation, StepObstacle, StepGoal, StepResult]

  return (
    <div className="qf-wrap">
      <style>{QUIZ_CSS}</style>
      <div className="qf-bg" />
      <div className="qf-grid" />

      {/* Logo + navigation retour */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '520px', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="logo-mark">UAC·METHODE</span>
          {step > 0 && step < 5 && (
            <button
              onClick={() => { setStep(s => Math.max(0, s - 1)); setAnimKey(k => k + 1) }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '12px', color: 'rgba(255,255,255,0.3)',
                fontFamily: "'JetBrains Mono', monospace",
                padding: '4px 8px',
              }}
            >
              ← Retour
            </button>
          )}
        </div>
      </div>

      {steps[step]}
    </div>
  )
}

// ─── Composant landing page (interne) ────────────────────────────────────────

function LandingPageInner() {
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
      <style>{LANDING_CSS}</style>

      {/* NAV */}
      <nav className="nav-bar" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 2rem', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(8,8,16,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(124,58,237,0.15)' : 'none',
        boxShadow: scrolled ? '0 1px 30px rgba(124,58,237,0.08)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 600,
          letterSpacing: '0.1em',
          background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          UAC·METHODE
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            fontSize: '12px', color: 'rgba(255,255,255,0.45)',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <span style={{ color: '#4ade80', marginRight: '5px' }}>●</span>Early bird
          </span>
          <button className="btn-nav" onClick={scrollToOffer}>
            197€ <ChevronRight size={13} />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section" style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        padding: '7rem 2rem 5rem', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          <div className="grid-bg" />
          <div className="light light-1" />
          <div className="light light-2" />
          <div className="light light-3" />
          <div className="light light-4" />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '820px', width: '100%' }}>

          {/* Badge live */}
          <div className="badge-pill" style={{ marginBottom: '2rem', animation: 'slideUp 0.6s ease both' }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#4ade80', animation: 'pulse 2s ease infinite',
              display: 'inline-block', flexShrink: 0,
            }} />
            <span style={{
              fontSize: '11px', color: 'rgba(255,255,255,0.7)',
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.06em',
            }}>
              Formation Google UAC · Early bird −50% · 197€
            </span>
          </div>

          <h1 className="hero-h1" style={{
            fontSize: 'clamp(36px,5.5vw,68px)', fontWeight: 800,
            lineHeight: 1.08, letterSpacing: '-0.03em',
            marginBottom: '1.5rem', animation: 'slideUp 0.6s ease 0.1s both',
          }}>
            <span className="hero-line-top">Maîtrisez Google UAC</span>
            <span className="hero-line-gradient">la compétence mobile</span>
            <span className="hero-line-bottom">la plus sous-exploitée</span>
          </h1>

          <p className="hero-sub" style={{
            fontSize: '17px', color: 'rgba(255,255,255,0.5)', maxWidth: '560px',
            margin: '0 auto 2.5rem', lineHeight: 1.7, animation: 'slideUp 0.6s ease 0.2s both',
          }}>
            Que vous promouviez votre app ou proposiez ce service à vos clients —
            la méthode exacte issue de vraies campagnes à{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>0,07€/install</strong>.
          </p>

          {/* Metric cards */}
          <div className="metric-cards-row" style={{
            display: 'flex', justifyContent: 'center', gap: '1px',
            marginBottom: '2.5rem', animation: 'slideUp 0.6s ease 0.3s both',
            width: '100%',
          }}>
            {[
              { val: '0,07€', lbl: 'CPI campagne 1', sub: 'moy. secteur 2,10€', featured: true },
              { val: '0,54€', lbl: 'CPI campagne 2', sub: 'moy. secteur 1,80€', featured: false },
              { val: '0,57€', lbl: 'CPI campagne 3', sub: 'moy. secteur 2,30€', featured: false },
            ].map((p, i) => (
              <div key={i} className="metric-card" style={{
                flex: 1,
                background: p.featured ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${p.featured ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: i === 0 ? '12px 0 0 12px' : i === 2 ? '0 12px 12px 0' : '0',
                boxShadow: p.featured ? '0 0 30px rgba(124,58,237,0.2), inset 0 1px 0 rgba(167,139,250,0.2)' : 'none',
              }}>
                <div style={{
                  fontSize: 'clamp(22px,4vw,28px)', fontWeight: 800,
                  background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  filter: p.featured ? 'drop-shadow(0 0 12px rgba(167,139,250,0.5))' : 'none',
                }}>
                  {p.val}
                </div>
                <div style={{
                  fontSize: '10px', color: 'rgba(255,255,255,0.5)',
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px',
                }}>
                  {p.lbl}
                </div>
                <div style={{
                  fontSize: '10px', color: 'rgba(255,255,255,0.25)',
                  fontFamily: "'JetBrains Mono', monospace",
                  textDecoration: 'line-through', marginTop: '2px',
                }}>
                  {p.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Bloc CTA hero */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '14px', animation: 'slideUp 0.6s ease 0.4s both',
          }}>
            <div className="cta-price-row" style={{
              display: 'flex', alignItems: 'baseline', gap: '12px',
              marginBottom: '2px', flexWrap: 'wrap', justifyContent: 'center',
            }}>
              <span style={{
                fontSize: 'clamp(36px,5vw,44px)', fontWeight: 800, color: '#fff',
                textShadow: '0 0 30px rgba(255,255,255,0.15), 0 2px 10px rgba(0,0,0,0.5)',
              }}>197€</span>
              <span style={{
                fontSize: 'clamp(18px,3vw,22px)', color: 'rgba(255,255,255,0.25)',
                textDecoration: 'line-through',
              }}>394€</span>
              <span className="badge-eb">↓ −50% Early bird</span>
            </div>

            {/* Compte à rebours */}
            <div className="countdown-box" style={{
              padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '0.5rem',
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

            <button className="btn-primary" onClick={handleCheckout} style={{ width: '100%', maxWidth: '360px', padding: '16px 32px' }}>
              Accéder à la formation <ChevronRight size={15} />
            </button>

            <button className="btn-anchor" onClick={scrollToOffer}>
              Voir ce qui est inclus <ChevronRight size={13} />
            </button>

            <div style={{
              display: 'flex', gap: '16px', fontSize: '11px', flexWrap: 'wrap',
              justifyContent: 'center', color: 'rgba(255,255,255,0.3)',
              fontFamily: "'JetBrains Mono', monospace",
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
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="stats-grid" style={{
          maxWidth: '780px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem',
        }}>
          {[
            { num: 40, suffix: 'x',   label: 'Moins cher que la moyenne' },
            { num: 10, suffix: '+%',  label: 'CTR moyen obtenu' },
            { num: 3,  suffix: '+',   label: 'Campagnes prouvées' },
            { num: 30, suffix: 'j',   label: 'Garantie remboursement' },
          ].map((s, i) => (
            <AnimatedSection key={i} delay={i * 80}>
              <div className="stat-card">
                <div style={{
                  fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800,
                  background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 10px rgba(167,139,250,0.4))',
                }}>
                  <Counter target={s.num} suffix={s.suffix} />
                </div>
                <div style={{
                  fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '6px',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {s.label}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* PROBLÈME */}
      <section className="section-pad" style={{ padding: '7rem 2rem', maxWidth: '780px', margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#a78bfa',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem',
          }}>— Le problème</div>
          <h2 className="title-glow-subtle" style={{
            fontSize: 'clamp(26px,4vw,46px)', fontWeight: 800,
            lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1rem',
          }}>
            Pourquoi ton budget<br />disparaît sans résultats
          </h2>
          <p style={{
            fontSize: '16px', color: 'rgba(255,255,255,0.4)',
            marginBottom: '3rem', maxWidth: '500px',
          }}>
            La plupart des devs font les mêmes erreurs. Et Google se fait payer pour les laisser faire.
          </p>
        </AnimatedSection>
        <div className="problem-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            {
              bad: true,
              t: 'Ce que tu fais probablement',
              b: "Pub avec voix qui parle, logo, texte \"Découvrez notre app\". CTR de 1%. L'algo te pénalise. CPI de 2 à 3€. Budget épuisé en 3 jours.",
            },
            {
              bad: false,
              t: 'Ce que cette méthode fait',
              b: "Format visuel satisfaisant sans paroles. CTR de 10 à 14%. L'algo te récompense. CPI qui s'effondre. Résultats dès le premier lancement.",
            },
            {
              bad: true,
              t: 'La stratégie classique',
              b: "Budget élevé dès le départ. Google le dépense vite sur la mauvaise audience. Tu paies pour l'éducation de l'algo.",
            },
            {
              bad: false,
              t: 'La stratégie CPI cible bas',
              b: "CPA cible agressif au départ. L'algo cherche tes conversions les moins chères. Tu augmentes progressivement.",
            },
          ].map((c, i) => (
            <AnimatedSection key={i} delay={i * 60}>
              <div className={c.bad ? 'problem-card-bad' : 'problem-card-good'}>
                <div style={{
                  fontSize: '13px', fontWeight: 700, marginBottom: '8px',
                  display: 'flex', gap: '8px', alignItems: 'center',
                }}>
                  <span style={{ color: c.bad ? '#f87171' : '#a78bfa' }}>{c.bad ? '✗' : '✓'}</span>
                  {c.t}
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>{c.b}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* MODULES */}
      <section className="section-pad" style={{
        padding: '7rem 2rem',
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(124,58,237,0.1)',
        borderBottom: '1px solid rgba(124,58,237,0.1)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '200px',
          background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#a78bfa',
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem',
            }}>— La formation</div>
            <h2 className="title-glow-subtle" style={{
              fontSize: 'clamp(26px,4vw,46px)', fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '0.75rem',
            }}>
              10 leçons. Tout ce qu&apos;il faut.<br />Rien de superflu.
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', marginBottom: '3rem' }}>
              Chaque leçon est un screencast de mon vrai compte Google Ads. Zéro approximation.
            </p>
          </AnimatedSection>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {MODULES.map((m, i) => (
              <AnimatedSection key={i} delay={i * 40}>
                <div className="module-row">
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
                    color: '#a78bfa', fontWeight: 700, minWidth: '28px', marginTop: '2px', opacity: 0.7,
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
      <section className="section-pad" style={{ padding: '7rem 2rem', maxWidth: '780px', margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#a78bfa',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem',
          }}>— Qui je suis</div>
          <h2 className="title-glow-subtle" style={{
            fontSize: 'clamp(26px,4vw,46px)', fontWeight: 800,
            lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '3rem',
          }}>
            Pas une agence.<br />Quelqu&apos;un qui l&apos;a fait.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <div className="who-flex" style={{
            display: 'flex', gap: '3rem', alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}>
            {/* Avatar animé */}
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div className="avatar-ring-wrap">
                <div className="avatar-glow" />
                <div className="avatar-ring-spin" />
                <div className="avatar-ring-inner">
                  <img
                    src="/alistair.jpg"
                    alt="Alistair Passé-Coutrin"
                  />
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Alistair P-C.</div>
                <div style={{
                  fontSize: '11px', color: '#a78bfa',
                  fontFamily: "'JetBrains Mono', monospace", marginTop: '4px',
                }}>Créateur de la formation</div>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '260px' }}>
              <p style={{
                fontSize: '16px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8,
                marginBottom: '1.5rem',
              }}>
                J&apos;ai lancé ma première campagne Google UAC avec un budget de test.
                Résultat : <strong style={{ color: '#fff' }}>0,07€ par installation</strong>.
                La moyenne du marché est entre 1,50€ et 3€.
                J&apos;avais fait 20 à 40 fois mieux — sans agence, sans expérience préalable en ads.
              </p>
              <p style={{
                fontSize: '16px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8,
                marginBottom: '2rem',
              }}>
                Ce que j&apos;ai compris ce jour-là, c&apos;est que personne dans l&apos;écosystème mobile
                francophone n&apos;enseignait vraiment cette compétence.
                J&apos;ai créé cette formation pour changer ça.
              </p>

              <div className="badge-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  '📱 App publiée sur Play Store',
                  '⚡ Expert Google UAC',
                  '🛠 Développeur Flutter',
                  '🌐 Créateur de sites web',
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

      {/* TÉMOIGNAGES */}
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
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem',
            }}>— Ils l&apos;ont testé</div>
            <h2 className="title-glow-subtle" style={{
              fontSize: 'clamp(26px,4vw,46px)', fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '3rem',
            }}>
              Les premiers retours
            </h2>
          </AnimatedSection>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                text: "J'avais déjà essayé de faire des pubs Google pour mon app sans résultats. La leçon 5 sur le CPA cible bas a tout changé. En deux semaines j'étais sous 0,80€ par install.",
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
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', flexWrap: 'wrap', gap: '8px',
                  }}>
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

      {/* OFFRE */}
      <section id="acheter" className="section-pad" style={{ padding: '7rem 2rem', maxWidth: '780px', margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#a78bfa',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem',
          }}>— L&apos;offre</div>
          <h2 className="title-glow-subtle" style={{
            fontSize: 'clamp(26px,4vw,46px)', fontWeight: 800,
            lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '3rem',
          }}>
            Ce que tu obtiens aujourd&apos;hui
          </h2>
        </AnimatedSection>

        <AnimatedSection>
          <div className="card-glow" style={{ marginBottom: '16px' }}>
            <div className="offer-card-inner" style={{ padding: '2.5rem', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2.5rem' }}>
                {[
                  '10 leçons screencast — mon vrai compte Google Ads ouvert',
                  'Mes 3 vraies campagnes disséquées — 0,07€ · 0,54€ · 0,57€',
                  'Tracker campagne Google Sheets — tableau de bord hebdo',
                  "Structure de campagne reproductible pour n'importe quel client",
                  "Plan d'action 30 jours — semaine par semaine",
                  'Accès à vie + mises à jour incluses',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '14px', alignItems: 'flex-start' }}>
                    <span style={{
                      color: '#a78bfa', fontWeight: 700, flexShrink: 0, marginTop: '1px',
                      filter: 'drop-shadow(0 0 4px rgba(167,139,250,0.6))',
                    }}>✓</span>
                    <span style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem' }}>
                <div className="cta-price-row" style={{
                  display: 'flex', alignItems: 'baseline', gap: '12px',
                  marginBottom: '8px', flexWrap: 'wrap',
                }}>
                  <span style={{
                    fontSize: 'clamp(40px,6vw,52px)', fontWeight: 800, color: '#fff',
                    textShadow: '0 0 30px rgba(255,255,255,0.15), 0 2px 10px rgba(0,0,0,0.5)',
                  }}>197€</span>
                  <span style={{
                    fontSize: 'clamp(18px,3vw,24px)', color: 'rgba(255,255,255,0.25)',
                    textDecoration: 'line-through',
                  }}>394€</span>
                  <span className="badge-eb">↓ −50% Early bird</span>
                </div>
                <p style={{
                  fontSize: '11px', color: 'rgba(255,255,255,0.25)',
                  fontFamily: "'JetBrains Mono', monospace", marginBottom: '1.5rem',
                }}>
                  Prix augmente à 297€ au premier palier de ventes.
                </p>
                <button
                  className="btn-primary"
                  onClick={handleCheckout}
                  style={{ width: '100%', padding: '18px 32px', fontSize: '16px', borderRadius: '12px' }}
                >
                  Accéder maintenant pour 197€ <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <div className="guarantee-box">
            <span style={{ fontSize: '36px', lineHeight: 1, flexShrink: 0 }}>🛡</span>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>
                Garantie 30 jours — satisfait ou remboursé
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>
                Tu appliques la méthode. Si tes résultats ne s&apos;améliorent pas, tu m&apos;envoies un email
                et je te rembourse intégralement. Sans question. Sans délai. Je prends le risque à ta place.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* FAQ */}
      <section className="section-pad" style={{
        padding: '7rem 2rem',
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(124,58,237,0.1)',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#a78bfa',
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem',
            }}>— FAQ</div>
            <h2 className="title-glow-subtle" style={{
              fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '2.5rem',
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
                      filter: 'drop-shadow(0 0 4px rgba(167,139,250,0.5))',
                    }}>+</span>
                  </div>
                  {openFaq === i && (
                    <p style={{
                      fontSize: '13px', color: 'rgba(255,255,255,0.45)',
                      lineHeight: 1.7, marginTop: '12px', marginBottom: 0,
                    }}>{f.a}</p>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="final-cta-section" style={{
        padding: '8rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.18) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <AnimatedSection>
            <h2 className="title-glow-subtle" style={{
              fontSize: 'clamp(28px,5vw,56px)', fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1rem',
            }}>
              Une compétence. Un mois.<br />Des missions à 800€ pièce derrière.
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.4)', marginBottom: '2.5rem' }}>
              Chaque jour sans cette compétence, quelqu&apos;un d&apos;autre la facture à ta place.
            </p>
            <button className="btn-primary" onClick={handleCheckout} style={{ fontSize: '17px', padding: '18px 52px' }}>
              Accéder pour 197€ <ChevronRight size={16} />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2rem 1.5rem',
        textAlign: 'center', fontFamily: "'JetBrains Mono', monospace",
        fontSize: '11px', color: 'rgba(255,255,255,0.25)',
      }}>
        © 2026 · Formation Google UAC ·{' '}
        <a href="/mentions-legales" style={{ color: 'inherit' }}>Mentions légales</a> ·{' '}
        <a href="/cgv" style={{ color: 'inherit' }}>CGV</a>
      </footer>

      {/* BARRE STICKY */}
      <div className="sticky-bar">
        <div>
          <div className="sticky-price" style={{ fontSize: '19px', fontWeight: 800 }}>
            197€{' '}
            <span style={{
              fontSize: '13px', color: 'rgba(255,255,255,0.25)',
              textDecoration: 'line-through', fontWeight: 400,
            }}>394€</span>
            {' '}
            <span className="badge-discount">−50%</span>
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
            color: 'rgba(255,255,255,0.3)', marginTop: '2px',
          }}>
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

// ─── Composant principal exporté ──────────────────────────────────────────────

export default function LandingClient() {
  const [showLanding, setShowLanding] = useState(false)

  const handleShowLanding = () => {
    setShowLanding(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!showLanding) {
    return <QuizFunnelInner onShowLanding={handleShowLanding} />
  }

  return <LandingPageInner />
}
