'use client'

import { useState } from 'react'
import Link from 'next/link'

// ─── TYPES ───────────────────────────────────────────────
interface FaqItem {
  q: string
  a: string
}

interface Module {
  num: string
  title: string
  desc: string
}

// ─── DATA ────────────────────────────────────────────────
const PROOF = [
  { val: '0,07€', lbl: 'CPI campagne 1', compare: 'moy. secteur : 2,10€' },
  { val: '0,54€', lbl: 'CPI campagne 2', compare: 'moy. secteur : 1,80€' },
  { val: '0,57€', lbl: 'CPI campagne 3', compare: 'moy. secteur : 2,30€' },
]

const MODULES: Module[] = [
  { num: 'L·01', title: 'Pourquoi les pubs sans paroles gagnent en 2026', desc: 'Le mécanisme CTR → Quality Score → CPI. Mes screenshots réels. La preuve que ce n\'est pas de la chance.' },
  { num: 'L·02', title: 'Anatomie d\'une vidéo satisfaisante qui convertit', desc: 'Structure exacte : hook 2s · contexte 3s · résolution 15s · CTA 2s. Les 5 erreurs de créa qui tuent le CTR.' },
  { num: 'L·03', title: 'Créa complète en moins d\'1h — ElevenLabs + CapCut', desc: 'Mon workflow exact. Les outils. Les prompts IA. Le montage. L\'export. 3 variantes prêtes pour Google Ads.' },
  { num: 'L·04', title: 'Le bon format selon ton type de business', desc: 'App · Produit physique · Service local · SaaS. Chaque cas avec sa structure et ses métriques cibles.' },
  { num: 'L·05', title: 'Stratégie CPI bas — forcer l\'algo à travailler pour toi', desc: 'Pourquoi commencer agressif. Les 3 phases. Le rythme d\'augmentation exact. Adapté à chaque business.' },
  { num: 'L·06', title: 'Modèle économique et ROAS — autofinancement progressif', desc: 'LTV, CPA max viable, ROAS cible. La simulation semaine par semaine. La première vente finance la suivante.' },
  { num: 'L·07', title: 'Setup campagne Google Ads — clic par clic', desc: 'Chaque paramètre expliqué dans l\'interface réelle. Zéro approximation. Tu crées ta campagne en même temps.' },
  { num: 'L·08', title: 'Lire ses métriques — quand agir, quand laisser tourner', desc: 'Les 6 métriques qui comptent. Le tableau de diagnostic du lundi. 5 situations → 5 actions précises.' },
  { num: 'L·09', title: 'Mots-clés négatifs — arrêter de payer pour du trafic inutile', desc: 'Le rapport des termes de recherche. La liste de départ prête à copier. La routine maintenance 10 min/semaine.' },
  { num: 'L·10', title: '5 erreurs fatales + plan d\'action 30 jours', desc: 'Les erreurs que j\'ai faites. Comment les éviter. Ce que tu fais exactement chaque semaine pendant 30 jours.' },
]

const INCLUS = [
  '10 leçons screencast — mon vrai compte Google Ads ouvert',
  'Mes 3 vraies campagnes disséquées — 0,07€ · 0,54€ · 0,57€',
  'Tracker campagne Google Sheets — tableau de bord hebdo',
  'Liste de mots-clés négatifs de départ — prête à copier-coller',
  'Plan d\'action 30 jours — jour par jour, semaine par semaine',
  'Accès à vie + mises à jour incluses',
]

