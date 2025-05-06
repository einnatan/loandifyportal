import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Title, Paragraph, Text, Chip, RadioButton } from 'react-native-paper';

export default function OffersScreen() {
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [filterRate, setFilterRate] = useState(false);
  const [filterAmount, setFilterAmount] = useState(false);

  // Mock loan offers data
  const offers = [
    {
      id: 'offer1',
      bank: 'DBS Bank',
      amount: 20000,
      interestRate: 3.88,
      term: 36,
      monthlyPayment: 594,
      processingFee: 200,
      totalInterest: 1358,
      approvalTime: '1-2 business days'
    },
    {
      id: 'offer2',
      bank: 'OCBC',
      amount: 15000,
      interestRate: 3.5,
      term: 24,
      monthlyPayment: 651,
      processingFee: 150,
      totalInterest: 622,
      approvalTime: 'Instant approval'
    },
    {
      id: 'offer3',
      bank: 'Standard Chartered',
      amount: 25000,
      interestRate: 4.2,
      term: 36,
      monthlyPayment: 751,
      processingFee: 250,
      totalInterest: 2072,
      approvalTime: '3-5 business days'
    }
  ];

  const filteredOffers = [...offers].sort((a, b) => {
    if (filterRate) {
      return a.interestRate - b.interestRate;
    }
    if (filterAmount) {
      return b.amount - a.amount;
    }
    return 0;
  });

  const handleSelectOffer = (id: string) => {
    setSelectedOffer(id);
  };

  const handleAcceptOffer = () => {
    if (!selectedOffer) return;
    // In a real app, this would navigate to a confirmation page or submit acceptance
    alert(`You've accepted the offer from ${offers.find(o => o.id === selectedOffer)?.bank}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Your Personalized Loan Offers</Title>
        <Paragraph style={styles.subtitle}>
          Based on your application, we've found these offers for you
        </Paragraph>
      </View>

      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Sort by:</Text>
        <View style={styles.chipContainer}>
          <Chip 
            selected={filterRate} 
            onPress={() => {
              setFilterRate(true);
              setFilterAmount(false);
            }}
            style={styles.chip}
          >
            Lowest Rate
          </Chip>
          
          <Chip 
            selected={filterAmount} 
            onPress={() => {
              setFilterRate(false);
              setFilterAmount(true);
            }}
            style={styles.chip}
          >
            Highest Amount
          </Chip>
        </View>
      </View>

      <RadioButton.Group 
        onValueChange={value => handleSelectOffer(value)} 
        value={selectedOffer || ''}
      >
        {filteredOffers.map(offer => (
          <Card 
            key={offer.id}
            style={[
              styles.offerCard,
              selectedOffer === offer.id ? styles.selectedCard : null
            ]}
            onPress={() => handleSelectOffer(offer.id)}
          >
            <View style={styles.radioContainer}>
              <RadioButton value={offer.id} />
              <View style={styles.bankLogo}>
                <Text style={styles.bankInitials}>
                  {offer.bank.split(' ')[0].charAt(0)}
                </Text>
              </View>
            </View>

            <Card.Content>
              <View style={styles.offerHeader}>
                <Text style={styles.bankName}>{offer.bank}</Text>
                <Text style={styles.interestRate}>{offer.interestRate}%</Text>
              </View>
              
              <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>Loan Amount</Text>
                <Text style={styles.amountValue}>${offer.amount.toLocaleString()}</Text>
              </View>

              <View style={styles.offerDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Monthly Payment</Text>
                  <Text style={styles.detailValue}>${offer.monthlyPayment}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Term</Text>
                  <Text style={styles.detailValue}>{offer.term} months</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Processing Fee</Text>
                  <Text style={styles.detailValue}>${offer.processingFee}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Total Interest</Text>
                  <Text style={styles.detailValue}>${offer.totalInterest}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Approval Time</Text>
                  <Text style={styles.detailValue}>{offer.approvalTime}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </RadioButton.Group>

      <Button
        mode="contained"
        onPress={handleAcceptOffer}
        disabled={!selectedOffer}
        style={styles.acceptButton}
        labelStyle={styles.acceptButtonLabel}
      >
        Accept Selected Offer
      </Button>

      <Card style={styles.bundleCard}>
        <Card.Content>
          <Title>Special Bundle Offer</Title>
          <Paragraph>
            Save more with our bundle offer. Combine your personal loan with 
            a credit card and get a 0.5% discount on your interest rate.
          </Paragraph>
          <Button mode="outlined" style={styles.bundleButton}>
            View Bundle Offers
          </Button>
        </Card.Content>
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
  title: {
    fontSize: 24,
  },
  subtitle: {
    color: '#666',
  },
  filtersContainer: {
    padding: 16,
    paddingTop: 0,
  },
  filterTitle: {
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  offerCard: {
    margin: 16,
    marginTop: 0,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#0051CC',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 0,
  },
  bankLogo: {
    width: 40,
    height: 40,
    backgroundColor: '#0051CC',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  bankInitials: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bankName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  interestRate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0051CC',
  },
  amountContainer: {
    marginVertical: 12,
  },
  amountLabel: {
    color: '#666',
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  offerDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    marginVertical: 4,
  },
  detailLabel: {
    color: '#666',
    fontSize: 12,
  },
  detailValue: {
    fontWeight: 'bold',
  },
  acceptButton: {
    margin: 16,
    padding: 4,
    backgroundColor: '#0051CC',
  },
  acceptButtonLabel: {
    fontSize: 16,
    padding: 4,
  },
  bundleCard: {
    margin: 16,
    backgroundColor: '#e6f0ff',
    borderColor: '#0051CC',
    borderWidth: 1,
    marginBottom: 30,
  },
  bundleButton: {
    marginTop: 16,
  },
}); 