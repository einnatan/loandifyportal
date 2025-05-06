'use client'

import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Bell, X, Check, AlertCircle, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  initNotificationService, 
  subscribeToNotifications,
  subscribeToConnectionStatus,
  getConnectionStatus,
  getNotificationHistory,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  getUnreadCount,
  disconnectNotificationService,
  type Notification,
  type ConnectionStatus,
  type NotificationType
} from '../../lib/services/notificationService'

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected')
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all')
  
  // Initialize notification service
  useEffect(() => {
    initNotificationService()
    
    // Load existing notifications
    setNotifications(getNotificationHistory())
    setUnreadCount(getUnreadCount())
    setConnectionStatus(getConnectionStatus())
    
    // Subscribe to new notifications
    const unsubscribeNotifications = subscribeToNotifications((notification) => {
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
      
      // Show browser notification if supported and document is not focused
      if ("Notification" in window && 
          Notification.permission === "granted" && 
          document.visibilityState !== "visible") {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/notification-icon.png',
          tag: notification.id // Prevents duplicate notifications
        })
      }
      
      // Show toast notification
      showToastNotification(notification)
    })
    
    // Subscribe to connection status changes
    const unsubscribeConnection = subscribeToConnectionStatus((status) => {
      setConnectionStatus(status)
    })
    
    // Request notification permission
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission()
    }
    
    // Listen for test notification events
    const handleTestNotification = (event: CustomEvent) => {
      const notificationData = event.detail
      
      // Create a unique ID
      const notification = {
        ...notificationData,
        id: Math.random().toString(36).substring(2, 15)
      }
      
      // Add to notifications
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
      
      // Show browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/notification-icon.png'
        })
      }
      
      // Show toast notification
      showToastNotification(notification)
    }
    
    document.addEventListener('test-notification', handleTestNotification as EventListener)
    
    return () => {
      unsubscribeNotifications()
      unsubscribeConnection()
      document.removeEventListener('test-notification', handleTestNotification as EventListener)
      disconnectNotificationService()
    }
  }, [])
  
  // Show toast notification
  const showToastNotification = (notification: Notification) => {
    const toastContainer = document.getElementById('toast-container')
    
    if (!toastContainer) {
      // Create toast container if it doesn't exist
      const container = document.createElement('div')
      container.id = 'toast-container'
      container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-3'
      document.body.appendChild(container)
    }
    
    // Create toast element with improved styling
    const toast = document.createElement('div')
    
    // Get the appropriate color based on notification type
    const bgColor = getNotificationBgColor(notification.type)
    const textColor = getNotificationTextColor(notification.type)
    const borderColor = getNotificationBorderColor(notification.type)
    const iconStyle = getNotificationIconStyle(notification.type)
    
    // Priority indicator class
    const priorityIndicatorClass = notification.priority === 'high' 
      ? 'bg-red-500' 
      : notification.priority === 'medium' 
        ? 'bg-yellow-500' 
        : 'bg-blue-400'
    
    // Add improved styling with subtle shadow, rounded corners, and border
    toast.className = `bg-white shadow-xl rounded-lg overflow-hidden transform transition-all duration-500 opacity-0 translate-x-full max-w-sm border-l-4 ${borderColor} flex flex-col`
    
    // Add the notification content with improved layout
    toast.innerHTML = `
      <div class="flex p-4 ${bgColor} bg-opacity-5">
        <div class="flex-shrink-0 mr-3">
          <div class="${iconStyle} rounded-full p-2 flex items-center justify-center">
            ${getNotificationIconSVG(notification.type)}
          </div>
        </div>
        <div class="flex-1 pr-2">
          <div class="flex items-center">
            <h4 class="text-sm font-semibold ${textColor} flex-1">${notification.title}</h4>
            <div class="ml-2 flex items-center">
              <span class="h-2 w-2 rounded-full ${priorityIndicatorClass} mr-2"></span>
              <span class="text-xs text-gray-400">${formatTimeAgo(new Date(notification.timestamp))}</span>
            </div>
          </div>
          <p class="text-xs text-gray-600 mt-1">${notification.message}</p>
          ${notification.actionUrl ? `<a href="${notification.actionUrl}" class="mt-2 inline-block text-xs font-medium ${textColor} hover:underline">View details</a>` : ''}
        </div>
      </div>
      <div class="flex justify-between px-4 py-2">
        <button class="text-xs text-gray-500 hover:text-gray-700 focus:outline-none px-2 py-1 rounded hover:bg-gray-100 transition-colors mark-read-btn">
          Mark as read
        </button>
        <button class="text-xs text-gray-500 hover:text-gray-700 focus:outline-none px-2 py-1 rounded hover:bg-gray-100 transition-colors close-btn">
          Dismiss
        </button>
      </div>
      <div class="progress-bar h-1 w-full bg-gray-200 overflow-hidden">
        <div class="h-full ${textColor.replace('text-', 'bg-')} progress-indicator"></div>
      </div>
    `
    
    const toastId = `toast-${Date.now()}`
    toast.id = toastId
    
    document.getElementById('toast-container')?.appendChild(toast)
    
    // Get the progress bar indicator
    const progressIndicator = toast.querySelector('.progress-indicator') as HTMLElement
    if (progressIndicator) {
      progressIndicator.style.width = '100%'
      progressIndicator.style.transition = 'width 5000ms linear'
      
      // Start the progress animation after a short delay
      setTimeout(() => {
        progressIndicator.style.width = '0%'
      }, 50)
    }
    
    // Add click handler to mark as read button
    const markReadButton = toast.querySelector('.mark-read-btn')
    if (markReadButton) {
      markReadButton.addEventListener('click', (e) => {
        e.stopPropagation()
        markNotificationAsRead(notification.id)
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
        
        // Show confirmation
        const markReadText = markReadButton as HTMLElement
        markReadText.innerHTML = `<svg class="inline-block h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg> Marked as read`
        markReadText.classList.remove('text-gray-500', 'hover:text-gray-700')
        markReadText.classList.add('text-green-600')
      })
    }
    
    // Add click handler to close button
    const closeButton = toast.querySelector('.close-btn')
    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        e.stopPropagation()
        removeToast(toastId)
      })
    }
    
    // Add click handler to the entire toast for action URL
    toast.addEventListener('click', () => {
      if (notification.actionUrl) {
        window.location.href = notification.actionUrl
      }
    })
    
    // Add hover effect to pause progress
    toast.addEventListener('mouseenter', () => {
      const progressBar = toast.querySelector('.progress-indicator') as HTMLElement
      if (progressBar) {
        progressBar.style.transitionProperty = 'none'
      }
    })
    
    // Resume progress on mouse leave
    toast.addEventListener('mouseleave', () => {
      const progressBar = toast.querySelector('.progress-indicator') as HTMLElement
      if (progressBar) {
        const computedWidth = window.getComputedStyle(progressBar).width
        const parentWidth = (progressBar.parentElement as HTMLElement).offsetWidth
        const percentLeft = (parseInt(computedWidth) / parentWidth) * 100
        
        if (percentLeft > 0) {
          progressBar.style.transitionProperty = 'width'
          progressBar.style.transitionDuration = `${50 * percentLeft}ms`
          progressBar.style.width = '0%'
        }
      }
    })
    
    // Animate in
    setTimeout(() => {
      toast.classList.remove('opacity-0', 'translate-x-full')
    }, 10)
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(toastId)
    }, 5000)
  }
  
  const removeToast = (id: string) => {
    const toast = document.getElementById(id)
    if (!toast) return
    
    // Animate out with improved animation
    toast.classList.add('opacity-0', 'translate-x-full', 'scale-95')
    
    // Remove after animation
    setTimeout(() => {
      toast.remove()
    }, 500)
  }
  
  // New helper functions for toast styling
  const getNotificationBgColor = (type: NotificationType): string => {
    switch (type) {
      case 'offer_received': return 'bg-green-50'
      case 'loan_status_update': return 'bg-blue-50'
      case 'document_verification': return 'bg-purple-50'
      case 'payment_reminder': return 'bg-yellow-50'
      case 'promotion': return 'bg-red-50'
      case 'application_update': return 'bg-cyan-50'
      case 'system_message': return 'bg-gray-50'
      default: return 'bg-gray-50'
    }
  }
  
  const getNotificationTextColor = (type: NotificationType): string => {
    switch (type) {
      case 'offer_received': return 'text-green-600'
      case 'loan_status_update': return 'text-blue-600'
      case 'document_verification': return 'text-purple-600'
      case 'payment_reminder': return 'text-yellow-600'
      case 'promotion': return 'text-red-600'
      case 'application_update': return 'text-cyan-600'
      case 'system_message': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }
  
  const getNotificationBorderColor = (type: NotificationType): string => {
    switch (type) {
      case 'offer_received': return 'border-green-500'
      case 'loan_status_update': return 'border-blue-500'
      case 'document_verification': return 'border-purple-500'
      case 'payment_reminder': return 'border-yellow-500'
      case 'promotion': return 'border-red-500'
      case 'application_update': return 'border-cyan-500'
      case 'system_message': return 'border-gray-500'
      default: return 'border-gray-500'
    }
  }
  
  const getNotificationIconStyle = (type: NotificationType): string => {
    switch (type) {
      case 'offer_received': return 'bg-green-100 text-green-600'
      case 'loan_status_update': return 'bg-blue-100 text-blue-600'
      case 'document_verification': return 'bg-purple-100 text-purple-600'
      case 'payment_reminder': return 'bg-yellow-100 text-yellow-600'
      case 'promotion': return 'bg-red-100 text-red-600'
      case 'application_update': return 'bg-cyan-100 text-cyan-600'
      case 'system_message': return 'bg-gray-100 text-gray-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }
  
  const toggleNotificationPanel = () => {
    setIsOpen(!isOpen)
  }
  
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id)
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
    
    // Navigate if there's an action URL
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }
  
  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }
  
  const getNotificationIconSVG = (type: NotificationType): string => {
    switch (type) {
      case 'offer_received':
        return `<svg class="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
        </svg>`
      case 'loan_status_update':
        return `<svg class="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
        </svg>`
      case 'document_verification':
        return `<svg class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2-2h12v10H4V3zm1 1h10v1H5V4zm0 3h10v1H5V7zm0 3h10v1H5v-1z" clip-rule="evenodd" />
        </svg>`
      case 'payment_reminder':
        return `<svg class="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>`
      default:
        return `<svg class="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>`
    }
  }
  
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'offer_received':
        return (
          <div className="bg-green-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          </div>
        )
      case 'loan_status_update':
        return (
          <div className="bg-blue-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        )
      case 'document_verification':
        return (
          <div className="bg-purple-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
        )
      case 'payment_reminder':
        return (
          <div className="bg-yellow-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          </div>
        )
      case 'promotion':
        return (
          <div className="bg-red-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
              <path d="M9 11H3v5a2 2 0 002 2h4v-7zm2 7h4a2 2 0 002-2v-5h-6v7z" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="bg-gray-100 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        )
    }
  }
  
  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return 'just now'
    
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    
    return new Date(date).toLocaleDateString()
  }
  
  const getConnectionStatusIndicator = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected':
        return (
          <div className="flex items-center text-xs text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
            Connected
          </div>
        )
      case 'connecting':
        return (
          <div className="flex items-center text-xs text-blue-700">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Connecting
          </div>
        )
      case 'error':
        return (
          <div className="flex items-center text-xs text-red-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            Connection error
          </div>
        )
      default:
        return (
          <div className="flex items-center text-xs text-gray-700">
            <span className="h-2 w-2 rounded-full bg-gray-400 mr-1"></span>
            Disconnected
          </div>
        )
    }
  }
  
  const getFilteredNotifications = () => {
    if (filterType === 'all') {
      return notifications;
    }
    
    // For the "Updates" category, include multiple notification types
    if (filterType === 'loan_status_update') {
      return notifications.filter(notification => 
        notification.type === 'loan_status_update' || 
        notification.type === 'document_verification' || 
        notification.type === 'payment_reminder' ||
        notification.type === 'application_update'
      );
    }
    
    return notifications.filter(notification => notification.type === filterType);
  }

  // Filter notifications based on selected type
  const filteredNotifications = getFilteredNotifications();
  
  // Count notifications by type
  const notificationCounts = {
    all: notifications.length,
    offer_received: notifications.filter(n => n.type === 'offer_received').length,
    promotion: notifications.filter(n => n.type === 'promotion').length,
    updates: notifications.filter(n => 
      n.type === 'loan_status_update' || 
      n.type === 'document_verification' || 
      n.type === 'payment_reminder' ||
      n.type === 'application_update'
    ).length
  };
  
  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleNotificationPanel}
        className="relative"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border overflow-hidden z-50"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-semibold text-gray-800">Notifications</h3>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleMarkAllAsRead} 
                  className="text-xs text-primary hover:underline flex items-center"
                  disabled={!notifications.some(n => !n.read)}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark all read
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="p-2 border-b">
              <div className="flex space-x-1 overflow-x-auto pb-1">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors whitespace-nowrap flex-shrink-0 ${
                    filterType === 'all' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({notificationCounts.all})
                </button>
                <button
                  onClick={() => setFilterType('offer_received')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors whitespace-nowrap flex-shrink-0 ${
                    filterType === 'offer_received' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Offers ({notificationCounts.offer_received})
                </button>
                <button
                  onClick={() => setFilterType('loan_status_update')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors whitespace-nowrap flex-shrink-0 ${
                    filterType === 'loan_status_update' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Updates ({notificationCounts.updates})
                </button>
                <button
                  onClick={() => setFilterType('promotion')}
                  className={`px-3 py-1 text-xs rounded-full transition-colors whitespace-nowrap flex-shrink-0 ${
                    filterType === 'promotion' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Promotions ({notificationCounts.promotion})
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {filteredNotifications.length > 0 ? (
                <div className="divide-y">
                  {filteredNotifications.map(notification => {
                    const bgColor = getNotificationBgColor(notification.type)
                    const textColor = getNotificationTextColor(notification.type)
                    const borderColor = getNotificationBorderColor(notification.type)
                    
                    return (
                      <motion.div 
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${!notification.read ? 'bg-opacity-30 ' + bgColor : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {!notification.read && (
                          <span className={`absolute left-0 top-0 bottom-0 w-1 ${borderColor.replace('border', 'bg')}`}></span>
                        )}
                        <div className="flex">
                          {getNotificationIcon(notification.type)}
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <h4 className={`font-medium text-sm ${!notification.read ? textColor : 'text-gray-800'}`}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center">
                                {notification.priority === 'high' && (
                                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                                )}
                                <time className="text-xs text-gray-500">{formatTimeAgo(new Date(notification.timestamp))}</time>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            {notification.actionUrl && (
                              <div className="mt-2">
                                <span className={`text-xs font-medium ${textColor} hover:underline`}>
                                  View details
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 text-gray-400 mb-3">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-1">No notifications</p>
                  <p className="text-sm text-gray-400">We'll notify you when there are new updates</p>
                </div>
              )}
            </div>
            
            <div className="p-3 text-center border-t bg-gray-50">
              <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                <a href="/settings/notifications">Manage notification settings</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 