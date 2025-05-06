'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  BarChart4, 
  ArrowRight, 
  CreditCard, 
  Calendar, 
  CircleDollarSign, 
  Percent, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'

// Types
type Loan = {
  id: string;
  lenderName: string;
  lenderLogo: string;
  amount: number;
  remainingAmount: number;
  interestRate: number;
  monthlyPayment: number;
  nextPaymentDate: string;
  term: number;
  completedTerms: number;
  status: 'Active' | 'Paid' | 'Late' | 'Default';
}

type LoyaltyPoints = {
  current: number;
  lifetime: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  nextTier: {
    name: string;
    requiredPoints: number;
    pointsRemaining: number;
  } | null;
}

// Mock data
const activeLoans: Loan[] = [
  {
    id: 'loan1',
    lenderName: 'First Bank',
    lenderLogo: '/bank-logo-1.svg',
    amount: 15000,
    remainingAmount: 9450,
    interestRate: 4.5,
    monthlyPayment: 445,
    nextPaymentDate: '2023-10-15',
    term: 36,
    completedTerms: 12,
    status: 'Active'
  },
  {
    id: 'loan2',
    lenderName: 'Global Loans',
    lenderLogo: '/bank-logo-4.svg',
    amount: 8000,
    remainingAmount: 1600,
    interestRate: 4.3,
    monthlyPayment: 235,
    nextPaymentDate: '2023-10-10',
    term: 36,
    completedTerms: 30,
    status: 'Active'
  },
  {
    id: 'loan3',
    lenderName: 'Metro Finance',
    lenderLogo: '/bank-logo-2.svg',
    amount: 5000,
    remainingAmount: 5000,
    interestRate: 4.8,
    monthlyPayment: 149,
    nextPaymentDate: '2023-10-05',
    term: 36,
    completedTerms: 0,
    status: 'Late'
  }
];

