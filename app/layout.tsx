import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Formation Google UAC — Installs Android à moins d’1€',
  description:
    "La méthode exacte issue de 3 vraies campagnes : 0,07€ • 0,54€ • 0,57€ par installation. 10 leçons screencast.",
  openGraph: {
    title: 'Formation Google UAC — CPI à 0,07€ prouvé',
    description:
      "Obtenez vos installs Android à moins d'1€ dès la première campagne.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={outfit.variable}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YSQTV7LZZB"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-YSQTV7LZZB');
          `}
        </Script>
      </head>

      <body>{children}</body>
    </html>
  )
}
