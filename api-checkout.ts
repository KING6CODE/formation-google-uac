// app/api/checkout/route.ts
// Stripe Checkout Session — à placer dans app/api/checkout/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json()

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],

      // ─── URLs de redirection ───────────────────────────
      success_url: `${process.env.NEXT_PUBLIC_URL}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/#acheter`,

      // ─── Métadonnées pour Zapier/webhook ──────────────
      metadata: {
        product: 'formation-google-uac',
        price_id: priceId,
      },

      // ─── Options de paiement ──────────────────────────
      payment_method_types: ['card'],
      locale: 'fr',

      // ─── Email collecté automatiquement ───────────────
      // Stripe le récupère — Zapier le transmet à Brevo
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
