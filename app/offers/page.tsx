'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CalendarDays, Check, Filter, ChevronRight, Briefcase, Award, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card'
import { motion } from 'framer-motion'

// Types
type Lender = {
  id: string;
  name: string;
  logo: string;
  rating: number;
  approvalRate: string;
}

type LoanOfferDetail = {
  id: string;
  lenderId: string;
  lenderName: string;
  lenderLogo: string;
  amount: number;
  interestRate: number;
  monthlyPayment: number;
  term: number;
  processingFee: number;
  totalInterest: number;
  features: string[];
  isPromoted: boolean;
}

type BundleOffer = {
  id: string;
  lenders: {
    id: string;
    lenderName: string;
    lenderLogo: string;
    amount: number;
    interestRate: number;
  }[];
  totalAmount: number;
  averageInterestRate: number;
  monthlyPayment: number;
  term: number;
  processingFee: number;
  totalInterest: number;
  features: string[];
}

// Mock Data
const lenders: Lender[] = [
  { id: 'lender1', name: 'First Bank', logo: '/bank-logo-1.svg', rating: 4.7, approvalRate: '90%' },
  { id: 'lender2', name: 'Metro Finance', logo: '/bank-logo-2.svg', rating: 4.5, approvalRate: '85%' },
  { id: 'lender3', name: 'Unity Credit', logo: '/bank-logo-3.svg', rating: 4.3, approvalRate: '88%' },
  { id: 'lender4', name: 'Global Loans', logo: '/bank-logo-4.svg', rating: 4.6, approvalRate: '92%' },
  { id: 'lender5', name: 'Apex Capital', logo: '/bank-logo-5.svg', rating: 4.4, approvalRate: '87%' },
];

const individualOffers: LoanOfferDetail[] = [
  {
    id: 'offer1',
    lenderId: 'lender1',
    lenderName: 'First Bank',
    lenderLogo: '/bank-logo-1.svg',
    amount: 15000,
    interestRate: 4.5,
    monthlyPayment: 445,
    term: 36,
    processingFee: 150,
    totalInterest: 1020,
    features: ['No early repayment fee', 'Instant approval', 'Fixed interest rate'],
    isPromoted: true
  },
  {
    id: 'offer2',
    lenderId: 'lender2',
    lenderName: 'Metro Finance',
    lenderLogo: '/bank-logo-2.svg',
    amount: 20000,
    interestRate: 4.8,
    monthlyPayment: 600,
    term: 60,
    processingFee: 100,
    totalInterest: 1580,
    features: ['No processing fee for existing customers', 'Fixed interest rate'],
    isPromoted: false
  },
  {
    id: 'offer3',
    lenderId: 'lender3',
    lenderName: 'Unity Credit',
    lenderLogo: '/bank-logo-3.svg',
    amount: 15000,
    interestRate: 4.6,
    monthlyPayment: 447,
    term: 48,
    processingFee: 125,
    totalInterest: 1040,
    features: ['Mobile app tracking', 'Fixed interest rate', 'Flexible repayment options'],
    isPromoted: false
  },
  {
    id: 'offer4',
    lenderId: 'lender4',
    lenderName: 'Global Loans',
    lenderLogo: '/bank-logo-4.svg',
    amount: 25000,
    interestRate: 4.3,
    monthlyPayment: 740,
    term: 24,
    processingFee: 175,
    totalInterest: 1580,
    features: ['Cash rebate after 12 months', 'No early repayment fee'],
    isPromoted: true
  },
  {
    id: 'offer5',
    lenderId: 'lender5',
    lenderName: 'Apex Capital',
    lenderLogo: '/bank-logo-5.svg',
    amount: 18000,
    interestRate: 4.7,
    monthlyPayment: 520,
    term: 42,
    processingFee: 100,
    totalInterest: 1060,
    features: ['Loyalty rewards', 'Interest-free period available'],
    isPromoted: false
  },
];