const loyaltyInfo: LoyaltyPoints = {
  current: 2750,
  lifetime: 3500,
  tier: 'Silver',
  nextTier: {
    name: 'Gold',
    requiredPoints: 5000,
    pointsRemaining: 2250
  }
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');
  
  const getTotalLoanBalance = () => {
    return activeLoans.reduce((total, loan) => total + loan.remainingAmount, 0);
  };
  
  const getTotalMonthlyPayments = () => {
    return activeLoans.reduce((total, loan) => total + loan.monthlyPayment, 0);
  };
  
  const getNextPaymentDate = () => {
    const dates = activeLoans.map(loan => new Date(loan.nextPaymentDate));
    return dates.sort((a, b) => a.getTime() - b.getTime())[0];
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const getStatusColor = (status: Loan['status']) => {
    switch (status) {
      case 'Active':
        return 'text-green-500';
      case 'Paid':
        return 'text-blue-500';
      case 'Late':
        return 'text-yellow-500';
      case 'Default':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  const getStatusIcon = (status: Loan['status']) => {
    switch (status) {
      case 'Active':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'Paid':
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
      case 'Late':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'Default':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with gradient background */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        {/* Background pattern/texture */}
        <div className="absolute inset-0 hero-bg-gradient opacity-80 z-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 decorative-blob-1"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 decorative-blob-2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <motion.h1 
                className="text-4xl font-bold mb-2 leading-tight font-display"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-gradient text-gradient-primary">Dashboard</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                Welcome back, John! Here's an overview of your loans and rewards.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button 
                asChild
                className="flex gap-2 items-center bg-gradient-primary text-white font-bold shadow-lg hover:shadow-xl"
              >
                <Link href="/apply">Apply for New Loan <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </motion.div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-lg border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-10 rounded-full translate-x-20 -translate-y-20 blur-2xl"></div>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <CircleDollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Total Loan Balance</h3>
                      <p className="text-2xl font-bold">${getTotalLoanBalance().toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Across {activeLoans.length} active loans
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="shadow-lg border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-10 rounded-full translate-x-20 -translate-y-20 blur-2xl"></div>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Monthly Payments</h3>
                      <p className="text-2xl font-bold">${getTotalMonthlyPayments().toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Next payment: {formatDate(getNextPaymentDate().toISOString())}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="shadow-lg border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-10 rounded-full translate-x-20 -translate-y-20 blur-2xl"></div>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Loyalty Points</h3>
                      <p className="text-2xl font-bold">{loyaltyInfo.current.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {loyaltyInfo.tier} Tier • {loyaltyInfo.nextTier ? 
                      `${loyaltyInfo.nextTier.pointsRemaining} points to ${loyaltyInfo.nextTier.name}` : 
                      'Highest tier achieved'}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="rounded-xl bg-white p-2 border border-gray-200 shadow-sm mb-6">
            <div className="flex">
              <button
                className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'details'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('details')}
              >
                Loan Details
              </button>
            </div>
          </div>

          {/* Main content based on active tab */}
          <div className="mb-12">
            {activeTab === 'overview' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-lg border border-gray-100 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-5 rounded-full translate-x-20 -translate-y-20 blur-2xl"></div>
                  <CardHeader>
                    <CardTitle>Your Active Loans</CardTitle>
                    <CardDescription>
                      Overview of your current loan commitments
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-6 py-3 text-left font-medium text-gray-500">Lender</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-500">Amount</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-500">Monthly</th>
                            <th className="px-6 py-3 text-center font-medium text-gray-500">Progress</th>
                            <th className="px-6 py-3 text-right font-medium text-gray-500">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeLoans.map((loan) => (
                            <tr key={loan.id} className="border-b hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0 mr-3 bg-gray-100 rounded-full flex items-center justify-center">
                                    {/* Placeholder for bank logo */}
                                    <span className="text-sm font-medium">{loan.lenderName.substring(0, 2)}</span>
                                  </div>
                                  <div>
                                    <div className="font-medium">{loan.lenderName}</div>
                                    <div className="text-xs text-gray-500">{loan.term} months</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="font-medium">${loan.remainingAmount.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">of ${loan.amount.toLocaleString()}</div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="font-medium">${loan.monthlyPayment}</div>
                                <div className="text-xs text-gray-500">{loan.interestRate}% APR</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                  <div 
                                    className="bg-primary h-2.5 rounded-full" 
                                    style={{ width: `${(loan.completedTerms / loan.term) * 100}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs text-gray-500 text-center">
                                  {loan.completedTerms} of {loan.term} payments
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end">
                                  {getStatusIcon(loan.status)}
                                  <span className={`ml-1 ${getStatusColor(loan.status)}`}>
                                    {loan.status}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">Due {formatDate(loan.nextPaymentDate)}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Loan details tab content */}
                <Card className="shadow-lg border border-gray-100 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-5 rounded-full translate-x-20 -translate-y-20 blur-2xl"></div>
                  <CardHeader>
                    <CardTitle>Loan Details</CardTitle>
                    <CardDescription>
                      Comprehensive information about your loans
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {activeLoans.map((loan) => (
                        <div key={loan.id} className="p-6 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                              <div className="h-12 w-12 flex-shrink-0 mr-3 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium">{loan.lenderName.substring(0, 2)}</span>
                              </div>
                              <div>
                                <div className="font-bold text-lg">{loan.lenderName}</div>
                                <div className="text-sm text-gray-500">Loan #{loan.id}</div>
                              </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm ${
                              loan.status === 'Active' ? 'bg-green-100 text-green-700' :
                              loan.status === 'Late' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {loan.status}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-gray-500">Original Amount</div>
                              <div className="font-medium">${loan.amount.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Remaining</div>
                              <div className="font-medium">${loan.remainingAmount.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Interest Rate</div>
                              <div className="font-medium">{loan.interestRate}%</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Monthly Payment</div>
                              <div className="font-medium">${loan.monthlyPayment}</div>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-500">Repayment Progress</span>
                              <span className="text-gray-500">{loan.completedTerms}/{loan.term} payments</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${(loan.completedTerms / loan.term) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              Next payment: <span className="font-medium">{formatDate(loan.nextPaymentDate)}</span>
                            </div>
                            <Button size="sm" variant="outline">View Statement</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
} 