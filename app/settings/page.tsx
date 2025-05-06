'use client'

import React from 'react'
import { Bell, User, Shield, CreditCard, Globe, HelpCircle } from 'lucide-react'
import Link from 'next/link'

interface SettingCategory {
  title: string
  icon: React.ReactNode
  href: string
  description: string
}

export default function SettingsPage() {
  const settingCategories: SettingCategory[] = [
    {
      title: 'Notifications',
      icon: <Bell className="h-6 w-6 text-primary" />,
      href: '/settings/notifications',
      description: 'Manage your notification preferences and channels'
    },
    {
      title: 'Profile',
      icon: <User className="h-6 w-6 text-primary" />,
      href: '/settings/profile',
      description: 'Update your personal information and contact details'
    },
    {
      title: 'Privacy & Security',
      icon: <Shield className="h-6 w-6 text-primary" />,
      href: '/settings/privacy',
      description: 'Manage your security settings, password and data privacy'
    },
    {
      title: 'Payment Methods',
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      href: '/settings/payment',
      description: 'Add, edit or remove your payment methods'
    },
    {
      title: 'Language & Region',
      icon: <Globe className="h-6 w-6 text-primary" />,
      href: '/settings/language',
      description: 'Change your language, region and time zone'
    },
    {
      title: 'Help & Support',
      icon: <HelpCircle className="h-6 w-6 text-primary" />,
      href: '/settings/support',
      description: 'Get help, contact support or view documentation'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingCategories.map((category, index) => (
          <Link 
            key={index} 
            href={category.href}
            className="bg-white rounded-lg shadow-sm border p-6 flex flex-col hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              {category.icon}
              <h2 className="text-lg font-semibold ml-3">{category.title}</h2>
            </div>
            <p className="text-gray-600 text-sm">{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
} 