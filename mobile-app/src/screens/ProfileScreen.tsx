import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Button, Title, Text, Divider, Avatar, List } from 'react-native-paper';

export default function ProfileScreen() {
  // Mock user data
  const user = {
    name: 'Lauren Tan',
    email: 'lauren.tan@example.com',
    phone: '+65 9123 4567',
    memberSince: 'May 2023',
    nric: 'S9012345A',
    loyaltyTier: 'Gold',
    loyaltyPoints: 1250,
    notificationSettings: {
      email: true,
      push: true,
      sms: false
    },
    privacySettings: {
      dataSharing: false,
      marketingCommunications: true
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Avatar.Text 
              size={80} 
              label={user.name.split(' ').map(n => n[0]).join('')} 
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Title>{user.name}</Title>
              <Text>{user.email}</Text>
              <Text>{user.phone}</Text>
              <View style={styles.membershipBadge}>
                <Text style={styles.membershipText}>
                  {user.loyaltyTier} Member
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Loyalty Program</Title>
          
          <View style={styles.loyaltyContainer}>
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsLabel}>Available Points</Text>
              <Text style={styles.pointsValue}>{user.loyaltyPoints}</Text>
            </View>
            <Button mode="contained" style={styles.redeemButton}>
              Redeem Points
            </Button>
          </View>
          
          <View style={styles.loyaltyProgress}>
            <Text style={styles.loyaltyProgressText}>
              250 more points to reach Platinum tier
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${(user.loyaltyPoints / 1500) * 100}%` }
                  ]} 
                />
              </View>
              <View style={styles.tierLabels}>
                <Text style={styles.tierLabel}>Silver</Text>
                <Text style={styles.tierLabel}>Gold</Text>
                <Text style={styles.tierLabel}>Platinum</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Account Settings</Title>
          
          <List.Section>
            <List.Item
              title="Personal Information"
              description="Update your contact details and address"
              left={props => <List.Icon {...props} icon="account" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            
            <Divider />
            
            <List.Item
              title="Security Settings"
              description="Change password and security questions"
              left={props => <List.Icon {...props} icon="lock" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            
            <Divider />
            
            <List.Item
              title="Notification Preferences"
              description="Manage how we contact you"
              left={props => <List.Icon {...props} icon="bell" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            
            <Divider />
            
            <List.Item
              title="Privacy Settings"
              description="Control your data sharing preferences"
              left={props => <List.Icon {...props} icon="shield" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
          </List.Section>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Help & Support</Title>
          
          <List.Section>
            <List.Item
              title="Contact Support"
              description="Get help with your account or loans"
              left={props => <List.Icon {...props} icon="headset" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            
            <Divider />
            
            <List.Item
              title="FAQs"
              description="Find answers to common questions"
              left={props => <List.Icon {...props} icon="frequently-asked-questions" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            
            <Divider />
            
            <List.Item
              title="Give Feedback"
              description="Help us improve our services"
              left={props => <List.Icon {...props} icon="message-text" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
          </List.Section>
        </Card.Content>
      </Card>
      
      <Button
        mode="outlined"
        style={styles.logoutButton}
      >
        Sign Out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    margin: 16,
    marginBottom: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 20,
    backgroundColor: '#0051CC',
  },
  profileInfo: {
    flex: 1,
  },
  membershipBadge: {
    backgroundColor: '#f0ad4e',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  membershipText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  card: {
    margin: 16,
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  loyaltyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pointsContainer: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 14,
    color: '#666',
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0051CC',
  },
  redeemButton: {
    backgroundColor: '#0051CC',
  },
  loyaltyProgress: {
    marginTop: 8,
  },
  loyaltyProgressText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0051CC',
  },
  tierLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  tierLabel: {
    fontSize: 12,
    color: '#666',
  },
  logoutButton: {
    margin: 16,
    marginBottom: 30,
    borderColor: '#ff3b30',
    borderWidth: 1,
  },
}); 