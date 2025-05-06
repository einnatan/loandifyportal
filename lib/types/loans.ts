export interface Lender {
  id: string;
  name: string;
  logo: string;
  description: string;
  rating: number;
  reviewCount: number;
  website: string;
  supportEmail: string;
  supportPhone: string;
}

export interface LoanOffer {
  id: string;
  lenderId: string;
  lenderName: string;
  lenderLogo: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalRepayment: number;
  type: string;
  processingFee: number;
  earlyRepaymentFee: number;
  lateFee: number;
  approvalSpeed: 'instant' | 'fast' | 'standard';
  minimumCreditScore?: number;
  minimumIncome?: number;
  isPromoted: boolean;
  features: string[];
  documents: string[];
}

export interface BundledOffer {
  id: string;
  name: string;
  description: string;
  offers: LoanOffer[];
  totalAmount: number;
  averageInterestRate: number;
  averageTermMonths: number;
  totalMonthlyPayment: number;
  totalRepayment: number;
  savingsAmount: number;
  savingsPercentage: number;
}

export interface LoanApplication {
  id: string;
  userId: string;
  desiredAmount: number;
  desiredTermMonths: number;
  purpose: string;
  status: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected';
  selectedOfferId?: string;
  submittedAt?: string;
  loanOffers?: LoanOffer[];
  bundledOffers?: BundledOffer[];
  documents: {
    id: string;
    type: string;
    name: string;
    url: string;
    uploadedAt: string;
    status: 'pending' | 'verified' | 'rejected';
  }[];
  additionalInformation?: Record<string, string>;
}

export interface ActiveLoan {
  id: string;
  loanApplicationId: string;
  lenderId: string;
  lenderName: string;
  lenderLogo: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  remainingAmount: number;
  remainingPayments: number;
  nextPaymentDue: string;
  nextPaymentAmount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'paid' | 'overdue' | 'defaulted';
  paymentHistory: {
    date: string;
    amount: number;
    status: 'paid' | 'overdue' | 'missed';
  }[];
} 