const FAQS: FaqItem[] = [
  {
    q: 'Est-ce que ça marche si mon app n\'a pas encore d\'utilisateurs ?',
    a: 'Oui. Ma campagne à 0,07€/install a été lancée sur une app récente avec moins de 100 téléchargements. Google UAC ne nécessite pas une base d\'utilisateurs existante pour fonctionner.',
  },
  {
    q: 'Quel budget minimum pour commencer ?',
    a: '5 à 10€ par jour suffit pour lancer et obtenir des données. Sur 7 jours ça fait 35 à 70€ de budget pub. C\'est l\'investissement minimal pour que l\'algo apprenne correctement.',
  },
  {
    q: 'La méthode s\'applique-t-elle à d\'autres types de business ?',
    a: 'Oui. La leçon 4 couvre les apps, les produits physiques, les services locaux et les SaaS. La stratégie de budget et les métriques sont universelles.',
  },
  {
    q: 'J\'ai zéro expérience en Google Ads — c\'est pour moi ?',
    a: 'Oui. La leçon 7 guide la création de ta première campagne clic par clic dans l\'interface réelle de Google Ads. Tu peux suivre en parallèle sur ton compte.',
  },
  {
    q: 'Combien de temps pour voir des résultats ?',
    a: 'L\'algo a besoin de 5 à 7 jours pour apprendre. Les premières conversions apparaissent généralement en fin de première semaine si la méthode est appliquée correctement.',
  },
]

// ─── STRIPE CHECKOUT ─────────────────────────────────────
// Remplace PRICE_ID par ton vrai Stripe Price ID
const STRIPE_PRICE_ID = 'price_XXXXXXXXXXXXXXXXXXXXXXXX'

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

