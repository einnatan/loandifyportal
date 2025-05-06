'use client'

import { Button } from './ui/button'
import { useState } from 'react'

type NotificationType = 'offer_received' | 'loan_status_update' | 'document_verification' | 'payment_reminder' | 'application_update' | 'system_message' | 'promotion'
type NotificationPriority = 'low' | 'medium' | 'high'

interface TestNotificationButtonProps {
  className?: string
}

const notificationTypes: Array<{
  type: NotificationType
  label: string
  description: string
}> = [
  {
    type: 'offer_received',
    label: 'Loan Offer',
    description: 'New personalized loan offer received'
  },
  {
    type: 'loan_status_update',
    label: 'Status Update',
    description: 'Your loan application status has changed'
  },
  {
    type: 'document_verification',
    label: 'Document Verified',
    description: 'Your document has been successfully verified'
  },
  {
    type: 'payment_reminder',
    label: 'Payment Reminder',
    description: 'Upcoming loan payment reminder'
  },
  {
    type: 'application_update',
    label: 'Application Update',
    description: 'Your application is being processed'
  },
  {
    type: 'system_message',
    label: 'System Message',
    description: 'Important system update notification'
  },
  {
    type: 'promotion',
    label: 'Promotion',
    description: 'Limited time offer or promotion'
  }
]

export default function TestNotificationButton({ className = '' }: TestNotificationButtonProps) {
  const [showOptions, setShowOptions] = useState(false)
  
  const sendTestNotification = (type: NotificationType, priority: NotificationPriority = 'medium') => {
    // Create custom event
    const event = new CustomEvent('test-notification', {
      detail: {
        type,
        title: notificationTypes.find(t => t.type === type)?.label || 'Notification',
        message: notificationTypes.find(t => t.type === type)?.description || 'Test notification',
        priority,
        read: false,
        timestamp: new Date(),
        actionUrl: type === 'offer_received' ? '/offers' : 
                   type === 'loan_status_update' ? '/dashboard' : undefined
      }
    })
    
    // Dispatch event to trigger notification system
    document.dispatchEvent(event)
    
    // Close options menu
    setShowOptions(false)
  }
  
  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={() => setShowOptions(!showOptions)}
        variant="outline"
      >
        Test Notification
      </Button>
      
      {showOptions && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50 p-2">
          <div className="space-y-1">
            {notificationTypes.map((notification) => (
              <button
                key={notification.type}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 flex flex-col"
                onClick={() => sendTestNotification(notification.type)}
              >
                <span className="font-medium">{notification.label}</span>
                <span className="text-xs text-gray-500">{notification.description}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-2 pt-2 border-t">
            <div className="flex justify-between px-3 py-1">
              <span className="text-xs text-gray-500">Priority:</span>
              <div className="flex gap-1">
                <button 
                  className="text-xs px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    sendTestNotification('offer_received', 'low')
                  }}
                >
                  Low
                </button>
                <button 
                  className="text-xs px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    sendTestNotification('application_update', 'high')
                  }}
                >
                  High
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 