const bundleOffers: BundleOffer[] = [
  {
    id: 'bundle1',
    lenders: [
      {
        id: 'lender1',
        lenderName: 'First Bank',
        lenderLogo: '/bank-logo-1.svg',
        amount: 15000,
        interestRate: 4.5
      },
      {
        id: 'lender4',
        lenderName: 'Global Loans',
        lenderLogo: '/bank-logo-4.svg',
        amount: 10000,
        interestRate: 4.3
      }
    ],
    totalAmount: 25000,
    averageInterestRate: 4.4,
    monthlyPayment: 736,
    term: 36,
    processingFee: 250,
    totalInterest: 1550,
    features: ['Single monthly payment', 'Combined application', 'Lower average interest rate']
  },
  {
    id: 'bundle2',
    lenders: [
      {
        id: 'lender2',
        lenderName: 'Metro Finance',
        lenderLogo: '/bank-logo-2.svg',
        amount: 20000,
        interestRate: 4.8
      },
      {
        id: 'lender5',
        lenderName: 'Apex Capital',
        lenderLogo: '/bank-logo-5.svg',
        amount: 15000,
        interestRate: 4.7
      }
    ],
    totalAmount: 35000,
    averageInterestRate: 4.75,
    monthlyPayment: 1050,
    term: 48,
    processingFee: 300,
    totalInterest: 2400,
    features: ['Higher combined loan amount', 'Simplified documentation', 'Single credit check']
  }
];

