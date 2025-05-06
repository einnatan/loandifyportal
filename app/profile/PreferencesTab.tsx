'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { UserPreferences, UserProfile, updateUserPreferences } from '../../lib/services/userProfileService'

interface PreferencesTabProps {
  profile: UserProfile
  onUpdate: (data: Partial<UserProfile>) => void
}

export function PreferencesTab({ profile, onUpdate }: PreferencesTabProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(profile.preferences)
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }))
  }
  
  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setPreferences(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [name]: checked
      }
    }))
  }
  
  const handleDisplayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setPreferences(prev => ({
      ...prev,
      display: {
        ...prev.display,
        [name]: value
      }
    }))
  }
  
  const handleSavePreferences = () => {
    const updated = updateUserPreferences(preferences)
    onUpdate({ preferences: updated.preferences })
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="email"
                name="email"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={preferences.notifications.email}
                onChange={handleNotificationChange}
              />
              <Label htmlFor="email">Email Notifications</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sms"
                name="sms"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={preferences.notifications.sms}
                onChange={handleNotificationChange}
              />
              <Label htmlFor="sms">SMS Notifications</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="push"
                name="push"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={preferences.notifications.push}
                onChange={handleNotificationChange}
              />
              <Label htmlFor="push">Push Notifications</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="marketing"
                name="marketing"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={preferences.notifications.marketing}
                onChange={handleNotificationChange}
              />
              <Label htmlFor="marketing">Marketing Communications</Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Control how your information is used</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="shareData"
                name="shareData"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={preferences.privacy.shareData}
                onChange={handlePrivacyChange}
              />
              <div>
                <Label htmlFor="shareData">Share Data with Partners</Label>
                <p className="text-sm text-gray-500">Allow sharing your data with trusted partners for improved service</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showActivity"
                name="showActivity"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={preferences.privacy.showActivity}
                onChange={handlePrivacyChange}
              />
              <div>
                <Label htmlFor="showActivity">Show Activity Status</Label>
                <p className="text-sm text-gray-500">Allow others to see when you're active on the platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymizeReviews"
                name="anonymizeReviews"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={preferences.privacy.anonymizeReviews}
                onChange={handlePrivacyChange}
              />
              <div>
                <Label htmlFor="anonymizeReviews">Anonymous Reviews</Label>
                <p className="text-sm text-gray-500">Make your product and service reviews anonymous</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Display Preferences</CardTitle>
          <CardDescription>Customize your viewing experience</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <select
              id="theme"
              name="theme"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={preferences.display.theme}
              onChange={handleDisplayChange}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <select
              id="language"
              name="language"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={preferences.display.language}
              onChange={handleDisplayChange}
            >
              <option value="en">English</option>
              <option value="zh">Chinese</option>
              <option value="ms">Malay</option>
              <option value="ta">Tamil</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currencyFormat">Currency Format</Label>
            <select
              id="currencyFormat"
              name="currencyFormat"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={preferences.display.currencyFormat}
              onChange={handleDisplayChange}
            >
              <option value="SGD">SGD (S$)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSavePreferences}>Save Preferences</Button>
      </div>
    </div>
  )
} 