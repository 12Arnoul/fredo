import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'AGANER — Annuaire des Talents d\'Aguégués',
    template: '%s | AGANER'
  },
  description: 'Plateforme officielle de recensement et d\'annuaire des cadres et jeunes talents de la commune des Aguégués, Bénin. Portée par la Mairie des Aguégués et l\'ONG AGANER.',
  keywords: ['Aguégués', 'AGANER', 'Bénin', 'annuaire', 'cadres', 'jeunes talents', 'recensement', 'commune'],
  authors: [{ name: 'ONG AGANER' }],
  openGraph: {
    title: 'AGANER — Annuaire des Talents d\'Aguégués',
    description: 'Plateforme de recensement des cadres et jeunes talents de la commune des Aguégués, Bénin.',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AGANER — Aunaire des Talents d\'Aguégués',
    description: 'Plateforme de recensement des cadres et jeunes talents de la commune des Aguégués, Bénin.',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AGANER',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1a6b3c',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <div id="page-wrapper" style={{ minHeight: '100vh' }}>
          {children}
        </div>
        <Footer />
        {/* Styles sidebar layout — décalage automatique des pages */}
        <style>{`
          /* Sur desktop : décale tout le contenu de 240px (largeur sidebar) */
          @media (min-width: 768px) {
            /* Chaque page inclut <Header />, <main> et <Footer />
               Le Header devient la sidebar fixe à gauche.
               On décale le reste (main + footer) via cette règle globale */
            header + main,
            header ~ main,
            main { margin-left: 240px; }
            header + footer,
            header ~ footer,
            footer { margin-left: 240px; }
          }
          @media (max-width: 767px) {
            main, footer { margin-left: 0 !important; }
          }
        `}</style>
      </body>
    </html>
  )
}

