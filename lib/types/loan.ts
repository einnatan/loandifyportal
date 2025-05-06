export interface LoanOffer {
  id: string;
  bankId: string;
  bankName: string;
  bankLogo: string;
  loanType: 'personal' | 'business' | 'education' | 'home' | 'auto' | 'debt-consolidation';
  name: string;
  description: string;
  amount: number;
  interestRate: number;
  effectiveInterestRate: number;
  term: number; // in months
  monthlyPayment: number;
  processingFee: number;
  earlyRepaymentFee: number;
  minimumCreditScore: number;
  minimumIncome: number;
  minimumEmploymentDuration: number; // in months
  features: string[];
  requirements: string[];
  isPromoted: boolean;
  isLimitedTime: boolean;
  promotionEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BundledLoanOffer {
  id: string;
  name: string;
  offers: LoanOffer[];
  totalAmount: number;
  averageInterestRate: number;
  totalMonthlyPayment: number;
  term: number; // in months
  savings: number; // savings compared to individual loans
  createdAt: string;
  updatedAt: string;
}

export interface LoanApplication {
  id: string;
  userId: string;
  offers: string[]; // LoanOffer IDs
  selectedOfferId?: string;
  status: 'draft' | 'submitted' | 'processing' | 'approved' | 'rejected' | 'cancelled';
  submittedAt?: string;
  decidedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActiveLoan {
  id: string;
  userId: string;
  offerId: string;
  bankId: string;
  bankName: string;
  amount: number;
  outstandingAmount: number;
  interestRate: number;
  term: number;
  remainingTerm: number;
  monthlyPayment: number;
  nextPaymentDate: string;
  nextPaymentAmount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'paid' | 'defaulted';
  payments: {
    id: string;
    date: string;
    amount: number;
    status: 'scheduled' | 'paid' | 'missed' | 'partial';
  }[];
  createdAt: string;
  updatedAt: string;
} 