// ─── SUB-COMPONENTS ──────────────────────────────────────
function FaqItem({ q, a }: FaqItem) {
  const [open, setOpen] = useState(false)
  return (
    <div
      onClick={() => setOpen(!open)}
      className="border-b border-white/8 cursor-pointer py-5 last:border-0"
    >
      <div className="flex justify-between items-center gap-4">
        <span className="font-semibold text-[15px]">{q}</span>
        <span
          className="text-green-400 text-xl shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          +
        </span>
      </div>
      {open && (
        <p className="mt-3 text-[13px] text-white/50 leading-relaxed">{a}</p>
      )}
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────
export default function LandingClient() {
  return (
    <div className="bg-[#0a0a0a] text-[#fafafa] font-sans antialiased">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center
                      px-6 py-4 bg-[#0a0a0a]/85 backdrop-blur-md border-b border-white/8">
        <span className="font-mono text-[12px] font-semibold text-green-400 tracking-wider">
          UAC·MÉTHODE
        </span>
        <button
          onClick={handleCheckout}
          className="font-mono text-[12px] font-semibold px-4 py-2 bg-green-400
                     text-black rounded cursor-pointer hover:opacity-85 transition-opacity"
        >
          67€ — Early bird →
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col justify-center pt-24 pb-16 px-6 max-w-3xl mx-auto">
        <p className="font-mono text-[11px] font-semibold text-green-400 tracking-[0.15em]
                      uppercase mb-6 flex items-center gap-2 before:content-[''] before:w-6
                      before:h-px before:bg-green-400">
          Formation Google UAC · Indie Devs
        </p>

        <h1 className="text-[clamp(36px,6vw,64px)] font-extrabold leading-[1.05]
                       tracking-tight mb-6">
          Obtenez vos installs Android<br />
          à{' '}
          <em className="not-italic text-green-400">moins d'1€</em>
          <br />
          dès la première campagne
        </h1>

        <p className="text-[18px] text-white/60 max-w-xl mb-10 leading-relaxed">
          La méthode exacte issue de mes vraies campagnes. Pas de la théorie —
          des chiffres réels, une structure précise, reproductible sur n'importe quelle app.
        </p>

        {/* Proof numbers */}
        <div className="grid grid-cols-3 border border-white/8 rounded-lg overflow-hidden mb-10">
          {PROOF.map((p) => (
            <div key={p.lbl} className="bg-white/4 px-4 py-5 border-r border-white/8 last:border-0">
              <div className="text-[28px] font-extrabold text-green-400 leading-none mb-1">
                {p.val}
              </div>
              <div className="font-mono text-[10px] text-white/50 uppercase tracking-wider mb-0.5">
                {p.lbl}
              </div>
              <div className="font-mono text-[10px] text-white/25 line-through">
                {p.compare}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-[42px] font-extrabold">67€</span>
            <span className="text-[20px] text-white/40 line-through">97€</span>
            <span className="font-mono text-[11px] font-semibold text-yellow-400
                             bg-yellow-400/10 px-2 py-0.5 rounded">
              Early bird
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="flex items-center gap-2 px-7 py-4 bg-green-400 text-black
                       font-bold text-[15px] rounded-md w-fit hover:opacity-90
                       hover:-translate-y-0.5 transition-all duration-200"
          >
            Accéder à la formation <span className="text-[18px]">→</span>
          </button>
          <div className="flex gap-4 flex-wrap font-mono text-[11px] text-white/40">
            <span>✓ Accès à vie</span>
            <span>✓ Garantie 30 jours</span>
            <span>✓ Templates inclus</span>
          </div>
        </div>
      </section>

      <hr className="border-white/8" />

      {/* ── PROBLÈME ── */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <SectionLabel>Le problème</SectionLabel>
        <h2 className="section-title">Pourquoi ton budget<br />disparaît sans résultats</h2>
        <p className="section-sub">
          La plupart des devs font les mêmes erreurs. Et Google se fait payer pour les laisser les faire.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 border border-white/8 rounded-lg overflow-hidden gap-px bg-white/8">
          {[
            { bad: true, title: 'Ce que tu fais probablement', text: 'Pub avec une voix qui parle, un logo, un texte "Découvrez notre app". CTR de 1%. L\'algo te pénalise. CPI de 2 à 3€. Budget épuisé en 3 jours.' },
            { bad: false, title: 'Ce que cette méthode fait', text: 'Format visuel satisfaisant sans paroles. CTR de 10 à 14%. L\'algo te récompense. CPI qui s\'effondre. Résultats dès le premier lancement.' },
            { bad: true, title: 'La stratégie de budget classique', text: 'Tu mets un budget élevé dès le départ. Google le dépense vite sur de la mauvaise audience. Tu paies pour l\'éducation de l\'algo.' },
            { bad: false, title: 'La stratégie CPI cible bas', text: 'Tu démarres avec un CPA cible agressif. L\'algo cherche tes conversions les moins chères. Tu augmentes progressivement. Il garde les bons profils.' },
          ].map((card) => (
            <div key={card.title} className="bg-[#0a0a0a] p-6">
              <h4 className="text-[13px] font-bold mb-2 flex items-center gap-2">
                <span className={card.bad ? 'text-red-400' : 'text-green-400'}>
                  {card.bad ? '✗' : '✓'}
                </span>
                {card.title}
              </h4>
              <p className="text-[13px] text-white/45 leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-white/8" />

      {/* ── MODULES ── */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <SectionLabel>La formation</SectionLabel>
        <h2 className="section-title">10 leçons. Tout ce qu'il faut.<br />Rien de superflu.</h2>
        <p className="section-sub">
          Chaque leçon est un screencast de mon vrai compte. Chaque décision expliquée.
          Tu peux suivre en parallèle sur ton propre compte.
        </p>
        <div className="flex flex-col border border-white/8 rounded-lg overflow-hidden divide-y divide-white/8">
          {MODULES.map((m) => (
            <div key={m.num} className="flex gap-4 px-6 py-5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <span className="font-mono text-[10px] text-green-400 font-semibold pt-0.5 min-w-[40px]">
                {m.num}
              </span>
              <div>
                <h4 className="text-[14px] font-bold mb-1">{m.title}</h4>
                <p className="text-[12px] text-white/40 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-white/8" />

      {/* ── OFFRE + GARANTIE ── */}
      <section id="acheter" className="py-24 px-6 max-w-3xl mx-auto">
        <SectionLabel>L'offre</SectionLabel>
        <h2 className="section-title">Ce que tu obtiens aujourd'hui</h2>

        <div className="bg-white/[0.03] border border-white/8 rounded-lg p-8 mb-4">
          <ul className="flex flex-col gap-3 mb-8">
            {INCLUS.map((item) => (
              <li key={item} className="flex gap-3 text-[14px]">
                <span className="text-green-400 font-bold shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="border-t border-white/8 pt-6">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-[42px] font-extrabold">67€</span>
              <span className="text-[20px] text-white/40 line-through">97€</span>
              <span className="font-mono text-[11px] font-semibold text-yellow-400
                               bg-yellow-400/10 px-2 py-0.5 rounded">
                ↓ Prix early bird
              </span>
            </div>
            <p className="font-mono text-[11px] text-white/30 mb-6">
              Prix augmente à 97€ au premier palier de ventes.
            </p>
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 px-7 py-4
                         bg-green-400 text-black font-bold text-[16px] rounded-md
                         hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
            >
              Accéder maintenant pour 67€ <span className="text-[18px]">→</span>
            </button>
          </div>
        </div>

        {/* Garantie */}
        <div className="bg-white/[0.02] border border-white/8 rounded-lg p-6 flex gap-5">
          <span className="text-[40px] leading-none">🛡</span>
          <div>
            <h3 className="text-[16px] font-extrabold mb-1">Garantie 30 jours — satisfait ou remboursé</h3>
            <p className="text-[13px] text-white/45 leading-relaxed">
              Tu appliques la méthode. Si tes résultats ne s'améliorent pas, tu m'envoies
              un email et je te rembourse intégralement. Sans question. Sans délai.
              Je prends le risque à ta place.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-white/8" />

      {/* ── FAQ ── */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <SectionLabel>Questions fréquentes</SectionLabel>
        <h2 className="section-title">Avant d'acheter</h2>
        <div className="border border-white/8 rounded-lg px-6 divide-y divide-white/8">
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-6 max-w-3xl mx-auto text-center">
        <h2 className="text-[clamp(28px,5vw,52px)] font-extrabold leading-[1.1]
                       tracking-tight mb-4">
          Lance ta première campagne<br />cette semaine.
        </h2>
        <p className="text-[16px] text-white/50 mb-8">
          Pas la semaine prochaine. Cette semaine. Chaque jour sans campagne
          c'est un jour à payer le prix fort.
        </p>
        <button
          onClick={handleCheckout}
          className="inline-flex items-center gap-2 px-8 py-4 bg-green-400 text-black
                     font-bold text-[16px] rounded-md hover:opacity-90
                     hover:-translate-y-0.5 transition-all duration-200"
        >
          Accéder pour 67€ <span className="text-[18px]">→</span>
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/8 py-8 text-center font-mono
                         text-[11px] text-white/30">
        <p>
          © 2026 · Formation Google UAC ·{' '}
          <Link href="/mentions-legales" className="hover:text-white/60 transition-colors">
            Mentions légales
          </Link>{' '}
          ·{' '}
          <Link href="/cgv" className="hover:text-white/60 transition-colors">
            CGV
          </Link>
        </p>
      </footer>

      {/* ── STICKY BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-between items-center
                      px-6 py-3 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/8">
        <div>
          <div className="text-[20px] font-extrabold">
            67€{' '}
            <span className="text-[14px] text-white/30 line-through font-normal">97€</span>
          </div>
          <div className="font-mono text-[10px] text-white/30">
            Early bird · accès à vie · garanti 30j
          </div>
        </div>
        <button
          onClick={handleCheckout}
          className="font-mono text-[12px] font-semibold px-4 py-2 bg-green-400
                     text-black rounded cursor-pointer hover:opacity-85 transition-opacity"
        >
          Accéder →
        </button>
      </div>

    </div>
  )
}

// ─── HELPER COMPONENTS ───────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] font-semibold text-green-400 tracking-[0.15em]
                  uppercase mb-3 flex items-center gap-2 before:content-['']
                  before:w-4 before:h-px before:bg-green-400">
      {children}
    </p>
  )
}
