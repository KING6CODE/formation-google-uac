'use client'

import { useState, useEffect, useRef } from 'react'

const STRIPE_PRICE_ID = 'price_XXXXXXXXXXXXXXXXXXXXXXXX'

async function handleCheckout() {
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: STRIPE_PRICE_ID }) })
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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
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
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}
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

const MODULES = [
  { num: '01', title: 'Pourquoi les pubs sans paroles gagnent', desc: 'CTR → Quality Score → CPI. Le mécanisme complet avec mes screenshots réels.' },
  { num: '02', title: 'Anatomie d\'une vidéo satisfaisante', desc: 'Hook 2s · contexte 3s · résolution 15s · CTA 2s. Structure exacte.' },
  { num: '03', title: 'Workflow créa complet en moins d\'1h', desc: 'ElevenLabs IA + CapCut. Mes prompts exacts. 3 variantes prêtes.' },
  { num: '04', title: 'Le bon format selon ton business', desc: 'App · Produit physique · Service local · SaaS. Chaque cas détaillé.' },
  { num: '05', title: 'Stratégie CPI bas — forcer l\'algo', desc: 'Pourquoi commencer agressif. Les 3 phases. Le rythme exact.' },
  { num: '06', title: 'Modèle économique & ROAS', desc: 'LTV, CPA max viable, autofinancement progressif. Simulation réelle.' },
  { num: '07', title: 'Setup campagne Google Ads clic par clic', desc: 'Interface réelle. Zéro approximation. Tu crées en même temps.' },
  { num: '08', title: 'Lire ses métriques — quand agir', desc: '6 métriques clés. Tableau de diagnostic. 5 situations → 5 actions.' },
  { num: '09', title: 'Mots-clés négatifs', desc: 'Rapport des termes. Liste de départ. Routine 10 min/semaine.' },
  { num: '10', title: '5 erreurs fatales + plan 30 jours', desc: 'Erreurs réelles. Plan d\'action semaine par semaine.' },
]

