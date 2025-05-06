// Real-time notification service using WebSockets

/**
 * Notification types
 */
export type NotificationType = 
  | 'loan_status_update'
  | 'offer_received'
  | 'document_verification' 
  | 'payment_reminder'
  | 'application_update'
  | 'system_message'
  | 'promotion';  // New type for promotional content

/**
 * Notification priority
 */
export type NotificationPriority = 'low' | 'medium' | 'high';

/**
 * Notification structure
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  timestamp: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

/**
 * WebSocket connection status
 */
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

/**
 * Notification callback function type
 */
export type NotificationCallback = (notification: Notification) => void;

/**
 * Connection status update callback type
 */
export type ConnectionCallback = (status: ConnectionStatus) => void;

// Type definitions for callbacks
type MessageCallback = (event: { data: string }) => void;
type OpenCallback = () => void;
type CloseCallback = () => void;
type ErrorCallback = (error: any) => void;

/**
 * Mock WebSocket class for simulated notifications
 */
class MockWebSocket {
  private callbacks: {
    message: MessageCallback[];
    open: OpenCallback[];
    close: CloseCallback[];
    error: ErrorCallback[];
  };
  private status: ConnectionStatus;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  
  constructor() {
    this.callbacks = {
      message: [],
      open: [],
      close: [],
      error: []
    };
    this.status = 'disconnected';
  }
  
  connect(): void {
    this.status = 'connecting';
    
    // Simulate connection delay
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% success rate
        this.status = 'connected';
        this.callbacks.open.forEach(cb => cb());
        this.startMockNotifications();
      } else {
        this.status = 'error';
        this.callbacks.error.forEach(cb => cb(new Error('Failed to connect')));
      }
    }, 1000);
  }
  
  disconnect(): void {
    if (this.status === 'connected') {
      this.status = 'disconnected';
      this.stopMockNotifications();
      this.callbacks.close.forEach(cb => cb());
    }
  }
  
  on(event: 'message', callback: MessageCallback): void;
  on(event: 'open', callback: OpenCallback): void;
  on(event: 'close', callback: CloseCallback): void;
  on(event: 'error', callback: ErrorCallback): void;
  on(event: 'message' | 'open' | 'close' | 'error', callback: MessageCallback | OpenCallback | CloseCallback | ErrorCallback): void {
    if (event === 'message') {
      this.callbacks.message.push(callback as MessageCallback);
    } else if (event === 'open') {
      this.callbacks.open.push(callback as OpenCallback);
    } else if (event === 'close') {
      this.callbacks.close.push(callback as CloseCallback);
    } else if (event === 'error') {
      this.callbacks.error.push(callback as ErrorCallback);
    }
  }
  
  off(event: 'message', callback: MessageCallback): void;
  off(event: 'open', callback: OpenCallback): void;
  off(event: 'close', callback: CloseCallback): void;
  off(event: 'error', callback: ErrorCallback): void;
  off(event: 'message' | 'open' | 'close' | 'error', callback: MessageCallback | OpenCallback | CloseCallback | ErrorCallback): void {
    if (event === 'message') {
      this.callbacks.message = this.callbacks.message.filter(cb => cb !== callback);
    } else if (event === 'open') {
      this.callbacks.open = this.callbacks.open.filter(cb => cb !== callback);
    } else if (event === 'close') {
      this.callbacks.close = this.callbacks.close.filter(cb => cb !== callback);
    } else if (event === 'error') {
      this.callbacks.error = this.callbacks.error.filter(cb => cb !== callback);
    }
  }
  
  getStatus(): ConnectionStatus {
    return this.status;
  }
  
  private startMockNotifications(): void {
    // Generate random notifications periodically
    this.intervalId = setInterval(() => {
      if (this.status === 'connected') {
        const notification = this.generateRandomNotification();
        this.callbacks.message.forEach(cb => cb({ data: JSON.stringify(notification) }));
      }
    }, 30000); // Every 30 seconds
  }
  
  private stopMockNotifications(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  private generateRandomNotification(): Notification {
    const notificationTypes: NotificationType[] = [
      'loan_status_update',
      'offer_received',
      'document_verification',
      'payment_reminder',
      'application_update',
      'system_message',
      'promotion'  // Add promotion type to random notifications
    ];
    
    const priorities: NotificationPriority[] = ['low', 'medium', 'high'];
    
    const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    let title: string = '';
    let message: string = '';
    let actionUrl: string | undefined;
    
    switch (type) {
      case 'offer_received':
        title = 'New Loan Offer!';
        message = 'You have received a new personalized loan offer from DBS Bank.';
        actionUrl = '/offers';
        break;
      case 'loan_status_update':
        title = 'Loan Application Update';
        message = 'Your loan application status has been updated. Click to view details.';
        actionUrl = '/dashboard';
        break;
      case 'document_verification':
        title = 'Document Verification';
        message = 'Your NRIC has been successfully verified. Thank you.';
        break;
      case 'payment_reminder':
        title = 'Payment Reminder';
        message = 'Your loan payment is due in 5 days. Please ensure sufficient funds.';
        actionUrl = '/dashboard';
        break;
      case 'application_update':
        title = 'Application Processing';
        message = 'Your application is now being reviewed by our partner banks.';
        break;
      case 'system_message':
        title = 'System Maintenance';
        message = 'We will be performing system maintenance on Sunday from 2-4 AM SGT.';
        break;
      case 'promotion':
        // Create different promotional messages
        const promoOptions = [
          {
            title: 'Special Rate Alert!',
            message: 'Limited time offer: Get 1% lower interest rate on personal loans this month!',
            actionUrl: '/offers'
          },
          {
            title: 'Referral Bonus Increased',
            message: 'Earn S$100 for every friend you refer who gets approved for a loan!',
            actionUrl: '/refer'
          },
          {
            title: 'New Loyalty Rewards',
            message: 'Check out our new loyalty program with cashback on loan repayments!',
            actionUrl: '/loyalty'
          }
        ];
        
        const selectedPromo = promoOptions[Math.floor(Math.random() * promoOptions.length)];
        title = selectedPromo.title;
        message = selectedPromo.message;
        actionUrl = selectedPromo.actionUrl;
        break;
    }
    
    return {
      id: Math.random().toString(36).substring(2, 15),
      type,
      title,
      message,
      priority,
      read: false,
      timestamp: new Date(),
      actionUrl
    };
  }
}

