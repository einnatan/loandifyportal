import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title, Text, Avatar, Divider, Button, Chip, IconButton, Searchbar } from 'react-native-paper';

// Notification types
type NotificationType = 'payment' | 'update' | 'offer' | 'system';

// Notification interface
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionText?: string;
  actionRoute?: string;
}

export default function NotificationsScreen() {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  
  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'payment',
      title: 'Payment Due Reminder',
      message: 'Your loan payment of $458 for DBS Bank loan is due in 3 days. Ensure sufficient funds in your account.',
      date: '2023-08-21T09:00:00',
      read: false,
      actionText: 'Pay Now',
      actionRoute: 'PaymentScreen'
    },
    {
      id: '2',
      type: 'update',
      title: 'Interest Rate Update',
      message: 'The interest rate for your Standard Chartered loan has been adjusted from 3.58% to 3.48%, effective next month.',
      date: '2023-08-20T14:30:00',
      read: true
    },
    {
      id: '3',
      type: 'offer',
      title: 'Special Loan Offer',
      message: 'Based on your repayment history, you qualify for a personal loan up to $25,000 at a special rate of 3.2%.',
      date: '2023-08-19T11:15:00',
      read: false,
      actionText: 'View Offer',
      actionRoute: 'OffersScreen'
    },
    {
      id: '4',
      type: 'system',
      title: 'Account Security Update',
      message: 'We\'ve enhanced our security measures. Please update your password next time you log in.',
      date: '2023-08-18T16:45:00',
      read: true
    },
    {
      id: '5',
      type: 'payment',
      title: 'Payment Confirmation',
      message: 'Your payment of $443 for Standard Chartered loan has been processed successfully.',
      date: '2023-08-17T10:20:00',
      read: true
    },
    {
      id: '6',
      type: 'update',
      title: 'Loan Application Status',
      message: 'Your loan application with OCBC Bank is now under review. We\'ll notify you once there\'s an update.',
      date: '2023-08-16T13:50:00',
      read: false
    },
    {
      id: '7',
      type: 'offer',
      title: 'Credit Card Offer',
      message: 'New credit card offer with 5% cashback on dining and entertainment for the first 3 months.',
      date: '2023-08-15T09:30:00',
      read: true,
      actionText: 'Apply Now',
      actionRoute: 'CreditCardScreen'
    }
  ]);
  
  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHrs = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHrs < 24) {
      return `${diffHrs} hour${diffHrs !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Get icon for notification type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'payment':
        return 'cash-multiple';
      case 'update':
        return 'update';
      case 'offer':
        return 'gift';
      case 'system':
        return 'shield-account';
      default:
        return 'bell';
    }
  };
  
  // Get color for notification type
  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'payment':
        return '#0051CC';
      case 'update':
        return '#00897B';
      case 'offer':
        return '#E65100';
      case 'system':
        return '#6200EA';
      default:
        return '#757575';
    }
  };
  
  // Filter notifications
  const filteredNotifications = notifications
    .filter(notification => 
      (activeTab === 'all' || (activeTab === 'unread' && !notification.read)) &&
      (searchQuery === '' || 
       notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       notification.message.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Notifications</Title>
        <View style={styles.headerActions}>
          <Button 
            mode="text" 
            onPress={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All Read
          </Button>
        </View>
      </View>
      
      <Searchbar
        placeholder="Search notifications"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor="#666"
      />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'unread' && styles.activeTab]}
          onPress={() => setActiveTab('unread')}
        >
          <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Avatar.Icon size={64} icon="bell-off" color="#666" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No notifications to display</Text>
            {searchQuery !== '' && (
              <Text style={styles.emptySubtext}>Try a different search term</Text>
            )}
          </View>
        ) : (
          filteredNotifications.map(notification => (
            <Card 
              key={notification.id} 
              style={[
                styles.notificationCard, 
                !notification.read && styles.unreadNotification
              ]}
              onPress={() => markAsRead(notification.id)}
            >
              <Card.Content>
                <View style={styles.notificationHeader}>
                  <View style={styles.iconContainer}>
                    <Avatar.Icon 
                      size={40} 
                      icon={getNotificationIcon(notification.type)}
                      style={[
                        styles.notificationIcon,
                        { backgroundColor: getNotificationColor(notification.type) }
                      ]}
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <View style={styles.titleRow}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      {!notification.read && (
                        <View style={styles.unreadIndicator} />
                      )}
                    </View>
                    <Text style={styles.notificationDate}>{formatDate(notification.date)}</Text>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    
                    {notification.actionText && (
                      <Button 
                        mode="contained" 
                        style={styles.actionButton}
                        // In a real app, this would navigate to the specified route
                        onPress={() => console.log(`Navigate to ${notification.actionRoute}`)}
                      >
                        {notification.actionText}
                      </Button>
                    )}
                  </View>
                  <IconButton
                    icon="delete"
                    size={20}
                    color="#999"
                    onPress={() => deleteNotification(notification.id)}
                    style={styles.deleteButton}
                  />
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
      
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filter by Type:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          <Chip 
            style={styles.filterChip} 
            selected={true}
            onPress={() => console.log('All filter')}
          >
            All
          </Chip>
          <Chip 
            style={styles.filterChip} 
            icon="cash-multiple"
            onPress={() => console.log('Payment filter')}
          >
            Payments
          </Chip>
          <Chip 
            style={styles.filterChip}
            icon="update"
            onPress={() => console.log('Update filter')}
          >
            Updates
          </Chip>
          <Chip 
            style={styles.filterChip}
            icon="gift"
            onPress={() => console.log('Offer filter')}
          >
            Offers
          </Chip>
          <Chip 
            style={styles.filterChip}
            icon="shield-account"
            onPress={() => console.log('System filter')}
          >
            System
          </Chip>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
  },
  headerActions: {
    flexDirection: 'row',
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0051CC',
  },
  tabText: {
    color: '#666',
  },
  activeTabText: {
    color: '#0051CC',
    fontWeight: 'bold',
  },
  notificationCard: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#0051CC',
  },
  notificationHeader: {
    flexDirection: 'row',
  },
  iconContainer: {
    marginRight: 16,
  },
  notificationIcon: {
    backgroundColor: '#0051CC',
  },
  notificationContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0051CC',
    marginLeft: 8,
  },
  notificationDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  notificationMessage: {
    marginBottom: 8,
  },
  actionButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  deleteButton: {
    margin: -8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    backgroundColor: '#eee',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  filterContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chipScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    marginRight: 8,
  },
}); 