export default function OffersPage() {
  const [activeTab, setActiveTab] = useState<'individual' | 'bundled'>('individual');
  const [activeFilter, setActiveFilter] = useState<'amount' | 'tenure' | 'interestRate' | 'monthlyPayment' | 'totalInterest' | 'processingFee' | null>(null);
  const [sortedIndividualOffers, setSortedIndividualOffers] = useState<LoanOfferDetail[]>(individualOffers);
  const [sortedBundleOffers, setSortedBundleOffers] = useState<BundleOffer[]>(bundleOffers);
  
  // Calculate total accessible credit - considering the maximum possible amount
  const maxIndividualCredit = Math.max(...individualOffers.map(offer => offer.amount));
  const maxBundleCredit = Math.max(...bundleOffers.map(bundle => bundle.totalAmount));
  const totalAccessibleCredit = Math.max(maxIndividualCredit, maxBundleCredit);
  
  // Helper function to sort offers
  const sortOffers = (filterType: 'amount' | 'tenure' | 'interestRate' | 'monthlyPayment' | 'totalInterest' | 'processingFee' | null) => {
    // Sort individual offers
    const sortedIndividual = [...individualOffers].sort((a, b) => {
      // Apply specific filter first
      if (filterType === 'amount') {
        // For amount filter, sort purely by amount without considering promotion status
        console.log(`Comparing ${a.amount} vs ${b.amount}`);
        return b.amount - a.amount; // Highest to lowest
      }
      
      if (filterType === 'tenure') {
        // For tenure filter, sort purely by tenure without considering promotion status
        return b.term - a.term; // Longest to shortest
      }
      
      if (filterType === 'interestRate') {
        // For interest rate filter, sort purely by interest rate without considering promotion status
        return a.interestRate - b.interestRate; // Lowest to highest
      }
      
      if (filterType === 'monthlyPayment') {
        // For monthly payment filter, sort by monthly payment
        return a.monthlyPayment - b.monthlyPayment; // Lowest to highest
      }
      
      if (filterType === 'totalInterest') {
        // For total interest filter, sort by total interest
        return a.totalInterest - b.totalInterest; // Lowest to highest
      }
      
      if (filterType === 'processingFee') {
        // For processing fee filter, sort by processing fee
        return a.processingFee - b.processingFee; // Lowest to highest
      }
      
      // For other filters or no filter, prioritize featured offers first
      if (a.isPromoted && !b.isPromoted) return -1;
      if (!a.isPromoted && b.isPromoted) return 1;
      
      // Default sorting by tenure when no filter is active
      return b.term - a.term; // Longest to shortest by default
    });

    // Sort bundle offers
    const sortedBundle = [...bundleOffers].sort((a, b) => {
      if (filterType === 'amount') {
        console.log(`Comparing ${a.totalAmount} vs ${b.totalAmount}`);
        return b.totalAmount - a.totalAmount; // Highest to lowest
      }
      
      if (filterType === 'tenure') {
        return b.term - a.term; // Longest to shortest
      }
      
      if (filterType === 'interestRate') {
        return a.averageInterestRate - b.averageInterestRate; // Lowest to highest
      }
      
      if (filterType === 'monthlyPayment') {
        return a.monthlyPayment - b.monthlyPayment; // Lowest to highest
      }
      
      if (filterType === 'totalInterest') {
        return a.totalInterest - b.totalInterest; // Lowest to highest
      }
      
      if (filterType === 'processingFee') {
        return a.processingFee - b.processingFee; // Lowest to highest
      }
      
      // Default sorting by tenure when no filter is active
      return b.term - a.term; // Longest to shortest by default
    });

    setSortedIndividualOffers(sortedIndividual);
    setSortedBundleOffers(sortedBundle);
  };
  
  // Modified filter function 
  const setFilter = (filter: 'amount' | 'tenure' | 'interestRate' | 'monthlyPayment' | 'totalInterest' | 'processingFee') => {
    console.log('Current filter:', activeFilter);
    console.log('Setting filter to:', filter);
    
    // Update the filter state
    setActiveFilter(filter);
    
    // Sort offers with the new filter
    sortOffers(filter);
  };

  // Apply initial sorting when component mounts
  useEffect(() => {
    sortOffers(activeFilter);
  }, [activeFilter]);

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
          <div className="mb-8">
            <motion.h1 
              className="text-4xl font-bold mb-2 leading-tight font-display" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-gradient text-gradient-primary">Your Personalized Loan Offers</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Based on your application, we've found {sortedIndividualOffers.length} individual offers 
              and {sortedBundleOffers.length} bundled offers for you.
            </motion.p>
          </div>
          
          {/* Accessible Credit Section */}
          <motion.div
            className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-primary opacity-5 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl"></div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Accessible Credit</h2>
                <p className="text-gray-600">The maximum amount of credit available to you based on your application</p>
              </div>
              <div className="bg-gradient-primary text-white rounded-xl px-6 py-4 text-center shadow-md">
                <div className="text-lg font-medium mb-1">Total Credit Available</div>
                <div className="text-3xl font-bold">${totalAccessibleCredit.toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                <div className="flex items-start mb-2">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p>Your credit score and financial profile qualify you for this amount of total lending</p>
                </div>
                <div className="flex items-start mb-2">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p>You can choose a single loan or multiple smaller loans up to this amount</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p>Bundled offers allow you to access more of your available credit through multiple lenders</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="rounded-xl bg-white p-2 border border-gray-100 shadow-sm mb-6">
            <div className="flex">
              <button
                className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'individual'
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('individual')}
              >
                <span>Individual Offers</span>
              </button>
              <button
                className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'bundled'
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('bundled')}
              >
                <span>Bundled Offers</span>
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <motion.div 
            className="flex flex-wrap gap-2 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="text-gray-500 flex items-center mr-2">
              <Filter className="h-4 w-4 mr-1" /> Sort by:
            </div>
            <Button
              variant={activeFilter === 'amount' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('amount')}
              className="rounded-full border-gray-200"
            >
              Loan Amount
            </Button>
            <Button
              variant={activeFilter === 'tenure' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('tenure')}
              className="rounded-full border-gray-200"
            >
              Tenure
            </Button>
            <Button
              variant={activeFilter === 'interestRate' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('interestRate')}
              className="rounded-full border-gray-200"
            >
              Interest Rate
            </Button>
            <Button
              variant={activeFilter === 'monthlyPayment' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('monthlyPayment')}
              className="rounded-full border-gray-200"
            >
              Monthly Payment
            </Button>
            <Button
              variant={activeFilter === 'totalInterest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('totalInterest')}
              className="rounded-full border-gray-200"
            >
              Total Interest
            </Button>
            <Button
              variant={activeFilter === 'processingFee' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('processingFee')}
              className="rounded-full border-gray-200"
            >
              Processing Fee
            </Button>
          </motion.div>

          {/* Individual Offers */}
          {activeTab === 'individual' && (
            <div className="space-y-6 mb-10">
              {sortedIndividualOffers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`overflow-hidden relative ${offer.isPromoted ? 'shadow-md' : 'shadow-md'} border-0`}>
                    {offer.isPromoted && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-primary text-white text-xs px-3 py-1 font-medium">
                          Best Offer
                        </div>
                      </div>
                    )}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-5 rounded-full translate-x-20 -translate-y-20 blur-2xl"></div>
                    <CardContent className="p-6">
                      <div className="md:flex justify-between items-start">
                        <div className="flex items-center mb-4 md:mb-0">
                          <div className="h-12 w-12 flex-shrink-0 mr-3 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">{offer.lenderName.substring(0, 2)}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{offer.lenderName}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="text-primary font-medium">{offer.interestRate}% APR</span>
                              <span className="mx-2">•</span>
                              <span>{offer.term} months</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right mb-4 md:mb-0">
                          <div className="text-lg font-bold">${offer.amount.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">Total loan amount</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 pt-4 border-t border-gray-100">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Monthly Payment</div>
                          <div className="text-xl font-bold">${offer.monthlyPayment}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Processing Fee</div>
                          <div className="text-xl font-bold">${offer.processingFee}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Total Interest</div>
                          <div className="text-xl font-bold">${offer.totalInterest}</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {offer.features.map((feature, i) => (
                          <div key={i} className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center">
                            <Check className="h-3 w-3 text-primary mr-1" /> {feature}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-100">
                        <Button asChild className="sm:flex-1 bg-gradient-primary shadow-md">
                          <Link href={`/appointments/schedule?offer=${offer.id}`}>
                            Accept Offer <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Bundled Offers */}
          {activeTab === 'bundled' && (
            <div className="space-y-6 mb-10">
              {sortedBundleOffers.map((bundle, index) => (
                <motion.div
                  key={bundle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden relative shadow-md border-0">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-5 rounded-full translate-x-20 -translate-y-20 blur-2xl"></div>
                    <CardHeader>
                      <CardTitle>Bundle Offer</CardTitle>
                      <CardDescription>Combined loan package from multiple lenders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="md:flex justify-between items-start mb-6">
                        <div>
                          <div className="text-lg font-bold">${bundle.totalAmount.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">Total loan amount</div>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <div className="text-lg font-bold">{bundle.averageInterestRate}% APR</div>
                          <div className="text-sm text-gray-500">Average interest rate</div>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <div className="text-lg font-bold">${bundle.monthlyPayment}</div>
                          <div className="text-sm text-gray-500">Monthly payment</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 pt-4 border-t border-gray-100">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Loan Tenure</div>
                          <div className="text-xl font-bold">{bundle.term} months</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Processing Fee</div>
                          <div className="text-xl font-bold">${bundle.processingFee}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Total Interest</div>
                          <div className="text-xl font-bold">${bundle.totalInterest}</div>
                        </div>
                      </div>
                      
                      <div className="border border-gray-100 rounded-lg p-4 mb-6">
                        <h4 className="font-medium mb-3">Participating Lenders</h4>
                        <div className="space-y-4">
                          {bundle.lenders.map((lender) => (
                            <div key={lender.id} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="h-8 w-8 flex-shrink-0 mr-3 bg-gray-100 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium">{lender.lenderName.substring(0, 2)}</span>
                                </div>
                                <div className="font-medium">{lender.lenderName}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">${lender.amount.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">{lender.interestRate}% APR</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {bundle.features.map((feature, i) => (
                          <div key={i} className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center">
                            <Check className="h-3 w-3 text-primary mr-1" /> {feature}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-100">
                        <Button asChild className="sm:flex-1 bg-gradient-primary shadow-md">
                          <Link href={`/appointments/schedule?bundle=${bundle.id}`}>
                            Accept Bundle <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
} 