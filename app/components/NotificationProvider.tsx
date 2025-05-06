'use client'

import React, { useEffect } from 'react'
import { initNotificationService } from '../../lib/services/notificationService'

export default function NotificationProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  useEffect(() => {
    // Initialize the notification service when the app loads
    initNotificationService()
    
    // Request browser notification permissions if supported
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission()
    }
  }, [])

  return <>{children}</>
} 