// Singleton instance
let ws: MockWebSocket | null = null;
let notificationHandlers: NotificationCallback[] = [];
let connectionHandlers: ConnectionCallback[] = [];
let notificationHistory: Notification[] = [];

/**
 * Initialize the notification service and connect to WebSocket
 */
export const initNotificationService = (): void => {
  if (!ws) {
    ws = new MockWebSocket();
    
    ws.on('open', () => {
      connectionHandlers.forEach(handler => handler('connected'));
    });
    
    ws.on('close', () => {
      connectionHandlers.forEach(handler => handler('disconnected'));
    });
    
    ws.on('error', () => {
      connectionHandlers.forEach(handler => handler('error'));
    });
    
    ws.on('message', (event) => {
      try {
        const notification = JSON.parse(event.data) as Notification;
        notificationHistory.push(notification);
        notificationHandlers.forEach(handler => handler(notification));
      } catch (error) {
        console.error('Error processing notification:', error);
      }
    });
    
    ws.connect();
  }
};

/**
 * Disconnect from the notification service
 */
export const disconnectNotificationService = (): void => {
  if (ws) {
    ws.disconnect();
    ws = null;
  }
};

/**
 * Subscribe to real-time notifications
 */
export const subscribeToNotifications = (callback: NotificationCallback): () => void => {
  notificationHandlers.push(callback);
  
  // Return unsubscribe function
  return () => {
    notificationHandlers = notificationHandlers.filter(handler => handler !== callback);
  };
};

/**
 * Subscribe to connection status updates
 */
export const subscribeToConnectionStatus = (callback: ConnectionCallback): () => void => {
  connectionHandlers.push(callback);
  
  // Send initial status
  if (ws) {
    callback(ws.getStatus());
  } else {
    callback('disconnected');
  }
  
  // Return unsubscribe function
  return () => {
    connectionHandlers = connectionHandlers.filter(handler => handler !== callback);
  };
};

/**
 * Get the current connection status
 */
export const getConnectionStatus = (): ConnectionStatus => {
  return ws ? ws.getStatus() : 'disconnected';
};

/**
 * Get notification history
 */
export const getNotificationHistory = (): Notification[] => {
  return [...notificationHistory];
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = (id: string): void => {
  notificationHistory = notificationHistory.map(notification => 
    notification.id === id 
      ? { ...notification, read: true } 
      : notification
  );
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = (): void => {
  notificationHistory = notificationHistory.map(notification => 
    ({ ...notification, read: true })
  );
};

/**
 * Get unread notification count
 */
export const getUnreadCount = (): number => {
  return notificationHistory.filter(n => !n.read).length;
}; 