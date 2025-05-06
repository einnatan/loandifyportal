'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import NotificationCenter from './NotificationCenter'
import { LanguageSwitcher } from './LanguageSwitcher'

export default function Navigation() {
  return (
    <nav className="border-b py-4 bg-white shadow-sm">
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-primary">
            Loandify
          </Link>
          <ul className="hidden md:flex ml-10 space-x-6 text-sm font-medium">
            <li>
              <Link href="/" className="text-gray-700 hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-gray-700 hover:text-primary">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/documents" className="text-gray-700 hover:text-primary">
                Documents
              </Link>
            </li>
            <li>
              <Link href="/recommendations" className="text-gray-700 hover:text-primary">
                Recommendations
              </Link>
            </li>
            <li>
              <Link href="/loyalty" className="text-gray-700 hover:text-primary">
                Loyalty
              </Link>
            </li>
            <li>
              <Link href="/refer" className="text-gray-700 hover:text-primary">
                Refer
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="mr-2">
            <LanguageSwitcher />
          </div>
          <NotificationCenter />
          <div className="hidden md:block mr-4 text-sm text-gray-600">
            Logged in as Lauren Tan
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/apply">Apply</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
} 