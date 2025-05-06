import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Paragraph, Button, ProgressBar } from 'react-native-paper';

export default function DashboardScreen() {
  // Mock loan data
  const loans = [
    {
      id: 'L1001',
      lender: 'DBS Bank',
      originalAmount: 15000,
      remainingBalance: 10250,
      monthlyPayment: 458,
      nextDueDate: '2023-06-15',
      interestRate: 3.88,
      status: 'active',
      progress: 0.32
    },
    {
      id: 'L1002',
      lender: 'Standard Chartered',
      originalAmount: 8000,
      remainingBalance: 2100,
      monthlyPayment: 443,
      nextDueDate: '2023-06-18',
      interestRate: 3.48,
      status: 'active',
      progress: 0.74
    }
  ];

  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
  const totalMonthlyPayment = loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Your Loan Dashboard</Title>
        <Text style={styles.headerSubtitle}>
          Manage your active loans and payments
        </Text>
      </View>

      <View style={styles.summaryContainer}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Paragraph>Total Loans</Paragraph>
            <Title>{loans.length}</Title>
          </Card.Content>
        </Card>
        
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Paragraph>Outstanding Balance</Paragraph>
            <Title>${totalOutstanding.toLocaleString()}</Title>
          </Card.Content>
        </Card>
        
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Paragraph>Monthly Payment</Paragraph>
            <Title>${totalMonthlyPayment.toLocaleString()}</Title>
          </Card.Content>
        </Card>
      </View>

      <Title style={styles.sectionTitle}>Your Active Loans</Title>
      
      {loans.map(loan => (
        <Card key={loan.id} style={styles.loanCard}>
          <Card.Content>
            <View style={styles.loanHeader}>
              <Title>{loan.lender}</Title>
              <Text>Loan #{loan.id}</Text>
            </View>
            
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Remaining Balance</Text>
              <Text style={styles.balanceAmount}>${loan.remainingBalance.toLocaleString()}</Text>
            </View>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Original Amount</Text>
                <Text style={styles.detailValue}>${loan.originalAmount.toLocaleString()}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Monthly Payment</Text>
                <Text style={styles.detailValue}>${loan.monthlyPayment}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Next Payment</Text>
                <Text style={styles.detailValue}>{loan.nextDueDate}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Interest Rate</Text>
                <Text style={styles.detailValue}>{loan.interestRate}%</Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text>Repayment Progress</Text>
                <Text>{Math.round(loan.progress * 100)}%</Text>
              </View>
              <ProgressBar progress={loan.progress} color="#0051CC" style={styles.progressBar} />
            </View>
          </Card.Content>
          
          <Card.Actions>
            <Button>Payment History</Button>
            <Button>Schedule</Button>
            <Button mode="contained">Pay Now</Button>
          </Card.Actions>
        </Card>
      ))}
      
      <Card style={styles.offerCard}>
        <Card.Content>
          <Title>Special Offer</Title>
          <Paragraph>
            Based on your excellent repayment history, you're eligible for a second loan
            of up to $25,000 at a special rate.
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained">Apply Now</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
  },
  headerSubtitle: {
    color: '#666',
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  summaryCard: {
    flex: 1,
    margin: 8,
    minWidth: 100,
  },
  sectionTitle: {
    margin: 16,
  },
  loanCard: {
    margin: 16,
    marginTop: 0,
  },
  loanHeader: {
    marginBottom: 8,
  },
  balanceContainer: {
    marginVertical: 12,
  },
  balanceLabel: {
    color: '#666',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0051CC',
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  detailItem: {
    width: '50%',
    marginVertical: 8,
  },
  detailLabel: {
    color: '#666',
    fontSize: 12,
  },
  detailValue: {
    fontWeight: 'bold',
  },
  progressContainer: {
    marginVertical: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  offerCard: {
    margin: 16,
    backgroundColor: '#e6f0ff',
    borderColor: '#0051CC',
    borderWidth: 1,
  },
}); 