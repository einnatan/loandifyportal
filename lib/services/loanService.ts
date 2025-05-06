import { LoanOffer, BundledOffer } from '../types/loans';

// Mock loan offers data
const mockLoanOffers: LoanOffer[] = [
  {
    id: 'offer-1',
    lenderId: 'lender-1',
    lenderName: 'First Bank',
    lenderLogo: '/lender-logos/first-bank.svg',
    amount: 20000,
    interestRate: 4.5,
    termMonths: 36,
    monthlyPayment: 595.48,
    totalRepayment: 21437.28,
    type: 'Personal Loan',
    processingFee: 200,
    earlyRepaymentFee: 0,
    lateFee: 50,
    approvalSpeed: 'fast',
    minimumCreditScore: 700,
    minimumIncome: 60000,
    isPromoted: true,
    features: ['No early repayment fee', 'Flexible loan amount', 'Fixed interest rate'],
    documents: ['NRIC', 'Latest payslip', 'Bank statements (3 months)']
  },
  {
    id: 'offer-2',
    lenderId: 'lender-2',
    lenderName: 'Prosperity Credit',
    lenderLogo: '/lender-logos/prosperity.svg',
    amount: 15000,
    interestRate: 3.9,
    termMonths: 24,
    monthlyPayment: 652.75,
    totalRepayment: 15666.00,
    type: 'Personal Loan',
    processingFee: 150,
    earlyRepaymentFee: 100,
    lateFee: 30,
    approvalSpeed: 'standard',
    minimumCreditScore: 680,
    minimumIncome: 48000,
    isPromoted: false,
    features: ['Low interest rate', 'Online application', 'Same-day disbursement'],
    documents: ['NRIC', 'Latest payslip', 'Income tax notice']
  },
  {
    id: 'offer-3',
    lenderId: 'lender-3',
    lenderName: 'TechFinance',
    lenderLogo: '/lender-logos/techfinance.svg',
    amount: 25000,
    interestRate: 5.1,
    termMonths: 48,
    monthlyPayment: 577.12,
    totalRepayment: 27701.76,
    type: 'Personal Loan',
    processingFee: 0,
    earlyRepaymentFee: 200,
    lateFee: 45,
    approvalSpeed: 'instant',
    minimumCreditScore: 650,
    minimumIncome: 36000,
    isPromoted: true,
    features: ['No processing fee', 'Instant approval', 'Flexible repayment options'],
    documents: ['NRIC', 'Latest 2 payslips']
  },
  {
    id: 'offer-4',
    lenderId: 'lender-4',
    lenderName: 'Heritage Bank',
    lenderLogo: '/lender-logos/heritage.svg',
    amount: 30000,
    interestRate: 4.8,
    termMonths: 60,
    monthlyPayment: 563.35,
    totalRepayment: 33801.00,
    type: 'Home Improvement',
    processingFee: 300,
    earlyRepaymentFee: 0,
    lateFee: 60,
    approvalSpeed: 'standard',
    minimumCreditScore: 720,
    minimumIncome: 72000,
    isPromoted: false,
    features: ['Special rate for home improvement', 'Fixed monthly payments', 'No early repayment fee'],
    documents: ['NRIC', 'Latest payslip', 'Bank statements (6 months)', 'Property documents']
  },
  {
    id: 'offer-5',
    lenderId: 'lender-5',
    lenderName: 'Unity Finance',
    lenderLogo: '/lender-logos/unity.svg',
    amount: 12000,
    interestRate: 6.2,
    termMonths: 24,
    monthlyPayment: 533.42,
    totalRepayment: 12802.08,
    type: 'Personal Loan',
    processingFee: 100,
    earlyRepaymentFee: 50,
    lateFee: 40,
    approvalSpeed: 'fast',
    minimumCreditScore: 620,
    minimumIncome: 30000,
    isPromoted: false,
    features: ['Lower credit score requirements', 'Quick approval', 'Minimal documentation'],
    documents: ['NRIC', 'Proof of income']
  },
  {
    id: 'offer-6',
    lenderId: 'lender-6',
    lenderName: 'EasyCredit',
    lenderLogo: '/lender-logos/easycredit.svg',
    amount: 18000,
    interestRate: 7.5,
    termMonths: 36,
    monthlyPayment: 557.89,
    totalRepayment: 20084.04,
    type: 'Debt Consolidation',
    processingFee: 180,
    earlyRepaymentFee: 100,
    lateFee: 50,
    approvalSpeed: 'fast',
    minimumCreditScore: 600,
    minimumIncome: 24000,
    isPromoted: true,
    features: ['Consolidate multiple debts', 'Reduce your monthly payments', 'Simple application process'],
    documents: ['NRIC', 'Latest payslip', 'Existing loan statements']
  }
];

// Mock bundled offers data
const mockBundledOffers: BundledOffer[] = [
  {
    id: 'bundle-1',
    name: 'Premium Bundle',
    description: 'Combination of our most premium lenders with the best rates and terms',
    offers: [mockLoanOffers[0], mockLoanOffers[3]],
    totalAmount: 50000,
    averageInterestRate: 4.65,
    averageTermMonths: 48,
    totalMonthlyPayment: 1158.83,
    totalRepayment: 55623.84,
    savingsAmount: 1200,
    savingsPercentage: 2.11
  },
  {
    id: 'bundle-2',
    name: 'Quick Access Bundle',
    description: 'Fast approval and disbursement from our efficiency-focused lenders',
    offers: [mockLoanOffers[2], mockLoanOffers[4]],
    totalAmount: 37000,
    averageInterestRate: 5.65,
    averageTermMonths: 36,
    totalMonthlyPayment: 1110.54,
    totalRepayment: 39979.44,
    savingsAmount: 800,
    savingsPercentage: 1.96
  }
];

// Service functions
export async function getAvailableLoanOffers(amount: number): Promise<LoanOffer[]> {
  // In a real app, this would filter from an API based on eligibility, amount, etc.
  return mockLoanOffers.filter(offer => offer.amount <= amount * 1.5);
}

export async function getBundledOffers(amount: number): Promise<BundledOffer[]> {
  // In a real app, this would create custom bundles based on the user's needs
  return mockBundledOffers.filter(bundle => bundle.totalAmount <= amount * 2);
}

export async function getLoanOfferById(id: string): Promise<LoanOffer | null> {
  return mockLoanOffers.find(offer => offer.id === id) || null;
}

export async function getBundleById(id: string): Promise<BundledOffer | null> {
  return mockBundledOffers.find(bundle => bundle.id === id) || null;
} 