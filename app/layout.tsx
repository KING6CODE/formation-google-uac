import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Formation Google UAC — Installs Android à moins d'1€",
  description:
    "La méthode exacte issue de 3 vraies campagnes : 0,07€ · 0,54€ · 0,57€ par installation. 10 leçons screencast. Accès à vie. Garanti 30 jours.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
