import { AIRecommendations } from '@/app/components/Recommendations';
import { UserProfile } from '@/lib/types/user';
import { LoanOffer } from '@/lib/types/loan';

// Mock user profile
const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Lauren Tan',
  email: 'lauren@example.com',
  phoneNumber: '+6591234567',
  dateOfBirth: '1988-04-15',
  nationality: 'Singapore',
  nric: 'S8812345A',
  gender: 'female',
  maritalStatus: 'single',
  employmentStatus: 'employed',
  occupation: 'Software Engineer',
  employer: 'Tech Solutions Pte Ltd',
  employmentDuration: 36, // 3 years
  income: {
    monthly: 6500,
    annual: 78000
  },
  addresses: [
    {
      type: 'home',
      line1: '123 Orchard Road',
      city: 'Singapore',
      postalCode: '238841',
      country: 'Singapore',
      isPrimary: true
    }
  ],
  creditScore: 720,
  preferences: {
    communications: {
      email: true,
      sms: true,
      push: true
    },
    marketing: false,
    preferredLanguage: 'en',
    preferredBanks: ['DBS', 'OCBC']
  },
  kycVerified: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-05-15T00:00:00Z'
};

// Mock loan offers
const mockOffers: LoanOffer[] = [
  {
    id: '1',
    bankId: 'dbs001',
    bankName: 'DBS',
    bankLogo: '/images/banks/dbs.png',
    loanType: 'personal',
    name: 'Personal Loan Plus',
    description: 'Flexible personal loan with competitive rates',
    amount: 50000,
    interestRate: 4.5,
    effectiveInterestRate: 4.8,
    term: 60,
    monthlyPayment: 933,
    processingFee: 200,
    earlyRepaymentFee: 300,
    minimumCreditScore: 700,
    minimumIncome: 60000,
    minimumEmploymentDuration: 12,
    features: ['No early repayment fee', 'Quick approval'],
    requirements: ['Singaporean or PR', 'Min. age 21'],
    isPromoted: true,
    isLimitedTime: false,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    bankId: 'ocbc001',
    bankName: 'OCBC',
    bankLogo: '/images/banks/ocbc.png',
    loanType: 'personal',
    name: 'Flexible Loan',
    description: 'Tailored for your changing needs',
    amount: 45000,
    interestRate: 4.2,
    effectiveInterestRate: 4.5,
    term: 48,
    monthlyPayment: 1025,
    processingFee: 180,
    earlyRepaymentFee: 250,
    minimumCreditScore: 680,
    minimumIncome: 55000,
    minimumEmploymentDuration: 12,
    features: ['Flexible repayment', 'Cash rebates'],
    requirements: ['Singaporean or PR', 'Min. age 21'],
    isPromoted: false,
    isLimitedTime: true,
    promotionEndDate: '2023-12-31T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '3',
    bankId: 'uob001',
    bankName: 'UOB',
    bankLogo: '/images/banks/uob.png',
    loanType: 'personal',
    name: 'Premium Loan',
    description: 'Premium service for your financial needs',
    amount: 60000,
    interestRate: 4.8,
    effectiveInterestRate: 5.1,
    term: 72,
    monthlyPayment: 945,
    processingFee: 220,
    earlyRepaymentFee: 350,
    minimumCreditScore: 720,
    minimumIncome: 70000,
    minimumEmploymentDuration: 18,
    features: ['Premium customer service', 'Insurance bundling'],
    requirements: ['Singaporean or PR', 'Min. age 21'],
    isPromoted: false,
    isLimitedTime: false,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];

export default function RecommendationsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Personalized Loan Recommendations</h1>
      <p className="text-lg text-gray-600 mb-8">
        Based on your profile and preferences, we've identified these loans that might be perfect for you.
      </p>
      
      <AIRecommendations 
        userProfile={mockUserProfile as any} 
        availableOffers={mockOffers} 
      />
    </div>
  );
} 