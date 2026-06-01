import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Formation Google UAC — Installs Android à moins d'1€",
  description:
    "La méthode exacte issue de 3 vraies campagnes : 0,07€ · 0,54€ · 0,57€ par installation. 10 leçons screencast. Accès à vie. Garanti 30 jours.",
  openGraph: {
    title: "Formation Google UAC — CPI à 0,07€ prouvé",
    description: "Obtenez vos installs Android à moins d'1€ dès la première campagne.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${syne.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
