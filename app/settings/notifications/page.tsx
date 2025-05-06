'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Switch } from '../../components/ui/switch'
import { Bell, BellOff, BellRing, Smartphone, Mail, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import TestNotificationButton from '../../components/TestNotificationButton'

interface NotificationPreference {
  id: string
  name: string
  description: string
  enabled: boolean
  channels: {
    email: boolean
    push: boolean
    sms: boolean
  }
}

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'loan_status_update',
      name: 'Loan Status Updates',
      description: 'Get notified when your loan application status changes',
      enabled: true,
      channels: {
        email: true,
        push: true,
        sms: false
      }
    },
    {
      id: 'offer_received',
      name: 'New Loan Offers',
      description: 'Get notified when you receive new loan offers',
      enabled: true,
      channels: {
        email: true,
        push: true,
        sms: false
      }
    },
    {
      id: 'document_verification',
      name: 'Document Verification',
      description: 'Get notified about document verification status',
      enabled: true,
      channels: {
        email: true,
        push: true,
        sms: false
      }
    },
    {
      id: 'payment_reminder',
      name: 'Payment Reminders',
      description: 'Get reminders about upcoming loan payments',
      enabled: true,
      channels: {
        email: true,
        push: true,
        sms: true
      }
    },
    {
      id: 'promotions',
      name: 'Promotions & Offers',
      description: 'Get updates about special promotions and new offers',
      enabled: false,
      channels: {
        email: true,
        push: false,
        sms: false
      }
    },
    {
      id: 'application_update',
      name: 'Application Updates',
      description: 'Get progress updates about your loan application',
      enabled: true,
      channels: {
        email: true,
        push: true,
        sms: false
      }
    }
  ])

  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [savedState, setSavedState] = useState('idle') // 'idle', 'saving', 'saved'
  
  // Save changes to local storage (in a real app, this would be an API call)
  const saveChanges = () => {
    setSavedState('saving')
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('notificationPreferences', JSON.stringify(preferences))
      localStorage.setItem('notificationsEnabled', String(notificationsEnabled))
      setSavedState('saved')
      
      // Reset to idle after showing saved state
      setTimeout(() => {
        setSavedState('idle')
      }, 2000)
    }, 1000)
  }
  
  // Load saved preferences
  useEffect(() => {
    // In a real app, this would be an API call
    const savedPreferences = localStorage.getItem('notificationPreferences')
    const savedEnabled = localStorage.getItem('notificationsEnabled')
    
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }
    
    if (savedEnabled !== null) {
      setNotificationsEnabled(savedEnabled === 'true')
    }
  }, [])
  
  // Toggle master notifications switch
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled)
  }
  
  // Toggle individual notification preference
  const togglePreference = (id: string) => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.id === id 
          ? { ...pref, enabled: !pref.enabled } 
          : pref
      )
    )
  }
  
  // Toggle notification channel
  const toggleChannel = (id: string, channel: 'email' | 'push' | 'sms') => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.id === id 
          ? { 
              ...pref, 
              channels: { 
                ...pref.channels, 
                [channel]: !pref.channels[channel] 
              } 
            } 
          : pref
      )
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Notification Settings</h1>
        <p className="text-gray-600">
          Manage how and when you receive notifications from Loandify
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {notificationsEnabled ? (
              <Bell size={24} className="text-primary" />
            ) : (
              <BellOff size={24} className="text-gray-400" />
            )}
            <div>
              <h2 className="text-xl font-semibold">All Notifications</h2>
              <p className="text-gray-600 text-sm">
                {notificationsEnabled 
                  ? 'You will receive notifications based on your preferences below' 
                  : 'All notifications are currently disabled'}
              </p>
            </div>
          </div>
          <Switch 
            checked={notificationsEnabled} 
            onCheckedChange={toggleNotifications}
          />
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <Smartphone size={20} className="text-primary mr-2" />
                <h4 className="font-medium">Push Notifications</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">Receive notifications in your browser or mobile app</p>
              <div className="mt-2">
                <Button variant="outline" size="sm">
                  Test Push Notification
                </Button>
              </div>
            </div>
            
            <div className="flex-1 bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <Mail size={20} className="text-primary mr-2" />
                <h4 className="font-medium">Email Notifications</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">Receive notifications via email</p>
              <div className="mt-2">
                <Button variant="outline" size="sm">
                  Verify Email
                </Button>
              </div>
            </div>
            
            <div className="flex-1 bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center mb-2">
                <MessageSquare size={20} className="text-primary mr-2" />
                <h4 className="font-medium">SMS Notifications</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">Receive notifications via SMS</p>
              <div className="mt-2">
                <Button variant="outline" size="sm">
                  Verify Phone
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
        
        <div className="space-y-4 divide-y">
          {preferences.map(preference => (
            <div key={preference.id} className="pt-4 first:pt-0">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium">{preference.name}</h4>
                  <p className="text-sm text-gray-600">{preference.description}</p>
                </div>
                <Switch 
                  checked={notificationsEnabled && preference.enabled} 
                  disabled={!notificationsEnabled}
                  onCheckedChange={() => togglePreference(preference.id)}
                />
              </div>
              
              {notificationsEnabled && preference.enabled && (
                <div className="mt-3 flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Switch 
                      checked={preference.channels.email} 
                      onCheckedChange={() => toggleChannel(preference.id, 'email')}
                      size="sm"
                    />
                    <span className="text-gray-700">Email</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Switch 
                      checked={preference.channels.push} 
                      onCheckedChange={() => toggleChannel(preference.id, 'push')}
                      size="sm"
                    />
                    <span className="text-gray-700">Push</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Switch 
                      checked={preference.channels.sms} 
                      onCheckedChange={() => toggleChannel(preference.id, 'sms')}
                      size="sm"
                    />
                    <span className="text-gray-700">SMS</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <Link href="/settings" className="text-primary hover:underline">
          Back to Settings
        </Link>
        
        <div className="flex items-center gap-4">
          <span className={`text-sm transition-opacity ${
            savedState === 'saved' ? 'opacity-100 text-green-600' : 'opacity-0'
          }`}>
            Settings saved!
          </span>
          
          <Button 
            onClick={saveChanges}
            disabled={savedState === 'saving'}
          >
            {savedState === 'saving' ? 'Saving...' : 'Save Changes'}
          </Button>
          
          {/* Developer testing tool */}
          <div className="ml-4">
            <TestNotificationButton />
          </div>
        </div>
      </div>
    </div>
  )
} 