const FAQS = [
  { q: 'Ça marche si mon app n\'a pas encore d\'utilisateurs ?', a: 'Oui. Ma campagne à 0,07€/install a été lancée sur une app récente avec moins de 100 téléchargements. Google UAC ne nécessite pas une base existante.' },
  { q: 'Quel budget minimum pour commencer ?', a: '5 à 10€ par jour suffit. Sur 7 jours : 35 à 70€ de budget pub. C\'est le minimum pour que l\'algo apprenne correctement.' },
  { q: 'La méthode s\'applique à d\'autres types de business ?', a: 'Oui. La leçon 4 couvre apps, produits physiques, services locaux et SaaS. La stratégie budget et les métriques sont universelles.' },
  { q: 'Zéro expérience Google Ads — c\'est pour moi ?', a: 'Oui. La leçon 7 guide la création de ta première campagne clic par clic dans l\'interface réelle. Tu peux suivre en parallèle.' },
  { q: 'Combien de temps pour voir des résultats ?', a: 'L\'algo a besoin de 5 à 7 jours pour apprendre. Les premières conversions apparaissent généralement en fin de première semaine.' },
]

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

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 2rem', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(8,8,16,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s ease' }}>
        <span style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', background: 'linear-gradient(90deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          UAC·MÉTHODE
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
            <span style={{ color: '#4ade80', marginRight: '6px' }}>●</span>Early bird
          </span>
          <button
            onClick={handleCheckout}
            style={{
              padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: '#fff', fontSize: '13px', fontWeight: 600,
              boxShadow: '0 0 20px rgba(124,58,237,0.4)',
              transition: 'all 0.2s' }}
          >
            67€ →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '7rem 2rem 4rem', position: 'relative', overflow: 'hidden' }}>

        {/* Animated background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          <div className="grid-bg" />
          <div className="light light-1" />
          <div className="light light-2" />
          <div className="light light-3" />
          <div className="light light-4" />
        </div>



        <div style={{ position: 'relative', zIndex: 1, maxWidth: '780px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', border: '1px solid rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.1)', marginBottom: '2rem', animation: 'slideUp 0.6s ease both' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s ease infinite', display: 'inline-block' }} />
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", letterSpacing: '0.08em' }}>Formation Google UAC · Indie Devs · Early bird 67€</span>
          </div>

          <h1 style={{ fontSize: 'clamp(40px,6vw,72px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem', animation: 'slideUp 0.6s ease 0.1s both' }}>
            Obtenez vos installs Android<br />
            <span style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% auto', animation: 'shimmer 4s linear infinite' }}>
              à moins d'1€
            </span>
            <br />dès la première campagne
          </h1>

          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.55)', maxWidth: '560px', margin: '0 auto 3rem', lineHeight: 1.7, animation: 'slideUp 0.6s ease 0.2s both' }}>
            La méthode exacte issue de mes vraies campagnes. Pas de théorie — des chiffres réels, une structure précise, reproductible sur n'importe quelle app.
          </p>

          {/* Proof metrics */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1px', marginBottom: '3rem', animation: 'slideUp 0.6s ease 0.3s both' }}>
            {[
              { val: '0,07€', lbl: 'CPI campagne 1', sub: 'moy. secteur 2,10€' },
              { val: '0,54€', lbl: 'CPI campagne 2', sub: 'moy. secteur 1,80€' },
              { val: '0,57€', lbl: 'CPI campagne 3', sub: 'moy. secteur 2,30€' },
            ].map((p, i) => (
              <div key={i} style={{
                padding: '1.25rem 2rem',
                background: i === 0 ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${i === 0 ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: i === 0 ? '12px 0 0 12px' : i === 2 ? '0 12px 12px 0' : '0',
                minWidth: '160px' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{p.val}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>{p.lbl}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", textDecoration: 'line-through', marginTop: '2px' }}>{p.sub}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', animation: 'slideUp 0.6s ease 0.4s both' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontSize: '44px', fontWeight: 800, color: '#fff' }}>67€</span>
              <span style={{ fontSize: '22px', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>97€</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '3px 10px', borderRadius: '100px', border: '1px solid rgba(251,191,36,0.3)' }}>Early bird</span>
            </div>
            <button
              onClick={handleCheckout}
              style={{
                padding: '16px 40px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                color: '#fff', fontSize: '16px', fontWeight: 700,
                boxShadow: '0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(124,58,237,0.2)',
                transition: 'all 0.2s', letterSpacing: '-0.01em' }}
              onMouseEnter={e => { (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.target as HTMLButtonElement).style.boxShadow = '0 0 60px rgba(124,58,237,0.7), 0 0 100px rgba(124,58,237,0.3)' }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.transform = 'translateY(0)'; (e.target as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(124,58,237,0.2)' }}
            >
              Accéder à la formation →
            </button>
            <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
              {['✓ Accès à vie', '✓ Garantie 30 jours', '✓ Templates inclus'].map(t => <span key={t}>{t}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '5rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem', textAlign: 'center' }}>
          {[
            { num: 40, suffix: 'x', label: 'Moins cher que la moyenne' },
            { num: 10, suffix: '+%', label: 'CTR moyen obtenu' },
            { num: 3, suffix: ' camps.', label: 'Campagnes prouvées' },
            { num: 30, suffix: 'j', label: 'Garantie remboursement' },
          ].map((s, i) => (
            <AnimatedSection key={i} delay={i * 80}>
              <div style={{ fontSize: '40px', fontWeight: 800, background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                <Counter target={s.num} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '6px', fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>{s.label}</div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ padding: '7rem 2rem', maxWidth: '780px', margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '11px', color: '#a78bfa', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>— Le problème</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Pourquoi ton budget<br />disparaît sans résultats
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', marginBottom: '3rem', maxWidth: '500px' }}>
            La plupart des devs font les mêmes erreurs. Et Google se fait payer pour les laisser faire.
          </p>
        </AnimatedSection>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { bad: true, t: 'Ce que tu fais probablement', b: 'Pub avec voix qui parle, logo, texte "Découvrez notre app". CTR de 1%. L\'algo te pénalise. CPI de 2 à 3€. Budget épuisé en 3 jours.' },
            { bad: false, t: 'Ce que cette méthode fait', b: 'Format visuel satisfaisant sans paroles. CTR de 10 à 14%. L\'algo te récompense. CPI qui s\'effondre. Résultats dès le premier lancement.' },
            { bad: true, t: 'La stratégie classique', b: 'Budget élevé dès le départ. Google le dépense vite sur la mauvaise audience. Tu paies pour l\'éducation de l\'algo.' },
            { bad: false, t: 'La stratégie CPI cible bas', b: 'CPA cible agressif au départ. L\'algo cherche tes conversions les moins chères. Tu augmentes progressivement.' },
          ].map((c, i) => (
            <AnimatedSection key={i} delay={i * 60}>
              <div style={{
                padding: '1.5rem', borderRadius: '12px',
                background: c.bad ? 'rgba(239,68,68,0.05)' : 'rgba(124,58,237,0.08)',
                border: `1px solid ${c.bad ? 'rgba(239,68,68,0.15)' : 'rgba(124,58,237,0.2)'}`,
                height: '100%' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ color: c.bad ? '#f87171' : '#a78bfa' }}>{c.bad ? '✗' : '✓'}</span>
                  {c.t}
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>{c.b}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ── MODULES ── */}
      <section style={{ padding: '7rem 2rem', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '11px', color: '#a78bfa', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>— La formation</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              10 leçons. Tout ce qu'il faut.<br />Rien de superflu.
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', marginBottom: '3rem' }}>
              Chaque leçon est un screencast de mon vrai compte Google Ads. Zéro approximation.
            </p>
          </AnimatedSection>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {MODULES.map((m, i) => (
              <AnimatedSection key={i} delay={i * 40}>
                <div style={{
                  display: 'flex', gap: '1.5rem', padding: '1.25rem 1.5rem',
                  borderRadius: '10px', alignItems: 'flex-start',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(124,58,237,0.08)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(124,58,237,0.2)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.05)' }}
                >
                  <span style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '11px', color: '#a78bfa', fontWeight: 700, minWidth: '28px', marginTop: '2px', opacity: 0.7 }}>{m.num}</span>
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

      {/* ── OFFER ── */}
      <section id="acheter" style={{ padding: '7rem 2rem', maxWidth: '780px', margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '11px', color: '#a78bfa', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>— L'offre</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '3rem' }}>
            Ce que tu obtiens aujourd'hui
          </h2>
        </AnimatedSection>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <AnimatedSection>
            <div style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(124,58,237,0.3)', background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(79,70,229,0.08) 100%)', gridColumn: 'span 2', height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
                {[
                  '10 leçons screencast — mon vrai compte Google Ads ouvert',
                  'Mes 3 vraies campagnes disséquées — 0,07€ · 0,54€ · 0,57€',
                  'Tracker campagne Google Sheets — tableau de bord hebdo',
                  'Liste mots-clés négatifs de départ — prête à copier',
                  'Plan d\'action 30 jours — semaine par semaine',
                  'Accès à vie + mises à jour incluses',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '14px' }}>
                    <span style={{ color: '#a78bfa', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '48px', fontWeight: 800, color: '#fff' }}>67€</span>
                  <span style={{ fontSize: '22px', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>97€</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '3px 10px', borderRadius: '100px', border: '1px solid rgba(251,191,36,0.3)' }}>↓ Early bird</span>
                </div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", marginBottom: '1.5rem' }}>Prix augmente à 97€ au premier palier de ventes.</p>
                <button
                  onClick={handleCheckout}
                  style={{
                    width: '100%', padding: '16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                    color: '#fff', fontSize: '16px', fontWeight: 700,
                    boxShadow: '0 0 30px rgba(124,58,237,0.4)',
                    transition: 'all 0.2s' }}
                >
                  Accéder maintenant pour 67€ →
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Guarantee */}
        <AnimatedSection delay={100}>
          <div style={{ padding: '1.5rem 2rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '36px', lineHeight: 1, flexShrink: 0 }}>🛡</span>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Garantie 30 jours — satisfait ou remboursé</div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>
                Tu appliques la méthode. Si tes résultats ne s'améliorent pas, tu m'envoies un email et je te rembourse intégralement. Sans question. Sans délai. Je prends le risque à ta place.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '7rem 2rem', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '11px', color: '#a78bfa', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>— FAQ</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '2.5rem' }}>Avant d'acheter</h2>
          </AnimatedSection>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {FAQS.map((f, i) => (
              <AnimatedSection key={i} delay={i * 50}>
                <div
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ padding: '1.25rem 1.5rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: openFaq === i ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>{f.q}</span>
                    <span style={{ color: '#a78bfa', fontSize: '20px', transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)', flexShrink: 0 }}>+</span>
                  </div>
                  {openFaq === i && (
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginTop: '12px', marginBottom: 0 }}>{f.a}</p>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <AnimatedSection>
            <h2 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              Lance ta première campagne<br />cette semaine.
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.45)', marginBottom: '2.5rem' }}>
              Chaque jour sans campagne, tu paies le prix fort.
            </p>
            <button
              onClick={handleCheckout}
              style={{
                padding: '18px 48px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                color: '#fff', fontSize: '17px', fontWeight: 700,
                boxShadow: '0 0 60px rgba(124,58,237,0.6)',
                transition: 'all 0.2s' }}
            >
              Accéder pour 67€ →
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2rem', textAlign: 'center', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
        © 2026 · Formation Google UAC · <a href="/mentions-legales" style={{ color: 'inherit' }}>Mentions légales</a> · <a href="/cgv" style={{ color: 'inherit' }}>CGV</a>
      </footer>

      {/* ── STICKY BAR ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        padding: '12px 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(8,8,16,0.95)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800 }}>67€ <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through', fontWeight: 400 }}>97€</span></div>
          <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>Early bird · accès à vie · garanti 30j</div>
        </div>
        <button
          onClick={handleCheckout}
          style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: '#fff', fontSize: '13px', fontWeight: 700, boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}
        >
          Accéder →
        </button>
      </div>
    </div>
  )
}
