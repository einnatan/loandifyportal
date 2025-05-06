import React from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Title, Paragraph, Text } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleApplyPress = () => {
    navigation.navigate('Apply' as never);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Title style={styles.heroTitle}>All Your Loan Options in One Place</Title>
        <Paragraph style={styles.heroSubtitle}>
          Apply once and receive offers from multiple lenders
        </Paragraph>
        <Button 
          mode="contained" 
          onPress={handleApplyPress}
          style={styles.applyButton}
          labelStyle={styles.applyButtonLabel}
        >
          Apply Now
        </Button>
      </View>

      <Card style={styles.calculatorCard}>
        <Card.Content>
          <Title>Loan Calculator</Title>
          <Paragraph>Estimate your monthly payments</Paragraph>
          {/* Simplified calculator UI for the prototype */}
          <View style={styles.calculatorControls}>
            <Text style={styles.calculatorResult}>S$458/month</Text>
            <Text style={styles.calculatorDetails}>for a S$15,000 loan at 3.88% for 36 months</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button>Adjust</Button>
          <Button mode="contained" onPress={handleApplyPress}>Continue</Button>
        </Card.Actions>
      </Card>

      <Title style={styles.sectionTitle}>How It Works</Title>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stepsContainer}
      >
        <Card style={styles.stepCard}>
          <Card.Content>
            <Title style={styles.stepNumber}>1</Title>
            <Title style={styles.stepTitle}>Apply Once</Title>
            <Paragraph>
              Fill out a single application with your details
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.stepCard}>
          <Card.Content>
            <Title style={styles.stepNumber}>2</Title>
            <Title style={styles.stepTitle}>Compare Offers</Title>
            <Paragraph>
              Receive and compare personalized loan offers
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.stepCard}>
          <Card.Content>
            <Title style={styles.stepNumber}>3</Title>
            <Title style={styles.stepTitle}>Get Your Loan</Title>
            <Paragraph>
              Select your preferred offer and complete the process
            </Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>

      <Title style={styles.sectionTitle}>Our Banking Partners</Title>
      <View style={styles.partnersContainer}>
        {/* Placeholder for bank logos */}
        <View style={styles.bankLogo}></View>
        <View style={styles.bankLogo}></View>
        <View style={styles.bankLogo}></View>
        <View style={styles.bankLogo}></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  hero: {
    backgroundColor: '#0051CC',
    padding: 24,
    alignItems: 'center',
  },
  heroTitle: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
  },
  applyButton: {
    padding: 4,
    width: 200,
  },
  applyButtonLabel: {
    fontSize: 16,
    padding: 4,
  },
  calculatorCard: {
    margin: 16,
    elevation: 4,
  },
  calculatorControls: {
    marginTop: 16,
    alignItems: 'center',
  },
  calculatorResult: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0051CC',
  },
  calculatorDetails: {
    marginTop: 8,
    color: '#666',
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  stepsContainer: {
    paddingHorizontal: 8,
  },
  stepCard: {
    width: width * 0.7,
    marginHorizontal: 8,
    elevation: 2,
  },
  stepNumber: {
    color: '#0051CC',
    fontSize: 28,
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 18,
  },
  partnersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 16,
    marginBottom: 24,
  },
  bankLogo: {
    width: 80,
    height: 40,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    margin: 8,
  },
}); 