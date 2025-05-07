import type { Metadata } from 'next'
import { Inter, Lexend } from 'next/font/google'
import './globals.css'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { WhatsAppChat } from './components/WhatsAppChat'
import NotificationProvider from '@/app/components/NotificationProvider'
import { I18nProvider } from '@/lib/i18n/i18nContext'

// Load Inter for body text
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Load Lexend for headings
const lexend = Lexend({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export const metadata: Metadata = {
  title: 'Loandify - Find Your Perfect Loan',
  description: 'Apply for personal loans from multiple lenders with a single application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lexend.variable} ${inter.className}`}>
        <I18nProvider>
          <NotificationProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <WhatsAppChat phoneNumber="+6588888888" welcomeMessage="Hello, I'm interested in learning more about Loandify's loan services." />
            </div>
          </NotificationProvider>
        </I18nProvider>
      </body>
    </html>
  )
} 