import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, Divider, Surface, DataTable, Chip } from 'react-native-paper';
import { Slider as MuiSlider } from '@mui/material';

export default function LoanCalculatorScreen() {
  // State for loan parameters
  const [loanAmount, setLoanAmount] = useState(10000);
  const [loanTerm, setLoanTerm] = useState(24);
  const [interestRate, setInterestRate] = useState(3.5);
  const [downPayment, setDownPayment] = useState(0);
  const [processingFee, setProcessingFee] = useState(1.0);
  
  // State for comparison loans
  const [comparisonLoans, setComparisonLoans] = useState<Array<{
    id: string;
    name: string;
    amount: number;
    term: number;
    interestRate: number;
    processingFee: number;
    monthlyPayment: number;
    totalInterest: number;
    totalAmount: number;
  }>>([]);
  
  // State for calculation results
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Calculate loan details
  useEffect(() => {
    calculateLoan(loanAmount, loanTerm, interestRate, downPayment, processingFee);
  }, [loanAmount, loanTerm, interestRate, downPayment, processingFee]);
  
  const calculateLoan = (amount: number, term: number, rate: number, down: number, fee: number) => {
    const principal = amount - down;
    const monthlyRate = rate / 100 / 12;
    const months = term;
    
    // Calculate monthly payment (PMT formula)
    const payment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
    
    // Calculate total interest
    const totalInterestAmount = (payment * months) - principal;
    
    // Calculate total amount including processing fee
    const processingFeeAmount = (principal * fee) / 100;
    const totalAmountValue = principal + totalInterestAmount + processingFeeAmount;
    
    setMonthlyPayment(payment);
    setTotalInterest(totalInterestAmount);
    setTotalAmount(totalAmountValue);
  };
  
  // Add current loan to comparison
  const addToComparison = () => {
    const newLoan = {
      id: Date.now().toString(),
      name: `Loan Option ${comparisonLoans.length + 1}`,
      amount: loanAmount,
      term: loanTerm,
      interestRate: interestRate,
      processingFee: processingFee,
      monthlyPayment: monthlyPayment,
      totalInterest: totalInterest,
      totalAmount: totalAmount
    };
    
    setComparisonLoans([...comparisonLoans, newLoan]);
  };
  
  // Remove loan from comparison
  const removeFromComparison = (id: string) => {
    setComparisonLoans(comparisonLoans.filter(loan => loan.id !== id));
  };
  
  // Reset calculator to defaults
  const resetCalculator = () => {
    setLoanAmount(10000);
    setLoanTerm(24);
    setInterestRate(3.5);
    setDownPayment(0);
    setProcessingFee(1.0);
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Advanced Loan Calculator</Title>
        <Text style={styles.headerSubtitle}>
          Compare different loan options to find the best deal
        </Text>
      </View>
      
      <Card style={styles.calculatorCard}>
        <Card.Content>
          <Title>Loan Parameters</Title>
          
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text>Loan Amount</Text>
              <Text style={styles.sliderValue}>{formatCurrency(loanAmount)}</Text>
            </View>
            <MuiSlider
              value={loanAmount}
              onChange={(_, value) => setLoanAmount(value as number)}
              min={1000}
              max={100000}
              step={1000}
            />
          </View>
          
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text>Loan Term (months)</Text>
              <Text style={styles.sliderValue}>{loanTerm}</Text>
            </View>
            <MuiSlider
              value={loanTerm}
              onChange={(_, value) => setLoanTerm(value as number)}
              min={6}
              max={60}
              step={6}
            />
          </View>
          
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text>Interest Rate (%)</Text>
              <Text style={styles.sliderValue}>{interestRate.toFixed(2)}%</Text>
            </View>
            <MuiSlider
              value={interestRate}
              onChange={(_, value) => setInterestRate(value as number)}
              min={1}
              max={10}
              step={0.1}
            />
          </View>
          
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text>Down Payment</Text>
              <Text style={styles.sliderValue}>{formatCurrency(downPayment)}</Text>
            </View>
            <MuiSlider
              value={downPayment}
              onChange={(_, value) => setDownPayment(value as number)}
              min={0}
              max={loanAmount * 0.5}
              step={500}
            />
          </View>
          
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text>Processing Fee (%)</Text>
              <Text style={styles.sliderValue}>{processingFee.toFixed(2)}%</Text>
            </View>
            <MuiSlider
              value={processingFee}
              onChange={(_, value) => setProcessingFee(value as number)}
              min={0}
              max={3}
              step={0.1}
            />
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.resultsCard}>
        <Card.Content>
          <Title>Calculation Results</Title>
          
          <Surface style={styles.resultItem}>
            <Text style={styles.resultLabel}>Monthly Payment</Text>
            <Text style={styles.resultValue}>{formatCurrency(monthlyPayment)}</Text>
          </Surface>
          
          <Surface style={styles.resultItem}>
            <Text style={styles.resultLabel}>Total Interest</Text>
            <Text style={styles.resultValue}>{formatCurrency(totalInterest)}</Text>
          </Surface>
          
          <Surface style={styles.resultItem}>
            <Text style={styles.resultLabel}>Processing Fee</Text>
            <Text style={styles.resultValue}>{formatCurrency((loanAmount - downPayment) * processingFee / 100)}</Text>
          </Surface>
          
          <Surface style={styles.resultItem}>
            <Text style={styles.resultLabel}>Total Amount Payable</Text>
            <Text style={[styles.resultValue, styles.totalValue]}>{formatCurrency(totalAmount)}</Text>
          </Surface>
          
          <View style={styles.buttonContainer}>
            <Button mode="outlined" onPress={resetCalculator} style={styles.button}>
              Reset
            </Button>
            <Button mode="contained" onPress={addToComparison} style={styles.button}>
              Add to Comparison
            </Button>
          </View>
        </Card.Content>
      </Card>
      
      {comparisonLoans.length > 0 && (
        <Card style={styles.comparisonCard}>
          <Card.Content>
            <Title>Loan Comparison</Title>
            <Text style={styles.comparisonSubtitle}>Compare different loan options</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <DataTable style={styles.table}>
                <DataTable.Header>
                  <DataTable.Title>Option</DataTable.Title>
                  <DataTable.Title numeric>Amount</DataTable.Title>
                  <DataTable.Title numeric>Term</DataTable.Title>
                  <DataTable.Title numeric>Rate</DataTable.Title>
                  <DataTable.Title numeric>Monthly</DataTable.Title>
                  <DataTable.Title numeric>Total</DataTable.Title>
                  <DataTable.Title>Actions</DataTable.Title>
                </DataTable.Header>
                
                {comparisonLoans.map(loan => (
                  <DataTable.Row key={loan.id}>
                    <DataTable.Cell>{loan.name}</DataTable.Cell>
                    <DataTable.Cell numeric>{formatCurrency(loan.amount)}</DataTable.Cell>
                    <DataTable.Cell numeric>{loan.term}</DataTable.Cell>
                    <DataTable.Cell numeric>{loan.interestRate.toFixed(2)}%</DataTable.Cell>
                    <DataTable.Cell numeric>{formatCurrency(loan.monthlyPayment)}</DataTable.Cell>
                    <DataTable.Cell numeric>{formatCurrency(loan.totalAmount)}</DataTable.Cell>
                    <DataTable.Cell>
                      <Button 
                        compact 
                        mode="text" 
                        onPress={() => removeFromComparison(loan.id)}
                      >
                        Remove
                      </Button>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </ScrollView>
            
            <View style={styles.bestDealContainer}>
              <Title style={styles.bestDealTitle}>Best Deal</Title>
              {comparisonLoans.length > 0 && (
                <View>
                  <Chip 
                    icon="check-circle" 
                    style={styles.bestDealChip}
                  >
                    {comparisonLoans.reduce((prev, current) => 
                      prev.totalAmount < current.totalAmount ? prev : current
                    ).name}
                  </Chip>
                  <Text style={styles.bestDealText}>
                    Based on lowest total amount payable
                  </Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      )}
      
      <Card style={styles.tipsCard}>
        <Card.Content>
          <Title>Loan Tips</Title>
          <Divider style={styles.divider} />
          <Text style={styles.tipItem}>• Shorter loan terms usually mean higher monthly payments but lower total interest.</Text>
          <Text style={styles.tipItem}>• Making a larger down payment can reduce your interest costs.</Text>
          <Text style={styles.tipItem}>• Check for processing fees and other hidden charges.</Text>
          <Text style={styles.tipItem}>• Consider your debt-to-income ratio before taking on new loans.</Text>
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
  headerTitle: {
    fontSize: 24,
  },
  headerSubtitle: {
    color: '#666',
  },
  calculatorCard: {
    margin: 16,
    marginTop: 0,
  },
  sliderContainer: {
    marginVertical: 12,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sliderValue: {
    fontWeight: 'bold',
  },
  resultsCard: {
    margin: 16,
    marginTop: 0,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 1,
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    color: '#0051CC',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  comparisonCard: {
    margin: 16,
    marginTop: 0,
  },
  comparisonSubtitle: {
    color: '#666',
    marginBottom: 16,
  },
  table: {
    minWidth: 600,
  },
  bestDealContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e6f0ff',
    borderRadius: 8,
  },
  bestDealTitle: {
    fontSize: 18,
  },
  bestDealChip: {
    marginVertical: 8,
    backgroundColor: '#0051CC',
  },
  bestDealText: {
    fontSize: 12,
    color: '#666',
  },
  tipsCard: {
    margin: 16,
    marginTop: 0,
    marginBottom: 32,
  },
  divider: {
    marginVertical: 12,
  },
  tipItem: {
    marginVertical: 4,
  },
}); 