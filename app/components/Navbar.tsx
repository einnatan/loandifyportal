'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Bell } from 'lucide-react'
import NotificationCenter from './NotificationCenter'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-100 py-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-2xl text-gradient text-gradient-primary">
          Loandify
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-700 hover:text-primary transition-colors" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-8">
          <li>
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Home
            </Link>
          </li>
          <li>
            <Link href="/apply" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Apply
            </Link>
          </li>
          <li>
            <Link href="/offers" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Offers
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/loyalty" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Loyalty
            </Link>
          </li>
        </ul>
        
        {/* Login/Register buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <NotificationCenter />
          <Link href="/login" className="text-gray-700 hover:text-primary transition-colors font-medium">
            Login
          </Link>
          <Link 
            href="/register" 
            className="bg-gradient-primary text-white px-5 py-2 rounded-md hover:opacity-90 transition-opacity shadow-sm"
          >
            Register
          </Link>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-md z-50">
          <ul className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <li>
              <Link 
                href="/" 
                className="block text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/apply" 
                className="block text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Apply
              </Link>
            </li>
            <li>
              <Link 
                href="/offers" 
                className="block text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Offers
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard" 
                className="block text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/loyalty" 
                className="block text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Loyalty
              </Link>
            </li>
            <li className="flex items-center">
              <NotificationCenter />
            </li>
            <li>
              <Link 
                href="/login" 
                className="block text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </li>
            <li>
              <Link 
                href="/register" 
                className="block bg-gradient-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity shadow-sm w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
} 