// app/api/webhook/route.ts
// Stripe Webhook → déclenche Zapier → Gumroad + Brevo
// À placer dans app/api/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    // ─── Données à envoyer à Zapier ───────────────────
    const payload = {
      email: session.customer_details?.email,
      name: session.customer_details?.name,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency,
      session_id: session.id,
      product: session.metadata?.product,
      timestamp: new Date().toISOString(),
    }

    // ─── Zapier Webhook (remplace par ton URL Zapier) ──
    const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL!

    await fetch(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    // ─── Log Google Sheets via Zapier ─────────────────
    // Zapier se charge de :
    // 1. Créer l'accès Gumroad
    // 2. Ajouter dans Brevo (séquence email)
    // 3. Logger dans Google Sheets

    console.log('✓ Paiement traité:', payload.email, payload.amount + '€')
  }

  return NextResponse.json({ received: true })
}
